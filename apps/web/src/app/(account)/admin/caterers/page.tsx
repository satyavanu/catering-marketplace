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
} from '@heroicons/react/24/outline';

// ...existing interfaces...
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

export default function CaterersAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'score'>('recent');
  const [selectedCaterer, setSelectedCaterer] = useState<Caterer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newNote, setNewNote] = useState('');

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

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          🏢 Caterers Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Manage and verify caterer registrations
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
            placeholder="Search by business name, owner, or email..."
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
      </div>

      {/* CATERERS TABLE */}
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
    </div>
  );
}