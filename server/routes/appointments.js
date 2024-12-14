import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { auth } from '../middleware/auth.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all appointments
router.get('/', appointmentController.getAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointment);

// Create appointment
router.post(
  '/',
  [
    body('clientId').isMongoId(),
    body('serviceId').isMongoId(),
    body('date').isISO8601(),
    body('status').isIn(['scheduled', 'completed', 'cancelled', 'no-show']),
    body('notes').optional().trim().isString()
  ],
  validateRequest,
  appointmentController.createAppointment
);

// Update appointment
router.put(
  '/:id',
  [
    body('status').optional().isIn(['scheduled', 'completed', 'cancelled', 'no-show']),
    body('notes').optional().trim().isString()
  ],
  validateRequest,
  appointmentController.updateAppointment
);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

export default router;