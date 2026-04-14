'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useCompleteOnboarding } from '@catering-marketplace/query-client';

export const TermsAndCommunications = () => {
  const router = useRouter();
  const completeOnboardingMutation = useCompleteOnboarding();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Local state for all preferences
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [smsMarketing, setSmsMarketing] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

  const isMandatoryComplete = agreeTerms && agreePrivacy;

  const handleContinueClick = async () => {
    setError(null);

    if (!isMandatoryComplete) {
      setError('Please accept both Terms & Conditions and Privacy Policy to continue');
      return;
    }

    try {
      console.log('🔄 Starting onboarding completion...');
      console.log('📋 Payload:', {
        agreeTerms,
        agreePrivacy,
        emailMarketing,
        smsMarketing,
        pushNotifications,
      });

      // Wait for the mutation to complete
      const response = await completeOnboardingMutation.mutateAsync({
        agreeTerms,
        agreePrivacy,
        emailMarketing,
        smsMarketing,
        pushNotifications,
      });

      console.log('✅ Onboarding completed successfully!');
      console.log('📦 Response received:', response);
      console.log('📊 Response data:', {
        profile: response?.data?.profile,
        preferences: response?.data?.preferences,
        message: response?.message,
        timestamp: response?.timestamp,
      });

      // Set redirecting state to show loading feedback
      setIsRedirecting(true);
      console.log('🚀 Redirecting to dashboard...');

      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      const role = session?.user?.role ?? 'customer'; // Default to 'customer' if role is missing
      router.push(`/${role}/dashboard`);

      console.log('✨ Redirect initiated');
    } catch (err) {
      console.error('❌ Error during onboarding:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        full: err,
      });

      const errorMessage = err instanceof Error ? err.message : 'Failed to save preferences. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section with Gradient */}
     

      {/* Legal & Compliance Section */}
      <div style={styles.legalSection}>
       

        <div style={styles.checkboxesGroup}>
          {/* Terms & Conditions Checkbox */}
          <div
            style={{
              ...styles.checkboxCard,
              borderColor: agreeTerms ? '#10b981' : '#e5e7eb',
              backgroundColor: agreeTerms ? '#ecfdf5' : '#fafafa',
            }}
          >
            <label style={styles.checkboxLabel}>
              <div style={styles.customCheckboxContainer}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={styles.hiddenCheckbox}
                  disabled={completeOnboardingMutation.isPending || isRedirecting}
                />
                <div
                  style={{
                    ...styles.customCheckbox,
                    backgroundColor: agreeTerms ? '#10b981' : 'white',
                    borderColor: agreeTerms ? '#10b981' : '#d1d5db',
                  }}
                >
                  {agreeTerms && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div style={styles.checkboxTextWrapper}>
                <span style={styles.checkboxMainText}>
                  I agree to the{' '}
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Terms & Conditions
                  </a>
                </span>
                <span style={styles.asterisk}>*</span>
              </div>
            </label>
            <p style={styles.checkboxHelper}>
              Read our terms to understand the rules and guidelines
            </p>
          </div>

          {/* Privacy Policy Checkbox */}
          <div
            style={{
              ...styles.checkboxCard,
              borderColor: agreePrivacy ? '#10b981' : '#e5e7eb',
              backgroundColor: agreePrivacy ? '#ecfdf5' : '#fafafa',
            }}
          >
            <label style={styles.checkboxLabel}>
              <div style={styles.customCheckboxContainer}>
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  style={styles.hiddenCheckbox}
                  disabled={completeOnboardingMutation.isPending || isRedirecting}
                />
                <div
                  style={{
                    ...styles.customCheckbox,
                    backgroundColor: agreePrivacy ? '#10b981' : 'white',
                    borderColor: agreePrivacy ? '#10b981' : '#d1d5db',
                  }}
                >
                  {agreePrivacy && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div style={styles.checkboxTextWrapper}>
                <span style={styles.checkboxMainText}>
                  I agree to the{' '}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Privacy Policy
                  </a>
                </span>
                <span style={styles.asterisk}>*</span>
              </div>
            </label>
            <p style={styles.checkboxHelper}>
              Understand how we collect, use, and protect your data
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          style={{
            ...styles.statusIndicator,
            backgroundColor: isMandatoryComplete ? '#ecfdf5' : '#fef3c7',
            borderColor: isMandatoryComplete ? '#6ee7b7' : '#fcd34d',
          }}
        >
          <span style={styles.statusIcon}>{isMandatoryComplete ? '✓' : '⚠️'}</span>
          <span
            style={{
              ...styles.statusText,
              color: isMandatoryComplete ? '#065f46' : '#92400e',
            }}
          >
            {isMandatoryComplete ? 'All legal agreements accepted ✨' : 'Please accept both agreements to continue'}
          </span>
        </div>
      </div>

      {/* Communication Preferences Section */}
      <div style={styles.communicationSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>📬</span>
          <div>
            <h3 style={styles.sectionTitle}>
              Communication Preferences
              <span style={styles.optionalBadge}>OPTIONAL</span>
            </h3>
            <p style={styles.sectionDescription}>Choose how you'd like to hear from us about offers and updates</p>
          </div>
        </div>

        <div style={styles.communicationGrid}>
          {/* Email Marketing Card */}
          <div
            style={{
              ...styles.communicationCard,
              borderColor: emailMarketing ? '#3b82f6' : '#e5e7eb',
              backgroundColor: emailMarketing ? '#eff6ff' : '#ffffff',
              boxShadow: emailMarketing ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
              transform: emailMarketing ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <label style={styles.communicationLabel}>
              <div style={styles.customCheckboxContainer}>
                <input
                  type="checkbox"
                  checked={emailMarketing}
                  onChange={(e) => setEmailMarketing(e.target.checked)}
                  style={styles.hiddenCheckbox}
                  disabled={completeOnboardingMutation.isPending || isRedirecting}
                />
                <div
                  style={{
                    ...styles.customCheckbox,
                    backgroundColor: emailMarketing ? '#3b82f6' : 'white',
                    borderColor: emailMarketing ? '#3b82f6' : '#d1d5db',
                  }}
                >
                  {emailMarketing && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div style={styles.communicationContent}>
                <div style={styles.communicationIconBox}>
                  <span style={styles.communicationIcon}>📧</span>
                </div>
                <div style={styles.communicationText}>
                  <p style={styles.communicationTitle}>Email Updates</p>
                  <p style={styles.communicationDesc}>Promotions, offers & weekly updates</p>
                </div>
              </div>
            </label>
          </div>

          {/* SMS/WhatsApp Marketing Card */}
          <div
            style={{
              ...styles.communicationCard,
              borderColor: smsMarketing ? '#3b82f6' : '#e5e7eb',
              backgroundColor: smsMarketing ? '#eff6ff' : '#ffffff',
              boxShadow: smsMarketing ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
              transform: smsMarketing ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <label style={styles.communicationLabel}>
              <div style={styles.customCheckboxContainer}>
                <input
                  type="checkbox"
                  checked={smsMarketing}
                  onChange={(e) => setSmsMarketing(e.target.checked)}
                  style={styles.hiddenCheckbox}
                  disabled={completeOnboardingMutation.isPending || isRedirecting}
                />
                <div
                  style={{
                    ...styles.customCheckbox,
                    backgroundColor: smsMarketing ? '#3b82f6' : 'white',
                    borderColor: smsMarketing ? '#3b82f6' : '#d1d5db',
                  }}
                >
                  {smsMarketing && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div style={styles.communicationContent}>
                <div style={styles.communicationIconBox}>
                  <span style={styles.communicationIcon}>📱</span>
                </div>
                <div style={styles.communicationText}>
                  <p style={styles.communicationTitle}>SMS & WhatsApp</p>
                  <p style={styles.communicationDesc}>Exclusive deals & instant alerts</p>
                </div>
              </div>
            </label>
          </div>

          {/* Push Notifications Card */}
          <div
            style={{
              ...styles.communicationCard,
              borderColor: pushNotifications ? '#3b82f6' : '#e5e7eb',
              backgroundColor: pushNotifications ? '#eff6ff' : '#ffffff',
              boxShadow: pushNotifications ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
              transform: pushNotifications ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <label style={styles.communicationLabel}>
              <div style={styles.customCheckboxContainer}>
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  style={styles.hiddenCheckbox}
                  disabled={completeOnboardingMutation.isPending || isRedirecting}
                />
                <div
                  style={{
                    ...styles.customCheckbox,
                    backgroundColor: pushNotifications ? '#3b82f6' : 'white',
                    borderColor: pushNotifications ? '#3b82f6' : '#d1d5db',
                  }}
                >
                  {pushNotifications && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div style={styles.communicationContent}>
                <div style={styles.communicationIconBox}>
                  <span style={styles.communicationIcon}>🔔</span>
                </div>
                <div style={styles.communicationText}>
                  <p style={styles.communicationTitle}>Push Notifications</p>
                  <p style={styles.communicationDesc}>Real-time bookings & special deals</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Note */}
        <div style={styles.preferencesFooter}>
          <p style={styles.preferencesFooterText}>
            💡 You can manage these preferences anytime in your account settings. We'll never share your data with third
            parties.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorContent}>
            <span style={styles.errorIcon}>⚠️</span>
            <div>
              <p style={styles.errorTitle}>Something went wrong</p>
              <p style={styles.errorMessage}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div style={styles.buttonWrapper}>
        <button
          onClick={handleContinueClick}
          disabled={!isMandatoryComplete || completeOnboardingMutation.isPending || isRedirecting}
          style={{
            ...styles.continueButton,
            opacity: isMandatoryComplete && !isRedirecting ? 1 : 0.6,
            cursor:
              isMandatoryComplete && !completeOnboardingMutation.isPending && !isRedirecting
                ? 'pointer'
                : 'not-allowed',
            backgroundColor: isMandatoryComplete ? '#10b981' : '#9ca3af',
          }}
          onMouseEnter={(e) => {
            if (isMandatoryComplete && !completeOnboardingMutation.isPending && !isRedirecting) {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (isMandatoryComplete && !completeOnboardingMutation.isPending && !isRedirecting) {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {completeOnboardingMutation.isPending || isRedirecting ? (
            <>
              <span style={styles.spinner}></span>
              {isRedirecting ? 'Redirecting to Dashboard...' : 'Processing...'}
            </>
          ) : (
            <>
              Continue to Dashboard
              <span style={styles.buttonArrow}>→</span>
            </>
          )}
        </button>
        <p style={styles.buttonHelpText}>You'll be redirected to your dashboard after completion</p>
      </div>

      <style>{styles.keyframes}</style>
    </div>
  );
};

// Comprehensive Styles (same as before)
const styles = {
  keyframes: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,

  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '0 1rem',
    animation: 'fadeIn 0.3s ease',
  } as React.CSSProperties,

  headerSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    borderRadius: '1.5rem 1.5rem 0 0',
    padding: '3rem 2rem',
    color: 'white',
    textAlign: 'center',
  } as React.CSSProperties,

  headerContent: {
    maxWidth: '600px',
    margin: '0 auto',
  } as React.CSSProperties,

  headerTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: '700',
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.5px',
  } as React.CSSProperties,

  headerSubtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
    opacity: 0.95,
    margin: 0,
    lineHeight: '1.6',
  } as React.CSSProperties,

  legalSection: {
    backgroundColor: 'white',
    padding: '2.5rem 2rem',
    borderBottom: '2px solid #f3f4f6',
  } as React.CSSProperties,

  communicationSection: {
    backgroundColor: '#f9fafb',
    padding: '2.5rem 2rem',
    borderRadius: '0 0 1.5rem 1.5rem',
  } as React.CSSProperties,

  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.25rem',
    marginBottom: '2.5rem',
  } as React.CSSProperties,

  sectionIcon: {
    fontSize: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '56px',
    height: '56px',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '1rem',
    flexShrink: 0,
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  } as React.CSSProperties,

  requiredBadge: {
    display: 'inline-block',
    padding: '0.35rem 0.85rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '0.375rem',
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  optionalBadge: {
    display: 'inline-block',
    padding: '0.35rem 0.85rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '0.375rem',
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  sectionDescription: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
    lineHeight: '1.5',
  } as React.CSSProperties,

  checkboxesGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  checkboxCard: {
    padding: '1.75rem',
    backgroundColor: '#fafafa',
    border: '2px solid',
    borderRadius: '1.125rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } as React.CSSProperties,

  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  customCheckboxContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,

  hiddenCheckbox: {
    width: 0,
    height: 0,
    opacity: 0,
    cursor: 'pointer',
  } as React.CSSProperties,

  customCheckbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '0.5rem',
    border: '2px solid',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  } as React.CSSProperties,

  checkmark: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  } as React.CSSProperties,

  checkboxTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
    flexWrap: 'wrap',
  } as React.CSSProperties,

  checkboxMainText: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: '1.5',
  } as React.CSSProperties,

  asterisk: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: '1.1rem',
  } as React.CSSProperties,

  checkboxHelper: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    margin: '0.75rem 0 0 2.75rem',
    fontWeight: '500',
  } as React.CSSProperties,

  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '700',
    borderBottom: '2px solid #667eea',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '1.125rem',
    border: '2px solid',
    transition: 'all 0.3s ease',
    animation: 'slideIn 0.4s ease',
  } as React.CSSProperties,

  statusIcon: {
    fontSize: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px',
    height: '48px',
    fontWeight: 'bold',
  } as React.CSSProperties,

  statusText: {
    fontSize: '0.95rem',
    fontWeight: '600',
  } as React.CSSProperties,

  communicationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  communicationCard: {
    padding: '1.75rem',
    backgroundColor: 'white',
    border: '2px solid',
    borderRadius: '1.25rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  } as React.CSSProperties,

  communicationLabel: {
    display: 'flex',
    gap: '1.25rem',
    cursor: 'pointer',
    width: '100%',
    alignItems: 'flex-start',
  } as React.CSSProperties,

  communicationContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
  } as React.CSSProperties,

  communicationIconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    backgroundColor: '#f0f9ff',
    borderRadius: '0.875rem',
    flexShrink: 0,
  } as React.CSSProperties,

  communicationIcon: {
    fontSize: '1.875rem',
  } as React.CSSProperties,

  communicationText: {
    flex: 1,
  } as React.CSSProperties,

  communicationTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0.35rem 0 0.5rem 0',
  } as React.CSSProperties,

  communicationDesc: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  } as React.CSSProperties,

  preferencesFooter: {
    padding: '1.5rem',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '1rem',
  } as React.CSSProperties,

  preferencesFooterText: {
    fontSize: '0.85rem',
    color: '#0c4a6e',
    margin: 0,
    fontWeight: '500',
    lineHeight: '1.6',
  } as React.CSSProperties,

  errorContainer: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '1rem',
    animation: 'slideIn 0.3s ease',
  } as React.CSSProperties,

  errorContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
  } as React.CSSProperties,

  errorIcon: {
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
  } as React.CSSProperties,

  errorTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#991b1b',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  errorMessage: {
    fontSize: '0.85rem',
    color: '#7f1d1d',
    margin: 0,
    lineHeight: '1.5',
  } as React.CSSProperties,

  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '2.5rem',
    paddingBottom: '1rem',
  } as React.CSSProperties,

  continueButton: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: 'clamp(1rem, 2vw, 1.25rem) 2rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.875rem',
    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
    fontWeight: '700',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } as React.CSSProperties,

  buttonArrow: {
    fontSize: '1.25rem',
    transition: 'transform 0.3s ease',
  } as React.CSSProperties,

  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  } as React.CSSProperties,

  buttonHelpText: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  } as React.CSSProperties,
};

