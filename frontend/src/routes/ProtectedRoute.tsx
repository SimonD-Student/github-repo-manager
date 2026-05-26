import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();

    // Si on n'a pas de token, on redirige de force vers la page de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si on a un token, on affiche le composant enfant (le Dashboard)
    return <>{children}</>;
};