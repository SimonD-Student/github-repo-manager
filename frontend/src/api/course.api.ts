import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Petite fonction utilitaire pour générer l'en-tête d'autorisation
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

export const createCourseAPI = async (title: string, description: string) => {
    const response = await axios.post(`${API_URL}/courses`, { title, description }, {
        headers: getAuthHeader()
    });
    return response.data;
};