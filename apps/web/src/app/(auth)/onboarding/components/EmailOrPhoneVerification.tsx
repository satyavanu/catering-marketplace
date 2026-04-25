'use client';

import React, { useRef, useEffect } from 'react';
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
  clearError?: () => void;
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
  clearError
}: EmailOrPhoneVerificationProps) {
  const otpRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (error && otp.length < 6) {
      clearError?.();
    }
  }, [otp]);

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

  const otpArray = Array.from({ length: 6 }, (_, i) => otp[i] || "");

  const formatPhoneForDisplay = (phone: string) => {
    const d = phone.replace(/\D/g, '');
    if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
    return phone;
  };

  // ✔ FINAL CORRECT BUTTON RULES
  const canSendOtp =
    !otpSent &&
    isValidInput &&
    !isLoading &&
    resendCount < 3;

  const isOtpNumeric = /^[0-9]{6}$/.test(otp);

  const canVerifyOtp =
    otpSent &&
    isOtpNumeric &&
    !isLoading &&
    !error;

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
          👋 Welcome to Droooly
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
          Verify your identity to get started
        </p>
      </div>

      <form
        onSubmit={otpSent ? onVerifyOtp : onSendOtp}
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
                  color: '#667eea'
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
                      value = digits.replace(/(\d{5})(\d{1,5})/, "$1 $2");
                    }
                  }
                  onEmailOrPhoneChange(value);
                }}
                placeholder="you@example.com or 98765 43210"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e5e7eb',
                  ...(isValidInput && {
                    borderColor: '#10b981',
                    background: '#f0fdf4'
                  })
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
                    color: '#10b981'
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
                border: '1px solid #e5e7eb'
              }}
            >
              <label style={{ fontWeight: 600 }}>Enter OTP</label>

              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Sent to {isEmail ? emailOrPhone : formatPhoneForDisplay(emailOrPhone)}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  marginTop: '1rem'
                }}
              >
                {otpArray.map((v, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    value={v}
                    inputMode="numeric"
                    ref={(el) => (otpRefs.current[i] = el!)}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '');
                      const arr = [...otpArray];

                      if (d === '') arr[i] = '';
                      else {
                        arr[i] = d[0];
                        if (i < 5) otpRefs.current[i + 1]?.focus();
                      }

                      onOtpChange(arr.join(''));
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
                          background: '#fee2e2'
                        })
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
              color: '#dc2626'
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
            opacity: otpSent ? (!canVerifyOtp ? 0.5 : 1) : (!canSendOtp ? 0.5 : 1),
            cursor:
              otpSent
                ? canVerifyOtp
                  ? 'pointer'
                  : 'not-allowed'
                : canSendOtp
                ? 'pointer'
                : 'not-allowed'
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
