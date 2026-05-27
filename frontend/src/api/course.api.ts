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
    // On utilise POST car c'est une action qui crée une nouvelle ressource (le token)
    const response = await axios.post(`${API_URL}/courses/${id}/generate-url`, {}, {
        headers: getAuthHeader()
    });
    return response.data; // Renverra { participationUrl: 'e8f7a6...' }
};

// Ajoutez ceci :
export const getPublicCourseAPI = async (token: string) => {
    // Attention, on ne met PAS le getAuthHeader() ici !
    const response = await axios.get(`${API_URL}/public/course/${token}`);
    return response.data;
};