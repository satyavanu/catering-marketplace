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

type ServiceType = 'chef' | 'meal_plan' | 'catering';

type ServiceRow = {
  id: string;
  name: string;
  subtitle: string;
  type: ServiceType;
  pricing: string;
  location: string;
  serviceArea: string;
  status: DashboardStatus;
  updatedAt: string;
  orders: number;
};

const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  chef: 'Chef Service',
  meal_plan: 'Meal Plan',
  catering: 'Catering Offering',
};

const SERVICE_TYPE_BADGE: Record<ServiceType, { bg: string; color: string }> = {
  chef: { bg: '#dcfce7', color: '#15803d' },
  meal_plan: { bg: '#fff7ed', color: '#ea580c' },
  catering: { bg: '#f3e8ff', color: '#7c3aed' },
};

const MOCK_SERVICES: ServiceRow[] = [
  {
    id: 'svc_001',
    name: 'Home Chef for Daily Meals',
    subtitle: 'North Indian, South Indian, Jain',
    type: 'chef',
    pricing: '₹250 / meal',
    location: 'Hyderabad',
    serviceArea: '15 km radius',
    status: 'active',
    updatedAt: '18 May 2024',
    orders: 24,
  },
  {
    id: 'svc_002',
    name: 'Weekly Veg Tiffin Plan',
    subtitle: 'North Indian, Gujarati',
    type: 'meal_plan',
    pricing: '₹1,200 / week',
    location: 'Hyderabad',
    serviceArea: '10 km radius',
    status: 'under_review',
    updatedAt: '17 May 2024',
    orders: 12,
  },
  {
    id: 'svc_003',
    name: 'Premium Wedding Catering',
    subtitle: 'Multi Cuisine, Buffet',
    type: 'catering',
    pricing: '₹15,000 / event',
    location: 'Hyderabad',
    serviceArea: '20 km radius',
    status: 'active',
    updatedAt: '16 May 2024',
    orders: 8,
  },
  {
    id: 'svc_004',
    name: 'Diabetic Friendly Meal Plan',
    subtitle: 'Low Oil, Low Spice',
    type: 'meal_plan',
    pricing: '₹1,500 / week',
    location: 'Hyderabad',
    serviceArea: '8 km radius',
    status: 'draft',
    updatedAt: '15 May 2024',
    orders: 0,
  },
  {
    id: 'svc_005',
    name: 'Weekend Party Catering',
    subtitle: 'North Indian, Chinese',
    type: 'catering',
    pricing: '₹20,000 / event',
    location: 'Hyderabad',
    serviceArea: '25 km radius',
    status: 'rejected',
    updatedAt: '14 May 2024',
    orders: 2,
  },
  {
    id: 'svc_006',
    name: 'Elderly Care Meals',
    subtitle: 'Jain, Low Oil, Soft Food',
    type: 'chef',
    pricing: '₹300 / meal',
    location: 'Bengaluru',
    serviceArea: '12 km radius',
    status: 'active',
    updatedAt: '14 May 2024',
    orders: 18,
  },
  {
    id: 'svc_007',
    name: 'Monthly South Indian Plan',
    subtitle: 'South Indian, Veg',
    type: 'meal_plan',
    pricing: '₹4,500 / month',
    location: 'Chennai',
    serviceArea: '15 km radius',
    status: 'active',
    updatedAt: '13 May 2024',
    orders: 31,
  },
  {
    id: 'svc_008',
    name: 'Corporate Lunch Catering',
    subtitle: 'Corporate, Buffet, Bulk Orders',
    type: 'catering',
    pricing: '₹300 / plate',
    location: 'Bengaluru',
    serviceArea: '18 km radius',
    status: 'under_review',
    updatedAt: '12 May 2024',
    orders: 5,
  },
  {
    id: 'svc_009',
    name: 'Protein Rich Meal Plan',
    subtitle: 'High Protein, Balanced',
    type: 'meal_plan',
    pricing: '₹5,000 / month',
    location: 'Mumbai',
    serviceArea: '12 km radius',
    status: 'active',
    updatedAt: '12 May 2024',
    orders: 15,
  },
  {
    id: 'svc_010',
    name: 'Birthday Party Chef',
    subtitle: 'Live Cooking, Snacks',
    type: 'chef',
    pricing: '₹1,500 / session',
    location: 'Delhi',
    serviceArea: '10 km radius',
    status: 'paused',
    updatedAt: '11 May 2024',
    orders: 7,
  },
  {
    id: 'svc_011',
    name: 'Festival Catering Package',
    subtitle: 'Traditional Meals, Sweets',
    type: 'catering',
    pricing: '₹25,000 / event',
    location: 'Pune',
    serviceArea: '20 km radius',
    status: 'draft',
    updatedAt: '10 May 2024',
    orders: 0,
  },
  {
    id: 'svc_012',
    name: 'Weight Loss Meal Plan',
    subtitle: 'Low Calorie, Detox',
    type: 'meal_plan',
    pricing: '₹1,700 / week',
    location: 'Hyderabad',
    serviceArea: '10 km radius',
    status: 'rejected',
    updatedAt: '09 May 2024',
    orders: 1,
  },
  {
    id: 'svc_013',
    name: 'Private Chef for Families',
    subtitle: 'Home Cooking, Veg & Non-Veg',
    type: 'chef',
    pricing: '₹800 / visit',
    location: 'Mumbai',
    serviceArea: '14 km radius',
    status: 'under_review',
    updatedAt: '08 May 2024',
    orders: 3,
  },
  {
    id: 'svc_014',
    name: 'Office Tiffin Subscription',
    subtitle: 'Lunch, Corporate Meals',
    type: 'meal_plan',
    pricing: '₹2,200 / week',
    location: 'Gurugram',
    serviceArea: '16 km radius',
    status: 'active',
    updatedAt: '07 May 2024',
    orders: 26,
  },
  {
    id: 'svc_015',
    name: 'Housewarming Catering',
    subtitle: 'South Indian, Traditional',
    type: 'catering',
    pricing: '₹12,000 / event',
    location: 'Chennai',
    serviceArea: '18 km radius',
    status: 'approved',
    updatedAt: '06 May 2024',
    orders: 4,
  },
];

export default function ServicesLandingPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | ServiceType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DashboardStatus>(
    'all'
  );
  const [query, setQuery] = useState('');

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter((service) => {
      const matchesType = activeTab === 'all' || service.type === activeTab;
      const matchesStatus =
        statusFilter === 'all' || service.status === statusFilter;

      const search = query.toLowerCase().trim();

      const matchesQuery =
        !search ||
        service.name.toLowerCase().includes(search) ||
        service.subtitle.toLowerCase().includes(search) ||
        service.location.toLowerCase().includes(search) ||
        SERVICE_TYPE_LABEL[service.type].toLowerCase().includes(search);

      return matchesType && matchesStatus && matchesQuery;
    });
  }, [activeTab, statusFilter, query]);

  const stats = useMemo(() => {
    return {
      total: MOCK_SERVICES.length,
      active: MOCK_SERVICES.filter((s) => s.status === 'active').length,
      underReview: MOCK_SERVICES.filter((s) => s.status === 'under_review')
        .length,
      draft: MOCK_SERVICES.filter((s) => s.status === 'draft').length,
    };
  }, []);

  const columns: DynamicTableColumn<ServiceRow>[] = [
    {
      key: 'service',
      label: 'Service',
      render: (row) => (
        <div style={styles.serviceCell}>
          <div style={styles.thumb}>
            {row.type === 'chef' && <ServicesIcon size={17} />}
            {row.type === 'meal_plan' && <OrdersIcon size={17} />}
            {row.type === 'catering' && <CalendarIcon size={17} />}
          </div>

          <div>
            <div style={styles.serviceName}>{row.name}</div>
            <div style={styles.serviceSubtitle}>{row.subtitle}</div>
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
            background: SERVICE_TYPE_BADGE[row.type].bg,
            color: SERVICE_TYPE_BADGE[row.type].color,
          }}
        >
          {SERVICE_TYPE_LABEL[row.type]}
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
          <div style={styles.serviceSubtitle}>{row.serviceArea}</div>
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
          <p style={styles.subtitle}>Manage chef services, meal plans, and catering offerings.</p>
        </div>

        <div style={styles.headerActions}>
        <AddServiceDropdown onSelect={(option: any) => router.push(option.href)} />

        </div>
      </div>

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
            <Tab
              label="Chef Services"
              active={activeTab === 'chef'}
              onClick={() => setActiveTab('chef')}
            />
            <Tab
              label="Meal Plans"
              active={activeTab === 'meal_plan'}
              onClick={() => setActiveTab('meal_plan')}
            />
            <Tab
              label="Catering Offerings"
              active={activeTab === 'catering'}
              onClick={() => setActiveTab('catering')}
            />
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
              ]}
            />
          </div>
        </div>

        <DynamicTable<ServiceRow>
          data={filteredServices}
          columns={columns}
          getRowKey={(row) => row.id}
          emptyText="No services found."
          actions={[
            {
              label: 'View',
              icon: <EyeIcon size={16} />,
              onClick: (row) =>
                router.push(`/partner/services/${getRouteType(row.type)}/${row.id}`),
            },
            {
              label: 'Edit',
              icon: <EditIcon size={16} />,
              onClick: (row) =>
                router.push(
                  `/partner/services/${getRouteType(row.type)}/${row.id}/edit`
                ),
            },
          ]}
        />
      </section>
    </div>
  );
}

function getRouteType(type: ServiceType) {
  if (type === 'meal_plan') return 'meal-plans';
  return type;
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
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />
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