import styles from './ConfigurationCard.module.css';

// Définition de la forme de nos données de config
export interface ProjectConfigData {
    githubOrganization: string;
    minContributors: number;
    maxContributors: number;
    repoNameFormat: string;
}

interface ConfigurationCardProps {
    data: ProjectConfigData;
    onChange: (newData: ProjectConfigData) => void;
}

export const ConfigurationCard = ({ data, onChange }: ConfigurationCardProps) => {
    return (
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
                    value={data.githubOrganization}
                    onChange={(e) => onChange({...data, githubOrganization: e.target.value})}
                />
                <span className={styles.helperText}>L'organisation GitHub où seront créés les repositories des groupes</span>
            </div>

            <div className={styles.formRow}>
                <div>
                    <label className={styles.label}>Nombre minimum de contributeurs</label>
                    <select
                        className={styles.select}
                        value={data.minContributors}
                        onChange={(e) => onChange({...data, minContributors: Number(e.target.value)})}
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
                    >
                        {[2, 3, 4, 5, 6, 7, 8].map(num => <option key={`max-${num}`} value={num}>{num}</option>)}
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
                />
                <span className={styles.helperText}>Utilisez {'{XX}'} pour le numéro de groupe (sera remplacé par 01, 02, etc.)</span>
            </div>
        </div>
    );
};