import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import morgan from 'morgan';
import { logger } from './utils/logger.js';
import { securityMiddleware } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/database.js';

import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import clientRoutes from './routes/clients.js';
import serviceRoutes from './routes/services.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(securityMiddleware);

// Health check route (before rate limiting)
app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    status: 'success',
    message: 'API is healthy!',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingsRoutes);

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});