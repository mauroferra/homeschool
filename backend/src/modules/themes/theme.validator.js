import Joi from 'joi';
import { validate } from '../../middleware/validation.middleware.js';

export const createThemeSchema = Joi.object({
  name: Joi.string().min(1).max(120).required(),
  description: Joi.string().allow('', null),
  start_date: Joi.date().iso().allow(null),
  end_date: Joi.date().iso().allow(null),
});

export const updateThemeSchema = Joi.object({
  name: Joi.string().min(1).max(120),
  description: Joi.string().allow('', null),
  start_date: Joi.date().iso().allow(null),
  end_date: Joi.date().iso().allow(null),
}).min(1);

export const validateCreateTheme = validate(createThemeSchema);
export const validateUpdateTheme = validate(updateThemeSchema);