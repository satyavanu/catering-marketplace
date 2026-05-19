'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react';
import {
  useCurrentConsent,
  useUpdateCommunicationPreferences,
} from '@catering-marketplace/query-client';

type ChannelKey = 'emailMarketing' | 'smsMarketing' | 'pushNotifications';

type Channel = {
  key: ChannelKey;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const channels: Channel[] = [
  {
    key: 'emailMarketing',
    title: 'Email',
    description: 'Booking updates, payout notices, service approvals, and platform announcements.',
    icon: <Mail size={18} />,
  },
  {
    key: 'smsMarketing',
    title: 'SMS and WhatsApp',
    description: 'Time-sensitive booking, payment, cancellation, and account alerts.',
    icon: <MessageSquare size={18} />,
  },
  {
    key: 'pushNotifications',
    title: 'Push notifications',
    description: 'Instant operational updates when new requests or booking changes arrive.',
    icon: <Bell size={18} />,
  },
];

export default function PartnerSettingsPage() {
  const { data: session } = useSession();
  const consentQuery = useCurrentConsent();
  const updateCommunication = useUpdateCommunicationPreferences();
  const user = session?.user as
    | {
        name?: string | null;
        fullName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
        termsAccepted?: boolean;
        privacyAccepted?: boolean;
        marketingEmail?: boolean;
        marketingSms?: boolean;
        marketingPush?: boolean;
        onboarding?: { status?: string };
        isOnboardingCompleted?: boolean;
      }
    | undefined;

  const [preferences, setPreferences] = useState({
    emailMarketing: Boolean(user?.marketingEmail),
    smsMarketing: Boolean(user?.marketingSms),
    pushNotifications: Boolean(user?.marketingPush),
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const consent = consentQuery.data;
    setPreferences({
      emailMarketing: Boolean(
        consent?.emailMarketing ?? consent?.marketing_email ?? user?.marketingEmail
      ),
      smsMarketing: Boolean(
        consent?.smsMarketing ?? consent?.marketing_sms ?? user?.marketingSms
      ),
      pushNotifications: Boolean(
        consent?.pushNotifications ?? consent?.marketing_push ?? user?.marketingPush
      ),
    });
  }, [consentQuery.data, user?.marketingEmail, user?.marketingPush, user?.marketingSms]);

  const accountName = user?.fullName || user?.name || 'Partner';
  const onboardingStatus = user?.isOnboardingCompleted
    ? 'Completed'
    : prettyText(user?.onboarding?.status || 'Pending');
  const consentStatus = user?.termsAccepted && user?.privacyAccepted ? 'Accepted' : 'Pending';
  const activeChannels = useMemo(
    () => Object.values(preferences).filter(Boolean).length,
    [preferences]
  );

  const toggleChannel = (key: ChannelKey) => {
    setSaveMessage('');
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const savePreferences = () => {
    setSaveMessage('');
    updateCommunication.mutate(preferences, {
      onSuccess: () => setSaveMessage('Communication preferences updated.'),
      onError: (error) => setSaveMessage(error.message),
    });
  };

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Partner settings</p>
          <h1 style={styles.title}>Account and Settings</h1>
          <p style={styles.description}>
            Manage account identity, communication channels, business verification,
            payout readiness, and platform preferences from one place.
          </p>
        </div>
      </section>

      <section style={styles.summaryGrid}>
        <SummaryCard title="Account" value={accountName} detail={user?.email || 'Email pending'} icon={<UserRound size={20} />} />
        <SummaryCard title="Verification" value={onboardingStatus} detail="Business onboarding status" icon={<ShieldCheck size={20} />} />
        <SummaryCard title="Communication" value={`${activeChannels}/3 enabled`} detail="Operational alert channels" icon={<Bell size={20} />} />
        <SummaryCard title="Terms" value={consentStatus} detail="Legal and privacy consent" icon={<FileCheck2 size={20} />} />
      </section>

      <section style={styles.grid}>
        <div style={styles.mainColumn}>
          <SettingsSection
            title="Communication Channels"
            description="Choose how Droooly can reach you for account, booking, payment, and operational updates."
            icon={<Bell size={18} />}
          >
            <div style={styles.channelList}>
              {channels.map((channel) => (
                <button
                  key={channel.key}
                  type="button"
                  onClick={() => toggleChannel(channel.key)}
                  style={{
                    ...styles.channelCard,
                    ...(preferences[channel.key] ? styles.channelCardActive : {}),
                  }}
                >
                  <span style={styles.channelIcon}>{channel.icon}</span>
                  <span style={styles.channelText}>
                    <strong style={styles.channelTitle}>{channel.title}</strong>
                    <span style={styles.channelDescription}>{channel.description}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      ...styles.toggle,
                      ...(preferences[channel.key] ? styles.toggleActive : {}),
                    }}
                  >
                    <span
                      style={{
                        ...styles.toggleKnob,
                        ...(preferences[channel.key] ? styles.toggleKnobActive : {}),
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>

            <div style={styles.actionsRow}>
              <button
                type="button"
                onClick={savePreferences}
                disabled={updateCommunication.isPending}
                style={{
                  ...styles.primaryButton,
                  ...(updateCommunication.isPending ? styles.disabledButton : {}),
                }}
              >
                {updateCommunication.isPending ? 'Saving...' : 'Save Preferences'}
              </button>
              {saveMessage && (
                <span
                  style={{
                    ...styles.inlineStatus,
                    color: updateCommunication.isError ? '#b91c1c' : '#047857',
                  }}
                >
                  {saveMessage}
                </span>
              )}
            </div>
          </SettingsSection>

          <SettingsSection
            title="Account Information"
            description="Your sign-in identity and primary contact details used for secure account access."
            icon={<UserRound size={18} />}
          >
            <div style={styles.infoGrid}>
              <InfoItem label="Name" value={accountName} icon={<UserRound size={16} />} />
              <InfoItem label="Email" value={user?.email || 'Not added'} icon={<Mail size={16} />} />
              <InfoItem label="Phone" value={user?.phone || 'Not added'} icon={<Phone size={16} />} />
              <InfoItem label="Role" value={prettyText(user?.role || 'partner')} icon={<ShieldCheck size={16} />} />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Business and KYC Information"
            description="Keep business, tax, licence, KYC, and payout information ready for review and settlement."
            icon={<Building2 size={18} />}
          >
            <div style={styles.reviewGrid}>
              <ReviewItem title="Business profile" status={onboardingStatus} description="Kitchen profile, service details, and partner onboarding information." />
              <ReviewItem title="KYC documents" status="Locked" description="PAN, GST, FSSAI, and supporting verification documents are managed through onboarding review." />
              <ReviewItem title="Payout details" status="Locked" description="Bank account, UPI, and settlement readiness are shown on Earnings." />
            </div>
          </SettingsSection>
        </div>

        <aside style={styles.sideColumn}>
          <SettingsSection
            title="Security"
            description="Protect access to your partner workspace."
            icon={<Lock size={18} />}
          >
            <div style={styles.stack}>
              <InfoItem label="Login method" value="OTP / Social sign-in" icon={<Smartphone size={16} />} />
              <InfoItem label="Session state" value="Active" icon={<CheckCircle2 size={16} />} />
              <span style={styles.secondaryNote}>Profile editing is disabled for now.</span>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Payout Readiness"
            description="Quick checks for settlement setup."
            icon={<CreditCard size={18} />}
          >
            <div style={styles.checkList}>
              <CheckRow text="Business verification submitted" />
              <CheckRow text="Bank details available" />
              <CheckRow text="Legal consent accepted" checked={consentStatus === 'Accepted'} />
            </div>
          </SettingsSection>
        </aside>
      </section>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionIcon}>{icon}</span>
        <div>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <p style={styles.sectionDescription}>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <article style={styles.summaryCard}>
      <span style={styles.summaryIcon}>{icon}</span>
      <span style={styles.summaryTitle}>{title}</span>
      <strong style={styles.summaryValue}>{value}</strong>
      <span style={styles.summaryDetail}>{detail}</span>
    </article>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoIcon}>{icon}</span>
      <span>
        <span style={styles.infoLabel}>{label}</span>
        <strong style={styles.infoValue}>{value}</strong>
      </span>
    </div>
  );
}

function ReviewItem({
  title,
  status,
  description,
}: {
  title: string;
  status: string;
  description: string;
}) {
  return (
    <div style={styles.reviewItem}>
      <span>
        <strong style={styles.reviewTitle}>{title}</strong>
        <span style={styles.reviewDescription}>{description}</span>
      </span>
      <span style={styles.statusBadge}>{status}</span>
    </div>
  );
}

function CheckRow({ text, checked = true }: { text: string; checked?: boolean }) {
  return (
    <div style={styles.checkRow}>
      <CheckCircle2 size={16} color={checked ? '#047857' : '#94a3b8'} />
      <span>{text}</span>
    </div>
  );
}

function prettyText(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: {
    padding: 24,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)',
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#ef4d2f',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  title: { margin: 0, color: '#111827', fontSize: 28, fontWeight: 850 },
  description: {
    maxWidth: 820,
    margin: '10px 0 0',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.6,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 12,
  },
  summaryCard: {
    display: 'grid',
    gap: 7,
    padding: 16,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  summaryIcon: {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 8,
    color: '#ef4d2f',
    background: '#fff7ed',
  },
  summaryTitle: { color: '#64748b', fontSize: 12, fontWeight: 800 },
  summaryValue: { color: '#111827', fontSize: 16, fontWeight: 850 },
  summaryDetail: { color: '#64748b', fontSize: 12, lineHeight: 1.4 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
    gap: 16,
    alignItems: 'start',
  },
  mainColumn: { display: 'grid', gap: 16 },
  sideColumn: { display: 'grid', gap: 16 },
  section: {
    padding: 18,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  sectionHeader: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    flex: '0 0 auto',
    borderRadius: 8,
    color: '#334155',
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: { margin: 0, color: '#111827', fontSize: 18, fontWeight: 850 },
  sectionDescription: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.5,
  },
  channelList: { display: 'grid', gap: 10 },
  channelCard: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '34px minmax(0, 1fr) auto',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer',
  },
  channelCardActive: { borderColor: '#bbf7d0', background: '#f8fffb' },
  channelIcon: {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 8,
    color: '#ef4d2f',
    background: '#fff7ed',
  },
  channelText: { display: 'grid', gap: 3, minWidth: 0 },
  channelTitle: { color: '#111827', fontSize: 14, fontWeight: 850 },
  channelDescription: { color: '#64748b', fontSize: 12, lineHeight: 1.45 },
  toggle: {
    width: 42,
    height: 24,
    padding: 2,
    borderRadius: 999,
    background: '#cbd5e1',
    transition: 'background 0.16s ease',
  },
  toggleActive: { background: '#16a34a' },
  toggleKnob: {
    display: 'block',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#ffffff',
    transform: 'translateX(0)',
    transition: 'transform 0.16s ease',
  },
  toggleKnobActive: { transform: 'translateX(18px)' },
  actionsRow: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 14 },
  primaryButton: {
    minHeight: 38,
    padding: '0 14px',
    borderRadius: 8,
    border: '1px solid #ef4d2f',
    background: '#ef4d2f',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 850,
    cursor: 'pointer',
  },
  disabledButton: { opacity: 0.65, cursor: 'not-allowed' },
  inlineStatus: { fontSize: 13, fontWeight: 750 },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 10,
  },
  infoItem: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #eef2f7',
    background: '#f8fafc',
  },
  infoIcon: { color: '#475569', lineHeight: 0, marginTop: 2 },
  infoLabel: { display: 'block', color: '#64748b', fontSize: 12, fontWeight: 750 },
  infoValue: {
    display: 'block',
    marginTop: 3,
    color: '#111827',
    fontSize: 13,
    fontWeight: 850,
    overflowWrap: 'anywhere',
  },
  reviewGrid: { display: 'grid', gap: 10 },
  reviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #eef2f7',
    background: '#f8fafc',
    textDecoration: 'none',
  },
  reviewTitle: { display: 'block', color: '#111827', fontSize: 14, fontWeight: 850 },
  reviewDescription: {
    display: 'block',
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 1.45,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    border: '1px solid #bbf7d0',
    background: '#ecfdf5',
    color: '#047857',
    padding: '4px 8px',
    fontSize: 11,
    fontWeight: 850,
    whiteSpace: 'nowrap',
  },
  stack: { display: 'grid', gap: 10 },
  secondaryNote: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
    borderRadius: 8,
    background: '#f8fafc',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 750,
  },
  checkList: { display: 'grid', gap: 10 },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    color: '#334155',
    fontSize: 13,
    fontWeight: 750,
  },
};
