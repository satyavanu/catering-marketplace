'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

type DeliveryStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'FAILED' | 'REFUNDED' | 'DUE';
type OrderType = 'ONE_TIME' | 'BULK' | 'SUBSCRIPTION';

interface OrderListItem {
  id: string; // delivery_id
  type: OrderType;
  customer_name: string;
  delivery_date: string;
  delivery_slot?: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  delivery_status: DeliveryStatus;
  payment_status: PaymentStatus;
  amount?: number;
  reference_id?: string; // order_id / quote_id / subscription_id
  reference_label?: string; // "Order", "Quote", "Subscription"
  // Additional fields for enhanced display
  clientEmail?: string;
  clientPhone?: string;
  address?: string;
  notes?: string;
  items_count?: number;
  review?: {
    rating: number;
    comment: string;
  };
}

const MOCK_ORDERS: OrderListItem[] = [
  {
    id: 'DEL-001',
    type: 'ONE_TIME',
    customer_name: 'Rajesh Kumar',
    delivery_date: '2025-04-15',
    delivery_slot: 'LUNCH',
    delivery_status: 'PREPARING',
    payment_status: 'PAID',
    amount: 34310,
    reference_id: 'ORD-2025-001',
    reference_label: 'Order',
    clientEmail: 'rajesh@example.com',
    clientPhone: '+91-9876543210',
    address: '123 Park Avenue, Sector 5, Delhi',
    notes: 'Please ensure no peanuts due to allergies. Need setup by 5:30 PM.',
    items_count: 3,
  },
  {
    id: 'DEL-002',
    type: 'SUBSCRIPTION',
    customer_name: 'Priya Sharma',
    delivery_date: '2025-04-10',
    delivery_slot: 'BREAKFAST',
    delivery_status: 'DELIVERED',
    payment_status: 'PAID',
    amount: 1274,
    reference_id: 'SUB-2025-001',
    reference_label: 'Subscription',
    clientEmail: 'priya@example.com',
    clientPhone: '+91-9876543211',
    address: '456 Garden Lane, Sector 12, Bangalore',
    items_count: 2,
    review: {
      rating: 5,
      comment: 'Excellent service! Food was fresh and delivery was on time.',
    },
  },
  {
    id: 'DEL-003',
    type: 'BULK',
    customer_name: 'Amit Singh',
    delivery_date: '2025-04-20',
    delivery_slot: 'DINNER',
    delivery_status: 'PENDING',
    payment_status: 'PENDING',
    amount: 31575,
    reference_id: 'ORD-2025-003',
    reference_label: 'Order',
    clientEmail: 'amit@example.com',
    clientPhone: '+91-9876543212',
    address: '789 High Street, Sector 8, Mumbai',
    notes: 'Extra spice please. Deliver to hotel entrance.',
    items_count: 5,
  },
  {
    id: 'DEL-004',
    type: 'SUBSCRIPTION',
    customer_name: 'Neha Gupta',
    delivery_date: '2025-04-22',
    delivery_slot: 'LUNCH',
    delivery_status: 'OUT_FOR_DELIVERY',
    payment_status: 'DUE',
    amount: 1180,
    reference_id: 'SUB-2025-002',
    reference_label: 'Subscription',
    clientEmail: 'neha@example.com',
    clientPhone: '+91-9876543213',
    address: '321 Park Lane, Sector 15, Pune',
    items_count: 1,
  },
  {
    id: 'DEL-005',
    type: 'ONE_TIME',
    customer_name: 'Vikram Patel',
    delivery_date: '2025-03-28',
    delivery_slot: 'BREAKFAST',
    delivery_status: 'DELIVERED',
    payment_status: 'PAID',
    amount: 5640,
    reference_id: 'ORD-2025-005',
    reference_label: 'Order',
    clientEmail: 'vikram@example.com',
    clientPhone: '+91-9876543214',
    address: '987 Main Road, Sector 20, Hyderabad',
    items_count: 4,
    review: {
      rating: 4,
      comment: 'Good quality food, on-time delivery.',
    },
  },
  {
    id: 'DEL-006',
    type: 'BULK',
    customer_name: 'Sarah Johnson',
    delivery_date: '2025-04-25',
    delivery_slot: 'LUNCH',
    delivery_status: 'CANCELLED',
    payment_status: 'REFUNDED',
    amount: 15000,
    reference_id: 'ORD-2025-006',
    reference_label: 'Order',
    clientEmail: 'sarah@example.com',
    clientPhone: '+91-9876543215',
    address: '555 Business Park, Sector 25, Gurgaon',
    items_count: 10,
  },
];

export default function CatererOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<DeliveryStatus>('PENDING');

  const deliveryStatusOptions = [
    { value: 'PENDING' as const, label: 'Pending', icon: '⏳', color: '#f59e0b' },
    { value: 'PREPARING' as const, label: 'Preparing', icon: '👨‍🍳', color: '#8b5cf6' },
    { value: 'OUT_FOR_DELIVERY' as const, label: 'Out for Delivery', icon: '🚚', color: '#06b6d4' },
    { value: 'DELIVERED' as const, label: 'Delivered', icon: '✓', color: '#059669' },
    { value: 'CANCELLED' as const, label: 'Cancelled', icon: '✗', color: '#ef4444' },
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Pending', color: '#f59e0b' },
    { value: 'PARTIAL', label: 'Partial', color: '#8b5cf6' },
    { value: 'PAID', label: 'Paid', color: '#059669' },
    { value: 'FAILED', label: 'Failed', color: '#ef4444' },
    { value: 'REFUNDED', label: 'Refunded', color: '#06b6d4' },
    { value: 'DUE', label: 'Due', color: '#f97316' },
  ];

  const typeOptions = [
    { value: 'ONE_TIME', label: '📦 One-Time Order', color: '#3b82f6' },
    { value: 'BULK', label: '📋 Bulk Order', color: '#eab308' },
    { value: 'SUBSCRIPTION', label: '🔄 Subscription', color: '#8b5cf6' },
  ];

  const slotOptions = [
    { value: 'BREAKFAST', label: '🌅 Breakfast' },
    { value: 'LUNCH', label: '🍽️ Lunch' },
    { value: 'DINNER', label: '🌙 Dinner' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.delivery_status === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.payment_status === filterPayment;
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.reference_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPayment && matchesType && matchesSearch;
  });

  const getDeliveryStatusColor = (status: DeliveryStatus) => {
    return deliveryStatusOptions.find((opt) => opt.value === status)?.color || '#64748b';
  };

  const getDeliveryStatusLabel = (status: DeliveryStatus) => {
    return deliveryStatusOptions.find((opt) => opt.value === status)?.label || status;
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    return paymentStatusOptions.find((opt) => opt.value === status)?.color || '#64748b';
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    return paymentStatusOptions.find((opt) => opt.value === status)?.label || status;
  };

  const getTypeLabel = (type: OrderType) => {
    return typeOptions.find((opt) => opt.value === type)?.label || type;
  };

  const getSlotLabel = (slot?: string) => {
    if (!slot) return 'General';
    return slotOptions.find((opt) => opt.value === slot)?.label || slot;
  };

  const handleStatusUpdate = (order: OrderListItem) => {
    setSelectedOrder(order);
    setNewStatus(order.delivery_status);
    setShowStatusModal(true);
  };

  const handleSaveStatus = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                delivery_status: newStatus,
              }
            : order
        )
      );
      setShowStatusModal(false);
      setSelectedOrder(null);
    }
  };

  const handleViewDetails = (order: OrderListItem) => {
    router.push(`/caterer/orders/${order.id}`);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.delivery_status === 'PENDING').length,
    preparing: orders.filter((o) => o.delivery_status === 'PREPARING').length,
    delivered: orders.filter((o) => o.delivery_status === 'DELIVERED').length,
    revenue: orders
      .filter((o) => o.delivery_status === 'DELIVERED' && o.payment_status === 'PAID')
      .reduce((sum, o) => sum + (o.amount || 0), 0),
    due: orders
      .filter((o) => o.payment_status === 'DUE' || o.payment_status === 'PENDING')
      .reduce((sum, o) => sum + (o.amount || 0), 0),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders & Deliveries</h1>
          <p style={styles.subtitle}>Manage and track all your orders, quotes, and subscription deliveries</p>
        </div>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>📦</div>
          <div>
            <p style={styles.statLabel}>Total Orders</p>
            <p style={styles.statValue}>{stats.total}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>⏳</div>
          <div>
            <p style={styles.statLabel}>Pending</p>
            <p style={styles.statValue}>{stats.pending}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#e9d5ff' }}>👨‍🍳</div>
          <div>
            <p style={styles.statLabel}>Preparing</p>
            <p style={styles.statValue}>{stats.preparing}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#dcfce7' }}>✓</div>
          <div>
            <p style={styles.statLabel}>Delivered</p>
            <p style={styles.statValue}>{stats.delivered}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>💰</div>
          <div>
            <p style={styles.statLabel}>Revenue</p>
            <p style={styles.statValue}>₹{(stats.revenue / 1000).toFixed(1)}k</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#fee2e2' }}>⚠️</div>
          <div>
            <p style={styles.statLabel}>Amount Due</p>
            <p style={styles.statValue}>₹{(stats.due / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by customer name, email, order ID, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersWrapper}>
          {/* Order Type Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Order Type:</label>
            <div style={styles.typeFilters}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  ...styles.filterButton,
                  ...(filterType === 'all' ? styles.filterButtonActive : {}),
                }}
              >
                All Types
              </button>
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterType(option.value)}
                  style={{
                    ...styles.filterButton,
                    ...(filterType === option.value ? styles.filterButtonActive : {}),
                    borderLeft: `4px solid ${option.color}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Delivery Status:</label>
            <div style={styles.statusFilters}>
              <button
                onClick={() => setFilterStatus('all')}
                style={{
                  ...styles.filterButton,
                  ...(filterStatus === 'all' ? styles.filterButtonActive : {}),
                }}
              >
                All
              </button>
              {deliveryStatusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  style={{
                    ...styles.filterButton,
                    ...(filterStatus === option.value ? styles.filterButtonActive : {}),
                    borderLeft: `4px solid ${option.color}`,
                  }}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Payment Status:</label>
            <div style={styles.paymentFilters}>
              <button
                onClick={() => setFilterPayment('all')}
                style={{
                  ...styles.filterButton,
                  ...(filterPayment === 'all' ? styles.filterButtonActive : {}),
                }}
              >
                All
              </button>
              {paymentStatusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterPayment(option.value)}
                  style={{
                    ...styles.filterButton,
                    ...(filterPayment === option.value ? styles.filterButtonActive : {}),
                    borderLeft: `4px solid ${option.color}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={styles.ordersSection}>
        <h2 style={styles.sectionTitle}>
          Orders ({filteredOrders.length})
        </h2>

        {filteredOrders.length > 0 ? (
          <div style={styles.ordersTable}>
            {filteredOrders.map((order) => (
              <div key={order.id} style={styles.orderRow}>
                <div style={styles.orderLeft}>
                  <div style={styles.orderHeader}>
                    <div>
                      <div style={styles.orderTitleRow}>
                        <h3 style={styles.customerName}>{order.customer_name}</h3>
                        <span style={styles.typeTag}>{getTypeLabel(order.type)}</span>
                      </div>
                      <p style={styles.referenceId}>
                        {order.reference_label} ID: <strong>{order.reference_id}</strong>
                      </p>
                    </div>
                  </div>

                  <div style={styles.statusRow}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getDeliveryStatusColor(order.delivery_status),
                      }}
                    >
                      {getDeliveryStatusLabel(order.delivery_status)}
                    </span>
                    <span
                      style={{
                        ...styles.paymentBadge,
                        backgroundColor: getPaymentStatusColor(order.payment_status),
                      }}
                    >
                      💳 {getPaymentStatusLabel(order.payment_status)}
                    </span>
                  </div>

                  <div style={styles.contactInfo}>
                    <span style={styles.contactItem}>
                      <EnvelopeIcon style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      {order.clientEmail}
                    </span>
                    <span style={styles.contactItem}>
                      <PhoneIcon style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      {order.clientPhone}
                    </span>
                  </div>

                  <div style={styles.orderDetails}>
                    <span style={styles.detailItem}>
                      <CalendarIcon style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      {new Date(order.delivery_date).toLocaleDateString('en-IN')}
                    </span>
                    {order.delivery_slot && (
                      <span style={styles.detailItem}>
                        <ClockIcon style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                        {getSlotLabel(order.delivery_slot)}
                      </span>
                    )}
                    {order.items_count && (
                      <span style={styles.detailItem}>
                        📦 {order.items_count} item{order.items_count > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {order.address && (
                    <div style={styles.addressBox}>
                      <MapPinIcon style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                      {order.address}
                    </div>
                  )}

                  {order.notes && (
                    <div style={styles.notesBox}>
                      <strong>📝 Notes:</strong> {order.notes}
                    </div>
                  )}

                  {order.review && (
                    <div style={styles.reviewBox}>
                      <div style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            style={{
                              width: '14px',
                              height: '14px',
                              color: i < order.review!.rating ? '#fbbf24' : '#d1d5db',
                              fill: i < order.review!.rating ? '#fbbf24' : 'none',
                            }}
                          />
                        ))}
                        <span style={styles.ratingText}>({order.review.rating}/5)</span>
                      </div>
                      <p style={styles.reviewComment}>"{order.review.comment}"</p>
                    </div>
                  )}
                </div>

                <div style={styles.orderRight}>
                  <div style={styles.amountBox}>
                    <span style={styles.amountLabel}>Amount</span>
                    <span style={styles.amountValue}>
                      ₹{order.amount?.toLocaleString('en-IN') || '—'}
                    </span>
                  </div>

                  <div style={styles.orderActions}>
                    <button
                      onClick={() => handleStatusUpdate(order)}
                      style={{
                        ...styles.actionButton,
                        ...styles.updateButton,
                      }}
                    >
                      <PencilIcon style={{ width: '16px', height: '16px' }} />
                      Update Status
                    </button>
                    <button
                      onClick={() => handleViewDetails(order)}
                      style={{
                        ...styles.actionButton,
                        ...styles.viewButton,
                      }}
                    >
                      <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>📭 No orders found. Try adjusting your filters or search.</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div style={styles.modal}>
          <div style={styles.modalOverlay} onClick={() => setShowStatusModal(false)} />
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Update Delivery Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                style={styles.closeButton}
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  {selectedOrder.customer_name}
                </label>
                <p style={styles.orderInfo}>
                  {selectedOrder.reference_label}: <strong>{selectedOrder.reference_id}</strong> • {new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN')}
                  {selectedOrder.delivery_slot && ` • ${getSlotLabel(selectedOrder.delivery_slot)}`}
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Current Status: <strong>{getDeliveryStatusLabel(selectedOrder.delivery_status)}</strong>
                </label>
                <p style={styles.orderInfo}>Select a new delivery status below</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>New Delivery Status</label>
                <div style={styles.statusGrid}>
                  {deliveryStatusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewStatus(option.value)}
                      style={{
                        ...styles.statusOption,
                        ...(newStatus === option.value
                          ? {
                              backgroundColor: option.color,
                              color: 'white',
                              borderColor: option.color,
                              borderWidth: '2px',
                            }
                          : {}),
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formActions}>
                <button onClick={() => setShowStatusModal(false)} style={styles.buttonSecondary}>
                  Cancel
                </button>
                <button onClick={handleSaveStatus} style={styles.buttonPrimary}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: 0,
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '4px 0 0 0',
  },
  filterSection: {
    marginBottom: '32px',
  },
  searchBox: {
    marginBottom: '16px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box' as const,
  },
  filtersWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    whiteSpace: 'nowrap' as const,
    minWidth: '100px',
  },
  typeFilters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  statusFilters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  paymentFilters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#2563eb',
  },
  ordersSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 20px 0',
  },
  ordersTable: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    gap: '20px',
  },
  orderLeft: {
    flex: 1,
  },
  orderRight: {
    minWidth: '220px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  orderHeader: {
    marginBottom: '8px',
  },
  orderTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  customerName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  typeTag: {
    fontSize: '11px',
    padding: '4px 8px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '4px',
    fontWeight: '600',
  },
  referenceId: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  statusRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap' as const,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
  },
  paymentBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
  },
  contactInfo: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px',
    flexWrap: 'wrap' as const,
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  orderDetails: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px',
  },
  detailItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  addressBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    padding: '8px 10px',
    backgroundColor: '#f0fdf4',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#166534',
    borderLeft: '3px solid #10b981',
    marginBottom: '8px',
  },
  notesBox: {
    padding: '8px 10px',
    backgroundColor: '#fef3c7',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#92400e',
    borderLeft: '3px solid #f59e0b',
    marginBottom: '8px',
  },
  reviewBox: {
    padding: '10px',
    backgroundColor: '#fffbeb',
    borderRadius: '6px',
    borderLeft: '3px solid #fbbf24',
  },
  reviewRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '4px',
  },
  ratingText: {
    fontSize: '11px',
    color: '#78350f',
    fontWeight: '600',
    marginLeft: '4px',
  },
  reviewComment: {
    fontSize: '11px',
    color: '#78350f',
    fontStyle: 'italic',
    margin: 0,
  },
  amountBox: {
    padding: '12px',
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    textAlign: 'center' as const,
    borderLeft: '4px solid #0284c7',
  },
  amountLabel: {
    fontSize: '11px',
    color: '#0c4a6e',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '4px',
  },
  amountValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0c4a6e',
    display: 'block',
  },
  orderActions: {
    display: 'flex',
    gap: '8px',
    flexDirection: 'column' as const,
  },
  actionButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  updateButton: {
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderColor: '#0284c7',
  },
  viewButton: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    borderColor: '#10b981',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#64748b',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'relative' as const,
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  orderInfo: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '8px',
  },
  statusOption: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    transition: 'all 0.2s ease',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '12px',
  },
  buttonPrimary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
};