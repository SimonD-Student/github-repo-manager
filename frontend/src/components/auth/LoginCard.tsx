import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Ajout de l'import
import styles from './LoginCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { loginAPI } from '../../api/auth.api';

export const LoginCard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await loginAPI(email, password);
            login(data.token, data.user);

            navigate('/dashboard');

        } catch (err: any) {
            const message = err.response?.data?.message || 'Une erreur est survenue lors de la connexion.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginCard}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img src="github-icon.svg" alt="GitHub Logo" />
                </div>
                <h1 className={styles.title}>GitRepo Manager</h1>
                <p className={styles.subtitle}>Connectez-vous pour gérer vos repositories GitHub</p>
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nom d'utilisateur</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre nom d'utilisateur"
                        className={styles.input}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        className={styles.input}
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
};