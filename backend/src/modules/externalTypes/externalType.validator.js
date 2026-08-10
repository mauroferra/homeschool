import Joi from 'joi';
import { validate } from '../../middleware/validation.middleware.js';

export const createExternalTypeSchema = Joi.object({
  name: Joi.string().min(1).max(120).required(),
});

export const updateExternalTypeSchema = Joi.object({
  name: Joi.string().min(1).max(120),
}).min(1);

export const validateCreateExternalType = validate(createExternalTypeSchema);
export const validateUpdateExternalType = validate(updateExternalTypeSchema);