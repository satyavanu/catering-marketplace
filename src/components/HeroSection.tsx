'use client';

import React, { useState } from 'react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery, 'Location:', location);
  };

  return (
    <section
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=600&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        paddingTop: '8rem',
        paddingBottom: '8rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '600px',
      }}
    >
      {/* Dark Overlay for Text Readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
      />

      {/* Decorative Background Elements */}
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

      <div className="max-w-7xl px-4" style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero Content */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fed7aa',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              ✨ Welcome to CaterHub
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2' }}>
            Find the Perfect Catering Service
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#fed7aa', marginBottom: '0.5rem' }}>
            Discover and book trusted catering services for your next event
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
            From intimate dinners to grand celebrations, we connect you with the best caterers
          </p>
        </div>

        {/* Search Banner */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            maxWidth: '56rem',
            margin: '0 auto',
          }}
        >
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {/* Search Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  🍽️ Cuisine Type
                </label>
                <input
                  type="text"
                  placeholder="Italian, Indian, Fusion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#f97316')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              {/* Location Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  📍 Location
                </label>
                <input
                  type="text"
                  placeholder="New York, London..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#f97316')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              {/* Date Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  📅 Event Date
                </label>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    transition: 'border-color 0.3s',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#f97316')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              {/* Search Button */}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, transform 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ea580c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔍 Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* CTA Text */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
            👇 Browse by categories below to get started
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;