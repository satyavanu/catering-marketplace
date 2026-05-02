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

      router.push('/partner');
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
          <div style={styles.loadingMark}>D</div>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.authShell}>
        <div style={styles.card}>
          <div style={styles.header}>
            <p style={styles.eyebrow}>Secure access</p>
            <h2 style={styles.title}>
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={styles.subtitle}>
              {isSignup
                ? 'Sign up with your name and one verified contact method.'
                : 'Log in with your email or phone number.'}
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
              {loading
                ? 'Please wait...'
                : otpSent
                  ? isSignup
                    ? 'Verify & Sign Up'
                    : 'Verify & Login'
                  : 'Send OTP'}
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
                  label="Google"
                  provider="google"
                  loading={socialLoading === 'google'}
                  disabled={Boolean(socialLoading)}
                  onClick={() => handleSocialLogin('google')}
                />
                <SocialButton
                  label="Facebook"
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
    </main>
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
      style={{
        ...styles.socialButton,
        ...(disabled ? styles.disabledButton : {}),
      }}
    >
      <span
        style={provider === 'google' ? styles.googleIcon : styles.facebookIcon}
      >
        {provider === 'google' ? 'G' : 'f'}
      </span>
      {loading ? 'Connecting...' : label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 18px',
    background:
      'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  authShell: {
    width: '100%',
    maxWidth: 460,
  },
  card: {
    borderRadius: 24,
    padding: '30px 28px',
    background: '#ffffff',
    boxShadow: '0 24px 70px rgba(31, 41, 55, 0.22)',
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    margin: '0 0 7px',
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    margin: 0,
    fontSize: 30,
    color: '#111827',
    fontWeight: 850,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '8px 0 0',
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 1.55,
  },
  modeSwitch: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 6,
    padding: 5,
    borderRadius: 14,
    background: '#f4f0ff',
    marginBottom: 18,
  },
  modeButton: {
    border: 'none',
    borderRadius: 10,
    padding: '11px 14px',
    background: 'transparent',
    color: '#6b7280',
    fontWeight: 800,
    cursor: 'pointer',
  },
  modeButtonActive: {
    background: '#ffffff',
    color: '#5b21b6',
    boxShadow: '0 7px 18px rgba(91, 33, 182, 0.12)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    color: '#374151',
    fontSize: 13,
    fontWeight: 800,
  },
  input: {
    width: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '13px 14px',
    color: '#111827',
    fontSize: 15,
    outline: 'none',
    background: '#ffffff',
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 600,
  },
  consentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    background: '#f9fafb',
    border: '1px solid #eef2f7',
  },
  checkboxLabel: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 1.45,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginTop: 2,
    accentColor: '#7c3aed',
    flexShrink: 0,
  },
  inlineLink: {
    color: '#6d28d9',
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
    borderRadius: 14,
    padding: '14px 16px',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    fontSize: 15,
    fontWeight: 850,
    cursor: 'pointer',
    boxShadow: '0 14px 28px rgba(124, 58, 237, 0.26)',
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
    color: '#6d28d9',
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
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 700,
    margin: '21px 0 15px',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  socialButton: {
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#111827',
    borderRadius: 14,
    padding: '12px 14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    fontWeight: 800,
    cursor: 'pointer',
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4285f4',
    fontWeight: 900,
  },
  facebookIcon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1877f2',
    color: '#ffffff',
    fontWeight: 900,
    fontFamily: 'Arial, sans-serif',
  },
  loadingPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  loadingContent: {
    textAlign: 'center',
    color: '#ffffff',
  },
  loadingMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: '#ffffff',
    color: '#764ba2',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 900,
  },
  loadingText: {
    margin: '12px 0 0',
    color: '#ffffff',
  },
};
