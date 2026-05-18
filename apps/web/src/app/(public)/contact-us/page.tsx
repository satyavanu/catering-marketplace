'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BookOpen, Briefcase, Mail, Phone } from 'lucide-react';
import PublicSupportShell from '@/components/PublicSupportShell';

const contactOptions = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@droooly.com',
  },
  {
    icon: Briefcase,
    title: 'Business Inquiries',
    description: 'partnerships@droooly.com',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: '+1 (555) 123-4567',
  },
  {
    icon: BookOpen,
    title: 'Help Center',
    description: 'Visit our FAQ for quick answers',
  },
];

export default function ContactUsPage() {
  return (
    <PublicSupportShell contentMaxWidth={980}>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>Contact Us</p>
          <h1 style={styles.title}>We are here to help</h1>
          <p style={styles.subtitle}>
            Send us a message or use the support channel that fits your question.
          </p>
        </section>

        <div style={styles.grid}>
          <form style={styles.form}>
            <h2 style={styles.panelTitle}>Send us a message</h2>

            <label style={styles.field}>
              <span style={styles.label}>Full Name</span>
              <input style={styles.input} placeholder="Enter your full name" />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Email Address</span>
              <input
                type="email"
                style={styles.input}
                placeholder="Enter your email address"
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Subject</span>
              <select style={styles.input} defaultValue="">
                <option value="" disabled>
                  What is this regarding?
                </option>
                <option>Partner onboarding</option>
                <option>Booking support</option>
                <option>Account or billing</option>
                <option>Other</option>
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Message</span>
              <textarea
                style={{ ...styles.input, ...styles.textarea }}
                placeholder="How can we help you?"
              />
            </label>

            <button type="button" style={styles.primaryButton}>
              Send Message
            </button>

            <p style={styles.note}>We typically respond within 24 hours.</p>
          </form>

          <aside style={styles.sidePanel}>
            <h2 style={styles.panelTitle}>Other ways to reach us</h2>
            <div style={styles.contactList}>
              {contactOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <div key={option.title} style={styles.contactItem}>
                    <span style={styles.iconWrap}>
                      <Icon size={18} color="#7c3aed" />
                    </span>
                    <div>
                      <h3 style={styles.contactTitle}>{option.title}</h3>
                      <p style={styles.contactDescription}>{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        <aside style={styles.callout}>
          <div>
            <h2 style={styles.calloutTitle}>Need immediate help?</h2>
            <p style={styles.calloutText}>
              Check our FAQ section for quick answers to common questions.
            </p>
          </div>
          <Link href="/faq" style={styles.button}>
            Visit FAQ
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
    marginBottom: 30,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: 20,
  },
  form: {
    padding: 22,
    borderRadius: 10,
    border: '1px solid #eef2f7',
    background: '#fbfdff',
  },
  sidePanel: {
    padding: 22,
    borderRadius: 10,
    border: '1px solid #eef2f7',
    background: '#fbfdff',
  },
  panelTitle: {
    margin: '0 0 20px',
    color: '#151126',
    fontSize: 18,
    fontWeight: 850,
  },
  field: {
    display: 'grid',
    gap: 8,
    marginBottom: 16,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: 800,
  },
  input: {
    width: '100%',
    minHeight: 44,
    border: '1px solid #d8dee8',
    borderRadius: 10,
    background: '#ffffff',
    color: '#1f2937',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
    padding: '0 12px',
  },
  textarea: {
    minHeight: 130,
    resize: 'vertical',
    paddingTop: 12,
  },
  primaryButton: {
    width: '100%',
    minHeight: 46,
    border: 'none',
    borderRadius: 10,
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    color: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 850,
  },
  note: {
    margin: '12px 0 0',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
  },
  contactList: {
    display: 'grid',
    gap: 22,
  },
  contactItem: {
    display: 'grid',
    gridTemplateColumns: '38px minmax(0, 1fr)',
    gap: 14,
    alignItems: 'start',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: '#f3e8ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    margin: '0 0 4px',
    color: '#1f2937',
    fontSize: 14,
    fontWeight: 850,
  },
  contactDescription: {
    margin: 0,
    color: '#7c3aed',
    fontSize: 13,
    lineHeight: 1.5,
  },
  callout: {
    marginTop: 34,
    padding: '22px 24px',
    borderRadius: 14,
    border: '1px solid #dbeafe',
    background: 'linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)',
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
