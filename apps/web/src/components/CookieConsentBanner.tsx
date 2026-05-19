'use client';

import type React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const COOKIE_CONSENT_KEY = 'droooly_cookie_consent_v1';

type CookieConsent = {
  status: 'accepted_all' | 'essential_only';
  acceptedAt: string;
};

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      setIsVisible(!storedConsent);
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (status: CookieConsent['status']) => {
    const consent: CookieConsent = {
      status,
      acceptedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch {
      // If storage is unavailable, still dismiss for the current session.
    }

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section style={styles.banner} aria-label="Cookie consent">
      <div style={styles.content}>
        <div>
          <h2 style={styles.title}>Cookies on Droooly</h2>
          <p style={styles.text}>
            Droooly Labs Private Limited uses essential cookies to keep the site
            secure and optional cookies to improve performance, remember
            preferences, and understand usage. You can accept all cookies or
            continue with essential cookies only.
          </p>
          <Link href="/cookie-policy" style={styles.link}>
            Read our Cookie Policy
          </Link>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => saveConsent('essential_only')}
            style={styles.secondaryButton}
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => saveConsent('accepted_all')}
            style={styles.primaryButton}
          >
            Accept All
          </button>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  content: {
    width: 'min(960px, 100%)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: 18,
    alignItems: 'center',
    padding: 18,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
    pointerEvents: 'auto',
  },
  title: {
    margin: '0 0 6px',
    color: '#111827',
    fontSize: 16,
    fontWeight: 850,
  },
  text: {
    margin: 0,
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.55,
  },
  link: {
    display: 'inline-flex',
    marginTop: 8,
    color: '#ef4d2f',
    fontSize: 13,
    fontWeight: 850,
    textDecoration: 'none',
  },
  actions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
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
    whiteSpace: 'nowrap',
  },
  secondaryButton: {
    minHeight: 38,
    padding: '0 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontSize: 13,
    fontWeight: 850,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};
