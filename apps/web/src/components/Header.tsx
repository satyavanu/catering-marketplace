'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  HeartIcon,
  CheckBadgeIcon,
  MapPinIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { handleLogout } from "@catering-marketplace/auth"

// Mock city data - Replace with actual DB call
const AVAILABLE_CITIES = [
  { id: 1, name: 'Mumbai', slug: 'mumbai', emoji: '🌊', state: 'Maharashtra', vendors: 45 },
  { id: 2, name: 'Delhi', slug: 'delhi', emoji: '🏛️', state: 'Delhi', vendors: 52 },
  { id: 3, name: 'Bangalore', slug: 'bangalore', emoji: '🏙️', state: 'Karnataka', vendors: 38 },
  { id: 4, name: 'Hyderabad', slug: 'hyderabad', emoji: '🏞️', state: 'Telangana', vendors: 32 },
  { id: 5, name: 'Pune', slug: 'pune', emoji: '⛰️', state: 'Maharashtra', vendors: 28 },
  { id: 6, name: 'Chennai', slug: 'chennai', emoji: '🌴', state: 'Tamil Nadu', vendors: 25 },
  { id: 7, name: 'Kolkata', slug: 'kolkata', emoji: '🎭', state: 'West Bengal', vendors: 22 },
  { id: 8, name: 'Ahmedabad', slug: 'ahmedabad', emoji: '🕌', state: 'Gujarat', vendors: 18 },
  { id: 9, name: 'Jaipur', slug: 'jaipur', emoji: '🏰', state: 'Rajasthan', vendors: 15 },
  { id: 10, name: 'Chandigarh', slug: 'chandigarh', emoji: '🌃', state: 'Chandigarh', vendors: 12 },
];

interface City {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  state: string;
  vendors: number;
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(AVAILABLE_CITIES[0]); // Default to Mumbai
  const [citySearchQuery, setCitySearchQuery] = useState('');
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const cityButtonRef = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Caterers', href: '/caterers' },
    { label: 'Meal Plans', href: '/meal-plans' },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Filter cities based on search
  const filteredCities = AVAILABLE_CITIES.filter(city =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
    setCitySearchQuery('');
    // TODO: Update URL or trigger city change in parent component
    // router.push(`?city=${city.slug}`);
  };

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

  const CityButton = ({ isMobile = false }: { isMobile?: boolean }) => (
    <button
      ref={cityButtonRef}
      onClick={() => setIsCityModalOpen(true)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'transparent',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        padding: isMobile ? '6px 10px' : '8px 12px',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        fontSize: isMobile ? '12px' : '13px',
        fontWeight: '500',
        color: '#475569',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }
      }}
    >
      <MapPinIcon style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px', flexShrink: 0 }} />
      <span>{selectedCity?.emoji} {selectedCity?.name}</span>
      <ChevronDownIcon
        style={{
          width: '14px',
          height: '14px',
          flexShrink: 0,
        }}
      />
    </button>
  );

  const CityModal = () => (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsCityModalOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
              📍 Select Your City
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0 0 0' }}>
              Choose where you want to order from
            </p>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#1e293b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <XMarkIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              paddingLeft: '12px',
              paddingRight: '12px',
              height: '44px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
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
              placeholder="Search city or state..."
              value={citySearchQuery}
              onChange={(e) => setCitySearchQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: '#1e293b',
              }}
            />
          </div>
        </div>

        {/* Cities List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 24px',
          }}
        >
          {filteredCities.length > 0 ? (
            <div style={{ display: 'grid', gap: '8px', paddingBottom: '16px' }}>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityChange(city)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    backgroundColor: selectedCity?.id === city.id ? '#ede9fe' : '#f8fafc',
                    border: selectedCity?.id === city.id ? '2px solid #667eea' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCity?.id !== city.id) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCity?.id !== city.id) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{city.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: selectedCity?.id === city.id ? '700' : '600',
                        color: selectedCity?.id === city.id ? '#667eea' : '#1e293b',
                      }}
                    >
                      {city.name}
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '12px',
                        color: '#94a3b8',
                      }}
                    >
                      {city.state} • {city.vendors} vendors available
                    </p>
                  </div>
                  {selectedCity?.id === city.id && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#667eea',
                        flexShrink: 0,
                        boxShadow: '0 0 8px rgba(102, 126, 234, 0.5)',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
                No cities found
              </p>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0' }}>
                Try searching by city name or state
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {selectedCity && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: '600' }}>
                Selected
              </p>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>
                {selectedCity.emoji} {selectedCity.name}, {selectedCity.state}
              </p>
            </div>
            <button
              onClick={() => setIsCityModalOpen(false)}
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#764ba2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </>
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

  const ProfileDropdown = ({ isMobile = false }) => (
    <div
      ref={profileMenuRef}
      style={{
        position: 'relative',
      }}
    >
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <img
          src={
            session?.user?.image ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`
          }
          alt={session?.user?.name || 'User'}
          style={{
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
          }}
        />
        {!isMobile && (
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1e293b',
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session?.user?.name?.split(' ')[0]}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isProfileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            minWidth: '220px',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease-out',
            pointerEvents: 'auto',
          }}
        >
          {/* User Info */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src={
                session?.user?.image ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`
              }
              alt={session?.user?.name || 'User'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #e2e8f0',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {session?.user?.name}
                </p>
                {session?.user?.isOnboardingCompleted && (
                  <CheckBadgeIcon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: '#3b82f6',
                      flexShrink: 0,
                    }}
                    title="Verified"
                  />
                )}
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  margin: '2px 0 0 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {session?.user?.email}
              </p>
              {session?.user?.role && (
                <p
                  style={{
                    fontSize: '11px',
                    color: '#667eea',
                    margin: '2px 0 0 0',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}
                >
                  {session.user.role}
                </p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <Link
              href={
                session?.user?.role === 'caterer'
                  ? '/caterer/dashboard'
                  : '/customer/dashboard'
              }
              onClick={() => setIsProfileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                color: '#475569',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <UserCircleIcon
                style={{ width: '16px', height: '16px', flexShrink: 0 }}
              />
              Dashboard
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsProfileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                color: '#475569',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <Cog6ToothIcon
                style={{ width: '16px', height: '16px', flexShrink: 0 }}
              />
              Settings
            </Link>

            {session?.user?.role === 'customer' && (
              <Link
                href="/saved-caterers"
                onClick={() => setIsProfileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                <HeartIcon
                  style={{ width: '16px', height: '16px', flexShrink: 0 }}
                />
                Saved Caterers
              </Link>
            )}
          </nav>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e2e8f0' }} />

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              backgroundColor: 'transparent',
              color: '#dc2626',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowRightOnRectangleIcon
              style={{ width: '16px', height: '16px', flexShrink: 0 }}
            />
            Sign Out
          </button>
        </div>
      )}
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .desktop-logo {
          display: none;
        }

        .mobile-logo {
          display: none;
        }

        .desktop-nav {
          display: none;
        }

        .desktop-actions {
          display: none;
        }

        .mobile-header {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        /* Desktop - iPad and above (1024px+) */
        @media (min-width: 1024px) {
          .desktop-logo {
            display: flex !important;
          }

          .mobile-logo {
            display: none !important;
          }

          .desktop-nav {
            display: flex !important;
            align-items: center;
            gap: 32px;
            flex: 1;
          }

          .desktop-search {
            display: flex !important;
          }

          .desktop-actions {
            display: flex !important;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
          }

          .mobile-header {
            display: none !important;
          }

          .mobile-menu {
            display: none !important;
          }
        }

        /* Tablet/Mobile - Below iPad resolution (< 1024px) */
        @media (max-width: 1023px) {
          .desktop-logo {
            display: none !important;
          }

          .mobile-logo {
            display: flex !important;
          }

          .desktop-nav {
            display: none !important;
          }

          .desktop-search {
            display: none !important;
          }

          .desktop-actions {
            display: none !important;
          }

          .mobile-header {
            display: flex !important;
            align-items: center;
            gap: 8px;
            flex: 1;
            justify-content: space-between;
          }

          .mobile-menu {
            display: block !important;
            border-top: 1px solid #e2e8f0;
            background-color: #f8fafc;
            padding: 0 0 16px 0;
            animation: slideDown 0.3s ease-out;
            max-height: 80vh;
            overflow-y: auto;
          }
        }

        /* Extra small screens - iPad mini and below (< 768px) */
        @media (max-width: 767px) {
          .mobile-header {
            gap: 6px;
          }
        }

        /* Very small phones (< 380px) */
        @media (max-width: 379px) {
          .mobile-logo span {
            display: none;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {/* Main Header Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'auto',
            padding: '0px 0',
            gap: '16px',
          }}
        >
          {/* Desktop Logo */}
          <Link
            href="/"
            className="desktop-logo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Droooly"
              style={{
                height: '100px',
                width: 'auto',
              }}
            />
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* City Selector - Desktop (between nav and search) */}
          <div className="desktop-actions" style={{ gap: '8px', flex: 'initial' }}>
            <CityButton />
          </div>

          {/* Right Actions - Desktop Only */}
          <div className="desktop-actions" style={{ gap: '12px' }}>
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/become-a-caterer"
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
                <ProfileDropdown />
              </>
            ) : status === 'loading' ? (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Header - Hamburger First, Then Logo, City + Avatar on Right */}
          <div className="mobile-header">
            {/* Hamburger Menu Button */}
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
                flexShrink: 0,
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

            {/* Mobile Logo */}
            <Link
              href="/"
              className="mobile-logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                flex: 1,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                🍽️
              </div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                }}
              >
                CaterHub
              </span>
            </Link>

            {/* City Selector - Mobile */}
            <CityButton isMobile={true} />

            {/* Avatar on Right - Always visible when authenticated */}
            {status === 'authenticated' && <ProfileDropdown isMobile={true} />}

            {/* Unauthenticated User - Show Login Button */}
            {status !== 'authenticated' && status !== 'loading' && (
              <Link
                href="/login"
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#667eea',
                  transition: 'all 0.2s ease',
                  display: 'inline-block',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
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
            )}

            {status === 'loading' && (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu - Navigation + City + Actions */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {/* City Selector - Mobile Menu Full Width */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#475569', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                📍 Service Area
              </p>
              <CityButton isMobile={true} />
            </div>

            {/* Navigation Links */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                paddingTop: '12px',
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
              {status === 'authenticated' ? (
                <>
                  <Link
                    href={
                      session?.user?.role === 'caterer'
                        ? '/caterer/dashboard'
                        : '/customer/dashboard'
                    }
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
                    Dashboard
                  </Link>

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

                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await signOut({ callbackUrl: '/' });
                    }}
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#dc2626',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* City Modal */}
      {isCityModalOpen && <CityModal />}
    </header>
  );
};

export default Header;