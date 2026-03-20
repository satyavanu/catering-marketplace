'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  useDecorations, 
  useDecorationsByType, 
  useDecorationsByCountry,
  useDecorationsByTypeAndCountry 
} from '@catering-marketplace/query-client';
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';

const DecorationsPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [params] = useState({ page: 1, limit: 12 });

  // Call all hooks at the top level
  const allDecorations = useDecorations(params);
  const byType = useDecorationsByType(selectedTheme, params);
  const byCountry = useDecorationsByCountry(selectedCountry, params);
  const byBoth = useDecorationsByTypeAndCountry(selectedTheme, selectedCountry, params);

  // Determine which query result to use
  let { data: decorations = [], isLoading, error } = allDecorations;

  if (selectedTheme && selectedCountry) {
    ({ data: decorations = [], isLoading, error } = byBoth);
  } else if (selectedTheme) {
    ({ data: decorations = [], isLoading, error } = byType);
  } else if (selectedCountry) {
    ({ data: decorations = [], isLoading, error } = byCountry);
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const themes = ['Floral', 'Lighting', 'Table Decor', 'Backdrops', 'Balloons', 'Draping'];
  const countries = ['USA', 'Canada', 'UK'];

  if (error) return <div>Error loading decorations</div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 32px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 12px 0',
          }}
        >
          Transform Your Event with Beautiful Decorations
        </h1>
        <p
          style={{
            fontSize: '18px',
            opacity: 0.9,
            margin: 0,
          }}
        >
          Stunning decor options for every celebration
        </p>
      </div>

      {/* Filters Section */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 16px 0',
            }}
          >
            Filter Decorations
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Theme
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">All Themes</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                style={{
                  width: '100%',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#764ba2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                {isLoading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Decorations Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {decorations.map((decor) => (
            <Link key={decor.id} href={`/decorations/${decor.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: '#e2e8f0',
                  }}
                >
                  <img
                    src={decor.image}
                    alt={decor.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    {decor.theme}
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(decor.id, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'white',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <HeartIcon
                      style={{
                        width: '18px',
                        height: '18px',
                        color: favorites.includes(decor.id) ? '#ef4444' : '#94a3b8',
                        fill: favorites.includes(decor.id) ? '#ef4444' : 'none',
                      }}
                    />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 6px 0',
                    }}
                  >
                    {decor.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {decor.company}
                  </p>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#475569',
                      margin: '0 0 12px 0',
                      lineHeight: '1.4',
                    }}
                  >
                    {decor.details}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarIcon style={{ width: '16px', height: '16px', color: '#f59e0b', fill: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {decor.rating}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>({decor.reviews})</span>
                    </div>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#667eea',
                      }}
                    >
                      {decor.price}
                    </span>
                  </div>

                  <button
                    onClick={(e) => e.preventDefault()}
                    style={{
                      width: '100%',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#764ba2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecorationsPage;