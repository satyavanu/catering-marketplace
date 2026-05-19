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
  'Safety & Policies',
];

const faqs = [{
  category: 'General',
  question: 'Is Droooly available on mobile and web?',
  answer:
    'Yes. Droooly may be available through supported mobile apps and web experiences depending on your region and rollout availability.',
},
{
  category: 'General',
  question: 'Does Droooly prepare or deliver food directly?',
  answer:
    'Droooly is primarily a marketplace platform that connects customers with independent food service partners. Unless clearly stated otherwise, services are fulfilled by the partner.',
},
{
  category: 'Customers',
  question: 'Can I book services for corporate events?',
  answer:
    'Yes. Depending on availability, customers may use Droooly for birthdays, weddings, private dinners, office events, corporate gatherings, celebrations, and other event types.',
},
{
  category: 'Customers',
  question: 'Can I request vegetarian or dietary-specific food?',
  answer:
    'Yes. Many partners may support vegetarian, vegan, Jain, halal, gluten-free, low-spice, child-friendly, or other dietary preferences depending on the service.',
},
{
  category: 'Customers',
  question: 'Can I contact the partner before booking?',
  answer:
    'Depending on the booking flow, customers may communicate through quote requests, support workflows, or booking discussion channels supported by Droooly.',
},
{
  category: 'Customers',
  question: 'Can I schedule bookings for future dates?',
  answer:
    'Yes. Availability depends on the partner schedule, service type, preparation time, and operational coverage.',
},
{
  category: 'Bookings & Quotes',
  question: 'What happens if my payment fails?',
  answer:
    'If payment fails, the booking may remain incomplete or pending until successful payment is received. In some cases, the booking or quote may expire automatically.',
},
{
  category: 'Bookings & Quotes',
  question: 'Can bookings expire automatically?',
  answer:
    'Yes. Some quote approvals, payment links, or booking confirmations may expire if payment or required action is not completed within the allowed time window.',
},
{
  category: 'Bookings & Quotes',
  question: 'Can guest count affect pricing?',
  answer:
    'Yes. Pricing may vary based on guest count, package selection, add-ons, delivery distance, event timing, staffing requirements, taxes, or other service conditions.',
},
{
  category: 'Bookings & Quotes',
  question: 'Can partners charge additional fees?',
  answer:
    'Additional charges may apply for custom menus, additional staff, travel distance, late-night events, extra equipment, waiting time, decoration support, or special requests.',
},
{
  category: 'Bookings & Quotes',
  question: 'Will I receive booking confirmation?',
  answer:
    'Yes. Customers may receive booking, quote, payment, refund, cancellation, or status updates through email, SMS, WhatsApp, push notification, or in-app communication.',
},
{
  category: 'Payments & Refunds',
  question: 'Which payment methods are supported?',
  answer:
    'Supported payment methods may vary by country and payment provider, and can include cards, UPI, net banking, wallets, or other supported payment options.',
},
{
  category: 'Payments & Refunds',
  question: 'Can I pay the remaining balance later?',
  answer:
    'Some bookings may support partial payment or deposit-based confirmation, with the remaining balance payable later according to the booking terms.',
},
{
  category: 'Payments & Refunds',
  question: 'Can taxes and platform fees change?',
  answer:
    'Yes. Taxes, service fees, platform fees, discounts, and promotional pricing may vary by location, service type, partner, booking value, or applicable regulations.',
},
{
  category: 'Payments & Refunds',
  question: 'How long do refunds take?',
  answer:
    'Refund timelines depend on the payment provider, bank processing time, original payment method, and the nature of the cancellation or dispute review.',
},
{
  category: 'Payments & Refunds',
  question: 'What happens during a dispute review?',
  answer:
    'Droooly may review booking details, partner communication, payment records, delivery evidence, refund eligibility, and support history before determining the next action.',
},
{
  category: 'Partners',
  question: 'Can individuals become partners?',
  answer:
    'Depending on local requirements and platform policies, individual chefs, home chefs, or businesses may apply to become partners.',
},
{
  category: 'Partners',
  question: 'Can partners operate in multiple cities?',
  answer:
    'Yes. Eligible partners may expand service areas depending on operational capability, staffing, logistics, and platform approval.',
},
{
  category: 'Partners',
  question: 'Can partners pause their listings?',
  answer:
    'Yes. Partners may pause availability, hide services, or temporarily stop accepting bookings where supported by the platform.',
},
{
  category: 'Partners',
  question: 'Can Droooly reject onboarding applications?',
  answer:
    'Yes. Droooly may reject or suspend onboarding if information is incomplete, inaccurate, risky, non-compliant, fraudulent, or outside platform requirements.',
},
{
  category: 'Partners',
  question: 'Are partner agreements required?',
  answer:
    'Yes. Partners may need to review and accept platform agreements, payout terms, verification policies, and applicable marketplace conditions before activation.',
},
{
  category: 'Partners',
  question: 'Can partners receive reviews and ratings?',
  answer:
    'Yes. Customers may provide ratings, reviews, or feedback after service completion, subject to platform moderation and policy rules.',
},
{
  category: 'Account & Privacy',
  question: 'How does OTP verification work?',
  answer:
    'Droooly may use OTP-based verification through SMS, email, or supported authentication providers to help secure accounts and reduce misuse.',
},
{
  category: 'Account & Privacy',
  question: 'Can I use Google or social login?',
  answer:
    'Depending on platform availability, users may be able to sign in using Google or other supported authentication providers.',
},
{
  category: 'Account & Privacy',
  question: 'Why does Droooly retain some records after account deletion?',
  answer:
    'Certain records may need to be retained for active bookings, invoices, refunds, taxes, disputes, fraud prevention, partner payouts, audit requirements, legal compliance, or marketplace safety.',
},
{
  category: 'Account & Privacy',
  question: 'Does Droooly sell personal data?',
  answer:
    'Droooly does not intend to sell personal data. Information may be shared only where required to operate the marketplace, process payments, provide support, comply with law, or maintain platform security.',
},
{
  category: 'Safety & Policies',
  question: 'Can Droooly suspend accounts?',
  answer:
    'Yes. Accounts may be restricted or suspended for fraud, abusive behaviour, policy violations, failed verification, unsafe activity, chargeback abuse, fake bookings, or unlawful conduct.',
},
{
  category: 'Safety & Policies',
  question: 'What content is prohibited on Droooly?',
  answer:
    'Users and partners must not upload illegal, misleading, abusive, copied, offensive, fraudulent, unsafe, infringing, or harmful content.',
},
{
  category: 'Safety & Policies',
  question: 'Can pricing or features change over time?',
  answer:
    'Yes. Droooly may update pricing models, service areas, features, workflows, policies, onboarding requirements, or platform experiences over time.',
},
{
  category: 'Safety & Policies',
  question: 'How can I report misuse or suspicious activity?',
  answer:
    'Users may contact Droooly support through the Contact Us page to report fraud, abusive behaviour, fake listings, suspicious activity, or policy violations.',
}]

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
