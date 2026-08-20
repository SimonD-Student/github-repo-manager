import axios from 'axios';

// L'URL de base de notre backend (Assurez-vous que votre backend tourne bien sur le port 3000)
const API_URL = 'http://localhost:3000/api';

export const loginAPI = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
    });

    return response.data;
};