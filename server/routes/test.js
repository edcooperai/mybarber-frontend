import express from 'express';
import { sendSMS } from '../utils/notifications.js';

const router = express.Router();

router.post('/sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    // Validate phone number format
    if (!to.match(/^\+[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Must be in E.164 format (e.g., +447123456789)'
      });
    }

    const response = await sendSMS(to, message);
    res.json({ 
      success: true, 
      messageId: response.sid,
      details: response // Include full response for debugging
    });
  } catch (error) {
    console.error('SMS Test Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code,
      details: error.response || error // Include more error details
    });
  }
});

export default router;