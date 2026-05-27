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
import axios from "axios"; // L'interface qu'on a créée

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
        const configData = req.body; // Contient githubOrganization, minContributors, etc.

        if (!userId) return res.status(401).json({ message: 'Non autorisé' });
        if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID du cours manquant ou invalide' });

        // NOUVEAU : Si le prof essaie de configurer une organisation, on la valide d'abord auprès de GitHub
        if (configData.githubOrganization) {
            const user = await User.findById(userId);
            if (!user || !user.githubTokenEncrypted) {
                return res.status(400).json({ message: "Le token GitHub de l'administrateur est manquant dans la base de données." });
            }
            const decryptedToken = decrypt(user.githubTokenEncrypted);

            try {
                // Appel de contrôle à GitHub
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

        // Si tout est valide, alors seulement on enregistre dans MongoDB
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

        // 1. On récupère les infos du cours pour avoir le nom de l'organisation
        const course = await getCourse(id, userId);
        if (!course.githubOrganization) {
            return res.status(400).json({ message: "Veuillez d'abord configurer une organisation GitHub." });
        }

        // 2. On récupère le token chiffré de l'utilisateur et on le déchiffre
        const user = await User.findById(userId);
        if (!user || !user.githubTokenEncrypted) {
            return res.status(400).json({ message: "Le token GitHub de l'administrateur est manquant." });
        }
        const decryptedToken = decrypt(user.githubTokenEncrypted);

        // 3. VÉRIFICATION GITHUB : On interroge l'API GitHub
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

            // Si c'est un problème de token invalide (401) ou d'organisation introuvable (404)
            const status = githubError.response?.status;
            let errMsg = `L'organisation '${course.githubOrganization}' est introuvable sur GitHub.`;
            if (status === 401) {
                errMsg = "Votre Token GitHub administrateur est invalide ou a expiré.";
            } else if (status === 403) {
                errMsg = "Limite de requêtes GitHub atteinte ou accès refusé.";
            }

            return res.status(400).json({ message: errMsg });
        }

        // 4. Si GitHub a répondu 200 OK, c'est bon, on génère l'URL !
        const token = await generateParticipationToken(id, userId);
        return res.status(200).json({ participationUrl: token });

    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};