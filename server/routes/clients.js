import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { auth } from '../middleware/auth.js';
import * as clientController from '../controllers/clientController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all clients
router.get('/', clientController.getClients);

// Get client by ID
router.get('/:id', clientController.getClient);

// Create client
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phoneNumber').trim().notEmpty(),
    body('notes').optional().trim().isString()
  ],
  validateRequest,
  clientController.createClient
);

// Update client
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phoneNumber').optional().trim().notEmpty(),
    body('notes').optional().trim().isString()
  ],
  validateRequest,
  clientController.updateClient
);

// Delete client
router.delete('/:id', clientController.deleteClient);

export default router;