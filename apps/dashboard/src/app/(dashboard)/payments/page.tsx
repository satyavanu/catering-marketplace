'use client';

import React, { useState } from 'react';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  // Summary data
  const summaryData = {
    completedPayments: 142,
    totalEarnings: '$15,240',
    marketplaceCommission: '$1,524',
    netEarnings: '$13,716',
  };

  // Transactions data
  const transactions = [
    {
      id: 1,
      orderId: 'ORD-001',
      customerName: 'John Doe',
      amount: '$850',
      commission: '$85',
      earnings: '$765',
      date: '2024-06-15',
      status: 'completed',
      paymentMethod: 'Credit Card',
    },
    {
      id: 2,
      orderId: 'ORD-002',
      customerName: 'Jane Smith',
      amount: '$1,200',
      commission: '$120',
      earnings: '$1,080',
      date: '2024-06-14',
      status: 'completed',
      paymentMethod: 'Debit Card',
    },
    {
      id: 3,
      orderId: 'ORD-003',
      customerName: 'Mike Johnson',
      amount: '$650',
      commission: '$65',
      earnings: '$585',
      date: '2024-06-13',
      status: 'pending',
      paymentMethod: 'PayPal',
    },
    {
      id: 4,
      orderId: 'ORD-004',
      customerName: 'Sarah Williams',
      amount: '$2,100',
      commission: '$210',
      earnings: '$1,890',
      date: '2024-06-12',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 5,
      orderId: 'ORD-005',
      customerName: 'David Brown',
      amount: '$750',
      commission: '$75',
      earnings: '$675',
      date: '2024-06-11',
      status: 'failed',
      paymentMethod: 'Credit Card',
    },
  ];

  // Payouts data
  const payouts = [
    {
      id: 1,
      payoutId: 'PAYOUT-001',
      amount: '$5,000',
      date: '2024-06-10',
      dueDate: '2024-06-15',
      status: 'completed',
      method: 'Bank Transfer',
    },
    {
      id: 2,
      payoutId: 'PAYOUT-002',
      amount: '$4,500',
      date: '2024-05-28',
      dueDate: '2024-06-02',
      status: 'completed',
      method: 'Bank Transfer',
    },
    {
      id: 3,
      payoutId: 'PAYOUT-003',
      amount: '$6,216',
      date: '2024-06-25',
      dueDate: '2024-07-05',
      status: 'pending',
      method: 'Bank Transfer',
    },
    {
      id: 4,
      payoutId: 'PAYOUT-004',
      amount: '$3,800',
      date: '2024-05-15',
      dueDate: '2024-05-20',
      status: 'completed',
      method: 'Bank Transfer',
    },
  ];

  // Invoices data
  const invoices = [
    {
      id: 1,
      invoiceNo: 'INV-2024-001',
      orderId: 'ORD-001',
      amount: '$850',
      issuedDate: '2024-06-15',
      dueDate: '2024-06-22',
      status: 'paid',
      customer: 'John Doe',
    },
    {
      id: 2,
      invoiceNo: 'INV-2024-002',
      orderId: 'ORD-002',
      amount: '$1,200',
      issuedDate: '2024-06-14',
      dueDate: '2024-06-21',
      status: 'paid',
      customer: 'Jane Smith',
    },
    {
      id: 3,
      invoiceNo: 'INV-2024-003',
      orderId: 'ORD-003',
      amount: '$650',
      issuedDate: '2024-06-13',
      dueDate: '2024-06-20',
      status: 'pending',
      customer: 'Mike Johnson',
    },
    {
      id: 4,
      invoiceNo: 'INV-2024-004',
      orderId: 'ORD-004',
      amount: '$2,100',
      issuedDate: '2024-06-12',
      dueDate: '2024-06-19',
      status: 'paid',
      customer: 'Sarah Williams',
    },
    {
      id: 5,
      invoiceNo: 'INV-2024-005',
      orderId: 'ORD-005',
      amount: '$750',
      issuedDate: '2024-06-11',
      dueDate: '2024-06-18',
      status: 'overdue',
      customer: 'David Brown',
    },
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

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
    margin: 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return { bg: '#dcfce7', text: '#166534', badge: '✓' };
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e', badge: '⏳' };
      case 'failed':
      case 'overdue':
        return { bg: '#fee2e2', text: '#991b1b', badge: '✕' };
      default:
        return { bg: '#f0f0f0', text: '#666', badge: '•' };
    }
  };

  const filteredTransactions = transactions.filter(
    (t) => filterStatus === 'all' || t.status === filterStatus
  );

  const filteredInvoices = invoices.filter(
    (i) => filterStatus === 'all' || i.status === filterStatus
  );

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', margin: 0 }}>
        Payments & Payouts
      </h1>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
            ✓ Completed Payments
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {summaryData.completedPayments}
          </p>
          <p style={{ color: '#10b981', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
            Total transactions processed
          </p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
            💰 Total Earnings
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            {summaryData.totalEarnings}
          </p>
          <p style={{ color: '#3b82f6', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
            Before commission
          </p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
            🏪 Marketplace Commission
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316', margin: 0 }}>
            {summaryData.marketplaceCommission}
          </p>
          <p style={{ color: '#f97316', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
            10% commission deducted
          </p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
            🎉 Net Earnings
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>
            {summaryData.netEarnings}
          </p>
          <p style={{ color: '#8b5cf6', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
            Your take-home amount
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={tabsStyle}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'transactions', label: '📋 Transactions' },
          { id: 'payouts', label: '💳 Payouts' },
          { id: 'invoices', label: '📄 Invoices' },
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
          {/* Earnings Breakdown */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>💹 Earnings Breakdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
                  Monthly Revenue
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '1rem' }}>
                  {[
                    { month: 'Jan', value: 8500 },
                    { month: 'Feb', value: 9200 },
                    { month: 'Mar', value: 8800 },
                    { month: 'Apr', value: 10200 },
                    { month: 'May', value: 12500 },
                    { month: 'Jun', value: 15240 },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${(item.value / 15240) * 200}px`,
                          backgroundColor: '#667eea',
                          borderRadius: '0.5rem 0.5rem 0 0',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#5568d3';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#667eea';
                        }}
                      />
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                        {item.month}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
                  Commission Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { label: 'Total Revenue', amount: '$15,240', color: '#3b82f6' },
                    { label: 'Commission (10%)', amount: '-$1,524', color: '#ef4444' },
                    { label: 'Net Earnings', amount: '$13,716', color: '#10b981' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: 500 }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: item.color }}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={sectionTitleStyle}>📋 All Transactions</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
                <option value="all">All Transactions</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Order ID
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Customer
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Amount
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Commission
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Your Earnings
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Date
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((trans, idx) => {
                    const statusColor = getStatusColor(trans.status);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: 500 }}>
                          {trans.orderId}
                        </td>
                        <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>
                          {trans.customerName}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#3b82f6', fontWeight: 600 }}>
                          {trans.amount}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
                          {trans.commission}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                          {trans.earnings}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                          {trans.date}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {statusColor.badge} {trans.status}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <h2 style={sectionTitleStyle}>💳 Payout History</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {payouts.map((payout, idx) => {
                const statusColor = getStatusColor(payout.status);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
                        {payout.payoutId}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {payout.date} • {payout.method}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981', fontSize: '1.125rem' }}>
                          {payout.amount}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                          Due: {payout.dueDate}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          minWidth: '120px',
                          justifyContent: 'center',
                        }}
                      >
                        {statusColor.badge} {payout.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ecf0ff', borderRadius: '0.5rem', borderLeft: '4px solid #667eea' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#4c51bf' }}>
                💡 Payouts are processed every 2 weeks. Your next payout is scheduled for June 25, 2024.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={sectionTitleStyle}>📄 Invoices</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
                <option value="all">All Invoices</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Invoice No
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Customer
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Amount
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Issued Date
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Due Date
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Status
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, idx) => {
                    const statusColor = getStatusColor(invoice.status);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: 600 }}>
                          {invoice.invoiceNo}
                        </td>
                        <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>
                          {invoice.customer}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                          {invoice.amount}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                          {invoice.issuedDate}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                          {invoice.dueDate}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {statusColor.badge} {invoice.status}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: '#ecf0ff',
                              color: '#667eea',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#dbe9ff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ecf0ff';
                            }}
                          >
                            📥 Download
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}