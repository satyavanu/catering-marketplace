'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Star,
  ArrowLeft,
  Calendar,
  UtensilsCrossed,
  Home,
  Palette,
  Camera,
  Sparkles,
  Trash2,
  TrendingUp,
  Package,
  ChefHat,
  Truck,
  MapPin,
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

interface DeliveryOrder {
  id: string;
  deliveryDate: string;
  status: 'scheduled' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: string[];
  mealDetails: {
    quantity: number;
    portions: number;
  };
  deliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryAddress?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
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
  payments: Array<{
    date: string;
    amount: number;
    status: 'completed' | 'pending';
  }>;
  recentDeliveries: Array<{
    date: string;
    status: 'delivered' | 'preparing' | 'scheduled';
    items: string[];
  }>;
  deliveryOrders: DeliveryOrder[];
}

const MOCK_DATA = [
  // Approved Quotes
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
  // Meal Subscriptions
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
    endDate: '2026-04-24',
    subscriptionStatus: 'active',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    deliveryTime: '12:30 PM - 1:00 PM',
    nextDelivery: '2026-03-25',
    totalMeals: 20,
    mealsConsumed: 4,
    specialInstructions: 'Less spice, extra rice',
    payments: [
      { date: '2026-03-20', amount: 3999, status: 'completed' },
      { date: '2026-04-20', amount: 3999, status: 'pending' },
    ],
    recentDeliveries: [
      {
        date: '2026-03-21',
        status: 'delivered',
        items: ['Biryani', 'Dal Makhani', 'Rice'],
      },
      {
        date: '2026-03-22',
        status: 'delivered',
        items: ['Luchi', 'Aloo Curry', 'Dal'],
      },
      {
        date: '2026-03-23',
        status: 'delivered',
        items: ['Machli Jhol', 'Rice', 'Salad'],
      },
      {
        date: '2026-03-24',
        status: 'delivered',
        items: ['Chicken Curry', 'Roti', 'Vegetables'],
      },
    ],
    deliveryOrders: [
      {
        id: 'DO-001',
        deliveryDate: '2026-03-21',
        status: 'delivered',
        items: ['Biryani', 'Dal Makhani', 'Rice'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '12:30 PM - 1:00 PM',
        actualDeliveryTime: '12:35 PM',
        deliveryAddress: '123 Park Street, Kolkata, 700016',
        notes: 'Delivered on time',
        rating: 5,
        feedback: 'Excellent quality and on time delivery!',
      },
      {
        id: 'DO-002',
        deliveryDate: '2026-03-22',
        status: 'delivered',
        items: ['Luchi', 'Aloo Curry', 'Dal'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '12:30 PM - 1:00 PM',
        actualDeliveryTime: '12:40 PM',
        deliveryAddress: '123 Park Street, Kolkata, 700016',
        notes: 'Delivered with care',
        rating: 4.5,
        feedback: 'Good quality, slight delay',
      },
      {
        id: 'DO-003',
        deliveryDate: '2026-03-23',
        status: 'delivered',
        items: ['Machli Jhol', 'Rice', 'Salad'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '12:30 PM - 1:00 PM',
        actualDeliveryTime: '12:32 PM',
        deliveryAddress: '123 Park Street, Kolkata, 700016',
        notes: 'Perfect delivery',
        rating: 5,
        feedback: 'Perfect as always!',
      },
      {
        id: 'DO-004',
        deliveryDate: '2026-03-24',
        status: 'delivered',
        items: ['Chicken Curry', 'Roti', 'Vegetables'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '12:30 PM - 1:00 PM',
        actualDeliveryTime: '12:38 PM',
        deliveryAddress: '123 Park Street, Kolkata, 700016',
        notes: 'Delivered on time',
        rating: 4,
        feedback: 'Good quality',
      },
    ],
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
    payments: [
      { date: '2026-03-21', amount: 1799, status: 'completed' },
    ],
    recentDeliveries: [
      { date: '2026-03-21', status: 'delivered', items: ['Idly', 'Sambar', 'Dosa'] },
      { date: '2026-03-22', status: 'delivered', items: ['Poha', 'Jalebi', 'Chai'] },
      { date: '2026-03-23', status: 'delivered', items: ['Paratha', 'Butter', 'Pickle'] },
    ],
    deliveryOrders: [
      {
        id: 'DO-005',
        deliveryDate: '2026-03-21',
        status: 'delivered',
        items: ['Idly', 'Sambar', 'Dosa'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '7:30 AM - 8:30 AM',
        actualDeliveryTime: '7:35 AM',
        deliveryAddress: '456 Elm Road, Kolkata, 700020',
        notes: 'Fresh and hot',
        rating: 5,
        feedback: 'Amazing breakfast!',
      },
      {
        id: 'DO-006',
        deliveryDate: '2026-03-22',
        status: 'delivered',
        items: ['Poha', 'Jalebi', 'Chai'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '7:30 AM - 8:30 AM',
        actualDeliveryTime: '7:40 AM',
        deliveryAddress: '456 Elm Road, Kolkata, 700020',
        notes: 'Delivered on time',
        rating: 4.5,
        feedback: 'Good quality',
      },
      {
        id: 'DO-007',
        deliveryDate: '2026-03-23',
        status: 'delivered',
        items: ['Paratha', 'Butter', 'Pickle'],
        mealDetails: { quantity: 1, portions: 2 },
        deliveryTime: '7:30 AM - 8:30 AM',
        actualDeliveryTime: '7:45 AM',
        deliveryAddress: '456 Elm Road, Kolkata, 700020',
        notes: 'Perfect delivery',
        rating: 5,
        feedback: 'Excellent!',
      },
    ],
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | OrderType>('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<ApprovedQuote | MealSubscription | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  const [allOrders] = useState<(ApprovedQuote | MealSubscription)[]>(MOCK_DATA as any);

  const categories = [
    { id: 'all', label: 'All Orders', icon: Sparkles },
    { id: 'quote', label: 'Approved Quotes', icon: TrendingUp },
    { id: 'subscription', label: 'Subscriptions', icon: Package },
    { id: 'catering', label: 'Catering', icon: UtensilsCrossed },
  ];

  const getDateRange = (filter: string) => {
    const today = new Date();
    let startDate = new Date(today);

    switch (filter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      default:
        return null;
    }
    return startDate;
  };

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order: any) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || order.type === typeFilter;

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

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const startDate = getDateRange(dateFilter);
        const orderDate = new Date(order.date);
        matchesDate = orderDate >= startDate!;
      }

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, typeFilter, dateFilter, allOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
      case 'paused':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
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

  const handleReviewSubmit = () => {
    if (reviewData.rating > 0 && selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        rating: reviewData.rating,
        reviewed: true,
      });
      setShowReviewModal(false);
      setReviewData({ rating: 0, comment: '' });
    }
  };

  if (selectedOrder) {
    return (
      <div style={styles.detailContainer}>
        <div style={styles.detailMaxWidth}>
          <button
            onClick={() => setSelectedOrder(null)}
            style={styles.backButton}
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>

          <div style={styles.detailCard}>
            {/* Quote Detail View */}
            {selectedOrder.type === 'quote' && (
              <>
                <div style={styles.orderHeader}>
                  <div>
                    <h1 style={styles.orderTitle}>Quote {(selectedOrder as ApprovedQuote).quoteId}</h1>
                    <div style={styles.categoryBadgeDetail}>
                      <TrendingUp size={16} />
                      <span>Approved Quote</span>
                    </div>
                    <p style={styles.orderDate}>
                      Approved on {new Date((selectedOrder as ApprovedQuote).approvedDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ ...styles.statusBadge, ...styles.status_approved }}>
                    {getStatusIcon('approved')}
                    <span>Approved</span>
                  </div>
                </div>

                <div style={styles.detailGrid}>
                  <div>
                    <h3 style={styles.detailLabel}>Service Provider</h3>
                    <p style={styles.detailValue}>{selectedOrder.restaurantName}</p>
                  </div>
                  <div>
                    <h3 style={styles.detailLabel}>Meal Type</h3>
                    <p style={styles.detailValue}>{(selectedOrder as ApprovedQuote).mealType}</p>
                  </div>
                </div>

                {/* Pricing Details */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Pricing Breakdown</h3>
                  <div style={styles.pricingCard}>
                    <div style={styles.pricingRow}>
                      <span>Original Price</span>
                      <span>₹{(selectedOrder as ApprovedQuote).originalPrice}</span>
                    </div>
                    <div style={styles.pricingRow}>
                      <span>Discount</span>
                      <span style={{ color: '#10b981' }}>-₹{(selectedOrder as ApprovedQuote).discount}</span>
                    </div>
                    <div style={{ ...styles.pricingRow, borderTop: '2px solid #e5e7eb', paddingTop: '12px', marginTop: '12px', fontWeight: '700', fontSize: '16px' }}>
                      <span>Final Price</span>
                      <span style={{ color: '#2563eb' }}>₹{(selectedOrder as ApprovedQuote).quotedPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Quote Details */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Subscription Details</h3>
                  <div style={styles.detailsGrid}>
                    <div>
                      <p style={styles.gridLabel}>Meals per Week</p>
                      <p style={styles.gridValue}>{(selectedOrder as ApprovedQuote).mealsPerWeek}</p>
                    </div>
                    <div>
                      <p style={styles.gridLabel}>Duration</p>
                      <p style={styles.gridValue}>{(selectedOrder as ApprovedQuote).duration} days</p>
                    </div>
                    <div>
                      <p style={styles.gridLabel}>Delivery Days</p>
                      <p style={styles.gridValue}>{(selectedOrder as ApprovedQuote).deliveryDays.length} days/week</p>
                    </div>
                    <div>
                      <p style={styles.gridLabel}>Total Meals</p>
                      <p style={styles.gridValue}>
                        {((selectedOrder as ApprovedQuote).mealsPerWeek * (selectedOrder as ApprovedQuote).duration) / 7}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Days */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Delivery Schedule</h3>
                  <div style={styles.deliveryDaysContainer}>
                    {(selectedOrder as ApprovedQuote).deliveryDays.map((day, idx) => (
                      <div key={idx} style={styles.deliveryDayChip}>
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.items.length > 0 && (
                  <div style={styles.detailSection}>
                    <h3 style={styles.detailLabel}>Sample Meals</h3>
                    <div style={styles.itemsList}>
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} style={styles.itemRow}>
                          <span style={styles.itemName}>✓ {item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedOrder as ApprovedQuote).specialRequirements && (
                  <div style={{ ...styles.detailSection, backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                    <h3 style={styles.detailLabel}>Special Requirements</h3>
                    <p style={styles.specialText}>{(selectedOrder as ApprovedQuote).specialRequirements}</p>
                  </div>
                )}

                <div style={styles.actionButtons}>
                  <button style={{ ...styles.buttonPrimary, flex: 1 }}>
                    <MessageCircle size={18} />
                    Contact Provider
                  </button>
                  <button style={{ ...styles.buttonPrimary, ...styles.buttonSuccess, flex: 1 }}>
                    <CheckCircle size={18} />
                    Convert to Subscription
                  </button>
                </div>
              </>
            )}

            {/* Subscription Detail View */}
            {selectedOrder.type === 'subscription' && (
              <>
                <div style={styles.orderHeader}>
                  <div>
                    <h1 style={styles.orderTitle}>Subscription {(selectedOrder as MealSubscription).subscriptionId}</h1>
                    <div style={styles.categoryBadgeDetail}>
                      <Package size={16} />
                      <span>{(selectedOrder as MealSubscription).mealType}</span>
                    </div>
                    <p style={styles.orderDate}>
                      Started on {new Date((selectedOrder as MealSubscription).startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ ...styles.statusBadge, ...styles[`status_${(selectedOrder as MealSubscription).subscriptionStatus}`] }}>
                    {getStatusIcon((selectedOrder as MealSubscription).subscriptionStatus)}
                    <span>{(selectedOrder as MealSubscription).subscriptionStatus.charAt(0).toUpperCase() + (selectedOrder as MealSubscription).subscriptionStatus.slice(1)}</span>
                  </div>
                </div>

                {/* Progress */}
                <div style={styles.progressCard}>
                  <div style={styles.progressHeader}>
                    <span>Meals Progress</span>
                    <span style={styles.progressText}>
                      {(selectedOrder as MealSubscription).mealsConsumed} / {(selectedOrder as MealSubscription).totalMeals}
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${((selectedOrder as MealSubscription).mealsConsumed / (selectedOrder as MealSubscription).totalMeals) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={styles.detailGrid}>
                  <div>
                    <h3 style={styles.detailLabel}>Next Delivery</h3>
                    <p style={styles.detailValue}>{(selectedOrder as MealSubscription).nextDelivery}</p>
                  </div>
                  <div>
                    <h3 style={styles.detailLabel}>Delivery Time</h3>
                    <p style={styles.detailValue}>{(selectedOrder as MealSubscription).deliveryTime}</p>
                  </div>
                </div>

                {/* Subscription Details */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Subscription Details</h3>
                  <div style={styles.detailsGrid}>
                    <div>
                      <p style={styles.gridLabel}>Meals per Week</p>
                      <p style={styles.gridValue}>{(selectedOrder as MealSubscription).mealsPerWeek}</p>
                    </div>
                    <div>
                      <p style={styles.gridLabel}>Total Meals</p>
                      <p style={styles.gridValue}>{(selectedOrder as MealSubscription).totalMeals}</p>
                    </div>
                    <div>
                      <p style={styles.gridLabel}>End Date</p>
                      <p style={styles.gridValue}>{(selectedOrder as MealSubscription).endDate || 'Ongoing'}</p>
                    </div>
                    <div>
                      <p style={styles.gridLabel}>Monthly Cost</p>
                      <p style={styles.gridValue}>₹{selectedOrder.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Days */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Delivery Days</h3>
                  <div style={styles.deliveryDaysContainer}>
                    {(selectedOrder as MealSubscription).deliveryDays.map((day, idx) => (
                      <div key={idx} style={styles.deliveryDayChip}>
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* NEW: Delivery Orders Tracking */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>📦 Delivery Order History</h3>
                  <div style={styles.deliveryOrdersContainer}>
                    {(selectedOrder as MealSubscription).deliveryOrders && (selectedOrder as MealSubscription).deliveryOrders.length > 0 ? (
                      (selectedOrder as MealSubscription).deliveryOrders.map((order, idx) => {
                        const statusColors = {
                          delivered: { bg: '#dcfce7', text: '#166534', icon: '✓' },
                          preparing: { bg: '#fef3c7', text: '#92400e', icon: '👨‍🍳' },
                          out_for_delivery: { bg: '#dbeafe', text: '#0c4a6e', icon: '🚚' },
                          scheduled: { bg: '#f3e8ff', text: '#6b21a8', icon: '📅' },
                          cancelled: { bg: '#fee2e2', text: '#991b1b', icon: '✕' },
                        };
                        const color = statusColors[order.status];

                        return (
                          <div key={idx} style={styles.deliveryOrderCard}>
                            <div style={styles.orderCardHeader}>
                              <div style={styles.orderCardLeft}>
                                <div style={styles.orderDateBadge}>{order.deliveryDate}</div>
                                <div>
                                  <p style={styles.orderCardId}>{order.id}</p>
                                  <p style={styles.orderCardMeals}>{order.mealDetails.quantity} meal • {order.mealDetails.portions} portions</p>
                                </div>
                              </div>
                              <div style={{ ...styles.statusBadgeMini, backgroundColor: color.bg, color: color.text }}>
                                <span>{color.icon}</span>
                                <span style={{ textTransform: 'capitalize', marginLeft: '4px' }}>
                                  {order.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            <div style={styles.orderCardContent}>
                              {/* Meal Items */}
                              <div style={styles.orderSection}>
                                <p style={styles.orderSectionLabel}>Items:</p>
                                <div style={styles.orderItems}>
                                  {order.items.map((item, i) => (
                                    <span key={i} style={styles.orderItemChip}>{item}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Delivery Info */}
                              <div style={styles.orderInfoGrid}>
                                <div>
                                  <p style={styles.orderInfoLabel}>Expected Time</p>
                                  <p style={styles.orderInfoValue}>{order.deliveryTime}</p>
                                </div>
                                {order.actualDeliveryTime && (
                                  <div>
                                    <p style={styles.orderInfoLabel}>Actual Time</p>
                                    <p style={styles.orderInfoValue}>{order.actualDeliveryTime}</p>
                                  </div>
                                )}
                                <div>
                                  <p style={styles.orderInfoLabel}>Location</p>
                                  <p style={styles.orderInfoValue}>
                                    <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    {order.deliveryAddress}
                                  </p>
                                </div>
                              </div>

                              {/* Notes */}
                              {order.notes && (
                                <div style={styles.orderNotes}>
                                  <p style={styles.orderNotesLabel}>Notes:</p>
                                  <p style={styles.orderNotesText}>{order.notes}</p>
                                </div>
                              )}

                              {/* Rating & Feedback */}
                              {order.status === 'delivered' && (
                                <div style={styles.orderFeedbackSection}>
                                  <div style={styles.ratingSection}>
                                    <p style={styles.ratingLabel}>Your Rating:</p>
                                    <div style={styles.starsDisplay}>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                          key={star}
                                          style={{
                                            color: star <= (order.rating || 0) ? '#fbbf24' : '#e5e7eb',
                                            fontSize: '18px',
                                            marginRight: '4px',
                                          }}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      {order.rating && <span style={styles.ratingText}>({order.rating}/5)</span>}
                                    </div>
                                  </div>

                                  {order.feedback && (
                                    <div style={styles.feedbackBox}>
                                      <p style={styles.feedbackLabel}>Your Feedback:</p>
                                      <p style={styles.feedbackText}>"{order.feedback}"</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Action Button */}
                              {order.status === 'delivered' && !order.rating && (
                                <button style={{ ...styles.buttonPrimary, ...styles.buttonSmall }}>
                                  ⭐ Rate This Delivery
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={styles.emptyDeliveries}>
                        <p>No deliveries yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Deliveries */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Recent Deliveries Overview</h3>
                  <div style={styles.deliveriesList}>
                    {(selectedOrder as MealSubscription).recentDeliveries.map((delivery, idx) => (
                      <div key={idx} style={styles.deliveryCard}>
                        <div style={styles.deliveryHeader}>
                          <span style={styles.deliveryDate}>{delivery.date}</span>
                          <span style={{ ...styles.deliveryStatus, ...styles[`delivery_${delivery.status}`] }}>
                            {delivery.status === 'delivered' && '✓ Delivered'}
                            {delivery.status === 'preparing' && '👨‍🍳 Preparing'}
                            {delivery.status === 'scheduled' && '📅 Scheduled'}
                          </span>
                        </div>
                        <div style={styles.deliveryItems}>
                          {delivery.items.map((item, i) => (
                            <span key={i} style={styles.deliveryItem}>{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment History */}
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>Payment History</h3>
                  <div style={styles.paymentsList}>
                    {(selectedOrder as MealSubscription).payments.map((payment, idx) => (
                      <div key={idx} style={styles.paymentRow}>
                        <div>
                          <p style={styles.paymentDate}>{payment.date}</p>
                          <p style={styles.paymentStatus}>{payment.status === 'completed' ? '✓ Completed' : '⏳ Pending'}</p>
                        </div>
                        <p style={styles.paymentAmount}>₹{payment.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  <button style={{ ...styles.buttonPrimary, flex: 1 }}>
                    <MessageCircle size={18} />
                    Contact Provider
                  </button>
                  <button style={{ ...styles.buttonPrimary, ...styles.buttonWarning, flex: 1 }}>
                    <Clock size={18} />
                    Pause Subscription
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Review Modal */}
          {showReviewModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Leave a Review</h2>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewData({ rating: 0, comment: '' });
                    }}
                    style={styles.closeButton}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Rating</label>
                  <div style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        style={{
                          ...styles.starButton,
                          color: star <= reviewData.rating ? '#fbbf24' : '#d1d5db',
                        }}
                      >
                        <Star size={32} fill={star <= reviewData.rating ? '#fbbf24' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Comment (Optional)</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Share your experience..."
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.modalButtons}>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewData({ rating: 0, comment: '' });
                    }}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewData.rating === 0}
                    style={{
                      ...styles.buttonPrimary,
                      opacity: reviewData.rating === 0 ? 0.5 : 1,
                      cursor: reviewData.rating === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>My Orders</h1>
          <p style={styles.pageSubtitle}>
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Type Filter */}
        <div style={styles.categoryFilterContainer}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setTypeFilter(cat.id as any)}
                style={{
                  ...styles.categoryButton,
                  ...(typeFilter === cat.id ? styles.categoryButtonActive : styles.categoryButtonInactive),
                }}
              >
                <Icon size={18} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div style={styles.filterCard}>
          <div style={styles.filterContainer}>
            <div style={styles.searchWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by Order ID or Provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.selectWrapper}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.selectInput}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown size={18} style={styles.selectIcon} />
            </div>

            <div style={styles.selectWrapper}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={styles.selectInput}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
              </select>
              <Calendar size={18} style={styles.selectIcon} />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeaderCell}>Order ID</th>
                  <th style={styles.tableHeaderCell}>Type</th>
                  <th style={styles.tableHeaderCell}>Provider</th>
                  <th style={styles.tableHeaderCell}>Details</th>
                  <th style={styles.tableHeaderCell}>Amount</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={styles.orderId}>{order.id}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.typeInline}>
                        {order.type === 'quote' && <TrendingUp size={16} />}
                        {order.type === 'subscription' && <Package size={16} />}
                        <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{order.type}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>{order.restaurantName}</td>
                    <td style={styles.tableCell}>
                      {order.type === 'quote' && (
                        <span style={styles.detailsText}>{order.mealType} • {order.mealsPerWeek}x/week</span>
                      )}
                      {order.type === 'subscription' && (
                        <span style={styles.detailsText}>{order.mealType} • {order.mealsConsumed}/{order.totalMeals} meals</span>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.amount}>₹{order.amount}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ ...styles.statusBadgeSmall, ...styles[`status_${getStatusLabel(order)}`] }}>
                        {getStatusIcon(getStatusLabel(order))}
                        <span style={{ textTransform: 'capitalize' }}>{getStatusLabel(order)}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={styles.viewButton}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <AlertCircle size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No orders found</h3>
            <p style={styles.emptyText}>Try adjusting your filters or search terms</p>
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
    padding: '24px',
  },
  detailContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  },
  maxWidth: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  detailMaxWidth: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  pageHeader: {
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#111827',
  },
  pageSubtitle: {
    color: '#4b5563',
    marginTop: '8px',
  },
  categoryFilterContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    overflowX: 'auto' as const,
    paddingBottom: '8px',
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingLeft: '14px',
    paddingRight: '14px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  },
  categoryButtonActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: '2px solid #1d4ed8',
  },
  categoryButtonInactive: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: '2px solid #e5e7eb',
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    marginBottom: '24px',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  searchWrapper: {
    flex: 1,
    position: 'relative' as const,
    minWidth: '250px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '8px',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  selectWrapper: {
    position: 'relative' as const,
  },
  selectInput: {
    paddingLeft: '16px',
    paddingRight: '32px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none' as const,
    transition: 'all 0.2s',
  },
  selectIcon: {
    position: 'absolute' as const,
    right: '12px',
    top: '8px',
    color: '#9ca3af',
    pointerEvents: 'none' as const,
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeaderCell: {
    padding: '16px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: '#1f2937',
  },
  orderId: {
    fontWeight: '600',
    color: '#111827',
  },
  typeInline: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  },
  detailsText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  amount: {
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '9999px',
    fontWeight: '600',
    fontSize: '14px',
  },
  statusBadgeSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '9999px',
    fontWeight: '600',
    fontSize: '12px',
  },
  status_completed: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  status_active: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  status_approved: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  status_pending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
  },
  status_paused: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
  },
  status_cancelled: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  status_rejected: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  viewButton: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    transition: 'color 0.2s',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
  },
  emptyText: {
    color: '#6b7280',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#4b5563',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '32px',
    transition: 'color 0.2s',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px',
    marginBottom: '24px',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  orderTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
  },
  categoryBadgeDetail: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    marginBottom: '8px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
  orderDate: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    marginBottom: '32px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  gridLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '4px',
  },
  gridValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  detailSection: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #e5e7eb',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  itemName: {
    color: '#374151',
  },
  specialText: {
    fontSize: '14px',
    color: '#111827',
    margin: 0,
  },
  pricingCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '16px',
  },
  pricingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
  },
  deliveryDaysContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  deliveryDayChip: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #bfdbfe',
  },
  deliveriesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  deliveryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #e5e7eb',
  },
  deliveryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  deliveryDate: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111827',
  },
  deliveryStatus: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  delivery_delivered: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  delivery_preparing: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  delivery_scheduled: {
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
  },
  deliveryItems: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  deliveryItem: {
    fontSize: '11px',
    padding: '2px 6px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '3px',
  },
  paymentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  paymentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  paymentDate: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  paymentStatus: {
    fontSize: '11px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  paymentAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#10b981',
    margin: 0,
  },
  progressCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #bbf7d0',
    marginBottom: '32px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: '600',
  },
  progressText: {
    color: '#10b981',
  },
  progressBar: {
    backgroundColor: '#e0f2e0',
    borderRadius: '9999px',
    overflow: 'hidden' as const,
    height: '8px',
  },
  progressFill: {
    backgroundColor: '#10b981',
    height: '100%',
    transition: 'width 0.3s ease',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  buttonPrimary: {
    flex: 1,
    minWidth: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSuccess: {
    backgroundColor: '#16a34a',
  },
  buttonWarning: {
    backgroundColor: '#ca8a04',
  },
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '448px',
    width: '100%',
    padding: '32px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    backgroundColor: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '24px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  starsContainer: {
    display: 'flex',
    gap: '8px',
  },
  starButton: {
    backgroundColor: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textarea: {
    width: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none' as const,
    transition: 'all 0.2s',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
  buttonSecondary: {
    flex: 1,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  deliveryOrdersContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  deliveryOrderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  orderCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  orderDateBadge: {
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid #bfdbfe',
  },
  orderCardId: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  orderCardMeals: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  statusBadgeMini: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  orderCardContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  orderSection: {
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  orderSectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  orderItems: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  orderItemChip: {
    display: 'inline-block',
    backgroundColor: '#f0f9ff',
    color: '#0c4a6e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid #bfdbfe',
  },
  orderInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  orderInfoLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px 0',
  },
  orderInfoValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  orderNotes: {
    backgroundColor: '#f0f9ff',
    padding: '8px 12px',
    borderRadius: '6px',
    borderLeft: '3px solid #2563eb',
  },
  orderNotesLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#0c4a6e',
    margin: '0 0 4px 0',
  },
  orderNotesText: {
    fontSize: '12px',
    color: '#111827',
    margin: 0,
  },
  orderFeedbackSection: {
    backgroundColor: '#fef3c7',
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '3px solid #f59e0b',
  },
  ratingSection: {
    paddingBottom: '8px',
    borderBottom: '1px solid #fde68a',
  },
  ratingLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 6px 0',
  },
  starsDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  ratingText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#92400e',
    marginLeft: '6px',
  },
  feedbackBox: {
    marginTop: '8px',
  },
  feedbackLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 4px 0',
  },
  feedbackText: {
    fontSize: '12px',
    color: '#92400e',
    fontStyle: 'italic',
    margin: 0,
  },
  emptyDeliveries: {
    textAlign: 'center' as const,
    padding: '24px',
    color: '#6b7280',
    fontSize: '14px',
  },
  buttonSmall: {
    padding: '8px 12px !important' as const,
    fontSize: '13px !important' as const,
  },
};