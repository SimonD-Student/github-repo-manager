import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// Création de la route POST /api/auth/login
router.post('/login', login);

export default router;