import { useNavigate } from 'react-router-dom';
import styles from './ProjectHeader.module.css';

interface ProjectHeaderProps {
    courseTitle?: string; // Optionnel car il peut être en cours de chargement
    isLoading: boolean;
}

export const ProjectHeader = ({ courseTitle, isLoading }: ProjectHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className={styles.topBar}>
            <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Retour
            </button>
            <div className={styles.courseInfo}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
                {isLoading ? (
                    <div className={styles.skeletonTitle}></div>
                ) : (
                    <h1 className={styles.courseTitle}>{courseTitle || 'Projet inconnu'}</h1>
                )}
            </div>
        </div>
    );
};