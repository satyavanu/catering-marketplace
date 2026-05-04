'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, Copy, Share2 } from 'lucide-react';

function buildReferralLink(code: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://droooly.com';

  return `${baseUrl}/login?mode=signup&ref=${encodeURIComponent(code)}`;
}

export default function PartnerReferralsPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const referralCode =
    (session?.user as { referralCode?: string | null } | undefined)
      ?.referralCode || '';
  const referralLink = referralCode ? buildReferralLink(referralCode) : '';

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.icon}>
          <Share2 size={24} strokeWidth={2.4} />
        </span>
        <div>
          <h1 style={styles.title}>Invite & Earn</h1>
          <p style={styles.copy}>
            Share Droooly with friends, customers, and food partners. You can
            earn commissions when referred users qualify under the referral
            program.
          </p>
        </div>
      </section>

      <section style={styles.card}>
        <p style={styles.label}>Your referral link</p>
        <div style={styles.linkBox}>
          <span style={styles.linkText}>
            {referralLink || 'Your referral link will appear after login.'}
          </span>
          <button
            type="button"
            disabled={!referralLink}
            style={{
              ...styles.copyButton,
              ...(!referralLink ? styles.copyButtonDisabled : {}),
            }}
            onClick={copyReferralLink}
          >
            {copied ? (
              <Check size={17} strokeWidth={2.6} />
            ) : (
              <Copy size={17} strokeWidth={2.4} />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {referralCode && (
          <div style={styles.codeRow}>
            <span style={styles.codeLabel}>Code</span>
            <strong style={styles.code}>{referralCode}</strong>
          </div>
        )}
      </section>

      <section style={styles.infoGrid}>
        <InfoCard
          title="Share your code"
          text="Send your referral link to friends or businesses that may want to join Droooly."
        />
        <InfoCard
          title="They join"
          text="The referral is recorded when a new user signs up through your link."
        />
        <InfoCard
          title="You earn"
          text="Rewards are applied when the referred user meets the active commission rules."
        />
      </section>

      <section style={styles.termsCard}>
        <h2 style={styles.termsTitle}>Terms & Conditions</h2>
        <p style={styles.termsText}>
          Referral rewards are subject to eligibility, valid signup attribution,
          account quality checks, and Droooly commission policies. Detailed
          program terms will be published here as the referral program expands.
        </p>
      </section>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article style={styles.infoCard}>
      <h2 style={styles.infoTitle}>{title}</h2>
      <p style={styles.infoText}>{text}</p>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  hero: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 24,
    borderRadius: 22,
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.11), rgba(255, 90, 61, 0.07)), #ffffff',
    border: '1px solid rgba(124, 58, 237, 0.14)',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 999,
    background: '#ffffff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 22px rgba(124, 58, 237, 0.13)',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: '#151126',
    fontSize: 28,
    fontWeight: 700,
  },
  copy: {
    margin: '8px 0 0',
    maxWidth: 720,
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 1.55,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    background: '#ffffff',
    border: '1px solid #eee9f7',
    boxShadow: '0 12px 34px rgba(17, 24, 39, 0.035)',
  },
  label: {
    margin: '0 0 10px',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 750,
  },
  linkBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderRadius: 14,
    background: '#fbf8ff',
    border: '1px solid #ddd6fe',
  },
  linkText: {
    flex: 1,
    minWidth: 0,
    color: '#334155',
    fontSize: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyButton: {
    minHeight: 38,
    border: 'none',
    borderRadius: 11,
    padding: '0 13px',
    background: '#5b21b6',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 800,
  },
  copyButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  codeRow: {
    marginTop: 12,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    color: '#64748b',
    fontSize: 13,
  },
  codeLabel: {
    fontWeight: 750,
  },
  code: {
    color: '#5b21b6',
    fontSize: 14,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  infoCard: {
    padding: 18,
    borderRadius: 18,
    background: '#ffffff',
    border: '1px solid #eee9f7',
  },
  infoTitle: {
    margin: 0,
    color: '#151126',
    fontSize: 16,
    fontWeight: 700,
  },
  infoText: {
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.5,
  },
  termsCard: {
    padding: 18,
    borderRadius: 18,
    background: '#fff7ed',
    border: '1px solid #fed7aa',
  },
  termsTitle: {
    margin: 0,
    color: '#9a3412',
    fontSize: 15,
    fontWeight: 800,
  },
  termsText: {
    margin: '8px 0 0',
    color: '#9a3412',
    fontSize: 13,
    lineHeight: 1.5,
  },
};
