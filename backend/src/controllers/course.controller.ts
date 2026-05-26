import type { Response } from 'express';
import {addCourse, getCourse, getUserCourses, updateCourseConfiguration} from '../services/course.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js'; // L'interface qu'on a créée

export const createCourse = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { title, description } = req.body;

        // userId est injecté par notre middleware de sécurité
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const course = await addCourse(title, description, userId);
        return res.status(201).json(course);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getCourses = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const courses = await getUserCourses(userId);
        return res.status(200).json(courses);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erreur serveur lors de la récupération des cours' });
    }
};

export const getCourseById = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ message: 'Non autorisé' });

        // NOUVEAU : Le garde-fou pour rassurer TypeScript et sécuriser l'API
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'ID du cours manquant ou invalide' });
        }

        const course = await getCourse(id, userId);
        return res.status(200).json(course);
    } catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
};

export const updateCourseConfig = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const configData = req.body;

        if (!userId) return res.status(401).json({ message: 'Non autorisé' });

        // NOUVEAU : Le même garde-fou ici
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'ID du cours manquant ou invalide' });
        }

        const updatedCourse = await updateCourseConfiguration(id, userId, configData);
        return res.status(200).json(updatedCourse);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};