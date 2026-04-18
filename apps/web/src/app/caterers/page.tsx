'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, MapPin, Users, Calendar, DollarSign, Star, Heart, ArrowRight, Filter, X } from 'lucide-react';
import Link from 'next/link';

const CateringPage = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Handle sticky scroll
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        setIsSticky(window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const cateringServices = [
    {
      id: 1,
      name: 'Elegant Events Catering',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 128,
      pricePerPerson: 550,
      priceRange: '₹500 - ₹700/plate',
      cuisine: ['French', 'International', 'European'],
      minOrder: 50,
      maxOrder: 500,
      vegNonVeg: 'Both',
      occasion: 'Wedding',
      isVegetarian: false,
      isTopRated: true,
    },
    {
      id: 2,
      name: 'Spice Route Kitchen',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1504674900436-24658a62558b?w=500&h=300&fit=crop',
      rating: 4.6,
      reviews: 95,
      pricePerPerson: 450,
      priceRange: '₹400 - ₹600/plate',
      cuisine: ['Indian', 'North Indian', 'Asian Fusion'],
      minOrder: 30,
      maxOrder: 400,
      vegNonVeg: 'Both',
      occasion: 'Corporate',
      isVegetarian: false,
      isTopRated: false,
    },
    {
      id: 3,
      name: 'Pure Veg Delights',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 156,
      pricePerPerson: 280,
      priceRange: '₹250 - ₹350/plate',
      cuisine: ['South Indian', 'Vegetarian', 'Jain'],
      minOrder: 20,
      maxOrder: 300,
      vegNonVeg: 'Veg',
      occasion: 'Wedding',
      isVegetarian: true,
      isTopRated: true,
    },
    {
      id: 4,
      name: 'Mediterranean Bites',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
      rating: 4.7,
      reviews: 110,
      pricePerPerson: 500,
      priceRange: '₹450 - ₹650/plate',
      cuisine: ['Mediterranean', 'Greek', 'Italian'],
      minOrder: 40,
      maxOrder: 500,
      vegNonVeg: 'Both',
      occasion: 'Corporate',
      isVegetarian: false,
      isTopRated: true,
    },
    {
      id: 5,
      name: 'Royal Feast Catering',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 156,
      pricePerPerson: 520,
      priceRange: '₹480 - ₹700/plate',
      cuisine: ['Mughlai', 'Biryani', 'Indian'],
      minOrder: 50,
      maxOrder: 1000,
      vegNonVeg: 'Both',
      occasion: 'Wedding',
      isVegetarian: false,
      isTopRated: true,
    },
    {
      id: 6,
      name: 'Quick Bites Catering',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
      rating: 4.4,
      reviews: 78,
      pricePerPerson: 250,
      priceRange: '₹200 - ₹300/plate',
      cuisine: ['Street Food', 'Indian', 'Casual'],
      minOrder: 10,
      maxOrder: 200,
      vegNonVeg: 'Both',
      occasion: 'Birthday',
      isVegetarian: false,
      isTopRated: false,
    },
  ];

  const quickFilters = [
    { label: 'Under ₹300', value: 'under-300' },
    { label: 'Pure Veg', value: 'veg' },
    { label: 'Top Rated', value: 'toprated' },
  ];

  const filteredServices = cateringServices.filter((service) => {
    if (activeQuickFilter === 'under-300' && service.pricePerPerson > 300) return false;
    if (activeQuickFilter === 'veg' && !service.isVegetarian) return false;
    if (activeQuickFilter === 'toprated' && !service.isTopRated) return false;
    return true;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'price') return a.pricePerPerson - b.pricePerPerson;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const CatererCard = ({ item }: { item: typeof cateringServices[0] }) => (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(102, 126, 234, 0.15)';
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = '#667eea';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Top Rated Badge */}
        {item.isTopRated && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            <Star size={14} fill="white" />
            Top Rated
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(item.id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'white',
            border: 'none',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Heart
            size={22}
            style={{
              color: favorites.includes(item.id) ? '#667eea' : '#cbd5e1',
              fill: favorites.includes(item.id) ? '#667eea' : 'none',
              transition: 'all 0.2s ease',
            }}
          />
        </button>

        {/* Price Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <DollarSign size={14} />
          {item.pricePerPerson}/person
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Name */}
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              marginBottom: '0.5rem',
              lineHeight: '1.3',
            }}
          >
            {item.name}
          </h3>

          {/* Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <Star size={18} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
              {item.rating}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              ({item.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#667eea',
            fontSize: '0.95rem',
            fontWeight: '600',
          }}
        >
          <MapPin size={16} strokeWidth={2.5} />
          {item.location}
        </div>

        {/* Price Range */}
        <div>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: 0,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.35rem',
            }}
          >
            💰 Price Range
          </p>
          <p style={{ fontSize: '1rem', fontWeight: '800', color: '#667eea', margin: 0 }}>
            {item.priceRange}
          </p>
        </div>

        {/* Cuisine Tags */}
        <div>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: 0,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            🍛 Cuisine
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {item.cuisine.slice(0, 2).map((c, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.8rem',
                  color: '#667eea',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#ede9fe',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: '1px solid #ddd6fe',
                }}
              >
                {c}
              </span>
            ))}
            {item.cuisine.length > 2 && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#667eea',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#ede9fe',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: '1px solid #ddd6fe',
                }}
              >
                +{item.cuisine.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Min Order & Capacity */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            fontSize: '0.9rem',
            color: '#6b7280',
            paddingTop: '0.75rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={14} />
            <span>Min: {item.minOrder}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={14} />
            <span>Max: {item.maxOrder}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => (window.location.href = `/caterers/${item.id}`)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: 'auto',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
          }}
        >
          View Profile
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* STICKY SEARCH BAR */}
      <div
        ref={searchBarRef}
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'white',
          borderBottom: isSticky ? '1px solid #e5e7eb' : 'none',
          boxShadow: isSticky ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 0.3s ease',
          padding: isSticky ? '1rem 2rem' : '2rem',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isSticky ? 'repeat(4, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Location */}
            <div style={{ position: 'relative' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase',
                }}
              >
                📍 Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Event Type */}
            <div style={{ position: 'relative' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase',
                }}
              >
                🎉 Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  appearance: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
                <option value="">All Events</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
              </select>
              <ChevronDown
                size={18}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: isSticky ? '2.25rem' : '2.35rem',
                  pointerEvents: 'none',
                  color: '#9ca3af',
                }}
              />
            </div>

            {/* Guest Count */}
            <div style={{ position: 'relative' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase',
                }}
              >
                👥 Guests
              </label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="Number of guests"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Search Button */}
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                marginTop: isSticky ? '0' : '1.75rem',
                height: isSticky ? '2.5rem' : 'auto',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
              }}
            >
              <Search size={18} strokeWidth={2.5} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* QUICK FILTERS */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
            Quick Filters:
          </span>
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() =>
                setActiveQuickFilter(activeQuickFilter === filter.value ? null : filter.value)
              }
              style={{
                padding: '0.65rem 1.25rem',
                background: activeQuickFilter === filter.value 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : '#f3f4f6',
                color: activeQuickFilter === filter.value ? 'white' : '#111827',
                border: activeQuickFilter === filter.value 
                  ? 'none' 
                  : '1px solid #e5e7eb',
                borderRadius: '9999px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem',
                boxShadow: activeQuickFilter === filter.value 
                  ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeQuickFilter !== filter.value) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                } else {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeQuickFilter !== filter.value) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                } else {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS COUNT + SORT */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <p style={{ margin: 0, fontWeight: '700', color: '#111827' }}>
          <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.2rem', fontWeight: '800' }}>
            {sortedServices.length}
          </span>
          {' '}Caterers found in Hyderabad
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: 'white',
              appearance: 'none',
              transition: 'all 0.2s ease',
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
            <option value="relevance">Relevance</option>
            <option value="price">Price (Low to High)</option>
            <option value="rating">Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {/* CATERER CARDS GRID */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {sortedServices.map((service) => (
            <CatererCard key={service.id} item={service} />
          ))}
        </div>

        {sortedServices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#6b7280' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No caterers found</p>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CateringPage;