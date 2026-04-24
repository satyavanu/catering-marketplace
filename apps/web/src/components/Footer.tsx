'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSubscribeNewsletter } from '@catering-marketplace/query-client';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

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
        fontSize: '0.875rem',
        transition: 'color 0.3s',
        display: 'block',
        paddingBottom: '0.5rem',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
    >
      {label}
    </Link>
  );

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: 'white',
        paddingTop: '4rem',
        paddingBottom: '2rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main Grid: Logo + 4 Columns + Newsletter + Download */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Logo & Description */}
          <div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'white',
              }}
            >
              🍽️ Droooly
            </div>
            <p
              style={{
                color: '#cbd5e1',
                fontSize: '0.8rem',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              Your all-in-one platform to discover, book and manage catering, chefs and meal plans.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#f97316',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 1rem 0',
              }}
            >
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/about-us" label="About Us" />
              <FooterLink href="/how-it-works" label="How It Works" />
              <FooterLink href="/press-media" label="Press & Media" />
              <FooterLink href="/careers" label="Careers" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/contact" label="Contact Us" />
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#f97316',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 1rem 0',
              }}
            >
              For Customers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/browse-caterers" label="Browse Caterers" />
              <FooterLink href="/meal-plans" label="Meal Plans" />
              <FooterLink href="/personal-chefs" label="Personal Chefs" />
              <FooterLink href="/corporate-catering" label="Corporate Catering" />
              <FooterLink href="/wedding-catering" label="Wedding Catering" />
              <FooterLink href="/offers-deals" label="Offers & Deals" />
              <FooterLink href="/help-center" label="Help Center" />
              <FooterLink href="/track-order" label="Track Your Order" />
            </div>
          </div>

          {/* For Partners */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#f97316',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 1rem 0',
              }}
            >
              For Partners
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/partner-with-us" label="Partner With Us" />
              <FooterLink href="/become-caterer" label="Become a Caterer" />
              <FooterLink href="/become-chef" label="Become a Chef" />
              <FooterLink href="/gift-cards" label="Gift Cards" />
              <FooterLink href="/partner-login" label="Partner Login" />
              <FooterLink href="/resources" label="Resources" />
              <FooterLink href="/success-stories" label="Success Stories" />
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#f97316',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 1rem 0',
              }}
            >
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/terms-conditions" label="Terms & Conditions" />
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink href="/refund-cancellation" label="Refund & Cancellation" />
              <FooterLink href="/shipping-policy" label="Shipping Policy" />
              <FooterLink href="/cookies-policy" label="Cookies Policy" />
            </div>
          </div>

          {/* Newsletter + Download (Right Side) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Download */}
            <div>
              <h4
                style={{
                  fontWeight: '700',
                  marginBottom: '1rem',
                  color: '#f97316',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: '0 0 1rem 0',
                }}
              >
                Download Droooly
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href="https://apps.apple.com/app/id1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.9rem',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.4rem',
                    textDecoration: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    transition: 'all 0.3s',
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
                  <span style={{ fontSize: '1rem' }}>🍎</span>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                      Download on the
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                      App Store
                    </div>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.droooly.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.9rem',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.4rem',
                    textDecoration: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    transition: 'all 0.3s',
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
                  <span style={{ fontSize: '1rem' }}>▶️</span>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                      GET IT ON
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                      Google Play
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4
                style={{
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#f97316',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: '0 0 0.75rem 0',
                }}
              >
                Newsletter
              </h4>
              <p
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.75rem',
                  marginBottom: '0.75rem',
                  lineHeight: '1.4',
                  margin: '0 0 0.75rem 0',
                }}
              >
                Get exclusive deals, catering tips and updates delivered to your inbox weekly.
              </p>

              <form
                onSubmit={handleSubscribe}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.4rem',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '0.75rem',
                    outline: 'none',
                    transition: 'all 0.3s',
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
                    padding: '0.6rem 1rem',
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.4rem',
                    fontWeight: '700',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 0.3s',
                    opacity: isPending ? 0.7 : 1,
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
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #334155',
          }}
        >
          {/* Need Help */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#f97316', flexShrink: 0 }}>
              🎧
            </div>
            <div>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  margin: '0 0 0.5rem 0',
                }}
              >
                Need Help?
              </p>
              <a
                href="mailto:support@droooly.com"
                style={{
                  color: '#f97316',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  display: 'block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                support@droooly.com
              </a>
              <p
                style={{
                  color: '#64748b',
                  fontSize: '0.7rem',
                  margin: '0.25rem 0 0 0',
                }}
              >
                We're here to help you 24/7
              </p>
            </div>
          </div>

          {/* Call Us */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#f97316', flexShrink: 0 }}>
              ☎️
            </div>
            <div>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  margin: '0 0 0.5rem 0',
                }}
              >
                Call Us
              </p>
              <a
                href="tel:+912345678900"
                style={{
                  color: '#f97316',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  display: 'block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                +91 (234) 567-8900
              </a>
              <p
                style={{
                  color: '#64748b',
                  fontSize: '0.7rem',
                  margin: '0.25rem 0 0 0',
                }}
              >
                Mon - Sun: 8:00 AM - 10:00 PM
              </p>
            </div>
          </div>

          {/* Secure Payments */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#f97316', flexShrink: 0 }}>
              🛡️
            </div>
            <div>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  margin: '0 0 0.5rem 0',
                }}
              >
                100% Secure Payments
              </p>
              <p
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0.5rem 0',
                }}
              >
                Your transactions are safe and encrypted
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>💳</span>
                <span style={{ fontSize: '1rem' }}>🔴</span>
                <span style={{ fontSize: '1rem' }}>🔗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              color: '#64748b',
              fontSize: '0.8rem',
              margin: 0,
            }}
          >
            © {currentYear} Droooly. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span
              style={{
                color: '#94a3b8',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              Follow Us:
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: '👍', url: 'https://facebook.com/droooly' },
                { icon: '📷', url: 'https://instagram.com/droooly' },
                { icon: '𝕏', url: 'https://twitter.com/droooly' },
                { icon: '💼', url: 'https://linkedin.com/company/droooly' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
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
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          @supports (display: grid) {
            footer > div > div:first-of-type {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        }

        @media (max-width: 768px) {
          footer > div > div:first-of-type {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }

          footer > div > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }

          footer > div > div:last-of-type {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;