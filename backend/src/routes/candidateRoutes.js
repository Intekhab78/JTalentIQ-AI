const express = require('express');
const router = express.Router();
const multer = require('multer');
const { screenAndSubmitResume, getCompanyCandidates, updateInterviewStatus, rescreenCandidate, exportCandidatesData, downloadCandidateResume, getMyApplications } = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Public Endpoint for Candidates/Widget
router.post('/screen-and-submit', upload.single('resume'), screenAndSubmitResume);

// Candidate protected route
router.get('/my-applications', protect, getMyApplications);

// Protected routes for Company Admins
router.use(protect);
router.use(authorize('company_admin', 'team_member'));

router.get('/', getCompanyCandidates);
router.get('/:id/download-resume', downloadCandidateResume);
router.post('/schedule-interview', updateInterviewStatus);
router.post('/:id/schedule', updateInterviewStatus);
router.put('/:id/status', updateInterviewStatus);
router.post('/:id/rescreen', rescreenCandidate);
router.get('/export', exportCandidatesData);

module.exports = router;
