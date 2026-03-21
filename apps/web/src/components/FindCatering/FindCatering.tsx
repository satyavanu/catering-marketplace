'use client';

import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, ListBulletIcon, MapIcon } from '@heroicons/react/24/outline';
import { useCateringFilters, type FilterOption } from '@catering-marketplace/query-client';

interface FindCateringProps {
  onSearch?: (filters: CateringFiltersState) => void;
  onFilterChange?: (filterName: string, value: string) => void;
}

interface CateringFiltersState {
  location: string;
  priceRange: string;
  guestCount: string;
  cuisineType: string;
  occasion: string;
}

const FindCatering: React.FC<FindCateringProps> = ({
  onSearch,
  onFilterChange,
}) => {
  const { data: filterData, isLoading } = useCateringFilters();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<CateringFiltersState>({
    location: '',
    priceRange: '',
    guestCount: '',
    cuisineType: '',
    occasion: '',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
    onFilterChange?.(filterName, value);
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      location: '',
      priceRange: '',
      guestCount: '',
      cuisineType: '',
      occasion: '',
    };
    setFilters(emptyFilters);
  };

  const isFiltersActive = Object.values(filters).some(val => val !== '');

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#64748b' }}>Loading filters...</p>
      </div>
    );
  }

  if (!filterData) {
    return null;
  }

  const FilterSelect = ({
    label,
    icon,
    value,
    onChange,
    options,
  }: {
    label: string;
    icon: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }) => (
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
        {icon} {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '11px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          fontSize: '13px',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
          backgroundColor: value ? '#fef3c7' : 'white',
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
        <option value="">All {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
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
          Find Your Perfect Catering
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
        <FilterSelect
          label="Location"
          icon="📍"
          value={filters.location}
          onChange={(value) => handleFilterChange('location', value)}
          options={filterData.locations}
        />

        <FilterSelect
          label="Price per Person "
          icon="💰"
          value={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
          options={filterData.priceRanges}
        />

        <FilterSelect
          label="Guest Count"
          icon="👥"
          value={filters.guestCount}
          onChange={(value) => handleFilterChange('guestCount', value)}
          options={filterData.guestCounts}
        />

        <FilterSelect
          label="Cuisine Type"
          icon="🍜"
          value={filters.cuisineType}
          onChange={(value) => handleFilterChange('cuisineType', value)}
          options={filterData.cuisineTypes}
        />

        <FilterSelect
          label="Occasion"
          icon="🎉"
          value={filters.occasion}
          onChange={(value) => handleFilterChange('occasion', value)}
          options={filterData.occasions}
        />
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
          onClick={handleSearch}
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
          🔍 Search Catering
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
            ✕ Clear Filters
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
            {filters.location && (
              <span
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
                📍 {filterData.locations.find(l => l.value === filters.location)?.label || filters.location}
                <span
                  onClick={() => handleFilterChange('location', '')}
                  style={{ cursor: 'pointer', fontWeight: '700' }}
                >
                  ✕
                </span>
              </span>
            )}
            {filters.priceRange && (
              <span
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
                💰 {filterData.priceRanges.find(p => p.value === filters.priceRange)?.label || filters.priceRange}
                <span
                  onClick={() => handleFilterChange('priceRange', '')}
                  style={{ cursor: 'pointer', fontWeight: '700' }}
                >
                  ✕
                </span>
              </span>
            )}
            {filters.guestCount && (
              <span
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
                👥 {filterData.guestCounts.find(g => g.value === filters.guestCount)?.label || filters.guestCount}
                <span
                  onClick={() => handleFilterChange('guestCount', '')}
                  style={{ cursor: 'pointer', fontWeight: '700' }}
                >
                  ✕
                </span>
              </span>
            )}
            {filters.cuisineType && (
              <span
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
                🍜 {filterData.cuisineTypes.find(c => c.value === filters.cuisineType)?.label || filters.cuisineType}
                <span
                  onClick={() => handleFilterChange('cuisineType', '')}
                  style={{ cursor: 'pointer', fontWeight: '700' }}
                >
                  ✕
                </span>
              </span>
            )}
            {filters.occasion && (
              <span
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
                🎉 {filterData.occasions.find(o => o.value === filters.occasion)?.label || filters.occasion}
                <span
                  onClick={() => handleFilterChange('occasion', '')}
                  style={{ cursor: 'pointer', fontWeight: '700' }}
                >
                  ✕
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindCatering;