'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';


/// <reference types="next-auth" />

import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [email, setEmail] = useState('demo@example.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user?.role && mounted) {
      const role = session?.user?.role || 'customer';
      const callbackUrl = searchParams?.get('callbackUrl');
      
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push(`/${role}/dashboard`);
      }
    }
  }, [session, mounted, router, searchParams]);

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || email.length === 0) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual OTP API call
      // const response = await fetch('/api/auth/send-otp-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      setEmailOtpSent(true);
      setError('');
      // Demo: OTP would be "123456"
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual OTP verification API call
      // const response = await fetch('/api/auth/verify-otp-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp }),
      // });

      const result = await signIn('credentials', {
        email: email,
        otp: otp,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid OTP. Please try again.');
        setLoading(false);
      } else if (result?.ok) {
        // Redirect will be handled by the redirect callback
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpLoading(true);

    // Validate phone number (basic validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      setOtpLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual OTP API call
      // const response = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber }),
      // });

      // For demo purposes
      setOtpSent(true);
      setError('');
      // Demo: OTP would be "123456"
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual OTP verification API call
      // const response = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, otp }),
      // });

      // For demo purposes - simulate successful verification
      const result = await signIn('credentials', {
        phone: phoneNumber,
        otp: otp,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid OTP. Please try again.');
        setLoading(false);
      } else if (result?.ok) {
        // Redirect will be handled by the redirect callback
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    try {
      await signIn(provider, {
        redirect: true,
        // The redirect callback will handle role-based routing
      });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      setSocialLoading(null);
    }
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
            (socialLoading && !isLoading) || provider === 'apple' 
              ? 0.5 
              : 1,
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
        <span style={{ display: 'inline' }}>{isLoading ? `Connecting...` : label}</span>
      </button>
    );
  };

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
      }}>
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
        {/* Form Section */}
        <div className="form-section">
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '1rem',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
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
                  color: '#fff',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                Sign in to your catering dashboard and manage your events
              </p>
            </div>

            {/* Login Mode Tabs */}
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
                }}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: loginMode === 'email' ? 'white' : 'transparent',
                  color: loginMode === 'email' ? '#667eea' : 'blue',
                  fontWeight: '600',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loginMode === 'email' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <EnvelopeIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} />
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('phone');
                  setOtpSent(false);
                  setEmailOtpSent(false);
                  setError('');
                  setEmail('demo@example.com');
                  setOtp('');
                }}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: loginMode === 'phone' ? 'white' : 'transparent',
                  color: loginMode === 'phone' ? '#667eea' : '#000',
                  fontWeight: '600',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loginMode === 'phone' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <PhoneIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} />
                Phone
              </button>
            </div>

            {/* Email Login Form */}
            {loginMode === 'email' && (
              <form
                onSubmit={emailOtpSent ? handleVerifyEmailOtp : handleSendEmailOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
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
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                        A temporary password will be sent to your email
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
                        cursor: loading || socialLoading || !email ? 'not-allowed' : 'pointer',
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
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = email ? '#667eea' : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP to Email'}
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
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                            const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
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

                    {/* Verify OTP Button */}
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor: otp.length === 6 ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
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
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = otp.length === 6 ? '#667eea' : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

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
            {loginMode === 'phone' && (
              <form
                onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {!otpSent ? (
                  <>
                    {/* Phone Number */}
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
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ color: '#667eea', fontWeight: '600', flexShrink: 0 }}>
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                            setPhoneNumber(value);
                          }}
                          placeholder="10-digit phone number"
                          disabled={otpLoading || loading}
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
                        We'll send you an OTP to verify your number
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
                      disabled={otpLoading || loading || phoneNumber.length !== 10}
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor: phoneNumber.length === 10 ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: otpLoading || loading || phoneNumber.length !== 10 ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        opacity: otpLoading || loading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                        minHeight: '2.75rem',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!otpLoading && !loading && phoneNumber.length === 10) {
                          e.currentTarget.style.backgroundColor = '#764ba2';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = phoneNumber.length === 10 ? '#667eea' : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {otpLoading ? 'Sending OTP...' : 'Send OTP'}
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
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                            const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
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
                        OTP sent to +91{phoneNumber}
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

                    {/* Verify OTP Button */}
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                        backgroundColor: otp.length === 6 ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
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
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = otp.length === 6 ? '#667eea' : '#d1d5db';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                margin: '2rem 0',
                color: '#d1d5db',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span
                style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: '#fff',
                  fontWeight: '500',
                }}
              >
                or
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            {/* Social Login Section */}
            <div style={{ marginBottom: '2rem' }}>
              <p
                style={{
                  textAlign: 'center',
                  color: '#1f2937',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  marginBottom: '1rem',
                  fontWeight: '500',
                }}
              >
                You can also login with
              </p>

              {/* Social Login Buttons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
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
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={style}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <text
                        x="12"
                        y="15"
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="10"
                      >
                        G
                      </text>
                    </svg>
                  )}
                  label="Google"
                  bgColor="#4285f4"
                  bgHoverColor="#357ae8"
                  borderColor="#4285f4"
                />
              </div>
            </div>

            {/* Sign Up Link */}
            <p
              style={{
                textAlign: 'center',
                color: '#1f2937',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
              }}
            >
              Don't have an account?{' '}
              <Link
                href="/signup"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#764ba2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#667eea')}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}