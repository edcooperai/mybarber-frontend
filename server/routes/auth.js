import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { ipBlocker } from '../middleware/ipBlocker.js';
import { refreshTokenMiddleware } from '../middleware/refreshToken.js';
import { auth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import rateLimit from 'express-rate-limit'; // Add rate limiting

const router = express.Router();

// Rate limiter for login and register
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: {
    error: 'Too many login attempts, please try again later.',
  },
});

// Register endpoint
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('name').trim().notEmpty().withMessage('Name is required')
  ],
  validateRequest,
  authController.register
);

// Login endpoint with rate limiting and improved error handling
router.post(
  '/login',
  ipBlocker,  // Ensure this middleware is set up correctly in your app
  loginLimiter, // Apply rate limiting here
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    body('twoFactorCode').optional().isLength({ min: 6, max: 6 }).withMessage('Invalid 2FA code')
  ],
  validateRequest,
  authController.login
);

// Refresh token endpoint
router.post('/refresh-token', refreshTokenMiddleware);

// 2FA endpoints (all require authentication)
router.post('/2fa/setup', auth, authController.setup2FA);
router.post('/2fa/verify', auth, authController.verify2FA);
router.post('/2fa/disable', auth, authController.disable2FA);

// Generic error handler for invalid routes
router.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

export default router;
