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
} from 'lucide-react';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });

  const cancellationReasons = [
    'Changed my mind',
    'Found a better option',
    'No longer needed',
    'Service provider unavailable',
    'Budget constraints',
    'Schedule conflict',
    'Other (please specify)',
  ];

  const categories = [
    { id: 'all', label: 'All Services', icon: Sparkles },
    { id: 'catering', label: 'Catering', icon: UtensilsCrossed },
    { id: 'venues', label: 'Venues', icon: Home },
    { id: 'decorations', label: 'Decorations', icon: Palette },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'experiences', label: 'Experiences', icon: Star },
  ];

  const [allOrders, setAllOrders] = useState([
    {
      id: 'ORD-001',
      restaurantName: 'Bella Italia',
      category: 'catering',
      amount: 45.99,
      date: '2026-03-15',
      status: 'completed',
      items: ['Spaghetti Carbonara', 'Caesar Salad', 'Tiramisu'],
      deliveryAddress: '123 Main St, New York, NY 10001',
      estimatedDelivery: '2026-03-15 07:30 PM',
      rating: 4.5,
      reviewed: true,
      cancellationReason: null,
    },
    {
      id: 'ORD-002',
      restaurantName: 'Dragon Palace',
      category: 'catering',
      amount: 62.50,
      date: '2026-03-18',
      status: 'in-transit',
      items: ['Kung Pao Chicken', 'Fried Rice', 'Spring Rolls'],
      deliveryAddress: '456 Oak Ave, New York, NY 10002',
      estimatedDelivery: '2026-03-18 06:45 PM',
      rating: 0,
      reviewed: false,
      cancellationReason: null,
    },
    {
      id: 'ORD-003',
      restaurantName: 'Burger Bliss',
      category: 'catering',
      amount: 38.75,
      date: '2026-03-20',
      status: 'pending',
      items: ['Classic Burger', 'Sweet Potato Fries', 'Shake'],
      deliveryAddress: '789 Elm St, New York, NY 10003',
      estimatedDelivery: '2026-03-20 08:00 PM',
      rating: 0,
      reviewed: false,
      cancellationReason: null,
    },
    {
      id: 'ORD-004',
      restaurantName: 'Grand Ballroom',
      category: 'venues',
      amount: 78.99,
      date: '2026-03-10',
      status: 'completed',
      items: ['Venue Booking', 'Setup & Cleanup'],
      deliveryAddress: '321 Pine Rd, New York, NY 10004',
      estimatedDelivery: '2026-03-10 05:00 PM',
      rating: 5,
      reviewed: true,
      cancellationReason: null,
    },
    {
      id: 'ORD-005',
      restaurantName: 'Pizza Paradise',
      category: 'catering',
      amount: 52.00,
      date: '2026-03-05',
      status: 'cancelled',
      items: ['Margherita Pizza', 'Garlic Bread'],
      deliveryAddress: '654 Birch Ln, New York, NY 10005',
      estimatedDelivery: '2026-03-05 07:00 PM',
      rating: 0,
      reviewed: false,
      cancellationReason: 'Changed my mind',
    },
    {
      id: 'ORD-006',
      restaurantName: 'Creative Florals',
      category: 'decorations',
      amount: 150.00,
      date: '2026-02-28',
      status: 'completed',
      items: ['Floral Arrangements', 'Table Decorations'],
      deliveryAddress: '222 Wedding Ave, New York, NY 10006',
      estimatedDelivery: '2026-02-28 03:00 PM',
      rating: 4.0,
      reviewed: true,
      cancellationReason: null,
    },
    {
      id: 'ORD-007',
      restaurantName: 'Pro Photography',
      category: 'photography',
      amount: 500.00,
      date: '2026-02-14',
      status: 'completed',
      items: ['6-Hour Coverage', 'Edited Photos'],
      deliveryAddress: '456 Oak Ave, New York, NY 10002',
      estimatedDelivery: '2026-02-14 06:00 PM',
      rating: 5.0,
      reviewed: true,
      cancellationReason: null,
    },
    {
      id: 'ORD-008',
      restaurantName: 'Skyview Venue',
      category: 'venues',
      amount: 200.00,
      date: '2026-01-20',
      status: 'completed',
      items: ['Rooftop Venue', 'Catering Included'],
      deliveryAddress: '789 Sky Tower, New York, NY 10008',
      estimatedDelivery: '2026-01-20 04:00 PM',
      rating: 4.5,
      reviewed: true,
      cancellationReason: null,
    },
  ]);

  const getDateRange = (filter) => {
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
    return allOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const startDate = getDateRange(dateFilter);
        const orderDate = new Date(order.date);
        matchesDate = orderDate >= startDate;
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [searchTerm, statusFilter, categoryFilter, dateFilter, allOrders]);

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon size={20} />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-transit':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: 'Completed',
      'in-transit': 'In Transit',
      pending: 'Pending',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.label : category;
  };

  const handleReviewSubmit = () => {
    if (reviewData.rating > 0) {
      setSelectedOrder({
        ...selectedOrder,
        rating: reviewData.rating,
        reviewed: true,
      });
      setShowReviewModal(false);
      setReviewData({ rating: 0, comment: '' });
    }
  };

  const handleCancelOrder = () => {
    if (cancelReason.trim()) {
      const updatedOrders = allOrders.map(order =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: 'cancelled',
              cancellationReason: cancelReason,
            }
          : order
      );
      setAllOrders(updatedOrders);
      setSelectedOrder({
        ...selectedOrder,
        status: 'cancelled',
        cancellationReason: cancelReason,
      });
      setShowCancelModal(false);
      setCancelReason('');
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
            <div style={styles.orderHeader}>
              <div>
                <h1 style={styles.orderTitle}>{selectedOrder.id}</h1>
                <div style={styles.categoryBadgeDetail}>
                  {getCategoryIcon(selectedOrder.category)}
                  <span>{getCategoryLabel(selectedOrder.category)}</span>
                </div>
                <p style={styles.orderDate}>
                  Order placed on{' '}
                  {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div style={{ ...styles.statusBadge, ...styles[`status_${selectedOrder.status}`] }}>
                {getStatusIcon(selectedOrder.status)}
                <span>{getStatusLabel(selectedOrder.status)}</span>
              </div>
            </div>

            {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
              <div style={styles.cancellationNotice}>
                <AlertCircle size={20} />
                <div>
                  <p style={styles.cancellationLabel}>Cancellation Reason</p>
                  <p style={styles.cancellationText}>{selectedOrder.cancellationReason}</p>
                </div>
              </div>
            )}

            <div style={styles.detailGrid}>
              <div>
                <h3 style={styles.detailLabel}>Service Provider</h3>
                <p style={styles.detailValue}>{selectedOrder.restaurantName}</p>
              </div>
              <div>
                <h3 style={styles.detailLabel}>Scheduled Date & Time</h3>
                <p style={styles.detailValue}>
                  {new Date(selectedOrder.estimatedDelivery).toLocaleString('en-US')}
                </p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <h3 style={styles.detailLabel}>Services Booked</h3>
              <div style={styles.itemsList}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <span style={styles.itemName}>✓ {item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.detailSection}>
              <h3 style={styles.detailLabel}>Service Location</h3>
              <p style={styles.addressText}>{selectedOrder.deliveryAddress}</p>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total Amount:</span>
                <span style={styles.totalAmount}>${selectedOrder.amount.toFixed(2)}</span>
              </div>
            </div>

            <div style={styles.actionButtons}>
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                <>
                  <button style={styles.buttonPrimary}>
                    <MessageCircle size={18} />
                    Contact Provider
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    style={{ ...styles.buttonPrimary, ...styles.buttonDanger }}
                  >
                    <Trash2 size={18} />
                    Cancel Order
                  </button>
                </>
              )}

              {selectedOrder.status === 'in-transit' && (
                <button style={{ ...styles.buttonPrimary, ...styles.buttonSuccess }}>
                  <MessageCircle size={18} />
                  Get Live Updates
                </button>
              )}

              {selectedOrder.status === 'completed' && !selectedOrder.reviewed && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  style={{ ...styles.buttonPrimary, ...styles.buttonWarning }}
                >
                  <Star size={18} />
                  Leave a Review
                </button>
              )}

              {selectedOrder.reviewed && (
                <div style={styles.reviewedState}>
                  <CheckCircle size={18} color="#10b981" />
                  Review Submitted - {selectedOrder.rating} ⭐
                </div>
              )}
            </div>
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
                        <Star
                          size={32}
                          fill={star <= reviewData.rating ? '#fbbf24' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Comment (Optional)</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
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

          {/* Cancellation Modal */}
          {showCancelModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Cancel Order</h2>
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason('');
                    }}
                    style={styles.closeButton}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p style={styles.modalDescription}>
                  Are you sure you want to cancel this order? Please let us know why.
                </p>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Cancellation Reason</label>
                  <div style={styles.reasonList}>
                    {cancellationReasons.map((reason) => (
                      <label key={reason} style={styles.reasonOption}>
                        <input
                          type="radio"
                          name="cancellation-reason"
                          value={reason}
                          checked={cancelReason === reason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          style={styles.radioInput}
                        />
                        <span style={styles.reasonLabel}>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {cancelReason === 'Other (please specify)' && (
                  <div style={styles.formGroup}>
                    <textarea
                      placeholder="Please specify your reason..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      style={styles.textarea}
                    />
                  </div>
                )}

                <div style={styles.modalButtons}>
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason('');
                    }}
                    style={styles.buttonSecondary}
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason}
                    style={{
                      ...styles.buttonPrimary,
                      ...styles.buttonDanger,
                      opacity: !cancelReason ? 0.5 : 1,
                      cursor: !cancelReason ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Confirm Cancellation
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
          <h1 style={styles.pageTitle}>My Bookings</h1>
          <p style={styles.pageSubtitle}>
            {filteredOrders.length} booking{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Category Filter */}
        <div style={styles.categoryFilterContainer}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  ...styles.categoryButton,
                  ...(categoryFilter === cat.id ? styles.categoryButtonActive : styles.categoryButtonInactive),
                }}
              >
                <Icon size={18} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Advanced Filters */}
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
                <option value="pending">Pending</option>
                <option value="in-transit">In Progress</option>
                <option value="completed">Completed</option>
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
                  <th style={styles.tableHeaderCell}>Service Type</th>
                  <th style={styles.tableHeaderCell}>Provider</th>
                  <th style={styles.tableHeaderCell}>Date</th>
                  <th style={styles.tableHeaderCell}>Amount</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={styles.orderId}>{order.id}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.categoryInline}>
                        {getCategoryIcon(order.category)}
                        <span>{getCategoryLabel(order.category)}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>{order.restaurantName}</td>
                    <td style={styles.tableCell}>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.amount}>${order.amount.toFixed(2)}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ ...styles.statusBadgeSmall, ...styles[`status_${order.status}`] }}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
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
            <h3 style={styles.emptyTitle}>No bookings found</h3>
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
    overflowX: 'auto',
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
    whiteSpace: 'nowrap',
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
    flexDirection: 'row',
    gap: '12px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    minWidth: '250px',
  },
  searchIcon: {
    position: 'absolute',
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
    position: 'relative',
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
    appearance: 'none',
    transition: 'all 0.2s',
  },
  selectIcon: {
    position: 'absolute',
    right: '12px',
    top: '8px',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeaderCell: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
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
  categoryInline: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
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
  status_pending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
  },
  status_cancelled: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  'status_in-transit': {
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    border: '1px solid #bfdbfe',
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
    textAlign: 'center',
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
  cancellationNotice: {
    display: 'flex',
    gap: '12px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    color: '#991b1b',
  },
  cancellationLabel: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px',
  },
  cancellationText: {
    fontSize: '13px',
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
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
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
  addressText: {
    color: '#111827',
    fontWeight: '500',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#4b5563',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
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
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  reviewedState: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontWeight: '600',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
  },
  modalOverlay: {
    position: 'fixed',
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
    overflowY: 'auto',
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
  modalDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
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
  reasonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  reasonOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
  },
  radioInput: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  reasonLabel: {
    color: '#374151',
    fontWeight: '500',
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
    resize: 'none',
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
};