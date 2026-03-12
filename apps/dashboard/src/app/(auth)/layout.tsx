'use client';

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Auth Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🍽️</span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>CaterHub</h1>
          </div>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              Home
            </a>
            <a href="/about-us" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              About
            </a>
            <a href="/caterers" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              For Caterers
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Auth Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', fontSize: '0.875rem' }}>COMPANY</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  About Us
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Blog
                </a>
              </li>
              <li>
                <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', fontSize: '0.875rem' }}>SUPPORT</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Help Center
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', fontSize: '0.875rem' }}>LEGAL</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/cookie-policy" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Privacy Policy
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/cookie-policy" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookie-policy" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          <p style={{ margin: 0 }}>© 2026 CaterHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}