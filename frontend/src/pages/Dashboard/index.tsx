import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header/Header';
import { CourseCard } from '../../components/dashboard/CourseCard/CourseCard';
import { CreateCourseModal } from '../../components/dashboard/CreateCourseModal/CreateCourseModal';
import { getCoursesAPI } from '../../api/course.api';
import styles from './Dashboard.module.css';

// On définit la forme d'un cours provenant de notre backend
interface Course {
    _id: string;
    title: string;
    description: string;
}

export const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fonction pour récupérer les cours
    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const data = await getCoursesAPI();
            setCourses(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des cours", error);
        } finally {
            setIsLoading(false);
        }
    };

    // On charge les cours au premier affichage du composant
    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Header />

            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <div>
                        <h2 className={styles.title}>Vos Cours</h2>
                        <p className={styles.subtitle}>Gérez et configurez vos cours avec création automatique de repositories</p>
                    </div>
                    <button className={styles.newCourseBtn} onClick={() => setIsModalOpen(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nouveau Cours
                    </button>
                </div>

                {isLoading ? (
                    <p style={{ color: '#6b7280' }}>Chargement de vos cours...</p>
                ) : courses.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>Vous n'avez pas encore créé de cours.</p>
                ) : (
                    <div className={styles.coursesGrid}>
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                id={course._id}
                                title={course.title}
                                description={course.description}
                            />
                        ))}
                    </div>
                )}
            </main>

            <CreateCourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCourses} // La modale déclenchera ce rafraîchissement au succès
            />
        </div>
    );
};