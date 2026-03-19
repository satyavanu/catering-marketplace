'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement OTP verification logic
      console.log('Verifying OTP:', otpCode);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '2.5rem',
          maxWidth: '450px',
          width: '100%',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            🛡️ Verify Identity
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
            Enter the code sent to your phone
          </p>
        </div>

        {/* Security Alert */}
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            color: '#92400e',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <p style={{ margin: 0, fontWeight: '600', marginBottom: '0.25rem' }}>
              Suspicious Activity Detected
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>
              We detected an unusual login attempt. Please verify it's you.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* OTP Inputs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: '500', marginBottom: '1rem' }}>
              Enter 6-digit code
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.5rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Time remaining
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: timeLeft < 60 ? '#ef4444' : '#667eea',
              }}
            >
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor:
                loading || otp.join('').length !== 6 ? '#cbd5e1' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: loading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (loading || otp.join('').length !== 6) return;
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              if (loading || otp.join('').length !== 6) return;
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            {loading ? '⏳ Verifying...' : '✅ Verify'}
          </button>
        </form>

        {/* Resend & Back Links */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            disabled={timeLeft > 0}
            style={{
              background: 'none',
              border: 'none',
              color: timeLeft > 0 ? '#cbd5e1' : '#667eea',
              cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              textDecoration: 'underline',
            }}
          >
            📧 Resend Code {timeLeft > 0 && `in ${formatTime(timeLeft)}`}
          </button>
          <Link
            href="/login"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}