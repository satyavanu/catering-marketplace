'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  OnboardingStep,
  PartnerOnboardingPayload,
  AuthVerificationData,
  BasicProfileData,
  BusinessDetailsData,
  DeliveryServiceData,
  KycBankData,
  AgreementData,
} from './types';
import { useSession } from 'next-auth/react';

const STEP_ORDER: OnboardingStep[] = [
  'phone_verification',
  'basic_profile',
  'business_details',
  'delivery_service',
  'kyc_bank',
  'agreement',
  'completion',
];

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
  const { data: session, status, update: updateSession } = useSession();

  const {
    data: masterData,
    isLoading: isStaticDataLoading,
    error: staticDataError,
  } = useOnboardingMasterDataContext();
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>('phone_verification');
  const [mounted, setMounted] = useState(false);

  const [onboardingData, setOnboardingData] = useState(DEFAULT_ONBOARDING_DATA);

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const currentStepIndex = useMemo(
    () => STEP_ORDER.indexOf(currentStep),
    [currentStep]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (status !== 'unauthenticated') {
      setCurrentStep('basic_profile');
    }
  }, [status, session, mounted, router]);

  const progressPercentage = useMemo(() => {
    if (currentStepIndex < 0) return 0;
    return ((currentStepIndex + 1) / STEP_ORDER.length) * 100;
  }, [currentStepIndex]);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      const index = STEP_ORDER.indexOf(prevStep);
      return STEP_ORDER[index + 1] ?? prevStep;
    });
  }, []);

  const handleBack = useCallback(() => {
    setGlobalError('');

    setCurrentStep((prevStep) => {
      const index = STEP_ORDER.indexOf(prevStep);
      return STEP_ORDER[index - 1] ?? prevStep;
    });
  }, []);

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

  const handleAuthSubmit = useCallback(
    async (data: AuthVerificationData) => {
      updateOnboardingData('auth', data);
      setCurrentStep('basic_profile');
    },
    [updateOnboardingData]
  );

  const handleBasicProfileSubmit = useCallback(
    async (data: BasicProfileData) => {
      updateOnboardingData('profile', data);
      setCurrentStep('business_details');
    },
    [updateOnboardingData]
  );

  const handleBusinessDetailsSubmit = useCallback(
    async (data: BusinessDetailsData) => {
      updateOnboardingData('business', data);
      setCurrentStep('delivery_service');
    },
    [updateOnboardingData]
  );

  const handleDeliveryServiceSubmit = useCallback(
    async (data: DeliveryServiceData) => {
      updateOnboardingData('delivery', data);
      setCurrentStep('kyc_bank');
    },
    [updateOnboardingData]
  );

  const handleKycBankSubmit = useCallback(
    async (data: KycBankData) => {
      updateOnboardingData('kycBank', data);
      setCurrentStep('agreement');
    },
    [updateOnboardingData]
  );

  const handleAgreementSubmit = useCallback(
    async (data: AgreementData) => {
      updateOnboardingData('agreement', data);
      setCurrentStep('completion');
    },
    [updateOnboardingData]
  );

  const handleCompleteOnboarding = useCallback(async () => {
    setIsLoading(true);
    setGlobalError('');

    try {
      console.log('Final onboarding payload:', onboardingData);

      // later:
      // await fetch('/api/onboarding/complete', {
      //   method: 'POST',
      //   body: JSON.stringify({ onboardingId }),
      // });

      router.push('/caterer/dashboard');
    } catch (error: any) {
      setGlobalError(error.message || 'Failed to complete onboarding.');
    } finally {
      setIsLoading(false);
    }
  }, [onboardingData, router]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone_verification':
        return <EmailOrPhoneVerification onSubmitForm={handleAuthSubmit} />;

      case 'basic_profile':
        return (
          <BasicProfile
            initialData={onboardingData.profile}
            onSubmitForm={handleBasicProfileSubmit}
            onBack={handleBack}
            isLoading={isLoading}
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
            isLoading={isLoading}
            error={globalError}
          />
        );

      case 'delivery_service':
        return (
          <ServiceAreas
            initialData={onboardingData.delivery}
            cities={masterData?.cities || []}
            onSubmitForm={handleDeliveryServiceSubmit}
            onBack={handleBack}
            isLoading={isLoading}
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
            isLoading={isLoading}
            error={globalError}
          />
        );

      case 'agreement':
        return (
          <PartnerAgreement
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
          isLoading={isLoading}
          error={globalError}
        />
        );

      case 'completion':
        return (
          <OnboardingStatus
            onboardingData={onboardingData}
            onComplete={handleCompleteOnboarding}
            isLoading={isLoading}
            error={globalError}
          />
        );
      default:
        return <p>Unknown onboarding step.</p>;
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.content}>
        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        <div style={styles.stepIndicator}>
          <span style={styles.stepNumber}>
            Step {currentStepIndex + 1} of {STEP_ORDER.length}
          </span>
        </div>

        {renderCurrentStep()}
      </div>
    </div>
  );
}
