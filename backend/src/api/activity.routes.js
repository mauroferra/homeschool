import { Router } from 'express';
import * as controller from '../modules/activities/activity.controller.js';
import * as validator from '../modules/activities/activity.validator.js';
import { validateParams } from '../middleware/validation.middleware.js';
import { auth } from '../middleware/auth.middleware.js';
import Joi from 'joi';

const router = Router();

const idParams = validateParams(Joi.object({ id: Joi.number().integer().min(1).required() }));

router.use(auth);
router.get('/', controller.list);
router.get('/:id', idParams, controller.get);
router.post('/', validator.validateCreateActivity, controller.create);
router.patch('/:id', idParams, validator.validateUpdateActivity, controller.update);
router.delete('/:id', idParams, controller.remove);

export default router;