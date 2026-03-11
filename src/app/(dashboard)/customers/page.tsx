'use client';

import React, { useState } from 'react';

export default function CustomersPage() {
  const [customers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1-234-567-8901', orders: 5, totalSpent: '$2,250' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '+1-234-567-8902', orders: 8, totalSpent: '$3,850' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1-234-567-8903', orders: 3, totalSpent: '$1,350' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1-234-567-8904', orders: 12, totalSpent: '$5,680' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1-234-567-8905', orders: 2, totalSpent: '$890' },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Customer Management
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
        >
          + Add Customer
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search customers..."
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
          <option>Sort by Recent</option>
          <option>Sort by Orders</option>
          <option>Sort by Total Spent</option>
        </select>
      </div>

      {/* Customers Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Phone</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Orders</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Total Spent</th>
              <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{customer.name}</td>
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{customer.email}</td>
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{customer.phone}</td>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{customer.orders}</td>
                <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{customer.totalSpent}</td>
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
                      marginRight: '0.5rem',
                    }}
                  >
                    View
                  </button>
                  <button
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#991b1b',
                    }}
                  >
                    Delete
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