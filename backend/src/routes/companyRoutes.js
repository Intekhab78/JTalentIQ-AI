const express = require('express');
const router = express.Router();
const { getCompanyDashboard, regenerateApiKey, getTeamMembers, addTeamMember } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('company_admin', 'team_member'));

router.get('/dashboard', getCompanyDashboard);
router.post('/api-key/regenerate', regenerateApiKey);
router.get('/team', getTeamMembers);
router.post('/team', addTeamMember);

module.exports = router;
