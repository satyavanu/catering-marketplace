'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [businessProfile, setBusinessProfile] = useState({
    businessName: 'My Catering Co.',
    businessEmail: 'business@example.com',
    phoneNumber: '+1-234-567-8900',
    address: '123 Main St, City, State',
    city: 'New York',
    timezone: 'EST',
    currency: 'USD',
  });

  const [deliveryAreas, setDeliveryAreas] = useState([
    { id: 1, area: 'Downtown', radius: '5 miles', fee: '$15' },
    { id: 2, area: 'Suburbs', radius: '10 miles', fee: '$25' },
  ]);

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '09:00', close: '21:00', closed: false },
    tuesday: { open: '09:00', close: '21:00', closed: false },
    wednesday: { open: '09:00', close: '21:00', closed: false },
    thursday: { open: '09:00', close: '21:00', closed: false },
    friday: { open: '09:00', close: '23:00', closed: false },
    saturday: { open: '10:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '21:00', closed: false },
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: 'My Catering Co.',
    accountNumber: '****-****-****-1234',
    bankName: 'Chase Bank',
    routingNumber: '****-****-9876',
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    promotions: false,
    weeklyReport: true,
    paymentNotifications: true,
    systemAlerts: true,
  });

  const [newArea, setNewArea] = useState({ area: '', radius: '', fee: '' });
  const [showAddArea, setShowAddArea] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setBusinessProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof workingHours], [field]: value },
    }));
  };

  const handleWorkingHoursClosed = (day: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof workingHours], closed: !prev[day as keyof typeof workingHours].closed },
    }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddArea = () => {
    if (newArea.area && newArea.radius && newArea.fee) {
      setDeliveryAreas((prev) => [...prev, { id: Date.now(), ...newArea }]);
      setNewArea({ area: '', radius: '', fee: '' });
      setShowAddArea(false);
    }
  };

  const handleDeleteArea = (id: number) => {
    setDeliveryAreas((prev) => prev.filter((area) => area.id !== id));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: '🏢 Business Profile' },
    { id: 'delivery', label: '🚚 Delivery Areas' },
    { id: 'hours', label: '⏰ Working Hours' },
    { id: 'bank', label: '🏦 Bank Details' },
    { id: 'notifications', label: '🔔 Notifications' },
  ];

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const tabsContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
    overflowX: 'auto' as const,
    paddingBottom: '0.5rem',
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: isActive ? '#667eea' : 'transparent',
    color: isActive ? 'white' : '#6b7280',
    border: 'none',
    borderRadius: '0.5rem 0.5rem 0 0',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s ease',
  });

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    boxSizing: 'border-box' as const,
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  };

  const secondaryButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
        Settings
      </h1>

      {/* Tabs Navigation */}
      <div style={tabsContainerStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Profile Tab */}
      {activeTab === 'profile' && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Business Information</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={labelStyle}>Business Name</label>
              <input
                type="text"
                value={businessProfile.businessName}
                onChange={(e) => handleProfileChange('businessName', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Business Email</label>
              <input
                type="email"
                value={businessProfile.businessEmail}
                onChange={(e) => handleProfileChange('businessEmail', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                value={businessProfile.phoneNumber}
                onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Address</label>
              <input
                type="text"
                value={businessProfile.address}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                value={businessProfile.city}
                onChange={(e) => handleProfileChange('city', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Timezone</label>
              <select
                value={businessProfile.timezone}
                onChange={(e) => handleProfileChange('timezone', e.target.value)}
                style={inputStyle}
              >
                <option>EST</option>
                <option>CST</option>
                <option>MST</option>
                <option>PST</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select
                value={businessProfile.currency}
                onChange={(e) => handleProfileChange('currency', e.target.value)}
                style={inputStyle}
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
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
            >
              Save Changes
            </button>
            <button
              style={secondaryButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delivery Areas Tab */}
      {activeTab === 'delivery' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={sectionTitleStyle}>Delivery Areas</h2>
            <button
              onClick={() => setShowAddArea(!showAddArea)}
              style={{ ...buttonStyle, padding: '0.5rem 1rem', fontSize: '0.75rem' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
            >
              {showAddArea ? '✕ Cancel' : '+ Add Area'}
            </button>
          </div>

          {showAddArea && (
            <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Area Name</label>
                  <input
                    type="text"
                    value={newArea.area}
                    onChange={(e) => setNewArea({ ...newArea, area: e.target.value })}
                    placeholder="e.g., Downtown"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Delivery Radius</label>
                  <input
                    type="text"
                    value={newArea.radius}
                    onChange={(e) => setNewArea({ ...newArea, radius: e.target.value })}
                    placeholder="e.g., 5 miles"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Delivery Fee</label>
                  <input
                    type="text"
                    value={newArea.fee}
                    onChange={(e) => setNewArea({ ...newArea, fee: e.target.value })}
                    placeholder="e.g., $15"
                    style={inputStyle}
                  />
                </div>
              </div>
              <button
                onClick={handleAddArea}
                style={buttonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                Add Area
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {deliveryAreas.map((area) => (
              <div
                key={area.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>{area.area}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                    {area.radius} • {area.fee}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteArea(area.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Working Hours Tab */}
      {activeTab === 'hours' && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Working Hours</h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(workingHours).map(([day, hours]) => (
              <div
                key={day}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ minWidth: '100px', fontWeight: 600, color: '#1f2937', textTransform: 'capitalize' }}>
                  {day}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                      disabled={hours.closed}
                      style={{ ...inputStyle, opacity: hours.closed ? 0.5 : 1 }}
                    />
                  </div>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>to</span>
                  <div style={{ flex: 1 }}>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                      disabled={hours.closed}
                      style={{ ...inputStyle, opacity: hours.closed ? 0.5 : 1 }}
                    />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '100px' }}>
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={() => handleWorkingHoursClosed(day)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Closed</span>
                </label>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={handleSave}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
            >
              Save Changes
            </button>
            <button
              style={secondaryButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bank Details Tab */}
      {activeTab === 'bank' && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Bank Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={labelStyle}>Account Name</label>
              <input type="text" value={bankDetails.accountName} style={{ ...inputStyle, backgroundColor: '#f9fafb' }} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Account Number</label>
              <input type="text" value={bankDetails.accountNumber} style={{ ...inputStyle, backgroundColor: '#f9fafb' }} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Bank Name</label>
              <input type="text" value={bankDetails.bankName} style={{ ...inputStyle, backgroundColor: '#f9fafb' }} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Routing Number</label>
              <input type="text" value={bankDetails.routingNumber} style={{ ...inputStyle, backgroundColor: '#f9fafb' }} readOnly />
            </div>
          </div>

          <div style={{ backgroundColor: '#ecf0ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', borderLeft: '4px solid #667eea' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#4c51bf' }}>
              💡 Bank details are securely stored and encrypted. Contact support to update your banking information.
            </p>
          </div>

          <button
            style={{ ...buttonStyle, backgroundColor: '#94a3b8' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#64748b')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#94a3b8')}
          >
            Contact Support
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Notification Preferences</h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { key: 'newOrders', label: 'New Orders', description: 'Get notified when you receive new orders' },
              { key: 'orderUpdates', label: 'Order Updates', description: 'Receive updates on order status changes' },
              { key: 'promotions', label: 'Promotions', description: 'Marketing emails and special offers' },
              { key: 'weeklyReport', label: 'Weekly Reports', description: 'Summary of your business performance' },
              { key: 'paymentNotifications', label: 'Payment Notifications', description: 'Updates about payments and refunds' },
              { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>{item.label}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>{item.description}</p>
                </div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    width: '50px',
                    height: '28px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={() => handleNotificationChange(item.key)}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundColor: notifications[item.key as keyof typeof notifications] ? '#667eea' : '#d1d5db',
                      borderRadius: '14px',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: notifications[item.key as keyof typeof notifications] ? '26px' : '2px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s ease',
                    }}
                  />
                </label>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={handleSave}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
            >
              Save Preferences
            </button>
            <button
              style={secondaryButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}