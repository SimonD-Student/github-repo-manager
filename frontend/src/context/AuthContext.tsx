import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    user: any | null;
    login: (token: string, user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Initialisation paresseuse (Lazy initialization)
    // React va chercher dans le localStorage UNIQUEMENT au premier chargement de la page
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    const [user, setUser] = useState<any | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (newToken: string, userData: any) => {
        setToken(newToken);
        setUser(userData);
        // 2. On sauvegarde physiquement dans le navigateur
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        // 3. On nettoie tout à la déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};