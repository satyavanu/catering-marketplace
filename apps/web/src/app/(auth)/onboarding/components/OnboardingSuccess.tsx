'use client';

import React from 'react';

interface OnboardingSuccessProps {
  onContinue: () => void;
}

export default function OnboardingSuccess({ onContinue }: OnboardingSuccessProps) {
  return (
    <div style={styles.card}>
      <div style={styles.bgGlow} />

      <div style={styles.confetti}>✦ ✺ ✦</div>

      <div style={styles.successCircle}>
        <span>✓</span>
      </div>

      <h1 style={styles.title}>Welcome to Droooly!</h1>

      <p style={styles.subtitle}>
        Your partner account has been created successfully.
      </p>

      <p style={styles.description}>
        You can now complete your services, manage availability, and start
        receiving booking requests from your dashboard.
      </p>

      <button type="button" onClick={onContinue} style={styles.button}>
        Continue to Dashboard <span>→</span>
      </button>

      <div style={styles.footerNote}>
        <span style={styles.footerIcon}>🛡️</span>
        <span>
          Verification and payout activation may take a little time after review.
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '520px',
    margin: '2rem auto',
    padding: '3rem 1.5rem 1.5rem',
    borderRadius: '1.5rem',
    background:
      'linear-gradient(180deg, #ffffff 0%, #fff8f3 55%, #f7f0ff 100%)',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    boxShadow: '0 18px 45px rgba(17, 24, 39, 0.08)',
    textAlign: 'center',
  },

  bgGlow: {
    position: 'absolute',
    width: '220px',
    height: '220px',
    borderRadius: '999px',
    background: 'rgba(124, 58, 237, 0.14)',
    top: '-80px',
    right: '-70px',
    filter: 'blur(8px)',
  },

  confetti: {
    position: 'relative',
    color: '#ff4b1f',
    fontSize: '1.2rem',
    fontWeight: 900,
    letterSpacing: '0.7rem',
    marginBottom: '1rem',
  },

  successCircle: {
    position: 'relative',
    width: '84px',
    height: '84px',
    margin: '0 auto 1.25rem',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.4rem',
    fontWeight: 900,
    boxShadow: '0 18px 35px rgba(124, 58, 237, 0.28)',
  },

  title: {
    position: 'relative',
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.04em',
  },

  subtitle: {
    position: 'relative',
    margin: '0.65rem 0 0',
    fontSize: '0.98rem',
    fontWeight: 800,
    color: '#374151',
  },

  description: {
    position: 'relative',
    maxWidth: '390px',
    margin: '0.65rem auto 1.5rem',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#6b7280',
  },

  button: {
    position: 'relative',
    width: '100%',
    padding: '0.95rem 1rem',
    border: 'none',
    borderRadius: '0.9rem',
    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 850,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.55rem',
    boxShadow: '0 14px 28px rgba(124, 58, 237, 0.25)',
  },

  footerNote: {
    position: 'relative',
    marginTop: '1rem',
    padding: '0.9rem',
    borderRadius: '1rem',
    backgroundColor: 'rgba(255,255,255,0.78)',
    border: '1px solid rgba(255, 75, 31, 0.14)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.55rem',
    color: '#6b7280',
    fontSize: '0.82rem',
    lineHeight: 1.4,
  },

  footerIcon: {
    flexShrink: 0,
  },
};