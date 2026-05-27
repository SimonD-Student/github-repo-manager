import { Router } from 'express';
import { getPublicCourseInfo } from '../controllers/public.controller.js';

const router = Router();

// Route publique : pas de middleware requireAuth ici !
router.get('/course/:token', getPublicCourseInfo);

export default router;