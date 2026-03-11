'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Orders', href: '/dashboard/orders', icon: '📋' },
    { label: 'Menu', href: '/dashboard/menu', icon: '🍽️' },
    { label: 'Customers', href: '/dashboard/customers', icon: '👥' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <aside
      style={{
        width: open ? '260px' : '80px',
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #374151' }}>
        <span style={{ fontSize: '1.5rem' }}>🍽️</span>
        {open && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#f97316' }}>
              CaterPOS
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>
              Backoffice
            </p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '0.75rem 1rem',
              color: isActive(item.href) ? '#f97316' : '#d1d5db',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: isActive(item.href) ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              borderLeft: isActive(item.href) ? '4px solid #f97316' : '4px solid transparent',
              transition: 'all 0.2s',
              fontSize: '0.875rem',
              fontWeight: isActive(item.href) ? '600' : '500',
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            <span style={{ fontSize: '1.25rem', minWidth: '1.5rem' }}>{item.icon}</span>
            {open && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid #374151', fontSize: '0.75rem', color: '#6b7280' }}>
        {open ? (
          <p style={{ margin: 0 }}>© 2026 CaterHub</p>
        ) : (
          <p style={{ margin: 0, textAlign: 'center' }}>©</p>
        )}
      </div>
    </aside>
  );
}