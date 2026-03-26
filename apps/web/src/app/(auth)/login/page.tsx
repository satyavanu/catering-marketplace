'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';


/// <reference types="next-auth" />

import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user?.role && mounted) {
      const role = session?.user?.role || 'customer';
      const callbackUrl = searchParams?.get('callbackUrl');
      
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push(`/${role}/dashboard`);
      }
    }
  }, [session, mounted, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else if (result?.ok) {
        // Redirect will be handled by the redirect callback in auth.config.ts
        // which uses the role from the session
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    try {
      await signIn(provider, {
        redirect: true,
        // The redirect callback will handle role-based routing
      });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      setSocialLoading(null);
    }
  };

  const SocialLoginButton = ({
    provider,
    icon: IconComponent,
    label,
    bgColor,
    bgHoverColor,
    borderColor,
  }: {
    provider: 'google' | 'github' | 'apple';
    icon: React.ComponentType<{ style?: React.CSSProperties }>;
    label: string;
    bgColor: string;
    bgHoverColor: string;
    borderColor: string;
  }) => {
    const Icon = IconComponent;
    const isLoading = socialLoading === provider;

    return (
      <button
        type="button"
        onClick={() => {
          if (provider !== 'apple') {
            handleSocialLogin(provider as 'google' | 'github');
          }
        }}
        disabled={socialLoading !== null || provider === 'apple'}
        style={{
          flex: 1,
          padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
          backgroundColor: bgColor,
          color: 'white',
          border: `2px solid ${borderColor}`,
          borderRadius: '0.5rem',
          fontWeight: '600',
          cursor: 
            socialLoading !== null || provider === 'apple' 
              ? 'not-allowed' 
              : 'pointer',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          opacity: 
            (socialLoading && !isLoading) || provider === 'apple' 
              ? 0.5 
              : 1,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: '2.5rem',
        }}
        onMouseEnter={(e) => {
          if (!socialLoading && provider !== 'apple') {
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
        <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <span style={{ display: 'inline' }}>{isLoading ? `Connecting...` : label}</span>
      </button>
    );
  };

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🍽️</div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          padding: clamp(2rem, 5vw, 4rem);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          min-height: 100vh;
        }

        .form-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(1.5rem, 5vw, 2rem);
          min-height: 100vh;
          overflow-y: auto;
          background-color: #ffffff;
        }

        @media (max-width: 1024px) {
          .login-container {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .brand-section {
            display: none;
          }

          .form-section {
            min-height: 100vh;
            padding: clamp(1.5rem, 4vw, 2rem);
          }
        }

        @media (max-width: 768px) {
          .form-section {
            padding: clamp(1rem, 3vw, 1.5rem);
            min-height: auto;
            align-items: flex-start;
            padding-top: clamp(2rem, 8vw, 3rem);
            padding-bottom: clamp(2rem, 8vw, 3rem);
          }
        }

        @media (max-width: 480px) {
          .form-section {
            padding: 1rem;
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
        }
      `}</style>

      <div className="login-container">
        {/* Left Side - Brand Section (Desktop) */}
        <div className="brand-section">
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              🍽️
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
                fontWeight: 'bold',
                marginBottom: '1rem',
                lineHeight: '1.2',
              }}
            >
              CaterHub
            </h1>
            <p
              style={{
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
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
              }}
            >
              {[
                { emoji: '⭐', text: '4.9/5 Avg Rating' },
                { emoji: '👨‍🍳', text: '1000+ Caterers' },
                { emoji: '🎉', text: '50K+ Events' },
                { emoji: '🌍', text: '50+ Countries' },
              ].map((stat) => (
                <div key={stat.text} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: '0.5rem' }}>
                    {stat.emoji}
                  </div>
                  <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', opacity: 0.9 }}>
                    {stat.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-section">
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                }}
              >
                Welcome Back
              </h2>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
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
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
                    disabled={loading || socialLoading !== null}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: '#1f2937',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0.5rem 0 0 0',
                  }}
                >
                  Demo: demo@example.com
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
                    disabled={loading || socialLoading !== null}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: '#1f2937',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0.5rem 0 0 0',
                  }}
                >
                  Demo: password
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#fee2e2',
                    borderRadius: '0.5rem',
                    color: '#991b1b',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ flexShrink: 0 }}>⚠️</span>
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
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    color: '#1f2937',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ cursor: 'pointer', accentColor: '#667eea' }}
                    disabled={loading || socialLoading !== null}
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
                  padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading || socialLoading ? 'not-allowed' : 'pointer',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  opacity: loading || socialLoading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  minHeight: '2.75rem',
                  width: '100%',
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
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
                  color: '#1f2937',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: '0.75rem',
                }}
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
                      <text
                        x="12"
                        y="15"
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="10"
                      >
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
                  provider="github"
                  icon={({ style }) => (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={style}
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  label="GitHub"
                  bgColor="#333333"
                  bgHoverColor="#1a1a1a"
                  borderColor="#333333"
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
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  marginTop: '0.75rem',
                }}
              >
                Apple login coming soon
              </p>
            </div>

            {/* Sign Up Link */}
            <p
              style={{
                textAlign: 'center',
                color: '#1f2937',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
      </div>
    </>
  );
}