'use client';

import React, { useMemo, useState } from 'react';
import { MagnifyingGlassIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface Payment {
  id: string;
  catererId: string;
  catererName: string;
  amount: number;
  type: 'received' | 'refund' | 'payout';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  orderId?: string;
  description: string;
}

export default function PaymentsAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaymentType, setFilterPaymentType] = useState<'all' | 'received' | 'refund' | 'payout'>('all');

  const [payments] = useState<Payment[]>([
    {
      id: 'pay1',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      amount: 15000,
      type: 'received',
      date: '2024-03-22 02:30 PM',
      status: 'completed',
      orderId: 'ORD001',
      description: 'Payment received from order ORD001',
    },
    {
      id: 'pay2',
      catererId: '2',
      catererName: 'Spice Delight',
      amount: 1000,
      type: 'refund',
      date: '2024-03-21 06:20 PM',
      status: 'completed',
      description: 'Refund processed for order ORD002 (partial)',
    },
    {
      id: 'pay3',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      amount: 3200,
      type: 'refund',
      date: '2024-03-20 11:35 AM',
      status: 'completed',
      description: 'Refund processed for order ORD003',
    },
    {
      id: 'pay4',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      amount: 28500,
      type: 'payout',
      date: '2024-03-19 10:00 AM',
      status: 'completed',
      description: 'Monthly payout to caterer',
    },
    {
      id: 'pay5',
      catererId: '2',
      catererName: 'Spice Delight',
      amount: 12000,
      type: 'payout',
      date: '2024-03-22 03:00 PM',
      status: 'pending',
      description: 'Pending payout to caterer',
    },
  ]);

  const filteredPayments = useMemo(() => {
    let filtered = payments.filter((p) => {
      const matchesSearch =
        p.catererName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterPaymentType === 'all' || p.type === filterPaymentType;

      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered;
  }, [payments, searchQuery, filterPaymentType]);

  const getPaymentTypeBadge = (type: string) => {
    const types: Record<string, any> = {
      received: { bg: '#dcfce7', color: '#166534', label: '💰 Received', icon: '📥' },
      refund: { bg: '#fee2e2', color: '#991b1b', label: '↩️ Refund', icon: '🔄' },
      payout: { bg: '#dbeafe', color: '#0c4a6e', label: '💳 Payout', icon: '📤' },
    };

    const typeInfo = types[type] || types.received;

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: typeInfo.bg,
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          color: typeInfo.color,
        }}
      >
        {typeInfo.label}
      </div>
    );
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          💳 Payments Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Track and manage all payment transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              📥
            </div>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', margin: 0, textTransform: 'uppercase' }}>
              Payments Received
            </h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
            ₹{payments.filter(p => p.type === 'received' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            {payments.filter(p => p.type === 'received').length} transactions
          </p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🔄
            </div>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', margin: 0, textTransform: 'uppercase' }}>
              Refunds Processed
            </h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
            ₹{payments.filter(p => p.type === 'refund' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            {payments.filter(p => p.type === 'refund').length} transactions
          </p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              📤
            </div>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', margin: 0, textTransform: 'uppercase' }}>
              Pending Payouts
            </h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
            ₹{payments.filter(p => p.type === 'payout' && p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            {payments.filter(p => p.type === 'payout' && p.status === 'pending').length} pending
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: '250px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '8px',
            paddingLeft: '12px',
            paddingRight: '12px',
            backgroundColor: 'white',
            border: '2px solid #e2e8f0',
            height: '40px',
          }}
        >
          <MagnifyingGlassIcon style={{ width: '18px', height: '18px', color: '#94a3b8', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by caterer or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: '#1e293b',
              minWidth: '0',
            }}
          />
        </div>

        <select
          value={filterPaymentType}
          onChange={(e) => setFilterPaymentType(e.target.value as any)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#1e293b',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Types</option>
          <option value="received">💰 Received</option>
          <option value="refund">↩️ Refund</option>
          <option value="payout">💳 Payout</option>
        </select>
      </div>

      {/* PAYMENTS TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Caterer
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Type
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Amount
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Description
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>
                    {payment.catererName}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {getPaymentTypeBadge(payment.type)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>
                    {payment.description}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: payment.status === 'completed' ? '#dcfce7' : payment.status === 'failed' ? '#fee2e2' : '#fef3c7',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: payment.status === 'completed' ? '#166534' : payment.status === 'failed' ? '#991b1b' : '#92400e',
                      }}
                    >
                      {payment.status === 'completed' ? '✓' : payment.status === 'failed' ? '✗' : '⏳'} {payment.status === 'completed' ? 'Completed' : payment.status === 'failed' ? 'Failed' : 'Pending'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}