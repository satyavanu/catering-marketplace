'use client';

import React, { useMemo, useState } from 'react';
import {
  type AdminPartnerServiceFilters,
  type PartnerService,
  type PartnerServiceStatus,
  useAdminPartnerServices,
  useApprovePartnerService,
  useDeactivatePartnerService,
  useRejectPartnerService,
} from '@catering-marketplace/query-client';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';
import {
  ApprovalIcon,
  RejectIcon,
  ServicesIcon,
} from '@/components/Icons/DashboardIcons';

type StatusFilter = PartnerServiceStatus | 'all';

const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'all', label: 'All' },
];

const statusStyles: Record<
  PartnerServiceStatus,
  { label: string; bg: string; color: string }
> = {
  draft: { label: 'Draft', bg: '#f1f5f9', color: '#475569' },
  under_review: { label: 'Under Review', bg: '#fef3c7', color: '#b45309' },
  approved: { label: 'Approved', bg: '#dcfce7', color: '#15803d' },
  rejected: { label: 'Rejected', bg: '#fee2e2', color: '#b91c1c' },
  inactive: { label: 'Inactive', bg: '#e2e8f0', color: '#334155' },
};

function formatCurrency(value: number | null, currency = 'INR') {
  if (value === null || value === undefined) return 'Custom quote';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function getServiceAreas(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return '';

      const record = item as Record<string, unknown>;
      return String(record.area || record.name || record.city || '');
    })
    .filter(Boolean);
}

function getAttributeList(
  attributes: Record<string, unknown>,
  key: string
): string[] {
  const value = attributes[key];
  return Array.isArray(value) ? value.map(String) : [];
}

function normalizeServiceList(value: unknown): PartnerService[] {
  if (Array.isArray(value)) return value as PartnerService[];

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as PartnerService[];
    if (Array.isArray(record.items)) return record.items as PartnerService[];
  }

  return [];
}

export default function AdminServiceApprovalsPage() {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('under_review');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<PartnerService | null>(
    null
  );
  const [rejectingService, setRejectingService] =
    useState<PartnerService | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState('');

  const { serviceTypes, getServiceType, getExperienceType } =
    useServiceCatalogMetaContext();

  const filters: AdminPartnerServiceFilters = {
    status: statusFilter === 'all' ? undefined : statusFilter,
    service_key: serviceFilter === 'all' ? undefined : serviceFilter,
  };

  const {
    data: rawServices,
    isLoading,
    error,
  } = useAdminPartnerServices(filters);
  const services = useMemo(
    () => normalizeServiceList(rawServices),
    [rawServices]
  );
  const approveMutation = useApprovePartnerService();
  const rejectMutation = useRejectPartnerService();
  const deactivateMutation = useDeactivatePartnerService();
  const isMutating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    deactivateMutation.isPending;

  const counts = useMemo(
    () =>
      services.reduce(
        (result, service) => ({
          ...result,
          [service.status]: (result[service.status] || 0) + 1,
        }),
        {} as Partial<Record<PartnerServiceStatus, number>>
      ),
    [services]
  );

  const handleApprove = async (service: PartnerService) => {
    setActionError('');
    try {
      await approveMutation.mutateAsync(service.id);
      if (selectedService?.id === service.id) setSelectedService(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to approve service'
      );
    }
  };

  const handleDeactivate = async (service: PartnerService) => {
    setActionError('');
    try {
      await deactivateMutation.mutateAsync(service.id);
      if (selectedService?.id === service.id) setSelectedService(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to deactivate service'
      );
    }
  };

  const handleReject = async () => {
    if (!rejectingService || !rejectReason.trim()) return;

    setActionError('');
    try {
      await rejectMutation.mutateAsync({
        serviceId: rejectingService.id,
        reason: rejectReason.trim(),
      });
      if (selectedService?.id === rejectingService.id) setSelectedService(null);
      setRejectingService(null);
      setRejectReason('');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to reject service'
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <ServicesIcon size={24} />
        </div>
        <div>
          <h1 style={styles.title}>Service Approvals</h1>
          <p style={styles.subtitle}>
            Review partner service listings before they become bookable.
          </p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.tabs}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              style={{
                ...styles.tab,
                ...(statusFilter === tab.key ? styles.activeTab : {}),
              }}
            >
              {tab.label}
              {tab.key !== 'all' && counts[tab.key] ? (
                <span style={styles.tabCount}>{counts[tab.key]}</span>
              ) : null}
            </button>
          ))}
        </div>

        <select
          value={serviceFilter}
          onChange={(event) => setServiceFilter(event.target.value)}
          style={styles.select}
        >
          <option value="all">All service types</option>
          {serviceTypes.map((serviceType) => (
            <option key={serviceType.key} value={serviceType.key}>
              {serviceType.label}
            </option>
          ))}
        </select>
      </div>

      {actionError && <div style={styles.error}>{actionError}</div>}
      {error && <div style={styles.error}>{error.message}</div>}

      <section style={styles.panel}>
        {isLoading ? (
          <div style={styles.empty}>Loading service approvals...</div>
        ) : services.length === 0 ? (
          <div style={styles.empty}>No services found for this filter.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Areas</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Updated</th>
                  <th style={styles.thRight}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    serviceLabel={
                      getServiceType(service.service_key)?.label ||
                      service.service_key
                    }
                    experienceLabel={
                      getExperienceType(service.experience_type_key)?.label ||
                      service.experience_type_key ||
                      '-'
                    }
                    onView={() => setSelectedService(service)}
                    onApprove={() => handleApprove(service)}
                    onReject={() => {
                      setRejectingService(service);
                      setRejectReason('');
                    }}
                    onDeactivate={() => handleDeactivate(service)}
                    isMutating={isMutating}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedService && (
        <ServiceDrawer
          service={selectedService}
          serviceLabel={
            getServiceType(selectedService.service_key)?.label ||
            selectedService.service_key
          }
          experienceLabel={
            getExperienceType(selectedService.experience_type_key)?.label ||
            selectedService.experience_type_key ||
            '-'
          }
          onClose={() => setSelectedService(null)}
          onApprove={() => handleApprove(selectedService)}
          onReject={() => {
            setRejectingService(selectedService);
            setRejectReason('');
          }}
          onDeactivate={() => handleDeactivate(selectedService)}
          isMutating={isMutating}
        />
      )}

      {rejectingService && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Reject service</h2>
            <p style={styles.modalCopy}>
              Add a clear reason so the partner knows what to fix.
            </p>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={5}
              style={styles.textarea}
              placeholder="Example: Please add clearer photos and complete service area details."
            />
            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => setRejectingService(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  ...styles.dangerButton,
                  ...(!rejectReason.trim() || isMutating
                    ? styles.disabledButton
                    : {}),
                }}
                disabled={!rejectReason.trim() || isMutating}
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceRow({
  service,
  serviceLabel,
  experienceLabel,
  onView,
  onApprove,
  onReject,
  onDeactivate,
  isMutating,
}: {
  service: PartnerService;
  serviceLabel: string;
  experienceLabel: string;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDeactivate: () => void;
  isMutating: boolean;
}) {
  const areas = getServiceAreas(service.service_areas);

  return (
    <tr style={styles.tr}>
      <td style={styles.td}>
        <strong style={styles.serviceTitle}>{service.title}</strong>
        <span style={styles.muted}>{service.short_description || '-'}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.typePill}>{serviceLabel}</span>
        <span style={styles.muted}>{experienceLabel}</span>
      </td>
      <td style={styles.td}>
        {formatCurrency(service.base_price, service.currency_code)}
      </td>
      <td style={styles.td}>
        {areas.length > 0 ? `${areas.slice(0, 2).join(', ')}` : '-'}
        {areas.length > 2 ? ` +${areas.length - 2}` : ''}
      </td>
      <td style={styles.td}>
        <StatusBadge status={service.status} />
      </td>
      <td style={styles.td}>{formatDate(service.updated_at)}</td>
      <td style={styles.tdRight}>
        <button type="button" style={styles.linkButton} onClick={onView}>
          Review
        </button>
        {service.status === 'under_review' && (
          <>
            <button
              type="button"
              style={styles.approveButton}
              onClick={onApprove}
              disabled={isMutating}
            >
              Approve
            </button>
            <button
              type="button"
              style={styles.rejectButton}
              onClick={onReject}
              disabled={isMutating}
            >
              Reject
            </button>
          </>
        )}
        {service.status === 'approved' && (
          <button
            type="button"
            style={styles.rejectButton}
            onClick={onDeactivate}
            disabled={isMutating}
          >
            Deactivate
          </button>
        )}
      </td>
    </tr>
  );
}

function ServiceDrawer({
  service,
  serviceLabel,
  experienceLabel,
  onClose,
  onApprove,
  onReject,
  onDeactivate,
  isMutating,
}: {
  service: PartnerService;
  serviceLabel: string;
  experienceLabel: string;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDeactivate: () => void;
  isMutating: boolean;
}) {
  const areas = getServiceAreas(service.service_areas);
  const cuisines = getAttributeList(service.attributes, 'cuisines');
  const dietTypes = getAttributeList(service.attributes, 'diet_types');
  const serviceStyles = getAttributeList(service.attributes, 'service_styles');

  return (
    <aside style={styles.drawer}>
      <div style={styles.drawerHeader}>
        <div>
          <span style={styles.typePill}>{serviceLabel}</span>
          <h2 style={styles.drawerTitle}>{service.title}</h2>
          <p style={styles.drawerSub}>{experienceLabel}</p>
        </div>
        <button type="button" style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>

      <div style={styles.drawerBody}>
        <InfoRow label="Partner ID" value={service.partner_id} />
        <InfoRow
          label="Status"
          value={<StatusBadge status={service.status} />}
        />
        <InfoRow
          label="Pricing"
          value={formatCurrency(service.base_price, service.currency_code)}
        />
        <InfoRow label="Booking" value={service.booking_type} />
        <InfoRow label="Updated" value={formatDate(service.updated_at)} />

        <section style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.bodyText}>{service.description || '-'}</p>
        </section>

        <section style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Service Areas</h3>
          <TagList items={areas} empty="No service areas added" />
        </section>

        <section style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Attributes</h3>
          <InfoRow label="Cuisines" value={<TagList items={cuisines} />} />
          <InfoRow label="Diet tags" value={<TagList items={dietTypes} />} />
          <InfoRow
            label="Service styles"
            value={<TagList items={serviceStyles} />}
          />
        </section>

        {service.rejection_reason && (
          <section style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Rejection Reason</h3>
            <p style={styles.bodyText}>{service.rejection_reason}</p>
          </section>
        )}
      </div>

      <div style={styles.drawerActions}>
        {service.status === 'under_review' && (
          <>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={onApprove}
              disabled={isMutating}
            >
              <ApprovalIcon size={15} />
              Approve
            </button>
            <button
              type="button"
              style={styles.dangerButton}
              onClick={onReject}
              disabled={isMutating}
            >
              <RejectIcon size={15} />
              Reject
            </button>
          </>
        )}
        {service.status === 'approved' && (
          <button
            type="button"
            style={styles.dangerButton}
            onClick={onDeactivate}
            disabled={isMutating}
          >
            Deactivate
          </button>
        )}
      </div>
    </aside>
  );
}

function StatusBadge({ status }: { status: PartnerServiceStatus }) {
  const style = statusStyles[status];

  return (
    <span
      style={{
        ...styles.status,
        background: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

function TagList({ items, empty = '-' }: { items: string[]; empty?: string }) {
  if (items.length === 0) return <span style={styles.muted}>{empty}</span>;

  return (
    <div style={styles.tags}>
      {items.map((item) => (
        <span key={item} style={styles.tag}>
          {item}
        </span>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: '#111827',
    letterSpacing: 0,
  },
  subtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 14,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    height: 38,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#475569',
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
  },
  activeTab: {
    borderColor: '#4f46e5',
    color: '#3730a3',
    background: '#eef2ff',
  },
  tabCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    background: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
  },
  select: {
    height: 38,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '0 12px',
    background: '#ffffff',
    color: '#334155',
    fontSize: 13,
    fontWeight: 600,
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 960,
  },
  th: {
    textAlign: 'left',
    padding: '13px 15px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  thRight: {
    textAlign: 'right',
    padding: '13px 15px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 15px',
    verticalAlign: 'middle',
    color: '#334155',
    fontSize: 13,
  },
  tdRight: {
    padding: '14px 15px',
    verticalAlign: 'middle',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  serviceTitle: {
    display: 'block',
    color: '#111827',
    fontSize: 14,
    marginBottom: 4,
  },
  muted: {
    display: 'block',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 500,
  },
  typePill: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 24,
    padding: '0 9px',
    borderRadius: 999,
    background: '#f1f5f9',
    color: '#334155',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 4,
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 24,
    padding: '0 9px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#4f46e5',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    marginRight: 8,
  },
  approveButton: {
    border: 'none',
    background: '#16a34a',
    color: '#ffffff',
    borderRadius: 7,
    height: 32,
    padding: '0 11px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
    marginRight: 7,
  },
  rejectButton: {
    border: 'none',
    background: '#fee2e2',
    color: '#b91c1c',
    borderRadius: 7,
    height: 32,
    padding: '0 11px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  empty: {
    padding: 34,
    textAlign: 'center',
    color: '#64748b',
    fontWeight: 600,
  },
  error: {
    padding: '12px 14px',
    borderRadius: 8,
    background: '#fee2e2',
    color: '#991b1b',
    fontSize: 13,
    fontWeight: 700,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 'min(520px, 100vw)',
    height: '100vh',
    background: '#ffffff',
    borderLeft: '1px solid #e2e8f0',
    zIndex: 50,
    boxShadow: '-20px 0 50px rgba(15, 23, 42, 0.16)',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    padding: 22,
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
  },
  drawerTitle: {
    margin: '8px 0 4px',
    fontSize: 22,
    color: '#111827',
    letterSpacing: 0,
  },
  drawerSub: {
    margin: 0,
    color: '#64748b',
    fontSize: 13,
  },
  closeButton: {
    alignSelf: 'flex-start',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#334155',
    borderRadius: 8,
    height: 34,
    padding: '0 11px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  drawerBody: {
    padding: 22,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  drawerActions: {
    marginTop: 'auto',
    padding: 18,
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: 10,
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '125px 1fr',
    gap: 12,
    alignItems: 'start',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: 700,
    overflowWrap: 'anywhere',
  },
  detailSection: {
    paddingTop: 10,
    borderTop: '1px solid #f1f5f9',
  },
  sectionTitle: {
    margin: '0 0 9px',
    fontSize: 14,
    color: '#111827',
    letterSpacing: 0,
  },
  bodyText: {
    margin: 0,
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.6,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    display: 'inline-flex',
    height: 24,
    alignItems: 'center',
    borderRadius: 999,
    padding: '0 9px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: 12,
    fontWeight: 700,
  },
  primaryButton: {
    height: 38,
    border: 'none',
    background: '#16a34a',
    color: '#ffffff',
    borderRadius: 8,
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  secondaryButton: {
    height: 38,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#334155',
    borderRadius: 8,
    padding: '0 14px',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  dangerButton: {
    height: 38,
    border: 'none',
    background: '#dc2626',
    color: '#ffffff',
    borderRadius: 8,
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  disabledButton: {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 60,
    background: 'rgba(15, 23, 42, 0.44)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    width: 'min(460px, 100%)',
    background: '#ffffff',
    borderRadius: 8,
    padding: 22,
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.22)',
  },
  modalTitle: {
    margin: 0,
    fontSize: 20,
    color: '#111827',
    letterSpacing: 0,
  },
  modalCopy: {
    margin: '8px 0 14px',
    color: '#64748b',
    fontSize: 13,
  },
  textarea: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
};
