'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Mail, Phone } from 'lucide-react';

interface EmailOrPhoneVerificationProps {
  emailOrPhone: string;
  otp: string;
  otpSent: boolean;
  resendTimer: number;
  resendCount: number;
  isLoading: boolean;
  error: string;
  onEmailOrPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onSendOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onResendOtp: () => void;
  styles: any;
}

export default function EmailOrPhoneVerification({
  emailOrPhone,
  otp,
  otpSent,
  resendTimer,
  resendCount,
  isLoading,
  error,
  onEmailOrPhoneChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  styles,
}: EmailOrPhoneVerificationProps) {
  // Detect input type
  const detectInputType = (value: string): 'email' | 'phone' | 'invalid' => {
    const trimmed = value.trim();

    if (trimmed.includes('@') && trimmed.includes('.')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmed)) {
        return 'email';
      }
    }

    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(trimmed.replace(/\D/g, ''))) {
      return 'phone';
    }

    return 'invalid';
  };

  const inputType = detectInputType(emailOrPhone);
  const isValidInput = inputType !== 'invalid' && emailOrPhone.length > 0;
  const isPhone = inputType === 'phone';
  const isEmail = inputType === 'email';

  // Format phone for display
  const formatPhoneForDisplay = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return phone;
  };

  const verificationStyles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },

    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },

    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 0.5rem 0',
    },

    subtitle: {
      fontSize: '0.95rem',
      color: '#64748b',
      margin: 0,
    },

    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
    },

    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },

    label: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },

    helpText: {
      fontSize: '0.8rem',
      color: '#64748b',
      margin: '0.5rem 0 0 0',
    },

    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },

    input: {
      width: '100%',
      padding: '0.875rem 1rem 0.875rem 2.75rem',
      borderRadius: '0.5rem',
      border: '2px solid #e5e7eb',
      fontSize: '0.95rem',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
    },

    inputValid: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
    },

    inputInvalid: {
      borderColor: '#dc2626',
      backgroundColor: '#fef2f2',
    },

    icon: {
      position: 'absolute' as const,
      left: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none' as const,
      color: '#667eea',
    },

    validIcon: {
      position: 'absolute' as const,
      right: '12px',
      color: '#10b981',
      pointerEvents: 'none' as const,
    },

    otpSection: {
      backgroundColor: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
    },

    otpLabel: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.75rem',
    },

    otpInfo: {
      fontSize: '0.8rem',
      color: '#64748b',
      marginBottom: '1rem',
    },

    otpInput: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: '0.5rem',
      border: '2px solid #e5e7eb',
      fontSize: '1.25rem',
      letterSpacing: '0.25rem',
      fontFamily: 'monospace',
      transition: 'all 0.2s ease',
      textAlign: 'center' as const,
    },

    otpInputValid: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
    },

    otpInputInvalid: {
      borderColor: '#dc2626',
      backgroundColor: '#fef2f2',
    },

    resendSection: {
      textAlign: 'center' as const,
      marginTop: '1rem',
    },

    resendButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      textDecoration: 'underline',
      padding: 0,
    },

    resendButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    resendTimer: {
      fontSize: '0.9rem',
      color: '#64748b',
      fontWeight: '600',
    },

    errorBox: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '0.5rem',
      color: '#dc2626',
      fontSize: '0.9rem',
    },

    button: {
      width: '100%',
      padding: '0.875rem 1.5rem',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '44px',
    },

    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },

    infoBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #7dd3fc',
      borderRadius: '0.5rem',
      padding: '1rem',
      color: '#0369a1',
      fontSize: '0.85rem',
      marginBottom: '1.5rem',
    },
  };

  return (
    <div style={verificationStyles.container}>
      <div style={verificationStyles.header}>
        <h1 style={verificationStyles.title}>👋 Welcome to Droooly</h1>
        <p style={verificationStyles.subtitle}>
          Verify your identity to get started as a partner
        </p>
      </div>

      <div style={verificationStyles.infoBox}>
        📱 Enter your email address or 10-digit mobile number
      </div>

      <form
        onSubmit={otpSent ? onVerifyOtp : onSendOtp}
        style={verificationStyles.form}
      >
        {/* Email/Phone Input - ALWAYS SHOW WHEN NOT OTP SENT */}
        {!otpSent ? (
          <div style={verificationStyles.inputGroup}>
            <label style={verificationStyles.label}>
              {isEmail
                ? '📧 Email Address'
                : isPhone
                  ? '📱 Mobile Number'
                  : '📧 Email or Mobile Number'}
            </label>

            <div style={verificationStyles.inputWrapper}>
              <div style={verificationStyles.icon}>
                {isEmail ? (
                  <Mail size={20} />
                ) : isPhone ? (
                  <Phone size={20} />
                ) : (
                  <Mail size={20} />
                )}
              </div>

              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => {
                  let value = e.target.value;
                  // Allow @ and . for email, digits for phone
                  if (!value.includes('@')) {
                    value = value.replace(/\D/g, '');
                  }
                  onEmailOrPhoneChange(value);
                }}
                placeholder="your@email.com or 9876543210"
                disabled={isLoading}
                autoFocus
                style={{
                  ...verificationStyles.input,
                  ...(isValidInput ? verificationStyles.inputValid : {}),
                  ...(error && emailOrPhone
                    ? verificationStyles.inputInvalid
                    : {}),
                }}
              />

              {isValidInput && (
                <div style={verificationStyles.validIcon}>
                  <CheckCircle size={20} />
                </div>
              )}
            </div>

            <p style={verificationStyles.helpText}>
              {isPhone
                ? `Detected: ${formatPhoneForDisplay(emailOrPhone)}`
                : isEmail
                  ? `Detected: ${emailOrPhone}`
                  : 'Email: user@example.com | Phone: 10 digits'}
            </p>
          </div>
        ) : (
          /* OTP INPUT SECTION */
          <>
            <div style={verificationStyles.otpSection}>
              <label style={verificationStyles.otpLabel}>Enter OTP</label>
              <p style={verificationStyles.otpInfo}>
                We've sent a 6-digit code to{' '}
                {isEmail
                  ? emailOrPhone
                  : formatPhoneForDisplay(emailOrPhone)}
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    onOtpChange(value);
                  }
                }}
                placeholder="000000"
                disabled={false}
                autoFocus
                style={{
                  ...verificationStyles.otpInput,
                  ...(otp.length === 6
                    ? verificationStyles.otpInputValid
                    : {}),
                  ...(error && otp
                    ? verificationStyles.otpInputInvalid
                    : {}),
                }}
              />
            </div>

            <div style={verificationStyles.resendSection}>
              {resendTimer > 0 ? (
                <p style={verificationStyles.resendTimer}>
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={isLoading || resendCount >= 3}
                  style={{
                    ...verificationStyles.resendButton,
                    ...(isLoading || resendCount >= 3
                      ? verificationStyles.resendButtonDisabled
                      : {}),
                  }}
                >
                  Resend OTP {resendCount > 0 && `(${resendCount}/3)`}
                </button>
              )}
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div style={verificationStyles.errorBox}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, lineHeight: '1.4' }}>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            otpSent
              ? otp.length !== 6 || isLoading
              : !isValidInput || isLoading
          }
          style={{
            ...verificationStyles.button,
            ...(otpSent
              ? otp.length !== 6 || isLoading
              : !isValidInput || isLoading)
              ? verificationStyles.buttonDisabled
              : {},
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

        {!otpSent && resendCount >= 3 && (
          <p
            style={{
              textAlign: 'center',
              color: '#dc2626',
              fontSize: '0.85rem',
              margin: '0.5rem 0 0 0',
            }}
          >
            ⚠️ Maximum attempts reached. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
}