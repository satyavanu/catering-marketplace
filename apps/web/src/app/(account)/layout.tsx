'use client';

import { useState } from 'react';
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
} from '@heroicons/react/24/outline';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}
          >
            ⏳
          </div>
          <p
            style={{
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500',
            }}
          >
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
    { name: 'Saved Caterers', icon: HeartIcon, color: 'from-red-500 to-orange-500', path: '/saved-caterers' },
   // { name: 'Event Planner', icon: CalendarDaysIcon, color: 'from-green-500 to-emerald-500', path: '/event-planner' },
    { name: 'Messages', icon: ChatBubbleLeftRightIcon, color: 'from-yellow-500 to-amber-500', path: '/messages' },
    { name: 'Reviews', icon: StarIcon, color: 'from-indigo-500 to-purple-500', path: '/reviews' },
    { name: 'Payments', icon: CreditCardIcon, color: 'from-cyan-500 to-blue-500', path: '/payments' },
    { name: 'Profile', icon: UserCircleIcon, color: 'from-pink-500 to-rose-500', path: '/profile' },
  ];

  // Breadcrumb paths
  const breadcrumbs: { [key: string]: string[] } = {
    Dashboard: ['Home'],
    'My Orders': ['Home', 'Orders'],
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
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc' }}>
      {/* SIDEBAR - Fixed Height No Scroll */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '80px',
          backgroundColor: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          position: 'relative',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
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
          {sidebarOpen && (
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
        </div>

        {/* Navigation Menu - Fixed Height */}
        <nav
          style={{
            flex: 1,
            overflow: 'hidden',
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
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                gap: '12px',
                padding: sidebarOpen ? '10px 12px' : '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeMenu === item.name ? '#f0f4ff' : 'transparent',
                borderLeft: activeMenu === item.name ? '4px solid #667eea' : '4px solid transparent',
                transition: 'all 0.2s ease',
                paddingLeft: activeMenu === item.name ? (sidebarOpen ? '8px' : '10px') : sidebarOpen ? '12px' : '10px',
                position: 'relative',
                minHeight: '40px',
                fontSize: '14px',
              }}
              title={!sidebarOpen ? item.name : undefined}
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
              {sidebarOpen && (
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
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            padding: sidebarOpen ? '14px' : '10px',
            color: 'white',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: sidebarOpen ? 'flex-start' : 'center',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}
        >
          {sidebarOpen ? (
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
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            gap: '12px',
            padding: sidebarOpen ? '10px 12px' : '10px',
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
          }}
          title={!sidebarOpen ? 'Sign Out' : undefined}
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
          {sidebarOpen && 'Sign Out'}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          padding: '24px 32px',
        }}
      >
        {/* TOP BAR WITH BREADCRUMBS - Responsive */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '1 1 auto',
              minWidth: '150px',
              order: 1,
            }}
          >
            {breadcrumbs[activeMenu]?.map((crumb, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: idx === breadcrumbs[activeMenu].length - 1 ? '#667eea' : '#94a3b8',
                    fontSize: '13px',
                    fontWeight: idx === breadcrumbs[activeMenu].length - 1 ? '600' : '500',
                    transition: 'all 0.2s ease',
                    padding: '4px 8px',
                    borderRadius: '4px',
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
                  <ChevronRightIcon style={{ width: '16px', height: '16px', color: '#cbd5e1' }} />
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 1 auto',
              order: 2,
              minWidth: '120px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                textTransform: 'capitalize',
              }}
            >
              {activeMenu}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1 1 auto',
              justifyContent: 'flex-end',
              order: 3,
              minWidth: '280px',
              flexWrap: 'wrap',
            }}
          >
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

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '12px',
                paddingRight: '12px',
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
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#1e293b',
                }}
              >
                {session?.user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT AREA - Full Height No Scroll */}
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

      {/* Scrollbar styling */}
      <style>{`
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
      `}</style>
    </div>
  );
}