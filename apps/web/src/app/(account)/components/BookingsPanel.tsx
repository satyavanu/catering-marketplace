'use client';

import type React from 'react';
import {
  useCustomerBookings,
  usePartnerBookings,
  type BookingDetail,
} from '@catering-marketplace/query-client';

type BookingsPanelProps = {
  role: 'customer' | 'partner';
};

const statusTone: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  draft: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  pending_payment: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  confirmed: { bg: '#ecfdf5', color: '#047857', border: '#bbf7d0' },
  completed: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  failed: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  paid: { bg: '#ecfdf5', color: '#047857', border: '#bbf7d0' },
};

export default function BookingsPanel({ role }: BookingsPanelProps) {
  const customerQuery = useCustomerBookings(role === 'customer');
  const partnerQuery = usePartnerBookings(role === 'partner');
  const query = role === 'customer' ? customerQuery : partnerQuery;
  const bookings = query.data ?? [];

  const stats = buildStats(bookings);

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            {role === 'partner' ? 'Partner workspace' : 'Customer workspace'}
          </p>
          <h1 style={styles.title}>
            {role === 'partner' ? 'Bookings' : 'My bookings'}
          </h1>
          <p style={styles.description}>
            {role === 'partner'
              ? 'Track confirmed events, payment status, and payout readiness from one place.'
              : 'Review your event bookings, payment status, and confirmation details.'}
          </p>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <Stat label="Upcoming" value={stats.upcoming} />
        <Stat label="Pending payment" value={stats.pendingPayment} />
        <Stat label="Confirmed" value={stats.confirmed} />
        <Stat label="Completed" value={stats.completed} />
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>Booking timeline</h2>
            <p style={styles.panelHint}>
              Bookings are linked to their latest order and payment records.
            </p>
          </div>
        </div>

        {query.isLoading ? (
          <div style={styles.emptyState}>Loading bookings...</div>
        ) : query.isError ? (
          <div style={styles.emptyState}>
            Unable to load bookings right now.
          </div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyState}>No bookings yet.</div>
        ) : (
          <div style={styles.list}>
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} role={role} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BookingCard({
  booking,
  role,
}: {
  booking: BookingDetail;
  role: 'customer' | 'partner';
}) {
  const bookingTone = toneFor(booking.status);
  const paymentTone = toneFor(booking.paymentStatus);
  const orderStatus = booking.order?.status || 'Not created';
  const paymentStatus = booking.payment?.status || booking.paymentStatus;

  return (
    <article style={styles.card}>
      <div style={styles.cardTop}>
        <div>
          <div style={styles.bookingNumber}>{booking.bookingNumber}</div>
          <div style={styles.serviceLine}>
            {labelize(booking.serviceType)} • {booking.guestCount} guests •{' '}
            {formatDate(booking.eventDate)}
          </div>
        </div>
        <span
          style={{
            ...styles.badge,
            background: bookingTone.bg,
            color: bookingTone.color,
            borderColor: bookingTone.border,
          }}
        >
          {labelize(booking.status)}
        </span>
      </div>

      <div style={styles.metaGrid}>
        <Info
          label="Total"
          value={formatCurrency(booking.totalAmount, booking.currency)}
        />
        <Info
          label="Payment"
          value={labelize(paymentStatus)}
          tone={paymentTone}
        />
        <Info label="Order" value={booking.order?.orderNumber || orderStatus} />
        <Info
          label={role === 'partner' ? 'Payout' : 'Booking type'}
          value={
            role === 'partner'
              ? labelize(booking.payoutStatus)
              : labelize(booking.bookingType)
          }
        />
      </div>

      <div style={styles.detailGrid}>
        <div style={styles.detailBlock}>
          <span style={styles.detailLabel}>Customer</span>
          <strong style={styles.detailValue}>
            {booking.customerName || 'Customer details pending'}
          </strong>
          <span style={styles.detailSub}>
            {booking.customerPhone ||
              booking.customerEmail ||
              'Contact will appear after checkout'}
          </span>
        </div>
        <div style={styles.detailBlock}>
          <span style={styles.detailLabel}>Location</span>
          <strong style={styles.detailValue}>
            {booking.cityName || booking.postalCode || 'Location pending'}
          </strong>
          <span style={styles.detailSub}>
            {booking.addressLine1 || 'Address details not added yet'}
          </span>
        </div>
        <div style={styles.detailBlock}>
          <span style={styles.detailLabel}>Gateway</span>
          <strong style={styles.detailValue}>
            {booking.payment?.razorpayPaymentId ||
              booking.order?.razorpayOrderId ||
              'Awaiting payment'}
          </strong>
          <span style={styles.detailSub}>
            {booking.payment?.method
              ? labelize(booking.payment.method)
              : 'Razorpay order/payment link'}
          </span>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </article>
  );
}

function Info({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: { bg: string; color: string; border: string };
}) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      {tone ? (
        <span
          style={{
            ...styles.smallBadge,
            background: tone.bg,
            color: tone.color,
            borderColor: tone.border,
          }}
        >
          {value}
        </span>
      ) : (
        <strong style={styles.infoValue}>{value}</strong>
      )}
    </div>
  );
}

function buildStats(bookings: BookingDetail[]) {
  return {
    upcoming: bookings.filter(
      (booking) =>
        !['completed', 'cancelled', 'refunded'].includes(booking.status)
    ).length,
    pendingPayment: bookings.filter(
      (booking) =>
        booking.paymentStatus === 'payment_initiated' ||
        booking.paymentStatus === 'unpaid'
    ).length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed')
      .length,
    completed: bookings.filter((booking) => booking.status === 'completed')
      .length,
  };
}

function toneFor(status: string) {
  return (
    statusTone[status] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
  );
}

function labelize(value?: string) {
  if (!value) return 'Pending';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
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
    maxWidth: 720,
    margin: '10px 0 0',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.6,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 12,
  },
  statCard: {
    padding: 18,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  statLabel: {
    display: 'block',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },
  statValue: { color: '#111827', fontSize: 26, fontWeight: 850 },
  panel: {
    padding: 22,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  panelTitle: { margin: 0, color: '#111827', fontSize: 18, fontWeight: 800 },
  panelHint: { margin: '6px 0 0', color: '#64748b', fontSize: 13 },
  list: { display: 'grid', gap: 14 },
  card: {
    padding: 18,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  bookingNumber: { color: '#111827', fontSize: 17, fontWeight: 850 },
  serviceLine: {
    marginTop: 5,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.5,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 28,
    padding: '0 10px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  smallBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    minHeight: 24,
    padding: '0 8px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
    padding: 14,
    borderRadius: 8,
    background: '#f8fafc',
    border: '1px solid #eef2f7',
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 6 },
  infoLabel: { color: '#64748b', fontSize: 12, fontWeight: 750 },
  infoValue: { color: '#111827', fontSize: 14, fontWeight: 800 },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 12,
    marginTop: 14,
  },
  detailBlock: { padding: 12, borderRadius: 8, border: '1px solid #eef2f7' },
  detailLabel: {
    display: 'block',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 750,
    marginBottom: 6,
  },
  detailValue: {
    display: 'block',
    color: '#111827',
    fontSize: 13,
    fontWeight: 800,
    overflowWrap: 'anywhere',
  },
  detailSub: {
    display: 'block',
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 1.45,
    overflowWrap: 'anywhere',
  },
  emptyState: {
    minHeight: 180,
    display: 'grid',
    placeItems: 'center',
    color: '#64748b',
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
    background: '#f8fafc',
    fontSize: 14,
    fontWeight: 700,
  },
};
