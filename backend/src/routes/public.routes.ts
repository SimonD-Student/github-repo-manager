import { Router } from 'express';
import {getPublicCourseInfo, joinCourseGroup} from '../controllers/public.controller.js';
import { validateSchema, joinGroupSchema } from '../middlewares/validation.middleware.js';

const router = Router();

router.get('/course/:token', getPublicCourseInfo);
router.post('/course/:token/join', validateSchema(joinGroupSchema), joinCourseGroup);

export default router;