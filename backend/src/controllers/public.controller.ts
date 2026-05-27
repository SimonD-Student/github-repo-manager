import type { Request, Response } from 'express';
import { getCourseByParticipationToken } from '../repositories/course.repository.js';

export const getPublicCourseInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;

        // LE GARDE FOU EST ICI : On vérifie que c'est bien une string
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: 'Token manquant ou invalide' });
        }

        const course = await getCourseByParticipationToken(token);
        // ... suite du code

        if (!course) {
            return res.status(404).json({ message: 'Lien invalide ou expiré' });
        }

        // On ne renvoie que les infos non-sensibles nécessaires aux étudiants
        return res.status(200).json({
            title: course.title,
            githubOrganization: course.githubOrganization,
            minContributors: course.minContributors,
            maxContributors: course.maxContributors,
            repoNameFormat: course.repoNameFormat,
            teacherEmail: (course.userId as any).email // En attendant d'avoir un vrai nom/prénom dans le modèle User
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};