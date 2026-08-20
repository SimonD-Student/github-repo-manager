import { useState, useEffect } from 'react';
import { createCourseAPI, updateCourseInfoAPI } from '../../../api/course.api';
import styles from './CreateCourseModal.module.css';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseToEdit?: { _id: string; title: string; description: string } | null;
}

export const CreateCourseModal = ({ isOpen, onClose, onSuccess, courseToEdit }: CreateCourseModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (courseToEdit) {
                setTitle(courseToEdit.title);
                setDescription(courseToEdit.description);
            } else {
                setTitle('');
                setDescription('');
            }
            setError(null);
        }
    }, [isOpen, courseToEdit]);

    if (!isOpen) return null;

    const isEditing = !!courseToEdit;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isEditing && courseToEdit) {
                await updateCourseInfoAPI(courseToEdit._id, title, description);
            } else {
                await createCourseAPI(title, description);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || `Erreur lors de la ${isEditing ? 'modification' : 'création'} du cours`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{isEditing ? 'Modifier le projet' : 'Créer un nouveau projet'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <p className={styles.subtitle}>
                    {isEditing
                        ? "Modifiez le nom ou la description de ce cours."
                        : "Remplissez les informations pour créer un nouveau projet. Vous pourrez configurer les repositories GitHub par la suite."}
                </p>

                {error && <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nom du projet *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ex: Web 1, Java B2, Mobile Dev..."
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez brièvement le contenu du cours..."
                            className={styles.textarea}
                            required
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isLoading}>
                            Annuler
                        </button>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? 'Enregistrement...' : (isEditing ? 'Sauvegarder' : 'Créer le cours')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};