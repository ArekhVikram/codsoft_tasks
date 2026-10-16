import mongoose from 'mongoose';
import { config } from './config.js';

let isMongoConnected = false;

export async function connectDB() {
  if (!config.mongoUri) {
    console.log('[Database] MONGODB_URI not provided. Running in DEMO MODE with authoritative local sample data store.');
    isMongoConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection error: ${error.message}`);
    console.log('[Database] Falling back to robust DEMO MODE (In-Memory / Sample Data Store).');
    isMongoConnected = false;
    return false;
  }
}

export function isDatabaseConnected() {
  return isMongoConnected;
}
