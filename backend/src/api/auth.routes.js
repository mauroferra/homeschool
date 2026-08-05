import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import config from '../config/env.js';
import * as controller from '../modules/auth/auth.controller.js';
import * as validator from '../modules/auth/auth.validator.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
});

router.post('/login', authLimiter, validator.validateLogin, controller.login);
router.post('/logout', controller.logout);
router.post('/reset', validator.validateReset, controller.reset);
router.post('/reset/confirm', validator.validateResetConfirm, controller.resetConfirm);
router.get('/me', auth, controller.me);
router.patch('/me/password', auth, validator.validateChangePassword, controller.changePassword);
router.patch('/me/profile', auth, validator.validateProfile, controller.updateProfile);

export default router;