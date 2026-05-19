'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import {
  useMyPartner,
  usePartnerBookings,
  type BookingDetail,
} from '@catering-marketplace/query-client';

type EarningsFilter = 'all' | 'available' | 'pending' | 'paid';

export default function PartnerEarningsPage() {
  const { data: bookings = [], isLoading, isError } = usePartnerBookings();
  const partnerQuery = useMyPartner();
  const [filter, setFilter] = useState<EarningsFilter>('all');

  const bank = extractBankDetails(partnerQuery.data);
  const stats = useMemo(() => buildEarningStats(bookings), [bookings]);
  const filteredBookings = useMemo(
    () => filterEarnings(bookings, filter),
    [bookings, filter]
  );

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Partner workspace</p>
          <h1 style={styles.title}>Earnings</h1>
          <p style={styles.description}>
            Review payout readiness, partner earnings, balances, and booking-level
            settlement status.
          </p>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <Stat label="Total earned" value={formatCurrency(stats.totalEarned)} />
        <Stat label="Available" value={formatCurrency(stats.available)} />
        <Stat label="Pending" value={formatCurrency(stats.pending)} />
        <Stat label="Paid" value={formatCurrency(stats.paid)} />
      </section>

      <section style={styles.grid}>
        <div style={styles.mainColumn}>
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Earnings report</h2>
                <p style={styles.panelHint}>
                  Filter booking earnings by payout status.
                </p>
              </div>
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

            {isLoading ? (
              <div style={styles.emptyState}>Loading earnings...</div>
            ) : isError ? (
              <div style={styles.emptyState}>Unable to load earnings right now.</div>
            ) : filteredBookings.length === 0 ? (
              <div style={styles.emptyState}>No earnings match this filter.</div>
            ) : (
              <div style={styles.table}>
                <div style={styles.tableHead}>
                  <span>Booking</span>
                  <span>Event</span>
                  <span>Payment</span>
                  <span>Payout</span>
                  <span style={styles.alignRight}>Earning</span>
                </div>
                {filteredBookings.map((booking) => (
                  <div key={booking.id} style={styles.tableRow}>
                    <span>
                      <strong style={styles.bookingNumber}>{booking.bookingNumber}</strong>
                      <small style={styles.subText}>{booking.customerName || 'Customer pending'}</small>
                    </span>
                    <span>
                      {formatDate(booking.eventDate)}
                      <small style={styles.subText}>{labelize(booking.serviceType)}</small>
                    </span>
                    <Status value={booking.paymentStatus} />
                    <Status value={booking.payoutStatus} />
                    <strong style={styles.amount}>
                      {formatCurrency(booking.partnerEarningAmount, booking.currency)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside style={styles.sideColumn}>
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>Bank details</h2>
            <p style={styles.panelHint}>
              Bank information is read-only here and managed through verification.
            </p>
            <div style={styles.bankCard}>
              <Info label="Account holder" value={bank.accountHolderName} />
              <Info label="Account" value={bank.maskedAccountNo} />
              <Info label="IFSC" value={bank.ifscCode} />
              <Info label="Bank" value={bank.bankName} />
              <Info label="UPI" value={bank.upiId} />
              <Info label="Status" value={labelize(bank.status)} />
            </div>
          </section>

          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>Report summary</h2>
            <div style={styles.reportList}>
              <Info label="Bookings with earnings" value={`${stats.count}`} />
              <Info label="Pending balance" value={formatCurrency(stats.pending)} />
              <Info label="Completed payouts" value={`${stats.paidCount}`} />
              <Info label="Currency" value={stats.currency} />
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

const FILTERS: { key: EarningsFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
];

function buildEarningStats(bookings: BookingDetail[]) {
  return bookings.reduce(
    (stats, booking) => {
      const earning = Number(booking.partnerEarningAmount || 0);
      stats.totalEarned += earning;
      stats.count += earning > 0 ? 1 : 0;
      stats.currency = booking.currency || stats.currency;

      if (booking.payoutStatus === 'paid') {
        stats.paid += earning;
        stats.paidCount += 1;
      } else if (booking.payoutStatus === 'available') {
        stats.available += earning;
      } else {
        stats.pending += earning;
      }

      return stats;
    },
    {
      totalEarned: 0,
      available: 0,
      pending: 0,
      paid: 0,
      paidCount: 0,
      count: 0,
      currency: 'INR',
    }
  );
}

function filterEarnings(bookings: BookingDetail[], filter: EarningsFilter) {
  if (filter === 'all') return bookings;
  if (filter === 'pending') {
    return bookings.filter((booking) =>
      ['not_due', 'locked', 'payout_initiated'].includes(booking.payoutStatus)
    );
  }
  return bookings.filter((booking) => booking.payoutStatus === filter);
}

function extractBankDetails(raw: unknown) {
  const partner = (raw || {}) as Record<string, any>;
  const kyc = partner.kyc || partner.kycStatus || partner.kyc_status || {};
  const bank = kyc.bankAccount || kyc.bank_account || partner.bankAccount || {};

  return {
    accountHolderName: bank.accountHolderName || bank.account_holder_name || 'Not available',
    maskedAccountNo: bank.maskedAccountNo || bank.masked_account_no || 'Not available',
    ifscCode: bank.ifscCode || bank.ifsc_code || 'Not available',
    bankName: bank.bankName || bank.bank_name || 'Not available',
    upiId: bank.upiId || bank.upi_id || 'Not available',
    status: bank.status || kyc.status || 'pending',
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.info}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value || '-'}</strong>
    </div>
  );
}

function Status({ value }: { value: string }) {
  const tone = statusTone(value);
  return (
    <span style={{ ...styles.status, background: tone.bg, color: tone.color }}>
      {labelize(value)}
    </span>
  );
}

function statusTone(value: string) {
  if (['paid', 'available'].includes(value)) {
    return { bg: '#ecfdf5', color: '#047857' };
  }
  if (['failed', 'rejected', 'cancelled'].includes(value)) {
    return { bg: '#fef2f2', color: '#b91c1c' };
  }
  return { bg: '#fff7ed', color: '#c2410c' };
}

function labelize(value?: string) {
  if (!value) return 'Pending';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatCurrency(value: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
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
  title: { margin: 0, color: '#111827', fontSize: 28, fontWeight: 850 },
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
  statLabel: { display: 'block', color: '#64748b', fontSize: 13, fontWeight: 750 },
  statValue: { display: 'block', marginTop: 8, color: '#111827', fontSize: 24, fontWeight: 850 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
    gap: 16,
    alignItems: 'start',
  },
  mainColumn: { minWidth: 0 },
  sideColumn: { display: 'grid', gap: 16 },
  panel: {
    padding: 18,
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  panelTitle: { margin: 0, color: '#111827', fontSize: 18, fontWeight: 850 },
  panelHint: { margin: '6px 0 0', color: '#64748b', fontSize: 13 },
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
  filterButtonActive: { borderColor: '#ef4d2f', background: '#fff7ed', color: '#c2410c' },
  table: { display: 'grid', gap: 1, overflowX: 'auto' },
  tableHead: {
    minWidth: 820,
    display: 'grid',
    gridTemplateColumns: '1.35fr 1fr 0.8fr 0.8fr 0.8fr',
    gap: 12,
    padding: '10px 12px',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 850,
    background: '#f8fafc',
    borderRadius: 8,
  },
  tableRow: {
    minWidth: 820,
    display: 'grid',
    gridTemplateColumns: '1.35fr 1fr 0.8fr 0.8fr 0.8fr',
    gap: 12,
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eef2f7',
    color: '#111827',
    fontSize: 13,
  },
  bookingNumber: { display: 'block', fontWeight: 850 },
  subText: { display: 'block', marginTop: 3, color: '#64748b', fontSize: 12 },
  alignRight: { textAlign: 'right' },
  amount: { textAlign: 'right' },
  status: {
    width: 'fit-content',
    borderRadius: 999,
    padding: '5px 8px',
    fontSize: 12,
    fontWeight: 850,
  },
  bankCard: { display: 'grid', gap: 10, marginTop: 14 },
  reportList: { display: 'grid', gap: 10, marginTop: 14 },
  info: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #eef2f7',
    background: '#f8fafc',
  },
  infoLabel: { display: 'block', color: '#64748b', fontSize: 12, fontWeight: 750 },
  infoValue: {
    display: 'block',
    marginTop: 4,
    color: '#111827',
    fontSize: 13,
    fontWeight: 850,
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
    textAlign: 'center',
  },
};
