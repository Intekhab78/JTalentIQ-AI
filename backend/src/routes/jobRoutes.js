const express = require('express');
const router = express.Router();
const { getCompanyJobs, createJob, updateJob, deleteJob, getPublicJobsByApiKey } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public route for Candidates / Widget
router.get('/public/:apiKey', getPublicJobsByApiKey);

// Protected routes for Company Admins
router.use(protect);
router.use(authorize('company_admin', 'team_member'));

router.get('/', getCompanyJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
