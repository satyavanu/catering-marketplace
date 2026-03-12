'use client';

import React, { useState } from 'react';
import { Customer } from '@catering/types';
import { Card, Button } from '@catering/ui';

export default function CustomersPage() {
  const [customers] = useState<Customer[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101', orders: 5, totalSpent: '$2,250' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0102', orders: 3, totalSpent: '$1,500' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', phone: '+1-555-0103', orders: 8, totalSpent: '$4,200' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1-555-0104', orders: 2, totalSpent: '$890' },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Customer Management
        </h1>
        <Button variant="primary">
          + Add Customer
        </Button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
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
                <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{customer.name}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{customer.email}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{customer.phone}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>{customer.orders}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600'}}>{customer.totalSpent}</td>
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
      </Card>
    </div>
  );
}