import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicCourseAPI, joinCourseAPI } from '../../api/course.api';
// Créez un fichier Join.module.css avec les styles inspirés de vos captures
import styles from './Join.module.css';

interface Participant {
    fullName: string;
    githubId: string;
}

export const Join = () => {
    const { token } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<any>(null); // Pour stocker le résultat final

    // On initialise avec un participant vide
    const [participants, setParticipants] = useState<Participant[]>([{ fullName: '', githubId: '' }]);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!token) return;
            try {
                const data = await getPublicCourseAPI(token);
                setCourse(data);
            } catch (err) {
                setError("Ce lien d'inscription est invalide ou n'existe plus.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [token]);

    const handleAddParticipant = () => {
        if (course && participants.length < course.maxContributors) {
            setParticipants([...participants, { fullName: '', githubId: '' }]);
        }
    };

    const handleParticipantChange = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index][field] = value;
        setParticipants(newParticipants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await joinCourseAPI(token, participants);
            setSuccessData(result); // On stocke la réponse (repoUrl, etc.)
        } catch (err: any) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de la création.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveParticipant = (indexToRemove: number) => {
        const newParticipants = participants.filter((_, index) => index !== indexToRemove);
        setParticipants(newParticipants);
    };

    if (successData) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.card} style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <h2 style={{ color: '#10b981', justifyContent: 'center' }}>🎉 Inscription réussie !</h2>
                    <p style={{ margin: '1rem 0' }}>Votre groupe <strong>{successData.repoName}</strong> a bien été créé.</p>

                    {successData.failedInvites?.length > 0 && (
                        <div className={styles.warningMessage} style={{ marginBottom: '1rem', textAlign: 'left' }}>
                            Attention : Les identifiants GitHub suivants n'ont pas pu être invités (pseudos incorrects) :
                            <strong> {successData.failedInvites.join(', ')}</strong>
                        </div>
                    )}

                    <a
                        href={successData.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.submitBtn}
                        style={{ display: 'inline-flex', textDecoration: 'none' }}
                    >
                        Accéder au Repository sur GitHub
                    </a>
                </div>
            </div>
        );
    }

    if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

    const isValid = participants.length >= course.minContributors &&
        participants.every(p => p.fullName.trim() !== '' && p.githubId.trim() !== '');

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Inscription de Groupe - {course.title}</h1>
                    <p>Créez votre groupe et générez votre repository</p>
                </div>
            </header>

            <main className={styles.mainContent}>
                {/* Carte Info Cours */}
                <div className={styles.card}>
                    <h2>Informations du Cours</h2>
                    <div className={styles.infoGrid}>
                        <div>
                            <span className={styles.label}>Cours</span>
                            <p className={styles.value}>{course.title}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Enseignant</span>
                            <p className={styles.value}>{course.teacherEmail}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Organisation GitHub</span>
                            <p className={styles.value}>{course.githubOrganization}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Format de repository</span>
                            <p className={styles.value}>{course.repoNameFormat}</p>
                        </div>
                    </div>
                    <div className={styles.badge}>
                        {course.minContributors}-{course.maxContributors} participants
                    </div>
                </div>

                {/* Formulaire Participants */}
                <div className={styles.card}>
                    <h2>Participants du Groupe</h2>
                    <p className={styles.subtitle}>Ajoutez le nom complet et l'identifiant GitHub de tous les membres</p>

                    <form onSubmit={handleSubmit}>
                        {participants.map((p, index) => (
                            <div key={index} className={styles.participantRow}>
                                {/* En-tête modifié avec le bouton de suppression */}
                                <div className={styles.participantHeader}>
                                    <h3>Participant {index + 1}</h3>
                                    {participants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParticipant(index)}
                                            className={styles.removeBtn}
                                            title="Retirer ce participant"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px' }}>
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <div>
                                        <label>Nom et Prénom</label>
                                        <input
                                            type="text"
                                            value={p.fullName}
                                            onChange={(e) => handleParticipantChange(index, 'fullName', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Identifiant GitHub</label>
                                        <input
                                            type="text"
                                            value={p.githubId}
                                            onChange={(e) => handleParticipantChange(index, 'githubId', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {participants.length < course.maxContributors && (
                            <button type="button" onClick={handleAddParticipant} className={styles.addBtn}>
                                + Ajouter un participant
                            </button>
                        )}

                        {participants.length < course.minContributors && (
                            <div className={styles.warningMessage}>
                                Minimum {course.minContributors} participants requis
                            </div>
                        )}

                        <div className={styles.submitContainer}>
                            <button type="submit" disabled={!isValid || isSubmitting} className={styles.submitBtn}>
                                {isSubmitting ? 'Création en cours...' : 'Créer le Groupe et Repository'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};