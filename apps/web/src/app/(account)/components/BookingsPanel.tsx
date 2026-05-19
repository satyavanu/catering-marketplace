'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import {
  useCancelPartnerBooking,
  useCustomerBooking,
  useCustomerBookings,
  usePartnerBooking,
  usePartnerBookings,
  type BookingDetail,
  type BookingOrderSummary,
  type BookingPaymentSummary,
} from '@catering-marketplace/query-client';

type BookingsPanelProps = {
  role: 'customer' | 'partner';
};

type FilterKey = 'all' | 'upcoming' | 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';

const statusTone: Record<string, { bg: string; color: string; border: string }> = {
  draft: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  pending_payment: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  payment_initiated: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  unpaid: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  confirmed: { bg: '#ecfdf5', color: '#047857', border: '#bbf7d0' },
  in_progress: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  completed: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  rejected: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  expired: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  refunded: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  failed: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  paid: { bg: '#ecfdf5', color: '#047857', border: '#bbf7d0' },
  partially_paid: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
};

export default function BookingsPanel({ role }: BookingsPanelProps) {
  const customerQuery = useCustomerBookings(role === 'customer');
  const partnerQuery = usePartnerBookings(role === 'partner');
  const query = role === 'customer' ? customerQuery : partnerQuery;
  const bookings = query.data ?? [];

  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [cancelBookingId, setCancelBookingId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  const customerDetailQuery = useCustomerBooking(
    role === 'customer' ? selectedBookingId : ''
  );
  const partnerDetailQuery = usePartnerBooking(
    role === 'partner' ? selectedBookingId : ''
  );
  const detailQuery =
    role === 'customer' ? customerDetailQuery : partnerDetailQuery;
  const cancelMutation = useCancelPartnerBooking({
    onSuccess: () => {
      setCancelBookingId('');
      setCancelReason('');
      setCancelError('');
      setSelectedBookingId('');
    },
    onError: (error) => setCancelError(error.message),
  });

  const stats = buildStats(bookings);
  const filteredBookings = useMemo(
    () => filterBookings(bookings, filter, search),
    [bookings, filter, search]
  );
  const selectedBooking =
    detailQuery.data || bookings.find((booking) => booking.id === selectedBookingId);
  const bookingToCancel = bookings.find((booking) => booking.id === cancelBookingId);

  const submitCancel = () => {
    const reason = cancelReason.trim();
    if (!cancelBookingId || !reason) {
      setCancelError('Cancellation reason is required.');
      return;
    }

    cancelMutation.mutate({ bookingId: cancelBookingId, reason });
  };

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
              ? 'Review bookings, payment state, order history, and cancellation requests.'
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
              List data comes from the partner bookings endpoint.
            </p>
          </div>
        </div>

        <div style={styles.toolbar}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search booking, customer, phone, city"
            style={styles.searchInput}
          />
          <div style={styles.filterRow}>
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                style={{
                  ...styles.filterButton,
                  ...(filter === item.key ? styles.filterButtonActive : {}),
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {query.isLoading ? (
          <div style={styles.emptyState}>Loading bookings...</div>
        ) : query.isError ? (
          <div style={styles.emptyState}>Unable to load bookings right now.</div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyState}>No bookings yet.</div>
        ) : filteredBookings.length === 0 ? (
          <div style={styles.emptyState}>No bookings match these filters.</div>
        ) : (
          <div style={styles.list}>
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role={role}
                onView={() => setSelectedBookingId(booking.id)}
                onCancel={
                  role === 'partner' && canCancelBooking(booking)
                    ? () => {
                        setCancelBookingId(booking.id);
                        setCancelReason('');
                        setCancelError('');
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>

      {selectedBookingId && (
        <BookingDetailModal
          booking={selectedBooking}
          isLoading={detailQuery.isLoading}
          isError={detailQuery.isError}
          role={role}
          onClose={() => setSelectedBookingId('')}
          onCancel={
            selectedBooking && role === 'partner' && canCancelBooking(selectedBooking)
              ? () => {
                  setCancelBookingId(selectedBooking.id);
                  setCancelReason('');
                  setCancelError('');
                }
              : undefined
          }
        />
      )}

      {bookingToCancel && (
        <CancelBookingModal
          booking={bookingToCancel}
          reason={cancelReason}
          error={cancelError}
          isSubmitting={cancelMutation.isPending}
          onReasonChange={(value) => {
            setCancelReason(value);
            setCancelError('');
          }}
          onClose={() => {
            setCancelBookingId('');
            setCancelReason('');
            setCancelError('');
          }}
          onSubmit={submitCancel}
        />
      )}
    </div>
  );
}

function BookingCard({
  booking,
  role,
  onView,
  onCancel,
}: {
  booking: BookingDetail;
  role: 'customer' | 'partner';
  onView: () => void;
  onCancel?: () => void;
}) {
  const bookingTone = toneFor(booking.status);
  const paymentTone = toneFor(booking.paymentStatus);
  const paymentStatus = booking.payment?.status || booking.paymentStatus;

  return (
    <article style={styles.card}>
      <div style={styles.cardTop}>
        <div>
          <div style={styles.bookingNumber}>{booking.bookingNumber}</div>
          <div style={styles.serviceLine}>
            {labelize(booking.serviceType)} · {booking.guestCount} guests ·{' '}
            {formatDate(booking.eventDate)}
          </div>
        </div>
        <span style={{ ...styles.badge, ...badgeStyle(bookingTone) }}>
          {labelize(booking.status)}
        </span>
      </div>

      <div style={styles.metaGrid}>
        <Info label="Total" value={formatCurrency(booking.totalAmount, booking.currency)} />
        <Info label="Payment" value={labelize(paymentStatus)} tone={paymentTone} />
        <Info label="Balance" value={formatCurrency(booking.balanceAmount || 0, booking.currency)} />
        <Info
          label={role === 'partner' ? 'Payout' : 'Booking type'}
          value={role === 'partner' ? labelize(booking.payoutStatus) : labelize(booking.bookingType)}
        />
      </div>

      <div style={styles.detailGrid}>
        <DetailBlock
          label="Customer"
          value={booking.customerName || 'Customer details pending'}
          sub={booking.customerPhone || booking.customerEmail || 'Contact pending'}
        />
        <DetailBlock
          label="Location"
          value={booking.cityName || booking.postalCode || 'Location pending'}
          sub={booking.addressLine1 || 'Address details not added yet'}
        />
        <DetailBlock
          label="Latest order"
          value={booking.order?.orderNumber || 'Not created'}
          sub={booking.order?.status ? labelize(booking.order.status) : 'Order pending'}
        />
      </div>

      <div style={styles.actionsRow}>
        <button type="button" onClick={onView} style={styles.secondaryButton}>
          View details
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.dangerButton}>
            Cancel booking
          </button>
        )}
      </div>
    </article>
  );
}

function BookingDetailModal({
  booking,
  isLoading,
  isError,
  role,
  onClose,
  onCancel,
}: {
  booking?: BookingDetail;
  isLoading: boolean;
  isError: boolean;
  role: 'customer' | 'partner';
  onClose: () => void;
  onCancel?: () => void;
}) {
  return (
    <div style={styles.modalOverlay}>
      <section style={styles.modal}>
        <div style={styles.modalHeader}>
          <div>
            <p style={styles.eyebrow}>Booking details</p>
            <h2 style={styles.modalTitle}>
              {booking?.bookingNumber || 'Loading booking'}
            </h2>
          </div>
          <button type="button" onClick={onClose} style={styles.iconButton}>
            Close
          </button>
        </div>

        {isLoading ? (
          <div style={styles.emptyState}>Loading booking details...</div>
        ) : isError || !booking ? (
          <div style={styles.emptyState}>Unable to load this booking.</div>
        ) : (
          <>
            <div style={styles.detailSummary}>
              <Info label="Status" value={labelize(booking.status)} tone={toneFor(booking.status)} />
              <Info label="Payment" value={labelize(booking.paymentStatus)} tone={toneFor(booking.paymentStatus)} />
              <Info label="Event date" value={formatDate(booking.eventDate)} />
              <Info label="Time" value={formatTimeRange(booking.startTime, booking.endTime)} />
              <Info label="Guests" value={`${booking.guestCount}`} />
              <Info label="Type" value={labelize(booking.bookingType)} />
            </div>

            <div style={styles.sectionGrid}>
              <DetailBlock
                label="Customer"
                value={booking.customerName || 'Customer details pending'}
                sub={[booking.customerPhone, booking.customerEmail].filter(Boolean).join(' · ') || 'Contact pending'}
              />
              <DetailBlock
                label="Address"
                value={booking.addressLine1 || 'Address details pending'}
                sub={[booking.cityName, booking.postalCode, booking.countryCode].filter(Boolean).join(' · ') || 'Location pending'}
              />
              <DetailBlock
                label="Amounts"
                value={formatCurrency(booking.totalAmount, booking.currency)}
                sub={`Paid ${formatCurrency(booking.paidAmount || 0, booking.currency)} · Balance ${formatCurrency(booking.balanceAmount || 0, booking.currency)}`}
              />
              <DetailBlock
                label={role === 'partner' ? 'Partner earning' : 'Service'}
                value={
                  role === 'partner'
                    ? formatCurrency(booking.partnerEarningAmount, booking.currency)
                    : labelize(booking.serviceType)
                }
                sub={`Payout ${labelize(booking.payoutStatus)}`}
              />
            </div>

            {booking.paymentSummary && (
              <section style={styles.subPanel}>
                <h3 style={styles.subTitle}>Payment summary</h3>
                <div style={styles.detailSummary}>
                  <Info label="Advance" value={formatCurrency(booking.paymentSummary.advanceAmount, booking.currency)} />
                  <Info label="Paid" value={formatCurrency(booking.paymentSummary.paidAmount, booking.currency)} />
                  <Info label="Balance" value={formatCurrency(booking.paymentSummary.balanceAmount, booking.currency)} />
                  <Info label="Next payment" value={booking.paymentSummary.nextPayment ? `${labelize(booking.paymentSummary.nextPayment.type)} · ${formatCurrency(booking.paymentSummary.nextPayment.amount, booking.currency)}` : 'None'} />
                </div>
              </section>
            )}

            <section style={styles.subPanel}>
              <h3 style={styles.subTitle}>Orders and payments</h3>
              {booking.orders?.length ? (
                <div style={styles.orderList}>
                  {booking.orders.map((order) => (
                    <OrderBlock key={order.id} order={order} currency={booking.currency} />
                  ))}
                </div>
              ) : (
                <div style={styles.miniEmpty}>No order records yet.</div>
              )}
            </section>

            {booking.cancellationReason && (
              <section style={styles.subPanel}>
                <h3 style={styles.subTitle}>Cancellation</h3>
                <p style={styles.bodyText}>{booking.cancellationReason}</p>
              </section>
            )}

            {onCancel && (
              <div style={styles.modalFooter}>
                <button type="button" onClick={onCancel} style={styles.dangerButton}>
                  Cancel booking
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function CancelBookingModal({
  booking,
  reason,
  error,
  isSubmitting,
  onReasonChange,
  onClose,
  onSubmit,
}: {
  booking: BookingDetail;
  reason: string;
  error: string;
  isSubmitting: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div style={styles.modalOverlay}>
      <section style={styles.smallModal}>
        <div style={styles.modalHeader}>
          <div>
            <p style={styles.eyebrow}>Cancel booking</p>
            <h2 style={styles.modalTitle}>{booking.bookingNumber}</h2>
          </div>
          <button type="button" onClick={onClose} style={styles.iconButton}>
            Close
          </button>
        </div>
        <p style={styles.bodyText}>
          Add a clear reason. The backend requires this before cancellation.
        </p>
        <textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Reason for cancellation"
          rows={5}
          style={styles.textarea}
        />
        {error && <p style={styles.errorText}>{error}</p>}
        <div style={styles.modalFooter}>
          <button type="button" onClick={onClose} style={styles.secondaryButton}>
            Keep booking
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            style={{
              ...styles.dangerButton,
              ...(isSubmitting ? styles.disabledButton : {}),
            }}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm cancellation'}
          </button>
        </div>
      </section>
    </div>
  );
}

function OrderBlock({
  order,
  currency,
}: {
  order: BookingOrderSummary;
  currency: string;
}) {
  return (
    <article style={styles.orderBlock}>
      <div style={styles.orderHeader}>
        <div>
          <strong style={styles.orderTitle}>{order.orderNumber}</strong>
          <span style={styles.detailSub}>
            {labelize(order.status)} · {formatCurrency(order.totalAmount, order.currency || currency)}
          </span>
        </div>
        <span style={{ ...styles.smallBadge, ...badgeStyle(toneFor(order.status)) }}>
          {labelize(order.paymentStage || 'order')}
        </span>
      </div>
      <div style={styles.paymentList}>
        {order.payments?.length ? (
          order.payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} fallbackCurrency={currency} />
          ))
        ) : (
          <div style={styles.miniEmpty}>No payments recorded for this order.</div>
        )}
      </div>
    </article>
  );
}

function PaymentRow({
  payment,
  fallbackCurrency,
}: {
  payment: BookingPaymentSummary;
  fallbackCurrency: string;
}) {
  return (
    <div style={styles.paymentRow}>
      <span>
        {payment.razorpayPaymentId || payment.id}
        <small style={styles.paymentMethod}>
          {payment.method ? ` · ${labelize(payment.method)}` : ''}
        </small>
      </span>
      <span style={{ ...styles.smallBadge, ...badgeStyle(toneFor(payment.status)) }}>
        {labelize(payment.status)}
      </span>
      <strong>{formatCurrency(payment.amount, payment.currency || fallbackCurrency)}</strong>
    </div>
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
        <span style={{ ...styles.smallBadge, ...badgeStyle(tone) }}>{value}</span>
      ) : (
        <strong style={styles.infoValue}>{value}</strong>
      )}
    </div>
  );
}

function DetailBlock({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div style={styles.detailBlock}>
      <span style={styles.detailLabel}>{label}</span>
      <strong style={styles.detailValue}>{value}</strong>
      <span style={styles.detailSub}>{sub}</span>
    </div>
  );
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'pending_payment', label: 'Pending payment' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

function filterBookings(bookings: BookingDetail[], filter: FilterKey, search: string) {
  const query = search.trim().toLowerCase();

  return bookings.filter((booking) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'upcoming'
        ? !['completed', 'cancelled', 'refunded', 'expired'].includes(booking.status)
        : filter === 'pending_payment'
          ? ['payment_initiated', 'unpaid', 'partially_paid'].includes(booking.paymentStatus)
          : booking.status === filter);

    if (!matchesFilter) return false;
    if (!query) return true;

    return [
      booking.bookingNumber,
      booking.customerName,
      booking.customerPhone,
      booking.customerEmail,
      booking.cityName,
      booking.serviceType,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
}

function buildStats(bookings: BookingDetail[]) {
  return {
    upcoming: bookings.filter(
      (booking) => !['completed', 'cancelled', 'refunded', 'expired'].includes(booking.status)
    ).length,
    pendingPayment: bookings.filter((booking) =>
      ['payment_initiated', 'unpaid', 'partially_paid'].includes(booking.paymentStatus)
    ).length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
  };
}

function canCancelBooking(booking: BookingDetail) {
  return !['cancelled', 'completed', 'refunded', 'expired', 'rejected'].includes(
    booking.status
  );
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

function labelize(value?: string) {
  if (!value) return 'Pending';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
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
  toolbar: {
    display: 'grid',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    minHeight: 42,
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    padding: '0 12px',
    color: '#111827',
    fontSize: 14,
    outline: 'none',
  },
  filterRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterButton: {
    minHeight: 34,
    padding: '0 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  filterButtonActive: {
    borderColor: '#ef4d2f',
    background: '#fff7ed',
    color: '#c2410c',
  },
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
  detailSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
    gap: 12,
    marginBottom: 14,
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
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
  actionsRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 },
  secondaryButton: {
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
  dangerButton: {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 8,
    border: '1px solid #fecaca',
    background: '#fef2f2',
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: 850,
    cursor: 'pointer',
  },
  disabledButton: { opacity: 0.65, cursor: 'not-allowed' },
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
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    background: 'rgba(15, 23, 42, 0.45)',
    padding: 18,
    display: 'grid',
    placeItems: 'center',
  },
  modal: {
    width: 'min(980px, 100%)',
    maxHeight: '88vh',
    overflow: 'auto',
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    padding: 20,
  },
  smallModal: {
    width: 'min(520px, 100%)',
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    padding: 20,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: { margin: 0, color: '#111827', fontSize: 20, fontWeight: 850 },
  iconButton: {
    border: '1px solid #cbd5e1',
    background: '#fff',
    borderRadius: 8,
    padding: '8px 10px',
    color: '#334155',
    fontWeight: 800,
    cursor: 'pointer',
  },
  subPanel: {
    marginTop: 14,
    padding: 14,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
  },
  subTitle: { margin: '0 0 12px', color: '#111827', fontSize: 15, fontWeight: 850 },
  orderList: { display: 'grid', gap: 12 },
  orderBlock: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #eef2f7',
    background: '#f8fafc',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  orderTitle: { display: 'block', color: '#111827', fontSize: 14, fontWeight: 850 },
  paymentList: { display: 'grid', gap: 8 },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto auto',
    gap: 10,
    alignItems: 'center',
    color: '#111827',
    fontSize: 13,
  },
  paymentMethod: { color: '#64748b' },
  miniEmpty: {
    padding: 12,
    borderRadius: 8,
    background: '#f8fafc',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
  },
  bodyText: { margin: '0 0 12px', color: '#475569', fontSize: 14, lineHeight: 1.6 },
  textarea: {
    width: '100%',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    padding: 12,
    color: '#111827',
    fontSize: 14,
    resize: 'vertical',
    outline: 'none',
  },
  errorText: { margin: '10px 0 0', color: '#b91c1c', fontSize: 13, fontWeight: 750 },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 16,
  },
};
