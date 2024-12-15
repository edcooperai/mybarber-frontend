import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Load environment variables from the correct path
dotenv.config({ path: path.resolve('.env') });  // Adjust path if needed

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {  // Ensure consistency with the variable in .env
      throw new Error('MongoDB URI is not defined in .env');
    }
    logger.info('MongoDB URI:', process.env.DATABASE_URL);  // Use logger for better consistency

    const conn = await mongoose.connect(process.env.DATABASE_URL);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
