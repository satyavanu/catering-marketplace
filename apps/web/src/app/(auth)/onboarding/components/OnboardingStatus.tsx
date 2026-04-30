'use client';

import React from 'react';
import type { PartnerOnboardingPayload } from '../types';

interface OnboardingStatusProps {
  onboardingData: PartnerOnboardingPayload;
  isLoading?: boolean;
  error?: string;
  onComplete: () => void | Promise<void>;
  onBack?: () => void;
}

export default function OnboardingStatus({
  isLoading = false,
  error,
  onComplete,
  onBack,
}: OnboardingStatusProps) {
  return (
    <div style={styles.card}>

     

      <h1 style={styles.title}>Almost there!</h1>

      <p style={styles.subtitle}>
        Your partner profile is ready. We’ll verify your documents and enable
        payouts after approval.
      </p>

      <div style={styles.nextStepsBox}>
        <div style={styles.nextStepsHeader}>
          <span style={styles.shieldIcon}>🛡️</span>
          <span>Next steps</span>
        </div>

        <div style={styles.nextStep}>
          <span style={styles.tick}>✓</span>
          Verify PAN & GST
        </div>

        <div style={styles.nextStep}>
          <span style={styles.tick}>✓</span>
          Verify bank account
        </div>

        <div style={styles.nextStep}>
          <span style={styles.tick}>✓</span>
          Activate your dashboard
        </div>

        <div style={styles.nextStep}>
          <span style={styles.tick}>✓</span>
          Start receiving booking requests
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button
        type="button"
        onClick={onComplete}
        disabled={isLoading}
        style={{
          ...styles.primaryButton,
          ...(isLoading ? styles.disabledButton : {}),
        }}
      >
        {isLoading ? 'Submitting...' : 'Save & Continue'}
        <span>→</span>
      </button>

      <div style={styles.footerNote}>
        <div style={styles.footerIcon}>🔒</div>
        <div>
          <strong>Your information is safe with us.</strong>
          <p>Documents are used only for partner verification and payouts.</p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: 'relative',
    maxWidth: '520px',
    margin: '2rem auto',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    border: '1px solid #f1f1f1',
    boxShadow: '0 16px 40px rgba(17, 24, 39, 0.08)',
  },

  logo: {
    fontSize: '1.05rem',
    fontWeight: 900,
    color: '#ff4b1f',
    marginBottom: '1rem',
  },

  stepPill: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    backgroundColor: '#eef9e8',
    color: '#3f8f2f',
    fontSize: '0.72rem',
    fontWeight: 800,
  },

  backButton: {
    border: 'none',
    background: 'transparent',
    color: '#4b5563',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    marginBottom: '1.25rem',
  },

  heroIcon: {
    width: '76px',
    height: '76px',
    margin: '0 auto 1.15rem',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 16px 30px rgba(124, 58, 237, 0.28)',
  },

  check: {
    color: '#ffffff',
    fontSize: '2.2rem',
    fontWeight: 900,
  },

  title: {
    margin: 0,
    textAlign: 'center',
    fontSize: '1.45rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.03em',
  },

  subtitle: {
    maxWidth: '390px',
    margin: '0.65rem auto 1.4rem',
    textAlign: 'center',
    fontSize: '0.92rem',
    color: '#6b7280',
    lineHeight: 1.6,
  },

  nextStepsBox: {
    padding: '1.1rem',
    borderRadius: '1rem',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(255, 75, 31, 0.06))',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    marginBottom: '1.25rem',
  },

  nextStepsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.8rem',
    color: '#111827',
    fontSize: '0.9rem',
    fontWeight: 850,
  },

  shieldIcon: {
    width: '28px',
    height: '28px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 16px rgba(17, 24, 39, 0.08)',
  },

  nextStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    color: '#374151',
    fontSize: '0.88rem',
    fontWeight: 700,
    marginTop: '0.55rem',
  },

  tick: {
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    backgroundColor: '#e8f7df',
    color: '#3f8f2f',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 900,
    flexShrink: 0,
  },

  error: {
    padding: '0.85rem',
    borderRadius: '0.85rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.88rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  primaryButton: {
    width: '100%',
    padding: '0.95rem 1rem',
    border: 'none',
    borderRadius: '0.85rem',
    background: 'linear-gradient(135deg, #4f9d35 0%, #2f7d25 100%)',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 850,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.55rem',
    boxShadow: '0 12px 24px rgba(47, 125, 37, 0.22)',
  },

  disabledButton: {
    opacity: 0.65,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },

  footerNote: {
    marginTop: '1rem',
    padding: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    borderRadius: '1rem',
    backgroundColor: '#fff8f3',
    border: '1px solid #ffe2d3',
    color: '#374151',
    fontSize: '0.83rem',
    lineHeight: 1.45,
  },

  footerIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 18px rgba(255, 75, 31, 0.12)',
    flexShrink: 0,
  },
};