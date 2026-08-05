import Joi from 'joi';
import { validate, validateParams } from '../../middleware/validation.middleware.js';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'parent').default('parent'),
});

export const updateUserSchema = Joi.object({
  role: Joi.string().valid('admin', 'parent'),
  active: Joi.boolean(),
}).min(1);

export const idParams = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

export const validateCreateUser = validate(createUserSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateIdParams = validateParams(idParams);