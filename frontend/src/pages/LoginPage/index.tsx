// src/pages/Login/CourseCard.tsx
import { LoginCard } from '../../components/auth/LoginCard';
import styles from './LoginPage.module.css';

export const Login = () => {
    return (
        <div className={styles.pageContainer}>
            <LoginCard />
        </div>
    );
};