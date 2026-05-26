import { createCourseInDb, getCoursesByUserId } from '../repositories/course.repository.js';

export const addCourse = async (title: string, description: string, userId: string) => {
    if (!title || !description) {
        throw new Error('Le titre et la description sont requis');
    }
    return await createCourseInDb(title, description, userId);
};

export const getUserCourses = async (userId: string) => {
    return await getCoursesByUserId(userId);
};