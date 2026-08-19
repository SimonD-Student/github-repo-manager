import { Router } from 'express';
import {
    createCourse,
    generateCourseUrl,
    getCourseById,
    getCourses,
    updateCourseConfig,
    getCourseGroups
} from '../controllers/course.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourseConfig);
router.get('/:id/groups', getCourseGroups);
router.post('/:id/generate-url', generateCourseUrl);

export default router;