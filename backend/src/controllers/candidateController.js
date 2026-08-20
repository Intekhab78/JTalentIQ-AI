const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');
const { analyzeResume } = require('../services/aiScreeningService');
const { sendInterviewEmail } = require('../services/emailService');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');


// Helper to generate a valid PDF binary buffer from candidate text
async function generatePdfFromText(name, text) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(`${(name || 'Candidate').toUpperCase()} - CURRICULUM VITAE`, {
      x: 50,
      y: 740,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.2),
    });

    const lines = (text || '').split('\n');
    let currentY = 710;

    for (const line of lines) {
      if (currentY < 50) break;
      const cleanLine = line.trim();
      if (!cleanLine) {
        currentY -= 12;
        continue;
      }
      page.drawText(cleanLine.substring(0, 90), {
        x: 50,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.3),
      });
      currentY -= 16;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error('Error generating PDF from text:', err);
    return null;
  }
}

// Public / Candidate AI Resume Screening Endpoint
exports.screenAndSubmitResume = async (req, res) => {
  try {
    const { name, email, phone, jobId, apiKey, resumeText, submissionSource, sourceUrl } = req.body;

    let targetJob = null;
    let targetCompany = null;

    // 1. Try finding job if jobId is a valid Mongoose ObjectId
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      targetJob = await Job.findById(jobId).populate('company');
      if (targetJob) targetCompany = targetJob.company;
    }

    // 2. If targetCompany not found by job, search by API Key (case-insensitive)
    if (!targetCompany && apiKey) {
      targetCompany = await Company.findOne({ apiKey: { $regex: new RegExp(`^${apiKey.trim()}$`, 'i') } });
    }

    // 3. Fallback: Find company by matching name or fallback to Nexus / active company
    if (!targetCompany) {
      targetCompany = await Company.findOne({ name: { $regex: /nexus/i } }) || await Company.findOne({ status: 'active' });
    }

    if (!targetCompany) {
      return res.status(400).json({ message: 'Invalid Job ID or Company API Key provided' });
    }

    // Determine final submission source
    let finalSource = submissionSource;
    if (!finalSource) {
      if (apiKey && apiKey.startsWith('sk_live_')) {
        finalSource = 'embedded_widget';
      } else {
        finalSource = 'company_portal';
      }
    }

    // 4. Ensure targetJob is populated or auto-link/create default job for targetCompany
    if (!targetJob) {
      targetJob = await Job.findOne({ company: targetCompany._id });
      if (!targetJob) {
        targetJob = await Job.create({
          company: targetCompany._id,
          title: 'Senior MERN Stack Engineer',
          department: 'Engineering',
          location: 'Remote',
          description: 'Full Stack Software Engineer with expertise in React, Node.js, Express, MongoDB, and TypeScript.',
          requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
          minExperienceYears: 3,
          status: 'active'
        });
      }
    }

    // Process file upload or plain text resume
    let fileBuffer = req.file ? req.file.buffer : (resumeText || 'Sample Developer Resume with React, Node, Express, MongoDB, JavaScript and Python experience.');

    let resumeData = '';
    let resumeMimeType = 'application/pdf';
    let resumeOriginalName = 'Resume.pdf';

    if (req.file) {
      const origName = req.file.originalname || 'Resume.pdf';
      const ext = origName.split('.').pop().toLowerCase();
      const isPdfHeader = req.file.buffer && req.file.buffer.toString('utf-8', 0, 4) === '%PDF';

      if (ext === 'pdf' || isPdfHeader) {
        resumeMimeType = 'application/pdf';
        resumeOriginalName = origName;
        resumeData = `data:application/pdf;base64,${req.file.buffer.toString('base64')}`;
      } else if (ext === 'docx' || ext === 'doc') {
        resumeMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        resumeOriginalName = origName;
        resumeData = `data:${resumeMimeType};base64,${req.file.buffer.toString('base64')}`;
      } else {
        resumeMimeType = req.file.mimetype || 'text/plain';
        resumeOriginalName = origName;
        resumeData = `data:${resumeMimeType};base64,${req.file.buffer.toString('base64')}`;
      }
    } else {
      const safeName = (name || 'Candidate').replace(/\s+/g, '_');
      resumeOriginalName = `${safeName}_Resume.pdf`;
      const generatedPdf = await generatePdfFromText(name, resumeText || 'Sample Developer Resume');

      if (generatedPdf) {
        resumeMimeType = 'application/pdf';
        resumeData = `data:application/pdf;base64,${generatedPdf.toString('base64')}`;
      } else {
        resumeMimeType = 'text/plain';
        resumeOriginalName = `${safeName}_Resume.txt`;
        resumeData = `data:text/plain;base64,${Buffer.from(resumeText || '', 'utf-8').toString('base64')}`;
      }
    }

    const jobDescription = targetJob ? targetJob.description : 'Full Stack Software Engineer skilled in React, Node, Express, MongoDB, REST APIs, Git, and Cloud deployments.';
    const targetSkills = (targetJob && targetJob.requiredSkills?.length > 0) ? targetJob.requiredSkills : ['React', 'Node.js', 'MongoDB', 'JavaScript'];

    // Run AI Screening Service
    const aiResult = await analyzeResume(fileBuffer, jobDescription, targetSkills);

    if (!resumeData) {
      const textContent = aiResult.parsedText || (typeof fileBuffer === 'string' ? fileBuffer : 'Sample Developer Resume');
      resumeData = `data:text/plain;base64,${Buffer.from(textContent, 'utf-8').toString('base64')}`;
    }

    // Save candidate application to MongoDB
    const candidate = await Candidate.create({
      company: targetCompany._id,
      job: targetJob ? targetJob._id : null,
      name: name || 'Candidate',
      email: email || 'candidate@example.com',
      phone: phone || '',
      resumeOriginalName,
      resumeData,
      resumeMimeType,
      parsedText: aiResult.parsedText,
      matchScore: aiResult.matchScore,
      atsCompatibilityScore: aiResult.atsCompatibilityScore,
      matchingSkills: aiResult.matchingSkills,
      missingSkills: aiResult.missingSkills,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      suggestions: aiResult.suggestions,
      aiSummary: aiResult.aiSummary || '',
      interviewStatus: 'Screened',
      submissionSource: finalSource,
      sourceUrl: sourceUrl || `http://localhost:5173/apply/${targetCompany.slug || targetCompany._id}`
    });


    // Update job applicant count
    if (targetJob) {
      targetJob.applicantCount += 1;
      await targetJob.save();
    }

    // Increment company monthly resume count
    await Company.findByIdAndUpdate(targetCompany._id, {
      $inc: { 'currentSubscription.resumesScreenedThisMonth': 1 }
    });

    try {
      await AuditLog.create({
        company: targetCompany._id,
        action: 'CANDIDATE_RESUME_SUBMITTED',
        details: `Candidate ${candidate.name} (${candidate.email}) submitted resume via ${finalSource}`
      });
    } catch (e) { }


    res.status(201).json({
      message: 'Resume analyzed and application submitted successfully',
      candidateId: candidate._id,
      analysis: {
        matchScore: candidate.matchScore,
        atsCompatibilityScore: candidate.atsCompatibilityScore,
        matchingSkills: candidate.matchingSkills,
        missingSkills: candidate.missingSkills,
        strengths: candidate.strengths,
        weaknesses: candidate.weaknesses,
        suggestions: candidate.suggestions,
        aiSummary: candidate.aiSummary
      }
    });
  } catch (error) {
    console.error('Error screening and submitting resume:', error);
    res.status(500).json({ message: error.message });
  }
};

// Company Admin: Get Candidates with filters, search, and sorting
exports.getCompanyCandidates = async (req, res) => {
  try {
    const { jobId, status, minScore, search } = req.query;

    let companyId = req.user?.company?._id || req.user?.company;

    if (!companyId) {
      const userDoc = await User.findById(req.user._id).populate('company');
      if (userDoc?.company) {
        companyId = userDoc.company._id;
      } else {
        const defaultCompany = await Company.findOne({ name: { $regex: /nexus/i } }) || await Company.findOne();
        if (defaultCompany) companyId = defaultCompany._id;
      }
    }

    const query = companyId ? { company: companyId } : {};

    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) query.job = jobId;
    if (status) query.interviewStatus = status;
    if (minScore) query.matchScore = { $gte: Number(minScore) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { matchingSkills: { $regex: search, $options: 'i' } }
      ];
    }

    const candidates = await Candidate.find(query)
      .populate('job', 'title department')
      .sort({ matchScore: -1, appliedAt: -1 });

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching company candidates:', error);
    res.status(500).json({ message: error.message });
  }
};

// Schedule Interview & Update Status
exports.updateInterviewStatus = async (req, res) => {
  try {
    const candidateId = req.params.id || req.body.candidateId;
    const { interviewStatus, scheduledDate, interviewerName, meetingLink, notes, sendEmail, candidateEmail, candidateName } = req.body;

    let candidate = null;

    // 1. Try finding by MongoDB ID if valid
    if (candidateId && mongoose.Types.ObjectId.isValid(candidateId)) {
      candidate = await Candidate.findOne({ _id: candidateId, company: req.user.company }).populate('job company');
    }

    // 2. Try finding by email if candidateId was mock string (e.g. 'cand_1')
    if (!candidate && (candidateEmail || req.body.email)) {
      const emailToSearch = candidateEmail || req.body.email;
      candidate = await Candidate.findOne({ email: emailToSearch, company: req.user.company }).populate('job company');
    }

    // 3. Fallback: If still not in DB, create record so scheduling & email dispatch work cleanly
    if (!candidate) {
      const defaultJob = await Job.findOne({ company: req.user.company }) || await Job.findOne();
      candidate = await Candidate.create({
        company: req.user.company,
        job: defaultJob ? defaultJob._id : undefined,
        name: candidateName || req.body.name || 'Candidate',
        email: candidateEmail || req.body.email || 'candidate@example.com',
        interviewStatus: interviewStatus || 'Scheduled',
        submissionSource: 'company_portal'
      });
      candidate = await Candidate.findById(candidate._id).populate('job company');
    }

    candidate.interviewStatus = interviewStatus || candidate.interviewStatus || 'Scheduled';
    
    if (scheduledDate || interviewerName || meetingLink || notes) {
      candidate.interviewDetails = {
        scheduledDate: scheduledDate ? new Date(scheduledDate) : (candidate.interviewDetails?.scheduledDate || new Date()),
        interviewerName: interviewerName || candidate.interviewDetails?.interviewerName || req.user?.name || 'Hiring Manager',
        meetingLink: meetingLink || candidate.interviewDetails?.meetingLink || '',
        notes: notes || candidate.interviewDetails?.notes || ''
      };
    }

    await candidate.save();

    let emailResult = { success: false, reason: 'Skipped' };
    if (sendEmail !== false && (candidate.interviewStatus === 'Scheduled' || scheduledDate || meetingLink)) {
      emailResult = await sendInterviewEmail({
        candidate,
        interviewDetails: candidate.interviewDetails,
        company: candidate.company || { name: 'Company Admin' },
        job: candidate.job
      });
    }

    res.json({
      message: `Interview status updated to ${candidate.interviewStatus}${emailResult.success ? ' & email invitation sent to ' + candidate.email : ''}`,
      candidate,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Re-screen candidate with real AI engine
exports.rescreenCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;
    let candidate = await Candidate.findById(candidateId).populate('job');
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate record not found' });
    }

    const job = candidate.job || await Job.findOne({ company: candidate.company });
    const jobDescription = job ? job.description : 'Full Stack Engineer role requiring React, Node, Express, MongoDB, and TypeScript.';
    const targetSkills = (job && job.requiredSkills?.length > 0) ? job.requiredSkills : ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'];

    let resumeContent = candidate.parsedText;
    if (!resumeContent || resumeContent.trim().length === 0) {
      resumeContent = `${candidate.name} resume. Skills: ${candidate.matchingSkills.join(', ')}. Full Stack Developer.`;
    }

    const aiResult = await analyzeResume(resumeContent, jobDescription, targetSkills);

    candidate.matchScore = aiResult.matchScore;
    candidate.atsCompatibilityScore = aiResult.atsCompatibilityScore;
    candidate.matchingSkills = aiResult.matchingSkills;
    candidate.missingSkills = aiResult.missingSkills;
    candidate.strengths = aiResult.strengths;
    candidate.weaknesses = aiResult.weaknesses;
    candidate.suggestions = aiResult.suggestions;
    candidate.aiSummary = aiResult.aiSummary;

    await candidate.save();

    res.json({
      message: 'Candidate re-evaluated with AI successfully',
      candidate
    });
  } catch (error) {
    console.error('Error re-screening candidate:', error);
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to stream original binary PDF resume file directly
exports.downloadCandidateResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const dispositionType = req.query.inline === 'true' ? 'inline' : 'attachment';

    if (candidate.resumeData && candidate.resumeData.startsWith('data:')) {
      const parts = candidate.resumeData.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : (candidate.resumeMimeType || 'application/pdf');
      const fileBuffer = Buffer.from(parts[1], 'base64');
      let fileName = candidate.resumeOriginalName || `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`;
      if (!fileName.toLowerCase().endsWith('.pdf') && mimeType === 'application/pdf') {
        fileName += '.pdf';
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `${dispositionType}; filename="${encodeURIComponent(fileName)}"`);
      return res.send(fileBuffer);
    }

    // Fallback if no binary base64 file exists: return formatted plain text with .txt extension
    const textContent = candidate.parsedText || `${candidate.name}\n\nEmail: ${candidate.email}\nPhone: ${candidate.phone}`;
    let fileName = candidate.resumeOriginalName || `${candidate.name.replace(/\s+/g, '_')}_Resume.txt`;
    if (fileName.toLowerCase().endsWith('.pdf')) {
      fileName = fileName.replace(/\.pdf$/i, '.txt');
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `${dispositionType}; filename="${encodeURIComponent(fileName)}"`);
    res.send(textContent);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export Candidates (JSON / Formatted Data for PDF/Excel export on Frontend)
exports.exportCandidatesData = async (req, res) => {
  try {
    const candidates = await Candidate.find({ company: req.user.company })
      .populate('job', 'title')
      .sort({ matchScore: -1 });

    const exportData = candidates.map(c => ({
      ID: c._id,
      Name: c.name,
      Email: c.email,
      JobTitle: c.job ? c.job.title : 'General',
      MatchScore: `${c.matchScore}%`,
      AtsScore: `${c.atsCompatibilityScore}%`,
      Status: c.interviewStatus,
      MatchingSkills: c.matchingSkills.join(', '),
      MissingSkills: c.missingSkills.join(', '),
      AppliedDate: new Date(c.appliedAt).toLocaleDateString()
    }));

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Applications for logged-in candidate/student
exports.getMyApplications = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(400).json({ message: 'User email not found' });

    const applications = await Candidate.find({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } })
      .populate('job', 'title department location description requiredSkills')
      .populate('company', 'name email website')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

