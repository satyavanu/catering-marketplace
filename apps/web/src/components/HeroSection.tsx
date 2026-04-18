'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Users, Utensils, ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=600&fit=crop',
    },
    {
      id: 2,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    },
    {
      id: 3,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      image: 'https://images.unsplash.com/photo-1516035893752-84ac07c0d2c8?w=1200&h=600&fit=crop',
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

  const locations = [
    { value: 'bangalore', label: '🏙️ Bangalore' },
    { value: 'delhi', label: '🏛️ Delhi' },
    { value: 'hyderabad', label: '🌆 Hyderabad' },
    { value: 'mumbai', label: '🌃 Mumbai' },
    { value: 'pune', label: '🏞️ Pune' },
    { value: 'kolkata', label: '🎭 Kolkata' },
  ];

  const quickSuggestions = [
    { emoji: '💍', text: 'Wedding catering near me' },
    { emoji: '🎂', text: 'Birthday catering for 50 people' },
    { emoji: '👨‍🍳', text: 'Home chefs in your area' },
  ];

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
    if (location && eventType && guestCount) {
      // Route to search page with params
      const searchParams = new URLSearchParams({
        location,
        eventType,
        guestCount,
      });
      window.location.href = `/search?${searchParams.toString()}`;
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
        paddingTop: '3rem',
        paddingBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '650px',
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
          opacity: 0.8,
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
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '50%',
          zIndex: 2,
        }}
      />

      <div
        className="max-w-5xl mx-auto px-4"
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Main Hero Title & Description */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'fadeIn 0.8s ease-in' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              lineHeight: '1.2',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              letterSpacing: '-0.02em',
            }}
          >
            Plan Your Perfect Event in Seconds
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            Find the best caterers for your event — fast, simple, and reliable.
          </p>
        </div>

        {/* Search Form Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '1.25rem',
            padding: 'clamp(1.75rem, 5vw, 2.5rem)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            maxWidth: '900px',
            width: '100%',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem',
          }}
        >
          <form onSubmit={handleSearch}>
            {/* Search Fields Label */}
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 1.25rem 0',
              }}
            >
              Search Fields
            </p>

            {/* Input Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Location Dropdown */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <MapPin size={16} />
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
                    required
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

              {/* Event Type Dropdown */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Utensils size={16} />
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
                    required
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Users size={16} />
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
                    required
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
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={!location || !eventType || !guestCount}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: !location || !eventType || !guestCount ? 'not-allowed' : 'pointer',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                opacity: !location || !eventType || !guestCount ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (location && eventType && guestCount) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Find Caterers
              <ArrowRight size={20} />
            </button>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.5rem',
                paddingTop: '1.25rem',
                marginTop: '1.25rem',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#666',
                }}
              >
                <CheckCircle size={16} color="#10b981" />
                <span>No hidden costs</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#666',
                }}
              >
                <CheckCircle size={16} color="#10b981" />
                <span>Verified caterers</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#666',
                }}
              >
                <CheckCircle size={16} color="#10b981" />
                <span>Instant quotes</span>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Suggestions */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeIn 1s ease-in 0.3s both' }}>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Quick Suggestions
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  window.location.href = `/search?q=${encodeURIComponent(suggestion.text)}`;
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '9999px',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{suggestion.emoji}</span>
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Dots */}
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
                backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.4)',
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
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          color: 'white',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          fontWeight: 'bold',
          fontSize: '1.25rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          color: 'white',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          fontWeight: 'bold',
          fontSize: '1.25rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
        aria-label="Next slide"
      >
        ›
      </button>

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

        @media (max-width: 768px) {
          button[aria-label*="Previous"],
          button[aria-label*="Next"] {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;