'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Handle both exact matches and nested routes
    return pathname === href || pathname.startsWith(href + '/');
  };

  const menuItems = [
    { label: 'Dashboard', href: './pos', icon: '📊' },
    { label: 'Orders', href: './orders', icon: '📋' },
    { label: 'Menu', href: './menu', icon: '🍽️' },
    { label: 'Customers', href: './customers', icon: '👥' },
    { label: 'Reports', href: './reports', icon: '📈' },
    { label: 'Settings', href: './settings', icon: '⚙️' },
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
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.75rem 1rem',
                color: active ? '#f97316' : '#d1d5db',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: active ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                borderLeft: active ? '4px solid #f97316' : '4px solid transparent',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                fontWeight: active ? '600' : '500',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
              title={item.label}
            >
              <span style={{ fontSize: '1.25rem', minWidth: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </span>
              {open && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </Link>
          );
        })}
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