'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  // Sample data
  const revenueData = [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 8800 },
    { month: 'Apr', revenue: 10200 },
    { month: 'May', revenue: 12500 },
    { month: 'Jun', revenue: 15240 },
  ];

  const orderData = [
    { month: 'Jan', orders: 45 },
    { month: 'Feb', orders: 52 },
    { month: 'Mar', orders: 48 },
    { month: 'Apr', orders: 63 },
    { month: 'May', orders: 78 },
    { month: 'Jun', orders: 142 },
  ];

  const menuItems = [
    { name: 'Classic Buffet', orders: 45, revenue: '$4,050' },
    { name: 'Premium Platter', orders: 38, revenue: '$5,700' },
    { name: 'Vegan Selection', orders: 32, revenue: '$3,840' },
    { name: 'Kids Party Pack', orders: 28, revenue: '$2,240' },
    { name: 'Corporate Catering', orders: 42, revenue: '$8,400' },
  ];

  const peakSeasons = [
    { season: 'Summer (Jun-Aug)', bookings: 312, percentage: 28 },
    { season: 'Fall (Sep-Nov)', bookings: 275, percentage: 25 },
    { season: 'Spring (Mar-May)', bookings: 285, percentage: 26 },
    { season: 'Winter (Dec-Feb)', bookings: 228, percentage: 21 },
  ];

  const customerInsights = [
    { metric: 'Total Customers', value: '324', change: '+15%', color: '#3b82f6' },
    { metric: 'Repeat Customers', value: '87', change: '+22%', color: '#10b981' },
    { metric: 'Avg Customer Rating', value: '4.8/5', change: '+0.3', color: '#f59e0b' },
    { metric: 'Customer Retention', value: '68%', change: '+5%', color: '#8b5cf6' },
  ];

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const tabsStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
    overflowX: 'auto' as const,
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
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const chartContainerStyle = {
    ...cardStyle,
    marginBottom: '2rem',
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
    margin: 0,
  };

  // Simple Chart Component
  const SimpleBarChart = ({ data, height = 250 }: { data: any; height?: number }) => {
    const maxValue = Math.max(...data.map((d: any) => d.revenue || d.orders));
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: `${height}px`, gap: '1rem', marginTop: '1.5rem' }}>
        {data.map((item: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                width: '100%',
                height: `${((item.revenue || item.orders) / maxValue) * height}px`,
                backgroundColor: '#667eea',
                borderRadius: '0.5rem 0.5rem 0 0',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5568d3';
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.opacity = '1';
              }}
            />
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
              {item.month}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Simple Pie Chart Component
  const SimplePieChart = ({ data }: { data: any }) => {
    let currentAngle = 0;
    const size = 200;
    const radius = size / 2;

    const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444'];

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <svg width={size} height={size} style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))' }}>
          {data.map((item: any, idx: number) => {
            const percentage = item.percentage / 100;
            const startAngle = (currentAngle * Math.PI) / 180;
            const endAngle = ((currentAngle + item.percentage * 3.6) * Math.PI) / 180;

            const x1 = radius + radius * Math.cos(startAngle);
            const y1 = radius + radius * Math.sin(startAngle);
            const x2 = radius + radius * Math.cos(endAngle);
            const y2 = radius + radius * Math.sin(endAngle);

            const largeArc = percentage > 0.5 ? 1 : 0;

            const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            currentAngle += item.percentage * 3.6;

            return (
              <path key={idx} d={path} fill={colors[idx % colors.length]} style={{ cursor: 'pointer' }} />
            );
          })}
        </svg>
        <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
          {data.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444'][idx % 4],
                }}
              />
              <span style={{ color: '#1f2937', fontWeight: 500 }}>
                {item.season}: {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Reports & Analytics
        </h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>💰 Total Revenue</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>$15,240</p>
          <p style={{ color: '#10b981', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>↑ 12% from last month</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>📋 Total Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>142</p>
          <p style={{ color: '#3b82f6', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>↑ 8% from last month</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>🛒 Average Order Value</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316', margin: 0 }}>$107.50</p>
          <p style={{ color: '#f97316', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>↑ 4% from last month</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>⭐ Customer Rating</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>4.8/5</p>
          <p style={{ color: '#8b5cf6', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Based on 324 reviews</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={tabsStyle}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'revenue', label: '💰 Revenue' },
          { id: 'menus', label: '🍽️ Popular Menus' },
          { id: 'customers', label: '👥 Customer Insights' },
        ].map((tab) => (
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Monthly Sales Chart */}
          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>📈 Monthly Sales Trend</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '1rem' }}>
              Revenue performance over the last 6 months
            </p>
            <SimpleBarChart data={revenueData} />
          </div>

          {/* Best Selling Menu Chart */}
          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>🔥 Best Selling Menu Items</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '1rem' }}>
              Top performing menu items by order count
            </p>
            <SimpleBarChart data={menuItems.map((item) => ({ month: item.name.substring(0, 10), orders: item.orders }))} />
          </div>

          {/* Peak Booking Seasons Chart */}
          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>📅 Peak Booking Seasons</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '1rem' }}>
              Distribution of bookings across seasons
            </p>
            <SimplePieChart data={peakSeasons} />
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div>
          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>💰 Revenue Analysis</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Total This Month</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#10b981', margin: '0.5rem 0 0 0' }}>
                  $15,240
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Average Daily</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#3b82f6', margin: '0.5rem 0 0 0' }}>
                  $507.33
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Highest Day</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f97316', margin: '0.5rem 0 0 0' }}>
                  $1,245
                </p>
              </div>
            </div>
            <SimpleBarChart data={revenueData} />
          </div>

          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>📊 Order Volume vs Revenue</h2>
            <SimpleBarChart data={orderData} />
          </div>
        </div>
      )}

      {/* Popular Menus Tab */}
      {activeTab === 'menus' && (
        <div>
          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>🍽️ Top Menu Items Performance</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Menu Item
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Orders
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Revenue
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Popularity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: 500 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#3b82f6', fontWeight: 600 }}>
                        {item.orders}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                        {item.revenue}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#ecf0ff',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#667eea',
                          }}
                        >
                          ⭐ {Math.round((item.orders / 45) * 100)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Insights Tab */}
      {activeTab === 'customers' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {customerInsights.map((insight, idx) => (
              <div key={idx} style={cardStyle}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                  {insight.metric}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: insight.color, margin: 0 }}>
                  {insight.value}
                </p>
                <p style={{ color: insight.color, fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                  {insight.change} from last month
                </p>
              </div>
            ))}
          </div>

          <div style={chartContainerStyle}>
            <h2 style={sectionTitleStyle}>👥 Customer Insights Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                  Customer Segments
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'New Customers', value: '45', color: '#3b82f6' },
                    { label: 'Returning Customers', value: '87', color: '#10b981' },
                    { label: 'VIP Customers', value: '24', color: '#f59e0b' },
                  ].map((segment, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: 500 }}>
                          {segment.label}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: segment.color, fontWeight: 600 }}>
                          {segment.value}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${(parseInt(segment.value) / 100) * 100}%`,
                            backgroundColor: segment.color,
                            borderRadius: '9999px',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                  Satisfaction Metrics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Food Quality', rating: 4.8 },
                    { label: 'Service', rating: 4.6 },
                    { label: 'Delivery Time', rating: 4.5 },
                    { label: 'Value for Money', rating: 4.7 },
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: 500 }}>
                          {metric.label}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: 600 }}>
                          {metric.rating}/5
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '1rem',
                              opacity: i < Math.round(metric.rating) ? 1 : 0.3,
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}