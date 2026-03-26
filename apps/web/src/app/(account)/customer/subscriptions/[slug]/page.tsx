'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  StarIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface DeliveryReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Delivery {
  id: string;
  date: string;
  time: string;
  status: 'delivered' | 'on-the-way' | 'scheduled' | 'cancelled' | 'skipped';
  location: string;
  specialInstructions: string;
  mealType: string;
  review?: DeliveryReview;
}

interface Subscription {
  id: string;
  slug: string;
  catererName: string;
  catererImage: string;
  catererPhone: string;
  catererEmail: string;
  mealType: string;
  startDate: string;
  endDate: string;
  frequency: 'daily' | 'weekly' | 'alternate';
  status: 'active' | 'paused' | 'ending-soon' | 'expired';
  rating: number;
  price: number;
  servings: number;
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
  deliveries: Delivery[];
}

interface StatusBadgeConfig {
  bg: string;
  color: string;
  label: string;
  icon: string;
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    slug: 'healthy-bites-vegan-bowls',
    catererName: 'Healthy Bites',
    catererImage: 'https://i.pravatar.cc/150?img=1',
    catererPhone: '+1 (555) 123-4567',
    catererEmail: 'contact@healthybites.com',
    mealType: 'Vegan Bowls',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    frequency: 'daily',
    status: 'active',
    rating: 4.8,
    price: 12.99,
    servings: 1,
    description: 'Fresh, organic vegan bowls prepared daily with locally sourced ingredients.',
    ingredients: ['Quinoa', 'Kale', 'Chickpeas', 'Tahini', 'Lemon', 'Olive Oil'],
    calories: 450,
    protein: 18,
    deliveries: [
      {
        id: 'd1',
        date: '2026-03-26',
        time: '12:00 PM - 1:00 PM',
        status: 'on-the-way',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Please ring bell twice',
        mealType: 'Vegan Bowls',
      },
      {
        id: 'd2',
        date: '2026-03-27',
        time: '12:00 PM - 1:00 PM',
        status: 'scheduled',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Leave at door if not home',
        mealType: 'Vegan Bowls',
      },
      {
        id: 'd3',
        date: '2026-03-25',
        time: '12:00 PM - 1:00 PM',
        status: 'delivered',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Please ring bell twice',
        mealType: 'Vegan Bowls',
        review: {
          id: 'rev1',
          rating: 5,
          comment: 'Absolutely delicious! Fresh ingredients and perfectly portioned.',
          createdAt: '2026-03-25',
        },
      },
      {
        id: 'd4',
        date: '2026-03-24',
        time: '12:00 PM - 1:00 PM',
        status: 'delivered',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Please ring bell twice',
        mealType: 'Vegan Bowls',
      },
    ],
  },
  {
    id: '2',
    slug: 'italian-delights-pasta-meals',
    catererName: 'Italian Delights',
    catererImage: 'https://i.pravatar.cc/150?img=2',
    catererPhone: '+1 (555) 234-5678',
    catererEmail: 'info@italiandelights.com',
    mealType: 'Pasta Meals',
    startDate: '2026-02-01',
    endDate: '2026-05-31',
    frequency: 'alternate',
    status: 'active',
    rating: 4.6,
    price: 15.99,
    servings: 2,
    description: 'Authentic Italian pasta dishes made with fresh pasta and traditional sauces.',
    ingredients: ['Pasta', 'San Marzano Tomatoes', 'Basil', 'Mozzarella', 'Parmesan'],
    calories: 580,
    protein: 22,
    deliveries: [
      {
        id: 'd5',
        date: '2026-03-27',
        time: '6:00 PM - 7:00 PM',
        status: 'scheduled',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Leave at door if not home',
        mealType: 'Pasta Meals',
      },
      {
        id: 'd6',
        date: '2026-03-25',
        time: '6:00 PM - 7:00 PM',
        status: 'delivered',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Leave at door if not home',
        mealType: 'Pasta Meals',
      },
    ],
  },
  {
    id: '3',
    slug: 'spice-master-indian-curries',
    catererName: 'Spice Master',
    catererImage: 'https://i.pravatar.cc/150?img=3',
    catererPhone: '+1 (555) 345-6789',
    catererEmail: 'hello@spicemaster.com',
    mealType: 'Indian Curries',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    frequency: 'weekly',
    status: 'ending-soon',
    rating: 4.9,
    price: 14.99,
    servings: 2,
    description: 'Authentic Indian curries with aromatic spices and traditional cooking methods.',
    ingredients: ['Turmeric', 'Cumin', 'Coriander', 'Ginger', 'Garlic', 'Coconut Milk'],
    calories: 520,
    protein: 20,
    deliveries: [
      {
        id: 'd7',
        date: '2026-03-28',
        time: '7:00 PM - 8:00 PM',
        status: 'scheduled',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Extra spice on the side',
        mealType: 'Indian Curries',
      },
      {
        id: 'd8',
        date: '2026-03-21',
        time: '7:00 PM - 8:00 PM',
        status: 'delivered',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Extra spice on the side',
        mealType: 'Indian Curries',
      },
    ],
  },
];

export default function SubscriptionDetailPage({ params }: { params: { slug: string } }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDeliveryId, setExpandedDeliveryId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const found = MOCK_SUBSCRIPTIONS.find((s) => s.slug === params.slug);
    setSubscription(found || null);
    setLoading(false);
  }, [params.slug]);

  const getStatusBadge = (status: string): StatusBadgeConfig => {
    const badges: { [key: string]: StatusBadgeConfig } = {
      active: { bg: '#dcfce7', color: '#166534', label: 'Active', icon: '✓' },
      'ending-soon': { bg: '#fed7aa', color: '#92400e', label: 'Ending Soon', icon: '⚠️' },
      paused: { bg: '#fef3c7', color: '#92400e', label: 'Paused', icon: '⏸' },
      expired: { bg: '#fee2e2', color: '#991b1b', label: 'Expired', icon: '✗' },
      delivered: { bg: '#dcfce7', color: '#166534', label: 'Delivered', icon: '✓' },
      'on-the-way': { bg: '#dbeafe', color: '#0c4a6e', label: 'On The Way', icon: '🚚' },
      scheduled: { bg: '#f3e8ff', color: '#6b21a8', label: 'Scheduled', icon: '📅' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled', icon: '✗' },
      skipped: { bg: '#e0e7ff', color: '#3730a3', label: 'Skipped', icon: '⏭' },
    };
    return badges[status] || badges.scheduled;
  };

  const handleCancelDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancelDelivery = () => {
    if (selectedDelivery && subscription) {
      const updatedDeliveries = subscription.deliveries.map((d) =>
        d.id === selectedDelivery.id ? { ...d, status: 'cancelled' as const } : d
      );
      setSubscription({ ...subscription, deliveries: updatedDeliveries });
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedDelivery(null);
      alert('Delivery cancelled successfully');
    }
  };

  const handleReviewDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (selectedDelivery && subscription && reviewData.comment.trim()) {
      const updatedDeliveries = subscription.deliveries.map((d) =>
        d.id === selectedDelivery.id
          ? {
              ...d,
              review: {
                id: 'rev' + Date.now(),
                rating: reviewData.rating,
                comment: reviewData.comment,
                createdAt: new Date().toISOString().split('T')[0],
              },
            }
          : d
      );
      setSubscription({ ...subscription, deliveries: updatedDeliveries });
      setShowReviewModal(false);
      setSelectedDelivery(null);
      setReviewData({ rating: 5, comment: '' });
      alert('Review submitted successfully');
    }
  };

  const deleteReview = (delivery: Delivery) => {
    if (subscription) {
      const updatedDeliveries = subscription.deliveries.map((d) =>
        d.id === delivery.id ? { ...d, review: undefined } : d
      );
      setSubscription({ ...subscription, deliveries: updatedDeliveries });
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
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading subscription...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div style={{ padding: '32px' }}>
        <Link href="/customer/subscriptions" style={{ textDecoration: 'none' }}>
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
            Back to Subscriptions
          </button>
        </Link>
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            Subscription not found
          </p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(subscription.status);
  const upcomingDeliveries = subscription.deliveries.filter(
    (d) => d.status === 'scheduled' || d.status === 'on-the-way'
  );
  const pastDeliveries = subscription.deliveries.filter(
    (d) => d.status === 'delivered' || d.status === 'cancelled' || d.status === 'skipped'
  );

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link href="/customer/subscriptions" style={{ textDecoration: 'none' }}>
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
          Back to Subscriptions
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
          src={subscription.catererImage}
          alt={subscription.catererName}
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
                {subscription.catererName}
              </h1>
              <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
                {subscription.mealType}
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
              {badge.icon} {badge.label}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Rating</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <StarIcon style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  {subscription.rating}
                </p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Price</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                ${subscription.price.toFixed(2)}/delivery
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Frequency</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Servings</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {subscription.servings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column - About & Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* About This Meal */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', margin: '0 0 12px 0' }}>
              About This Meal
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: '1.5' }}>
              {subscription.description}
            </p>

            {/* Nutrition Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Calories</p>
                <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  {subscription.calories} kcal
                </p>
              </div>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Protein</p>
                <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  {subscription.protein}g
                </p>
              </div>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Servings</p>
                <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  {subscription.servings}
                </p>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0', fontWeight: '600' }}>
                Ingredients
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {subscription.ingredients.map((ingredient, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#f0f4ff',
                      border: '1px solid #dbeafe',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#0c4a6e',
                      fontWeight: '500',
                    }}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href={`tel:${subscription.catererPhone}`}
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
                {subscription.catererPhone}
              </a>
              <a
                href={`mailto:${subscription.catererEmail}`}
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
                {subscription.catererEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Deliveries */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
            Deliveries ({subscription.deliveries.length})
          </h3>

          {/* Upcoming Deliveries */}
          {upcomingDeliveries.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>
                📅 UPCOMING ({upcomingDeliveries.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingDeliveries.map((delivery) => {
                  const deliveryBadge = getStatusBadge(delivery.status);
                  const isExpanded = expandedDeliveryId === delivery.id;

                  return (
                    <div key={delivery.id}>
                      <button
                        onClick={() => setExpandedDeliveryId(isExpanded ? null : delivery.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: `1px solid ${isExpanded ? '#667eea' : '#e2e8f0'}`,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            {new Date(delivery.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                            {delivery.time}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              backgroundColor: deliveryBadge.bg,
                              color: deliveryBadge.color,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {deliveryBadge.icon} {deliveryBadge.label}
                          </div>
                          <ChevronDownIcon
                            style={{
                              width: '16px',
                              height: '16px',
                              color: '#64748b',
                              transition: 'transform 0.2s ease',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderLeft: '1px solid #dbeafe',
                            borderRight: '1px solid #dbeafe',
                            borderBottom: '1px solid #dbeafe',
                            borderRadius: '0 0 8px 8px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ marginBottom: '12px' }}>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>
                              📍 Location
                            </p>
                            <p style={{ fontSize: '13px', color: '#1e293b', margin: 0 }}>
                              {delivery.location}
                            </p>
                          </div>

                          {delivery.specialInstructions && (
                            <div style={{ marginBottom: '12px' }}>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>
                                📝 Special Instructions
                              </p>
                              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, fontStyle: 'italic' }}>
                                {delivery.specialInstructions}
                              </p>
                            </div>
                          )}

                          {/* Cancel Button */}
                          <button
                            onClick={() => handleCancelDelivery(delivery)}
                            style={{
                              padding: '8px 12px',
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
                            ✕ Cancel Delivery
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Deliveries */}
          {pastDeliveries.length > 0 && (
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>
                ✓ PAST ({pastDeliveries.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pastDeliveries.map((delivery) => {
                  const deliveryBadge = getStatusBadge(delivery.status);
                  const isExpanded = expandedDeliveryId === delivery.id;

                  return (
                    <div key={delivery.id}>
                      <button
                        onClick={() => setExpandedDeliveryId(isExpanded ? null : delivery.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: `1px solid ${isExpanded ? '#667eea' : '#e2e8f0'}`,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          opacity: 0.8,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            {new Date(delivery.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                            {delivery.time}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              backgroundColor: deliveryBadge.bg,
                              color: deliveryBadge.color,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {deliveryBadge.icon} {deliveryBadge.label}
                          </div>
                          <ChevronDownIcon
                            style={{
                              width: '16px',
                              height: '16px',
                              color: '#64748b',
                              transition: 'transform 0.2s ease',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderLeft: '1px solid #e2e8f0',
                            borderRight: '1px solid #e2e8f0',
                            borderBottom: '1px solid #e2e8f0',
                            borderRadius: '0 0 8px 8px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ marginBottom: '12px' }}>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>
                              📍 Location
                            </p>
                            <p style={{ fontSize: '13px', color: '#1e293b', margin: 0 }}>
                              {delivery.location}
                            </p>
                          </div>

                          {delivery.specialInstructions && (
                            <div style={{ marginBottom: '12px' }}>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>
                                📝 Special Instructions
                              </p>
                              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, fontStyle: 'italic' }}>
                                {delivery.specialInstructions}
                              </p>
                            </div>
                          )}

                          {/* Review Section */}
                          {delivery.status === 'delivered' && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                              {delivery.review ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                                      Your Review
                                    </p>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                          key={star}
                                          style={{
                                            width: '14px',
                                            height: '14px',
                                            fill: star <= delivery.review!.rating ? '#fbbf24' : '#e5e7eb',
                                            color: star <= delivery.review!.rating ? '#fbbf24' : '#e5e7eb',
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#1e293b', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                                      {delivery.review.comment}
                                    </p>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 8px 0' }}>
                                      {new Date(delivery.review.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => deleteReview(delivery)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: '1px solid #fee2e2',
                                      backgroundColor: 'transparent',
                                      color: '#991b1b',
                                      fontSize: '11px',
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
                                    <TrashIcon style={{ width: '12px', height: '12px' }} />
                                    Delete Review
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleReviewDelivery(delivery)}
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #dbeafe',
                                    backgroundColor: '#f0f9ff',
                                    color: '#0c4a6e',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                                  }}
                                >
                                  <StarIcon style={{ width: '14px', height: '14px' }} />
                                  Write Review
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Delivery Modal */}
      {showCancelModal && selectedDelivery && (
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
          onClick={() => setShowCancelModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Cancel Delivery
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
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

            <div
              style={{
                backgroundColor: '#fee2e2',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #fecaca',
              }}
            >
              <p style={{ fontSize: '13px', color: '#991b1b', margin: 0 }}>
                Are you sure you want to cancel the delivery on{' '}
                <strong>{new Date(selectedDelivery.date).toLocaleDateString()}</strong>?
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px',
                }}
              >
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're cancelling this delivery..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px 12px',
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
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
                Keep Delivery
              </button>
              <button
                onClick={confirmCancelDelivery}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#991b1b',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7f1d1d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#991b1b';
                }}
              >
                Cancel Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedDelivery && (
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
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Rate This Delivery
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

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>
                Delivery on {new Date(selectedDelivery.date).toLocaleDateString()}
              </p>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '10px' }}>
                How would you rate this delivery? *
              </label>
              {renderStars(reviewData.rating, (rating) =>
                setReviewData({ ...reviewData, rating })
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px',
                }}
              >
                Your Review *
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your feedback about this meal delivery..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px 12px',
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
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
                  padding: '10px',
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
      )}
    </div>
  );
}