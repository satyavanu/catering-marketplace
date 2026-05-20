'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  type CampaignPartnerLead,
  fetchCampaignPartnerLeads,
} from '@/lib/campaign-partner-leads';

export default function AdminCampaignLeadsPage() {
  const [leads, setLeads] = useState<CampaignPartnerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadLeads = async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const nextLeads = await fetchCampaignPartnerLeads();
      setLeads(nextLeads);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load campaign leads.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const stats = useMemo(
    () => ({
      total: leads.length,
      verified: leads.filter((lead) => lead.phoneVerified).length,
      newLeads: leads.filter((lead) => lead.status === 'new').length,
      cities: new Set(leads.map((lead) => lead.city).filter(Boolean)).size,
    }),
    [leads]
  );

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Campaigns</p>
          <h1 style={styles.title}>Campaign Leads</h1>
          <p style={styles.subtitle}>
            Partner onboarding leads captured from the campaign landing page,
            ordered by newest created date.
          </p>
        </div>
        <button
          type="button"
          style={styles.refreshButton}
          onClick={() => loadLeads('refresh')}
          disabled={refreshing || loading}
        >
          <RefreshCw
            size={17}
            style={refreshing ? styles.spinIcon : undefined}
          />
          {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </section>

      <section style={styles.statsGrid}>
        <Stat label="Total leads" value={stats.total} />
        <Stat label="Verified phones" value={stats.verified} />
        <Stat label="New status" value={stats.newLeads} />
        <Stat label="Cities" value={stats.cities} />
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>Lead documents</h2>
            <p style={styles.panelSub}>
              Firestore collection: campaign_partner_leads
            </p>
          </div>
        </div>

        {loading ? (
          <EmptyState text="Loading campaign leads..." />
        ) : error ? (
          <EmptyState text={error} />
        ) : leads.length === 0 ? (
          <EmptyState text="No campaign leads yet." />
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>City</Th>
                  <Th>Partner type</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Document</Th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={styles.row}>
                    <Td strong>{lead.name || '-'}</Td>
                    <Td>
                      <span style={styles.phoneCell}>
                        {lead.phone || '-'}
                        {lead.phoneVerified ? (
                          <span style={styles.verifiedPill}>Verified</span>
                        ) : null}
                      </span>
                    </Td>
                    <Td>{lead.city || '-'}</Td>
                    <Td>{formatPartnerType(lead.partnerType)}</Td>
                    <Td>
                      <span style={styles.statusPill}>
                        {formatPartnerType(lead.status)}
                      </span>
                    </Td>
                    <Td>{formatDateTime(lead.createdAt)}</Td>
                    <Td>
                      <code style={styles.docId}>{lead.id}</code>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div style={styles.emptyState}>{text}</div>;
}

function Th({ children }: { children: ReactNode }) {
  return <th style={styles.th}>{children}</th>;
}

function Td({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <td style={{ ...styles.td, ...(strong ? styles.tdStrong : null) }}>
      {children}
    </td>
  );
}

function formatPartnerType(value: string) {
  if (!value) return '-';
  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDateTime(value: Date | null) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

const styles: Record<string, CSSProperties> = {
  page: {
    display: 'grid',
    gap: 22,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 18,
    padding: 26,
    border: '1px solid #e8eaf0',
    borderRadius: 14,
    background:
      'linear-gradient(135deg, #ffffff 0%, #fbf7ff 52%, #fff7ed 100%)',
    boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    color: '#111827',
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: 950,
  },
  subtitle: {
    maxWidth: 680,
    margin: '10px 0 0',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.65,
    fontWeight: 650,
  },
  refreshButton: {
    minHeight: 42,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '0 16px',
    border: '1px solid #ddd6fe',
    borderRadius: 8,
    background: '#ffffff',
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: 900,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  spinIcon: {
    animation: 'spin 0.8s linear infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
  },
  statCard: {
    minHeight: 92,
    display: 'grid',
    alignContent: 'center',
    gap: 6,
    padding: 18,
    border: '1px solid #e8eaf0',
    borderRadius: 12,
    background: '#ffffff',
    boxShadow: '0 12px 26px rgba(15, 23, 42, 0.05)',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 850,
  },
  statValue: {
    color: '#111827',
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 950,
  },
  panel: {
    border: '1px solid #e8eaf0',
    borderRadius: 14,
    background: '#ffffff',
    boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: '20px 22px',
    borderBottom: '1px solid #eef2f7',
  },
  panelTitle: {
    margin: 0,
    color: '#111827',
    fontSize: 18,
    fontWeight: 950,
  },
  panelSub: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 750,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 920,
  },
  th: {
    padding: '13px 16px',
    background: '#f8fafc',
    color: '#64748b',
    borderBottom: '1px solid #e8eaf0',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 950,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  row: {
    borderBottom: '1px solid #eef2f7',
  },
  td: {
    padding: '15px 16px',
    color: '#334155',
    fontSize: 13,
    fontWeight: 700,
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  tdStrong: {
    color: '#111827',
    fontWeight: 950,
  },
  phoneCell: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  verifiedPill: {
    padding: '3px 8px',
    borderRadius: 999,
    background: '#ecfdf5',
    color: '#047857',
    fontSize: 11,
    fontWeight: 900,
  },
  statusPill: {
    display: 'inline-flex',
    padding: '5px 9px',
    borderRadius: 999,
    background: '#f3e8ff',
    color: '#6d28d9',
    fontSize: 11,
    fontWeight: 950,
  },
  docId: {
    color: '#64748b',
    fontSize: 11,
    background: '#f8fafc',
    padding: '4px 6px',
    borderRadius: 6,
  },
  emptyState: {
    minHeight: 180,
    display: 'grid',
    placeItems: 'center',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 800,
  },
};
