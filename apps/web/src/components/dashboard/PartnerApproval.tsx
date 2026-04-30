'use client';

import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn } from './DataTable';
import StatusBadge from './StatusBadge';
import {
  EyeIcon,
  ApprovalIcon,
  RejectIcon,
} from '@/components/Icons/DashboardIcons';

type PartnerStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

type Partner = {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  city: string;
  submittedOn: string;
  documentsUploaded: number;
  documentsRequired: number;
  status: PartnerStatus;
  phone: string;
  email: string;
  gst: string;
  pan: string;
};

const partners: Partner[] = [
  {
    id: 'P-1001',
    name: 'Rohit Patel',
    businessName: 'RP Caterers',
    businessType: 'Catering Service',
    city: 'Hyderabad',
    submittedOn: '18 May 2024',
    documentsUploaded: 4,
    documentsRequired: 6,
    status: 'pending',
    phone: '+91 98765 43210',
    email: 'rohit@rpcaterers.com',
    gst: 'Pending',
    pan: 'Verified',
  },
  {
    id: 'P-1002',
    name: 'Sneha Iyer',
    businessName: 'Tiffin Treats',
    businessType: 'Meal Plan / Tiffin',
    city: 'Bengaluru',
    submittedOn: '17 May 2024',
    documentsUploaded: 3,
    documentsRequired: 5,
    status: 'pending',
    phone: '+91 98765 43211',
    email: 'sneha@tiffintreats.com',
    gst: 'Not Applicable',
    pan: 'Verified',
  },
  {
    id: 'P-1003',
    name: 'Amit Shah',
    businessName: 'A1 Events',
    businessType: 'Event Catering',
    city: 'Mumbai',
    submittedOn: '16 May 2024',
    documentsUploaded: 5,
    documentsRequired: 6,
    status: 'under_review',
    phone: '+91 98765 43212',
    email: 'amit@a1events.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1004',
    name: 'Pooja Mehta',
    businessName: 'Mehta Catering',
    businessType: 'Catering Service',
    city: 'Pune',
    submittedOn: '16 May 2024',
    documentsUploaded: 2,
    documentsRequired: 4,
    status: 'pending',
    phone: '+91 98765 43213',
    email: 'pooja@mehtacatering.com',
    gst: 'Pending',
    pan: 'Pending',
  },
  {
    id: 'P-1005',
    name: 'Karan Verma',
    businessName: 'Verma Tiffins',
    businessType: 'Meal Plan / Tiffin',
    city: 'Delhi',
    submittedOn: '15 May 2024',
    documentsUploaded: 3,
    documentsRequired: 5,
    status: 'approved',
    phone: '+91 98765 43214',
    email: 'karan@vermatiffins.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1006',
    name: 'Ananya Rao',
    businessName: 'Home Feast',
    businessType: 'Private Chef',
    city: 'Chennai',
    submittedOn: '15 May 2024',
    documentsUploaded: 4,
    documentsRequired: 5,
    status: 'approved',
    phone: '+91 98765 43215',
    email: 'ananya@homefeast.com',
    gst: 'Not Applicable',
    pan: 'Verified',
  },
  {
    id: 'P-1007',
    name: 'Vikram Singh',
    businessName: 'Royal Caterers',
    businessType: 'Catering Service',
    city: 'Jaipur',
    submittedOn: '14 May 2024',
    documentsUploaded: 6,
    documentsRequired: 6,
    status: 'approved',
    phone: '+91 98765 43216',
    email: 'vikram@royalcaterers.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1008',
    name: 'Farah Khan',
    businessName: 'Biryani House',
    businessType: 'Cloud Kitchen',
    city: 'Hyderabad',
    submittedOn: '14 May 2024',
    documentsUploaded: 4,
    documentsRequired: 6,
    status: 'under_review',
    phone: '+91 98765 43217',
    email: 'farah@biryanihouse.com',
    gst: 'Pending',
    pan: 'Verified',
  },
  {
    id: 'P-1009',
    name: 'Manoj Kumar',
    businessName: 'Daily Dabba',
    businessType: 'Meal Plan / Tiffin',
    city: 'Noida',
    submittedOn: '13 May 2024',
    documentsUploaded: 2,
    documentsRequired: 5,
    status: 'rejected',
    phone: '+91 98765 43218',
    email: 'manoj@dailydabba.com',
    gst: 'Missing',
    pan: 'Invalid',
  },
  {
    id: 'P-1010',
    name: 'Lakshmi Nair',
    businessName: 'Kerala Kitchen',
    businessType: 'Home Chef',
    city: 'Kochi',
    submittedOn: '13 May 2024',
    documentsUploaded: 4,
    documentsRequired: 5,
    status: 'pending',
    phone: '+91 98765 43219',
    email: 'lakshmi@keralakitchen.com',
    gst: 'Not Applicable',
    pan: 'Verified',
  },
  {
    id: 'P-1011',
    name: 'Raj Malhotra',
    businessName: 'Party Plates',
    businessType: 'Event Catering',
    city: 'Gurugram',
    submittedOn: '12 May 2024',
    documentsUploaded: 5,
    documentsRequired: 6,
    status: 'approved',
    phone: '+91 98765 43220',
    email: 'raj@partyplates.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1012',
    name: 'Divya Reddy',
    businessName: 'Andhra Meals',
    businessType: 'Meal Plan / Tiffin',
    city: 'Vijayawada',
    submittedOn: '12 May 2024',
    documentsUploaded: 3,
    documentsRequired: 5,
    status: 'pending',
    phone: '+91 98765 43221',
    email: 'divya@andhrameals.com',
    gst: 'Pending',
    pan: 'Verified',
  },
  {
    id: 'P-1013',
    name: 'Sameer Ali',
    businessName: 'Mughal Feast',
    businessType: 'Catering Service',
    city: 'Lucknow',
    submittedOn: '11 May 2024',
    documentsUploaded: 6,
    documentsRequired: 6,
    status: 'under_review',
    phone: '+91 98765 43222',
    email: 'sameer@mughalfeast.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1014',
    name: 'Neha Kapoor',
    businessName: 'Healthy Bowls',
    businessType: 'Meal Plan / Tiffin',
    city: 'Mumbai',
    submittedOn: '11 May 2024',
    documentsUploaded: 4,
    documentsRequired: 5,
    status: 'approved',
    phone: '+91 98765 43223',
    email: 'neha@healthybowls.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1015',
    name: 'Suresh Babu',
    businessName: 'South Feast',
    businessType: 'Home Chef',
    city: 'Chennai',
    submittedOn: '10 May 2024',
    documentsUploaded: 2,
    documentsRequired: 5,
    status: 'rejected',
    phone: '+91 98765 43224',
    email: 'suresh@southfeast.com',
    gst: 'Missing',
    pan: 'Pending',
  },
  {
    id: 'P-1016',
    name: 'Priya Sharma',
    businessName: 'Priya Foods',
    businessType: 'Cloud Kitchen',
    city: 'Delhi',
    submittedOn: '10 May 2024',
    documentsUploaded: 5,
    documentsRequired: 6,
    status: 'pending',
    phone: '+91 98765 43225',
    email: 'priya@priyafoods.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1017',
    name: 'Harish Gowda',
    businessName: 'Bangalore Buffets',
    businessType: 'Catering Service',
    city: 'Bengaluru',
    submittedOn: '09 May 2024',
    documentsUploaded: 6,
    documentsRequired: 6,
    status: 'approved',
    phone: '+91 98765 43226',
    email: 'harish@bangalorebuffets.com',
    gst: 'Verified',
    pan: 'Verified',
  },
  {
    id: 'P-1018',
    name: 'Meera Joshi',
    businessName: 'Gujarati Rasoi',
    businessType: 'Home Chef',
    city: 'Ahmedabad',
    submittedOn: '09 May 2024',
    documentsUploaded: 3,
    documentsRequired: 5,
    status: 'under_review',
    phone: '+91 98765 43227',
    email: 'meera@gujaratirasoi.com',
    gst: 'Not Applicable',
    pan: 'Verified',
  },
  {
    id: 'P-1019',
    name: 'Arjun Menon',
    businessName: 'Office Meals Co',
    businessType: 'Corporate Meals',
    city: 'Bengaluru',
    submittedOn: '08 May 2024',
    documentsUploaded: 4,
    documentsRequired: 6,
    status: 'pending',
    phone: '+91 98765 43228',
    email: 'arjun@officemeals.com',
    gst: 'Pending',
    pan: 'Verified',
  },
  {
    id: 'P-1020',
    name: 'Nisha Thomas',
    businessName: 'Taste Hub',
    businessType: 'Catering Service',
    city: 'Kochi',
    submittedOn: '08 May 2024',
    documentsUploaded: 1,
    documentsRequired: 5,
    status: 'rejected',
    phone: '+91 98765 43229',
    email: 'nisha@tastehub.com',
    gst: 'Missing',
    pan: 'Missing',
  },
];

export default function PartnerApprovalDemo() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const stats = useMemo(() => {
    return {
      pending: partners.filter((p) => p.status === 'pending').length,
      approved: partners.filter((p) => p.status === 'approved').length,
      underReview: partners.filter((p) => p.status === 'under_review').length,
      rejected: partners.filter((p) => p.status === 'rejected').length,
    };
  }, []);

  const columns: DataTableColumn<Partner>[] = [
    {
      key: 'partner',
      label: 'Partner',
      render: (row) => (
        <div style={styles.partnerCell}>
          <span style={styles.avatar}>{getInitials(row.name)}</span>
          <div>
            <strong style={styles.name}>{row.name}</strong>
            <p style={styles.sub}>{row.businessName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'businessType',
      label: 'Business Type',
      render: (row) => row.businessType,
    },
    {
      key: 'city',
      label: 'City',
      render: (row) => row.city,
    },
    {
      key: 'submittedOn',
      label: 'Submitted On',
      render: (row) => row.submittedOn,
    },
    {
      key: 'documents',
      label: 'Documents',
      render: (row) => (
        <span>
          {row.documentsUploaded} / {row.documentsRequired}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Partner Approval</h1>
          <p style={styles.pageSubtitle}>
            Review, verify, approve, or reject partner onboarding requests.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Pending" value={stats.pending} tone="purple" />
        <StatCard label="Approved" value={stats.approved} tone="green" />
        <StatCard label="Under Review" value={stats.underReview} tone="orange" />
        <StatCard label="Rejected" value={stats.rejected} tone="red" />
      </div>

      <DataTable
        title="Pending Partner Approvals"
        subtitle="Static demo data for now. Later this will come from backend APIs."
        data={partners}
        columns={columns}
        getRowKey={(row) => row.id}
        actions={[
          {
            label: 'View',
            icon: <EyeIcon size={15} />,
            onClick: (row) => setSelectedPartner(row),
          },
          {
            label: 'Approve',
            icon: <ApprovalIcon size={15} />,
            variant: 'primary',
            onClick: (row) => alert(`Approve ${row.name}`),
          },
          {
            label: 'Reject',
            icon: <RejectIcon size={15} />,
            variant: 'danger',
            onClick: (row) => alert(`Reject ${row.name}`),
          },
        ]}
      />

      {selectedPartner && (
        <PartnerProfileDrawer
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </div>
  );
}

function PartnerProfileDrawer({
  partner,
  onClose,
}: {
  partner: Partner;
  onClose: () => void;
}) {
  return (
    <div style={styles.drawerOverlay}>
      <button type="button" style={styles.drawerBackdrop} onClick={onClose} />

      <aside style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <div>
            <span style={styles.drawerAvatar}>{getInitials(partner.name)}</span>
            <h2 style={styles.drawerTitle}>{partner.name}</h2>
            <p style={styles.drawerSub}>{partner.businessName}</p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Business Details</h3>

          <InfoRow label="Business Type" value={partner.businessType} />
          <InfoRow label="City" value={partner.city} />
          <InfoRow label="Submitted On" value={partner.submittedOn} />
          <InfoRow label="Status" value={<StatusBadge status={partner.status} />} />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Contact Details</h3>

          <InfoRow label="Phone" value={partner.phone} />
          <InfoRow label="Email" value={partner.email} />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Documents</h3>

          <InfoRow
            label="Uploaded"
            value={`${partner.documentsUploaded} / ${partner.documentsRequired}`}
          />
          <InfoRow label="PAN" value={partner.pan} />
          <InfoRow label="GST" value={partner.gst} />
        </div>

        <div style={styles.drawerActions}>
          <button type="button" style={styles.rejectButton}>
            Reject Partner
          </button>

          <button type="button" style={styles.approveButton}>
            Approve Partner
          </button>
        </div>
      </aside>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={styles.infoRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'purple' | 'green' | 'orange' | 'red';
}) {
  const tones = {
    purple: ['#f3e8ff', '#7c3aed'],
    green: ['#dcfce7', '#15803d'],
    orange: ['#ffedd5', '#ea580c'],
    red: ['#fee2e2', '#dc2626'],
  };

  return (
    <div style={styles.statCard}>
      <span
        style={{
          ...styles.statIcon,
          background: tones[tone][0],
          color: tones[tone][1],
        }}
      >
        ●
      </span>

      <div>
        <strong style={styles.statValue}>{value}</strong>
        <p style={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((item) => item[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pageTitle: {
    margin: 0,
    fontSize: 26,
    fontWeight: 950,
    color: '#151126',
    letterSpacing: '-0.04em',
  },

  pageSubtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#64748b',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },

  statCard: {
    padding: 18,
    borderRadius: 20,
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    boxShadow: '0 14px 34px rgba(17, 24, 39, 0.04)',
    display: 'flex',
    gap: 14,
    alignItems: 'center',
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    display: 'block',
    fontSize: 24,
    fontWeight: 950,
    color: '#151126',
  },

  statLabel: {
    margin: 0,
    fontSize: 13,
    color: '#64748b',
  },

  partnerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 900,
  },

  name: {
    display: 'block',
    fontSize: 13,
    color: '#151126',
  },

  sub: {
    margin: '3px 0 0',
    fontSize: 12,
    color: '#64748b',
  },

  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 80,
  },

  drawerBackdrop: {
    position: 'absolute',
    inset: 0,
    border: 'none',
    background: 'rgba(15, 23, 42, 0.38)',
  },

  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 440,
    maxWidth: '92vw',
    background: '#ffffff',
    boxShadow: '-20px 0 50px rgba(15, 23, 42, 0.16)',
    padding: 24,
    overflowY: 'auto',
  },

  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 20,
    borderBottom: '1px solid #f1edf8',
  },

  drawerAvatar: {
    width: 58,
    height: 58,
    borderRadius: 999,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 950,
    marginBottom: 12,
  },

  drawerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
    color: '#151126',
  },

  drawerSub: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 14,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: '1px solid #ede9fe',
    background: '#ffffff',
    color: '#64748b',
    fontSize: 22,
    cursor: 'pointer',
  },

  drawerSection: {
    padding: '20px 0',
    borderBottom: '1px solid #f1edf8',
  },

  sectionTitle: {
    margin: '0 0 14px',
    fontSize: 15,
    fontWeight: 900,
    color: '#151126',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '10px 0',
    fontSize: 13,
    color: '#64748b',
  },

  drawerActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    paddingTop: 20,
  },

  rejectButton: {
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#dc2626',
    borderRadius: 14,
    padding: '13px 14px',
    fontWeight: 900,
    cursor: 'pointer',
  },

  approveButton: {
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    borderRadius: 14,
    padding: '13px 14px',
    fontWeight: 900,
    cursor: 'pointer',
  },
};