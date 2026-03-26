'use client';

import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface VerificationNote {
  id: string;
  author: string;
  role: 'admin' | 'caterer';
  timestamp: string;
  content: string;
  type: 'note' | 'comment' | 'rejection_reason';
}

interface RefundRequest {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  catererId: string;
  catererName: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvalType?: 'full' | 'partial';
  approvedAmount?: number;
  notes: VerificationNote[];
  orderDetails?: {
    orderDate: string;
    items: string[];
    totalAmount: number;
  };
}

export default function RefundsAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRefundStatus, setFilterRefundStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refundApprovalType, setRefundApprovalType] = useState<'full' | 'partial'>('full');
  const [partialRefundAmount, setPartialRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');

  const [refunds] = useState<RefundRequest[]>([
    {
      id: 'ref1',
      orderId: 'ORD001',
      customerId: 'u1',
      customerName: 'John Doe',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      amount: 2500,
      reason: 'Order not delivered on time',
      requestDate: '2024-03-22 10:30 AM',
      status: 'pending',
      notes: [
        {
          id: 'n1',
          author: 'Customer',
          role: 'caterer',
          timestamp: '2024-03-22 10:30 AM',
          content: 'The order arrived 2 hours late. Requested full refund.',
          type: 'comment',
        },
      ],
      orderDetails: {
        orderDate: '2024-03-22 08:00 AM',
        items: ['Butter Chicken', 'Dal Makhani', 'Naan'],
        totalAmount: 2500,
      },
    },
    {
      id: 'ref2',
      orderId: 'ORD002',
      customerId: 'u3',
      customerName: 'Mike Wilson',
      catererId: '2',
      catererName: 'Spice Delight',
      amount: 1500,
      reason: 'Food quality was poor',
      requestDate: '2024-03-21 05:45 PM',
      status: 'approved',
      approvalType: 'partial',
      approvedAmount: 1000,
      notes: [
        {
          id: 'n2',
          author: 'Admin',
          role: 'admin',
          timestamp: '2024-03-21 06:15 PM',
          content: 'Approved partial refund after review of order details.',
          type: 'note',
        },
      ],
      orderDetails: {
        orderDate: '2024-03-21 01:00 PM',
        items: ['Paneer Tikka', 'Biryani'],
        totalAmount: 1500,
      },
    },
    {
      id: 'ref3',
      orderId: 'ORD003',
      customerId: 'u5',
      customerName: 'Anil Kumar',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      amount: 3200,
      reason: 'Incorrect items delivered',
      requestDate: '2024-03-20 09:15 AM',
      status: 'completed',
      approvalType: 'full',
      approvedAmount: 3200,
      notes: [
        {
          id: 'n3',
          author: 'Admin',
          role: 'admin',
          timestamp: '2024-03-20 09:45 AM',
          content: 'Full refund approved and processed.',
          type: 'note',
        },
      ],
      orderDetails: {
        orderDate: '2024-03-20 07:00 AM',
        items: ['Chicken Tikka Masala', 'Rice'],
        totalAmount: 3200,
      },
    },
  ]);

  const filteredRefunds = useMemo(() => {
    let filtered = refunds.filter((r) => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.catererName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterRefundStatus === 'all' || r.status === filterRefundStatus;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    return filtered;
  }, [refunds, searchQuery, filterRefundStatus]);

  const getRefundStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      pending: {
        bg: '#fef3c7',
        color: '#92400e',
        icon: ClockIcon,
        label: 'Pending',
      },
      approved: {
        bg: '#dbeafe',
        color: '#0c4a6e',
        icon: CheckCircleIcon,
        label: 'Approved',
      },
      rejected: {
        bg: '#fee2e2',
        color: '#991b1b',
        icon: XCircleIcon,
        label: 'Rejected',
      },
      completed: {
        bg: '#dcfce7',
        color: '#166534',
        icon: CheckCircleIcon,
        label: 'Completed',
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: badge.bg,
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          color: badge.color,
        }}
      >
        <Icon style={{ width: '14px', height: '14px' }} />
        {badge.label}
      </div>
    );
  };

  const handleApproveRefund = (refund: RefundRequest) => {
    if (refundApprovalType === 'partial' && !partialRefundAmount.trim()) {
      alert('Please enter the refund amount');
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      const amount = refundApprovalType === 'full' ? refund.amount : parseFloat(partialRefundAmount);
      alert(`✅ Refund ${refundApprovalType === 'full' ? '(Full)' : `(Partial: ₹${amount})`} approved for ${refund.customerName}!`);
      setActionLoading(false);
      setShowRefundModal(false);
      setRefundApprovalType('full');
      setPartialRefundAmount('');
      setRefundNotes('');
    }, 1000);
  };

  const handleRejectRefund = (refund: RefundRequest) => {
    if (!refundNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      alert(`❌ Refund request rejected.\nReason: ${refundNotes}`);
      setActionLoading(false);
      setShowRefundModal(false);
      setRefundNotes('');
    }, 1000);
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          ↩️ Refunds Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Review and process customer refund requests
        </p>
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
            placeholder="Search by customer, caterer, or order ID..."
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
          value={filterRefundStatus}
          onChange={(e) => setFilterRefundStatus(e.target.value as any)}
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
          <option value="all">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="approved">✓ Approved</option>
          <option value="rejected">✗ Rejected</option>
          <option value="completed">✅ Completed</option>
        </select>
      </div>

      {/* REFUNDS TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Order ID
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Customer
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Caterer
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Amount
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map((refund) => (
                <tr key={refund.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {refund.orderId}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                    <div>{refund.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{refund.reason}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                    {refund.catererName}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    ₹{refund.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {getRefundStatusBadge(refund.status)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedRefund(refund);
                        setShowRefundModal(true);
                        setRefundApprovalType('full');
                        setPartialRefundAmount('');
                        setRefundNotes('');
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 12px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        gap: '4px',
                      }}
                    >
                      <EyeIcon style={{ width: '14px', height: '14px' }} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFUND DETAIL MODAL */}
      {showRefundModal && selectedRefund && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setShowRefundModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    Refund Request: {selectedRefund.orderId}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Requested on {new Date(selectedRefund.requestDate).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowRefundModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    fontSize: '24px',
                    color: '#94a3b8',
                  }}
                >
                  ✕
                </button>
              </div>
              {getRefundStatusBadge(selectedRefund.status)}
            </div>

            {/* Details */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
                📋 Refund Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                    Customer
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', margin: '4px 0 0 0' }}>
                    {selectedRefund.customerName}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                    Caterer
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', margin: '4px 0 0 0' }}>
                    {selectedRefund.catererName}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                    Refund Amount
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444', margin: '4px 0 0 0' }}>
                    ₹{selectedRefund.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                    Reason
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', margin: '4px 0 0 0' }}>
                    {selectedRefund.reason}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              {selectedRefund.orderDetails && (
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>
                    📦 Original Order:
                  </p>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Items:</strong> {selectedRefund.orderDetails.items.join(', ')}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Order Date:</strong> {selectedRefund.orderDetails.orderDate}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Total Amount:</strong> ₹{selectedRefund.orderDetails.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Communication History */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                💬 Notes & History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {selectedRefund.notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: note.role === 'admin' ? '#e0e7ff' : '#f0fdf4',
                      borderLeft: `3px solid ${note.role === 'admin' ? '#4f46e5' : '#16a34a'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: note.role === 'admin' ? '#4f46e5' : '#16a34a', margin: 0 }}>
                        {note.author}
                      </p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                        {note.timestamp}
                      </p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#1e293b', margin: 0, lineHeight: '1.4' }}>
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Section */}
            {selectedRefund.status === 'pending' && (
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>
                  ⚙️ Process Refund
                </h3>

                {/* Approval Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Approval Type
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        value="full"
                        checked={refundApprovalType === 'full'}
                        onChange={(e) => {
                          setRefundApprovalType('full');
                          setPartialRefundAmount('');
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', color: '#1e293b' }}>
                        Full Refund (₹{selectedRefund.amount.toLocaleString()})
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        value="partial"
                        checked={refundApprovalType === 'partial'}
                        onChange={(e) => setRefundApprovalType('partial')}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', color: '#1e293b' }}>Partial Refund</span>
                    </label>
                  </div>
                </div>

                {/* Partial Amount */}
                {refundApprovalType === 'partial' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Refund Amount
                    </label>
                    <input
                      type="number"
                      max={selectedRefund.amount}
                      value={partialRefundAmount}
                      onChange={(e) => setPartialRefundAmount(e.target.value)}
                      placeholder={`Max: ₹${selectedRefund.amount}`}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#1e293b',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {/* Notes */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Admin Notes
                  </label>
                  <textarea
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                    placeholder="Add notes about this refund decision..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '8px 12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1e293b',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleApproveRefund(selectedRefund)}
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      opacity: actionLoading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckIcon style={{ width: '18px', height: '18px' }} />
                    {actionLoading ? 'Processing...' : 'Approve Refund'}
                  </button>
                  <button
                    onClick={() => handleRejectRefund(selectedRefund)}
                    disabled={actionLoading || !refundNotes.trim()}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: actionLoading || !refundNotes.trim() ? 'not-allowed' : 'pointer',
                      opacity: actionLoading || !refundNotes.trim() ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <XMarkIcon style={{ width: '18px', height: '18px' }} />
                    Reject Refund
                  </button>
                </div>
              </div>
            )}

            {selectedRefund.status !== 'pending' && (
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {selectedRefund.status === 'completed' ? '✅ Refund Processed' : selectedRefund.status === 'approved' ? '✓ Refund Approved' : '❌ Refund Rejected'}
                  </p>
                  {selectedRefund.approvalType && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                      {selectedRefund.approvalType === 'full' ? 'Full refund' : `Partial refund: ₹${selectedRefund.approvedAmount}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowRefundModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}