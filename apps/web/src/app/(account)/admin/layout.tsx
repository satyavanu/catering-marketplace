'use client';

import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowPathIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '280px',
          backgroundColor: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 0',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '0 16px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            🔐 Admin
          </h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { href: '/admin/caterers', label: 'Caterers', icon: BuildingOfficeIcon },
            { href: '/admin/users', label: 'Users', icon: UserGroupIcon },
            { href: '/admin/refunds', label: 'Refunds', icon: ArrowPathIcon },
            { href: '/admin/payments', label: 'Payments', icon: CreditCardIcon },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#64748b',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  marginX: '8px',
                }}
              >
                <Icon style={{ width: '18px', height: '18px' }} />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: '280px',
          padding: '24px',
        }}
      >
        {children}
      </main>
    </div>
  );
}