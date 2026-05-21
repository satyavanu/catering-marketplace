'use client';

import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { ConfirmationResult, Auth } from 'firebase/auth';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import {
  BadgeCheck,
  CalendarCheck2,
  ChefHat,
  ClipboardList,
  Headphones,
  Loader2,
  ShieldCheck,
  Sparkles,
  Utensils,
  Zap,
} from 'lucide-react';
import PublicSupportShell from '@/components/PublicSupportShell';
import {
  createCampaignPartnerLead,
  getFirebaseClientApp,
} from '@/lib/campaign-partner-leads';
import {
  type City,
  useOnboardingLocations,
} from '@catering-marketplace/query-client';

const fallbackCities: City[] = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
].map((name) => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  latitude: 0,
  longitude: 0,
  timezone: 'Asia/Kolkata',
  serviceAreas: [],
}));

const partnerTypes = [
  { value: 'catering', label: 'Catering business' },
  { value: 'private_chef', label: 'Private chef' },
  { value: 'restaurant_events', label: 'Restaurant / hosted events' },
  { value: 'cloud_kitchen', label: 'Cloud kitchen' },
  { value: 'multi_service', label: 'Multiple services' },
];

type Step = 'details' | 'otp' | 'done';

let recaptchaVerifier: RecaptchaVerifier | null = null;

function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(-10);
  return digits.length === 10 ? `+91${digits}` : '';
}

function getAllCities(locations?: { countries: { states: { cities: City[] }[] }[] }) {
  const cities =
    locations?.countries.flatMap((country) =>
      country.states.flatMap((state) => state.cities)
    ) ?? [];

  return cities.length > 0
    ? [...cities].sort((a, b) => a.name.localeCompare(b.name))
    : fallbackCities;
}

function getRecaptchaVerifier(auth: Auth) {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'partner-onboarding-recaptcha',
      {
        size: 'invisible',
      }
    );
  }

  return recaptchaVerifier;
}

function resetRecaptchaVerifier() {
  recaptchaVerifier?.clear();
  recaptchaVerifier = null;
}

export default function PartnerOnboardingCampaign() {
  const { data: locations } = useOnboardingLocations();

  const cityOptions = useMemo(() => getAllCities(locations), [locations]);

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState('');
  const [cityName, setCityName] = useState('');
  const [partnerInterest, setPartnerInterest] = useState('catering');
  const [otp, setOtp] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const selectedCityName =
    cityOptions.find((city) => city.id === cityId)?.name || cityName;
  const normalizedPhone = normalizeIndianPhone(phone);

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

    if (!cityId) {
      setMessage('Please select your city.');
      return;
    }

    if (!accepted) {
      setMessage('Please accept the terms and privacy policy to continue.');
      return;
    }

    setIsSending(true);
    try {
      const auth = getAuth(getFirebaseClientApp());
      const verifier = getRecaptchaVerifier(auth);
      const result = await signInWithPhoneNumber(
        auth,
        normalizedPhone,
        verifier
      );
      setConfirmationResult(result);
      setStep('otp');
      setMessage(`OTP sent to ${normalizedPhone.replace('+91', '+91 ')}.`);
    } catch (error) {
      resetRecaptchaVerifier();
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not send OTP. Please check Firebase Phone sign-in setup.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (otp.replace(/\D/g, '').length !== 6) {
      setMessage('Enter the 6 digit OTP.');
      return;
    }

    if (!confirmationResult) {
      setMessage('Please request a fresh OTP before verifying.');
      return;
    }

    setIsVerifying(true);
    try {
      await confirmationResult.confirm(otp.replace(/\D/g, ''));
      await createCampaignPartnerLead({
        name: name.trim(),
        phone: normalizedPhone,
        city: selectedCityName,
        partnerType: partnerInterest,
      });
      setStep('done');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'OTP verification failed. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <PublicSupportShell contentMaxWidth={1360} logoOnlyHeader>
      <main className="campaignPage">
        <section className="campaignHero">
          <div className="heroCopy">
            <span className="kicker">
              <ShieldCheck size={16} />
              Curated partner marketplace
            </span>
            <h1>
              Get discovered by customers planning real food experiences.
            </h1>
            <p>
              Droooly connects trusted chefs, caterers and event food brands
              with high-intent customers, clear booking flows and launch-friendly
              platform fees.
            </p>

            <div className="valueGrid" aria-label="Droooly partner benefits">
              <ValuePoint
                icon={<Sparkles size={20} />}
                title="Get discovered"
                text="Reach customers searching for trusted food experiences in your city."
              />
              <ValuePoint
                icon={<CalendarCheck2 size={20} />}
                title="Quality leads"
                text="Receive real event requests with dates, guest counts and service context."
              />
              <ValuePoint
                icon={<ShieldCheck size={20} />}
                title="Build trust"
                text="Showcase your services, menus, reviews and previous work."
              />
              <ValuePoint
                icon={<BadgeCheck size={20} />}
                title="Lower platform cost"
                text="Launch with partner-friendly fees while your demand grows."
              />
              <ValuePoint
                icon={<ClipboardList size={20} />}
                title="Manage bookings"
                text="Use structured flows for catering, private chef and quote requests."
              />
              <ValuePoint
                icon={<Headphones size={20} />}
                title="Human support"
                text="Our partner team helps you get listed and improve your first enquiries."
              />
            </div>
          </div>

          <section id="partner-form" className="formPanel" aria-label="Partner registration form">
            <div id="partner-onboarding-recaptcha" />
            {step === 'done' ? (
              <div className="successState">
                <span>
                  <ShieldCheck size={34} />
                </span>
                <h2>Phone verified. You are on the partner list.</h2>
                <p>
                  Thanks, {name.trim()}. Our team will review your details and
                  contact you within 24 hours. We will help you choose the best
                  next step for {selectedCityName || 'your city'}.
                </p>
                <p className="successNote">
                  Keep your phone nearby. No full onboarding is needed from this
                  page right now.
                </p>
              </div>
            ) : (
              <>
                <div className="formHeader">
                  <span>
                    <BadgeCheck size={18} />
                    Verified lead capture
                  </span>
                  <h2>Register as a Droooly partner</h2>
                  <p>
                    Share a few details and verify your number. We will call
                    back with the right marketplace fit for your service.
                  </p>
                </div>

                {step === 'details' ? (
                  <form onSubmit={handleGetOtp} className="leadForm">
                    <label>
                      <span>Your name</span>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                    </label>

                    <label>
                      <span>Mobile number</span>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="10 digit mobile number"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </label>

                    <label>
                      <span>Primary city</span>
                      <select
                        value={cityId}
                        onChange={(event) => {
                          const nextCityId = event.target.value;
                          const nextCity = cityOptions.find(
                            (city) => city.id === nextCityId
                          );
                          setCityId(nextCityId);
                          setCityName(nextCity?.name || '');
                        }}
                      >
                        <option value="">Select city</option>
                        {cityOptions.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Main partner type</span>
                      <select
                        value={partnerInterest}
                        onChange={(event) =>
                          setPartnerInterest(event.target.value)
                        }
                      >
                        {partnerTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="consentRow">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                      />
                      <span>
                        I agree to Droooly's{' '}
                        <Link href="/terms-of-use">Terms</Link> and{' '}
                        <Link href="/privacy-policy">Privacy Policy</Link>.
                      </span>
                    </label>

                    {message ? <p className="formMessage">{message}</p> : null}

                    <button type="submit" disabled={isSending}>
                      {isSending ? <Loader2 className="spin" size={18} /> : null}
                      Get OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="leadForm">
                    <label>
                      <span>OTP sent to {normalizedPhone.replace('+91', '+91 ')}</span>
                      <input
                        value={otp}
                        onChange={(event) =>
                          setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        placeholder="Enter 6 digit OTP"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                    </label>

                    {message ? <p className="formMessage">{message}</p> : null}

                    <button type="submit" disabled={isVerifying}>
                      {isVerifying ? (
                        <Loader2 className="spin" size={18} />
                      ) : null}
                      Verify and submit
                    </button>
                    <button
                      className="textButton"
                      type="button"
                      onClick={() => {
                        setStep('details');
                        setOtp('');
                        setMessage('');
                        setConfirmationResult(null);
                      }}
                    >
                      Edit details
                    </button>
                  </form>
                )}
              </>
            )}
          </section>
        </section>

        <section className="pathGrid" aria-label="Droooly partner booking paths">
          <PartnerPath
            icon={<Utensils size={24} />}
            title="Catering orders"
            text="Receive structured event requests with city, date, guest count and menu context."
          />
          <PartnerPath
            icon={<ChefHat size={24} />}
            title="Private chef requests"
            text="Reach hosts looking for home dining, live counters and chef-led celebrations."
          />
          <PartnerPath
            icon={<ClipboardList size={24} />}
            title="Custom quotes"
            text="Quote confidently after customers share clearer requirements and budgets."
          />
          <PartnerPath
            icon={<Zap size={24} />}
            title="Instant booking"
            text="Package your best services so customers can move faster when availability is clear."
          />
        </section>

        <section className="campaignStrip">
          <div>
            <span>
              <CalendarCheck2 size={20} />
              Why partners choose Droooly
            </span>
            <h2>A more trusted way to find customers without heavy platform costs.</h2>
          </div>
          <div className="stripItems">
            <span>
              <ShieldCheck size={18} />
              Curated marketplace trust
            </span>
            <span>
              <Sparkles size={18} />
              Profile and listing support
            </span>
            <span>
              <Headphones size={18} />
              Human callback support
            </span>
          </div>
        </section>
      </main>

      <style jsx>{`
        .campaignPage {
          display: grid;
          gap: 24px;
        }

        .campaignHero {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(380px, 0.72fr);
          gap: 28px;
          align-items: center;
          padding: clamp(32px, 5vw, 58px);
          border-radius: 14px;
          background:
            radial-gradient(circle at 78% 18%, rgba(249, 115, 22, 0.13), transparent 18rem),
            radial-gradient(circle at 16% 18%, rgba(139, 92, 246, 0.15), transparent 20rem),
            linear-gradient(135deg, #fbfaff 0%, #fff7ed 52%, #ffffff 100%);
          overflow: hidden;
        }

        .heroCopy {
          max-width: 720px;
        }

        .kicker,
        .formHeader > span,
        .campaignStrip span,
        .stripItems span,
        .valuePointIcon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .kicker {
          margin-bottom: 18px;
          color: #7c3aed;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .heroCopy h1 {
          margin: 0;
          color: #111827;
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: 0;
        }

        .heroCopy p {
          max-width: 650px;
          margin: 20px 0 0;
          color: #475569;
          font-size: 18px;
          line-height: 1.72;
          font-weight: 650;
        }

        .valueGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .valuePoint {
          min-height: 156px;
          display: grid;
          gap: 9px;
          align-content: start;
          padding: 18px;
          border: 1px solid rgba(139, 92, 246, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
        }

        .valuePointIcon {
          width: 42px;
          height: 42px;
          justify-content: center;
          border-radius: 999px;
          background: #ecfdf5;
          color: #166534;
        }

        .valuePoint h3 {
          margin: 0;
          color: #111827;
          font-size: 15px;
          line-height: 1.25;
          font-weight: 950;
        }

        .valuePoint p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
          font-weight: 700;
        }

        .formPanel {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #e8eaf0;
          border-radius: 14px;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
          padding: 28px;
        }

        .formHeader {
          margin-bottom: 22px;
        }

        .formHeader > span {
          margin-bottom: 12px;
          color: #7c3aed;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .formHeader h2,
        .successState h2,
        .campaignStrip h2 {
          margin: 0;
          color: #111827;
          font-size: 25px;
          line-height: 1.22;
          font-weight: 950;
          letter-spacing: 0;
        }

        .formHeader p,
        .successState p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 700;
        }

        .leadForm {
          display: grid;
          gap: 15px;
        }

        .leadForm label:not(.consentRow) {
          display: grid;
          gap: 7px;
        }

        .leadForm label span {
          color: #334155;
          font-size: 12px;
          font-weight: 900;
        }

        .leadForm input,
        .leadForm select {
          width: 100%;
          min-height: 50px;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: #fff;
          padding: 0 14px;
          color: #111827;
          font-size: 14px;
          font-weight: 750;
          outline: none;
        }

        .leadForm input:focus,
        .leadForm select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
        }

        .consentRow {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #475569;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 750;
        }

        .consentRow input {
          width: 16px;
          min-height: 16px;
          margin-top: 2px;
          accent-color: #8b5cf6;
          flex: 0 0 auto;
        }

        .consentRow a {
          color: #7c3aed;
          font-weight: 900;
        }

        .formMessage {
          margin: 0;
          color: #be123c;
          font-size: 13px;
          font-weight: 850;
        }

        .leadForm button {
          min-height: 52px;
          border: 0;
          border-radius: 8px;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          color: #fff;
          font-size: 15px;
          font-weight: 950;
          cursor: pointer;
        }

        .leadForm button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .leadForm .textButton {
          min-height: auto;
          background: transparent;
          color: #7c3aed;
          font-size: 13px;
          text-decoration: underline;
        }

        .spin {
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        .successState {
          display: grid;
          gap: 18px;
          justify-items: start;
        }

        .successState > span {
          width: 64px;
          height: 64px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: #ecfdf5;
          color: #047857;
        }

        .successNote {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          background: #f0fdf4;
          color: #166534 !important;
        }

        .pathGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .pathCard {
          min-height: 168px;
          padding: 22px;
          border: 1px solid #e8eaf0;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
        }

        .pathIcon {
          width: 48px;
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #f3e8ff;
          color: #7c3aed;
        }

        .pathCard h3 {
          margin: 16px 0 8px;
          color: #111827;
          font-size: 16px;
          font-weight: 950;
        }

        .pathCard p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
          font-weight: 700;
        }

        .campaignStrip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 32px;
          border-radius: 14px;
          background: linear-gradient(135deg, #111827, #312e81);
          color: #fff;
        }

        .campaignStrip > div:first-child > span {
          margin-bottom: 10px;
          color: #fbcfe8;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .campaignStrip h2 {
          max-width: 560px;
          color: #fff;
        }

        .stripItems {
          display: grid;
          gap: 10px;
          min-width: 280px;
        }

        .stripItems span {
          color: #e0e7ff;
          font-size: 13px;
          font-weight: 850;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1020px) {
          .campaignHero {
            grid-template-columns: 1fr;
          }

          .pathGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .campaignHero {
            padding: 28px 20px;
          }

          .heroCopy h1 {
            font-size: 36px;
          }

          .valueGrid,
          .pathGrid {
            grid-template-columns: 1fr;
          }

          .formPanel {
            padding: 22px;
          }

          .campaignStrip {
            align-items: flex-start;
            flex-direction: column;
            padding: 24px;
          }

          .stripItems {
            min-width: 0;
          }
        }
      `}</style>
    </PublicSupportShell>
  );
}

function PartnerPath({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="pathCard">
      <span className="pathIcon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function ValuePoint({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="valuePoint">
      <span className="valuePointIcon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
