import type { Request, Response } from 'express';
import { getCourseByParticipationToken } from '../repositories/course.repository.js';
import axios from 'axios';
import {decrypt} from "../utils/crypto.util.js";
import {Course} from '../models/course.model.js';
import { Group } from '../models/group.model.js';

export const getPublicCourseInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: 'Token manquant ou invalide' });
        }

        const course = await getCourseByParticipationToken(token);

        if (!course) {
            return res.status(404).json({ message: 'Lien invalide ou expiré' });
        }

        return res.status(200).json({
            title: course.title,
            githubOrganization: course.githubOrganization,
            minContributors: course.minContributors,
            maxContributors: course.maxContributors,
            repoNameFormat: course.repoNameFormat,
            teacherEmail: (course.userId as any).email
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const joinCourseGroup = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;
        const { participants } = req.body;

        if (!token || typeof token !== 'string') return res.status(400).json({ message: 'Token invalide' });
        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ message: 'Participants invalides' });
        }

        const course: any = await Course.findOne({ participationUrl: token }).populate('userId');
        if (!course) return res.status(404).json({ message: 'Lien invalide ou expiré' });

        const teacher = course.userId;
        if (!teacher || !teacher.githubTokenEncrypted) {
            return res.status(500).json({ message: "Le token de l'enseignant est manquant. Création impossible." });
        }
        const decryptedToken = decrypt(teacher.githubTokenEncrypted);

        const nextGroupNumber = course.currentGroupCount + 1;
        const paddedNumber = String(nextGroupNumber).padStart(2, '0');
        const repoName = course.repoNameFormat.replace('{XX}', paddedNumber);
        const orgName = course.githubOrganization;

        const githubHeaders = {
            Authorization: `Bearer ${decryptedToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'GitRepo-Manager-App'
        };

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
            repoUrl = createRepoRes.data.html_url;
        } catch (error: any) {
            console.error("Erreur Création Repo:", error.response?.data || error.message);
            return res.status(500).json({ message: "Erreur lors de la création du repository sur GitHub." });
        }

        const failedInvites = [];
        for (const participant of participants) {
            try {
                await axios.put(
                    `https://api.github.com/repos/${orgName}/${repoName}/collaborators/${participant.githubId}`,
                    { permission: 'push' },
                    { headers: githubHeaders }
                );
            } catch (error) {
                failedInvites.push(participant.githubId);
            }
        }

        course.currentGroupCount = nextGroupNumber;
        await course.save();

        await Group.create({
            courseId: course._id,
            name: repoName,
            repoUrl: repoUrl,
            members: participants
        });

        return res.status(200).json({
            message: "Groupe créé avec succès !",
            repoName,
            repoUrl,
            failedInvites
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur critique' });
    }
};