import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI as string;
        await mongoose.connect(uri);
        console.log('📦 Connecté à MongoDB avec succès');
    } catch (error) {
        console.error(' Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};