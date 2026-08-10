import { Router } from 'express';
import * as controller from '../modules/externalTypes/externalType.controller.js';
import * as validator from '../modules/externalTypes/externalType.validator.js';
import { validateParams } from '../middleware/validation.middleware.js';
import { auth } from '../middleware/auth.middleware.js';
import Joi from 'joi';

const router = Router();

const idParams = validateParams(Joi.object({ id: Joi.number().integer().min(1).required() }));

router.use(auth);
router.get('/', controller.list);
router.post('/', validator.validateCreateExternalType, controller.create);
router.patch('/:id', idParams, validator.validateUpdateExternalType, controller.update);
router.delete('/:id', idParams, controller.remove);

export default router;