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

const MOCK_ORDERS: Order[] = [
  {
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
  {
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
  {
    id: 3,
    orderNumber: 'ORD-2025-003',
    clientName: 'Amit Singh',
    clientEmail: 'amit@example.com',
    clientPhone: '+91-9876543212',
    clientImage: '👨‍💼',
    eventDate: '2025-04-20',
    eventTime: '19:00',
    deliveryAddress: '789 High Street, Sector 8',
    city: 'Mumbai',
    zipCode: '400001',
    guestCount: 75,
    status: 'confirmed',
    items: [
      {
        id: 1,
        name: 'Tandoori Chicken',
        quantity: 75,
        price: 350,
      },
    ],
    subtotal: 26250,
    tax: 4725,
    deliveryFee: 600,
    discount: 0,
    total: 31575,
    specialRequests: 'Extra spice please. Deliver to hotel entrance.',
    createdDate: 'March 21, 2025',
    updatedDate: 'March 21, 2025',
    paymentStatus: 'completed',
    paymentMethod: 'card',
  },
  {
    id: 4,
    orderNumber: 'ORD-2025-004',
    clientName: 'Neha Gupta',
    clientEmail: 'neha@example.com',
    clientPhone: '+91-9876543213',
    clientImage: '👩‍💼',
    eventDate: '2025-04-22',
    eventTime: '11:00',
    deliveryAddress: '321 Park Lane, Sector 15',
    city: 'Pune',
    zipCode: '411001',
    guestCount: 30,
    status: 'pending',
    items: [
      {
        id: 1,
        name: 'Veg Pakora',
        quantity: 30,
        price: 120,
      },
      {
        id: 2,
        name: 'Samosa',
        quantity: 60,
        price: 50,
      },
    ],
    subtotal: 6600,
    tax: 1188,
    deliveryFee: 300,
    discount: 0,
    total: 8088,
    specialRequests: 'Fresh ingredients only.',
    createdDate: 'March 22, 2025',
    updatedDate: 'March 22, 2025',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
  },
];

export default function CatererOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  const statusOptions: { value: Order['status']; label: string; icon: string; color: string }[] = [
    { value: 'pending', label: 'Pending', icon: '⏳', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmed', icon: '✓', color: '#3b82f6' },
    { value: 'preparing', label: 'Preparing', icon: '👨‍🍳', color: '#8b5cf6' },
    { value: 'ready', label: 'Ready', icon: '✓', color: '#10b981' },
    { value: 'dispatched', label: 'Dispatched', icon: '🚚', color: '#06b6d4' },
    { value: 'delivered', label: 'Delivered', icon: '✓', color: '#059669' },
    { value: 'cancelled', label: 'Cancelled', icon: '✗', color: '#ef4444' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.color || '#64748b';
  };

  const getStatusLabel = (status: Order['status']) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.label || status;
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleSaveStatus = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: newStatus,
                updatedDate: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              }
            : order
        )
      );
      setShowStatusModal(false);
      setSelectedOrder(null);
    }
  };

  const handleViewDetails = (order: Order) => {
    router.push(`/account/caterer/orders/${order.orderNumber}`);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    revenue: orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage and track all your catering orders</p>
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
      </div>

      {/* Filters and Search */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by order number, client name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.statusFilters}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              ...styles.filterButton,
              ...(filterStatus === 'all' ? styles.filterButtonActive : {}),
            }}
          >
            All Orders
          </button>
          {statusOptions.map((option) => (
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
                    <h3 style={styles.orderNumber}>{order.orderNumber}</h3>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(order.status),
                      }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div style={styles.clientInfo}>
                    <span style={styles.clientName}>{order.clientName}</span>
                    <span style={styles.clientContact}>
                      {order.clientEmail} • {order.clientPhone}
                    </span>
                  </div>

                  <div style={styles.orderDetails}>
                    <span style={styles.detailItem}>
                      <CalendarIcon style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      {order.eventDate} at {order.eventTime}
                    </span>
                    <span style={styles.detailItem}>
                      <MapPinIcon style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      {order.city}
                    </span>
                    <span style={styles.detailItem}>👥 {order.guestCount} guests</span>
                    <span style={styles.detailItem}>
                      💰 ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div style={styles.orderRight}>
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

                  {order.review && (
                    <div style={styles.reviewPreview}>
                      <div style={styles.reviewStars}>
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
                      </div>
                      <p style={styles.reviewText}>"{order.review.comment}"</p>
                      <span style={styles.reviewBy}>— {order.review.clientName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No orders found. Try adjusting your filters or search.</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div style={styles.modal}>
          <div style={styles.modalOverlay} onClick={() => setShowStatusModal(false)} />
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Update Order Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                style={styles.closeButton}
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Order: {selectedOrder.orderNumber}</label>
                <p style={styles.orderDetails}>
                  {selectedOrder.clientName} • {selectedOrder.guestCount} guests
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Select New Status</label>
                <div style={styles.statusGrid}>
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewStatus(option.value)}
                      style={{
                        ...styles.statusOption,
                        ...(newStatus === option.value
                          ? { backgroundColor: option.color, color: 'white', borderColor: option.color }
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
  statusFilters: {
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
  },
  orderLeft: {
    flex: 1,
  },
  orderRight: {
    marginLeft: '16px',
    textAlign: 'right' as const,
    minWidth: '250px',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  orderNumber: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
  },
  clientInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    marginBottom: '8px',
  },
  clientName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  clientContact: {
    fontSize: '12px',
    color: '#64748b',
  },
  orderDetails: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
    fontSize: '12px',
    color: '#64748b',
  },
  detailItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  orderActions: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
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
  reviewPreview: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#fffbeb',
    borderRadius: '8px',
    borderLeft: '4px solid #fbbf24',
  },
  reviewStars: {
    display: 'flex',
    gap: '4px',
    marginBottom: '8px',
  },
  reviewText: {
    fontSize: '12px',
    color: '#78350f',
    fontStyle: 'italic',
    margin: '4px 0',
    lineHeight: '1.4',
  },
  reviewBy: {
    fontSize: '11px',
    color: '#92400e',
    fontWeight: '600',
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
    maxWidth: '500px',
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