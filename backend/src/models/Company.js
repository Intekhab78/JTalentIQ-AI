const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  email: { type: String, required: true },
  website: { type: String, default: '' },
  apiKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  currentSubscription: {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    planName: { type: String, default: 'Starter Free' },
    status: { type: String, enum: ['active', 'expired', 'pending'], default: 'active' },
    resumesScreenedThisMonth: { type: Number, default: 0 },
    monthlyLimit: { type: Number, default: 100 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Company', companySchema);
