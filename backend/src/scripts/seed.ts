import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB } from '../db/mongoDB.js'; // Ajustez le chemin si besoin
import { User } from '../models/user.model.js';
import { encrypt } from '../utils/crypto.util.js';

dotenv.config();

const seedAdmin = async () => {
    await connectDB();

    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;
    const githubToken = process.env.GITHUB_PAT;

    if (!email || !password || !githubToken) {
        console.error(' Variables manquantes dans le .env');
        process.exit(1);
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`L'utilisateur existe déjà.`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const githubTokenEncrypted = encrypt(githubToken);

        await User.create({
            email,
            passwordHash,
            githubTokenEncrypted
        });

        console.log(`Administrateur créé avec succès avec son Token chiffré !`);
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedAdmin();