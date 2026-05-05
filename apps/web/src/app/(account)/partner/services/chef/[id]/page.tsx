'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useMyPartnerService,
  useSubmitPartnerService,
} from '@catering-marketplace/query-client';

import DashboardStatusBadge from '@/components/dashboard/DashboardStatusBadge';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';

export default function ChefServiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serviceId = params?.id;
  const { getServiceType, getExperienceType } = useServiceCatalogMetaContext();
  const { data: service, isLoading, error } = useMyPartnerService(serviceId);
  const submitService = useSubmitPartnerService();

  if (isLoading) {
    return <div style={styles.panel}>Loading service...</div>;
  }

  if (error || !service) {
    return <div style={styles.panel}>Service not found.</div>;
  }

  const serviceType = getServiceType(service.service_key);
  const experienceType = getExperienceType(service.experience_type_key);
  const attributes = service.attributes || {};
  const availability = getRecord(attributes.availability);
  const pricing = getRecord(attributes.pricing);
  const chefExperience = getRecord(attributes.chef_experience);
  const menuSections = getArray(getRecord(chefExperience).sections);
  const serviceImages = normalizeMedia(service.media || []);
  const serviceAreas = Array.isArray(service.service_areas)
    ? service.service_areas
    : [];

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
            {serviceType?.label || service.service_key}
            {experienceType ? ` · ${experienceType.label}` : ''}
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
              router.push(`/partner/services/chef/${service.id}/edit`)
            }
          >
            Edit
          </button>
          {service.status === 'draft' || service.status === 'rejected' ? (
            <button
              type="button"
              style={styles.primaryButton}
              disabled={submitService.isPending}
              onClick={() => submitService.mutate(service.id)}
            >
              Submit
            </button>
          ) : null}
        </div>
      </div>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Overview</h2>
        <div style={styles.grid}>
          <Info label="Short description" value={service.short_description} />
          <Info label="Booking type" value={service.booking_type} />
          <Info label="Pricing" value={formatPrice(service)} />
          <Info
            label="Guests"
            value={`${service.min_guests || 1}-${service.max_guests || 'many'}`}
          />
          <Info
            label="Advance notice"
            value={`${service.advance_notice_hours || 0} hours`}
          />
          <Info
            label="Service areas"
            value={`${serviceAreas.length || 0} selected`}
          />
          <Info
            label="Location model"
            value={formatLabel(String(attributes.location_model || ''))}
          />
        </div>

        {service.description && (
          <p style={styles.description}>{service.description}</p>
        )}
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Service photos</h2>
        {serviceImages.length > 0 ? (
          <div style={styles.imageGrid}>
            {serviceImages.map((image, index) => (
              <div key={`${image.url}-${index}`} style={styles.imageTile}>
                <img src={image.url} alt="Service" style={styles.image} />
                {index === 0 && <span style={styles.coverBadge}>Cover</span>}
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No service photos uploaded yet.</p>
        )}
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Service details</h2>
        <div style={styles.grid}>
          <Info
            label="Cuisines"
            value={formatList(getArray(attributes.cuisines))}
          />
          <Info
            label="Diet types"
            value={formatList(getArray(attributes.diet_types))}
          />
          <Info
            label="Service styles"
            value={formatList(getArray(attributes.service_styles))}
          />
          <Info
            label="Food type"
            value={formatLabel(String(attributes.food_type || ''))}
          />
          <Info
            label="Service location"
            value={formatLabel(String(attributes.service_location || ''))}
          />
          <Info
            label="Radius"
            value={
              attributes.service_radius_km
                ? `${attributes.service_radius_km} km`
                : '-'
            }
          />
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Availability & pricing</h2>
        <div style={styles.grid}>
          <Info label="Days" value={formatList(getArray(availability.days))} />
          <Info
            label="Slots"
            value={formatList(getArray(availability.slots))}
          />
          <Info
            label="Pricing mode"
            value={formatLabel(String(pricing.mode || service.pricing_model))}
          />
          <Info
            label="Amount"
            value={formatPrice({
              base_price:
                typeof pricing.amount === 'number'
                  ? pricing.amount
                  : service.base_price,
              currency_code:
                String(pricing.currency_code || service.currency_code) || 'INR',
              pricing_model: String(pricing.mode || service.pricing_model),
            })}
          />
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Menu sections</h2>
        {menuSections.length > 0 ? (
          <div style={styles.sectionList}>
            {menuSections.map((section, index) => {
              const sectionRecord = getRecord(section);
              return (
                <div
                  key={String(sectionRecord.id || index)}
                  style={styles.menuSection}
                >
                  <strong>
                    {String(sectionRecord.title || 'Menu section')}
                  </strong>
                  <span>{formatList(getArray(sectionRecord.items))}</span>
                  {sectionRecord.note ? (
                    <small>{String(sectionRecord.note)}</small>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={styles.emptyText}>No menu sections added yet.</p>
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

function formatPrice(service: {
  base_price: number | null;
  currency_code: string;
  pricing_model: string;
}) {
  if (service.base_price == null) return 'Custom quote';
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: service.currency_code || 'INR',
    maximumFractionDigits: 0,
  }).format(service.base_price);
  return service.pricing_model ? `${price} · ${service.pricing_model}` : price;
}

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function formatLabel(value: string) {
  if (!value) return '-';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatList(items: unknown[]) {
  if (!items.length) return '-';
  return items.map((item) => formatLabel(String(item))).join(', ');
}

function normalizeMedia(media: unknown[]) {
  return media
    .map((item) => getRecord(item))
    .filter((item) => typeof item.url === 'string')
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)) as {
    url: string;
  }[];
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 18 },
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
    color: '#7c3aed',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 800,
    padding: 0,
    marginBottom: 10,
  },
  title: { margin: 0, fontSize: 25, color: '#151126', fontWeight: 800 },
  subtitle: { margin: '7px 0 0', color: '#64748b', fontSize: 14 },
  actions: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  primaryButton: {
    border: 'none',
    borderRadius: 10,
    background: '#7c3aed',
    color: '#ffffff',
    padding: '10px 14px',
    fontWeight: 850,
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid #e9d5ff',
    borderRadius: 10,
    background: '#ffffff',
    color: '#7c3aed',
    padding: '9px 13px',
    fontWeight: 850,
    cursor: 'pointer',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: { margin: '0 0 14px', fontSize: 17, color: '#151126' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 12,
  },
  info: {
    border: '1px solid #f1f5f9',
    borderRadius: 12,
    padding: 12,
    background: '#fbfdff',
  },
  infoLabel: {
    display: 'block',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 750,
    marginBottom: 6,
  },
  infoValue: { color: '#151126', fontSize: 14 },
  description: { color: '#475569', lineHeight: 1.6, margin: '16px 0 0' },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
  },
  imageTile: {
    position: 'relative',
    height: 140,
    overflow: 'hidden',
    borderRadius: 12,
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    borderRadius: 999,
    background: 'rgba(21,17,38,0.78)',
    color: '#ffffff',
    padding: '5px 8px',
    fontSize: 11,
    fontWeight: 850,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    margin: 0,
  },
  sectionList: {
    display: 'grid',
    gap: 10,
  },
  menuSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    border: '1px solid #f1f5f9',
    borderRadius: 12,
    padding: 12,
    color: '#475569',
    fontSize: 13,
  },
};
