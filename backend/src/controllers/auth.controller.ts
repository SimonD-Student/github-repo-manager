import type {Request, Response} from 'express';
import { loginUser } from '../services/auth.service.js';

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const result = await loginUser(email, password);

        return res.status(200).json({
            message: 'Connexion réussie',
            token: result.token,
            user: { email: result.email }
        });

    } catch (error: any) {
        return res.status(401).json({ message: error.message || 'Erreur lors de la connexion' });
    }
};