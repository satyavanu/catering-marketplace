'use client';

import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Bell, RefreshCw, Send } from 'lucide-react';
import {
  createAdminPushCampaign,
  fetchAdminPushCampaigns,
  type AdminPushCampaign,
} from '@/lib/admin-push-notifications-api';

const initialForm = {
  title: '',
  body: '',
  targetTopicKey: 'all_users',
  deeplinkUrl: '/offers',
  imageUrl: '',
  sendNow: true,
};

export default function AdminPushNotificationsPage() {
  const [campaigns, setCampaigns] = useState<AdminPushCampaign[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCampaigns = async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      setCampaigns(await fetchAdminPushCampaigns());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load push campaigns.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const campaign = await createAdminPushCampaign({
        title: form.title.trim(),
        body: form.body.trim(),
        targetType: 'topic',
        targetTopicKey: form.targetTopicKey.trim(),
        deeplinkUrl: form.deeplinkUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        sendNow: form.sendNow,
      });
      setCampaigns((current) => [campaign, ...current]);
      setForm(initialForm);
      setSuccess(
        campaign.status === 'sent'
          ? 'Push campaign sent to FCM.'
          : 'Push campaign saved.'
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create push campaign.'
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const stats = useMemo(
    () => ({
      total: campaigns.length,
      sent: campaigns.filter((campaign) => campaign.status === 'sent').length,
      draft: campaigns.filter((campaign) => campaign.status === 'draft').length,
      failed: campaigns.filter((campaign) => campaign.status === 'failed')
        .length,
    }),
    [campaigns]
  );

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Marketing</p>
          <h1 style={styles.title}>Push Notifications</h1>
          <p style={styles.subtitle}>
            Create topic-based FCM campaigns for customers, partners, cities,
            and other derived notification audiences.
          </p>
        </div>
        <button
          type="button"
          style={styles.refreshButton}
          onClick={() => loadCampaigns('refresh')}
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
        <Stat label="Total campaigns" value={stats.total} />
        <Stat label="Sent" value={stats.sent} />
        <Stat label="Draft" value={stats.draft} />
        <Stat label="Failed" value={stats.failed} />
      </section>

      <section style={styles.grid}>
        <form style={styles.formPanel} onSubmit={createCampaign}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>New campaign</h2>
              <p style={styles.panelSub}>Default topic: all_users</p>
            </div>
            <Bell size={22} color="#7c3aed" />
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}
          {success ? <div style={styles.success}>{success}</div> : null}

          <Field label="Title">
            <input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
              style={styles.input}
              placeholder="Weekend catering offer"
            />
          </Field>

          <Field label="Body">
            <textarea
              value={form.body}
              onChange={(event) =>
                setForm({ ...form, body: event.target.value })
              }
              required
              rows={4}
              style={styles.textarea}
              placeholder="Get premium catering options for your next event."
            />
          </Field>

          <div style={styles.twoColumns}>
            <Field label="Topic key">
              <input
                value={form.targetTopicKey}
                onChange={(event) =>
                  setForm({ ...form, targetTopicKey: event.target.value })
                }
                required
                style={styles.input}
              />
            </Field>
            <Field label="Deeplink">
              <input
                value={form.deeplinkUrl}
                onChange={(event) =>
                  setForm({ ...form, deeplinkUrl: event.target.value })
                }
                style={styles.input}
              />
            </Field>
          </div>

          <Field label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(event) =>
                setForm({ ...form, imageUrl: event.target.value })
              }
              style={styles.input}
              placeholder="https://..."
            />
          </Field>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.sendNow}
              onChange={(event) =>
                setForm({ ...form, sendNow: event.target.checked })
              }
            />
            Send immediately
          </label>

          <button type="submit" style={styles.submitButton} disabled={saving}>
            <Send size={17} />
            {saving ? 'Sending' : 'Create campaign'}
          </button>
        </form>

        <section style={styles.panel}>
          <div style={{ ...styles.panelHeader, ...styles.historyHeader }}>
            <div>
              <h2 style={styles.panelTitle}>Campaign history</h2>
              <p style={styles.panelSub}>notification_campaigns</p>
            </div>
          </div>

          {loading ? (
            <EmptyState text="Loading push campaigns..." />
          ) : campaigns.length === 0 ? (
            <EmptyState text="No push campaigns yet." />
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <Th>Campaign</Th>
                    <Th>Topic</Th>
                    <Th>Status</Th>
                    <Th>Sent</Th>
                    <Th>Created</Th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} style={styles.row}>
                      <Td strong>
                        <span style={styles.campaignTitle}>
                          {campaign.title}
                          <small>{campaign.body}</small>
                        </span>
                      </Td>
                      <Td>{campaign.target_topic_key || '-'}</Td>
                      <Td>
                        <span style={statusStyle(campaign.status)}>
                          {campaign.status}
                        </span>
                      </Td>
                      <Td>{formatDateTime(campaign.sent_at)}</Td>
                      <Td>{formatDateTime(campaign.created_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={styles.field}>
      <span>{label}</span>
      {children}
    </label>
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

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function statusStyle(status: string): CSSProperties {
  const color =
    status === 'sent' ? '#047857' : status === 'failed' ? '#b91c1c' : '#6d28d9';
  const background =
    status === 'sent' ? '#ecfdf5' : status === 'failed' ? '#fef2f2' : '#f8f5ff';

  return {
    display: 'inline-flex',
    padding: '5px 9px',
    borderRadius: 999,
    background,
    color,
    fontSize: 11,
    fontWeight: 950,
    textTransform: 'uppercase',
  };
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(0, 1.4fr)',
    gap: 18,
    alignItems: 'start',
  },
  formPanel: {
    display: 'grid',
    gap: 16,
    padding: 20,
    border: '1px solid #e8eaf0',
    borderRadius: 14,
    background: '#ffffff',
    boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
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
  },
  historyHeader: {
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
  field: {
    display: 'grid',
    gap: 7,
    color: '#334155',
    fontSize: 12,
    fontWeight: 900,
  },
  input: {
    minHeight: 42,
    width: '100%',
    border: '1px solid #ddd6fe',
    borderRadius: 8,
    padding: '0 12px',
    color: '#111827',
    fontSize: 13,
    fontWeight: 750,
    outline: 'none',
  },
  textarea: {
    width: '100%',
    border: '1px solid #ddd6fe',
    borderRadius: 8,
    padding: 12,
    color: '#111827',
    fontSize: 13,
    fontWeight: 750,
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
  },
  checkboxRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    color: '#334155',
    fontSize: 13,
    fontWeight: 850,
  },
  submitButton: {
    minHeight: 46,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    border: 0,
    borderRadius: 8,
    background: '#7c3aed',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 950,
    cursor: 'pointer',
  },
  error: {
    padding: '10px 12px',
    borderRadius: 8,
    background: '#fef2f2',
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: 850,
  },
  success: {
    padding: '10px 12px',
    borderRadius: 8,
    background: '#ecfdf5',
    color: '#047857',
    fontSize: 12,
    fontWeight: 850,
  },
  tableWrap: {
    overflowX: 'auto',
    marginTop: 12,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 760,
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
  campaignTitle: {
    display: 'grid',
    gap: 4,
    maxWidth: 260,
    whiteSpace: 'normal',
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
