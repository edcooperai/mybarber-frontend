import twilio from 'twilio';
import { logger } from './logger.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    logger.info(`Sending SMS to ${to}`);
    
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    logger.info(`SMS sent successfully. SID: ${response.sid}`);
    return response;
  } catch (error) {
    logger.error('Failed to send SMS:', {
      error: error.message,
      code: error.code,
      to,
      twilioError: error
    });
    throw error;
  }
};