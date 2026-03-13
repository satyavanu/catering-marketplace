'use client';

import React, { useState, useEffect } from 'react';

interface KDSOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  menu: string;
  guests: number;
  dietaryRequirements: string[];
  items: KDSOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'delayed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  prepTimeEstimate: number; // minutes
  actualPrepTime?: number;
  assignedTo?: string;
  notes?: string;
}

interface KDSOrderItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'preparing' | 'ready';
  prepTime?: number;
  notes?: string;
}

export default function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>([
    {
      id: 1,
      orderNumber: '#223',
      customerId: 1,
      customerName: 'John Smith',
      eventName: 'Wedding Reception',
      eventDate: '2026-03-15',
      eventTime: '18:00',
      eventLocation: 'Grand Ballroom, Downtown',
      menu: 'Wedding Buffet',
      guests: 120,
      dietaryRequirements: ['Vegetarian', 'Gluten-Free', 'Vegan'],
      items: [
        {
          id: 1,
          name: 'Roasted Chicken Breast',
          quantity: 120,
          unit: 'pieces',
          status: 'preparing',
          prepTime: 25,
          notes: 'Keep warm after cooking',
        },
        {
          id: 2,
          name: 'Vegetarian Pasta',
          quantity: 40,
          unit: 'portions',
          status: 'preparing',
          prepTime: 15,
        },
        {
          id: 3,
          name: 'Garden Salad',
          quantity: 120,
          unit: 'portions',
          status: 'pending',
          prepTime: 10,
        },
        {
          id: 4,
          name: 'Chocolate Dessert',
          quantity: 120,
          unit: 'portions',
          status: 'pending',
          prepTime: 20,
        },
      ],
      status: 'preparing',
      priority: 'high',
      createdAt: '2026-03-15T08:00:00',
      prepTimeEstimate: 45,
      assignedTo: 'Chef Maria',
      notes: 'VIP client - ensure premium presentation',
    },
    {
      id: 2,
      orderNumber: '#224',
      customerId: 2,
      customerName: 'Jane Doe',
      eventName: 'Corporate Lunch',
      eventDate: '2026-03-15',
      eventTime: '12:00',
      eventLocation: 'Tech Center Conference Room',
      menu: 'Business Lunch Box',
      guests: 50,
      dietaryRequirements: ['Nut-Free'],
      items: [
        {
          id: 1,
          name: 'Grilled Sandwiches',
          quantity: 50,
          unit: 'pieces',
          status: 'ready',
          prepTime: 20,
        },
        {
          id: 2,
          name: 'Fruit Platters',
          quantity: 5,
          unit: 'platters',
          status: 'ready',
          prepTime: 15,
        },
        {
          id: 3,
          name: 'Beverages',
          quantity: 50,
          unit: 'units',
          status: 'ready',
          prepTime: 5,
        },
      ],
      status: 'ready',
      priority: 'normal',
      createdAt: '2026-03-15T08:30:00',
      prepTimeEstimate: 30,
      assignedTo: 'Chef Tom',
    },
    {
      id: 3,
      orderNumber: '#225',
      customerId: 3,
      customerName: 'Bob Johnson',
      eventName: 'Birthday Party',
      eventDate: '2026-03-15',
      eventTime: '17:00',
      eventLocation: 'Central Park Pavilion',
      menu: 'Party Celebration Menu',
      guests: 80,
      dietaryRequirements: ['Vegetarian'],
      items: [
        {
          id: 1,
          name: 'BBQ Ribs',
          quantity: 80,
          unit: 'portions',
          status: 'pending',
          prepTime: 30,
        },
        {
          id: 2,
          name: 'Vegetarian Options',
          quantity: 20,
          unit: 'portions',
          status: 'pending',
          prepTime: 20,
        },
        {
          id: 3,
          name: 'Birthday Cake',
          quantity: 1,
          unit: 'whole',
          status: 'pending',
          prepTime: 45,
        },
      ],
      status: 'pending',
      priority: 'urgent',
      createdAt: '2026-03-15T09:00:00',
      prepTimeEstimate: 60,
      assignedTo: 'Chef Alex',
      notes: 'Cake needs special decoration',
    },
    {
      id: 4,
      orderNumber: '#226',
      customerId: 4,
      customerName: 'Alice Brown',
      eventName: 'Gala Event',
      eventDate: '2026-03-16',
      eventTime: '19:00',
      eventLocation: 'Grand Hotel Ballroom',
      menu: 'Premium Gala Package',
      guests: 200,
      dietaryRequirements: ['Gluten-Free', 'Kosher'],
      items: [
        {
          id: 1,
          name: 'Filet Mignon',
          quantity: 200,
          unit: 'portions',
          status: 'ready',
          prepTime: 35,
        },
        {
          id: 2,
          name: 'Seafood Appetizers',
          quantity: 200,
          unit: 'pieces',
          status: 'ready',
          prepTime: 25,
        },
      ],
      status: 'completed',
      priority: 'high',
      createdAt: '2026-03-15T07:00:00',
      prepTimeEstimate: 50,
      assignedTo: 'Chef Maria',
      actualPrepTime: 48,
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | KDSOrder['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | KDSOrder['priority']>('all');
  const [selectedOrder, setSelectedOrder] = useState<KDSOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      // Simulate order updates
    }, 5000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const handleStatusChange = (orderId: number, newStatus: KDSOrder['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              actualPrepTime:
                newStatus === 'completed'
                  ? Math.floor(
                      (new Date().getTime() - new Date(order.createdAt).getTime()) / 60000
                    )
                  : order.actualPrepTime,
            }
          : order
      )
    );
  };

  const handleItemStatusChange = (orderId: number, itemId: number, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId
                  ? { ...item, status: newStatus as KDSOrderItem['status'] }
                  : item
              ),
            }
          : order
      )
    );
  };

  const handleAssignChef = (orderId: number, chefName: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, assignedTo: chefName } : order
      )
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (filterPriority !== 'all' && order.priority !== filterPriority) return false;
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' };
      case 'ready':
        return { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' };
      case 'preparing':
        return { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' };
      case 'pending':
        return { bg: '#dbeafe', border: '#93c5fd', text: '#0c4a6e' };
      case 'delayed':
        return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', border: '#d1d5db', text: '#1f2937' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'normal':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#9ca3af';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴 URGENT';
      case 'high':
        return '🟠 HIGH';
      case 'normal':
        return '🔵 NORMAL';
      case 'low':
        return '⚪ LOW';
      default:
        return 'UNKNOWN';
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const getTimeRemaining = (createdAt: string, prepTimeEstimate: number) => {
    const created = new Date(createdAt);
    const now = new Date();
    const elapsedMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
    const remaining = Math.max(0, prepTimeEstimate - elapsedMinutes);
    return remaining;
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 50;
      case 'ready':
        return 100;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  // Kitchen stats
  const stats = {
    total: sortedOrders.length,
    pending: sortedOrders.filter((o) => o.status === 'pending').length,
    preparing: sortedOrders.filter((o) => o.status === 'preparing').length,
    ready: sortedOrders.filter((o) => o.status === 'ready').length,
    completed: sortedOrders.filter((o) => o.status === 'completed').length,
    delayed: sortedOrders.filter((o) => o.status === 'delayed').length,
    avgPrepTime:
      sortedOrders.filter((o) => o.actualPrepTime).length > 0
        ? Math.round(
            sortedOrders.filter((o) => o.actualPrepTime).reduce((sum, o) => sum + (o.actualPrepTime || 0), 0) /
              sortedOrders.filter((o) => o.actualPrepTime).length
          )
        : 0,
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', backgroundColor: '#0f172a', minHeight: '100vh', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0, marginBottom: '0.5rem' }}>
              🍳 KITCHEN DISPLAY SYSTEM
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
              Real-time order management and prep tracking
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: autoRefresh ? '#10b981' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
              }}
            >
              {autoRefresh ? '🔄 Auto-Refresh ON' : '⏸️ Auto-Refresh OFF'}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'TOTAL', value: stats.total, color: '#8b5cf6' },
            { label: 'PENDING', value: stats.pending, color: '#3b82f6' },
            { label: 'PREPARING', value: stats.preparing, color: '#f59e0b' },
            { label: 'READY', value: stats.ready, color: '#10b981' },
            { label: 'COMPLETED', value: stats.completed, color: '#6b7280' },
            { label: 'DELAYED', value: stats.delayed, color: '#ef4444' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: `2px solid ${stat.color}`,
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: '600' }}>
                {stat.label}
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem' }}>
          {(['grid', 'list', 'timeline'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: viewMode === mode ? '#667eea' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
            >
              {mode === 'grid' ? '⊞' : mode === 'list' ? '≡' : '→'} {mode}
            </button>
          ))}
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1e293b',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1e293b',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {sortedOrders.map((order) => {
            const colors = getStatusColor(order.status);
            const timeRemaining = getTimeRemaining(order.createdAt, order.prepTimeEstimate);
            const isOverdue = timeRemaining < 0;

            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderDetail(true);
                }}
                style={{
                  ...cardStyle,
                  padding: '1.5rem',
                  border: `3px solid ${colors.border}`,
                  backgroundColor: '#1e293b',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: 'white' }}>
                      {order.orderNumber}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#cbd5e1' }}>
                      {order.customerName}
                    </p>
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      backgroundColor: colors.bg,
                      color: colors.text,
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      border: `2px solid ${colors.border}`,
                    }}
                  >
                    {order.status === 'preparing' && '🔥'}
                    {order.status === 'ready' && '✓'}
                    {order.status === 'pending' && '⏱️'}
                    {order.status === 'completed' && '✓'}
                    {order.status === 'delayed' && '⚠️'} {order.status}
                  </span>
                </div>

                {/* Event Info */}
                <div
                  style={{
                    backgroundColor: '#0f172a',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                    {order.eventName}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <span>📋 Menu: {order.menu}</span>
                    <span>👥 {order.guests} guests</span>
                    <span>📅 {order.eventDate}</span>
                    <span>🕐 {order.eventTime}</span>
                  </div>
                  {order.notes && (
                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', color: '#fbbf24', fontStyle: 'italic' }}>
                      📝 {order.notes}
                    </p>
                  )}
                </div>

                {/* Priority Badge */}
                <div style={{ marginBottom: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '0.25rem',
                      backgroundColor: getPriorityColor(order.priority),
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                    }}
                  >
                    {getPriorityLabel(order.priority)}
                  </span>
                </div>

                {/* Prep Time */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '500' }}>
                      TIME REMAINING
                    </span>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: isOverdue ? '#ef4444' : '#10b981',
                      }}
                    >
                      {isOverdue ? '⚠️ ' : ''}
                      {Math.abs(timeRemaining)} min {isOverdue ? 'overdue' : ''}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#334155',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: isOverdue ? '#ef4444' : getPriorityColor(order.priority),
                        width: `${Math.min(getProgressPercentage(order.status), 100)}%`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Assigned Chef */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>👨‍🍳 Chef:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#667eea' }}>
                    {order.assignedTo || 'Unassigned'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {order.status !== 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextStatus = order.status === 'pending' ? 'preparing' : order.status === 'preparing' ? 'ready' : 'completed';
                        handleStatusChange(order.id, nextStatus);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                    >
                      ▶ Next Step
                    </button>
                  )}
                  {order.status !== 'delayed' && order.status !== 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, 'delayed');
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                    >
                      ⚠️ Delay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={cardStyle}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #475569', backgroundColor: '#0f172a' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    ORDER
                  </th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    CUSTOMER
                  </th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    EVENT
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    GUESTS
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    PRIORITY
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    STATUS
                  </th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    TIME
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => {
                  const colors = getStatusColor(order.status);
                  const timeRemaining = getTimeRemaining(order.createdAt, order.prepTimeEstimate);

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #334155',
                        backgroundColor: '#1e293b',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                    >
                      <td style={{ padding: '1rem', color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                        {order.customerName}
                      </td>
                      <td style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                        {order.eventName}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#cbd5e1', fontSize: '0.875rem' }}>
                        {order.guests}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.25rem',
                            backgroundColor: getPriorityColor(order.priority),
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                          }}
                        >
                          {getPriorityLabel(order.priority)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.25rem',
                            backgroundColor: colors.bg,
                            color: colors.text,
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '600' }}>
                        {timeRemaining} min
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                        {order.status !== 'completed' && (
                          <button
                            onClick={() => {
                              const nextStatus = order.status === 'pending' ? 'preparing' : order.status === 'preparing' ? 'ready' : 'completed';
                              handleStatusChange(order.id, nextStatus);
                            }}
                            style={{
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#667eea',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontSize: '0.65rem',
                              fontWeight: '600',
                            }}
                          >
                            Next
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetail(true);
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#475569',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.65rem',
                            fontWeight: '600',
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {['pending', 'preparing', 'ready', 'completed'].map((statusGroup) => (
            <div key={statusGroup} style={{ ...cardStyle, backgroundColor: '#1e293b', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #334155' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'white', textTransform: 'uppercase' }}>
                  {statusGroup === 'pending' && '⏱️ PENDING'}
                  {statusGroup === 'preparing' && '🔥 PREPARING'}
                  {statusGroup === 'ready' && '✓ READY'}
                  {statusGroup === 'completed' && '✓ COMPLETED'}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  {sortedOrders.filter((o) => o.status === statusGroup).length}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedOrders
                  .filter((o) => o.status === statusGroup)
                  .map((order) => (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetail(true);
                      }}
                      style={{
                        backgroundColor: '#0f172a',
                        padding: '1rem',
                        borderRadius: '0.375rem',
                        border: `2px solid ${getPriorityColor(order.priority)}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>
                        {order.orderNumber}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#cbd5e1' }}>
                        {order.customerName}
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#cbd5e1' }}>
                        👥 {order.guests} | 🍽️ {order.menu}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
          onClick={() => setShowOrderDetail(false)}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              border: '2px solid #667eea',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ backgroundColor: '#0f172a', padding: '2rem', borderBottom: '2px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0, marginBottom: '0.5rem' }}>
                  Order {selectedOrder.orderNumber}
                </h2>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem' }}>
                  {selectedOrder.customerName} • {selectedOrder.eventName}
                </p>
              </div>
              <button
                onClick={() => setShowOrderDetail(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#cbd5e1',
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              {/* Order Info */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', margin: 0, marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Order Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '0.5rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                      Event Date
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                      {selectedOrder.eventDate}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                      Event Time
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                      {selectedOrder.eventTime}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                      Location
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                      {selectedOrder.eventLocation}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                      Menu
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                      {selectedOrder.menu}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                      Guests
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                      {selectedOrder.guests}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                      Assigned Chef
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontWeight: '600', color: '#667eea' }}>
                      {selectedOrder.assignedTo || 'Unassigned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dietary Requirements */}
              {selectedOrder.dietaryRequirements.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', margin: 0, marginBottom: '1rem', textTransform: 'uppercase' }}>
                    Dietary Requirements
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedOrder.dietaryRequirements.map((req, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fbbf24',
                          color: '#78350f',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        ⚠️ {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', margin: 0, marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Menu Items ({selectedOrder.items.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#0f172a',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: `2px solid ${getStatusColor(item.status).border}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'white' }}>
                            {item.name}
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                            {item.quantity} {item.unit}
                            {item.prepTime && ` • Prep: ${item.prepTime} min`}
                          </p>
                        </div>
                        <select
                          value={item.status}
                          onChange={(e) => handleItemStatusChange(selectedOrder.id, item.id, e.target.value)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: getStatusColor(item.status).bg,
                            color: getStatusColor(item.status).text,
                            border: `1px solid ${getStatusColor(item.status).border}`,
                            borderRadius: '0.375rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                        </select>
                      </div>
                      {item.notes && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#fbbf24', fontStyle: 'italic' }}>
                          📝 {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Controls */}
              <div style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '2px solid #334155' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', margin: 0, marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Order Status
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {(['pending', 'preparing', 'ready', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: selectedOrder.status === status ? '#667eea' : '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOrder.status !== status) {
                          e.currentTarget.style.backgroundColor = '#475569';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOrder.status !== status) {
                          e.currentTarget.style.backgroundColor = '#334155';
                        }
                      }}
                    >
                      {status === 'pending' && '⏱️'}
                      {status === 'preparing' && '🔥'}
                      {status === 'ready' && '✓'}
                      {status === 'completed' && '✓✓'}
                      {' '}{status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}