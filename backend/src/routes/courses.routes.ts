import { Router } from 'express';
import {
    createCourse,
    generateCourseUrl,
    getCourseById,
    getCourses,
    updateCourseConfig,
    getCourseGroups,
    updateCourseInfo
} from '../controllers/course.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {courseConfigSchema, courseInfoSchema, validateSchema} from "../middlewares/validation.middleware.js";

const router = Router();

router.use(requireAuth);

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.get('/:id/groups', getCourseGroups);
router.post('/', validateSchema(courseInfoSchema), createCourse);
router.put('/:id', validateSchema(courseConfigSchema), updateCourseConfig);
router.put('/:id/info', validateSchema(courseInfoSchema), updateCourseInfo);

router.post('/:id/generate-url', generateCourseUrl);

export default router;