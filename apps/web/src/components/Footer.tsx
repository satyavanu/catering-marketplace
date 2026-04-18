'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSubscribeNewsletter } from '@catering-marketplace/query-client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expandedMobileSection, setExpandedMobileSection] = useState<
    string | null
  >(null);
  const [email, setEmail] = useState('');
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribe({ email });
      setEmail('');
    }
  };

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSection(
      expandedMobileSection === section ? null : section
    );
  };

  const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      style={{
        color: '#cbd5e1',
        textDecoration: 'none',
        transition: 'all 0.3s',
        fontSize: '0.875rem',
        display: 'block',
        paddingBottom: '0.5rem',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
    >
      {label}
    </Link>
  );

  const MobileCollapsibleSection = ({
    title,
    sectionId,
    children,
  }: {
    title: string;
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
        <span>{title}</span>
        <ChevronDownIcon
          style={{
            width: '20px',
            height: '20px',
            transition: 'transform 0.3s ease',
            transform:
              expandedMobileSection === sectionId
                ? 'rotate(180deg)'
                : 'rotate(0)',
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
        {/* Top Section: Apps & Newsletter */}
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
            overflow: 'hidden',
          }}
        >
          {/* Download Apps */}
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#f97316',
              }}
            >
              Download Droooly
            </h3>
            <p
              style={{
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.6',
              }}
            >
              Book your perfect catering experience on the go. Available on iOS
              and Android.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <a
                href="https://apps.apple.com/app/id1234567890"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  opacity: 1,
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  alt="Download on the App Store"
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  height="60"
                  style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                />
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.droooly.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  opacity: 1,
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  alt="Get it on Google Play"
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  height="60"
                />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#f97316',
              }}
            >
              Newsletter
            </h3>
            <p
              style={{
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.6',
              }}
            >
              Get exclusive deals, catering tips, and updates delivered to your
              inbox weekly.
            </p>

            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: '100%',
              }}
            >
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
                  width: '100%',
                  boxSizing: 'border-box',
                  minWidth: 0,
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
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  opacity: isPending ? 0.7 : 1,
                  minWidth: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.backgroundColor = '#ea580c';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f97316';
                }}
              >
                {isPending ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p
              style={{
                color: '#64748b',
                fontSize: '0.75rem',
                margin: '0.75rem 0 0 0',
              }}
            >
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Desktop: Main Footer Content (4 Columns) */}
        <div
          style={
            {
              display: 'none',
              '@media (min-width: 1024px)': {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '3rem',
                marginBottom: '3rem',
              },
            } as any
          }
        >
          {/* Company */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/about-us" label="About Us" />
              <FooterLink href="/careers" label="Careers" />
              <FooterLink href="/contact" label="Contact" />
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              For Customers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/caterers" label="Find Caterers" />
              <FooterLink href="/meal-plans" label="Meal Plans" />
              <FooterLink href="/help" label="Help Center" />
            </div>
          </div>

          {/* For Partners */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              For Partners
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/become-partner" label="Become a Partner" />
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink href="/terms-and-conditions" label="Terms & Conditions" />
              <FooterLink href="/refund-policy" label="Refund Policy" />
            </div>
          </div>
        </div>

        {/* Mobile: Collapsible Sections */}
        <div
          style={
            {
              display: 'block',
              '@media (min-width: 1024px)': {
                display: 'none',
              },
              borderTop: '1px solid #334155',
              paddingTop: '2rem',
              marginBottom: '2rem',
            } as any
          }
        >
          <MobileCollapsibleSection title="Company" sectionId="company">
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Link
                href="/about-us"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                  borderBottom: '1px solid #334155',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                About Us
              </Link>
              <Link
                href="/careers"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                  borderBottom: '1px solid #334155',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Careers
              </Link>
              <Link
                href="/contact"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Contact
              </Link>
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="For Customers" sectionId="customers">
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Link
                href="/caterers"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                  borderBottom: '1px solid #334155',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Find Caterers
              </Link>
              <Link
                href="/meal-plans"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                  borderBottom: '1px solid #334155',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Meal Plans
              </Link>
              <Link
                href="/help"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Help Center
              </Link>
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="For Partners" sectionId="partners">
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Link
                href="/become-partner"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Become a Partner
              </Link>
            </div>
          </MobileCollapsibleSection>

          <MobileCollapsibleSection title="Legal" sectionId="legal">
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Link
                href="/privacy-policy"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                  borderBottom: '1px solid #334155',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                  borderBottom: '1px solid #334155',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Terms & Conditions
              </Link>
              <Link
                href="/refund-policy"
                onClick={() => setExpandedMobileSection(null)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  padding: '8px 0',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#f97316')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = '#cbd5e1')
                }
              >
                Refund Policy
              </Link>
            </div>
          </MobileCollapsibleSection>
        </div>

        {/* Social Media Section */}
        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.75rem',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              fontWeight: '700',
              letterSpacing: '0.05em',
            }}
          >
            Follow Us
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                name: 'Facebook',
                icon: 'f',
                url: 'https://facebook.com/droooly',
              },
              {
                name: 'Instagram',
                icon: '',
                url: 'https://instagram.com/droooly',
              },
              {
                name: 'LinkedIn',
                icon: 'in',
                url: 'https://linkedin.com/company/droooly',
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f97316';
                  e.currentTarget.style.backgroundColor = '#334155';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                {social.name === 'Facebook' && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                {social.name === 'Instagram' && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.917c-3.881 5.006-10.785 5.529-13.949 2.247-3.581 2.973-10.771 1.649-13.822-1.986.694 1.547 1.862 2.9 3.439 3.872 2.502 1.434 5.536 1.903 8.556 1.034 3.862 1.215 7.961-.857 10.777-4.167z" />
                  </svg>
                )}
                {social.name === 'LinkedIn' && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
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
            {
              label: 'Email Support',
              contact: 'info@droooly.com',
              subtext: 'Response time: 2 hours',
              href: 'mailto:info@droooly.com',
            },
            {
              label: 'Phone Support',
              contact: '+1 (234) 567-890',
              subtext: 'Available 24/7',
              href: 'tel:+1234567890',
            },
            {
              label: 'Live Chat',
              contact: 'Start Chat',
              subtext: 'Agents online',
              href: '#',
            },
          ].map((item) => (
            <div key={item.label}>
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
                {item.label}
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
              <p
                style={{
                  color: '#64748b',
                  fontSize: '0.75rem',
                  margin: '0.5rem 0 0 0',
                }}
              >
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
          <p
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              margin: 0,
              flex: 1,
              minWidth: '200px',
            }}
          >
            © {currentYear} Droooly. All rights reserved.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Security & Trust:
            </span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {[
                { symbol: '🔒', title: 'SSL Secure' },
                { symbol: '✓', title: 'Privacy Protected' },
                { symbol: '⭐', title: 'Trusted Platform' },
              ].map((badge) => (
                <span
                  key={badge.title}
                  title={badge.title}
                  style={{
                    fontSize: '1rem',
                    cursor: 'help',
                    opacity: 0.7,
                  }}
                >
                  {badge.symbol}
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