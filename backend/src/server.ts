import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { connectDB } from './db/mongoDB.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/courses.routes.js';
import publicRoutes from './routes/public.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/public', publicRoutes);


const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
};

startServer();