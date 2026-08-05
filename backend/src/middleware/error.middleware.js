import config from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  const payload = {
    error: { code: err.code || 'INTERNAL_ERROR', message },
  };
  if (status === 500) {
    console.error('[error]', err);
  }
  if (config.env !== 'production' && status === 500) {
    payload.error.details = err.message;
  }
  res.status(status).json(payload);
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` } });
}