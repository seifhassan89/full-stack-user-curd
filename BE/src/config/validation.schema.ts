import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Application environment (development, production, test)'),

  // Application
  PORT: Joi.number().port().default(5000).description('Port on which the application will run'),

  CORS_ORIGINS: Joi.string()
    .default('*')
    .description('Comma-separated list of allowed CORS origins or * for all'),

  THROTTLE_TTL: Joi.number()
    .positive()
    .default(60)
    .description('Time-to-live for rate limiting in seconds'),

  THROTTLE_LIMIT: Joi.number()
    .positive()
    .default(100)
    .description('Maximum number of requests within TTL window'),

  // MongoDB
  MONGODB_URI: Joi.string()
    .uri({
      scheme: ['mongodb', 'mongodb+srv'],
    })
    .description('Full MongoDB connection URI'),

  MONGODB_HOST: Joi.string().description('MongoDB host (used when MONGODB_URI is not provided)'),

  MONGODB_PORT: Joi.number()
    .port()
    .default(27017)
    .description('MongoDB port (used when MONGODB_URI is not provided)'),

  MONGODB_DATABASE: Joi.string()
    .default('nest-app')
    .description('MongoDB database name (used when MONGODB_URI is not provided)'),

  MONGODB_USERNAME: Joi.string().description(
    'MongoDB username for authentication (used when MONGODB_URI is not provided)',
  ),

  MONGODB_PASSWORD: Joi.string().description(
    'MongoDB password for authentication (used when MONGODB_URI is not provided)',
  ),

  // JWT Authentication
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('Secret key for signing JWT access tokens'),

  JWT_ACCESS_EXPIRATION: Joi.string()
    .default('15m')
    .description('JWT access token expiration (e.g., 15m, 1h, 1d)'),

  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .required()
    .description('Secret key for signing JWT refresh tokens'),

  JWT_REFRESH_EXPIRATION: Joi.string()
    .default('7d')
    .description('JWT refresh token expiration (e.g., 7d, 30d)'),
});
