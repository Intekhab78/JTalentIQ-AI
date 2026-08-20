const express = require('express');
const router = express.Router();
const { registerCompany, login, getMe, registerCandidate, loginCandidate } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerCompany);
router.post('/login', login);
router.post('/candidate/register', registerCandidate);
router.post('/candidate/login', loginCandidate);
router.get('/me', protect, getMe);

module.exports = router;
