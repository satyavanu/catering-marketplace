'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChefHat, Users, Mail, Phone, ArrowRight, Check } from 'lucide-react';

type UserRole = 'customer' | 'caterer';
type OnboardingStep = 'role-select' | 'verify-phone' | 'profile' | 'complete';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('role-select');
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

  // Redirect if onboarding already completed - ONLY on initial mount
  useEffect(() => {
    // Only check once on initial mount
    if (initialRedirectChecked.current) {
      return;
    }

    if (status === 'loading' || !mounted || !session?.user) {
      return;
    }

    // Mark that we've done the initial check
    initialRedirectChecked.current = true;

    // If user already has a role and onboarding is completed, redirect to dashboard
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

    // If user logged in via social and hasn't verified phone, show phone verification
    if (session?.user && !session.user.phone) {
      setOnboardingStep('verify-phone');
    } else {
      // Phone already verified, proceed to profile
      setOnboardingStep('profile');
    }
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
      // TODO: Replace with actual OTP API call
      // const response = await fetch('/api/auth/send-otp-phone', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: `${countryCode}${phone}` }),
      // });

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
      // TODO: Replace with actual OTP verification API call
      // const response = await fetch('/api/auth/verify-otp-phone', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: `${countryCode}${phone}`, otp }),
      // });

      // After phone verification, proceed to profile
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
      // TODO: Replace with actual profile update API call
      // const response = await fetch('/api/auth/complete-profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fullName,
      //     businessName: selectedRole === 'caterer' ? businessName : null,
      //     businessDescription: selectedRole === 'caterer' ? businessDescription : null,
      //     phone: `${countryCode}${phone}`,
      //     role: selectedRole,
      //   }),
      // });

      setOnboardingStep('complete');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
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
      // TODO: Replace with actual API call to mark onboarding as complete
      // const response = await fetch('/api/auth/complete-onboarding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     role: selectedRole,
      //     fullName,
      //     businessName: selectedRole === 'caterer' ? businessName : null,
      //     businessDescription: selectedRole === 'caterer' ? businessDescription : null,
      //     phone: `${countryCode}${phone}`,
      //   }),
      // });

      // Update session with new role and onboarding status
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

      // Redirect to dashboard based on selected role
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

  // Redirect if already onboarded
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
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '25%' }} />
          </div>

          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>Step 1 of 4</span>
            <span style={styles.stepDot}>●</span>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome to CaterHub! 👋</h1>
            <p style={styles.subtitle}>Choose how you want to use CaterHub</p>
          </div>

          {/* User Info Display */}
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
                  <p style={styles.userInfoValue}>{session.user.name || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div style={styles.rolesContainer}>
            {/* Customer Card */}
            <div
              onClick={() => handleRoleSelect('customer')}
              style={{
                ...styles.roleCard,
                borderColor: selectedRole === 'customer' ? '#667eea' : '#e5e7eb',
                backgroundColor: selectedRole === 'customer' ? '#f0f4ff' : 'white',
                cursor: 'pointer',
                transform: selectedRole === 'customer' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== 'customer') {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
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

            {/* Caterer Card */}
            <div
              onClick={() => handleRoleSelect('caterer')}
              style={{
                ...styles.roleCard,
                borderColor: selectedRole === 'caterer' ? '#f97316' : '#e5e7eb',
                backgroundColor: selectedRole === 'caterer' ? '#fff7ed' : 'white',
                cursor: 'pointer',
                transform: selectedRole === 'caterer' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== 'caterer') {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
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
                List your catering business and reach customers across the platform
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

          {/* CTA Button */}
          {selectedRole && (
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
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(249, 115, 22, 0.3)';
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
          )}
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
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '50%' }} />
          </div>

          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>Step 2 of 4</span>
            <span style={styles.stepDot}>●</span>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Verify Your Phone</h1>
            <p style={styles.subtitle}>
              {selectedRole === 'caterer'
                ? 'We need to verify your business phone number'
                : 'Complete your profile setup'}
            </p>
          </div>

          {/* User Info Display */}
          <div style={styles.userInfoBox}>
            <div style={styles.userInfoItem}>
              <Mail size={18} color="#667eea" />
              <div>
                <p style={styles.userInfoLabel}>Email (Verified)</p>
                <p style={styles.userInfoValue}>{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Phone Verification Form */}
          <div style={styles.verificationForm}>
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {selectedRole === 'caterer' ? 'Business Phone Number' : 'Phone Number'}
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
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="10 digits"
                      style={styles.input}
                      maxLength={15}
                      disabled={isLoading}
                    />
                  </div>
                  <p style={styles.helpText}>Enter phone number without country code</p>
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
                      const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
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
                    cursor: isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
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
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '75%' }} />
          </div>

          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>Step 3 of 4</span>
            <span style={styles.stepDot}>●</span>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              {selectedRole === 'caterer' ? 'Business Information' : 'Complete Your Profile'}
            </h1>
            <p style={styles.subtitle}>
              {selectedRole === 'caterer'
                ? 'Tell us about your catering business'
                : 'Help us personalize your experience'}
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} style={styles.profileForm}>
            {/* Full Name */}
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

            {/* Business Info (Caterer Only) */}
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
                    placeholder="Brief description of your catering services (cuisine type, specialties, etc.)"
                    style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }}
                    disabled={isLoading}
                    rows={4}
                  />
                  <p style={styles.helpText}>Share what makes your business special</p>
                </div>
              </>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !fullName.trim() || (selectedRole === 'caterer' && !businessName.trim())}
              style={{
                ...styles.submitButton,
                opacity: isLoading || !fullName.trim() || (selectedRole === 'caterer' && !businessName.trim()) ? 0.6 : 1,
                cursor: isLoading || !fullName.trim() || (selectedRole === 'caterer' && !businessName.trim()) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && fullName.trim() && !(selectedRole === 'caterer' && !businessName.trim())) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.transform = 'translateY(0)';
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

  // Step 4: Complete
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
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: '100%' }} />
          </div>

          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <span style={styles.stepNumber}>Step 4 of 4</span>
            <span style={styles.stepDot}>●</span>
          </div>

          {/* Success Content */}
          <div style={styles.completeContainer}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.title}>All Set! 🎉</h1>
            <p style={styles.subtitle}>
              {selectedRole === 'caterer'
                ? "Your catering business profile is ready. Let's get you started!"
                : 'Welcome to CaterHub! Ready to explore amazing catering options?'}
            </p>

            {/* Summary */}
            <div style={styles.summaryBox}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Name</span>
                <span style={styles.summaryValue}>{fullName}</span>
              </div>

              {selectedRole === 'caterer' && (
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Business</span>
                  <span style={styles.summaryValue}>{businessName}</span>
                </div>
              )}

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Email</span>
                <span style={styles.summaryValue}>{session.user.email}</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Phone</span>
                <span style={styles.summaryValue}>
                  {countryCode}
                  {phone}
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
                    color:
                      selectedRole === 'caterer' ? '#f97316' : '#667eea',
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
                cursor: isLoading ? 'not-allowed' : 'pointer',
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
              {isLoading ? 'Completing setup...' : `Go to ${selectedRole === 'caterer' ? 'Caterer' : 'Customer'} Dashboard`}
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
    gridTemplateColumns: '1fr 1fr',
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
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
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
};