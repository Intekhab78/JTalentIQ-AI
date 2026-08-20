const express = require('express');
const router = express.Router();
const { 
  getSystemStats, 
  getAllCompanies, 
  toggleCompanyStatus, 
  getSubscriptionPlans, 
  createSubscriptionPlan, 
  updateSubscriptionPlan, 
  assignPlanToCompany,
  getCompanyWiseCandidates,
  getCandidateUserLogins
} = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('super_admin'));

router.get('/stats', getSystemStats);
router.get('/companies', getAllCompanies);
router.get('/company-candidates', getCompanyWiseCandidates);
router.get('/candidate-logins', getCandidateUserLogins);
router.put('/companies/:id/toggle', toggleCompanyStatus);
router.get('/plans', getSubscriptionPlans);
router.post('/plans', createSubscriptionPlan);
router.put('/plans/:id', updateSubscriptionPlan);
router.post('/assign-plan', assignPlanToCompany);

module.exports = router;
