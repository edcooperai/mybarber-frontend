import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { auth } from '../middleware/auth.js';
import * as serviceController from '../controllers/serviceController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all services
router.get('/', serviceController.getServices);

// Get service by ID
router.get('/:id', serviceController.getService);

// Create service
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('duration').isInt({ min: 5 }),
    body('price').isFloat({ min: 0 }),
    body('color').matches(/^#[0-9A-F]{6}$/i),
    body('description').optional().trim().isString()
  ],
  validateRequest,
  serviceController.createService
);

// Update service
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('duration').optional().isInt({ min: 5 }),
    body('price').optional().isFloat({ min: 0 }),
    body('color').optional().matches(/^#[0-9A-F]{6}$/i),
    body('description').optional().trim().isString()
  ],
  validateRequest,
  serviceController.updateService
);

// Delete service
router.delete('/:id', serviceController.deleteService);

export default router;