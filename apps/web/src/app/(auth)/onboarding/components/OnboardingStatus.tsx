'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react';

interface CompletionData {
  capabilities: number;
  serviceAreas: number;
  menuItems: number;
  packages: number;
  hasKYC: boolean;
  agreementId?: string;
  agreementSignedAt?: string;
}

interface OnboardingStatusProps {
  completionData: CompletionData;
  isLoading: boolean;
  error: string;
  onComplete: () => Promise<void>;
  onDownloadAgreement: () => void;
  styles: { [key: string]: React.CSSProperties };
}

export default function OnboardingStatus({
  completionData,
  isLoading,
  error,
  onComplete,
  onDownloadAgreement,
  styles,
}: OnboardingStatusProps) {
  const [downloadingAgreement, setDownloadingAgreement] = useState(false);

  const handleDownloadAgreement = async () => {
    setDownloadingAgreement(true);
    try {
      await onDownloadAgreement();
    } finally {
      setDownloadingAgreement(false);
    }
  };

  const verificationItems = [
    {
      id: 'kyc',
      title: '🆔 KYC & Business Details',
      description: 'Your PAN, Aadhaar, and business information',
      status: 'reviewing',
    },
    {
      id: 'compliance',
      title: '📋 FSSAI / GST Verification',
      description: 'Food safety license and tax registration',
      status: 'reviewing',
    },
    {
      id: 'listings',
      title: '🍽️ Service Listings Review',
      description: 'Your capabilities and menu items',
      status: 'reviewing',
    },
  ];

  const whatHappensNext = [
    {
      step: 1,
      title: 'We Review Your Profile',
      description: 'Our team verifies your KYC, FSSAI, and GST details',
      timeframe: '24–48 hours',
    },
    {
      step: 2,
      title: 'You Get Instant Notification',
      description: 'Email, WhatsApp, and SMS updates',
      timeframe: 'Real-time',
    },
    {
      step: 3,
      title: 'Start Earning',
      description: 'List services, accept orders, and earn on Droooly',
      timeframe: 'Upon approval',
    },
  ];

  const benefitsAfterApproval = [
    {
      icon: '📲',
      title: 'List Services',
      description: 'Add unlimited services and offerings',
    },
    {
      icon: '✅',
      title: 'Accept Orders',
      description: 'Receive bookings from Droooly customers',
    },
    {
      icon: '💰',
      title: 'Start Earning',
      description: 'Get paid directly to your bank account (T+1)',
    },
    {
      icon: '⭐',
      title: 'Build Reputation',
      description: 'Get customer reviews and ratings',
    },
  ];

  const notificationChannels = [
    {
      icon: <Mail size={20} />,
      channel: 'Email',
      handle: 'to your registered email',
    },
    {
      icon: <MessageSquare size={20} />,
      channel: 'WhatsApp',
      handle: 'instant messaging updates',
    },
    {
      icon: <Smartphone size={20} />,
      channel: 'SMS',
      handle: 'text message alerts',
    },
  ];

  return (
    <>
      <div style={statusStyles.container}>
        {/* Header Section */}
        <div style={statusStyles.headerSection}>
          <div style={statusStyles.headerIcon}>🎉</div>
          <h1 style={statusStyles.mainTitle}>You're Almost Live on Droooly!</h1>
          <p style={statusStyles.headerSubtitle}>
            We've received your onboarding details and your Partner Agreement has been
            successfully accepted.
          </p>
          <div style={statusStyles.statusBadge}>
            <Clock size={16} style={{ marginRight: '0.5rem' }} />
            <span style={statusStyles.statusText}>Verification in Progress</span>
          </div>
        </div>

        {/* Agreement Download Section */}
        <div style={statusStyles.agreementSection}>
          <div style={statusStyles.agreementHeader}>
            <div>
              <h3 style={statusStyles.agreementTitle}>📜 Your Partner Agreement</h3>
              <p style={statusStyles.agreementSubtitle}>
                This is your signed agreement copy for your records
              </p>
            </div>
            <div style={statusStyles.agreementDate}>
              {completionData.agreementSignedAt && (
                <>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#6b7280' }}>
                    Signed on
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>
                    {new Date(completionData.agreementSignedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleDownloadAgreement}
            disabled={downloadingAgreement}
            style={{
              ...statusStyles.downloadButton,
              opacity: downloadingAgreement ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!downloadingAgreement) {
                e.currentTarget.style.backgroundColor = '#0284c7';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#06b6d4';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download size={18} />
            {downloadingAgreement ? 'Downloading...' : 'Download Agreement PDF'}
          </button>

          <p style={statusStyles.agreementNote}>
            ⚖️ This document constitutes your legally binding Partner Agreement with Droooly.
            Keep it safe for your records.
          </p>
        </div>

        {/* Current Status Section */}
        <div style={statusStyles.verificationSection}>
          <h3 style={statusStyles.sectionTitle}>
            <AlertCircle size={20} style={{ marginRight: '0.75rem' }} />
            We're Reviewing:
          </h3>

          <div style={statusStyles.verificationGrid}>
            {verificationItems.map((item) => (
              <div key={item.id} style={statusStyles.verificationItem}>
                <div style={statusStyles.verificationIcon}>
                  <Clock size={18} color="#f59e0b" />
                </div>
                <div>
                  <h4 style={statusStyles.verificationItemTitle}>{item.title}</h4>
                  <p style={statusStyles.verificationItemDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={statusStyles.timeframeBox}>
            <Clock size={20} color="#0284c7" style={{ marginRight: '0.75rem' }} />
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>
                ⏱️ Usually takes 24–48 hours
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                We prioritize quick approvals to get you started faster
              </p>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div style={statusStyles.whatNextSection}>
          <h3 style={statusStyles.sectionTitle}>What Happens Next?</h3>

          <div style={statusStyles.timelineContainer}>
            {whatHappensNext.map((item, index) => (
              <div key={item.step} style={statusStyles.timelineItem}>
                <div style={statusStyles.timelineNumber}>{item.step}</div>
                <div style={statusStyles.timelineContent}>
                  <h4 style={statusStyles.timelineTitle}>{item.title}</h4>
                  <p style={statusStyles.timelineDescription}>{item.description}</p>
                  <span style={statusStyles.timelineTimeframe}>⏱️ {item.timeframe}</span>
                </div>
                {index < whatHappensNext.length - 1 && (
                  <div style={statusStyles.timelineConnector} />
                )}
              </div>
            ))}
          </div>

          <div style={statusStyles.notificationChannelsBox}>
            <h4 style={statusStyles.notificationTitle}>📬 You'll be notified via:</h4>
            <div style={statusStyles.channelsGrid}>
              {notificationChannels.map((item) => (
                <div key={item.channel} style={statusStyles.channelItem}>
                  <div style={statusStyles.channelIcon}>{item.icon}</div>
                  <p style={statusStyles.channelName}>{item.channel}</p>
                  <p style={statusStyles.channelHandle}>{item.handle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Once Approved Section */}
        <div style={statusStyles.approvedSection}>
          <h3 style={statusStyles.sectionTitle}>
            <CheckCircle size={20} color="#10b981" style={{ marginRight: '0.75rem' }} />
            Once Approved, You Can:
          </h3>

          <div style={statusStyles.benefitsGrid}>
            {benefitsAfterApproval.map((benefit) => (
              <div key={benefit.title} style={statusStyles.benefitCard}>
                <div style={statusStyles.benefitIcon}>{benefit.icon}</div>
                <h4 style={statusStyles.benefitTitle}>{benefit.title}</h4>
                <p style={statusStyles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={statusStyles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.75rem' }} />
            <div>
              <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0' }}>Error</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{error}</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onComplete}
          disabled={isLoading}
          style={{
            ...statusStyles.ctaButton,
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#ea580c';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(249, 115, 22, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f97316';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isLoading ? 'Loading...' : 'Go to Dashboard'}
          <ArrowRight size={20} />
        </button>

        {/* Footer Note */}
        <p style={statusStyles.footerNote}>
          Have questions? Contact our support team at <strong>partners@droooly.com</strong>
        </p>
      </div>
    </>
  );
}

// Comprehensive Styles
const statusStyles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  } as React.CSSProperties,

  headerSection: {
    textAlign: 'center',
    marginBottom: '3rem',
    paddingBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
  } as React.CSSProperties,

  headerIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    display: 'block',
  } as React.CSSProperties,

  mainTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.5px',
  } as React.CSSProperties,

  headerSubtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.6',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  } as React.CSSProperties,

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.75rem 1.5rem',
    borderRadius: '2rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid #fcd34d',
  } as React.CSSProperties,

  statusText: {
    marginLeft: '0.5rem',
  } as React.CSSProperties,

  // Agreement Section
  agreementSection: {
    backgroundColor: '#eff6ff',
    border: '2px solid #0284c7',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  agreementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  agreementTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0c4a6e',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  agreementSubtitle: {
    fontSize: '0.85rem',
    color: '#0369a1',
    margin: 0,
  } as React.CSSProperties,

  agreementDate: {
    textAlign: 'right',
  } as React.CSSProperties,

  downloadButton: {
    width: '100%',
    padding: '1rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  agreementNote: {
    fontSize: '0.8rem',
    color: '#0369a1',
    margin: 0,
    fontStyle: 'italic',
  } as React.CSSProperties,

  // Verification Section
  verificationSection: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 1.25rem 0',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  verificationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  verificationItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #fce7f3',
  } as React.CSSProperties,

  verificationIcon: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  verificationItemTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  verificationItemDescription: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  timeframeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    borderRadius: '0.5rem',
    border: '1px solid #bfdbfe',
  } as React.CSSProperties,

  // What Next Section
  whatNextSection: {
    marginBottom: '2rem',
  } as React.CSSProperties,

  timelineContainer: {
    marginBottom: '2rem',
  } as React.CSSProperties,

  timelineItem: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
    position: 'relative',
  } as React.CSSProperties,

  timelineNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '50%',
    fontSize: '1.25rem',
    fontWeight: '700',
    flexShrink: 0,
  } as React.CSSProperties,

  timelineContent: {
    flex: 1,
    paddingTop: '0.5rem',
  } as React.CSSProperties,

  timelineTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  timelineDescription: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  timelineTimeframe: {
    fontSize: '0.85rem',
    color: '#0284c7',
    fontWeight: '600',
  } as React.CSSProperties,

  timelineConnector: {
    position: 'absolute',
    left: '24px',
    top: '50px',
    width: '2px',
    height: '40px',
    backgroundColor: '#e5e7eb',
  } as React.CSSProperties,

  notificationChannelsBox: {
    backgroundColor: '#f0fdf4',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #86efac',
  } as React.CSSProperties,

  notificationTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#065f46',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  channelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,

  channelItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #d1fae5',
    textAlign: 'center',
  } as React.CSSProperties,

  channelIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#10b981',
  } as React.CSSProperties,

  channelName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  } as React.CSSProperties,

  channelHandle: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  // Approved Section
  approvedSection: {
    backgroundColor: '#f0fdf4',
    border: '2px solid #86efac',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
  } as React.CSSProperties,

  benefitCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    textAlign: 'center',
    border: '1px solid #d1fae5',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  benefitIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
    display: 'block',
  } as React.CSSProperties,

  benefitTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#065f46',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  benefitDescription: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  } as React.CSSProperties,

  // Error & CTA
  errorMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#991b1b',
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  ctaButton: {
    width: '100%',
    padding: '1.25rem 2rem',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
  } as React.CSSProperties,

  footerNote: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,
};