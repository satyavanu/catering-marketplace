'use client';

import React, { useState } from 'react';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: '#ORD001',
      customer: 'John Smith',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      guests: 50,
      amount: '$2,250',
      date: '2026-03-11',
      eventDate: '2026-04-15',
      status: 'Completed',
      menu: 'Wedding Package',
      location: '123 Main St, New York, NY 10001',
      specialInstructions: 'No nuts due to allergies',
      createdAt: '2026-03-01',
      items: [
        { name: 'Appetizers', qty: 50, price: '$500' },
        { name: 'Main Course', qty: 50, price: '$1,000' },
        { name: 'Desserts', qty: 50, price: '$500' },
        { name: 'Beverages', qty: 50, price: '$250' },
      ],
    },
    {
      id: '#ORD002',
      customer: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1-234-567-8901',
      guests: 30,
      amount: '$1,350',
      date: '2026-03-10',
      eventDate: '2026-03-20',
      status: 'In Preparation',
      menu: 'Corporate Lunch',
      location: '456 Business Ave, New York, NY 10002',
      specialInstructions: 'Vegetarian options needed',
      createdAt: '2026-03-05',
      items: [
        { name: 'Sandwich Platters', qty: 30, price: '$600' },
        { name: 'Salads', qty: 30, price: '$450' },
        { name: 'Drinks', qty: 30, price: '$300' },
      ],
    },
    {
      id: '#ORD003',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1-234-567-8902',
      guests: 75,
      amount: '$3,375',
      date: '2026-03-10',
      eventDate: '2026-03-25',
      status: 'Confirmed',
      menu: 'Premium Buffet',
      location: '789 Event Plaza, New York, NY 10003',
      specialInstructions: 'Setup and cleanup included',
      createdAt: '2026-03-08',
      items: [
        { name: 'Hot Appetizers', qty: 75, price: '$750' },
        { name: 'Cold Appetizers', qty: 75, price: '$525' },
        { name: 'Main Course', qty: 75, price: '$1,500' },
        { name: 'Desserts', qty: 75, price: '$600' },
      ],
    },
    {
      id: '#ORD004',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+1-234-567-8903',
      guests: 40,
      amount: '$1,800',
      date: '2026-03-09',
      eventDate: '2026-03-18',
      status: 'New Request',
      menu: 'Birthday Package',
      location: '321 Celebration St, New York, NY 10004',
      specialInstructions: 'Kids menu for 10 children',
      createdAt: '2026-03-09',
      items: [
        { name: 'Pizza', qty: 40, price: '$800' },
        { name: 'Cake', qty: 40, price: '$600' },
        { name: 'Drinks', qty: 40, price: '$400' },
      ],
    },
    {
      id: '#ORD005',
      customer: 'Charlie Davis',
      email: 'charlie@example.com',
      phone: '+1-234-567-8904',
      guests: 60,
      amount: '$2,700',
      date: '2026-03-09',
      eventDate: '2026-03-16',
      status: 'Cancelled',
      menu: 'Premium Catering',
      location: '654 Park Ave, New York, NY 10005',
      specialInstructions: 'Event cancelled - full refund requested',
      createdAt: '2026-03-07',
      items: [],
    },
    {
      id: '#ORD006',
      customer: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1-234-567-8905',
      guests: 80,
      amount: '$3,600',
      date: '2026-03-12',
      eventDate: '2026-04-05',
      status: 'Confirmed',
      menu: 'Wedding Package',
      location: '987 Romance Lane, New York, NY 10006',
      specialInstructions: 'Elegant plating, no red sauce on white plates',
      createdAt: '2026-03-02',
      items: [
        { name: 'Cocktail Hour', qty: 80, price: '$800' },
        { name: 'Dinner Service', qty: 80, price: '$2,000' },
        { name: 'Dessert & Coffee', qty: 80, price: '$800' },
      ],
    },
  ]);

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
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const buttonStyle = {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: '#d1fae5', text: '#065f46', badge: '✓' };
      case 'In Preparation':
        return { bg: '#fef3c7', text: '#92400e', badge: '⏳' };
      case 'Confirmed':
        return { bg: '#dbeafe', text: '#0c4a6e', badge: '✔' };
      case 'New Request':
        return { bg: '#f0e7ff', text: '#5b21b6', badge: '📝' };
      case 'Cancelled':
        return { bg: '#f3f4f6', text: '#4b5563', badge: '✕' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', badge: '•' };
    }
  };

  const getTabCount = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Orders Management
        </h1>
        <button
          onClick={() => setShowNewOrderModal(true)}
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
        >
          + New Order
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
              📦 Total Orders
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', margin: 0 }}>
              {orders.length}
            </p>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
              ✓ Completed
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
              {getTabCount('Completed')}
            </p>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
              ⏳ In Preparation
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
              {getTabCount('In Preparation')}
            </p>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
              💰 Pending Revenue
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
              ${orders
                .filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled')
                .reduce((sum, o) => sum + parseInt(o.amount.replace(/[$,]/g, '')), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={tabsStyle}>
        {[
          { id: 'all', label: '📋 All Orders', count: getTabCount('all') },
          { id: 'New Request', label: '📝 New Requests', count: getTabCount('New Request') },
          { id: 'Confirmed', label: '✔ Confirmed', count: getTabCount('Confirmed') },
          { id: 'In Preparation', label: '⏳ In Preparation', count: getTabCount('In Preparation') },
          { id: 'Completed', label: '✓ Completed', count: getTabCount('Completed') },
          { id: 'Cancelled', label: '✕ Cancelled', count: getTabCount('Cancelled') },
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
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            outline: 'none',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* Orders List */}
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Order ID
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Customer
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Guests
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Event Date
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Menu
                </th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Amount
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Status
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusColor = getStatusColor(order.status);
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500 }}>{order.customer}</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', textAlign: 'center', fontWeight: '600' }}>
                      {order.guests}
                    </td>
                    <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', textAlign: 'center' }}>
                      {order.eventDate}
                    </td>
                    <td style={{ padding: '1rem', color: '#667eea', fontSize: '0.875rem', fontWeight: 500 }}>
                      {order.menu}
                    </td>
                    <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600', textAlign: 'right' }}>
                      {order.amount}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {statusColor.badge} {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => openOrderDetail(order)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          backgroundColor: '#ecf0ff',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#667eea',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbe9ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ecf0ff')}
                      >
                        📋 View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '0.875rem' }}>
            No orders found. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto',
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{ ...cardStyle, maxWidth: '600px', width: '90vw', margin: '2rem 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
                  👤 Customer Information 9
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Name</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Email</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Phone</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Order Date</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
                  🎉 Event Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Event Date</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.eventDate}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Guest Count</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.guests} people</p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>Menu Selected</p>
                    <p style={{ color: '#667eea', fontWeight: 600, margin: 0 }}>{selectedOrder.menu}</p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>📍 Delivery Location</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>{selectedOrder.location}</p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>📝 Special Instructions</p>
                    <p style={{ color: '#1f2937', fontWeight: 500, margin: 0, fontStyle: 'italic' }}>
                      {selectedOrder.specialInstructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items.length > 0 && (
                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
                    🍽️ Order Items
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <div>
                          <p style={{ color: '#1f2937', fontWeight: 500, margin: 0 }}>
                            {item.name} x {item.qty}
                          </p>
                        </div>
                        <p style={{ color: '#667eea', fontWeight: 600, margin: 0 }}>{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div style={{ backgroundColor: '#ecf0ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', color: '#667eea' }}>
                  <span>Total Amount:</span>
                  <span>{selectedOrder.amount}</span>
                </div>
              </div>

              {/* Status Update */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="New Request">New Request</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Preparation">In Preparation</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={buttonStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.625rem 1.25rem',
                    backgroundColor: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowNewOrderModal(false)}
        >
          <div
            style={{ ...cardStyle, maxWidth: '600px', width: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 1.5rem 0' }}>
                Create New Order
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Guest Count *
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Event Date *
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Menu Selection *
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Wedding Package</option>
                    <option>Corporate Lunch</option>
                    <option>Birthday Package</option>
                    <option>Premium Buffet</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Delivery Location *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowNewOrderModal(false)}
                  style={buttonStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                >
                  Create Order
                </button>
                <button
                  onClick={() => setShowNewOrderModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.625rem 1.25rem',
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
          </div>
        </div>
      )}
    </div>
  );
}