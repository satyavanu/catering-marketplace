'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Quote {
  id: string;
  slug: string;
  catererName: string;
  catererImage: string;
  catererEmail: string;
  catererPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  quotedPrice: number;
  depositAmount: number;
  items: QuoteItem[];
  specialRequirements: string;
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
}

interface StatusBadge {
  bg: string;
  color: string;
  label: string;
  icon: React.ReactNode;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'paid'>('all');

  useEffect(() => {
    const mockQuotes: Quote[] = [
      {
        id: 'q1',
        slug: 'gourmet-delights-corporate-lunch',
        catererName: 'Gourmet Delights',
        catererImage: 'https://i.pravatar.cc/150?img=5',
        catererEmail: 'contact@gourmetdelights.com',
        catererPhone: '+1 (555) 555-0123',
        eventType: 'Corporate Lunch',
        eventDate: '2026-04-15',
        guestCount: 50,
        status: 'approved',
        quotedPrice: 2500,
        depositAmount: 750,
        items: [
          { id: 'i1', name: 'Grilled Chicken Breast', quantity: 50, unitPrice: 12 },
          { id: 'i2', name: 'Seasonal Vegetables', quantity: 50, unitPrice: 5 },
          { id: 'i3', name: 'Gourmet Desserts', quantity: 50, unitPrice: 8 },
        ],
        specialRequirements: 'Gluten-free options for 5 guests',
        createdAt: '2026-03-10',
        approvedAt: '2026-03-12',
        notes: 'Looking forward to catering your event!',
      },
      {
        id: 'q2',
        slug: 'organic-farm-table-wedding',
        catererName: 'Organic Farm Table',
        catererImage: 'https://i.pravatar.cc/150?img=6',
        catererEmail: 'info@farmtable.com',
        catererPhone: '+1 (555) 555-0124',
        eventType: 'Wedding Reception',
        eventDate: '2026-05-20',
        guestCount: 150,
        status: 'pending',
        quotedPrice: 7500,
        depositAmount: 2250,
        items: [
          { id: 'i4', name: 'Organic Grass-fed Beef', quantity: 150, unitPrice: 28 },
          { id: 'i5', name: 'Fresh Garden Salad', quantity: 150, unitPrice: 8 },
          { id: 'i6', name: 'Artisan Dessert Selection', quantity: 150, unitPrice: 15 },
        ],
        specialRequirements: 'Vegan menu for 20 guests, organic certification required',
        createdAt: '2026-03-08',
      },
      {
        id: 'q3',
        slug: 'quick-bites-office-party',
        catererName: 'Quick Bites Catering',
        catererImage: 'https://i.pravatar.cc/150?img=7',
        catererEmail: 'hello@quickbites.com',
        catererPhone: '+1 (555) 555-0125',
        eventType: 'Office Party',
        eventDate: '2026-04-05',
        guestCount: 30,
        status: 'rejected',
        quotedPrice: 900,
        depositAmount: 270,
        items: [
          { id: 'i7', name: 'Sandwich Platters', quantity: 30, unitPrice: 15 },
          { id: 'i8', name: 'Chips & Dips', quantity: 30, unitPrice: 5 },
        ],
        specialRequirements: 'None',
        createdAt: '2026-03-06',
        notes: 'Unable to accommodate your event date. Sorry!',
      },
      {
        id: 'q4',
        slug: 'gourmet-delights-birthday-party',
        catererName: 'Gourmet Delights',
        catererImage: 'https://i.pravatar.cc/150?img=5',
        catererEmail: 'contact@gourmetdelights.com',
        catererPhone: '+1 (555) 555-0123',
        eventType: 'Birthday Party',
        eventDate: '2026-03-30',
        guestCount: 40,
        status: 'paid',
        quotedPrice: 1800,
        depositAmount: 540,
        items: [
          { id: 'i9', name: 'Premium Buffet Package', quantity: 40, unitPrice: 35 },
          { id: 'i10', name: 'Birthday Cake', quantity: 1, unitPrice: 150 },
        ],
        specialRequirements: 'Allergy-friendly options',
        createdAt: '2026-02-28',
        approvedAt: '2026-03-01',
        paidAt: '2026-03-05',
      },
    ];

    setQuotes(mockQuotes);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string): StatusBadge => {
    const badges: { [key: string]: StatusBadge } = {
      pending: {
        bg: '#fef3c7',
        color: '#92400e',
        label: 'Pending',
        icon: <ClockIcon style={{ width: '16px', height: '16px' }} />,
      },
      approved: {
        bg: '#dbeafe',
        color: '#0c4a6e',
        label: 'Approved',
        icon: <CheckCircleIcon style={{ width: '16px', height: '16px' }} />,
      },
      rejected: {
        bg: '#fee2e2',
        color: '#991b1b',
        label: 'Rejected',
        icon: <XCircleIcon style={{ width: '16px', height: '16px' }} />,
      },
      paid: {
        bg: '#dcfce7',
        color: '#166534',
        label: 'Paid',
        icon: <CheckCircleIcon style={{ width: '16px', height: '16px' }} />,
      },
    };

    return badges[status] || badges.pending;
  };

  const filteredQuotes = filterStatus === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === filterStatus);

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading quotes...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          My Quotes
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
          Manage catering quotes and track approvals
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected', 'paid'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filterStatus === status ? '#667eea' : '#f1f5f9',
              color: filterStatus === status ? 'white' : '#64748b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }
            }}
          >
            {status === 'all' ? 'All Quotes' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span style={{ marginLeft: '6px', fontSize: '12px' }}>
                ({quotes.filter(q => q.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quotes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredQuotes.length === 0 ? (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0 }}>
              No quotes found for this status
            </p>
          </div>
        ) : (
          filteredQuotes.map((quote) => {
            const badge = getStatusBadge(quote.status);
            const daysUntilEvent = Math.ceil(
              (new Date(quote.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Link
                key={quote.id}
                href={`/customer/quotes/${quote.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {/* Caterer Image */}
                    <img
                      src={quote.catererImage}
                      alt={quote.catererName}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '2px solid #e2e8f0',
                        flexShrink: 0,
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '12px',
                          marginBottom: '6px',
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                            {quote.catererName}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
                            {quote.eventType} • {quote.guestCount} guests
                          </p>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '6px',
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {badge.icon}
                            {badge.label}
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          fontSize: '12px',
                        }}
                      >
                        <div>
                          <span style={{ color: '#94a3b8' }}>Event: </span>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>
                            {new Date(quote.eventDate).toLocaleDateString()}
                          </span>
                          {daysUntilEvent > 0 && (
                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                              {' '}({daysUntilEvent} days)
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <div>
                          <span style={{ color: '#94a3b8' }}>Total: </span>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>
                            ${quote.quotedPrice.toLocaleString()}
                          </span>
                        </div>
                        {quote.status === 'approved' && !quote.paidAt && (
                          <>
                            <span style={{ color: '#94a3b8' }}>•</span>
                            <div>
                              <span style={{ color: '#94a3b8' }}>Deposit: </span>
                              <span style={{ fontWeight: '600', color: '#0c4a6e' }}>
                                ${quote.depositAmount.toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#f1f5f9',
                        color: '#667eea',
                        flexShrink: 0,
                      }}
                    >
                      <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Empty State */}
      {quotes.length === 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
          }}
        >
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>
            No quotes yet
          </p>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Start requesting quotes from caterers to get started
          </p>
        </div>
      )}
    </div>
  );
}