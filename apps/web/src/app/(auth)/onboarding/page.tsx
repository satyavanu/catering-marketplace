'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';

import { styles } from './styles';
import EmailOrPhoneVerification from './components/EmailOrPhoneVerification';
import BasicProfile from './components/BasicProfile';
import BusinessDetails from './components/BusinessDetails';
import ServiceAreas from './components/ServiceAreas';
import KycPayments from './components/KycPayments';
import PartnerAgreement from './components/PartnerAgreement';
import OnboardingStatus from './components/OnboardingStatus';

import {
  useStartOrResumeOnboardingSession,
  useSaveOnboardingStep,
  useSubmitOnboardingSession,
} from '@catering-marketplace/query-client';

import {
  OnboardingStep,
  PartnerOnboardingPayload,
  AuthVerificationData,
  BasicProfileData,
  BusinessDetailsData,
  DeliveryServiceData,
  KycBankData,
  AgreementData,
} from './types';

const STEP_ORDER: OnboardingStep[] = [
  'phone_verification',
  'basic_profile',
  'business_details',
  'delivery_service',
  'kyc_bank',
  'agreement',
  'completion',
];

const BACKEND_TO_UI_STEP: Record<string, OnboardingStep> = {
  basic_profile: 'basic_profile',
  business_profile: 'business_details',
  kitchen_service_details: 'business_details',
  service_areas: 'delivery_service',
  documents_kyc: 'kyc_bank',
  partner_agreement: 'agreement',
  review_submit: 'completion',
  completed: 'completion',
};

const UI_TO_BACKEND_STEP: Record<OnboardingStep, string> = {
  phone_verification: 'basic_profile',
  basic_profile: 'basic_profile',
  business_details: 'business_profile',
  delivery_service: 'service_areas',
  kyc_bank: 'documents_kyc',
  agreement: 'partner_agreement',
  completion: 'review_submit',
};

const NEXT_BACKEND_STEP: Record<OnboardingStep, string> = {
  phone_verification: 'basic_profile',
  basic_profile: 'business_profile',
  business_details: 'service_areas',
  delivery_service: 'documents_kyc',
  kyc_bank: 'partner_agreement',
  agreement: 'review_submit',
  completion: 'completed',
};

const activeAgreementVersionId = 'ce318c3c-779e-46c1-a7c1-82fa37e1afa2';

const DEFAULT_ONBOARDING_DATA: PartnerOnboardingPayload & {
  auth: AuthVerificationData;
} = {
  auth: {
    email: '',
    phone: '',
  },
  profile: {
    partnerType: 'individual',
    contactName: '',
    businessName: '',
    businessDescription: '',
    countryCode: 'IN',
    baseCityId: '',
    kitchenAddress: '',
    latitude: null,
    longitude: null,
    capacityRangeId: '',
  },
  business: {
    businessTypeIds: [],
    cuisineIds: [],
    eventTypeIds: [],
    dietTypeIds: [],
    serviceStyleIds: [],
  },
  delivery: {
    canServeEntireCity: false,
    deliveryAvailable: true,
    pickupAvailable: false,
    freeDeliveryRadius: null,
    maxDeliveryDistance: null,
    distanceUnit: 'km',
    extraChargePerDistanceUnit: null,
    minOrderValue: null,
    serviceAreas: [],
  },
  operations: {
    advanceNoticeHours: 24,
    minPrepTimeHours: 2,
    autoAcceptOrders: false,
    allowsCustomOrders: true,
    cancellationPolicy: '',
    refundPolicy: '',
  },
  kycBank: {
    panNumber: '',
    gstNumber: '',
    fssaiNumber: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiHandle: '',
  },
  agreement: undefined,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();

  const hasBootstrappedSessionRef = useRef(false);

  const {
    masterData,
    isLoading: isStaticDataLoading,
    error: staticDataError,
  } = useOnboardingMasterDataContext();

  const startSessionMutation = useStartOrResumeOnboardingSession();
  const saveStepMutation = useSaveOnboardingStep();
  const submitSessionMutation = useSubmitOnboardingSession();

  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>('phone_verification');

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState(DEFAULT_ONBOARDING_DATA);
  const [globalError, setGlobalError] = useState('');

  const isAuthenticated = status === 'authenticated';
  const isAuthLoading = status === 'loading';

  const currentStepIndex = useMemo(() => {
    return STEP_ORDER.indexOf(currentStep);
  }, [currentStep]);

  const progressPercentage = useMemo(() => {
    if (currentStepIndex < 0) return 0;
    return ((currentStepIndex + 1) / STEP_ORDER.length) * 100;
  }, [currentStepIndex]);

  const isPageBootstrapping =
    isAuthLoading ||
    isStaticDataLoading ||
    (isAuthenticated && !sessionId && !globalError);

  const isSubmitting =
    saveStepMutation.isPending || submitSessionMutation.isPending;

  useEffect(() => {
    if (!isAuthenticated) return;
    if (sessionId) return;
    if (hasBootstrappedSessionRef.current) return;

    hasBootstrappedSessionRef.current = true;

    startSessionMutation.mutate(undefined, {
      onSuccess: (session) => {
        setSessionId(session.sessionId);

        const nextStep =
          BACKEND_TO_UI_STEP[session.currentStep] ?? 'basic_profile';

        setCurrentStep(nextStep);

        if (session.onboardingData) {
          setOnboardingData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              ...(session.onboardingData.profile as any),
              ...(session.onboardingData.basic_profile as any),
            },
            business: {
              ...prev.business,
              ...(session.onboardingData.business as any),
              ...(session.onboardingData.business_profile as any),
            },
            delivery: {
              ...prev.delivery,
              ...(session.onboardingData.delivery as any),
              ...(session.onboardingData.service_areas as any),
            },
            kycBank: {
              ...prev.kycBank,
              ...(session.onboardingData.kycBank as any),
              ...(session.onboardingData.documents_kyc as any),
            },
            agreement:
              (session.onboardingData.agreement as any) ??
              (session.onboardingData.partner_agreement as any) ??
              prev.agreement,
          }));
        }
      },
      onError: (error: any) => {
        hasBootstrappedSessionRef.current = false;
        setGlobalError(error?.message || 'Failed to load onboarding session.');
      },
    });
  }, [isAuthenticated, sessionId]);

  const updateOnboardingData = useCallback(
    <K extends keyof typeof onboardingData>(
      section: K,
      value: (typeof onboardingData)[K]
    ) => {
      setOnboardingData((prev) => ({
        ...prev,
        [section]: value,
      }));
    },
    []
  );

  const saveCurrentStep = useCallback(
    async (uiStep: OnboardingStep, stepData: Record<string, unknown>) => {
      if (!sessionId) {
        throw new Error('Onboarding session not found.');
      }

      await saveStepMutation.mutateAsync({
        sessionId,
        step: UI_TO_BACKEND_STEP[uiStep] as any,
        stepData,
        nextStep: NEXT_BACKEND_STEP[uiStep] as any,
      });
    },
    [sessionId, saveStepMutation]
  );

  const goToStep = useCallback((step: OnboardingStep) => {
    setGlobalError('');
    setCurrentStep(step);
  }, []);

  const handleBack = useCallback(() => {
    setGlobalError('');

    setCurrentStep((prevStep) => {
      const index = STEP_ORDER.indexOf(prevStep);

      if (index <= 1) {
        return prevStep;
      }

      return STEP_ORDER[index - 1] ?? prevStep;
    });
  }, []);

  const handleAuthSubmit = useCallback(
    async (data: AuthVerificationData) => {
      setGlobalError('');
      updateOnboardingData('auth', data);

      if (sessionId) {
        setCurrentStep('basic_profile');
        return;
      }

      try {
        const session = await startSessionMutation.mutateAsync();

        setSessionId(session.sessionId);

        const nextStep =
          BACKEND_TO_UI_STEP[session.currentStep] ?? 'basic_profile';

        setCurrentStep(nextStep);
      } catch (error: any) {
        setGlobalError(error?.message || 'Failed to start onboarding session.');
      }
    },
    [sessionId, startSessionMutation, updateOnboardingData]
  );

  const handleBasicProfileSubmit = useCallback(
    async (data: BasicProfileData) => {
      setGlobalError('');

      try {
        updateOnboardingData('profile', data);
        await saveCurrentStep('basic_profile', data as any);
        goToStep('business_details');
      } catch (error: any) {
        setGlobalError(error?.message || 'Failed to save basic profile.');
      }
    },
    [goToStep, saveCurrentStep, updateOnboardingData]
  );

  const handleBusinessDetailsSubmit = useCallback(
    async (data: BusinessDetailsData) => {
      setGlobalError('');

      try {
        updateOnboardingData('business', data);
        await saveCurrentStep('business_details', data as any);
        goToStep('delivery_service');
      } catch (error: any) {
        setGlobalError(error?.message || 'Failed to save business details.');
      }
    },
    [goToStep, saveCurrentStep, updateOnboardingData]
  );

  const handleDeliveryServiceSubmit = useCallback(
    async (data: DeliveryServiceData) => {
      setGlobalError('');

      try {
        updateOnboardingData('delivery', data);
        await saveCurrentStep('delivery_service', data as any);
        goToStep('kyc_bank');
      } catch (error: any) {
        setGlobalError(error?.message || 'Failed to save service areas.');
      }
    },
    [goToStep, saveCurrentStep, updateOnboardingData]
  );

  const handleKycBankSubmit = useCallback(
    async (data: KycBankData) => {
      setGlobalError('');

      try {
        updateOnboardingData('kycBank', data);
        await saveCurrentStep('kyc_bank', data as any);
        goToStep('agreement');
      } catch (error: any) {
        setGlobalError(error?.message || 'Failed to save KYC details.');
      }
    },
    [goToStep, saveCurrentStep, updateOnboardingData]
  );

  const handleAgreementSubmit = useCallback(
    async (data: AgreementData) => {
      setGlobalError('');

      try {
        updateOnboardingData('agreement', data);
        await saveCurrentStep('agreement', data as any);
        goToStep('completion');
      } catch (error: any) {
        setGlobalError(error?.message || 'Failed to save agreement.');
      }
    },
    [goToStep, saveCurrentStep, updateOnboardingData]
  );

  const handleCompleteOnboarding = useCallback(async () => {
    if (!sessionId) {
      setGlobalError('Onboarding session not found.');
      return;
    }

    setGlobalError('');

    try {
      await submitSessionMutation.mutateAsync({ sessionId });
      router.push('/caterer/dashboard');
    } catch (error: any) {
      setGlobalError(error?.message || 'Failed to complete onboarding.');
    }
  }, [router, sessionId, submitSessionMutation]);

  const renderCurrentStep = () => {
    if (!isAuthenticated) {
      return <EmailOrPhoneVerification onSubmitForm={handleAuthSubmit} />;
    }

    switch (currentStep) {
      case 'basic_profile':
        return (
          <BasicProfile
            initialData={onboardingData.profile}
            onSubmitForm={handleBasicProfileSubmit}
            onBack={handleBack}
            isLoading={isSubmitting}
            error={globalError}
          />
        );

      case 'business_details':
        return (
          <BusinessDetails
            masterData={masterData}
            initialData={onboardingData.business}
            onSubmitForm={handleBusinessDetailsSubmit}
            onBack={handleBack}
            isLoading={isSubmitting}
            error={globalError}
          />
        );

      case 'delivery_service':
        return (
          <ServiceAreas
            initialData={onboardingData.delivery}
            baseCityId={onboardingData.profile.baseCityId}
            onSubmitForm={handleDeliveryServiceSubmit}
            onBack={handleBack}
            isLoading={isSubmitting}
            error={globalError}
            styles={styles}
          />
        );

      case 'kyc_bank':
        return (
          <KycPayments
            initialData={onboardingData.kycBank}
            onSubmitForm={handleKycBankSubmit}
            onBack={handleBack}
            isLoading={isSubmitting}
            error={globalError}
          />
        );

      case 'agreement':
        return (
          <PartnerAgreement
            sessionId={sessionId!}
            initialData={
              onboardingData.agreement ?? {
                agreementVersionId: activeAgreementVersionId,
                termsAccepted: false,
                privacyAccepted: false,
                signatureImage: null,
                otpVerified: true,
                signedDocumentUrl: null,
                acceptedAt: null,
              }
            }
            onSubmitForm={handleAgreementSubmit}
            onBack={handleBack}
            isLoading={isSubmitting}
            error={globalError}
          />
        );

      case 'completion':
        return (
          <OnboardingStatus
            onboardingData={onboardingData}
            onComplete={handleCompleteOnboarding}
            isLoading={submitSessionMutation.isPending}
            error={globalError}
          />
        );

      default:
        return null;
    }
  };

  if (isPageBootstrapping) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div style={styles.content}>
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: '3px solid #e5e7eb',
                borderTopColor: '#667eea',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 0.8s linear infinite',
              }}
            />

            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Preparing your onboarding
            </h2>

            <p style={{ color: '#6b7280', fontSize: 15 }}>
              We are checking your session and loading your saved progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (staticDataError) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={{ padding: 32, textAlign: 'center' }}>
            <h2>Unable to load onboarding data</h2>
            <p>Please refresh and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (globalError && isAuthenticated && !sessionId) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={{ padding: 32, textAlign: 'center' }}>
            <h2>Unable to start onboarding</h2>
            <p>{globalError}</p>
            <button
              type="button"
              onClick={() => {
                setGlobalError('');
                hasBootstrappedSessionRef.current = false;
              }}
              style={{
                marginTop: 16,
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                background: '#667eea',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.onboardingHeader}>
          <div>
            <p style={styles.kicker}>Partner onboarding</p>
            <h1 style={styles.onboardingTitle}>Set up your partner profile</h1>
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>
              Step {Math.max(currentStepIndex + 1, 1)} of {STEP_ORDER.length}
            </span>
          </div>
        </div>

        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        {renderCurrentStep()}
      </div>
    </div>
  );
}
