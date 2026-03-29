'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ChefHat,
  Users,
  Mail,
  Phone,
  ArrowRight,
  Check,
  MapPin,
  FileText,
  DollarSign,
  Shield,
  CreditCard,
  Clock,
  AlertCircle,
  Utensils,
} from 'lucide-react';

type UserRole = 'customer' | 'caterer';
type OnboardingStep =
  | 'role-select'
  | 'verify-phone'
  | 'profile'
  | 'address'
  | 'business-details'
  | 'kyc-compliance'
  | 'payment-setup'
  | 'operations-availability'
  | 'cancellation-policies'
  | 'service-details'
  | 'complete';

type ServiceRadius = 'city-wide' | 'specific-radius';
type EventType =
  | 'wedding'
  | 'corporate'
  | 'birthday'
  | 'anniversary'
  | 'engagement'
  | 'other';
type ServiceType =
  | 'full-service'
  | 'buffet'
  | 'plated'
  | 'cocktail'
  | 'dessert';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>('role-select');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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

  // Payment Setup
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  // Operations Availability
  const [kitchenType, setKitchenType] = useState('');
  const [operatingDays, setOperatingDays] = useState<string[]>([]);
  const [operatingHoursStart, setOperatingHoursStart] = useState('09:00');
  const [operatingHoursEnd, setOperatingHoursEnd] = useState('22:00');

  // Cancellation Policies
  const [cancellationPolicySummary, setCancellationPolicySummary] =
    useState('');
  const [advanceNoticeRequired, setAdvanceNoticeRequired] = useState('7');

  // Service Details
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [minGuests, setMinGuests] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [priceRangeMin, setPriceRangeMin] = useState('');
  const [priceRangeMax, setPriceRangeMax] = useState('');
  const [serviceRadius, setServiceRadius] =
    useState<ServiceRadius>('city-wide');
  const [serviceRadius_km, setServiceRadius_km] = useState('');

  // Track if initial redirect check has been done
  const initialRedirectChecked = useRef(false);

  const COUNTRY_CODES = [
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+39', country: 'Italy' },
  ];

  const CUISINE_TYPES = [
    'Indian',
    'Chinese',
    'Italian',
    'Continental',
    'North Indian',
    'South Indian',
    'Mughlai',
    'Asian Fusion',
    'Multi-Cuisine',
    'Other',
  ];

  const KITCHEN_TYPES = [
    'Commercial Kitchen',
    'Home Kitchen',
    'Cloud Kitchen',
    'Central Commissary',
    'Rented Space',
  ];

  const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const EVENT_TYPES: { value: EventType; label: string }[] = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate Events' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'other', label: 'Other Events' },
  ];

  const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
    { value: 'full-service', label: 'Full Service (Setup & Service)' },
    { value: 'buffet', label: 'Buffet Service' },
    { value: 'plated', label: 'Plated Dinner' },
    { value: 'cocktail', label: 'Cocktail Service' },
    { value: 'dessert', label: 'Dessert & Bakery' },
  ];

  const getStepNumber = (): string => {
    if (selectedRole === 'customer') {
      const customerSteps: OnboardingStep[] = [
        'role-select',
        'verify-phone',
        'profile',
        'complete',
      ];
      return `${customerSteps.indexOf(onboardingStep) + 1} of ${customerSteps.length}`;
    } else {
      const catererSteps: OnboardingStep[] = [
        'role-select',
        'verify-phone',
        'profile',
        'address',
        'business-details',
        'kyc-compliance',
        'payment-setup',
        'operations-availability',
        'cancellation-policies',
        'service-details',
        'complete',
      ];
      return `${catererSteps.indexOf(onboardingStep) + 1} of ${catererSteps.length}`;
    }
  };

  const getProgressPercentage = (): number => {
    if (selectedRole === 'customer') {
      const customerSteps: OnboardingStep[] = [
        'role-select',
        'verify-phone',
        'profile',
        'complete',
      ];
      return (
        ((customerSteps.indexOf(onboardingStep) + 1) / customerSteps.length) *
        100
      );
    } else {
      const catererSteps: OnboardingStep[] = [
        'role-select',
        'verify-phone',
        'profile',
        'address',
        'business-details',
        'kyc-compliance',
        'payment-setup',
        'operations-availability',
        'cancellation-policies',
        'service-details',
        'complete',
      ];
      return (
        ((catererSteps.indexOf(onboardingStep) + 1) / catererSteps.length) * 100
      );
    }
  };

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

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFullName(session?.user?.name || '');
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    try {
      setOtpSent(true);
      setError('');
    } catch (err) {
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
      setOnboardingStep('profile');
      setOtp('');
      setOtpSent(false);
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fullName.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

    if (selectedRole === 'caterer' && !businessName.trim()) {
      setError('Business name is required');
      setIsLoading(false);
      return;
    }

    try {
      if (selectedRole === 'caterer') {
        setOnboardingStep('address');
      } else {
        setOnboardingStep('complete');
      }
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError('All address fields are required');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('business-details');
    } catch (err) {
      setError('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!cuisineType || !yearsOfExperience || !teamSize) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('kyc-compliance');
    } catch (err) {
      setError('Failed to save business details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycComplianceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!panNumber.trim()) {
      setError('PAN number is required');
      setIsLoading(false);
      return;
    }

    if (!panFile) {
      setError('PAN certificate document is required');
      setIsLoading(false);
      return;
    }

    if (!/^[A-Z0-9]{10}$/.test(panNumber.toUpperCase())) {
      setError('Please enter a valid 10-character PAN number');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('payment-setup');
    } catch (err) {
      setError('Failed to save KYC details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!accountNumber.trim() || !ifscCode.trim() || !upiId.trim()) {
      setError('Account number, IFSC code, and UPI ID are required');
      setIsLoading(false);
      return;
    }

    if (!bankName.trim() || !accountHolderName.trim()) {
      setError('Bank name and account holder name are required');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('operations-availability');
    } catch (err) {
      setError('Failed to save payment details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOperationsAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!kitchenType) {
      setError('Please select a kitchen type');
      setIsLoading(false);
      return;
    }

    if (operatingDays.length === 0) {
      setError('Please select at least one operating day');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('cancellation-policies');
    } catch (err) {
      setError('Failed to save operations details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancellationPoliciesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!cancellationPolicySummary.trim() || !advanceNoticeRequired) {
      setError('Please provide cancellation policy details');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('service-details');
    } catch (err) {
      setError('Failed to save cancellation policies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (selectedEventTypes.length === 0 || selectedServiceTypes.length === 0) {
      setError('Please select at least one event type and service type');
      setIsLoading(false);
      return;
    }

    if (!minGuests || !maxGuests || !priceRangeMin || !priceRangeMax) {
      setError('Please fill in all guest and price range fields');
      setIsLoading(false);
      return;
    }

    if (serviceRadius === 'specific-radius' && !serviceRadius_km) {
      setError('Please enter service radius in kilometers');
      setIsLoading(false);
      return;
    }

    try {
      setOnboardingStep('complete');
    } catch (err) {
      setError('Failed to save service details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);

    if (!selectedRole) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    try {
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          role: selectedRole,
          isOnboardingCompleted: true,
          isOnboardingPending: false,
          onboarding: {
            status: 'completed',
            selectedRole: selectedRole,
          },
        },
      });

      setIsRedirecting(true);
      router.push(`/${selectedRole}/dashboard`);
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

  // Step 1: Role Selection
  if (onboardingStep === 'role-select') {
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
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <div style={styles.header}>
            <h1 style={styles.title}>Welcome to CaterHub! 👋</h1>
            <p style={styles.subtitle}>Choose how you want to use CaterHub</p>
          </div>

          <div style={styles.userInfoBox}>
            <h3 style={styles.userInfoTitle}>Your Account</h3>
            <div style={styles.userInfoGrid}>
              <div style={styles.userInfoItem}>
                <Mail size={18} color="#667eea" />
                <div>
                  <p style={styles.userInfoLabel}>Email</p>
                  <p style={styles.userInfoValue}>{session.user.email}</p>
                </div>
              </div>

              {session.user.phone && (
                <div style={styles.userInfoItem}>
                  <Phone size={18} color="#10b981" />
                  <div>
                    <p style={styles.userInfoLabel}>Phone</p>
                    <p style={styles.userInfoValue}>{session.user.phone}</p>
                  </div>
                </div>
              )}

              <div style={styles.userInfoItem}>
                <Users size={18} color="#f59e0b" />
                <div>
                  <p style={styles.userInfoLabel}>Name</p>
                  <p style={styles.userInfoValue}>
                    {session.user.name || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rolesContainer}>
            <div
              onClick={() => handleRoleSelect('customer')}
              style={{
                ...styles.roleCard,
                borderColor:
                  selectedRole === 'customer' ? '#667eea' : '#e5e7eb',
                backgroundColor:
                  selectedRole === 'customer' ? '#f0f4ff' : 'white',
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== 'customer') {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== 'customer') {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={styles.roleIconContainer}>
                <Users
                  size={48}
                  color={selectedRole === 'customer' ? '#667eea' : '#9ca3af'}
                  strokeWidth={1.5}
                />
              </div>
              <h3 style={styles.roleTitle}>Order Catering</h3>
              <p style={styles.roleDescription}>
                Browse and book catering services from top caterers in your area
              </p>
              <ul style={styles.roleFeatures}>
                <li>✓ Browse catering menus</li>
                <li>✓ Book events easily</li>
                <li>✓ Track orders</li>
                <li>✓ Leave reviews</li>
              </ul>
              {selectedRole === 'customer' && (
                <div style={styles.selectedBadge}>
                  <Check size={16} /> Selected
                </div>
              )}
            </div>

            <div
              onClick={() => handleRoleSelect('caterer')}
              style={{
                ...styles.roleCard,
                borderColor: selectedRole === 'caterer' ? '#f97316' : '#e5e7eb',
                backgroundColor:
                  selectedRole === 'caterer' ? '#fff7ed' : 'white',
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== 'caterer') {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== 'caterer') {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={styles.roleIconContainer}>
                <ChefHat
                  size={48}
                  color={selectedRole === 'caterer' ? '#f97316' : '#9ca3af'}
                  strokeWidth={1.5}
                />
              </div>
              <h3 style={styles.roleTitle}>Become a Caterer</h3>
              <p style={styles.roleDescription}>
                List your catering business and reach customers across the
                platform
              </p>
              <ul style={styles.roleFeatures}>
                <li>✓ Create business profile</li>
                <li>✓ Manage menus & pricing</li>
                <li>✓ Receive bookings</li>
                <li>✓ Grow your business</li>
              </ul>
              {selectedRole === 'caterer' && (
                <div style={styles.selectedBadge}>
                  <Check size={16} /> Selected
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (session?.user && !session.user.phone) {
                setOnboardingStep('verify-phone');
              } else {
                setOnboardingStep('profile');
              }
            }}
            style={styles.ctaButton}
            disabled={isLoading}
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
            {isLoading ? 'Setting up...' : 'Continue'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Phone Verification
  if (onboardingStep === 'verify-phone') {
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
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <div style={styles.header}>
            <h1 style={styles.title}>Verify Your Phone</h1>
            <p style={styles.subtitle}>
              {selectedRole === 'caterer'
                ? 'We need to verify your business phone number'
                : 'Complete your profile setup'}
            </p>
          </div>

          <div style={styles.userInfoBox}>
            <div style={styles.userInfoItem}>
              <Mail size={18} color="#667eea" />
              <div>
                <p style={styles.userInfoLabel}>Email (Verified)</p>
                <p style={styles.userInfoValue}>{session.user.email}</p>
              </div>
            </div>
          </div>

          <div style={styles.verificationForm}>
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {selectedRole === 'caterer'
                      ? 'Business Phone Number'
                      : 'Phone Number'}
                  </label>
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
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/[^\d]/g, ''))
                      }
                      placeholder="10 digits"
                      style={styles.input}
                      maxLength={15}
                      disabled={isLoading}
                    />
                  </div>
                  <p style={styles.helpText}>
                    Enter phone number without country code
                  </p>
                </div>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <button
                  type="submit"
                  disabled={isLoading || !phone}
                  style={{
                    ...styles.submitButton,
                    opacity: isLoading || !phone ? 0.6 : 1,
                    cursor: isLoading || !phone ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && phone) {
                      e.currentTarget.style.backgroundColor = '#ea580c';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setOnboardingStep('role-select')}
                  style={styles.backButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f4ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  Back
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Enter OTP</label>
                  <p style={styles.otpSentText}>
                    We've sent a verification code to {countryCode} {phone}
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^\d]/g, '')
                        .slice(0, 6);
                      setOtp(value);
                    }}
                    placeholder="000000"
                    style={{
                      ...styles.input,
                      fontSize: '1.5rem',
                      letterSpacing: '0.25rem',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  style={{
                    ...styles.submitButton,
                    opacity: isLoading || otp.length !== 6 ? 0.6 : 1,
                    cursor:
                      isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && otp.length === 6) {
                      e.currentTarget.style.backgroundColor = '#ea580c';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f4ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  Change Phone Number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Profile Setup
  if (onboardingStep === 'profile') {
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
              {selectedRole === 'caterer'
                ? 'Business Information'
                : 'Complete Your Profile'}
            </h1>
            <p style={styles.subtitle}>
              {selectedRole === 'caterer'
                ? 'Tell us about your catering business'
                : 'Help us personalize your experience'}
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} style={styles.profileForm}>
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

            {selectedRole === 'caterer' && (
              <>
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
                  <label style={styles.label}>Business Description</label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Brief description of your catering services"
                    style={{
                      ...styles.input,
                      minHeight: '100px',
                      resize: 'vertical',
                    }}
                    disabled={isLoading}
                    rows={4}
                  />
                  <p style={styles.helpText}>
                    Share what makes your business special
                  </p>
                </div>
              </>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={
                isLoading ||
                !fullName.trim() ||
                (selectedRole === 'caterer' && !businessName.trim())
              }
              style={{
                ...styles.submitButton,
                opacity:
                  isLoading ||
                  !fullName.trim() ||
                  (selectedRole === 'caterer' && !businessName.trim())
                    ? 0.6
                    : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && fullName.trim()) {
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
              onClick={() => setOnboardingStep('verify-phone')}
              disabled={isLoading}
              style={styles.backButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4ff';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Address (Caterer Only)
  if (onboardingStep === 'address') {
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
                width: `${getProgressPercentage()}%`,
              }}
            />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <div style={styles.header}>
            <h1 style={styles.title}>Business Address</h1>
            <p style={styles.subtitle}>
              Where is your catering kitchen located?
            </p>
          </div>

          <form onSubmit={handleAddressSubmit} style={styles.profileForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Street Address *</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street address"
                style={styles.input}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>State *</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Zip Code *</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Zip code"
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={
                isLoading ||
                !street.trim() ||
                !city.trim() ||
                !state.trim() ||
                !zipCode.trim()
              }
              style={{
                ...styles.submitButton,
                opacity: isLoading || !street.trim() ? 0.6 : 1,
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
              onClick={() => setOnboardingStep('profile')}
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

  // Step 5: Business Details (Caterer Only)
  if (onboardingStep === 'business-details') {
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
            <p style={styles.subtitle}>
              Tell us more about your catering services
            </p>
          </div>

          <form
            onSubmit={handleBusinessDetailsSubmit}
            style={styles.profileForm}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Cuisine Type *</label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                style={styles.input}
                disabled={isLoading}
                required
              >
                <option value="">Select cuisine type</option>
                {CUISINE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Years of Experience *</label>
              <input
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="Years of experience"
                style={styles.input}
                disabled={isLoading}
                min="0"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Team Size *</label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="Number of team members"
                style={styles.input}
                disabled={isLoading}
                min="1"
                required
              />
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={
                isLoading || !cuisineType || !yearsOfExperience || !teamSize
              }
              style={{
                ...styles.submitButton,
                opacity: isLoading || !cuisineType ? 0.6 : 1,
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
              onClick={() => setOnboardingStep('address')}
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

  // Step 6: KYC & Compliance (Caterer Only)
  if (onboardingStep === 'kyc-compliance') {
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
              KYC & Compliance
            </h1>
            <p style={styles.subtitle}>
              Verify your business credentials for trust and compliance
            </p>
          </div>

          <form onSubmit={handleKycComplianceSubmit} style={styles.profileForm}>
            {/* PAN Card - Required */}
            <div style={styles.complianceSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.requiredBadge}>Required</span>
                PAN Number
              </h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>PAN Number (10 characters) *</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., AAAAA1234B"
                  style={styles.input}
                  disabled={isLoading}
                  maxLength={10}
                  required
                />
                <p style={styles.helpText}>
                  Enter your 10-character PAN number (e.g., AAAAA1234B)
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Upload PAN Certificate *</label>
                <div style={styles.fileInputWrapper}>
                  <input
                    type="file"
                    onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                    style={styles.fileInput}
                    disabled={isLoading}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <p style={styles.helpText}>PDF, JPG, or PNG (Max 5MB)</p>
                </div>
                {panFile && <p style={styles.fileName}>✓ {panFile.name}</p>}
              </div>
            </div>

            {/* Aadhar Card - Optional */}
            <div style={styles.complianceSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.optionalBadge}>Optional</span>
                Aadhar Card
              </h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Aadhar Number (12 digits)</label>
                <input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) =>
                    setAadharNumber(e.target.value.replace(/[^\d]/g, ''))
                  }
                  placeholder="e.g., 1234 5678 9012"
                  style={styles.input}
                  disabled={isLoading}
                  maxLength={12}
                />
                <p style={styles.helpText}>
                  Enter your 12-digit Aadhar number (digits only)
                </p>
              </div>

              {aadharNumber && (
                <>
                  <div style={styles.formRow}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Aadhar Front</label>
                      <div style={styles.fileInputWrapper}>
                        <input
                          type="file"
                          onChange={(e) =>
                            setAadharFront(e.target.files?.[0] || null)
                          }
                          style={styles.fileInput}
                          disabled={isLoading}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <p style={styles.helpText}>Front side (Max 5MB)</p>
                      </div>
                      {aadharFront && (
                        <p style={styles.fileName}>✓ {aadharFront.name}</p>
                      )}
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Aadhar Back</label>
                      <div style={styles.fileInputWrapper}>
                        <input
                          type="file"
                          onChange={(e) =>
                            setAadharBack(e.target.files?.[0] || null)
                          }
                          style={styles.fileInput}
                          disabled={isLoading}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <p style={styles.helpText}>Back side (Max 5MB)</p>
                      </div>
                      {aadharBack && (
                        <p style={styles.fileName}>✓ {aadharBack.name}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FSSAI License - Optional */}
            <div style={styles.complianceSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.optionalBadge}>Optional</span>
                FSSAI License
              </h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>FSSAI License Number</label>
                <input
                  type="text"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., 10213022000001"
                  style={styles.input}
                  disabled={isLoading}
                />
                <p style={styles.helpText}>
                  Your FSSAI license number (if applicable)
                </p>
              </div>

              {fssaiNumber && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Upload FSSAI Certificate</label>
                  <div style={styles.fileInputWrapper}>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFssaiFile(e.target.files?.[0] || null)
                      }
                      style={styles.fileInput}
                      disabled={isLoading}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p style={styles.helpText}>PDF, JPG, or PNG (Max 5MB)</p>
                  </div>
                  {fssaiFile && (
                    <p style={styles.fileName}>✓ {fssaiFile.name}</p>
                  )}
                </div>
              )}
            </div>

            {/* GST - Optional */}
            <div style={styles.complianceSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.optionalBadge}>Optional</span>
                GST Details
              </h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>GST Number (15 digits)</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., 18AABCU9603R1Z5"
                  style={styles.input}
                  disabled={isLoading}
                  maxLength={15}
                />
                <p style={styles.helpText}>
                  Enter your 15-digit GST number (if applicable)
                </p>
              </div>

              {gstNumber && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Upload GST Certificate</label>
                  <div style={styles.fileInputWrapper}>
                    <input
                      type="file"
                      onChange={(e) => setGstFile(e.target.files?.[0] || null)}
                      style={styles.fileInput}
                      disabled={isLoading}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p style={styles.helpText}>PDF, JPG, or PNG (Max 5MB)</p>
                  </div>
                  {gstFile && <p style={styles.fileName}>✓ {gstFile.name}</p>}
                </div>
              )}
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !panNumber.trim() || !panFile}
              style={{
                ...styles.submitButton,
                opacity: isLoading || !panNumber.trim() || !panFile ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && panNumber.trim() && panFile) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
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

  // Step 7: Payment Setup
  if (onboardingStep === 'payment-setup') {
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
              <CreditCard
                size={32}
                style={{ marginRight: '0.5rem', display: 'inline' }}
              />
              Payment Setup
            </h1>
            <p style={styles.subtitle}>
              Add your bank details for easy payments
            </p>
          </div>

          <form onSubmit={handlePaymentSetupSubmit} style={styles.profileForm}>
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                Your payment details are secured and encrypted
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Bank Name *</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., State Bank of India"
                style={styles.input}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Account Holder Name *</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Name as per bank account"
                style={styles.input}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Account Number *</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/[^\d]/g, ''))
                }
                placeholder="Your account number"
                style={styles.input}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>IFSC Code *</label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g., SBIN0001234"
                style={styles.input}
                disabled={isLoading}
                maxLength={11}
                required
              />
              <p style={styles.helpText}>11-character IFSC code</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>UPI ID *</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g., yourname@upi"
                style={styles.input}
                disabled={isLoading}
                required
              />
              <p style={styles.helpText}>For receiving quick payments</p>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={
                isLoading ||
                !accountNumber.trim() ||
                !ifscCode.trim() ||
                !upiId.trim()
              }
              style={{
                ...styles.submitButton,
                opacity: isLoading || !accountNumber.trim() ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && accountNumber.trim()) {
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
              onClick={() => setOnboardingStep('kyc-compliance')}
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

  // Step 8: Operations Availability
  if (onboardingStep === 'operations-availability') {
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
              <Clock
                size={32}
                style={{ marginRight: '0.5rem', display: 'inline' }}
              />
              Operations Availability
            </h1>
            <p style={styles.subtitle}>
              Set your kitchen type and operating hours
            </p>
          </div>

          <form
            onSubmit={handleOperationsAvailabilitySubmit}
            style={styles.profileForm}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Kitchen Type *</label>
              <select
                value={kitchenType}
                onChange={(e) => setKitchenType(e.target.value)}
                style={styles.input}
                disabled={isLoading}
                required
              >
                <option value="">Select kitchen type</option>
                {KITCHEN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Operating Days *</label>
              <div style={styles.checkboxGroup}>
                {DAYS_OF_WEEK.map((day) => (
                  <label key={day} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={operatingDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setOperatingDays([...operatingDays, day]);
                        } else {
                          setOperatingDays(
                            operatingDays.filter((d) => d !== day)
                          );
                        }
                      }}
                      style={styles.checkbox}
                      disabled={isLoading}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Operating Hours Start *</label>
                <input
                  type="time"
                  value={operatingHoursStart}
                  onChange={(e) => setOperatingHoursStart(e.target.value)}
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Operating Hours End *</label>
                <input
                  type="time"
                  value={operatingHoursEnd}
                  onChange={(e) => setOperatingHoursEnd(e.target.value)}
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !kitchenType || operatingDays.length === 0}
              style={{
                ...styles.submitButton,
                opacity: isLoading || !kitchenType ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && kitchenType) {
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
              onClick={() => setOnboardingStep('payment-setup')}
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

  // Step 9: Cancellation Policies
  if (onboardingStep === 'cancellation-policies') {
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
              <AlertCircle
                size={32}
                style={{ marginRight: '0.5rem', display: 'inline' }}
              />
              Cancellation Policies
            </h1>
            <p style={styles.subtitle}>
              Define your cancellation and refund policies
            </p>
          </div>

          <form
            onSubmit={handleCancellationPoliciesSubmit}
            style={styles.profileForm}
          >
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#dc2626"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#7f1d1d' }}>
                Clear policies build trust with your customers
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cancellation Policy Summary *</label>
              <textarea
                value={cancellationPolicySummary}
                onChange={(e) => setCancellationPolicySummary(e.target.value)}
                placeholder="Describe your cancellation and refund policies (e.g., 100% refund if cancelled 30 days before event, 50% refund if cancelled 15 days before, no refund if cancelled less than 15 days before)"
                style={{
                  ...styles.input,
                  minHeight: '120px',
                  resize: 'vertical',
                }}
                disabled={isLoading}
                rows={5}
                required
              />
              <p style={styles.helpText}>
                Be clear about refund amounts and timelines
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Advance Notice Required (Days) *
              </label>
              <input
                type="number"
                value={advanceNoticeRequired}
                onChange={(e) => setAdvanceNoticeRequired(e.target.value)}
                placeholder="Minimum days notice required for cancellation"
                style={styles.input}
                disabled={isLoading}
                min="1"
                required
              />
              <p style={styles.helpText}>
                Minimum notice period for cancellations
              </p>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !cancellationPolicySummary.trim()}
              style={{
                ...styles.submitButton,
                opacity:
                  isLoading || !cancellationPolicySummary.trim() ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && cancellationPolicySummary.trim()) {
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
              onClick={() => setOnboardingStep('operations-availability')}
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

  // Step 10: Service Details
  if (onboardingStep === 'service-details') {
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
              Service Details
            </h1>
            <p style={styles.subtitle}>
              Describe your catering services and pricing
            </p>
          </div>

          <form
            onSubmit={handleServiceDetailsSubmit}
            style={styles.profileForm}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Event Types You Can Cater *</label>
              <div style={styles.checkboxGroup}>
                {EVENT_TYPES.map((event) => (
                  <label key={event.value} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedEventTypes.includes(event.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEventTypes([
                            ...selectedEventTypes,
                            event.value,
                          ]);
                        } else {
                          setSelectedEventTypes(
                            selectedEventTypes.filter(
                              (et) => et !== event.value
                            )
                          );
                        }
                      }}
                      style={styles.checkbox}
                      disabled={isLoading}
                    />
                    {event.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Service Types Offered *</label>
              <div style={styles.checkboxGroup}>
                {SERVICE_TYPES.map((service) => (
                  <label key={service.value} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedServiceTypes.includes(service.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServiceTypes([
                            ...selectedServiceTypes,
                            service.value,
                          ]);
                        } else {
                          setSelectedServiceTypes(
                            selectedServiceTypes.filter(
                              (st) => st !== service.value
                            )
                          );
                        }
                      }}
                      style={styles.checkbox}
                      disabled={isLoading}
                    />
                    {service.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Minimum Guests *</label>
                <input
                  type="number"
                  value={minGuests}
                  onChange={(e) => setMinGuests(e.target.value)}
                  placeholder="Minimum guests"
                  style={styles.input}
                  disabled={isLoading}
                  min="1"
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Maximum Guests *</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  placeholder="Maximum guests"
                  style={styles.input}
                  disabled={isLoading}
                  min="1"
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>
                  Price Range - Min (₹/person) *
                </label>
                <input
                  type="number"
                  value={priceRangeMin}
                  onChange={(e) => setPriceRangeMin(e.target.value)}
                  placeholder="Minimum price per person"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>
                  Price Range - Max (₹/person) *
                </label>
                <input
                  type="number"
                  value={priceRangeMax}
                  onChange={(e) => setPriceRangeMax(e.target.value)}
                  placeholder="Maximum price per person"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Service Radius *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="city-wide"
                    checked={serviceRadius === 'city-wide'}
                    onChange={(e) =>
                      setServiceRadius(e.target.value as ServiceRadius)
                    }
                    disabled={isLoading}
                    style={styles.radioInput}
                  />
                  City-wide Service
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="specific-radius"
                    checked={serviceRadius === 'specific-radius'}
                    onChange={(e) =>
                      setServiceRadius(e.target.value as ServiceRadius)
                    }
                    disabled={isLoading}
                    style={styles.radioInput}
                  />
                  Specific Radius
                </label>
              </div>
            </div>

            {serviceRadius === 'specific-radius' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Service Radius (km) *</label>
                <input
                  type="number"
                  value={serviceRadius_km}
                  onChange={(e) => setServiceRadius_km(e.target.value)}
                  placeholder="e.g., 15"
                  style={styles.input}
                  disabled={isLoading}
                  min="1"
                  required
                />
              </div>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={
                isLoading ||
                selectedEventTypes.length === 0 ||
                selectedServiceTypes.length === 0
              }
              style={{
                ...styles.submitButton,
                opacity: isLoading || selectedEventTypes.length === 0 ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && selectedEventTypes.length > 0) {
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
              onClick={() => setOnboardingStep('cancellation-policies')}
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

  // Step 11: Complete
  if (onboardingStep === 'complete') {
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
            <div style={{ ...styles.progressBar, width: '100%' }} />
          </div>

          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>{getStepNumber()}</span>
            <span style={styles.stepDot}>●</span>
          </div>

          <div style={styles.completeContainer}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.title}>All Set! 🎉</h1>
            <p style={styles.subtitle}>
              {selectedRole === 'caterer'
                ? "Your complete catering business profile is ready. Let's get you started!"
                : 'Welcome to CaterHub! Ready to explore amazing catering options?'}
            </p>

            <div style={styles.summaryBox}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Name</span>
                <span style={styles.summaryValue}>{fullName}</span>
              </div>

              {selectedRole === 'caterer' && (
                <>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Business</span>
                    <span style={styles.summaryValue}>{businessName}</span>
                  </div>

                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Cuisine</span>
                    <span style={styles.summaryValue}>{cuisineType}</span>
                  </div>

                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Kitchen Type</span>
                    <span style={styles.summaryValue}>{kitchenType}</span>
                  </div>

                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Guest Range</span>
                    <span style={styles.summaryValue}>
                      {minGuests} - {maxGuests} guests
                    </span>
                  </div>

                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Price Range</span>
                    <span style={styles.summaryValue}>
                      ₹{priceRangeMin} - ₹{priceRangeMax}/person
                    </span>
                  </div>

                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Service Radius</span>
                    <span style={styles.summaryValue}>
                      {serviceRadius === 'city-wide'
                        ? 'City-wide'
                        : `${serviceRadius_km} km`}
                    </span>
                  </div>

                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>UPI ID</span>
                    <span style={styles.summaryValue}>{upiId}</span>
                  </div>
                </>
              )}

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Email</span>
                <span style={styles.summaryValue}>{session.user.email}</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Phone</span>
                <span style={styles.summaryValue}>
                  {countryCode} {phone}
                </span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Role</span>
                <span
                  style={{
                    ...styles.summaryValue,
                    textTransform: 'capitalize',
                    backgroundColor:
                      selectedRole === 'caterer' ? '#fff7ed' : '#f0f4ff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    color: selectedRole === 'caterer' ? '#f97316' : '#667eea',
                    fontWeight: 'bold',
                    display: 'inline-block',
                  }}
                >
                  {selectedRole === 'caterer' ? 'Caterer' : 'Customer'}
                </span>
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
              {isLoading
                ? 'Completing setup...'
                : `Go to ${selectedRole === 'caterer' ? 'Caterer' : 'Customer'} Dashboard`}
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
};
