import styles from './UrlCard.module.css';

export const UrlCard = () => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>URL de Participation</h2>
                <p className={styles.cardSubtitle}>Générez une URL que les étudiants utiliseront pour s'inscrire et créer leurs groupes</p>
            </div>
            <button className={styles.generateUrlBtn} onClick={() => alert("Fonctionnalité à venir !")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Générer URL de Participation
            </button>
        </div>
    );
};