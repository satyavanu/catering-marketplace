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
  SlidersHorizontal,
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

const fallbackCuisineFilters = [
  'North Indian',
  'South Indian',
  'Italian',
  'Continental',
  'Asian',
  'Vegan',
];
const fallbackEventFilters = [
  'Birthday',
  'Corporate',
  'Wedding',
  'Anniversary',
  'House party',
  'Private dinner',
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('search');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(
    defaultBookingDetails
  );
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [quoteConfirmation, setQuoteConfirmation] = useState<string | null>(
    null
  );
  const { getServiceType, getExperienceType } = useServiceCatalogMetaContext();
  const { masterData, locations } = useOnboardingMasterDataContext();
  const { data: rawServices, isLoading, error } = usePublicServices();
  const services = normalizeList<PartnerService>(rawServices);
  const cityOptions = useMemo(() => getCityOptions(locations), [locations]);
  const cuisineOptions = useMemo(
    () => getNamedOptions(masterData?.cuisines).slice(0, 10),
    [masterData?.cuisines]
  );
  const eventTypeOptions = useMemo(
    () => getNamedOptions(masterData?.event_types).slice(0, 10),
    [masterData?.event_types]
  );

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

  useEffect(() => {
    if (sessionStatus !== 'authenticated' || services.length === 0) return;
    if (typeof window === 'undefined') return;

    const rawIntent = window.sessionStorage.getItem('droooly:booking-intent');
    if (!rawIntent) return;

    try {
      const parsed = JSON.parse(rawIntent) as BookingIntent;
      if (parsed?.type !== 'partner_service' || !parsed.serviceId) return;

      const service = services.find((item) => item.id === parsed.serviceId);
      if (!service) return;

      setSelectedService(service);
      setDraft((current) => ({
        ...current,
        service: service.service_key as ServiceFilter,
        location: parsed.location || current.location,
        date: parsed.date || current.date,
        guests: parsed.guests || current.guests,
        coupon: parsed.couponCode || current.coupon,
      }));
      setBookingDetails({ ...defaultBookingDetails, ...parsed.details });
      setBookingStep('review');
      setHasSearched(true);
      setIsQuickBookingOpen(true);
    } catch (error) {
      console.error('Unable to restore booking intent', error);
    }
  }, [services, sessionStatus]);

  const featuredService = selectedService || matchingServices[0] || null;
  const subtotal = getServiceSubtotal(featuredService, draft.guests);
  const coupon = appliedCoupon?.amount ? appliedCoupon : null;
  const subtotalAfterDiscount = Math.max(subtotal - (coupon?.amount || 0), 0);
  const platformFee = Math.round(subtotalAfterDiscount * 0.07);
  const total = subtotalAfterDiscount + platformFee;

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
    setHasSearched(true);
    setBookingStep('search');
    setIsQuickBookingOpen(false);
    closeMobileNav();
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  };

  const selectService = (service: PartnerService) => {
    setSelectedService(service);
    setAppliedCoupon(null);
    setQuoteConfirmation(null);
  };

  const startBooking = (service: PartnerService) => {
    selectService(service);
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
      {!hasSearched && (
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
            />
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
                <Heart size={14} fill="currentColor" /> Good food. Made with
                care.
              </div>
              <h1 style={styles.heroTitle}>
                Private Chefs. Catering. Experiences.
                <span style={styles.heroAccent}> Delivered to you.</span>
              </h1>
              <p style={styles.heroText}>
                From intimate dinners to grand celebrations, we bring
                exceptional food experiences to your door. Book in under a
                minute.
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
              <MiniDatePicker
                value={draft.date}
                onChange={(value) => updateDraft('date', value)}
              />
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
      )}

      {hasSearched && (
        <SearchResultsExperience
          draft={draft}
          cityOptions={cityOptions}
          matchingServices={matchingServices}
          isLoading={isLoading}
          error={Boolean(error)}
          selectedService={featuredService}
          sessionStatus={sessionStatus}
          cuisineOptions={cuisineOptions}
          eventTypeOptions={eventTypeOptions}
          serviceLabel={(service: PartnerService) =>
            getServiceType(service.service_key)?.label
          }
          experienceLabel={(service: PartnerService) =>
            getExperienceType(service.experience_type_key)?.label
          }
          onDraftChange={updateDraft}
          onFindOptions={findOptions}
          onBackToHome={() => {
            setHasSearched(false);
            setIsQuickBookingOpen(false);
            setSelectedService(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectService={startBooking}
          onApplyCoupon={applyCoupon}
          isMobileFilterOpen={isMobileFilterOpen}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          onCloseMobileFilters={() => setIsMobileFilterOpen(false)}
        />
      )}

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
        platformFee={platformFee}
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

      {!hasSearched && (
        <>
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

          <section style={styles.mealBanner}>
            <div>
              <h2 style={styles.mealTitle}>Good food. Made with care.</h2>
              <p style={styles.mealText}>
                Thoughtfully prepared meals by expert kitchens, delivered for
                weekly routines and busy days.
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
              links={[
                'How It Works',
                'Become a Partner',
                'About Us',
                'Careers',
              ]}
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
        </>
      )}
    </main>
  );
}

function SearchResultsExperience({
  draft,
  cityOptions,
  matchingServices,
  isLoading,
  error,
  selectedService,
  sessionStatus,
  cuisineOptions,
  eventTypeOptions,
  serviceLabel,
  experienceLabel,
  onDraftChange,
  onFindOptions,
  onBackToHome,
  onSelectService,
  onApplyCoupon,
  isMobileFilterOpen,
  onOpenMobileFilters,
  onCloseMobileFilters,
}: any) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().slice(0, 10);
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const [activeMobileFilterIndex, setActiveMobileFilterIndex] = useState(0);
  const resultCount = matchingServices.length;
  const experienceFilters = Array.from(
    new Set(
      matchingServices
        .map((service: PartnerService) => experienceLabel(service))
        .filter(Boolean)
    )
  ).slice(0, 5) as string[];
  const activeServiceTitle = serviceTitleForKey(draft.service);
  const mobileFilterTabs = [
    'AI Smart Filter',
    'Sort by',
    'Service type',
    'Cuisine',
    'Event type',
    'Booking',
  ];
  const filterOptionGroups = [
    {
      title: 'AI Smart Filter',
      options: [
        'Vegetarian dinner under 5000',
        'Premium buffet',
        'Family style',
      ],
    },
    {
      title: 'Sort by',
      options: ['Recommended', 'Price low to high', 'Best capacity match'],
    },
    {
      title: 'Service type',
      options: ['Private Chef', 'Catering', 'Private Events'],
    },
    {
      title: 'Cuisine',
      options: (cuisineOptions.length
        ? cuisineOptions
        : fallbackCuisineFilters
      ).slice(0, 8),
    },
    {
      title: 'Event type',
      options: (eventTypeOptions.length
        ? eventTypeOptions
        : fallbackEventFilters
      ).slice(0, 8),
    },
    {
      title: 'Booking',
      options: ['Instant booking', 'Quote available', 'Offers available'],
    },
  ];

  return (
    <section id="search-results" style={styles.searchResultsShell}>
      <MobileSearchSummary
        draft={draft}
        resultCount={resultCount}
        onEdit={() => setIsEditingSearch((open) => !open)}
        onBack={onBackToHome}
      />
      <div
        className={isEditingSearch ? 'is-editing-search' : ''}
        style={styles.resultsTopbar}
      >
        <div style={styles.resultsRouteRow}>
          <button
            type="button"
            style={styles.resultsBackButton}
            onClick={onBackToHome}
          >
            <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div>
            <strong>
              {serviceTitleForKey(draft.service)} in{' '}
              {draft.location || 'your city'}
            </strong>
            <span>{resultCount} approved options</span>
          </div>
        </div>

        <div className="results-search-bar" style={styles.resultsSearchBar}>
          <Field icon={MapPin} label="City">
            <select
              value={draft.location}
              onChange={(event) =>
                onDraftChange('location', event.target.value)
              }
              style={styles.input}
            >
              {cityOptions.map((city: { id: string; name: string }) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </Field>
          <MiniDatePicker
            value={draft.date}
            onChange={(value) => onDraftChange('date', value)}
          />
          <div style={styles.quickDateButtons}>
            <button
              type="button"
              style={{
                ...styles.dateChip,
                ...(draft.date === today ? styles.dateChipActive : {}),
              }}
              onClick={() => onDraftChange('date', today)}
            >
              Today
            </button>
            <button
              type="button"
              style={{
                ...styles.dateChip,
                ...(draft.date === tomorrow ? styles.dateChipActive : {}),
              }}
              onClick={() => onDraftChange('date', tomorrow)}
            >
              Tomorrow
            </button>
          </div>
          <Field icon={Users} label="Guests">
            <input
              type="number"
              min={1}
              value={draft.guests}
              onChange={(event) =>
                onDraftChange('guests', Number(event.target.value || 1))
              }
              style={styles.input}
            />
          </Field>
          <button
            type="button"
            style={styles.resultsSearchButton}
            onClick={() => onFindOptions()}
          >
            Search
          </button>
        </div>
      </div>

      <div className="mobile-filter-strip" style={styles.mobileFilterStrip}>
        <button
          type="button"
          style={styles.mobileFilterChip}
          onClick={onOpenMobileFilters}
        >
          <SlidersHorizontal size={15} /> Filter & Sort
        </button>
        <button type="button" style={styles.mobileFilterChip}>
          <Sparkles size={15} /> AI Smart Filter
        </button>
        <button type="button" style={styles.mobileFilterChip}>
          {activeServiceTitle}
        </button>
        <button type="button" style={styles.mobileFilterChip}>
          Instant
        </button>
        <button type="button" style={styles.mobileFilterChip}>
          Offers
        </button>
      </div>

      <div className="results-layout" style={styles.resultsLayout}>
        <aside className="results-filter-panel" style={styles.filterPanel}>
          <div style={styles.filterHeader}>
            <h2>Filters</h2>
            <button
              type="button"
              style={styles.clearFiltersButton}
              onClick={() => onDraftChange('service', 'chef')}
            >
              Clear
            </button>
          </div>
          <div style={styles.smartFilterBox}>
            <strong>AI Smart Filter</strong>
            <input
              placeholder="Try 'veg dinner under 5000'"
              style={styles.smartFilterInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <span>Service type</span>
            <FilterChip
              active={draft.service === 'chef'}
              onClick={() => onDraftChange('service', 'chef')}
            >
              Private Chef
            </FilterChip>
            <FilterChip
              active={draft.service === 'catering'}
              onClick={() => onDraftChange('service', 'catering')}
            >
              Catering
            </FilterChip>
            <FilterChip
              active={draft.service === 'restaurant_private_event'}
              onClick={() =>
                onDraftChange('service', 'restaurant_private_event')
              }
            >
              Private Events
            </FilterChip>
          </div>
          <div style={styles.filterGroup}>
            <span>Preferences</span>
            <FilterChip>Instant booking</FilterChip>
            <FilterChip>Quote available</FilterChip>
            <FilterChip>High capacity</FilterChip>
            <FilterChip>Offers available</FilterChip>
            {experienceFilters.map((label) => (
              <FilterChip key={label}>{label}</FilterChip>
            ))}
          </div>
          <div style={styles.filterGroup}>
            <span>Cuisine</span>
            {(cuisineOptions.length
              ? cuisineOptions
              : fallbackCuisineFilters
            ).map((label: string) => (
              <FilterChip key={label}>{label}</FilterChip>
            ))}
          </div>
          <div style={styles.filterGroup}>
            <span>Event type</span>
            {(eventTypeOptions.length
              ? eventTypeOptions
              : fallbackEventFilters
            ).map((label: string) => (
              <FilterChip key={label}>{label}</FilterChip>
            ))}
          </div>
        </aside>

        <div style={styles.resultsMain}>
          <div className="results-promo-rail" style={styles.promoRail}>
            <PromoCard title="All options" text="Approved Droooly partners" />
            <PromoCard title="Instant" text="Book faster" highlight />
            <PromoCard title="Offers" text="Try DROOOLY10" />
            <PromoCard title="Just for you" text="Matched by guests" />
          </div>

          <div className="results-list-header" style={styles.resultsListHeader}>
            <strong>{resultCount} options found</strong>
            <div
              className="results-list-actions"
              style={styles.resultsListActions}
            >
              <span>Sort by:</span>
              <button className="results-list-header-button" type="button">
                Recommended
              </button>
              <button className="results-list-header-button" type="button">
                Price
              </button>
              <button className="results-list-header-button" type="button">
                Capacity
              </button>
            </div>
          </div>

          <div style={styles.resultsNotice}>
            Verified partners, secure payment, and clear partner communication
          </div>

          {error ? (
            <div style={styles.emptyState}>
              Unable to load services right now.
            </div>
          ) : isLoading ? (
            <div style={styles.resultsList}>
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
            <div style={styles.resultsList}>
              {matchingServices.map(
                (service: PartnerService, index: number) => (
                  <SearchResultCard
                    key={service.id}
                    service={service}
                    image={getServiceImage(service, index)}
                    serviceLabel={serviceLabel(service)}
                    experienceLabel={experienceLabel(service)}
                    selected={selectedService?.id === service.id}
                    onBook={() => onSelectService(service)}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>

      {isMobileFilterOpen && (
        <div
          className="mobile-filter-overlay"
          style={styles.mobileFilterOverlay}
          onClick={onCloseMobileFilters}
        >
          <section
            className="mobile-filter-sheet"
            style={styles.mobileFilterSheet}
            onClick={(event) => event.stopPropagation()}
          >
            <header style={styles.mobileFilterHeader}>
              <div>
                <strong>Sort and filter</strong>
                <span>
                  {activeServiceTitle} in {draft.location || 'your city'}
                </span>
              </div>
              <button
                type="button"
                style={styles.mobileFilterClose}
                onClick={onCloseMobileFilters}
                aria-label="Close filters"
              >
                <X size={22} />
              </button>
            </header>
            <div style={styles.mobileFilterBody}>
              <nav style={styles.mobileFilterTabs}>
                {mobileFilterTabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveMobileFilterIndex(index)}
                    style={{
                      ...styles.mobileFilterTab,
                      ...(index === activeMobileFilterIndex
                        ? styles.mobileFilterTabActive
                        : {}),
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              <div style={styles.mobileFilterOptions}>
                <div
                  key={filterOptionGroups[activeMobileFilterIndex].title}
                  style={styles.mobileFilterGroup}
                >
                  <strong>
                    {filterOptionGroups[activeMobileFilterIndex].title}
                  </strong>
                  {filterOptionGroups[activeMobileFilterIndex].options.map(
                    (option: string, index: number) => (
                      <button
                        key={option}
                        type="button"
                        style={styles.mobileFilterOption}
                        onClick={() => {
                          if (option === 'Private Chef')
                            onDraftChange('service', 'chef');
                          if (option === 'Catering')
                            onDraftChange('service', 'catering');
                          if (option === 'Private Events')
                            onDraftChange(
                              'service',
                              'restaurant_private_event'
                            );
                        }}
                      >
                        <span>
                          <b>{option}</b>
                          <small>
                            {index === 0
                              ? `${resultCount || 0} matching options`
                              : 'Available from partner data'}
                          </small>
                        </span>
                        <i />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
            <footer style={styles.mobileFilterFooter}>
              <button
                type="button"
                style={styles.mobileFilterSecondaryButton}
                onClick={() => onDraftChange('service', 'chef')}
              >
                Clear all
              </button>
              <button
                type="button"
                style={styles.mobileFilterPrimaryButton}
                onClick={onCloseMobileFilters}
              >
                Apply
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

function MobileSearchSummary({
  draft,
  resultCount,
  onEdit,
  onBack,
}: {
  draft: BookingDraft;
  resultCount: number;
  onEdit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mobile-search-summary" style={styles.mobileSearchSummary}>
      <button type="button" style={styles.resultsBackButton} onClick={onBack}>
        <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <div>
        <strong>
          {serviceTitleForKey(draft.service)} in {draft.location}
        </strong>
        <span>
          {formatDisplayDate(draft.date)} • {draft.guests} guests •{' '}
          {resultCount} options
        </span>
      </div>
      <button type="button" style={styles.mobileEditButton} onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

function MiniDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = parseLocalDate(value) || new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const days = getCalendarDays(visibleMonth);
  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth);

  const chooseDate = (date: Date) => {
    onChange(formatLocalDate(date));
    setIsOpen(false);
  };

  return (
    <div style={styles.datePickerWrap}>
      <button
        type="button"
        style={styles.datePickerButton}
        onClick={() => setIsOpen((open) => !open)}
      >
        <CalendarDays size={18} />
        <span>
          <small style={styles.dateText}>Date</small> <br/>
          <strong>{formatDisplayDate(value)}</strong>
        </span>
      </button>
      {isOpen && (
        <div style={styles.datePopover}>
          <div style={styles.dateWeekdays}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div style={styles.calendarHead}>
            <button
              style={styles.calendarNavButton}
              type="button"
              onClick={() =>
                setVisibleMonth(
                  new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth() - 1,
                    1
                  )
                )
              }
            >
              <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <strong>{monthLabel}</strong>
            <button
              type="button"
              style={styles.calendarNavButton}
              onClick={() =>
                setVisibleMonth(
                  new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth() + 1,
                    1
                  )
                )
              }
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <div style={styles.calendarGrid}>
            {days.map((date, index) => {
              const currentMonth = date.getMonth() === visibleMonth.getMonth();
              const selected = formatLocalDate(date) === value;
              const weekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <button
                  key={`${date.toISOString()}-${index}`}
                  type="button"
                  onClick={() => chooseDate(date)}
                  style={{
                    ...styles.calendarDay,
                    ...(currentMonth ? {} : styles.calendarDayMuted),
                    ...(weekend && currentMonth
                      ? styles.calendarDayWeekend
                      : {}),
                    ...(selected ? styles.calendarDaySelected : {}),
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.filterChip,
        ...(active ? styles.filterChipActive : {}),
      }}
    >
      {children}
    </button>
  );
}

function PromoCard({
  title,
  text,
  highlight = false,
}: {
  title: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.promoCard,
        ...(highlight ? styles.promoCardHighlight : {}),
      }}
    >
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function SearchResultCard({
  service,
  image,
  serviceLabel,
  experienceLabel,
  selected,
  onBook,
}: any) {
  const cuisineTags = getAttributeList(service.attributes, 'cuisines');
  const eventTags = getAttributeList(service.attributes, 'event_types');
  const mediaCount = Array.isArray(service.media) ? service.media.length : 0;
  const serviceRecord = service as PartnerService & Record<string, unknown>;
  const ratingValue = Number(
    serviceRecord.rating ||
      serviceRecord.partner_rating ||
      serviceRecord.average_rating ||
      0
  );
  const priceLabel = formatMoney(
    service.base_price || 0,
    service.currency_code
  );

  return (
    <article
      className="search-result-card"
      style={{
        ...styles.searchResultCard,
        ...(selected ? styles.searchResultCardActive : {}),
      }}
    >
      <div style={styles.searchResultImageWrap}>
        <img src={image} alt={service.title} style={styles.searchResultImage} />
        {mediaCount > 1 && (
          <div style={styles.searchResultDots}>
            {Array.from({ length: Math.min(mediaCount, 4) }).map((_, index) => (
              <span
                key={index}
                style={{
                  ...styles.searchResultDot,
                  ...(index === 0 ? styles.searchResultDotActive : {}),
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div style={styles.searchResultContent}>
        <div style={styles.resultMeta}>
          <span>{serviceLabel || service.service_key}</span>
          <span>{formatBookingType(service.booking_type)}</span>
        </div>
        <h3>{service.title}</h3>
        <p>
          {service.short_description ||
            service.description ||
            'A verified Droooly service ready for your event.'}
        </p>
        <div style={styles.resultDetailGrid}>
          <span>
            {experienceLabel || service.experience_type_key || 'Flexible'}
          </span>
          <span>{formatGuestRange(service)}</span>
          <span>
            {mediaCount ? `${mediaCount} photos` : 'Verified partner'}
          </span>
          <span>{service.advance_notice_hours || 24}h notice</span>
        </div>
        <div style={styles.resultTagRow}>
          {[...cuisineTags, ...eventTags].slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div style={styles.searchResultAction}>
        <div style={styles.searchResultRating}>
          {ratingValue > 0 ? (
            <>
              <Star size={13} fill="currentColor" /> {ratingValue.toFixed(1)}
            </>
          ) : (
            'Verified'
          )}
        </div>
        <strong>{priceLabel}</strong>
        <span>
          {service.pricing_model ? humanize(service.pricing_model) : 'onwards'}
        </span>
        <button type="button" onClick={onBook} style={styles.viewOptionsButton}>
          View options
        </button>
      </div>
    </article>
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
  platformFee,
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
  platformFee: number;
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
  const currency = selectedService?.currency_code || 'INR';
  const serviceTitle = selectedService?.title || 'Choose a service';
  const isQuoteService = selectedService?.booking_type !== 'instant';
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const hasEnteredDetails = Boolean(
    details.customerName.trim() ||
    details.phone.trim() ||
    details.email.trim() ||
    details.address.trim() ||
    details.eventType.trim() ||
    details.cuisinePreference.trim() ||
    details.notes.trim()
  );
  const requestClose = () => {
    if (hasEnteredDetails) {
      setShowExitConfirm(true);
      return;
    }
    onClose();
  };
  const missingReviewFields = [
    !selectedService ? 'select a service' : '',
    !draft.date ? 'choose a date' : '',
    draft.guests <= 0 ? 'add guests' : '',
    !details.customerName.trim() ? 'enter your name' : '',
    !details.phone.trim() ? 'enter your phone' : '',
    !details.address.trim() ? 'add the service address' : '',
  ].filter(Boolean);

  if (!isOpen || step === 'search') return null;

  return (
    <section
      id="quick-booking"
      style={styles.drawerOverlay}
      onClick={requestClose}
    >
      <div
        className="quick-booking-drawer"
        style={styles.drawerPanel}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={styles.drawerHeaderCompact}>
          <button
            type="button"
            onClick={requestClose}
            style={styles.iconButton}
          >
            <X size={18} />
          </button>
          <div>
            <strong>{draft.location || 'Your city'}</strong>
            <span>{selectedService?.title || 'Selected service'}</span>
          </div>
        </div>

        <div style={styles.drawerSteps}>
          {(['details', 'review'] as BookingStep[]).map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => onStepChange(item)}
              disabled={item === 'review' && !canReview}
              style={{
                ...styles.drawerStep,
                ...(step === item ? styles.drawerStepActive : {}),
              }}
            >
              <span>{index + 1}</span>
              {item === 'details' ? 'Details' : 'Review'}
            </button>
          ))}
        </div>

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
                  <div style={styles.timeChipGrid}>
                    {['12:00', '15:00', '18:00', '20:00'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        style={{
                          ...styles.timeChip,
                          ...(details.eventTime === time
                            ? styles.timeChipActive
                            : {}),
                        }}
                        onClick={() => onDetailsChange('eventTime', time)}
                      >
                        {formatTimeLabel(time)}
                      </button>
                    ))}
                  </div>
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
              {showMissingFields && missingReviewFields.length > 0 && (
                <div style={styles.validationNote}>
                  To review, please {missingReviewFields.join(', ')}.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'review' && (
          <div style={styles.drawerBody}>
            <div style={styles.drawerSection}>
              <h3 style={styles.drawerSectionTitle}>Review your booking</h3>
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
              <SummaryRow
                label="Platform fees & taxes"
                value={formatMoney(platformFee, currency)}
              />
              <div style={styles.totalRow}>
                <span>{isQuoteService ? 'Estimated total' : 'Total'}</span>
                <strong>{formatMoney(total, currency)}</strong>
              </div>
              <div style={styles.reviewPolicyBox}>
                <strong>Cancellation policy</strong>
                <ul>
                  <li>
                    Free cancellation is available until the partner confirms
                    preparation or procurement.
                  </li>
                  <li>
                    After preparation begins, ingredient, staffing, venue, or
                    setup costs already committed by the partner may be deducted
                    from the refundable amount.
                  </li>
                  <li>
                    Date or time changes are supported when the partner has
                    availability for the new slot.
                  </li>
                  <li>
                    If the partner cannot fulfil a confirmed booking, Droooly
                    support will help with a replacement or full refund review.
                  </li>
                </ul>
              </div>
              {quoteConfirmation && (
                <div style={styles.couponSuccess}>{quoteConfirmation}</div>
              )}
            </div>
          </div>
        )}

        <div style={styles.drawerFooter}>
          <button
            type="button"
            style={styles.secondaryDrawerButton}
            onClick={() =>
              step === 'review' ? onStepChange('details') : requestClose()
            }
          >
            {step === 'review' ? 'Back' : 'Close'}
          </button>
          {step === 'details' && (
            <button
              type="button"
              style={styles.drawerPrimaryButton}
              onClick={() => {
                if (!canReview) {
                  setShowMissingFields(true);
                  return;
                }
                setShowMissingFields(false);
                onStepChange('review');
              }}
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
        {showExitConfirm && (
          <div
            style={styles.exitConfirmOverlay}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.exitConfirmCard}>
              <h3>Return to search results?</h3>
              <p>Your booking details are saved while you compare options.</p>
              <button
                type="button"
                style={styles.exitPrimaryButton}
                onClick={() => setShowExitConfirm(false)}
              >
                Continue booking
              </button>
              <button
                type="button"
                style={styles.exitSecondaryButton}
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
              >
                View other services
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
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

function parseLocalDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const date = parseLocalDate(value) || new Date();
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = new Date(firstDay);
  const offset = (firstDay.getDay() + 6) % 7;
  start.setDate(firstDay.getDate() - offset);
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function getNamedOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        return record.name || record.label || record.title || record.key;
      }
      return '';
    })
    .filter(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0
    );
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

function formatTimeLabel(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  if (Number.isNaN(hour)) return value;
  const date = new Date();
  date.setHours(hour, minute || 0, 0, 0);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getAttributeList(attributes: unknown, key: string): string[] {
  if (!attributes || typeof attributes !== 'object') return [];
  const record = attributes as Record<string, unknown>;
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return humanize(item);
      if (item && typeof item === 'object') {
        const option = item as Record<string, unknown>;
        return option.label || option.name || option.key;
      }
      return '';
    })
    .filter(
      (item): item is string => typeof item === 'string' && item.length > 0
    );
}

function humanize(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function serviceTitleForKey(value: ServiceFilter) {
  if (value === 'catering') return 'Catering';
  if (value === 'restaurant_private_event') return 'Private events';
  return 'Private chefs';
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
    .home-nav-links {
      display: none !important;
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

  @media (max-width: 1050px) {
    .results-layout {
      grid-template-columns: 1fr !important;
    }
    .results-filter-panel,
    .results-summary-panel {
      position: static !important;
      width: 100% !important;
    }
    .results-promo-rail {
      overflow-x: auto !important;
      grid-template-columns: repeat(4, minmax(180px, 1fr)) !important;
      scrollbar-width: none !important;
    }
    .results-promo-rail::-webkit-scrollbar {
      display: none !important;
    }
  }

  @media (max-width: 760px) {
    #search-results {
      background: #f5f4fa !important;
    }
    .results-topbar-spacer { display: none !important; }
    .mobile-search-summary {
      display: flex !important;
    }
    .mobile-filter-strip {
      display: flex !important;
      top: 57px !important;
      padding: 9px 12px !important;
    }
    #search-results > div:nth-child(2) {
      display: none !important;
    }
    #search-results > div:nth-child(2).is-editing-search {
      display: block !important;
      position: sticky !important;
      top: 58px !important;
      z-index: 23 !important;
      padding: 10px 12px !important;
    }
    #search-results > div:nth-child(2).is-editing-search > div:first-child {
      display: none !important;
    }
    .results-search-bar {
      grid-template-columns: 1fr !important;
      border-radius: 18px !important;
      padding: 10px !important;
      box-shadow: none !important;
      gap: 8px !important;
    }
    .results-search-bar > div:nth-child(3),
    .results-search-bar > button {
      grid-column: 1 / -1 !important;
    }
    .results-search-bar > button {
      height: 44px !important;
      border-radius: 999px !important;
    }
    .results-search-bar > div:nth-child(3) {
      justify-content: flex-start !important;
    }
    .results-search-bar > * {
      min-width: 0 !important;
    }
    .results-search-bar label,
    .results-search-bar [style*="datePickerButton"] {
      min-height: 50px !important;
    }
    .results-search-bar small,
    .results-search-bar label span {
      font-size: 11px !important;
    }
    .results-search-bar strong,
    .results-search-bar input,
    .results-search-bar select {
      font-size: 13px !important;
    }
    .results-filter-panel {
      display: none !important;
    }
    .results-layout {
      margin-top: 12px !important;
      padding: 0 12px !important;
    }
    .results-promo-rail {
      display: flex !important;
      gap: 12px !important;
      margin: 4px -12px 12px 0 !important;
      padding: 0 12px 4px 0 !important;
      overflow-x: auto !important;
    }
    .results-promo-rail > div {
      min-width: 172px !important;
      min-height: 88px !important;
    }
    .results-list-header {
      border-radius: 14px !important;
      align-items: flex-start !important;
      flex-direction: column !important;
    }
    .results-list-actions {
      width: 100% !important;
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
    }
    .search-result-card {
      grid-template-columns: 94px minmax(0, 1fr) !important;
      align-items: start !important;
      gap: 12px !important;
      padding: 12px !important;
    }
    .search-result-card > div:first-child {
      width: 94px !important;
      height: 104px !important;
    }
    .search-result-card > div:first-child img {
      width: 94px !important;
      height: 104px !important;
    }
    .search-result-card > div:last-child {
      grid-column: 1 / -1 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      text-align: left !important;
      justify-items: stretch !important;
      border-top: 1px solid #eef0f5 !important;
      padding-top: 10px !important;
    }
    .search-result-card h3 {
      font-size: 16px !important;
      margin: 0 !important;
    }
    .search-result-card p {
      display: -webkit-box !important;
      -webkit-line-clamp: 3 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
      margin: 0 !important;
    }
    .quick-booking-drawer {
      height: min(88vh, 760px) !important;
      border-radius: 22px 22px 0 0 !important;
    }
  }

  @keyframes mobileSheetUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .mobile-filter-strip::-webkit-scrollbar { display: none; }
  .mobile-filter-option small,
  .mobile-filter-sheet small {
    display: block;
    margin-top: 4px;
    color: #6b7280;
    font-weight: 700;
  }
  .mobile-filter-sheet i {
    width: 20px;
    height: 20px;
    border: 2px solid #6b7280;
    border-radius: 5px;
    flex-shrink: 0;
  }
  .quick-booking-drawer ul {
    margin: 0;
    padding-left: 18px;
  }
  .quick-booking-drawer li + li {
    margin-top: 6px;
  }

  .home-service-toggle::-webkit-scrollbar { display: none; }
  .home-service-toggle { scrollbar-width: none; }

  .results-list-actions button,
  .results-list-header-button {
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    background: #ffffff;
    color: #070b1f;
    font: inherit;
    font-weight: 900;
    cursor: pointer;
    padding: 7px 11px;
  }

  .search-result-card button {
    border: none;
    border-radius: 999px;
    background: #5d42db;
    color: #ffffff;
    padding: 12px 17px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 12px 26px rgba(93, 66, 219, 0.22);
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
    body:has(#search-results) {
      overflow-x: hidden;
    }
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
      grid-template-columns: repeat(3, minmax(132px, 1fr)) !important;
      overflow-x: auto !important;
      padding-bottom: 4px !important;
    }
    .home-service-toggle button {
      white-space: nowrap !important;
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
    #quick-booking {
      align-items: flex-end !important;
      justify-content: center !important;
      padding: 0 !important;
    }
    .quick-booking-drawer {
      width: 100% !important;
      max-width: none !important;
      height: min(88vh, 760px) !important;
      border-radius: 22px 22px 0 0 !important;
      animation: drawerSheetUp .22s ease-out !important;
    }
  }
  @keyframes drawerSlideIn {
    from { transform: translateX(100%); opacity: .8; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes drawerSheetUp {
    from { transform: translateY(100%); opacity: .85; }
    to { transform: translateY(0); opacity: 1; }
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
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 22,
    alignItems: 'center',
    minHeight: 210,
  },
  heroCopy: {
    position: 'relative',
    zIndex: 2,
    paddingBottom: 12,
    maxWidth: 940,
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
    maxWidth: 940,
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
    maxWidth: 760,
  },
  quickBookingCard: {
    maxWidth: 'min(1180px, calc(100vw - 32px))',
    margin: '4px auto 0',
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

  mobileSearchSummary: {
    display: 'none',
    alignItems: 'center',
    gap: 10,
    background: '#ffffff',
    borderBottom: '1px solid #e7e5ef',
    padding: '10px 12px',
    position: 'sticky',
    top: 0,
    zIndex: 24,
  },
  mobileEditButton: {
    border: '1px solid #d9dce7',
    borderRadius: 999,
    background: '#ffffff',
    color: ink,
    padding: '8px 12px',
    fontWeight: 900,
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  mobileFilterStrip: {
    display: 'none',
    gap: 8,
    overflowX: 'auto',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.98)',
    borderBottom: '1px solid #e7e5ef',
    position: 'sticky',
    top: 58,
    zIndex: 22,
    scrollbarWidth: 'none',
  },
  mobileFilterChip: {
    minHeight: 36,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    border: '1px solid #d9dce7',
    borderRadius: 999,
    background: '#ffffff',
    color: ink,
    padding: '0 12px',
    fontWeight: 900,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  mobileFilterOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.46)',
    zIndex: 90,
    display: 'flex',
    alignItems: 'flex-end',
  },
  mobileFilterSheet: {
    width: '100%',
    maxHeight: '86vh',
    background: '#ffffff',
    borderRadius: '22px 22px 0 0',
    boxShadow: '0 -22px 60px rgba(15, 23, 42, 0.22)',
    overflow: 'hidden',
    animation: 'mobileSheetUp 220ms ease-out',
  },
  mobileFilterHeader: {
    minHeight: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    padding: '14px 16px',
    borderBottom: '1px solid #ebeaf2',
  },
  mobileFilterClose: {
    width: 42,
    height: 42,
    border: 'none',
    borderRadius: '50%',
    background: '#eeeeef',
    color: ink,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  mobileFilterBody: {
    display: 'grid',
    gridTemplateColumns: '116px minmax(0, 1fr)',
    minHeight: 390,
    maxHeight: 'calc(86vh - 148px)',
    overflow: 'hidden',
  },
  mobileFilterTabs: {
    background: '#f3f2f8',
    borderRight: '1px solid #e5e3ed',
    overflowY: 'auto',
  },
  mobileFilterTab: {
    width: '100%',
    minHeight: 58,
    border: 'none',
    borderBottom: '1px solid #e5e3ed',
    background: 'transparent',
    color: ink,
    textAlign: 'left',
    padding: '0 12px',
    fontWeight: 900,
    fontSize: 12,
    cursor: 'pointer',
  },
  mobileFilterTabActive: {
    background: '#ffffff',
    color: purple,
    borderLeft: `3px solid ${purple}`,
  },
  mobileFilterOptions: {
    overflowY: 'auto',
    padding: '10px 14px 18px',
    display: 'grid',
    gap: 18,
  },
  mobileFilterGroup: {
    display: 'grid',
    gap: 8,
  },
  mobileFilterOption: {
    width: '100%',
    minHeight: 62,
    border: '1px solid #eef0f5',
    borderRadius: 14,
    background: '#ffffff',
    color: ink,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    textAlign: 'left',
    cursor: 'pointer',
    padding: '0 12px',
  },
  mobileFilterFooter: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '12px 16px 16px',
    borderTop: '1px solid #ebeaf2',
    background: '#ffffff',
  },
  mobileFilterSecondaryButton: {
    height: 50,
    borderRadius: 999,
    border: '1px solid #1f2937',
    background: '#ffffff',
    color: ink,
    fontWeight: 900,
    cursor: 'pointer',
  },
  mobileFilterPrimaryButton: {
    height: 50,
    borderRadius: 999,
    border: 'none',
    background: purple,
    color: '#ffffff',
    fontWeight: 900,
    cursor: 'pointer',
  },
  searchResultsShell: {
    background: '#f3f2f8',
    padding: '0 0 44px',
    borderTop: '1px solid #eceaf4',
  },
  resultsTopbar: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid #e7e5ef',
    padding: '18px min(7vw, 96px) 12px',
  },
  resultsRouteRow: {
    maxWidth: 1180,
    margin: '0 auto 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  resultsBackButton: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '1px solid #e3e7f1',
    background: '#fff',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
  resultsSearchBar: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr auto .8fr auto',
    gap: 10,
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #dedde7',
    borderRadius: 18,
    padding: 10,
    boxShadow: '0 16px 38px rgba(15, 23, 42, 0.08)',
  },

  datePickerWrap: { position: 'relative', minWidth: 0 },
  datePickerButton: {
    width: '100%',
    minHeight: 58,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    border: '1px solid #e3e7f1',
    borderRadius: 12,
    background: '#ffffff',
    color: ink,
    padding: '10px 12px',
    cursor: 'pointer',
  },
  dateText: {
    color: 'rgb(138, 145, 166)',
    fontSize: '12px',
    fontWeight: 800,
    display: 'inline-block',
    padding: '8px 0',
  },
  datePopover: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: 0,
    width: 400,
    maxWidth: 'calc(100vw - 28px)',
    background: '#ffffff',
    borderRadius: 18,
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.28)',
    border: '1px solid #e6e3ee',
    padding: '18px 24px 24px',
    zIndex: 99960,
  },
  dateWeekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    paddingBottom: 18,
    borderBottom: '1px solid #efedf5',
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    border: 'none',
    borderRadius: '50%',
    background: 'transparent',
    color: ink,
    display: 'inline-grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
  calendarHead: {
    display: 'grid',
    gridTemplateColumns: '44px 1fr 44px',
    alignItems: 'center',
    gap: 8,
    margin: '14px 0 10px',
    textAlign: 'center',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 6,
  },
  calendarDay: {
    height: 34,
    border: 'none',
    borderRadius: '50%',
    background: 'transparent',
    color: ink,
    fontWeight: 800,
    cursor: 'pointer',
  },
  calendarDayMuted: { color: '#b7bac4' },
  calendarDayWeekend: { color: '#e11d48' },
  calendarDaySelected: { background: '#333333', color: '#ffffff' },
  clearFiltersButton: {
    border: 'none',
    background: 'transparent',
    color: ink,
    textDecoration: 'underline',
    fontWeight: 900,
    cursor: 'pointer',
  },
  quickDateButtons: {
    display: 'inline-flex',
    gap: 8,
    justifyContent: 'center',
  },
  dateChip: {
    border: 'none',
    borderRadius: 999,
    background: '#eeeeef',
    color: '#6b7280',
    padding: '12px 14px',
    fontWeight: 900,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  dateChipActive: {
    background: '#f1dada',
    color: ink,
  },
  resultsSearchButton: {
    minWidth: 72,
    height: 52,
    border: 'none',
    borderRadius: 999,
    background: purple,
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    padding: '0 18px',
  },
  resultsLayout: {
    maxWidth: 1180,
    margin: '18px auto 0',
    padding: '0 18px',
    display: 'grid',
    gridTemplateColumns: '270px minmax(0, 1fr)',
    gap: 16,
    alignItems: 'start',
  },
  filterPanel: {
    position: 'sticky',
    top: 142,
    background: '#ffffff',
    borderRadius: 18,
    border: '1px solid #eceaf2',
    overflow: 'hidden',
    boxShadow: '0 10px 28px rgba(15,23,42,0.06)',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 12px',
    borderBottom: '1px solid #eceaf2',
  },
  smartFilterBox: {
    margin: 14,
    padding: 14,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #eadcff, #fff)',
    display: 'grid',
    gap: 10,
  },
  smartFilterInput: {
    border: '1px solid #d7c6ff',
    borderRadius: 10,
    background: '#ffffff',
    padding: '11px 12px',
    color: ink,
    fontWeight: 800,
    outline: 'none',
  },
  filterGroup: {
    padding: '14px 16px',
    borderTop: '1px solid #eceaf2',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 9,
  },
  filterChip: {
    border: '1px solid #d9dce7',
    background: '#ffffff',
    color: ink,
    borderRadius: 10,
    padding: '9px 11px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  filterChipActive: {
    background: purple,
    borderColor: purple,
    color: '#ffffff',
  },
  resultsMain: { minWidth: 0 },
  promoRail: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
    marginBottom: 16,
  },
  promoCard: {
    minHeight: 104,
    borderRadius: 16,
    background: '#ffffff',
    border: '1px solid #eceaf2',
    boxShadow: '0 12px 28px rgba(15,23,42,0.06)',
    padding: 16,
    display: 'grid',
    alignContent: 'center',
    gap: 6,
  },
  promoCardHighlight: {
    background: 'linear-gradient(135deg, #ffd468, #f5a632)',
  },
  resultsListHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    background: '#ffffff',
    borderRadius: '14px 14px 0 0',
    padding: '14px 16px',
    fontWeight: 900,
  },
  resultsListActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  resultsNotice: {
    background: '#f8ddc8',
    padding: '13px 16px',
    textAlign: 'center',
    fontWeight: 900,
    marginBottom: 16,
  },
  resultsList: { display: 'grid', gap: 14 },
  searchResultCard: {
    display: 'grid',
    gridTemplateColumns: '132px minmax(0, 1fr) 150px',
    gap: 16,
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #eceaf2',
    borderRadius: 18,
    padding: 16,
    boxShadow: '0 12px 30px rgba(15,23,42,0.07)',
  },
  searchResultCardActive: {
    borderColor: purple,
    boxShadow: '0 16px 36px rgba(93,66,219,0.14)',
  },
  searchResultImage: {
    width: 132,
    height: 106,
    objectFit: 'cover',
    borderRadius: 14,
  },
  searchResultImageWrap: {
    position: 'relative',
    width: 132,
    height: 106,
  },
  searchResultDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
  },
  searchResultDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.65)',
  },
  searchResultDotActive: {
    width: 13,
    borderRadius: 999,
    background: '#ffffff',
  },
  searchResultContent: { display: 'grid', gap: 8, minWidth: 0 },
  searchResultAction: {
    display: 'grid',
    gap: 4,
    justifyItems: 'end',
    textAlign: 'right',
  },
  searchResultRating: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    background: '#dcfce7',
    color: '#166534',
    padding: '5px 7px',
    fontSize: 12,
    fontWeight: 900,
  },
  resultsSummaryPanel: {
    position: 'sticky',
    top: 142,
    background: '#ffffff',
    border: '1px solid #eceaf2',
    borderRadius: 18,
    padding: 16,
    display: 'grid',
    gap: 12,
    boxShadow: '0 10px 28px rgba(15,23,42,0.06)',
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
  resultDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 8,
    color: muted,
    fontSize: 12,
    fontWeight: 800,
  },
  resultTagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  viewOptionsButton: {
    border: 'none',
    borderRadius: 999,
    background: purple,
    color: '#ffffff',
    padding: '12px 17px',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 12px 26px rgba(93, 66, 219, 0.22)',
  },
  drawerHeaderCompact: {
    minHeight: 64,
    display: 'grid',
    gridTemplateColumns: '44px 1fr',
    alignItems: 'center',
    gap: 10,
    padding: '12px 18px',
    borderBottom: '1px solid #eef0f5',
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
  validationNote: {
    marginTop: 12,
    padding: '12px 14px',
    borderRadius: 12,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fed7aa',
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.5,
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

  exitConfirmOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.45)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 5,
    padding: 20,
  },
  exitConfirmCard: {
    width: 'min(380px, 100%)',
    background: '#ffffff',
    borderRadius: 16,
    padding: 18,
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.28)',
    textAlign: 'center',
    display: 'grid',
    gap: 12,
  },
  exitPrimaryButton: {
    border: 'none',
    borderRadius: 999,
    background: purple,
    color: '#ffffff',
    padding: '13px 16px',
    fontWeight: 900,
    cursor: 'pointer',
  },
  exitSecondaryButton: {
    border: '1px solid #d9dce7',
    borderRadius: 999,
    background: '#ffffff',
    color: ink,
    padding: '13px 16px',
    fontWeight: 900,
    cursor: 'pointer',
  },
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.42)',
    zIndex: 90,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: '0 18px',
  },
  drawerPanel: {
    width: 'min(1120px, 100%)',
    height: 'min(84vh, 760px)',
    background: '#ffffff',
    boxShadow: '0 -22px 70px rgba(15, 23, 42, 0.22)',
    borderRadius: '28px 28px 0 0',
    padding: 0,
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto',
    overflow: 'hidden',
    position: 'relative',
    animation: 'drawerSheetUp .24s ease-out',
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
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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

  timeChipGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 8,
  },
  timeChip: {
    border: '1px solid #d9dce7',
    borderRadius: 999,
    background: '#ffffff',
    color: ink,
    padding: '10px 12px',
    fontWeight: 900,
    cursor: 'pointer',
  },
  timeChipActive: {
    background: '#f0ebff',
    borderColor: '#cfc4ff',
    color: purple,
  },
  reviewPolicyBox: {
    display: 'grid',
    gap: 8,
    background: '#f8fafc',
    border: '1px solid #e6eaf2',
    borderRadius: 14,
    padding: 14,
    color: muted,
    fontSize: 13,
    lineHeight: 1.5,
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
