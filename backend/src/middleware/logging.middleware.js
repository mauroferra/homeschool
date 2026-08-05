import config from '../config/env.js';

export function logging(req, res, next) {
  if (config.env === 'test') return next();
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    if (config.env !== 'production' || res.statusCode >= 400) {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    }
  });
  next();
}