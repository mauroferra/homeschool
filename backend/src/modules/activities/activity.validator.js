import Joi from 'joi';
import { categories } from '../../utils/constants.js';
import { validate } from '../../middleware/validation.middleware.js';

const categoryList = categories;

export const createActivitySchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  category: Joi.string().valid(...categoryList).required(),
  description: Joi.string().allow('', null),
  estimated_duration: Joi.number().integer().min(1).allow(null),
  links: Joi.array().items(Joi.string().uri({ allowRelative: true }).allow('')).default([]),
  theme_id: Joi.number().integer().min(1).allow(null),
});

export const updateActivitySchema = Joi.object({
  title: Joi.string().min(1).max(200),
  category: Joi.string().valid(...categoryList),
  description: Joi.string().allow('', null),
  estimated_duration: Joi.number().integer().min(1).allow(null),
  links: Joi.array().items(Joi.string()).default([]),
  theme_id: Joi.number().integer().min(1).allow(null),
}).min(1);

export const validateCreateActivity = validate(createActivitySchema);
export const validateUpdateActivity = validate(updateActivitySchema);