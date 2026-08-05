import { Router } from 'express';
import * as controller from '../modules/instances/instance.controller.js';
import * as validator from '../modules/instances/instance.validator.js';
import { validateParams } from '../middleware/validation.middleware.js';
import { auth } from '../middleware/auth.middleware.js';
import Joi from 'joi';

const router = Router();

const weekParams = validateParams(Joi.object({ week_id: Joi.number().integer().min(1).required() }));
const idParams = validateParams(Joi.object({ id: Joi.number().integer().min(1).required() }));

router.use(auth);

router.get('/weeks/:week_id/instances', weekParams, controller.listForWeek);
router.post('/weeks/:week_id/instances', weekParams, validator.validateCreateInstance, controller.create);
router.post('/weeks/:week_id/instances/ad-hoc', weekParams, validator.validateCreateAdHoc, controller.createAdHoc);

router.get('/instances/:id', idParams, controller.get);
router.patch('/instances/:id', idParams, validator.validateUpdateInstance, controller.update);
router.delete('/instances/:id', idParams, controller.remove);

export default router;