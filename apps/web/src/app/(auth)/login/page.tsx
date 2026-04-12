'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { sendOtpApi } from '@catering-marketplace/query-client';

declare module 'next-auth' {
  interface User {
    role?: string | null;
    isOnboardingCompleted?: boolean;
    isOnboardingPending?: boolean;
    onboarding?: {
      status: 'pending' | 'in_progress' | 'completed';
      selectedRole?: string;
    };
  }

  interface Session {
    user?: {
      accessToken: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      isOnboardingCompleted?: boolean;
      isOnboardingPending?: boolean;
      onboarding?: {
        status: 'pending' | 'in_progress' | 'completed';
        selectedRole?: string;
      };
    };
  }
}

// Country codes list
const COUNTRY_CODES = [
  
  { code: '+91', country: 'India' },
];

const MAX_RETRIES = 3;
const OTP_RESEND_TIMEOUT = 30; // seconds

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [maxRetriesReached, setMaxRetriesReached] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Redirect if already logged in with completed onboarding
  useEffect(() => {
    if (isRedirecting) return;

    if (status === 'authenticated' && session?.user && mounted) {
      setIsRedirecting(true);

     if (session.user.role) {
        const role = session.user.role;
        const callbackUrl = searchParams?.get('callbackUrl');
        router.push(`/${role}/dashboard`);
        if (callbackUrl && !callbackUrl.includes('/login')) {
          router.push(callbackUrl);
        } else {
          router.push(`/${role}/dashboard`);
        }
      }
    }
  }, [status, session, mounted, router, searchParams, isRedirecting]);

  // Validate phone number based on country code
  const isValidPhoneNumber = (code: string, phone: string): boolean => {
    const phoneRegex: { [key: string]: RegExp } = {
      '+1': /^\d{10}$/,
      '+44': /^\d{10,11}$/,
      '+91': /^\d{10}$/,
      '+86': /^\d{11}$/,
      '+81': /^\d{10}$/,
      '+33': /^\d{9}$/,
      '+49': /^\d{10,11}$/,
      '+39': /^\d{10}$/,
      '+34': /^\d{9}$/,
       '+31': /^\d{9, 11}$/,
      '+61': /^\d{9}$/,
    };

    const regex = phoneRegex[code] || /^\d{10,}$/;
    return regex.test(phone.replace(/\D/g, ''));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMode === 'email') {
        if (!email || email.length === 0) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
      } else {
        if (!phoneNumber || phoneNumber.length === 0) {
          setError('Please enter your phone number');
          setLoading(false);
          return;
        }

        if (!isValidPhoneNumber(countryCode, phoneNumber)) {
          setError(`Invalid phone number for ${countryCode}`);
          setLoading(false);
          return;
        }
      }

      // Check if max retries reached
      if (resendCount >= MAX_RETRIES) {
        setMaxRetriesReached(true);
        setError(
          `Maximum OTP requests reached (${MAX_RETRIES}). Please try again later.`
        );
        setLoading(false);
        return;
      }

      const payload = loginMode === 'email' 
        ? { email }
        : { phone: `${countryCode}${phoneNumber}` };

      const result = await sendOtpApi(payload);

      if (!result.success) {
        setError(result.error || 'Failed to send OTP. Please try again.');
        setLoading(false);
        return;
      }

      // Increment resend count
      const newResendCount = resendCount + 1;
      setResendCount(newResendCount);

      // Set resend timer
      setResendTimer(OTP_RESEND_TIMEOUT);

      if (loginMode === 'email') {
        setEmailOtpSent(true);
      } else {
        setOtpSent(true);
      }

      setError('');
      setOtp('');

      // Show success message
      if (newResendCount > 1) {
        setError(
          `OTP resent successfully. ${MAX_RETRIES - newResendCount} attempts remaining.`
        );
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const signInProvider = loginMode === 'email' ? 'email-otp' : 'phone-otp';
      const signInCredentials = loginMode === 'email'
        ? {
            email,
            otp,
            redirect: false
          }
        : {
            phone: `${countryCode}${phoneNumber}`,
            otp,
            redirect: false
          };

      const signInResult = await signIn(signInProvider, signInCredentials);

      if (signInResult?.error) {
        setError('Invalid OTP or authentication failed. Please try again.');
        setLoading(false);
        return;
      }

      if (signInResult?.ok) {
        setLoading(false);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/login',
      });



      if (result?.error) {
        setError(`Failed to sign in with ${provider}`);
        setSocialLoading(null);
      } else if (result?.ok) {
        setSocialLoading(null);
      }
    } catch (err) {
      console.error('Social login error:', err);
      setError(`Failed to sign in with ${provider}`);
      setSocialLoading(null);
    }
  };

  const handleStartOver = () => {
    setOtpSent(false);
    setEmailOtpSent(false);
    setResendCount(0);
    setMaxRetriesReached(false);
    setResendTimer(0);
    setOtp('');
    setError('');
    setEmail('');
    setPhoneNumber('');
  };

  const SocialLoginButton = ({
    provider,
    icon: IconComponent,
    label,
    bgColor,
    bgHoverColor,
    borderColor,
  }: {
    provider: 'google' | 'github' | 'apple';
    icon: React.ComponentType<{ style?: React.CSSProperties }>;
    label: string;
    bgColor: string;
    bgHoverColor: string;
    borderColor: string;
  }) => {
    const Icon = IconComponent;
    const isLoading = socialLoading === provider;

    return (
      <button
        type="button"
        onClick={() => {
          if (provider !== 'apple') {
            handleSocialLogin(provider as 'google' | 'github');
          }
        }}
        disabled={socialLoading !== null || provider === 'apple'}
        style={{
          flex: 1,
          padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
          backgroundColor: bgColor,
          color: 'white',
          border: `2px solid ${borderColor}`,
          borderRadius: '0.5rem',
          fontWeight: '600',
          cursor:
            socialLoading !== null || provider === 'apple'
              ? 'not-allowed'
              : 'pointer',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          opacity:
            (socialLoading && !isLoading) || provider === 'apple' ? 0.5 : 1,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: '2.5rem',
        }}
        onMouseEnter={(e) => {
          if (!socialLoading && provider !== 'apple') {
            e.currentTarget.style.backgroundColor = bgHoverColor;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.15)`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bgColor;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <span style={{ display: 'inline' }}>
          {isLoading ? `Connecting...` : label}
        </span>
      </button>
    );
  };

  if (!mounted || status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🍽️</div>
          <p style={{ color: '#fff' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }

        .login-container {
          display: flex;
          min-height: 100vh;
          margin: 0;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .form-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(1.5rem, 5vw, 2rem);
          width: 100%;
          max-width: 500px;
        }

        @media (max-width: 1024px) {
          .login-container {
            min-height: auto;
          }

          .form-section {
            padding: clamp(1.5rem, 4vw, 2rem);
          }
        }

        @media (max-width: 768px) {
          .form-section {
            padding: clamp(1rem, 3vw, 1.5rem);
            align-items: flex-start;
            padding-top: clamp(2rem, 8vw, 3rem);
            padding-bottom: clamp(2rem, 8vw, 3rem);
          }
        }

        @media (max-width: 480px) {
          .form-section {
            padding: 1rem;
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="form-section">
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '1rem',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                }}
              >
                Welcome Back
              </h2>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                Sign in to manage your catering orders and events
              </p>
            </div>

            {/* Max Retries Reached - Show Alternative Options */}
            {maxRetriesReached && (emailOtpSent || otpSent) ? (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  ⏳
                </div>
                <h3
                  style={{
                    color: '#991b1b',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    fontWeight: '600',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  Too Many Attempts
                </h3>
                <p
                  style={{
                    color: '#991b1b',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.5',
                  }}
                >
                  You've reached the maximum number of OTP requests. Please
                  try again later or use an alternative login method.
                </p>

                <button
                  type="button"
                  onClick={handleStartOver}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#764ba2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#667eea';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Try Different {loginMode === 'email' ? 'Phone' : 'Email'}
                </button>

                <p
                  style={{
                    color: '#6b7280',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    margin: '1rem 0 0 0',
                  }}
                >
                  Or continue with social login below
                </p>
              </div>
            ) : null}

            {/* Login Mode Tabs - Hidden when max retries reached */}
            {!maxRetriesReached || (!emailOtpSent && !otpSent) ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  marginBottom: '2rem',
                  backgroundColor: '#f3f4f6',
                  padding: '0.25rem',
                  borderRadius: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('email');
                    setOtpSent(false);
                    setEmailOtpSent(false);
                    setError('');
                    setOtp('');
                    setPhoneNumber('');
                    setResendCount(0);
                    setMaxRetriesReached(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor:
                      loginMode === 'email' ? 'white' : 'transparent',
                    color: loginMode === 'email' ? '#667eea' : '#6b7280',
                    fontWeight: '600',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow:
                      loginMode === 'email'
                        ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                        : 'none',
                  }}
                >
                  <EnvelopeIcon
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '0.5rem',
                      display: 'inline',
                    }}
                  />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('phone');
                    setOtpSent(false);
                    setEmailOtpSent(false);
                    setError('');
                    setEmail('');
                    setOtp('');
                    setResendCount(0);
                    setMaxRetriesReached(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor:
                      loginMode === 'phone' ? 'white' : 'transparent',
                    color: loginMode === 'phone' ? '#667eea' : '#6b7280',
                    fontWeight: '600',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow:
                      loginMode === 'phone'
                        ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                        : 'none',
                  }}
                >
                  <PhoneIcon
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '0.5rem',
                      display: 'inline',
                    }}
                  />
                  Phone
                </button>
              </div>
            ) : null}

            {/* Email Login Form */}
            {loginMode === 'email' && !maxRetriesReached && (
              <form
                onSubmit={emailOtpSent ? handleVerifyOtp : handleSendOtp}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {!emailOtpSent ? (
                  <>
                    {/* Email */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        }}
                      >
                        Email Address
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          backgroundColor: '#f9fafb',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.boxShadow =
                            '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <EnvelopeIcon
                          style={{
                            width: '18px',
                            height: '18px',
                            color: '#667eea',
                            flexShrink: 0,
                          }}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          disabled={loading || socialLoading !== null}
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            color: '#1f2937',
                            backgroundColor: 'transparent',
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          margin: '0.5rem 0 0 0',
                        }}
                      >
                        We'll send you a verification code to your email
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: '#fee2e2',
                          borderRadius: '0.5rem',
                          color: '#991b1b',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          border: '1px solid #fecaca',
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>⚠️</span>
                        {error}
                      </div>
                    )}

                    {/* Send OTP Button */}
                    <button
                      type="submit"
                      disabled={loading || socialLoading !== null || !email}
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor: email ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor:
                          loading || socialLoading || !email
                            ? 'not-allowed'
                            : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        opacity: loading || socialLoading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                        minHeight: '2.75rem',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && !socialLoading && email) {
                          e.currentTarget.style.backgroundColor = '#764ba2';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = email
                          ? '#667eea'
                          : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Sending OTP...' : 'Continue'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* OTP Input */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        }}
                      >
                        Enter OTP
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          backgroundColor: '#f9fafb',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.boxShadow =
                            '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
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
                          disabled={loading}
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '2rem',
                            fontWeight: '600',
                            letterSpacing: '0.5rem',
                            textAlign: 'center',
                            color: '#1f2937',
                            backgroundColor: 'transparent',
                          }}
                          maxLength={6}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          margin: '0.5rem 0 0 0',
                          textAlign: 'center',
                        }}
                      >
                        OTP sent to {email}
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: error.includes('remaining')
                            ? '#dbeafe'
                            : '#fee2e2',
                          borderRadius: '0.5rem',
                          color: error.includes('remaining')
                            ? '#1e40af'
                            : '#991b1b',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          border: `1px solid ${
                            error.includes('remaining')
                              ? '#bfdbfe'
                              : '#fecaca'
                          }`,
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>
                          {error.includes('remaining') ? 'ℹ️' : '⚠️'}
                        </span>
                        {error}
                      </div>
                    )}

                    {/* Verify OTP Button */}
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor:
                          otp.length === 6 ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor:
                          loading || otp.length !== 6
                            ? 'not-allowed'
                            : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                        minHeight: '2.75rem',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && otp.length === 6) {
                          e.currentTarget.style.backgroundColor = '#764ba2';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          otp.length === 6 ? '#667eea' : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    {/* Resend Section */}
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #dcfce7',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                      }}
                    >
                      {resendTimer > 0 ? (
                        <p
                          style={{
                            color: '#15803d',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            margin: '0 0 0.75rem 0',
                          }}
                        >
                          Resend OTP in{' '}
                          <span style={{ fontWeight: '600' }}>
                            {resendTimer}s
                          </span>
                        </p>
                      ) : (
                        <p
                          style={{
                            color: '#6b7280',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            margin: '0 0 0.75rem 0',
                          }}
                        >
                          Didn't receive OTP?
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={
                          resendTimer > 0 ||
                          resendCount >= MAX_RETRIES ||
                          loading
                        }
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor:
                            resendTimer > 0 || resendCount >= MAX_RETRIES
                              ? '#d1d5db'
                              : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontWeight: '600',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          cursor:
                            resendTimer > 0 || resendCount >= MAX_RETRIES
                              ? 'not-allowed'
                              : 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (resendTimer === 0 && resendCount < MAX_RETRIES) {
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            resendTimer > 0 || resendCount >= MAX_RETRIES
                              ? '#d1d5db'
                              : '#10b981';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend OTP'}
                      </button>

                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: '#9ca3af',
                          margin: '0.75rem 0 0 0',
                        }}
                      >
                        {resendCount}/{MAX_RETRIES} attempts used
                      </p>
                    </div>

                    {/* Edit Email Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailOtpSent(false);
                        setOtp('');
                        setError('');
                      }}
                      disabled={loading}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'transparent',
                        color: '#667eea',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.backgroundColor = '#f0f4ff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Edit Email
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Phone Login Form */}
            {loginMode === 'phone' && !maxRetriesReached && (
              <form
                onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {!otpSent ? (
                  <>
                    {/* Phone Number with Country Code */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        }}
                      >
                        Phone Number
                      </label>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 2fr',
                          gap: '0.75rem',
                        }}
                      >
                        {/* Country Code Dropdown */}
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          style={{
                            padding: '0.75rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            color: '#1f2937',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            backgroundColor: '#f9fafb',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        >
                          {COUNTRY_CODES.map((cc) => (
                            <option key={cc.code} value={cc.code}>
                              {cc.code}
                            </option>
                          ))}
                        </select>

                        {/* Phone Input */}
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setPhoneNumber(value);
                          }}
                          placeholder="10 digits"
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            color: '#1f2937',
                            boxSizing: 'border-box',
                            backgroundColor: '#f9fafb',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.currentTarget.style.borderColor = '#667eea';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          margin: '0.5rem 0 0 0',
                        }}
                      >
                        Enter phone number without country code
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: '#fee2e2',
                          borderRadius: '0.5rem',
                          color: '#991b1b',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          border: '1px solid #fecaca',
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>⚠️</span>
                        {error}
                      </div>
                    )}

                    {/* Send OTP Button */}
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !phoneNumber ||
                        !isValidPhoneNumber(countryCode, phoneNumber)
                      }
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor:
                          phoneNumber &&
                          isValidPhoneNumber(countryCode, phoneNumber)
                            ? '#667eea'
                            : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor:
                          loading ||
                          !phoneNumber ||
                          !isValidPhoneNumber(countryCode, phoneNumber)
                            ? 'not-allowed'
                            : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                        minHeight: '2.75rem',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !loading &&
                          phoneNumber &&
                          isValidPhoneNumber(countryCode, phoneNumber)
                        ) {
                          e.currentTarget.style.backgroundColor = '#764ba2';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          phoneNumber &&
                          isValidPhoneNumber(countryCode, phoneNumber)
                            ? '#667eea'
                            : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP to Phone'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* OTP Input */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        }}
                      >
                        Enter OTP
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          backgroundColor: '#f9fafb',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.boxShadow =
                            '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
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
                          disabled={loading}
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '2rem',
                            fontWeight: '600',
                            letterSpacing: '0.5rem',
                            textAlign: 'center',
                            color: '#1f2937',
                            backgroundColor: 'transparent',
                          }}
                          maxLength={6}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          margin: '0.5rem 0 0 0',
                          textAlign: 'center',
                        }}
                      >
                        OTP sent to {countryCode}
                        {phoneNumber}
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: error.includes('remaining')
                            ? '#dbeafe'
                            : '#fee2e2',
                          borderRadius: '0.5rem',
                          color: error.includes('remaining')
                            ? '#1e40af'
                            : '#991b1b',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          border: `1px solid ${
                            error.includes('remaining')
                              ? '#bfdbfe'
                              : '#fecaca'
                          }`,
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>
                          {error.includes('remaining') ? 'ℹ️' : '⚠️'}
                        </span>
                        {error}
                      </div>
                    )}

                    {/* Verify OTP Button */}
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor:
                          otp.length === 6 ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor:
                          loading || otp.length !== 6
                            ? 'not-allowed'
                            : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                        minHeight: '2.75rem',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && otp.length === 6) {
                          e.currentTarget.style.backgroundColor = '#764ba2';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          otp.length === 6 ? '#667eea' : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    {/* Resend Section */}
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #dcfce7',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                      }}
                    >
                      {resendTimer > 0 ? (
                        <p
                          style={{
                            color: '#15803d',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            margin: '0 0 0.75rem 0',
                          }}
                        >
                          Resend OTP in{' '}
                          <span style={{ fontWeight: '600' }}>
                            {resendTimer}s
                          </span>
                        </p>
                      ) : (
                        <p
                          style={{
                            color: '#6b7280',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            margin: '0 0 0.75rem 0',
                          }}
                        >
                          Didn't receive OTP?
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={
                          resendTimer > 0 ||
                          resendCount >= MAX_RETRIES ||
                          loading
                        }
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor:
                            resendTimer > 0 || resendCount >= MAX_RETRIES
                              ? '#d1d5db'
                              : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontWeight: '600',
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          cursor:
                            resendTimer > 0 || resendCount >= MAX_RETRIES
                              ? 'not-allowed'
                              : 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (resendTimer === 0 && resendCount < MAX_RETRIES) {
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            resendTimer > 0 || resendCount >= MAX_RETRIES
                              ? '#d1d5db'
                              : '#10b981';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend OTP'}
                      </button>

                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: '#9ca3af',
                          margin: '0.75rem 0 0 0',
                        }}
                      >
                        {resendCount}/{MAX_RETRIES} attempts used
                      </p>
                    </div>

                    {/* Edit Phone Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setError('');
                      }}
                      disabled={loading}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'transparent',
                        color: '#667eea',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.backgroundColor = '#f0f4ff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Edit Phone Number
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Divider */}
            {!maxRetriesReached || (!emailOtpSent && !otpSent) ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '2rem 0',
                    color: '#d1d5db',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    or continue with
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                </div>

                {/* Social Login Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(80px, 1fr))',
                      gap: '0.75rem',
                    }}
                  >
                    <SocialLoginButton
                      provider="google"
                      icon={({ style }) => (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          style={style}
                        >
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      )}
                      label="Google"
                      bgColor="#4285f4"
                      bgHoverColor="#357ae8"
                      borderColor="#4285f4"
                    />
                  </div>
                </div>
              </>
            ) : null}

            {/* Sign Up Link */}
            {!maxRetriesReached ? (
              <p
                style={{
                  textAlign: 'center',
                  color: '#1f2937',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                }}
              >
                New here?{' '}
                <Link
                  href="/signup"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#764ba2')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#667eea')
                  }
                >
                  Create an account
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}