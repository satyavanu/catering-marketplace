'use client';

import React, { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    ordersCount: 5,
    totalSpent: 625.5,
    lastOrder: '2026-03-10',
    joinDate: '2025-06-15',
    status: 'Active',
  },
  {
    id: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234 567 8901',
    ordersCount: 3,
    totalSpent: 289.99,
    lastOrder: '2026-03-09',
    joinDate: '2025-11-20',
    status: 'Active',
  },
  {
    id: 'CUST-003',
    name: 'Mike Davis',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    ordersCount: 8,
    totalSpent: 1245.0,
    lastOrder: '2026-03-11',
    joinDate: '2024-08-05',
    status: 'Active',
  },
  {
    id: 'CUST-004',
    name: 'Emily Brown',
    email: 'emily@example.com',
    phone: '+1 234 567 8903',
    ordersCount: 2,
    totalSpent: 195.75,
    lastOrder: '2025-12-20',
    joinDate: '2025-09-10',
    status: 'Inactive',
  },
  {
    id: 'CUST-005',
    name: 'Alex Wilson',
    email: 'alex@example.com',
    phone: '+1 234 567 8904',
    ordersCount: 12,
    totalSpent: 2450.0,
    lastOrder: '2026-03-08',
    joinDate: '2024-03-15',
    status: 'Active',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'spent'>('name');

  const filteredCustomers = customers
    .filter((customer) => customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'orders') return b.ordersCount - a.ordersCount;
      return b.totalSpent - a.totalSpent;
    });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Customers
        </h1>
        <p style={{ color: '#6b7280' }}>View and manage your customer relationships.</p>
      </div>

      {/* Search and Sort */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'orders' | 'spent')}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="orders">Sort by Orders</option>
          <option value="spent">Sort by Total Spent</option>
        </select>
      </div>

      {/* Customers Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Name
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Contact
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Orders
                </th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Total Spent
                </th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Last Order
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Status
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600', color: '#6b7280', fontSize: '0.875rem' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937' }}>{customer.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{customer.email}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{customer.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#1f2937', fontWeight: '600' }}>
                    {customer.ordersCount}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#f97316' }}>
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{customer.lastOrder}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: customer.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                        color: customer.status === 'Active' ? '#166534' : '#6b7280',
                      }}
                    >
                      {customer.status}
                    </span>
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
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            No customers found.
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Customers</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{customers.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Customers</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
            {customers.filter((c) => c.status === 'Active').length}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Revenue</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}