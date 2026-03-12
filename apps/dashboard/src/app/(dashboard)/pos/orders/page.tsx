'use client';

import React, { useState } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: number;
  total: number;
  status: 'Pending' | 'In Progress' | 'Ready' | 'Completed' | 'Cancelled';
  date: string;
  eventDate: string;
  guestCount: number;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    items: 3,
    total: 125.5,
    status: 'Completed',
    date: '2026-03-10',
    eventDate: '2026-03-15',
    guestCount: 25,
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234 567 8901',
    items: 2,
    total: 89.99,
    status: 'In Progress',
    date: '2026-03-09',
    eventDate: '2026-03-12',
    guestCount: 15,
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    items: 5,
    total: 245.0,
    status: 'Pending',
    date: '2026-03-11',
    eventDate: '2026-03-18',
    guestCount: 50,
  },
  {
    id: 'ORD-004',
    customer: 'Emily Brown',
    email: 'emily@example.com',
    phone: '+1 234 567 8903',
    items: 4,
    total: 195.75,
    status: 'Ready',
    date: '2026-03-08',
    eventDate: '2026-03-14',
    guestCount: 30,
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<'All' | Order['status']>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === 'All' || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      Pending: { bg: '#fef3c7', text: '#92400e' },
      'In Progress': { bg: '#dbeafe', text: '#1e40af' },
      Ready: { bg: '#d1fae5', text: '#065f46' },
      Completed: { bg: '#dcfce7', text: '#166534' },
      Cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    return colors[status];
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Orders Management
        </h1>
        <p style={{ color: '#6b7280' }}>Manage all catering orders and track their status.</p>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by Order ID, Customer, or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['All', 'Pending', 'In Progress', 'Ready', 'Completed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: filter === status ? '#f97316' : 'white',
                color: filter === status ? 'white' : '#6b7280',
                border: filter === status ? 'none' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.3s',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Order ID
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Customer
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Event Date
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Guests
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Total
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Status
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#f97316' }}>{order.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#1f2937', fontWeight: '600' }}>{order.customer}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{order.email}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{order.eventDate}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '600' }}>{order.guestCount}</td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>${order.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backgroundColor: getStatusColor(order.status).bg,
                        color: getStatusColor(order.status).text,
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            No orders found matching your criteria.
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Orders</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{orders.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Revenue</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
            ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}