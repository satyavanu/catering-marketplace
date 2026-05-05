'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  HeartIcon,
  CheckBadgeIcon,
  MapPinIcon,
  ChevronDownIcon,
  SparklesIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { ChevronDown, Users, Utensils, ArrowRight, CheckCircle } from 'lucide-react';
import { handleLogout } from "@catering-marketplace/auth"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(AVAILABLE_CITIES[0]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('');
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const navLinks = [
    { label: 'Find Caterers', href: '/caterers' },
    { label: 'Meal Plans', href: '/meal-plans' },
    { label: 'Explore Chefs', href: '/explore-chefs' },
  ];

  const eventTypes = [
    { value: 'wedding', label: '💍 Wedding' },
    { value: 'corporate', label: '🏢 Corporate Event' },
    { value: 'birthday', label: '🎂 Birthday Party' },
    { value: 'anniversary', label: '💕 Anniversary' },
    { value: 'engagement', label: '💎 Engagement' },
    { value: 'conference', label: '📋 Conference' },
  ];

  const guestCounts = [
    { value: '10-25', label: '10-25 guests' },
    { value: '25-50', label: '25-50 guests' },
    { value: '50-100', label: '50-100 guests' },
    { value: '100-200', label: '100-200 guests' },
    { value: '200-500', label: '200-500 guests' },
    { value: '500+', label: '500+ guests' },
  ];

  const locations = [
    { value: 'bangalore', label: '🏙️ Bangalore' },
    { value: 'delhi', label: '🏛️ Delhi' },
    { value: 'hyderabad', label: '🌆 Hyderabad' },
    { value: 'mumbai', label: '🌃 Mumbai' },
    { value: 'pune', label: '🏞️ Pune' },
    { value: 'kolkata', label: '🎭 Kolkata' },
  ];

  const pathname = usePathname();
   const isHome = pathname === "/"

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

  if (isHome) return null;

  const filteredCities = AVAILABLE_CITIES.filter(city =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
    setCitySearchQuery('');
  };

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && eventType && guestCount) {
      const searchParams = new URLSearchParams({
        location,
        eventType,
        guestCount,
      });
      window.location.href = `/search?${searchParams.toString()}`;
    }
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = isLinkActive(href);

    return (
      <Link
        href={href}
        style={{
          fontSize: '15px',
          fontWeight: '500',
          color: 'white',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          padding: '8px 16px',
          borderRadius: '6px',
          display: 'inline-block',
          position: 'relative',
          letterSpacing: '0.3px',
          backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          borderBottom: active ? '2px solid white' : '2px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {label}
      </Link>
    );
  };

  const CityButton = ({ isMobile = false }: { isMobile?: boolean }) => (
    <button
      onClick={() => setIsCityModalOpen(true)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: isMobile ? 'white' : 'rgba(255, 255, 255, 0.12)',
        border: isMobile ? '1px solid #e2e8f0' : 'none',
        cursor: 'pointer',
        padding: isMobile ? '6px 12px' : '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        fontSize: isMobile ? '13px' : '14px',
        fontWeight: '500',
        color: isMobile ? '#475569' : 'white',
        whiteSpace: 'nowrap',
        backdropFilter: isMobile ? 'none' : 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        }
      }}
    >
      <MapPinIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
      <span>{selectedCity?.emoji} {selectedCity?.name}</span>
      <ChevronDownIcon style={{ width: '14px', height: '14px', flexShrink: 0, opacity: 0.7 }} />
    </button>
  );

  const CityModal = () => (
    <>
      <div
        onClick={() => setIsCityModalOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out',
          backdropFilter: 'blur(4px)',
        }}
      />

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
        <div
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: 0 }}>
              Select Your City
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', margin: '6px 0 0 0' }}>
              Choose your delivery location
            </p>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <XMarkIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

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
              height: '40px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
            }}
          >
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
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
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCity?.id !== city.id) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                >
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{city.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      {city.name}
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                      {city.state}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
                No cities found
              </p>
            </div>
          )}
        </div>

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
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: '600' }}>Selected</p>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>
                {selectedCity.emoji} {selectedCity.name}
              </p>
            </div>
            <button
              onClick={() => setIsCityModalOpen(false)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </>
  );

  const ProfileDropdown = ({ isMobile = false }) => (
    <div ref={profileMenuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.12)',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backdropFilter: isMobile ? 'none' : 'blur(10px)',
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
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
            border: isMobile ? '2px solid #e2e8f0' : '2px solid rgba(255, 255, 255, 0.3)',
          }}
        />
        {!isMobile && (
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'white', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {session?.user?.name?.split(' ')[0]}
          </span>
        )}
      </button>

      {isProfileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            minWidth: '220px',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease-out',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            }}
          >
            <img
              src={
                session?.user?.image ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`
              }
              alt={session?.user?.name || 'User'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #667eea' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session?.user?.name}
                </p>
                {session?.user?.isOnboardingCompleted && (
                  <CheckBadgeIcon style={{ width: '16px', height: '16px', color: '#3b82f6', flexShrink: 0 }} />
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.user?.email}
              </p>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Link
              href={session?.user?.role === 'caterer' ? '/caterer/dashboard' : '/customer/dashboard'}
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
              <UserCircleIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
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
              <Cog6ToothIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
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
                <HeartIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                Saved Caterers
              </Link>
            )}
          </nav>

          <div style={{ borderTop: '1px solid #e2e8f0' }} />

          <button
            onClick={() => {
              handleLogout();
              setIsProfileMenuOpen(false);
            }}
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowRightOnRectangleIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url('/catering-hero.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        borderBottom: 'none',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
        position: 'relative',
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
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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

        @media (min-width: 1024px) {
          .desktop-logo {
            display: flex !important;
          }

          .desktop-nav {
            display: flex !important;
            align-items: center;
            gap: 4px;
            flex: 1;
          }

          .desktop-actions {
            display: flex !important;
            align-items: center;
            gap: 16px;
            flex-shrink: 0;
          }

          .mobile-header {
            display: none !important;
          }

          .mobile-menu {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .desktop-logo {
            display: none !important;
          }

          .desktop-nav {
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
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
            padding: 16px 0;
            animation: slideDown 0.3s ease-out;
            max-height: 80vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 767px) {
          .mobile-logo span {
            display: none;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Top Navigation Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'auto',
            padding: '12px 0',
            gap: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Desktop Logo */}
          <Link
            href="/"
            className="desktop-logo"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Droooly"
              style={{
                minHeight: '110px',
                height: '110px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-actions">
            <CityButton />
            <Link
              href="/become-a-caterer"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <SparklesIcon style={{ width: '16px', height: '16px' }} />
              Partner
            </Link>

            {status === 'authenticated' ? (
              <ProfileDropdown />
            ) : status === 'loading' ? (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            ) : (
              <Link
                href="/login"
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#667eea',
                  textDecoration: 'none',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease',
                  display: 'inline-block',
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Header */}
          <div className="mobile-header">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '40px',
                height: '40px',
                flexShrink: 0,
                backdropFilter: 'blur(10px)',
              }}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              ) : (
                <Bars3Icon style={{ width: '24px', height: '24px' }} />
              )}
            </button>

            <Link
              href="/"
              className="mobile-logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                flex: 1,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="/logo.png"
                alt="Droooly"
                style={{
                  minHeight: '48px',
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </Link>

            <CityButton isMobile={true} />

            {status === 'authenticated' && <ProfileDropdown isMobile={true} />}

            {status !== 'authenticated' && status !== 'loading' && (
              <Link
                href="/login"
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#667eea',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease',
                  display: 'inline-block',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        </div>

        {/* Hero Section with Search Form */}
        {isHome ?? (<>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
            paddingBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
            minHeight: 'auto',
          }}
        >
          {/* Main Hero Title & Description */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', maxWidth: '800px', animation: 'fadeIn 0.8s ease-in' }}>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                fontWeight: '800',
                marginBottom: '0.75rem',
                marginTop: 0,
                lineHeight: '1.2',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                letterSpacing: '-0.02em',
                color: 'white',
              }}
            >
              Plan Your Perfect Event in Seconds
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.6',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              Find the best caterers for your event — fast, simple, and reliable.
            </p>
          </div>

          {/* Search Form Card */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '1.25rem',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              maxWidth: '900px',
              width: '100%',
              backdropFilter: 'blur(10px)',
            }}
          >
            <form onSubmit={handleSearch}>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 1rem 0',
                }}
              >
                Search Fields
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                {/* Location Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <MapPinIcon style={{ width: '16px', height: '16px' }} />
                    Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 0.875rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: location ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>

                {/* Event Type Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <Utensils size={16} />
                    Event Type
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 0.875rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: eventType ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>

                {/* Guest Count Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <Users size={16} />
                    Number of Guests
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 0.875rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: guestCount ? '#111827' : '#9ca3af',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        appearance: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                    >
                      <option value="">Select Guest Count</option>
                      {guestCounts.map((count) => (
                        <option key={count.value} value={count.value}>
                          {count.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={!location || !eventType || !guestCount}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '700',
                  cursor: !location || !eventType || !guestCount ? 'not-allowed' : 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  opacity: !location || !eventType || !guestCount ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (location && eventType && guestCount) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Find Caterers
                <ArrowRight size={20} />
              </button>

              {/* Trust Badges */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 'clamp(0.75rem, 2vw, 1rem)',
                  paddingTop: '0.875rem',
                  marginTop: '0.875rem',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.75rem',
                    color: '#666',
                  }}
                >
                  <CheckCircle size={14} color="#10b981" />
                  <span>No hidden costs</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.75rem',
                    color: '#666',
                  }}
                >
                  <CheckCircle size={14} color="#10b981" />
                  <span>Verified caterers</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.75rem',
                    color: '#666',
                  }}
                >
                  <CheckCircle size={14} color="#10b981" />
                  <span>Instant quotes</span>
                </div>
              </div>
            </form>
          </div>
        </div>
        </>)}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                paddingBottom: '8px',
              }}
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 20px',
                      borderRadius: '0',
                      transition: 'all 0.2s ease',
                      borderLeft: active ? '3px solid white' : '3px solid transparent',
                      display: 'block',
                      letterSpacing: '0.3px',
                      backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.borderLeftColor = 'rgba(255, 255, 255, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderLeftColor = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {status === 'authenticated' ? (
                <>
                  <Link
                    href={session?.user?.role === 'caterer' ? '/caterer/dashboard' : '/customer/dashboard'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/become-a-caterer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    Become Partner
                  </Link>

                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await signOut({ callbackUrl: '/' });
                    }}
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'white',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(220, 38, 38, 0.8)',
                      border: '1px solid rgba(220, 38, 38, 1)',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                      width: '100%',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/become-a-caterer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    Become Partner
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#667eea',
                      textDecoration: 'none',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      cursor: 'pointer',
                      textAlign: 'center',
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

      {isCityModalOpen && <CityModal />}
    </header>
  );
};

export default Header;