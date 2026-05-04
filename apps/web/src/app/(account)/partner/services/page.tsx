'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import DynamicTable, {
  DynamicTableColumn,
} from '@/components/dashboard/DynamicTable';
import DashboardStatusBadge, {
  DashboardStatus,
} from '@/components/dashboard/DashboardStatusBadge';
import DashboardDropdown from '@/components/dashboard/DashboardDropdown';

import {
  EyeIcon,
  EditIcon,
  ServicesIcon,
  OrdersIcon,
  CalendarIcon,
  EarningsIcon,
} from '@/components/Icons/DashboardIcons';
import AddServiceDropdown from '@/components/dashboard/AddServiceDropdown';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';
import {
  type PartnerService,
  useDeletePartnerService,
  useMyPartnerServices,
  useSetPartnerServiceActive,
} from '@catering-marketplace/query-client';

type ServiceRow = {
  id: string;
  name: string;
  subtitle: string;
  serviceKey: string;
  serviceLabel: string;
  serviceTone: { bg: string; color: string };
  pricing: string;
  location: string;
  serviceArea: string;
  status: DashboardStatus;
  isActive: boolean;
  updatedAt: string;
  orders: number;
};

const SERVICE_TYPE_BADGE: Record<string, { bg: string; color: string }> = {
  chef: { bg: '#dcfce7', color: '#15803d' },
  meal_plan: { bg: '#fff7ed', color: '#ea580c' },
  catering: { bg: '#f3e8ff', color: '#7c3aed' },
  restaurant_private_event: { bg: '#e0f2fe', color: '#0369a1' },
};

export default function ServicesLandingPage() {
  const router = useRouter();
  const { serviceTypes, getServiceType, getExperienceType } =
    useServiceCatalogMetaContext();
  const { data: services = [], isLoading, error } = useMyPartnerServices();
  const [notice, setNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const deleteService = useDeletePartnerService({
    onSuccess: () =>
      setNotice({ type: 'success', text: 'Service deleted successfully.' }),
    onError: (err) =>
      setNotice({ type: 'error', text: err.message || 'Delete failed.' }),
  });
  const setActive = useSetPartnerServiceActive({
    onSuccess: (service) =>
      setNotice({
        type: 'success',
        text: service.is_active
          ? 'Service is now active.'
          : 'Service is now inactive.',
      }),
    onError: (err) =>
      setNotice({ type: 'error', text: err.message || 'Update failed.' }),
  });

  const [activeTab, setActiveTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DashboardStatus>(
    'all'
  );
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      services.map((service) =>
        toServiceRow(service, {
          serviceLabel:
            getServiceType(service.service_key)?.label || service.service_key,
          experienceLabel:
            getExperienceType(service.experience_type_key)?.label || '',
        })
      ),
    [getExperienceType, getServiceType, services]
  );

  const filteredServices = useMemo(() => {
    return rows.filter((service) => {
      const matchesType =
        activeTab === 'all' || service.serviceKey === activeTab;
      const matchesStatus =
        statusFilter === 'all' || service.status === statusFilter;

      const search = query.toLowerCase().trim();

      const matchesQuery =
        !search ||
        service.name.toLowerCase().includes(search) ||
        service.subtitle.toLowerCase().includes(search) ||
        service.location.toLowerCase().includes(search) ||
        service.serviceLabel.toLowerCase().includes(search);

      return matchesType && matchesStatus && matchesQuery;
    });
  }, [activeTab, rows, statusFilter, query]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      active: rows.filter((s) => s.isActive).length,
      underReview: rows.filter((s) => s.status === 'under_review').length,
      draft: rows.filter((s) => s.status === 'draft').length,
    };
  }, [rows]);

  const columns: DynamicTableColumn<ServiceRow>[] = [
    {
      key: 'service',
      label: 'Service',
      render: (row) => (
        <div style={styles.serviceCell}>
          <div style={styles.thumb}>
            {row.serviceKey === 'meal_plan' ? (
              <OrdersIcon size={17} />
            ) : row.serviceKey === 'catering' ? (
              <CalendarIcon size={17} />
            ) : (
              <ServicesIcon size={17} />
            )}
          </div>

          <div>
            <div style={styles.serviceName}>{row.name}</div>
            <div style={styles.serviceSubtitle} title={row.subtitle}>
              {row.subtitle}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span
          style={{
            ...styles.typeBadge,
            background: row.serviceTone.bg,
            color: row.serviceTone.color,
          }}
        >
          {row.serviceLabel}
        </span>
      ),
    },
    {
      key: 'pricing',
      label: 'Pricing',
      render: (row) => row.pricing,
    },
    {
      key: 'location',
      label: 'Location',
      render: (row) => (
        <div>
          <div style={styles.location}>{row.location}</div>
          <div style={styles.serviceSubtitle} title={row.serviceArea}>
            {row.serviceArea}
          </div>
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      align: 'center',
      render: (row) => row.orders,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <DashboardStatusBadge status={row.status} />,
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (row) => row.updatedAt,
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Services</h1>
          <p style={styles.subtitle}>
            Manage chef services, meal plans, and catering offerings.
          </p>
        </div>

        <div style={styles.headerActions}>
          <AddServiceDropdown
            onSelect={(option: any) => router.push(option.href)}
          />
        </div>
      </div>

      {notice && (
        <div
          style={{
            ...styles.notice,
            ...(notice.type === 'error' ? styles.noticeError : {}),
          }}
        >
          <span>{notice.text}</span>
          <button
            type="button"
            style={styles.noticeClose}
            onClick={() => setNotice(null)}
          >
            Close
          </button>
        </div>
      )}

      <div style={styles.statsGrid}>
        <StatCard
          icon={<ServicesIcon size={18} />}
          label="Total Services"
          value={stats.total}
          tone="purple"
        />
        <StatCard
          icon={<ApprovalIconMini />}
          label="Active"
          value={stats.active}
          tone="green"
        />
        <StatCard
          icon={<ReviewIconMini />}
          label="Under Review"
          value={stats.underReview}
          tone="orange"
        />
        <StatCard
          icon={<DraftIconMini />}
          label="Draft"
          value={stats.draft}
          tone="slate"
        />
      </div>

      <section style={styles.card}>
        <div style={styles.tabsBar}>
          <div style={styles.tabs}>
            <Tab
              label="All Services"
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            {serviceTypes.map((serviceType) => (
              <Tab
                key={serviceType.key}
                label={serviceType.label}
                active={activeTab === serviceType.key}
                onClick={() => setActiveTab(serviceType.key)}
              />
            ))}
          </div>

          <div style={styles.filters}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service, type or city..."
              style={styles.search}
            />

            <DashboardDropdown
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as any)}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Under Review', value: 'under_review' },
                { label: 'Draft', value: 'draft' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Paused', value: 'paused' },
                { label: 'Approved', value: 'approved' },
              ]}
            />
          </div>
        </div>

        <DynamicTable<ServiceRow>
          data={filteredServices}
          columns={columns}
          getRowKey={(row) => row.id}
          emptyText={
            isLoading
              ? 'Loading services...'
              : error
                ? 'Unable to load services.'
                : 'No services found.'
          }
          actions={[
            {
              label: 'View',
              icon: <EyeIcon size={16} />,
              onClick: (row) =>
                router.push(
                  `/partner/services/${getRouteType(row.serviceKey)}/${row.id}`
                ),
            },
            {
              label: 'Edit',
              icon: <EditIcon size={16} />,
              onClick: (row) =>
                router.push(
                  `/partner/services/${getRouteType(row.serviceKey)}/${row.id}/edit`
                ),
            },
            {
              label: (row) => (row.isActive ? 'Make inactive' : 'Make active'),
              icon: <PowerIconMini />,
              onClick: (row) =>
                setActive.mutate({
                  serviceId: row.id,
                  is_active: !row.isActive,
                }),
            },
            {
              label: 'Delete',
              icon: <DeleteIconMini />,
              variant: 'danger',
              onClick: (row) => {
                const ok = window.confirm(
                  `Delete "${row.name}"? This cannot be undone.`
                );
                if (ok) deleteService.mutate(row.id);
              },
            },
          ]}
        />
      </section>
    </div>
  );
}

function toServiceRow(
  service: PartnerService,
  labels: { serviceLabel: string; experienceLabel: string }
): ServiceRow {
  const firstArea = Array.isArray(service.service_areas)
    ? (service.service_areas[0] as any)
    : null;

  return {
    id: service.id,
    name: service.title,
    subtitle:
      service.short_description ||
      labels.experienceLabel ||
      service.description ||
      'No description yet',
    serviceKey: service.service_key,
    serviceLabel: labels.serviceLabel,
    serviceTone: SERVICE_TYPE_BADGE[service.service_key] ||
      SERVICE_TYPE_BADGE.chef || { bg: '#f1f5f9', color: '#475569' },
    pricing: formatPricing(service),
    location: firstArea?.city_name || firstArea?.city || firstArea?.name || '-',
    serviceArea: formatServiceArea(service),
    status: mapServiceStatus(service),
    isActive: service.is_active,
    updatedAt: formatDate(service.updated_at || service.created_at),
    orders: 0,
  };
}

function getRouteType(serviceKey: string) {
  if (serviceKey === 'meal_plan') return 'meal-plans';
  if (serviceKey === 'restaurant_private_event') return 'restaurant-events';
  return serviceKey;
}

function mapServiceStatus(service: PartnerService): DashboardStatus {
  if (!service.is_active || service.status === 'inactive') return 'paused';
  if (service.status === 'approved') return 'approved';
  if (service.status === 'under_review') return 'under_review';
  if (service.status === 'rejected') return 'rejected';
  return service.status === 'draft' ? 'draft' : 'active';
}

function formatPricing(service: PartnerService) {
  if (service.base_price == null) return 'Custom quote';

  const amount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: service.currency_code || 'INR',
    maximumFractionDigits: 0,
  }).format(service.base_price);

  const unit =
    service.pricing_model === 'per_person'
      ? ' / person'
      : service.pricing_model === 'per_plate'
        ? ' / plate'
        : service.pricing_model === 'per_event'
          ? ' / event'
          : '';

  return `${amount}${unit}`;
}

function formatServiceArea(service: PartnerService) {
  const count = Array.isArray(service.service_areas)
    ? service.service_areas.length
    : 0;
  if (count > 1) return `${count} service areas`;
  if (service.min_guests || service.max_guests) {
    return `${service.min_guests || 1}-${service.max_guests || 'many'} guests`;
  }
  return 'Service area not set';
}

function formatDate(value?: string) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active ? styles.tabActive : {}),
      }}
    >
      {label}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: 'purple' | 'green' | 'orange' | 'slate';
}) {
  const config = {
    purple: {
      bg: '#f3e8ff',
      color: '#7c3aed',
    },
    green: {
      bg: '#dcfce7',
      color: '#15803d',
    },
    orange: {
      bg: '#fff7ed',
      color: '#ea580c',
    },
    slate: {
      bg: '#f1f5f9',
      color: '#64748b',
    },
  }[tone];

  return (
    <div style={styles.statCard}>
      <span
        style={{
          ...styles.statIcon,
          background: config.bg,
          color: config.color,
        }}
      >
        {icon}
      </span>

      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function ApprovalIconMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReviewIconMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DraftIconMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIconMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PowerIconMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v8M7.1 6.5A8 8 0 1 0 17 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },

  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#151126',
    letterSpacing: '-0.025em',
  },

  subtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#64748b',
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  notice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '11px 13px',
    borderRadius: 12,
    background: '#ecfdf5',
    border: '1px solid #bbf7d0',
    color: '#047857',
    fontSize: 13,
    fontWeight: 750,
  },

  noticeError: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
  },

  noticeClose: {
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    fontWeight: 850,
  },

  primaryButton: {
    height: 40,
    border: 'none',
    borderRadius: 12,
    padding: '0 16px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 22px rgba(124, 58, 237, 0.16)',
  },

  secondaryButton: {
    height: 40,
    border: '1px solid #eee9f7',
    borderRadius: 12,
    padding: '0 14px',
    background: '#ffffff',
    color: '#6d28d9',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: 14,
  },

  statCard: {
    padding: 17,
    borderRadius: 18,
    background: '#ffffff',
    border: '1px solid #eee9f7',
    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.035)',
    display: 'flex',
    alignItems: 'center',
    gap: 13,
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },

  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#151126',
  },

  card: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 20,
    boxShadow: '0 10px 28px rgba(17, 24, 39, 0.035)',
    overflow: 'hidden',
  },

  tabsBar: {
    padding: '16px 18px',
    borderBottom: '1px solid #f5f1fb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    flexWrap: 'wrap',
  },

  tabs: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },

  tab: {
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    padding: '8px 0',
    borderBottom: '2px solid transparent',
  },

  tabActive: {
    color: '#7c3aed',
    borderBottomColor: '#7c3aed',
  },

  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  search: {
    height: 38,
    minWidth: 260,
    borderRadius: 12,
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#334155',
    padding: '0 12px',
    fontSize: 13,
    outline: 'none',
  },

  serviceCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
  },

  thumb: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  serviceName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#151126',
    marginBottom: 3,
  },

  serviceSubtitle: {
    fontSize: 12,
    color: '#8b8aa3',
    maxWidth: 280,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  typeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 9px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },

  location: {
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 3,
  },
};
