'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  StarIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  PackageIcon,
  XCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface OrderReview {
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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  catererName: string;
  catererImage: string;
  catererPhone: string;
  catererEmail: string;
  deliveryType: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryLocation: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
  totalPrice: number;
  items: OrderItem[];
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  rating: number;
  review?: OrderReview;
  createdAt: string;
}

interface StatusBadgeConfig {
  bg: string;
  color: string;
  label: string;
  icon: React.ReactNode;
  progressPercentage: number;
}

interface TimelineStep {
  status: string;
  label: string;
  completed: boolean;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'QT-001-ORD',
    orderNumber: 'ORD-2026-001234',
    catererName: 'Gourmet Delights',
    catererImage: 'https://i.pravatar.cc/150?img=5',
    catererPhone: '+1 (555) 555-0123',
    catererEmail: 'contact@gourmetdelights.com',
    deliveryType: 'Airport Arrival',
    deliveryDate: '2026-03-26',
    deliveryTime: '2:30 PM',
    deliveryLocation: 'Terminal 2, Gate 45, LAX',
    status: 'on-the-way',
    totalPrice: 85.99,
    items: [
      { id: 'i1', name: 'Premium Sandwich Box', quantity: 2, price: 24.99 },
      { id: 'i2', name: 'Fresh Fruit Platter', quantity: 1, price: 18.99 },
      { id: 'i3', name: 'Gourmet Cookies', quantity: 1, price: 12.99 },
      { id: 'i4', name: 'Bottled Water', quantity: 4, price: 3.99 },
    ],
    specialInstructions: 'Please meet at Starbucks in Terminal 2',
    estimatedDeliveryTime: '2:30 PM - 2:45 PM',
    rating: 0,
    createdAt: '2026-03-25',
  },
  {
    id: 'QT-002-ORD',
    orderNumber: 'ORD-2026-001235',
    catererName: 'Organic Farm Table',
    catererImage: 'https://i.pravatar.cc/150?img=6',
    catererPhone: '+1 (555) 555-0124',
    catererEmail: 'info@farmtable.com',
    deliveryType: 'Office Party',
    deliveryDate: '2026-03-20',
    deliveryTime: '12:00 PM',
    deliveryLocation: '456 Business Ave, Suite 200',
    status: 'delivered',
    totalPrice: 245.50,
    items: [
      { id: 'i5', name: 'Organic Salad Bar', quantity: 1, price: 125.00 },
      { id: 'i6', name: 'Grilled Vegetable Skewers', quantity: 2, price: 45.00 },
      { id: 'i7', name: 'Fruit & Cheese Board', quantity: 1, price: 65.00 },
      { id: 'i8', name: 'Beverages', quantity: 1, price: 10.50 },
    ],
    estimatedDeliveryTime: '12:00 PM - 12:30 PM',
    rating: 4.8,
    review: {
      id: 'rev1',
      rating: 5,
      foodQuality: 5,
      service: 5,
      presentation: 4,
      value: 5,
      comment: 'Absolutely amazing! The food was fresh, delicious, and beautifully presented. Everyone at the party loved it!',
      would_recommend: true,
      createdAt: '2026-03-20',
    },
    createdAt: '2026-03-18',
  },
  {
    id: 'QT-003-ORD',
    orderNumber: 'ORD-2026-001236',
    catererName: 'Quick Bites Catering',
    catererImage: 'https://i.pravatar.cc/150?img=7',
    catererPhone: '+1 (555) 555-0125',
    catererEmail: 'hello@quickbites.com',
    deliveryType: 'Quick Delivery',
    deliveryDate: '2026-03-24',
    deliveryTime: '1:00 PM',
    deliveryLocation: '789 Main St, Downtown',
    status: 'delivered',
    totalPrice: 62.97,
    items: [
      { id: 'i9', name: 'Gourmet Burger Combo', quantity: 2, price: 18.99 },
      { id: 'i10', name: 'Caesar Salad', quantity: 1, price: 12.99 },
      { id: 'i11', name: 'Fries & Dip', quantity: 1, price: 8.99 },
      { id: 'i12', name: 'Soft Drinks', quantity: 3, price: 3.00 },
    ],
    estimatedDeliveryTime: '1:00 PM - 1:30 PM',
    rating: 4.2,
    createdAt: '2026-03-22',
  },
  {
    id: '4',
    orderNumber: 'ORD-2026-001237',
    catererName: 'Italian Delights',
    catererImage: 'https://i.pravatar.cc/150?img=2',
    catererPhone: '+1 (555) 234-5678',
    catererEmail: 'info@italiandelights.com',
    deliveryType: 'Special Occasion',
    deliveryDate: '2026-03-15',
    deliveryTime: '7:00 PM',
    deliveryLocation: '321 Romance Lane, Apt 5C',
    status: 'delivered',
    totalPrice: 158.50,
    items: [
      { id: 'i13', name: 'Handmade Pasta Carbonara', quantity: 2, price: 32.99 },
      { id: 'i14', name: 'Risotto Milano', quantity: 1, price: 28.99 },
      { id: 'i15', name: 'Tiramisu', quantity: 2, price: 14.99 },
      { id: 'i16', name: 'Wine Selection', quantity: 1, price: 48.00 },
    ],
    specialInstructions: 'Please keep warm until serving',
    estimatedDeliveryTime: '7:00 PM - 7:30 PM',
    rating: 0,
    createdAt: '2026-03-10',
  },
  {
    id: '5',
    orderNumber: 'ORD-2026-001238',
    catererName: 'Healthy Bites',
    catererImage: 'https://i.pravatar.cc/150?img=1',
    catererPhone: '+1 (555) 123-4567',
    catererEmail: 'contact@healthybites.com',
    deliveryType: 'Meeting Catering',
    deliveryDate: '2026-03-09',
    deliveryTime: '8:00 AM',
    deliveryLocation: '555 Executive Plaza, Conference Room A',
    status: 'cancelled',
    totalPrice: 198.75,
    items: [
      { id: 'i17', name: 'Breakfast Pastries Box', quantity: 1, price: 45.00 },
      { id: 'i18', name: 'Fresh Fruit Platter', quantity: 1, price: 38.00 },
      { id: 'i19', name: 'Yogurt & Granola Bar', quantity: 1, price: 32.00 },
      { id: 'i20', name: 'Coffee & Tea Station', quantity: 1, price: 83.75 },
    ],
    estimatedDeliveryTime: '8:00 AM - 8:30 AM',
    rating: 0,
    createdAt: '2026-03-05',
  },
  {
    id: '6',
    orderNumber: 'ORD-2026-001239',
    catererName: 'Spice Master',
    catererImage: 'https://i.pravatar.cc/150?img=3',
    catererPhone: '+1 (555) 345-6789',
    catererEmail: 'hello@spicemaster.com',
    deliveryType: 'Party Catering',
    deliveryDate: '2026-03-21',
    deliveryTime: '6:00 PM',
    deliveryLocation: '666 Celebration St, Backyard',
    status: 'preparing',
    totalPrice: 325.00,
    items: [
      { id: 'i21', name: 'Tandoori Chicken', quantity: 3, price: 45.00 },
      { id: 'i22', name: 'Butter Chicken Curry', quantity: 2, price: 38.00 },
      { id: 'i23', name: 'Biryani Rice', quantity: 2, price: 28.00 },
      { id: 'i24', name: 'Naan & Bread Selection', quantity: 1, price: 32.00 },
      { id: 'i25', name: 'Desserts & Drinks', quantity: 1, price: 104.00 },
    ],
    specialInstructions: 'Extra spicy for half the order',
    estimatedDeliveryTime: '6:00 PM - 6:45 PM',
    rating: 0,
    createdAt: '2026-03-15',
  },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
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
    const found = MOCK_ORDERS.find((o) => o.id === orderId);
    setOrder(found || null);
    setLoading(false);
  }, [orderId]);

  const getStatusBadge = (status: string): StatusBadgeConfig => {
    const badges: { [key: string]: StatusBadgeConfig } = {
      pending: {
        bg: '#fef3c7',
        color: '#92400e',
        label: 'Pending',
        icon: <ClockIcon style={{ width: '16px', height: '16px' }} />,
        progressPercentage: 20,
      },
      confirmed: {
        bg: '#dbeafe',
        color: '#0c4a6e',
        label: 'Confirmed',
        icon: <CheckCircleIcon style={{ width: '16px', height: '16px' }} />,
        progressPercentage: 40,
      },
      preparing: {
        bg: '#f3e8ff',
        color: '#6b21a8',
        label: 'Preparing',
        icon: <PackageIcon style={{ width: '16px', height: '16px' }} />,
        progressPercentage: 60,
      },
      'on-the-way': {
        bg: '#dcfce7',
        color: '#166534',
        label: 'On The Way',
        icon: <TruckIcon style={{ width: '16px', height: '16px' }} />,
        progressPercentage: 80,
      },
      delivered: {
        bg: '#dcfce7',
        color: '#166534',
        label: 'Delivered',
        icon: <CheckCircleIcon style={{ width: '16px', height: '16px' }} />,
        progressPercentage: 100,
      },
      cancelled: {
        bg: '#fee2e2',
        color: '#991b1b',
        label: 'Cancelled',
        icon: <XCircleIcon style={{ width: '16px', height: '16px' }} />,
        progressPercentage: 0,
      },
    };

    return badges[status] || badges.pending;
  };

  const submitReview = () => {
    if (!order || !reviewData.comment.trim()) {
      alert('Please add a comment for your review');
      return;
    }

    const newReview: OrderReview = {
      id: 'rev' + Date.now(),
      rating: reviewData.rating,
      foodQuality: reviewData.foodQuality,
      service: reviewData.service,
      presentation: reviewData.presentation,
      value: reviewData.value,
      comment: reviewData.comment,
      would_recommend: reviewData.would_recommend,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrder({ ...order, review: newReview });
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
    if (order) {
      setOrder({ ...order, review: undefined });
      setShowDeleteReviewModal(false);
      alert('Review deleted successfully');
    }
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
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '32px' }}>
        <Link href="/customer/orders" style={{ textDecoration: 'none' }}>
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
            Back to Orders
          </button>
        </Link>
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            Order not found
          </p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(order.status);
  const timelineSteps: TimelineStep[] = [
    { status: 'pending', label: 'Order Placed', completed: ['confirmed', 'preparing', 'on-the-way', 'delivered'].includes(order.status) || order.status === 'pending' },
    { status: 'confirmed', label: 'Confirmed', completed: ['preparing', 'on-the-way', 'delivered'].includes(order.status) || order.status === 'confirmed' },
    { status: 'preparing', label: 'Preparing', completed: ['on-the-way', 'delivered'].includes(order.status) || order.status === 'preparing' },
    { status: 'on-the-way', label: 'On The Way', completed: order.status === 'delivered' || order.status === 'on-the-way' },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' },
  ];

  const subtotal = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * 0.1;
  const deliveryFee = 5.00;

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link href="/customer/orders" style={{ textDecoration: 'none' }}>
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
          Back to Orders
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
          src={order.catererImage}
          alt={order.catererName}
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
                {order.catererName}
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Order #{order.orderNumber}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <ClockIcon style={{ width: '18px', height: '18px', color: '#667eea', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Scheduled Delivery</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '4px 0 0 0' }}>
                  {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {order.deliveryTime}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <MapPinIcon style={{ width: '18px', height: '18px', color: '#667eea', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Delivery Location</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '4px 0 0 0' }}>
                  {order.deliveryLocation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {order.status !== 'cancelled' && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
            Order Timeline
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              alignItems: 'start',
              position: 'relative',
            }}
          >
            {/* Progress Line Background */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#e2e8f0',
                zIndex: 0,
              }}
            />

            {/* Progress Line Foreground */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: 0,
                height: '2px',
                backgroundColor: badge.color,
                zIndex: 1,
                width: `${badge.progressPercentage}%`,
                transition: 'width 0.3s ease',
              }}
            />

            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: step.completed ? badge.color : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    border: '3px solid white',
                  }}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: step.completed ? badge.color : '#94a3b8',
                    textAlign: 'center',
                    margin: 0,
                  }}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column - Items & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Order Items */}
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
                Order Items
              </h3>
            </div>

            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr repeat(3, auto)',
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                gap: '12px',
              }}
            >
              <div>Item</div>
              <div style={{ textAlign: 'center', minWidth: '50px' }}>Qty</div>
              <div style={{ textAlign: 'right', minWidth: '70px' }}>Price</div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>Total</div>
            </div>

            {/* Table Rows */}
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr repeat(3, auto)',
                  padding: '16px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#1e293b',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: '500' }}>{item.name}</div>
                <div style={{ textAlign: 'center', minWidth: '50px' }}>{item.quantity}</div>
                <div style={{ textAlign: 'right', minWidth: '70px' }}>${item.price.toFixed(2)}</div>
                <div style={{ textAlign: 'right', minWidth: '80px', fontWeight: '600' }}>
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}

            {/* Table Footer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr repeat(3, auto)',
                padding: '12px 20px',
                backgroundColor: '#f0f4ff',
                borderTop: '2px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                gap: '12px',
              }}
            >
              <div>Subtotal</div>
              <div></div>
              <div></div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                ${subtotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div
              style={{
                backgroundColor: '#f0f9ff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #bae6fd',
              }}
            >
              <p style={{ fontSize: '12px', color: '#0c4a6e', margin: '0 0 8px 0', fontWeight: '600' }}>
                📝 Special Instructions
              </p>
              <p style={{ fontSize: '13px', color: '#0369a1', margin: 0, lineHeight: '1.5' }}>
                {order.specialInstructions}
              </p>
            </div>
          )}

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href={`tel:${order.catererPhone}`}
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
                {order.catererPhone}
              </a>
              <a
                href={`mailto:${order.catererEmail}`}
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
                {order.catererEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing & Review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Price Summary */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Price Summary
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
                  ${subtotal.toFixed(2)}
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
                <span style={{ fontSize: '13px', color: '#64748b' }}>Tax (10%)</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                  ${tax.toFixed(2)}
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
                <span style={{ fontSize: '13px', color: '#64748b' }}>Delivery Fee</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                  ${deliveryFee.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f0f4ff',
                  borderRadius: '8px',
                  border: '1px solid #dbeafe',
                  marginTop: '8px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                  ${(subtotal + tax + deliveryFee).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Review Section - Only show when delivered */}
          {order.status === 'delivered' && (
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

              {order.review ? (
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
                      {renderStars(order.review.rating)}
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                        {order.review.rating}.0 out of 5
                      </span>
                    </div>
                  </div>

                  {/* Category Ratings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Food Quality', value: order.review.foodQuality },
                      { label: 'Service', value: order.review.service },
                      { label: 'Presentation', value: order.review.presentation },
                      { label: 'Value for Money', value: order.review.value },
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
                      {order.review.comment}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: order.review.would_recommend ? '#dcfce7' : '#fee2e2',
                      borderRadius: '8px',
                      border: `1px solid ${order.review.would_recommend ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: order.review.would_recommend ? '#166534' : '#991b1b',
                        margin: 0,
                      }}
                    >
                      {order.review.would_recommend ? '✓ I would recommend this caterer' : '✕ I would not recommend this caterer'}
                    </p>
                  </div>

                  {/* Review Date & Delete Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                      Reviewed on {new Date(order.review.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setShowDeleteReviewModal(true)}
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
      </div>

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
                  placeholder="Share your experience with this catering order..."
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

      {/* Delete Review Modal */}
      {showDeleteReviewModal && (
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
          onClick={() => setShowDeleteReviewModal(false)}
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
                onClick={() => setShowDeleteReviewModal(false)}
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