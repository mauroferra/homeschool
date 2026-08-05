import Joi from 'joi';
import { validate } from '../../middleware/validation.middleware.js';

export const statsQuery = validate(
  Joi.object({
    week_id: Joi.number().integer().min(1).optional(),
  }),
  'query'
);