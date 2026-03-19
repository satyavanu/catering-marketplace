'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else {
      if (validateStep2()) {
        setLoading(true);
        try {
          // TODO: Implement actual registration logic
          console.log('Register attempt:', formData);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          // Redirect to OTP verification
        } catch (err) {
          setError('Registration failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
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
       

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2].map((num) => (
            <div
              key={num}
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: step >= num ? '#667eea' : '#e5e7eb',
                borderRadius: '2px',
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
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
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="firstName"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="lastName"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="phone"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </>
          )}

          {/* Step 2: Password & Terms */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      paddingRight: '2.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      fontSize: '1.2rem',
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                  At least 8 characters, mix of letters and numbers
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  style={{ marginRight: '0.75rem', marginTop: '0.25rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  I agree to the{' '}
                  <Link href="/terms" style={{ color: '#667eea', textDecoration: 'none' }}>
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {step === 2 && (
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                ← Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#cbd5e1' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#5568d3';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#667eea';
                }
              }}
            >
              {loading ? '⏳ Creating...' : step === 1 ? 'Next →' : '🎉 Create Account'}
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}