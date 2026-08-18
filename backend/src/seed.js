const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const SubscriptionPlan = require('./models/SubscriptionPlan');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
const AuditLog = require('./models/AuditLog');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_screening_db';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB for Seeding...');

    // Clear existing
    await User.deleteMany({});
    await Company.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await AuditLog.deleteMany({});

    // 1. Subscription Plans
    const starterPlan = await SubscriptionPlan.create({
      name: 'Starter Plan',
      price: 49,
      billingCycle: 'monthly',
      monthlyResumeLimit: 100,
      features: ['Up to 100 Resumes/mo', 'AI ATS Scoring', 'Basic Candidate Filtering', 'Email Notifications']
    });

    const proPlan = await SubscriptionPlan.create({
      name: 'Pro Enterprise',
      price: 199,
      billingCycle: 'monthly',
      monthlyResumeLimit: 1000,
      features: ['1000 Resumes/mo', 'Advanced AI Skill Gap Analysis', 'Custom Widget Embedding', 'Interview Scheduling', 'Dedicated Support']
    });

    // 2. Super Admin User
    const superAdmin = await User.create({
      name: 'Global Super Admin',
      email: 'admin@platform.com',
      password: 'adminpassword123',
      role: 'super_admin'
    });

    // 3. Demo Companies
    const companyA = await Company.create({
      name: 'TechCorp Solutions',
      email: 'hr@techcorp.com',
      website: 'https://techcorp.example.com',
      apiKey: 'sk_live_techcorp_998877665544332211',
      status: 'active',
      currentSubscription: {
        planId: proPlan._id,
        planName: proPlan.name,
        resumesScreenedThisMonth: 34,
        monthlyLimit: proPlan.monthlyResumeLimit
      }
    });

    const companyB = await Company.create({
      name: 'Innovate AI Labs',
      email: 'careers@innovateai.example.com',
      website: 'https://innovateai.example.com',
      apiKey: 'sk_live_innovateai_112233445566778899',
      status: 'active',
      currentSubscription: {
        planId: starterPlan._id,
        planName: starterPlan.name,
        resumesScreenedThisMonth: 12,
        monthlyLimit: starterPlan.monthlyResumeLimit
      }
    });

    const companyNexus = await Company.create({
      name: 'Nexus Software Systems',
      email: 'admin@nexus.com',
      website: 'https://nexus.example.com',
      apiKey: 'sk_live_nexus_998877665544332211',
      status: 'active',
      currentSubscription: {
        planId: proPlan._id,
        planName: proPlan.name,
        resumesScreenedThisMonth: 45,
        monthlyLimit: proPlan.monthlyResumeLimit
      }
    });

    // 4. Tenant Company Admin Users
    const companyAdminA = await User.create({
      name: 'Alex Johnson (HR Director)',
      email: 'admin@techcorp.com',
      password: 'companypassword123',
      role: 'company_admin',
      company: companyA._id
    });

    const companyAdminB = await User.create({
      name: 'Elena Rostova (Hiring Lead)',
      email: 'admin@innovateai.com',
      password: 'companypassword123',
      role: 'company_admin',
      company: companyB._id
    });

    await User.create({
      name: 'Nexus Admin',
      email: 'Next@gmail.com',
      password: '123456',
      role: 'company_admin',
      company: companyNexus._id
    });

    // 5. Jobs
    const job1 = await Job.create({
      company: companyA._id,
      title: 'Senior MERN Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      description: 'We are seeking an experienced Full Stack Engineer with expertise in React, Node.js, Express, MongoDB, TypeScript, and AWS cloud architecture.',
      requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'AWS'],
      minExperienceYears: 4,
      status: 'active',
      applicantCount: 3
    });

    const job2 = await Job.create({
      company: companyA._id,
      title: 'AI / Machine Learning Engineer',
      department: 'AI Research',
      location: 'New York, NY',
      description: 'Looking for an AI engineer to develop LLM prompt chains, Python NLP modules, PyTorch models, and RESTful APIs.',
      requiredSkills: ['Python', 'PyTorch', 'NLP', 'TensorFlow', 'REST API', 'Docker'],
      minExperienceYears: 3,
      status: 'active',
      applicantCount: 2
    });

    async function generateValidPdfBase64(name, text) {
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
        const base64 = Buffer.from(pdfBytes).toString('base64');
        return `data:application/pdf;base64,${base64}`;
      } catch (err) {
        console.error('PDF generation error:', err);
        return '';
      }
    }

    function generateValidDocxBase64(name, text) {
      const rtfContent = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\viewkind4\\uc1\\pard\\f0\\fs28\\b ${name} - RESUME\\b0\\fs20\\par\\par ${(text || '').replace(/\n/g, '\\par\n')}}`;
      return `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${Buffer.from(rtfContent, 'utf-8').toString('base64')}`;
    }

    // 6. Candidates for Nexus Company
    const davidText = `DAVID MILLER
Senior Full Stack Engineer | david.m@example.com | +1 555-0192 | New York, NY

PROFESSIONAL SUMMARY:
Experienced Full Stack Software Engineer with 5+ years of expertise designing and scaling distributed web applications. Specializing in JavaScript, React.js, Node.js, Express, MongoDB, TypeScript, and microservice architectures.`;

    await Candidate.create({
      company: companyNexus._id,
      job: job1._id,
      name: 'David Miller',
      email: 'david.m@example.com',
      phone: '+1 555-0192',
      resumeOriginalName: 'David_Miller_Resume.pdf',
      resumeMimeType: 'application/pdf',
      resumeData: await generateValidPdfBase64('David Miller', davidText),
      parsedText: davidText,
      matchScore: 92,
      atsCompatibilityScore: 95,
      matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
      missingSkills: ['AWS'],
      strengths: ['Exceptional alignment with core MERN stack', 'Clean ATS resume formatting', '5+ years experience'],
      weaknesses: ['Missing AWS cloud deployment certification'],
      suggestions: ['Add AWS Certified Developer badge if applicable', 'Detail microservice deployment metrics'],
      aiSummary: 'David is a top-tier candidate with comprehensive MERN stack mastery, clean code architecture, and 5+ years of full-stack engineering experience.',
      interviewStatus: 'Scheduled',
      interviewDetails: {
        scheduledDate: new Date(Date.now() + 86400000 * 2),
        interviewerName: 'Sarah Connor',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Top tier candidate with impressive open-source projects.'
      }
    });

    const elenaText = `ELENA ROSTOVA
Frontend React Developer | elena.r@example.com | +1 555-0144

SUMMARY:
Passionate Frontend Software Engineer with 3+ years experience building interactive web applications with React.js, JavaScript, and Node.js. Focused on responsive UI design and user experience optimization.`;

    await Candidate.create({
      company: companyNexus._id,
      job: job1._id,
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      phone: '+1 555-0144',
      resumeOriginalName: 'Elena_Rostova_Resume.docx',
      resumeMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      resumeData: generateValidDocxBase64('Elena Rostova', elenaText),
      parsedText: elenaText,
      matchScore: 78,
      atsCompatibilityScore: 88,
      matchingSkills: ['React', 'Node.js', 'MongoDB'],
      missingSkills: ['TypeScript', 'Express', 'AWS'],
      strengths: ['Strong React frontend background with state management proficiency'],
      weaknesses: ['Lacks TypeScript and cloud infrastructure experience'],
      suggestions: ['Highlight experience with typed JavaScript or TypeScript migration projects'],
      aiSummary: 'Elena shows solid React frontend capabilities but lacks TypeScript and backend cloud architecture experience required for senior backend scope.',
      interviewStatus: 'Screened'
    });

    const marcusText = `MARCUS VANCE
AI / Machine Learning Engineer | marcus.v@example.com | +1 555-0188

SUMMARY:
AI Researcher and Machine Learning Engineer specializing in Natural Language Processing (NLP), PyTorch models, and RESTful API deployment. 4+ years building intelligent algorithms and LLM fine-tuning pipelines.`;

    await Candidate.create({
      company: companyNexus._id,
      job: job2._id,
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      phone: '+1 555-0188',
      resumeOriginalName: 'Marcus_Vance_AI_Engineer.pdf',
      resumeMimeType: 'application/pdf',
      resumeData: await generateValidPdfBase64('Marcus Vance', marcusText),
      parsedText: marcusText,
      matchScore: 89,
      atsCompatibilityScore: 90,
      matchingSkills: ['Python', 'PyTorch', 'NLP', 'REST API', 'Docker'],
      missingSkills: ['TensorFlow'],
      strengths: ['Published NLP papers & strong Python data science background'],
      weaknesses: ['Minor skill gap in TensorFlow (uses PyTorch primarily)'],
      suggestions: ['Mention transferability of PyTorch neural models to TensorFlow serving'],
      aiSummary: 'Marcus is an exceptional AI/ML candidate with strong PyTorch, NLP, and model deployment experience.',
      interviewStatus: 'Selected'
    });

    const athahdeepText = `ATHAHDEEP RIZVI
Full Stack Engineer | athahdeep@example.com | +1 555-0192

SUMMARY:
Computer Science graduate with hands-on experience in frontend and full stack development. Experienced in building responsive web applications using React.js, Node.js, Express, MongoDB, Tailwind CSS, and JavaScript.`;

    await Candidate.create({
      company: companyNexus._id,
      job: job1._id,
      name: 'Athahdeep',
      email: 'athahdeep@example.com',
      phone: '+1 555-0192',
      resumeOriginalName: 'ATAHDEEP_RESUME.pdf',
      resumeMimeType: 'application/pdf',
      resumeData: await generateValidPdfBase64('Athahdeep', athahdeepText),
      parsedText: athahdeepText,
      matchScore: 88,
      atsCompatibilityScore: 92,
      matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
      missingSkills: ['AWS'],
      strengths: ['Strong full stack web development background', 'Clean modular architecture'],
      weaknesses: ['AWS cloud deployment'],
      suggestions: ['Add AWS certification'],
      aiSummary: 'Athahdeep is a talented Full Stack engineer with clean MERN stack proficiency.',
      interviewStatus: 'Screened'
    });

    // Also copy to companyA so all companies have candidate applications
    await Candidate.create({
      company: companyA._id,
      job: job1._id,
      name: 'David Miller',
      email: 'david.m@example.com',
      phone: '+1 555-0192',
      resumeOriginalName: 'David_Miller_Resume.pdf',
      resumeMimeType: 'application/pdf',
      resumeData: await generateValidPdfBase64('David Miller', davidText),
      parsedText: davidText,
      matchScore: 92,
      atsCompatibilityScore: 95,
      matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
      missingSkills: ['AWS'],
      strengths: ['Exceptional alignment with core MERN stack'],
      aiSummary: 'David is a top-tier candidate.',
      interviewStatus: 'Scheduled'
    });

    // 7. Audit Log
    await AuditLog.create({
      user: superAdmin._id,
      action: 'SYSTEM_SEED',
      details: 'Populated initial system seed data for testing and demonstration.'
    });

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seedData();
