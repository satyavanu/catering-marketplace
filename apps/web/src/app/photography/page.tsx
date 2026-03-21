'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  StarIcon,
  HeartIcon,
  ListBulletIcon,
  MapIcon,
  SparklesIcon,
  FireIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UserGroupIcon,
  CameraIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const PhotographyPage = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    serviceType: '',
    occasion: '',
    experience: '',
  });

  const serviceTypes = [
    { id: 1, name: 'Wedding', icon: '💍' },
    { id: 2, name: 'Engagement', icon: '💑' },
    { id: 3, name: 'Portrait', icon: '🎭' },
    { id: 4, name: 'Event', icon: '🎉' },
    { id: 5, name: 'Pre-Wedding', icon: '📸' },
    { id: 6, name: 'Candid', icon: '✨' },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      priceRange: '',
      serviceType: '',
      occasion: '',
      experience: '',
    });
  };

  const isFiltersActive = Object.values(filters).some((val) => val !== '');

  const photographers = [
    {
      id: 1,
      name: 'Timeless Moments Photography',
      location: 'New York, NY',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.006 },
      pricePerDay: '$1,500 - $3,000',
      pricePerHour: '$150 - $250',
      rating: 4.9,
      reviews: 287,
      image: 'https://images.unsplash.com/photo-1502764613149-7f3d7dc5d43b?w=500&h=300&fit=crop',
      serviceTypes: ['Wedding', 'Engagement', 'Pre-Wedding'],
      occasions: ['Wedding', 'Engagement'],
      yearsExperience: 12,
      styles: ['Traditional', 'Candid', 'Cinematic'],
      isFeatured: true,
      description: 'Professional wedding and engagement photography with 12+ years experience capturing precious moments.',
    },
    {
      id: 2,
      name: 'Candid Chronicles',
      location: 'Los Angeles, CA',
      country: 'USA',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      pricePerDay: '$1,200 - $2,500',
      pricePerHour: '$120 - $200',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1516035893752-42145eba63d1?w=500&h=300&fit=crop',
      serviceTypes: ['Candid', 'Event', 'Wedding'],
      occasions: ['Wedding', 'Corporate', 'Birthday'],
      yearsExperience: 8,
      styles: ['Candid', 'Documentary', 'Modern'],
      isFeatured: true,
      description: 'Specializing in candid and documentary style photography for unforgettable moments.',
    },
    {
      id: 3,
      name: 'Portrait Artistry Studio',
      location: 'Chicago, IL',
      country: 'USA',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      pricePerDay: '$800 - $1,800',
      pricePerHour: '$100 - $180',
      rating: 4.7,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-16115327366c2a5f0fae1e1e8d8b1c3e?w=500&h=300&fit=crop',
      serviceTypes: ['Portrait', 'Pre-Wedding', 'Event'],
      occasions: ['Engagement', 'Birthday', 'Corporate'],
      yearsExperience: 6,
      styles: ['Portrait', 'Studio', 'Natural Light'],
      isFeatured: false,
      description: 'Creative portrait photography capturing your personality and style.',
    },
    {
      id: 4,
      name: 'Dream Capture Studios',
      location: 'Miami, FL',
      country: 'USA',
      coordinates: { lat: 25.7617, lng: -80.1918 },
      pricePerDay: '$2,000 - $4,000',
      pricePerHour: '$200 - $300',
      rating: 4.9,
      reviews: 412,
      image: 'https://images.unsplash.com/photo-1502764613149-7f3d7dc5d43b?w=500&h=300&fit=crop',
      serviceTypes: ['Wedding', 'Engagement', 'Event'],
      occasions: ['Wedding', 'Corporate', 'Anniversary'],
      yearsExperience: 15,
      styles: ['Luxury', 'Cinematic', 'Candid'],
      isFeatured: true,
      description: 'Luxury wedding photography with cinematic approach and international experience.',
    },
    {
      id: 5,
      name: 'Heritage Photography',
      location: 'Boston, MA',
      country: 'USA',
      coordinates: { lat: 42.3601, lng: -71.0589 },
      pricePerDay: '$1,000 - $2,000',
      pricePerHour: '$100 - $150',
      rating: 4.6,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop',
      serviceTypes: ['Wedding', 'Portrait', 'Event'],
      occasions: ['Wedding', 'Anniversary', 'Family'],
      yearsExperience: 10,
      styles: ['Traditional', 'Classic', 'Timeless'],
      isFeatured: false,
      description: 'Classic and timeless photography preserving your most cherished moments.',
    },
    {
      id: 6,
      name: 'Modern Lens Photography',
      location: 'Seattle, WA',
      country: 'USA',
      coordinates: { lat: 47.6062, lng: -122.3321 },
      pricePerDay: '$900 - $1,600',
      pricePerHour: '$90 - $160',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop',
      serviceTypes: ['Engagement', 'Pre-Wedding', 'Event'],
      occasions: ['Engagement', 'Corporate', 'Birthday'],
      yearsExperience: 7,
      styles: ['Modern', 'Artistic', 'Creative'],
      isFeatured: false,
      description: 'Contemporary photography with artistic vision and creative storytelling.',
    },
  ];

  const PhotographerCard = ({ photographer }: { photographer: (typeof photographers)[0] }) => (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(-8px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          backgroundColor: '#e2e8f0',
        }}
      >
        <img
          src={photographer.image}
          alt={photographer.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.transform = 'scale(1)';
          }}
        />

        {/* Featured Badge */}
        {photographer.isFeatured && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#f97316',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10,
            }}
          >
            <FireIcon style={{ width: '14px', height: '14px' }} />
            Featured
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(photographer.id)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'white',
            border: 'none',
            width: '40px',
            height: '40px',
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
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
          }}
        >
          <HeartIcon
            style={{
              width: '20px',
              height: '20px',
              color: favorites.includes(photographer.id) ? '#ef4444' : '#94a3b8',
              fill: favorites.includes(photographer.id) ? '#ef4444' : 'none',
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
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            backdropFilter: 'blur(4px)',
          }}
        >
          {photographer.pricePerHour}/hour
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '18px' }}>
        {/* Header with Rating */}
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
            marginBottom: '12px',
            gap: '12px',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 4px 0',
              }}
            >
              {photographer.name}
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <StarIcon style={{ width: '16px', height: '16px', color: '#f59e0b', fill: '#f59e0b' }} />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                {photographer.rating}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                ({photographer.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <MapPinIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          <span>
            {photographer.location}, {photographer.country}
          </span>
        </div>

        {/* Service Types */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '14px',
            flexWrap: 'wrap',
          }}
        >
          {photographer.serviceTypes.map((type, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                padding: '5px 10px',
                backgroundColor: '#f0f4ff',
                color: '#667eea',
                borderRadius: '6px',
                fontWeight: '600',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4ff';
                e.currentTarget.style.color = '#667eea';
              }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#e2e8f0',
            marginBottom: '14px',
          }}
        />

        {/* Experience and Price */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#94a3b8',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Experience
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CameraIcon style={{ width: '14px', height: '14px', color: '#667eea' }} />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                {photographer.yearsExperience} years
              </span>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#94a3b8',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Daily Rate
            </p>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#667eea' }}>
              {photographer.pricePerDay}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/photography/${photographer.id}`} style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#764ba2';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View Portfolio & Book
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 32px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 12px 0',
            letterSpacing: '-1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <CameraIcon style={{ width: '48px', height: '48px' }} />
          Professional Photography Services
        </h1>
        <p
          style={{
            fontSize: '18px',
            opacity: 0.9,
            margin: 0,
            fontWeight: '500',
          }}
        >
          Capture your special moments with award-winning photographers
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        {/* SERVICE TYPE SECTION */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#1e293b',
                margin: '0 0 12px 0',
              }}
            >
              Photography Services
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: '#64748b',
                margin: 0,
                fontWeight: '500',
              }}
            >
              Browse our collection of professional photographers specializing in various services
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {serviceTypes.map((service) => (
              <div
                key={service.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f4ff';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <span style={{ fontSize: '24px' }}>{service.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  {service.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ENHANCED FILTERS SECTION */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
            marginBottom: '40px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AdjustmentsHorizontalIcon style={{ width: '20px', height: '20px', color: '#667eea' }} />
              Find Your Photographer
            </h2>

            {/* View Toggle */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: '#f8fafc',
                padding: '6px',
                borderRadius: '10px',
              }}
            >
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                  color: viewMode === 'grid' ? '#667eea' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none',
                }}
              >
                <ListBulletIcon style={{ width: '16px', height: '16px' }} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: viewMode === 'map' ? 'white' : 'transparent',
                  color: viewMode === 'map' ? '#667eea' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'map' ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none',
                }}
              >
                <MapIcon style={{ width: '16px', height: '16px' }} />
                Map
              </button>
            </div>
          </div>

          {/* Filter Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            {/* Location Filter */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                📍 Location
              </label>
              <input
                type="text"
                placeholder="Search by city or state..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: filters.location ? '#f0f4ff' : 'white',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                💰 Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: filters.priceRange ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">Any Budget</option>
                <option value="under-1000">Under $1,000/day</option>
                <option value="1000-2000">$1,000 - $2,000/day</option>
                <option value="2000-3000">$2,000 - $3,000/day</option>
                <option value="3000-5000">$3,000 - $5,000/day</option>
                <option value="over-5000">$5,000+/day</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                📸 Service Type
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: filters.serviceType ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Services</option>
                <option value="wedding">Wedding</option>
                <option value="engagement">Engagement</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="pre-wedding">Pre-Wedding</option>
                <option value="candid">Candid</option>
              </select>
            </div>

            {/* Occasion Filter */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                🎉 Occasion
              </label>
              <select
                value={filters.occasion}
                onChange={(e) => handleFilterChange('occasion', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: filters.occasion ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Occasions</option>
                <option value="wedding">Wedding</option>
                <option value="engagement">Engagement</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="corporate">Corporate Event</option>
                <option value="family">Family</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                ⭐ Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: filters.experience ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Levels</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
                <option value="15">15+ years</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '12px',
              gridColumn: '1 / -1',
            }}
          >
            <button
              style={{
                width: '100%',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#764ba2';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🔍 Search Photographers
            </button>

            {isFiltersActive && (
              <button
                onClick={resetFilters}
                style={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: '1.5px solid #667eea',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f4ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* FEATURED PHOTOGRAPHERS SECTION */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#1e293b',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <FireIcon style={{ width: '32px', height: '32px', color: '#f97316' }} />
              Featured Photographers
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: '#64748b',
                margin: 0,
                fontWeight: '500',
              }}
            >
              Our most talented and highly-rated photographers
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            {photographers.filter((p) => p.isFeatured).map((photographer) => (
              <PhotographerCard key={photographer.id} photographer={photographer} />
            ))}
          </div>
        </div>

        {/* ALL PHOTOGRAPHERS SECTION */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1e293b',
                margin: 0,
              }}
            >
              All Photographers
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '6px 0 0 0',
                fontWeight: '500',
              }}
            >
              {photographers.length} talented photographers to choose from
            </p>
          </div>

          {viewMode === 'grid' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '28px',
              }}
            >
              {photographers.map((photographer) => (
                <PhotographerCard key={photographer.id} photographer={photographer} />
              ))}
            </div>
          )}

          {viewMode === 'map' && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <MapIcon style={{ width: '48px', height: '48px', color: '#667eea' }} />
                <div style={{ textAlign: 'center' }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Map View Coming Soon
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0,
                    }}
                  >
                    Interactive map with photographer locations will be available soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WHY CHOOSE US - TRUST SECTION */}
        <div style={{ marginTop: '80px', marginBottom: '80px' }}>
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1e293b',
                margin: '0 0 12px 0',
              }}
            >
              Why Choose Our Photographers?
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#64748b',
                margin: 0,
                fontWeight: '500',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              We connect you with the best photography talent for your special occasions
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            {/* Trust Card 1: Verified Photographers */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <ShieldCheckIcon style={{ width: '32px', height: '32px', color: '#667eea' }} />
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                Verified Professionals
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                All photographers are verified with portfolios, client reviews, and proven experience in their specialties.
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#667eea',
                }}
              >
                <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                100% Quality Assured
              </div>
            </div>

            {/* Trust Card 2: Easy Booking */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <SparklesIcon style={{ width: '32px', height: '32px', color: '#f59e0b' }} />
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                Easy Booking Process
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Browse portfolios, check availability, and book your photographer in just a few clicks. Secure confirmation.
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#f59e0b',
                }}
              >
                <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                Book in Minutes
              </div>
            </div>

            {/* Trust Card 3: Transparent Pricing */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <CreditCardIcon style={{ width: '32px', height: '32px', color: '#16a34a' }} />
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                Transparent Pricing
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                See all pricing upfront. Hourly rates, packages, and add-ons clearly listed. No hidden charges.
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#16a34a',
                }}
              >
                <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                No Hidden Fees
              </div>
            </div>

            {/* Trust Card 4: Portfolio Quality */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <CameraIcon style={{ width: '32px', height: '32px', color: '#a855f7' }} />
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                Professional Portfolios
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Review extensive portfolios showcasing different styles and occasions. See the quality before booking.
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#a855f7',
                }}
              >
                <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                Browse Portfolios
              </div>
            </div>

            {/* Trust Card 5: Expert Support */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <UserGroupIcon style={{ width: '32px', height: '32px', color: '#ef4444' }} />
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                24/7 Support Team
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Our support team is here to help with questions, changes, or any issues. Available whenever you need us.
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ef4444',
                }}
              >
                <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                24/7 Support
              </div>
            </div>

            {/* Trust Card 6: Community Reviews */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#cffafe',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <HeartIcon style={{ width: '32px', height: '32px', color: '#0891b2' }} />
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                Trusted by Thousands
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Join thousands of happy clients who found the perfect photographer. Read real verified reviews.
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#0891b2',
                }}
              >
                <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                8,000+ Happy Events
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div
            style={{
              marginTop: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '48px 32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                250+
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Professional Photographers
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                8K+
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Successful Bookings
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                4.9★
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Average Rating
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                50+
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Cities Covered
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '64px 32px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
            marginBottom: '40px',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1e293b',
              margin: '0 0 12px 0',
            }}
          >
            Find Your Perfect Photographer Today
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#64748b',
              margin: '0 0 32px 0',
              fontWeight: '500',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Capture your precious moments with a professional photographer who matches your style and budget
          </p>

          <button
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#764ba2';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Explore All Photographers →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographyPage;