const Company = require('../models/Company');
const User = require('../models/User');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const crypto = require('crypto');

// Get Company Admin Dashboard Overview
exports.getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.user.company;
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company record not found' });
    }

    if (!company.slug && company.name) {
      company.slug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await company.save();
    }


    const totalJobs = await Job.countDocuments({ company: companyId });
    const activeJobs = await Job.countDocuments({ company: companyId, status: 'active' });
    const totalCandidates = await Candidate.countDocuments({ company: companyId });
    const scheduledInterviews = await Candidate.countDocuments({ company: companyId, interviewStatus: 'Scheduled' });
    const selectedCandidates = await Candidate.countDocuments({ company: companyId, interviewStatus: 'Selected' });

    // Calculate Average Match Score
    const candidateScores = await Candidate.find({ company: companyId }).select('matchScore');
    let avgMatchScore = 0;
    if (candidateScores.length > 0) {
      const sum = candidateScores.reduce((acc, curr) => acc + (curr.matchScore || 0), 0);
      avgMatchScore = Math.round(sum / candidateScores.length);
    }

    const recentCandidates = await Candidate.find({ company: companyId })
      .populate('job', 'title')
      .sort({ appliedAt: -1 })
      .limit(6);

    res.json({
      company,
      metrics: {
        totalJobs,
        activeJobs,
        totalCandidates,
        scheduledInterviews,
        selectedCandidates,
        avgMatchScore,
        resumesScreenedThisMonth: company.currentSubscription.resumesScreenedThisMonth,
        monthlyLimit: company.currentSubscription.monthlyLimit
      },
      recentCandidates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Regenerate API Key
exports.regenerateApiKey = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.apiKey = 'sk_live_' + crypto.randomBytes(16).toString('hex');
    await company.save();

    res.json({ apiKey: company.apiKey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get & Add Team Members
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await User.find({ company: req.user.company }).select('-password');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const member = await User.create({
      name,
      email,
      password,
      role: role || 'team_member',
      company: req.user.company
    });

    res.status(201).json({
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
