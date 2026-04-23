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
  GiftIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  SwapIcon,
} from '@heroicons/react/24/outline';
import { handleLogout } from "@catering-marketplace/auth"

interface MenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  path: string;
  badge?: string;
}

type UserRole = 'customer' | 'caterer' | 'admin';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('caterer');
  const [displayRole, setDisplayRole] = useState<'customer' | 'caterer'>('caterer');

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

  // Set user role from session
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any)?.role || 'caterer';
      setUserRole(role as UserRole);
      // Set display role to the actual role initially
      if (role === 'customer' || role === 'caterer') {
        setDisplayRole(role as 'customer' | 'caterer');
      }
    }
  }, [session]);

  // Handle role switch
  const handleRoleSwitch = (newRole: 'customer' | 'caterer') => {
    setDisplayRole(newRole);
    setActiveMenu('Dashboard');
    
    // Navigate to the appropriate dashboard
    if (newRole === 'customer') {
      router.push('/customer/dashboard');
    } else {
      router.push('/caterer/dashboard');
    }
    
    // Close mobile menu after navigation
    setMobileMenuOpen(false);
  };

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

  // Menu configuration based on role
  const getMenuByRole = (): MenuItem[] => {
    const baseMenu: { [key in UserRole]: MenuItem[] } = {
      customer: [
        { name: 'Dashboard', icon: HomeIcon, color: 'from-blue-500 to-cyan-500', path: '/customer/dashboard' },
        { name: 'My Quotes', icon: DocumentCheckIcon, color: 'from-green-500 to-emerald-500', path: '/customer/quotes' },
        { name: 'My Subscriptions', icon: SparklesIcon, color: 'from-orange-500 to-yellow-500', path: '/customer/subscriptions', badge: 'New' },
        { name: 'My Orders', icon: ClipboardDocumentListIcon, color: 'from-purple-500 to-pink-500', path: '/customer/orders' },
        { name: 'Saved', icon: HeartIcon, color: 'from-red-500 to-pink-500', path: '/customer/saved' },
        { name: 'Profile', icon: UserCircleIcon, color: 'from-pink-500 to-rose-500', path: '/profile' },
      ],
      caterer: [
        { name: 'Dashboard', icon: HomeIcon, color: 'from-blue-500 to-cyan-500', path: '/caterer/dashboard' },
        { name: 'Requests', icon: DocumentCheckIcon, color: 'from-green-500 to-emerald-500', path: '/caterer/requests', badge: '3' },
        { name: 'Orders', icon: ClipboardDocumentListIcon, color: 'from-purple-500 to-pink-500', path: '/caterer/orders' },
        { name: 'Packages', icon: GiftIcon, color: 'from-rose-500 to-pink-500', path: '/caterer/packages' },
        { name: 'Plans', icon: SparklesIcon, color: 'from-orange-500 to-yellow-500', path: '/caterer/plans' },
        { name: 'Calendar', icon: CalendarDaysIcon, color: 'from-yellow-500 to-amber-500', path: '/caterer/calendar' },
        { name: 'Profile', icon: UserCircleIcon, color: 'from-pink-500 to-rose-500', path: '/profile' },
      ],
      admin: [
        { name: 'Dashboard', icon: HomeIcon, color: 'from-blue-500 to-cyan-500', path: '/admin/dashboard' },
        { name: 'Caterers', icon: BuildingOfficeIcon, color: 'from-orange-500 to-yellow-500', path: '/admin/caterers' },
        { name: 'Bookings', icon: CalendarDaysIcon, color: 'from-purple-500 to-pink-500', path: '/admin/bookings' },
        { name: 'Refunds', icon: ArrowPathIcon, color: 'from-red-500 to-orange-500', path: '/admin/refunds' },
        { name: 'Payments', icon: CreditCardIcon, color: 'from-cyan-500 to-blue-500', path: '/admin/payments' },
      ],
    };

    return baseMenu[displayRole];
  };

  const menu = getMenuByRole();

  // Breadcrumbs configuration
  const breadcrumbs: { [key: string]: string[] } = {
    Dashboard: ['Home'],
    Events: ['Home', 'Events'],
    Meals: ['Home', 'Meals'],
    Profile: ['Home', 'Profile'],
    Requests: ['Home', 'Requests'],
    Orders: ['Home', 'Orders'],
    Plans: ['Home', 'Plans'],
    Calendar: ['Home', 'Calendar'],
    Caterers: ['Home', 'Caterers'],
    Bookings: ['Home', 'Bookings'],
    Refunds: ['Home', 'Refunds'],
    Payments: ['Home', 'Payments'],
    'My Quotes': ['Home', 'My Quotes'],
    'My Subscriptions': ['Home', 'My Subscriptions'],
    'My Orders': ['Home', 'My Orders'],
    'Saved': ['Home', 'Saved'],
  };

  const handleMenuClick = (item: MenuItem) => {
    setActiveMenu(item.name);
    router.push(item.path);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Get role badge
  const getRoleBadge = () => {
    const badges: { [key in 'customer' | 'caterer']: { label: string; bg: string; color: string; icon: string } } = {
      customer: { label: 'Customer', bg: '#dbeafe', color: '#0c4a6e', icon: '👤' },
      caterer: { label: 'Caterer', bg: '#fef3c7', color: '#92400e', icon: '👨‍🍳' },
    };

    return badges[displayRole];
  };

  const currentRoleBadge = getRoleBadge();

  // Check if user has both roles
  const canSwitchRoles = (session?.user as any)?.roles?.includes('customer') && (session?.user as any)?.roles?.includes('caterer');

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
          width: isMobile ? (mobileMenuOpen ? '280px' : '0px') : sidebarOpen ? '260px' : '80px',
          backgroundColor: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: isMobile ? (mobileMenuOpen ? '20px 12px' : '0px') : '20px 12px',
          overflow: 'hidden',
          transition: isMobile ? 'width 0.3s ease, padding 0.3s ease' : 'all 0.3s ease',
          boxShadow: isMobile && mobileMenuOpen ? '0 20px 25px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.07)',
          height: isMobile && mobileMenuOpen ? '100vh' : 'auto',
          minHeight: '100vh',
          zIndex: isMobile ? (mobileMenuOpen ? 40 : -1) : 40,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with Toggle - REMOVED LOGO */}
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
            flexShrink: 0,
          }}
        >
          {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
            <div>
              <h1
                style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  letterSpacing: '1px',
                }}
              >
                Menu
              </h1>
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
              <XMarkIcon style={{ width: '20px', height: '20px' }} />
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
                <ChevronLeftIcon style={{ width: '18px', height: '18px' }} />
              ) : (
                <ChevronRightIcon style={{ width: '18px', height: '18px' }} />
              )}
            </button>
          ) : null}
        </div>

        {/* Role Switcher - Only show if user has both roles */}
        {canSwitchRoles && (
          <div
            style={{
              marginBottom: '20px',
              padding: '10px 8px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: (sidebarOpen || (isMobile && mobileMenuOpen)) ? 'column' : 'column',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '6px',
                }}
              >
                <SwapIcon
                  style={{
                    width: '13px',
                    height: '13px',
                    color: '#667eea',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#667eea',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Switch Role
                </span>
              </div>
            )}

            {/* Role Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexDirection: 'row',
              }}
            >
              {/* Customer Button */}
              <button
                onClick={() => handleRoleSwitch('customer')}
                style={{
                  flex: 1,
                  padding: (sidebarOpen || (isMobile && mobileMenuOpen)) ? '8px 10px' : '8px',
                  borderRadius: '8px',
                  border: displayRole === 'customer' ? '2px solid #0c4a6e' : '1px solid #cbd5e1',
                  backgroundColor: displayRole === 'customer' ? '#dbeafe' : 'white',
                  color: displayRole === 'customer' ? '#0c4a6e' : '#64748b',
                  cursor: 'pointer',
                  fontWeight: displayRole === 'customer' ? '700' : '600',
                  fontSize: '11px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minHeight: '32px',
                }}
                onMouseEnter={(e) => {
                  if (displayRole !== 'customer') {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#0c4a6e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (displayRole !== 'customer') {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                title="Switch to Customer"
              >
                <span>👤</span>
                {(sidebarOpen || (isMobile && mobileMenuOpen)) && 'Customer'}
              </button>

              {/* Caterer Button */}
              <button
                onClick={() => handleRoleSwitch('caterer')}
                style={{
                  flex: 1,
                  padding: (sidebarOpen || (isMobile && mobileMenuOpen)) ? '8px 10px' : '8px',
                  borderRadius: '8px',
                  border: displayRole === 'caterer' ? '2px solid #92400e' : '1px solid #cbd5e1',
                  backgroundColor: displayRole === 'caterer' ? '#fef3c7' : 'white',
                  color: displayRole === 'caterer' ? '#92400e' : '#64748b',
                  cursor: 'pointer',
                  fontWeight: displayRole === 'caterer' ? '700' : '600',
                  fontSize: '11px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minHeight: '32px',
                }}
                onMouseEnter={(e) => {
                  if (displayRole !== 'caterer') {
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                    e.currentTarget.style.borderColor = '#92400e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (displayRole !== 'caterer') {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                title="Switch to Caterer"
              >
                <span>👨‍🍳</span>
                {(sidebarOpen || (isMobile && mobileMenuOpen)) && 'Caterer'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu - Scrollable */}
        <nav
          style={{
            flex: 1,
            overflow: isMobile && mobileMenuOpen ? 'auto' : 'hidden',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minHeight: 0,
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
                padding: (sidebarOpen || (isMobile && mobileMenuOpen)) ? '11px 12px' : '11px',
                borderRadius: '10px',
                border: activeMenu === item.name ? '1.5px solid #667eea' : '1.5px solid transparent',
                cursor: 'pointer',
                backgroundColor: activeMenu === item.name ? '#eef2ff' : 'transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
                minHeight: '44px',
                fontSize: '14px',
                opacity: isMobile && !mobileMenuOpen && !sidebarOpen ? 0 : 1,
                flexShrink: 0,
              }}
              title={(!sidebarOpen && !isMobile) ? item.name : undefined}
              onMouseEnter={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {/* Icon with gradient background - FIXED COLOR */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: activeMenu === item.name
                    ? `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
                    : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <item.icon
                  style={{
                    width: '18px',
                    height: '18px',
                    color: activeMenu === item.name ? '#667eea' : '#94a3b8',
                    transition: 'color 0.2s ease',
                    flexShrink: 0,
                    fontWeight: 'bold',
                    stroke: 'currentColor',
                    strokeWidth: activeMenu === item.name ? '2.5' : '2',
                  }}
                />
              </div>

              {(sidebarOpen || (isMobile && mobileMenuOpen)) && (
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          backgroundColor: '#667eea',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          minWidth: '20px',
                          textAlign: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section is now empty - moved to top bar */}
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
        {/* TOP BAR WITH HAMBURGER & ACTIONS - Responsive */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '16px',
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          {/* Left Section - Mobile Hamburger + Breadcrumbs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1 1 auto',
              minWidth: '150px',
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
                  padding: '8px',
                  borderRadius: '8px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
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
          </div>

          {/* Right Section - Role Badge + Support + Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {/* Current Role Badge */}
            {canSwitchRoles && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: currentRoleBadge.bg,
                  color: currentRoleBadge.color,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  flexShrink: 0,
                }}
              >
                <span>{currentRoleBadge.icon}</span>
                <span>{currentRoleBadge.label}</span>
              </div>
            )}

            {/* Support Button */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '13px',
                fontWeight: '500',
                color: '#64748b',
                minHeight: '40px',
                whiteSpace: 'nowrap',
              }}
              title="24/7 Support"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <SparklesIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>Support</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1.5px solid #fee2e2',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '13px',
                fontWeight: '500',
                color: '#dc2626',
                minHeight: '40px',
                whiteSpace: 'nowrap',
              }}
              title="Sign Out"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.borderColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#fee2e2';
              }}
            >
              <ArrowLeftOnRectangleIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>Logout</span>
            </button>
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