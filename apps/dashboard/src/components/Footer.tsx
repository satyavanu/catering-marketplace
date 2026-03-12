'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Private Dinner', 'Party', 'Gala'];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginTop: '4rem' }}>
      <div className="max-w-7xl px-4">
        {/* Main Footer Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Brand Section */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f97316' }}>
              🍽️ CaterHub
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
              Connecting event organizers with exceptional catering services worldwide. Book the perfect caterer for your special event.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" aria-label="Facebook" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '1.25rem', transition: 'color 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                f
              </a>
              <a href="#" aria-label="Twitter" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '1.25rem', transition: 'color 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                𝕏
              </a>
              <a href="#" aria-label="LinkedIn" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '1.25rem', transition: 'color 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                in
              </a>
              <a href="#" aria-label="Instagram" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '1.25rem', transition: 'color 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#d1d5db' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link href="/" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link href="/caterers" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  Browse Caterers
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link href="/how-it-works" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  How It Works
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link href="/about-us" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse By Cuisine */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>By Cuisine</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#d1d5db' }}>
              {cuisines.slice(0, 6).map((cuisine) => (
                <li key={cuisine} style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    href={`/caterers/by-cuisine/${encodeURIComponent(cuisine)}`} 
                    style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} 
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} 
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}
                  >
                    {cuisine}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Event Type */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>By Event Type</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#d1d5db' }}>
              {eventTypes.map((eventType) => (
                <li key={eventType} style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    href={`/caterers/by-event/${encodeURIComponent(eventType)}`} 
                    style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} 
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} 
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}
                  >
                    {eventType}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', paddingBottom: '2rem' }}>
          {/* Browse By Country Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 
              style={{ 
                fontWeight: 'bold', 
                marginBottom: '1rem', 
                color: 'white', 
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                userSelect: 'none'
              }}
              onClick={() => toggleSection('countries')}
            >
              <span>🌍 Browse By Country ({countries.length})</span>
              <span style={{ fontSize: '0.875rem', color: '#f97316' }}>
                {expandedSection === 'countries' ? '▼' : '▶'}
              </span>
            </h4>
            
            {expandedSection === 'countries' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {countries.map((country) => (
                  <Link
                    key={country.name}
                    href={`/caterers/by-country/${encodeURIComponent(country.name)}`}
                    style={{
                      color: '#d1d5db',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                      e.currentTarget.style.color = '#f97316';
                      e.currentTarget.style.paddingLeft = '1rem';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
                      e.currentTarget.style.paddingLeft = '0.75rem';
                    }}
                  >
                    <span>{country.emoji}</span>
                    <span>{country.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Legal Section */}
          <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#d1d5db', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              <li>
                <Link href="/terms-of-use" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.875rem' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')} onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>Email</p>
            <a href="mailto:info@caterhub.com" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem' }}>
              info@caterhub.com
            </a>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>Phone</p>
            <a href="tel:+1234567890" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem' }}>
              +1 (234) 567-890
            </a>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>Support Hours</p>
            <p style={{ color: '#d1d5db', fontWeight: '600', fontSize: '0.875rem' }}>24/7 Available</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            © {currentYear} CaterHub. All rights reserved.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Made with ❤️ for event organizers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;