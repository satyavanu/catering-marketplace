'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  type PartnerServicePayload,
  useMyPartnerService,
  useUpdatePartnerService,
} from '@catering-marketplace/query-client';

export default function EditChefServicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serviceId = params?.id;
  const { data: service, isLoading, error } = useMyPartnerService(serviceId);
  const updateService = useUpdatePartnerService({
    onSuccess: (updated) => router.push(`/partner/services/chef/${updated.id}`),
  });

  const [form, setForm] = useState({
    title: '',
    short_description: '',
    description: '',
    base_price: '',
    min_guests: '',
    max_guests: '',
    advance_notice_hours: '24',
  });

  useEffect(() => {
    if (!service) return;

    setForm({
      title: service.title || '',
      short_description: service.short_description || '',
      description: service.description || '',
      base_price: service.base_price == null ? '' : String(service.base_price),
      min_guests: service.min_guests == null ? '' : String(service.min_guests),
      max_guests: service.max_guests == null ? '' : String(service.max_guests),
      advance_notice_hours: String(service.advance_notice_hours || 24),
    });
  }, [service]);

  if (isLoading) {
    return <div style={styles.panel}>Loading service...</div>;
  }

  if (error || !service) {
    return <div style={styles.panel}>Service not found.</div>;
  }

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: PartnerServicePayload = {
      service_key: service.service_key,
      experience_type_key: service.experience_type_key,
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      booking_type: service.booking_type,
      pricing_model: service.pricing_model || undefined,
      base_price: form.base_price ? Number(form.base_price) : null,
      currency_code: service.currency_code || 'INR',
      min_guests: form.min_guests ? Number(form.min_guests) : null,
      max_guests: form.max_guests ? Number(form.max_guests) : null,
      advance_notice_hours: Number(form.advance_notice_hours || 24),
      service_areas: service.service_areas || [],
      media: service.media || [],
      attributes: service.attributes || {},
      is_active: service.is_active,
    };

    updateService.mutate({ serviceId: service.id, payload });
  };

  return (
    <form style={styles.page} onSubmit={submit}>
      <div style={styles.header}>
        <div>
          <button
            type="button"
            style={styles.backButton}
            onClick={() => router.push(`/partner/services/chef/${service.id}`)}
          >
            Back to service
          </button>
          <h1 style={styles.title}>Edit Chef Service</h1>
          <p style={styles.subtitle}>
            Update the main details for this service.
          </p>
        </div>

        <button
          type="submit"
          style={styles.primaryButton}
          disabled={updateService.isPending || !form.title.trim()}
        >
          {updateService.isPending ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <section style={styles.panel}>
        <div style={styles.grid}>
          <Field label="Title">
            <input
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              style={styles.input}
              required
            />
          </Field>

          <Field label="Short description">
            <input
              value={form.short_description}
              onChange={(event) =>
                setField('short_description', event.target.value)
              }
              style={styles.input}
            />
          </Field>

          <Field label="Base price">
            <input
              type="number"
              value={form.base_price}
              onChange={(event) => setField('base_price', event.target.value)}
              style={styles.input}
              min={0}
            />
          </Field>

          <Field label="Min guests">
            <input
              type="number"
              value={form.min_guests}
              onChange={(event) => setField('min_guests', event.target.value)}
              style={styles.input}
              min={1}
            />
          </Field>

          <Field label="Max guests">
            <input
              type="number"
              value={form.max_guests}
              onChange={(event) => setField('max_guests', event.target.value)}
              style={styles.input}
              min={1}
            />
          </Field>

          <Field label="Advance notice hours">
            <input
              type="number"
              value={form.advance_notice_hours}
              onChange={(event) =>
                setField('advance_notice_hours', event.target.value)
              }
              style={styles.input}
              min={0}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            style={styles.textarea}
            rows={6}
          />
        </Field>

        {updateService.error && (
          <p style={styles.errorText}>{updateService.error.message}</p>
        )}
      </section>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
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
  primaryButton: {
    border: 'none',
    borderRadius: 10,
    background: '#7c3aed',
    color: '#ffffff',
    padding: '10px 14px',
    fontWeight: 850,
    cursor: 'pointer',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 16,
    padding: 20,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    marginBottom: 14,
  },
  label: { color: '#475569', fontSize: 12, fontWeight: 850 },
  input: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '10px 11px',
    fontSize: 14,
    color: '#151126',
  },
  textarea: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '10px 11px',
    fontSize: 14,
    color: '#151126',
    resize: 'vertical',
  },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: 750 },
};
