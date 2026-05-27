import { Router } from 'express';
import {getPublicCourseInfo, joinCourseGroup} from '../controllers/public.controller.js';

const router = Router();

// Route publique : pas de middleware requireAuth ici !
router.get('/course/:token', getPublicCourseInfo);
router.post('/course/:token/join', joinCourseGroup);

export default router;