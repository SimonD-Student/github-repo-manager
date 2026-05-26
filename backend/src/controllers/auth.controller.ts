import type {Request, Response} from 'express';
import { loginUser } from '../services/auth.service.js';

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        // Récupérer les données envoyées par le frontend
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        // Tenter la connexion via le service
        const result = await loginUser(email, password);

        // Si succès, on renvoie un code 200 et le token
        return res.status(200).json({
            message: 'Connexion réussie',
            token: result.token,
            user: { email: result.email }
        });

    } catch (error: any) {
        // Si échec (mauvais mot de passe, etc.), on renvoie une erreur 401 (Non autorisé)
        return res.status(401).json({ message: error.message || 'Erreur lors de la connexion' });
    }
};