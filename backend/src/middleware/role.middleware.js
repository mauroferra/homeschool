import { forbidden } from '../utils/error.js';

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(forbidden());
    if (!roles.includes(req.user.role)) return next(forbidden('Insufficient permissions', 'INSUFFICIENT_ROLE'));
    return next();
  };
}

export function selfOrAdmin() {
  return (req, res, next) => {
    if (!req.user) return next(forbidden());
    const targetId = parseInt(req.params.id, 10);
    if (req.user.role === 'admin' || targetId === req.user.id) return next();
    return next(forbidden('Insufficient permissions', 'INSUFFICIENT_ROLE'));
  };
}