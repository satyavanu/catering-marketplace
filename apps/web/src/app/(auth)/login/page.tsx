'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import {
  sendOtpApi,
  useCompleteOnboarding,
} from '@catering-marketplace/query-client';

declare module 'next-auth' {
  interface User {
    role?: string | null;
    isOnboardingCompleted?: boolean;
    isOnboardingPending?: boolean;
    onboarding?: {
      status: 'pending' | 'in_progress' | 'completed';
      selectedRole?: string;
    };
  }

  interface Session {
    user?: {
      accessToken: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      isOnboardingCompleted?: boolean;
      isOnboardingPending?: boolean;
      refreshToken?: any;
      termsAccepted: boolean;
      privacyAccepted: boolean;
      marketingEmail?: boolean;
      marketingSms?: boolean;
      marketingPush?: boolean;
      onboarding?: {
        status: 'pending' | 'in_progress' | 'completed';
        selectedRole?: string;
      };
    };
  }
}

type AuthMode = 'login' | 'signup';
type ContactMethod = 'email' | 'phone' | 'invalid';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const SOCIAL_ICONS = {
  google:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  facebook:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
};

const getAccountHomePath = (role?: string | null) => {
  if (role === 'customer') return '/customer';
  if (role === 'admin' || role === 'super_admin') return '/admin';
  return '/partner';
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const completeOnboardingMutation = useCompleteOnboarding();
  const otpInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(true);
  const [marketingSms, setMarketingSms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = window.setInterval(() => {
      setResendTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (isRedirecting) return;

    if (status === 'authenticated' && session?.user && mounted) {
      setIsRedirecting(true);
      /*
      if (
        session.user.termsAccepted === false ||
        session.user.privacyAccepted === false
      ) {
        router.push('/accept-terms');
        return;
      } */

      router.push(getAccountHomePath(session.user.role));
    }
  }, [status, session, mounted, router, isRedirecting]);

  const contactMethod = useMemo<ContactMethod>(() => {
    const value = contact.trim();
    const digits = value.replace(/\D/g, '');

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'email';
    if (
      digits.length === 10 ||
      (digits.startsWith('91') && digits.length === 12)
    ) {
      return 'phone';
    }

    return 'invalid';
  }, [contact]);

  const normalizedContact = useMemo(() => {
    const value = contact.trim();

    if (contactMethod === 'email') {
      return {
        email: value.toLowerCase(),
      };
    }

    const digits = value.replace(/\D/g, '');
    return {
      phone:
        digits.startsWith('91') && digits.length === 12
          ? `+${digits}`
          : `+91${digits}`,
    };
  }, [contact, contactMethod]);

  const contactPreview =
    contactMethod === 'email'
      ? normalizedContact.email || ''
      : contactMethod === 'phone'
        ? normalizedContact.phone?.replace(
            /^\+91(\d{5})(\d{0,5})$/,
            '+91 $1 $2'
          ) || ''
        : contact.trim();

  const isSignup = authMode === 'signup';
  const canSendOtp =
    contactMethod !== 'invalid' &&
    !loading &&
    !otpSent &&
    (!isSignup || (fullName.trim().length >= 2 && termsAccepted));
  const canVerifyOtp = otpSent && otp.length === OTP_LENGTH && !loading;
  const canResend = otpSent && resendTimer === 0 && !loading;

  const resetOtpState = () => {
    setOtp('');
    setOtpSent(false);
    setResendTimer(0);
    setError('');
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    resetOtpState();
  };

  const sendOtp = async () => {
    if (!canSendOtp && !canResend) return;

    setError('');
    setLoading(true);

    try {
      const result = await sendOtpApi({
        ...normalizedContact,
        intent: authMode,
        ...(isSignup ? { full_name: fullName.trim() } : {}),
      });

      if (!result.success) {
        setError(result.error || 'Unable to send OTP. Please try again.');
        return;
      }

      setOtpSent(true);
      setOtp('');
      setResendTimer(RESEND_SECONDS);

      window.setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError('Unable to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!canVerifyOtp) return;

    setError('');
    setLoading(true);

    try {
      const provider = contactMethod === 'email' ? 'email-otp' : 'phone-otp';
      const result = await signIn(provider, {
        ...normalizedContact,
        otp,
        intent: authMode,
        ...(isSignup ? { full_name: fullName.trim() } : {}),
        redirect: false,
      });

      if (!result?.ok) {
        setError('Invalid OTP. Please check the code and try again.');
        return;
      }

      if (isSignup) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: fullName.trim(),
            ...normalizedContact,
            termsAccepted: true,
            privacyAccepted: true,
            marketingEmail,
            marketingSms,
            marketingPush: false,
          },
        });

        try {
          await completeOnboardingMutation.mutateAsync({
            agreeTerms: true,
            agreePrivacy: true,
            emailMarketing: marketingEmail,
            smsMarketing: marketingSms,
            pushNotifications: false,
          });
        } catch (consentError) {
          console.error('Consent save error:', consentError);
        }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Unable to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setError('');

    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/partner',
      });

      if (result?.error) {
        setError(`Failed to sign in with ${provider}. Please try again.`);
      }
    } catch (err) {
      console.error('Social login error:', err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  if (!mounted || status === 'loading') {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingContent}>
          <Spinner />
          <p style={styles.loadingText}>Loading...</p>
        </div>
        <style>{spinnerStyles}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={styles.authShell}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              {isSignup ? 'Start with Droooly' : 'Welcome back'}
            </h2>
            <p style={styles.subtitle}>
              {isSignup
                ? 'Tell us where to send your one-time code and we will set up your account.'
                : 'Use your email or mobile number to get a one-time login code.'}
            </p>
          </div>

          <div style={styles.modeSwitch} aria-label="Authentication mode">
            <button
              type="button"
              onClick={() => switchAuthMode('login')}
              style={{
                ...styles.modeButton,
                ...(authMode === 'login' ? styles.modeButtonActive : {}),
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode('signup')}
              style={{
                ...styles.modeButton,
                ...(authMode === 'signup' ? styles.modeButtonActive : {}),
              }}
            >
              Sign Up
            </button>
          </div>

          <form
            style={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              if (otpSent) {
                verifyOtp();
              } else {
                sendOtp();
              }
            }}
          >
            {isSignup && (
              <label style={styles.label}>
                <span>Full name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  disabled={otpSent || loading}
                  placeholder="Your full name"
                  style={styles.input}
                />
              </label>
            )}

            <label style={styles.label}>
              <span>Email or phone</span>
              <input
                type="text"
                value={contact}
                onChange={(event) => {
                  setContact(event.target.value);
                  if (otpSent) resetOtpState();
                }}
                disabled={loading}
                placeholder="you@example.com or 98765 43210"
                style={styles.input}
              />
              {contact.trim() && (
                <small style={styles.helperText}>
                  {contactMethod === 'invalid'
                    ? 'Enter a valid email or 10-digit mobile number.'
                    : `Using ${
                        contactMethod === 'email' ? 'email' : 'phone'
                      } verification.`}
                </small>
              )}
            </label>

            {otpSent && (
              <label style={styles.label}>
                <span>Verification code</span>
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={OTP_LENGTH}
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)
                    )
                  }
                  placeholder={`Enter the ${OTP_LENGTH}-digit OTP`}
                  style={styles.input}
                />
                <small style={styles.helperText}>
                  Sent to {contactPreview}
                </small>
              </label>
            )}

            {isSignup && (
              <div style={styles.consentBox}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    style={styles.checkbox}
                  />
                  <span>
                    I accept the{' '}
                    <Link href="/terms-of-use" style={styles.inlineLink}>
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy" style={styles.inlineLink}>
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={marketingEmail}
                    onChange={(event) =>
                      setMarketingEmail(event.target.checked)
                    }
                    style={styles.checkbox}
                  />
                  <span>
                    Send me offers, product updates, and marketing emails.
                  </span>
                </label>

                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={marketingSms}
                    onChange={(event) => setMarketingSms(event.target.checked)}
                    style={styles.checkbox}
                  />
                  <span>Send me SMS or WhatsApp updates about my account.</span>
                </label>
              </div>
            )}

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              type="submit"
              disabled={otpSent ? !canVerifyOtp : !canSendOtp}
              style={{
                ...styles.primaryButton,
                ...((otpSent ? !canVerifyOtp : !canSendOtp)
                  ? styles.disabledButton
                  : {}),
              }}
            >
              {loading && <Spinner size={16} tone="light" />}
              <span>
                {loading
                  ? 'Please wait'
                  : otpSent
                    ? isSignup
                      ? 'Verify & Create Account'
                      : 'Verify & Login'
                    : 'Send OTP'}
              </span>
            </button>

            {otpSent && (
              <div style={styles.resendRow}>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={sendOtp}
                  style={{
                    ...styles.textButton,
                    ...(!canResend ? styles.disabledTextButton : {}),
                  }}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={resetOtpState}
                  disabled={loading}
                  style={styles.textButton}
                >
                  Change contact
                </button>
              </div>
            )}
          </form>

          {!isSignup && (
            <>
              <div style={styles.divider}>
                <span /> or continue with <span />
              </div>

              <div style={styles.socialGrid}>
                <SocialButton
                  label="Continue with Google"
                  provider="google"
                  loading={socialLoading === 'google'}
                  disabled={Boolean(socialLoading)}
                  onClick={() => handleSocialLogin('google')}
                />
                <SocialButton
                  label="Continue with Facebook"
                  provider="facebook"
                  loading={socialLoading === 'facebook'}
                  disabled={Boolean(socialLoading)}
                  onClick={() => handleSocialLogin('facebook')}
                />
              </div>
            </>
          )}
        </div>
      </section>
      <style>{spinnerStyles}</style>
    </div>
  );
}

function SocialButton({
  label,
  provider,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  provider: 'google' | 'facebook';
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`auth-social-button auth-social-button-${provider}`}
      style={{
        ...styles.socialButton,
        ...(provider === 'facebook' ? styles.facebookButton : {}),
        ...(disabled ? styles.disabledButton : {}),
      }}
    >
      {loading ? (
        <Spinner size={18} tone={provider === 'facebook' ? 'light' : 'dark'} />
      ) : (
        <img
          src={SOCIAL_ICONS[provider]}
          alt=""
          aria-hidden="true"
          style={styles.socialIcon}
        />
      )}
      <span>{loading ? 'Connecting...' : label}</span>
    </button>
  );
}

function Spinner({
  size = 30,
  tone = 'dark',
}: {
  size?: number;
  tone?: 'dark' | 'light';
}) {
  return (
    <span
      aria-hidden="true"
      className="auth-spinner"
      style={{
        width: size,
        height: size,
        borderColor:
          tone === 'light'
            ? 'rgba(255, 255, 255, 0.36)'
            : 'rgba(91, 33, 182, 0.18)',
        borderTopColor: tone === 'light' ? '#ffffff' : '#5b21b6',
      }}
    />
  );
}

const spinnerStyles = `
  .auth-spinner {
    display: inline-block;
    border-width: 3px;
    border-style: solid;
    border-radius: 999px;
    animation: auth-spin 0.75s linear infinite;
    flex: 0 0 auto;
  }

  .auth-social-button {
    transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  }

  .auth-social-button:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  }

  .auth-social-button-google:not(:disabled):hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .auth-social-button-facebook:not(:disabled):hover {
    background: #166fe5;
  }

  @keyframes auth-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  authShell: {
    width: '100%',
    maxWidth: 440,
    margin: 0,
    padding: 0,
  },
  card: {
    borderRadius: 18,
    padding: '2px 26px 24px',
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.95)',
    boxShadow: '0 22px 60px rgba(15, 23, 42, 0.12)',
  },
  header: {
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: '#111827',
    fontWeight: 850,
    letterSpacing: 0,
  },
  subtitle: {
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.5,
  },
  modeSwitch: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 6,
    padding: 5,
    borderRadius: 12,
    background: '#f1f5f9',
    marginBottom: 16,
  },
  modeButton: {
    border: 'none',
    borderRadius: 8,
    padding: '10px 14px',
    background: 'transparent',
    color: '#64748b',
    fontWeight: 800,
    cursor: 'pointer',
  },
  modeButtonActive: {
    background: '#ffffff',
    color: '#334155',
    boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    color: '#334155',
    fontSize: 13,
    fontWeight: 800,
  },
  input: {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    padding: '12px 13px',
    color: '#0f172a',
    fontSize: 15,
    outline: 'none',
    background: '#f8fafc',
    boxShadow: 'inset 0 1px 1px rgba(15, 23, 42, 0.03)',
  },
  helperText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 600,
  },
  consentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 13,
    borderRadius: 12,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  checkboxLabel: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.45,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginTop: 2,
    accentColor: '#5b21b6',
    flexShrink: 0,
  },
  inlineLink: {
    color: '#5b21b6',
    fontWeight: 800,
    textDecoration: 'none',
  },
  errorText: {
    margin: 0,
    color: '#dc2626',
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 700,
  },
  primaryButton: {
    border: 'none',
    borderRadius: 10,
    padding: '13px 16px',
    color: '#ffffff',
    background: '#5b21b6',
    fontSize: 15,
    fontWeight: 850,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(91, 33, 182, 0.22)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.55,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  resendRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
  },
  textButton: {
    border: 'none',
    background: 'transparent',
    color: '#5b21b6',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    padding: 0,
  },
  disabledTextButton: {
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  divider: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: 12,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 700,
    margin: '18px 0 13px',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 10,
  },
  socialButton: {
    border: '1px solid #dbe2ea',
    background: '#ffffff',
    color: '#0f172a',
    borderRadius: 10,
    padding: '11px 13px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
  },
  facebookButton: {
    background: '#1877f2',
    color: '#ffffff',
    borderColor: '#1877f2',
  },
  socialIcon: {
    width: 18,
    height: 18,
    display: 'block',
  },
  loadingPage: {
    width: '100%',
    minHeight: 260,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    textAlign: 'center',
    color: '#334155',
  },
  loadingText: {
    margin: '12px 0 0',
    color: '#475569',
    fontWeight: 800,
  },
};
