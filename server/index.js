import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { securityMiddleware } from './middleware/security.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Routes
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import clientRoutes from './routes/clients.js';
import serviceRoutes from './routes/services.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Security middleware
app.use(securityMiddleware);
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});