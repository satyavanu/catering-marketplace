'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { sendOtpApi } from '@catering-marketplace/query-client';
import { styles } from './styles';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';

import EmailOrPhoneVerification from './components/EmailOrPhoneVerification';
import BasicProfile from './components/BasicProfile';
import BusinessDetails from './components/BusinessDetails';
import KycPayments from './components/KycPayments';
import PartnerAgreement from './components/PartnerAgreement';
import OnboardingStatus from './components/OnboardingStatus';
import ServiceAreas from './components/ServiceAreas';
import { OnboardingFormData, OnboardingStep } from './types';
import { detectInputType } from './utils';

const DEFAULT_FORM_DATA: OnboardingFormData = {
  email: '',
  phone: '',
  otp: '',
  fullName: '',
  partnerType: null,
  businessName: '',
  businessType: [],
  eventsHandled: [],
  yearsInBusiness: '',
  cuisines: [],
  specializations: [],
  dietTypes: [],
  capacityRange: '',
  baseCity: '',
  kitchenAddress: '',
  kitchenPincode: '',
  canServeEntireCity: false,
  serviceAreas: [],
  deliverySettings: {
    freeDeliveryRadius: 0,
    maxDeliveryDistance: 0,
    extraChargePerKm: 0,
  },
  panNumber: '',
  gstNumber: '',
  fssaiNumber: '',
  upiHandle: '',
  accountHolderName: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  termsAccepted: false,
  privacyAccepted: false,
  signatureImage: null,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();

  const {
    data: masterData,
    isLoading: isStaticDataLoading,
    error: staticDataError,
  } = useOnboardingMasterDataContext();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>('phone-verification');
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [formData, setFormData] =
    useState<OnboardingFormData>(DEFAULT_FORM_DATA);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  // Resend timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Mount and auth check
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (status === 'unauthenticated') {
      setOnboardingStep('phone-verification');
    } else if (status === 'authenticated' && session?.user) {
      const isCaterer = (session.user as any)?.role === 'caterer';
      const isProfileCompleted =
        (session.user as any)?.isOnboardingCompleted === true;

      if (isCaterer && isProfileCompleted) {
        setIsRedirecting(true);
        router.push('/caterer/dashboard');
      } else {
        setPhoneVerified(true);
        setOnboardingStep('basic-profile');
      }
    }
  }, [status, session, mounted, router]);

  const handleBasicProfileSubmit = (
    data: any,
    isValid: boolean,
  ) => {
    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        fullName: data.fullName,
        partnerType: data.partnerType,
        businessName: data.businessName,
        businessType: data.businessType,
        eventsHandled: data.eventsHandled,
      }));
      setOnboardingStep('business-details');
    }
  };


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const inputType = detectInputType(emailOrPhone);

    if (inputType === 'invalid') {
      setError('Please enter a valid email address or 10-digit mobile number');
      setIsLoading(false);
      return;
    }

    if (resendCount >= 3) {
      setError(
        'Maximum OTP requests reached (3 attempts). Please try again after some time.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const payload =
        inputType === 'email'
          ? { email: emailOrPhone.trim() }
          : { phone: `+91${emailOrPhone.replace(/\D/g, '')}` };

      const result = await sendOtpApi(payload);

      if (!result.success) {
        setError(result.error || 'Failed to send OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setResendCount(resendCount + 1);
      setResendTimer(60);
      setError('');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    const inputType = detectInputType(emailOrPhone);

    if (inputType === 'invalid') {
      setError('Invalid email or phone number');
      setIsLoading(false);
      return;
    }

    try {
      const payload =
        inputType === 'email'
          ? { email: emailOrPhone.trim(), otp: formData.otp, phone: '' }
          : {
              phone: `+91${emailOrPhone.replace(/\D/g, '')}`,
              otp: formData.otp,
              email: '',
            };
      const signInType = inputType === 'email' ? 'email-otp' : 'phone-otp';

      const updatedFormData = { ...formData };
      if (inputType === 'email') {
        updatedFormData.email = emailOrPhone.trim();
        updatedFormData.phone = '';
      } else {
        updatedFormData.phone = `+91${emailOrPhone.replace(/\D/g, '')}`;
        updatedFormData.email = '';
      }
      updatedFormData.otp = formData.otp;
      setFormData(updatedFormData);

      // Sign in with NextAuth
      try {
        const signInPayload = {
          ...(inputType === 'email' && { email: emailOrPhone.trim() }),
          ...(inputType === 'phone' && {
            phone: `+91${emailOrPhone.replace(/\D/g, '')}`,
          }),
          otp: formData.otp,
          redirect: false,
        };

        const signInResult = await signIn(signInType, signInPayload);

        if (!signInResult?.ok) {
          setError('Failed to sign in. Please try again.');
          setIsLoading(false);
          return;
        }

        // Update session
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            ...(inputType === 'email' && { email: emailOrPhone.trim() }),
            ...(inputType === 'phone' && {
              phone: `+91${emailOrPhone.replace(/\D/g, '')}`,
            }),
          },
        });

        setPhoneVerified(true);
        setOtpSent(false);
        setError('');
        setOnboardingStep('basic-profile');
      } catch (signInError) {
        console.error('Sign in error:', signInError);
        setError('Failed to sign in. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);

    const inputType = detectInputType(emailOrPhone);

    if (inputType === 'invalid') {
      setError('Invalid email or phone number');
      setIsLoading(false);
      return;
    }

    if (resendCount >= 3) {
      setError(
        'Maximum OTP requests reached (3 attempts). Please try again after some time.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const payload =
        inputType === 'email'
          ? { email: emailOrPhone.trim() }
          : { phone: `+91${emailOrPhone.replace(/\D/g, '')}` };

      const result = await sendOtpApi(payload);

      if (!result.success) {
        setError(result.error || 'Failed to resend OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setResendCount(resendCount + 1);
      setResendTimer(60);
      setError('');
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend OTP. Please try again.');
      setIsLoading(false);
    }
  };

 
  const handleBusinessDetailsFormDataChange = (
    data: {
      yearsInBusiness: string;
      cuisines: string[];
      specializations: string[];
      dietTypes: string[];
      capacityRange: string;
      baseCity: string;
    },
    isValid: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      yearsInBusiness: data.yearsInBusiness,
      cuisines: data.cuisines,
      specializations: data.specializations,
      dietTypes: data.dietTypes,
      capacityRange: data.capacityRange,
      baseCity: data.baseCity,
    }));

    if (isValid) {
      setOnboardingStep('service-areas');
    }
  };


  const handleServiceAreasSubmit = async (data: {
    kitchenAddress: string;
    kitchenPincode: string;
    canServeEntireCity: boolean;
    serviceAreas: Array<{ pincode: string; city: string; state: string }>;
    deliverySettings: {
      freeDeliveryRadius: number;
      maxDeliveryDistance: number;
      extraChargePerKm: number;
    };
  }) => {
    setError('');
    setIsLoading(true);

    try {
      setFormData((prev) => ({
        ...prev,
        kitchenAddress: data.kitchenAddress,
        kitchenPincode: data.kitchenPincode,
        canServeEntireCity: data.canServeEntireCity,
        serviceAreas: data.serviceAreas,
        deliverySettings: data.deliverySettings,
      }));
      setOnboardingStep('kyc-payments');
    } catch (err) {
      console.error('Error saving service areas:', err);
      setError('Failed to save service areas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== STEP 5: KYC PAYMENTS HANDLERS ==========

  const handleKycFormDataChange = (data: {
    panNumber?: string;
    gstNumber?: string;
    fssaiNumber?: string;
    upiHandle?: string;
    accountHolderName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      panNumber: data.panNumber || prev.panNumber,
      gstNumber: data.gstNumber || prev.gstNumber,
      fssaiNumber: data.fssaiNumber || prev.fssaiNumber,
      upiHandle: data.upiHandle || prev.upiHandle,
      accountHolderName: data.accountHolderName || prev.accountHolderName,
      bankAccountNumber: data.bankAccountNumber || prev.bankAccountNumber,
      bankIfscCode: data.bankIfscCode || prev.bankIfscCode,
    }));
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.panNumber?.trim() && !formData.upiHandle?.trim()) {
      setError('Please provide either PAN number or UPI ID');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('agreement');
    } catch (err) {
      setError('Failed to save KYC details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== STEP 6: AGREEMENT HANDLERS ==========

  const handleAgreementSubmit = async (data: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    signatureImage: string | null;
  }) => {
    setError('');
    setIsLoading(true);

    if (!data.termsAccepted || !data.privacyAccepted || !data.signatureImage) {
      setError('Please accept all terms and provide your signature');
      setIsLoading(false);
      return;
    }

    try {
      setFormData((prev) => ({
        ...prev,
        termsAccepted: data.termsAccepted,
        privacyAccepted: data.privacyAccepted,
        signatureImage: data.signatureImage,
      }));

      setOnboardingStep('completion');
    } catch (err) {
      setError('Failed to process agreement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== STEP 7: COMPLETION HANDLER ==========

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Here you would call your API to save formData
      // const response = await completeOnboardingApi(formData);

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          role: 'caterer',
          isOnboardingCompleted: true,
        },
      });

      setIsRedirecting(true);
      router.push('/caterer/dashboard');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete onboarding. Please try again.');
      setIsLoading(false);
    }
  };

  // Utility functions
  const getStepNumber = (): string => {
    const steps: OnboardingStep[] = [
      'basic-profile',
      'business-details',
      'service-areas',
      'kyc-payments',
      'agreement',
      'completion',
    ];
    const currentIndex = steps.indexOf(onboardingStep);
    return `${currentIndex + 1} of ${steps.length}`;
  };

  const getProgressPercentage = (): number => {
    if (onboardingStep === 'phone-verification') return 0;
    const steps: OnboardingStep[] = [
      'basic-profile',
      'business-details',
      'service-areas',
      'kyc-payments',
      'agreement',
      'completion',
    ];
    const currentIndex = steps.indexOf(onboardingStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Loading state
  if (!mounted || status === 'loading' || isStaticDataLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Redirecting to dashboard...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error state
  if (staticDataError) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: '#dc2626', fontSize: '1rem' }}>
          Failed to load onboarding data. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          Reload Page
        </button>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }


  if (onboardingStep === 'phone-verification' && !phoneVerified) {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '0%' }} />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>1 of 7</span>
            <span style={styles.stepDot}></span>
          </div>

          <EmailOrPhoneVerification
            onOtpVerified={(value: any) => {
              console.log("OTP vrfied callback:", value); 
            }}
          />
        </div>
      </div>
    );
  }

  // Step 2: Basic Profile
  if (onboardingStep === 'basic-profile') {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <BasicProfile
            partnerType={formData.partnerType}
            fullName={formData.fullName}
            businessName={formData.businessName}
            businessType={formData.businessType}
            eventsHandled={formData.eventsHandled}
            isLoading={isLoading}
            onSubmit={handleBasicProfileSubmit}
            styles={styles}
            businessTypes={masterData?.business_types || []}
            eventTypes={masterData?.event_types || []}
          />
        </div>
      </div>
    );
  }

  // Step 3: Business Details
  if (onboardingStep === 'business-details') {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <BusinessDetails
            yearsInBusiness={formData.yearsInBusiness}
            cuisines={formData.cuisines}
            specializations={formData.specializations}
            dietTypes={formData.dietTypes}
            capacityRange={formData.capacityRange}
            baseCity={formData.baseCity}
            isLoading={isLoading}
            error={error}
            onFormDataChange={handleBusinessDetailsFormDataChange}
            onBack={() => setOnboardingStep('basic-profile')}
            styles={styles}
            masterData={masterData}
          />
        </div>
      </div>
    );
  }

  // Step 4: Service Areas
  if (onboardingStep === 'service-areas') {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <ServiceAreas
            kitchenAddress={formData.kitchenAddress}
            kitchenPincode={formData.kitchenPincode}
            canServeEntireCity={formData.canServeEntireCity}
            serviceAreas={formData.serviceAreas}
            deliverySettings={formData.deliverySettings}
            isLoading={isLoading}
            error={error}
            onSubmit={handleServiceAreasSubmit}
            onBack={() => setOnboardingStep('business-details')}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  {{onboardingStep}}
  // Step 5: KYC & Payments
  if (onboardingStep === 'kyc-payments') {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <KycPayments
            formData={formData}
            isLoading={isLoading}
            error={error}
            onFormDataChange={handleKycFormDataChange}
            onSubmit={handleKycSubmit}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  // Step 6: Partner Agreement
  if (onboardingStep === 'agreement') {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <PartnerAgreement
            termsAccepted={formData.termsAccepted}
            privacyAccepted={formData.privacyAccepted}
            signatureImage={formData.signatureImage}
            isLoading={isLoading}
            error={error}
            onSubmit={handleAgreementSubmit}
            onBack={() => setOnboardingStep('kyc-payments')}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  // Step 7: Completion
  if (onboardingStep === 'completion') {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '100%' }} />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <OnboardingStatus
            completionData={{
              capabilities: 0,
              serviceAreas: formData.serviceAreas.length,
              menuItems: 0,
              packages: 0,
              hasKYC: !!(formData.panNumber || formData.upiHandle),
            }}
            isLoading={isLoading}
            error={error}
            onComplete={handleCompleteOnboarding}
            styles={styles}
            onDownloadAgreement={() => {
              console.log('Download agreement');
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}
