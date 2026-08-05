import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../db/models/index.js';
import { unauthorized } from '../utils/error.js';

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw unauthorized('Authentication required', 'AUTH_REQUIRED');
    let payload;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch {
      throw unauthorized('Token is invalid or expired', 'INVALID_TOKEN');
    }
    if (payload.purpose === 'reset') throw unauthorized('Authentication required', 'AUTH_REQUIRED');
    const user = await User.unscoped().findByPk(payload.sub);
    if (!user || !user.active) throw unauthorized('User is not active', 'INACTIVE_USER');
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme === 'Bearer' && token) {
    try {
      const payload = jwt.verify(token, config.jwt.secret);
      req.user = { id: payload.sub };
    } catch {
      req.user = null;
    }
  }
  next();
}