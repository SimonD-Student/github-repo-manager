import { User } from '../models/user.model.js';

// Cherche un utilisateur par son email
export const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};