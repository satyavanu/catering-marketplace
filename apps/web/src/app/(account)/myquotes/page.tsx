'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

// View type
type ViewType = 'customer' | 'caterer';

// Mock quotes data for users/customers
const MOCK_USER_QUOTES = [
  {
    id: 'QT-002',
    catererName: 'Raj Catering Services',
    catererImage: 'https://i.pravatar.cc/150?img=1',
    eventDate: '2026-04-20',
    guestCount: 100,
    eventType: 'Corporate Event',
    requestedAmount: 150000,
    approvedAmount: 150000,
    status: 'approved',
    submittedAt: '2026-03-18',
    approvedAt: '2026-03-19',
    menuItems: [
      { name: 'Samosa', quantity: 100, price: 20 },
      { name: 'Dal Makhani', quantity: 100, price: 80 },
      { name: 'Biryani', quantity: 100, price: 150 },
    ],
    catererComments: [
      { text: 'Menu looks great! Approved for ₹1,50,000. We have excellent reviews for similar events.', date: '2026-03-19' },
    ],
    paymentTerms: {
      totalAmount: 150000,
      advancePercentage: 50,
      advance: 75000,
      balance: 75000,
      refundable: true,
      refundPercentage: 100,
      dueDate: '2026-04-10',
    },
    paymentStatus: 'pending_advance',
    paymentHistory: [],
  },
  {
    id: 'QT-004',
    catererName: 'Royal Kitchen',
    catererImage: 'https://i.pravatar.cc/150?img=2',
    eventDate: '2026-05-10',
    guestCount: 50,
    eventType: 'Wedding Anniversary',
    requestedAmount: 85000,
    approvedAmount: null,
    status: 'pending',
    submittedAt: '2026-03-21',
    approvedAt: null,
    menuItems: [
      { name: 'Paneer Tikka', quantity: 50, price: 150 },
      { name: 'Butter Chicken', quantity: 50, price: 120 },
      { name: 'Naan', quantity: 50, price: 30 },
    ],
    catererComments: [],
    paymentTerms: null,
    paymentStatus: null,
    paymentHistory: [],
  },
  {
    id: 'QT-005',
    catererName: 'Supreme Caterers',
    catererImage: 'https://i.pravatar.cc/150?img=3',
    eventDate: '2026-03-30',
    guestCount: 75,
    eventType: 'Birthday Party',
    requestedAmount: 95000,
    approvedAmount: 92000,
    status: 'approved',
    submittedAt: '2026-03-15',
    approvedAt: '2026-03-17',
    menuItems: [
      { name: 'Vegetable Biryani', quantity: 75, price: 100 },
      { name: 'Raita', quantity: 75, price: 40 },
    ],
    catererComments: [
      { text: 'Approved at ₹92,000 with fresh ingredients guarantee!', date: '2026-03-17' },
    ],
    paymentTerms: {
      totalAmount: 92000,
      advancePercentage: 40,
      advance: 36800,
      balance: 55200,
      refundable: true,
      refundPercentage: 100,
      dueDate: '2026-03-25',
    },
    paymentStatus: 'advance_paid',
    paymentHistory: [
      { amount: 36800, date: '2026-03-18', type: 'advance', status: 'completed' },
    ],
  },
];

// Mock quotes for caterer
const MOCK_CATERER_QUOTES = [
  {
    id: 'QT-001',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientPhone: '+91-9876543210',
    eventDate: '2026-04-15',
    guestCount: 50,
    eventType: 'Wedding',
    status: 'pending',
    submittedAt: '2026-03-20',
    menuItems: [
      { name: 'Paneer Tikka', quantity: 50, basePrice: 150 },
      { name: 'Butter Chicken', quantity: 50, basePrice: 120 },
      { name: 'Biryani', quantity: 50, basePrice: 150 },
    ],
    notes: 'Vegetarian options preferred. Event at 6 PM.',
    approvedPrice: null,
    discount: 0,
    discountType: 'fixed',
    finalPrice: null,
  },
  {
    id: 'QT-003',
    clientName: 'Jane Smith',
    clientEmail: 'jane@example.com',
    clientPhone: '+91-9876543211',
    eventDate: '2026-05-10',
    guestCount: 100,
    eventType: 'Corporate',
    status: 'pending',
    submittedAt: '2026-03-22',
    menuItems: [
      { name: 'Samosa', quantity: 100, basePrice: 20 },
      { name: 'Dal Makhani', quantity: 100, basePrice: 80 },
      { name: 'Biryani', quantity: 100, basePrice: 150 },
    ],
    notes: 'Bulk order. Need invoice by 5 PM today.',
    approvedPrice: null,
    discount: 0,
    discountType: 'fixed',
    finalPrice: null,
  },
];

const statusConfig = {
  pending: { color: '#f59e0b', bg: '#fef3c7', icon: ClockIcon, label: 'Pending Approval' },
  approved: { color: '#10b981', bg: '#dcfce7', icon: CheckCircleIcon, label: 'Approved' },
  rejected: { color: '#ef4444', bg: '#fee2e2', icon: XCircleIcon, label: 'Rejected' },
};

export default function MyQuotesPage() {
  const [currentView, setCurrentView] = useState<ViewType>('customer');
  const [customerQuotes, setCustomerQuotes] = useState(MOCK_USER_QUOTES);
  const [catererQuotes, setCatererQuotes] = useState(MOCK_CATERER_QUOTES);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [expandedPricingForm, setExpandedPricingForm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payingQuoteId, setPayingQuoteId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [approvalData, setApprovalData] = useState<{ [key: string]: {
    finalPrice: string;
    discount: string;
    discountType: 'fixed' | 'percentage';
    notes: string;
    itemPrices: number[];
  } }>({});

  // Customer View Logic
  const filteredCustomerQuotes = useMemo(
    () => (filterStatus === 'all' ? customerQuotes : customerQuotes.filter(q => q.status === filterStatus)),
    [customerQuotes, filterStatus]
  );

  // Caterer View Logic
  const filteredCatererQuotes = useMemo(
    () => (filterStatus === 'all' ? catererQuotes : catererQuotes.filter(q => q.status === filterStatus)),
    [catererQuotes, filterStatus]
  );

  // Handle Customer Payment
  const handleMakePayment = (quoteId: string) => {
    const quote = customerQuotes.find(q => q.id === quoteId);
    if (quote?.paymentTerms) {
      setPayingQuoteId(quoteId);
      setPaymentAmount(quote.paymentTerms.advance.toString());
      setShowPaymentModal(true);
    }
  };

  const submitPayment = () => {
    if (!payingQuoteId || !paymentAmount) return;

    setCustomerQuotes(customerQuotes.map(q => {
      if (q.id === payingQuoteId) {
        return {
          ...q,
          paymentStatus: 'advance_paid',
          paymentHistory: [
            ...q.paymentHistory,
            {
              amount: parseFloat(paymentAmount),
              date: new Date().toLocaleDateString('en-IN'),
              type: 'advance',
              status: 'completed',
            },
          ],
        };
      }
      return q;
    }));

    setShowPaymentModal(false);
    setPayingQuoteId(null);
    setPaymentAmount('');
  };

  // Handle Caterer Quote Approval - Initialize inline form
  const handleApproveQuote = (quoteId: string) => {
    const quote = catererQuotes.find(q => q.id === quoteId);
    if (quote) {
      const baseTotal = quote.menuItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
      const itemPrices = quote.menuItems.map(item => item.basePrice);
      
      setApprovalData({
        ...approvalData,
        [quoteId]: {
          finalPrice: baseTotal.toString(),
          discount: '0',
          discountType: 'fixed',
          notes: '',
          itemPrices: itemPrices,
        },
      });
      setExpandedPricingForm(quoteId);
    }
  };

  const submitApproval = (quoteId: string) => {
    const data = approvalData[quoteId];
    if (!data || !data.finalPrice) return;

    const discount = parseFloat(data.discount) || 0;
    let actualFinalPrice = parseFloat(data.finalPrice);
    
    if (discount > 0) {
      if (data.discountType === 'percentage') {
        actualFinalPrice = actualFinalPrice - (actualFinalPrice * discount / 100);
      } else {
        actualFinalPrice = actualFinalPrice - discount;
      }
    }

    setCatererQuotes(catererQuotes.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'approved',
          approvedPrice: parseFloat(data.finalPrice),
          discount,
          discountType: data.discountType,
          finalPrice: actualFinalPrice,
        };
      }
      return q;
    }));

    setExpandedPricingForm(null);
    setApprovalData({ ...approvalData, [quoteId]: undefined });
  };

  const handleRejectQuote = (quoteId: string) => {
    setCatererQuotes(catererQuotes.map(q => {
      if (q.id === quoteId) {
        return { ...q, status: 'rejected' };
      }
      return q;
    }));
  };

  // Stats
  const customerStats = [
    { label: 'Total Quotes', value: customerQuotes.length, color: '#667eea' },
    { label: 'Pending', value: customerQuotes.filter(q => q.status === 'pending').length, color: '#f59e0b' },
    { label: 'Approved', value: customerQuotes.filter(q => q.status === 'approved').length, color: '#10b981' },
  ];

  const catererStats = [
    { label: 'Total Requests', value: catererQuotes.length, color: '#667eea' },
    { label: 'Pending', value: catererQuotes.filter(q => q.status === 'pending').length, color: '#f59e0b' },
    { label: 'Approved', value: catererQuotes.filter(q => q.status === 'approved').length, color: '#10b981' },
  ];

  const stats = currentView === 'customer' ? customerStats : catererStats;

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* View Switcher - Responsive */}
      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', '@media (min-width: 768px)': { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } }}>
        <div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
            {currentView === 'customer' ? '📋 My Quotes' : '📊 Quote Requests'}
          </h1>
          <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#64748b', margin: 0 }}>
            {currentView === 'customer'
              ? 'View and manage your quotes from catering partners.'
              : 'Review and approve quote requests from clients.'}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '6px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <button
            onClick={() => setCurrentView('customer')}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: currentView === 'customer' ? 'white' : 'transparent',
              color: currentView === 'customer' ? '#667eea' : '#64748b',
              border: currentView === 'customer' ? '1px solid #e2e8f0' : 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: 'clamp(11px, 2vw, 13px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: currentView === 'customer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            👤 Customer
          </button>
          <button
            onClick={() => setCurrentView('caterer')}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: currentView === 'caterer' ? 'white' : 'transparent',
              color: currentView === 'caterer' ? '#667eea' : '#64748b',
              border: currentView === 'caterer' ? '1px solid #e2e8f0' : 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: 'clamp(11px, 2vw, 13px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: currentView === 'caterer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            🏢 Caterer
          </button>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {stats.map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: 'clamp(12px, 3vw, 20px)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#64748b', fontWeight: '600', margin: 0 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: 'clamp(20px, 6vw, 28px)', fontWeight: '900', color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Tabs - Responsive */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
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
              fontSize: 'clamp(11px, 2vw, 13px)',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* CUSTOMER VIEW */}
      {currentView === 'customer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCustomerQuotes.length === 0 ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: 'clamp(20px, 10vw, 40px)',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
              }}
            >
              <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', margin: 0 }}>
                No quotes in this category
              </p>
            </div>
          ) : (
            filteredCustomerQuotes.map(quote => {
              const isExpanded = expandedQuote === quote.id;
              const config = statusConfig[quote.status as keyof typeof statusConfig];
              const Icon = config.icon;

              return (
                <div
                  key={quote.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Quote Header */}
                  <button
                    onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 20px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(8px, 2vw, 16px)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Status Icon */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px',
                        borderRadius: '10px',
                        backgroundColor: config.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: '20px', height: '20px', color: config.color }} />
                    </div>

                    {/* Quote Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                          {quote.catererName}
                        </h3>
                        <span
                          style={{
                            backgroundColor: config.bg,
                            color: config.color,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: 'clamp(9px, 1.5vw, 11px)',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#64748b', margin: '0 0 2px 0' }}>
                        {quote.guestCount} guests • {quote.eventType}
                      </p>
                      <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', margin: 0 }}>
                        {quote.eventDate}
                      </p>
                    </div>

                    {/* Amount & Toggle */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        {quote.status === 'approved' && quote.approvedAmount ? (
                          <>
                            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#64748b', margin: 0, marginBottom: '2px' }}>
                              Quote Price
                            </p>
                            <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: '#10b981', margin: 0 }}>
                              ₹{(quote.approvedAmount / 1000).toFixed(1)}k
                            </p>
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#64748b', margin: 0, marginBottom: '2px' }}>
                              Requested
                            </p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                              ₹{(quote.requestedAmount / 1000).toFixed(1)}k
                            </p>
                          </>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUpIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                      ) : (
                        <ChevronDownIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{ padding: 'clamp(12px, 3vw, 20px)', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Caterer Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                        <img
                          src={quote.catererImage}
                          alt={quote.catererName}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #e2e8f0',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                            {quote.catererName}
                          </p>
                          <p style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: '#94a3b8', margin: '4px 0 0 0' }}>
                            ⭐ 4.8/5 (250+ reviews)
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div>
                        <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                          🍽️ Menu Items
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                          {quote.menuItems.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: 'white',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                                {item.name}
                              </p>
                              <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#64748b', margin: '0 0 6px 0' }}>
                                Qty: {item.quantity}
                              </p>
                              <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#667eea', margin: 0 }}>
                                ₹{item.price}/plate
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Caterer Comments */}
                      {quote.catererComments.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                            💬 Caterer Comments
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {quote.catererComments.map((comment, idx) => (
                              <div
                                key={idx}
                                style={{
                                  backgroundColor: 'white',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  borderLeft: '4px solid #667eea',
                                }}
                              >
                                <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#475569', margin: '0 0 6px 0', lineHeight: '1.5' }}>
                                  {comment.text}
                                </p>
                                <p style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', color: '#94a3b8', margin: 0 }}>
                                  {comment.date}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment Terms - Only for Approved Quotes */}
                      {quote.status === 'approved' && quote.paymentTerms && (
                        <div
                          style={{
                            backgroundColor: '#e0e7ff',
                            border: '1px solid #c7d2fe',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 3vw, 16px)',
                          }}
                        >
                          <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#4338ca', margin: '0 0 12px 0' }}>
                            💳 Payment Terms
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                            <div>
                              <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#4338ca', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                Total
                              </p>
                              <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '900', color: '#4338ca', margin: 0 }}>
                                ₹{(quote.paymentTerms.totalAmount / 1000).toFixed(1)}k
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#4338ca', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                Advance
                              </p>
                              <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                                ₹{(quote.paymentTerms.advance / 1000).toFixed(1)}k
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#4338ca', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                Balance
                              </p>
                              <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '900', color: '#667eea', margin: 0 }}>
                                ₹{(quote.paymentTerms.balance / 1000).toFixed(1)}k
                              </p>
                            </div>
                          </div>

                          {/* Refund Policy */}
                          <div
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              padding: '10px',
                              marginBottom: '12px',
                            }}
                          >
                            <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: '700', color: '#10b981', margin: '0 0 6px 0' }}>
                              ✓ 100% Refundable
                            </p>
                            <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#475569', margin: '0 0 6px 0', lineHeight: '1.5' }}>
                              Fully refundable if unsatisfied.
                            </p>
                            <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', color: '#94a3b8', margin: 0 }}>
                              Due: {quote.paymentTerms.dueDate}
                            </p>
                          </div>

                          {/* Payment Buttons */}
                          {quote.paymentStatus === 'pending_advance' && (
                            <button
                              onClick={() => handleMakePayment(quote.id)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: 'clamp(11px, 2vw, 13px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                              }}
                            >
                              <CreditCardIcon style={{ width: '14px', height: '14px' }} />
                              Pay Advance
                            </button>
                          )}

                          {quote.paymentStatus === 'advance_paid' && (
                            <div>
                              <div
                                style={{
                                  backgroundColor: '#dcfce7',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '8px',
                                  padding: '10px',
                                  marginBottom: '10px',
                                }}
                              >
                                <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#15803d', fontWeight: '700', margin: 0 }}>
                                  ✓ Advance Paid
                                </p>
                              </div>
                              <button
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                  fontSize: 'clamp(11px, 2vw, 13px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                }}
                              >
                                <CreditCardIcon style={{ width: '14px', height: '14px' }} />
                                Pay Balance
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Pending Status */}
                      {quote.status === 'pending' && (
                        <div
                          style={{
                            backgroundColor: '#fef3c7',
                            border: '1px solid #fcd34d',
                            borderRadius: '12px',
                            padding: '12px',
                          }}
                        >
                          <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#92400e', margin: '0 0 6px 0' }}>
                            ⏳ Awaiting Response
                          </p>
                          <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#b45309', margin: 0, lineHeight: '1.5' }}>
                            Response within 24 hours.
                          </p>
                        </div>
                      )}

                      {/* Download Button */}
                      {quote.status === 'approved' && (
                        <button
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: 'white',
                            color: '#667eea',
                            border: '1px solid #667eea',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: 'clamp(11px, 2vw, 13px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <ArrowDownTrayIcon style={{ width: '14px', height: '14px' }} />
                          Download PDF
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CATERER VIEW */}
      {currentView === 'caterer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCatererQuotes.length === 0 ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: 'clamp(20px, 10vw, 40px)',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
              }}
            >
              <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', margin: 0 }}>
                No quote requests
              </p>
            </div>
          ) : (
            filteredCatererQuotes.map(quote => {
              const isExpanded = expandedQuote === quote.id;
              const showPricingForm = expandedPricingForm === quote.id;
              const config = statusConfig[quote.status as keyof typeof statusConfig];
              const Icon = config.icon;
              const baseTotal = quote.menuItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
              const data = approvalData[quote.id];

              return (
                <div
                  key={quote.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Quote Header */}
                  <button
                    onClick={() => setExpandedQuote(isExpanded ? null : quote.id)}
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 3vw, 20px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(8px, 2vw, 16px)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Status Icon */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px',
                        borderRadius: '10px',
                        backgroundColor: config.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: '20px', height: '20px', color: config.color }} />
                    </div>

                    {/* Quote Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                          {quote.clientName}
                        </h3>
                        <span
                          style={{
                            backgroundColor: config.bg,
                            color: config.color,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: 'clamp(9px, 1.5vw, 11px)',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#64748b', margin: '0 0 2px 0' }}>
                        {quote.guestCount} guests • {quote.eventType}
                      </p>
                      <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', margin: 0 }}>
                        {quote.eventDate}
                      </p>
                    </div>

                    {/* Amount & Toggle */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        {quote.status === 'approved' && quote.finalPrice ? (
                          <>
                            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#64748b', margin: 0, marginBottom: '2px' }}>
                              Final Price
                            </p>
                            <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: '#10b981', margin: 0 }}>
                              ₹{(quote.finalPrice / 1000).toFixed(1)}k
                            </p>
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#64748b', margin: 0, marginBottom: '2px' }}>
                              Base Total
                            </p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '900', color: '#667eea', margin: 0 }}>
                              ₹{(baseTotal / 1000).toFixed(1)}k
                            </p>
                          </>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUpIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                      ) : (
                        <ChevronDownIcon style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{ padding: 'clamp(12px, 3vw, 20px)', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Client Info */}
                      <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                          👤 Client Info
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                          <div>
                            <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                              Name
                            </p>
                            <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: '#1e293b', margin: 0 }}>{quote.clientName}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                              Email
                            </p>
                            <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: '#1e293b', margin: 0, wordBreak: 'break-all' }}>{quote.clientEmail}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                              Phone
                            </p>
                            <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: '#1e293b', margin: 0 }}>{quote.clientPhone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {quote.notes && (
                        <div>
                          <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                            📝 Special Requests
                          </h4>
                          <div
                            style={{
                              backgroundColor: 'white',
                              padding: '10px',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              borderLeft: '4px solid #f59e0b',
                            }}
                          >
                            <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                              {quote.notes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div>
                        <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                          🍽️ Menu Items
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowX: 'auto' }}>
                          {quote.menuItems.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: 'white',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                gap: '10px',
                                alignItems: 'center',
                              }}
                            >
                              <div>
                                <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                  Item
                                </p>
                                <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                  {item.name}
                                </p>
                              </div>
                              <div>
                                <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                  Qty
                                </p>
                                <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                  {item.quantity}
                                </p>
                              </div>
                              <div>
                                <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                  Price/Unit
                                </p>
                                <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: '700', color: '#667eea', margin: 0 }}>
                                  ₹{item.basePrice}
                                </p>
                              </div>
                              <div>
                                <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                  Subtotal
                                </p>
                                <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: '700', color: '#10b981', margin: 0 }}>
                                  ₹{(item.basePrice * item.quantity).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          style={{
                            backgroundColor: '#f0f4ff',
                            padding: '10px',
                            borderRadius: '8px',
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#4338ca', margin: 0 }}>
                            Total Base
                          </p>
                          <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '900', color: '#667eea', margin: 0 }}>
                            ₹{baseTotal.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Approved Quote Summary */}
                      {quote.status === 'approved' && quote.finalPrice && (
                        <div
                          style={{
                            backgroundColor: '#dcfce7',
                            border: '1px solid #bbf7d0',
                            borderRadius: '12px',
                            padding: '12px',
                          }}
                        >
                          <h4 style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#15803d', margin: '0 0 10px 0' }}>
                            ✓ Quote Sent
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                            <div>
                              <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#15803d', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                Base
                              </p>
                              <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: '900', color: '#15803d', margin: 0 }}>
                                ₹{(quote.approvedPrice || 0).toLocaleString('en-IN')}
                              </p>
                            </div>
                            {quote.discount > 0 && (
                              <div>
                                <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#f59e0b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                  Discount
                                </p>
                                <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                                  -{quote.discount}{quote.discountType === 'percentage' ? '%' : ''}
                                </p>
                              </div>
                            )}
                            <div>
                              <p style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: '700', color: '#10b981', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                                Final
                              </p>
                              <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: '900', color: '#10b981', margin: 0 }}>
                                ₹{(quote.finalPrice).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons or Pricing Form */}
                      {quote.status === 'pending' && !showPricingForm && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <button
                            onClick={() => handleApproveQuote(quote.id)}
                            style={{
                              padding: '10px 12px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: 'clamp(11px, 2vw, 13px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <CheckCircleIcon style={{ width: '14px', height: '14px' }} />
                            Send Quote
                          </button>
                          <button
                            onClick={() => handleRejectQuote(quote.id)}
                            style={{
                              padding: '10px 12px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: 'clamp(11px, 2vw, 13px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <XCircleIcon style={{ width: '14px', height: '14px' }} />
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Inline Pricing Form */}
                      {showPricingForm && data && (
                        <div style={{ backgroundColor: '#f8fafc', border: '2px solid #667eea', borderRadius: '12px', padding: 'clamp(12px, 3vw, 16px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                            ✓ Set Quote Price
                          </h3>

                          {/* Item Prices - Scrollable on Mobile */}
                          <div>
                            <h4 style={{ fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                              Edit Item Prices
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto' }}>
                              {quote.menuItems.map((item, idx) => {
                                const itemPrice = data.itemPrices?.[idx] || item.basePrice;
                                const itemSubtotal = itemPrice * item.quantity;

                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      backgroundColor: 'white',
                                      padding: '10px',
                                      borderRadius: '8px',
                                      border: '1px solid #e2e8f0',
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                                      gap: '8px',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <div>
                                      <p style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                        {item.name}
                                      </p>
                                      <p style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: '#94a3b8', margin: 0 }}>
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                    <div>
                                      <p style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                        Price/Unit
                                      </p>
                                      <input
                                        type="number"
                                        value={itemPrice}
                                        onChange={(e) => {
                                          const newPrices = [...(data.itemPrices || [])];
                                          newPrices[idx] = parseFloat(e.target.value) || 0;
                                          setApprovalData({
                                            ...approvalData,
                                            [quote.id]: { ...data, itemPrices: newPrices },
                                          });
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: '6px',
                                          border: '1px solid #e2e8f0',
                                          borderRadius: '6px',
                                          fontSize: '12px',
                                          boxSizing: 'border-box',
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <p style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>
                                        Subtotal
                                      </p>
                                      <p style={{ fontSize: 'clamp(10px, 2vw, 11px)', fontWeight: '700', color: '#10b981', margin: 0 }}>
                                        ₹{itemSubtotal.toLocaleString('en-IN')}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Discount Section */}
                          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                            <h4 style={{ fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: '700', color: '#92400e', margin: '0 0 8px 0' }}>
                              🎁 Add Discount (Optional)
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <div>
                                <label style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  value={data.discount}
                                  onChange={(e) => setApprovalData({
                                    ...approvalData,
                                    [quote.id]: { ...data, discount: e.target.value },
                                  })}
                                  placeholder="0"
                                  style={{
                                    width: '100%',
                                    padding: '6px',
                                    border: '1px solid #fcd34d',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                                  Type
                                </label>
                                <select
                                  value={data.discountType}
                                  onChange={(e) => setApprovalData({
                                    ...approvalData,
                                    [quote.id]: { ...data, discountType: e.target.value as 'fixed' | 'percentage' },
                                  })}
                                  style={{
                                    width: '100%',
                                    padding: '6px',
                                    border: '1px solid #fcd34d',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white',
                                  }}
                                >
                                  <option value="fixed">Fixed (₹)</option>
                                  <option value="percentage">Percent (%)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <label style={{ fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                              📝 Notes to Client
                            </label>
                            <textarea
                              value={data.notes}
                              onChange={(e) => setApprovalData({
                                ...approvalData,
                                [quote.id]: { ...data, notes: e.target.value },
                              })}
                              placeholder="e.g., 'Free dessert for early payment'"
                              rows={3}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontFamily: 'inherit',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                              }}
                            />
                          </div>

                          {/* Price Preview */}
                          <div
                            style={{
                              backgroundColor: '#e0e7ff',
                              border: '1px solid #c7d2fe',
                              borderRadius: '8px',
                              padding: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#4338ca', margin: 0 }}>
                                Subtotal:
                              </p>
                              <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#4338ca', margin: 0 }}>
                                ₹{(() => {
                                  let subtotal = quote.menuItems.reduce((sum, item, idx) => {
                                    const price = data.itemPrices?.[idx] || item.basePrice;
                                    return sum + (price * item.quantity);
                                  }, 0);
                                  return subtotal.toLocaleString('en-IN');
                                })()}
                              </p>
                            </div>
                            {data.discount && parseFloat(data.discount) > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#f59e0b', margin: 0 }}>
                                  Discount:
                                </p>
                                <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
                                  -{data.discount}{data.discountType === 'percentage' ? '%' : ''}
                                </p>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #c7d2fe', paddingTop: '8px' }}>
                              <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                Final Price:
                              </p>
                              <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '900', color: '#10b981', margin: 0 }}>
                                ₹{(() => {
                                  let final = quote.menuItems.reduce((sum, item, idx) => {
                                    const price = data.itemPrices?.[idx] || item.basePrice;
                                    return sum + (price * item.quantity);
                                  }, 0);
                                  const discount = parseFloat(data.discount) || 0;
                                  if (discount > 0) {
                                    if (data.discountType === 'percentage') {
                                      final = final - (final * discount / 100);
                                    } else {
                                      final = final - discount;
                                    }
                                  }
                                  return final.toLocaleString('en-IN');
                                })()}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button
                              onClick={() => {
                                setExpandedPricingForm(null);
                                setApprovalData({ ...approvalData, [quote.id]: undefined });
                              }}
                              style={{
                                padding: '10px 12px',
                                backgroundColor: 'white',
                                color: '#1e293b',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: 'clamp(11px, 2vw, 13px)',
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => submitApproval(quote.id)}
                              style={{
                                padding: '10px 12px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: 'clamp(11px, 2vw, 13px)',
                              }}
                            >
                              Send Quote
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
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
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: 'clamp(16px, 5vw, 32px)',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 'bold', color: '#1e293b', margin: '0 0 16px 0' }}>
              💳 Make Payment
            </h2>

            <div
              style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
              }}
            >
              <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#15803d', fontWeight: '700', margin: '0 0 6px 0' }}>
                ✓ 100% Refundable
              </p>
              <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#166534', margin: 0, lineHeight: '1.5' }}>
                Fully refundable if unsatisfied.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                Amount
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}