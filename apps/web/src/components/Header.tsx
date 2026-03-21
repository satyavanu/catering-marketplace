'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', href: '/' },
    { label: 'Catering', href: '/catering' },
    { label: 'Venues', href: '/venues' },
    { label: 'Decorations', href: '/decorations' },
    { label: 'Experiences', href: '/experiences' },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#64748b',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        padding: '6px 12px',
        borderRadius: '6px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#667eea';
        e.currentTarget.style.backgroundColor = '#f0f4ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#64748b';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {label}
    </Link>
  );

  const SearchBar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        paddingLeft: '14px',
        paddingRight: '14px',
        height: '40px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        flex: isMobile ? 1 : 'initial',
        minWidth: isMobile ? 'auto' : '200px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#667eea';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <MagnifyingGlassIcon
        style={{
          width: '18px',
          height: '18px',
          color: '#94a3b8',
          flexShrink: 0,
        }}
      />
      <input
        type="text"
        placeholder={isMobile ? 'Search...' : 'Search services...'}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: '13px',
          color: '#1e293b',
        }}
      />
    </div>
  );

  return (
    <header
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {/* Desktop Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            gap: '16px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              🍽️
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b',
                whiteSpace: 'nowrap',
              }}
            >
              CaterHub
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <div className="desktop-search">
            <SearchBar isMobile={false} />
          </div>

          {/* Right Actions - Desktop Only */}
          <div className="desktop-actions">
            <Link
              href="/become-caterer"
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#667eea',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #667eea',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Become a Partner
            </Link>

            <Link
              href="/login"
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '6px',
                backgroundColor: '#667eea',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#764ba2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
              }}
            >
              Login
            </Link>
          </div>

          {/* Mobile Header - Logo + Search + Hamburger */}
          <div className="mobile-header">
            <SearchBar isMobile={true} />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                color: '#1e293b',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '40px',
                height: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              ) : (
                <Bars3Icon style={{ width: '24px', height: '24px' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Navigation + Actions */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {/* Navigation Links */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: '0',
                    transition: 'all 0.2s ease',
                    borderLeft: '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.backgroundColor = '#f0f4ff';
                    e.currentTarget.style.borderLeftColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Action Buttons */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <Link
                href="/become-caterer"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#667eea',
                  textDecoration: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1px solid #667eea',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'block',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f4ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Become a Partner
              </Link>

              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#667eea',
                  transition: 'all 0.2s ease',
                  display: 'block',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#764ba2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                }}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Desktop - iPad and above (1024px+) */
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex;
            align-items: center;
            gap: 32px;
            flex: 1;
          }

          .desktop-search {
            display: flex;
          }

          .desktop-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
          }

          .mobile-header {
            display: none;
          }

          .mobile-menu {
            display: none;
          }
        }

        /* Tablet/Mobile - Below iPad resolution (< 1024px) */
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none;
          }

          .desktop-search {
            display: none;
          }

          .desktop-actions {
            display: none;
          }

          .mobile-header {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
          }

          .mobile-menu {
            display: block;
            border-top: 1px solid #e2e8f0;
            background-color: #f8fafc;
            padding: 16px 0;
            animation: slideDown 0.3s ease-out;
          }
        }

        /* Extra small screens - iPad mini and below (< 768px) */
        @media (max-width: 767px) {
          header div {
            padding: 0 12px;
          }
        }

        /* Small phones (< 640px) */
        @media (max-width: 639px) {
          header span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;