'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import {
  Check,
  Facebook,
  Instagram,
  Loader2,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  useCreateCampaignLead,
  useSendOtp,
  useVerifyOtp,
} from '@catering-marketplace/query-client';

const SUPPORT_PHONE = '+91 81242 22266';

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyBvP1Fm5zzBXbJW442ITudkE4VruGjtIjs',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'droooly.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'droooly',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'droooly.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '118844553260',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:118844553260:web:83106d771be8cb55673989',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-E07TF5FRFW',
};

type Step = 'details' | 'otp' | 'done';

async function getFirebaseMessagingToken() {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!vapidKey || typeof window === 'undefined') return undefined;
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return undefined;
  }

  const permission =
    Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission;

  if (permission !== 'granted') return undefined;

  const [{ initializeApp, getApps }, { getMessaging, getToken }] =
    await Promise.all([import('firebase/app'), import('firebase/messaging')]);

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const registration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js'
  );
  const messaging = getMessaging(app);

  return getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
}

function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(-10);
  return digits.length === 10 ? `+91${digits}` : '';
}

export default function PartnerOnboardingCampaign() {
  const searchParams = useSearchParams();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const createLead = useCreateCampaignLead();

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [otp, setOtp] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [message, setMessage] = useState('');

  const campaignMeta = useMemo(
    () => ({
      campaign: searchParams.get('utm_campaign') || 'partner-onboarding',
      source: searchParams.get('utm_source') || 'droooly-campaign',
      medium: searchParams.get('utm_medium') || 'organic',
      term: searchParams.get('utm_term') || undefined,
      content: searchParams.get('utm_content') || undefined,
    }),
    [searchParams]
  );

  const normalizedPhone = normalizeIndianPhone(phone);
  const isSending = sendOtp.isPending;
  const isVerifying = verifyOtp.isPending || createLead.isPending;

  const handleGetOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!name.trim()) {
      setMessage('Please enter your name.');
      return;
    }

    if (!normalizedPhone) {
      setMessage('Please enter a valid 10 digit mobile number.');
      return;
    }

    if (!accepted) {
      setMessage('Please accept the terms and privacy policy to continue.');
      return;
    }

    const response = await sendOtp.mutateAsync({
      phone: normalizedPhone,
      intent: 'partner_onboarding',
      full_name: name.trim(),
    });

    if (!response.success) {
      setMessage(response.error || response.message || 'Could not send OTP.');
      return;
    }

    setStep('otp');
    setMessage(`OTP sent to ${normalizedPhone.replace('+91', '+91 ')}.`);
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (otp.replace(/\D/g, '').length !== 6) {
      setMessage('Enter the 6 digit OTP.');
      return;
    }

    const response = await verifyOtp.mutateAsync({
      phone: normalizedPhone,
      otp: otp.replace(/\D/g, ''),
      intent: 'partner_onboarding',
      full_name: name.trim(),
    });

    if (!response.success) {
      setMessage(response.error || response.message || 'OTP verification failed.');
      return;
    }

    let fcmToken: string | undefined;
    try {
      fcmToken = await getFirebaseMessagingToken();
    } catch (error) {
      console.warn('[Campaign] FCM token capture failed', error);
    }

    try {
      await createLead.mutateAsync({
        ...campaignMeta,
        name: name.trim(),
        phone: normalizedPhone,
        city: city.trim() || undefined,
        fcm_token: fcmToken,
        notification_permission:
          typeof window !== 'undefined' && 'Notification' in window
            ? Notification.permission
            : 'unsupported',
        page_url:
          typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Phone verified, but we could not save the campaign lead.'
      );
      return;
    }

    setStep('done');
  };

  return (
    <main className="partnerCampaign">
      <header className="campaignHeader">
        <Link href="/" className="brand" aria-label="Droooly home">
          <img src="/logo.png" alt="Droooly" />
        </Link>
        <a className="supportLink" href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}>
          <Phone size={17} />
          Need help? Call {SUPPORT_PHONE}
        </a>
      </header>

      <section className="heroBand">
        <div className="heroInner">
          <div className="heroCopy">
            <p className="eyebrow">Droooly partner onboarding</p>
            <h1>
              Grow Catering, Chef, Quote and Instant Bookings with{' '}
              <span>Droooly</span>
            </h1>
            <p className="subcopy">
              Join early partner campaigns built for caterers, private chefs,
              cloud kitchens, restaurants, and event food teams who want more
              qualified demand.
            </p>
            <div className="channelGrid" aria-label="Droooly partner channels">
              <span>Catering orders</span>
              <span>Private chef requests</span>
              <span>Custom quotes</span>
              <span>Instant booking</span>
            </div>
            <div className="trustRow" aria-label="Campaign highlights">
              <span>
                <Check size={16} /> Verified customer intent
              </span>
              <span>
                <Check size={16} /> FCM follow-ups where available
              </span>
              <span>
                <Check size={16} /> Onboarding support
              </span>
            </div>
          </div>

          <section className="formPanel" aria-label="Register as a Droooly partner">
            {step === 'done' ? (
              <div className="successState">
                <span className="successIcon">
                  <ShieldCheck size={34} />
                </span>
                <h2>Phone verified. You are on the list.</h2>
                <p>
                  Thanks, {name.trim()}. Our team will review your details and
                  contact you within 24 hours with the next steps for catering,
                  chef, quote, or instant booking onboarding.
                </p>
                <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}>
                  Call support
                </a>
              </div>
            ) : (
              <>
                <h2>Register as a partner</h2>
                <p className="panelIntro">
                  Share your details below and we will reach out within 24 hours
                  to help you start with the right booking flow.
                </p>

                {step === 'details' ? (
                  <form onSubmit={handleGetOtp} className="leadForm">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Enter your mobile number"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="City or service area"
                      autoComplete="address-level2"
                    />
                    <label className="consentRow">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                      />
                      <span>
                        By selecting Get OTP, you agree to the{' '}
                        <Link href="/terms-of-use">Terms & Conditions</Link> and{' '}
                        <Link href="/privacy-policy">Privacy Policy</Link>.
                      </span>
                    </label>
                    {message && <p className="formMessage">{message}</p>}
                    <button type="submit" disabled={isSending}>
                      {isSending ? <Loader2 className="spin" size={18} /> : null}
                      Get OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="leadForm">
                    <input
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      placeholder="Enter 6 digit OTP"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                    {message && <p className="formMessage">{message}</p>}
                    <button type="submit" disabled={isVerifying}>
                      {isVerifying ? (
                        <Loader2 className="spin" size={18} />
                      ) : null}
                      Verify OTP
                    </button>
                    <button
                      className="textButton"
                      type="button"
                      onClick={() => {
                        setStep('details');
                        setOtp('');
                        setMessage('');
                      }}
                    >
                      Edit phone number
                    </button>
                  </form>
                )}
              </>
            )}
          </section>
        </div>
      </section>

      <section className="assistBand">
        <div>
          <h2>Need assistance? Talk to our experts.</h2>
          <p>Monday - Saturday, 9:30 AM to 6:30 PM</p>
        </div>
        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}>Call us at {SUPPORT_PHONE}</a>
      </section>

      <footer className="campaignFooter">
        <div className="footerTop">
          <Link href="/" className="footerBrand" aria-label="Droooly home">
            <img src="/logo.png" alt="Droooly" />
          </Link>
          <nav aria-label="Legal links">
            <Link href="/terms-of-use">Terms & conditions</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
          </nav>
          <div className="socials" aria-label="Social links">
            <span>Follow us on</span>
            <div>
              <a href="#" aria-label="Droooly Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Droooly Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Droooly Pinterest">
                P
              </a>
            </div>
          </div>
        </div>
        <p className="copyright">
          Copyright 2026 Droooly Labs Private Limited - All Rights Reserved
        </p>
      </footer>

      <style jsx>{`
        .partnerCampaign {
          min-height: 100vh;
          background: #fff;
          color: #0f172a;
        }

        .campaignHeader {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          height: 94px;
          padding: 0 clamp(20px, 11vw, 190px);
          background: #fff;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .brand,
        .footerBrand {
          display: inline-flex;
          align-items: center;
        }

        .brand img,
        .footerBrand img {
          width: 154px;
          height: auto;
          object-fit: contain;
        }

        .supportLink,
        .assistBand a,
        .successState a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #111827;
          text-decoration: none;
          font-weight: 800;
        }

        .heroBand {
          background:
            radial-gradient(circle at 17% 22%, rgba(255, 103, 88, 0.13), transparent 32%),
            linear-gradient(110deg, #fff1f1 0%, #fff 56%);
          min-height: 724px;
          display: flex;
          align-items: center;
        }

        .heroInner {
          width: min(1310px, calc(100% - 40px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) 475px;
          gap: clamp(40px, 7vw, 120px);
          align-items: center;
        }

        .eyebrow {
          margin: 0 0 16px;
          color: #e4473f;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .heroCopy h1 {
          max-width: 760px;
          margin: 0;
          font-size: clamp(42px, 5.1vw, 76px);
          line-height: 1.15;
          letter-spacing: 0;
          font-weight: 900;
        }

        .heroCopy h1 span {
          color: #ff5a52;
          white-space: nowrap;
        }

        .subcopy {
          max-width: 710px;
          margin: 28px 0 0;
          color: #111827;
          font-size: clamp(20px, 2vw, 26px);
          line-height: 1.35;
          font-weight: 800;
        }

        .channelGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          max-width: 650px;
          margin-top: 28px;
        }

        .channelGrid span {
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-left: 4px solid #ff5a52;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.76);
          padding: 14px 16px;
          color: #111827;
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        }

        .trustRow {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .trustRow span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 90, 82, 0.23);
          background: rgba(255, 255, 255, 0.7);
          padding: 10px 13px;
          border-radius: 8px;
          color: #374151;
          font-size: 14px;
          font-weight: 800;
        }

        .formPanel {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 18px;
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.13);
          padding: 38px;
        }

        .formPanel h2,
        .assistBand h2,
        .successState h2 {
          margin: 0;
          color: #030712;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: 0;
        }

        .panelIntro {
          margin: 12px 0 28px;
          color: #111827;
          font-size: 17px;
          line-height: 1.35;
          font-weight: 750;
        }

        .leadForm {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .leadForm input[type='text'],
        .leadForm input[type='tel'],
        .leadForm input:not([type]) {
          width: 100%;
          height: 64px;
          border: 1px solid #d9dee7;
          border-radius: 8px;
          padding: 0 20px;
          color: #111827;
          font-size: 17px;
          font-weight: 750;
          outline: none;
        }

        .leadForm input:focus {
          border-color: #ff5a52;
          box-shadow: 0 0 0 3px rgba(255, 90, 82, 0.12);
        }

        .consentRow {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 8px;
          color: #111827;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 700;
        }

        .consentRow input {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #ff5a52;
          flex: 0 0 auto;
        }

        .consentRow a {
          color: #2563eb;
        }

        .formMessage {
          margin: 0;
          color: #be123c;
          font-size: 14px;
          font-weight: 800;
        }

        .leadForm button,
        .successState a {
          min-height: 64px;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          background: #ff315f;
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .leadForm button:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .leadForm .textButton {
          min-height: auto;
          background: transparent;
          color: #475569;
          padding: 0;
          font-size: 14px;
          text-decoration: underline;
        }

        .spin {
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        .successState {
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: flex-start;
        }

        .successIcon {
          display: inline-flex;
          width: 64px;
          height: 64px;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: #e9fbf1;
          color: #047857;
        }

        .successState p {
          margin: 0;
          color: #475569;
          font-size: 17px;
          line-height: 1.55;
          font-weight: 700;
        }

        .assistBand {
          width: min(1290px, calc(100% - 40px));
          margin: 118px auto 40px;
          min-height: 170px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 36px 54px;
          border: 1px solid #ff5a72;
          border-radius: 16px;
          background: linear-gradient(100deg, #fff 0%, #fff4f4 100%);
        }

        .assistBand p {
          margin: 10px 0 0;
          color: #111827;
          font-size: 19px;
          font-weight: 650;
        }

        .assistBand a {
          font-size: 25px;
        }

        .campaignFooter {
          margin-top: 40px;
          background: #fff0f3;
          padding: 54px clamp(20px, 9vw, 160px) 34px;
        }

        .footerTop {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 32px;
          align-items: center;
          padding-bottom: 52px;
          border-bottom: 1px solid rgba(100, 116, 139, 0.22);
        }

        .footerTop nav {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .footerTop nav a {
          color: #111827;
          text-decoration: none;
          font-size: 17px;
          font-weight: 650;
        }

        .socials {
          justify-self: end;
        }

        .socials span {
          display: block;
          margin-bottom: 10px;
          color: #111827;
          font-weight: 900;
        }

        .socials div {
          display: flex;
          gap: 12px;
        }

        .socials a {
          width: 52px;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 14px;
          color: #ff315f;
          text-decoration: none;
          font-weight: 900;
          font-size: 20px;
        }

        .copyright {
          margin: 36px 0 0;
          text-align: center;
          color: #52525b;
          font-size: 16px;
          font-weight: 650;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 980px) {
          .campaignHeader {
            height: auto;
            padding: 22px 20px;
            align-items: flex-start;
            flex-direction: column;
          }

          .heroBand {
            min-height: auto;
            padding: 58px 0;
          }

          .heroInner {
            grid-template-columns: 1fr;
          }

          .formPanel {
            padding: 28px;
          }

          .assistBand,
          .footerTop {
            align-items: flex-start;
            grid-template-columns: 1fr;
            flex-direction: column;
          }

          .socials {
            justify-self: start;
          }
        }

        @media (max-width: 560px) {
          .supportLink {
            font-size: 14px;
          }

          .heroInner,
          .assistBand {
            width: calc(100% - 28px);
          }

          .heroCopy h1 {
            font-size: 39px;
          }

          .subcopy {
            font-size: 18px;
          }

          .channelGrid {
            grid-template-columns: 1fr;
          }

          .formPanel {
            padding: 22px;
            border-radius: 14px;
          }

          .formPanel h2,
          .assistBand h2,
          .successState h2 {
            font-size: 25px;
          }

          .assistBand {
            margin-top: 58px;
            padding: 28px 22px;
          }

          .assistBand a {
            font-size: 18px;
          }

          .campaignFooter {
            padding-top: 42px;
          }
        }
      `}</style>
    </main>
  );
}
