import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/env.js';
import { createConnection } from './db/db.js';
import './db/models/index.js';
import { logging } from './middleware/logging.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

import authRoutes from './api/auth.routes.js';
import userRoutes from './api/user.routes.js';
import themeRoutes from './api/theme.routes.js';
import activityRoutes from './api/activity.routes.js';
import weekRoutes from './api/week.routes.js';
import instanceRoutes from './api/instance.routes.js';
import progressRoutes from './api/progress.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: config.frontendUrl, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(logging);

  fs.mkdirSync(config.uploadsDir, { recursive: true });
  app.use('/uploads', express.static(config.uploadsDir));

  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }));

  const swaggerPath = path.resolve(__dirname, '../docs/api/openapi.yaml');
  app.get('/docs', (req, res) => {
    if (fs.existsSync(swaggerPath)) {
      res.set('Content-Type', 'text/yaml').send(fs.readFileSync(swaggerPath, 'utf8'));
    } else {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'OpenAPI spec not found' } });
    }
  });

  app.use(config.apiBase + '/auth', authRoutes);
  app.use(config.apiBase + '/users', userRoutes);
  app.use(config.apiBase + '/themes', themeRoutes);
  app.use(config.apiBase + '/activities', activityRoutes);
  app.use(config.apiBase + '/weeks', weekRoutes);
  app.use(config.apiBase, instanceRoutes);
  app.use(config.apiBase + '/progress', progressRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

async function start() {
  await createConnection();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[server] ${config.env} API listening on http://localhost:${config.port}`);
    console.log(`[server] Docs at http://localhost:${config.port}/docs`);
  });
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectRun) {
  if (process.argv.includes('--docs')) {
    createApp().listen(config.port, () => console.log(`[server] docs mode on ${config.port}`));
  } else {
    start().catch((err) => {
      console.error('[server] failed to start:', err);
      process.exit(1);
    });
  }
}

export { createApp };