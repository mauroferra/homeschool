import Joi from 'joi';
import { blockTypes, householdTags, statuses } from '../../utils/constants.js';
import { validate } from '../../middleware/validation.middleware.js';

const blockList = Object.values(blockTypes);

export const createInstanceSchema = Joi.object({
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  block_type: Joi.string().valid(...blockList).required(),
  activity_id: Joi.number().integer().min(1).required(),
  home_tag: Joi.string().valid(...householdTags).default('Home A'),
  status: Joi.string().valid(...statuses).default('Not started'),
  reflection_text: Joi.string().allow('', null),
});

export const createAdHocSchema = Joi.object({
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  block_type: Joi.string().valid(...blockList).required(),
  home_tag: Joi.string().valid(...householdTags).default('Home A'),
  title: Joi.string().min(1).max(200).required(),
  category: Joi.string().valid('Language', 'Culture', 'School Alignment', 'Ritual', 'Project', 'Professional').default('Project'),
  description: Joi.string().allow('', null),
  estimated_duration: Joi.number().integer().min(1).allow(null),
  links: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid(...statuses).default('Not started'),
});

export const createExternalSchema = Joi.object({
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  home_tag: Joi.string().valid(...householdTags).default('Home A'),
  external_type_id: Joi.number().integer().min(1).allow(null),
  title: Joi.string().min(1).max(200).allow(null),
}).custom((value, helpers) => {
  if (!value.external_type_id && !value.title) {
    return helpers.error('any.required');
  }
  return value;
}, 'at least one of external_type_id or title');

export const updateInstanceSchema = Joi.object({
  day_of_week: Joi.number().integer().min(0).max(6),
  block_type: Joi.string().valid(...blockList),
  activity_id: Joi.number().integer().min(1).allow(null),
  home_tag: Joi.string().valid(...householdTags),
  status: Joi.string().valid(...statuses),
  reflection_text: Joi.string().allow('', null),
}).min(1);

export const validateCreateInstance = validate(createInstanceSchema);
export const validateCreateAdHoc = validate(createAdHocSchema);
export const validateCreateExternal = validate(createExternalSchema);
export const validateUpdateInstance = validate(updateInstanceSchema);