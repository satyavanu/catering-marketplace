import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  BadgeDollarSign,
  BarChart3,
  DatabaseZap,
  Gift,
  Headphones,
  Rocket,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react';
import PublicSupportShell, {
  DROOOLY_LOGO_URL,
} from '@/components/PublicSupportShell';

const benefits = [
  {
    icon: Gift,
    title: 'Increase Opportunities',
    text: 'Offer onboarding and verification solutions to more businesses.',
  },
  {
    icon: UserRoundPlus,
    title: 'Trusted by Businesses',
    text: "Leverage Droooly's secure and compliant partner platform.",
  },
  {
    icon: BadgeDollarSign,
    title: 'Earn More Revenue',
    text: 'Unlock new revenue streams with every successful referral.',
  },
  {
    icon: Headphones,
    title: "We're Here to Support",
    text: 'Get onboarding help, resources, and a dedicated partner team.',
  },
];

const steps = [
  {
    icon: UserRoundPlus,
    title: 'Apply',
    text: 'Submit your partner application and tell us about your business.',
  },
  {
    icon: ShieldCheck,
    title: 'Get Verified',
    text: 'Our team will review your application and onboard you as a partner.',
  },
  {
    icon: Rocket,
    title: 'Start Onboarding Businesses',
    text: 'Invite businesses to Droooly and help them complete onboarding.',
  },
  {
    icon: DatabaseZap,
    title: 'Earn & Grow',
    text: "Earn rewards and grow your business with Droooly's partner program.",
  },
];

const floatingCards = [
  {
    icon: UsersRound,
    label: 'Expand your network',
    style: { left: '7%', top: '12%' },
  },
  {
    icon: BarChart3,
    label: 'Grow revenue opportunities',
    style: { right: '5%', top: '12%' },
  },
  {
    icon: ShieldCheck,
    label: 'Secure & trusted platform',
    style: { left: '7%', bottom: '10%' },
  },
  {
    icon: Headphones,
    label: 'Dedicated partner support',
    style: { right: '5%', bottom: '10%' },
  },
];

export default function PartnerWithUsPage() {
  return (
    <PublicSupportShell>
      <style>{`
        @media (max-width: 920px) {
          .partner-hero {
            grid-template-columns: 1fr !important;
          }

          .partner-visual {
            min-height: 360px;
          }

          .partner-benefits {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .partner-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 620px) {
          .partner-benefits,
          .partner-steps {
            grid-template-columns: 1fr !important;
          }

          .partner-actions,
          .partner-cta {
            align-items: stretch !important;
            flex-direction: column !important;
          }

          .partner-visual {
            min-height: 300px;
          }

          .partner-orbit-card {
            position: static !important;
            width: 100% !important;
          }

          .partner-orbit {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .partner-center-logo {
            display: none !important;
          }
        }
      `}</style>

      <main style={styles.page}>
        <section className="partner-hero" style={styles.hero}>
          <div style={styles.heroCopy}>
            <p style={styles.kicker}>Become a Partner</p>
            <h1 style={styles.title}>Grow your business with Droooly</h1>
            <p style={styles.subtitle}>
              Join Droooly's partner network and help businesses easily onboard
              and verify their partners.
            </p>
            <div className="partner-actions" style={styles.heroActions}>
              <Link href="/onboarding" style={styles.primaryButton}>
                Join as a Partner
              </Link>
              <Link href="/faq" style={styles.secondaryButton}>
                Learn More
              </Link>
            </div>
          </div>

          <div className="partner-visual" style={styles.visual}>
            <div className="partner-orbit" style={styles.orbit}>
              <div className="partner-center-logo" style={styles.centerLogo}>
                <img
                  src={DROOOLY_LOGO_URL}
                  alt="Droooly"
                  style={styles.centerLogoImage}
                />
              </div>

              {floatingCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="partner-orbit-card"
                    style={{ ...styles.orbitCard, ...card.style }}
                  >
                    <span style={styles.orbitIcon}>
                      <Icon size={24} />
                    </span>
                    <span style={styles.orbitLabel}>{card.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="partner-benefits" style={styles.benefits}>
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title} style={styles.benefitItem}>
                <span style={styles.benefitIcon}>
                  <Icon size={28} />
                </span>
                <div>
                  <h2 style={styles.benefitTitle}>{benefit.title}</h2>
                  <p style={styles.benefitText}>{benefit.text}</p>
                </div>
                {index < benefits.length - 1 ? (
                  <span style={styles.benefitDivider} />
                ) : null}
              </article>
            );
          })}
        </section>

        <section style={styles.stepsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>How it works</h2>
            <p style={styles.sectionSubtitle}>
              Get started in just a few simple steps.
            </p>
          </div>

          <div className="partner-steps" style={styles.steps}>
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.title} style={styles.stepItem}>
                  <div style={styles.stepNumberWrap}>
                    <span style={styles.stepNumber}>{index + 1}</span>
                    {index < steps.length - 1 ? (
                      <span style={styles.stepLine} />
                    ) : null}
                  </div>
                  <Icon size={34} color="#8b5cf6" />
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepText}>{step.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="partner-cta" style={styles.cta}>
          <div style={styles.ctaIcon}>
            <UserRoundPlus size={30} />
          </div>
          <div style={styles.ctaCopy}>
            <h2 style={styles.ctaTitle}>Ready to join our partner network?</h2>
            <p style={styles.ctaText}>
              Help businesses build trust and grow together with Droooly.
            </p>
          </div>
          <Link href="/onboarding" style={styles.ctaButton}>
            Join as a Partner
          </Link>
        </section>
      </main>
    </PublicSupportShell>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    display: 'grid',
    gap: 28,
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 0.9fr) minmax(420px, 1.1fr)',
    gap: 30,
    alignItems: 'center',
    minHeight: 360,
    padding: 'clamp(34px, 5vw, 58px)',
    borderRadius: 14,
    background:
      'radial-gradient(circle at 72% 45%, rgba(139, 92, 246, 0.14), transparent 18rem), linear-gradient(135deg, #fbfaff 0%, #f6f0ff 48%, #ffffff 100%)',
  },
  heroCopy: {
    maxWidth: 500,
  },
  kicker: {
    margin: '0 0 16px',
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 18px',
    color: '#111827',
    fontSize: 'clamp(36px, 5vw, 54px)',
    fontWeight: 900,
    lineHeight: 1.14,
  },
  subtitle: {
    margin: '0 0 26px',
    color: '#64748b',
    fontSize: 18,
    lineHeight: 1.7,
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    minHeight: 48,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 28px',
    borderRadius: 8,
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 900,
    boxShadow: '0 14px 26px rgba(124, 58, 237, 0.22)',
  },
  secondaryButton: {
    minHeight: 48,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 28px',
    borderRadius: 8,
    border: '1px solid #a78bfa',
    color: '#7c3aed',
    background: '#ffffff',
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 900,
  },
  visual: {
    minHeight: 340,
    position: 'relative',
  },
  orbit: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 340,
  },
  centerLogo: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 170,
    height: 170,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: '#ffffff',
    border: '12px solid rgba(139, 92, 246, 0.08)',
    boxShadow: '0 18px 42px rgba(124, 58, 237, 0.14)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogoImage: {
    width: 112,
    height: 'auto',
  },
  orbitCard: {
    position: 'absolute',
    width: 126,
    minHeight: 108,
    padding: 14,
    borderRadius: 10,
    border: '1px solid #e8eaf0',
    background: '#ffffff',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.09)',
    display: 'grid',
    placeItems: 'center',
    gap: 8,
    color: '#7c3aed',
    textAlign: 'center',
  },
  orbitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: '#f3e8ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: 850,
    lineHeight: 1.35,
  },
  benefits: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    background: '#ffffff',
    overflow: 'hidden',
  },
  benefitItem: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '58px minmax(0, 1fr)',
    gap: 16,
    alignItems: 'center',
    padding: '26px 28px',
  },
  benefitIcon: {
    width: 58,
    height: 58,
    borderRadius: '50%',
    background: '#f3e8ff',
    color: '#8b5cf6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: {
    margin: '0 0 6px',
    color: '#111827',
    fontSize: 15,
    fontWeight: 900,
  },
  benefitText: {
    margin: 0,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.55,
  },
  benefitDivider: {
    position: 'absolute',
    right: 0,
    top: '24%',
    bottom: '24%',
    width: 1,
    background: '#e2e8f0',
  },
  stepsSection: {
    padding: '2px 0 8px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    margin: '0 0 8px',
    color: '#111827',
    fontSize: 27,
    fontWeight: 900,
  },
  sectionSubtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: 15,
    fontWeight: 750,
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 20,
  },
  stepItem: {
    position: 'relative',
    display: 'grid',
    justifyItems: 'center',
    gap: 12,
    textAlign: 'center',
    padding: '0 18px',
  },
  stepNumberWrap: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#f3e8ff',
    color: '#8b5cf6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 900,
    zIndex: 1,
  },
  stepLine: {
    position: 'absolute',
    left: 'calc(50% + 35px)',
    right: '-50%',
    top: '50%',
    borderTop: '2px dashed #ddd6fe',
  },
  stepTitle: {
    margin: 0,
    color: '#111827',
    fontSize: 16,
    fontWeight: 900,
  },
  stepText: {
    maxWidth: 230,
    margin: 0,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.65,
  },
  cta: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '26px 32px',
    borderRadius: 14,
    background: 'linear-gradient(135deg, #fbf7ff 0%, #f3e8ff 100%)',
  },
  ctaIcon: {
    width: 58,
    height: 58,
    borderRadius: '50%',
    background: '#f3e8ff',
    color: '#8b5cf6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaCopy: {
    flex: 1,
  },
  ctaTitle: {
    margin: '0 0 6px',
    color: '#111827',
    fontSize: 17,
    fontWeight: 900,
  },
  ctaText: {
    margin: 0,
    color: '#475569',
    fontSize: 14,
  },
  ctaButton: {
    minWidth: 176,
    minHeight: 50,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px',
    borderRadius: 8,
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 900,
    boxShadow: '0 14px 26px rgba(124, 58, 237, 0.22)',
  },
};
