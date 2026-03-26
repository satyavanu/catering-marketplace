'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Users,
  DollarSign,
  Star,
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  items: string[];
  quantity: number;
  amount: number;
  deliveryTime: string;
  deliveryAddress: string;
  status: 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  notes?: string;
}

interface Subscription {
  id: string;
  customerName: string;
  mealType: string;
  mealsPerWeek: number;
  nextDelivery: string;
  amount: number;
  status: 'active' | 'paused' | 'expiring-soon';
}

interface MenuItem {
  id: string;
  name: string;
  status: 'available' | 'unavailable' | 'out-of-stock';
}

const MOCK_TODAYS_ORDERS: Order[] = [
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
  },
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'SUB-001',
    customerName: 'Vikram Singh',
    mealType: 'Lunch Pro Plan',
    mealsPerWeek: 5,
    nextDelivery: 'Today, 12:30 PM',
    amount: 2500,
    status: 'active',
  },
  {
    id: 'SUB-002',
    customerName: 'Anjali Gupta',
    mealType: 'Breakfast Bundle',
    mealsPerWeek: 5,
    nextDelivery: 'Tomorrow, 8:00 AM',
    amount: 1500,
    status: 'active',
  },
  {
    id: 'SUB-003',
    customerName: 'Rohan Desai',
    mealType: 'All-Day Combo',
    mealsPerWeek: 7,
    nextDelivery: 'Today, 5:30 PM',
    amount: 3500,
    status: 'active',
  },
  {
    id: 'SUB-004',
    customerName: 'Divya Nair',
    mealType: 'Wellness Plan',
    mealsPerWeek: 6,
    nextDelivery: 'In 3 days',
    amount: 2800,
    status: 'expiring-soon',
  },
];

const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Butter Chicken', status: 'available' },
  { id: '2', name: 'Paneer Tikka', status: 'available' },
  { id: '3', name: 'Luchi Aloo', status: 'available' },
  { id: '4', name: 'Fish Curry', status: 'out-of-stock' },
  { id: '5', name: 'Chow Mein', status: 'available' },
  { id: '6', name: 'Spring Rolls', status: 'unavailable' },
];

export default function CatererDashboard() {
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setTodaysOrders(MOCK_TODAYS_ORDERS);
      setSubscriptions(MOCK_SUBSCRIPTIONS);
      setMenuItems(MOCK_MENU_ITEMS);
      setLoading(false);
    }, 500);
  }, []);

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
      case 'active':
        return { bg: '#dcfce7', text: '#166534', icon: CheckCircle };
      case 'expiring-soon':
        return { bg: '#fee2e2', text: '#991b1b', icon: AlertCircle };
      default:
        return { bg: '#f3f4f6', text: '#374151', icon: AlertCircle };
    }
  };

  const getQuickStats = () => {
    const totalOrders = todaysOrders.length;
    const activeOrders = todaysOrders.filter(
      (o) => o.status !== 'delivered'
    ).length;
    const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.amount, 0);
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === 'active'
    ).length;

    return {
      totalOrders,
      activeOrders,
      totalRevenue,
      activeSubscriptions,
    };
  };

  const stats = getQuickStats();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Caterer Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.headerButton}>
            <Bell size={20} />
          </button>
          <button style={styles.headerButton}>
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff' }}>
            <Package size={24} style={{ color: '#0284c7' }} />
          </div>
          <div>
            <p style={styles.statLabel}>Today's Orders</p>
            <h3 style={styles.statValue}>{stats.totalOrders}</h3>
            <p style={styles.statSubtext}>
              {stats.activeOrders} active
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper} style={{ backgroundColor: '#f0fdf4' }}>
            <Users size={24} style={{ color: '#16a34a' }} />
          </div>
          <div>
            <p style={styles.statLabel}>Active Subscriptions</p>
            <h3 style={styles.statValue}>{stats.activeSubscriptions}</h3>
            <p style={styles.statSubtext}>
              Recurring revenue
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper} style={{ backgroundColor: '#fef3c7' }}>
            <DollarSign size={24} style={{ color: '#d97706' }} />
          </div>
          <div>
            <p style={styles.statLabel}>Today's Revenue</p>
            <h3 style={styles.statValue}>₹{stats.totalRevenue}</h3>
            <p style={styles.statSubtext}>
              From {stats.totalOrders} orders
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper} style={{ backgroundColor: '#fdf2f8' }}>
            <Star size={24} style={{ color: '#ec4899' }} />
          </div>
          <div>
            <p style={styles.statLabel}>Rating</p>
            <h3 style={styles.statValue}>4.8</h3>
            <p style={styles.statSubtext}>
              From 245 reviews
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Today's Orders */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Today's Orders</h2>
            <a href="/caterer/orders" style={styles.viewAllLink}>
              View All <ChevronRight size={16} />
            </a>
          </div>

          {todaysOrders.length > 0 ? (
            <div style={styles.ordersList}>
              {todaysOrders.map((order) => {
                const statusColor = getStatusColor(order.status);
                const StatusIcon = statusColor.icon;

                return (
                  <div key={order.id} style={styles.orderItem}>
                    <div style={styles.orderContent}>
                      <div style={styles.orderHeader}>
                        <h4 style={styles.orderNumber}>{order.id}</h4>
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

                      <div style={styles.orderMeta}>
                        <span style={styles.metaItem}>
                          <Clock size={14} />
                          {order.deliveryTime}
                        </span>
                        <span style={styles.metaItem}>
                          <MapPin size={14} />
                          {order.deliveryAddress.split(',')[0]}
                        </span>
                      </div>

                      <div style={styles.itemsPreview}>
                        {order.items.map((item, idx) => (
                          <span key={idx} style={styles.itemBadge}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={styles.orderPrice}>
                      <p style={styles.priceLabel}>Amount</p>
                      <p style={styles.price}>₹{order.amount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#6b7280', padding: '24px', textAlign: 'center' }}>
              No orders today
            </p>
          )}
        </div>

        {/* Active Subscriptions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Active Subscriptions</h2>
            <a href="/caterer/subscriptions" style={styles.viewAllLink}>
              View All <ChevronRight size={16} />
            </a>
          </div>

          {subscriptions.length > 0 ? (
            <div style={styles.subscriptionsList}>
              {subscriptions.map((sub) => {
                const statusColor = getStatusColor(sub.status);

                return (
                  <div
                    key={sub.id}
                    style={{
                      ...styles.subscriptionItem,
                      borderLeftColor: statusColor.text,
                    }}
                  >
                    <div>
                      <h4 style={styles.subscriptionName}>{sub.customerName}</h4>
                      <p style={styles.subscriptionType}>{sub.mealType}</p>
                      <p style={styles.subscriptionDetails}>
                        {sub.mealsPerWeek} meals/week • Next: {sub.nextDelivery}
                      </p>
                    </div>

                    <div style={styles.subscriptionRight}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={styles.priceLabel}>Monthly</p>
                        <p style={styles.price}>₹{sub.amount}</p>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          marginTop: '8px',
                        }}
                      >
                        {sub.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#6b7280', padding: '24px', textAlign: 'center' }}>
              No active subscriptions
            </p>
          )}
        </div>

        {/* Menu Status & Quick Actions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Menu Status</h2>
            <a href="/caterer/menu" style={styles.viewAllLink}>
              Manage <ChevronRight size={16} />
            </a>
          </div>

          {menuItems.length > 0 ? (
            <div style={styles.menuList}>
              {menuItems.map((item) => {
                let statusColor = { bg: '#dcfce7', text: '#166534', icon: Eye };
                if (item.status === 'unavailable') {
                  statusColor = { bg: '#fee2e2', text: '#991b1b', icon: EyeOff };
                } else if (item.status === 'out-of-stock') {
                  statusColor = { bg: '#fef3c7', text: '#92400e', icon: AlertCircle };
                }

                const StatusIcon = statusColor.icon;

                return (
                  <div key={item.id} style={styles.menuItemRow}>
                    <span style={styles.menuItemName}>{item.name}</span>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                      }}
                    >
                      <StatusIcon size={14} />
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#6b7280', padding: '24px', textAlign: 'center' }}>
              No menu items
            </p>
          )}

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <button style={styles.actionButton}>
              <Plus size={18} />
              Add Menu Item
            </button>
            <button style={{ ...styles.actionButton, ...styles.actionButtonSecondary }}>
              <Settings size={18} />
              Update Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Plus Icon
function Plus({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    maxWidth: '1400px',
    margin: '0 auto 32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '8px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  headerButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
    maxWidth: '1400px',
    margin: '0 auto 32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  statIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '4px 0 4px 0',
  },
  statSubtext: {
    fontSize: '13px',
    color: '#9ca3af',
    margin: 0,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  orderContent: {
    flex: 1,
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  orderNumber: {
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
  orderMeta: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  itemsPreview: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  itemBadge: {
    display: 'inline-block',
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  },
  orderPrice: {
    textAlign: 'right' as const,
  },
  priceLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    margin: 0,
  },
  price: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: '4px 0 0 0',
  },
  subscriptionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  subscriptionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    borderLeft: '4px solid #2563eb',
  },
  subscriptionName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  subscriptionType: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  subscriptionDetails: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '4px 0 0 0',
  },
  subscriptionRight: {
    textAlign: 'right' as const,
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '16px',
  },
  menuItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  menuItemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionButtonSecondary: {
    backgroundColor: '#ffffff',
    color: '#2563eb',
    border: '1px solid #e5e7eb',
  },
};