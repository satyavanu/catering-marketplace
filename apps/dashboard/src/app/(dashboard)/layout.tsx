'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

// Heroicons as inline SVGs
const Icons = {
  Dashboard: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.47 3.841a.75.75 0 015.06 0l7.915 4.027a.75.75 0 010 1.33l-7.915 4.027a.75.75 0 01-5.06 0L3.555 9.198a.75.75 0 010-1.33l7.915-4.027zM6.577 9.75a.75.75 0 00-.577.735v9.466c0 .465.305.88.75 1.028l7.5 3.75a.75.75 0 00.75 0l7.5-3.75c.445-.148.75-.563.75-1.028V10.485a.75.75 0 00-.577-.735m13.923 0a.75.75 0 00-.577.735v9.466c0 .465.305.88.75 1.028l7.5 3.75a.75.75 0 00.75 0l7.5-3.75c.445-.148.75-.563.75-1.028V10.485a.75.75 0 00-.577-.735" />
    </svg>
  ),
  Orders: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 .621-.504 1.125-1.125 1.125H1.5V5.25a3.75 3.75 0 013.75-3.75zm10.5 0h3.375a3.75 3.75 0 013.75 3.75v1.875c0 .621-.504 1.125-1.125 1.125H16V5.25a3.75 3.75 0 00-3.75-3.75zm11.25 9.75v7.5a3.75 3.75 0 01-3.75 3.75H5.25a3.75 3.75 0 01-3.75-3.75v-7.5a1.5 1.5 0 011.5-1.5h21a1.5 1.5 0 011.5 1.5z" />
    </svg>
  ),
  Menus: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V3zM9 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V3zM15 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V3zM3 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V9zM9 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zM15 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zM3 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM15 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
    </svg>
  ),
  Calendar: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.75 2.25A.75.75 0 017.5 3v1.5h6V3a.75.75 0 011.5 0v1.5H19.5V3a.75.75 0 011.5 0v1.5A2.25 2.25 0 0121 6.75v11.25A2.25 2.25 0 0118.75 20.25H5.25A2.25 2.25 0 013 18V6.75A2.25 2.25 0 015.25 4.5H6.75V3a.75.75 0 01.75-.75zm-.75 5.5a.75.75 0 00-.75.75v7.5c0 .414.336.75.75.75h12.5a.75.75 0 00.75-.75v-7.5a.75.75 0 00-.75-.75H6z" />
    </svg>
  ),
  Customers: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15 6a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Payments: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15zM21 9.75H3v9a3 3 0 003 3h12a3 3 0 003-3v-9zm-18 5.25a.75.75 0 000 1.5h12a.75.75 0 000-1.5H3zm0 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5H3z" />
    </svg>
  ),
  Reports: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.375 2.25h-12a2.25 2.25 0 00-2.25 2.25v15A2.25 2.25 0 006.375 21.75h12a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25zm-10.5 17.25h-1.5a.75.75 0 01-.75-.75v-5.25a.75.75 0 011.5 0v5.25zm4.5-7.5h-1.5a.75.75 0 01-.75-.75v-3a.75.75 0 011.5 0v3a.75.75 0 01-.75.75zm4.5-3h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75z" />
    </svg>
  ),
  Reviews: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.529 9.97a.75.75 0 100-1.06L6.06 5.44a.75.75 0 00-1.06 1.061l3.47 3.47zm3.942 0a.75.75 0 000-1.06L13.44 5.44a.75.75 0 00-1.06 1.061l3.47 3.47zm-8.9 9.9a.75.75 0 100-1.06l-3.47-3.47a.75.75 0 00-1.06 1.061l3.47 3.47zm3.942 0a.75.75 0 000-1.06l-3.47-3.47a.75.75 0 00-1.06 1.061l3.47 3.47z" />
    </svg>
  ),
  Settings: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path fillRule="evenodd" d="M12 2.25c-.915 0-1.817.05-2.709.15.587.088 1.165.17 1.738.254a2.25 2.25 0 100-4.5c-5.384 0-10.362 2.52-13.5 6.413C.975 7.95 0 10.378 0 13.124c0 2.747.975 5.175 2.529 7.125C5.638 23.48 10.616 26 16 26a8.996 8.996 0 004.415-1.095a2.25 2.25 0 10-1.94-4.113 4.5 4.5 0 11-1.5-8.77 2.25 2.25 0 100-4.5c-5.384 0-10.362 2.52-13.5 6.413C.975 7.95 0 10.378 0 13.124z" clipRule="evenodd" />
    </svg>
  ),
  Help: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M2.25 12c0-6.215 5.035-11.25 11.25-11.25S24.75 5.785 24.75 12c0 6.215-5.035 11.25-11.25 11.25S2.25 18.215 2.25 12zm11.25-4.5a.75.75 0 01.75.75v2.25H15a.75.75 0 010 1.5h-3.75V12a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75zm0 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
    </svg>
  ),
  Bell: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5.85 3.5a2.25 2.25 0 00-2.26 2.269c0 .584.06 1.165.166 1.736a1.5 1.5 0 002.966-.436c-.084-.537-.126-1.084-.126-1.636A2.25 2.25 0 005.85 3.5zm12.3 0a2.25 2.25 0 012.26 2.269c0 .552-.042 1.099-.126 1.636a1.5 1.5 0 11-2.966-.436c.106-.571.166-1.152.166-1.736a2.25 2.25 0 01-.26-2.269zM5.75 12a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H6.5a.75.75 0 01-.75-.75zm8-8.75h.008v.008h-.008v-.008z" />
    </svg>
  ),
  Menu: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
  ),
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Dashboard', tooltip: 'Dashboard' },
    { label: 'Orders', href: '/dashboard/orders', icon: 'Orders', tooltip: 'Orders' },
    { label: 'Menus', href: '/dashboard/menus', icon: 'Menus', tooltip: 'Menus' },
    { label: 'Calendar', href: '/dashboard/calendar', icon: 'Calendar', tooltip: 'Calendar' },
    { label: 'Customers', href: '/dashboard/customers', icon: 'Customers', tooltip: 'Customers' },
    { label: 'Payments', href: '/dashboard/payments', icon: 'Payments', tooltip: 'Payments' },
    { label: 'Reports', href: '/dashboard/reports', icon: 'Reports', tooltip: 'Reports' },
    { label: 'Reviews', href: '/dashboard/reviews', icon: 'Reviews', tooltip: 'Reviews' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'Settings', tooltip: 'Settings' },
  ];

  const notifications = [
    { id: 1, message: 'New order received', time: '5 min ago' },
    { id: 2, message: 'User registration', time: '1 hour ago' },
    { id: 3, message: 'System update completed', time: '3 hours ago' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    router.push('/(auth)/login');
  };

  const getIcon = (iconName: string) => {
    return (Icons as any)[iconName] || Icons.Dashboard;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Left Sidebar - Icon Navigation */}
      <aside
        style={{
          width: '64px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 40,
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '2rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => router.push('/dashboard')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          📊
        </div>

        {/* Menu Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          {menuItems.map((item) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div key={item.href} style={{ position: 'relative' }}>
                <Link
                  href={item.href}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    backgroundColor: isActive(item.href) ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                    color: isActive(item.href) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: isActive(item.href) ? '2px solid rgba(255, 255, 255, 0.4)' : '2px solid transparent',
                  }}
                  title={item.tooltip}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                >
                  <IconComponent style={{ width: '24px', height: '24px' }} />
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            title="Help"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <Icons.Help style={{ width: '24px', height: '24px' }} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '64px',
        }}
      >
        {/* Top Navigation Bar */}
        <header
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 1.5rem',
            height: '56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Left Side - Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Right Side - Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Notifications"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <Icons.Bell style={{ width: '24px', height: '24px' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
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
                    marginTop: '0.5rem',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                    Notifications
                  </div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b' }}>
                        {notif.message}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        {notif.time}
                      </p>
                    </div>
                  ))}
                  <div style={{ padding: '0.75rem 1rem', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
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
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#764ba2')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#667eea')}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                  gap: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  A
                </div>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>▼</span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '200px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>Admin User</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                      admin@catering.com
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => router.push('/dashboard/settings')}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      ⚙️ Settings
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
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      🚪 Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: '1.5rem',
            overflow: 'auto',
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#94a3b8',
            flexShrink: 0,
          }}
        >
          <p style={{ margin: 0 }}>
            © 2026 Catering Marketplace Admin. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Click outside to close dropdowns */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20,
          }}
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </div>
  );
}