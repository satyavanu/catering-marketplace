import Link from 'next/link';
import type { CSSProperties } from 'react';
import PublicSupportShell from '@/components/PublicSupportShell';

const sections = [
  {
    title: '1. Who we are',
    body: (
      <>
        Droooly is operated by <strong>Droooly Labs Private Limited</strong>. Droooly is a food
        services marketplace that helps customers discover and book catering, private chef,
        restaurant experience, and related food service providers.
      </>
    ),
  },
  {
    title: '2. Information we collect',
    body: (
      <>
        We may collect your name, email address, mobile number, login details, delivery or event
        address, booking details, guest count, food preferences, dietary requirements, payment
        status, support messages, device information, browser information, usage activity, and
        communication preferences. For partners, we may also collect business profile details,
        service areas, menu or package details, bank payout details, tax details, KYC documents,
        licences, and verification information.
      </>
    ),
  },
  {
    title: '3. How we use your information',
    body: (
      <>
        We use your information to create and manage accounts, process bookings, request quotes,
        confirm orders, collect payments, manage refunds, verify partners, schedule payouts,
        provide customer support, send service updates, prevent fraud or misuse, improve marketplace
        quality, and comply with legal, tax, accounting, safety, and regulatory requirements.
      </>
    ),
  },
  {
    title: '4. Bookings, quotes, and active orders',
    body: (
      <>
        When you create a booking, quote request, or order, we store the information required to
        complete the service. If an order is active, pending, disputed, cancelled, refundable, or
        legally required for records, we may retain the related booking, payment, invoice, refund,
        support, and settlement information even if you request account deletion. This helps us
        protect customers, partners, and Droooly from incomplete fulfilment, fraud, disputes, charge
        backs, tax issues, or payout errors.
      </>
    ),
  },
  {
    title: '5. How account deletion works',
    body: (
      <>
        You can request deletion from the app through <strong>Account → Delete Account</strong>, or
        by contacting us from the Contact Us page. When deletion is requested, we will deactivate or
        delete your account profile and remove personal data that is no longer required. Some data
        may be retained where required for active orders, legal compliance, tax records, fraud
        prevention, dispute resolution, payment reconciliation, partner payout, safety, or
        marketplace integrity.
      </>
    ),
  },
  {
    title: '6. What may be deleted',
    body: (
      <>
        Subject to legal and operational requirements, deletion may include your profile details,
        saved preferences, saved addresses, non-essential communication preferences, and inactive
        account data. Where possible, we may anonymise or de-identify historical marketplace records
        instead of deleting the entire transaction record.
      </>
    ),
  },
  {
    title: '7. What may be retained',
    body: (
      <>
        We may retain invoices, payment references, refunds, booking history, tax records, support
        tickets, partner KYC records, payout records, agreement records, audit logs, fraud prevention
        records, and dispute-related information for as long as necessary under applicable law,
        accounting requirements, platform safety, or legitimate business needs.
      </>
    ),
  },
  {
    title: '8. Payments and payouts',
    body: (
      <>
        Droooly may use third-party payment processors to collect customer payments, process
        deposits, issue refunds, and manage partner payouts. We do not intend to store full card,
        UPI, or sensitive payment credentials on our own systems. Payment providers may process
        information according to their own privacy and security policies.
      </>
    ),
  },
  {
    title: '9. Sharing with customers, partners, and providers',
    body: (
      <>
        We share only the information needed to operate the marketplace. For example, customers may
        share event details with partners, partners may receive booking details needed to fulfil an
        order, and Droooly may use service providers for hosting, analytics, communication, payment,
        verification, security, and support. We may also disclose information when required by law,
        court order, regulatory authority, safety investigation, or fraud prevention need.
      </>
    ),
  },
  {
    title: '10. Communications',
    body: (
      <>
        We may contact you by email, SMS, WhatsApp, phone, push notification, or in-app message for
        OTP verification, booking updates, quote updates, payment status, support, refunds,
        cancellations, partner onboarding, payout updates, policy updates, and important service
        announcements. You may opt out of promotional messages where supported, but transactional
        messages may still be sent.
      </>
    ),
  },
  {
    title: '11. Cookies, analytics, and device data',
    body: (
      <>
        We may use cookies, analytics tools, logs, and similar technologies to keep Droooly secure,
        remember preferences, understand usage, improve performance, detect abuse, and improve the
        user experience. You can control some cookie or tracking settings through your browser or
        device settings.
      </>
    ),
  },
  {
    title: '12. Data security',
    body: (
      <>
        We use reasonable administrative, technical, and organisational safeguards to protect
        information against unauthorised access, misuse, loss, alteration, or disclosure. However, no
        internet-based system can be guaranteed to be fully secure. You are responsible for keeping
        your login credentials and device access secure.
      </>
    ),
  },
  {
    title: '13. Your rights and choices',
    body: (
      <>
        You may request access, correction, update, deletion, or withdrawal of consent where
        applicable. We may need to verify your identity before processing such requests. Certain
        requests may be limited where retention is required for active orders, legal compliance,
        taxation, fraud prevention, security, dispute handling, or marketplace integrity.
      </>
    ),
  },
  {
    title: '14. Children’s privacy',
    body: (
      <>
        Droooly is not intended for use by children without parental or guardian involvement. If we
        learn that we have collected personal data from a child without appropriate consent, we will
        take reasonable steps to delete or restrict such information.
      </>
    ),
  },
  {
    title: '15. Changes to this policy',
    body: (
      <>
        We may update this Privacy Policy from time to time. The updated version will be posted on
        this page with a revised “Last updated” date. Continued use of Droooly after an update means
        you accept the revised policy.
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PublicSupportShell>
      <main style={styles.card}>
        <section style={styles.hero}>
          <p style={styles.kicker}>Privacy Policy</p>
          <h1 style={styles.title}>How Droooly handles and protects your data</h1>
          <p style={styles.subtitle}>Last updated: May 19, 2026</p>
          <p style={styles.heroText}>
            This policy explains what information we collect, why we collect it, how we use it,
            when we share it, and how you can request account or data deletion.
          </p>
        </section>

        <aside style={styles.notice}>
          <strong>Account deletion:</strong> You can request deletion from the app using{' '}
          <strong>Account → Delete Account</strong>. If active bookings, refunds, disputes, invoices,
          taxes, KYC, or payout records exist, we may retain only the information required to
          complete those obligations.
        </aside>

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
            <h2 style={styles.calloutTitle}>Questions or deletion request?</h2>
            <p style={styles.calloutText}>
              Contact us for privacy questions, data correction, account deletion, or grievance
              requests.
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
    maxWidth: 760,
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