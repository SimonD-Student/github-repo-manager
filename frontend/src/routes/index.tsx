import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/LoginPage/index'; // Vérifiez vos imports !
import { Dashboard } from '../pages/Dashboard/index';
import { CourseDetails } from '../pages/Project/index'; // 1. L'import
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* 2. La nouvelle route dynamique avec :courseId */}
            <Route path="/course/:courseId" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};