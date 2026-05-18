'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import PublicSupportShell from '@/components/PublicSupportShell';

const categories = ['General', 'Onboarding', 'Account & Security', 'Billing', 'Partnerships'];

const faqs = [
  {
    category: 'General',
    question: 'What is Droooly?',
    answer:
      'Droooly is a catering marketplace and partner onboarding platform that helps customers find trusted food service providers and helps partners set up their profiles, documents, service areas, and agreements.',
  },
  {
    category: 'Onboarding',
    question: 'How does partner onboarding work?',
    answer:
      'Partners complete a guided flow for profile details, business information, service areas, KYC and bank details, and agreement acceptance. Saved progress can be resumed when you sign back in.',
  },
  {
    category: 'Onboarding',
    question: 'How long does verification take?',
    answer:
      'Most partner profiles can be reviewed quickly after all required details are submitted. Complex document checks or missing information may take longer.',
  },
  {
    category: 'Account & Security',
    question: 'Is my data secure?',
    answer:
      'Droooly uses security controls for account access, payments, and partner verification. You should also keep your login details private and use a trusted device when completing onboarding.',
  },
  {
    category: 'Billing',
    question: 'How are payments handled?',
    answer:
      'Payments are processed through secure payment providers. Booking, refund, and cancellation details are shown during the relevant checkout or partner workflow.',
  },
  {
    category: 'Partnerships',
    question: 'Can I save my progress and continue later?',
    answer:
      'Yes. Once your onboarding session starts, Droooly saves your completed steps so you can return and continue where you left off.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [query, setQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState(faqs[0].question);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'General' || faq.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <PublicSupportShell>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>FAQ</p>
          <h1 style={styles.title}>Frequently asked questions</h1>
          <p style={styles.subtitle}>
            Find quick answers about using Droooly and becoming a partner.
          </p>
        </section>

        <label style={styles.searchWrap}>
          <Search size={18} color="#94a3b8" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions..."
            style={styles.searchInput}
          />
        </label>

        <div style={styles.layout}>
          <aside style={styles.categoryList} aria-label="FAQ categories">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  style={{
                    ...styles.categoryButton,
                    ...(isActive ? styles.categoryButtonActive : null),
                  }}
                >
                  {category}
                </button>
              );
            })}
          </aside>

          <section style={styles.questions}>
            {filteredFaqs.map((faq) => {
              const isOpen = openQuestion === faq.question;

              return (
                <article key={faq.question} style={styles.questionCard}>
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? '' : faq.question)}
                    style={styles.questionButton}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      color="#7c3aed"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 180ms ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen ? <p style={styles.answer}>{faq.answer}</p> : null}
                </article>
              );
            })}

            {filteredFaqs.length === 0 ? (
              <p style={styles.empty}>No matching questions found.</p>
            ) : null}
          </section>
        </div>

        <aside style={styles.callout}>
          <div>
            <h2 style={styles.calloutTitle}>Still have questions?</h2>
            <p style={styles.calloutText}>
              Our support team can help with onboarding, bookings, and account details.
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
  searchWrap: {
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 16px',
    border: '1px solid #e2e8f0',
    borderRadius: 999,
    background: '#ffffff',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
    marginBottom: 24,
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    color: '#1f2937',
    fontSize: 14,
    fontFamily: 'inherit',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: 20,
    alignItems: 'start',
  },
  categoryList: {
    display: 'grid',
    gap: 8,
  },
  categoryButton: {
    minHeight: 40,
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: '#475569',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 800,
    textAlign: 'left',
    padding: '0 12px',
  },
  categoryButtonActive: {
    background: '#f3e8ff',
    color: '#7c3aed',
  },
  questions: {
    display: 'grid',
    gap: 10,
  },
  questionCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#ffffff',
    overflow: 'hidden',
  },
  questionButton: {
    width: '100%',
    minHeight: 54,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    border: 'none',
    background: '#ffffff',
    color: '#1f2937',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 850,
    textAlign: 'left',
    padding: '0 16px',
  },
  answer: {
    margin: 0,
    padding: '0 16px 16px',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.7,
  },
  empty: {
    margin: 0,
    color: '#64748b',
    fontSize: 14,
  },
  callout: {
    marginTop: 28,
    padding: 22,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #ecfdf5 0%, #eef6ff 100%)',
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
