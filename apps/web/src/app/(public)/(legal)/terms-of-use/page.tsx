import Link from 'next/link';
import type { CSSProperties } from 'react';
import PublicSupportShell from '@/components/PublicSupportShell';

const terms = [
  {
    title: '1. Acceptance of terms',
    body: 'By accessing or using Droooly, you agree to these Terms of Use and our Privacy Policy. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. Description of service',
    body: 'Droooly is a marketplace and partner onboarding platform for catering services. We help customers discover providers and help partners manage business registration, verification, and service setup.',
  },
  {
    title: '3. Account responsibilities',
    body: 'You agree to provide accurate information, maintain the security of your account, use Droooly only for lawful purposes, and promptly update details that affect orders, verification, or support.',
  },
  {
    title: '4. Bookings and payments',
    body: 'Booking terms, pricing, cancellation policies, refunds, and service details may vary by provider and are shown during the relevant booking or partner workflow.',
  },
  {
    title: '5. Platform conduct',
    body: 'You may not misuse Droooly, attempt unauthorized access, submit fraudulent information, interfere with platform operations, or use the service in a way that harms customers, partners, or Droooly.',
  },
  {
    title: '6. Updates to these terms',
    body: 'We may update these terms from time to time. Continued use of Droooly after changes are posted means you accept the updated terms.',
  },
];

export default function TermsOfUsePage() {
  return (
    <PublicSupportShell>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>Terms of Use</p>
          <h1 style={styles.title}>Simple rules for using Droooly</h1>
          <p style={styles.subtitle}>Last updated: March 20, 2026</p>
        </section>

        <div style={styles.content}>
          {terms.map((term) => (
            <section key={term.title} style={styles.section}>
              <h2 style={styles.sectionTitle}>{term.title}</h2>
              <p style={styles.body}>{term.body}</p>
            </section>
          ))}
        </div>

        <aside style={styles.callout}>
          <div>
            <h2 style={styles.calloutTitle}>Questions about these terms?</h2>
            <p style={styles.calloutText}>
              Contact us and we will help clarify the policy details.
            </p>
          </div>
          <Link href="/contact-us" style={styles.button}>
            Contact Us
          </Link>
        </aside>
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
    marginBottom: 32,
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
  content: {
    display: 'grid',
    gap: 18,
  },
  section: {
    paddingBottom: 18,
    borderBottom: '1px solid #eef2f7',
  },
  sectionTitle: {
    margin: '0 0 10px',
    color: '#1f2937',
    fontSize: 17,
    fontWeight: 800,
  },
  body: {
    margin: 0,
    color: '#475569',
    fontSize: 15,
    lineHeight: 1.8,
  },
  callout: {
    marginTop: 34,
    padding: '22px 24px',
    borderRadius: 14,
    border: '1px solid #ede9fe',
    background: 'linear-gradient(135deg, #f5f3ff 0%, #fbfaff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    flexWrap: 'wrap',
  },
  calloutTitle: {
    margin: '0 0 6px',
    color: '#151126',
    fontSize: 16,
    fontWeight: 850,
  },
  calloutText: {
    margin: 0,
    color: '#475569',
    fontSize: 14,
  },
  button: {
    minHeight: 38,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
    borderRadius: 8,
    border: '1px solid #a78bfa',
    color: '#7c3aed',
    background: '#ffffff',
    fontSize: 13,
    fontWeight: 800,
    textDecoration: 'none',
  },
};
