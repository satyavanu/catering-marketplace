'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'My Catering Co.',
    businessEmail: 'business@example.com',
    phoneNumber: '+1-234-567-8900',
    address: '123 Main St, City, State',
    city: 'New York',
    timezone: 'EST',
    currency: 'USD',
  });

  const handleChange = (field: string, value: string) => {
    setBusinessSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
        Settings
      </h1>

      {/* Business Settings */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Business Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Business Name
            </label>
            <input
              type="text"
              value={businessSettings.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Business Email
            </label>
            <input
              type="email"
              value={businessSettings.businessEmail}
              onChange={(e) => handleChange('businessEmail', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={businessSettings.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Address
            </label>
            <input
              type="text"
              value={businessSettings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              City
            </label>
            <input
              type="text"
              value={businessSettings.city}
              onChange={(e) => handleChange('city', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Timezone
            </label>
            <select
              value={businessSettings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                backgroundColor: 'white',
                boxSizing: 'border-box',
              }}
            >
              <option>EST</option>
              <option>CST</option>
              <option>MST</option>
              <option>PST</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Currency
            </label>
            <select
              value={businessSettings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1f2937',
                backgroundColor: 'white',
                boxSizing: 'border-box',
              }}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>CAD</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            Save Changes
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e5e7eb',
              color: '#1f2937',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ backgroundColor: '#fee2e2', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #fecaca' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '1rem' }}>
          Danger Zone
        </h2>
        <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginBottom: '1rem' }}>
          These actions cannot be undone. Please proceed with caution.
        </p>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
        >
          Delete Business Account
        </button>
      </div>
    </div>
  );
}