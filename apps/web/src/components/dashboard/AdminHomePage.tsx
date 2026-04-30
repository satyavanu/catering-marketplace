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
  DocumentCheckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ArrowPathIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface VerificationNote {
  id: string;
  author: string;
  role: 'admin' | 'caterer';
  timestamp: string;
  content: string;
  type: 'note' | 'comment' | 'rejection_reason';
}

interface VerificationDetail {
  item: string;
  status: 'verified' | 'failed' | 'pending';
  verifiedDate?: string;
  failureReason?: string;
  documents?: string[];
  notes: VerificationNote[];
}

interface Caterer {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  businessType: string;
  registrationDate: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  emailVerified: boolean;
  phoneVerified: boolean;
  bankVerified: boolean;
  documentVerified: boolean;
  foodLicenseVerified: boolean;
  aadhaarVerified: boolean;
  verificationScore: number;
  verificationDetails: VerificationDetail[];
  rejectionReason?: string;
  communicationHistory: VerificationNote[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationType: 'customer' | 'caterer';
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  accountCreatedDate: string;
  totalOrders?: number;
  totalSpent?: number;
  lastActivity: string;
  suspensionReason?: string;
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

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'caterers' | 'users' | 'refunds' | 'payments'>('caterers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');
  const [filterUserStatus, setFilterUserStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [filterRefundStatus, setFilterRefundStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [filterPaymentType, setFilterPaymentType] = useState<'all' | 'received' | 'refund' | 'payout'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'score'>('recent');
  const [sortUserBy, setSortUserBy] = useState<'recent' | 'name' | 'activity'>('recent');
  const [selectedCaterer, setSelectedCaterer] = useState<Caterer | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newNote, setNewNote] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [refundApprovalType, setRefundApprovalType] = useState<'full' | 'partial'>('full');
  const [partialRefundAmount, setPartialRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');

  // Mock data with detailed verification
  const [caterers] = useState<Caterer[]>([
    {
      id: '1',
      businessName: 'Tasty Kitchen',
      ownerName: 'Raj Kumar',
      email: 'raj@tasty.com',
      phone: '+91-9876543210',
      location: 'New Delhi',
      businessType: 'North Indian',
      registrationDate: '2024-03-15',
      verificationStatus: 'verified',
      emailVerified: true,
      phoneVerified: true,
      bankVerified: true,
      documentVerified: true,
      foodLicenseVerified: true,
      aadhaarVerified: true,
      verificationScore: 100,
      verificationDetails: [
        {
          item: 'Email Verification',
          status: 'verified',
          verifiedDate: '2024-03-15 10:30 AM',
          documents: [],
          notes: [
            {
              id: '1',
              author: 'System',
              role: 'admin',
              timestamp: '2024-03-15 10:30 AM',
              content: 'Email verified successfully via OTP',
              type: 'note',
            },
          ],
        },
      ],
      communicationHistory: [
        {
          id: 'c1',
          author: 'System',
          role: 'admin',
          timestamp: '2024-03-15 09:00 AM',
          content: 'Welcome! Your registration has been received.',
          type: 'note',
        },
      ],
    },
    {
      id: '2',
      businessName: 'Spice Delight',
      ownerName: 'Priya Singh',
      email: 'priya@spice.com',
      phone: '+91-9876543211',
      location: 'Mumbai',
      businessType: 'Multi-Cuisine',
      registrationDate: '2024-03-18',
      verificationStatus: 'failed',
      emailVerified: true,
      phoneVerified: false,
      bankVerified: false,
      documentVerified: true,
      foodLicenseVerified: true,
      aadhaarVerified: false,
      verificationScore: 33,
      rejectionReason: 'Phone number verification failed. Aadhaar details do not match.',
      verificationDetails: [],
      communicationHistory: [
        {
          id: 'c4',
          author: 'System',
          role: 'admin',
          timestamp: '2024-03-18 10:30 AM',
          content: 'Registration received. Verification in progress.',
          type: 'note',
        },
      ],
    },
  ]);

  const [users] = useState<User[]>([
    {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91-9876543220',
      registrationType: 'customer',
      registrationDate: '2024-02-15',
      accountCreatedDate: '2024-02-15',
      status: 'active',
      lastLogin: '2024-03-22 10:30 AM',
      lastActivity: '2024-03-22 10:45 AM',
      totalOrders: 12,
      totalSpent: 45000,
    },
    {
      id: 'u2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+91-9876543221',
      registrationType: 'caterer',
      registrationDate: '2024-03-01',
      accountCreatedDate: '2024-03-01',
      status: 'active',
      lastLogin: '2024-03-21 03:20 PM',
      lastActivity: '2024-03-21 03:45 PM',
      totalOrders: 28,
      totalSpent: 125000,
    },
    {
      id: 'u3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+91-9876543222',
      registrationType: 'customer',
      registrationDate: '2024-01-20',
      accountCreatedDate: '2024-01-20',
      status: 'inactive',
      lastLogin: '2024-02-28 11:15 AM',
      lastActivity: '2024-02-28 11:30 AM',
      totalOrders: 5,
      totalSpent: 18000,
    },
    {
      id: 'u4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+91-9876543223',
      registrationType: 'caterer',
      registrationDate: '2024-03-10',
      accountCreatedDate: '2024-03-10',
      status: 'suspended',
      lastLogin: '2024-03-15 02:30 PM',
      lastActivity: '2024-03-15 02:45 PM',
      totalOrders: 8,
      totalSpent: 42000,
      suspensionReason: 'Multiple complaints received regarding food quality and delivery delays.',
    },
    {
      id: 'u5',
      name: 'Anil Kumar',
      email: 'anil@example.com',
      phone: '+91-9876543224',
      registrationType: 'customer',
      registrationDate: '2024-02-05',
      accountCreatedDate: '2024-02-05',
      status: 'active',
      lastLogin: '2024-03-22 02:00 PM',
      lastActivity: '2024-03-22 02:15 PM',
      totalOrders: 18,
      totalSpent: 62000,
    },
  ]);

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
        {
          id: 'n4',
          author: 'System',
          role: 'admin',
          timestamp: '2024-03-20 11:30 AM',
          content: 'Refund amount ₹3,200 credited to customer account.',
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

  const filteredCaterers = useMemo(() => {
    let filtered = caterers.filter((c) => {
      const matchesSearch =
        c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || c.verificationStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.businessName.localeCompare(b.businessName));
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => b.verificationScore - a.verificationScore);
    }

    return filtered;
  }, [caterers, searchQuery, filterStatus, sortBy]);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery);

      const matchesStatus = filterUserStatus === 'all' || u.status === filterUserStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortUserBy === 'recent') {
      filtered.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    } else if (sortUserBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortUserBy === 'activity') {
      filtered.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    }

    return filtered;
  }, [users, searchQuery, filterUserStatus, sortUserBy]);

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

  // ...existing code...
  const getVerificationBadge = (status: string) => {
    const badges: Record<string, any> = {
      verified: {
        bg: '#dcfce7',
        color: '#166534',
        icon: CheckCircleIcon,
        label: 'Verified',
      },
      pending: {
        bg: '#fef3c7',
        color: '#92400e',
        icon: ClockIcon,
        label: 'Pending',
      },
      failed: {
        bg: '#fee2e2',
        color: '#991b1b',
        icon: XCircleIcon,
        label: 'Failed',
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

  const getUserStatusBadge = (status: string) => {
    const statuses: Record<string, any> = {
      active: { bg: '#dcfce7', color: '#166534', label: 'Active', icon: '✅' },
      inactive: { bg: '#f3f4f6', color: '#475569', label: 'Inactive', icon: '⏸️' },
      suspended: { bg: '#fee2e2', color: '#991b1b', label: 'Suspended', icon: '🔒' },
    };

    const statusInfo = statuses[status] || statuses.inactive;

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: statusInfo.bg,
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          color: statusInfo.color,
        }}
      >
        {statusInfo.label}
      </div>
    );
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          🔐 Super Admin Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Manage caterers, users, refunds, and payment processes
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('caterers')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'caterers' ? '3px solid #667eea' : 'none',
            color: activeTab === 'caterers' ? '#667eea' : '#94a3b8',
            fontWeight: activeTab === 'caterers' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <BuildingOfficeIcon style={{ width: '18px', height: '18px' }} />
          Caterers ({filteredCaterers.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'users' ? '3px solid #667eea' : 'none',
            color: activeTab === 'users' ? '#667eea' : '#94a3b8',
            fontWeight: activeTab === 'users' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <UserGroupIcon style={{ width: '18px', height: '18px' }} />
          Users ({filteredUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'refunds' ? '3px solid #667eea' : 'none',
            color: activeTab === 'refunds' ? '#667eea' : '#94a3b8',
            fontWeight: activeTab === 'refunds' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <ArrowPathIcon style={{ width: '18px', height: '18px' }} />
          Refunds ({filteredRefunds.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'payments' ? '3px solid #667eea' : 'none',
            color: activeTab === 'payments' ? '#667eea' : '#94a3b8',
            fontWeight: activeTab === 'payments' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <CreditCardIcon style={{ width: '18px', height: '18px' }} />
          Payments ({filteredPayments.length})
        </button>
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
            transition: 'all 0.2s ease',
          }}
        >
          <MagnifyingGlassIcon style={{ width: '18px', height: '18px', color: '#94a3b8', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={
              activeTab === 'caterers'
                ? 'Search by business name, owner, or email...'
                : activeTab === 'users'
                  ? 'Search by name, email, or phone...'
                  : activeTab === 'refunds'
                    ? 'Search by customer, caterer, or order ID...'
                    : 'Search by caterer or description...'
            }
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

        {activeTab === 'caterers' && (
          <>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
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
              <option value="verified">✓ Verified</option>
              <option value="pending">⏳ Pending</option>
              <option value="failed">✗ Failed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
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
              <option value="recent">Most Recent</option>
              <option value="name">Business Name</option>
              <option value="score">Verification Score</option>
            </select>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <select
              value={filterUserStatus}
              onChange={(e) => setFilterUserStatus(e.target.value as any)}
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
              <option value="all">All Status</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⏸️ Inactive</option>
              <option value="suspended">🔒 Suspended</option>
            </select>

            <select
              value={sortUserBy}
              onChange={(e) => setSortUserBy(e.target.value as any)}
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
              <option value="recent">Recently Registered</option>
              <option value="name">Name</option>
              <option value="activity">Last Activity</option>
            </select>
          </>
        )}

        {activeTab === 'refunds' && (
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
        )}

        {activeTab === 'payments' && (
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
        )}
      </div>

      {/* CATERERS TABLE */}
      {activeTab === 'caterers' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Business
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Owner
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Location
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Score
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCaterers.map((caterer) => (
                  <tr key={caterer.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>
                      <div>{caterer.businessName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{caterer.businessType}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                      <div>{caterer.ownerName}</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>{caterer.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{caterer.location}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{getVerificationBadge(caterer.verificationStatus)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor:
                            caterer.verificationScore >= 80
                              ? '#dcfce7'
                              : caterer.verificationScore >= 50
                                ? '#fef3c7'
                                : '#fee2e2',
                          fontSize: '12px',
                          fontWeight: '700',
                          color:
                            caterer.verificationScore >= 80
                              ? '#166534'
                              : caterer.verificationScore >= 50
                                ? '#92400e'
                                : '#991b1b',
                        }}
                      >
                        {caterer.verificationScore}%
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedCaterer(caterer);
                          setShowDetailModal(true);
                          setRejectionReason('');
                          setNewNote('');
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
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      {activeTab === 'users' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Name
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Last Activity
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>
                      <div>{user.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{user.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: user.registrationType === 'caterer' ? '#e0e7ff' : '#f0fdf4',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: user.registrationType === 'caterer' ? '#4f46e5' : '#16a34a',
                          textTransform: 'capitalize',
                        }}
                      >
                        {user.registrationType}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {getUserStatusBadge(user.status)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(user.lastActivity).toLocaleDateString()} <br /> {new Date(user.lastActivity).toLocaleTimeString().slice(0, 5)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
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
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REFUNDS TABLE */}
      {activeTab === 'refunds' && (
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
      )}

      {/* PAYMENTS TABLE */}
      {activeTab === 'payments' && (
        <div>
          {/* Payment Summary Cards */}
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

          {/* Payments Table */}
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
                            backgroundColor: payment.status === 'completed' ? '#dcfce7' : '#fef3c7',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: payment.status === 'completed' ? '#166534' : '#92400e',
                          }}
                        >
                          {payment.status === 'completed' ? '✓' : '⏳'} {payment.status === 'completed' ? 'Completed' : 'Pending'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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

      {/* ...existing modals (CATERER DETAIL MODAL, USER DETAIL MODAL, SUSPENSION REASON MODAL)... */}
    </div>
  );
}