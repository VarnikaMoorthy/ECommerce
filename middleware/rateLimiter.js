const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per IP
  message: { error: 'Too many login attempts. Try again later.' },
});

module.exports = { loginLimiter };
