'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

// ============ TYPES ============
interface Package {
  id: string;
  title: string;
  price: number;
  description: string;
  includes: string[];
  minGuests?: number;
  maxGuests?: number;
}

interface Chef {
  id: string;
  name: string;
  chefType: 'HOME_CHEF' | 'CATERER' | 'PRIVATE_CHEF' | 'MEAL_PLAN_PROVIDER';
  profileImage: string;
  rating: number;
  reviewsCount: number;
  totalBookings: number;
  city: string;
  experience: number;
  bio: string;
  cuisines: string[];
  specialties: string[];
  hygieneCertified: boolean;
  isVerified: boolean;
  isAvailableToday: boolean;
  instantBook: boolean;
  packages: Package[];
  reviews?: Array<{ name: string; rating: number; text: string }>;
}

type BookingStep = 'idle' | 'service_select' | 'details' | 'confirmation' | 'payment' | 'success';
type ServiceType = 'event' | 'home' | null;
type MealType = 'breakfast' | 'lunch' | 'dinner' | null;

interface BookingState {
  serviceType: ServiceType;
  mealType: MealType;
  packageId: string | null;
  date: string;
  timeSlot?: string;
  guestCount: number;
  vegPreference?: 'veg' | 'non-veg' | 'both';
}

// ============ STYLES ============
const styles = {
  pageContainer: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  } as CSSProperties,

  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '48px 20px',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  } as CSSProperties,

  maxWidthWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as CSSProperties,

  heroContent: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'start' as const,
  } as CSSProperties,

  heroImageContainer: {
    fontSize: '140px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    height: '320px',
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  heroInfo: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '20px',
  } as CSSProperties,

  chefNameRow: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '12px',
    flexWrap: 'wrap' as const,
  } as CSSProperties,

  chefName: {
    fontSize: '40px',
    fontWeight: '900' as const,
    color: 'white',
    margin: 0,
    lineHeight: 1.1,
  } as CSSProperties,

  chefTypeBadge: {
    padding: '8px 16px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700' as const,
    backdropFilter: 'blur(10px)',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  ratingRow: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px',
    flexWrap: 'wrap' as const,
  } as CSSProperties,

  ratingBox: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '6px',
    fontSize: '16px',
    fontWeight: '700' as const,
  } as CSSProperties,

  infoRow: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    fontSize: '14px',
    opacity: 0.95,
  } as CSSProperties,

  bioText: {
    fontSize: '15px',
    lineHeight: '1.6',
    margin: 0,
    opacity: 0.95,
  } as CSSProperties,

  tagsContainer: {
    display: 'flex' as const,
    gap: '8px',
    flexWrap: 'wrap' as const,
  } as CSSProperties,

  tag: {
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700' as const,
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  ctaButtonsRow: {
    display: 'flex' as const,
    gap: '12px',
  } as CSSProperties,

  ctaBtn: {
    padding: '14px 28px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'white',
    color: '#667eea',
    fontWeight: '700' as const,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  mainWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  } as CSSProperties,

  contentArea: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '40px',
  } as CSSProperties,

  packagesGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  } as CSSProperties,

  packageCard: {
    backgroundColor: 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  } as CSSProperties,

  packageCardHovered: {
    backgroundColor: 'white',
    border: '2px solid #667eea',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.18)',
  } as CSSProperties,

  priceSection: {
    marginBottom: '16px',
  } as CSSProperties,

  priceValue: {
    fontSize: '28px',
    fontWeight: '900' as const,
    color: '#667eea',
    margin: '0',
  } as CSSProperties,

  priceUnit: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600' as const,
  } as CSSProperties,

  packageTitle: {
    fontSize: '18px',
    fontWeight: '800' as const,
    color: '#1e293b',
    margin: '0 0 8px 0',
  } as CSSProperties,

  packageDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  } as CSSProperties,

  includesList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '8px',
    margin: '16px 0',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
  } as CSSProperties,

  includeItem: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
  } as CSSProperties,

  selectPackageBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: '700' as const,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  // ===== DRAWER STYLES =====
  drawerOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  } as CSSProperties,

  drawer: {
    position: 'fixed' as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: '420px',
    backgroundColor: 'white',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    animation: 'slideIn 0.3s ease',
  } as CSSProperties,

  drawerHeader: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  } as CSSProperties,

  drawerTitle: {
    fontSize: '18px',
    fontWeight: '800' as const,
    color: '#1e293b',
    margin: 0,
  } as CSSProperties,

  closeBtn: {
    width: '36px',
    height: '36px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as CSSProperties,

  drawerContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px 20px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '24px',
  } as CSSProperties,

  drawerSection: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '12px',
  } as CSSProperties,

  formLabel: {
    fontSize: '13px',
    fontWeight: '700' as const,
    color: '#1e293b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as CSSProperties,

  formInput: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
  } as CSSProperties,

  formSelect: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer',
  } as CSSProperties,

  buttonGroup: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  } as CSSProperties,

  buttonGroupThree: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
  } as CSSProperties,

  toggleButton: {
    padding: '12px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: '600' as const,
    fontSize: '13px',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  toggleButtonActive: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #667eea',
    backgroundColor: '#eef2ff',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: '600' as const,
    fontSize: '13px',
  } as CSSProperties,

  // ===== STICKY SUMMARY =====
  bookingSummary: {
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px',
  } as CSSProperties,

  summaryRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    fontSize: '13px',
  } as CSSProperties,

  summaryLabel: {
    color: '#64748b',
  } as CSSProperties,

  summaryValue: {
    fontWeight: '700' as const,
    color: '#1e293b',
  } as CSSProperties,

  totalPrice: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    fontSize: '18px',
    fontWeight: '800' as const,
    color: '#1e293b',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  } as CSSProperties,

  submitBtn: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: '700' as const,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  // ===== CONFIRMATION =====
  confirmationContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px',
  } as CSSProperties,

  confirmationItem: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  } as CSSProperties,

  confirmationLabel: {
    fontSize: '12px',
    color: '#64748b',
  } as CSSProperties,

  confirmationValue: {
    fontSize: '14px',
    fontWeight: '700' as const,
    color: '#1e293b',
  } as CSSProperties,

  // ===== PAYMENT =====
  paymentForm: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px',
  } as CSSProperties,

  paymentInput: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
  } as CSSProperties,

  // ===== SUCCESS =====
  successContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    textAlign: 'center' as const,
    gap: '16px',
    padding: '40px 20px',
  } as CSSProperties,

  successIcon: {
    fontSize: '60px',
    marginBottom: '16px',
  } as CSSProperties,

  successTitle: {
    fontSize: '20px',
    fontWeight: '800' as const,
    color: '#1e293b',
    margin: 0,
  } as CSSProperties,

  successText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.6',
  } as CSSProperties,

  // ===== REVIEWS =====
  reviewsSection: {
    backgroundColor: 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '40px',
  } as CSSProperties,

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '800' as const,
    color: '#1e293b',
    margin: '0 0 24px 0',
  } as CSSProperties,

  reviewCard: {
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
  } as CSSProperties,

  reviewHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '8px',
  } as CSSProperties,

  reviewName: {
    fontWeight: '700' as const,
    color: '#1e293b',
    margin: 0,
  } as CSSProperties,

  reviewRating: {
    color: '#f59e0b',
    fontWeight: '700' as const,
    fontSize: '13px',
  } as CSSProperties,

  reviewText: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0,
  } as CSSProperties,
};

// ============ SAMPLE DATA ============
const CHEFS_DATA: Record<string, Chef> = {
  '1': {
    id: '1',
    name: 'Chef Rajesh Sharma',
    chefType: 'HOME_CHEF',
    profileImage: '👨‍🍳',
    rating: 4.8,
    reviewsCount: 245,
    totalBookings: 342,
    city: 'Hyderabad',
    experience: 8,
    bio: 'Passionate home chef specializing in authentic North Indian and Chinese cuisines.',
    cuisines: ['North Indian', 'Chinese'],
    specialties: ['Biryani', 'Butter Chicken'],
    hygieneCertified: true,
    isVerified: true,
    isAvailableToday: true,
    instantBook: true,
    packages: [
      {
        id: 'p1',
        title: 'Home Cooking - Breakfast',
        price: 400,
        description: 'Fresh breakfast prepared at your home',
        includes: ['Freshly cooked items', 'Setup & cleanup', 'For 2-4 people'],
      },
      {
        id: 'p2',
        title: 'Home Cooking - Lunch',
        price: 600,
        description: 'Delicious lunch at your home',
        includes: ['Main course', 'Side dishes', 'Dessert', 'Setup & cleanup'],
      },
      {
        id: 'p3',
        title: 'Home Cooking - Dinner',
        price: 700,
        description: 'Special dinner experience',
        includes: ['Multi-course meal', 'Beverages', 'Premium ingredients'],
      },
      {
        id: 'p4',
        title: 'Small Party Catering',
        price: 250,
        description: 'Perfect for small home gatherings',
        includes: ['3-4 dishes', 'Drinks', 'Dessert', 'Service for 10-20'],
        minGuests: 10,
        maxGuests: 20,
      },
      {
        id: 'p5',
        title: 'Medium Event Catering',
        price: 350,
        description: 'Great for larger celebrations',
        includes: ['5-6 dishes', 'Drinks', 'Dessert', 'Professional service'],
        minGuests: 20,
        maxGuests: 50,
      },
    ],
    reviews: [
      { name: 'Priya M.', rating: 5, text: 'Absolutely delicious! Highly recommend!' },
      { name: 'Amit K.', rating: 4.5, text: 'Great service and food quality.' },
    ],
  },
};

// ============ MAIN COMPONENT ============
export default function ChefDetailPage() {
  const params = useParams();
  const chefId = params.id as string;
  const chef = CHEFS_DATA[chefId];

  const [bookingStep, setBookingStep] = useState<BookingStep>('idle');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [booking, setBooking] = useState<BookingState>({
    serviceType: null,
    mealType: null,
    packageId: null,
    date: '',
    guestCount: 2,
    vegPreference: 'both',
  });

  if (!chef) return <div>Chef not found</div>;

  const handleStartBooking = () => {
    setBookingStep('service_select');
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    let total = selectedPackage.price;
    if (booking.serviceType === 'event' && booking.guestCount) {
      total = selectedPackage.price * booking.guestCount;
    }
    
    return total;
  };

  const getPriceDisplay = () => {
    if (!selectedPackage) return '₹0';
    
    if (booking.serviceType === 'event' && booking.guestCount) {
      return `₹${selectedPackage.price} × ${booking.guestCount} people = ₹${calculateTotal()}`;
    }
    
    return `₹${selectedPackage.price}`;
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.maxWidthWrapper}>
          <div style={styles.heroContent}>
            <div style={styles.heroImageContainer}>{chef.profileImage}</div>

            <div style={styles.heroInfo}>
              <div style={styles.chefNameRow}>
                <h1 style={styles.chefName}>{chef.name}</h1>
                <div style={styles.chefTypeBadge}>👨‍🍳 Home Chef</div>
              </div>

              <div style={styles.ratingRow}>
                <div style={styles.ratingBox}>
                  <span style={{ fontSize: '18px' }}>⭐</span>
                  <span>{chef.rating}</span>
                </div>
                <div style={styles.infoRow}>📍 {chef.city}</div>
                <div style={styles.infoRow}>💼 {chef.experience} years</div>
              </div>

              <div style={styles.infoRow}>🔥 <strong>{chef.totalBookings} bookings</strong></div>

              <p style={styles.bioText}>{chef.bio}</p>

              <div style={styles.tagsContainer}>
                {chef.isVerified && <div style={styles.tag}>✓ Verified</div>}
                {chef.hygieneCertified && <div style={styles.tag}>🏥 Certified</div>}
                {chef.isAvailableToday && <div style={styles.tag}>⚡ Available</div>}
              </div>

              <div style={styles.ctaButtonsRow}>
                <button style={styles.ctaBtn} onClick={handleStartBooking}>
                  ✓ Check Availability
                </button>
                <button style={styles.ctaBtn} onClick={handleStartBooking}>
                  📅 Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Packages */}
      <div style={styles.mainWrapper}>
        <div style={styles.contentArea}>
          <h2 style={styles.sectionTitle}>Available Packages</h2>
          
          <div style={styles.packagesGrid}>
            {chef.packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedPackage?.id === pkg.id}
                onSelect={() => setSelectedPackage(pkg)}
              />
            ))}
          </div>

          {/* Reviews */}
          {chef.reviews && (
            <div style={styles.reviewsSection}>
              <h2 style={styles.sectionTitle}>Customer Reviews</h2>
              {chef.reviews.map((review, idx) => (
                <div key={idx} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <p style={styles.reviewName}>{review.name}</p>
                    <span style={styles.reviewRating}>⭐ {review.rating}</span>
                  </div>
                  <p style={styles.reviewText}>{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Drawer */}
      {bookingStep !== 'idle' && (
        <>
          <div style={styles.drawerOverlay} onClick={() => setBookingStep('idle')} />
          <div style={styles.drawer}>
            <div style={styles.drawerHeader}>
              <h2 style={styles.drawerTitle}>
                {bookingStep === 'service_select' && 'What do you need?'}
                {bookingStep === 'details' && 'Enter Details'}
                {bookingStep === 'confirmation' && 'Confirm Booking'}
                {bookingStep === 'payment' && 'Payment'}
                {bookingStep === 'success' && 'Booking Success'}
              </h2>
              <button style={styles.closeBtn} onClick={() => setBookingStep('idle')}>
                ✕
              </button>
            </div>

            <div style={styles.drawerContent}>
              {/* SERVICE SELECT */}
              {bookingStep === 'service_select' && (
                <div style={styles.drawerSection}>
                  <button
                    style={{
                      ...styles.toggleButton,
                      backgroundColor: '#eef2ff',
                      color: '#667eea',
                      fontWeight: '700' as const,
                      padding: '16px',
                      cursor: 'pointer',
                      textAlign: 'left' as const,
                    }}
                    onClick={() => {
                      setBooking({ ...booking, serviceType: 'event' });
                      setBookingStep('details');
                    }}
                  >
                    🍽️ For an Event
                  </button>

                  <button
                    style={{
                      ...styles.toggleButton,
                      backgroundColor: '#eef2ff',
                      color: '#667eea',
                      fontWeight: '700' as const,
                      padding: '16px',
                      cursor: 'pointer',
                      textAlign: 'left' as const,
                    }}
                    onClick={() => {
                      setBooking({ ...booking, serviceType: 'home' });
                      setBookingStep('details');
                    }}
                  >
                    🏠 Cook at Home
                  </button>
                </div>
              )}

              {/* COOK AT HOME DETAILS */}
              {bookingStep === 'details' && booking.serviceType === 'home' && (
                <>
                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>📅 Date</label>
                    <input
                      type="date"
                      style={styles.formInput}
                      value={booking.date}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    />
                  </div>

                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>🍴 Meal Type</label>
                    <div style={styles.buttonGroupThree}>
                      {['breakfast', 'lunch', 'dinner'].map((meal) => (
                        <button
                          key={meal}
                          style={
                            booking.mealType === meal
                              ? styles.toggleButtonActive
                              : styles.toggleButton
                          }
                          onClick={() => setBooking({ ...booking, mealType: meal as MealType })}
                        >
                          {meal === 'breakfast' && '🌅 Breakfast'}
                          {meal === 'lunch' && '☀️ Lunch'}
                          {meal === 'dinner' && '🌙 Dinner'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>👥 Number of People</label>
                    <input
                      type="number"
                      style={styles.formInput}
                      value={booking.guestCount}
                      onChange={(e) => setBooking({ ...booking, guestCount: parseInt(e.target.value) || 1 })}
                      min="1"
                      max="10"
                    />
                  </div>

                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>Select Package</label>
                    {chef.packages
                      .filter(pkg => !pkg.minGuests)
                      .filter(pkg => pkg.title.includes(booking.mealType?.charAt(0).toUpperCase() + booking.mealType?.slice(1) || ''))
                      .map((pkg) => (
                        <button
                          key={pkg.id}
                          style={{
                            ...styles.formInput,
                            backgroundColor: selectedPackage?.id === pkg.id ? '#eef2ff' : 'white',
                            color: selectedPackage?.id === pkg.id ? '#667eea' : '#1e293b',
                            fontWeight: '700' as const,
                            cursor: 'pointer',
                            textAlign: 'left' as const,
                            padding: '12px 14px',
                          }}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          {pkg.title} - ₹{pkg.price}
                        </button>
                      ))}
                  </div>

                  <button
                    style={styles.submitBtn}
                    onClick={() => setBookingStep('confirmation')}
                    disabled={!selectedPackage || !booking.date || !booking.mealType}
                  >
                    Continue →
                  </button>
                </>
              )}

              {/* EVENT DETAILS */}
              {bookingStep === 'details' && booking.serviceType === 'event' && (
                <>
                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>📅 Event Date</label>
                    <input
                      type="date"
                      style={styles.formInput}
                      value={booking.date}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    />
                  </div>

                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>👥 Number of Guests</label>
                    <input
                      type="number"
                      style={styles.formInput}
                      value={booking.guestCount}
                      onChange={(e) => setBooking({ ...booking, guestCount: parseInt(e.target.value) || 1 })}
                      min="5"
                    />
                  </div>

                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>🍗 Veg Preference</label>
                    <div style={styles.buttonGroupThree}>
                      {['veg', 'non-veg', 'both'].map((pref) => (
                        <button
                          key={pref}
                          style={
                            booking.vegPreference === pref
                              ? styles.toggleButtonActive
                              : styles.toggleButton
                          }
                          onClick={() => setBooking({ ...booking, vegPreference: pref as any })}
                        >
                          {pref === 'veg' && '🥬 Veg'}
                          {pref === 'non-veg' && '🍗 Non-Veg'}
                          {pref === 'both' && '🍽️ Both'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.drawerSection}>
                    <label style={styles.formLabel}>Select Package</label>
                    {chef.packages
                      .filter(pkg => pkg.minGuests)
                      .map((pkg) => (
                        <button
                          key={pkg.id}
                          style={{
                            ...styles.formInput,
                            backgroundColor: selectedPackage?.id === pkg.id ? '#eef2ff' : 'white',
                            color: selectedPackage?.id === pkg.id ? '#667eea' : '#1e293b',
                            fontWeight: '700' as const,
                            cursor: 'pointer',
                            textAlign: 'left' as const,
                            padding: '12px 14px',
                          }}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          {pkg.title} - ₹{pkg.price}/person
                        </button>
                      ))}
                  </div>

                  <button
                    style={styles.submitBtn}
                    onClick={() => setBookingStep('confirmation')}
                    disabled={!selectedPackage || !booking.date || !booking.guestCount}
                  >
                    Continue →
                  </button>
                </>
              )}

              {/* CONFIRMATION */}
              {bookingStep === 'confirmation' && (
                <div style={styles.confirmationContainer}>
                  <div style={styles.confirmationItem}>
                    <span style={styles.confirmationLabel}>Chef</span>
                    <span style={styles.confirmationValue}>{chef.name}</span>
                  </div>
                  <div style={styles.confirmationItem}>
                    <span style={styles.confirmationLabel}>Service</span>
                    <span style={styles.confirmationValue}>
                      {booking.serviceType === 'home' ? '🏠 Cook at Home' : '🍽️ Event Catering'}
                    </span>
                  </div>
                  {booking.mealType && (
                    <div style={styles.confirmationItem}>
                      <span style={styles.confirmationLabel}>Meal Type</span>
                      <span style={styles.confirmationValue}>
                        {booking.mealType.charAt(0).toUpperCase() + booking.mealType.slice(1)}
                      </span>
                    </div>
                  )}
                  <div style={styles.confirmationItem}>
                    <span style={styles.confirmationLabel}>Date</span>
                    <span style={styles.confirmationValue}>{booking.date}</span>
                  </div>
                  {booking.serviceType === 'event' && booking.guestCount && (
                    <div style={styles.confirmationItem}>
                      <span style={styles.confirmationLabel}>Guests</span>
                      <span style={styles.confirmationValue}>{booking.guestCount}</span>
                    </div>
                  )}
                  {booking.serviceType === 'event' && (
                    <div style={styles.confirmationItem}>
                      <span style={styles.confirmationLabel}>Veg Preference</span>
                      <span style={styles.confirmationValue}>{booking.vegPreference}</span>
                    </div>
                  )}
                  <div style={styles.confirmationItem}>
                    <span style={{ ...styles.confirmationLabel, fontWeight: '700' as const, color: '#1e293b' }}>
                      Package
                    </span>
                    <span style={{ ...styles.confirmationValue, color: '#667eea' }}>
                      {selectedPackage?.title}
                    </span>
                  </div>
                  <div style={styles.confirmationItem}>
                    <span style={{ ...styles.confirmationLabel, fontWeight: '700' as const, color: '#1e293b' }}>
                      Total
                    </span>
                    <span style={{ ...styles.confirmationValue, color: '#667eea', fontSize: '16px' }}>
                      ₹{calculateTotal().toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button style={styles.submitBtn} onClick={() => setBookingStep('payment')}>
                    Proceed to Payment
                  </button>
                  <button
                    style={{ ...styles.submitBtn, background: 'white', color: '#667eea', border: '1.5px solid #667eea' }}
                    onClick={() => setBookingStep('details')}
                  >
                    Back
                  </button>
                </div>
              )}

              {/* PAYMENT */}
              {bookingStep === 'payment' && (
                <div style={styles.paymentForm}>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', color: '#0369a1', fontSize: '13px', fontWeight: 'bold' }}>
                    💳 Pay: ₹{calculateTotal().toLocaleString('en-IN')}
                  </div>

                  <div>
                    <label style={styles.formLabel}>Card Holder Name</label>
                    <input type="text" style={styles.paymentInput} placeholder="John Doe" />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Card Number</label>
                    <input type="text" style={styles.paymentInput} placeholder="1234 5678 9012 3456" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={styles.formLabel}>Expiry</label>
                      <input type="text" style={styles.paymentInput} placeholder="MM/YY" />
                    </div>
                    <div>
                      <label style={styles.formLabel}>CVV</label>
                      <input type="text" style={styles.paymentInput} placeholder="123" />
                    </div>
                  </div>

                  <button style={styles.submitBtn} onClick={() => setBookingStep('success')}>
                    💳 Pay ₹{calculateTotal().toLocaleString('en-IN')}
                  </button>
                  <button
                    style={{ ...styles.submitBtn, background: 'white', color: '#667eea', border: '1.5px solid #667eea' }}
                    onClick={() => setBookingStep('confirmation')}
                  >
                    Back
                  </button>
                </div>
              )}

              {/* SUCCESS */}
              {bookingStep === 'success' && (
                <div style={styles.successContainer}>
                  <div style={styles.successIcon}>✅</div>
                  <p style={styles.successTitle}>Booking Confirmed!</p>
                  <p style={styles.successText}>
                    Your booking with {chef.name} is confirmed. Check your email for details.
                  </p>
                  <div style={{ width: '100%', backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', color: '#0369a1', fontSize: '13px' }}>
                    <strong>Booking ID:</strong> #BK{Math.random().toString().slice(2, 8).toUpperCase()}
                  </div>
                  <button
                    style={{ ...styles.submitBtn, marginTop: '20px' }}
                    onClick={() => setBookingStep('idle')}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Sticky Summary */}
            {bookingStep === 'details' && selectedPackage && (
              <div style={styles.bookingSummary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Package</span>
                  <span style={styles.summaryValue}>{selectedPackage.title}</span>
                </div>
                <div style={styles.totalPrice}>
                  <span>Estimate</span>
                  <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============ PACKAGE CARD COMPONENT ============
interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  onSelect: () => void;
}

function PackageCard({ package: pkg, isSelected, onSelect }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={isHovered ? styles.packageCardHovered : styles.packageCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.priceSection}>
        <p style={styles.priceValue}>₹{pkg.price}</p>
        <span style={styles.priceUnit}>
          {pkg.minGuests ? `/ person` : '/ time'}
        </span>
      </div>

      <h3 style={styles.packageTitle}>{pkg.title}</h3>
      <p style={styles.packageDescription}>{pkg.description}</p>

      {pkg.minGuests && (
        <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0' }}>
          👥 {pkg.minGuests} - {pkg.maxGuests || '∞'} guests
        </p>
      )}

      <div style={styles.includesList}>
        {pkg.includes?.map((item: string, idx: number) => (
          <div key={idx} style={styles.includeItem}>
            <span style={{ color: '#10b981' }}>✓</span>
            {item}
          </div>
        ))}
      </div>

      <button style={styles.selectPackageBtn} onClick={onSelect}>
        {isSelected ? '✓ Selected' : 'Select'}
      </button>
    </div>
  );
}