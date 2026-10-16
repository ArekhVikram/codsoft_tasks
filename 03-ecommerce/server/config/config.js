import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'nova-supply-super-secret-jwt-key-2026',
  jwtExpiresIn: '7d',
  clientUrl: process.env.CLIENT_URL || '*'
};
