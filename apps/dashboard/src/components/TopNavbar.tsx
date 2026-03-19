'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

// Heroicons
const BellIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const MagnifyingGlassIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0010.5 10.5z" />
  </svg>
);

const ChevronDownIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const Cog6ToothIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94m-.213 9.203c-.033.746.584 1.385 1.331 1.385.77 0 1.429-.646 1.429-1.429V12c0-.663.268-1.29.743-1.757m0 0a5.25 5.25 0 00-7.486 0m0 0c-.494.525-.995.827-1.497.827" />
  </svg>
);

const ArrowLeftOnRectangleIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [cateringVisible, setCateringVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hydration fix - load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('cateringShopVisible');
    if (saved !== null) {
      setCateringVisible(JSON.parse(saved));
    }
  }, []);

  const handleCateringToggle = () => {
    const newValue = !cateringVisible;
    setCateringVisible(newValue);
    localStorage.setItem('cateringShopVisible', JSON.stringify(newValue));
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent('cateringVisibilityChange', { detail: newValue })
    );
  };

  const handleLogout = () => {
    router.push('/auth/login');
  };

  const notifications = [
    { id: 1, message: 'New order received', time: '5 min ago', type: 'order' },
    { id: 2, message: 'User registration', time: '1 hour ago', type: 'user' },
    { id: 3, message: 'System update completed', time: '3 hours ago', type: 'system' },
  ];

  if (!mounted) return null;

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Left Side - Menu Toggle & Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flex: 1,
        }}
      >
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#64748b',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#667eea';
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Toggle sidebar"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
            maxWidth: '400px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '0 0.75rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <MagnifyingGlassIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search orders, customers..."
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              outline: 'none',
              padding: '0.5rem 0',
              color: '#1e293b',
            }}
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Catering Shop Toggle with Switch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            position: 'relative',
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          title="Toggle catering shop visibility"
        >
          {/* Label */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Catering Shop
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#94a3b8',
                fontWeight: 500,
              }}
            >
              {cateringVisible ? 'Currently Open' : 'Currently Closed'}
            </span>
          </div>

          {/* Toggle Switch */}
          <div
            onClick={handleCateringToggle}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: cateringVisible ? '#22c55e' : '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              boxShadow: cateringVisible
                ? '0 0 0 3px rgba(34, 197, 94, 0.1)'
                : 'none',
            }}
          >
            {/* Toggle Thumb */}
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                transform: cateringVisible ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </div>

          {/* Info Icon */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#e0e7ff',
              color: '#667eea',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'help',
              marginLeft: '4px',
            }}
            title="What does this do?"
          >
            ?
            
            {/* Tooltip */}
            {showTooltip && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  marginBottom: '0.75rem',
                  width: '280px',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  zIndex: 100,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  pointerEvents: 'none',
                  border: '1px solid #334155',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                  🍽️ Catering Shop Status
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Turn ON:</strong> Your catering services are visible to customers on the marketplace.
                </div>
                <div>
                  <strong>Turn OFF:</strong> Hide your services temporarily without losing your profile data.
                </div>
                
                {/* Tooltip Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '12px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#1e293b',
                    transform: 'rotate(45deg)',
                    border: '1px solid #334155',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '0.5rem',
              color: '#64748b',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
            title="Notifications"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#667eea';
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <BellIcon style={{ width: '24px', height: '24px' }} />
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid white',
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.75rem',
                width: '360px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                zIndex: 50,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#1e293b',
                }}
              >
                Notifications
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.map((notif, idx) => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '1rem',
                      borderBottom: idx < notifications.length - 1 ? '1px solid #f1f5f9' : 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#f8fafc')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: notif.type === 'order' ? '#dbeafe' : notif.type === 'user' ? '#fce7f3' : '#f3e8ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '1.25rem',
                        }}
                      >
                        {notif.type === 'order' ? '📋' : notif.type === 'user' ? '👥' : '⚙️'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: '#1e293b',
                            fontWeight: 500,
                          }}
                        >
                          {notif.message}
                        </p>
                        <p
                          style={{
                            margin: '0.25rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                          }}
                        >
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#764ba2')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#667eea')
                  }
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#f1f5f9')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              A
            </div>
            <ChevronDownIcon style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.75rem',
                width: '240px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                zIndex: 50,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              {/* User Info */}
              <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#1e293b',
                  }}
                >
                  Admin User
                </p>
                <p
                  style={{
                    margin: '0.25rem 0 0 0',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                  }}
                >
                  admin@catering.com
                </p>
              </div>

              {/* Menu Items */}
              <div style={{ borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => {
                    router.push('/settings');
                    setUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1e293b';
                  }}
                >
                  <Cog6ToothIcon style={{ width: '18px', height: '18px' }} />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    borderTop: '1px solid #e2e8f0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  <ArrowLeftOnRectangleIcon style={{ width: '18px', height: '18px' }} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
