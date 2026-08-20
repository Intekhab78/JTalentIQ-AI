const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API - Updated 2026
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Resume Screening API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_screening_db';

// DB Connection & Server Launch
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Database');
  } catch (err) {
    if (MONGODB_URI.includes(':27017/')) {
      const tunnelUri = MONGODB_URI.replace(':27017/', ':27018/');
      try {
        console.log('⚠️ Failed on port 27017, trying local SSH tunnel port 27018...');
        await mongoose.connect(tunnelUri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to VPS MongoDB via SSH Tunnel (port 27018)!');
        return;
      } catch (tunnelErr) {
        console.warn('⚠️ MongoDB SSH Tunnel connection issue:', tunnelErr.message);
      }
    }
    console.warn('⚠️ MongoDB connection issue (Running in standalone API mode):', err.message);
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 AI Resume Screening Backend running on port ${PORT}`);
  });
});
