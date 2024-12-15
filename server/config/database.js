import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Load environment variables from the correct path (ensure .env is in the root folder or adjust the path)
dotenv.config({ path: path.resolve('.env') });  // Path is correct if .env is in the root

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {  // Correct variable name to match the .env file
      throw new Error('MongoDB URI is not defined in .env');
    }
    logger.info('MongoDB URI:', process.env.MONGODB_URI);  // Use logger for better consistency

    const conn = await mongoose.connect(process.env.MONGODB_URI);  // Connect using the correct environment variable
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit with failure code
  }
};

export default connectDB;
