import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://spiritual_ai:lmzJShTDaiGjGRwJye@spirituality.ystdrnv.mongodb.net/premium-astrology-app'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};

// Validate required environment variables
export const validateConfig = (): void => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  
  if (config.isProduction) {
    const missingVars = requiredVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }
};
