const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

// Get all jobs for Company
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.company }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new Job posting
exports.createJob = async (req, res) => {
  try {
    const { title, department, location, description, requiredSkills, minExperienceYears } = req.body;
    
    // Skill string to array if comma separated
    let skillList = requiredSkills;
    if (typeof requiredSkills === 'string') {
      skillList = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      company: req.user.company,
      title,
      department: department || 'Engineering',
      location: location || 'Remote',
      description,
      requiredSkills: skillList || [],
      minExperienceYears: minExperienceYears || 0
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user.company });
    if (!job) return res.status(404).json({ message: 'Job posting not found' });

    if (req.body.requiredSkills && typeof req.body.requiredSkills === 'string') {
      req.body.requiredSkills = req.body.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.user.company });
    if (!job) return res.status(404).json({ message: 'Job posting not found' });
    res.json({ message: 'Job posting removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public endpoint for Widget/Candidates to fetch open jobs by API Key / Company Slug / Company Name / Company ID / Job ID
exports.getPublicJobsByApiKey = async (req, res) => {
  try {
    const rawQuery = req.params.apiKey ? req.params.apiKey.trim() : '';
    const jobIdQuery = req.query.jobId ? req.query.jobId.trim() : '';
    const Company = require('../models/Company');
    const mongoose = require('mongoose');
    let company = null;

    // 1. Prioritize finding parent company by target jobId if provided
    const targetJobId = jobIdQuery || (mongoose.Types.ObjectId.isValid(rawQuery) ? rawQuery : null);
    if (targetJobId && mongoose.Types.ObjectId.isValid(targetJobId)) {
      const jobMatch = await Job.findById(targetJobId).populate('company');
      if (jobMatch && jobMatch.company) {
        company = jobMatch.company;
      }
    }

    if (!company && rawQuery) {
      // 2. Mongo ObjectId if valid
      if (mongoose.Types.ObjectId.isValid(rawQuery)) {
        company = await Company.findById(rawQuery);
      }

      // 3. Exact apiKey match
      if (!company) {
        company = await Company.findOne({ apiKey: { $regex: new RegExp(`^${rawQuery}$`, 'i') } });
      }

      // 4. Slug match
      if (!company) {
        company = await Company.findOne({ slug: { $regex: new RegExp(`^${rawQuery}$`, 'i') } });
      }

      // 5. Substring match on company name (e.g. "fast" matches "Fast", "Fast's Organization", "Fast Tech")
      if (!company) {
        company = await Company.findOne({ name: { $regex: new RegExp(rawQuery, 'i') } });
      }

      // 6. Substring match on email
      if (!company) {
        company = await Company.findOne({ email: { $regex: new RegExp(rawQuery, 'i') } });
      }
    }

    // 7. Check if any job title or company matches query string
    if (!company && rawQuery) {
      const anyJobMatch = await Job.findOne({ 
        $or: [
          { title: { $regex: new RegExp(rawQuery, 'i') } },
          { description: { $regex: new RegExp(rawQuery, 'i') } }
        ]
      }).populate('company');
      if (anyJobMatch && anyJobMatch.company) {
        company = anyJobMatch.company;
      }
    }

    // 8. Preference Fallback: If query is non-nexus, pick latest custom registered company
    if (!company && rawQuery && rawQuery.toLowerCase() !== 'nexus') {
      company = await Company.findOne({ name: { $not: /nexus/i } }).sort({ createdAt: -1 });
    }

    // Ultimate Fallback: Default to active company
    if (!company) {
      company = await Company.findOne({ status: 'active' });
    }

    if (!company) {
      return res.status(404).json({ message: 'Company workspace not found' });
    }

    // Auto-save slug on company if missing
    if (!company.slug && company.name) {
      company.slug = company.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      await company.save().catch(() => {});
    }

    const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });

    res.json({
      companyName: company.name,
      companyId: company._id,
      companySlug: company.slug || company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
