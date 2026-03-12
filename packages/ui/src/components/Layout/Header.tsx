import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title = 'CaterHub', showNav = true }) => {
  return (
    <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🍽️</span>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            {title}
          </h1>
        </div>
        {showNav && (
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              Home
            </Link>
            <Link href="/caterers" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              For Caterers
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};