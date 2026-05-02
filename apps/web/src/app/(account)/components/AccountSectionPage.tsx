'use client';

import type React from 'react';

type AccountSectionPageProps = {
  title: string;
  description: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  actions?: string[];
};

export default function AccountSectionPage({
  title,
  description,
  stats = [],
  actions = [],
}: AccountSectionPageProps) {
  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Account workspace</p>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.description}>{description}</p>
        </div>
      </section>

      {stats.length > 0 && (
        <section style={styles.statsGrid}>
          {stats.map((stat) => (
            <article key={stat.label} style={styles.statCard}>
              <span style={styles.statLabel}>{stat.label}</span>
              <strong style={styles.statValue}>{stat.value}</strong>
            </article>
          ))}
        </section>
      )}

      {actions.length > 0 && (
        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Next actions</h3>
          <div style={styles.actionList}>
            {actions.map((action) => (
              <div key={action} style={styles.actionItem}>
                <span style={styles.actionDot} />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  header: {
    padding: 24,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    boxShadow: '0 14px 30px rgba(17, 24, 39, 0.05)',
  },

  eyebrow: {
    margin: '0 0 8px',
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 850,
    textTransform: 'uppercase',
  },

  title: {
    margin: 0,
    color: '#151126',
    fontSize: 28,
    fontWeight: 800,
  },

  description: {
    maxWidth: 720,
    margin: '10px 0 0',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.6,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
  },

  statCard: {
    minHeight: 104,
    padding: 18,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  statLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
  },

  statValue: {
    color: '#151126',
    fontSize: 24,
    fontWeight: 900,
  },

  panel: {
    padding: 22,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
  },

  panelTitle: {
    margin: '0 0 14px',
    color: '#151126',
    fontSize: 17,
    fontWeight: 850,
  },

  actionList: {
    display: 'grid',
    gap: 10,
  },

  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#475569',
    fontSize: 14,
  },

  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: '#7c3aed',
    flexShrink: 0,
  },
};
