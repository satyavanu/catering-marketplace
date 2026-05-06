'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  ChevronDown,
  Clock,
  CreditCard,
  Heart,
  LockKeyhole,
  Menu,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  Users,
  X,
} from 'lucide-react';
import {
  createQuoteRequest,
  type PartnerService,
  usePublicServices,
} from '@catering-marketplace/query-client';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';

type ServiceFilter = 'chef' | 'catering' | 'restaurant_private_event';
type CouponResult = { code: string; label: string; amount: number } | null;

type BookingStep = 'search' | 'details' | 'review';

type BookingDetails = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  eventType: string;
  eventTime: string;
  mealTime: string;
  cuisinePreference: string;
  notes: string;
};

type BookingIntent = {
  type: 'partner_service';
  serviceId: string;
  serviceKey: string;
  title: string;
  location: string;
  date: string;
  guests: number;
  couponCode: string;
  subtotal: number;
  discount: number;
  estimatedTotal: number;
  currencyCode: string;
  details: BookingDetails;
  createdAt: string;
};

type BookingDraft = {
  service: ServiceFilter;
  location: string;
  date: string;
  guests: number;
  coupon: string;
};

const logoUrl =
  'https://ckklrguidafoseanzmdk.supabase.co/storage/v1/object/public/assets/logo/logo.png';

const defaultDraft: BookingDraft = {
  service: 'chef',
  location: '',
  date: '',
  guests: 2,
  coupon: '',
};

const defaultBookingDetails: BookingDetails = {
  customerName: '',
  phone: '',
  email: '',
  address: '',
  eventType: '',
  eventTime: '',
  mealTime: '',
  cuisinePreference: '',
  notes: '',
};

const serviceCards = [
  {
    key: 'chef' as ServiceFilter,
    title: 'Private Chef Experience',
    text: 'Personalized menus, cooked fresh at your place.',
    cta: 'View Chefs',
    note: 'Starting at INR 5,000',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    icon: ChefHat,
  },
  {
    key: 'catering' as ServiceFilter,
    title: 'Catering Services',
    text: 'Perfect for birthdays, weddings, corporate events and more.',
    cta: 'Get a Quote',
    note: 'Custom Quotes',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
    icon: Utensils,
  },
  {
    key: 'restaurant_private_event' as ServiceFilter,
    title: 'Experiences',
    text: 'Rooftop dinners, villa celebrations and curated private dining.',
    cta: 'Explore Now',
    note: 'Curated Experiences',
    image:
      'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=900&q=80',
    icon: Star,
  },
];

const fallbackImages = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
];

const testimonials = [
  {
    name: 'Priya Sharma',
    text: 'The chef was amazing. The food, presentation and whole experience were perfect.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Rahul Mehra',
    text: 'We booked catering for my sister’s wedding. Everything was seamless and the food was loved by all.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Ananya Reddy',
    text: 'The private dining experience on the rooftop was magical. Highly recommend Droooly.',
    avatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [draft, setDraft] = useState<BookingDraft>(defaultDraft);
  const [selectedService, setSelectedService] = useState<PartnerService | null>(
    null
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('search');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(
    defaultBookingDetails
  );
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [quoteConfirmation, setQuoteConfirmation] = useState<string | null>(
    null
  );
  const { getServiceType, getExperienceType } = useServiceCatalogMetaContext();
  const { locations } = useOnboardingMasterDataContext();
  const { data: rawServices, isLoading, error } = usePublicServices();
  const services = normalizeList<PartnerService>(rawServices);
  const cityOptions = useMemo(() => getCityOptions(locations), [locations]);

  useEffect(() => {
    if (cityOptions.length === 0) return;
    const hasSelectedCity = cityOptions.some(
      (city) => city.name === draft.location
    );
    if (!hasSelectedCity) {
      setDraft((current) => ({ ...current, location: cityOptions[0].name }));
    }
  }, [cityOptions, draft.location]);

  const matchingServices = useMemo(() => {
    return services
      .filter((service) => service.status === 'approved')
      .filter((service) => service.is_active !== false)
      .filter((service) => service.service_key === draft.service)
      .filter((service) => {
        if (service.min_guests && draft.guests < service.min_guests)
          return false;
        if (service.max_guests && draft.guests > service.max_guests)
          return false;
        return true;
      });
  }, [draft.guests, draft.service, services]);

  const featuredService = selectedService || matchingServices[0] || null;
  const subtotal = getServiceSubtotal(featuredService, draft.guests);
  const coupon = appliedCoupon?.amount ? appliedCoupon : null;
  const total = Math.max(subtotal - (coupon?.amount || 0), 0);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  const updateDraft = <K extends keyof BookingDraft>(
    key: K,
    value: BookingDraft[K]
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === 'service') setSelectedService(null);
    if (key === 'coupon' || key === 'service') setAppliedCoupon(null);
    setQuoteConfirmation(null);
  };

  const findOptions = (serviceKey = draft.service) => {
    if (serviceKey !== draft.service) {
      updateDraft('service', serviceKey);
    }
    setBookingStep('search');
    setIsQuickBookingOpen(true);
    closeMobileNav();
  };

  const startBooking = (service: PartnerService) => {
    setSelectedService(service);
    setAppliedCoupon(null);
    setQuoteConfirmation(null);
    setBookingStep('details');
    setIsQuickBookingOpen(true);
  };

  const updateBookingDetails = <K extends keyof BookingDetails>(
    key: K,
    value: BookingDetails[K]
  ) => {
    setBookingDetails((current) => ({ ...current, [key]: value }));
    setQuoteConfirmation(null);
  };

  const canReviewBooking =
    Boolean(featuredService) &&
    Boolean(draft.location || bookingDetails.address.trim()) &&
    Boolean(draft.date) &&
    draft.guests > 0 &&
    Boolean(bookingDetails.customerName.trim()) &&
    Boolean(bookingDetails.phone.trim()) &&
    Boolean(bookingDetails.address.trim());

  const applyCoupon = () =>
    setAppliedCoupon(resolveCoupon(draft.coupon, subtotal));

  const continueBooking = async () => {
    if (!featuredService || !canReviewBooking || isSubmittingRequest) return;

    const isQuoteService = featuredService.booking_type !== 'instant';
    const bookingIntent: BookingIntent = {
      type: 'partner_service',
      serviceId: featuredService.id,
      serviceKey: featuredService.service_key,
      title: featuredService.title,
      location: draft.location,
      date: draft.date,
      guests: draft.guests,
      couponCode: appliedCoupon?.code || draft.coupon || '',
      subtotal,
      discount: coupon?.amount || 0,
      estimatedTotal: total,
      currencyCode: featuredService.currency_code || 'INR',
      details: bookingDetails,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'droooly:booking-intent',
        JSON.stringify(bookingIntent)
      );
    }

    if (sessionStatus !== 'authenticated') {
      const callbackPath = isQuoteService
        ? '/'
        : '/checkout?intent=service-booking';
      router.push(
        `/login?mode=signin&callbackUrl=${encodeURIComponent(callbackPath)}`
      );
      return;
    }

    if (isQuoteService) {
      try {
        setIsSubmittingRequest(true);
        const quote = await createQuoteRequest({
          service_id: featuredService.id,
          event_date: draft.date,
          event_time: bookingDetails.eventTime || undefined,
          guest_count: draft.guests,
          location_text: bookingDetails.address || draft.location,
          occasion: bookingDetails.eventType || undefined,
          customer_notes: [
            bookingDetails.notes,
            bookingDetails.cuisinePreference
              ? `Cuisine preference: ${bookingDetails.cuisinePreference}`
              : '',
            bookingDetails.phone ? `Phone: ${bookingDetails.phone}` : '',
            bookingDetails.email ? `Email: ${bookingDetails.email}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        });

        setQuoteConfirmation(
          `Your request has been sent. Reference: ${quote.id.slice(0, 8).toUpperCase()}`
        );
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('droooly:booking-intent');
        }
      } catch (error) {
        console.error('Quote request error:', error);
        alert(
          error instanceof Error
            ? error.message
            : 'Unable to submit your quote request. Please try again.'
        );
      } finally {
        setIsSubmittingRequest(false);
      }
      return;
    }

    router.push('/checkout?intent=service-booking');
  };

  return (
    <main style={styles.page}>
      <style>{homeResponsiveStyles}</style>
      <section className="home-hero-shell" style={styles.heroShell}>
        <nav className="home-nav" style={styles.nav}>
          <button
            type="button"
            style={styles.logoButton}
            onClick={() => router.push('/')}
          >
            <img src={logoUrl} alt="Droooly" style={styles.logo} />
          </button>
          <button
            type="button"
            className="home-menu-button"
            style={styles.menuButton}
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div
            className={`home-nav-links ${isMobileNavOpen ? 'is-open' : ''}`}
            style={styles.navLinks}
          >
            <button
              style={styles.navLink}
              onClick={() => {
                updateDraft('service', 'chef');
                closeMobileNav();
              }}
            >
              Private Chefs
            </button>
            <button
              style={styles.navLink}
              onClick={() => {
                updateDraft('service', 'catering');
                closeMobileNav();
              }}
            >
              Catering
            </button>
            <button
              style={styles.navLink}
              onClick={() => {
                updateDraft('service', 'restaurant_private_event');
                closeMobileNav();
              }}
            >
              Experiences
            </button>
            <button
              style={styles.navLink}
              onClick={() => {
                closeMobileNav();
                router.push('/how-it-works');
              }}
            >
              How It Works
            </button>
          </div>
          <div
            className={`home-nav-actions ${isMobileNavOpen ? 'is-open' : ''}`}
            style={styles.navActions}
          >
            <label style={styles.cityPill}>
              <MapPin size={15} />
              <select
                value={draft.location}
                onChange={(event) => {
                  updateDraft('location', event.target.value);
                  closeMobileNav();
                }}
                style={styles.citySelect}
                aria-label="Select city"
              >
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
            <button
              type="button"
              style={styles.loginButton}
              onClick={() => {
                closeMobileNav();
                router.push('/login');
              }}
            >
              Login / Sign in
            </button>
            <button
              type="button"
              style={styles.partnerButton}
              onClick={() => {
                closeMobileNav();
                router.push('/become-a-caterer');
              }}
            >
              Become a Partner
            </button>
          </div>
        </nav>

        <div className="home-hero-grid" style={styles.heroGrid}>
          <div style={styles.heroCopy}>
            <div style={styles.badge}>
              <Heart size={14} fill="currentColor" /> Good food. Made with care.
            </div>
            <h1 style={styles.heroTitle}>
              Private Chefs. Catering. Experiences.
              <span style={styles.heroAccent}> Delivered to you.</span>
            </h1>
            <p style={styles.heroText}>
              From intimate dinners to grand celebrations, we bring exceptional
              food experiences to your door. Book in under a minute.
            </p>
          </div>
        </div>

        <div className="home-quick-booking" style={styles.quickBookingCard}>
          <div style={styles.quickTitle}>What are you looking for?</div>
          <div className="home-service-toggle" style={styles.serviceToggle}>
            <QuickTab
              icon={ChefHat}
              label="Private Chef"
              active={draft.service === 'chef'}
              onClick={() => {
                updateDraft('service', 'chef');
                closeMobileNav();
              }}
            />
            <QuickTab
              icon={Utensils}
              label="Catering"
              active={draft.service === 'catering'}
              onClick={() => {
                updateDraft('service', 'catering');
                closeMobileNav();
              }}
            />
            <QuickTab
              icon={Sparkles}
              label="Experience"
              active={draft.service === 'restaurant_private_event'}
              onClick={() => {
                updateDraft('service', 'restaurant_private_event');
                closeMobileNav();
              }}
            />
          </div>
          <div className="home-quick-fields" style={styles.quickFields}>
            <Field icon={MapPin} label="Location">
              <select
                value={draft.location}
                onChange={(event) => {
                  updateDraft('location', event.target.value);
                  closeMobileNav();
                }}
                style={styles.input}
              >
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field icon={CalendarDays} label="Date">
              <input
                type="date"
                value={draft.date}
                onChange={(event) => updateDraft('date', event.target.value)}
                style={styles.input}
              />
            </Field>
            <Field icon={Users} label="Guests">
              <input
                type="number"
                min={1}
                value={draft.guests}
                onChange={(event) =>
                  updateDraft('guests', Number(event.target.value || 1))
                }
                style={styles.input}
              />
            </Field>
            <button
              type="button"
              style={styles.findButton}
              onClick={() => findOptions()}
            >
              Book in under a minute <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div style={styles.trustBar}>
          <div style={styles.avatarStack}>
            {testimonials.map((item) => (
              <img
                key={item.name}
                src={item.avatar}
                alt=""
                style={styles.avatarMini}
              />
            ))}
            <div>
              <strong>10,000+ Happy Customers</strong>
              <span>4.8 rating across verified reviews</span>
            </div>
          </div>
          <TrustMini icon={ShieldCheck} label="Verified Chefs" />
          <TrustMini icon={Sparkles} label="Hygienic & Safe" />
          <TrustMini icon={LockKeyhole} label="Secure Payments" />
        </div>
      </section>

      <section style={styles.categoryGrid}>
        {serviceCards.map((card) => (
          <article key={card.key} style={styles.categoryCard}>
            <div style={styles.categoryContent}>
              <div style={styles.categoryIcon}>
                <card.icon size={24} />
              </div>
              <h2 style={styles.categoryTitle}>{card.title}</h2>
              <p style={styles.categoryText}>{card.text}</p>
              <div style={styles.categoryFooter}>
                <span>{card.note}</span>
                <button
                  type="button"
                  onClick={() => {
                    findOptions(card.key);
                  }}
                  style={styles.roundButton}
                >
                  {card.cta} <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <img
              src={card.image}
              alt={card.title}
              style={styles.categoryImage}
            />
          </article>
        ))}
      </section>

      <section style={styles.featureStrip}>
        <Feature
          icon={ChefHat}
          title="Expert & Verified Chefs"
          text="Professionals you can trust."
        />
        <Feature
          icon={Sparkles}
          title="Quality Ingredients"
          text="Fresh food, prepared with care."
        />
        <Feature
          icon={CreditCard}
          title="Secure Payments"
          text="Razorpay checkout ready."
        />
        <Feature
          icon={Clock}
          title="24/7 Support"
          text="We’re here for your event."
        />
      </section>

      <section id="matched-services" style={styles.matchesSection}>
        <div style={styles.sectionHeading}>
          <span style={styles.badge}>Matched instantly</span>
          <h2 style={styles.sectionTitle}>Best options for your request</h2>
          <p style={styles.sectionText}>
            These are pulled from approved Droooly partner services and filtered
            by the booking card.
          </p>
        </div>
        {error ? (
          <div style={styles.emptyState}>
            Unable to load services right now.
          </div>
        ) : isLoading ? (
          <div style={styles.resultsGrid}>
            {[0, 1, 2].map((item) => (
              <div key={item} style={styles.skeletonCard} />
            ))}
          </div>
        ) : matchingServices.length === 0 ? (
          <div style={styles.emptyState}>
            No approved services match this yet. Try another service type or
            guest count.
          </div>
        ) : (
          <div style={styles.resultsGrid}>
            {matchingServices.slice(0, 6).map((service, index) => (
              <ResultCard
                key={service.id}
                service={service}
                image={getServiceImage(service, index)}
                serviceLabel={getServiceType(service.service_key)?.label}
                experienceLabel={
                  getExperienceType(service.experience_type_key)?.label
                }
                selected={featuredService?.id === service.id}
                onBook={() => startBooking(service)}
              />
            ))}
          </div>
        )}
      </section>

      <section id="booking-summary" style={styles.bookingBand}>
        <div style={styles.bookingCopy}>
          <span style={styles.badge}>Try instant booking</span>
          <h2 style={styles.sectionTitle}>
            {featuredService?.title || 'Select a matched service'}
          </h2>
          <p style={styles.sectionText}>
            {featuredService?.short_description ||
              'Choose a service above, apply a test coupon, and continue to checkout.'}
          </p>
        </div>
        <div style={styles.bookingCard}>
          <SummaryRow label="Guests" value={`${draft.guests}`} />
          <SummaryRow
            label="Subtotal"
            value={formatMoney(
              subtotal,
              featuredService?.currency_code || 'INR'
            )}
          />
          <div style={styles.couponRow}>
            <input
              value={draft.coupon}
              onChange={(event) =>
                updateDraft('coupon', event.target.value.toUpperCase())
              }
              placeholder="DROOOLY10"
              style={styles.couponInput}
            />
            <button
              type="button"
              onClick={applyCoupon}
              disabled={!featuredService || !draft.coupon}
              style={styles.applyButton}
            >
              Apply
            </button>
          </div>
          {appliedCoupon && (
            <div
              style={
                appliedCoupon.amount > 0
                  ? styles.couponSuccess
                  : styles.couponError
              }
            >
              {appliedCoupon.label}
            </div>
          )}
          <SummaryRow
            label="Coupon"
            value={`-${formatMoney(coupon?.amount || 0, featuredService?.currency_code || 'INR')}`}
          />
          <div style={styles.totalRow}>
            <span>Estimated total</span>
            <strong>
              {formatMoney(total, featuredService?.currency_code || 'INR')}
            </strong>
          </div>
          <button
            type="button"
            disabled={!featuredService}
            onClick={() => {
              if (featuredService) {
                setBookingStep('details');
                setIsQuickBookingOpen(true);
              }
            }}
            style={{
              ...styles.checkoutButton,
              opacity: featuredService ? 1 : 0.55,
            }}
          >
            {sessionStatus === 'authenticated'
              ? 'Continue booking'
              : 'Start quick booking'}{' '}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <QuickBookingDrawer
        isOpen={isQuickBookingOpen}
        step={bookingStep}
        draft={draft}
        details={bookingDetails}
        services={matchingServices}
        selectedService={featuredService}
        isLoading={isLoading}
        error={Boolean(error)}
        subtotal={subtotal}
        discount={coupon?.amount || 0}
        total={total}
        cityOptions={cityOptions}
        appliedCoupon={appliedCoupon}
        serviceLabel={(service) => getServiceType(service.service_key)?.label}
        experienceLabel={(service) =>
          getExperienceType(service.experience_type_key)?.label
        }
        canReview={canReviewBooking}
        onClose={() => setIsQuickBookingOpen(false)}
        onStepChange={setBookingStep}
        onDraftChange={updateDraft}
        onDetailsChange={updateBookingDetails}
        onSelectService={startBooking}
        onApplyCoupon={applyCoupon}
        onConfirm={continueBooking}
        isSubmitting={isSubmittingRequest}
        quoteConfirmation={quoteConfirmation}
      />

      <section style={styles.mealBanner}>
        <div>
          <h2 style={styles.mealTitle}>Good food. Made with care.</h2>
          <p style={styles.mealText}>
            Thoughtfully prepared meals by expert kitchens, delivered for weekly
            routines and busy days.
          </p>
          <button
            type="button"
            style={styles.signupButton}
            onClick={() => router.push('/meal-plans')}
          >
            Explore Meal Plans <ArrowRight size={15} />
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=800&q=80"
          alt="Packed meal"
          style={styles.mealImage}
        />
      </section>

      <section style={styles.reviewSection}>
        <h2 style={styles.reviewTitle}>Loved by thousands of foodies</h2>
        <div style={styles.reviewGrid}>
          {testimonials.map((item) => (
            <ReviewCard key={item.name} {...item} />
          ))}
        </div>
      </section>

      <footer className="home-footer" style={styles.footer}>
        <div style={styles.footerBrand}>
          <img src={logoUrl} alt="Droooly" style={styles.footerLogo} />
          <p>Good food. Made with care. Delivered to you.</p>
        </div>
        <FooterColumn
          title="Services"
          links={['Private Chefs', 'Catering', 'Experiences', 'Meal Plans']}
        />
        <FooterColumn
          title="Company"
          links={['How It Works', 'Become a Partner', 'About Us', 'Careers']}
        />
        <FooterColumn
          title="Support"
          links={['Help Center', 'Contact Us', 'Terms', 'Privacy']}
        />
        <div className="home-footer-subscribe" style={styles.subscribeBox}>
          <strong>Stay updated with Droooly</strong>
          <p>Get exclusive offers and food inspiration.</p>
          <div className="home-subscribe-row" style={styles.subscribeRow}>
            <input
              placeholder="Enter your email"
              style={styles.subscribeInput}
            />
            <button style={styles.signupButton}>Subscribe</button>
          </div>
        </div>
      </footer>
    </main>
  );
}

function QuickBookingDrawer({
  isOpen,
  step,
  draft,
  details,
  services,
  selectedService,
  isLoading,
  error,
  subtotal,
  discount,
  total,
  cityOptions,
  appliedCoupon,
  serviceLabel,
  experienceLabel,
  canReview,
  onClose,
  onStepChange,
  onDraftChange,
  onDetailsChange,
  onSelectService,
  onApplyCoupon,
  onConfirm,
  isSubmitting,
  quoteConfirmation,
}: {
  isOpen: boolean;
  step: BookingStep;
  draft: BookingDraft;
  details: BookingDetails;
  services: PartnerService[];
  selectedService: PartnerService | null;
  isLoading: boolean;
  error: boolean;
  subtotal: number;
  discount: number;
  total: number;
  cityOptions: { id: string; name: string }[];
  appliedCoupon: CouponResult;
  serviceLabel: (service: PartnerService) => string | undefined;
  experienceLabel: (service: PartnerService) => string | undefined;
  canReview: boolean;
  onClose: () => void;
  onStepChange: (step: BookingStep) => void;
  onDraftChange: <K extends keyof BookingDraft>(
    key: K,
    value: BookingDraft[K]
  ) => void;
  onDetailsChange: <K extends keyof BookingDetails>(
    key: K,
    value: BookingDetails[K]
  ) => void;
  onSelectService: (service: PartnerService) => void;
  onApplyCoupon: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  quoteConfirmation: string | null;
}) {
  if (!isOpen) return null;

  const currency = selectedService?.currency_code || 'INR';
  const serviceTitle = selectedService?.title || 'Choose a service';
  const isQuoteService = selectedService?.booking_type !== 'instant';

  return (
    <div style={styles.drawerOverlay} onClick={onClose}>
      <aside
        className="quick-booking-drawer"
        style={styles.drawerPanel}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={styles.drawerHeader}>
          <div>
            <span style={styles.drawerEyebrow}>Quick booking</span>
            <h2 style={styles.drawerTitle}>
              {step === 'search'
                ? 'Find the right option'
                : step === 'details'
                  ? 'Add booking details'
                  : 'Review and continue'}
            </h2>
          </div>
          <button type="button" onClick={onClose} style={styles.iconButton}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.drawerSteps}>
          {(['search', 'details', 'review'] as BookingStep[]).map(
            (item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => onStepChange(item)}
                disabled={item !== 'search' && !selectedService}
                style={{
                  ...styles.drawerStep,
                  ...(step === item ? styles.drawerStepActive : {}),
                }}
              >
                <span>{index + 1}</span>
                {item === 'search'
                  ? 'Search'
                  : item === 'details'
                    ? 'Details'
                    : 'Review'}
              </button>
            )
          )}
        </div>

        {step === 'search' && (
          <div style={styles.drawerBody}>
            <div style={styles.drawerSection}>
              <h3 style={styles.drawerSectionTitle}>Filters</h3>
              <div style={styles.drawerServiceTabs}>
                <QuickTab
                  icon={ChefHat}
                  label="Private Chef"
                  active={draft.service === 'chef'}
                  onClick={() => onDraftChange('service', 'chef')}
                />
                <QuickTab
                  icon={Utensils}
                  label="Catering"
                  active={draft.service === 'catering'}
                  onClick={() => onDraftChange('service', 'catering')}
                />
                <QuickTab
                  icon={Sparkles}
                  label="Experience"
                  active={draft.service === 'restaurant_private_event'}
                  onClick={() =>
                    onDraftChange('service', 'restaurant_private_event')
                  }
                />
              </div>
              <div style={styles.drawerFields}>
                <label style={styles.drawerField}>
                  <span>City</span>
                  <select
                    value={draft.location}
                    onChange={(event) =>
                      onDraftChange('location', event.target.value)
                    }
                  >
                    {cityOptions.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={styles.drawerField}>
                  <span>Date</span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) =>
                      onDraftChange('date', event.target.value)
                    }
                  />
                </label>
                <label style={styles.drawerField}>
                  <span>Guests</span>
                  <input
                    type="number"
                    min={1}
                    value={draft.guests}
                    onChange={(event) =>
                      onDraftChange('guests', Number(event.target.value || 1))
                    }
                  />
                </label>
              </div>
            </div>

            <div style={styles.drawerSection}>
              <h3 style={styles.drawerSectionTitle}>Results</h3>
              {error ? (
                <div style={styles.emptyState}>
                  Unable to load services right now.
                </div>
              ) : isLoading ? (
                <div style={styles.drawerResults}>
                  Loading approved services...
                </div>
              ) : services.length === 0 ? (
                <div style={styles.emptyState}>No matching services yet.</div>
              ) : (
                <div style={styles.drawerResults}>
                  {services.slice(0, 8).map((service, index) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => onSelectService(service)}
                      style={{
                        ...styles.drawerResult,
                        ...(selectedService?.id === service.id
                          ? styles.drawerResultActive
                          : {}),
                      }}
                    >
                      <img
                        src={getServiceImage(service, index)}
                        alt=""
                        style={styles.drawerResultImage}
                      />
                      <span>
                        <strong>{service.title}</strong>
                        <small>
                          {serviceLabel(service) || service.service_key} •{' '}
                          {experienceLabel(service) || 'Flexible'}
                        </small>
                      </span>
                      <b>
                        {formatMoney(
                          service.base_price || 0,
                          service.currency_code
                        )}
                      </b>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div style={styles.drawerBody}>
            <div style={styles.drawerSection}>
              <h3 style={styles.drawerSectionTitle}>{serviceTitle}</h3>
              <p style={styles.drawerMuted}>
                Add the essentials so we can confirm availability, payment, and
                partner communication without asking twice.
              </p>
              <div style={styles.drawerFields}>
                <label style={styles.drawerField}>
                  <span>Name *</span>
                  <input
                    value={details.customerName}
                    onChange={(event) =>
                      onDetailsChange('customerName', event.target.value)
                    }
                    placeholder="Your name"
                  />
                </label>
                <label style={styles.drawerField}>
                  <span>Phone *</span>
                  <input
                    value={details.phone}
                    onChange={(event) =>
                      onDetailsChange('phone', event.target.value)
                    }
                    placeholder="Contact number"
                  />
                </label>
                <label style={styles.drawerField}>
                  <span>Email</span>
                  <input
                    type="email"
                    value={details.email}
                    onChange={(event) =>
                      onDetailsChange('email', event.target.value)
                    }
                    placeholder="Email for updates"
                  />
                </label>
                <label style={styles.drawerField}>
                  <span>Preferred time</span>
                  <input
                    type="time"
                    value={details.eventTime}
                    onChange={(event) =>
                      onDetailsChange('eventTime', event.target.value)
                    }
                  />
                </label>
                <label style={styles.drawerField}>
                  <span>Occasion</span>
                  <input
                    value={details.eventType}
                    onChange={(event) =>
                      onDetailsChange('eventType', event.target.value)
                    }
                    placeholder="Birthday, corporate, dinner..."
                  />
                </label>
                <label style={{ ...styles.drawerField, gridColumn: '1 / -1' }}>
                  <span>Full address *</span>
                  <input
                    value={details.address}
                    onChange={(event) =>
                      onDetailsChange('address', event.target.value)
                    }
                    placeholder="Where should the service happen?"
                  />
                </label>
                <label style={{ ...styles.drawerField, gridColumn: '1 / -1' }}>
                  <span>Cuisine preference</span>
                  <input
                    value={details.cuisinePreference}
                    onChange={(event) =>
                      onDetailsChange('cuisinePreference', event.target.value)
                    }
                    placeholder="North Indian, Italian, veg only..."
                  />
                </label>
                <label style={{ ...styles.drawerField, gridColumn: '1 / -1' }}>
                  <span>Notes</span>
                  <textarea
                    value={details.notes}
                    onChange={(event) =>
                      onDetailsChange('notes', event.target.value)
                    }
                    placeholder="Allergies, setup needs, timing, parking..."
                    rows={4}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div style={styles.drawerBody}>
            <div style={styles.drawerSection}>
              <h3 style={styles.drawerSectionTitle}>Review request</h3>
              <SummaryRow label="Service" value={serviceTitle} />
              <SummaryRow label="Guests" value={String(draft.guests)} />
              <SummaryRow label="Date" value={draft.date || 'To confirm'} />
              <SummaryRow
                label="Time"
                value={details.eventTime || 'Partner to confirm'}
              />
              <SummaryRow
                label="Address"
                value={details.address || 'Missing'}
              />
              <div style={styles.couponRow}>
                <input
                  value={draft.coupon}
                  onChange={(event) =>
                    onDraftChange('coupon', event.target.value.toUpperCase())
                  }
                  placeholder="DROOOLY10"
                  style={styles.couponInput}
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={!selectedService || !draft.coupon}
                  style={styles.applyButton}
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div
                  style={
                    appliedCoupon.amount > 0
                      ? styles.couponSuccess
                      : styles.couponError
                  }
                >
                  {appliedCoupon.label}
                </div>
              )}
              <SummaryRow
                label="Subtotal"
                value={formatMoney(subtotal, currency)}
              />
              <SummaryRow
                label="Discount"
                value={`-${formatMoney(discount, currency)}`}
              />
              <div style={styles.totalRow}>
                <span>{isQuoteService ? 'Estimated total' : 'Total'}</span>
                <strong>{formatMoney(total, currency)}</strong>
              </div>
              {quoteConfirmation && (
                <div style={styles.couponSuccess}>{quoteConfirmation}</div>
              )}
            </div>
          </div>
        )}

        <div style={styles.drawerFooter}>
          {step !== 'search' ? (
            <button
              type="button"
              style={styles.secondaryDrawerButton}
              onClick={() =>
                onStepChange(step === 'review' ? 'details' : 'search')
              }
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              style={styles.secondaryDrawerButton}
              onClick={onClose}
            >
              Close
            </button>
          )}
          {step === 'search' && (
            <button
              type="button"
              style={styles.drawerPrimaryButton}
              disabled={!selectedService}
              onClick={() => onStepChange('details')}
            >
              Continue with selected <ArrowRight size={16} />
            </button>
          )}
          {step === 'details' && (
            <button
              type="button"
              style={styles.drawerPrimaryButton}
              disabled={!canReview}
              onClick={() => onStepChange('review')}
            >
              Review booking <ArrowRight size={16} />
            </button>
          )}
          {step === 'review' && (
            <button
              type="button"
              style={styles.drawerPrimaryButton}
              onClick={onConfirm}
              disabled={isSubmitting || Boolean(quoteConfirmation)}
            >
              {quoteConfirmation
                ? 'Request sent'
                : isSubmitting
                  ? 'Submitting...'
                  : isQuoteService
                    ? 'Submit quote request'
                    : 'Continue to payment'}{' '}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function QuickTab({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof ChefHat;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      style={{ ...styles.quickTab, ...(active ? styles.quickTabActive : {}) }}
      onClick={onClick}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
      <Icon size={16} style={styles.fieldIcon} />
    </label>
  );
}

function TrustMini({
  icon: Icon,
  label,
}: {
  icon: typeof ShieldCheck;
  label: string;
}) {
  return (
    <div style={styles.trustMini}>
      <Icon size={19} />
      {label}
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ChefHat;
  title: string;
  text: string;
}) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureIcon}>
        <Icon size={22} />
      </div>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function ResultCard({
  service,
  image,
  serviceLabel,
  experienceLabel,
  selected,
  onBook,
}: {
  service: PartnerService;
  image: string;
  serviceLabel?: string;
  experienceLabel?: string;
  selected: boolean;
  onBook: () => void;
}) {
  return (
    <article
      style={{
        ...styles.resultCard,
        ...(selected ? styles.resultCardSelected : {}),
      }}
    >
      <img src={image} alt={service.title} style={styles.resultImage} />
      <div style={styles.resultBody}>
        <div style={styles.resultMeta}>
          <span>{serviceLabel || service.service_key}</span>
          <span>{formatBookingType(service.booking_type)}</span>
        </div>
        <h3>{service.title}</h3>
        <p>
          {service.short_description ||
            service.description ||
            'A verified Droooly service ready for your request.'}
        </p>
        <div style={styles.resultDetail}>
          <span>
            {experienceLabel || service.experience_type_key || 'Flexible'}
          </span>
          <span>{formatGuestRange(service)}</span>
        </div>
        <div style={styles.resultFooter}>
          <strong>
            {formatMoney(service.base_price || 0, service.currency_code)}
          </strong>
          <button type="button" onClick={onBook}>
            Book this <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.summaryRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ReviewCard({
  name,
  text,
  avatar,
}: {
  name: string;
  text: string;
  avatar: string;
}) {
  return (
    <article style={styles.reviewCard}>
      <div style={styles.reviewTop}>
        <img src={avatar} alt={name} style={styles.reviewAvatar} />
        <div>
          <strong>{name}</strong>
          <div style={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      <p>{text}</p>
    </article>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div style={styles.footerColumn}>
      <strong>{title}</strong>
      {links.map((link) => (
        <span key={link}>{link}</span>
      ))}
    </div>
  );
}

function normalizeList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.items)) return record.items as T[];
  }
  return [];
}

function getCityOptions(
  locations:
    | {
        countries?: {
          states?: { cities?: { id: string; name: string }[] }[];
        }[];
      }
    | undefined
) {
  const cities =
    locations?.countries?.flatMap((country) =>
      (country.states || []).flatMap((state) => state.cities || [])
    ) || [];
  return cities.length ? cities : [{ id: 'hyderabad', name: 'Hyderabad' }];
}

function getServiceImage(service: PartnerService, index: number) {
  const media = Array.isArray(service.media) ? service.media : [];
  for (const item of media) {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      const url = record.url || record.src || record.path;
      if (typeof url === 'string') return url;
    }
  }
  return fallbackImages[index % fallbackImages.length];
}

function getServiceSubtotal(service: PartnerService | null, guests: number) {
  if (!service?.base_price) return 0;
  if (['per_person', 'per_plate'].includes(service.pricing_model || ''))
    return service.base_price * guests;
  return service.base_price;
}

function resolveCoupon(code: string, subtotal: number): CouponResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  if (normalized === 'DROOOLY10')
    return {
      code: normalized,
      label: 'DROOOLY10 applied: 10% off this booking.',
      amount: Math.round(subtotal * 0.1),
    };
  if (normalized === 'PRIVATE15')
    return {
      code: normalized,
      label: 'PRIVATE15 applied: 15% off private experiences.',
      amount: Math.round(subtotal * 0.15),
    };
  return {
    code: normalized,
    label: 'Coupon not available for this booking.',
    amount: 0,
  };
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatBookingType(value?: string) {
  if (value === 'instant') return 'Instant';
  if (value === 'quote') return 'Quote';
  if (value === 'request_only') return 'Request';
  return 'Flexible';
}

function formatGuestRange(service: PartnerService) {
  if (service.min_guests && service.max_guests)
    return `${service.min_guests}-${service.max_guests} guests`;
  if (service.min_guests) return `${service.min_guests}+ guests`;
  if (service.max_guests) return `Up to ${service.max_guests} guests`;
  return 'Custom guests';
}

const homeResponsiveStyles = `
  @media (max-width: 980px) {
    .home-nav {
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 12px !important;
    }
    .home-menu-button {
      display: inline-flex !important;
      margin-left: auto !important;
    }
    .home-nav-links,
    .home-nav-actions {
      display: none !important;
      width: 100% !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 14px !important;
      background: rgba(255,255,255,0.96) !important;
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.10) !important;
    }
    .home-nav-links.is-open {
      order: 3 !important;
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 2px !important;
      padding: 8px !important;
    }
    .home-nav-actions.is-open {
      order: 4 !important;
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 8px !important;
      padding: 10px !important;
    }
    .home-nav-links.is-open button,
    .home-nav-actions.is-open button,
    .home-nav-actions.is-open label {
      width: 100% !important;
      justify-content: center !important;
    }
  }

  @media (max-width: 1100px) {
    .home-footer {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .home-footer-subscribe {
      grid-column: 1 / -1 !important;
    }
  }

  .quick-booking-drawer input,
  .quick-booking-drawer select,
  .quick-booking-drawer textarea {
    width: 100%;
    border: 1px solid #e3e7f1;
    border-radius: 11px;
    padding: 11px 12px;
    color: #070b1f;
    background: #fff;
    font: inherit;
    font-weight: 800;
    outline: none;
    box-sizing: border-box;
  }

  .quick-booking-drawer textarea {
    resize: vertical;
    font-weight: 700;
  }

  .quick-booking-drawer button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 760px) {
    .home-hero-shell {
      min-height: auto !important;
      padding: 16px 18px 22px !important;
      background-image: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,247,255,0.92) 56%, rgba(250,247,255,0.72) 100%), url(https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85) !important;
      background-position: center right !important;
    }
    .home-nav {
      gap: 10px !important;
    }
    .home-hero-grid {
      margin-top: 18px !important;
      grid-template-columns: 1fr !important;
      min-height: 250px !important;
    }
    .home-quick-booking {
      margin-top: 18px !important;
    }
    .home-service-toggle {
      grid-template-columns: 1fr !important;
    }
    .home-quick-fields {
      grid-template-columns: 1fr !important;
    }
    .home-footer {
      grid-template-columns: 1fr !important;
      padding: 28px 20px !important;
      gap: 22px !important;
    }
    .home-subscribe-row {
      grid-template-columns: 1fr !important;
    }
    .home-footer-subscribe button {
      width: 100% !important;
      justify-content: center !important;
    }
    .quick-booking-drawer {
      width: 100% !important;
      max-width: none !important;
      height: min(88vh, 760px) !important;
      border-radius: 24px 24px 0 0 !important;
      margin-top: auto !important;
    }
  }
`;

const purple = '#5d42db';
const ink = '#070b1f';
const muted = '#5d6478';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    color: ink,
    fontFamily: 'var(--font-manrope), var(--font-sora), sans-serif',
  },
  heroShell: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 470,
    padding: '16px min(6vw, 76px) 24px',
    backgroundImage:
      'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(250,247,255,0.95) 34%, rgba(250,247,255,0.62) 58%, rgba(250,247,255,0.18) 100%), url(https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1600&q=85)',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
  },
  nav: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    position: 'relative',
    zIndex: 3,
  },
  logoButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    flexShrink: 0,
  },
  logo: { width: 132, height: 'auto', display: 'block' },
  menuButton: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#ffffff',
    color: ink,
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: 28,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  navLink: {
    border: 'none',
    background: 'transparent',
    color: ink,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    padding: '8px 0',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  cityPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#ffffff',
    color: ink,
    padding: '10px 12px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  },
  citySelect: {
    appearance: 'none',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: ink,
    font: 'inherit',
    fontWeight: 800,
    cursor: 'pointer',
    maxWidth: 140,
  },
  loginButton: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#ffffff',
    color: ink,
    padding: '11px 16px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  },
  partnerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #d6ccff',
    borderRadius: 10,
    background: '#f7f5ff',
    color: purple,
    padding: '11px 15px',
    fontWeight: 900,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  signupButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: 'none',
    borderRadius: 11,
    background: purple,
    color: '#ffffff',
    padding: '12px 21px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 12px 28px rgba(93, 66, 219, 0.24)',
  },
  heroGrid: {
    maxWidth: 1180,
    margin: '22px auto 0',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 0.72fr) minmax(320px, 0.58fr)',
    gap: 22,
    alignItems: 'center',
    minHeight: 235,
  },
  heroCopy: {
    position: 'relative',
    zIndex: 2,
    paddingBottom: 12,
    maxWidth: 650,
  },
  badge: {
    width: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    background: '#eee9ff',
    color: purple,
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  heroTitle: {
    margin: '14px 0 0',
    maxWidth: 650,
    fontSize: 'clamp(34px, 4.2vw, 54px)',
    lineHeight: 1.04,
    fontWeight: 800,
    letterSpacing: 0,
  },
  heroAccent: { color: purple, display: 'inline' },
  heroText: {
    margin: '12px 0 0',
    color: '#3e465c',
    fontSize: 16,
    lineHeight: 1.55,
    maxWidth: 520,
  },
  quickBookingCard: {
    maxWidth: 'min(900px, calc(100vw - 32px))',
    margin: '2px auto 0',
    position: 'relative',
    zIndex: 4,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid #eeeaf8',
    borderRadius: 18,
    boxShadow: '0 26px 72px rgba(35, 28, 76, 0.16)',
    padding: 18,
  },
  quickTitle: { fontSize: 13, fontWeight: 900, marginBottom: 12 },
  serviceToggle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 8,
    marginBottom: 14,
  },
  quickTab: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: '1px solid transparent',
    borderRadius: 12,
    background: '#ffffff',
    color: ink,
    minHeight: 44,
    padding: '8px 10px',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  quickTabActive: {
    background: '#f0ebff',
    color: purple,
    borderColor: '#e2d8ff',
  },
  quickFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: 12,
    alignItems: 'end',
  },
  field: {
    position: 'relative',
    display: 'grid',
    gap: 5,
    border: '1px solid #e3e7f1',
    borderRadius: 12,
    background: '#ffffff',
    padding: '10px 38px 10px 12px',
    minHeight: 58,
  },
  fieldLabel: { color: '#8a91a6', fontSize: 12, fontWeight: 800 },
  input: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: ink,
    minWidth: 0,
    width: '100%',
    fontWeight: 800,
    fontSize: 14,
  },
  fieldIcon: { position: 'absolute', right: 13, bottom: 13, color: '#6d7284' },
  findButton: {
    minHeight: 58,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    border: 'none',
    borderRadius: 12,
    background: purple,
    color: '#ffffff',
    padding: '0 18px',
    fontWeight: 900,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  trustBar: {
    maxWidth: 940,
    margin: '16px auto 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(190px, 100%), 1fr))',
    alignItems: 'center',
    gap: 18,
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid #eeeaf8',
    borderRadius: 16,
    boxShadow: '0 18px 48px rgba(35, 28, 76, 0.11)',
    padding: '14px 20px',
    position: 'relative',
    zIndex: 3,
  },
  avatarStack: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    color: ink,
    fontSize: 13,
  },
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid white',
    marginLeft: -12,
  },
  trustMini: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#4f5870',
    fontSize: 13,
    fontWeight: 800,
  },
  categoryGrid: {
    maxWidth: 1100,
    margin: '44px auto 0',
    padding: '0 18px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
    gap: 20,
  },
  categoryCard: {
    position: 'relative',
    minHeight: 292,
    overflow: 'hidden',
    border: '1px solid #eeeaf8',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #fbfaff, #f2edff)',
    boxShadow: '0 16px 38px rgba(35, 28, 76, 0.08)',
  },
  categoryContent: {
    position: 'relative',
    zIndex: 2,
    width: '62%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 22,
  },
  categoryIcon: {
    width: 46,
    height: 46,
    borderRadius: 18,
    display: 'grid',
    placeItems: 'center',
    background: '#ede7ff',
    color: purple,
    marginBottom: 24,
  },
  categoryTitle: { margin: 0, fontSize: 24, lineHeight: 1.12, fontWeight: 900 },
  categoryText: {
    margin: '12px 0 0',
    color: '#30384e',
    fontSize: 13,
    lineHeight: 1.55,
  },
  categoryFooter: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    color: purple,
    fontSize: 12,
    fontWeight: 900,
  },
  roundButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #e8e5f3',
    borderRadius: 999,
    background: '#ffffff',
    color: ink,
    padding: '10px 13px',
    boxShadow: '0 10px 24px rgba(30,20,80,0.10)',
    cursor: 'pointer',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  categoryImage: {
    position: 'absolute',
    right: -20,
    top: 0,
    width: '56%',
    height: '100%',
    objectFit: 'cover',
    clipPath: 'ellipse(62% 58% at 70% 50%)',
  },
  featureStrip: {
    maxWidth: 1100,
    margin: '36px auto 0',
    padding: '18px 22px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(210px, 100%), 1fr))',
    gap: 16,
    border: '1px solid #eeeaf8',
    borderRadius: 18,
    background: '#ffffff',
    boxShadow: '0 18px 42px rgba(35, 28, 76, 0.08)',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 13,
    borderRight: '1px solid #eef0f5',
    minHeight: 54,
  },
  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: '#ede7ff',
    color: purple,
    flexShrink: 0,
  },
  matchesSection: { maxWidth: 1100, margin: '46px auto 0', padding: '0 20px' },
  sectionHeading: { display: 'grid', gap: 8, marginBottom: 18 },
  sectionTitle: {
    margin: 0,
    fontSize: 'clamp(28px, 4vw, 42px)',
    lineHeight: 1.12,
    fontWeight: 900,
    letterSpacing: 0,
  },
  sectionText: {
    margin: 0,
    color: muted,
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 620,
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(295px, 100%), 1fr))',
    gap: 18,
  },
  resultCard: {
    border: '1px solid #eeeaf8',
    borderRadius: 18,
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 14px 34px rgba(35,28,76,0.08)',
  },
  resultCardSelected: {
    borderColor: '#a796ff',
    boxShadow: '0 18px 44px rgba(93,66,219,0.16)',
  },
  resultImage: {
    width: '100%',
    height: 178,
    objectFit: 'cover',
    display: 'block',
  },
  resultBody: { padding: 16, display: 'grid', gap: 10 },
  resultMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    color: purple,
    fontSize: 12,
    fontWeight: 900,
  },
  resultDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    color: muted,
    fontSize: 12,
    fontWeight: 800,
    flexWrap: 'wrap',
  },
  resultFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bookingBand: {
    maxWidth: 1100,
    margin: '36px auto 0',
    padding: '28px',
    borderRadius: 22,
    background: 'linear-gradient(135deg, #f3efff, #ffffff)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))',
    gap: 22,
    alignItems: 'center',
    border: '1px solid #eeeaf8',
  },
  bookingCopy: { display: 'grid', gap: 10 },
  bookingCard: {
    background: '#ffffff',
    border: '1px solid #eeeaf8',
    borderRadius: 18,
    padding: 18,
    boxShadow: '0 18px 48px rgba(35,28,76,0.10)',
    display: 'grid',
    gap: 12,
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    color: muted,
    fontSize: 14,
  },
  couponRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 },
  couponInput: {
    border: '1px solid #e3e7f1',
    borderRadius: 10,
    padding: '11px 12px',
    fontWeight: 800,
    color: ink,
    minWidth: 0,
  },
  applyButton: {
    border: '1px solid #d9d2ff',
    background: '#f0ebff',
    color: purple,
    borderRadius: 10,
    padding: '0 14px',
    fontWeight: 900,
    cursor: 'pointer',
  },
  couponSuccess: {
    borderRadius: 10,
    background: '#ecfdf3',
    color: '#166534',
    padding: '9px 11px',
    fontSize: 12,
    fontWeight: 900,
  },
  couponError: {
    borderRadius: 10,
    background: '#fef2f2',
    color: '#b91c1c',
    padding: '9px 11px',
    fontSize: 12,
    fontWeight: 900,
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 16,
    fontWeight: 900,
    paddingTop: 10,
    borderTop: '1px solid #eef0f5',
  },
  checkoutButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    border: 'none',
    borderRadius: 12,
    background: purple,
    color: '#ffffff',
    padding: '13px 18px',
    fontWeight: 900,
    cursor: 'pointer',
  },

  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.42)',
    zIndex: 90,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  drawerPanel: {
    width: 'min(560px, 100%)',
    background: '#ffffff',
    boxShadow: '-22px 0 60px rgba(15, 23, 42, 0.18)',
    padding: 0,
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto',
    overflow: 'hidden',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    padding: '22px 22px 14px',
    borderBottom: '1px solid #eef0f5',
  },
  drawerEyebrow: {
    color: purple,
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  drawerTitle: { margin: '4px 0 0', fontSize: 24, lineHeight: 1.15 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '1px solid #e3e7f1',
    background: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  drawerSteps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    padding: '12px 18px',
    borderBottom: '1px solid #eef0f5',
  },
  drawerStep: {
    border: '1px solid #e3e7f1',
    background: '#f8fafc',
    color: muted,
    borderRadius: 999,
    padding: '8px 10px',
    fontWeight: 900,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    cursor: 'pointer',
  },
  drawerStepActive: {
    background: '#f0ebff',
    color: purple,
    borderColor: '#d9d2ff',
  },
  drawerBody: { overflowY: 'auto', padding: 18, display: 'grid', gap: 16 },
  drawerSection: {
    border: '1px solid #eef0f5',
    borderRadius: 18,
    padding: 16,
    background: '#ffffff',
    display: 'grid',
    gap: 14,
  },
  drawerSectionTitle: { margin: 0, fontSize: 17, fontWeight: 900 },
  drawerMuted: { margin: 0, color: muted, lineHeight: 1.6, fontSize: 14 },
  drawerServiceTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  drawerFields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
  },
  drawerField: {
    display: 'grid',
    gap: 7,
    color: muted,
    fontSize: 12,
    fontWeight: 900,
  },
  drawerResults: { display: 'grid', gap: 10 },
  drawerResult: {
    display: 'grid',
    gridTemplateColumns: '56px 1fr auto',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    border: '1px solid #e3e7f1',
    background: '#ffffff',
    borderRadius: 14,
    padding: 10,
    cursor: 'pointer',
  },
  drawerResultActive: {
    borderColor: purple,
    boxShadow: '0 0 0 3px rgba(93,66,219,0.10)',
  },
  drawerResultImage: {
    width: 56,
    height: 52,
    borderRadius: 12,
    objectFit: 'cover',
  },
  drawerFooter: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: 10,
    padding: 18,
    borderTop: '1px solid #eef0f5',
    background: '#ffffff',
  },
  secondaryDrawerButton: {
    border: '1px solid #e3e7f1',
    background: '#ffffff',
    color: muted,
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 900,
    cursor: 'pointer',
  },
  drawerPrimaryButton: {
    border: 'none',
    background: purple,
    color: '#ffffff',
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 900,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mealBanner: {
    maxWidth: 1100,
    margin: '36px auto 0',
    minHeight: 260,
    padding: '36px 56px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
    alignItems: 'center',
    gap: 24,
    borderRadius: 20,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f2edff, #ded2ff)',
    position: 'relative',
  },
  mealTitle: {
    margin: 0,
    fontSize: 'clamp(30px, 4vw, 44px)',
    lineHeight: 1.12,
    fontWeight: 900,
  },
  mealText: { color: '#30384e', maxWidth: 430, lineHeight: 1.65 },
  mealImage: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
    borderRadius: 18,
    boxShadow: '0 18px 42px rgba(35,28,76,0.16)',
  },
  reviewSection: {
    maxWidth: 980,
    margin: '34px auto 0',
    padding: '0 20px 42px',
  },
  reviewTitle: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 900,
    marginBottom: 22,
  },
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
    gap: 22,
  },
  reviewCard: {
    border: '1px solid #eeeaf8',
    borderRadius: 16,
    background: '#ffffff',
    padding: 18,
    boxShadow: '0 12px 28px rgba(35,28,76,0.07)',
  },
  reviewTop: { display: 'flex', alignItems: 'center', gap: 12 },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  stars: { display: 'flex', gap: 2, color: purple, marginTop: 4 },
  footer: {
    display: 'grid',
    gridTemplateColumns:
      '1.3fr repeat(3, minmax(130px, 0.7fr)) minmax(260px, 1.4fr)',
    gap: 28,
    padding: '34px min(6vw, 76px)',
    background: '#f4f1ff',
    borderTop: '1px solid #eeeaf8',
  },
  footerBrand: {
    display: 'grid',
    alignContent: 'start',
    gap: 10,
    color: muted,
    fontSize: 14,
  },
  footerLogo: { width: 125 },
  footerColumn: {
    display: 'grid',
    alignContent: 'start',
    gap: 10,
    color: muted,
    fontSize: 13,
  },
  subscribeBox: {
    display: 'grid',
    alignContent: 'start',
    gap: 10,
    color: muted,
    fontSize: 13,
  },
  subscribeRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 },
  subscribeInput: {
    border: '1px solid #e3e7f1',
    borderRadius: 10,
    padding: '12px',
    minWidth: 0,
  },
  emptyState: {
    border: '1px dashed #d9d2ff',
    borderRadius: 16,
    padding: 24,
    color: muted,
    background: '#ffffff',
  },
  skeletonCard: {
    height: 330,
    borderRadius: 18,
    border: '1px solid #eeeaf8',
    background: 'linear-gradient(90deg, #f4f1ff, #ffffff, #f4f1ff)',
  },
};
