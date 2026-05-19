'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import PublicSupportShell from '@/components/PublicSupportShell';

const categories = [
  'General',
  'Customers',
  'Bookings & Quotes',
  'Payments & Refunds',
  'Partners',
  'Account & Privacy',
];

const faqs = [
  {
    category: 'General',
    question: 'What is Droooly?',
    answer:
      'Droooly is a food services marketplace operated by Droooly Labs Private Limited. It helps customers discover and book catering, private chef, restaurant experiences, and related food services from independent partners.',
  },
  {
    category: 'General',
    question: 'Where is Droooly currently available?',
    answer:
      'Droooly may initially be available in selected cities and service areas. Availability depends on partner coverage, service type, event location, and operational readiness.',
  },
  {
    category: 'Customers',
    question: 'Do I need an account to use Droooly?',
    answer:
      'You may browse available services without completing every account detail, but bookings, quote requests, payments, order tracking, support, and account deletion require a verified account.',
  },
  {
    category: 'Customers',
    question: 'What types of services can I book?',
    answer:
      'Depending on availability, you may book catering, private chef services, restaurant experiences, event food packages, custom menus, add-ons, and related food service options.',
  },
  {
    category: 'Bookings & Quotes',
    question: 'What is the difference between instant booking and quote request?',
    answer:
      'Instant booking is used when price, package, date, guest count, and service details are clear. Quote request is used when the partner needs to review your event requirements and send a custom price before you confirm.',
  },
  {
    category: 'Bookings & Quotes',
    question: 'What happens after I request a quote?',
    answer:
      'The partner reviews your event details and may approve, reject, or respond with a custom quote. Once you approve the quote, Droooly may create a booking and ask for deposit or full payment based on the booking rules.',
  },
  {
    category: 'Bookings & Quotes',
    question: 'Can I change my booking after confirmation?',
    answer:
      'Changes may be possible depending on partner availability, event date, preparation work, guest count, menu, and pricing impact. Some changes may require partner approval or additional payment.',
  },
  {
    category: 'Bookings & Quotes',
    question: 'Can a partner reject my booking or quote request?',
    answer:
      'Yes. A partner may reject a request if they are unavailable, outside the service area, unable to support the guest count, or unable to meet the requested menu, timing, or event requirements.',
  },
  {
    category: 'Payments & Refunds',
    question: 'How are payments handled?',
    answer:
      'Payments are processed through trusted third-party payment providers. Droooly may support deposits, full payments, refunds, and partner payouts depending on the service and booking status.',
  },
  {
    category: 'Payments & Refunds',
    question: 'Do I need to pay a deposit?',
    answer:
      'Some bookings may require an advance or deposit to confirm the order. The payable amount, balance amount, and payment status will be shown during checkout or booking confirmation.',
  },
  {
    category: 'Payments & Refunds',
    question: 'How do refunds work?',
    answer:
      'Refund eligibility depends on the cancellation timing, partner policy, preparation work already started, payment status, event date, and applicable platform rules. Refund timelines may also depend on the payment provider or bank.',
  },
  {
    category: 'Payments & Refunds',
    question: 'What happens if a partner cancels?',
    answer:
      'If a partner cancels, Droooly may help review the case, notify the customer, support refunds where applicable, and take action against the partner such as payout hold, deduction, suspension, or delisting.',
  },
  {
    category: 'Partners',
    question: 'Who can become a Droooly partner?',
    answer:
      'Caterers, private chefs, restaurants, cloud kitchens, and eligible food service providers may apply to become partners, subject to service area, documentation, verification, and platform approval.',
  },
  {
    category: 'Partners',
    question: 'How does partner onboarding work?',
    answer:
      'Partners complete a guided onboarding flow with profile details, business information, service areas, KYC, bank details, documents, service setup, and agreement acceptance. Progress can be saved and resumed later.',
  },
  {
    category: 'Partners',
    question: 'What documents are required for partners?',
    answer:
      'Required documents may vary by country and business type. In India, partners may be asked for PAN, GST details if applicable, FSSAI details if applicable, bank details, business information, and other verification documents.',
  },
  {
    category: 'Partners',
    question: 'How long does partner verification take?',
    answer:
      'Verification time depends on completeness of information, document quality, business type, and review volume. Missing, expired, unclear, or incorrect documents may delay approval.',
  },
  {
    category: 'Partners',
    question: 'When do partners receive payouts?',
    answer:
      'Partner payouts may be processed after successful service completion, subject to settlement cycle, refunds, disputes, deductions, taxes, payment provider timelines, and platform rules.',
  },
  {
    category: 'Partners',
    question: 'Can partners update pricing and packages?',
    answer:
      'Yes. Partners may update packages, add-ons, service areas, pricing, images, and availability where supported. Some changes may be reviewed by Droooly before becoming visible.',
  },
  {
    category: 'Account & Privacy',
    question: 'Is my data secure?',
    answer:
      'Droooly uses reasonable technical, administrative, and organisational safeguards to protect account, booking, payment, and partner verification information. Users should also keep login access and devices secure.',
  },
  {
    category: 'Account & Privacy',
    question: 'How can I delete my account?',
    answer:
      'You can request deletion from the app through Account → Delete Account, or by contacting Droooly support. We may verify your identity before processing the request.',
  },
  {
    category: 'Account & Privacy',
    question: 'Will all my data be deleted immediately?',
    answer:
      'Some personal data may be deleted or anonymised, but records related to active orders, payments, refunds, invoices, taxes, disputes, fraud prevention, partner KYC, agreements, or payouts may be retained where legally or operationally required.',
  },
  {
    category: 'Account & Privacy',
    question: 'Can I correct my account information?',
    answer:
      'Yes. You can update supported profile details in your account or contact support for correction requests. Some verified partner, payment, tax, or KYC details may require additional review before changes are applied.',
  },
  {
    category: 'Account & Privacy',
    question: 'How can I contact Droooly support?',
    answer:
      'You can contact Droooly through the Contact Us page for account, booking, partner onboarding, privacy, refund, or support-related questions.',
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
      <style>{`
        @media (max-width: 680px) {
          .faq-layout {
            grid-template-columns: 1fr !important;
          }

          .faq-categories {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
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

        <div className="faq-layout" style={styles.layout}>
          <aside
            className="faq-categories"
            style={styles.categoryList}
            aria-label="FAQ categories"
          >
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
    gridTemplateColumns: 'minmax(150px, 220px) minmax(0, 1fr)',
    gap: 18,
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
    marginTop: 34,
    padding: '22px 24px',
    borderRadius: 14,
    border: '1px solid #d8f5e4',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f2fbf7 100%)',
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
