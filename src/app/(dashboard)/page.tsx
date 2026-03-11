'use client';

import React from 'react';

export default function DashboardHome() {
  const stats = [
    { label: 'Today\'s Orders', value: '12', icon: '📋', color: '#f97316' },
    { label: 'Revenue', value: '$2,450', icon: '💰', color: '#10b981' },
    { label: 'Pending Orders', value: '5', icon: '⏳', color: '#f59e0b' },
    { label: 'Total Customers', value: '248', icon: '👥', color: '#3b82f6' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: `2px solid ${stat.color}20`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {stat.value}
                </p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', margin: 0 }}>
          Recent Orders
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '#ORD001', customer: 'John Smith', amount: '$450', status: 'Completed' },
              { id: '#ORD002', customer: 'Jane Doe', amount: '$320', status: 'Processing' },
              { id: '#ORD003', customer: 'Bob Johnson', amount: '$680', status: 'Pending' },
            ].map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>{order.id}</td>
                <td style={{ padding: '0.75rem', color: '#1f2937', fontSize: '0.875rem' }}>{order.customer}</td>
                <td style={{ padding: '0.75rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{order.amount}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: order.status === 'Completed' ? '#d1fae5' : order.status === 'Processing' ? '#fef3c7' : '#fee2e2',
                      color: order.status === 'Completed' ? '#065f46' : order.status === 'Processing' ? '#92400e' : '#991b1b',
                    }}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}