const Company = require('../models/Company');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const AuditLog = require('../models/AuditLog');

// Get Super Admin System Dashboard Metrics
exports.getSystemStats = async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();
    const activeCompanies = await Company.countDocuments({ status: 'active' });
    const inactiveCompanies = await Company.countDocuments({ status: 'inactive' });

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalScreenedResumes = await Candidate.countDocuments();
    const totalInterviewsScheduled = await Candidate.countDocuments({ interviewStatus: 'Scheduled' });

    const plans = await SubscriptionPlan.find();
    
    // Revenue calculations (mocked/calculated based on active company plans)
    const activeSubscriptions = await Company.find({ 'currentSubscription.status': 'active' }).populate('currentSubscription.planId');
    let totalMonthlyRevenue = 0;
    activeSubscriptions.forEach(c => {
      if (c.currentSubscription && c.currentSubscription.planId) {
        totalMonthlyRevenue += c.currentSubscription.planId.price || 0;
      } else {
        totalMonthlyRevenue += 99; // Default estimated average monthly revenue per account
      }
    });

    const recentAuditLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email');

    res.json({
      metrics: {
        totalCompanies,
        activeCompanies,
        inactiveCompanies,
        totalUsers,
        totalJobs,
        totalScreenedResumes,
        totalInterviewsScheduled,
        totalMonthlyRevenue
      },
      plans,
      recentAuditLogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Companies (List all companies)
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('currentSubscription.planId').sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Company Account Status (Enable/Disable)
exports.toggleCompanyStatus = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.status = company.status === 'active' ? 'inactive' : 'active';
    await company.save();

    await AuditLog.create({
      user: req.user._id,
      company: company._id,
      action: 'TOGGLE_COMPANY_STATUS',
      details: `Changed status of company ${company.name} to ${company.status}`
    });

    res.json({ message: `Company status updated to ${company.status}`, company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Subscription Plans (Get, Create, Update, Delete)
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, billingCycle, monthlyResumeLimit, features } = req.body;
    const plan = await SubscriptionPlan.create({
      name,
      price,
      billingCycle: billingCycle || 'monthly',
      monthlyResumeLimit,
      features: features || []
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_SUBSCRIPTION_PLAN',
      details: `Created new plan: ${name} ($${price}/mo)`
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Company Subscription Plan
exports.assignPlanToCompany = async (req, res) => {
  try {
    const { companyId, planId } = req.body;
    const company = await Company.findById(companyId);
    const plan = await SubscriptionPlan.findById(planId);

    if (!company || !plan) {
      return res.status(404).json({ message: 'Company or Plan not found' });
    }

    company.currentSubscription = {
      planId: plan._id,
      planName: plan.name,
      status: 'active',
      monthlyLimit: plan.monthlyResumeLimit,
      startDate: new Date()
    };
    await company.save();

    res.json({ message: 'Plan updated successfully', company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Candidates grouped Company-Wise for Super Admin Portal
exports.getCompanyWiseCandidates = async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 });
    const candidates = await Candidate.find({})
      .populate('job', 'title department')
      .populate('company', 'name email apiKey')
      .sort({ appliedAt: -1 });

    const grouped = companies.map(comp => {
      const compCands = candidates.filter(c => {
        if (!c.company) return false;
        return c.company._id?.toString() === comp._id.toString() || c.company?.name === comp.name;
      });

      return {
        companyId: comp._id,
        companyName: comp.name,
        companyEmail: comp.email,
        apiKey: comp.apiKey,
        status: comp.status,
        subscriptionPlan: comp.currentSubscription?.planName || 'Starter',
        totalCandidates: compCands.length,
        candidates: compCands
      };
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching company-wise candidates:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Candidate user accounts, total logins, and application details for Super Admin
exports.getCandidateUserLogins = async (req, res) => {
  try {
    let candidateUsers = await User.find({ role: 'candidate' }).select('-password').sort({ lastLoginAt: -1 });
    const allCandidates = await Candidate.find({})
      .populate('job', 'title department')
      .populate('company', 'name email')
      .sort({ appliedAt: -1 });

    const candidateEmailsFromApplications = [...new Set(allCandidates.map(c => c.email.toLowerCase()))];
    const existingUserEmails = new Set(candidateUsers.map(u => u.email.toLowerCase()));

    const candidateDetailsList = [];

    for (const u of candidateUsers) {
      const userApps = allCandidates.filter(c => c.email.toLowerCase() === u.email.toLowerCase());
      candidateDetailsList.push({
        _id: u._id,
        name: u.name,
        email: u.email,
        loginCount: u.loginCount || 1,
        lastLoginAt: u.lastLoginAt || u.createdAt,
        registeredAt: u.createdAt,
        accountStatus: 'Active Candidate',
        totalAppliedJobs: userApps.length,
        applications: userApps.map(a => ({
          jobTitle: a.job ? a.job.title : 'General Position',
          companyName: a.company ? a.company.name : 'Company Workspace',
          matchScore: a.matchScore,
          interviewStatus: a.interviewStatus,
          appliedAt: a.appliedAt
        }))
      });
    }

    for (const email of candidateEmailsFromApplications) {
      if (!existingUserEmails.has(email)) {
        const userApps = allCandidates.filter(c => c.email.toLowerCase() === email);
        const firstApp = userApps[0];
        candidateDetailsList.push({
          _id: firstApp._id,
          name: firstApp.name || 'Candidate Student',
          email: email,
          loginCount: firstApp.loginCount || 1,
          lastLoginAt: firstApp.lastLoginAt || firstApp.appliedAt,
          registeredAt: firstApp.appliedAt,
          accountStatus: 'Direct Applicant',
          totalAppliedJobs: userApps.length,
          applications: userApps.map(a => ({
            jobTitle: a.job ? a.job.title : 'General Position',
            companyName: a.company ? a.company.name : 'Company Workspace',
            matchScore: a.matchScore,
            interviewStatus: a.interviewStatus,
            appliedAt: a.appliedAt
          }))
        });
      }
    }

    const totalCandidateUsers = candidateDetailsList.length;
    const totalCandidateLogins = candidateDetailsList.reduce((sum, item) => sum + (item.loginCount || 1), 0);

    res.json({
      totalCandidateUsers,
      totalCandidateLogins,
      candidates: candidateDetailsList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
