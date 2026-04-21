'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { sendOtpApi, verifyOtpApi } from '@catering-marketplace/query-client';
import { styles } from './styles';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';

// Import all components
import EmailOrPhoneVerification from './components/EmailOrPhoneVerification';
import BasicProfile from './components/BasicProfile';
import BusinessDetails from './components/BusinessDetails';
import KycPayments from './components/KycPayments';
import PartnerAgreement from './components/PartnerAgreement';
import OnboardingStatus from './components/OnboardingStatus';
import ServiceAreas from './components/ServiceAreas';

// Type definitions
type OnboardingStep =
  | 'phone-verification'
  | 'basic-profile'
  | 'business-details'
  | 'service-areas'
  | 'kyc-payments'
  | 'agreement'
  | 'completion';

type BusinessType = 'home-chef' | 'small-caterer' | 'catering-service';
type DietType = 'veg' | 'non-veg' | 'both';
type EventType =
  | 'weddings'
  | 'birthdays'
  | 'corporate'
  | 'house-parties'
  | 'anniversaries';
type CapabilityType =
  | 'menu-planning'
  | 'setup-arrangements'
  | 'professional-staff'
  | 'equipment'
  | 'cleanup'
  | 'beverage-service';
type VerificationType = 'email' | 'phone';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  imageFile?: File;
};

type Package = {
  id: string;
  name: string;
  type: 'fixed' | 'customizable';
  minGuests: number;
  maxGuests: number;
  minPrice: number;
  maxPrice: number;
  menuItemIds: string[];
};

interface ServiceArea {
  pincode: string;
  city: string;
  state: string;
}

interface BankDetails {
  BANK: string;
  ADDRESS: string;
  CENTRE: string;
  CITY: string;
  MICR: string;
  NEFT: boolean;
  RTGS: boolean;
  IMPS: boolean;
  UPI: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();

  // Fetch master data
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
  const initialRedirectChecked = useRef(false);
  const ifscTimeoutRef = useRef<NodeJS.Timeout>();

  // Step 1: Phone/Email Verification
  const [verificationType, setVerificationType] =
    useState<VerificationType>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  // Step 2: Basic Profile
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<string[]>([]);
  const [eventsHandled, setEventsHandled] = useState<string[]>([]);

  // Step 3: Business Details
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]); // Array of IDs
  const [specializations, setSpecializations] = useState<string[]>([]); // Array of IDs
  const [dietTypes, setDietTypes] = useState<string[]>([]); // Array of IDs
  const [capacityRange, setCapacityRange] = useState(''); // Single selection
  const [baseCity, setBaseCity] = useState('');

  // Step 4: Capabilities
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    []
  );

  // Step 5: Service Areas
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [newPincode, setNewPincode] = useState('');
  const [pincodeValidationMessage, setPincodeValidationMessage] = useState('');
  const [selectedServiceCity, setSelectedServiceCity] = useState('');

  // Step 6: KYC & Payments
  const [panNumber, setPanNumber] = useState('');
  const [panFile, setPanFile] = useState<File | null>(null);
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isValidatingIFSC, setIsValidatingIFSC] = useState(false);
  const [ifscError, setIfscError] = useState('');

  // Step 7: Menu Setup
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Step 8: Packages
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackage, setNewPackage] = useState<Partial<Package>>({
    name: '',
    type: 'fixed',
    minGuests: 10,
    maxGuests: 100,
    minPrice: 0,
    maxPrice: 0,
    menuItemIds: [],
  });
  const [selectedMenuItemsForPackage, setSelectedMenuItemsForPackage] =
    useState<string[]>([]);

  // Step 9: Partner Agreement
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [signaturePad, setSignaturePad] = useState<HTMLCanvasElement | null>(
    null
  );
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  const onboardingSteps: OnboardingStep[] = [
    'basic-profile',
    'business-details',
    'service-areas',
    'kyc-payments',
    'agreement',
    'completion',
  ];

  // Utilities
  const getStepNumber = (): string => {
    const currentIndex = onboardingSteps.indexOf(onboardingStep);
    return `${currentIndex + 1} of ${onboardingSteps.length}`;
  };

  const getProgressPercentage = (): number => {
    if (onboardingStep === 'phone-verification') return 0;
    const currentIndex = onboardingSteps.indexOf(onboardingStep);
    return ((currentIndex + 1) / onboardingSteps.length) * 100;
  };

  // Helper function to get cities from master data
  const getCitiesFromMasterData = (): Array<{
    code: string;
    name: string;
    pincodes: string[];
  }> => {
    if (!masterData) return [];

    // Build cities from service areas available in master data
    const citiesSet = new Set<string>();
    return [
      {
        code: 'delhi',
        name: 'Delhi',
        pincodes: ['110001', '110002', '110003', '110004', '110005'],
      },
      {
        code: 'mumbai',
        name: 'Mumbai',
        pincodes: ['400001', '400002', '400003', '400004', '400005'],
      },
      {
        code: 'bangalore',
        name: 'Bangalore',
        pincodes: ['560001', '560002', '560003', '560004', '560005'],
      },
      {
        code: 'hyderabad',
        name: 'Hyderabad',
        pincodes: ['500001', '500002', '500003', '500004', '500005'],
      },
      {
        code: 'pune',
        name: 'Pune',
        pincodes: ['411001', '411002', '411003', '411004', '411005'],
      },
      {
        code: 'kolkata',
        name: 'Kolkata',
        pincodes: ['700001', '700002', '700003', '700004', '700005'],
      },
      {
        code: 'chennai',
        name: 'Chennai',
        pincodes: ['600001', '600002', '600003', '600004', '600005'],
      },
      {
        code: 'ahmedabad',
        name: 'Ahmedabad',
        pincodes: ['380001', '380002', '380003', '380004', '380005'],
      },
    ];
  };

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

  const handleBasicProfileFormDataChange = (formData: {
    fullName: string;
    businessName: string;
    businessType: string[];
    eventsHandled: string[];
  }) => {
    setFullName(formData.fullName);
    setBusinessName(formData.businessName);
    setBusinessType(formData.businessType);
    setEventsHandled(formData.eventsHandled);
  };

  // ========== Step 1 Handlers ==========
  const handleChangeVerificationType = () => {
    setVerificationType(verificationType === 'email' ? 'phone' : 'email');
    setPhone('');
    setEmail('');
    setOtp('');
    setOtpSent(false);
    setError('');
    setResendTimer(0);
    setResendCount(0);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isEmail = verificationType === 'email';

    if (isEmail && (!email.includes('@') || !email.includes('.'))) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!isEmail && phone.length < 10) {
      setError('Please enter a valid phone number');
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
      const payload = isEmail ? { email } : { phone: `${countryCode}${phone}` };
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const isEmail = verificationType === 'email';
      const payload = isEmail
        ? { email, otp }
        : { phone: `${countryCode}${phone}`, otp };

      const result = await verifyOtpApi(payload);
      const isVerified = isEmail
        ? result?.data?.email_verified
        : result?.data?.phone_verified;

      if (!result.success || !isVerified) {
        setError(result.message || 'Invalid OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setPhoneVerified(true);
      setOtpSent(false);
      setOtp('');
      setError('');
      setOnboardingStep('basic-profile');
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);

    if (resendCount >= 3) {
      setError(
        'Maximum OTP requests reached (3 attempts). Please try again after some time.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const isEmail = verificationType === 'email';
      const payload = isEmail ? { email } : { phone: `${countryCode}${phone}` };
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
    } finally {
      setIsLoading(false);
    }
  };

  // ========== Step 2 Handlers ==========
  const handleBasicProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (
      !fullName.trim() ||
      !businessName.trim() ||
      eventsHandled.length === 0
    ) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('business-details');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== Step 3 Handlers ==========
  

  const handleBusinessDetailsFormDataChange = (
    formData: {
      yearsInBusiness: string;
      cuisines: string[];
      specializations: string[];
      dietTypes: string[];
      capacityRange: string;
      baseCity: string;
    },
    isValid: boolean
  ) => {
    setYearsInBusiness(formData.yearsInBusiness);
    setCuisines(formData.cuisines);
    setSpecializations(formData.specializations);
    setDietTypes(formData.dietTypes);
    setCapacityRange(formData.capacityRange);
    setBaseCity(formData.baseCity);
  
    if (isValid) {
      setOnboardingStep('service-areas');
    }
  };

  const validatePincode = (pincode: string) => {
    const citiesList = getCitiesFromMasterData();
    const city = citiesList.find((c) => c.pincodes.includes(pincode));

    if (city) {
      setPincodeValidationMessage(`✓ Valid pincode for ${city.name}`);
      setSelectedServiceCity(city.code);
      return city;
    } else {
      setPincodeValidationMessage('✗ Pincode not in serviceable areas');
      setSelectedServiceCity('');
      return null;
    }
  };

  const addServiceArea = () => {
    if (!newPincode.trim()) {
      setError('Please enter a pincode');
      return;
    }

    const city = validatePincode(newPincode);
    if (!city) {
      setError('Invalid pincode. Please check and try again.');
      return;
    }

    if (serviceAreas.some((area) => area.pincode === newPincode)) {
      setError('This pincode is already added');
      return;
    }

    const newArea: ServiceArea = {
      pincode: newPincode,
      city: city.name,
      state: 'India',
    };

    setServiceAreas([...serviceAreas, newArea]);
    setNewPincode('');
    setPincodeValidationMessage('');
    setError('');
  };

  const removeServiceArea = (pincode: string) => {
    setServiceAreas(serviceAreas.filter((area) => area.pincode !== pincode));
  };

  const handleServiceAreasSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (serviceAreas.length === 0) {
      setError('Please add at least one service area');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('kyc-payments');
    } catch (err) {
      setError('Failed to save service areas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== Step 6 Handlers ==========
  const fetchIFSCDetails = async (code: string) => {
    if (!code || code.length < 4) {
      setBankDetails(null);
      setIfscError('');
      return;
    }

    setIsValidatingIFSC(true);
    setIfscError('');

    if (ifscTimeoutRef.current) {
      clearTimeout(ifscTimeoutRef.current);
    }

    try {
      const response = await fetch(
        `https://ifsc.razorpay.com/${code.toUpperCase()}`
      );

      if (!response.ok) {
        setIfscError('IFSC code not found. Please check and try again.');
        setBankDetails(null);
        setIsValidatingIFSC(false);
        return;
      }

      const data: BankDetails = await response.json();

      if (data.BANK && data.CENTRE && data.CITY) {
        setBankDetails(data);
        setIfscError('');
      } else {
        setIfscError('Invalid IFSC code response. Please try again.');
        setBankDetails(null);
      }
    } catch (err) {
      console.error('Error fetching IFSC details:', err);
      setIfscError('Failed to validate IFSC code. Please try again.');
      setBankDetails(null);
    } finally {
      setIsValidatingIFSC(false);
    }
  };

  const handleIfscChange = (value: string) => {
    const uppercaseValue = value.toUpperCase();
    setIfscCode(uppercaseValue);

    if (ifscTimeoutRef.current) {
      clearTimeout(ifscTimeoutRef.current);
    }

    if (uppercaseValue.length >= 4) {
      ifscTimeoutRef.current = setTimeout(() => {
        fetchIFSCDetails(uppercaseValue);
      }, 500);
    } else {
      setBankDetails(null);
      setIfscError('');
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!panNumber.trim() && !upiId.trim()) {
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

  const handleKycSkip = () => {
    setOnboardingStep('agreement');
  };

  // ========== Step 9 Handlers ==========
  const handleSignatureDraw = (canvas: HTMLCanvasElement) => {
    const imageData = canvas.toDataURL('image/png');
    setSignatureImage(imageData);
  };

  const handleSignatureClear = () => {
    setSignatureImage(null);
  };

  const handleAgreementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!termsAccepted || !privacyAccepted || !signatureImage) {
      setError('Please accept all terms and provide your signature');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('completion');
    } catch (err) {
      setError('Failed to process agreement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== Step 10 Handlers ==========
  const handleCompleteOnboarding = async () => {
    setIsLoading(true);

    try {
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

  // Show error if master data failed to load
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

  // ========== RENDER STEPS ==========

  // Step 1: Email/Phone Verification
  if (onboardingStep === 'phone-verification' && !phoneVerified) {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '0%' }} />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>1 of 10</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <EmailOrPhoneVerification
            verificationType={verificationType}
            emailOrPhone={verificationType === 'email' ? email : phone}
            countryCode={countryCode}
            otp={otp}
            otpSent={otpSent}
            resendTimer={resendTimer}
            resendCount={resendCount}
            isLoading={isLoading}
            error={error}
            onEmailOrPhoneChange={(value) => {
              if (verificationType === 'email') {
                setEmail(value);
              } else {
                setPhone(value);
              }
            }}
            onCountryCodeChange={setCountryCode}
            onOtpChange={setOtp}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            onChangeMethod={handleChangeVerificationType}
            onResendOtp={handleResendOtp}
            styles={styles}
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
            fullName={fullName}
            businessName={businessName}
            businessType={businessType}
            eventsHandled={eventsHandled}
            isLoading={isLoading}
            error={error}
            onFormDataChange={handleBasicProfileFormDataChange}
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
            yearsInBusiness={yearsInBusiness}
            cuisines={cuisines}
            specializations={specializations}
            dietTypes={dietTypes}
            capacityRange={capacityRange}
            baseCity={baseCity}
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

  // Step 5: Service Areas
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
            serviceAreas={serviceAreas}
            newPincode={newPincode}
            pincodeValidationMessage={pincodeValidationMessage}
            isLoading={isLoading}
            error={error}
            onPincodeChange={setNewPincode}
            onAddServiceArea={addServiceArea}
            onRemoveServiceArea={removeServiceArea}
            onSubmit={handleServiceAreasSubmit}
            onBack={() => setOnboardingStep('business-details')}
            onValidatePincode={validatePincode}
            styles={styles}
            allowedCities={getCitiesFromMasterData()}
          />
        </div>
      </div>
    );
  }

  // Step 6: KYC & Payments
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
            panNumber={panNumber}
            panFile={panFile}
            ifscCode={ifscCode}
            accountNumber={accountNumber}
            accountHolderName={accountHolderName}
            upiId={upiId}
            bankDetails={bankDetails}
            isValidatingIFSC={isValidatingIFSC}
            ifscError={ifscError}
            isLoading={isLoading}
            error={error}
            onPanNumberChange={setPanNumber}
            onPanFileChange={setPanFile}
            onIfscCodeChange={handleIfscChange}
            onAccountNumberChange={setAccountNumber}
            onAccountHolderNameChange={setAccountHolderName}
            onUpiIdChange={setUpiId}
            onIfscValidate={fetchIFSCDetails}
            onSubmit={handleKycSubmit}
            onSkip={handleKycSkip}
            onBack={() => setOnboardingStep('service-areas')}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  // Step 7: Partner Agreement
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
            termsAccepted={termsAccepted}
            privacyAccepted={privacyAccepted}
            signaturePad={signaturePad}
            signatureImage={signatureImage}
            isLoading={isLoading}
            error={error}
            onTermsAcceptChange={setTermsAccepted}
            onPrivacyAcceptChange={setPrivacyAccepted}
            onSignatureDraw={handleSignatureDraw}
            onSignatureClear={handleSignatureClear}
            onSubmit={handleAgreementSubmit}
            onBack={() => setOnboardingStep('service-areas')}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  // Step 8: Completion
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
              capabilities: selectedCapabilities.length,
              serviceAreas: serviceAreas.length,
              menuItems: menuItems.length,
              packages: packages.length,
              hasKYC: !!(panNumber || upiId),
            }}
            isLoading={isLoading}
            error={error}
            onComplete={handleCompleteOnboarding}
            styles={styles}
          />
        </div>
      </div>
    );
  }

  return null;
}
