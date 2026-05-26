import { Course } from '../models/course.model.js';

export const createCourseInDb = async (title: string, description: string, userId: string) => {
    const newCourse = new Course({ title, description, userId });
    return await newCourse.save();
};

export const getCoursesByUserId = async (userId: string) => {
    // On récupère les cours du prof, triés du plus récent au plus ancien
    return await Course.find({ userId }).sort({ createdAt: -1 });
};