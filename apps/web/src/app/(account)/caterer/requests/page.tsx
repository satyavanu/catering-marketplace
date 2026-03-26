'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  mealType: string;
  mealsPerWeek: number;
  duration: number;
  quotedPrice: number;
  originalPrice: number;
  status: QuoteStatus;
  deliveryDays: string[];
  specialRequirements?: string;
  createdAt: string;
  expiresAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  startDate?: string;
}

const MOCK_QUOTES: Quote[] = [
  {
    id: 'QT-001',
    customerId: 'CUST-001',
    customerName: 'Raj Kumar',
    customerEmail: 'raj@example.com',
    customerPhone: '+91-9876543210',
    customerAddress: '123 Park Street, Kolkata, 700016',
    mealType: 'Lunch Pro Plan',
    mealsPerWeek: 5,
    duration: 30,
    quotedPrice: 7500,
    originalPrice: 7999,
    status: 'pending',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    specialRequirements: 'Less oil, more vegetables',
    createdAt: '2026-03-15',
    expiresAt: '2026-03-25',
  },
  {
    id: 'QT-002',
    customerId: 'CUST-002',
    customerName: 'Priya Singh',
    customerEmail: 'priya@example.com',
    customerPhone: '+91-9876543211',
    customerAddress: '456 Elm Road, Kolkata, 700020',
    mealType: 'All-Day Combo',
    mealsPerWeek: 7,
    duration: 30,
    quotedPrice: 17999,
    originalPrice: 18999,
    status: 'approved',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    createdAt: '2026-03-10',
    expiresAt: '2026-03-20',
    approvedAt: '2026-03-18',
    startDate: '2026-03-25',
  },
  {
    id: 'QT-003',
    customerId: 'CUST-003',
    customerName: 'Arun Patel',
    customerEmail: 'arun@example.com',
    customerPhone: '+91-9876543212',
    customerAddress: '789 Oak Lane, Kolkata, 700030',
    mealType: 'Breakfast Bundle',
    mealsPerWeek: 5,
    duration: 30,
    quotedPrice: 4500,
    originalPrice: 4999,
    status: 'approved',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    createdAt: '2026-03-12',
    expiresAt: '2026-03-22',
    approvedAt: '2026-03-15',
    startDate: '2026-03-28',
  },
];

const statusConfig = {
  pending: { color: '#f59e0b', bg: '#fef3c7', icon: ClockIcon, label: 'Pending Approval' },
  approved: { color: '#10b981', bg: '#dcfce7', icon: CheckCircleIcon, label: 'Approved' },
  rejected: { color: '#ef4444', bg: '#fee2e2', icon: XCircleIcon, label: 'Rejected' },
  expired: { color: '#6b7280', bg: '#f3f4f6', icon: ClockIcon, label: 'Expired' },
};

export default function RequestsPage() {
  const [currentView, setCurrentView] = useState<'caterer' | 'customer'>('caterer');
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | QuoteStatus>('all');
  const [calendarView, setCalendarView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const filteredQuotes = useMemo(() => {
    if (filterStatus === 'all') return quotes;
    return quotes.filter(q => q.status === filterStatus);
  }, [quotes, filterStatus]);

  // Get approved quotes for calendar
  const approvedQuotes = useMemo(() => {
    return quotes.filter(q => q.status === 'approved' && q.startDate);
  }, [quotes]);

  const handleApproveQuote = (quoteId: string) => {
    setQuotes(quotes.map(q => 
      q.id === quoteId 
        ? { 
            ...q, 
            status: 'approved', 
            approvedAt: new Date().toISOString().split('T')[0],
            startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          }
        : q
    ));
  };

  const handleRejectQuote = (quoteId: string, reason: string) => {
    setQuotes(quotes.map(q => 
      q.id === quoteId 
        ? { ...q, status: 'rejected', rejectionReason: reason }
        : q
    ));
  };

  const handleConvertToSubscription = (quote: Quote) => {
    console.log('Converting quote to subscription:', quote);
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDeliveriesForDate = (dateStr: string) => {
    return approvedQuotes.filter(quote => {
      if (!quote.startDate) return false;
      const startDate = new Date(quote.startDate);
      const endDate = new Date(startDate.getTime() + quote.duration * 24 * 60 * 60 * 1000);
      const checkDate = new Date(dateStr);
      
      const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' });
      return checkDate >= startDate && checkDate <= endDate && quote.deliveryDays.includes(dayName);
    });
  };

  // Calendar Component
  const CalendarView = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const deliveries = getDeliveriesForDate(dateStr);
      days.push({ date: dateStr, deliveries });
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            📅 Delivery Calendar
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', minWidth: '120px', textAlign: 'center' }}>
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '12px' }}>
          {weekDays.map(day => (
            <div key={day} style={{ textAlign: 'center', fontWeight: '700', color: '#64748b', fontSize: '12px', padding: '8px' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} style={{ minHeight: '120px' }} />;
            }

            const { date, deliveries } = day;
            const today = new Date().toISOString().split('T')[0];
            const isToday = date === today;

            return (
              <div
                key={date}
                style={{
                  backgroundColor: isToday ? '#dbeafe' : '#f8fafc',
                  border: `2px solid ${isToday ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '8px',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Date Number */}
                <div style={{ fontSize: '12px', fontWeight: '700', color: isToday ? '#2563eb' : '#64748b', marginBottom: '6px' }}>
                  {parseInt(date.split('-')[2])}
                </div>

                {/* Deliveries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
                  {deliveries.length === 0 ? (
                    <p style={{ fontSize: '9px', color: '#cbd5e1', margin: 0 }}>-</p>
                  ) : (
                    deliveries.map((delivery, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          fontSize: '8px',
                          fontWeight: '700',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        title={delivery.customerName}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#667eea';
                        }}
                      >
                        {delivery.customerName}
                      </div>
                    ))
                  )}
                </div>

                {/* Delivery Count Badge */}
                {deliveries.length > 0 && (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#2563eb', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '3px', display: 'inline-block' }}>
                      {deliveries.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#667eea', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Active Deliveries</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#dbeafe', border: '2px solid #2563eb', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Today</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>No Deliveries</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
          📋 Quote Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          {currentView === 'caterer' 
            ? 'Review, approve and manage customer quote requests'
            : 'Track your quote requests'}
        </p>
      </div>

  

      {/* CATERER VIEW */}
      {currentView === 'caterer' && (
        <>
          {/* Calendar View */}
          {calendarView && <CalendarView />}

          {/* Status Filter */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['all', 'pending', 'approved', 'rejected', 'expired'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: filterStatus === status ? 'none' : '1px solid #e2e8f0',
                  backgroundColor: filterStatus === status ? '#667eea' : 'white',
                  color: filterStatus === status ? 'white' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textTransform: 'capitalize',
                }}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>

          {/* Quotes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredQuotes.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>No quotes found</p>
              </div>
            ) : (
              filteredQuotes.map(quote => {
                const isExpanded = expandedQuote === quote.id;
                const config = statusConfig[quote.status];

                return (
                  <div
                    key={quote.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Quote Header */}
                    <button
                      onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
                      style={{
                        width: '100%',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Status Badge */}
                      <div
                        style={{
                          padding: '8px 12px',
                          backgroundColor: config.bg,
                          color: config.color,
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {config.label}
                      </div>

                      {/* Quote Info */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0, marginBottom: '4px' }}>
                          {quote.customerName}
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b' }}>
                          <span>{quote.mealType}</span>
                          <span>•</span>
                          <span>{quote.mealsPerWeek}x/week</span>
                          <span>•</span>
                          <span>{quote.deliveryDays.length} days</span>
                        </div>
                      </div>

                      {/* Price & Toggle */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                        <p style={{ fontSize: '18px', fontWeight: '900', color: '#667eea', margin: 0 }}>
                          ₹{quote.quotedPrice}
                        </p>
                        {isExpanded ? (
                          <ChevronUpIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                        ) : (
                          <ChevronDownIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div style={{ padding: '20px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Customer Details */}
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' }}>
                            👤 Customer Details
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Name</p>
                              <p style={{ fontSize: '12px', color: '#1e293b', margin: 0 }}>{quote.customerName}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Email</p>
                              <p style={{ fontSize: '12px', color: '#1e293b', margin: 0 }}>{quote.customerEmail}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Phone</p>
                              <p style={{ fontSize: '12px', color: '#1e293b', margin: 0 }}>{quote.customerPhone}</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Address</p>
                              <p style={{ fontSize: '12px', color: '#1e293b', margin: 0 }}>{quote.customerAddress}</p>
                            </div>
                          </div>
                        </div>

                        {/* Quote Details */}
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' }}>
                            📦 Quote Details
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Plan</p>
                              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{quote.mealType}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Meals/Week</p>
                              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{quote.mealsPerWeek}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Duration</p>
                              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{quote.duration} days</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Delivery Days</p>
                              <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                {quote.deliveryDays.map(d => d.slice(0, 3)).join(', ')}
                              </p>
                            </div>
                          </div>

                          {quote.specialRequirements && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                Special Requirements
                              </p>
                              <p style={{ fontSize: '12px', color: '#1e293b', margin: 0, padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '3px solid #2563eb' }}>
                                {quote.specialRequirements}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Pricing */}
                        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' }}>
                            💰 Pricing
                          </h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Original Price</span>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>₹{quote.originalPrice}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #bfdbfe' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Quoted Price</span>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>₹{quote.quotedPrice}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Discount</span>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>₹{quote.originalPrice - quote.quotedPrice} ({Math.round(((quote.originalPrice - quote.quotedPrice) / quote.originalPrice) * 100)}%)</span>
                          </div>
                        </div>

                        {/* Approval Actions */}
                        {quote.status === 'pending' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button
                              onClick={() => handleApproveQuote(quote.id)}
                              style={{
                                padding: '12px 16px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '13px',
                              }}
                            >
                              ✓ Approve Quote
                            </button>
                            <button
                              onClick={() => handleRejectQuote(quote.id, 'Does not meet our requirements')}
                              style={{
                                padding: '12px 16px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '13px',
                              }}
                            >
                              ✕ Reject Quote
                            </button>
                          </div>
                        )}

                        {quote.status === 'approved' && (
                          <button
                            onClick={() => handleConvertToSubscription(quote)}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              backgroundColor: '#667eea',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px',
                            }}
                          >
                            🔄 Convert to Subscription
                          </button>
                        )}

                        {quote.status === 'rejected' && quote.rejectionReason && (
                          <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                            <p style={{ fontSize: '12px', color: '#991b1b', margin: 0 }}>
                              <strong>Rejection Reason:</strong> {quote.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
      
    </div>
  );
}