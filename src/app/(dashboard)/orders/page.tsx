'use client';

import React, { useState } from 'react';

export default function OrdersPage() {
  const [orders] = useState([
    { id: '#ORD001', customer: 'John Smith', guests: 50, amount: '$450', date: '2026-03-11', status: 'Completed' },
    { id: '#ORD002', customer: 'Jane Doe', guests: 30, amount: '$320', date: '2026-03-10', status: 'Processing' },
    { id: '#ORD003', customer: 'Bob Johnson', guests: 75, amount: '$680', date: '2026-03-10', status: 'Pending' },
    { id: '#ORD004', customer: 'Alice Brown', guests: 40, amount: '$390', date: '2026-03-09', status: 'Completed' },
    { id: '#ORD005', customer: 'Charlie Davis', guests: 60, amount: '$550', date: '2026-03-09', status: 'Cancelled' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'Processing':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'Pending':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'Cancelled':
        return { bg: '#f3f4f6', text: '#4b5563' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Orders Management
        </h1>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
        >
          + New Order
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
          }}
        />
        <select
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            backgroundColor: 'white',
          }}
        >
          <option>All Status</option>
          <option>Completed</option>
          <option>Processing</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
        <select
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            backgroundColor: 'white',
          }}
        >
          <option>Sort by Date</option>
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Highest Amount</option>
        </select>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Guests</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{order.id}</td>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{order.customer}</td>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{order.guests}</td>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{order.amount}</td>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{order.date}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: getStatusColor(order.status).bg,
                      color: getStatusColor(order.status).text,
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: '#e5e7eb',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}