import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/mongoDB.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/courses.routes.js';
import publicRoutes from './routes/public.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARES GLOBAUX ===
// Autorise le frontend (Vite) à faire des requêtes vers ce backend
app.use(cors());
// Permet à Express de lire les données envoyées en JSON dans le body des requêtes
app.use(express.json());

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/public', publicRoutes);

// === LANCEMENT DU SERVEUR ===
const startServer = async () => {
    await connectDB(); // On se connecte d'abord à MongoDB
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
};

startServer();