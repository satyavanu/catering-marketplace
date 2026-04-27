'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { sendOtpApi } from '@catering-marketplace/query-client';

type AuthIntent = 'partner_onboarding';
type InputType = 'email' | 'phone' | 'invalid';

export interface AuthVerificationData {
  email?: string;
  phone?: string;
  intent: AuthIntent;
  isNewUser?: boolean;
}

interface EmailOrPhoneVerificationProps {
  initialData?: {
    email?: string;
    phone?: string;
  };
  intent?: AuthIntent;
  onSubmitForm: (data: AuthVerificationData) => void | Promise<void>;
  onBack?: () => void;
}

const RESEND_SECONDS = 180;
const OTP_LENGTH = 6;

export default function EmailOrPhoneVerification({
  initialData,
  intent = 'partner_onboarding',
  onSubmitForm,
}: EmailOrPhoneVerificationProps) {
  const { data: session, update: updateSession } = useSession();
  const otpRefs = useRef<HTMLInputElement[]>([]);

  const [emailOrPhone, setEmailOrPhone] = useState(
    initialData?.email || initialData?.phone || ''
  );

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = window.setInterval(() => {
      setResendTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  const inputType = useMemo<InputType>(() => {
    const value = emailOrPhone.trim();
    const digits = value.replace(/\D/g, '');

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'email';
    if (/^\d{10}$/.test(digits)) return 'phone';

    return 'invalid';
  }, [emailOrPhone]);

  const normalizedContact = useMemo(() => {
    if (inputType === 'email') {
      return {
        email: emailOrPhone.trim().toLowerCase(),
      };
    }

    if (inputType === 'phone') {
      return {
        phone: `+91${emailOrPhone.replace(/\D/g, '')}`,
      };
    }

    return {};
  }, [emailOrPhone, inputType]);

  const canSendOtp =
    inputType !== 'invalid' &&
    !otpSent &&
    !isSendingOtp &&
    !isVerifyingOtp;

  const canVerifyOtp =
    otpSent &&
    otp.length === OTP_LENGTH &&
    /^\d{6}$/.test(otp) &&
    !isVerifyingOtp &&
    !isSendingOtp;

  const canResendOtp =
    otpSent &&
    resendTimer === 0 &&
    !isSendingOtp &&
    !isVerifyingOtp;

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSendOtp = async () => {
    if (!canSendOtp) return;

    setError('');
    setIsSendingOtp(true);

    try {
      const result = await sendOtpApi({
        ...normalizedContact,
      });

      if (!result.success) {
        setError(result.error || 'Unable to send OTP. Please try again.');
        return;
      }

      setOtpSent(true);
      setOtp('');
      setResendTimer(RESEND_SECONDS);

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError('Unable to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    setError('');
    setIsSendingOtp(true);

    try {
      const result = await sendOtpApi({
        ...normalizedContact,
      });

      if (!result.success) {
        setError(result.error || 'Unable to resend OTP. Please try again.');
        return;
      }

      setOtp('');
      setResendTimer(RESEND_SECONDS);

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Unable to resend OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!canVerifyOtp) return;

    setError('');
    setIsVerifyingOtp(true);

    try {
      const provider = inputType === 'email' ? 'email-otp' : 'phone-otp';

      const result = await signIn(provider, {
        ...normalizedContact,
        otp,
        redirect: false,
      });

      if (!result?.ok) {
        setError('Invalid OTP. Please check and try again.');
        return;
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          ...normalizedContact,
          onboardingIntent: intent,
        },
      });

      await onSubmitForm({
        ...normalizedContact,
        intent,
      });
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Unable to verify OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleContactChange = (value: string) => {
    setError('');

    const rawDigits = value.replace(/\D/g, '');

    if (/^\d/.test(value)) {
      const formatted = rawDigits
        .slice(0, 10)
        .replace(/(\d{5})(\d{0,5})/, '$1 $2')
        .trim();

      setEmailOrPhone(formatted);
      return;
    }

    setEmailOrPhone(value);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const otpArray = otp.split('');

    otpArray[index] = digit;

    const nextOtp = Array.from(
      { length: OTP_LENGTH },
      (_, i) => otpArray[i] || ''
    ).join('');

    setOtp(nextOtp);
    setError('');

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleChangeContact = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
    setResendTimer(0);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>Partner Onboarding</h1>
        <p style={styles.subtitle}>
          Verify your email or phone number to continue.
        </p>
      </div>

      <div style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email or phone number</label>

          <input
            type="text"
            value={emailOrPhone}
            disabled={otpSent || isSendingOtp || isVerifyingOtp}
            onChange={(event) => handleContactChange(event.target.value)}
            placeholder="you@example.com or 98765 43210"
            style={{
              ...styles.input,
              ...(emailOrPhone && inputType !== 'invalid'
                ? styles.inputValid
                : {}),
            }}
          />
        </div>

        {!otpSent && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canSendOtp}
            style={{
              ...styles.primaryButton,
              ...(!canSendOtp ? styles.disabledButton : {}),
            }}
          >
            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
          </button>
        )}

        {otpSent && (
          <>
            <div style={styles.notice}>
              OTP sent. Please enter the 6-digit code.
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Verification code</label>

              <div style={styles.otpGroup}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      if (element) otpRefs.current[index] = element;
                    }}
                    value={otp[index] || ''}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    inputMode="numeric"
                    maxLength={1}
                    disabled={isVerifyingOtp}
                    style={styles.otpInput}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!canVerifyOtp}
              style={{
                ...styles.primaryButton,
                ...(!canVerifyOtp ? styles.disabledButton : {}),
              }}
            >
              {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResendOtp}
              style={{
                ...styles.secondaryButton,
                ...(!canResendOtp ? styles.disabledSecondaryButton : {}),
              }}
            >
              {resendTimer > 0
                ? `Resend OTP in ${formatTimer(resendTimer)}`
                : isSendingOtp
                  ? 'Resending OTP...'
                  : 'Resend OTP'}
            </button>

            <button
              type="button"
              onClick={handleChangeContact}
              disabled={isSendingOtp || isVerifyingOtp}
              style={styles.linkButton}
            >
              Change email or phone
            </button>
          </>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '460px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  title: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#111827',
  },

  subtitle: {
    marginTop: '0.5rem',
    fontSize: '0.95rem',
    color: '#6b7280',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#374151',
  },

  input: {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },

  inputValid: {
    borderColor: '#10b981',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.12)',
  },

  primaryButton: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.875rem',
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  secondaryButton: {
    width: '100%',
    padding: '0.95rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },

  disabledSecondaryButton: {
    color: '#9ca3af',
    backgroundColor: '#f9fafb',
    cursor: 'not-allowed',
  },

  notice: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fff7ed',
    color: '#9a3412',
    fontSize: '0.9rem',
    fontWeight: 600,
  },

  otpGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },

  otpInput: {
    width: '3rem',
    height: '3rem',
    borderRadius: '9999px',
    border: '1.5px solid #d1d5db',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 800,
    outline: 'none',
  },

  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
  },

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
};