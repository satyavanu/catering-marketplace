'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('chef@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication - any email/password combination works
    if (email && password) {
      setTimeout(() => {
        // Store mock auth token
        localStorage.setItem('authToken', JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        }));
        router.push('/dashboard');
      }, 1000);
    } else {
      setError('Please fill in all fields');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('chef@example.com');
    setPassword('password123');
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
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Sign in to your catering dashboard
          </p>

          <form 
          autoComplete='off'
          onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

            {/* Remember & Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <input type="checkbox" style={{ cursor: 'pointer' }} />
                Remember me
              </label>
              <Link href="/forgot-password" style={{ color: '#f97316', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>
                Forgot password?
              </Link>
            </div>

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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#e5e7eb',
              color: '#1f2937',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginTop: '1rem',
            }}
          >
            Use Demo Credentials
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0', color: '#d1d5db' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Sign Up Link */}
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}