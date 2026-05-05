'use client';

import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
  EyeIcon,
  ApprovalIcon,
  RejectIcon,
} from '@/components/Icons/DashboardIcons';

import {
  useAdminPartner,
  useAdminPartners,
  useApprovePartner,
  useRejectPartner,
  useSuspendPartner,
} from '@catering-marketplace/query-client';

type PartnerStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'under_review'
  | 'suspended'
  | string;

type MetaOption = {
  id?: string;
  code?: string;
  label?: string;
  name?: string;
  description?: string;
};

type PartnerSummary = {
  id: string;
  userId?: string;
  name: string;
  businessName: string;
  businessType: string;
  partnerKind: string;
  city: string;
  submittedOn?: string;
  createdAt?: string;
  status: PartnerStatus;
  onboardingStatus?: string;
  currentStep?: string;
  documentsUploaded: number;
  documentsRequired: number;
  raw: any;
  avatarUrl?: string;
};

type PartnerDetailDTO = {
  id?: string;
  userId?: string;
  status?: PartnerStatus;
  onboardingStatus?: string;
  currentStep?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  basicProfile?: {
    contactName?: string;
    businessName?: string;
    businessDescription?: string;
    countryCode?: string;
    baseCityId?: string;
    baseCity?: MetaOption;
    kitchenAddress?: string;
    capacityRangeId?: string;
    capacityRange?: MetaOption;
    partnerType?: string;
  };

  businessProfile?: {
    legalName?: string;
    businessTypeId?: string;
    businessType?: MetaOption;
    individualTypeId?: string;
    individualType?: MetaOption;
    panNumber?: string;
    gstNumber?: string;
    fssaiNumber?: string;
  };

  serviceProfile?: {
    serviceTypeIds?: string[];
    serviceTypes?: MetaOption[];
    cuisineTypeIds?: string[];
    cuisineTypes?: MetaOption[];
    eventTypeIds?: string[];
    eventTypes?: MetaOption[];
    dietaryTypeIds?: string[];
    dietaryTypes?: MetaOption[];
  };

  serviceAreas?: Array<{
    country?: MetaOption;
    city?: MetaOption;
    zipCodes?: MetaOption[];
  }>;

  kyc?: {
    status?: string;
    pan?: DocumentDTO;
    gst?: DocumentDTO;
    fssai?: DocumentDTO;
    bankAccount?: {
      accountHolderName?: string;
      maskedAccountNo?: string;
      ifscCode?: string;
      bankName?: string;
      branchName?: string;
      upiId?: string;
      status?: string;
      provider?: string;
      providerRefId?: string;
      verifiedAt?: string;
    };
    documents?: DocumentDTO[];
    verifiedAt?: string;
    updatedAt?: string;
  };

  agreement?: {
    status?: string;
    agreementId?: string;
    agreementVersion?: string;
    agreementTitle?: string;
    agreementUrl?: string;
    acceptedByName?: string;
    acceptedAt?: string;
    ipAddress?: string;
  };

  media?: {
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
    gallery?: Array<{
      id?: string;
      url?: string;
      type?: string;
      sortOrder?: number;
    }>;
  };

  pricing?: {
    startingPrice?: number;
    currency?: string;
    priceUnit?: string;
    minimumOrderValue?: number;
  };

  packages?: Array<{
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    status?: string;
    photoUrl?: string;
  }>;

  approval?: {
    status?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    adminNotes?: string;
  };
};

type DocumentDTO = {
  id?: string;
  type?: string;
  number?: string;
  status?: string;
  documentUrl?: string;
  provider?: string;
  providerRefId?: string;
  verifiedAt?: string;
  uploadedAt?: string;
};

export default function PartnerApprovalPage() {
  const [selectedPartner, setSelectedPartner] = useState<PartnerSummary | null>(
    null
  );
  const [rejectPartner, setRejectPartner] = useState<PartnerSummary | null>(
    null
  );

  const {
    data: rawPartnersResponse,
    isLoading,
    error,
    refetch,
  } = useAdminPartners();

  console.log('Raw partners response:', rawPartnersResponse);
  const approveMutation = useApprovePartner();
  const suspendMutation = useSuspendPartner();

  const rejectMutation = useRejectPartner({
    onSuccess: () => {
      setRejectPartner(null);
      setSelectedPartner(null);
      refetch();
    },
  });

  const partners = useMemo(() => {
    return unwrapApiList<any>(rawPartnersResponse)
      .map(normalizePartnerSummary)
      .filter((partner) => Boolean(partner.id));
  }, [rawPartnersResponse]);

  const stats = useMemo(() => {
    return {
      pending: partners.filter((p) => normalizeStatus(p.status) === 'pending')
        .length,
      approved: partners.filter((p) => normalizeStatus(p.status) === 'approved')
        .length,
      underReview: partners.filter(
        (p) => normalizeStatus(p.status) === 'under_review'
      ).length,
      rejected: partners.filter((p) => normalizeStatus(p.status) === 'rejected')
        .length,
      suspended: partners.filter(
        (p) => normalizeStatus(p.status) === 'suspended'
      ).length,
    };
  }, [partners]);

  const columns: DataTableColumn<PartnerSummary>[] = [
    {
      key: 'partner',
      label: 'Partner',
      render: (row) => (
        <div style={styles.partnerCell}>
          {row.avatarUrl ? (
            <img
              src={row.avatarUrl}
              alt={row.name}
              style={styles.avatarImage}
            />
          ) : (
            <span style={styles.avatar}>{getInitials(row.name)}</span>
          )}

          <div>
            <strong style={styles.name}>{row.name}</strong>
            <p style={styles.sub}>{row.businessName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'partnerKind',
      label: 'Partner Type',
      render: (row) => prettyText(row.partnerKind),
    },
    {
      key: 'businessType',
      label: 'Business Type',
      render: (row) => row.businessType || '-',
    },
    {
      key: 'city',
      label: 'City',
      render: (row) => row.city || '-',
    },
    {
      key: 'submittedOn',
      label: 'Submitted On',
      render: (row) => formatDate(row.submittedOn || row.createdAt),
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
      render: (row) => <StatusBadge status={normalizeStatus(row.status)} />,
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Partner Approval</h1>
          <p style={styles.pageSubtitle}>
            Review partner profile, KYC documents, service details, and approve
            or reject onboarding.
          </p>
        </div>

        <button
          type="button"
          style={styles.refreshButton}
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Pending" value={stats.pending} tone="purple" />
        <StatCard label="Approved" value={stats.approved} tone="green" />
        <StatCard
          label="Under Review"
          value={stats.underReview}
          tone="orange"
        />
        <StatCard label="Rejected" value={stats.rejected} tone="red" />
        <StatCard label="Suspended" value={stats.suspended} tone="red" />
      </div>

      {error && (
        <div style={styles.errorBox}>
          {(error as Error).message || 'Unable to load partners'}
        </div>
      )}

      <DataTable
        title="Partner Approvals"
        subtitle={
          isLoading
            ? 'Loading partners...'
            : `${partners.length} partner onboarding requests found`
        }
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
            label: approveMutation.isPending ? 'Approving...' : 'Approve',
            icon: <ApprovalIcon size={15} />,
            variant: 'primary',
            disabled: (row: PartnerSummary) =>
              approveMutation.isPending ||
              suspendMutation.isPending ||
              normalizeStatus(row.status) === 'approved' ||
              normalizeStatus(row.status) === 'rejected' ||
              normalizeStatus(row.status) === 'suspended',
            onClick: (row) => {
              if (confirm(`Approve ${row.businessName || row.name}?`)) {
                approveMutation.mutate(row.id, {
                  onSuccess: () => refetch(),
                });
              }
            },
          },
          {
            label: 'Reject',
            icon: <RejectIcon size={15} />,
            variant: 'danger',
            disabled: (row: PartnerSummary) =>
              rejectMutation.isPending ||
              suspendMutation.isPending ||
              normalizeStatus(row.status) === 'approved' ||
              normalizeStatus(row.status) === 'rejected' ||
              normalizeStatus(row.status) === 'suspended',
            onClick: (row) => setRejectPartner(row),
          },
          {
            label: suspendMutation.isPending ? 'Suspending...' : 'Suspend',
            icon: <RejectIcon size={15} />,
            variant: 'danger',
            disabled: (row: PartnerSummary) =>
              suspendMutation.isPending ||
              normalizeStatus(row.status) === 'rejected' ||
              normalizeStatus(row.status) === 'suspended',
            onClick: (row) => {
              if (confirm(`Suspend ${row.businessName || row.name}?`)) {
                suspendMutation.mutate(row.id, {
                  onSuccess: () => refetch(),
                });
              }
            },
          },
        ]}
      />

      {selectedPartner && (
        <PartnerProfileDrawer
          partner={selectedPartner}
          isApproving={approveMutation.isPending}
          isSuspending={suspendMutation.isPending}
          onClose={() => setSelectedPartner(null)}
          onApprove={(partnerId) => {
            approveMutation.mutate(partnerId, {
              onSuccess: () => {
                setSelectedPartner(null);
                refetch();
              },
            });
          }}
          onReject={(partner) => {
            setSelectedPartner(null);
            setRejectPartner(partner);
          }}
          onSuspend={(partnerId) => {
            if (
              confirm(
                `Suspend ${selectedPartner.businessName || selectedPartner.name}?`
              )
            ) {
              suspendMutation.mutate(partnerId, {
                onSuccess: () => {
                  setSelectedPartner(null);
                  refetch();
                },
              });
            }
          }}
        />
      )}

      {rejectPartner && (
        <RejectPartnerModal
          partner={rejectPartner}
          isSubmitting={rejectMutation.isPending}
          error={(rejectMutation.error as Error | undefined)?.message}
          onClose={() => setRejectPartner(null)}
          onSubmit={(reason) => {
            rejectMutation.mutate({
              partnerId: rejectPartner.id,
              reason,
              notifyPartner: true,
            });
          }}
        />
      )}
    </div>
  );
}

function PartnerProfileDrawer({
  partner,
  isApproving,
  isSuspending,
  onClose,
  onApprove,
  onReject,
  onSuspend,
}: {
  partner: PartnerSummary;
  isApproving: boolean;
  isSuspending: boolean;
  onClose: () => void;
  onApprove: (partnerId: string) => void;
  onReject: (partner: PartnerSummary) => void;
  onSuspend: (partnerId: string) => void;
}) {
  const { data: rawDetail, isLoading, error } = useAdminPartner(partner.id);

  const detail = unwrapApiData<PartnerDetailDTO>(rawDetail);

  const displayName =
    detail?.basicProfile?.contactName ||
    detail?.user?.name ||
    partner.name ||
    'Unnamed Partner';

  const businessName =
    detail?.basicProfile?.businessName ||
    partner.businessName ||
    'Business name missing';

  const status = detail?.status || partner.status || '-';
  const normalizedStatus = normalizeStatus(status);

  const profilePhotoUrl = detail?.media?.profilePhotoUrl;

  return (
    <div style={styles.drawerOverlay}>
      <button
        type="button"
        aria-label="Close drawer"
        style={styles.drawerBackdrop}
        onClick={onClose}
      />

      <aside style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <div style={styles.drawerIdentity}>
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt={displayName}
                style={styles.drawerProfileImage}
              />
            ) : (
              <span style={styles.drawerAvatar}>
                {getInitials(displayName)}
              </span>
            )}

            <div>
              <h2 style={styles.drawerTitle}>{displayName}</h2>
              <p style={styles.drawerSub}>{businessName}</p>
              <div style={{ marginTop: 8 }}>
                <StatusBadge status={normalizedStatus} />
              </div>
            </div>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>

        {isLoading && <p style={styles.loadingText}>Loading full profile...</p>}

        {error && (
          <p style={styles.errorText}>
            Failed to load full partner profile. Showing summary where
            available.
          </p>
        )}

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Approval Status</h3>

          <InfoRow label="Partner ID" value={partner.id} />
          <InfoRow
            label="Status"
            value={<StatusBadge status={normalizedStatus} />}
          />
          <InfoRow
            label="Onboarding"
            value={detail?.onboardingStatus || partner.onboardingStatus || '-'}
          />
          <InfoRow
            label="Current Step"
            value={detail?.currentStep || partner.currentStep || '-'}
          />
          <InfoRow
            label="Submitted On"
            value={formatDate(detail?.submittedAt || partner.submittedOn)}
          />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Basic Profile</h3>

          <InfoRow label="Contact Name" value={displayName} />
          <InfoRow label="Business Name" value={businessName} />
          <InfoRow
            label="Partner Type"
            value={prettyText(
              detail?.basicProfile?.partnerType || partner.partnerKind
            )}
          />
          <InfoRow
            label="Description"
            value={detail?.basicProfile?.businessDescription || '-'}
          />
          <InfoRow
            label="City"
            value={
              detail?.basicProfile?.baseCity?.label ||
              detail?.basicProfile?.baseCity?.name ||
              partner.city ||
              '-'
            }
          />
          <InfoRow
            label="Kitchen Address"
            value={detail?.basicProfile?.kitchenAddress || '-'}
          />
          <InfoRow
            label="Capacity"
            value={
              detail?.basicProfile?.capacityRange?.label ||
              detail?.basicProfile?.capacityRange?.name ||
              '-'
            }
          />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Business / Legal Details</h3>

          <InfoRow
            label="Legal Name"
            value={detail?.businessProfile?.legalName || '-'}
          />
          <InfoRow
            label="Business Type"
            value={
              labelOf(detail?.businessProfile?.businessType) ||
              partner.businessType ||
              '-'
            }
          />
          <InfoRow
            label="Individual Type"
            value={labelOf(detail?.businessProfile?.individualType) || '-'}
          />
          <InfoRow
            label="PAN"
            value={
              detail?.businessProfile?.panNumber ||
              detail?.kyc?.pan?.number ||
              '-'
            }
          />
          <InfoRow
            label="GST"
            value={
              detail?.businessProfile?.gstNumber ||
              detail?.kyc?.gst?.number ||
              '-'
            }
          />
          <InfoRow
            label="FSSAI"
            value={
              detail?.businessProfile?.fssaiNumber ||
              detail?.kyc?.fssai?.number ||
              '-'
            }
          />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Service Profile</h3>

          <InfoRow
            label="Service Types"
            value={renderList(detail?.serviceProfile?.serviceTypes)}
          />
          <InfoRow
            label="Cuisines"
            value={renderList(detail?.serviceProfile?.cuisineTypes)}
          />
          <InfoRow
            label="Events"
            value={renderList(detail?.serviceProfile?.eventTypes)}
          />
          <InfoRow
            label="Dietary"
            value={renderList(detail?.serviceProfile?.dietaryTypes)}
          />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Service Areas</h3>

          {detail?.serviceAreas?.length ? (
            detail.serviceAreas.map((area, index) => (
              <div key={index} style={styles.serviceAreaCard}>
                <strong>{labelOf(area.city) || '-'}</strong>
                <p>
                  {area.zipCodes
                    ?.map((zip) => zip.label || zip.code)
                    .join(', ') || 'No zip codes'}
                </p>
              </div>
            ))
          ) : (
            <p style={styles.emptyText}>No service areas available.</p>
          )}
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>KYC Documents</h3>

          <DocumentRow label="PAN" document={detail?.kyc?.pan} />
          <DocumentRow label="GST" document={detail?.kyc?.gst} />
          <DocumentRow label="FSSAI" document={detail?.kyc?.fssai} />

          <InfoRow
            label="KYC Status"
            value={prettyText(detail?.kyc?.status || '-')}
          />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Bank Details</h3>

          <InfoRow
            label="Account Holder"
            value={detail?.kyc?.bankAccount?.accountHolderName || '-'}
          />
          <InfoRow
            label="Account No"
            value={detail?.kyc?.bankAccount?.maskedAccountNo || '-'}
          />
          <InfoRow
            label="IFSC"
            value={detail?.kyc?.bankAccount?.ifscCode || '-'}
          />
          <InfoRow
            label="Bank"
            value={detail?.kyc?.bankAccount?.bankName || '-'}
          />
          <InfoRow label="UPI" value={detail?.kyc?.bankAccount?.upiId || '-'} />
          <InfoRow
            label="Bank Status"
            value={prettyText(detail?.kyc?.bankAccount?.status || '-')}
          />
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Agreement</h3>

          <InfoRow
            label="Status"
            value={prettyText(detail?.agreement?.status || '-')}
          />
          <InfoRow
            label="Version"
            value={detail?.agreement?.agreementVersion || '-'}
          />
          <InfoRow
            label="Accepted By"
            value={detail?.agreement?.acceptedByName || '-'}
          />
          <InfoRow
            label="Accepted At"
            value={formatDate(detail?.agreement?.acceptedAt)}
          />

          {detail?.agreement?.agreementUrl && (
            <a
              href={detail.agreement.agreementUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              View Agreement
            </a>
          )}
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Pricing & Packages</h3>

          <InfoRow
            label="Starting Price"
            value={formatCurrency(
              detail?.pricing?.startingPrice,
              detail?.pricing?.currency
            )}
          />
          <InfoRow
            label="Price Unit"
            value={prettyText(detail?.pricing?.priceUnit || '-')}
          />
          <InfoRow
            label="Minimum Order"
            value={formatCurrency(
              detail?.pricing?.minimumOrderValue,
              detail?.pricing?.currency
            )}
          />

          {detail?.packages?.length ? (
            detail.packages.map((pkg) => (
              <div key={pkg.id || pkg.name} style={styles.packageCard}>
                <strong>{pkg.name}</strong>
                <p>{pkg.description || '-'}</p>
                <span>{formatCurrency(pkg.price, pkg.currency)}</span>
              </div>
            ))
          ) : (
            <p style={styles.emptyText}>No packages available.</p>
          )}
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Media</h3>

          {detail?.media?.coverPhotoUrl && (
            <img
              src={detail.media.coverPhotoUrl}
              alt="Cover"
              style={styles.coverImage}
            />
          )}

          {detail?.media?.gallery?.length ? (
            <div style={styles.galleryGrid}>
              {detail.media.gallery.map((image) => (
                <img
                  key={image.id || image.url}
                  src={image.url}
                  alt="Partner media"
                  style={styles.galleryImage}
                />
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No gallery photos available.</p>
          )}
        </div>

        <div style={styles.drawerSection}>
          <h3 style={styles.sectionTitle}>Admin Review</h3>

          <InfoRow
            label="Approval Status"
            value={prettyText(detail?.approval?.status || '-')}
          />
          <InfoRow
            label="Reviewed At"
            value={formatDate(detail?.approval?.reviewedAt)}
          />
          <InfoRow label="Notes" value={detail?.approval?.adminNotes || '-'} />
        </div>

        <div style={styles.drawerActions}>
          <button
            type="button"
            onClick={() => onReject(partner)}
            disabled={
              normalizedStatus === 'approved' ||
              normalizedStatus === 'rejected' ||
              normalizedStatus === 'suspended'
            }
            style={{
              ...styles.rejectButton,
              ...(normalizedStatus === 'approved' ||
              normalizedStatus === 'rejected' ||
              normalizedStatus === 'suspended'
                ? styles.disabledButton
                : {}),
            }}
          >
            Reject Partner
          </button>

          <button
            type="button"
            onClick={() => onSuspend(partner.id)}
            disabled={
              isSuspending ||
              normalizedStatus === 'rejected' ||
              normalizedStatus === 'suspended'
            }
            style={{
              ...styles.suspendButton,
              ...(isSuspending ||
              normalizedStatus === 'rejected' ||
              normalizedStatus === 'suspended'
                ? styles.disabledButton
                : {}),
            }}
          >
            {isSuspending ? 'Suspending...' : 'Suspend Partner'}
          </button>

          <button
            type="button"
            onClick={() => onApprove(partner.id)}
            disabled={
              isApproving ||
              normalizedStatus === 'approved' ||
              normalizedStatus === 'rejected' ||
              normalizedStatus === 'suspended'
            }
            style={{
              ...styles.approveButton,
              ...(isApproving ||
              normalizedStatus === 'approved' ||
              normalizedStatus === 'rejected' ||
              normalizedStatus === 'suspended'
                ? styles.disabledButton
                : {}),
            }}
          >
            {isApproving ? 'Approving...' : 'Approve Partner'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function RejectPartnerModal({
  partner,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: {
  partner: PartnerSummary;
  isSubmitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <div style={styles.modalOverlay}>
      <button
        type="button"
        aria-label="Close reject modal"
        style={styles.modalBackdrop}
        onClick={onClose}
      />

      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Reject Partner</h2>

        <p style={styles.modalText}>
          Please provide a clear reason for rejecting{' '}
          <strong>{partner.businessName || partner.name}</strong>.
        </p>

        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Example: PAN document is unclear or GST number does not match legal name."
          rows={5}
          style={styles.textarea}
        />

        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={styles.cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting || !reason.trim()}
            onClick={() => onSubmit(reason.trim())}
            style={{
              ...styles.rejectButton,
              ...(isSubmitting || !reason.trim() ? styles.disabledButton : {}),
            }}
          >
            {isSubmitting ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({
  label,
  document,
}: {
  label: string;
  document?: DocumentDTO;
}) {
  return (
    <div style={styles.documentRow}>
      <div>
        <strong>{label}</strong>
        <p>{document?.number || '-'}</p>
      </div>

      <div style={styles.documentRight}>
        <StatusBadge status={normalizeStatus(document?.status || 'pending')} />

        {document?.documentUrl && (
          <a
            href={document.documentUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            View
          </a>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
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

function normalizePartnerSummary(raw: any): PartnerSummary {
  const basic = raw?.basicProfile || raw?.basic_profile || {};
  const business = raw?.businessProfile || raw?.business_profile || {};
  const kyc = raw?.kyc || {};
  const serviceAreas = raw?.serviceAreas || raw?.service_areas || [];

  const documents = [
    kyc?.pan,
    kyc?.gst,
    kyc?.fssai,
    kyc?.bankAccount,
    ...(Array.isArray(kyc?.documents) ? kyc.documents : []),
  ].filter(Boolean);

  return {
    id: String(raw?.id || ''),
    userId: raw?.userId || raw?.user_id,
    name:
      raw?.name ||
      raw?.contactName ||
      raw?.contact_name ||
      basic?.contactName ||
      basic?.contact_name ||
      raw?.user?.name ||
      'Unnamed Partner',
    businessName:
      raw?.businessName ||
      raw?.business_name ||
      basic?.businessName ||
      basic?.business_name ||
      business?.legalName ||
      business?.legal_name ||
      'Business name missing',
    businessType:
      labelOf(raw?.businessType) ||
      labelOf(raw?.business_type) ||
      labelOf(business?.businessType) ||
      labelOf(business?.business_type) ||
      '-',
    partnerKind:
      raw?.partnerType ||
      raw?.partner_type ||
      basic?.partnerType ||
      basic?.partner_type ||
      '-',
    city:
      raw?.city ||
      labelOf(raw?.baseCity) ||
      labelOf(raw?.base_city) ||
      labelOf(basic?.baseCity) ||
      labelOf(basic?.base_city) ||
      labelOf(serviceAreas?.[0]?.city) ||
      '-',
    submittedOn: raw?.submittedAt || raw?.submitted_at,
    createdAt: raw?.createdAt || raw?.created_at,
    status: normalizeStatus(raw?.approval?.status || raw?.status),
    onboardingStatus: raw?.onboardingStatus || raw?.onboarding_status,
    currentStep: raw?.currentStep || raw?.current_step,
    documentsUploaded:
      raw?.documentsUploaded ??
      raw?.documents_uploaded ??
      documents.filter((doc: any) => doc?.status && doc.status !== 'missing')
        .length,
    documentsRequired: raw?.documentsRequired ?? raw?.documents_required ?? 4,
    raw,
    avatarUrl:
      raw?.profilePhotoUrl ||
      raw?.profile_photo_url ||
      raw?.avatarUrl ||
      raw?.avatar_url ||
      raw?.user?.avatarUrl ||
      raw?.user?.avatar_url,
  };
}

function unwrapApiData<T>(response: any): T | undefined {
  if (!response) return undefined;
  if (response.data?.data) return response.data.data as T;
  if (response.data) return response.data as T;
  return response as T;
}

function unwrapApiList<T>(response: any): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response as T[];
  if (Array.isArray(response.data)) return response.data as T[];
  if (Array.isArray(response.data?.data)) return response.data.data as T[];
  if (Array.isArray(response.items)) return response.items as T[];
  if (Array.isArray(response.results)) return response.results as T[];
  return [];
}

function normalizeStatus(status?: string): any {
  const value = String(status || 'pending').toLowerCase();

  if (value === 'submitted') return 'pending';
  if (value === 'pending_review') return 'pending';
  if (value === 'review' || value === 'in_review') return 'under_review';
  if (value === 'active') return 'approved';
  if (value === 'verified') return 'approved';
  if (value === 'accepted') return 'approved';
  if (value === 'missing' || value === 'invalid') return 'rejected';

  return value;
}

function labelOf(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.label || value.name || value.code || '';
}

function renderList(items?: MetaOption[]) {
  if (!items?.length) return '-';

  return (
    <div style={styles.tagList}>
      {items.map((item) => (
        <span key={item.id || item.code || item.label} style={styles.tag}>
          {labelOf(item)}
        </span>
      ))}
    </div>
  );
}

function getInitials(name?: string) {
  return String(name || 'P')
    .split(' ')
    .filter(Boolean)
    .map((item) => item[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function prettyText(value?: string) {
  if (!value) return '-';

  return String(value)
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value?: number, currency = 'INR') {
  if (value === undefined || value === null) return '-';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
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
    gap: 16,
  },

  pageTitle: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: '#151126',
    letterSpacing: '-0.04em',
  },

  pageSubtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#64748b',
  },

  refreshButton: {
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#7c3aed',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
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
    fontWeight: 700,
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
    fontWeight: 800,
  },

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 999,
    objectFit: 'cover',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
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

  errorBox: {
    padding: 14,
    borderRadius: 14,
    background: '#fff1f2',
    color: '#dc2626',
    border: '1px solid #fecdd3',
    fontSize: 13,
    fontWeight: 600,
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
    width: 520,
    maxWidth: '94vw',
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

  drawerIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  drawerAvatar: {
    width: 62,
    height: 62,
    borderRadius: 999,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 800,
    flexShrink: 0,
  },

  drawerProfileImage: {
    width: 62,
    height: 62,
    borderRadius: 999,
    objectFit: 'cover',
    flexShrink: 0,
  },

  drawerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
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
    fontWeight: 700,
    color: '#151126',
  },

  infoRow: {
    display: 'grid',
    gridTemplateColumns: '145px 1fr',
    gap: 16,
    padding: '9px 0',
    fontSize: 13,
    color: '#64748b',
    alignItems: 'start',
  },

  serviceAreaCard: {
    border: '1px solid #eee9f7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    color: '#151126',
  },

  documentRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '12px 0',
    borderBottom: '1px solid #f8f5fc',
  },

  documentRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  packageCard: {
    border: '1px solid #eee9f7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  coverImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
    borderRadius: 14,
    marginBottom: 12,
  },

  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },

  galleryImage: {
    width: '100%',
    height: 86,
    objectFit: 'cover',
    borderRadius: 12,
  },

  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },

  tag: {
    padding: '5px 8px',
    borderRadius: 999,
    background: '#f3e8ff',
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: 700,
  },

  link: {
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
  },

  emptyText: {
    margin: 0,
    color: '#94a3b8',
    fontSize: 13,
  },

  loadingText: {
    margin: '18px 0 0',
    color: '#64748b',
    fontSize: 13,
  },

  errorText: {
    color: '#dc2626',
    fontSize: 13,
    lineHeight: 1.45,
  },

  drawerActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
    paddingTop: 20,
  },

  rejectButton: {
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#dc2626',
    borderRadius: 14,
    padding: '13px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  suspendButton: {
    border: '1px solid #fed7aa',
    background: '#fff7ed',
    color: '#c2410c',
    borderRadius: 14,
    padding: '13px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  approveButton: {
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    borderRadius: 14,
    padding: '13px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  disabledButton: {
    opacity: 0.55,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 90,
  },

  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    border: 'none',
    background: 'rgba(15, 23, 42, 0.48)',
  },

  modal: {
    position: 'relative',
    maxWidth: 460,
    margin: '10vh auto',
    background: '#ffffff',
    borderRadius: 20,
    padding: 22,
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.22)',
  },

  modalTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#151126',
  },

  modalText: {
    margin: '10px 0 16px',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.5,
  },

  textarea: {
    width: '100%',
    border: '1px solid #eee9f7',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
  },

  modalActions: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },

  cancelButton: {
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#475569',
    borderRadius: 12,
    padding: '11px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
