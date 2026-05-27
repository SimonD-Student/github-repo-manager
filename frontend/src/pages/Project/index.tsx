import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectHeader } from '../../components/project/ProjectHeader/ProjectHeader';
import { ConfigurationCard, type ProjectConfigData } from '../../components/project/ConfigurationCard/ConfigurationCard';
import { UrlCard } from '../../components/project/UrlCard/UrlCard';
import {getCourseByIdAPI, updateCourseConfigAPI, generateParticipationUrlAPI} from '../../api/course.api';
import styles from './Project.module.css';

export const Project = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // État pour les données du cours (titre, etc.)
    const [courseInfo, setCourseInfo] = useState<{ title: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [participationToken, setParticipationToken] = useState<string>('');

    // État local pour le formulaire, passé à ConfigurationCard
    const [formData, setFormData] = useState<ProjectConfigData>({
        githubOrganization: '',
        minContributors: 2,
        maxContributors: 4,
        repoNameFormat: 'Groupe{XX}'
    });

    // Charger les infos du cours au démarrage pour le titre du Header
    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                const data = await getCourseByIdAPI(courseId);
                setCourseInfo(data);

                setParticipationToken(data.participationUrl || '');

                // Si la BDD contient déjà une config, on pré-remplit le formulaire ici :
                setFormData({
                    githubOrganization: data.githubOrganization || '',
                    minContributors: data.minContributors || 2,
                    maxContributors: data.maxContributors || 4,
                    repoNameFormat: data.repoNameFormat || 'Groupe{XX}'
                });
            } catch (error) {
                console.error("Erreur lors de la récupération du cours", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleSave = async () => {
        if (!courseId) return;
        try {
            await updateCourseConfigAPI(courseId, formData);
            alert("Configuration sauvegardée avec succès !"); // On met une simple alerte pour l'instant
        } catch (error) {
            console.error("Erreur lors de la sauvegarde", error);
            alert("Erreur lors de la sauvegarde");
        }
    };

    const handleGenerateUrl = async () => {
        if (!courseId) return;
        try {
            const data = await generateParticipationUrlAPI(courseId);
            setParticipationToken(data.participationUrl);
        } catch (error) {
            console.error("Erreur lors de la génération de l'URL", error);
            alert("Erreur lors de la génération de l'URL");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <ProjectHeader courseTitle={courseInfo?.title} isLoading={isLoading} />

            <div className={styles.mainContent}>
                <ConfigurationCard data={formData} onChange={setFormData} />
                <UrlCard
                    participationToken={participationToken}
                    onGenerate={handleGenerateUrl}
                />

                {/* Footer Actions */}
                <div className={styles.actionFooter}>
                    <button className={styles.cancelBtn} onClick={() => navigate('/dashboard')}>
                        Annuler
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave}>
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