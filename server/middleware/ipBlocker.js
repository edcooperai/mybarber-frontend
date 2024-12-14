import { logger } from '../utils/logger.js';

const failedAttempts = new Map();
const blockDuration = 15 * 60 * 1000; // 15 minutes

export const ipBlocker = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  // Check if IP is blocked
  const blockData = failedAttempts.get(ip);
  if (blockData) {
    if (blockData.blockedUntil && blockData.blockedUntil > now) {
      logger.warn(`Blocked IP attempt: ${ip}`);
      return res.status(423).json({
        message: `Too many failed attempts. Try again in ${Math.ceil((blockData.blockedUntil - now) / 1000 / 60)} minutes`
      });
    } else if (blockData.blockedUntil <= now) {
      // Reset if block has expired
      failedAttempts.delete(ip);
    }
  }

  // Attach methods to track attempts
  req.incrementFailedAttempts = () => {
    const data = failedAttempts.get(ip) || { count: 0 };
    data.count += 1;
    
    if (data.count >= 5) {
      data.blockedUntil = now + blockDuration;
      logger.warn(`IP blocked due to failed attempts: ${ip}`);
    }
    
    failedAttempts.set(ip, data);
  };

  req.resetFailedAttempts = () => {
    failedAttempts.delete(ip);
  };

  next();
};