import type { Request, Response } from 'express';
import { getCourseByParticipationToken } from '../repositories/course.repository.js';
import axios from 'axios';
import {decrypt} from "../utils/crypto.util.js";
import {Course} from '../models/course.model.js';

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

export const joinCourseGroup = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;
        const { participants } = req.body; // Reçoit [{ fullName, githubId }, ...]

        if (!token || typeof token !== 'string') return res.status(400).json({ message: 'Token invalide' });
        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ message: 'Participants invalides' });
        }

        // 1. Récupération du cours ET du professeur associé
        const course: any = await Course.findOne({ participationUrl: token }).populate('userId');
        if (!course) return res.status(404).json({ message: 'Lien invalide ou expiré' });

        // 2. Déchiffrement du Token du professeur
        const teacher = course.userId;
        if (!teacher || !teacher.githubTokenEncrypted) {
            return res.status(500).json({ message: "Le token de l'enseignant est manquant. Création impossible." });
        }
        const decryptedToken = decrypt(teacher.githubTokenEncrypted);

        // 3. Calcul du nom du prochain Repository
        const nextGroupNumber = course.currentGroupCount + 1;
        // Transforme "1" en "01", "2" en "02", etc.
        const paddedNumber = String(nextGroupNumber).padStart(2, '0');
        const repoName = course.repoNameFormat.replace('{XX}', paddedNumber);
        const orgName = course.githubOrganization;

        const githubHeaders = {
            Authorization: `Bearer ${decryptedToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'GitRepo-Manager-App'
        };

        // 4. Appel API GITHUB : Création du Repository privé dans l'organisation
        let repoUrl = '';
        try {
            const createRepoRes = await axios.post(
                `https://api.github.com/orgs/${orgName}/repos`,
                {
                    name: repoName,
                    private: true,
                    description: `Repository généré pour le cours ${course.title}`
                },
                { headers: githubHeaders }
            );
            repoUrl = createRepoRes.data.html_url; // Lien vers le repo généré
        } catch (error: any) {
            console.error("Erreur Création Repo:", error.response?.data || error.message);
            return res.status(500).json({ message: "Erreur lors de la création du repository sur GitHub." });
        }

        // 5. Appels API GITHUB : Ajout des collaborateurs (étudiants)
        const failedInvites = [];
        for (const participant of participants) {
            try {
                await axios.put(
                    `https://api.github.com/repos/${orgName}/${repoName}/collaborators/${participant.githubId}`,
                    { permission: 'push' }, // Droit d'écriture par défaut
                    { headers: githubHeaders }
                );
            } catch (error) {
                // Si l'ajout échoue (ex: pseudo introuvable), on ne plante pas tout car le repo est déjà créé
                failedInvites.push(participant.githubId);
            }
        }

        // 6. Mise à jour du compteur dans notre base de données
        course.currentGroupCount = nextGroupNumber;
        await course.save();

        // 7. On renvoie le résultat au frontend
        return res.status(200).json({
            message: "Groupe créé avec succès !",
            repoName,
            repoUrl,
            failedInvites // On prévient si certains élèves se sont trompés de pseudo
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur critique' });
    }
};