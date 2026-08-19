import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectHeader } from '../../components/project/ProjectHeader/ProjectHeader';
import { ConfigurationCard, type ProjectConfigData } from '../../components/project/ConfigurationCard/ConfigurationCard';
import { UrlCard } from '../../components/project/UrlCard/UrlCard';
import {getCourseByIdAPI, updateCourseConfigAPI, generateParticipationUrlAPI, getCourseGroupsAPI} from '../../api/course.api';
import { GroupsListCard, type GroupData } from '../../components/project/GroupsListCard/GroupsListCard';
import styles from './Project.module.css';

export const Project = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [courseInfo, setCourseInfo] = useState<{ title: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [participationToken, setParticipationToken] = useState<string>('');
    const [groups, setGroups] = useState<GroupData[]>([]);

    const [formData, setFormData] = useState<ProjectConfigData>({
        githubOrganization: '',
        minContributors: 2,
        maxContributors: 4,
        repoNameFormat: 'Groupe{XX}'
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) return;
            try {
                const [courseData, groupsData] = await Promise.all([
                    getCourseByIdAPI(courseId),
                    getCourseGroupsAPI(courseId)
                ]);

                setCourseInfo(courseData);
                setParticipationToken(courseData.participationUrl || '');
                setFormData({ /* ... */ });

                // On met à jour l'état des groupes
                setGroups(groupsData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCourseData();
    }, [courseId]);

    const handleSave = async () => {
        if (!courseId) return;
        try {
            await updateCourseConfigAPI(courseId, formData);
            alert("Configuration sauvegardée avec succès !");
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

                <GroupsListCard groups={groups} />

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