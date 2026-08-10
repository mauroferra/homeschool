import Joi from 'joi';
import { validate } from '../../middleware/validation.middleware.js';

const nameSchema = Joi.string().min(1).max(120);

export const createExternalTypeSchema = Joi.object({
  name: nameSchema.required(),
  name_en: nameSchema.allow(null, ''),
  name_cs: nameSchema.allow(null, ''),
  name_it: nameSchema.allow(null, ''),
});

export const updateExternalTypeSchema = Joi.object({
  name: nameSchema,
  name_en: nameSchema.allow(null, ''),
  name_cs: nameSchema.allow(null, ''),
  name_it: nameSchema.allow(null, ''),
}).min(1);

export const validateCreateExternalType = validate(createExternalTypeSchema);
export const validateUpdateExternalType = validate(updateExternalTypeSchema);