'use client';

import React from 'react';

export default function ReportsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
        Reports & Analytics
      </h1>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>Total Revenue</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>$15,240</p>
          <p style={{ color: '#10b981', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>↑ 12% from last month</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>Total Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>142</p>
          <p style={{ color: '#3b82f6', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>↑ 8% from last month</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>Average Order Value</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316', margin: 0 }}>$107.50</p>
          <p style={{ color: '#f97316', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>↑ 4% from last month</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Revenue Chart</p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>Chart integration coming soon</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Order Trends</p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>Chart integration coming soon</p>
        </div>
      </div>
    </div>
  );
}