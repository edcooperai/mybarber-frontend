<content>import Settings from '../models/Settings.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.userId });

    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        userId: req.userId,
        bookingId: crypto.randomBytes(8).toString('hex'),
        workingHours: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { start: '09:00', end: '17:00', enabled: true },
          sunday: { start: '09:00', end: '17:00', enabled: false }
        }
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, upsert: true }
    );

    logger.info(`Settings updated for user: ${req.userId}`);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};</content>