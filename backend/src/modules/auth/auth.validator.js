import Joi from 'joi';
import { validate } from '../../middleware/validation.middleware.js';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetConfirmSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const profileSchema = Joi.object({
  profile: Joi.object().unknown(true),
});

export const validateLogin = validate(loginSchema);
export const validateReset = validate(resetSchema);
export const validateResetConfirm = validate(resetConfirmSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateProfile = validate(profileSchema);