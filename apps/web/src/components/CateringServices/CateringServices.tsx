'use client';

import React, { useState } from 'react';
import { MapPinIcon, StarIcon, HeartIcon, MapIcon, FireIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCateringServices, type CateringService } from '@catering-marketplace/query-client';

interface CateringServicesProps {
  searchFilters?: {
    location?: string;
    priceRange?: string;
    guestCount?: string;
    cuisineType?: string;
    occasion?: string;
  };
  viewMode?: 'grid' | 'map';
  onViewModeChange?: (mode: 'grid' | 'map') => void;
  onFavoriteToggle?: (serviceId: number, isFavorite: boolean) => void;
  favorites?: number[];
}

const CateringServices: React.FC<CateringServicesProps> = ({
  searchFilters,
  viewMode = 'grid',
  onViewModeChange,
  onFavoriteToggle,
  favorites = [],
}) => {
  const { data: services, isLoading, error } = useCateringServices(searchFilters);
  const [localFavorites, setLocalFavorites] = useState<number[]>(favorites);

  const toggleFavorite = (id: number) => {
    const updated = localFavorites.includes(id)
      ? localFavorites.filter(fav => fav !== id)
      : [...localFavorites, id];
    setLocalFavorites(updated);
    onFavoriteToggle?.(id, updated.includes(id));
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 32px', marginBottom: '80px' }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Loading catering services...</p>
      </div>
    );
  }

  if (error || !services) {
    return (
      <div style={{ marginBottom: '80px' }}>
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
          <p style={{ color: '#991b1b', fontSize: '14px', margin: 0 }}>
            Error loading catering services. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const CateringCard = ({ catering }: { catering: CateringService }) => (
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
        display: 'flex',
        flexDirection: 'column',
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
          src={catering.image}
          alt={catering.title}
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
        {catering.isFeatured && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#f59e0b',
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
          onClick={() => toggleFavorite(catering.id)}
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
              color: localFavorites.includes(catering.id) ? '#f59e0b' : '#94a3b8',
              fill: localFavorites.includes(catering.id) ? '#f59e0b' : 'none',
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
          {catering.pricePerPerson}/person
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              {catering.title}
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
                {catering.rating}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                ({catering.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Location & Duration */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <MapPinIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          <span>{catering.location}</span>
        </div>

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
          <ClockIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          <span>{catering.duration}</span>
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '14px',
            flexWrap: 'wrap',
          }}
        >
          {catering.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                padding: '5px 10px',
                backgroundColor: '#fef3c7',
                color: '#f59e0b',
                borderRadius: '6px',
                fontWeight: '600',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fef3c7';
                e.currentTarget.style.color = '#f59e0b';
              }}
            >
              {tag}
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

        {/* Guest Count */}
        <div style={{ marginBottom: '14px', flex: 1 }}>
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
            Guest Capacity
          </p>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>
            {catering.guestCount}
          </span>
        </div>

        {/* CTA Button */}
        <Link href={`/catering/${catering.id}`} style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
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
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View Menu
            <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: '80px' }}>
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
          <FireIcon style={{ width: '32px', height: '32px', color: '#f59e0b' }} />
          All Catering Services
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: '#64748b',
            margin: 0,
            fontWeight: '500',
          }}
        >
          Discover {services.length} exceptional catering options{searchFilters && Object.values(searchFilters).some(v => v) ? ' based on your search' : ''} for your event
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '28px',
          }}
        >
          {services.map((catering) => (
            <CateringCard key={catering.id} catering={catering} />
          ))}
        </div>
      )}

      {/* Map View */}
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
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <MapIcon style={{ width: '48px', height: '48px', color: '#f59e0b' }} />
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
                Interactive map with catering service locations will be available soon
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 32px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0, fontWeight: '500' }}>
            No catering services found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default CateringServices;