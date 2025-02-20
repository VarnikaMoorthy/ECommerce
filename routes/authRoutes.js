const express = require('express');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP
} = require('../controllers/authController'); // Ensure these exist in authController.js
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
