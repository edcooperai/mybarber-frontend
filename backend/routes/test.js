import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { sendSMS } from '../utils/notifications.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post(
  '/sms',
  [
    body('to')
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Invalid phone number format. Must be in E.164 format (e.g., +447123456789)'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { to, message } = req.body;
      logger.info(`Attempting to send SMS to ${to}`);
      
      const response = await sendSMS(to, message);
      
      // Only return serializable data
      res.json({ 
        success: true, 
        messageId: response.sid,
        details: {
          to: response.to,
          status: response.status,
          direction: response.direction,
          dateCreated: response.dateCreated
        }
      });
    } catch (error) {
      logger.error('SMS Test Error:', {
        message: error.message,
        code: error.code
      });

      // Ensure we only return serializable error data
      res.status(500).json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: {
          status: error.status,
          code: error.code
        }
      });
    }
  }
);

export default router;