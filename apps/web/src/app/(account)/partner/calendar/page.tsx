'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  RotateCcw,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  Truck,
  Users,
  Utensils,
} from 'lucide-react';

interface Delivery {
  id: string;
  type: 'bulk_order' | 'subscription' | 'meal';
  quantity: number;
  timeSlot?: string;
  customerName: string;
  status: 'pending' | 'confirmed' | 'completed';
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
  deliveries: Delivery[];
}

const MOCK_CALENDAR_DATA: { [key: string]: DayData } = {
  '2026-03-01': {
    date: '2026-03-01',
    dayOfWeek: 'Sunday',
    meals: 28,
    orders: 6,
    subscriptions: 22,
    cancelled: 1,
    revenue: 4200,
    status: 'normal',
    deliveries: [
      { id: '1', type: 'bulk_order', quantity: 50, timeSlot: '12:00 PM - 01:00 PM', customerName: 'Tech Corp', status: 'confirmed' },
      { id: '2', type: 'subscription', quantity: 22, customerName: 'Regular Users', status: 'confirmed' },
      { id: '3', type: 'meal', quantity: 6, customerName: 'Individual Orders', status: 'pending' },
    ],
  },
  '2026-03-02': {
    date: '2026-03-02',
    dayOfWeek: 'Monday',
    meals: 56,
    orders: 15,
    subscriptions: 41,
    cancelled: 0,
    revenue: 8950,
    status: 'busy',
    deliveries: [
      { id: '1', type: 'bulk_order', quantity: 80, timeSlot: '11:30 AM - 12:30 PM', customerName: 'StartUp Inc', status: 'confirmed' },
      { id: '2', type: 'bulk_order', quantity: 60, timeSlot: '02:00 PM - 03:00 PM', customerName: 'Finance Ltd', status: 'confirmed' },
      { id: '3', type: 'subscription', quantity: 41, customerName: 'Subscription Members', status: 'confirmed' },
      { id: '4', type: 'meal', quantity: 15, customerName: 'Individual Orders', status: 'pending' },
    ],
  },
  '2026-03-03': {
    date: '2026-03-03',
    dayOfWeek: 'Tuesday',
    meals: 42,
    orders: 10,
    subscriptions: 32,
    cancelled: 3,
    revenue: 6800,
    status: 'normal',
    deliveries: [
      { id: '1', type: 'bulk_order', quantity: 45, timeSlot: '12:15 PM - 01:15 PM', customerName: 'Design Studio', status: 'confirmed' },
      { id: '2', type: 'subscription', quantity: 32, customerName: 'Regular Users', status: 'confirmed' },
      { id: '3', type: 'meal', quantity: 10, customerName: 'Individual Orders', status: 'confirmed' },
    ],
  },
  '2026-03-25': {
    date: '2026-03-25',
    dayOfWeek: 'Wednesday',
    meals: 42,
    orders: 10,
    subscriptions: 32,
    cancelled: 3,
    revenue: 6800,
    status: 'normal',
    deliveries: [
      { id: '1', type: 'bulk_order', quantity: 50, timeSlot: '12:00 PM - 01:00 PM', customerName: 'Marketing Team', status: 'confirmed' },
      { id: '2', type: 'subscription', quantity: 32, customerName: 'Subscription Members', status: 'confirmed' },
      { id: '3', type: 'meal', quantity: 10, customerName: 'Individual Orders', status: 'pending' },
    ],
  },
};

export default function CatererCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-03-25');
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getDateString = (day: number): string => {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}-${dayStr}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'busy':
        return { bg: '#dcfce7', border: '#86efac', icon: TrendingUp, color: '#166534', label: 'Busy' };
      case 'normal':
        return { bg: '#dbeafe', border: '#7dd3fc', icon: CheckCircle, color: '#0c4a6e', label: 'Normal' };
      case 'quiet':
        return { bg: '#f3e8ff', border: '#e9d5ff', icon: Clock, color: '#6b21a8', label: 'Quiet' };
      case 'critical':
        return { bg: '#fee2e2', border: '#fecaca', icon: AlertCircle, color: '#991b1b', label: 'Critical' };
      default:
        return { bg: '#f3f4f6', border: '#e5e7eb', icon: CalendarIcon, color: '#374151', label: 'Unknown' };
    }
  };

  const getDeliveryTypeIcon = (type: string) => {
    switch (type) {
      case 'bulk_order':
        return { icon: Truck, label: 'Bulk Orders', color: '#0284c7', bg: '#eff6ff' };
      case 'subscription':
        return { icon: Users, label: 'Subscriptions', color: '#ec4899', bg: '#fdf2f8' };
      case 'meal':
        return { icon: Utensils, label: 'One-time Meals', color: '#16a34a', bg: '#f0fdf4' };
      default:
        return { icon: Package, label: 'Unknown', color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const selectedDateData = selectedDate ? MOCK_CALENDAR_DATA[selectedDate] : null;
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        gridTemplateColumns: '1fr',
        containerPadding: '16px',
        cardPadding: '16px',
        calendarGap: '4px',
        contentGap: '16px',
        dayMinHeight: '100px',
        dayPadding: '8px',
        fontSize: {
          title: '24px',
          monthTitle: '20px',
          dayNumber: '13px',
          metric: '9px',
        },
      };
    } else if (isTablet) {
      return {
        gridTemplateColumns: '1fr 280px',
        containerPadding: '20px',
        cardPadding: '16px',
        calendarGap: '6px',
        contentGap: '16px',
        dayMinHeight: '100px',
        dayPadding: '8px',
        fontSize: {
          title: '28px',
          monthTitle: '20px',
          dayNumber: '12px',
          metric: '9px',
        },
      };
    } else {
      return {
        gridTemplateColumns: '1fr',
        containerPadding: '20px',
        cardPadding: '16px',
        calendarGap: '6px',
        contentGap: '20px',
        dayMinHeight: '110px',
        dayPadding: '10px',
        fontSize: {
          title: '32px',
          monthTitle: '22px',
          dayNumber: '14px',
          metric: '10px',
        },
      };
    }
  };

  const responsive = getResponsiveStyles();

  // Get all days with data for current month
  const daysWithData = daysArray
    .filter((day) => day !== null)
    .map((day) => {
      const dateStr = getDateString(day!);
      return {
        day: day!,
        dateStr,
        data: MOCK_CALENDAR_DATA[dateStr],
      };
    });

  return (
    <div style={{ ...styles.container, padding: responsive.containerPadding }}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={{ ...styles.title, fontSize: responsive.fontSize.title }}>
            Catering Calendar
          </h1>
          <p style={styles.subtitle}>
            View your daily deliveries by type, time slots, and order status
          </p>
        </div>

        {/* Mobile List View */}
        {isMobile ? (
          <>
            {/* List View for Mobile */}
            <div style={{ ...styles.calendarCard, padding: responsive.cardPadding }}>
              {/* Month Navigation */}
              <div style={styles.monthHeader}>
                <button
                  onClick={handlePrevMonth}
                  style={styles.navButton}
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 style={{ ...styles.monthTitle, fontSize: responsive.fontSize.monthTitle }}>
                  {monthYear}
                </h2>
                <button
                  onClick={handleNextMonth}
                  style={styles.navButton}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* List View */}
              <div style={styles.listContainer}>
                {daysWithData.map(({ day, dateStr, data }) => {
                  const isSelected = selectedDate === dateStr;
                  const statusColor = data ? getStatusColor(data.status) : null;

                  return (
                    <Link
                      key={`list-${day}`}
                      href={`/caterer/calendar/${dateStr}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        onClick={() => setSelectedDate(dateStr)}
                        style={{
                          ...styles.listItem,
                          ...(isSelected ? styles.listItemSelected : {}),
                          ...(statusColor ? {
                            borderLeftColor: statusColor.border,
                          } : {}),
                        }}
                      >
                        <div style={styles.listItemDate}>
                          <div style={styles.listItemDay}>{day}</div>
                          <div style={styles.listItemMonth}>
                            {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </div>

                        {data && (
                          <>
                            <div style={styles.listItemMetrics}>
                              <div style={styles.listMetricItem}>
                                <span style={styles.listMetricLabel}>Meals</span>
                                <span style={styles.listMetricValue}>{data.meals}</span>
                              </div>
                              <div style={styles.listMetricItem}>
                                <span style={styles.listMetricLabel}>Orders</span>
                                <span style={styles.listMetricValue}>{data.orders}</span>
                              </div>
                              <div style={styles.listMetricItem}>
                                <span style={styles.listMetricLabel}>Subs</span>
                                <span style={styles.listMetricValue}>{data.subscriptions}</span>
                              </div>
                            </div>

                            <div style={styles.listItemRight}>
                              <div style={styles.listRevenue}>₹{data.revenue.toLocaleString()}</div>
                              <div
                                style={{
                                  ...styles.listStatus,
                                  backgroundColor: statusColor.bg,
                                  color: statusColor.color,
                                }}
                              >
                                {statusColor.label}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Details Card */}
            {selectedDateData && (
              <div style={{ ...styles.detailsCard, padding: responsive.cardPadding, marginTop: responsive.contentGap }}>
                <div style={styles.detailsHeader}>
                  <h3 style={styles.detailsTitle}>
                    {new Date(selectedDateData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                </div>

                <div style={{ ...styles.detailsContent, gap: responsive.contentGap }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <p style={styles.metricLabel}>Total Meals</p>
                      <h4 style={styles.metricValue}>{selectedDateData.meals}</h4>
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Orders</p>
                      <h4 style={styles.metricValue}>{selectedDateData.orders}</h4>
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Subscriptions</p>
                      <h4 style={styles.metricValue}>{selectedDateData.subscriptions}</h4>
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Cancelled</p>
                      <h4 style={{ ...styles.metricValue, color: selectedDateData.cancelled > 0 ? '#991b1b' : '#16a34a' }}>
                        {selectedDateData.cancelled}
                      </h4>
                    </div>
                  </div>

                  <div style={styles.revenueCard}>
                    <p style={styles.revenueLabel}>Daily Revenue</p>
                    <h2 style={styles.revenueValue}>₹{selectedDateData.revenue.toLocaleString()}</h2>
                  </div>

                  {/* Deliveries by Type */}
                  <div style={styles.deliveriesSection}>
                    <h4 style={styles.deliveriesSectionTitle}>Deliveries Breakdown</h4>
                    <div style={styles.deliveriesGrid}>
                      {selectedDateData.deliveries.map((delivery) => {
                        const typeInfo = getDeliveryTypeIcon(delivery.type);
                        return (
                          <div key={delivery.id} style={{ ...styles.deliveryTypeCard, backgroundColor: typeInfo.bg }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <typeInfo.icon size={16} style={{ color: typeInfo.color }} />
                              <span style={{ fontSize: '12px', fontWeight: '600', color: typeInfo.color }}>
                                {typeInfo.label}
                              </span>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                              {delivery.quantity}
                            </div>
                            {delivery.timeSlot && (
                              <div style={{ fontSize: '10px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} />
                                {delivery.timeSlot}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Link
                    href={`/caterer/calendar/${selectedDateData.date}`}
                    style={{ ...styles.actionButton, display: 'block', textAlign: 'center', textDecoration: 'none', color: '#ffffff' }}
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Desktop & Tablet Grid View */
          <>
            {/* Day Details Card - Above Calendar (Desktop Only) */}
            {selectedDateData && isDesktop && (
              <div style={{ ...styles.detailsCard, padding: responsive.cardPadding, marginBottom: responsive.contentGap }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: responsive.contentGap, alignItems: 'start' }}>
                  {/* Date & Header */}
                  <div style={{ gridColumn: '1 / 2' }}>
                    <h3 style={{ ...styles.detailsTitle, fontSize: '18px' }}>
                      {new Date(selectedDateData.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h3>
                  </div>

                  {/* Revenue */}
                  <div>
                    <p style={styles.metricLabel}>Daily Revenue</p>
                    <h2 style={{ ...styles.revenueValue, fontSize: '18px', margin: '4px 0 0 0' }}>
                      ₹{selectedDateData.revenue.toLocaleString()}
                    </h2>
                  </div>

                  {/* Status */}
                  <div>
                    <p style={styles.statusLabel}>Status</p>
                    {(() => {
                      const statusColor = getStatusColor(selectedDateData.status);
                      const StatusIcon = statusColor.icon;
                      return (
                        <div
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                            marginTop: '6px',
                          }}
                        >
                          <StatusIcon size={12} />
                          <span style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '10px' }}>
                            {selectedDateData.status}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Action */}
                  <div style={{ textAlign: 'right' }}>
                    <Link
                      href={`/caterer/calendar/${selectedDateData.date}`}
                      style={{ ...styles.actionButton, padding: '8px 12px', fontSize: '12px', display: 'inline-block', width: 'auto', textDecoration: 'none', color: '#ffffff' }}
                    >
                      View Details →
                    </Link>
                  </div>

                  {/* Divider */}
                  <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: '#e5e7eb', margin: responsive.contentGap + ' 0' }} />

                  {/* Metrics Row */}
                  <div style={styles.desktopMetricItem}>
                    <p style={styles.metricLabel}>Total Meals</p>
                    <h4 style={{ ...styles.metricValue, fontSize: '18px' }}>{selectedDateData.meals}</h4>
                  </div>

                  <div style={styles.desktopMetricItem}>
                    <p style={styles.metricLabel}>Orders</p>
                    <h4 style={{ ...styles.metricValue, fontSize: '18px' }}>{selectedDateData.orders}</h4>
                  </div>

                  <div style={styles.desktopMetricItem}>
                    <p style={styles.metricLabel}>Subscriptions</p>
                    <h4 style={{ ...styles.metricValue, fontSize: '18px' }}>{selectedDateData.subscriptions}</h4>
                  </div>

                  <div style={styles.desktopMetricItem}>
                    <p style={styles.metricLabel}>Cancelled</p>
                    <h4 style={{
                      ...styles.metricValue,
                      fontSize: '18px',
                      color: selectedDateData.cancelled > 0 ? '#991b1b' : '#16a34a',
                    }}>
                      {selectedDateData.cancelled}
                    </h4>
                  </div>

                  {/* Divider */}
                  <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: '#e5e7eb', margin: responsive.contentGap + ' 0' }} />

                  {/* Deliveries Header */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ ...styles.deliveriesSectionLabel, margin: '0 0 12px 0' }}>Deliveries by Type</p>
                  </div>

                  {/* Deliveries Grid */}
                  {selectedDateData.deliveries.map((delivery) => {
                    const typeInfo = getDeliveryTypeIcon(delivery.type);
                    return (
                      <div key={delivery.id} style={{ ...styles.desktopDeliveryCard, backgroundColor: typeInfo.bg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <typeInfo.icon size={14} style={{ color: typeInfo.color }} />
                          <span style={{ fontSize: '11px', fontWeight: '600', color: typeInfo.color }}>
                            {typeInfo.label.split(' ')[0]}
                          </span>
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                          {delivery.quantity}
                        </div>
                        {delivery.timeSlot && (
                          <div style={{ fontSize: '9px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={10} />
                            {delivery.timeSlot}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calendar Section - Full Width */}
            <div style={{ ...styles.calendarCard, padding: responsive.cardPadding, marginBottom: responsive.contentGap }}>
              {/* Month Navigation */}
              <div style={styles.monthHeader}>
                <button
                  onClick={handlePrevMonth}
                  style={styles.navButton}
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 style={{ ...styles.monthTitle, fontSize: responsive.fontSize.monthTitle }}>
                  {monthYear}
                </h2>
                <button
                  onClick={handleNextMonth}
                  style={styles.navButton}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Days of Week Header */}
              <div style={styles.weekDaysHeader}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} style={styles.weekDayLabel}>
                    {isTablet ? day.slice(0, 1) : day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ ...styles.calendarGrid, gap: responsive.calendarGap }}>
                {daysArray.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} style={styles.emptyCell} />;
                  }

                  const dateStr = getDateString(day);
                  const dayData = MOCK_CALENDAR_DATA[dateStr];
                  const isSelected = selectedDate === dateStr;
                  const statusColor = dayData ? getStatusColor(dayData.status) : null;

                  return (
                    <Link
                      key={`day-${day}`}
                      href={`/caterer/calendar/${dateStr}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        onClick={() => setSelectedDate(dateStr)}
                        style={{
                          ...styles.dayCell,
                          padding: responsive.dayPadding,
                          minHeight: responsive.dayMinHeight,
                          ...(isSelected ? styles.dayCellSelected : {}),
                          ...(statusColor ? {
                            borderColor: statusColor.border,
                            backgroundColor: isSelected ? statusColor.bg : '#ffffff',
                          } : {}),
                        }}
                      >
                        <div style={{ ...styles.dayNumber, fontSize: responsive.fontSize.dayNumber }}>
                          {day}
                        </div>

                        {dayData && (
                          <>
                            <div style={{ ...styles.dayMetrics, fontSize: responsive.fontSize.metric }}>
                              <span style={styles.metric} title="Meals">
                                🍱 {dayData.meals}
                              </span>
                              <span style={styles.metric} title="Orders">
                                🧾 {dayData.orders}
                              </span>
                            </div>

                            <div style={{ ...styles.dayMetrics, fontSize: responsive.fontSize.metric }}>
                              <span style={styles.metric} title="Subscriptions">
                                🔁 {dayData.subscriptions}
                              </span>
                              {dayData.cancelled > 0 && (
                                <span style={{ ...styles.metric, ...styles.metricCritical }} title="Cancelled">
                                  ❌ {dayData.cancelled}
                                </span>
                              )}
                            </div>

                            <div
                              style={{
                                ...styles.statusDot,
                                backgroundColor: statusColor.color,
                              }}
                            />
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tablet Details Card - Below Calendar */}
            {selectedDateData && isTablet && (
              <div style={{ ...styles.detailsCard, padding: responsive.cardPadding }}>
                <div style={styles.detailsHeader}>
                  <div>
                    <h3 style={styles.detailsTitle}>
                      {new Date(selectedDateData.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h3>
                  </div>
                  <Link
                    href={`/caterer/calendar/${selectedDateData.date}`}
                    style={styles.viewDetailsLink}
                  >
                    View Full →
                  </Link>
                </div>

                {/* Compact Metrics Grid */}
                <div style={styles.compactMetricsGrid}>
                  <div style={styles.compactMetricCard}>
                    <div style={{ ...styles.compactMetricIcon, backgroundColor: '#eff6ff' }}>
                      <Package size={16} style={{ color: '#0284c7' }} />
                    </div>
                    <div>
                      <p style={styles.compactMetricLabel}>Meals</p>
                      <h4 style={styles.compactMetricValue}>{selectedDateData.meals}</h4>
                    </div>
                  </div>

                  <div style={styles.compactMetricCard}>
                    <div style={{ ...styles.compactMetricIcon, backgroundColor: '#f0fdf4' }}>
                      <ShoppingCart size={16} style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                      <p style={styles.compactMetricLabel}>Orders</p>
                      <h4 style={styles.compactMetricValue}>{selectedDateData.orders}</h4>
                    </div>
                  </div>

                  <div style={styles.compactMetricCard}>
                    <div style={{ ...styles.compactMetricIcon, backgroundColor: '#fdf2f8' }}>
                      <RotateCcw size={16} style={{ color: '#ec4899' }} />
                    </div>
                    <div>
                      <p style={styles.compactMetricLabel}>Subs</p>
                      <h4 style={styles.compactMetricValue}>{selectedDateData.subscriptions}</h4>
                    </div>
                  </div>

                  <div style={styles.compactMetricCard}>
                    <div style={{ ...styles.compactMetricIcon, backgroundColor: '#fee2e2' }}>
                      <X size={16} style={{ color: '#991b1b' }} />
                    </div>
                    <div>
                      <p style={styles.compactMetricLabel}>Cancelled</p>
                      <h4 style={{
                        ...styles.compactMetricValue,
                        color: selectedDateData.cancelled > 0 ? '#991b1b' : '#16a34a',
                      }}>
                        {selectedDateData.cancelled}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div style={styles.compactRevenueCard}>
                  <p style={styles.revenueLabel}>Daily Revenue</p>
                  <h2 style={styles.revenueValue}>₹{selectedDateData.revenue.toLocaleString()}</h2>
                </div>

                {/* Deliveries Summary */}
                <div style={styles.deliveriesSummarySection}>
                  <p style={styles.deliveriesSectionLabel}>Deliveries by Type</p>
                  <div style={styles.deliveryTypesSummary}>
                    {selectedDateData.deliveries.map((delivery) => {
                      const typeInfo = getDeliveryTypeIcon(delivery.type);
                      return (
                        <div key={delivery.id} style={{ ...styles.smallDeliveryCard, backgroundColor: typeInfo.bg }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <typeInfo.icon size={14} style={{ color: typeInfo.color }} />
                              <span style={{ fontSize: '10px', fontWeight: '600', color: typeInfo.color }}>
                                {typeInfo.label.split(' ')[0]}
                              </span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                              {delivery.quantity}
                            </span>
                          </div>
                          {delivery.timeSlot && (
                            <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={10} />
                              {delivery.timeSlot}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Badge */}
                <div style={styles.statusSection}>
                  <p style={styles.statusLabel}>Status</p>
                  {(() => {
                    const statusColor = getStatusColor(selectedDateData.status);
                    const StatusIcon = statusColor.icon;
                    return (
                      <div
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                        }}
                      >
                        <StatusIcon size={14} />
                        <span style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '11px' }}>
                          {selectedDateData.status}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Quick Action Button */}
                <Link
                  href={`/caterer/calendar/${selectedDateData.date}`}
                  style={{ ...styles.actionButton, display: 'block', textAlign: 'center', textDecoration: 'none', color: '#ffffff', marginTop: '12px' }}
                >
                  View Day Insights
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  } as const,
  maxWidth: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as const,
  header: {
    marginBottom: '32px',
  } as const,
  title: {
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  } as const,
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  } as const,
  contentGrid: {
    display: 'grid',
    transition: 'grid-template-columns 0.3s ease',
  } as const,
  desktopDetailsContainer: {
    width: '100%',
  } as const,
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  } as const,
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '12px',
  } as const,
  navButton: {
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
    flexShrink: 0,
  } as const,
  monthTitle: {
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    textAlign: 'center' as const,
    flex: 1,
  } as const,
  weekDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  } as const,
  weekDayLabel: {
    textAlign: 'center' as const,
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    padding: '8px',
  } as const,
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
  } as const,
  emptyCell: {
    aspectRatio: '1',
  } as const,
  dayCell: {
    aspectRatio: '1 / 1.1',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative' as const,
  } as const,
  dayCellSelected: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  } as const,
  dayNumber: {
    fontWeight: '700',
    color: '#111827',
  } as const,
  dayMetrics: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    color: '#6b7280',
  } as const,
  metric: {
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
  } as const,
  metricCritical: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  } as const,
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
  } as const,
  listContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as const,
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    borderLeft: '4px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as const,
  listItemSelected: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  } as const,
  listItemDate: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50px',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  } as const,
  listItemDay: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  } as const,
  listItemMonth: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: '500',
  } as const,
  listItemMetrics: {
    display: 'flex',
    gap: '16px',
    flex: 1,
  } as const,
  listMetricItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  } as const,
  listMetricLabel: {
    fontSize: '10px',
    color: '#6b7280',
    fontWeight: '500',
  } as const,
  listMetricValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
  } as const,
  listItemRight: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '6px',
  } as const,
  listRevenue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#16a34a',
  } as const,
  listStatus: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  } as const,
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    height: 'fit-content',
  } as const,
  detailsHeader: {
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } as const,
  detailsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  } as const,
  viewDetailsLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
  } as const,
  detailsContent: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as const,
  compactMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    marginBottom: '14px',
  } as const,
  compactMetricCard: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  } as const,
  compactMetricIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as const,
  compactMetricLabel: {
    fontSize: '10px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  } as const,
  compactMetricValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: '2px 0 0 0',
  } as const,
  compactRevenueCard: {
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #dcfce7',
    marginBottom: '12px',
  } as const,
  revenueLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '600',
  } as const,
  revenueValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#16a34a',
    margin: '6px 0 0 0',
  } as const,
  deliveriesSection: {
    marginTop: '16px',
  } as const,
  deliveriesSectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 12px 0',
  } as const,
  deliveriesSummarySection: {
    marginBottom: '12px',
  } as const,
  deliveriesSectionLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: '0 0 10px 0',
    fontWeight: '600',
  } as const,
  deliveriesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
  } as const,
  deliveryTypesSummary: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
  } as const,
  deliveryTypeCard: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid transparent',
  } as const,
  desktopDeliveryCard: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid transparent',
  } as const,
  smallDeliveryCard: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid transparent',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as const,
  desktopMetricItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as const,
  statusSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '12px',
  } as const,
  statusLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '600',
  } as const,
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '11px',
  } as const,
  actionButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  } as const,
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  } as const,
  metricCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  } as const,
  metricIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as const,
  metricLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  } as const,
  metricValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '4px 0 0 0',
  } as const,
};