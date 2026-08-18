const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' },
  resumeData: { type: String, default: '' },
  resumeMimeType: { type: String, default: 'application/pdf' },
  parsedText: { type: String, default: '' },
  matchScore: { type: Number, default: 0 },
  atsCompatibilityScore: { type: Number, default: 0 },
  missingSkills: [{ type: String }],
  matchingSkills: [{ type: String }],
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  aiSummary: { type: String, default: '' },
  interviewStatus: { 
    type: String, 
    enum: ['New', 'Screened', 'Scheduled', 'Completed', 'Selected', 'Rejected'], 
    default: 'Screened' 
  },
  interviewDetails: {
    scheduledDate: { type: Date },
    interviewerName: { type: String },
    meetingLink: { type: String },
    notes: { type: String }
  },
  submissionSource: {
    type: String,
    enum: ['company_portal', 'embedded_widget', 'direct_website'],
    default: 'company_portal'
  },
  sourceUrl: { type: String, default: '' },
  lastLoginAt: { type: Date, default: Date.now },
  deviceInfo: { type: String, default: 'Web Browser' },
  appliedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Candidate', candidateSchema);

