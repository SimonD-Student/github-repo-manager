import type { Response } from 'express';
import {
    addCourse,
    generateParticipationToken,
    getCourse,
    getUserCourses,
    updateCourseConfiguration
} from '../services/course.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { decrypt } from '../utils/crypto.util.js';
import {User} from "../models/user.model.js";
import { Group } from '../models/group.model.js';
import axios from "axios";

export const createCourse = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { title, description } = req.body;

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
        if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID du cours manquant ou invalide' });

        const course = await getCourse(id, userId);

        if (course.participationUrl) {
            return res.status(403).json({
                message: "Modification impossible : la configuration est verrouillée car le lien d'inscription a déjà été généré."
            });
        }

        if (configData.githubOrganization) {
            const user = await User.findById(userId);
            if (!user || !user.githubTokenEncrypted) {
                return res.status(400).json({ message: "Le token GitHub de l'administrateur est manquant dans la base de données." });
            }
            const decryptedToken = decrypt(user.githubTokenEncrypted);

            try {
                await axios.get(`https://api.github.com/orgs/${configData.githubOrganization}`, {
                    headers: {
                        Authorization: `Bearer ${decryptedToken}`,
                        Accept: 'application/vnd.github.v3+json',
                        'User-Agent': 'GitRepo-Manager-App'
                    }
                });
            } catch (githubError: any) {
                const status = githubError.response?.status;
                let errMsg = `L'organisation '${configData.githubOrganization}' n'existe pas sur GitHub.`;
                if (status === 401) errMsg = "Votre Token GitHub administrateur (.env) est invalide.";

                return res.status(400).json({ message: errMsg });
            }
        }

        const updatedCourse = await updateCourseConfiguration(id, userId, configData);
        return res.status(200).json(updatedCourse);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const generateCourseUrl = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ message: 'Non autorisé' });
        if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID invalide' });

        const course = await getCourse(id, userId);
        if (!course.githubOrganization) {
            return res.status(400).json({ message: "Veuillez d'abord configurer une organisation GitHub." });
        }

        const user = await User.findById(userId);
        if (!user || !user.githubTokenEncrypted) {
            return res.status(400).json({ message: "Le token GitHub de l'administrateur est manquant." });
        }
        const decryptedToken = decrypt(user.githubTokenEncrypted);

        try {
            await axios.get(`https://api.github.com/orgs/${course.githubOrganization}`, {
                headers: {
                    Authorization: `Bearer ${decryptedToken}`,
                    Accept: 'application/vnd.github.v3+json',
                    'User-Agent': 'GitRepo-Manager-App' // <-- OBLIGATOIRE pour GitHub API depuis un serveur
                }
            });
        } catch (githubError: any) {
            console.error("Erreur GitHub API détaillée:", githubError.response?.data || githubError.message);

            const status = githubError.response?.status;
            let errMsg = `L'organisation '${course.githubOrganization}' est introuvable sur GitHub.`;
            if (status === 401) {
                errMsg = "Votre Token GitHub administrateur est invalide ou a expiré.";
            } else if (status === 403) {
                errMsg = "Limite de requêtes GitHub atteinte ou accès refusé.";
            }

            return res.status(400).json({ message: errMsg });
        }

        const token = await generateParticipationToken(id, userId);
        return res.status(200).json({ participationUrl: token });

    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getCourseGroups = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ message: 'Non autorisé' });
        if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID invalide' });

        const course = await getCourse(id, userId);
        if (!course) return res.status(403).json({ message: 'Accès refusé' });

        const groups = await Group.find({ courseId: id }).sort({ createdAt: 1 });
        return res.status(200).json(groups);

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateCourseInfo = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { title, description } = req.body;

        if (!userId) return res.status(401).json({ message: 'Non autorisé' });
        if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID invalide' });

        const updatedCourse = await updateCourseConfiguration(id, userId, { title, description });
        return res.status(200).json(updatedCourse);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};