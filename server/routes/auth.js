import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { ipBlocker } from '../middleware/ipBlocker.js';
import { refreshTokenMiddleware } from '../middleware/refreshToken.js';
import { auth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register endpoint
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('name').trim().notEmpty()
  ],
  validateRequest,
  authController.register
);

// Login endpoint
router.post(
  '/login',
  ipBlocker,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    body('twoFactorCode').optional().isLength({ min: 6, max: 6 })
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

export default router;