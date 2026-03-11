'use client';

import React, { useState } from 'react';

interface BusinessSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  currency: string;
  timezone: string;
  taxRate: number;
  deliveryFee: number;
  minimumOrder: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: 'Elite Catering Services',
    email: 'contact@elite-catering.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    zipCode: '10001',
    currency: 'USD',
    timezone: 'Eastern Time',
    taxRate: 8.5,
    deliveryFee: 50,
    minimumOrder: 100,
  });

  const [editMode, setEditMode] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleInputChange = (field: keyof BusinessSettings, value: string | number) => {
    setTempSettings({ ...tempSettings, [field]: value });
  };

  const handleSave = () => {
    setSettings(tempSettings);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setEditMode(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Settings
          </h1>
          <p style={{ color: '#6b7280' }}>Manage your business settings and preferences.</p>
        </div>
        {!editMode && (
          <button
            onClick={() => {
              setEditMode(true);
              setTempSettings(settings);
            }}
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
          >
            Edit Settings
          </button>
        )}
      </div>

      {/* Settings Form */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
        {/* Business Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            Business Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Business Name', field: 'businessName' },
              { label: 'Email', field: 'email' },
              { label: 'Phone', field: 'phone' },
              { label: 'Address', field: 'address' },
              { label: 'City', field: 'city' },
              { label: 'Zip Code', field: 'zipCode' },
            ].map((item) => (
              <div key={item.field}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                  {item.label}
                </label>
                <input
                  type="text"
                  value={editMode ? tempSettings[item.field as keyof BusinessSettings] : settings[item.field as keyof BusinessSettings]}
                  onChange={(e) => editMode && handleInputChange(item.field as keyof BusinessSettings, e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: editMode ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    color: '#1f2937',
                    cursor: editMode ? 'text' : 'default',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Regional Settings */}
        <div style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            Regional Settings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Currency', field: 'currency' },
              { label: 'Timezone', field: 'timezone' },
            ].map((item) => (
              <div key={item.field}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                  {item.label}
                </label>
                <select
                  value={editMode ? tempSettings[item.field as keyof BusinessSettings] : settings[item.field as keyof BusinessSettings]}
                  onChange={(e) => editMode && handleInputChange(item.field as keyof BusinessSettings, e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: editMode ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    color: '#1f2937',
                    cursor: editMode ? 'pointer' : 'default',
                  }}
                >
                  {item.field === 'currency' && (
                    <>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                    </>
                  )}
                  {item.field === 'timezone' && (
                    <>
                      <option>Eastern Time</option>
                      <option>Central Time</option>
                      <option>Mountain Time</option>
                      <option>Pacific Time</option>
                      <option>GMT</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Business Rules */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            Business Rules
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Tax Rate (%)', field: 'taxRate', type: 'number' },
              { label: 'Delivery Fee ($)', field: 'deliveryFee', type: 'number' },
              { label: 'Minimum Order ($)', field: 'minimumOrder', type: 'number' },
            ].map((item) => (
              <div key={item.field}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                  {item.label}
                </label>
                <input
                  type={item.type}
                  value={editMode ? tempSettings[item.field as keyof BusinessSettings] : settings[item.field as keyof BusinessSettings]}
                  onChange={(e) => editMode && handleInputChange(item.field as keyof BusinessSettings, parseFloat(e.target.value))}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: editMode ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    color: '#1f2937',
                    cursor: editMode ? 'text' : 'default',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '0.75rem 2rem',
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
        )}
      </div>
    </div>
  );
}