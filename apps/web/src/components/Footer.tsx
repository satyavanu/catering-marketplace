'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expandedSection, setExpandedSection] = useState<string | null>('countries');

  const countries = [
    { name: 'United States', emoji: '🇺🇸' },
    { name: 'Canada', emoji: '🇨🇦' },
    { name: 'United Kingdom', emoji: '🇬🇧' },
    { name: 'France', emoji: '🇫🇷' },
    { name: 'Germany', emoji: '🇩🇪' },
    { name: 'Italy', emoji: '🇮🇹' },
    { name: 'Spain', emoji: '🇪🇸' },
    { name: 'Netherlands', emoji: '🇳🇱' },
    { name: 'Australia', emoji: '🇦🇺' },
    { name: 'Japan', emoji: '🇯🇵' },
    { name: 'Singapore', emoji: '🇸🇬' },
    { name: 'Thailand', emoji: '🇹🇭' },
    { name: 'India', emoji: '🇮🇳' },
    { name: 'Sri Lanka', emoji: '🇱🇰' },
    { name: 'United Arab Emirates', emoji: '🇦🇪' },
    { name: 'Saudi Arabia', emoji: '🇸🇦' },
    { name: 'Qatar', emoji: '🇶🇦' },
    { name: 'Mexico', emoji: '🇲🇽' },
    { name: 'Brazil', emoji: '🇧🇷' },
    { name: 'Argentina', emoji: '🇦🇷' },
  ];

  const cuisines = [
    'French',
    'Italian',
    'Indian',
    'Japanese',
    'Spanish',
    'Thai',
    'Mediterranean',
    'American BBQ',
    'Asian Fusion',
    'German',
    'British',
    'Middle Eastern',
  ];

  const eventTypes = [
    'Wedding',
    'Corporate',
    'Birthday',
    'Private Dinner',
    'Party',
    'Gala',
  ];

  const venues = [
    'Banquet Halls',
    'Garden Venues',
    'Beach Resorts',
    'Luxury Hotels',
    'Rooftop Venues',
    'Country Clubs',
    'Historic Sites',
    'Modern Lofts',
  ];

  const decorations = [
    'Floral Arrangements',
    'Table Settings',
    'Lighting & Ambiance',
    'Balloon Decor',
    'Backdrop Design',
    'Centerpieces',
    'Themed Decor',
    'Premium Linens',
  ];

  const experiences = [
    'Wine Tasting',
    'Chef Dinner',
    'Cooking Class',
    'Tasting Menu',
    'Farm to Table',
    'Michelin Star',
    'Molecular Gastronomy',
    'Food Pairing',
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: 'white',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        marginTop: '4rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Top Mobile App Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
            padding: '2rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #334155',
          }}
        >
          {/* Download Apps */}
          <div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              📱 Download Our Apps
            </h3>
            <p
              style={{
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.6',
              }}
            >
              Book your perfect catering experience on the go. Available on iOS and Android with exclusive mobile-only deals!
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* iOS App */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid #334155',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <span style={{ fontSize: '2rem' }}>🍎</span>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                    Download on
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: '700',
                      fontSize: '1rem',
                      color: 'white',
                    }}
                  >
                    App Store
                  </p>
                </div>
              </a>

              {/* Android App */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid #334155',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <span style={{ fontSize: '2rem' }}>🤖</span>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                    Get it on
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: '700',
                      fontSize: '1rem',
                      color: 'white',
                    }}
                  >
                    Google Play
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              ✉️ Newsletter
            </h3>
            <p
              style={{
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.6',
              }}
            >
              Get exclusive deals, new experiences, and catering tips delivered to your inbox weekly!
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.backgroundColor = '#0f172a';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              />
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f97316';
                }}
              >
                Subscribe
              </button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
              ✓ We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Section */}
          <div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#f97316',
              }}
            >
              🍽️ CaterHub
            </h3>
            <p
              style={{
                color: '#cbd5e1',
                marginBottom: '1rem',
                lineHeight: '1.6',
                fontSize: '0.875rem',
              }}
            >
              Connecting event organizers with exceptional catering services, venues, and decoration experts worldwide. Book the perfect experience for your special event.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a
                href="#"
                aria-label="Facebook"
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f97316';
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                f
              </a>
              <a
                href="#"
                aria-label="Twitter"
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f97316';
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                𝕏
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f97316';
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                in
              </a>
              <a
                href="#"
                aria-label="Instagram"
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f97316';
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1' }}>
              {['Home', 'Browse Caterers', 'Find Venues', 'Decorations', 'How It Works', 'About Us', 'Blog', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f97316';
                      e.currentTarget.style.paddingLeft = '0.25rem';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <span>→</span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Cuisine */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              🍽️ By Cuisine
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1' }}>
              {cuisines.map((cuisine) => (
                <li key={cuisine} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    href={`/caterers/by-cuisine/${encodeURIComponent(cuisine)}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    {cuisine}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Event Type */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              🎉 By Event Type
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1' }}>
              {eventTypes.map((eventType) => (
                <li key={eventType} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    href={`/caterers/by-event/${encodeURIComponent(eventType)}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    {eventType}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Venues */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              🏛️ Venues
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1' }}>
              {venues.map((venue) => (
                <li key={venue} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    href={`/venues/by-type/${encodeURIComponent(venue)}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    {venue}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Decorations */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              ✨ Decorations
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1' }}>
              {decorations.map((decoration) => (
                <li key={decoration} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    href={`/decorations/by-type/${encodeURIComponent(decoration)}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    {decoration}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Experiences */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              🌟 Experiences
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1' }}>
              {experiences.map((experience) => (
                <li key={experience} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    href={`/experiences/by-type/${encodeURIComponent(experience)}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    {experience}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          }}
        >
          {/* Browse By Country Section - DEFAULT EXPANDED */}
          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1.125rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                userSelect: 'none',
                padding: '0.5rem 0',
              }}
              onClick={() => toggleSection('countries')}
            >
              <span>🌍 Browse By Country ({countries.length})</span>
              <span style={{ fontSize: '1rem', color: '#f97316', transition: 'transform 0.3s ease', transform: expandedSection === 'countries' ? 'rotate(180deg)' : 'rotate(0)' }}>
                ▼
              </span>
            </h4>

            {expandedSection === 'countries' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  animation: 'fadeIn 0.3s ease-in',
                }}
              >
                {countries.map((country) => (
                  <Link
                    key={country.name}
                    href={`/caterers/by-country/${encodeURIComponent(country.name)}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: 'transparent',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1e293b';
                      e.currentTarget.style.color = '#f97316';
                      e.currentTarget.style.borderColor = '#f97316';
                      e.currentTarget.style.paddingLeft = '1rem';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.75rem';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{country.emoji}</span>
                    <span>{country.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Legal & Help Section */}
          <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem' }}>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1.125rem',
              }}
            >
              📋 Legal & Support
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div>
                <h5
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#f97316',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                  }}
                >
                  Legal
                </h5>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    color: '#cbd5e1',
                  }}
                >
                  {['Terms of Use', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map((item) => (
                    <li key={item} style={{ marginBottom: '0.75rem' }}>
                      <Link
                        href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                        style={{
                          color: '#cbd5e1',
                          textDecoration: 'none',
                          transition: 'color 0.3s',
                          fontSize: '0.875rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#f97316',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                  }}
                >
                  For Businesses
                </h5>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    color: '#cbd5e1',
                  }}
                >
                  {['Become a Caterer', 'Add Your Venue', 'Decoration Services', 'Partner Program', 'Affiliate Program'].map((item) => (
                    <li key={item} style={{ marginBottom: '0.75rem' }}>
                      <Link
                        href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                        style={{
                          color: '#cbd5e1',
                          textDecoration: 'none',
                          transition: 'all 0.3s',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#f97316';
                          const span = e.currentTarget.querySelector('span:first-child');
                          if (span) span.style.paddingLeft = '0.25rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#cbd5e1';
                          const span = e.currentTarget.querySelector('span:first-child');
                          if (span) span.style.paddingLeft = '0';
                        }}
                      >
                        <span>→</span>
                        <span>{item}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#f97316',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                  }}
                >
                  Support
                </h5>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    color: '#cbd5e1',
                  }}
                >
                  {['Help Center', 'Contact Support', 'FAQ', 'Community'].map((item) => (
                    <li key={item} style={{ marginBottom: '0.75rem' }}>
                      <Link
                        href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                        style={{
                          color: '#cbd5e1',
                          textDecoration: 'none',
                          transition: 'color 0.3s',
                          fontSize: '0.875rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #334155',
          }}
        >
          <div>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                letterSpacing: '0.05em',
              }}
            >
              📧 Email Support
            </p>
            <a
              href="mailto:info@caterhub.com"
              style={{
                color: '#f97316',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              info@caterhub.com
            </a>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
              Response time: 2 hours
            </p>
          </div>

          <div>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                letterSpacing: '0.05em',
              }}
            >
              📱 Phone Support
            </p>
            <a
              href="tel:+1234567890"
              style={{
                color: '#f97316',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              +1 (234) 567-890
            </a>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
              Available 24/7
            </p>
          </div>

          <div>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                letterSpacing: '0.05em',
              }}
            >
              💬 Live Chat
            </p>
            <a
              href="#"
              style={{
                color: '#f97316',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Start Chat
            </a>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
              🟢 Agents online
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            © {currentYear} CaterHub. All rights reserved. | Made with ❤️ for event organizers worldwide
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
              Trust Badges:
            </span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span title="SSL Secure" style={{ fontSize: '1.25rem', cursor: 'help' }}>
                🔒
              </span>
              <span title="Privacy Certified" style={{ fontSize: '1.25rem', cursor: 'help' }}>
                ✓
              </span>
              <span title="4.9/5 Trusted" style={{ fontSize: '1.25rem', cursor: 'help' }}>
                ⭐
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
