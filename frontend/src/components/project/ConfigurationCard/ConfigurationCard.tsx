import styles from './ConfigurationCard.module.css';

export interface ProjectConfigData {
    githubOrganization: string;
    minContributors: number;
    maxContributors: number;
    repoNameFormat: string;
}

interface ConfigurationCardProps {
    data: ProjectConfigData;
    onChange: (newData: ProjectConfigData) => void;
    isLocked: boolean;
}

export const ConfigurationCard = ({ data, onChange, isLocked }: ConfigurationCardProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Configuration Repository</h2>
                <p className={styles.cardSubtitle}>Configurez les paramètres pour la création automatique des repositories GitHub</p>
            </div>

            {isLocked && (
                <div className={styles.lockedAlert}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px' }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    La configuration est verrouillée car le lien d'inscription a déjà été généré.
                </div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>Organisation GitHub *</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="ex: universite-web1"
                    value={data.githubOrganization || ''}
                    onChange={(e) => onChange({...data, githubOrganization: e.target.value})}
                    disabled={isLocked}
                />
            </div>

            <div className={styles.formRow}>
                <div>
                    <label className={styles.label}>Nombre minimum de contributeurs</label>
                    <select
                        className={styles.select}
                        value={data.minContributors}
                        onChange={(e) => {
                            const newMin = Number(e.target.value);
                            const newMax = data.maxContributors < newMin ? newMin : data.maxContributors;
                            onChange({ ...data, minContributors: newMin, maxContributors: newMax });
                        }}
                        disabled={isLocked}
                    >
                        {[1, 2, 3, 4, 5].map(num => <option key={`min-${num}`} value={num}>{num}</option>)}
                    </select>
                </div>
                <div>
                    <label className={styles.label}>Nombre maximum de contributeurs</label>
                    <select
                        className={styles.select}
                        value={data.maxContributors}
                        onChange={(e) => onChange({...data, maxContributors: Number(e.target.value)})}
                        disabled={isLocked}
                    >
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option
                                key={`max-${num}`}
                                value={num}
                                disabled={num < data.minContributors}
                            >
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>Format de nom de repository *</label>
                <input
                    type="text"
                    className={styles.input}
                    value={data.repoNameFormat}
                    onChange={(e) => onChange({...data, repoNameFormat: e.target.value})}
                    disabled={isLocked}
                />
            </div>
        </div>
    );
};