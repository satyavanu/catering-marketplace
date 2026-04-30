'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { sendOtpApi } from '@catering-marketplace/query-client';
import { PhoneWithShield } from '@/components/SVGS';

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

  const contactLabel = inputType === 'email' ? 'Email address' : 'Mobile number';
  const contactDisplay =
    inputType === 'phone'
      ? `+91 ${emailOrPhone.replace(/\D/g, '').replace(/(\d{5})(\d{0,5})/, '$1 $2')}`
      : emailOrPhone.trim();

  const securityText =
    inputType === 'email'
      ? 'Your email address is safe with us. We only use it to verify and secure your partner account.'
      : 'Your phone number is safe with us. We only use it to verify and secure your partner account.';

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
      <div style={styles.hero}>
        <div style={styles.iconWrap}>
          <PhoneWithShield />
        </div>

        <div>
          <h1 style={styles.title}>
            {otpSent ? 'Enter OTP' : 'Verify your number'}
          </h1>

          <p style={styles.subtitle}>
            {otpSent
              ? `We’ve sent a 6-digit OTP to ${contactDisplay}. Enter it below to continue your Droooly partner onboarding.`
              : 'Enter your mobile number or email address to get started with Droooly.'}
          </p>
        </div>
      </div>

      <div style={styles.form}>
        {!otpSent && (
          <>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>{contactLabel}</label>

              <div
                style={{
                  ...styles.inputShell,
                  ...(emailOrPhone && inputType !== 'invalid'
                    ? styles.inputShellValid
                    : {}),
                }}
              >
                {inputType !== 'email' && (
                  <div style={styles.countryCode}>
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                )}

                <input
                  type="text"
                  value={emailOrPhone}
                  disabled={isSendingOtp || isVerifyingOtp}
                  onChange={(event) => handleContactChange(event.target.value)}
                  placeholder="98765 43210 or you@example.com"
                  style={styles.input}
                />
              </div>
            </div>

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
          </>
        )}

        {otpSent && (
          <>
            <div style={styles.otpHeader}>
              <div style={styles.noticeTitle}>Verification code</div>
              <button
                type="button"
                onClick={handleChangeContact}
                disabled={isSendingOtp || isVerifyingOtp}
                style={styles.changeButton}
              >
                Change
              </button>
            </div>

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

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!canVerifyOtp}
              style={{
                ...styles.primaryButton,
                ...(!canVerifyOtp ? styles.disabledButton : {}),
              }}
            >
              {isVerifyingOtp ? 'Verifying OTP...' : 'Verify & Continue'}
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
          </>
        )}

        <div style={styles.safeBox}>
          <div style={styles.safeIcon}>🛡️</div>
          <p style={styles.safeText}>{securityText}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.signInText}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => signIn()}
            style={styles.signInButton}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    width: '100%',
    maxWidth: '430px',
    margin: '2rem auto',
    padding: '1.75rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '88px 1fr',
    gap: '1.25rem',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },

  iconWrap: {
    width: '88px',
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    margin: '0.4rem 0 0',
    fontSize: '0.92rem',
    lineHeight: 1.55,
    color: '#667085',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },

  label: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#344054',
  },

  inputShell: {
    minHeight: '46px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '0.65rem',
    border: '1px solid #d0d5dd',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },

  inputShellValid: {
    borderColor: '#4f9f38',
    boxShadow: '0 0 0 3px rgba(79, 159, 56, 0.12)',
  },

  countryCode: {
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0 0.75rem',
    borderRight: '1px solid #e5e7eb',
    color: '#475467',
    fontSize: '0.9rem',
    fontWeight: 600,
    backgroundColor: '#f9fafb',
  },

  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    padding: '0.8rem 0.9rem',
    fontSize: '0.95rem',
    color: '#111827',
    backgroundColor: 'transparent',
  },

  primaryButton: {
    width: '100%',
    minHeight: '48px',
    border: 'none',
    borderRadius: '0.65rem',
    background: 'linear-gradient(135deg, #56A13A 0%, #3F8F2F 100%)',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(63, 143, 47, 0.22)',
  },

  disabledButton: {
    background: '#d0d5dd',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },

  secondaryButton: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '0.65rem',
    border: '1px solid #d0d5dd',
    backgroundColor: '#ffffff',
    color: '#344054',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
  },

  disabledSecondaryButton: {
    color: '#98a2b3',
    backgroundColor: '#f9fafb',
    cursor: 'not-allowed',
  },

  otpHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  noticeTitle: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#344054',
  },

  changeButton: {
    border: 'none',
    background: 'transparent',
    color: '#ef6820',
    fontSize: '0.84rem',
    fontWeight: 800,
    cursor: 'pointer',
  },

  otpGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },

  otpInput: {
    width: '48px',
    height: '52px',
    borderRadius: '0.75rem',
    border: '1.5px solid #d0d5dd',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#111827',
    outline: 'none',
    backgroundColor: '#ffffff',
  },

  safeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
    padding: '0.85rem',
    borderRadius: '0.85rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #dcfce7',
  },

  safeIcon: {
    fontSize: '1rem',
    lineHeight: 1.4,
  },

  safeText: {
    margin: 0,
    fontSize: '0.82rem',
    lineHeight: 1.45,
    color: '#3f6212',
    fontWeight: 600,
  },

  error: {
    padding: '0.85rem',
    borderRadius: '0.75rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.88rem',
    fontWeight: 650,
  },

  signInText: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#667085',
  },

  signInButton: {
    border: 'none',
    background: 'transparent',
    color: '#ef6820',
    fontSize: '0.85rem',
    fontWeight: 800,
    cursor: 'pointer',
    padding: 0,
  },
};