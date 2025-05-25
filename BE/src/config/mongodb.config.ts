import { registerAs } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Logger } from '@nestjs/common';

let mongoUri: string;
let mongoMemoryServer: MongoMemoryServer;
const logger = new Logger('MongoDB Config');

export default registerAs('mongodb', async () => {
  // If MongoDB URI is provided via environment variables, use it
  if (process.env.MONGODB_URI) {
    logger.log('Using MongoDB URI from environment variable');
    return { uri: process.env.MONGODB_URI };
  }

  // If we already have a MongoDB Memory Server instance, use its URI
  if (mongoUri) {
    logger.log(`Using existing MongoDB Memory Server connection: ${mongoUri}`);
    return { uri: mongoUri };
  }

  // Start a MongoDB Memory Server for development as fallback
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    mongoUri = mongoMemoryServer.getUri();
    logger.log(`MongoDB Memory Server started at: ${mongoUri}`);

    // Clean up on application shutdown
    process.on('SIGINT', async () => {
      if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
        logger.log('MongoDB Memory Server stopped');
      }
    });

    return { uri: mongoUri };
  } catch (error) {
    logger.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
});
