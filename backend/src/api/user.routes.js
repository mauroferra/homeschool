import { Router } from 'express';
import * as controller from '../modules/users/user.controller.js';
import * as validator from '../modules/users/user.validator.js';
import { auth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(auth, requireRole('admin'));
router.get('/', controller.list);
router.post('/', validator.validateCreateUser, controller.create);
router.patch('/:id', validator.validateIdParams, validator.validateUpdateUser, controller.update);
router.delete('/:id', validator.validateIdParams, controller.remove);

export default router;