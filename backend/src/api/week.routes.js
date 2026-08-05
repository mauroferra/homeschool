import { Router } from 'express';
import * as controller from '../modules/weeks/week.controller.js';
import * as validator from '../modules/weeks/week.validator.js';
import { validateParams } from '../middleware/validation.middleware.js';
import { auth } from '../middleware/auth.middleware.js';
import Joi from 'joi';

const router = Router();

const idParams = validateParams(Joi.object({ id: Joi.number().integer().min(1).required() }));

router.use(auth);
router.get('/', controller.list);
router.post('/', validator.validateCreateWeek, controller.create);
router.get('/:id', idParams, controller.get);
router.patch('/:id/reflection', idParams, validator.validateReflection, controller.updateReflection);
router.delete('/:id', idParams, controller.remove);

export default router;