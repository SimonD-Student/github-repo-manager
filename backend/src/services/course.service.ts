import {
    createCourseInDb,
    getCourseByIdAndUserId,
    getCoursesByUserId,
    updateCourseConfigInDb
} from '../repositories/course.repository.js';
import crypto from "crypto";

export const addCourse = async (title: string, description: string, userId: string) => {
    if (!title || !description) {
        throw new Error('Le titre et la description sont requis');
    }
    return await createCourseInDb(title, description, userId);
};

export const getUserCourses = async (userId: string) => {
    return await getCoursesByUserId(userId);
};

export const getCourse = async (courseId: string, userId: string) => {
    const course = await getCourseByIdAndUserId(courseId, userId);
    if (!course) {
        throw new Error('Cours introuvable ou vous n\'avez pas les droits');
    }
    return course;
};

export const updateCourseConfiguration = async (courseId: string, userId: string, configData: any) => {
    const updatedCourse = await updateCourseConfigInDb(courseId, userId, configData);
    if (!updatedCourse) {
        throw new Error('Impossible de mettre à jour ce cours');
    }
    return updatedCourse;
};

export const generateParticipationToken = async (courseId: string, userId: string) => {
    // Génère 32 octets aléatoires et les convertit en chaîne hexadécimale (64 caractères)
    const token = crypto.randomBytes(32).toString('hex');

    // On sauvegarde ce token dans le champ participationUrl de notre cours
    const updatedCourse = await updateCourseConfigInDb(courseId, userId, { participationUrl: token });

    if (!updatedCourse) {
        throw new Error('Impossible de générer l\'URL pour ce cours');
    }

    return updatedCourse.participationUrl;
};