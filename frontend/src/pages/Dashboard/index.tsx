import { useAuth } from '../../context/AuthContext';

export const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Tableau de bord</h1>
            <p>Bienvenue, <strong>{user?.email}</strong> ! Vous êtes bien connecté.</p>

            <button
                onClick={logout}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    backgroundColor: '#0a0a0a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem'
                }}
            >
                Se déconnecter
            </button>
        </div>
    );
};