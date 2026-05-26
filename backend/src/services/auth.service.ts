import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../repositories/auth.repository.js';

export const loginUser = async (email: string, password: string) => {
    // 1. Chercher l'utilisateur dans la base
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Identifiants invalides'); // On reste vague pour la sécurité
    }

    // 2. Vérifier si le mot de passe correspond au hachage
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Identifiants invalides');
    }

    // 3. Générer le token JWT
    // On cache l'ID de l'utilisateur et son email dedans
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' } // Le token expire dans 24 heures
    );

    return { token, email: user.email };
};