'use client';

import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Mail, Phone } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { sendOtpApi } from '@catering-marketplace/query-client';

interface EmailOrPhoneVerificationProps {
  onOtpVerified?:any;
}

export default function EmailOrPhoneVerification({
  onOtpVerified,
}: EmailOrPhoneVerificationProps) {
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
    const { data: session, status, update: updateSession } = useSession();
  

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);
  useEffect(() => {
    if (error && otp.length < 6) {
      setError('');
    }
  }, [otp]);

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

    if (!otp || otp.length !== 6) {
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
          ? { email: emailOrPhone.trim(), otp, phone: '' }
          : {
              phone: `+91${emailOrPhone.replace(/\D/g, '')}`,
              otp: otp,
              email: '',
            };
      const signInType = inputType === 'email' ? 'email-otp' : 'phone-otp';

    
      // Sign in with NextAuth
      try {
        const signInPayload = {
          ...(inputType === 'email' && { email: emailOrPhone.trim() }),
          ...(inputType === 'phone' && {
            phone: `+91${emailOrPhone.replace(/\D/g, '')}`,
          }),
          otp,
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
        onOtpVerified(true);
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

  const detectInputType = (value: string): 'email' | 'phone' | 'invalid' => {
    const trimmed = value.trim();
    if (trimmed.includes('@') && trimmed.includes('.')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmed)) return 'email';
    }
    const digits = trimmed.replace(/\D/g, '');
    if (/^\d{10}$/.test(digits)) return 'phone';
    return 'invalid';
  };

  const inputType = detectInputType(emailOrPhone);
  const isValidInput = inputType !== 'invalid';
  const isEmail = inputType === 'email';
  const isPhone = inputType === 'phone';

  const otpArray = Array.from({ length: 6 }, (_, i) => otp[i] || '');

  const formatPhoneForDisplay = (phone: string) => {
    const d = phone.replace(/\D/g, '');
    if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
    return phone;
  };

  const canSendOtp = !otpSent && isValidInput && !isLoading && resendCount < 3;

  const isOtpNumeric = /^[0-9]{6}$/.test(otp);

  const canVerifyOtp = otpSent && isOtpNumeric && !isLoading && !error;

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
          Welcome to Droooly
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
          Verify your identity to get started
        </p>
      </div>

      <form
        onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}
      >
        {/* EMAIL OR PHONE INPUT */}
        {!otpSent ? (
          <>
            <label style={{ fontWeight: 600 }}>Email or Phone</label>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#667eea',
                }}
              >
                {isPhone ? <Phone size={20} /> : <Mail size={20} />}
              </div>

              <input
                autoFocus
                disabled={isLoading}
                value={emailOrPhone}
                onChange={(e) => {
                  let value = e.target.value;
                  const digits = value.replace(/\D/g, '');
                  if (/^\d+$/.test(value)) {
                    if (digits.length <= 10) {
                      value = digits.replace(/(\d{5})(\d{1,5})/, '$1 $2');
                    }
                  }
                  setEmailOrPhone(value);
                }}
                placeholder="you@example.com or 98765 43210"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e5e7eb',
                  ...(isValidInput && {
                    borderColor: '#10b981',
                    background: '#f0fdf4',
                  }),
                }}
              />

              {isValidInput && (
                <CheckCircle
                  size={20}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10b981',
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <>
            {/* OTP SECTION */}
            <div
              style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <label style={{ fontWeight: 600 }}>Enter OTP</label>

              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Sent to{' '}
                {isEmail ? emailOrPhone : formatPhoneForDisplay(emailOrPhone)}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  marginTop: '1rem',
                }}
              >
                {otpArray.map((v, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    value={v}
                    inputMode="numeric"
                    /* @ts-ignore */
                    ref={(el) => (otpRefs.current[i] = el!)}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '');
                      const arr = [...otpArray];

                      if (d === '') arr[i] = '';
                      else {
                        arr[i] = d[0];
                        if (i < 5) otpRefs.current[i + 1]?.focus();
                      }

                      setOtp(arr.join(''));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpArray[i] && i > 0) {
                        otpRefs.current[i - 1]?.focus();
                      }
                    }}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #e5e7eb',
                      transition: '0.15s',
                      ...(error &&
                        otp.length === 6 && {
                          borderColor: '#dc2626',
                          background: '#fee2e2',
                        }),
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ERROR BOX */}
        {error && otpSent && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              padding: '1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              gap: '0.75rem',
              color: '#dc2626',
            }}
          >
            <AlertCircle size={18} />
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.875rem',
            background: '#667eea',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: 600,
            opacity: otpSent
              ? !canVerifyOtp
                ? 0.5
                : 1
              : !canSendOtp
                ? 0.5
                : 1,
            cursor: otpSent
              ? canVerifyOtp
                ? 'pointer'
                : 'not-allowed'
              : canSendOtp
                ? 'pointer'
                : 'not-allowed',
          }}
        >
          {isLoading
            ? otpSent
              ? '⏳ Verifying OTP...'
              : '⏳ Sending OTP...'
            : otpSent
              ? '✓ Verify OTP'
              : '→ Send OTP'}
        </button>
      </form>
    </div>
  );
}
