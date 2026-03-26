'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface Delivery {
  id: string;
  date: string;
  time: string;
  status: 'delivered' | 'on-the-way' | 'scheduled' | 'cancelled' | 'skipped';
  location: string;
  specialInstructions: string;
  mealType: string;
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
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

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSubscriptions(MOCK_SUBSCRIPTIONS);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string): StatusBadgeConfig => {
    const badges: { [key: string]: StatusBadgeConfig } = {
      active: { bg: '#dcfce7', color: '#166534', label: 'Active', icon: '✓' },
      'ending-soon': { bg: '#fed7aa', color: '#92400e', label: 'Ending Soon', icon: '⚠️' },
      paused: { bg: '#fef3c7', color: '#92400e', label: 'Paused', icon: '⏸' },
      expired: { bg: '#fee2e2', color: '#991b1b', label: 'Expired', icon: '✗' },
    };

    return badges[status] || badges.active;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          My Subscriptions
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
          Manage your meal subscriptions and track deliveries
        </p>
      </div>

      {/* Subscriptions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {subscriptions.map((subscription) => {
          const badge = getStatusBadge(subscription.status);
          const upcomingCount = subscription.deliveries.filter(
            (d) => d.status === 'scheduled' || d.status === 'on-the-way'
          ).length;

          return (
            <Link
              key={subscription.id}
              href={`/customer/subscriptions/${subscription.slug}`}
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
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Image */}
                <img
                  src={subscription.catererImage}
                  alt={subscription.catererName}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                  }}
                />

                {/* Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                      {subscription.catererName}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      {subscription.mealType}
                    </p>
                  </div>

                  {/* Badge */}
                  <div
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                      marginBottom: '12px',
                      width: 'fit-content',
                    }}
                  >
                    {badge.icon} {badge.label}
                  </div>

                  {/* Quick Info */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarIcon style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>{subscription.rating}</span>
                    </div>
                    <span style={{ color: '#94a3b8' }}>•</span>
                    <span style={{ color: '#1e293b', fontWeight: '600' }}>
                      ${subscription.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Upcoming Deliveries */}
                  <div
                    style={{
                      backgroundColor: '#f0f4ff',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      marginTop: 'auto',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3730a3',
                    }}
                  >
                    📅 {upcomingCount} Upcoming Deliveries
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}