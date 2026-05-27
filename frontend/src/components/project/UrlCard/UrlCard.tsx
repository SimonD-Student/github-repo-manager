import styles from './UrlCard.module.css';

interface UrlCardProps {
    participationToken: string;
    onGenerate: () => void;
}

export const UrlCard = ({ participationToken, onGenerate }: UrlCardProps) => {
    // On construit l'URL finale avec le domaine actuel (ex: http://localhost:5173/join/...)
    const fullUrl = participationToken ? `${window.location.origin}/join/${participationToken}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        alert("URL copiée dans le presse-papiers !");
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>URL de Participation</h2>
                <p className={styles.cardSubtitle}>Générez une URL que les étudiants utiliseront pour s'inscrire et créer leurs groupes</p>
            </div>

            {!participationToken ? (
                <button className={styles.generateUrlBtn} onClick={onGenerate}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Générer URL de Participation
                </button>
            ) : (
                <div className={styles.urlContainer}>
                    <input
                        type="text"
                        readOnly
                        value={fullUrl}
                        className={styles.urlInput}
                    />
                    <button className={styles.copyBtn} onClick={handleCopy}>
                        Copier
                    </button>
                </div>
            )}
        </div>
    );
};