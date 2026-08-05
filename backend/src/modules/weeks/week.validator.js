import Joi from 'joi';
import { validate } from '../../middleware/validation.middleware.js';

export const createWeekSchema = Joi.object({
  start_date: Joi.date().iso().required(),
});

export const reflectionSchema = Joi.object({
  parent_reflection: Joi.string().allow('', null),
});

export const validateCreateWeek = validate(createWeekSchema);
export const validateReflection = validate(reflectionSchema);