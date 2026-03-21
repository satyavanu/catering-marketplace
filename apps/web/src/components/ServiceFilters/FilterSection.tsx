'use client';

import React from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export interface FilterConfig {
  name: string;
  label: string;
  type: 'text' | 'select' | 'multiselect';
  placeholder?: string;
  options?: { value: string; label: string }[];
  icon?: string;
}

interface FilterSectionProps {
  filters: Record<string, string | string[]>;
  filterConfig: FilterConfig[];
  onFilterChange: (filterName: string, value: string | string[]) => void;
  onSearch: () => void;
  onReset: () => void;
  isFiltersActive: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  filterConfig,
  onFilterChange,
  onSearch,
  onReset,
  isFiltersActive,
}) => {
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
                  value={(filters[config.name] as string) || ''}
                  onChange={(e) => onFilterChange(config.name, e.target.value)}
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
              ) : config.type === 'select' ? (
                <select
                  value={(filters[config.name] as string) || ''}
                  onChange={(e) => onFilterChange(config.name, e.target.value)}
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
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {config.options?.map(option => (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: (filters[config.name] as string[])?.includes(option.value)
                          ? '#f59e0b'
                          : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: (filters[config.name] as string[])?.includes(option.value)
                          ? 'white'
                          : '#475569',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={(filters[config.name] as string[])?.includes(option.value) || false}
                        onChange={(e) => {
                          const current = (filters[config.name] as string[]) || [];
                          const updated = e.target.checked
                            ? [...current, option.value]
                            : current.filter(v => v !== option.value);
                          onFilterChange(config.name, updated);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
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
            onClick={onSearch}
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
              onClick={onReset}
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
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                const config = filterConfig.find(c => c.name === key);
                const displayValue = Array.isArray(value) ? value.join(', ') : value;

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
                    {config?.icon} {displayValue}
                    <span
                      onClick={() => onFilterChange(key, Array.isArray(value) ? [] : '')}
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
    </>
  );
};

export default FilterSection;