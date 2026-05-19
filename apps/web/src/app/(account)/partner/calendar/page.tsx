'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import {
  usePartnerBookingCalendar,
  type PartnerBookingCalendarItem,
} from '@catering-marketplace/query-client';

const statusTone: Record<string, { bg: string; color: string; border: string }> = {
  confirmed: { bg: '#ecfdf5', color: '#047857', border: '#bbf7d0' },
  in_progress: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  pending_payment: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  completed: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  expired: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

export default function PartnerCalendarPage() {
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(new Date())
  );
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const calendarRange = useMemo(
    () => getCalendarRange(visibleMonth),
    [visibleMonth]
  );
  const query = usePartnerBookingCalendar({
    from: calendarRange.from,
    to: calendarRange.to,
  });
  const items = query.data?.items ?? [];
  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const itemsByDate = useMemo(() => groupCalendarItems(items), [items]);
  const selectedItems = itemsByDate.get(selectedDate) ?? [];

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Partner workspace</p>
          <h1 style={styles.title}>Booking calendar</h1>
          <p style={styles.description}>
            Confirmed partner bookings by event date, with payment and balance
            context from the booking calendar endpoint.
          </p>
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.calendarHeader}>
          <div>
            <h2 style={styles.panelTitle}>{formatMonth(visibleMonth)}</h2>
            <p style={styles.panelHint}>
              Showing {formatDate(calendarRange.from)} to{' '}
              {formatDate(calendarRange.to)}
            </p>
          </div>
          <div style={styles.controls}>
            <button
              type="button"
              onClick={() =>
                setVisibleMonth((current) => addMonths(current, -1))
              }
              style={styles.button}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setVisibleMonth(startOfMonth(today));
                setSelectedDate(toDateKey(today));
              }}
              style={styles.button}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() =>
                setVisibleMonth((current) => addMonths(current, 1))
              }
              style={styles.button}
            >
              Next
            </button>
          </div>
        </div>

        {query.isLoading ? (
          <div style={styles.emptyState}>Loading calendar...</div>
        ) : query.isError ? (
          <div style={styles.emptyState}>
            Unable to load the booking calendar right now.
          </div>
        ) : (
          <div style={styles.layout}>
            <div style={styles.calendarScroll}>
              <div style={styles.calendarSurface}>
                <div style={styles.weekHeader}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}
                </div>
                <div style={styles.calendarGrid}>
                  {days.map((day) => {
                    const key = toDateKey(day);
                    const dayItems = itemsByDate.get(key) ?? [];
                    const inMonth = day.getMonth() === visibleMonth.getMonth();
                    const isSelected = selectedDate === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDate(key)}
                        style={{
                          ...styles.dayCell,
                          ...(inMonth ? {} : styles.dayCellMuted),
                          ...(isSelected ? styles.dayCellSelected : {}),
                        }}
                      >
                        <span style={styles.dayNumber}>{day.getDate()}</span>
                        <span style={styles.dayTotal}>
                          {dayItems.length
                            ? `${dayItems.length} booking${dayItems.length === 1 ? '' : 's'}`
                            : ''}
                        </span>
                        <div style={styles.dayBookings}>
                          {dayItems.slice(0, 3).map((item) => (
                            <CalendarChip key={item.id} item={item} />
                          ))}
                          {dayItems.length > 3 && (
                            <span style={styles.moreText}>
                              +{dayItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside style={styles.sidePanel}>
              <h3 style={styles.sideTitle}>{formatDate(selectedDate)}</h3>
              {selectedItems.length === 0 ? (
                <div style={styles.sideEmpty}>No bookings on this date.</div>
              ) : (
                <div style={styles.eventList}>
                  {selectedItems.map((item) => (
                    <CalendarEvent key={item.id} item={item} />
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}

        {!query.isLoading && !query.isError && items.length === 0 && (
          <div style={styles.monthEmpty}>No bookings scheduled this month.</div>
        )}
      </section>
    </div>
  );
}

function CalendarChip({ item }: { item: PartnerBookingCalendarItem }) {
  const tone = toneFor(item.status);
  return (
    <span
      title={`${item.bookingNumber} - ${item.title}`}
      style={{ ...styles.chip, background: tone.bg, color: tone.color }}
    >
      {item.title}
    </span>
  );
}

function CalendarEvent({ item }: { item: PartnerBookingCalendarItem }) {
  const tone = toneFor(item.status);
  return (
    <article style={styles.eventCard}>
      <div style={styles.eventTop}>
        <strong style={styles.eventTitle}>{item.title}</strong>
        <span style={{ ...styles.badge, ...badgeStyle(tone) }}>
          {labelize(item.status)}
        </span>
      </div>
      <p style={styles.eventMeta}>
        {item.bookingNumber} · {formatTimeRange(item.startTime, item.endTime)}
      </p>
      <div style={styles.eventGrid}>
        <Info label="Guests" value={`${item.guestCount}`} />
        <Info label="Payment" value={labelize(item.paymentStatus)} />
        <Info label="Total" value={formatCurrency(item.totalAmount, item.currency)} />
        <Info label="Balance" value={formatCurrency(item.balanceAmount, item.currency)} />
      </div>
      <p style={styles.eventLocation}>{item.location || 'Location pending'}</p>
      {(item.customerName || item.customerPhone) && (
        <p style={styles.eventMeta}>
          {[item.customerName, item.customerPhone].filter(Boolean).join(' · ')}
        </p>
      )}
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.info}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function getCalendarRange(month: Date) {
  const days = getCalendarDays(month);
  return { from: toDateKey(days[0]), to: toDateKey(days[days.length - 1]) };
}

function getCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function groupCalendarItems(items: PartnerBookingCalendarItem[]) {
  const grouped = new Map<string, PartnerBookingCalendarItem[]>();
  items.forEach((item) => {
    const dayItems = grouped.get(item.eventDate) ?? [];
    dayItems.push(item);
    grouped.set(item.eventDate, dayItems);
  });
  grouped.forEach((dayItems) => {
    dayItems.sort((first, second) =>
      (first.startTime || '').localeCompare(second.startTime || '')
    );
  });
  return grouped;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTimeRange(startTime?: string, endTime?: string) {
  if (!startTime && !endTime) return 'Time pending';
  if (!endTime) return formatTime(startTime);
  return `${formatTime(startTime)}-${formatTime(endTime)}`;
}

function formatTime(value?: string) {
  if (!value) return '';
  const [hourText, minuteText = '00'] = value.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function labelize(value?: string) {
  if (!value) return 'Pending';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function toneFor(status?: string) {
  return statusTone[status || ''] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
}

function badgeStyle(tone: { bg: string; color: string; border: string }) {
  return {
    background: tone.bg,
    color: tone.color,
    borderColor: tone.border,
  };
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: {
    padding: 24,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)',
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#ef4d2f',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  title: { margin: 0, color: '#111827', fontSize: 28, fontWeight: 800 },
  description: {
    maxWidth: 760,
    margin: '10px 0 0',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.6,
  },
  panel: {
    padding: 22,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  panelTitle: { margin: 0, color: '#111827', fontSize: 20, fontWeight: 850 },
  panelHint: { margin: '6px 0 0', color: '#64748b', fontSize: 13 },
  controls: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  button: {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
    gap: 16,
    alignItems: 'start',
  },
  calendarScroll: { overflowX: 'auto', paddingBottom: 2 },
  calendarSurface: { minWidth: 760 },
  weekHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: 1,
    marginBottom: 1,
    color: '#64748b',
    fontSize: 12,
    fontWeight: 850,
    textAlign: 'center',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: 1,
    overflow: 'hidden',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#e5e7eb',
  },
  dayCell: {
    minHeight: 132,
    padding: 8,
    background: '#ffffff',
    border: '2px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 6,
    textAlign: 'left',
    cursor: 'pointer',
  },
  dayCellMuted: { background: '#f8fafc', color: '#94a3b8' },
  dayCellSelected: { borderColor: '#ef4d2f' },
  dayNumber: { color: '#334155', fontSize: 12, fontWeight: 850 },
  dayTotal: { minHeight: 14, color: '#64748b', fontSize: 11, fontWeight: 750 },
  dayBookings: { display: 'grid', gap: 5, minWidth: 0 },
  chip: {
    display: 'block',
    minHeight: 22,
    padding: '4px 6px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 800,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  moreText: { color: '#475569', fontSize: 11, fontWeight: 800 },
  sidePanel: {
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#f8fafc',
    padding: 14,
  },
  sideTitle: { margin: '0 0 12px', color: '#111827', fontSize: 16, fontWeight: 850 },
  sideEmpty: {
    padding: 14,
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
    color: '#64748b',
    background: '#ffffff',
    fontSize: 13,
    fontWeight: 750,
  },
  eventList: { display: 'grid', gap: 12 },
  eventCard: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
  },
  eventTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start',
  },
  eventTitle: { color: '#111827', fontSize: 14, fontWeight: 850 },
  eventMeta: { margin: '6px 0 0', color: '#64748b', fontSize: 12, lineHeight: 1.45 },
  eventLocation: { margin: '8px 0 0', color: '#334155', fontSize: 13, fontWeight: 750 },
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 8,
    marginTop: 10,
  },
  info: {
    display: 'grid',
    gap: 3,
    padding: 8,
    borderRadius: 6,
    background: '#f8fafc',
    color: '#64748b',
    fontSize: 11,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 24,
    padding: '0 8px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  emptyState: {
    minHeight: 220,
    display: 'grid',
    placeItems: 'center',
    color: '#64748b',
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
    background: '#f8fafc',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
  },
  monthEmpty: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
    background: '#f8fafc',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 750,
    textAlign: 'center',
  },
};
