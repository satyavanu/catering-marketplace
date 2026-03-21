'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('chef@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication
    if (email && password) {
      setTimeout(() => {
        localStorage.setItem('authToken', JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        }));
        router.push('/account');
      }, 1000);
    } else {
      setError('Please fill in all fields');
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);

    // Mock social login
    setTimeout(() => {
      localStorage.setItem('authToken', JSON.stringify({
        email: `user@${provider}.com`,
        provider: provider,
        loginTime: new Date().toISOString(),
      }));
      setSocialLoading(null);
      router.push('/account');
    }, 1500);
  };

  const SocialLoginButton = ({
    provider,
    icon: IconComponent,
    label,
    bgColor,
    bgHoverColor,
    borderColor,
  }: {
    provider: string;
    icon: React.ComponentType<{ style?: React.CSSProperties }>;
    label: string;
    bgColor: string;
    bgHoverColor: string;
    borderColor: string;
  }) => {
    const Icon = IconComponent;
    return (
      <button
        type="button"
        onClick={() => handleSocialLogin(provider)}
        disabled={socialLoading !== null}
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          backgroundColor: bgColor,
          color: 'white',
          border: `2px solid ${borderColor}`,
          borderRadius: '0.5rem',
          fontWeight: '600',
          cursor: socialLoading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          opacity: socialLoading && socialLoading !== provider ? 0.5 : 1,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
        onMouseEnter={(e) => {
          if (!socialLoading) {
            e.currentTarget.style.backgroundColor = bgHoverColor;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.15)`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bgColor;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Icon style={{ width: '18px', height: '18px' }} />
        {socialLoading === provider ? `Connecting...` : label}
      </button>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'row',
        '@media (max-width: 1024px)': {
          flexDirection: 'column',
        },
      } as any}
    >
      {/* Left Side - Brand Section (Desktop) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: "0 auto",
          color: 'white',
          '@media (max-width: 1024px)': {
            display: 'none',
          },
        } as any}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div
            style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            🍽️
          </div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >
            CaterHub
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              opacity: 0.9,
              lineHeight: '1.6',
            }}
          >
            Connect with exceptional catering services and create unforgettable culinary experiences.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginTop: '2rem',
              '@media (max-width: 1024px)': {
                gridTemplateColumns: '1fr',
              },
            } as any}
          >
            {[
              { emoji: '⭐', text: '4.9/5 Avg Rating' },
              { emoji: '👨‍🍳', text: '1000+ Caterers' },
              { emoji: '🎉', text: '50K+ Events' },
              { emoji: '🌍', text: '50+ Countries' },
            ].map((stat) => (
              <div key={stat.text} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                  {stat.emoji}
                </div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem',
          minHeight: '100vh',
          '@media (max-width: 768px)': {
            padding: '1rem',
            minHeight: 'auto',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          },
        } as any}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            '@media (max-width: 640px)': {
              maxWidth: '100%',
            },
          } as any}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem',
                '@media (max-width: 640px)': {
                  fontSize: '1.5rem',
                },
              } as any}
            >
              Welcome Back
            </h2>
            <p
              style={{
                color: '#ffffff',
                fontSize: '0.875rem',
                '@media (max-width: 640px)': {
                  fontSize: '0.8125rem',
                },
              } as any}
            >
              Sign in to your catering dashboard and manage your events
            </p>
          </div>

          {/* Email & Password Form */}
          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <EnvelopeIcon
                  style={{
                    width: '18px',
                    height: '18px',
                    color: '#9ca3af',
                    flexShrink: 0,
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LockClosedIcon
                  style={{
                    width: '18px',
                    height: '18px',
                    color: '#9ca3af',
                    flexShrink: 0,
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fee2e2',
                  borderRadius: '0.5rem',
                  color: '#991b1b',
                  fontSize: '0.875rem',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                '@media (max-width: 640px)': {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                },
              } as any}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#fff',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  style={{ cursor: 'pointer', accentColor: '#fff' }}
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#764ba2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#667eea')}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: loading || socialLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                opacity: loading || socialLoading ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading && !socialLoading) {
                  e.currentTarget.style.backgroundColor = '#764ba2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Signing in...' : 'Sign In with Email'}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '2rem 0',
              color: '#d1d5db',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span
              style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Social Login Section */}
          <div style={{ marginBottom: '2rem' }}>
            <p
              style={{
                textAlign: 'center',
                color: '#ffffff',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                fontWeight: '500',
              }}
            >
              You can also login with
            </p>

            {/* Social Login Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
                '@media (max-width: 640px)': {
                  gridTemplateColumns: '1fr',
                },
              } as any}
            >
              <SocialLoginButton
                provider="google"
                icon={({ style }) => (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={style}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="10">
                      G
                    </text>
                  </svg>
                )}
                label="Google"
                bgColor="#4285f4"
                bgHoverColor="#357ae8"
                borderColor="#4285f4"
              />
              <SocialLoginButton
                provider="facebook"
                icon={({ style }) => (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={style}
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                label="Facebook"
                bgColor="#1877f2"
                bgHoverColor="#166fe5"
                borderColor="#1877f2"
              />
              <SocialLoginButton
                provider="apple"
                icon={({ style }) => (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={style}
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.3-.93 3.58-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.54 3.09l-.42.02zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                )}
                label="Apple"
                bgColor="#000000"
                bgHoverColor="#333333"
                borderColor="#000000"
              />
            </div>
          </div>

          {/* Sign Up Link */}
          <p
            style={{
              textAlign: 'center',
              color: '#ffffff',
              fontSize: '0.875rem',
            }}
          >
            Don't have an account?{' '}
            <Link
              href="/signup"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#764ba2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#667eea')}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div {
            flex-direction: column !important;
          }
        }

        @media (max-width: 768px) {
          div {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}