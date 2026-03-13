'use client';

import React, { useState } from 'react';

export default function DashboardHome() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const stats = [
    { label: "Today's Orders", value: '12', icon: '📋', color: '#f97316', trend: '+15%' },
    { label: 'Revenue', value: '$2,450', icon: '💰', color: '#10b981', trend: '+8%' },
    { label: 'Pending Orders', value: '5', icon: '⏳', color: '#f59e0b', trend: '-2%' },
    { label: 'Total Customers', value: '248', icon: '👥', color: '#3b82f6', trend: '+12%' },
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Smith', amount: '$450', status: 'Completed', time: '2 hours ago' },
    { id: '#ORD002', customer: 'Jane Doe', amount: '$320', status: 'Processing', time: '30 mins ago' },
    { id: '#ORD003', customer: 'Bob Johnson', amount: '$680', status: 'Pending', time: '1 hour ago' },
    { id: '#ORD004', customer: 'Alice Brown', amount: '$540', status: 'Completed', time: '3 hours ago' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: 'Wedding Reception',
      customer: 'Emma Wilson',
      date: '2026-04-05',
      guests: 80,
      menu: 'Wedding Package',
      status: 'Confirmed',
    },
    {
      id: 2,
      name: 'Corporate Event',
      customer: 'Tech Startup Inc',
      date: '2026-03-25',
      guests: 120,
      menu: 'Corporate Lunch',
      status: 'Confirmed',
    },
    {
      id: 3,
      name: 'Birthday Party',
      customer: 'Sarah Johnson',
      date: '2026-03-20',
      guests: 40,
      menu: 'Birthday Package',
      status: 'Pending',
    },
    {
      id: 4,
      name: 'Anniversary Dinner',
      customer: 'Michael & Lisa',
      date: '2026-03-18',
      guests: 25,
      menu: 'Premium Buffet',
      status: 'Confirmed',
    },
  ];

  const menuPerformance = [
    { name: 'Wedding Package', orders: 45, revenue: '$3,825', popularity: 92 },
    { name: 'Corporate Lunch', orders: 38, revenue: '$1,710', popularity: 78 },
    { name: 'Birthday Package', orders: 32, revenue: '$1,760', popularity: 65 },
    { name: 'Premium Buffet', orders: 28, revenue: '$2,100', popularity: 72 },
    { name: 'Casual Catering', orders: 22, revenue: '$1,210', popularity: 55 },
  ];

  const bookingRequests = [
    {
      id: 1,
      customer: 'Robert Taylor',
      email: 'robert@example.com',
      guests: 60,
      date: '2026-04-10',
      message: 'Looking for wedding catering',
      status: 'New',
    },
    {
      id: 2,
      customer: 'Jennifer Lee',
      email: 'jennifer@example.com',
      guests: 50,
      date: '2026-03-28',
      message: 'Corporate event catering needed',
      status: 'New',
    },
    {
      id: 3,
      customer: 'David Martinez',
      email: 'david@example.com',
      guests: 30,
      date: '2026-03-22',
      message: 'Small intimate gathering',
      status: 'Contacted',
    },
  ];

  const customerMessages = [
    {
      id: 1,
      name: 'John Smith',
      message: 'Can we modify the menu? Need more vegetarian options.',
      time: '5 mins ago',
      unread: true,
    },
    {
      id: 2,
      name: 'Emma Wilson',
      message: 'Thank you so much! Everything was perfect!',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      message: 'What time should we expect delivery?',
      time: '2 hours ago',
      unread: false,
    },
    {
      id: 4,
      name: 'Alice Brown',
      message: 'Can you provide an updated quote?',
      time: '4 hours ago',
      unread: false,
    },
  ];

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'Processing':
        return { bg: '#dbeafe', text: '#0c4a6e' };
      case 'Pending':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'Confirmed':
        return { bg: '#dbeafe', text: '#0c4a6e' };
      case 'New':
        return { bg: '#f0e7ff', text: '#5b21b6' };
      case 'Contacted':
        return { bg: '#fef3c7', text: '#92400e' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              ...cardStyle,
              padding: '1.5rem',
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
                <p style={{ color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
                  {stat.trend} from yesterday
                </p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Today's Orders */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📋 Today's Orders
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {recentOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                        {order.id} - {order.customer}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                        {order.time}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>{order.amount}</span>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          backgroundColor: getStatusColor(order.status).bg,
                          color: getStatusColor(order.status).text,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>No orders today</p>
            )}
          </div>
        </div>

        {/* Revenue Summary */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              💰 Revenue Summary
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Today</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>$2,450</span>
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
                    width: '65%',
                    backgroundColor: '#10b981',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>This Week</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>$12,850</span>
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
                    width: '85%',
                    backgroundColor: '#3b82f6',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>This Month</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>$45,200</span>
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
                    width: '100%',
                    backgroundColor: '#f59e0b',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Upcoming Events */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              🎉 Upcoming Events
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #667eea',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                        {event.name}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                        {event.customer}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(event.status).bg,
                        color: getStatusColor(event.status).text,
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>📅 {event.date}</span>
                    <span>👥 {event.guests} guests</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Booking Requests */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📬 New Booking Requests
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookingRequests.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                        {request.customer}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                        {request.email}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(request.status).bg,
                        color: getStatusColor(request.status).text,
                      }}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                    {request.guests} guests • {request.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
        {/* Menu Performance */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              🍽️ Menu Performance
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#6b7280', fontWeight: '600' }}>
                      Menu
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 0', color: '#6b7280', fontWeight: '600' }}>
                      Orders
                    </th>
                    <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#6b7280', fontWeight: '600' }}>
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuPerformance.slice(0, 4).map((menu, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.75rem 0', color: '#1f2937', fontWeight: '500' }}>
                        {menu.name}
                      </td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'center', color: '#667eea', fontWeight: '600' }}>
                        {menu.orders}
                      </td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#10b981', fontWeight: '600' }}>
                        {menu.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer Messages */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              💬 Customer Messages
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {customerMessages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  style={{
                    padding: '1rem',
                    backgroundColor: msg.unread ? '#f0e7ff' : '#f9fafb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    borderLeft: msg.unread ? '4px solid #8b5cf6' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = msg.unread ? '#ede9fe' : '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = msg.unread ? '#f0e7ff' : '#f9fafb')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontWeight: msg.unread ? '700' : '600', color: '#1f2937', fontSize: '0.875rem' }}>
                      {msg.name}
                    </p>
                    {msg.unread && (
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%', marginTop: '0.25rem' }} />
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {msg.message}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#9ca3af' }}>
                    {msg.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}