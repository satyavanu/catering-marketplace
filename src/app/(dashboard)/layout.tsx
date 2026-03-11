'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/pos/Sidebar';
import TopNavbar from '@/components/pos/TopNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        router.push('/login');
      } else {
        try {
          const user = JSON.parse(authToken);
          setUserEmail(user.email);
          setIsAuthenticated(true);
        } catch (e) {
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Dashboard Header - POS Isolated */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🍽️</span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316', margin: 0 }}>
              CaterPOS
            </h1>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              Catering Dashboard
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              Back to Public Site
            </a>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar open={sidebarOpen} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} userEmail={userEmail} />
          <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Dashboard Footer - POS Isolated */}
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
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/dashboard/menu" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Menu Management
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customers" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Customers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', color: 'white', marginBottom: '1rem', fontSize: '0.875rem' }}>RESOURCES</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Documentation
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  API Reference
                </a>
              </li>
              <li>
                <a href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Support Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', color: 'white', marginBottom: '1rem', fontSize: '0.875rem' }}>LEGAL</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Privacy Policy
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          <p style={{ margin: 0 }}>© 2026 CaterHub POS System. All rights reserved.</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem' }}>v1.0.0 • Last updated: March 2026</p>
        </div>
      </footer>
    </div>
  );
}