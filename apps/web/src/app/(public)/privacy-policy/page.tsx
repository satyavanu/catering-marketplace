import Link from 'next/link';
import type { CSSProperties } from 'react';
import PublicSupportShell from '@/components/PublicSupportShell';

const sections = [
  {
    title: '1. Information we collect',
    body: 'We collect account, contact, booking, partner onboarding, payment, and service preference details needed to operate Droooly. We may also collect usage data such as device, browser, and interaction information to keep the platform secure and improve the product.',
  },
  {
    title: '2. How we use information',
    body: 'We use your information to create and manage accounts, process bookings, verify partners, provide support, prevent abuse, improve marketplace quality, and send important service updates.',
  },
  {
    title: '3. Sharing and service providers',
    body: 'We share information only when needed to deliver the marketplace experience, such as with caterers, customers, payment processors, verification partners, hosting providers, and legal or safety authorities when required.',
  },
  {
    title: '4. Data security',
    body: 'We use administrative, technical, and organizational safeguards designed to protect your information. No online system is perfectly secure, so we also encourage strong passwords and careful account access.',
  },
  {
    title: '5. Your choices',
    body: 'You can request access, correction, deletion, or updates to your information by contacting us. Some records may be retained when required for legal, tax, fraud prevention, or marketplace integrity purposes.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PublicSupportShell>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>Privacy Policy</p>
          <h1 style={styles.title}>How Droooly protects your information</h1>
          <p style={styles.subtitle}>Last updated: March 11, 2026</p>
        </section>

        <div style={styles.content}>
          {sections.map((section) => (
            <section key={section.title} style={styles.section}>
              <h2 style={styles.sectionTitle}>{section.title}</h2>
              <p style={styles.body}>{section.body}</p>
            </section>
          ))}
        </div>

        <aside style={styles.callout}>
          <div>
            <h2 style={styles.calloutTitle}>Questions about privacy?</h2>
            <p style={styles.calloutText}>
              We are happy to explain how your data is handled across Droooly.
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
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 18,
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
    padding: 'clamp(24px, 5vw, 44px)',
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
    marginTop: 28,
    padding: 22,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #f3e8ff 0%, #eef6ff 100%)',
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
