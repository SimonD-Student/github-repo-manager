import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const getCoursesAPI = async () => {
    const response = await axios.get(`${API_URL}/courses`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getCourseByIdAPI = async (id: string) => {
    const response = await axios.get(`${API_URL}/courses/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createCourseAPI = async (title: string, description: string) => {
    const response = await axios.post(`${API_URL}/courses`, { title, description }, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateCourseConfigAPI = async (id: string, configData: any) => {
    const response = await axios.put(`${API_URL}/courses/${id}`, configData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const generateParticipationUrlAPI = async (id: string) => {
    const response = await axios.post(`${API_URL}/courses/${id}/generate-url`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getPublicCourseAPI = async (token: string) => {
    const response = await axios.get(`${API_URL}/public/course/${token}`);
    return response.data;
};

export const joinCourseAPI = async (token: string, participants: any[]) => {
    const response = await axios.post(`${API_URL}/public/course/${token}/join`, { participants });
    return response.data;
};

export const getCourseGroupsAPI = async (id: string) => {
    const response = await axios.get(`${API_URL}/courses/${id}/groups`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateCourseInfoAPI = async (id: string, title: string, description: string) => {
    const response = await axios.put(`${API_URL}/courses/${id}/info`, { title, description }, {
        headers: getAuthHeader()
    });
    return response.data;
};