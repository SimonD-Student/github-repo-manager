import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

export const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <div className={styles.logo}>
                    <img src="/user/github-icon.svg" alt="Logo" />
                </div>
                <h1 className={styles.title}>GitRepo Manager</h1>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Professeur</span>
                    <span className={styles.userEmail}>{user?.email}</span>
                </div>
                <button onClick={logout} className={styles.logoutBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Déconnexion
                </button>
            </div>
        </header>
    );
};