'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  type PartnerServiceAddon,
  type PartnerServiceMenuItem,
  type PartnerServiceMenuSection,
  type PartnerServicePricingTier,
  useMyPartnerService,
  useSubmitPartnerService,
} from '@catering-marketplace/query-client';
import DashboardStatusBadge from '@/components/dashboard/DashboardStatusBadge';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';

export default function CateringServiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serviceId = params?.id;
  const { getServiceType, getExperienceType } = useServiceCatalogMetaContext();
  const { data: service, isLoading, error } = useMyPartnerService(serviceId);
  const submitService = useSubmitPartnerService();

  if (isLoading) return <div style={styles.panel}>Loading service...</div>;
  if (error || !service)
    return <div style={styles.panel}>Service not found.</div>;

  const serviceType = getServiceType(service.service_key);
  const experienceType = getExperienceType(service.experience_type_key);
  const attributes = service.attributes || {};
  const media = normalizeMedia(service.media || []);
  const packages = service.pricing_tiers || [];
  const menuSections = [...(service.menu_sections || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const addons = [...(service.addons || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const areas = getArray(service.service_areas);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <button
            type="button"
            style={styles.backButton}
            onClick={() => router.push('/partner/services')}
          >
            Back to services
          </button>
          <h1 style={styles.title}>{service.title}</h1>
          <p style={styles.subtitle}>
            {serviceType?.label || 'Catering'}
            {experienceType ? ` - ${experienceType.label}` : ''}
          </p>
        </div>
        <div style={styles.actions}>
          <DashboardStatusBadge
            status={
              !service.is_active || service.status === 'inactive'
                ? 'paused'
                : (service.status as any)
            }
          />
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() =>
              router.push(`/partner/services/catering/${service.id}/edit`)
            }
          >
            Edit
          </button>
          {(service.status === 'draft' || service.status === 'rejected') && (
            <button
              type="button"
              style={styles.primaryButton}
              disabled={submitService.isPending}
              onClick={() => submitService.mutate(service.id)}
            >
              {submitService.isPending ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Overview</h2>
        <div style={styles.grid}>
          <Info label="Short description" value={service.short_description} />
          <Info
            label="Booking type"
            value={formatLabel(service.booking_type)}
          />
          <Info label="Pricing" value={formatPrice(service)} />
          <Info
            label="Guest range"
            value={`${service.min_guests || 1}-${service.max_guests || 'many'}`}
          />
          <Info
            label="Advance notice"
            value={`${service.advance_notice_hours || 0} hours`}
          />
          <Info label="City" value={String(attributes.city || '-')} />
        </div>
        {service.description && (
          <p style={styles.description}>{service.description}</p>
        )}
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Service photos</h2>
        {media.length > 0 ? (
          <div style={styles.imageGrid}>
            {media.map((image, index) => (
              <div key={`${image.url}-${index}`} style={styles.imageTile}>
                <img
                  src={image.url}
                  alt="Catering service"
                  style={styles.image}
                />
                {index === 0 && <span style={styles.coverBadge}>Cover</span>}
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No service photos uploaded yet.</p>
        )}
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Catering details</h2>
        <div style={styles.grid}>
          <Info
            label="Event types"
            value={formatList(getArray(attributes.event_types))}
          />
          <Info
            label="Cuisines"
            value={formatList(getArray(attributes.cuisines))}
          />
          <Info
            label="Diet options"
            value={formatList(getArray(attributes.diet_types))}
          />
          <Info
            label="Service styles"
            value={formatList(getArray(attributes.service_styles))}
          />
          <Info label="Delivery areas" value={formatAreas(areas)} />
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Packages</h2>
        {packages.length > 0 ? (
          <div style={styles.sectionList}>
            {[...packages]
              .sort((a, b) => a.min_guests - b.min_guests)
              .map((tier, index) => (
                <PackageCard
                  key={tier.id}
                  tier={tier}
                  fallbackName={getPackageName(attributes, index)}
                  currency={service.currency_code}
                />
              ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No packages added yet.</p>
        )}
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Menu sections</h2>
        {menuSections.length > 0 ? (
          <div style={styles.sectionList}>
            {menuSections.map((section) => (
              <MenuSectionCard
                key={section.id}
                section={section}
                items={(service.menu_items || []).filter(
                  (item) => item.section_id === section.id
                )}
                currency={service.currency_code}
              />
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No menu sections added yet.</p>
        )}
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Add-ons</h2>
        {addons.length > 0 ? (
          <div style={styles.sectionList}>
            {addons.map((addon) => (
              <AddonCard
                key={addon.id}
                addon={addon}
                currency={service.currency_code}
              />
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No add-ons added yet.</p>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div style={styles.info}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value || '-'}</strong>
    </div>
  );
}

function PackageCard({
  tier,
  fallbackName,
  currency,
}: {
  tier: PartnerServicePricingTier;
  fallbackName: string;
  currency: string;
}) {
  return (
    <div style={styles.menuSection}>
      <strong>{fallbackName}</strong>
      <span>
        {money(tier.price, currency)} {formatLabel(tier.price_unit)}
      </span>
      <small>
        {tier.min_guests}-{tier.max_guests || 'many'} guests
      </small>
    </div>
  );
}

function MenuSectionCard({
  section,
  items,
  currency,
}: {
  section: PartnerServiceMenuSection;
  items: PartnerServiceMenuItem[];
  currency: string;
}) {
  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <div style={styles.menuSection}>
      <strong>{section.label}</strong>
      <span>
        {section.is_required ? 'Required' : 'Optional'}
        {section.max_select ? ` - choose up to ${section.max_select}` : ''}
      </span>
      <div style={styles.itemList}>
        {sortedItems.map((item) => (
          <div key={item.id} style={styles.itemRow}>
            <div>
              <strong>{item.name}</strong>
              {item.description ? <small>{item.description}</small> : null}
            </div>
            <span>
              {item.food_type ? formatLabel(item.food_type) : 'Menu item'}
              {item.extra_price > 0
                ? ` + ${money(item.extra_price, currency)} ${formatLabel(
                    item.price_unit
                  )}`
                : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddonCard({
  addon,
  currency,
}: {
  addon: PartnerServiceAddon;
  currency: string;
}) {
  return (
    <div style={styles.menuSection}>
      <strong>{addon.label}</strong>
      <span>
        {money(addon.price, currency)} {formatLabel(addon.price_unit)}
      </span>
      {addon.description ? <small>{addon.description}</small> : null}
    </div>
  );
}

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
function formatList(values: unknown[]) {
  return values.length
    ? values.map((value) => formatLabel(String(value))).join(', ')
    : '-';
}
function formatAreas(areas: unknown[]) {
  if (!areas.length) return '-';
  return areas
    .map((item) => {
      const area = getRecord(item);
      return String(area.area || area.name || area.city || '').trim();
    })
    .filter(Boolean)
    .join(', ');
}
function getPackageName(attributes: Record<string, unknown>, index: number) {
  const packages = getArray(attributes.packages);
  const row = getRecord(packages[index]);
  return String(row.name || `Package ${index + 1}`);
}
function formatPrice(service: {
  base_price: number | null;
  currency_code: string;
  pricing_model: string;
}) {
  if (service.base_price == null) return 'Custom quote';
  return `${money(service.base_price, service.currency_code)} - ${formatLabel(
    service.pricing_model
  )}`;
}
function formatLabel(value: string) {
  return value
    ? value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : '-';
}
function money(value: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
function normalizeMedia(
  media: unknown[]
): { url: string; sort_order: number }[] {
  return media
    .map((item, index) => {
      const value = getRecord(item);
      return {
        url: typeof value.url === 'string' ? value.url : '',
        sort_order: Number(value.sort_order ?? index),
      };
    })
    .filter((item) => item.url)
    .sort((a, b) => a.sort_order - b.sort_order);
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    fontFamily: 'var(--font-manrope), var(--font-sora), sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  backButton: {
    border: 'none',
    background: 'transparent',
    color: '#43a047',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
    marginBottom: 10,
  },
  title: { margin: 0, fontSize: 25, color: '#111827', fontWeight: 600 },
  subtitle: { margin: '7px 0 0', color: '#64748b', fontSize: 14 },
  actions: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  primaryButton: {
    border: 'none',
    borderRadius: 8,
    background: '#43a047',
    color: '#ffffff',
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid #d8dce5',
    borderRadius: 8,
    background: '#ffffff',
    color: '#374151',
    padding: '9px 13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #e8ecf2',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    margin: '0 0 14px',
    color: '#111827',
    fontSize: 17,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
  },
  info: {
    border: '1px solid #eef2f7',
    borderRadius: 10,
    padding: 12,
    background: '#fbfcff',
  },
  infoLabel: {
    display: 'block',
    color: '#64748b',
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.45,
  },
  description: {
    margin: '16px 0 0',
    color: '#475569',
    lineHeight: 1.65,
    fontSize: 14,
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 12,
  },
  imageTile: {
    position: 'relative',
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #e8ecf2',
    background: '#f8fafc',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  coverBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    borderRadius: 999,
    background: 'rgba(17,24,39,0.78)',
    color: '#fff',
    padding: '5px 8px',
    fontSize: 11,
    fontWeight: 600,
  },
  emptyText: { color: '#64748b', fontSize: 14, margin: 0 },
  sectionList: { display: 'grid', gap: 10 },
  menuSection: {
    display: 'grid',
    gap: 6,
    border: '1px solid #eef2f7',
    borderRadius: 10,
    padding: 12,
    background: '#fbfcff',
    color: '#475569',
    fontSize: 13,
  },
  itemList: { display: 'grid', gap: 8, marginTop: 6 },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    borderTop: '1px solid #eef2f7',
    paddingTop: 8,
  },
};
