import mongoose, { Connection } from 'mongoose';
import { config } from './environment';

let connection: Connection | null = null;

export const connectDatabase = async (): Promise<Connection> => {
  if (connection) {
    console.log('✓ Using existing MongoDB connection');
    return connection;
  }

  try {
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    connection = mongoose.connection;

    // Connection event handlers
    connection.on('connected', () => {
      console.log('✓ MongoDB connected successfully');
    });

    connection.on('error', (error) => {
      console.error('✗ MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected');
    });

    return connection;
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
    console.log('✓ MongoDB disconnected');
  }
};

export const getConnection = (): Connection | null => {
  return connection;
};
