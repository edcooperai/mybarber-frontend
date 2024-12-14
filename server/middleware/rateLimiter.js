import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

// Helper to create a limiter with logging
const createLimiter = (options) => {
  return rateLimit({
    ...options,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP ${req.ip} on ${req.originalUrl}`);
      res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }
  });
};

// Auth endpoints limiter
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true // Only count failed attempts
});

// General API limiter
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Specific endpoint limiters
export const appointmentsLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20
});

export const servicesLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30
});

export const clientsLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30
});

export const settingsLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 20
});