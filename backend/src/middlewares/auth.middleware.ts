import type {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    // On récupère le token
    const token = authHeader.split(' ')[1];

    // NOUVEAU : On vérifie que le token existe bien pour rassurer TypeScript
    if (!token) {
        return res.status(401).json({ message: 'Token malformé.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as { userId: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};