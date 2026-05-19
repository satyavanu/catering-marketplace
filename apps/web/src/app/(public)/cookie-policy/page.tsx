'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import PublicSupportShell from '@/components/PublicSupportShell';

const cookieSections = [
  {
    title: '1. What Cookies Are',
    body:
      'Cookies are small text files stored on your device when you use Droooly. They help the site remember useful information, keep sessions secure, and improve the web experience.',
  },
  {
    title: '2. Cookies We Use',
    body:
      'Droooly may use essential cookies for authentication, security, checkout, and account access; preference cookies for saved settings; and performance cookies to understand site reliability and usage patterns.',
  },
  {
    title: '3. Optional Cookies',
    body:
      'Optional cookies may help Droooly Labs Private Limited understand how people use the website, improve pages, and measure feature performance. You can choose essential cookies only from the cookie banner.',
  },
  {
    title: '4. Third-Party Technologies',
    body:
      'Some services, such as payment providers, authentication providers, analytics tools, or embedded support tools, may set or read cookies when needed to provide their services.',
  },
  {
    title: '5. Managing Cookies',
    body:
      'You can manage cookies through your browser settings. Blocking some cookies may affect login, checkout, account security, saved preferences, or other parts of Droooly.',
  },
  {
    title: '6. Updates',
    body:
      'We may update this Cookie Policy from time to time. The updated date on this page will reflect the latest version.',
  },
];

export default function CookiePolicyPage() {
  return (
    <PublicSupportShell>
      <style>{`
        @media (max-width: 760px) {
          .cookie-policy-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>Cookie Policy</p>
          <h1 style={styles.title}>How Droooly uses cookies</h1>
          <p style={styles.subtitle}>Last updated: May 20, 2026</p>
        </section>

        <section style={styles.notice}>
          <strong>Droooly Labs Private Limited</strong> uses cookies and similar
          technologies across the Droooly website, account dashboard, checkout,
          and related web experiences.
        </section>

        <div className="cookie-policy-layout" style={styles.layout}>
          <section style={styles.sections}>
            {cookieSections.map((section) => (
              <article key={section.title} style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>{section.title}</h2>
                <p style={styles.sectionText}>{section.body}</p>
              </article>
            ))}
          </section>

          <aside style={styles.sideCard}>
            <h2 style={styles.sideTitle}>Your choice</h2>
            <p style={styles.sideText}>
              When the cookie banner appears, you can accept all cookies or
              continue with essential cookies only.
            </p>
            <Link href="/privacy-policy" style={styles.sideLink}>
              Read Privacy Policy
            </Link>
          </aside>
        </div>
      </main>
    </PublicSupportShell>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    padding: 0,
  },
  hero: {
    textAlign: 'center',
    marginBottom: 28,
  },
  kicker: {
    margin: '0 0 8px',
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 10px',
    color: '#151126',
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 850,
    lineHeight: 1.12,
  },
  subtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: 15,
    fontWeight: 700,
  },
  notice: {
    marginBottom: 22,
    padding: '18px 20px',
    borderRadius: 14,
    border: '1px solid #d8f5e4',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f2fbf7 100%)',
    color: '#334155',
    fontSize: 14,
    lineHeight: 1.7,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(240px, 320px)',
    gap: 18,
    alignItems: 'start',
  },
  sections: {
    display: 'grid',
    gap: 10,
  },
  sectionCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#ffffff',
    padding: '18px 20px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    color: '#151126',
    fontSize: 17,
    fontWeight: 850,
  },
  sectionText: {
    margin: 0,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.7,
  },
  sideCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    background: '#ffffff',
    padding: 18,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
  },
  sideTitle: {
    margin: '0 0 8px',
    color: '#151126',
    fontSize: 16,
    fontWeight: 850,
  },
  sideText: {
    margin: '0 0 14px',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.65,
  },
  sideLink: {
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: 850,
    textDecoration: 'none',
  },
};
