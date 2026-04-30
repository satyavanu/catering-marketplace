'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/partner' },
  { label: 'Services', href: '/partner/services' },
  { label: 'Orders', href: '/partner/orders' },
  { label: 'Bookings', href: '/partner/bookings' },
  { label: 'Earnings', href: '/partner/earnings' },
  { label: 'Reviews', href: '/partner/reviews' },
  { label: 'Settings', href: '/partner/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for home
    if (href === '/partner') return pathname === '/partner';

    // Match nested routes
    return pathname.startsWith(href);
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoWrap}>
        <img
          src="/logo_rounded.png"
          alt="Droooly"
          style={styles.logo}
        />
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 240,
    height: '100vh',
    borderRight: '1px solid #eee9f7',
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    background: '#ffffff',
  },

  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10,
  },

  logo: {
    width: 42,
    height: 42,
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  navItem: {
    border: 'none',
    background: 'transparent',
    padding: '10px 14px',
    borderRadius: 10,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
  },

  navItemActive: {
    background: '#f3e8ff',
    color: '#7c3aed',
    fontWeight: 600,
  },

  navLabel: {},
};