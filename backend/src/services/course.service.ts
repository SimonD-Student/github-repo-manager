import {
    createCourseInDb,
    getCourseByIdAndUserId,
    getCoursesByUserId,
    updateCourseConfigInDb
} from '../repositories/course.repository.js';

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