'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CreditCardIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Review {
  id: string;
  rating: number;
  foodQuality: number;
  service: number;
  presentation: number;
  value: number;
  comment: string;
  would_recommend: boolean;
  createdAt: string;
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
  review?: Review;
}

interface StatusBadge {
  bg: string;
  color: string;
  label: string;
  icon: React.ReactNode;
}

interface DepositRule {
  title: string;
  description: string;
}

interface RefundPolicy {
  timeframe: string;
  percentage: number;
  conditions: string[];
}

const MOCK_QUOTES: Quote[] = [
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
    review: {
      id: 'r1',
      rating: 5,
      foodQuality: 5,
      service: 4,
      presentation: 5,
      value: 4,
      comment: 'Absolutely amazing! The food was delicious and the service was professional. Highly recommend for any event.',
      would_recommend: true,
      createdAt: '2026-03-31',
    },
  },
];

const depositRules: DepositRule[] = [
  {
    title: 'Secure Your Booking',
    description: 'A deposit of 30% is required to confirm your catering order and secure the caterer\'s availability for your event date.',
  },
  {
    title: 'Payment Timeline',
    description: 'The remaining balance (70%) must be paid at least 7 days before the event date.',
  },
  {
    title: 'Menu Finalization',
    description: 'After deposit payment, the caterer will confirm the final menu and any special dietary requirements.',
  },
  {
    title: 'Invoice Generation',
    description: 'You will receive a detailed invoice with itemized costs and payment schedule after deposit confirmation.',
  },
];

const refundPolicies: RefundPolicy[] = [
  {
    timeframe: 'More than 30 days before event',
    percentage: 100,
    conditions: [
      'Full refund of deposit if cancelled',
      'No cancellation fees apply',
      'Refund processed within 5-7 business days',
    ],
  },
  {
    timeframe: '15-30 days before event',
    percentage: 50,
    conditions: [
      '50% refund of deposit',
      '50% retained as cancellation fee',
      'Refund processed within 5-7 business days',
    ],
  },
  {
    timeframe: 'Less than 15 days before event',
    percentage: 0,
    conditions: [
      'No refund available',
      'Full deposit retained',
      'Cancellation fee applies (full deposit)',
    ],
  },
];

export default function QuoteDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    foodQuality: 5,
    service: 5,
    presentation: 5,
    value: 5,
    comment: '',
    would_recommend: true,
  });

  useEffect(() => {
    const foundQuote = MOCK_QUOTES.find(q => q.slug === params.slug);
    if (foundQuote) {
      setQuote(foundQuote);
    }
    setLoading(false);
  }, [params.slug]);

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

  const handleCardChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length <= 4) {
        if (formattedValue.length === 2) {
          formattedValue = formattedValue + '/';
        }
      } else {
        return;
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }

    setCardDetails({ ...cardDetails, [field]: formattedValue });
  };

  const processPayment = async () => {
    if (!quote || !cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
      alert('Please fill in all payment details');
      return;
    }

    setProcessingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setQuote({ ...quote, status: 'paid', paidAt: new Date().toISOString().split('T')[0] });
    setProcessingPayment(false);
    setShowPaymentModal(false);
    setCardDetails({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    alert('Payment successful! Your deposit has been confirmed.');
  };

  const submitReview = () => {
    if (!quote || !reviewData.comment.trim()) {
      alert('Please add a comment for your review');
      return;
    }

    const newReview: Review = {
      id: 'r' + Date.now(),
      rating: reviewData.rating,
      foodQuality: reviewData.foodQuality,
      service: reviewData.service,
      presentation: reviewData.presentation,
      value: reviewData.value,
      comment: reviewData.comment,
      would_recommend: reviewData.would_recommend,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setQuote({ ...quote, review: newReview });
    setShowReviewModal(false);
    setReviewData({
      rating: 5,
      foodQuality: 5,
      service: 5,
      presentation: 5,
      value: 5,
      comment: '',
      would_recommend: true,
    });
    alert('Review submitted successfully!');
  };

  const deleteReview = () => {
    if (!quote) return;

    setQuote({ ...quote, review: undefined });
    setShowDeleteConfirm(false);
    alert('Review deleted successfully');
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate && onRate(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: onRate ? 'pointer' : 'default',
              padding: '4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (onRate) {
                e.currentTarget.style.transform = 'scale(1.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (onRate) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <StarIcon
              style={{
                width: '20px',
                height: '20px',
                fill: star <= rating ? '#fbbf24' : '#e5e7eb',
                color: star <= rating ? '#fbbf24' : '#e5e7eb',
              }}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading quote...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ padding: '32px' }}>
        <Link href="/customer/quotes" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#667eea',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
            Back to Quotes
          </button>
        </Link>
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            Quote not found
          </p>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            The quote you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(quote.status);
  const totalItemCost = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link href="/customer/quotes" style={{ textDecoration: 'none' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#667eea',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
          Back to Quotes
        </button>
      </Link>

      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
        }}
      >
        <img
          src={quote.catererImage}
          alt={quote.catererName}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            objectFit: 'cover',
            border: '2px solid #e2e8f0',
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '12px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                {quote.catererName}
              </h1>
              <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
                {quote.eventType}
              </p>
            </div>
            <div
              style={{
                backgroundColor: badge.bg,
                color: badge.color,
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {badge.icon}
              {badge.label}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Event Date</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {new Date(quote.eventDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Guest Count</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {quote.guestCount} guests
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Quoted On</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {new Date(quote.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quote Details */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Quote Details
            </h3>

            {quote.specialRequirements && quote.specialRequirements !== 'None' && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px 0' }}>Special Requirements</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                  {quote.specialRequirements}
                </p>
              </div>
            )}

            {quote.notes && (
              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd',
                  marginTop: quote.specialRequirements ? '16px' : 0,
                }}
              >
                <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 0 4px 0', fontWeight: '600' }}>
                  Caterer's Message
                </p>
                <p style={{ fontSize: '13px', color: '#0c4a6e', margin: 0 }}>
                  {quote.notes}
                </p>
              </div>
            )}
          </div>

          {/* Contact Caterer */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', margin: '0 0 12px 0' }}>
              Contact Caterer
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`tel:${quote.catererPhone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#667eea',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#667eea';
                }}
              >
                <PhoneIcon style={{ width: '16px', height: '16px' }} />
                {quote.catererPhone}
              </a>
              <a
                href={`mailto:${quote.catererEmail}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#667eea',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#667eea';
                }}
              >
                <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
                {quote.catererEmail}
              </a>
            </div>
          </div>

          {/* Review Section - Only show when paid */}
          {quote.status === 'paid' && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
                Your Review
              </h3>

              {quote.review ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Overall Rating */}
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#fef9e7',
                      borderRadius: '8px',
                      border: '1px solid #fde047',
                    }}
                  >
                    <p style={{ fontSize: '12px', color: '#854d0e', margin: '0 0 8px 0', fontWeight: '600' }}>
                      Overall Rating
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {renderStars(quote.review.rating)}
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                        {quote.review.rating}.0 out of 5
                      </span>
                    </div>
                  </div>

                  {/* Category Ratings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Food Quality', value: quote.review.foodQuality },
                      { label: 'Service', value: quote.review.service },
                      { label: 'Presentation', value: quote.review.presentation },
                      { label: 'Value for Money', value: quote.review.value },
                    ].map((cat) => (
                      <div
                        key={cat.label}
                        style={{
                          padding: '12px',
                          backgroundColor: '#f0f4ff',
                          borderRadius: '8px',
                          border: '1px solid #dbeafe',
                        }}
                      >
                        <p style={{ fontSize: '11px', color: '#0c4a6e', margin: '0 0 6px 0', fontWeight: '600' }}>
                          {cat.label}
                        </p>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              style={{
                                width: '16px',
                                height: '16px',
                                fill: star <= cat.value ? '#3b82f6' : '#e5e7eb',
                                color: star <= cat.value ? '#3b82f6' : '#e5e7eb',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment */}
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Your Comment
                    </p>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      {quote.review.comment}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: quote.review.would_recommend ? '#dcfce7' : '#fee2e2',
                      borderRadius: '8px',
                      border: `1px solid ${quote.review.would_recommend ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: quote.review.would_recommend ? '#166534' : '#991b1b',
                        margin: 0,
                      }}
                    >
                      {quote.review.would_recommend ? '✓ I would recommend this caterer' : '✕ I would not recommend this caterer'}
                    </p>
                  </div>

                  {/* Review Date & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                      Reviewed on {new Date(quote.review.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fee2e2',
                        backgroundColor: 'transparent',
                        color: '#991b1b',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                      Delete Review
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    Share your experience with this caterer
                  </p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5568d3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#667eea';
                    }}
                  >
                    <StarIcon style={{ width: '16px', height: '16px' }} />
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Pricing & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Itemized Breakdown */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Itemized Breakdown
              </h3>
            </div>

            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
              }}
            >
              <div>Item</div>
              <div style={{ textAlign: 'center' }}>Qty</div>
              <div style={{ textAlign: 'right' }}>Unit Price</div>
              <div style={{ textAlign: 'right' }}>Total</div>
            </div>

            {/* Table Rows */}
            {quote.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  padding: '12px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#1e293b',
                }}
              >
                <div>{item.name}</div>
                <div style={{ textAlign: 'center' }}>{item.quantity}</div>
                <div style={{ textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</div>
                <div style={{ textAlign: 'right', fontWeight: '600' }}>
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </div>
              </div>
            ))}

            {/* Table Footer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                padding: '12px 20px',
                backgroundColor: '#f0f4ff',
                borderTop: '2px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
              }}
            >
              <div>Total</div>
              <div></div>
              <div></div>
              <div style={{ textAlign: 'right' }}>
                ${totalItemCost.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Pricing Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '13px', color: '#64748b' }}>Subtotal</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                  ${quote.quotedPrice.toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>
                  Deposit Required (30%)
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0c4a6e' }}>
                  ${quote.depositAmount.toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '13px', color: '#64748b' }}>Balance Due (70%)</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                  ${(quote.quotedPrice - quote.depositAmount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Button */}
            {quote.status === 'approved' && !quote.paidAt && (
              <button
                onClick={() => setShowPaymentModal(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#667eea',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5568d3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                }}
              >
                <CreditCardIcon style={{ width: '16px', height: '16px' }} />
                Pay Deposit Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Rules & Refund Policy */}
      {quote.status === 'approved' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Deposit Rules */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <InformationCircleIcon style={{ width: '16px', height: '16px', color: '#0369a1' }} />
              Payment Rules
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {depositRules.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd',
                  }}
                >
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#0c4a6e', margin: '0 0 4px 0' }}>
                    ✓ {rule.title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#0369a1', margin: 0 }}>
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Policy */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <DocumentTextIcon style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
              Refund Policy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {refundPolicies.map((policy, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '8px',
                    border: '1px solid #e9d5ff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b21a8', margin: 0 }}>
                      {policy.timeframe}
                    </p>
                    <span
                      style={{
                        backgroundColor: policy.percentage === 100 ? '#dcfce7' : policy.percentage === 50 ? '#fed7aa' : '#fee2e2',
                        color: policy.percentage === 100 ? '#166534' : policy.percentage === 50 ? '#92400e' : '#991b1b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {policy.percentage}% Refund
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#6b21a8' }}>
                    {policy.conditions.map((condition, cidx) => (
                      <li key={cidx} style={{ marginBottom: '4px' }}>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
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
            zIndex: 50,
          }}
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Pay Deposit
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <XMarkIcon style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </button>
            </div>

            {/* Order Summary */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{quote.catererName}</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>
                  ${quote.quotedPrice.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                <span style={{ color: '#1e293b' }}>Deposit (30%)</span>
                <span style={{ color: '#0c4a6e' }}>
                  ${quote.depositAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Form */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.cardHolder}
                onChange={(e) => handleCardChange('cardHolder', e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#1e293b',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  marginBottom: '12px',
                }}
              />

              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#1e293b',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  marginBottom: '12px',
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      color: '#1e293b',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    placeholder="123"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      color: '#1e293b',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div
              style={{
                backgroundColor: '#f0f9ff',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #bae6fd',
                fontSize: '12px',
                color: '#0369a1',
              }}
            >
              <p style={{ margin: 0, marginBottom: '6px', fontWeight: '600' }}>
                ⓘ Payment Terms
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '4px' }}>This payment secures your booking</li>
                <li style={{ marginBottom: '4px' }}>Remaining balance due 7 days before event</li>
                <li>Refunds subject to cancellation policy</li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                disabled={processingPayment}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: processingPayment ? '#cbd5e1' : '#667eea',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: processingPayment ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!processingPayment) {
                    e.currentTarget.style.backgroundColor = '#5568d3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!processingPayment) {
                    e.currentTarget.style.backgroundColor = '#667eea';
                  }
                }}
              >
                {processingPayment ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
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
            zIndex: 50,
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Rate Your Experience
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <XMarkIcon style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Overall Rating */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '10px' }}>
                  Overall Rating *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {renderStars(reviewData.rating, (rating) => setReviewData({ ...reviewData, rating }))}
                </div>
              </div>

              {/* Category Ratings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[
                  { key: 'foodQuality', label: 'Food Quality' },
                  { key: 'service', label: 'Service' },
                  { key: 'presentation', label: 'Presentation' },
                  { key: 'value', label: 'Value for Money' },
                ].map((cat) => (
                  <div key={cat.key}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                      {cat.label}
                    </label>
                    {renderStars(
                      reviewData[cat.key as keyof typeof reviewData] as number,
                      (rating) => setReviewData({ ...reviewData, [cat.key]: rating })
                    )}
                  </div>
                ))}
              </div>

              {/* Comment */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  Your Comment *
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share your experience with this caterer..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    color: '#1e293b',
                    fontFamily: 'inherit',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Recommendation */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  Would you recommend this caterer?
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      onClick={() => setReviewData({ ...reviewData, would_recommend: value })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: reviewData.would_recommend === value ? '#667eea' : 'white',
                        color: reviewData.would_recommend === value ? 'white' : '#1e293b',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (reviewData.would_recommend !== value) {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (reviewData.would_recommend !== value) {
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      {value ? '👍 Yes, Recommend' : '👎 No, Do Not Recommend'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setShowReviewModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#667eea',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5568d3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#667eea';
                  }}
                >
                  <StarIcon style={{ width: '16px', height: '16px' }} />
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {showDeleteConfirm && (
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
            zIndex: 50,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', margin: 0 }}>
              Delete Review?
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', margin: '12px 0 24px 0' }}>
              Are you sure you want to delete your review? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Keep Review
              </button>
              <button
                onClick={deleteReview}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#991b1b',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7f1d1d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#991b1b';
                }}
              >
                <TrashIcon style={{ width: '16px', height: '16px' }} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}