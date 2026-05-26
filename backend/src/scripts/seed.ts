import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB } from '../db/mongoDB.js';
import { User } from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
    await connectDB();

    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;

    if (!email || !password) {
        console.error('❌ ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans le .env');
        process.exit(1);
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`⚠️ L'utilisateur ${email} existe déjà dans la base.`);
            process.exit(0);
        }

        // Hachage du mot de passe (Coût de 10)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Création de l'utilisateur
        await User.create({
            email,
            passwordHash
        });

        console.log(`✅ Administrateur ${email} créé avec succès !`);
    } catch (error) {
        console.error('❌ Erreur lors de la création:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Déconnecté de MongoDB');
        process.exit(0);
    }
};

seedAdmin();