'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Package,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';

type OrderType = 'quote' | 'subscription' | 'booking';

interface Order {
  id: string;
  type: OrderType;
  restaurantName: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  items: string[];
  deliveryAddress: string;
  estimatedDelivery: string;
  rating: number;
  reviewed: boolean;
  cancellationReason: null | string;
}

interface ApprovedQuote extends Order {
  type: 'quote';
  quoteId: string;
  quoteStatus: 'pending' | 'approved' | 'rejected';
  approvedDate?: string;
  originalPrice: number;
  quotedPrice: number;
  discount: number;
  mealType: string;
  mealsPerWeek: number;
  duration: number;
  deliveryDays: string[];
  specialRequirements?: string;
}

interface MealSubscription extends Order {
  type: 'subscription';
  subscriptionId: string;
  mealType: string;
  mealsPerWeek: number;
  startDate: string;
  endDate?: string;
  subscriptionStatus: 'active' | 'paused' | 'completed' | 'cancelled';
  deliveryDays: string[];
  deliveryTime: string;
  nextDelivery?: string;
  totalMeals: number;
  mealsConsumed: number;
  specialInstructions?: string;
}

const MOCK_DATA = [
  {
    id: 'QT-001-ORD',
    type: 'quote',
    quoteId: 'QT-001',
    restaurantName: 'Bella Italia',
    category: 'catering',
    amount: 7500,
    date: '2026-03-15',
    status: 'pending',
    items: ['Spaghetti Carbonara', 'Caesar Salad', 'Tiramisu'],
    deliveryAddress: '123 Main St, New York, NY 10001',
    estimatedDelivery: '2026-03-25 07:30 PM',
    rating: 0,
    reviewed: false,
    cancellationReason: null,
    quoteStatus: 'approved',
    approvedDate: '2026-03-18',
    originalPrice: 7999,
    quotedPrice: 7500,
    discount: 499,
    mealType: 'Lunch Pro Plan',
    mealsPerWeek: 5,
    duration: 30,
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    specialRequirements: 'Less oil, more vegetables',
  },
  {
    id: 'QT-002-ORD',
    type: 'quote',
    quoteId: 'QT-002',
    restaurantName: 'Dragon Palace',
    category: 'catering',
    amount: 17999,
    date: '2026-03-10',
    status: 'completed',
    items: ['Kung Pao Chicken', 'Fried Rice', 'Spring Rolls'],
    deliveryAddress: '456 Oak Ave, New York, NY 10002',
    estimatedDelivery: '2026-03-25 06:45 PM',
    rating: 4.5,
    reviewed: true,
    cancellationReason: null,
    quoteStatus: 'approved',
    approvedDate: '2026-03-15',
    originalPrice: 18999,
    quotedPrice: 17999,
    discount: 1000,
    mealType: 'All-Day Combo',
    mealsPerWeek: 7,
    duration: 30,
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    id: 'SUB-001-ORD',
    type: 'subscription',
    subscriptionId: 'SUB-001',
    restaurantName: 'Kolkata Home Kitchens',
    category: 'catering',
    amount: 7999,
    date: '2026-03-19',
    status: 'active',
    items: ['Luchi Aloo', 'Machli Jhol', 'Cholar Dal', 'Rice', 'Mishti Doi'],
    deliveryAddress: '123 Park Street, Kolkata, 700016',
    estimatedDelivery: '2026-03-25 12:30 PM',
    rating: 4.8,
    reviewed: false,
    cancellationReason: null,
    mealType: 'Lunch Pro Plan',
    mealsPerWeek: 5,
    startDate: '2026-03-25',
    subscriptionStatus: 'active',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    deliveryTime: '12:30 PM - 1:00 PM',
    nextDelivery: '2026-03-25',
    totalMeals: 20,
    mealsConsumed: 4,
    specialInstructions: 'Less spice, extra rice',
  },
  {
    id: 'SUB-002-ORD',
    type: 'subscription',
    subscriptionId: 'SUB-002',
    restaurantName: 'Mumbai Street Kitchen',
    category: 'catering',
    amount: 1799,
    date: '2026-03-21',
    status: 'active',
    items: ['Pav Bhaji', 'Vada Pav', 'Misal Pav'],
    deliveryAddress: '456 Elm Road, Kolkata, 700020',
    estimatedDelivery: '2026-03-26 08:00 AM',
    rating: 4.7,
    reviewed: false,
    cancellationReason: null,
    mealType: 'Breakfast Bundle',
    mealsPerWeek: 5,
    startDate: '2026-03-26',
    subscriptionStatus: 'active',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    deliveryTime: '7:30 AM - 8:30 AM',
    nextDelivery: '2026-03-26',
    totalMeals: 20,
    mealsConsumed: 5,
  },
  {
    id: 'QT-003-ORD',
    type: 'quote',
    quoteId: 'QT-003',
    restaurantName: 'The Burger Spot',
    category: 'catering',
    amount: 4500,
    date: '2026-03-12',
    status: 'completed',
    items: ['Classic Burger', 'Fries', 'Milkshake'],
    deliveryAddress: '789 Park Ave, New York, NY 10003',
    estimatedDelivery: '2026-03-22 05:00 PM',
    rating: 3.8,
    reviewed: true,
    cancellationReason: null,
    quoteStatus: 'approved',
    approvedDate: '2026-03-13',
    originalPrice: 4999,
    quotedPrice: 4500,
    discount: 499,
    mealType: 'Quick Lunch',
    mealsPerWeek: 3,
    duration: 14,
    deliveryDays: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: 'SUB-003-ORD',
    type: 'subscription',
    subscriptionId: 'SUB-003',
    restaurantName: 'Healthy Greens',
    category: 'catering',
    amount: 5999,
    date: '2026-02-28',
    status: 'paused',
    items: ['Quinoa Bowl', 'Mixed Salad', 'Protein Shake'],
    deliveryAddress: '321 Wellness St, New York, NY 10004',
    estimatedDelivery: 'Paused',
    rating: 4.2,
    reviewed: false,
    cancellationReason: null,
    mealType: 'Wellness Plan',
    mealsPerWeek: 6,
    startDate: '2026-02-28',
    endDate: '2026-03-28',
    subscriptionStatus: 'paused',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    deliveryTime: '8:00 AM - 9:00 AM',
    nextDelivery: null,
    totalMeals: 24,
    mealsConsumed: 12,
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [allOrders] = useState<(ApprovedQuote | MealSubscription)[]>(MOCK_DATA as any);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order: any) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (order.type === 'quote') {
          matchesStatus = order.quoteStatus === statusFilter;
        } else if (order.type === 'subscription') {
          matchesStatus = order.subscriptionStatus === statusFilter;
        } else {
          matchesStatus = order.status === statusFilter;
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return <CheckCircle size={18} style={{ color: '#10b981' }} />;
      case 'pending':
      case 'paused':
        return <Clock size={18} style={{ color: '#f59e0b' }} />;
      case 'cancelled':
      case 'rejected':
        return <AlertCircle size={18} style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (order: any) => {
    if (order.type === 'quote') {
      return order.quoteStatus;
    } else if (order.type === 'subscription') {
      return order.subscriptionStatus;
    }
    return order.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'pending':
      case 'paused':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'cancelled':
      case 'rejected':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const statusCounts = {
    all: allOrders.length,
    active: allOrders.filter((o: any) => {
      const status = o.type === 'quote' ? o.quoteStatus : o.subscriptionStatus || o.status;
      return status === 'active' || status === 'approved';
    }).length,
    completed: allOrders.filter((o: any) => {
      const status = o.type === 'quote' ? o.quoteStatus : o.subscriptionStatus || o.status;
      return status === 'completed';
    }).length,
    paused: allOrders.filter((o: any) => {
      const status = o.type === 'quote' ? o.quoteStatus : o.subscriptionStatus || o.status;
      return status === 'paused';
    }).length,
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Orders</h1>
            <p style={styles.subtitle}>Manage and track all your orders and subscriptions</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={styles.filterSection}>
          <div style={styles.searchContainer}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by Order ID or Restaurant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterTabs}>
            {[
              { key: 'all', label: 'All Orders', count: statusCounts.all },
              { key: 'active', label: 'Active', count: statusCounts.active },
              { key: 'completed', label: 'Completed', count: statusCounts.completed },
              { key: 'paused', label: 'Paused', count: statusCounts.paused },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                style={{
                  ...styles.filterTab,
                  ...(statusFilter === filter.key ? styles.filterTabActive : styles.filterTabInactive),
                }}
              >
                {filter.label}
                <span style={styles.filterCount}>{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div style={styles.ordersList}>
            {filteredOrders.map((order: any) => {
              const status = getStatusLabel(order);
              const statusColor = getStatusColor(status);
              const orderDate = new Date(order.date);
              const formattedDate = orderDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Link
                  key={order.id}
                  href={`/customer/orders/${order.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={styles.orderCard}>
                    {/* Left Section - Order Info */}
                    <div style={styles.orderCardLeft}>
                      <div style={styles.orderTypeIcon}>
                        {order.type === 'quote' ? (
                          <TrendingUp size={24} style={{ color: '#2563eb' }} />
                        ) : (
                          <Package size={24} style={{ color: '#7c3aed' }} />
                        )}
                      </div>

                      <div style={styles.orderInfo}>
                        <div style={styles.orderMainInfo}>
                          <h3 style={styles.orderNumber}>{order.id}</h3>
                          <p style={styles.restaurantName}>{order.restaurantName}</p>
                        </div>

                        <div style={styles.orderMetaInfo}>
                          <span style={styles.metaItem}>
                            <Calendar size={14} style={{ color: '#6b7280' }} />
                            {formattedDate}
                          </span>

                          <span style={styles.metaItem}>
                            <MapPin size={14} style={{ color: '#6b7280' }} />
                            {order.deliveryAddress.split(',')[0]}
                          </span>

                          {order.type === 'subscription' && (
                            <span style={styles.metaItem}>
                              <Package size={14} style={{ color: '#6b7280' }} />
                              {order.mealsConsumed}/{order.totalMeals} meals
                            </span>
                          )}
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div style={styles.itemsPreview}>
                            {order.items.slice(0, 2).map((item: string, idx: number) => (
                              <span key={idx} style={styles.itemTag}>
                                {item}
                              </span>
                            ))}
                            {order.items.length > 2 && (
                              <span style={styles.itemTag}>+{order.items.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Price & Status */}
                    <div style={styles.orderCardRight}>
                      <div style={styles.priceSection}>
                        <span style={styles.priceLabel}>Amount</span>
                        <span style={styles.price}>₹{order.amount.toLocaleString()}</span>
                      </div>

                      <div
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          borderColor: statusColor.border,
                        }}
                      >
                        {getStatusIcon(status)}
                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                      </div>

                      {order.reviewed && order.rating > 0 && (
                        <div style={styles.ratingBadge}>
                          <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span>{order.rating.toFixed(1)}</span>
                        </div>
                      )}

                      <div style={styles.chevronWrapper}>
                        <ChevronDown size={20} style={{ color: '#9ca3af', transform: 'rotate(-90deg)' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <AlertCircle size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No orders found</h3>
            <p style={styles.emptyText}>Try adjusting your search or filters</p>
          </div>
        )}
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
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
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
  filterSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '16px',
    marginBottom: '24px',
  },
  searchContainer: {
    position: 'relative' as const,
    marginBottom: '16px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '10px',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  filterTab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '14px',
    paddingRight: '14px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterTabActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#1d4ed8',
  },
  filterTabInactive: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    borderColor: '#e5e7eb',
  },
  filterCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  orderCardHover: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
  orderCardLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    flex: 1,
  },
  orderTypeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
    flexShrink: 0,
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    flex: 1,
  },
  orderMainInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  orderNumber: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  restaurantName: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  orderMetaInfo: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6b7280',
  },
  itemsPreview: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
    marginTop: '4px',
  },
  itemTag: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid #bfdbfe',
  },
  orderCardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexShrink: 0,
    marginLeft: '16px',
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    margin: 0,
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid',
  },
  ratingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '6px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    fontSize: '12px',
    fontWeight: '600',
    color: '#92400e',
  },
  chevronWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '64px 24px',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
};