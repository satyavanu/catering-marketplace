'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSubscribeNewsletter } from '@catering-marketplace/query-client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expandedSection, setExpandedSection] = useState<string | null>('countries');
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

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

  const cuisines = ['French', 'Italian', 'Indian', 'Japanese', 'Spanish', 'Thai', 'Mediterranean', 'American BBQ', 'Asian Fusion', 'German', 'British', 'Middle Eastern'];
  const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Private Dinner', 'Party', 'Gala'];
  const venues = ['Banquet Halls', 'Garden Venues', 'Beach Resorts', 'Luxury Hotels', 'Rooftop Venues', 'Country Clubs', 'Historic Sites', 'Modern Lofts'];
  const decorations = ['Floral Arrangements', 'Table Settings', 'Lighting & Ambiance', 'Balloon Decor', 'Backdrop Design', 'Centerpieces', 'Themed Decor', 'Premium Linens'];
  const experiences = ['Wine Tasting', 'Chef Dinner', 'Cooking Class', 'Tasting Menu', 'Farm to Table', 'Michelin Star', 'Molecular Gastronomy', 'Food Pairing'];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSection(expandedMobileSection === section ? null : section);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribe({ email });
      setEmail('');
    }
  };

  const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      style={{
        color: '#cbd5e1',
        textDecoration: 'none',
        transition: 'all 0.3s',
        fontSize: '0.875rem',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
    >
      {label}
    </Link>
  );

  const MobileCollapsibleSection = ({
    title,
    icon,
    sectionId,
    children,
  }: {
    title: string;
    icon: string;
    sectionId: string;
    children: React.ReactNode;
  }) => (
    <div style={{ borderBottom: '1px solid #334155' }}>
      <button
        onClick={() => toggleMobileSection(sectionId)}
        style={{
          width: '100%',
          padding: '16px 0',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontWeight: '700',
          fontSize: '1rem',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#f97316';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'white';
        }}
      >
        <span>
          {icon} {title}
        </span>
        <ChevronDownIcon
          style={{
            width: '20px',
            height: '20px',
            transition: 'transform 0.3s ease',
            transform: expandedMobileSection === sectionId ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </button>

      {expandedMobileSection === sectionId && (
        <div
          style={{
            padding: '16px 0',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: 'white',
        paddingTop: '3rem',
        paddingBottom: '2rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Top Mobile App Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <a
                href="#"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.5rem 1rem',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid #334155',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '3rem', lineHeight: '1' }}>🍎</span>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Download on</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: 'white' }}>App Store</p>
                </div>
              </a>

              <a
                href="#"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.5rem 1rem',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid #334155',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '3rem', lineHeight: '1' }}>🤖</span>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Get it on</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: 'white' }}>Google Play</p>
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

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
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
                type="submit"
                disabled={isPending}
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
                {isPending ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.75rem 0 0 0' }}>
              ✓ We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Desktop: Main Footer Content */}
        <div
          style={{
            display: 'none',
            '@media (min-width: 1024px)': {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
            },
          } as any}
        >
          {/* Brand Section */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f97316' }}>
              🍽️ CaterHub
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '1rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
              Connecting event organizers with exceptional catering services worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {[
                { emoji: 'f', label: 'Facebook' },
                { emoji: '𝕏', label: 'Twitter' },
                { emoji: 'in', label: 'LinkedIn' },
                { emoji: '📷', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
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
                  {social.emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Home', 'Browse Caterers', 'Find Venues', 'How It Works', 'About Us', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <FooterLink href={`/${item.toLowerCase().replace(/ /g, '-')}`} label={item} />
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Cuisine */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>🍽️ By Cuisine</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cuisines.slice(0, 6).map((cuisine) => (
                <li key={cuisine}>
                  <FooterLink href={`/catering/by-cuisine/${encodeURIComponent(cuisine.toLowerCase().replace(/\s+/g, '-'))}`} label={cuisine} />
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Event Type */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>🎉 By Event Type</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {eventTypes.map((eventType) => (
                <li key={eventType}>
                  <FooterLink href={`/catering/by-event/${encodeURIComponent(eventType.toLowerCase().replace(/\s+/g, '-'))}`} label={eventType} />
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Venues */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>🏛️ Venues</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {venues.slice(0, 6).map((venue) => (
                <li key={venue}>
                  <FooterLink href={`/venues/by-type/${encodeURIComponent(venue.toLowerCase().replace(/\s+/g, '-'))}`} label={venue} />
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>📋 Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Help Center', 'Terms of Use', 'Privacy Policy', 'Contact Support'].map((item) => (
                <li key={item}>
                  <FooterLink href={`/${item.toLowerCase().replace(/ /g, '-')}`} label={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop: Browse By Country */}
        <div
          style={{
            marginBottom: '2rem',
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            display: 'none',
            '@media (min-width: 1024px)': {
              display: 'block',
            },
          } as any}
        >
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
                  href={`/catering/by-country/${encodeURIComponent(country.name.toLowerCase().replace(/\s+/g, '-'))}`}
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

        {/* Mobile: Collapsible Sections */}
        <div
          style={{
            display: 'block',
            '@media (min-width: 1024px)': {
              display: 'none',
            },
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            marginBottom: '2rem',
          } as any}
        >
          <MobileCollapsibleSection title="Quick Links" icon="🔗" sectionId="quick-links">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Home', 'Browse Caterers', 'Find Venues', 'How It Works', 'About Us', 'Blog', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setExpandedMobileSection(null)}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    padding: '8px 0',
                    borderBottom: '1px solid #334155',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  {item}
                </Link>
              ))}
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="By Cuisine" icon="🍽️" sectionId="cuisine">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cuisines.map((cuisine) => (
                <Link
                  key={cuisine}
                  href={`/catering/by-cuisine/${encodeURIComponent(cuisine.toLowerCase().replace(/\s+/g, '-'))}`}
                  onClick={() => setExpandedMobileSection(null)}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    padding: '8px 0',
                    borderBottom: '1px solid #334155',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  {cuisine}
                </Link>
              ))}
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="By Event Type" icon="🎉" sectionId="event-type">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {eventTypes.map((eventType) => (
                <Link
                  key={eventType}
                  href={`/catering/by-event/${encodeURIComponent(eventType.toLowerCase().replace(/\s+/g, '-'))}`}
                  onClick={() => setExpandedMobileSection(null)}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    padding: '8px 0',
                    borderBottom: '1px solid #334155',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  {eventType}
                </Link>
              ))}
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="By Country" icon="🌍" sectionId="country">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px',
              }}
            >
              {countries.map((country) => (
                <Link
                  key={country.name}
                  href={`/catering/by-country/${encodeURIComponent(country.name.toLowerCase().replace(/\s+/g, '-'))}`}
                  onClick={() => setExpandedMobileSection(null)}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f97316';
                    e.currentTarget.style.color = '#f97316';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{country.emoji}</span>
                  <span>{country.name.split(' ')[0]}</span>
                </Link>
              ))}
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="Support & Legal" icon="📋" sectionId="support">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Help Center', 'Terms of Use', 'Privacy Policy', 'Contact Support', 'Become a Partner'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setExpandedMobileSection(null)}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    padding: '8px 0',
                    borderBottom: '1px solid #334155',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  {item}
                </Link>
              ))}
            </div>
          </MobileCollapsibleSection>
        </div>

        {/* Contact Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #334155',
          }}
        >
          {[
            { icon: '📧', label: 'Email Support', contact: 'info@caterhub.com', subtext: 'Response time: 2 hours', href: 'mailto:info@caterhub.com' },
            { icon: '📱', label: 'Phone Support', contact: '+1 (234) 567-890', subtext: 'Available 24/7', href: 'tel:+1234567890' },
            { icon: '💬', label: 'Live Chat', contact: 'Start Chat', subtext: '🟢 Agents online', href: '#' },
          ].map((item) => (
            <div key={item.label}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                {item.icon} {item.label}
              </p>
              <a
                href={item.href}
                style={{
                  color: '#f97316',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  display: 'block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {item.contact}
              </a>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
                {item.subtext}
              </p>
            </div>
          ))}
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
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, flex: 1, minWidth: '200px' }}>
            © {currentYear} CaterHub. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Trust Badges:
            </span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { emoji: '🔒', title: 'SSL Secure' },
                { emoji: '✓', title: 'Privacy Certified' },
                { emoji: '⭐', title: '4.9/5 Trusted' },
              ].map((badge) => (
                <span key={badge.title} title={badge.title} style={{ fontSize: '1.25rem', cursor: 'help' }}>
                  {badge.emoji}
                </span>
              ))}
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

        @media (max-width: 1023px) {
          [style*="display: none"] {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          [style*="padding: 0 1rem"] {
            padding: 0 0.75rem !important;
          }
        }

        @media (max-width: 640px) {
          [style*="gap: 2rem"] {
            gap: 1rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
