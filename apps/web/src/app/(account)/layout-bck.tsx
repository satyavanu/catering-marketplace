'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
};

const COLORS = {
  purple: '#7c3aed',
  purpleDark: '#5b21b6',
  purpleSoft: '#f5f0ff',
  purpleBorder: '#e6d8ff',

  orange: '#ff5a3d',
  orangeSoft: '#fff0ea',

  text: '#18181b',
  muted: '#71717a',
  border: '#eee7f8',
  bg: '#faf7ff',
  white: '#ffffff',
};
export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  const userName =
    session?.user?.name?.split(' ')?.[0] ||
    (session?.user as any)?.firstName ||
    'Partner';

  const avatarUrl = session?.user?.image;

  const navItems: NavItem[] = useMemo(
    () => [
      {
        name: 'Home',
        path: '/caterer/dashboard',
        icon: <HomeSvg />,
      },
      {
        name: 'Approvals',
        path: '/caterer/approvals',
        icon: <ShieldSvg />,
        badge: 'New',
      },
      {
        name: 'Worker Status',
        path: '/caterer/workers',
        icon: <PulseSvg />,
      },
      {
        name: 'Requests',
        path: '/caterer/requests',
        icon: <DocumentSvg />,
        badge: '3',
      },
      {
        name: 'Bookings',
        path: '/caterer/bookings',
        icon: <CalendarSvg />,
      },
      {
        name: 'Services',
        path: '/caterer/services',
        icon: <ClocheSvg />,
      },
      {
        name: 'Orders',
        path: '/caterer/orders',
        icon: <CartSvg />,
      },
      {
        name: 'Earnings',
        path: '/caterer/earnings',
        icon: <WalletSvg />,
      },
      {
        name: 'Settings',
        path: '/caterer/settings',
        icon: <SettingsSvg />,
      },
    ],
    []
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loader} />
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div style={styles.shell}>
      {mobileOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          style={styles.mobileOverlay}
        />
      )}

      <aside
        style={{
          ...styles.sidebar,
          ...(mobileOpen ? styles.sidebarMobileOpen : {}),
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => router.push('/caterer/dashboard')}
            style={styles.logoButton}
          >
            <img
              src="./logo_rounded.png"
              alt="Droooly"
              style={styles.logoImage}
            />
          </button>

          <nav style={styles.nav}>
            {navItems.map((item) => {
              const active =
                pathname === item.path ||
                (item.path !== '/caterer/dashboard' &&
                  pathname?.startsWith(item.path));

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    router.push(item.path);
                    setMobileOpen(false);
                  }}
                  style={{
                    ...styles.navItem,
                    ...(active ? styles.navItemActive : {}),
                  }}
                >
                  <span
                    style={{
                      ...styles.navIcon,
                      ...(active ? styles.navIconActive : {}),
                    }}
                  >
                    {item.icon}
                  </span>

                  <span style={styles.navLabel}>{item.name}</span>

                  {item.badge && (
                    <span
                      style={{
                        ...styles.navBadge,
                        ...(active ? styles.navBadgeActive : {}),
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <div style={styles.helpCard}>
            <span style={styles.helpIcon}>
              <HeadsetSvg />
            </span>

            <div>
              <strong style={styles.helpTitle}>Need help?</strong>
              <p style={styles.helpText}>Support is available for onboarding and approvals.</p>
            </div>

            <button
              type="button"
              style={styles.helpButton}
              onClick={() => router.push('/caterer/support')}
            >
              Contact support
            </button>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            style={styles.logoutButton}
          >
            <LogoutSvg />
            Sign out
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.topLeft}>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              style={styles.mobileMenuButton}
            >
              <MenuSvg />
            </button>

            <div>
              <h1 style={styles.welcomeTitle}>Welcome, {userName}! 👋</h1>
              <p style={styles.welcomeSubtext}>
                Your partner account is ready. Manage approvals, services, and bookings here.
              </p>
            </div>
          </div>

          <div style={styles.topActions}>
            <button type="button" style={styles.notificationButton}>
              <BellSvg />
              <span style={styles.notificationDot}>3</span>
            </button>

            <button type="button" style={styles.avatarButton}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} style={styles.avatarImage} />
              ) : (
                <span style={styles.avatarFallback}>
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}

              <span style={styles.avatarText}>
                <strong>{userName}</strong>
                <small>Partner</small>
              </span>

              <ChevronDownSvg />
            </button>
          </div>
        </header>

        <section style={styles.content}>{children}</section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  
  
  shell: {
  minHeight: '100vh',
  display: 'flex',
  background:
    'radial-gradient(circle at top left, rgba(124, 58, 237, 0.10), transparent 34%), radial-gradient(circle at top right, rgba(255, 90, 61, 0.06), transparent 28%), #faf7ff',
  color: COLORS.text,
},

sidebar: {
  width: 280,
  minHeight: '100vh',
  padding: '24px 18px',
  background: 'rgba(255,255,255,0.9)',
  borderRight: `1px solid ${COLORS.border}`,
  boxShadow: '12px 0 36px rgba(91, 33, 182, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 20,
},

logoButton: {
  border: 'none',
  background: 'transparent',
  padding: '4px 2px',
  cursor: 'pointer',
  marginBottom: 28,
  display: 'flex',
  alignItems: 'center',
},

logoImage: {
  width: 168,
  height: 'auto',
  objectFit: 'contain',
},

navItemActive: {
  color: COLORS.purpleDark,
  background:
    'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(255,90,61,0.06))',
  border: '1px solid rgba(124,58,237,0.18)',
  boxShadow: '0 10px 24px rgba(124, 58, 237, 0.10)',
},

navIconActive: {
  color: COLORS.purple,
  background: '#ffffff',
  boxShadow: '0 8px 18px rgba(124, 58, 237, 0.14)',
},

navBadgeActive: {
  background: COLORS.purple,
  color: '#ffffff',
},

helpCard: {
  padding: 16,
  borderRadius: 20,
  background:
    'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(255,90,61,0.08))',
  border: '1px solid rgba(124,58,237,0.14)',
},

helpIcon: {
  width: 38,
  height: 38,
  borderRadius: 999,
  background: '#ffffff',
  color: COLORS.purple,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
  boxShadow: '0 8px 18px rgba(124, 58, 237, 0.14)',
},

helpButton: {
  width: '100%',
  marginTop: 12,
  border: 'none',
  borderRadius: 12,
  padding: '10px 12px',
  background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 850,
  cursor: 'pointer',
},

topbar: {
  height: 88,
  padding: '0 32px',
  background: 'rgba(255,255,255,0.86)',
  borderBottom: `1px solid ${COLORS.border}`,
  backdropFilter: 'blur(18px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 10,
},

notificationDot: {
  position: 'absolute',
  top: -5,
  right: -4,
  minWidth: 20,
  height: 20,
  padding: '0 5px',
  borderRadius: 999,
  background: COLORS.orange,
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 900,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #ffffff',
},

avatarFallback: {
  width: 42,
  height: 42,
  borderRadius: 999,
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  color: '#ffffff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: 16,
},

}
/* SVG ICONS */

function SvgBase({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}

function HomeSvg() {
  return (
    <SvgBase>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </SvgBase>
  );
}

function ShieldSvg() {
  return (
    <SvgBase>
      <path d="M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgBase>
  );
}

function PulseSvg() {
  return (
    <SvgBase>
      <path d="M4 13h3l2-6 4 11 2-5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgBase>
  );
}

function DocumentSvg() {
  return (
    <SvgBase>
      <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h4M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgBase>
  );
}

function CalendarSvg() {
  return (
    <SvgBase>
      <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgBase>
  );
}

function ClocheSvg() {
  return (
    <SvgBase>
      <path d="M5 17h14M6 17a6 6 0 0 1 12 0M12 7V5M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgBase>
  );
}

function CartSvg() {
  return (
    <SvgBase>
      <path d="M4 5h2l2 10h9l2-7H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1" fill="currentColor" />
      <circle cx="17" cy="20" r="1" fill="currentColor" />
    </SvgBase>
  );
}

function WalletSvg() {
  return (
    <SvgBase>
      <path d="M4 7a2 2 0 0 1 2-2h13v14H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" stroke="currentColor" strokeWidth="1.8" />
    </SvgBase>
  );
}

function SettingsSvg() {
  return (
    <SvgBase>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-1.7-1L14.5 3h-5l-.3 3a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5A7.2 7.2 0 0 0 5 12c0 .3 0 .7.1 1l-2 1.5 2 3.4 2.4-1c.5.4 1.1.8 1.7 1l.3 3h5l.3-3c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </SvgBase>
  );
}

function BellSvg() {
  return (
    <SvgBase>
      <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgBase>
  );
}

function ChevronDownSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuSvg() {
  return (
    <SvgBase>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </SvgBase>
  );
}

function HeadsetSvg() {
  return (
    <SvgBase>
      <path d="M5 13v-1a7 7 0 0 1 14 0v1M5 13h3v5H6a1 1 0 0 1-1-1v-4Zm11 0h3v4a1 1 0 0 1-1 1h-2v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 18c0 1.5-1.5 3-4 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgBase>
  );
}

function LogoutSvg() {
  return (
    <SvgBase>
      <path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgBase>
  );
}