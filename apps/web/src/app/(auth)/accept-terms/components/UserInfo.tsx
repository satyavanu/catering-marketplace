import { Mail, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

const userInfo = () => {
  const { data: session, status, update: updateSession } = useSession();
  return (
    <div style={styles.userInfoBox}>
      <h3 style={styles.userInfoTitle}>Your Account</h3>
      <div style={styles.userInfoGrid}>
        <div style={styles.userInfoItem}>
          <Mail size={18} color="#667eea" />
          <div>
            <p style={styles.userInfoLabel}>Email</p>
            <p style={styles.userInfoValue}>{session?.user?.email}</p>
          </div>
        </div>

        <div style={styles.userInfoItem}>
          <Users size={18} color="#f59e0b" />
          <div>
            <p style={styles.userInfoLabel}>Name</p>
            <p style={styles.userInfoValue}>
              {session?.user?.name || 'Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  userInfoBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  userInfoTitle: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    margin: '0 0 1rem 0',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  userInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
  } as React.CSSProperties,
  userInfoItem: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  userInfoLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,
  userInfoValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0.25rem 0 0 0',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,
};
