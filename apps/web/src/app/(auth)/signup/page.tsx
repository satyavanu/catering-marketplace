'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Country codes list
const COUNTRY_CODES = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptPromotions: false,
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate phone number based on country code
  const isValidPhoneNumber = (countryCode: string, phone: string): boolean => {
    const phoneRegex: { [key: string]: RegExp } = {
      '+1': /^\d{10}$/, // US: 10 digits
      '+44': /^\d{10,11}$/, // UK: 10-11 digits
      '+91': /^\d{10}$/, // India: 10 digits
      '+86': /^\d{11}$/, // China: 11 digits
      '+81': /^\d{10}$/, // Japan: 10 digits
      '+33': /^\d{9}$/, // France: 9 digits
      '+49': /^\d{10,11}$/, // Germany: 10-11 digits
      '+39': /^\d{10}$/, // Italy: 10 digits
      '+34': /^\d{9}$/, // Spain: 9 digits
      '+61': /^\d{9}$/, // Australia: 9 digits
    };

    const regex = phoneRegex[countryCode] || /^\d{10,}$/;
    return regex.test(phone.replace(/\D/g, ''));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!isValidPhoneNumber(formData.countryCode, formData.phone)) {
      setError(`Invalid phone number for ${formData.countryCode}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd send OTP to email here
      // For now, we'll simulate it
      setUserEmail(formData.email);
      
      // Store temporary user data
      sessionStorage.setItem('tempSignupData', JSON.stringify(formData));
      
      // Move to OTP step
      setStep('otp');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd verify OTP with backend here
      // For demo, we'll accept any 6-digit code
      
      // Store user data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        acceptPromotions: formData.acceptPromotions,
        signupTime: new Date().toISOString(),
        verified: true,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', JSON.stringify({
        email: formData.email,
        token: `token_${Date.now()}`,
        loginTime: new Date().toISOString(),
      }));

      // Clear temporary data
      sessionStorage.removeItem('tempSignupData');
      
      // Move to success step
      setStep('success');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // FORM STEP
  if (step === 'form') {
    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Create Account
            </h2>
            <p style={{ color: '#fff', marginBottom: '2rem' }}>
              Join our catering marketplace
            </p>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* First Name */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Last Name */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Phone Number *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                  {/* Country Code Dropdown */}
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    style={{
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digits"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  Enter phone number without country code
                </p>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              {/* Terms & Conditions */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: '#fff' }}>
                <input type="checkbox" required style={{ marginTop: '0.25rem', cursor: 'pointer', minWidth: '1rem' }} />
                I agree to the Terms of Service and Privacy Policy *
              </label>

              {/* Accept Promotions */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#fff' }}>
                <input
                  type="checkbox"
                  name="acceptPromotions"
                  checked={formData.acceptPromotions}
                  onChange={handleChange}
                  style={{ marginTop: '0.25rem', cursor: 'pointer', minWidth: '1rem' }}
                />
                <span>
                  I'd like to receive promotional emails and offers from Catering Marketplace
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#f97316';
                }}
              >
                {loading ? 'Creating Account...' : 'Continue'}
              </button>
            </form>

            {/* Login Link */}
            <p style={{ textAlign: 'center', color: '#fff', fontSize: '0.875rem', marginTop: '2rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // OTP VERIFICATION STEP
  if (step === 'otp') {
    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                Verify Your Email
              </h2>
              <p style={{ color: '#fff' }}>
                We've sent a 6-digit OTP to<br />
                <strong>{userEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* OTP Input */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Enter OTP *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '2rem',
                    color: '#1f2937',
                    textAlign: 'center',
                    fontWeight: '600',
                    letterSpacing: '0.5rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#f97316';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: otp.length === 6 ? '#f97316' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (!loading && otp.length === 6) e.currentTarget.style.backgroundColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  if (!loading && otp.length === 6) e.currentTarget.style.backgroundColor = '#f97316';
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Resend OTP */}
              <p style={{ textAlign: 'center', color: '#fff', fontSize: '0.875rem' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setOtp('');
                    setError('OTP resent to your email');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#f97316',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textDecoration: 'underline',
                  }}
                >
                  Resend OTP
                </button>
              </p>
            </form>

            {/* Back Button */}
            <button
              onClick={() => {
                setStep('form');
                setOtp('');
                setError('');
              }}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'white',
                color: '#f97316',
                border: '2px solid #f97316',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STEP
  if (step === 'success') {
    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
            {/* Success Icon */}
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                display: 'inline-block',
                animation: 'bounce 0.6s ease-in-out',
              }}
            >
              🎉
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Welcome Aboard!
            </h2>

            <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Your account has been successfully created. You're all set to explore and order amazing catering services!
            </p>

            {/* Success Details */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '2rem',
              }}
            >
              <p style={{ color: '#15803d', fontSize: '0.875rem', margin: 0 }}>
                ✓ Email verified<br />
                ✓ Account active<br />
                ✓ Ready to order
              </p>
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ea580c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              Continue to Login
            </Link>

            {/* Home Link */}
            <Link
              href="/"
              style={{
                display: 'inline-block',
                width: '100%',
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'white',
                color: '#f97316',
                border: '2px solid #f97316',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}