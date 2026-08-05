import { Router } from 'express';
import * as controller from '../modules/progress/progress.controller.js';
import * as validator from '../modules/progress/progress.validator.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(auth);
router.get('/weekly-stats', validator.statsQuery, controller.weeklyStats);
router.get('/last-four-weeks', controller.lastFourWeeks);
router.get('/reflections', validator.statsQuery, controller.reflections);

export default router;