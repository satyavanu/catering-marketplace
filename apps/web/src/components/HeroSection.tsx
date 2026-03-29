'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Users, DollarSign, Utensils, ArrowRight, CheckCircle, Zap } from 'lucide-react';

const HeroSection = () => {
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [showPriceEstimate, setShowPriceEstimate] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState({ min: 0, max: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      title: 'Plan Your Perfect Event in Seconds',
      subtitle: 'Get instant catering quotes from verified caterers',
      description: 'No hidden costs • Real-time availability • Expert support',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=600&fit=crop',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      title: 'Trusted by 10,000+ Event Planners',
      subtitle: 'From intimate dinners to grand celebrations',
      description: 'Browse menus • Check reviews • Book instantly',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 3,
      title: 'Save Time, Not Budget',
      subtitle: 'Compare prices from multiple caterers in one place',
      description: 'Transparent pricing • Instant confirmations • 24/7 support',
      image: 'https://images.unsplash.com/photo-1516035893752-84ac07c0d2c8?w=1200&h=600&fit=crop',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  const eventTypes = [
    { value: 'wedding', label: '💍 Wedding' },
    { value: 'corporate', label: '🏢 Corporate Event' },
    { value: 'birthday', label: '🎂 Birthday Party' },
    { value: 'anniversary', label: '💕 Anniversary' },
    { value: 'engagement', label: '💎 Engagement' },
    { value: 'conference', label: '📋 Conference' },
  ];

  const guestCounts = [
    { value: '10-25', label: '10-25 guests' },
    { value: '25-50', label: '25-50 guests' },
    { value: '50-100', label: '50-100 guests' },
    { value: '100-200', label: '100-200 guests' },
    { value: '200-500', label: '200-500 guests' },
    { value: '500+', label: '500+ guests' },
  ];

  const budgetRanges = [
    { value: 'budget', label: '💰 Budget (₹500-1000/person)' },
    { value: 'standard', label: '💵 Standard (₹1000-1500/person)' },
    { value: 'premium', label: '💎 Premium (₹1500-2500/person)' },
    { value: 'luxury', label: '👑 Luxury (₹2500+/person)' },
  ];

  const locations = [
    { value: 'bangalore', label: '🏙️ Bangalore' },
    { value: 'delhi', label: '🏛️ Delhi' },
    { value: 'hyderabad', label: '🌆 Hyderabad' },
    { value: 'mumbai', label: '🌃 Mumbai' },
    { value: 'pune', label: '🏞️ Pune' },
    { value: 'kolkata', label: '🎭 Kolkata' },
  ];

  // Calculate price estimate
  const calculateEstimate = () => {
    if (!guestCount || !budget) return;

    const guestMap: { [key: string]: number } = {
      '10-25': 17.5,
      '25-50': 37.5,
      '50-100': 75,
      '100-200': 150,
      '200-500': 350,
      '500+': 750,
    };

    const budgetMap: { [key: string]: { min: number; max: number } } = {
      budget: { min: 500, max: 1000 },
      standard: { min: 1000, max: 1500 },
      premium: { min: 1500, max: 2500 },
      luxury: { min: 2500, max: 4000 },
    };

    const guests = guestMap[guestCount] || 50;
    const budgetRange = budgetMap[budget] || { min: 1000, max: 1500 };

    setEstimatedPrice({
      min: Math.round(guests * budgetRange.min),
      max: Math.round(guests * budgetRange.max),
    });
    setShowPriceEstimate(true);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const currentSlideData = slides[currentSlide];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventType && guestCount && location && budget) {
      calculateEstimate();
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <section
      style={{
        backgroundImage: `url('${currentSlideData.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        paddingTop: '4rem',
        paddingBottom: '4rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '750px',
        transition: 'background-image 0.8s ease-in-out',
      }}
    >
      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: currentSlideData.gradient,
          opacity: 0.75,
          zIndex: 1,
          transition: 'opacity 0.8s ease',
        }}
      />

      {/* Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '400px',
          height: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          zIndex: 2,
        }}
      />

      <div className="max-w-7xl mx-auto px-4" style={{ position: 'relative', zIndex: 10 }}>
        {/* Main Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeIn 0.8s ease-in' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            {currentSlideData.title}
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              marginBottom: '0.5rem',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {currentSlideData.subtitle}
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '0.5rem',
            }}
          >
            {currentSlideData.description}
          </p>
        </div>

        {/* Event Builder Form */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            borderRadius: '1rem',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            maxWidth: '1000px',
            margin: '0 auto 2rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: '0 0 1rem 0',
                }}
              >
                Plan Your Event in 4 Steps
              </p>

              {/* Input Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                {/* Event Type Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <Utensils size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Event Type
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 2.5rem 0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: eventType ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>

                {/* Guest Count Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Number of Guests
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 2.5rem 0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: guestCount ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Guest Count</option>
                      {guestCounts.map((count) => (
                        <option key={count.value} value={count.value}>
                          {count.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 2.5rem 0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: location ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>

                {/* Budget Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Budget
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 2.5rem 0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: budget ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Budget</option>
                      {budgetRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Zap size={20} />
                Get Catering Options
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                <CheckCircle size={18} color='#10b981' />
                <span>No hidden costs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                <CheckCircle size={18} color='#10b981' />
                <span>Verified caterers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                <CheckCircle size={18} color='#10b981' />
                <span>Instant pricing</span>
              </div>
            </div>
          </form>
        </div>

        {/* Price Estimate Card */}
        {showPriceEstimate && (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '500px',
              margin: '0 auto 2rem',
              textAlign: 'center',
              animation: 'slideUp 0.4s ease-out',
              border: '2px solid #10b981',
            }}
          >
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              ✨ Estimated Budget for {guestCount} guests in{' '}
              {locations.find((l) => l.value === location)?.label || 'selected location'}
            </p>
            <h3 style={{ color: '#667eea', fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
              ₹{estimatedPrice.min.toLocaleString()} – ₹{estimatedPrice.max.toLocaleString()}
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0.5rem 0 1rem 0' }}>
              Per person: ₹{Math.round(estimatedPrice.min / (parseInt(guestCount) || 50))} – ₹
              {Math.round(estimatedPrice.max / (parseInt(guestCount) || 50))}
            </p>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              View Available Caterers
            </button>
          </div>
        )}

        {/* Carousel Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '2rem',
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setAutoPlay(false);
                setTimeout(() => setAutoPlay(true), 10000);
              }}
              style={{
                width: index === currentSlide ? '32px' : '12px',
                height: '12px',
                backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: index === currentSlide ? 1 : 0.7,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid white',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
          aria-label="Previous slide"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid white',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;