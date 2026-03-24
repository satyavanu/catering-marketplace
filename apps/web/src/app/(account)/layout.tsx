'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CreditCardIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  SparklesIcon,
  ChevronLeftIcon,
  DocumentCheckIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect to signin if not authenticated
  if (status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px', color: '#64748b', fontWeight: '500' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const menu = [
    { name: 'Dashboard', icon: HomeIcon, color: 'from-blue-500 to-cyan-500', path: '/account' },
    { name: 'My Orders', icon: ClipboardDocumentListIcon, color: 'from-purple-500 to-pink-500', path: '/orders' },
    { name: 'My Quotes', icon: DocumentCheckIcon, color: 'from-green-500 to-emerald-500', path: '/myquotes' },
    { name: 'Saved', icon: HeartIcon, color: 'from-red-500 to-orange-500', path: '/saved-caterers' },
    { name: 'Messages', icon: ChatBubbleLeftRightIcon, color: 'from-yellow-500 to-amber-500', path: '/messages' },
    { name: 'Reviews', icon: StarIcon, color: 'from-indigo-500 to-purple-500', path: '/reviews' },
    { name: 'Payments', icon: CreditCardIcon, color: 'from-cyan-500 to-blue-500', path: '/payments' },
    { name: 'Profile', icon: UserCircleIcon, color: 'from-pink-500 to-rose-500', path: '/profile' },
  ];

  const breadcrumbs: { [key: string]: string[] } = {
    Dashboard: ['Home'],
    'My Orders': ['Home', 'Orders'],
    'My Quotes': ['Home', 'Quotes'],
    'Saved': ['Home', 'Saved'],
    'Event Planner': ['Home', 'Events'],
    Messages: ['Home', 'Messages'],
    Reviews: ['Home', 'Reviews'],
    Payments: ['Home', 'Payments'],
    Profile: ['Home', 'Settings'],
  };

  const handleMenuClick = (item: (typeof menu)[0]) => {
    setActiveMenu(item.name);
    router.push(item.path);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR - Desktop & Mobile */}
      <aside
        style={{
          position: isMobile && mobileMenuOpen ? 'fixed' : 'relative',
          left: 0,
          top: 0,
          width: isMobile ? (mobileMenuOpen ? '280px' : '0px') : sidebarOpen ? '280px' : '80px',
          backgroundColor: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: isMobile ? (mobileMenuOpen ? '24px 16px' : '0px') : '24px 16px',
          overflow: 'hidden',
          transition: isMobile ? 'width 0.3s ease, padding 0.3s ease' : 'all 0.3s ease',
          boxShadow: isMobile && mobileMenuOpen ? '0 20px 25px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.07)',
          height: isMobile && mobileMenuOpen ? '100vh' : '100vh',
          zIndex: isMobile ? (mobileMenuOpen ? 40 : -1) : 40,
          display: 'flex',
          flexDirection: 'column',
          overflowY: isMobile && mobileMenuOpen ? 'auto' : 'hidden',
        }}
      >
        {/* Logo & Brand */}
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e2e8f0',
            opacity: isMobile && !mobileMenuOpen ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            🍽️
          </div>
          {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
            <div>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                CateringHub
              </h1>
              <p
                style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  margin: '2px 0 0 0',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}
              >
                Your Events
              </p>
            </div>
          )}
          {isMobile && mobileMenuOpen ? (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                marginLeft: 'auto',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
              title="Close menu"
            >
              <XMarkIcon style={{ width: '24px', height: '24px' }} />
            </button>
          ) : !isMobile ? (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                marginLeft: sidebarOpen ? 'auto' : '0',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
              ) : (
                <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
              )}
            </button>
          ) : null}
        </div>

        {/* Navigation Menu */}
        <nav
          style={{
            flex: 1,
            overflow: isMobile && mobileMenuOpen ? 'auto' : 'hidden',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: (sidebarOpen || (isMobile && mobileMenuOpen)) ? 'flex-start' : 'center',
                gap: '12px',
                padding: (sidebarOpen || (isMobile && mobileMenuOpen)) ? '10px 12px' : '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeMenu === item.name ? '#f0f4ff' : 'transparent',
                borderLeft: activeMenu === item.name ? '4px solid #667eea' : '4px solid transparent',
                transition: 'all 0.2s ease',
                paddingLeft: activeMenu === item.name ? ((sidebarOpen || (isMobile && mobileMenuOpen)) ? '8px' : '10px') : (sidebarOpen || (isMobile && mobileMenuOpen)) ? '12px' : '10px',
                position: 'relative',
                minHeight: '40px',
                fontSize: '14px',
                opacity: isMobile && !mobileMenuOpen && !sidebarOpen ? 0 : 1,
              }}
              title={(!sidebarOpen && !isMobile) ? item.name : undefined}
              onMouseEnter={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon
                style={{
                  width: '18px',
                  height: '18px',
                  color: activeMenu === item.name ? '#667eea' : '#94a3b8',
                  transition: 'color 0.2s ease',
                  flexShrink: 0,
                }}
              />
              {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
                <>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: activeMenu === item.name ? '600' : '500',
                      color: activeMenu === item.name ? '#667eea' : '#475569',
                      transition: 'color 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name}
                  </span>
                  {activeMenu === item.name && (
                    <ChevronRightIcon
                      style={{
                        width: '14px',
                        height: '14px',
                        marginLeft: 'auto',
                        color: '#667eea',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Help Card */}
        <div
          style={{
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            padding: (sidebarOpen || (isMobile && mobileMenuOpen)) ? '14px' : '10px',
            color: 'white',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: (sidebarOpen || (isMobile && mobileMenuOpen)) ? 'flex-start' : 'center',
            transition: 'all 0.3s ease',
            flexShrink: 0,
            opacity: isMobile && !mobileMenuOpen && !sidebarOpen ? 0 : 1,
          }}
        >
          {(sidebarOpen || (isMobile && mobileMenuOpen)) ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <SparklesIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>Need Help?</p>
              </div>
              <p
                style={{
                  fontSize: '11px',
                  opacity: 0.9,
                  margin: 0,
                  lineHeight: '1.4',
                  marginBottom: '10px',
                }}
              >
                24/7 Support Available
              </p>
              <button
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Contact Support
              </button>
            </>
          ) : (
            <SparklesIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} title="Need Help?" />
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: (sidebarOpen || (isMobile && mobileMenuOpen)) ? 'flex-start' : 'center',
            gap: '12px',
            padding: (sidebarOpen || (isMobile && mobileMenuOpen)) ? '10px 12px' : '10px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '13px',
            fontWeight: '500',
            color: '#64748b',
            minHeight: '40px',
            flexShrink: 0,
            opacity: isMobile && !mobileMenuOpen && !sidebarOpen ? 0 : 1,
          }}
          title={(!sidebarOpen && !isMobile) ? 'Sign Out' : undefined}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
            e.currentTarget.style.color = '#dc2626';
            e.currentTarget.style.borderColor = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <ArrowLeftOnRectangleIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          {(sidebarOpen || (isMobile && mobileMenuOpen)) && 'Sign Out'}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '16px' : '24px 32px',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        {/* TOP BAR WITH HAMBURGER - Responsive */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '12px',
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                order: -1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }}
              title="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              ) : (
                <Bars3Icon style={{ width: '24px', height: '24px' }} />
              )}
            </button>
          )}

          {/* Breadcrumbs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '1 1 auto',
              minWidth: '150px',
              order: 1,
              overflowX: 'auto',
            }}
          >
            {breadcrumbs[activeMenu]?.map((crumb, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: idx === breadcrumbs[activeMenu].length - 1 ? '#667eea' : '#94a3b8',
                    fontSize: isMobile ? '12px' : '13px',
                    fontWeight: idx === breadcrumbs[activeMenu].length - 1 ? '600' : '500',
                    transition: 'all 0.2s ease',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (idx !== breadcrumbs[activeMenu].length - 1) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#667eea';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (idx !== breadcrumbs[activeMenu].length - 1) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  {crumb}
                </button>
                {idx < breadcrumbs[activeMenu].length - 1 && (
                  <ChevronRightIcon style={{ width: '16px', height: '16px', color: '#cbd5e1', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Search & Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1 1 auto',
              justifyContent: 'flex-end',
              order: 3,
              minWidth: isMobile ? '0' : '280px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
            {/* Search Bar - Hide on very small mobile */}
            {!isMobile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '10px',
                  paddingLeft: '14px',
                  paddingRight: '14px',
                  flex: '1 1 200px',
                  minWidth: '200px',
                  maxWidth: '280px',
                  backgroundColor: 'white',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  height: '40px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                }}
              >
                <MagnifyingGlassIcon
                  style={{ width: '18px', height: '18px', color: '#94a3b8', flexShrink: 0 }}
                />
                <input
                  placeholder="Search..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    color: '#1e293b',
                    minWidth: '0',
                  }}
                />
              </div>
            )}

            {/* Mobile Search Icon */}
            {isMobile && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </button>
            )}

            {/* Notifications */}
            <button
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <BellIcon style={{ width: '20px', height: '20px', color: '#64748b' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: '1.5px solid white',
                }}
              />
            </button>

            {/* User Profile - Mobile Responsive */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '6px' : '10px',
                paddingLeft: isMobile ? '8px' : '12px',
                paddingRight: isMobile ? '8px' : '12px',
                height: '40px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={session?.user?.image || 'https://i.pravatar.cc/40'}
                alt={session?.user?.name || 'User'}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '2px solid #e2e8f0',
                  flexShrink: 0,
                }}
              />
              {!isMobile && (
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1e293b',
                  }}
                >
                  {session?.user?.name?.split(' ')[0] || 'User'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            paddingRight: '8px',
          }}
        >
          {children}
        </div>
      </main>

      {/* Scrollbar styling & animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile menu smooth transition */
        @media (max-width: 1023px) {
          aside {
            box-shadow: ${mobileMenuOpen ? '0 20px 25px rgba(0, 0, 0, 0.15)' : 'none'};
          }
        }
      `}</style>
    </div>
  );
}