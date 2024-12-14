import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { auth } from '../middleware/auth.js';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get settings
router.get('/', settingsController.getSettings);

// Update settings
router.put(
  '/',
  [
    body('businessName').optional().trim().notEmpty(),
    body('workingHours').optional().isObject(),
    body('workingHours.*.start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('workingHours.*.end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('workingHours.*.enabled').optional().isBoolean()
  ],
  validateRequest,
  settingsController.updateSettings
);

export default router;