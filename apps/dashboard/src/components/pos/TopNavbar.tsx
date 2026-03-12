'use client';

import React from 'react';

interface TopNavbarProps {
  onMenuToggle: () => void;
  userEmail?: string;
}

export default function TopNavbar({ onMenuToggle, userEmail = 'user@example.com' }: TopNavbarProps) {
  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
      {/* Left Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuToggle}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#1f2937',
            padding: '0.5rem',
          }}
          title="Toggle Sidebar"
        >
          ☰
        </button>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          CaterHub Backoffice
        </h2>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Notifications */}
        <button
          style={{
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.25rem',
            position: 'relative',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          title="Notifications"
        >
          🔔
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              border: '2px solid white',
            }}
          >
            3
          </span>
        </button>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid #e5e7eb' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            }}
          >
            {getUserInitials(userEmail)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
              Chef Owner
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              {userEmail}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginLeft: '0.5rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}