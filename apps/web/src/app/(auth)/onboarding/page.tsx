'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { sendOtpApi, verifyOtpApi } from '@catering-marketplace/query-client';
import {
  ArrowRight,
  Shield,
  Utensils,
  Loader,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  Check,
} from 'lucide-react';

type OnboardingStep =
  | 'phone-verification'
  | 'basic-profile'
  | 'business-details'
  | 'capabilities'
  | 'service-areas'
  | 'kyc-payments'
  | 'menu-setup'
  | 'packages'
  | 'completion';

type BusinessType = 'home-chef' | 'small-caterer' | 'catering-service';
type DietType = 'veg' | 'non-veg' | 'both';
type EventType = 'weddings' | 'birthdays' | 'corporate' | 'house-parties' | 'anniversaries';
type CapabilityType =
  | 'menu-planning'
  | 'setup-arrangements'
  | 'professional-staff'
  | 'equipment'
  | 'cleanup'
  | 'beverage-service';

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

// Mock data - replace with backend API calls
const MOCK_ALLOWED_CITIES = [
  { code: 'delhi', name: 'Delhi', pincodes: ['110001', '110002', '110003', '110004', '110005'] },
  { code: 'mumbai', name: 'Mumbai', pincodes: ['400001', '400002', '400003', '400004', '400005'] },
  { code: 'bangalore', name: 'Bangalore', pincodes: ['560001', '560002', '560003', '560004', '560005'] },
  { code: 'hyderabad', name: 'Hyderabad', pincodes: ['500001', '500002', '500003', '500004', '500005'] },
  { code: 'pune', name: 'Pune', pincodes: ['411001', '411002', '411003', '411004', '411005'] },
  { code: 'kolkata', name: 'Kolkata', pincodes: ['700001', '700002', '700003', '700004', '700005'] },
  { code: 'chennai', name: 'Chennai', pincodes: ['600001', '600002', '600003', '600004', '600005'] },
  { code: 'ahmedabad', name: 'Ahmedabad', pincodes: ['380001', '380002', '380003', '380004', '380005'] },
];

const CAPABILITIES = [
  { id: 'menu-planning', label: 'Menu Planning & Customization', icon: '🍽️' },
  { id: 'setup-arrangements', label: 'Setup & Table Arrangements', icon: '🪑' },
  { id: 'professional-staff', label: 'Professional Staff Service', icon: '👥' },
  { id: 'equipment', label: 'Equipment & Utensils', icon: '🔪' },
  { id: 'cleanup', label: 'Cleanup & Disposal', icon: '🧹' },
  { id: 'beverage-service', label: 'Beverage Service', icon: '🥂' },
];

const COUNTRY_CODES = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
];

const CUISINES = [
  'South Indian',
  'North Indian',
  'Chinese',
  'Continental',
  'Italian',
  'Mughlai',
  'Desserts',
  'Bakery',
  'Fusion',
  'Other',
];

const EVENTS = [
  { id: 'weddings', label: 'Weddings', icon: '💍' },
  { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
  { id: 'corporate', label: 'Corporate Events', icon: '🏢' },
  { id: 'house-parties', label: 'House Parties', icon: '🏠' },
  { id: 'anniversaries', label: 'Anniversaries', icon: '💑' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>('phone-verification');

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

  // Step 2: Basic Profile
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('small-caterer');
  const [eventsHandled, setEventsHandled] = useState<EventType[]>([]);

  // Step 3: Business Details
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietType, setDietType] = useState<DietType>('both');
  const [capacity, setCapacity] = useState('');
  const [baseCity, setBaseCity] = useState('');

  // Step 4: Capabilities
  const [selectedCapabilities, setSelectedCapabilities] = useState<CapabilityType[]>([]);

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
  const ifscTimeoutRef = useRef<NodeJS.Timeout>();

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
  const [selectedMenuItemsForPackage, setSelectedMenuItemsForPackage] = useState<string[]>([]);

  const initialRedirectChecked = useRef(false);

  const onboardingSteps: OnboardingStep[] = [
    'basic-profile',
    'business-details',
    'capabilities',
    'service-areas',
    'kyc-payments',
    'menu-setup',
    'packages',
    'completion',
  ];

  const getStepNumber = (): string => {
    const currentIndex = onboardingSteps.indexOf(onboardingStep);
    return `${currentIndex + 1} of ${onboardingSteps.length}`;
  };

  const getProgressPercentage = (): number => {
    const currentIndex = onboardingSteps.indexOf(onboardingStep);
    return ((currentIndex + 1) / onboardingSteps.length) * 100;
  };

  // Resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Initial mount and auth check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication and profile completion
  useEffect(() => {
    if (!mounted) return;

    if (status === 'unauthenticated') {
      setOnboardingStep('phone-verification');
    } else if (status === 'authenticated' && session?.user) {
      const isCaterer = (session.user as any)?.role === 'caterer';
      const isProfileCompleted = (session.user as any)?.isOnboardingCompleted === true;

      if (isCaterer && isProfileCompleted) {
        setIsRedirecting(true);
        router.push('/caterer/dashboard');
      } else {
        setPhoneVerified(true);
        setOnboardingStep('basic-profile');
      }
    }
  }, [status, session, mounted, router]);

  // IFSC validation
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

  // Pincode Validation
  const validatePincode = (pincode: string) => {
    const city = MOCK_ALLOWED_CITIES.find((c) =>
      c.pincodes.includes(pincode)
    );

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

const resendTimerRef = useRef<NodeJS.Timeout>();


   // Resend timer effect - 60 seconds
   useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // OTP Handlers
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    if (resendCount >= 3) {
      setError('Maximum OTP requests reached (3 attempts). Please try again after some time.');
      setIsLoading(false);
      return;
    }

    try {
      const payload = { phone: `${countryCode}${phone}` };
      const result = await sendOtpApi(payload);

      if (!result.success) {
        setError(result.error || 'Failed to send OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setResendCount(resendCount + 1);
      setResendTimer(60); // 60 seconds timer
      setError('');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyOtpApi({
        phone: `${countryCode}${phone}`,
        otp,
      });

      if (!result.success || !result?.data?.phone_verified) {
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
 

  // Step handlers
  const handleBasicProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fullName.trim() || !businessName.trim() || eventsHandled.length === 0) {
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

  const handleBusinessDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!yearsInBusiness || cuisines.length === 0 || !capacity.trim() || !baseCity.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate base city is in allowed cities
    const isValidCity = MOCK_ALLOWED_CITIES.some((c) => c.code === baseCity);
    if (!isValidCity) {
      setError('Please select a valid city');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('capabilities');
    } catch (err) {
      setError('Failed to save business details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Capability
  const toggleCapability = (capabilityId: CapabilityType) => {
    if (selectedCapabilities.includes(capabilityId)) {
      setSelectedCapabilities(selectedCapabilities.filter((c) => c !== capabilityId));
    } else {
      setSelectedCapabilities([...selectedCapabilities, capabilityId]);
    }
  };

  const handleCapabilitiesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (selectedCapabilities.length === 0) {
      setError('Please select at least one capability');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('service-areas');
    } catch (err) {
      setError('Failed to save capabilities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Service Area Handlers
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

    // Check if pincode already exists
    if (serviceAreas.some((area) => area.pincode === newPincode)) {
      setError('This pincode is already added');
      return;
    }

    const newArea: ServiceArea = {
      pincode: newPincode,
      city: city.name,
      state: 'India', // Mock - add actual state later
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

  const handleKycSkip = () => {
    setOnboardingStep('menu-setup');
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
      setOnboardingStep('menu-setup');
    } catch (err) {
      setError('Failed to save KYC details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Menu Item Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Please upload PNG or JPG image only');
      return;
    }

    // Validate file size (100KB = 102400 bytes)
    if (file.size > 102400) {
      setError('Image size should be less than 100KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setNewMenuItem({ ...newMenuItem, imageFile: file, image: reader.result as string });
    };
    reader.readAsDataURL(file);
    setError('');
  };
  const toggleEventType = (eventId: EventType) => {
  if (eventsHandled.includes(eventId)) {
    setEventsHandled(eventsHandled.filter((e) => e !== eventId));
  } else {
    setEventsHandled([...eventsHandled, eventId]);
  }
};

  const addMenuItem = () => {
    if (!newMenuItem.name?.trim() || !newMenuItem.price) {
      setError('Please fill in name and price');
      return;
    }

    const menuItem: MenuItem = {
      id: Date.now().toString(),
      name: newMenuItem.name || '',
      price: newMenuItem.price || 0,
      description: newMenuItem.description || '',
      image: newMenuItem.image,
      imageFile: newMenuItem.imageFile,
    };

    setMenuItems([...menuItems, menuItem]);
    setNewMenuItem({ name: '', price: 0, description: '' });
    setImagePreview(null);
    setError('');
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (menuItems.length === 0) {
      setError('Please add at least one menu item');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('packages');
    } catch (err) {
      setError('Failed to save menu items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuSkip = () => {
    setOnboardingStep('packages');
  };

  // Package Handlers
  const addPackage = () => {
    if (
      !newPackage.name?.trim() ||
      !newPackage.type ||
      !newPackage.minGuests ||
      !newPackage.maxGuests ||
      !newPackage.minPrice ||
      !newPackage.maxPrice ||
      selectedMenuItemsForPackage.length === 0
    ) {
      setError('Please fill in all required fields and select menu items');
      return;
    }

    if (newPackage.minGuests > newPackage.maxGuests) {
      setError('Minimum guests cannot be more than maximum guests');
      return;
    }

    if (newPackage.minPrice > newPackage.maxPrice) {
      setError('Minimum price cannot be more than maximum price');
      return;
    }

    const pkg: Package = {
      id: Date.now().toString(),
      name: newPackage.name || '',
      type: newPackage.type || 'fixed',
      minGuests: newPackage.minGuests || 10,
      maxGuests: newPackage.maxGuests || 100,
      minPrice: newPackage.minPrice || 0,
      maxPrice: newPackage.maxPrice || 0,
      menuItemIds: selectedMenuItemsForPackage,
    };

    setPackages([...packages, pkg]);
    setNewPackage({
      name: '',
      type: 'fixed',
      minGuests: 10,
      maxGuests: 100,
      minPrice: 0,
      maxPrice: 0,
      menuItemIds: [],
    });
    setSelectedMenuItemsForPackage([]);
    setError('');
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const toggleMenuItemForPackage = (itemId: string) => {
    if (selectedMenuItemsForPackage.includes(itemId)) {
      setSelectedMenuItemsForPackage(
        selectedMenuItemsForPackage.filter((id) => id !== itemId)
      );
    } else {
      setSelectedMenuItemsForPackage([...selectedMenuItemsForPackage, itemId]);
    }
  };

  const handlePackagesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      setOnboardingStep('completion');
    } catch (err) {
      setError('Failed to save packages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackagesSkip = () => {
    setOnboardingStep('completion');
  };

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

  if (!mounted || status === 'loading') {
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

  // Step 1: Phone Verification
  if (onboardingStep === 'phone-verification' && !phoneVerified) {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '12.5%' }} />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>1 of 9</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <div style={styles.header}>
            <h1 style={styles.title}>Welcome to Droooly</h1>
            <p style={styles.subtitle}>Start selling your delicious food today</p>
          </div>

          <form onSubmit={handleSendPhoneOtp} style={styles.profileForm}>
            {!otpSent ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <div style={styles.phoneInputGroup}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={styles.countryCodeSelect}
                      disabled={isLoading}
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="10-digit phone number"
                      style={styles.input}
                      disabled={isLoading}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <button
                  type="submit"
                  disabled={isLoading || !phone || phone.length < 10}
                  style={{
                    ...styles.submitButton,
                    opacity: isLoading || !phone || phone.length < 10 ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && phone && phone.length >= 10) {
                      e.currentTarget.style.backgroundColor = '#ea580c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                  }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Enter OTP *</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="6-digit OTP"
                    style={styles.input}
                    disabled={isLoading}
                    maxLength={6}
                    required
                  />
                  <p style={styles.otpSentText}>
                    OTP sent to {countryCode} {phone}
                  </p>
                </div>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <button
                  type="button"
                  onClick={handleVerifyPhoneOtp}
                  disabled={isLoading || !otp || otp.length !== 6}
                  style={{
                    ...styles.submitButton,
                    opacity: isLoading || !otp || otp.length !== 6 ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && otp && otp.length === 6) {
                      e.currentTarget.style.backgroundColor = '#ea580c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                  disabled={isLoading}
                  style={styles.backButton}
                >
                  Change Phone Number
                </button>

                {resendTimer > 0 ? (
                  <p style={styles.helpText}>
                    Resend OTP in <strong>{resendTimer}s</strong>
                  </p>
                ) : resendCount >= 3 ? (
                  <div style={styles.errorMessage}>
                    Maximum attempts reached. Please try again after some time.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={isLoading || resendCount >= 3}
                    style={{
                      ...styles.resendButton,
                      opacity: isLoading || resendCount >= 3 ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading && resendCount < 3) {
                        e.currentTarget.style.backgroundColor = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#667eea';
                    }}
                  >
                    Resend OTP ({resendCount}/3)
                  </button>
                )}


              </>
            )}
          </form>
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

          <div style={styles.header}>
            <h1 style={styles.title}>Basic Profile</h1>
            <p style={styles.subtitle}>Tell us about your catering business</p>
          </div>

          <form onSubmit={handleBasicProfileSubmit} style={styles.profileForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                style={styles.input}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your catering business name"
                style={styles.input}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Type *</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                style={styles.input}
                disabled={isLoading}
                required
              >
                <option value="home-chef">Home Chef</option>
                <option value="small-caterer">Small Caterer</option>
                <option value="catering-service">Catering Service</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Events You Handle *</label>
              <p style={styles.helpText}>Select one or more</p>
              <div style={styles.eventGrid}>
                {EVENTS.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => toggleEventType(event.id as EventType)}
                    style={{
                      ...styles.eventTag,
                      ...(eventsHandled.includes(event.id as EventType)
                        ? styles.eventTagActive
                        : styles.eventTagInactive),
                    }}
                    onMouseEnter={(e) => {
                      if (!eventsHandled.includes(event.id as EventType)) {
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                        e.currentTarget.style.borderColor = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!eventsHandled.includes(event.id as EventType)) {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                      {event.icon}
                    </span>
                    {event.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={
                isLoading ||
                !fullName.trim() ||
                !businessName.trim() ||
                eventsHandled.length === 0
              }
              style={{
                ...styles.submitButton,
                opacity:
                  isLoading ||
                  !fullName.trim() ||
                  !businessName.trim() ||
                  eventsHandled.length === 0
                    ? 0.6
                    : 1,
              }}
              onMouseEnter={(e) => {
                if (
                  !isLoading &&
                  fullName.trim() &&
                  businessName.trim() &&
                  eventsHandled.length > 0
                ) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </form>
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

          <div style={styles.header}>
            <h1 style={styles.title}>Business Details</h1>
            <p style={styles.subtitle}>Tell us more about your specializations</p>
          </div>

          <form onSubmit={handleBusinessDetailsSubmit} style={styles.profileForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Years in Business *</label>
              <select
                value={yearsInBusiness}
                onChange={(e) => setYearsInBusiness(e.target.value)}
                style={styles.input}
                disabled={isLoading}
                required
              >
                <option value="">Select years</option>
                <option value="less-than-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="more-than-10">More than 10 years</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cuisines / Specializations *</label>
              <div style={styles.checkboxGroup}>
                {CUISINES.map((cuisine) => (
                  <label key={cuisine} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={cuisines.includes(cuisine)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCuisines([...cuisines, cuisine]);
                        } else {
                          setCuisines(cuisines.filter((c) => c !== cuisine));
                        }
                      }}
                      style={styles.checkbox}
                      disabled={isLoading}
                    />
                    {cuisine}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Diet Type *</label>
              <div style={styles.radioGroup}>
                {[
                  { value: 'veg', label: 'Vegetarian' },
                  { value: 'non-veg', label: 'Non-Vegetarian' },
                  { value: 'both', label: 'Both' },
                ].map((diet) => (
                  <label key={diet.value} style={styles.radioLabel}>
                    <input
                      type="radio"
                      value={diet.value}
                      checked={dietType === diet.value}
                      onChange={(e) => setDietType(e.target.value as DietType)}
                      disabled={isLoading}
                      style={styles.radioInput}
                    />
                    {diet.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Approx Capacity (people) *</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g., 50, 100, 500"
                style={styles.input}
                disabled={isLoading}
                min="1"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Base City *</label>
              <select
                value={baseCity}
                onChange={(e) => setBaseCity(e.target.value)}
                style={styles.input}
                disabled={isLoading}
                required
              >
                <option value="">Select city</option>
                {MOCK_ALLOWED_CITIES.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
              <p style={styles.helpText}>
                Choose from our serviceable cities
              </p>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !yearsInBusiness || cuisines.length === 0 || !capacity.trim() || !baseCity.trim()}
              style={{
                ...styles.submitButton,
                opacity: isLoading || !yearsInBusiness || !baseCity.trim() ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && yearsInBusiness && baseCity.trim()) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep('basic-profile')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Capabilities
  if (onboardingStep === 'capabilities') {
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

          <div style={styles.header}>
            <h1 style={styles.title}>Your Capabilities</h1>
            <p style={styles.subtitle}>What services can you provide?</p>
          </div>

          <form onSubmit={handleCapabilitiesSubmit} style={styles.profileForm}>
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                Select all the services you can provide
              </p>
            </div>

            <div style={styles.capabilitiesGrid}>
              {CAPABILITIES.map((capability) => (
                <button
                  key={capability.id}
                  type="button"
                  onClick={() => toggleCapability(capability.id as CapabilityType)}
                  style={{
                    ...styles.capabilityCard,
                    ...(selectedCapabilities.includes(capability.id as CapabilityType)
                      ? styles.capabilityCardActive
                      : styles.capabilityCardInactive),
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedCapabilities.includes(capability.id as CapabilityType)) {
                      e.currentTarget.style.backgroundColor = '#f0f9ff';
                      e.currentTarget.style.borderColor = '#667eea';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedCapabilities.includes(capability.id as CapabilityType)) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  {selectedCapabilities.includes(capability.id as CapabilityType) && (
                    <Check size={20} style={{ marginRight: '0.5rem' }} />
                  )}
                  <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                    {capability.icon}
                  </span>
                  <span style={{ flex: 1, textAlign: 'left' }}>
                    {capability.label}
                  </span>
                </button>
              ))}
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || selectedCapabilities.length === 0}
              style={{
                ...styles.submitButton,
                opacity: isLoading || selectedCapabilities.length === 0 ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && selectedCapabilities.length > 0) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep('business-details')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back
            </button>
          </form>
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

          <div style={styles.header}>
            <h1 style={styles.title}>Service Areas</h1>
            <p style={styles.subtitle}>Where can you deliver?</p>
          </div>

          <form onSubmit={handleServiceAreasSubmit} style={styles.profileForm}>
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                Add pincodes from serviceable areas only
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pincode *</label>
              <div style={styles.pincodeInputGroup}>
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setNewPincode(value);
                    if (value.length === 6) {
                      validatePincode(value);
                    } else {
                      setPincodeValidationMessage('');
                    }
                  }}
                  placeholder="Enter 6-digit pincode"
                  style={styles.input}
                  disabled={isLoading}
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={addServiceArea}
                  disabled={isLoading || !newPincode.trim() || !selectedServiceCity}
                  style={styles.addButton}
                >
                  <Plus size={18} />
                </button>
              </div>
              {pincodeValidationMessage && (
                <p
                  style={{
                    ...styles.helpText,
                    color: pincodeValidationMessage.startsWith('✓')
                      ? '#15803d'
                      : '#dc2626',
                  }}
                >
                  {pincodeValidationMessage}
                </p>
              )}
            </div>

            {serviceAreas.length > 0 && (
              <div style={styles.serviceAreasList}>
                {serviceAreas.map((area) => (
                  <div key={area.pincode} style={styles.serviceAreaItem}>
                    <div style={styles.areaContent}>
                      <h4 style={styles.areaTitle}>{area.pincode}</h4>
                      <p style={styles.areaSubtitle}>{area.city}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeServiceArea(area.pincode)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || serviceAreas.length === 0}
              style={{
                ...styles.submitButton,
                opacity: isLoading || serviceAreas.length === 0 ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && serviceAreas.length > 0) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep('capabilities')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back
            </button>
          </form>
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

          <div style={styles.header}>
            <h1 style={styles.title}>
              <Shield
                size={32}
                style={{ marginRight: '0.5rem', display: 'inline' }}
              />
              KYC & Payments
            </h1>
            <p style={styles.subtitle}>Complete KYC to receive payments</p>
          </div>

          <form onSubmit={handleKycSubmit} style={styles.profileForm}>
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                You can skip this for now and complete later
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>PAN Number (Optional)</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="e.g., AAAAA1234B"
                style={styles.input}
                disabled={isLoading}
                maxLength={10}
              />
              <p style={styles.helpText}>10-character PAN number</p>
            </div>

            {panNumber && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Upload PAN Certificate</label>
                <div style={styles.fileInputWrapper}>
                  <input
                    type="file"
                    onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                    style={styles.fileInput}
                    disabled={isLoading}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <p style={styles.helpText}>PDF, JPG, or PNG (Max 5MB)</p>
                </div>
                {panFile && <p style={styles.fileName}>✓ {panFile.name}</p>}
              </div>
            )}

            <div style={styles.divider} />

            <div style={styles.formGroup}>
              <label style={styles.label}>Account Holder Name (Optional)</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Name as per bank account"
                style={styles.input}
                disabled={isLoading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Account Number (Optional)</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/[^\d]/g, ''))
                }
                placeholder="Your account number"
                style={styles.input}
                disabled={isLoading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>IFSC Code (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => handleIfscChange(e.target.value)}
                  placeholder="e.g., SBIN0001234"
                  style={styles.input}
                  disabled={isLoading}
                  maxLength={11}
                />
                {isValidatingIFSC && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <Loader
                      size={18}
                      color="#f97316"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  </div>
                )}
              </div>
              <p style={styles.helpText}>11-character IFSC code</p>

              {bankDetails && (
                <div style={styles.bankDetailsBox}>
                  <div style={styles.bankDetailsRow}>
                    <span style={styles.bankDetailsLabel}>Bank:</span>
                    <span style={styles.bankDetailsValue}>
                      {bankDetails.BANK}
                    </span>
                  </div>
                  <div style={styles.bankDetailsRow}>
                    <span style={styles.bankDetailsLabel}>Branch:</span>
                    <span style={styles.bankDetailsValue}>
                      {bankDetails.CENTRE}
                    </span>
                  </div>
                  <div style={styles.bankDetailsRow}>
                    <span style={styles.bankDetailsLabel}>City:</span>
                    <span style={styles.bankDetailsValue}>
                      {bankDetails.CITY}
                    </span>
                  </div>
                </div>
              )}

              {ifscError && (
                <div
                  style={{
                    ...styles.errorMessage,
                    marginTop: '0.75rem',
                    marginBottom: 0,
                  }}
                >
                  {ifscError}
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>UPI ID (Optional)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g., yourname@upi"
                style={styles.input}
                disabled={isLoading}
              />
              <p style={styles.helpText}>For quick payments</p>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>

            <button
              type="button"
              onClick={handleKycSkip}
              disabled={isLoading}
              style={styles.skipButton}
            >
              Skip for Now
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep('service-areas')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 7: Menu Setup
  if (onboardingStep === 'menu-setup') {
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

          <div style={styles.header}>
            <h1 style={styles.title}>
              <Utensils
                size={32}
                style={{ marginRight: '0.5rem', display: 'inline' }}
              />
              Menu Setup
            </h1>
            <p style={styles.subtitle}>
              Add your signature dishes {menuItems.length > 0 && `(${menuItems.length} items)`}
            </p>
          </div>

          <form onSubmit={handleMenuSubmit} style={styles.profileForm}>
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                Add at least 1 item to get started
              </p>
            </div>

            <div style={styles.menuForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dish Name *</label>
                <input
                  type="text"
                  value={newMenuItem.name || ''}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, name: e.target.value })
                  }
                  placeholder="e.g., Biryani"
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Price (₹) *</label>
                  <input
                    type="number"
                    value={newMenuItem.price || ''}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g., 250"
                    style={styles.input}
                    disabled={isLoading}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <textarea
                  value={newMenuItem.description || ''}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, description: e.target.value })
                  }
                  placeholder="e.g., Aromatic basmati with tender mutton"
                  style={{
                    ...styles.input,
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Dish Image (Optional)</label>
                <div style={styles.imageUploadWrapper}>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                    disabled={isLoading}
                    accept=".png,.jpg,.jpeg"
                  />
                  <p style={styles.helpText}>PNG or JPG (Max 100KB)</p>
                </div>
                {imagePreview && (
                  <div style={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={styles.imagePreview}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addMenuItem}
                disabled={
                  isLoading ||
                  !newMenuItem.name?.trim() ||
                  !newMenuItem.price
                }
                style={{
                  ...styles.addButton,
                  width: '100%',
                  marginBottom: '1.5rem',
                }}
              >
                <Plus size={18} /> Add Dish
              </button>
            </div>

            {menuItems.length > 0 && (
              <div style={styles.itemsList}>
                {menuItems.map((item) => (
                  <div key={item.id} style={styles.listItem}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={styles.listItemImage}
                      />
                    )}
                    <div style={styles.itemContent}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      {item.description && (
                        <p style={styles.itemDescription}>{item.description}</p>
                      )}
                    </div>
                    <div style={styles.itemPrice}>₹{item.price}</div>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(item.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            {menuItems.length > 0 ? (
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitButton,
                  opacity: isLoading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#ea580c';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f97316';
                }}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleMenuSkip}
                  disabled={isLoading}
                  style={styles.skipButton}
                >
                  Skip for Now
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setOnboardingStep('kyc-payments')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 8: Packages
  if (onboardingStep === 'packages') {
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

          <div style={styles.header}>
            <h1 style={styles.title}>Create Packages</h1>
            <p style={styles.subtitle}>Bundle your dishes into packages</p>
          </div>

          <form onSubmit={handlePackagesSubmit} style={styles.profileForm}>
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                Packages are optional - you can skip this for now
              </p>
            </div>

            {menuItems.length === 0 ? (
              <div
                style={{
                  ...styles.infoBox,
                  backgroundColor: '#fef3c7',
                  borderColor: '#fde68a',
                }}
              >
                <AlertCircle
                  size={20}
                  color="#b45309"
                  style={{ marginRight: '0.75rem' }}
                />
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f' }}>
                  Add menu items first to create packages
                </p>
              </div>
            ) : (
              <div style={styles.menuForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Package Name *</label>
                  <input
                    type="text"
                    value={newPackage.name || ''}
                    onChange={(e) =>
                      setNewPackage({ ...newPackage, name: e.target.value })
                    }
                    placeholder="e.g., Wedding Package"
                    style={styles.input}
                    disabled={isLoading}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Package Type *</label>
                  <div style={styles.radioGroup}>
                    {[
                      { value: 'fixed', label: 'Fixed Package' },
                      { value: 'customizable', label: 'Customizable Package' },
                    ].map((type) => (
                      <label key={type.value} style={styles.radioLabel}>
                        <input
                          type="radio"
                          value={type.value}
                          checked={newPackage.type === type.value}
                          onChange={(e) =>
                            setNewPackage({
                              ...newPackage,
                              type: e.target.value as 'fixed' | 'customizable',
                            })
                          }
                          disabled={isLoading}
                          style={styles.radioInput}
                        />
                        {type.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Min Guests *</label>
                    <input
                      type="number"
                      value={newPackage.minGuests || 10}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          minGuests: parseInt(e.target.value) || 10,
                        })
                      }
                      style={styles.input}
                      disabled={isLoading}
                      min="1"
                    />
                  </div>

                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Max Guests *</label>
                    <input
                      type="number"
                      value={newPackage.maxGuests || 100}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          maxGuests: parseInt(e.target.value) || 100,
                        })
                      }
                      style={styles.input}
                      disabled={isLoading}
                      min="1"
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Min Price (₹) *</label>
                    <input
                      type="number"
                      value={newPackage.minPrice || ''}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          minPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="e.g., 500"
                      style={styles.input}
                      disabled={isLoading}
                      min="0"
                    />
                  </div>

                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Max Price (₹) *</label>
                    <input
                      type="number"
                      value={newPackage.maxPrice || ''}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          maxPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="e.g., 1000"
                      style={styles.input}
                      disabled={isLoading}
                      min="0"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Menu Items *</label>
                  <p style={styles.helpText}>Choose items to include in this package</p>
                  <div style={styles.menuItemsCheckList}>
                    {menuItems.map((item) => (
                      <label key={item.id} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedMenuItemsForPackage.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMenuItemsForPackage([
                                ...selectedMenuItemsForPackage,
                                item.id,
                              ]);
                            } else {
                              setSelectedMenuItemsForPackage(
                                selectedMenuItemsForPackage.filter(
                                  (id) => id !== item.id
                                )
                              );
                            }
                          }}
                          style={styles.checkbox}
                          disabled={isLoading}
                        />
                        <span>{item.name}</span>
                        <span style={{ marginLeft: 'auto', color: '#f97316' }}>
                          ₹{item.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPackage}
                  disabled={
                    isLoading ||
                    !newPackage.name?.trim() ||
                    !newPackage.minGuests ||
                    !newPackage.maxGuests ||
                    !newPackage.minPrice ||
                    !newPackage.maxPrice ||
                    selectedMenuItemsForPackage.length === 0
                  }
                  style={{
                    ...styles.addButton,
                    width: '100%',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Plus size={18} /> Add Package
                </button>
              </div>
            )}

            {packages.length > 0 && (
              <div style={styles.itemsList}>
                {packages.map((pkg) => (
                  <div key={pkg.id} style={styles.listItem}>
                    <div style={styles.itemContent}>
                      <h4 style={styles.itemName}>{pkg.name}</h4>
                      <p style={styles.itemCategory}>
                        {pkg.type === 'fixed' ? 'Fixed' : 'Customizable'} • {pkg.minGuests}-{pkg.maxGuests} guests
                      </p>
                      <p style={styles.itemPrice}>
                        ₹{pkg.minPrice} - ₹{pkg.maxPrice}
                      </p>
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={styles.helpText}>
                          {selectedMenuItemsForPackage.length} item(s)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePackage(pkg.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </button>

            <button
              type="button"
              onClick={handlePackagesSkip}
              disabled={isLoading}
              style={styles.skipButton}
            >
              Skip for Now
            </button>

            <button
              type="button"
              onClick={() => setOnboardingStep('menu-setup')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 9: Completion
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

          <div style={styles.completeContainer}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.title}>You're All Set!</h1>
            <p style={styles.subtitle}>
              Your profile is live. Complete the checklist to maximize visibility
            </p>

            <div style={styles.completionChecklist}>
              <div style={styles.checklistItem}>
                <div style={styles.checklistDone}>✓</div>
                <div>
                  <h4 style={styles.checklistTitle}>Profile Created</h4>
                  <p style={styles.checklistText}>Your caterer profile is live</p>
                </div>
              </div>

              <div style={styles.checklistItem}>
                {selectedCapabilities.length > 0 ? (
                  <>
                    <div style={styles.checklistDone}>✓</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Capabilities Added</h4>
                      <p style={styles.checklistText}>
                        {selectedCapabilities.length} service(s) listed
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.checklistPending}>⏳</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Add Capabilities</h4>
                      <p style={styles.checklistText}>
                        List your services
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div style={styles.checklistItem}>
                {serviceAreas.length > 0 ? (
                  <>
                    <div style={styles.checklistDone}>✓</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Service Areas Added</h4>
                      <p style={styles.checklistText}>
                        {serviceAreas.length} area(s) covered
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.checklistPending}>⏳</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Add Service Areas</h4>
                      <p style={styles.checklistText}>
                        Define your delivery zones
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div style={styles.checklistItem}>
                {menuItems.length > 0 ? (
                  <>
                    <div style={styles.checklistDone}>✓</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Menu Items Added</h4>
                      <p style={styles.checklistText}>
                        {menuItems.length} items added
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.checklistPending}>⏳</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Add Menu Items</h4>
                      <p style={styles.checklistText}>
                        Add 3+ items to appear in search
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div style={styles.checklistItem}>
                {panNumber || upiId ? (
                  <>
                    <div style={styles.checklistDone}>✓</div>
                    <div>
                      <h4 style={styles.checklistTitle}>KYC Started</h4>
                      <p style={styles.checklistText}>Complete to receive payments</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.checklistPending}>⏳</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Complete KYC</h4>
                      <p style={styles.checklistText}>
                        Add PAN/UPI to receive payments
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div style={styles.checklistItem}>
                {packages.length > 0 ? (
                  <>
                    <div style={styles.checklistDone}>✓</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Packages Created</h4>
                      <p style={styles.checklistText}>
                        {packages.length} package(s) created
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.checklistPending}>⏳</div>
                    <div>
                      <h4 style={styles.checklistTitle}>Create Packages</h4>
                      <p style={styles.checklistText}>
                        Bundle dishes for better conversions
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              onClick={handleCompleteOnboarding}
              disabled={isLoading}
              style={{
                ...styles.ctaButton,
                marginTop: '2rem',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 16px rgba(249, 115, 22, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? 'Starting...' : 'Go to Dashboard'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Styles object
const styles: { [key: string]: React.CSSProperties } = {
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
  pincodeInputGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 50px',
    gap: '0.75rem',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
    marginTop: '1rem',
  } as React.CSSProperties,
  eventTag: {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '2px solid',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  eventTagActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#667eea',
    color: '#667eea',
  } as React.CSSProperties,
  eventTagInactive: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    color: '#6b7280',
  } as React.CSSProperties,
  capabilitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  } as React.CSSProperties,
  capabilityCard: {
    padding: '1.25rem',
    borderRadius: '0.75rem',
    border: '2px solid',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left' as const,
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  capabilityCardActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#667eea',
    color: '#667eea',
  } as React.CSSProperties,
  capabilityCardInactive: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    color: '#6b7280',
  } as React.CSSProperties,
  serviceAreasList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginTop: '1rem',
  } as React.CSSProperties,
  serviceAreaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  areaContent: {
    flex: 1,
  } as React.CSSProperties,
  areaTitle: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  } as React.CSSProperties,
  areaSubtitle: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.75rem',
    color: '#6b7280',
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
  skipButton: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
    fontFamily: 'inherit',
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
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
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
  fileInputWrapper: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center' as const,
    backgroundColor: '#fafafa',
  } as React.CSSProperties,
  imageUploadWrapper: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center' as const,
    backgroundColor: '#fafafa',
  } as React.CSSProperties,
  imagePreviewContainer: {
    marginTop: '1rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  imagePreview: {
    maxWidth: '150px',
    maxHeight: '150px',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
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
  resendButton: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  bankDetailsBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #dcfce7',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginTop: '0.75rem',
  } as React.CSSProperties,
  bankDetailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #dcfce7',
  } as React.CSSProperties,
  bankDetailsLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4b5563',
    minWidth: '80px',
  } as React.CSSProperties,
  bankDetailsValue: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#15803d',
    textAlign: 'right' as const,
    flex: 1,
    paddingLeft: '0.5rem',
  } as React.CSSProperties,
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '1.5rem 0',
  } as React.CSSProperties,
  menuForm: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  listItemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '0.5rem',
    objectFit: 'cover' as const,
  } as React.CSSProperties,
  itemContent: {
    flex: 1,
  } as React.CSSProperties,
  itemName: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  } as React.CSSProperties,
  itemCategory: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.75rem',
    color: '#6b7280',
  } as React.CSSProperties,
  itemDescription: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.75rem',
    color: '#6b7280',
    lineHeight: '1.3',
  } as React.CSSProperties,
  itemPrice: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#f97316',
    minWidth: '60px',
    textAlign: 'right' as const,
  } as React.CSSProperties,
  deleteButton: {
    padding: '0.5rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  menuItemsCheckList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginTop: '1rem',
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
  completionChecklist: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    textAlign: 'left' as const,
    marginTop: '2rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  checklistItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
  } as React.CSSProperties,
  checklistDone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#dcfce7',
    color: '#10b981',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    flexShrink: 0,
  } as React.CSSProperties,
  checklistPending: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#fef3c7',
    color: '#f59e0b',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    flexShrink: 0,
  } as React.CSSProperties,
  checklistTitle: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  } as React.CSSProperties,
  checklistText: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.75rem',
    color: '#6b7280',
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
};