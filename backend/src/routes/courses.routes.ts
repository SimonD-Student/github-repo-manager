import { Router } from 'express';
import {
    createCourse,
    generateCourseUrl,
    getCourseById,
    getCourses,
    updateCourseConfig
} from '../controllers/course.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// On protège TOUTES les routes de ce fichier avec notre middleware
router.use(requireAuth);

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourseConfig);
router.post('/:id/generate-url', generateCourseUrl);

export default router;