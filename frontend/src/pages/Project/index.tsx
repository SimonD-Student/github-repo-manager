import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Project.module.css';

export const CourseDetails = () => {
    const { courseId } = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();

    // État local temporaire pour le formulaire
    const [formData, setFormData] = useState({
        githubOrganization: '',
        minContributors: 2,
        maxContributors: 4,
        repoNameFormat: 'Groupe{XX}'
    });

    return (
        <div className={styles.pageContainer}>
            {/* Top Bar */}
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
                    <h1 className={styles.courseTitle}>Mobile Dev</h1> {/* Titre en dur pour l'instant */}
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Carte Configuration */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Configuration Repository</h2>
                        <p className={styles.cardSubtitle}>Configurez les paramètres pour la création automatique des repositories GitHub</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Organisation GitHub *</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="ex: universite-web1"
                            value={formData.githubOrganization}
                            onChange={(e) => setFormData({...formData, githubOrganization: e.target.value})}
                        />
                        <span className={styles.helperText}>L'organisation GitHub où seront créés les repositories des groupes</span>
                    </div>

                    <div className={styles.formRow}>
                        <div>
                            <label className={styles.label}>Nombre minimum de contributeurs</label>
                            <select
                                className={styles.select}
                                value={formData.minContributors}
                                onChange={(e) => setFormData({...formData, minContributors: Number(e.target.value)})}
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={`min-${num}`} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={styles.label}>Nombre maximum de contributeurs</label>
                            <select
                                className={styles.select}
                                value={formData.maxContributors}
                                onChange={(e) => setFormData({...formData, maxContributors: Number(e.target.value)})}
                            >
                                {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <option key={`max-${num}`} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.label}>Format de nom de repository *</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.repoNameFormat}
                            onChange={(e) => setFormData({...formData, repoNameFormat: e.target.value})}
                        />
                        <span className={styles.helperText}>Utilisez {'{XX}'} pour le numéro de groupe (sera remplacé par 01, 02, etc.)</span>
                    </div>
                </div>

                {/* Carte URL de Participation */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>URL de Participation</h2>
                        <p className={styles.cardSubtitle}>Générez une URL que les étudiants utiliseront pour s'inscrire et créer leurs groupes</p>
                    </div>
                    <button className={styles.generateUrlBtn}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Générer URL de Participation
                    </button>
                </div>

                {/* Footer Actions */}
                <div className={styles.actionFooter}>
                    <button className={styles.cancelBtn} onClick={() => navigate('/dashboard')}>
                        Annuler
                    </button>
                    <button className={styles.saveBtn}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px' }}>
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Sauvegarder Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};