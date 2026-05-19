import Link from 'next/link';
import type { CSSProperties } from 'react';
import PublicSupportShell from '@/components/PublicSupportShell';

const terms = [
  {
    title: '1. Acceptance of terms',
    body: 'By accessing or using Droooly, you agree to these Terms of Use, our Privacy Policy, and any booking, cancellation, refund, partner, or payment terms shown during use. If you do not agree, please do not use Droooly.',
  },
  {
    title: '2. About Droooly',
    body: 'Droooly is operated by Droooly Labs Private Limited. Droooly is a food services marketplace that helps customers discover and book catering, private chef, restaurant experience, and related food service providers. Droooly may also provide partner onboarding, verification, service listing, quote, booking, payment, payout, and support tools.',
  },
  {
    title: '3. Marketplace role',
    body: 'Droooly provides technology and marketplace services. Unless clearly stated otherwise, food services are provided by independent partners, chefs, caterers, restaurants, or service providers. Droooly may help facilitate bookings, payments, communication, support, refunds, and issue resolution, but the partner remains responsible for service quality, food preparation, licences, staff, delivery, hygiene, and fulfilment.',
  },
  {
    title: '4. Account responsibilities',
    body: 'You agree to provide accurate, complete, and updated information. You are responsible for keeping your account, login method, OTP, device, and password secure. You must not create fake accounts, impersonate others, misuse the platform, or submit false booking, payment, partner, KYC, tax, or payout information.',
  },
  {
    title: '5. Customer bookings and quote requests',
    body: 'Customers may place instant bookings, request quotes, approve partner quotes, pay deposits, make full payments, or cancel bookings depending on the service flow. Booking details such as event date, time, guest count, address, menu, package, add-ons, dietary needs, and special instructions must be accurate. Changes may be subject to partner approval, availability, price revision, or cancellation rules.',
  },
  {
    title: '6. Partner obligations',
    body: 'Partners must provide accurate business, service, pricing, package, availability, licence, tax, KYC, bank, and payout information. Partners are responsible for maintaining required registrations, food safety standards, staff conduct, hygiene, service fulfilment, delivery, customer communication, and compliance with applicable laws. Droooly may review, approve, reject, suspend, or remove partner accounts or services where needed.',
  },
  {
    title: '7. Pricing, platform fees, and taxes',
    body: 'Prices may include partner charges, package prices, add-ons, delivery charges, taxes, platform fees, service fees, discounts, or other applicable charges. The final amount payable will be shown before payment wherever applicable. Fees, taxes, and charges may vary by country, city, service type, partner, booking value, or campaign.',
  },
  {
    title: '8. Payments, deposits, and payouts',
    body: 'Droooly may collect payments through third-party payment providers. Some bookings may require a deposit or advance payment to confirm the order. Partner payouts may be processed after successful service completion, subject to settlement cycles, deductions, refunds, disputes, cancellations, chargebacks, tax compliance, or other platform rules.',
  },
  {
    title: '9. Cancellations, refunds, and disputes',
    body: 'Cancellation and refund eligibility may depend on the service type, partner rules, event date, preparation work already started, custom menu planning, delivery arrangements, payment status, and applicable law. If a customer or partner cancels, Droooly may apply cancellation charges, refund rules, payout deductions, or dispute review processes. Refund timelines may also depend on the payment provider or bank.',
  },
  {
    title: '10. Partner cancellation or service failure',
    body: 'If a partner cancels late, fails to deliver, provides materially incorrect service, or violates platform standards, Droooly may take action including customer support, refund review, payout hold, payout deduction, suspension, delisting, or recovery of applicable charges. Droooly may also help the customer find an alternative provider where possible, but availability is not guaranteed.',
  },
  {
    title: '11. Customer conduct',
    body: 'Customers must provide accurate booking details, make payments on time, treat partners and staff respectfully, avoid abusive behaviour, and not misuse refunds, disputes, chargebacks, reviews, or platform support. Droooly may restrict or suspend accounts involved in fraud, abuse, non-payment, unsafe behaviour, or repeated policy violations.',
  },
  {
    title: '12. Content, listings, and reviews',
    body: 'Partners may upload service descriptions, packages, images, menus, pricing, and business information. Customers may submit reviews, ratings, messages, and support content. You must not upload misleading, illegal, offensive, copied, infringing, or harmful content. Droooly may moderate, edit, reject, remove, or restrict content that violates these terms or platform standards.',
  },
  {
    title: '13. Verification and KYC',
    body: 'Droooly may request identity, business, tax, licence, bank, or food safety verification documents from partners. Approval does not guarantee future eligibility. Droooly may re-check documents, request updates, pause payouts, suspend services, or reject onboarding if information is incomplete, expired, false, risky, or non-compliant.',
  },
  {
    title: '14. Platform availability',
    body: 'We aim to keep Droooly reliable and secure, but we do not guarantee uninterrupted, error-free, or always available access. Features may change, be paused, or be removed. Maintenance, third-party failures, payment provider issues, network problems, or security incidents may affect availability.',
  },
  {
    title: '15. Prohibited use',
    body: 'You must not misuse Droooly, scrape data, reverse engineer the platform, interfere with systems, bypass security, abuse offers, submit fraudulent data, harass users, violate laws, infringe intellectual property, or use Droooly for unsafe, unlawful, misleading, or harmful activity.',
  },
  {
    title: '16. Intellectual property',
    body: 'Droooly, its name, logo, branding, design, software, content, workflows, and platform materials belong to Droooly Labs Private Limited or its licensors. You may not copy, reuse, modify, distribute, or commercially exploit Droooly materials without written permission.',
  },
  {
    title: '17. Limitation of liability',
    body: 'To the maximum extent permitted by law, Droooly will not be liable for indirect, incidental, special, consequential, punitive, or loss-of-profit damages. Droooly is not responsible for partner acts, food quality, event outcomes, customer-provided incorrect details, third-party payment failures, or circumstances outside our reasonable control, except where liability cannot be excluded by law.',
  },
  {
    title: '18. Account suspension or termination',
    body: 'We may suspend, restrict, or terminate access to Droooly if we believe an account has violated these terms, created risk, submitted false information, failed verification, misused payments or refunds, harmed users, or breached applicable law. You may also stop using Droooly or request account deletion subject to our Privacy Policy.',
  },
  {
    title: '19. Privacy',
    body: 'Your use of Droooly is also governed by our Privacy Policy, which explains how we collect, use, retain, share, and delete personal data, including how account deletion works when active bookings, legal records, payments, refunds, disputes, KYC, or payout obligations exist.',
  },
  {
    title: '20. Updates to these terms',
    body: 'We may update these Terms of Use from time to time. The updated version will be posted on this page with a revised “Last updated” date. Continued use of Droooly after changes are posted means you accept the updated terms.',
  },
];

export default function TermsOfUsePage() {
  return (
    <PublicSupportShell>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>Terms of Use</p>
          <h1 style={styles.title}>Simple rules for using Droooly</h1>
          <p style={styles.subtitle}>Last updated: May 19, 2026</p>
          <p style={styles.heroText}>
            These terms explain how customers, partners, and Droooly work together across bookings,
            quotes, payments, cancellations, refunds, partner onboarding, and marketplace support.
          </p>
        </section>

        <aside style={styles.notice}>
          <strong>Important:</strong> Droooly is a marketplace platform. Independent partners are
          responsible for the food services they provide. Droooly may support booking, payment,
          verification, refund, payout, and dispute workflows, but service fulfilment remains the
          partner’s responsibility unless specifically stated otherwise.
        </aside>

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
              Contact us for clarification about bookings, partner onboarding, refunds, or platform
              policies.
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
    letterSpacing: '0.08em',
  },
  title: {
    margin: '0 0 10px',
    color: '#151126',
    fontSize: 'clamp(28px, 5vw, 42px)',
    fontWeight: 850,
    lineHeight: 1.12,
  },
  subtitle: {
    margin: '0 0 14px',
    color: '#64748b',
    fontSize: 15,
    fontWeight: 700,
  },
  heroText: {
    maxWidth: 780,
    margin: '0 auto',
    color: '#475569',
    fontSize: 16,
    lineHeight: 1.75,
  },
  notice: {
    margin: '0 0 28px',
    padding: '18px 20px',
    borderRadius: 16,
    border: '1px solid #ddd6fe',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f8fbff 100%)',
    color: '#3f3f46',
    fontSize: 15,
    lineHeight: 1.75,
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
    fontWeight: 850,
  },
  body: {
    margin: 0,
    color: '#475569',
    fontSize: 15,
    lineHeight: 1.85,
  },
  callout: {
    marginTop: 34,
    padding: '22px 24px',
    borderRadius: 16,
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
    lineHeight: 1.6,
  },
  button: {
    minHeight: 40,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 18px',
    borderRadius: 10,
    border: '1px solid #a78bfa',
    color: '#7c3aed',
    background: '#ffffff',
    fontSize: 13,
    fontWeight: 850,
    textDecoration: 'none',
  },
};