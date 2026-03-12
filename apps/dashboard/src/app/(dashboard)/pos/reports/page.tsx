'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');

  const reportData = {
    totalRevenue: 12450.75,
    totalOrders: 87,
    avgOrderValue: 143.12,
    customerSatisfaction: 4.7,
    topItems: [
      { name: 'Grilled Salmon', orders: 34, revenue: 849.66 },
      { name: 'Beef Wellington', orders: 28, revenue: 923.72 },
      { name: 'Caesar Salad', orders: 45, revenue: 584.55 },
      { name: 'Vegetable Platter', orders: 38, revenue: 379.62 },
    ],
    revenueByCategory: [
      { category: 'Main Course', revenue: 6250.5, percentage: 50 },
      { category: 'Appetizer', revenue: 2500.2, percentage: 20 },
      { category: 'Dessert', revenue: 1875.15, percentage: 15 },
      { category: 'Beverage', revenue: 1250.1, percentage: 10 },
      { category: 'Other', revenue: 574.8, percentage: 5 },
    ],
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Reports & Analytics
        </h1>
        <p style={{ color: '#6b7280' }}>Track your business performance and insights.</p>
      </div>

      {/* Date Range Selector */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: dateRange === range ? '#f97316' : 'white',
              color: dateRange === range ? 'white' : '#6b7280',
              border: dateRange === range ? 'none' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.3s',
              textTransform: 'capitalize',
            }}
          >
            This {range}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Revenue', value: `$${reportData.totalRevenue.toFixed(2)}`, icon: '💰', color: '#22c55e' },
          { label: 'Total Orders', value: reportData.totalOrders, icon: '📋', color: '#3b82f6' },
          { label: 'Avg Order Value', value: `$${reportData.avgOrderValue.toFixed(2)}`, icon: '💵', color: '#f59e0b' },
          { label: 'Satisfaction', value: `${reportData.customerSatisfaction}/5 ⭐`, icon: '😊', color: '#8b5cf6' },
        ].map((metric, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderLeft: `4px solid ${metric.color}` }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{metric.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Top Items */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Top Selling Items
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Item Name
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Orders
                </th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.topItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>{item.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.orders}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#f97316' }}>
                    ${item.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Category */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Revenue by Category
        </h2>
        {reportData.revenueByCategory.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{item.category}</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>${item.revenue.toFixed(2)}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${item.percentage}%`,
                  backgroundColor: ['#f97316', '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b'][idx],
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}