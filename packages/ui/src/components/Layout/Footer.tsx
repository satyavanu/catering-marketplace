import React from 'react';
import Link from 'next/link';

interface FooterProps {
  type?: 'auth' | 'dashboard' | 'public';
}

export const Footer: React.FC<FooterProps> = ({ type = 'public' }) => {
  if (type === 'dashboard') {
    return (
      <footer style={{ backgroundColor: '#1f2937', color: '#d1d5db', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', color: 'white', marginBottom: '1rem', fontSize: '0.875rem' }}>POS FEATURES</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/dashboard" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Dashboard
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/dashboard/orders" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          <p style={{ margin: 0 }}>© 2026 CaterHub POS System. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          <p style={{ margin: 0 }}>© 2026 CaterHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};