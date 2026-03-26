'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  TruckIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  catererName: string;
  catererImage: string;
  mealType: string;
  startDate: string;
  endDate: string;
  frequency: 'daily' | 'weekly' | 'alternate';
  status: 'active' | 'paused' | 'ending-soon' | 'expired';
  nextDelivery: string;
  rating: number;
  price: number;
  servings: number;
}

interface DeliveryStatus {
  id: string;
  subscriptionId: string;
  catererName: string;
  mealType: string;
  date: string;
  time: string;
  status: 'delivered' | 'on-the-way' | 'scheduled' | 'cancelled';
  location: string;
  specialInstructions: string;
}

interface DashboardStats {
  activeSubscriptions: number;
  totalSpent: number;
  mealsReceived: number;
  upcomingDeliveries: number;
}

export default function CustomerDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [todayDeliveries, setTodayDeliveries] = useState<DeliveryStatus[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeSubscriptions: 0,
    totalSpent: 0,
    mealsReceived: 0,
    upcomingDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        catererName: 'Healthy Bites',
        catererImage: 'https://i.pravatar.cc/150?img=1',
        mealType: 'Vegan Bowls',
        startDate: '2026-01-15',
        endDate: '2026-06-30',
        frequency: 'daily',
        status: 'active',
        nextDelivery: '2026-03-26',
        rating: 4.8,
        price: 12.99,
        servings: 1,
      },
      {
        id: '2',
        catererName: 'Italian Delights',
        catererImage: 'https://i.pravatar.cc/150?img=2',
        mealType: 'Pasta Meals',
        startDate: '2026-02-01',
        endDate: '2026-05-31',
        frequency: 'alternate',
        status: 'active',
        nextDelivery: '2026-03-27',
        rating: 4.6,
        price: 15.99,
        servings: 2,
      },
      {
        id: '3',
        catererName: 'Spice Master',
        catererImage: 'https://i.pravatar.cc/150?img=3',
        mealType: 'Indian Curries',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        frequency: 'weekly',
        status: 'ending-soon',
        nextDelivery: '2026-03-28',
        rating: 4.9,
        price: 14.99,
        servings: 2,
      },
    ];

    const mockDeliveries: DeliveryStatus[] = [
      {
        id: 'd1',
        subscriptionId: '1',
        catererName: 'Healthy Bites',
        mealType: 'Vegan Bowls',
        date: '2026-03-26',
        time: '12:00 PM - 1:00 PM',
        status: 'on-the-way',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Please ring bell twice',
      },
      {
        id: 'd2',
        subscriptionId: '2',
        catererName: 'Italian Delights',
        mealType: 'Pasta Meals',
        date: '2026-03-27',
        time: '6:00 PM - 7:00 PM',
        status: 'scheduled',
        location: '123 Main St, Apt 4B',
        specialInstructions: 'Leave at door if not home',
      },
    ];

    setSubscriptions(mockSubscriptions);
    setTodayDeliveries(mockDeliveries);
    setStats({
      activeSubscriptions: 3,
      totalSpent: 1250.5,
      mealsReceived: 45,
      upcomingDeliveries: 2,
    });
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; color: string; label: string; icon: React.ReactNode } } = {
      active: {
        bg: '#dcfce7',
        color: '#166534',
        label: 'Active',
        icon: <CheckCircleIcon style={{ width: '16px', height: '16px' }} />,
      },
      paused: {
        bg: '#fef3c7',
        color: '#92400e',
        label: 'Paused',
        icon: <ClockIcon style={{ width: '16px', height: '16px' }} />,
      },
      'ending-soon': {
        bg: '#fed7aa',
        color: '#92400e',
        label: 'Ending Soon',
        icon: <ExclamationIcon style={{ width: '16px', height: '16px' }} />,
      },
      expired: {
        bg: '#fee2e2',
        color: '#991b1b',
        label: 'Expired',
        icon: <ExclamationIcon style={{ width: '16px', height: '16px' }} />,
      },
      delivered: {
        bg: '#dcfce7',
        color: '#166534',
        label: 'Delivered',
        icon: <CheckCircleIcon style={{ width: '16px', height: '16px' }} />,
      },
      'on-the-way': {
        bg: '#dbeafe',
        color: '#0c4a6e',
        label: 'On The Way',
        icon: <TruckIcon style={{ width: '16px', height: '16px' }} />,
      },
      scheduled: {
        bg: '#f3e8ff',
        color: '#6b21a8',
        label: 'Scheduled',
        icon: <CalendarDaysIcon style={{ width: '16px', height: '16px' }} />,
      },
      cancelled: {
        bg: '#fee2e2',
        color: '#991b1b',
        label: 'Cancelled',
        icon: <ExclamationIcon style={{ width: '16px', height: '16px' }} />,
      },
    };

    return badges[status] || badges.scheduled;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          Welcome back! 👋
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
          Here's what's happening with your meal subscriptions today.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: 0 }}>Active Subscriptions</h3>
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
              <UserGroupIcon style={{ width: '20px', height: '20px', color: '#0284c7' }} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
            {stats.activeSubscriptions}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>+2 from last month</p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: 0 }}>Upcoming Deliveries</h3>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TruckIcon style={{ width: '20px', height: '20px', color: '#ea580c' }} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
            {stats.upcomingDeliveries}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>Next 7 days</p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: 0 }}>Meals Received</h3>
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
              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#16a34a' }} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
            {stats.mealsReceived}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>All time</p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: 0 }}>Total Spent</h3>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '20px' }}>💰</span>
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
            ${stats.totalSpent.toFixed(2)}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>This year</p>
        </div>
      </div>

      {/* Today's Deliveries */}
      {todayDeliveries.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
            Today's Deliveries
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            {todayDeliveries.map((delivery) => {
              const badge = getStatusBadge(delivery.status);
              return (
                <div
                  key={delivery.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                      {delivery.catererName}
                    </h3>
                    <div
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {badge.icon}
                      {badge.label}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>{delivery.mealType}</span>
                    </p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>📍 {delivery.location}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 2px 0' }}>Date</p>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                        {new Date(delivery.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 2px 0' }}>Time</p>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                        {delivery.time}
                      </p>
                    </div>
                  </div>

                  {delivery.specialInstructions && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '12px',
                      }}
                    >
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>
                        Special Instructions
                      </p>
                      <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                        {delivery.specialInstructions}
                      </p>
                    </div>
                  )}

                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#667eea',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#667eea';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.color = '#667eea';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Track Order
                    <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Subscriptions */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
          Your Active Subscriptions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px',
          }}
        >
          {subscriptions.map((sub) => {
            const badge = getStatusBadge(sub.status);
            const isEnding = sub.status === 'ending-soon';

            return (
              <div
                key={sub.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: isEnding ? '2px solid #fed7aa' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isEnding && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#fed7aa',
                      color: '#92400e',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      borderRadius: '0 0 0 8px',
                    }}
                  >
                    Ending Soon
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <img
                    src={sub.catererImage}
                    alt={sub.catererName}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {sub.catererName}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
                      {sub.mealType}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <StarIcon style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                        {sub.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Frequency</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0 0' }}>
                      {sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Price</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0 0' }}>
                      ${sub.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Servings</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0 0' }}>
                      {sub.servings}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Status</p>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: sub.status === 'active' ? '#16a34a' : '#f59e0b',
                        }}
                      />
                      {badge.label}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f0f4ff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '16px',
                  }}
                >
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: '600' }}>
                    Next Delivery
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#667eea', margin: '2px 0 0 0' }}>
                    {new Date(sub.nextDelivery).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
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
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5568d3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#667eea';
                    }}
                  >
                    Manage
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      color: '#667eea',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}