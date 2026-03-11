'use client';

import React from 'react';
import DashboardCard from '@/components/pos/DashboardCard';



export default function PosPage() {
  const stats = [
    {
      title: "Today's Orders",
      value: '24',
      subtext: '↑ 12% from yesterday',
      icon: '📋',
      bgColor: '#dbeafe',
      borderColor: '#3b82f6',
    },
    {
      title: 'Revenue',
      value: '$4,250',
      subtext: '↑ 8% from yesterday',
      icon: '💰',
      bgColor: '#dcfce7',
      borderColor: '#22c55e',
    },
    {
      title: 'Pending Orders',
      value: '7',
      subtext: '5 ready for pickup',
      icon: '⏳',
      bgColor: '#fef3c7',
      borderColor: '#f59e0b',
    },
    {
      title: 'Total Customers',
      value: '342',
      subtext: '24 new this month',
      icon: '👥',
      bgColor: '#f3e8ff',
      borderColor: '#a855f7',
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', items: 3, total: '$125.50', status: 'Completed' },
    { id: 'ORD-002', customer: 'Sarah Johnson', items: 2, total: '$89.99', status: 'In Progress' },
    { id: 'ORD-003', customer: 'Mike Davis', items: 5, total: '$245.00', status: 'Pending' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Welcome back, Chef! 👋
        </h1>
        <p style={{ color: '#6b7280' }}>
          Here's what's happening with your catering business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, idx) => (
          <DashboardCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Orders Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Recent Orders
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Order ID
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Customer
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Items
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Total
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }} className="hover:bg-gray-100">
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>{order.id}</td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>{order.customer}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{order.items}</td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>{order.total}</td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: order.status === 'Completed' ? '#dcfce7' : order.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                        color: order.status === 'Completed' ? '#166534' : order.status === 'In Progress' ? '#1e40af' : '#92400e',
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
    </div>
  );
}