'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';

interface DayData {
  date: string;
  dayOfWeek: string;
  meals: number;
  orders: number;
  subscriptions: number;
  cancelled: number;
  revenue: number;
  status: 'normal' | 'busy' | 'quiet' | 'critical';
}

// Mock data for the entire month
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
  },
  '2026-03-04': {
    date: '2026-03-04',
    dayOfWeek: 'Wednesday',
    meals: 35,
    orders: 8,
    subscriptions: 27,
    cancelled: 2,
    revenue: 5600,
    status: 'quiet',
  },
  '2026-03-05': {
    date: '2026-03-05',
    dayOfWeek: 'Thursday',
    meals: 48,
    orders: 12,
    subscriptions: 36,
    cancelled: 1,
    revenue: 7200,
    status: 'busy',
  },
  '2026-03-06': {
    date: '2026-03-06',
    dayOfWeek: 'Friday',
    meals: 64,
    orders: 18,
    subscriptions: 46,
    cancelled: 0,
    revenue: 9800,
    status: 'busy',
  },
  '2026-03-07': {
    date: '2026-03-07',
    dayOfWeek: 'Saturday',
    meals: 12,
    orders: 2,
    subscriptions: 10,
    cancelled: 0,
    revenue: 1800,
    status: 'quiet',
  },
  '2026-03-08': {
    date: '2026-03-08',
    dayOfWeek: 'Sunday',
    meals: 24,
    orders: 4,
    subscriptions: 20,
    cancelled: 2,
    revenue: 3200,
    status: 'quiet',
  },
  '2026-03-09': {
    date: '2026-03-09',
    dayOfWeek: 'Monday',
    meals: 52,
    orders: 14,
    subscriptions: 38,
    cancelled: 0,
    revenue: 8200,
    status: 'busy',
  },
  '2026-03-10': {
    date: '2026-03-10',
    dayOfWeek: 'Tuesday',
    meals: 45,
    orders: 11,
    subscriptions: 34,
    cancelled: 1,
    revenue: 7000,
    status: 'normal',
  },
  '2026-03-11': {
    date: '2026-03-11',
    dayOfWeek: 'Wednesday',
    meals: 38,
    orders: 9,
    subscriptions: 29,
    cancelled: 0,
    revenue: 6200,
    status: 'normal',
  },
  '2026-03-12': {
    date: '2026-03-12',
    dayOfWeek: 'Thursday',
    meals: 51,
    orders: 13,
    subscriptions: 38,
    cancelled: 3,
    revenue: 7600,
    status: 'busy',
  },
  '2026-03-13': {
    date: '2026-03-13',
    dayOfWeek: 'Friday',
    meals: 68,
    orders: 19,
    subscriptions: 49,
    cancelled: 1,
    revenue: 10200,
    status: 'busy',
  },
  '2026-03-14': {
    date: '2026-03-14',
    dayOfWeek: 'Saturday',
    meals: 15,
    orders: 3,
    subscriptions: 12,
    cancelled: 1,
    revenue: 2100,
    status: 'quiet',
  },
  '2026-03-15': {
    date: '2026-03-15',
    dayOfWeek: 'Sunday',
    meals: 20,
    orders: 3,
    subscriptions: 17,
    cancelled: 0,
    revenue: 2800,
    status: 'quiet',
  },
  '2026-03-16': {
    date: '2026-03-16',
    dayOfWeek: 'Monday',
    meals: 55,
    orders: 16,
    subscriptions: 39,
    cancelled: 2,
    revenue: 8600,
    status: 'busy',
  },
  '2026-03-17': {
    date: '2026-03-17',
    dayOfWeek: 'Tuesday',
    meals: 42,
    orders: 10,
    subscriptions: 32,
    cancelled: 0,
    revenue: 6800,
    status: 'normal',
  },
  '2026-03-18': {
    date: '2026-03-18',
    dayOfWeek: 'Wednesday',
    meals: 32,
    orders: 7,
    subscriptions: 25,
    cancelled: 4,
    revenue: 5000,
    status: 'critical',
  },
  '2026-03-19': {
    date: '2026-03-19',
    dayOfWeek: 'Thursday',
    meals: 49,
    orders: 12,
    subscriptions: 37,
    cancelled: 1,
    revenue: 7400,
    status: 'busy',
  },
  '2026-03-20': {
    date: '2026-03-20',
    dayOfWeek: 'Friday',
    meals: 62,
    orders: 17,
    subscriptions: 45,
    cancelled: 0,
    revenue: 9400,
    status: 'busy',
  },
  '2026-03-21': {
    date: '2026-03-21',
    dayOfWeek: 'Saturday',
    meals: 18,
    orders: 5,
    subscriptions: 13,
    cancelled: 2,
    revenue: 2600,
    status: 'quiet',
  },
  '2026-03-22': {
    date: '2026-03-22',
    dayOfWeek: 'Sunday',
    meals: 22,
    orders: 4,
    subscriptions: 18,
    cancelled: 1,
    revenue: 3000,
    status: 'quiet',
  },
  '2026-03-23': {
    date: '2026-03-23',
    dayOfWeek: 'Monday',
    meals: 54,
    orders: 15,
    subscriptions: 39,
    cancelled: 0,
    revenue: 8400,
    status: 'busy',
  },
  '2026-03-24': {
    date: '2026-03-24',
    dayOfWeek: 'Tuesday',
    meals: 40,
    orders: 9,
    subscriptions: 31,
    cancelled: 2,
    revenue: 6500,
    status: 'normal',
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
  },
  '2026-03-26': {
    date: '2026-03-26',
    dayOfWeek: 'Thursday',
    meals: 50,
    orders: 13,
    subscriptions: 37,
    cancelled: 1,
    revenue: 7500,
    status: 'busy',
  },
  '2026-03-27': {
    date: '2026-03-27',
    dayOfWeek: 'Friday',
    meals: 65,
    orders: 18,
    subscriptions: 47,
    cancelled: 0,
    revenue: 9700,
    status: 'busy',
  },
  '2026-03-28': {
    date: '2026-03-28',
    dayOfWeek: 'Saturday',
    meals: 14,
    orders: 2,
    subscriptions: 12,
    cancelled: 1,
    revenue: 1900,
    status: 'quiet',
  },
  '2026-03-29': {
    date: '2026-03-29',
    dayOfWeek: 'Sunday',
    meals: 25,
    orders: 5,
    subscriptions: 20,
    cancelled: 0,
    revenue: 3200,
    status: 'quiet',
  },
  '2026-03-30': {
    date: '2026-03-30',
    dayOfWeek: 'Monday',
    meals: 53,
    orders: 14,
    subscriptions: 39,
    cancelled: 1,
    revenue: 8300,
    status: 'busy',
  },
  '2026-03-31': {
    date: '2026-03-31',
    dayOfWeek: 'Tuesday',
    meals: 44,
    orders: 11,
    subscriptions: 33,
    cancelled: 2,
    revenue: 7000,
    status: 'normal',
  },
};

export default function CatererCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-03-25');

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
        return { bg: '#dcfce7', border: '#86efac', icon: TrendingUp, color: '#166534' };
      case 'normal':
        return { bg: '#dbeafe', border: '#7dd3fc', icon: CheckCircle, color: '#0c4a6e' };
      case 'quiet':
        return { bg: '#f3e8ff', border: '#e9d5ff', icon: Clock, color: '#6b21a8' };
      case 'critical':
        return { bg: '#fee2e2', border: '#fecaca', icon: AlertCircle, color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', border: '#e5e7eb', icon: CalendarIcon, color: '#374151' };
    }
  };

  const selectedDateData = selectedDate ? MOCK_CALENDAR_DATA[selectedDate] : null;

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Catering Calendar</h1>
            <p style={styles.subtitle}>
              View your daily meal orders, subscriptions, and cancellations
            </p>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Calendar Section */}
          <div style={styles.calendarCard}>
            {/* Month Navigation */}
            <div style={styles.monthHeader}>
              <button
                onClick={handlePrevMonth}
                style={styles.navButton}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 style={styles.monthTitle}>{monthYear}</h2>
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
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={styles.calendarGrid}>
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
                        ...(isSelected ? styles.dayCellSelected : {}),
                        ...(statusColor ? {
                          borderColor: statusColor.border,
                          backgroundColor: isSelected ? statusColor.bg : '#ffffff',
                        } : {}),
                      }}
                    >
                      <div style={styles.dayNumber}>{day}</div>

                      {dayData && (
                        <>
                          <div style={styles.dayMetrics}>
                            <span style={styles.metric} title="Meals">
                              🍱 {dayData.meals}
                            </span>
                            <span style={styles.metric} title="Orders">
                              🧾 {dayData.orders}
                            </span>
                          </div>

                          <div style={styles.dayMetrics}>
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

          {/* Day Details Sidebar */}
          {selectedDateData && (
            <div style={styles.detailsCard}>
              <div style={styles.detailsHeader}>
                <h3 style={styles.detailsTitle}>
                  {new Date(selectedDateData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <Link
                  href={`/caterer/calendar/${selectedDateData.date}`}
                  style={styles.viewDetailsLink}
                >
                  View Full Details →
                </Link>
              </div>

              <div style={styles.detailsContent}>
                {/* Metrics Grid */}
                <div style={styles.metricsGrid}>
                  <div style={styles.metricCard}>
                    <div style={styles.metricIcon} style={{ backgroundColor: '#eff6ff' }}>
                      <Package size={24} style={{ color: '#0284c7' }} />
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Total Meals</p>
                      <h4 style={styles.metricValue}>{selectedDateData.meals}</h4>
                    </div>
                  </div>

                  <div style={styles.metricCard}>
                    <div style={styles.metricIcon} style={{ backgroundColor: '#f0fdf4' }}>
                      <ShoppingCart size={24} style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Orders</p>
                      <h4 style={styles.metricValue}>{selectedDateData.orders}</h4>
                    </div>
                  </div>

                  <div style={styles.metricCard}>
                    <div style={styles.metricIcon} style={{ backgroundColor: '#fdf2f8' }}>
                      <RotateCcw size={24} style={{ color: '#ec4899' }} />
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Subscriptions</p>
                      <h4 style={styles.metricValue}>{selectedDateData.subscriptions}</h4>
                    </div>
                  </div>

                  <div style={styles.metricCard}>
                    <div style={styles.metricIcon} style={{ backgroundColor: '#fee2e2' }}>
                      <X size={24} style={{ color: '#991b1b' }} />
                    </div>
                    <div>
                      <p style={styles.metricLabel}>Cancelled</p>
                      <h4 style={{
                        ...styles.metricValue,
                        color: selectedDateData.cancelled > 0 ? '#991b1b' : '#16a34a',
                      }}>
                        {selectedDateData.cancelled}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div style={styles.revenueCard}>
                  <p style={styles.revenueLabel}>Daily Revenue</p>
                  <h2 style={styles.revenueValue}>₹{selectedDateData.revenue.toLocaleString()}</h2>
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
                        <StatusIcon size={18} />
                        <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>
                          {selectedDateData.status}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Quick Action */}
                <button style={styles.actionButton}>
                  View Day Insights
                </button>
              </div>
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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
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
  },
  monthTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  weekDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  weekDayLabel: {
    textAlign: 'center' as const,
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    padding: '8px',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
  },
  emptyCell: {
    aspectRatio: '1',
  },
  dayCell: {
    aspectRatio: '1',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative' as const,
    minHeight: '140px',
  },
  dayCellSelected: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
  dayNumber: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  dayMetrics: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    fontSize: '11px',
    color: '#6b7280',
  },
  metric: {
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
  },
  metricCritical: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky' as const,
    top: '24px',
  },
  detailsHeader: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  detailsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 12px 0',
  },
  viewDetailsLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  detailsContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  metricCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  metricIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '4px 0 0 0',
  },
  revenueCard: {
    padding: '16px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #dcfce7',
  },
  revenueLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '600',
  },
  revenueValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#16a34a',
    margin: '8px 0 0 0',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  statusLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '600',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
  },
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
  },
};