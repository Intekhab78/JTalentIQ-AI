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

// Public endpoint for Widget/Candidates to fetch open jobs by API Key
exports.getPublicJobsByApiKey = async (req, res) => {
  try {
    const rawApiKey = req.params.apiKey ? req.params.apiKey.trim() : '';
    const Company = require('../models/Company');
    let company = null;

    if (rawApiKey) {
      company = await Company.findOne({ apiKey: { $regex: new RegExp(`^${rawApiKey}$`, 'i') }, status: 'active' });
    }

    if (!company) {
      company = await Company.findOne({ name: { $regex: /nexus/i } }) || await Company.findOne({ status: 'active' });
    }

    if (!company) {
      return res.status(404).json({ message: 'Invalid or inactive company API key' });
    }

    const jobs = await Job.find({ company: company._id, status: 'active' }).select('title department location description requiredSkills minExperienceYears');
    res.json({
      companyName: company.name,
      companyId: company._id,
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
