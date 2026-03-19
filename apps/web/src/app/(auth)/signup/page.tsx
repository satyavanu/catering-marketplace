'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.businessName) {
      setError('Business name is required');
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
    setTimeout(() => {
      // Store mock auth token
      localStorage.setItem('authToken', JSON.stringify({
        email: formData.email,
        businessName: formData.businessName,
        loginTime: new Date().toISOString(),
      }));
      router.push('/onboarding');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flex: 1 }}>
    

      {/* Right Side - Form */}
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
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Create Account
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Set up your catering business dashboard
          </p>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Business Name */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Catering Business"
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
                Email Address
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

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Password
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
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Confirm Password
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

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
              <input type="checkbox" required style={{ marginTop: '0.25rem', cursor: 'pointer' }} />
              I agree to the Terms of Service and Privacy Policy
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '2rem' }}>
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