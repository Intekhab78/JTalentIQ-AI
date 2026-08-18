const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  location: { type: String, default: 'Remote' },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  minExperienceYears: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  applicantCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
