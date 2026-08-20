import { Course } from '../models/course.model.js';

export const createCourseInDb = async (title: string, description: string, userId: string) => {
    const newCourse = new Course({ title, description, userId });
    return await newCourse.save();
};

export const getCoursesByUserId = async (userId: string) => {
    return await Course.find({ userId }).sort({ createdAt: -1 });
};

export const getCourseByIdAndUserId = async (courseId: string, userId: string) => {
    return await Course.findOne({ _id: courseId, userId });
};

export const updateCourseConfigInDb = async (courseId: string, userId: string, configData: any) => {
    return await Course.findOneAndUpdate(
        { _id: courseId, userId },
        { $set: configData },
        { new: true }
    );
};

export const getCourseByParticipationToken = async (token: string) => {
    return await Course.findOne({ participationUrl: token }).populate('userId', 'email');
};