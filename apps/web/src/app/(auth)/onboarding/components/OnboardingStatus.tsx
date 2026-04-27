'use client';

import React, { useMemo } from 'react';
import type { PartnerOnboardingPayload } from '../types';

interface OnboardingStatusProps {
  onboardingData: PartnerOnboardingPayload;
  isLoading?: boolean;
  error?: string;
  onComplete: () => void | Promise<void>;
  onBack?: () => void;
}

export default function OnboardingStatus({
  onboardingData,
  isLoading = false,
  error,
  onComplete,
  onBack,
}: OnboardingStatusProps) {
  const summary = useMemo(() => {
    return {
      businessTypes: onboardingData.business.businessTypeIds.length,
      cuisines: onboardingData.business.cuisineIds.length,
      eventTypes: onboardingData.business.eventTypeIds.length,
      dietTypes: onboardingData.business.dietTypeIds.length,
      serviceStyles: onboardingData.business.serviceStyleIds.length,
      serviceAreas: onboardingData.delivery.canServeEntireCity
        ? 'Entire city'
        : `${onboardingData.delivery.serviceAreas.length} pincodes`,
      hasKyc: Boolean(onboardingData.kycBank.panNumber),
      hasBank: Boolean(
        onboardingData.kycBank.accountNumber &&
          onboardingData.kycBank.ifscCode
      ),
      hasAgreement: Boolean(onboardingData.agreement?.termsAccepted),
    };
  }, [onboardingData]);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.statusPill}>Final review</div>

        <h1 style={styles.title}>Your partner profile is ready to submit</h1>

        <p style={styles.subtitle}>
          Review the final onboarding summary below. Once submitted, Droooly will
          verify your details and activate your partner profile after approval.
        </p>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Profile summary</h2>

        <div style={styles.summaryGrid}>
          <SummaryItem
            label="Partner name"
            value={onboardingData.profile.contactName || 'Not provided'}
          />
          <SummaryItem
            label="Partner type"
            value={formatValue(onboardingData.profile.partnerType)}
          />
          <SummaryItem
            label="Business name"
            value={onboardingData.profile.businessName || 'Not provided'}
          />
          <SummaryItem
            label="Country"
            value={onboardingData.profile.countryCode}
          />
          <SummaryItem
            label="Kitchen address"
            value={onboardingData.profile.kitchenAddress || 'Not provided'}
          />
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Business selections</h2>

        <div style={styles.metricGrid}>
          <Metric label="Business types" value={summary.businessTypes} />
          <Metric label="Cuisines & specializations" value={summary.cuisines} />
          <Metric label="Event types" value={summary.eventTypes} />
          <Metric label="Dietary options" value={summary.dietTypes} />
          <Metric label="Service styles" value={summary.serviceStyles} />
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Delivery & operations</h2>

        <div style={styles.summaryGrid}>
          <SummaryItem
            label="Delivery"
            value={onboardingData.delivery.deliveryAvailable ? 'Enabled' : 'Disabled'}
          />
          <SummaryItem
            label="Pickup"
            value={onboardingData.delivery.pickupAvailable ? 'Enabled' : 'Disabled'}
          />
          <SummaryItem label="Service areas" value={summary.serviceAreas} />
          <SummaryItem
            label="Max delivery distance"
            value={
              onboardingData.delivery.maxDeliveryDistance
                ? `${onboardingData.delivery.maxDeliveryDistance} ${onboardingData.delivery.distanceUnit}`
                : 'Not set'
            }
          />
          <SummaryItem
            label="Advance notice"
            value={`${onboardingData.operations.advanceNoticeHours} hours`}
          />
          <SummaryItem
            label="Custom orders"
            value={
              onboardingData.operations.allowsCustomOrders
                ? 'Allowed'
                : 'Not allowed'
            }
          />
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Verification readiness</h2>

        <div style={styles.checkList}>
          <CheckRow
            title="KYC details"
            description="PAN and optional compliance details are captured."
            completed={summary.hasKyc}
          />
          <CheckRow
            title="Bank details"
            description="Payout account details are captured."
            completed={summary.hasBank}
          />
          <CheckRow
            title="Partner agreement"
            description="Agreement acceptance and signature are captured."
            completed={summary.hasAgreement}
          />
        </div>
      </section>

      <section style={styles.infoBox}>
        <h3 style={styles.infoTitle}>What happens next?</h3>
        <ol style={styles.nextStepsList}>
          <li>Droooly reviews your profile, KYC, service areas, and agreement.</li>
          <li>You will receive updates by your registered email or phone.</li>
          <li>After approval, your partner dashboard will be enabled.</li>
        </ol>
      </section>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={onComplete}
          disabled={isLoading}
          style={{
            ...styles.primaryButton,
            ...(isLoading ? styles.disabledButton : {}),
          }}
        >
          {isLoading ? 'Submitting onboarding...' : 'Submit Onboarding'}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={styles.secondaryButton}
          >
            Back
          </button>
        )}
      </div>

      <p style={styles.footerNote}>
        You can update business, delivery, and payout details later from your
        partner dashboard.
      </p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div style={styles.summaryItem}>
      <p style={styles.summaryLabel}>{label}</p>
      <p style={styles.summaryValue}>{value}</p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div style={styles.metricCard}>
      <p style={styles.metricValue}>{value}</p>
      <p style={styles.metricLabel}>{label}</p>
    </div>
  );
}

function CheckRow({
  title,
  description,
  completed,
}: {
  title: string;
  description: string;
  completed: boolean;
}) {
  return (
    <div style={styles.checkRow}>
      <div
        style={{
          ...styles.checkDot,
          backgroundColor: completed ? '#16a34a' : '#f59e0b',
        }}
      />
      <div>
        <p style={styles.checkTitle}>{title}</p>
        <p style={styles.checkDescription}>
          {completed ? description : 'Needs review before final activation.'}
        </p>
      </div>
    </div>
  );
}

function formatValue(value?: string | null) {
  if (!value) return 'Not provided';

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  statusPill: {
    display: 'inline-flex',
    padding: '0.45rem 0.85rem',
    borderRadius: '999px',
    backgroundColor: '#fff7ed',
    color: '#c2410c',
    fontSize: '0.8rem',
    fontWeight: 800,
    marginBottom: '1rem',
  },

  title: {
    margin: 0,
    fontSize: '1.9rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.03em',
  },

  subtitle: {
    maxWidth: '620px',
    margin: '0.75rem auto 0',
    fontSize: '0.98rem',
    color: '#6b7280',
    lineHeight: 1.6,
  },

  section: {
    padding: '1.25rem',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
    marginBottom: '1.25rem',
  },

  sectionTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: 850,
    color: '#111827',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },

  summaryItem: {
    padding: '0.95rem',
    borderRadius: '0.875rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
  },

  summaryLabel: {
    margin: '0 0 0.35rem 0',
    fontSize: '0.78rem',
    fontWeight: 800,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  summaryValue: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 750,
    color: '#111827',
    lineHeight: 1.45,
  },

  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },

  metricCard: {
    padding: '1rem',
    borderRadius: '1rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  },

  metricValue: {
    margin: 0,
    fontSize: '1.65rem',
    fontWeight: 900,
    color: '#f97316',
  },

  metricLabel: {
    margin: '0.35rem 0 0 0',
    fontSize: '0.83rem',
    fontWeight: 700,
    color: '#6b7280',
  },

  checkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },

  checkRow: {
    display: 'flex',
    gap: '0.875rem',
    alignItems: 'flex-start',
    padding: '0.95rem',
    borderRadius: '0.875rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
  },

  checkDot: {
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '999px',
    marginTop: '0.35rem',
    flexShrink: 0,
  },

  checkTitle: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#111827',
  },

  checkDescription: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.85rem',
    color: '#6b7280',
    lineHeight: 1.45,
  },

  infoBox: {
    padding: '1.25rem',
    borderRadius: '1rem',
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    marginBottom: '1.25rem',
  },

  infoTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '1rem',
    fontWeight: 850,
    color: '#9a3412',
  },

  nextStepsList: {
    margin: 0,
    paddingLeft: '1.25rem',
    color: '#9a3412',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 650,
    marginBottom: '1rem',
  },

  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    marginTop: '0.5rem',
  },

  primaryButton: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.875rem',
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 850,
    cursor: 'pointer',
  },

  secondaryButton: {
    width: '100%',
    padding: '1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: 750,
    cursor: 'pointer',
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },

  footerNote: {
    margin: '1rem 0 0 0',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },
};