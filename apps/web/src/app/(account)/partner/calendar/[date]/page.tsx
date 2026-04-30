'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  RotateCcw,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  MapPin,
  Phone,
  DollarSign,
  Users,
  TrendingDown,
  Calendar,
  Filter,
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  items: string[];
  quantity: number;
  amount: number;
  deliveryTime: string;
  deliveryAddress: string;
  status: 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  notes?: string;
  phone?: string;
}

interface Subscription {
  id: string;
  customerName: string;
  mealType: string;
  mealsPerWeek: number;
  nextDelivery: string;
  amount: number;
  status: 'active' | 'paused' | 'cancelled';
  phone?: string;
  email?: string;
}

interface DayData {
  date: string;
  dayOfWeek: string;
  meals: number;
  orders: number;
  subscriptions: number;
  cancelled: number;
  revenue: number;
  status: 'normal' | 'busy' | 'quiet' | 'critical';
  ordersList: Order[];
  subscriptionsList: Subscription[];
}

// Mock detailed data for specific dates
const MOCK_DAY_DETAILS: { [key: string]: DayData } = {
  '2026-03-25': {
    date: '2026-03-25',
    dayOfWeek: 'Wednesday',
    meals: 42,
    orders: 10,
    subscriptions: 32,
    cancelled: 3,
    revenue: 6800,
    status: 'normal',
    ordersList: [
      {
        id: 'ORD-001',
        customerName: 'Rajesh Kumar',
        items: ['Butter Chicken', 'Basmati Rice', 'Naan'],
        quantity: 2,
        amount: 450,
        deliveryTime: '12:30 PM',
        deliveryAddress: '123 Park Street, Kolkata',
        status: 'preparing',
        notes: 'Extra spicy',
        phone: '+91 98765 43210',
      },
      {
        id: 'ORD-002',
        customerName: 'Priya Sharma',
        items: ['Paneer Tikka', 'Mixed Vegetables'],
        quantity: 1,
        amount: 320,
        deliveryTime: '1:00 PM',
        deliveryAddress: '456 Elm Road, Kolkata',
        status: 'pending',
        phone: '+91 98765 43211',
      },
      {
        id: 'ORD-003',
        customerName: 'Amit Patel',
        items: ['Luchi Aloo', 'Fish Curry', 'Rice'],
        quantity: 3,
        amount: 750,
        deliveryTime: '12:45 PM',
        deliveryAddress: '789 Main St, Kolkata',
        status: 'ready',
        phone: '+91 98765 43212',
      },
      {
        id: 'ORD-004',
        customerName: 'Sneha Das',
        items: ['Chow Mein', 'Spring Rolls'],
        quantity: 2,
        amount: 280,
        deliveryTime: '1:15 PM',
        deliveryAddress: '321 Oak Ave, Kolkata',
        status: 'out-for-delivery',
        phone: '+91 98765 43213',
      },
      {
        id: 'ORD-005',
        customerName: 'Vikram Singh',
        items: ['Tandoori Chicken', 'Naan', 'Salad'],
        quantity: 2,
        amount: 520,
        deliveryTime: '1:30 PM',
        deliveryAddress: '654 Pine St, Kolkata',
        status: 'delivered',
        phone: '+91 98765 43214',
      },
      {
        id: 'ORD-006',
        customerName: 'Anjali Gupta',
        items: ['Paneer Butter Masala', 'Rice'],
        quantity: 1,
        amount: 350,
        deliveryTime: '12:15 PM',
        deliveryAddress: '987 Cedar Lane, Kolkata',
        status: 'cancelled',
        notes: 'Customer cancelled - not available',
        phone: '+91 98765 43215',
      },
      {
        id: 'ORD-007',
        customerName: 'Rohan Desai',
        items: ['Dal Makhani', 'Naan', 'Raita'],
        quantity: 2,
        amount: 480,
        deliveryTime: '1:45 PM',
        deliveryAddress: '159 Birch St, Kolkata',
        status: 'ready',
        phone: '+91 98765 43216',
      },
      {
        id: 'ORD-008',
        customerName: 'Divya Nair',
        items: ['Vegetable Biryani', 'Raita'],
        quantity: 1,
        amount: 320,
        deliveryTime: '2:00 PM',
        deliveryAddress: '753 Maple Ave, Kolkata',
        status: 'preparing',
        phone: '+91 98765 43217',
      },
      {
        id: 'ORD-009',
        customerName: 'Karan Malhotra',
        items: ['Chicken Tikka Masala', 'Basmati Rice'],
        quantity: 2,
        amount: 580,
        deliveryTime: '1:20 PM',
        deliveryAddress: '456 Oak Road, Kolkata',
        status: 'cancelled',
        notes: 'Out of stock - refunded',
        phone: '+91 98765 43218',
      },
      {
        id: 'ORD-010',
        customerName: 'Neha Patel',
        items: ['Chana Masala', 'Puri', 'Pickle'],
        quantity: 1,
        amount: 280,
        deliveryTime: '12:50 PM',
        deliveryAddress: '321 Spruce Ln, Kolkata',
        status: 'ready',
        phone: '+91 98765 43219',
      },
    ],
    subscriptionsList: [
      {
        id: 'SUB-001',
        customerName: 'Vikram Singh',
        mealType: 'Lunch Pro Plan',
        mealsPerWeek: 5,
        nextDelivery: '2026-03-25, 12:30 PM',
        amount: 2500,
        status: 'active',
        phone: '+91 98765 43220',
        email: 'vikram@example.com',
      },
      {
        id: 'SUB-002',
        customerName: 'Anjali Gupta',
        mealType: 'Breakfast Bundle',
        mealsPerWeek: 5,
        nextDelivery: '2026-03-25, 8:00 AM',
        amount: 1500,
        status: 'active',
        phone: '+91 98765 43221',
        email: 'anjali@example.com',
      },
      {
        id: 'SUB-003',
        customerName: 'Rohan Desai',
        mealType: 'All-Day Combo',
        mealsPerWeek: 7,
        nextDelivery: '2026-03-25, 5:30 PM',
        amount: 3500,
        status: 'active',
        phone: '+91 98765 43222',
        email: 'rohan@example.com',
      },
      {
        id: 'SUB-004',
        customerName: 'Divya Nair',
        mealType: 'Wellness Plan',
        mealsPerWeek: 6,
        nextDelivery: '2026-03-25, 7:00 AM',
        amount: 2800,
        status: 'active',
        phone: '+91 98765 43223',
        email: 'divya@example.com',
      },
      {
        id: 'SUB-005',
        customerName: 'Karan Malhotra',
        mealType: 'Premium Mix',
        mealsPerWeek: 5,
        nextDelivery: '2026-03-25, 1:00 PM',
        amount: 2200,
        status: 'paused',
        phone: '+91 98765 43224',
        email: 'karan@example.com',
      },
    ],
  },
};

export default function CalendarDatePage({ params }: { params: { date: string } }) {
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'orders' | 'subscriptions'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const data = MOCK_DAY_DETAILS[params.date];
      if (data) {
        setDayData(data);
      } else {
        // Create default data if not found
        setDayData({
          date: params.date,
          dayOfWeek: new Date(params.date).toLocaleDateString('en-US', { weekday: 'long' }),
          meals: 0,
          orders: 0,
          subscriptions: 0,
          cancelled: 0,
          revenue: 0,
          status: 'quiet',
          ordersList: [],
          subscriptionsList: [],
        });
      }
      setLoading(false);
    }, 300);
  }, [params.date]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading day details...</p>
        </div>
      </div>
    );
  }

  if (!dayData) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No data found for this date</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e', icon: Clock };
      case 'preparing':
        return { bg: '#f3e8ff', text: '#6b21a8', icon: Package };
      case 'ready':
        return { bg: '#dbeafe', text: '#0c4a6e', icon: CheckCircle };
      case 'out-for-delivery':
        return { bg: '#dcfce7', text: '#166534', icon: TrendingUp };
      case 'delivered':
        return { bg: '#d1fae5', text: '#065f46', icon: CheckCircle };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b', icon: X };
      case 'active':
        return { bg: '#dcfce7', text: '#166534', icon: CheckCircle };
      case 'paused':
        return { bg: '#fee2e2', text: '#991b1b', icon: AlertCircle };
      default:
        return { bg: '#f3f4f6', text: '#374151', icon: AlertCircle };
    }
  };

  const getStatusIcon = (status: string) => {
    const colors = getStatusColor(status);
    return colors.icon;
  };

  const dayDate = new Date(dayData.date);
  const formattedDate = dayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Filter data based on active tab
  let displayOrders = dayData.ordersList;
  let displaySubscriptions = dayData.subscriptionsList;

  if (statusFilter !== 'all') {
    displayOrders = displayOrders.filter((o) => o.status === statusFilter);
    displaySubscriptions = displaySubscriptions.filter((s) => s.status === statusFilter);
  }

  const getOrderStats = () => {
    const pending = dayData.ordersList.filter((o) => o.status === 'pending').length;
    const preparing = dayData.ordersList.filter((o) => o.status === 'preparing').length;
    const ready = dayData.ordersList.filter((o) => o.status === 'ready').length;
    const outForDelivery = dayData.ordersList.filter((o) => o.status === 'out-for-delivery').length;
    const delivered = dayData.ordersList.filter((o) => o.status === 'delivered').length;
    const cancelled = dayData.ordersList.filter((o) => o.status === 'cancelled').length;

    return { pending, preparing, ready, outForDelivery, delivered, cancelled };
  };

  const orderStats = getOrderStats();

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <Link href="/caterer/calendar" style={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Calendar
          </Link>

          <div>
            <h1 style={styles.title}>{formattedDate}</h1>
            <p style={styles.subtitle}>Detailed insights for this day</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#eff6ff' }}>
              <Package size={24} style={{ color: '#0284c7' }} />
            </div>
            <div>
              <p style={styles.metricLabel}>Total Meals</p>
              <h3 style={styles.metricValue}>{dayData.meals}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#f0fdf4' }}>
              <ShoppingCart size={24} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <p style={styles.metricLabel}>Orders</p>
              <h3 style={styles.metricValue}>{dayData.orders}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#fdf2f8' }}>
              <RotateCcw size={24} style={{ color: '#ec4899' }} />
            </div>
            <div>
              <p style={styles.metricLabel}>Subscriptions</p>
              <h3 style={styles.metricValue}>{dayData.subscriptions}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#fee2e2' }}>
              <X size={24} style={{ color: '#991b1b' }} />
            </div>
            <div>
              <p style={styles.metricLabel}>Cancelled</p>
              <h3 style={{ ...styles.metricValue, color: dayData.cancelled > 0 ? '#991b1b' : '#16a34a' }}>
                {dayData.cancelled}
              </h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#fef3c7' }}>
              <DollarSign size={24} style={{ color: '#d97706' }} />
            </div>
            <div>
              <p style={styles.metricLabel}>Revenue</p>
              <h3 style={styles.metricValue}>₹{dayData.revenue.toLocaleString()}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#e0e7ff' }}>
              <Calendar size={24} style={{ color: '#4f46e5' }} />
            </div>
            <div>
              <p style={styles.metricLabel}>Status</p>
              <h3 style={styles.metricValue} style={{ textTransform: 'uppercase' }}>
                {dayData.status}
              </h3>
            </div>
          </div>
        </div>

        {/* Orders Status Breakdown */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Order Status Breakdown</h2>
          <div style={styles.statusBreakdownGrid}>
            <div style={styles.breakdownItem}>
              <div style={{ ...styles.breakdownColor, backgroundColor: '#fef3c7' }} />
              <span>Pending: {orderStats.pending}</span>
            </div>
            <div style={styles.breakdownItem}>
              <div style={{ ...styles.breakdownColor, backgroundColor: '#f3e8ff' }} />
              <span>Preparing: {orderStats.preparing}</span>
            </div>
            <div style={styles.breakdownItem}>
              <div style={{ ...styles.breakdownColor, backgroundColor: '#dbeafe' }} />
              <span>Ready: {orderStats.ready}</span>
            </div>
            <div style={styles.breakdownItem}>
              <div style={{ ...styles.breakdownColor, backgroundColor: '#dcfce7' }} />
              <span>Out for Delivery: {orderStats.outForDelivery}</span>
            </div>
            <div style={styles.breakdownItem}>
              <div style={{ ...styles.breakdownColor, backgroundColor: '#d1fae5' }} />
              <span>Delivered: {orderStats.delivered}</span>
            </div>
            <div style={styles.breakdownItem}>
              <div style={{ ...styles.breakdownColor, backgroundColor: '#fee2e2' }} />
              <span>Cancelled: {orderStats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div style={styles.card}>
          <div style={styles.tabsContainer}>
            <div style={styles.tabs}>
              <button
                onClick={() => setFilterTab('all')}
                style={{
                  ...styles.tab,
                  ...(filterTab === 'all' ? styles.tabActive : styles.tabInactive),
                }}
              >
                All ({dayData.ordersList.length + dayData.subscriptionsList.length})
              </button>
              <button
                onClick={() => setFilterTab('orders')}
                style={{
                  ...styles.tab,
                  ...(filterTab === 'orders' ? styles.tabActive : styles.tabInactive),
                }}
              >
                Orders ({dayData.ordersList.length})
              </button>
              <button
                onClick={() => setFilterTab('subscriptions')}
                style={{
                  ...styles.tab,
                  ...(filterTab === 'subscriptions' ? styles.tabActive : styles.tabInactive),
                }}
              >
                Subscriptions ({dayData.subscriptionsList.length})
              </button>
            </div>

            <div style={styles.filterContainer}>
              <Filter size={18} style={{ color: '#6b7280' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {(filterTab === 'all' || filterTab === 'orders') && (
            <div style={styles.listSection}>
              <h3 style={styles.listTitle}>Orders</h3>
              {displayOrders.length > 0 ? (
                <div style={styles.itemsList}>
                  {displayOrders.map((order) => {
                    const statusColor = getStatusColor(order.status);
                    const StatusIcon = getStatusIcon(order.status);

                    return (
                      <div key={order.id} style={styles.listItem}>
                        <div style={styles.listItemContent}>
                          <div style={styles.listItemHeader}>
                            <h4 style={styles.listItemTitle}>{order.id}</h4>
                            <span
                              style={{
                                ...styles.statusBadge,
                                backgroundColor: statusColor.bg,
                                color: statusColor.text,
                              }}
                            >
                              <StatusIcon size={14} />
                              {order.status.replace('-', ' ')}
                            </span>
                          </div>

                          <p style={styles.customerName}>{order.customerName}</p>

                          <div style={styles.itemMetaInfo}>
                            <span style={styles.metaInfoItem}>
                              <Clock size={14} />
                              {order.deliveryTime}
                            </span>
                            <span style={styles.metaInfoItem}>
                              <MapPin size={14} />
                              {order.deliveryAddress}
                            </span>
                            <span style={styles.metaInfoItem}>
                              <Phone size={14} />
                              {order.phone}
                            </span>
                          </div>

                          <div style={styles.itemsTagsContainer}>
                            {order.items.map((item, idx) => (
                              <span key={idx} style={styles.itemTag}>
                                {item}
                              </span>
                            ))}
                          </div>

                          {order.notes && (
                            <div style={styles.notesBox}>
                              <strong>Notes:</strong> {order.notes}
                            </div>
                          )}
                        </div>

                        <div style={styles.listItemPrice}>
                          <p style={styles.priceLabel}>Amount</p>
                          <p style={styles.price}>₹{order.amount}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={styles.emptyMessage}>No orders to display</p>
              )}
            </div>
          )}

          {/* Subscriptions List */}
          {(filterTab === 'all' || filterTab === 'subscriptions') && (
            <div style={styles.listSection}>
              <h3 style={styles.listTitle}>Subscriptions</h3>
              {displaySubscriptions.length > 0 ? (
                <div style={styles.itemsList}>
                  {displaySubscriptions.map((sub) => {
                    const statusColor = getStatusColor(sub.status);
                    const StatusIcon = getStatusIcon(sub.status);

                    return (
                      <div key={sub.id} style={styles.listItem}>
                        <div style={styles.listItemContent}>
                          <div style={styles.listItemHeader}>
                            <h4 style={styles.listItemTitle}>{sub.id}</h4>
                            <span
                              style={{
                                ...styles.statusBadge,
                                backgroundColor: statusColor.bg,
                                color: statusColor.text,
                              }}
                            >
                              <StatusIcon size={14} />
                              {sub.status}
                            </span>
                          </div>

                          <p style={styles.customerName}>{sub.customerName}</p>

                          <div style={styles.subscriptionInfo}>
                            <span style={styles.subscriptionBadge}>{sub.mealType}</span>
                            <span style={styles.subscriptionBadge}>{sub.mealsPerWeek} meals/week</span>
                          </div>

                          <div style={styles.itemMetaInfo}>
                            <span style={styles.metaInfoItem}>
                              <Calendar size={14} />
                              {sub.nextDelivery}
                            </span>
                            <span style={styles.metaInfoItem}>
                              <Phone size={14} />
                              {sub.phone}
                            </span>
                            <span style={styles.metaInfoItem}>
                              📧 {sub.email}
                            </span>
                          </div>
                        </div>

                        <div style={styles.listItemPrice}>
                          <p style={styles.priceLabel}>Monthly</p>
                          <p style={styles.price}>₹{sub.amount}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={styles.emptyMessage}>No subscriptions to display</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px 16px',
  },
  maxWidth: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  pageHeader: {
    marginBottom: '32px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '16px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    gap: '16px',
  },
  metricIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '4px 0 0 0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 20px 0',
  },
  statusBreakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  breakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  breakdownColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
  },
  tab: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },
  tabInactive: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  filterSelect: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    outline: 'none',
  },
  listSection: {
    marginTop: '24px',
  },
  listTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 16px 0',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  listItemContent: {
    flex: 1,
  },
  listItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  listItemTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  customerName: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  itemMetaInfo: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap' as const,
  },
  metaInfoItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  itemsTagsContainer: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    marginBottom: '8px',
  },
  itemTag: {
    display: 'inline-block',
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  },
  notesBox: {
    padding: '8px 12px',
    backgroundColor: '#fef3c7',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#92400e',
    marginTop: '8px',
  },
  subscriptionInfo: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  subscriptionBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  listItemPrice: {
    textAlign: 'right' as const,
    minWidth: '100px',
  },
  priceLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '600',
  },
  price: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: '4px 0 0 0',
  },
  emptyMessage: {
    color: '#6b7280',
    fontSize: '14px',
    padding: '24px',
    textAlign: 'center' as const,
  },
};