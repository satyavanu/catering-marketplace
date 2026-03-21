'use client';

import React, { useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  MapIcon,
  MapPinIcon,
  FireIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface FilterConfig {
  name: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  icon?: string;
}

interface Service {
  id: number;
  title: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerPerson: string;
  guestCount: string;
  tags: string[];
  isFeatured: boolean;
  description: string;
  duration: string;
  included: string[];
}

interface CateringFiltersAndGridProps {
  services: Service[];
  filterConfig: FilterConfig[];
  viewModeTitle?: string;
  sectionDescription?: string;
  cardComponent: React.ComponentType<{ service: Service }>;
}

const CateringFiltersAndGrid: React.FC<CateringFiltersAndGridProps> = ({
  services,
  filterConfig,
  viewModeTitle = 'All Services',
  sectionDescription = `Discover ${services.length} exceptional options for your event`,
  cardComponent: CardComponent,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(filterConfig.map(config => [config.name, '']))
  );

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(Object.fromEntries(filterConfig.map(config => [config.name, ''])));
  };

  const isFiltersActive = Object.values(filters).some(val => val !== '');

  return (
    <>
      {/* FILTERS SECTION */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          marginBottom: '40px',
          marginTop: '80px',
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
            <AdjustmentsHorizontalIcon style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
            Find Your Perfect Service
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
                color: viewMode === 'grid' ? '#f59e0b' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none',
              }}
            >
              <ListBulletIcon style={{ width: '16px', height: '16px' }} />
              List
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
                color: viewMode === 'map' ? '#f59e0b' : '#94a3b8',
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
          {filterConfig.map(config => (
            <div key={config.name}>
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
                {config.icon} {config.label}
              </label>

              {config.type === 'text' ? (
                <input
                  type="text"
                  placeholder={config.placeholder || 'Search...'}
                  value={filters[config.name]}
                  onChange={(e) => handleFilterChange(config.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    backgroundColor: filters[config.name] ? '#fef3c7' : 'white',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              ) : (
                <select
                  value={filters[config.name]}
                  onChange={(e) => handleFilterChange(config.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    backgroundColor: filters[config.name] ? '#fef3c7' : 'white',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">All {config.label}</option>
                  {config.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '12px',
          }}
        >
          <button
            style={{
              width: '100%',
              backgroundColor: '#f59e0b',
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
            🔍 Search
          </button>

          {isFiltersActive && (
            <button
              onClick={resetFilters}
              style={{
                backgroundColor: 'white',
                color: '#f59e0b',
                border: '1.5px solid #f59e0b',
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
                e.currentTarget.style.backgroundColor = '#fef3c7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {isFiltersActive && (
          <div
            style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
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
              Active Filters
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                const config = filterConfig.find(c => c.name === key);
                return (
                  <span
                    key={key}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      backgroundColor: '#fef3c7',
                      color: '#f59e0b',
                      borderRadius: '8px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {config?.icon} {value}
                    <span
                      onClick={() => handleFilterChange(key, '')}
                      style={{ cursor: 'pointer', fontWeight: '700' }}
                    >
                      ✕
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SERVICES GRID SECTION */}
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
            {viewModeTitle}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500',
            }}
          >
            {sectionDescription}
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
            {services.map((service) => (
              <CardComponent key={service.id} service={service} />
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
                  Interactive map with service locations will be available soon
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CateringFiltersAndGrid;