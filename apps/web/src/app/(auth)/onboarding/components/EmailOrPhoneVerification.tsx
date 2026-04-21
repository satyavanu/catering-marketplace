'use client';

import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

type VerificationType = 'email' | 'phone';

interface CountryCode {
  code: string;
  country: string;
}

interface EmailOrPhoneVerificationProps {
  verificationType: VerificationType;
  emailOrPhone: string;
  countryCode: string;
  otp: string;
  otpSent: boolean;
  resendTimer: number;
  resendCount: number;
  isLoading: boolean;
  error: string;
  onEmailOrPhoneChange: (value: string) => void;
  onCountryCodeChange?: (value: string) => void;
  onOtpChange: (value: string) => void;
  onSendOtp: (e: React.FormEvent) => Promise<void>;
  onVerifyOtp: (e: React.FormEvent) => Promise<void>;
  onChangeMethod: () => void;
  onResendOtp: () => Promise<void>;
  styles: { [key: string]: React.CSSProperties };
  countryCodes?: CountryCode[];
}

export default function EmailOrPhoneVerification({
  verificationType,
  emailOrPhone,
  countryCode,
  otp,
  otpSent,
  resendTimer,
  resendCount,
  isLoading,
  error,
  onEmailOrPhoneChange,
  onCountryCodeChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  onChangeMethod,
  onResendOtp,
  styles,
  countryCodes = [
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
  ],
}: EmailOrPhoneVerificationProps) {
  const isEmailVerification = verificationType === 'email';
  const isValidInput = isEmailVerification
    ? emailOrPhone.includes('@') && emailOrPhone.includes('.')
    : emailOrPhone.length >= 10;

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to Droooly</h1>
        <p style={styles.subtitle}>Start selling your delicious food today</p>
      </div>

      <form onSubmit={!otpSent ? onSendOtp : onVerifyOtp} style={styles.profileForm}>
        {!otpSent ? (
          <>
            <div style={styles.verificationTypeSelector}>
              <button
                type="button"
                onClick={() => {
                  if (verificationType !== 'email') {
                    onChangeMethod();
                  }
                }}
                style={{
                  ...styles.verificationTypeButton,
                  ...(isEmailVerification
                    ? styles.verificationTypeButtonActive
                    : styles.verificationTypeButtonInactive),
                }}
                onMouseEnter={(e) => {
                  if (!isEmailVerification) {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isEmailVerification) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => {
                  if (verificationType !== 'phone') {
                    onChangeMethod();
                  }
                }}
                style={{
                  ...styles.verificationTypeButton,
                  ...(verificationType === 'phone'
                    ? styles.verificationTypeButtonActive
                    : styles.verificationTypeButtonInactive),
                }}
                onMouseEnter={(e) => {
                  if (verificationType !== 'phone') {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (verificationType !== 'phone') {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                📱 Phone
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {isEmailVerification ? 'Email Address' : 'Phone Number'} *
              </label>

              {!isEmailVerification && onCountryCodeChange && (
                <div style={styles.phoneInputGroup}>
                  <select
                    value={countryCode}
                    onChange={(e) => onCountryCodeChange(e.target.value)}
                    style={styles.countryCodeSelect}
                    disabled={isLoading}
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={emailOrPhone}
                    onChange={(e) =>
                      onEmailOrPhoneChange(e.target.value.replace(/[^\d]/g, ''))
                    }
                    placeholder="10-digit phone number"
                    style={styles.input}
                    disabled={isLoading}
                    maxLength={10}
                    required
                  />
                </div>
              )}

              {isEmailVerification && (
                <input
                  type="email"
                  value={emailOrPhone}
                  onChange={(e) => onEmailOrPhoneChange(e.target.value)}
                  placeholder="your.email@example.com"
                  style={styles.input}
                  disabled={isLoading}
                  required
                />
              )}
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !isValidInput}
              style={{
                ...styles.submitButton,
                opacity: isLoading || !isValidInput ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && isValidInput) {
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
            <div style={styles.infoBox}>
              <AlertCircle
                size={20}
                color="#0284c7"
                style={{ marginRight: '0.75rem' }}
              />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
                Check your {isEmailVerification ? 'email' : 'phone'} for the OTP
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Enter OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => onOtpChange(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="6-digit OTP"
                style={styles.input}
                disabled={isLoading}
                maxLength={6}
                required
              />
              <p style={styles.otpSentText}>
                OTP sent to {isEmailVerification ? emailOrPhone : `${countryCode} ${emailOrPhone}`}
              </p>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
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
              onClick={onChangeMethod}
              disabled={isLoading}
              style={styles.backButton}
            >
              Use {isEmailVerification ? 'Phone' : 'Email'} Instead
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
                onClick={onResendOtp}
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
    </>
  );
}