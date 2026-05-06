'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import {
  type AdminPartnerRow,
  type BookingDetail,
  type PartnerService,
  useAdminPartner,
  useAdminPartnerBookings,
  useAdminPartners,
  useAdminPartnerServices,
} from '@catering-marketplace/query-client';

type PartnerTab = 'overview' | 'services' | 'bookings';
type PartnerSort = 'newest' | 'name' | 'status' | 'country';

export default function AdminPartnersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');
  const [partnerType, setPartnerType] = useState('');
  const [sortBy, setSortBy] = useState<PartnerSort>('newest');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>();
  const [activeTab, setActiveTab] = useState<PartnerTab>('overview');

  const { data: rawPartners = [], isLoading, isError } = useAdminPartners();
  const partners = useMemo(
    () => normalizeCollection<AdminPartnerRow>(rawPartners),
    [rawPartners]
  );
  const selectedPartner = partners.find(
    (partner) => partner.id === selectedPartnerId
  );

  const countries = useMemo(
    () =>
      unique(
        partners
          .map((partner) => partner.countryCode)
          .filter(Boolean) as string[]
      ),
    [partners]
  );
  const partnerTypes = useMemo(
    () =>
      unique(
        partners
          .map((partner) => partner.businessType)
          .filter(Boolean) as string[]
      ),
    [partners]
  );

  const visiblePartners = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = partners.filter((partner) => {
      const haystack = [
        partner.name,
        partner.businessName,
        partner.email,
        partner.phone,
        partner.city,
        partner.countryCode,
        partner.businessType,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return (
        (!term || haystack.includes(term)) &&
        (!status || partner.status === status) &&
        (!country || partner.countryCode === country) &&
        (!partnerType || partner.businessType === partnerType)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name')
        return (a.businessName || a.name || '').localeCompare(
          b.businessName || b.name || ''
        );
      if (sortBy === 'status')
        return String(a.status).localeCompare(String(b.status));
      if (sortBy === 'country')
        return String(a.countryCode || '').localeCompare(
          String(b.countryCode || '')
        );
      return (
        new Date(b.createdAt || b.submittedOn || 0).getTime() -
        new Date(a.createdAt || a.submittedOn || 0).getTime()
      );
    });
  }, [partners, search, status, country, partnerType, sortBy]);

  const stats = useMemo(
    () => ({
      total: partners.length,
      active: partners.filter((p) => p.status === 'approved').length,
      pending: partners.filter(
        (p) => p.status === 'pending' || p.status === 'under_review'
      ).length,
      suspended: partners.filter((p) => p.status === 'suspended').length,
    }),
    [partners]
  );

  if (selectedPartnerId) {
    return (
      <PartnerDetailView
        partnerId={selectedPartnerId}
        partner={selectedPartner}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => setSelectedPartnerId(undefined)}
      />
    );
  }

  return (
    <div style={styles.page}>
      <PageHeader
        eyebrow="Super admin"
        title="Partner 360"
        description="Find a partner, open their profile, and inspect services, bookings, orders, and payment state without losing context."
      />

      <section style={styles.statsGrid}>
        <Stat label="Partners" value={stats.total} />
        <Stat label="Active" value={stats.active} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Suspended" value={stats.suspended} />
      </section>

      <section style={styles.filterBar}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search partner, contact, city, country"
          style={styles.searchInput}
        />
        <Select
          value={status}
          onChange={setStatus}
          label="All statuses"
          options={[
            ['pending', 'Pending'],
            ['under_review', 'Under review'],
            ['approved', 'Approved'],
            ['rejected', 'Rejected'],
            ['suspended', 'Suspended'],
            ['deactivated', 'Deactivated'],
          ]}
        />
        <Select
          value={partnerType}
          onChange={setPartnerType}
          label="All partner types"
          options={partnerTypes.map((value) => [value, labelize(value)])}
        />
        <Select
          value={country}
          onChange={setCountry}
          label="All countries"
          options={countries.map((value) => [value, value])}
        />
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value as PartnerSort)}
          label="Sort"
          options={[
            ['newest', 'Newest'],
            ['name', 'Name'],
            ['status', 'Status'],
            ['country', 'Country'],
          ]}
        />
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>Partners</h2>
            <p style={styles.panelSub}>
              {visiblePartners.length} matching records
            </p>
          </div>
        </div>

        {isLoading ? (
          <Empty text="Loading partners..." />
        ) : isError ? (
          <Empty text="Unable to load partners." />
        ) : visiblePartners.length === 0 ? (
          <Empty text="No partners match these filters." />
        ) : (
          <div style={styles.table}>
            {visiblePartners.map((partner) => (
              <button
                key={partner.id}
                type="button"
                style={styles.partnerRow}
                onClick={() => {
                  setSelectedPartnerId(partner.id);
                  setActiveTab('overview');
                }}
              >
                <span style={styles.avatar}>
                  {initials(partner.businessName || partner.name || 'P')}
                </span>
                <span style={styles.rowMain}>
                  <strong>
                    {partner.businessName || partner.name || 'Unnamed partner'}
                  </strong>
                  <small>{partner.email || partner.phone || partner.id}</small>
                </span>
                <span style={styles.rowCell}>
                  {partner.businessType ? labelize(partner.businessType) : '-'}
                </span>
                <span style={styles.rowCell}>
                  {partner.city || partner.countryCode || '-'}
                </span>
                <span style={badgeStyle(partner.status)}>
                  {labelize(partner.status)}
                </span>
                <span style={styles.viewLink}>View</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PartnerDetailView({
  partnerId,
  partner,
  activeTab,
  onTabChange,
  onBack,
}: {
  partnerId: string;
  partner?: AdminPartnerRow;
  activeTab: PartnerTab;
  onTabChange: (tab: PartnerTab) => void;
  onBack: () => void;
}) {
  const { data: detail } = useAdminPartner(partnerId);
  const { data: rawServices = [], isLoading: servicesLoading } =
    useAdminPartnerServices({ partner_id: partnerId });
  const { data: rawBookings = [], isLoading: bookingsLoading } =
    useAdminPartnerBookings(partnerId);
  const services = useMemo(
    () => normalizeCollection<PartnerService>(rawServices),
    [rawServices]
  );
  const bookings = useMemo(
    () => normalizeCollection<BookingDetail>(rawBookings),
    [rawBookings]
  );
  const selected = detail || partner;

  return (
    <div style={styles.page}>
      <section style={styles.detailHero}>
        <button type="button" onClick={onBack} style={styles.backButton}>
          Back to partners
        </button>
        <div style={styles.detailHeroMain}>
          <span style={styles.largeAvatar}>
            {initials(selected?.businessName || selected?.name || 'P')}
          </span>
          <div>
            <p style={styles.eyebrow}>Partner 360</p>
            <h1 style={styles.title}>
              {selected?.businessName || selected?.name || 'Partner'}
            </h1>
            <p style={styles.description}>
              {selected?.email || selected?.phone || partnerId}
            </p>
          </div>
        </div>
        {selected?.status && (
          <span style={badgeStyle(selected.status)}>
            {labelize(selected.status)}
          </span>
        )}
      </section>

      <section style={styles.statsGrid}>
        <Stat label="Services" value={services.length} />
        <Stat label="Bookings" value={bookings.length} />
        <Stat
          label="Paid bookings"
          value={
            bookings.filter((booking) => booking.paymentStatus === 'paid')
              .length
          }
        />
        <Stat
          label="Revenue"
          value={formatCompactMoney(
            bookings.reduce(
              (sum, booking) =>
                sum +
                (booking.paymentStatus === 'paid'
                  ? booking.totalAmount || 0
                  : 0),
              0
            ),
            bookings[0]?.currency || 'INR'
          )}
        />
      </section>

      <nav style={styles.tabs}>
        <Tab
          active={activeTab === 'overview'}
          onClick={() => onTabChange('overview')}
          label="Overview"
        />
        <Tab
          active={activeTab === 'services'}
          onClick={() => onTabChange('services')}
          label={`Services (${services.length})`}
        />
        <Tab
          active={activeTab === 'bookings'}
          onClick={() => onTabChange('bookings')}
          label={`Bookings (${bookings.length})`}
        />
      </nav>

      {activeTab === 'overview' && (
        <PartnerOverview
          partner={selected}
          services={services}
          bookings={bookings}
        />
      )}
      {activeTab === 'services' &&
        (servicesLoading ? (
          <Empty text="Loading services..." />
        ) : (
          <ServiceTable services={services} />
        ))}
      {activeTab === 'bookings' &&
        (bookingsLoading ? (
          <Empty text="Loading bookings..." />
        ) : (
          <BookingTable bookings={bookings} />
        ))}
    </div>
  );
}

function PartnerOverview({
  partner,
  services,
  bookings,
}: {
  partner?: AdminPartnerRow;
  services: PartnerService[];
  bookings: BookingDetail[];
}) {
  return (
    <section style={styles.gridTwo}>
      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Profile</h2>
        <Info label="Contact" value={partner?.name || '-'} />
        <Info label="Business" value={partner?.businessName || '-'} />
        <Info
          label="Type"
          value={partner?.businessType ? labelize(partner.businessType) : '-'}
        />
        <Info
          label="Location"
          value={
            [partner?.city, partner?.countryCode].filter(Boolean).join(', ') ||
            '-'
          }
        />
        <Info label="Phone" value={partner?.phone || '-'} />
        <Info label="Email" value={partner?.email || '-'} />
      </div>
      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Operational Snapshot</h2>
        <Info
          label="Approved services"
          value={String(
            services.filter((service) => service.status === 'approved').length
          )}
        />
        <Info
          label="Draft or review"
          value={String(
            services.filter((service) =>
              ['draft', 'under_review'].includes(service.status)
            ).length
          )}
        />
        <Info
          label="Upcoming bookings"
          value={String(
            bookings.filter(
              (booking) =>
                !['completed', 'cancelled', 'refunded'].includes(booking.status)
            ).length
          )}
        />
        <Info
          label="Payment issues"
          value={String(
            bookings.filter((booking) => booking.paymentStatus === 'failed')
              .length
          )}
        />
      </div>
    </section>
  );
}

function ServiceTable({ services }: { services: PartnerService[] }) {
  if (!services.length) return <Empty text="No services created yet." />;
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>Services</h2>
      <div style={styles.table}>
        {services.map((service) => (
          <div key={service.id} style={styles.dataRow}>
            <span style={styles.rowMain}>
              <strong>{service.title}</strong>
              <small>
                {labelize(service.service_key)} •{' '}
                {labelize(service.booking_type)}
              </small>
            </span>
            <span style={styles.rowCell}>{service.currency_code || '-'}</span>
            <span style={styles.rowCell}>
              {service.base_price
                ? formatCompactMoney(service.base_price, service.currency_code)
                : 'Quote'}
            </span>
            <span style={badgeStyle(service.status)}>
              {labelize(service.status)}
            </span>
            <a
              href={`/admin/service-approvals?serviceId=${service.id}`}
              style={styles.viewLink}
            >
              Review
            </a>
            <a
              href={`/partner/services/${serviceRouteType(service.service_key)}/${service.id}`}
              style={styles.viewLink}
            >
              Open
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingTable({ bookings }: { bookings: BookingDetail[] }) {
  if (!bookings.length) return <Empty text="No bookings yet." />;
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>Bookings & Orders</h2>
      <div style={styles.table}>
        {bookings.map((booking) => (
          <div key={booking.id} style={styles.dataRow}>
            <span style={styles.rowMain}>
              <strong>{booking.bookingNumber}</strong>
              <small>
                {formatDate(booking.eventDate)} • {booking.guestCount} guests •
                Order {booking.order?.orderNumber || 'not created'}
              </small>
            </span>
            <span style={styles.rowCell}>
              {formatCompactMoney(booking.totalAmount, booking.currency)}
            </span>
            <span style={badgeStyle(booking.status)}>
              {labelize(booking.status)}
            </span>
            <span style={badgeStyle(booking.paymentStatus)}>
              {labelize(booking.paymentStatus)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section style={styles.header}>
      <p style={styles.eyebrow}>{eyebrow}</p>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.description}>{description}</p>
    </section>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: Array<[string, string]>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={styles.select}
    >
      <option value="">{label}</option>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}

function Tab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...styles.tab, ...(active ? styles.tabActive : null) }}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <article style={styles.statCard}>
      <span>{label}</span>
      <strong>{value}</strong>
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

function Empty({ text }: { text: string }) {
  return <div style={styles.empty}>{text}</div>;
}

function normalizeCollection<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  const nested = [
    record.data,
    record.items,
    record.services,
    record.bookings,
    record.results,
  ].find(Array.isArray);
  return Array.isArray(nested) ? (nested as T[]) : [];
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function initials(value: string) {
  return value.trim().slice(0, 2).toUpperCase();
}

function labelize(value?: string) {
  return (value || 'unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function serviceRouteType(serviceKey?: string) {
  if (serviceKey === 'private_chef') return 'chef';
  if (serviceKey === 'restaurant_private_events') return 'restaurant-events';
  if (serviceKey === 'catering') return 'catering';
  return serviceKey || 'chef';
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

function formatCompactMoney(value: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
    notation: Math.abs(value) >= 100000 ? 'compact' : 'standard',
  }).format(value || 0);
}

function badgeStyle(status?: string): React.CSSProperties {
  const key =
    status === 'approved' || status === 'paid' || status === 'confirmed'
      ? 'active'
      : status || 'pending';
  const tones: Record<string, React.CSSProperties> = {
    active: { background: '#ecfdf5', color: '#047857', borderColor: '#bbf7d0' },
    pending: {
      background: '#fff7ed',
      color: '#c2410c',
      borderColor: '#fed7aa',
    },
    pending_payment: {
      background: '#fff7ed',
      color: '#c2410c',
      borderColor: '#fed7aa',
    },
    under_review: {
      background: '#fff7ed',
      color: '#c2410c',
      borderColor: '#fed7aa',
    },
    draft: { background: '#f8fafc', color: '#475569', borderColor: '#e2e8f0' },
    suspended: {
      background: '#fef2f2',
      color: '#b91c1c',
      borderColor: '#fecaca',
    },
    rejected: {
      background: '#fef2f2',
      color: '#b91c1c',
      borderColor: '#fecaca',
    },
    failed: { background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' },
    deactivated: {
      background: '#f8fafc',
      color: '#475569',
      borderColor: '#e2e8f0',
    },
    completed: {
      background: '#eef2ff',
      color: '#4338ca',
      borderColor: '#c7d2fe',
    },
  };
  return { ...styles.badge, ...(tones[key] || tones.pending) };
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 18, color: '#111827' },
  header: {
    padding: 24,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 12px 28px rgba(15,23,42,.05)',
  },
  detailHero: {
    padding: 22,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  detailHeroMain: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    minWidth: 0,
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#ef4d2f',
    fontSize: 12,
    fontWeight: 850,
    textTransform: 'uppercase',
  },
  title: { margin: 0, fontSize: 28, fontWeight: 850 },
  description: {
    maxWidth: 820,
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.6,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
    gap: 12,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
    display: 'grid',
    gap: 6,
  },
  filterBar: {
    display: 'grid',
    gridTemplateColumns: 'minmax(240px,1fr) repeat(4, minmax(150px, 190px))',
    gap: 10,
    padding: 14,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
  },
  searchInput: {
    height: 42,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 14,
  },
  select: {
    height: 42,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0 10px',
    background: '#fff',
    fontSize: 14,
  },
  panel: {
    padding: 18,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  panelTitle: { margin: 0, fontSize: 18, fontWeight: 850 },
  panelSub: { margin: '5px 0 0', color: '#64748b', fontSize: 13 },
  table: { display: 'grid', gap: 8 },
  partnerRow: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '44px minmax(220px,1fr) 150px 130px auto 70px',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    border: '1px solid #eef2f7',
    borderRadius: 8,
    background: '#fff',
    textAlign: 'left',
    cursor: 'pointer',
  },
  dataRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(240px,1fr) 130px 130px 120px auto auto',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    border: '1px solid #eef2f7',
    borderRadius: 8,
  },
  rowMain: { display: 'grid', gap: 4, minWidth: 0 },
  rowCell: { color: '#475569', fontSize: 13, fontWeight: 700 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: '#fee2e2',
    color: '#ef4d2f',
    fontWeight: 850,
  },
  largeAvatar: {
    width: 58,
    height: 58,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: '#fee2e2',
    color: '#ef4d2f',
    fontWeight: 850,
    fontSize: 18,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    padding: '0 8px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  viewLink: {
    color: '#ef4d2f',
    fontSize: 13,
    fontWeight: 850,
    textDecoration: 'none',
  },
  backButton: {
    height: 36,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    padding: '0 12px',
    color: '#334155',
    fontWeight: 800,
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    padding: 6,
    borderRadius: 8,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    overflowX: 'auto',
  },
  tab: {
    height: 38,
    border: 0,
    borderRadius: 7,
    background: 'transparent',
    padding: '0 14px',
    color: '#475569',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    background: '#fff',
    color: '#ef4d2f',
    boxShadow: '0 8px 20px rgba(15,23,42,.08)',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
    gap: 14,
  },
  info: {
    display: 'grid',
    gridTemplateColumns: '130px minmax(0,1fr)',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
    color: '#64748b',
    fontSize: 13,
  },
  empty: {
    minHeight: 180,
    display: 'grid',
    placeItems: 'center',
    color: '#64748b',
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: 8,
    fontWeight: 750,
  },
};
