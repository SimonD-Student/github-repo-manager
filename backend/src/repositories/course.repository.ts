import { Course } from '../models/course.model.js';

export const createCourseInDb = async (title: string, description: string, userId: string) => {
    const newCourse = new Course({ title, description, userId });
    return await newCourse.save();
};

export const getCoursesByUserId = async (userId: string) => {
    // On récupère les cours du prof, triés du plus récent au plus ancien
    return await Course.find({ userId }).sort({ createdAt: -1 });
};

// Récupérer un seul cours (en vérifiant que le prof en est bien le propriétaire)
export const getCourseByIdAndUserId = async (courseId: string, userId: string) => {
    return await Course.findOne({ _id: courseId, userId });
};

// Mettre à jour la configuration d'un cours
export const updateCourseConfigInDb = async (courseId: string, userId: string, configData: any) => {
    return await Course.findOneAndUpdate(
        { _id: courseId, userId }, // On cherche le cours par son ID ET son propriétaire
        { $set: configData },      // On met à jour uniquement les champs fournis
        { new: true }              // Demande à Mongoose de renvoyer le document mis à jour
    );
};