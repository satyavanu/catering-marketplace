'use client';

import React, { useState } from 'react';
import { Order } from '@catering/types';
import { Card, Button } from '@catering/ui';

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    { id: '#ORD001', customer: 'John Smith', guests: 50, amount: '$450', date: '2026-03-11', status: 'Completed' },
    { id: '#ORD002', customer: 'Jane Doe', guests: 30, amount: '$320', date: '2026-03-10', status: 'Processing' },
    { id: '#ORD003', customer: 'Bob Johnson', guests: 75, amount: '$680', date: '2026-03-10', status: 'Pending' },
    { id: '#ORD004', customer: 'Alice Brown', guests: 40, amount: '$390', date: '2026-03-09', status: 'Completed' },
    { id: '#ORD005', customer: 'Charlie Davis', guests: 60, amount: '$550', date: '2026-03-09', status: 'Cancelled' },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Completed: { bg: '#d1fae5', text: '#065f46' },
      Processing: { bg: '#fef3c7', text: '#92400e' },
      Pending: { bg: '#fee2e2', text: '#991b1b' },
      Cancelled: { bg: '#f3f4f6', text: '#4b5563' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#4b5563' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Orders Management
        </h1>
        <Button variant="primary">
          + New Order
        </Button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
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
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
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
      </Card>
    </div>
  );
}