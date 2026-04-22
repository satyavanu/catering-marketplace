'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompleteOnboarding } from '@catering-marketplace/query-client';
import { AlertCircle, X, CheckCircle, Eye } from 'lucide-react';

export const TermsAndCommunications = () => {
  const router = useRouter();
  const completeOnboardingMutation = useCompleteOnboarding();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementType, setAgreementType] = useState<'terms' | 'privacy' | 'partner' | null>(null);

  // Local state for all preferences
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePartnerAgreement, setAgreePartnerAgreement] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [smsMarketing, setSmsMarketing] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMandatoryComplete = agreeTerms && agreePrivacy && agreePartnerAgreement;

  const handleContinueClick = async () => {
    setError(null);

    if (!isMandatoryComplete) {
      setError('Please accept all required agreements to continue');
      return;
    }

    try {
      console.log('🔄 Starting onboarding completion...');
      console.log('📋 Payload:', {
        agreeTerms,
        agreePrivacy,
        agreePartnerAgreement,
        emailMarketing,
        smsMarketing,
        pushNotifications,
      });

      const response = await completeOnboardingMutation.mutateAsync({
        agreeTerms,
        agreePrivacy,
        agreePartnerAgreement,
        emailMarketing,
        smsMarketing,
        pushNotifications,
      });

      console.log('✅ Onboarding completed successfully!');
      setIsRedirecting(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/dashboard');
    } catch (err) {
      console.error('❌ Error during onboarding:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save preferences. Please try again.';
      setError(errorMessage);
    }
  };

  const openModal = (type: 'terms' | 'privacy' | 'partner') => {
    setAgreementType(type);
    setShowAgreementModal(true);
  };

  const closeModal = () => {
    setShowAgreementModal(false);
    setAgreementType(null);
  };

  return (
    <>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerContent}>
            <h2 style={styles.headerTitle}>Finalize Your Account Setup</h2>
            <p style={styles.headerSubtitle}>
              Please review and accept our agreements to start receiving orders
            </p>
          </div>
        </div>

        {/* Legal & Compliance Section */}
        <div style={styles.legalSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>⚖️</span>
            <div>
              <h3 style={styles.sectionTitle}>
                Legal Agreements
                <span style={styles.requiredBadge}>REQUIRED</span>
              </h3>
              <p style={styles.sectionDescription}>Please accept all to continue using our platform</p>
            </div>
          </div>

          <div style={styles.checkboxesGroup}>
            {/* Terms & Conditions */}
            <AgreementCheckbox
              checked={agreeTerms}
              onChange={setAgreeTerms}
              label="I have read and agree to the"
              linkText="Terms & Conditions"
              onViewClick={() => openModal('terms')}
              disabled={completeOnboardingMutation.isPending || isRedirecting}
              helperText="Review our terms and guidelines"
            />

            {/* Privacy Policy */}
            <AgreementCheckbox
              checked={agreePrivacy}
              onChange={setAgreePrivacy}
              label="I have read and agree to the"
              linkText="Privacy Policy"
              onViewClick={() => openModal('privacy')}
              disabled={completeOnboardingMutation.isPending || isRedirecting}
              helperText="Understand how we handle your data"
            />

            {/* Partner Agreement */}
            <AgreementCheckbox
              checked={agreePartnerAgreement}
              onChange={setAgreePartnerAgreement}
              label="I have read and agree to the"
              linkText="Droooly Partner Agreement"
              onViewClick={() => openModal('partner')}
              disabled={completeOnboardingMutation.isPending || isRedirecting}
              helperText="Review commission, payout, and operational terms"
            />
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
              {isMandatoryComplete
                ? 'All agreements accepted ✨'
                : 'Please accept all agreements to continue'}
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
              <p style={styles.sectionDescription}>
                Choose how you'd like to hear from us about offers and updates
              </p>
            </div>
          </div>

          <div style={styles.communicationGrid}>
            <CommunicationCard
              icon="📧"
              title="Email Updates"
              description="Promotions, offers & weekly updates"
              checked={emailMarketing}
              onChange={setEmailMarketing}
              disabled={completeOnboardingMutation.isPending || isRedirecting}
            />

            <CommunicationCard
              icon="📱"
              title="SMS & WhatsApp"
              description="Exclusive deals & instant alerts"
              checked={smsMarketing}
              onChange={setSmsMarketing}
              disabled={completeOnboardingMutation.isPending || isRedirecting}
            />

            <CommunicationCard
              icon="🔔"
              title="Push Notifications"
              description="Real-time bookings & special deals"
              checked={pushNotifications}
              onChange={setPushNotifications}
              disabled={completeOnboardingMutation.isPending || isRedirecting}
            />
          </div>

          <div style={styles.preferencesFooter}>
            <p style={styles.preferencesFooterText}>
              💡 You can manage these preferences anytime in your account settings. We'll never
              share your data with third parties.
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
              if (
                isMandatoryComplete &&
                !completeOnboardingMutation.isPending &&
                !isRedirecting
              ) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (
                isMandatoryComplete &&
                !completeOnboardingMutation.isPending &&
                !isRedirecting
              ) {
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
      </div>

      {/* Agreement Modal */}
      {showAgreementModal && <AgreementModal type={agreementType} onClose={closeModal} />}

      <style>{styles.keyframes}</style>
    </>
  );
};

// Agreement Checkbox Component
interface AgreementCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  linkText: string;
  onViewClick: () => void;
  disabled: boolean;
  helperText: string;
}

function AgreementCheckbox({
  checked,
  onChange,
  label,
  linkText,
  onViewClick,
  disabled,
  helperText,
}: AgreementCheckboxProps) {
  return (
    <div
      style={{
        ...styles.checkboxCard,
        borderColor: checked ? '#10b981' : '#e5e7eb',
        backgroundColor: checked ? '#ecfdf5' : '#fafafa',
      }}
    >
      <div style={styles.checkboxContentWrapper}>
        <label style={styles.checkboxLabel}>
          <div style={styles.customCheckboxContainer}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              style={styles.hiddenCheckbox}
              disabled={disabled}
            />
            <div
              style={{
                ...styles.customCheckbox,
                backgroundColor: checked ? '#10b981' : 'white',
                borderColor: checked ? '#10b981' : '#d1d5db',
              }}
            >
              {checked && <span style={styles.checkmark}>✓</span>}
            </div>
          </div>
          <div style={styles.checkboxTextWrapper}>
            <span style={styles.checkboxMainText}>
              {label}{' '}
              <button
                type="button"
                onClick={onViewClick}
                style={styles.agreementLink}
                disabled={disabled}
              >
                {linkText}
              </button>
              <span style={styles.asterisk}>*</span>
            </span>
          </div>
        </label>
        <button
          type="button"
          onClick={onViewClick}
          style={styles.viewButton}
          disabled={disabled}
          title="View full document"
        >
          <Eye size={16} />
        </button>
      </div>
      <p style={styles.checkboxHelper}>{helperText}</p>
    </div>
  );
}

// Communication Card Component
interface CommunicationCardProps {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

function CommunicationCard({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}: CommunicationCardProps) {
  return (
    <div
      style={{
        ...styles.communicationCard,
        borderColor: checked ? '#3b82f6' : '#e5e7eb',
        backgroundColor: checked ? '#eff6ff' : '#ffffff',
        boxShadow: checked ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
        transform: checked ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <label style={styles.communicationLabel}>
        <div style={styles.customCheckboxContainer}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            style={styles.hiddenCheckbox}
            disabled={disabled}
          />
          <div
            style={{
              ...styles.customCheckbox,
              backgroundColor: checked ? '#3b82f6' : 'white',
              borderColor: checked ? '#3b82f6' : '#d1d5db',
            }}
          >
            {checked && <span style={styles.checkmark}>✓</span>}
          </div>
        </div>
        <div style={styles.communicationContent}>
          <div style={styles.communicationIconBox}>
            <span style={styles.communicationIcon}>{icon}</span>
          </div>
          <div style={styles.communicationText}>
            <p style={styles.communicationTitle}>{title}</p>
            <p style={styles.communicationDesc}>{description}</p>
          </div>
        </div>
      </label>
    </div>
  );
}

// Agreement Modal Component
interface AgreementModalProps {
  type: 'terms' | 'privacy' | 'partner' | null;
  onClose: () => void;
}

function AgreementModal({ type, onClose }: AgreementModalProps) {
  const getAgreementContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'Terms & Conditions',
          content: TERMS_AND_CONDITIONS,
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: PRIVACY_POLICY,
        };
      case 'partner':
        return {
          title: 'Droooly Partner Agreement',
          content: PARTNER_AGREEMENT,
        };
      default:
        return { title: '', content: '' };
    }
  };

  const { title, content } = getAgreementContent();

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={styles.modalCloseButton}
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.modalContent}>
          <pre style={styles.agreementText}>{content}</pre>
        </div>

        <div style={styles.modalFooter}>
          <button type="button" onClick={onClose} style={styles.modalCloseLink}>
            Close & Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Agreement Content
const TERMS_AND_CONDITIONS = `DROOOLY TERMS & CONDITIONS

Last Updated: [Current Date]

1. INTRODUCTION & ACCEPTANCE
By accessing and using the Droooly platform, you agree to these Terms & Conditions.

2. USE OF PLATFORM
You agree to use this platform only for lawful purposes and in a way that does not infringe upon the rights of others.

3. USER ACCOUNTS
You are responsible for maintaining the confidentiality of your account credentials and password.
You agree to accept responsibility for all activities that occur under your account.

4. INTELLECTUAL PROPERTY RIGHTS
All content on the platform, including but not limited to text, graphics, logos, and images, is the intellectual property of Droooly.

5. LIMITATIONS OF LIABILITY
Droooly shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

6. GOVERNING LAW
These Terms shall be governed by and construed in accordance with the laws of India.

7. ENTIRE AGREEMENT
These Terms & Conditions constitute the entire agreement between you and Droooly.

For complete details, please contact our legal team.`;

const PRIVACY_POLICY = `DROOOLY PRIVACY POLICY

Last Updated: [Current Date]

1. INTRODUCTION
Droooly respects your privacy and is committed to protecting your personal data.

2. DATA COLLECTION
We collect information that you provide directly to us, such as:
- Name, email address, phone number
- Payment and billing information
- Location and service preferences

3. USE OF DATA
We use your data to:
- Provide and improve our services
- Process payments and orders
- Communicate with you about your account
- Comply with legal obligations

4. DATA SECURITY
We implement industry-standard security measures to protect your personal data.

5. DATA SHARING
We do not share your personal data with third parties except:
- Service providers who assist us in operating our platform
- When required by law

6. YOUR RIGHTS
You have the right to:
- Access your personal data
- Request correction of inaccurate data
- Request deletion of your data
- Opt-out of marketing communications

7. CONTACT US
For privacy-related concerns, contact: privacy@droooly.com

For complete details, please visit our privacy center.`;

const PARTNER_AGREEMENT = `DROOOLY PARTNER AGREEMENT (INDIA)
(Lawyer-Grade Version with Detailed Schedules & Compliance Clauses)

THIS PARTNER AGREEMENT

This Partner Agreement ("Agreement") is entered into on this ___ day of ____, 20 ("Effective Date"),

BY AND BETWEEN

[YOUR LEGAL ENTITY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [Address] (hereinafter referred to as "Droooly" or "Company", which expression shall, unless repugnant to the context, include its successors and assigns),

AND

[PARTNER LEGAL NAME], an individual/proprietorship/partnership/company having its principal place of business at [Address] (hereinafter referred to as "Partner", which expression shall include its heirs, successors, and permitted assigns).

Droooly and the Partner are hereinafter collectively referred to as the "Parties" and individually as a "Party".

1. DEFINITIONS

Unless the context otherwise requires:

* "Platform" means the Droooly mobile application, website, APIs, and associated systems.
* "Services" means catering, meal plans, chef services, or any offerings listed by the Partner.
* "Order" means a confirmed booking placed by a Customer via the Platform.
* "Customer" means an end user availing Services.
* "Fulfilment" means successful completion/delivery of an Order.
* "Commission" / "Platform Fee" means the fee charged by Droooly per transaction.
* "Net Payable Amount" means Order value less Commission, taxes, refunds, penalties, and deductions.
* "T+1" means one (1) business day post Fulfilment.
* "Applicable Law" includes all Indian laws, including but not limited to tax, food safety, and IT laws.

2. APPOINTMENT & NATURE OF RELATIONSHIP

2.1 Droooly hereby grants the Partner a non-exclusive, revocable, non-transferable right to list and provide Services on the Platform.

2.2 The relationship between the Parties is strictly on a principal-to-principal basis. Nothing herein shall be construed as creating an employer-employee, agency, joint venture, or partnership relationship.

3. ELIGIBILITY, KYC & VERIFICATION

3.1 The Partner shall mandatorily submit and maintain valid:

* PAN (Permanent Account Number)
* Aadhaar (for individuals/authorized signatory)
* GST Registration Certificate (if applicable)
* FSSAI License (mandatory for food-related services)
* Bank Account Proof (cancelled cheque/passbook)
* Address Proof of business premises

3.2 Droooly reserves the right to:

* Conduct KYC/AML verification through third-party agencies
* Seek additional documentation at any time
* Suspend onboarding or deactivate accounts upon failure of verification

3.3 Any misrepresentation shall constitute material breach.

4. LISTINGS, PRICING & SERVICE AREA

4.1 The Partner shall ensure that all listings:

* Are accurate, lawful, and non-misleading
* Clearly specify inclusions, taxes, and delivery charges

4.2 The Partner shall define:

* Base kitchen/service location
* Serviceable PIN codes and/or delivery radius
* Delivery charges, if applicable

4.3 Droooly reserves the right to standardize listings for platform uniformity.

5. ORDERS & FULFILMENT OBLIGATIONS

5.1 Orders shall be deemed confirmed upon successful payment.

5.2 The Partner shall:

* Accept/reject Orders within SLA timelines
* Fulfil Orders strictly as per specifications
* Ensure quality, hygiene, and timeliness

5.3 Failure to comply shall attract penalties under this Agreement.

6. PAYMENTS, PLATFORM FEES, GST & TDS

6.1 Platform Fee / Commission

Droooly shall charge a Platform Fee (Commission) as mutually agreed (Annexure A).

6.2 GST Compliance

* GST shall be levied as per the Central Goods and Services Tax Act, 2017 and applicable rules
* The Partner is solely responsible for:
    * Charging GST (if applicable)
    * Filing returns
    * Issuing tax invoices

6.3 TDS (Tax Deducted at Source)

* Droooly shall deduct TDS under Section 194-O of the Income Tax Act, 1961 (currently 1% or as amended) on gross sales facilitated through the Platform
* TDS certificates shall be issued periodically

6.4 Payout Terms

* Payouts shall be released on a T+1 basis post Fulfilment
* Subject to:
    * No pending disputes
    * No chargebacks/refunds
    * Compliance with Agreement

7. CANCELLATIONS, REFUNDS & CHARGEBACKS

7.1 Governed by cancellation policy matrix
7.2 Droooly reserves the unilateral right to:
* Process refunds to Customers
* Recover amounts from Partner payouts

8. CUSTOMER DISPUTES & GRIEVANCE REDRESSAL

8.1 Droooly shall act as a facilitator and mediator.
8.2 The Partner shall:
* Respond within defined SLA timelines
* Provide documentary evidence when requested

9. HYGIENE & FOOD SAFETY COMPLIANCE

9.1 The Partner shall strictly comply with:
* Food Safety laws under the Food Safety and Standards Act, 2006
* Guidelines issued by the Food Safety and Standards Authority of India (FSSAI)

10. PROHIBITED CONDUCT

The Partner shall not:
* Circumvent Platform payments
* Solicit Customers outside Platform
* Engage in fraudulent activities
* Violate any Applicable Law

11. SUSPENSION & TERMINATION

11.1 Suspension (Immediate) for:
* Failed KYC
* Customer complaints
* Fraud suspicion

11.2 Termination for:
* Repeated breaches
* Illegal activities
* Severe misconduct

12. INDEMNITY

The Partner agrees to indemnify and hold harmless Droooly against:
* Claims arising from food quality, safety, or negligence
* Legal violations
* Third-party claims

13. LIMITATION OF LIABILITY

Droooly shall not be liable for:
* Indirect or consequential damages
* Loss of profits
* Partner negligence

14. GOVERNING LAW & JURISDICTION

This Agreement shall be governed by Indian laws.
Courts at [City] shall have exclusive jurisdiction.

ACCEPTANCE

By registering on Droooly, the Partner expressly agrees to this Agreement and all Schedules.`;

// Styles
const styles: { [key: string]: React.CSSProperties } = {
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

  checkboxContentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    cursor: 'pointer',
    flex: 1,
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
    flexShrink: 0,
    marginTop: '0.2rem',
  } as React.CSSProperties,

  checkmark: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  } as React.CSSProperties,

  checkboxTextWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    flex: 1,
    flexWrap: 'wrap',
  } as React.CSSProperties,

  checkboxMainText: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  } as React.CSSProperties,

  agreementLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#667eea',
    textDecoration: 'underline',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    font: 'inherit',
    transition: 'color 0.2s ease',
  } as React.CSSProperties,

  viewButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#667eea',
    flexShrink: 0,
  } as React.CSSProperties,

  asterisk: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: '1.1rem',
    lineHeight: '1.5',
  } as React.CSSProperties,

  checkboxHelper: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    margin: '0.75rem 0 0 2.75rem',
    fontWeight: '500',
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

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  } as React.CSSProperties,

  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.3s ease',
  } as React.CSSProperties,

  modalHeader: {
    padding: '2rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  } as React.CSSProperties,

  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  } as React.CSSProperties,

  modalCloseButton: {
    padding: '0.5rem',
    border: 'none',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  modalContent: {
    flex: 1,
    overflow: 'auto',
    padding: '2rem',
  } as React.CSSProperties,

  agreementText: {
    fontSize: '0.85rem',
    lineHeight: '1.6',
    color: '#374151',
    fontFamily: '"Courier New", monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    margin: 0,
  } as React.CSSProperties,

  modalFooter: {
    padding: '1.5rem 2rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    flexShrink: 0,
  } as React.CSSProperties,

  modalCloseLink: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
};