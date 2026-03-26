'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  PrinterIcon,
  DownloadIcon,
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ReceiptIcon,
  TruckIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  addOns?: { name: string; price: number }[];
}

interface ClientReview {
  id: number;
  rating: number;
  comment: string;
  date: string;
  clientName: string;
  clientImage?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientImage?: string;
  eventDate: string;
  eventTime: string;
  deliveryAddress: string;
  city: string;
  zipCode: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  specialRequests: string;
  createdDate: string;
  updatedDate: string;
  review?: ClientReview;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'card' | 'upi' | 'cash';
}

const MOCK_ORDERS: Record<string, Order> = {
  'ORD-2025-001': {
    id: 1,
    orderNumber: 'ORD-2025-001',
    clientName: 'Rajesh Kumar',
    clientEmail: 'rajesh@example.com',
    clientPhone: '+91-9876543210',
    clientImage: '👨‍💼',
    eventDate: '2025-04-15',
    eventTime: '18:00',
    deliveryAddress: '123 Park Avenue, Sector 5',
    city: 'Delhi',
    zipCode: '110001',
    guestCount: 50,
    status: 'preparing',
    items: [
      {
        id: 1,
        name: 'Paneer Tikka',
        quantity: 50,
        price: 250,
        addOns: [{ name: 'Extra Mint', price: 20 }],
      },
      {
        id: 2,
        name: 'Butter Chicken',
        quantity: 50,
        price: 320,
      },
      {
        id: 3,
        name: 'Tandoori Naan',
        quantity: 100,
        price: 80,
      },
    ],
    subtotal: 29500,
    tax: 5310,
    deliveryFee: 500,
    discount: 1000,
    total: 34310,
    specialRequests: 'Please ensure no peanuts due to allergies. Need setup by 5:30 PM.',
    createdDate: 'March 20, 2025',
    updatedDate: 'March 21, 2025',
    paymentStatus: 'completed',
    paymentMethod: 'card',
  },
  'ORD-2025-002': {
    id: 2,
    orderNumber: 'ORD-2025-002',
    clientName: 'Priya Sharma',
    clientEmail: 'priya@example.com',
    clientPhone: '+91-9876543211',
    clientImage: '👩‍💼',
    eventDate: '2025-04-10',
    eventTime: '12:00',
    deliveryAddress: '456 Garden Lane, Sector 12',
    city: 'Bangalore',
    zipCode: '560034',
    guestCount: 100,
    status: 'delivered',
    items: [
      {
        id: 1,
        name: 'Vegetable Biryani',
        quantity: 50,
        price: 280,
      },
      {
        id: 2,
        name: 'Raita',
        quantity: 50,
        price: 50,
      },
    ],
    subtotal: 16500,
    tax: 2970,
    deliveryFee: 800,
    discount: 500,
    total: 19770,
    specialRequests: 'Vegetarian only. Prefer afternoon delivery.',
    createdDate: 'March 15, 2025',
    updatedDate: 'March 18, 2025',
    review: {
      id: 1,
      rating: 5,
      comment: 'Excellent service! Food was fresh and delivery was on time. Highly recommended!',
      date: 'March 18, 2025',
      clientName: 'Priya Sharma',
      clientImage: '👩‍💼',
    },
    paymentStatus: 'completed',
    paymentMethod: 'upi',
  },
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const order = MOCK_ORDERS[slug];

  if (!order) {
    return (
      <div style={styles.container}>
        <button onClick={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
          Back
        </button>
        <div style={styles.emptyState}>
          <p>Order not found</p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: '⏳', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmed', icon: '✓', color: '#3b82f6' },
    { value: 'preparing', label: 'Preparing', icon: '👨‍🍳', color: '#8b5cf6' },
    { value: 'ready', label: 'Ready', icon: '✓', color: '#10b981' },
    { value: 'dispatched', label: 'Dispatched', icon: '🚚', color: '#06b6d4' },
    { value: 'delivered', label: 'Delivered', icon: '✓', color: '#059669' },
    { value: 'cancelled', label: 'Cancelled', icon: '✗', color: '#ef4444' },
  ];

  const currentStatusIndex = statusOptions.findIndex((opt) => opt.value === order.status);
  const completionPercentage = ((currentStatusIndex + 1) / statusOptions.length) * 100;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div style={styles.container}>
      {/* Header with Back Button */}
      <div style={styles.headerSection}>
        <button onClick={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
          Back to Orders
        </button>

        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.pageTitle}>{order.orderNumber}</h1>
            <p style={styles.pageSubtitle}>
              {order.clientName} • {new Date(order.eventDate).toLocaleDateString('en-IN')}
            </p>
          </div>

          <div style={styles.headerActions}>
            <button onClick={handlePrint} style={styles.actionButtonSmall} title="Print">
              <PrinterIcon style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={handleDownloadPDF} style={styles.actionButtonSmall} title="Download PDF">
              <DownloadIcon style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <h3 style={styles.statusTitle}>Order Status</h3>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor: statusOptions[currentStatusIndex].color,
            }}
          >
            {statusOptions[currentStatusIndex].label}
          </span>
        </div>

        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <div style={styles.timeline}>
          {statusOptions.map((option, index) => (
            <div
              key={option.value}
              style={{
                ...styles.timelineItem,
                opacity: index <= currentStatusIndex ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  ...styles.timelineDot,
                  backgroundColor: index <= currentStatusIndex ? option.color : '#d1d5db',
                }}
              >
                <span style={{ fontSize: '12px' }}>{option.icon}</span>
              </div>
              <span style={styles.timelineLabel}>{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* Order Items */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Items</h3>
            <div style={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div style={styles.itemLeft}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    {item.addOns && item.addOns.length > 0 && (
                      <p style={styles.addOnsText}>
                        Add-ons: {item.addOns.map((addon) => addon.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div style={styles.itemRight}>
                    <span style={styles.itemQuantity}>{item.quantity}x</span>
                    <span style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Billing Summary</h3>
            <div style={styles.billingSummary}>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax (18%)</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ ...styles.summaryRow, color: '#10b981' }}>
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={styles.summaryDivider} />
              <div style={styles.totalRow}>
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {order.specialRequests && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Special Requests</h3>
              <p style={styles.specialRequestsText}>{order.specialRequests}</p>
            </div>
          )}

          {/* Client Review */}
          {order.review && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Client Review</h3>
              <div style={styles.reviewSection}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewerInfo}>
                    <span style={styles.reviewerAvatar}>{order.review.clientImage}</span>
                    <div>
                      <p style={styles.reviewerName}>{order.review.clientName}</p>
                      <span style={styles.reviewDate}>{order.review.date}</span>
                    </div>
                  </div>
                  <div style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        style={{
                          width: '18px',
                          height: '18px',
                          color: i < order.review!.rating ? '#fbbf24' : '#d1d5db',
                          fill: i < order.review!.rating ? '#fbbf24' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p style={styles.reviewComment}>{order.review.comment}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Client Information */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Client Information</h3>
            <div style={styles.infoSection}>
              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <UserIcon style={{ width: '16px', height: '16px' }} />
                  Name
                </div>
                <p style={styles.infoValue}>{order.clientName}</p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
                  Email
                </div>
                <p style={styles.infoValue}>{order.clientEmail}</p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <PhoneIcon style={{ width: '16px', height: '16px' }} />
                  Phone
                </div>
                <p style={styles.infoValue}>{order.clientPhone}</p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <UserIcon style={{ width: '16px', height: '16px' }} />
                  Guest Count
                </div>
                <p style={styles.infoValue}>{order.guestCount} guests</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Event Details</h3>
            <div style={styles.infoSection}>
              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <CalendarIcon style={{ width: '16px', height: '16px' }} />
                  Event Date
                </div>
                <p style={styles.infoValue}>
                  {new Date(order.eventDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <ClockIcon style={{ width: '16px', height: '16px' }} />
                  Event Time
                </div>
                <p style={styles.infoValue}>{order.eventTime}</p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <MapPinIcon style={{ width: '16px', height: '16px' }} />
                  Delivery Address
                </div>
                <p style={styles.infoValue}>
                  {order.deliveryAddress}
                  <br />
                  {order.city} - {order.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Payment Information</h3>
            <div style={styles.infoSection}>
              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <CreditCardIcon style={{ width: '16px', height: '16px' }} />
                  Payment Method
                </div>
                <p style={styles.infoValue}>
                  {order.paymentMethod === 'card'
                    ? 'Credit/Debit Card'
                    : order.paymentMethod === 'upi'
                      ? 'UPI'
                      : 'Cash'}
                </p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <ReceiptIcon style={{ width: '16px', height: '16px' }} />
                  Payment Status
                </div>
                <p
                  style={{
                    ...styles.infoValue,
                    color:
                      order.paymentStatus === 'completed'
                        ? '#10b981'
                        : order.paymentStatus === 'failed'
                          ? '#ef4444'
                          : '#f59e0b',
                  }}
                >
                  {order.paymentStatus === 'completed'
                    ? '✓ Completed'
                    : order.paymentStatus === 'failed'
                      ? '✗ Failed'
                      : '⏳ Pending'}
                </p>
              </div>

              <div style={styles.infoGroup}>
                <div style={styles.infoLabel}>
                  <ReceiptIcon style={{ width: '16px', height: '16px' }} />
                  Order Amount
                </div>
                <p style={{ ...styles.infoValue, fontSize: '18px', fontWeight: '700' }}>
                  ₹{order.total.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Timeline</h3>
            <div style={styles.timelineList}>
              <div style={styles.timelineEntry}>
                <span style={styles.timelineIcon}>📋</span>
                <div>
                  <p style={styles.timelineAction}>Order Created</p>
                  <span style={styles.timelineTime}>{order.createdDate}</span>
                </div>
              </div>
              <div style={styles.timelineEntry}>
                <span style={styles.timelineIcon}>✏️</span>
                <div>
                  <p style={styles.timelineAction}>Last Updated</p>
                  <span style={styles.timelineTime}>{order.updatedDate}</span>
                </div>
              </div>
              {order.review && (
                <div style={styles.timelineEntry}>
                  <span style={styles.timelineIcon}>⭐</span>
                  <div>
                    <p style={styles.timelineAction}>Review Received</p>
                    <span style={styles.timelineTime}>{order.review.date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  headerSection: {
    marginBottom: '24px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#0c4a6e',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButtonSmall: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    marginBottom: '24px',
  },
  statusHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  statusTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.3s ease',
  },
  timeline: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    transition: 'opacity 0.2s ease',
  },
  timelineDot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
  },
  timelineLabel: {
    fontSize: '12px',
    color: '#64748b',
    textAlign: 'center' as const,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  addOnsText: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
    fontStyle: 'italic',
  },
  itemRight: {
    textAlign: 'right' as const,
  },
  itemQuantity: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
  },
  itemPrice: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
  },
  billingSummary: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#64748b',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '8px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
  },
  specialRequestsText: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0,
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6',
  },
  reviewSection: {
    backgroundColor: '#fffbeb',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid #fbbf24',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  reviewerInfo: {
    display: 'flex',
    gap: '12px',
  },
  reviewerAvatar: {
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
  },
  reviewerName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  reviewDate: {
    fontSize: '12px',
    color: '#78350f',
  },
  reviewRating: {
    display: 'flex',
    gap: '4px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#78350f',
    lineHeight: '1.6',
    margin: 0,
    fontStyle: 'italic',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: '14px',
    color: '#1e293b',
    margin: 0,
    lineHeight: '1.5',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  timelineEntry: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9',
  },
  timelineIcon: {
    fontSize: '18px',
    flexShrink: 0,
  },
  timelineAction: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 2px 0',
  },
  timelineTime: {
    fontSize: '12px',
    color: '#64748b',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#64748b',
  },
};