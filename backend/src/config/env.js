import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = process.env.NODE_ENV || 'development';

const config = {
  env,
  isProduction: env === 'production',
  port: parseInt(process.env.PORT || '4000', 10),
  apiBase: '/api/v1',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'faro',
    username: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || 'app',
    storage: process.env.DB_STORAGE || path.resolve(__dirname, '../../data/app.db'),
    logging: false,
  },
  uploadsDir: process.env.UPLOADS_DIR || path.resolve(__dirname, '../../data/uploads'),
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || '4000'}`,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  resetTokenTtlMinutes: parseInt(process.env.RESET_TOKEN_TTL_MINUTES || '30', 10),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_MAX || '100', 10),
  },
};

export default config;