import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/LoginPage';
import { Dashboard } from '../pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Redirection par défaut : si l'URL n'existe pas, on renvoie vers le login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};