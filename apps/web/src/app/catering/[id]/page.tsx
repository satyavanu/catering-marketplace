'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  StarIcon,
  HeartIcon,
  CheckIcon,
  ArrowRightIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  FireIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CateringDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [occasion, setOccasion] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventDate: '',
    eventTime: '',
    guestCount: 50,
    occasion: '',
    specialRequests: '',
    dietaryRestrictions: '',
    venueAddress: '',
  });

  // Mock data for catering services
  const cateringServices: Record<string, any> = {
    '1': {
      id: 1,
      title: 'Premium Multi-Cuisine Catering',
      location: 'New York, NY',
      rating: 4.9,
      reviews: 528,
      pricePerPerson: 2499,
      guestRange: '50-500',
      tags: ['Multi-Cuisine', 'Premium', 'Full Service'],
      description:
        'Transform your event with exquisite culinary excellence. Our award-winning chefs craft personalized menus featuring the finest ingredients, stunning presentations, and impeccable service. From intimate gatherings to grand celebrations, we deliver unforgettable dining experiences.',
      chef: 'Chef Marco Rossi',
      cuisine: 'Multi-Cuisine',
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=800&h=600&fit=crop',
      ],
      menu: [
        {
          course: 'Appetizers',
          items: ['Seared Foie Gras', 'Lobster Bisque', 'Truffle Risotto'],
        },
        {
          course: 'Main Course',
          items: ['Wagyu Beef Steak', 'Pan-Seared Salmon', 'Vegetarian Terrine'],
        },
        {
          course: 'Desserts',
          items: ['Chocolate Soufflé', 'Crème Brûlée', 'Seasonal Fruit Tart'],
        },
      ],
      included: [
        '👨‍🍳 Customized Menu Design',
        '🍽️ Multi-Course Meals',
        '💼 Professional Waitstaff',
        '🏆 Premium Plating & Presentation',
        '🍷 Bar & Beverage Service',
        '🧹 Complete Setup & Cleanup',
        '🎵 Table Coordination',
        '📋 Menu Cards',
      ],
      services: [
        { icon: '🍽️', name: 'Full Catering Service', desc: 'Complete event catering from setup to cleanup' },
        { icon: '🍷', name: 'Bar Service', desc: 'Professional bar and beverage management' },
        { icon: '👨‍🍳', name: 'Chef Coordination', desc: 'On-site chef supervision and management' },
        { icon: '🎂', name: 'Cake Service', desc: 'Custom cake service and plating' },
      ],
      testimonials: [
        {
          name: 'Sarah Johnson',
          role: 'Wedding Planner',
          text: 'Absolutely exceptional service! The catering elevated our entire event. Highly recommend!',
          rating: 5,
        },
        {
          name: 'Michael Chen',
          role: 'Corporate Event Manager',
          text: 'Professional, punctual, and delicious food. They exceeded all expectations.',
          rating: 5,
        },
        {
          name: 'Emily Rodriguez',
          role: 'Event Host',
          text: 'Best catering experience ever. The attention to detail was impressive.',
          rating: 5,
        },
      ],
      availability: ['Mon-Sun', 'Custom Hours Available'],
      advance: '14 days',
      minGuests: 50,
      maxGuests: 500,
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'contact@premiercatering.com',
        address: '123 Fifth Avenue, New York, NY 10001',
      },
    },
    '2': {
      id: 2,
      title: 'Italian Fine Dining Catering',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviews: 342,
      pricePerPerson: 1999,
      guestRange: '20-200',
      tags: ['Italian', 'Fine Dining', 'European'],
      description:
        'Authentic Italian cuisine prepared by certified Italian chefs. Each dish tells a story of Italian culinary tradition combined with modern techniques.',
      chef: 'Chef Antonio Bellini',
      cuisine: 'Italian',
      images: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&h=600&fit=crop',
      ],
      menu: [
        {
          course: 'Antipasti',
          items: ['Burrata with Tomatoes', 'Prosciutto di Parma', 'Arancini'],
        },
        {
          course: 'Primi Piatti',
          items: ['Handmade Pasta Carbonara', 'Risotto ai Funghi', 'Seafood Linguine'],
        },
        {
          course: 'Dolci',
          items: ['Tiramisu', 'Panna Cotta', 'Cannoli'],
        },
      ],
      included: [
        '👨‍🍳 Italian Chef Supervision',
        '🍝 Handmade Pasta',
        '🍷 Wine Pairing Service',
        '🏆 Elegant Plating',
        '🧀 Imported Ingredients',
        '🧹 Complete Cleanup',
      ],
      services: [
        { icon: '🍝', name: 'Pasta Making', desc: 'Fresh handmade pasta prepared on-site' },
        { icon: '🍷', name: 'Wine Pairings', desc: 'Expert Italian wine selections' },
        { icon: '👨‍🍳', name: 'Chef Service', desc: 'Certified Italian chef presence' },
        { icon: '🧀', name: 'Imported Ingredients', desc: 'Premium Italian imports' },
      ],
      testimonials: [
        {
          name: 'James Wilson',
          role: 'Restaurant Owner',
          text: 'Authentic Italian experience. Guests still talk about this event!',
          rating: 5,
        },
      ],
      availability: ['Tue-Sun', 'Evening Events'],
      advance: '21 days',
      minGuests: 20,
      maxGuests: 200,
      contact: {
        phone: '+1 (555) 234-5678',
        email: 'info@italianfine.com',
        address: '456 Sunset Boulevard, Los Angeles, CA 90001',
      },
    },
  };

  const catering = cateringServices[String(id)] || cateringServices['1'];

  const calculateTotal = () => {
    return catering.pricePerPerson * guestCount * quantity;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % catering.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? catering.images.length - 1 : prev - 1
    );
  };

  const handleBookNowClick = () => {
    setShowBookingModal(true);
    setBookingStep(1);
  };

  const handleBookingInputChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    // Here you would submit the booking data to your backend
    console.log('Booking Confirmed:', {
      cateringId: catering.id,
      ...bookingData,
      totalAmount: calculateTotal(),
    });
    // Show success message
    alert('Booking request submitted successfully! We will contact you soon.');
    setShowBookingModal(false);
    setBookingStep(1);
  };

  // Booking Modal Component
  const BookingModal = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={() => setShowBookingModal(false)}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '800',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            🎉 Book {catering.title}
          </h2>
          <button
            onClick={() => setShowBookingModal(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XMarkIcon style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '32px' }}>
          {/* Progress Indicator */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', justifyContent: 'space-between' }}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: step <= bookingStep ? '#f59e0b' : '#e2e8f0',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', margin: 0, textTransform: 'uppercase' }}>
              Step {bookingStep} of 3
            </p>
          </div>

          {/* Step 1: Personal Information */}
          {bookingStep === 1 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 20px 0' }}>
                📋 Your Details
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={bookingData.fullName}
                    onChange={(e) => handleBookingInputChange('fullName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={bookingData.email}
                    onChange={(e) => handleBookingInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={bookingData.phone}
                    onChange={(e) => handleBookingInputChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Event Details */}
          {bookingStep === 2 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 20px 0' }}>
                🎊 Event Details
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.eventDate}
                      onChange={(e) => handleBookingInputChange('eventDate', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Event Time *
                    </label>
                    <input
                      type="time"
                      value={bookingData.eventTime}
                      onChange={(e) => handleBookingInputChange('eventTime', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      min={catering.minGuests}
                      max={catering.maxGuests}
                      value={bookingData.guestCount}
                      onChange={(e) => handleBookingInputChange('guestCount', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                        boxSizing: 'border-box',
                      }}
                    />
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0 0' }}>
                      Min: {catering.minGuests} | Max: {catering.maxGuests}
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Occasion *
                    </label>
                    <select
                      value={bookingData.occasion}
                      onChange={(e) => handleBookingInputChange('occasion', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Select occasion...</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="private">Private Dinner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Venue Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your event venue address"
                    value={bookingData.venueAddress}
                    onChange={(e) => handleBookingInputChange('venueAddress', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Special Requests */}
          {bookingStep === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 20px 0' }}>
                ✨ Special Requests
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Dietary Restrictions
                  </label>
                  <textarea
                    placeholder="E.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                    value={bookingData.dietaryRestrictions}
                    onChange={(e) => handleBookingInputChange('dietaryRestrictions', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                      minHeight: '100px',
                      resize: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Special Requests & Preferences
                  </label>
                  <textarea
                    placeholder="Tell us about your preferences, themes, or special menu requests..."
                    value={bookingData.specialRequests}
                    onChange={(e) => handleBookingInputChange('specialRequests', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      boxSizing: 'border-box',
                      minHeight: '120px',
                      resize: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Booking Summary */}
                <div
                  style={{
                    backgroundColor: '#fef9f3',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid #fef3c7',
                    marginTop: '16px',
                  }}
                >
                  <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    📊 Booking Summary
                  </p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      <span>Service:</span>
                      <span>{catering.title}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      <span>Guests:</span>
                      <span>{bookingData.guestCount} persons</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      <span>Price/Person:</span>
                      <span>₹{catering.pricePerPerson.toLocaleString()}</span>
                    </div>
                    <div
                      style={{
                        borderTop: '1px solid #e2e8f0',
                        paddingTop: '8px',
                        marginTop: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#f59e0b',
                      }}
                    >
                      <span>Estimated Total:</span>
                      <span>₹{(catering.pricePerPerson * Number(bookingData.guestCount)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        >
          {bookingStep > 1 && (
            <button
              onClick={handlePrevStep}
              style={{
                flex: 1,
                backgroundColor: 'white',
                color: '#f59e0b',
                border: '2px solid #f59e0b',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef3c7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              ← Previous
            </button>
          )}

          {bookingStep < 3 ? (
            <button
              onClick={handleNextStep}
              style={{
                flex: 1,
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              style={{
                flex: 1,
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ✓ Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 32px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link href="/catering" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '600' }}>
              Catering
            </Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: '600' }}>{catering.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px', marginBottom: '48px' }}>
          {/* Left Section - Images & Details */}
          <div>
            {/* Main Image with Navigation */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#e2e8f0',
                marginBottom: '24px',
                height: '500px',
              }}
            >
              <img
                src={catering.images[currentImageIndex]}
                alt={catering.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Navigation Buttons */}
              {catering.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
                  </button>

                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
                  </button>

                  {/* Image Counter */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {currentImageIndex + 1} / {catering.images.length}
                  </div>
                </>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'white',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
              >
                <HeartIcon
                  style={{
                    width: '24px',
                    height: '24px',
                    color: isFavorite ? '#f59e0b' : '#94a3b8',
                    fill: isFavorite ? '#f59e0b' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </button>
            </div>

            {/* Title & Rating */}
            <h1
              style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#1e293b',
                margin: '0 0 12px 0',
                letterSpacing: '-0.5px',
              }}
            >
              {catering.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: '18px' }}>
                    ⭐
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                {catering.rating}/5
              </span>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                ({catering.reviews} reviews)
              </span>
            </div>

            {/* Location & Chef */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#fef9f3',
                  borderRadius: '12px',
                  border: '1px solid #fef3c7',
                }}
              >
                <MapPinIcon style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Location
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {catering.location}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#fef9f3',
                  borderRadius: '12px',
                  border: '1px solid #fef3c7',
                }}
              >
                <FireIcon style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Chef
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {catering.chef}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.8',
                marginBottom: '32px',
                fontWeight: '500',
              }}
            >
              {catering.description}
            </p>

            {/* Menu Section */}
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <SparklesIcon style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                Sample Menu
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {catering.menu.map((menuSection, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#f59e0b',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {menuSection.course}
                    </h3>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {menuSection.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          style={{
                            fontSize: '14px',
                            color: '#475569',
                            fontWeight: '500',
                            padding: '8px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <CheckIcon style={{ width: '16px', height: '16px', color: '#f59e0b', flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 24px 0',
                }}
              >
                ✓ What's Included
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {catering.included.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      backgroundColor: '#fef9f3',
                      borderRadius: '10px',
                      border: '1px solid #fef3c7',
                    }}
                  >
                    <CheckIcon style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 24px 0',
                }}
              >
                🎯 Additional Services
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {catering.services.map((service, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{service.icon}</div>
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {service.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: '500' }}>
                      {service.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 24px 0',
                }}
              >
                ⭐ Client Testimonials
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                {catering.testimonials.map((testimonial, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #f59e0b',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} style={{ fontSize: '16px' }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: '15px',
                        color: '#475569',
                        margin: '0 0 12px 0',
                        fontStyle: 'italic',
                        lineHeight: '1.6',
                      }}
                    >
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        {testimonial.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Booking Form */}
          <div>
            {/* Sticky Booking Card */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: '100px',
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #f0f0f0' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Price Per Person
                </p>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                  ₹{catering.pricePerPerson.toLocaleString()}
                </div>
              </div>

              {/* Guest Count */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1e293b',
                    display: 'block',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  👥 Number of Guests
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => setGuestCount(Math.max(catering.minGuests, guestCount - 10))}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#f59e0b',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef3c7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1e293b',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={() => setGuestCount(Math.min(catering.maxGuests, guestCount + 10))}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#f59e0b',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef3c7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    +
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>
                  Min: {catering.minGuests} | Max: {catering.maxGuests}
                </p>
              </div>

              {/* Date Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1e293b',
                    display: 'block',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  📅 Preferred Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>
                  Advance booking: {catering.advance} required
                </p>
              </div>

              {/* Occasion */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1e293b',
                    display: 'block',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  🎉 Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select occasion...</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="private">Private Dinner</option>
                </select>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1e293b',
                    display: 'block',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  📦 Number of Events
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuantity(q)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: quantity === q ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: quantity === q ? '#fef3c7' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: quantity === q ? '#f59e0b' : '#94a3b8',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (quantity !== q) {
                          e.currentTarget.style.borderColor = '#f59e0b';
                          e.currentTarget.style.backgroundColor = '#fef9f3';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (quantity !== q) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Price */}
              <div
                style={{
                  backgroundColor: '#fef9f3',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '2px solid #fef3c7',
                }}
              >
                <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Estimated Total
                </p>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: '#f59e0b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  ₹{calculateTotal().toLocaleString()}
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                    ({guestCount} guests × {quantity} event{quantity > 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <button
                onClick={handleBookNowClick}
                style={{
                  width: '100%',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(245, 158, 11, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.25)';
                }}
              >
                Book Now 🎉
                <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: '#f59e0b',
                  border: '2px solid #f59e0b',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Contact Us
              </button>

              {/* Contact Info */}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Direct Contact
                </p>

                <a
                  href={`tel:${catering.contact.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: '#f59e0b',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#d97706';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#f59e0b';
                  }}
                >
                  <PhoneIcon style={{ width: '16px', height: '16px' }} />
                  {catering.contact.phone}
                </a>

                <a
                  href={`mailto:${catering.contact.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: '#f59e0b',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#d97706';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#f59e0b';
                  }}
                >
                  <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
                  {catering.contact.email}
                </a>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: '#f59e0b',
                    fontWeight: '600',
                  }}
                >
                  <MapIcon style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />
                  <span>{catering.contact.address}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    <ShieldCheckIcon style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                    Verified
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    <FireIcon style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                    Top Rated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && <BookingModal />}
    </div>
  );
};

export default CateringDetailPage;