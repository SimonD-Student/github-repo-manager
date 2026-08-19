import styles from './GroupsListCard.module.css';

export interface GroupData {
    _id: string;
    name: string;
    repoUrl: string;
    members: Array<{ fullName: string; githubId: string }>;
}

interface GroupsListCardProps {
    groups: GroupData[];
}

export const GroupsListCard = ({ groups }: GroupsListCardProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Groupes Créés</h2>
                <p className={styles.cardSubtitle}>Liste des groupes qui ont été créés pour ce cours</p>
            </div>

            {groups.length === 0 ? (
                <div className={styles.emptyState}>
                    Aucun groupe n'a encore été créé par les étudiants.
                </div>
            ) : (
                <div className={styles.groupsList}>
                    {groups.map((group) => (
                        <div key={group._id} className={styles.groupItem}>
                            <div className={styles.groupInfo}>
                                <div className={styles.groupTitleRow}>
                                    <svg className={styles.groupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    <h3 className={styles.groupName}>{group.name}</h3>
                                    <span className={styles.badge}>{group.members.length} membres</span>
                                </div>
                                <p className={styles.membersList}>
                                    {group.members.map(m => m.fullName).join(', ')}
                                </p>
                            </div>
                            <a href={group.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn} title="Voir sur GitHub">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};