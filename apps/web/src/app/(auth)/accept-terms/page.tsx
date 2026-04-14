'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TermsAndCommunications } from './components/TermsAndCommunications';

type UserRole = 'customer' | 'caterer';
type OnboardingStep =
  | 'role-select'
  | 'phone-verification'
  | 'profile'
  | 'address'
  | 'business-details'
  | 'kyc-compliance'
  | 'payment-setup'
  | 'operations-availability'
  | 'cancellation-policies'
  | 'service-details'
  | 'complete';


export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>('role-select');

  // Phone Verification
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');

  // Business Details
  const [cuisineType, setCuisineType] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [teamSize, setTeamSize] = useState('');

  // KYC & Compliance
  const [panNumber, setPanNumber] = useState('');
  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharBack, setAadharBack] = useState<File | null>(null);
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [fssaiFile, setFssaiFile] = useState<File | null>(null);
  const [gstNumber, setGstNumber] = useState('');
  const [gstFile, setGstFile] = useState<File | null>(null);

  // Track if initial redirect check has been done
  const initialRedirectChecked = useRef(false);



  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated' && mounted) {
      router.push('/login');
    }
  }, [status, mounted, router]);

  // Redirect if onboarding already completed
  useEffect(() => {
    if (initialRedirectChecked.current) {
      return;
    }

    if (status === 'loading' || !mounted || !session?.user) {
      return;
    }

    initialRedirectChecked.current = true;

    if (
      session.user.role &&
      session.user.isOnboardingCompleted &&
      !isRedirecting
    ) {
      console.log(
        `User already onboarded with role: ${session.user.role}, redirecting to dashboard`
      );
      setIsRedirecting(true);
      router.push(`/${session.user.role}/dashboard`);
    }
  }, [session, status, mounted, isRedirecting, router]);

  if (!mounted || status === 'loading') {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  if (isRedirecting) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Redirecting to dashboard...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      <div style={styles.content}>
        <div style={styles.stepIndicator}></div>

        <div style={styles.header}>
          <h1 style={styles.title}>Welcome to CaterHub! 👋</h1>
          <p style={styles.subtitle}>Choose how you want to use CaterHub</p>
        </div>

        <TermsAndCommunications />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  content: {
    width: '100%',
    maxWidth: '700px',
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    padding: 'clamp(1.5rem, 5vw, 3rem)',
  } as React.CSSProperties,
  progressContainer: {
    width: '100%',
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    marginBottom: '1.5rem',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressBar: {
    height: '100%',
    backgroundColor: '#f97316',
    transition: 'width 0.3s ease',
  } as React.CSSProperties,
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
  } as React.CSSProperties,
  stepNumber: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#f97316',
  } as React.CSSProperties,
  stepDot: {
    fontSize: '1.5rem',
    color: '#f97316',
  } as React.CSSProperties,
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    background:
      'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  } as React.CSSProperties,
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: '1rem',
  } as React.CSSProperties,
  loadingText: {
    color: 'white',
    fontSize: '1rem',
    margin: 0,
  } as React.CSSProperties,
  header: {
    marginBottom: '2rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  subtitle: {
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  } as React.CSSProperties,
  userInfoBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  userInfoTitle: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    margin: '0 0 1rem 0',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  userInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
  } as React.CSSProperties,
  userInfoItem: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  userInfoLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,
  userInfoValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0.25rem 0 0 0',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,
  rolesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  roleCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '2rem 1.5rem',
    textAlign: 'center' as const,
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    cursor: 'pointer',
  } as React.CSSProperties,
  roleIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  } as React.CSSProperties,
  roleTitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,
  roleDescription: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    color: '#6b7280',
    margin: '0 0 1rem 0',
    lineHeight: '1.5',
  } as React.CSSProperties,
  roleFeatures: {
    listStyle: 'none',
    margin: '0 0 1rem 0',
    padding: 0,
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    color: '#6b7280',
  } as React.CSSProperties,
  selectedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginTop: '1rem',
  } as React.CSSProperties,
  ctaButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: 'clamp(0.75rem, 2vw, 1rem) 2rem',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  verificationForm: {
    marginTop: '2rem',
  } as React.CSSProperties,
  profileForm: {
    marginTop: '2rem',
  } as React.CSSProperties,
  formGroup: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    alignItems: 'start',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties,
  phoneInputGroup: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: '0.75rem',
  } as React.CSSProperties,
  countryCodeSelect: {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  complianceSection: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 1rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  requiredBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  } as React.CSSProperties,
  optionalBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  } as React.CSSProperties,
  fileInputWrapper: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center' as const,
    backgroundColor: '#fafafa',
  } as React.CSSProperties,
  fileInput: {
    width: '100%',
    cursor: 'pointer',
  } as React.CSSProperties,
  fileName: {
    fontSize: '0.875rem',
    color: '#10b981',
    marginTop: '0.5rem',
    fontWeight: '600',
  } as React.CSSProperties,
  otpSentText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.5rem 0 1rem 0',
  } as React.CSSProperties,
  helpText: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: '0.5rem 0 0 0',
  } as React.CSSProperties,
  errorMessage: {
    padding: '0.75rem 1rem',
    backgroundColor: '#fee2e2',
    borderRadius: '0.5rem',
    color: '#991b1b',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    border: '1px solid #fecaca',
  } as React.CSSProperties,
  submitButton: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
    cursor: 'pointer',
  } as React.CSSProperties,
  backButton: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#667eea',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  completeContainer: {
    textAlign: 'center' as const,
  } as React.CSSProperties,
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    display: 'inline-flex',
    width: '80px',
    height: '80px',
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#10b981',
    fontWeight: 'bold',
  } as React.CSSProperties,
  summaryBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    textAlign: 'left' as const,
  } as React.CSSProperties,
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,
  summaryLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
  } as React.CSSProperties,
  summaryValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  } as React.CSSProperties,
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.75rem',
  } as React.CSSProperties,
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    cursor: 'pointer',
  } as React.CSSProperties,
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  } as React.CSSProperties,
  radioGroup: {
    display: 'flex',
    gap: '1.5rem',
    flexDirection: 'column' as const,
  } as React.CSSProperties,
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    cursor: 'pointer',
  } as React.CSSProperties,
  radioInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  } as React.CSSProperties,

  termsSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
  } as React.CSSProperties,
  termsSectionTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,
  termsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  } as React.CSSProperties,
  termItem: {
    display: 'flex',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  termCheckboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '500',
    lineHeight: '1.5',
  } as React.CSSProperties,
  termCheckbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,
  required: {
    color: '#dc2626',
    fontWeight: 'bold',
  } as React.CSSProperties,
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    borderBottom: '1px solid #667eea',
  } as React.CSSProperties,
  marketingSection: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bfdbfe',
    borderRadius: '1rem',
  } as React.CSSProperties,
  marketingSectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0c4a6e',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,
  marketingDescription: {
    fontSize: '0.875rem',
    color: '#0c4a6e',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,
  marketingOptionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  marketingOption: {
    padding: '1rem',
    backgroundColor: 'white',
    border: '1px solid #bfdbfe',
    borderRadius: '0.75rem',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  marketingCheckboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: 'pointer',
    width: '100%',
  } as React.CSSProperties,
  marketingCheckbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    marginTop: '0.25rem',
    flexShrink: 0,
  } as React.CSSProperties,
  marketingOptionContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    width: '100%',
  } as React.CSSProperties,
  marketingIcon: {
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
  } as React.CSSProperties,
  marketingOptionTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,
  marketingOptionDescription: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,
  marketingFooter: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.75rem 0 0 0',
    fontStyle: 'italic',
  } as React.CSSProperties,
};
