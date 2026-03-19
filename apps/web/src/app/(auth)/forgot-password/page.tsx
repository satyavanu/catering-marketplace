'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual forgot password logic
      console.log('Forgot password for:', email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
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
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            🔐 Reset Password
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
            Don't worry, we'll help you get back in
          </p>
        </div>

        {!submitted ? (
          <>
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
            <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                  We'll send you a link to reset your password
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
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
              >
                {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div
            style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, marginBottom: '0.5rem' }}>
              ✅ Email Sent!
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Check your inbox for a link to reset your password
            </p>
          </div>
        )}

        {/* Back Link */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <Link
            href="/login"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}