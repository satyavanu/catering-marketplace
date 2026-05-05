'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  deleteImageAsset,
  type PartnerServicePayload,
  type UploadedAsset,
  uploadImageAsset,
  useMyPartnerService,
  useUpdatePartnerService,
} from '@catering-marketplace/query-client';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';

type ServiceMedia = UploadedAsset & { type?: string; sortOrder: number };

type FormState = {
  title: string;
  short_description: string;
  description: string;
  experience_type_key: string;
  booking_type: 'quote' | 'request_only' | 'instant';
  base_price: string;
  currency_code: string;
  min_guests: string;
  max_guests: string;
  advance_notice_hours: string;
  city: string;
  city_id: string;
  areasText: string;
  cuisinesText: string;
  dietTypesText: string;
  serviceStylesText: string;
  eventTypesText: string;
};

function normalizeServiceMedia(media: unknown[]): ServiceMedia[] {
  return media
    .map((item, index) => {
      const value = getRecord(item);
      const key = String(value.key || value.public_id || '');
      const provider: ServiceMedia['provider'] =
        value.provider === 's3' ? 's3' : 'firebase';
      return {
        url: String(value.url || ''),
        key,
        publicId: String(value.public_id || key),
        provider,
        contentType: String(value.content_type || ''),
        fileName: String(value.file_name || ''),
        size: Number(value.size || 0),
        type: typeof value.type === 'string' ? value.type : undefined,
        sortOrder: Number(value.sort_order ?? index),
      };
    })
    .filter((item) => item.url && item.key)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function toServiceMediaPayload(images: ServiceMedia[]) {
  return images.map((image, index) => ({
    url: image.url,
    key: image.key,
    public_id: image.publicId || image.key,
    provider: image.provider || 'firebase',
    file_name: image.fileName,
    content_type: image.contentType,
    size: image.size,
    type: index === 0 ? 'cover' : 'gallery',
    sort_order: index,
  }));
}

export default function EditCateringServicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serviceId = params?.id;
  const { locations } = useOnboardingMasterDataContext();
  const { getExperienceTypesForService } = useServiceCatalogMetaContext();
  const experienceTypes = getExperienceTypesForService('catering').filter(
    (item) => item.is_active
  );
  const { data: service, isLoading, error } = useMyPartnerService(serviceId);
  const updateService = useUpdatePartnerService({
    onSuccess: (updated) =>
      router.push(`/partner/services/catering/${updated.id}`),
  });

  const currencies = useMemo(() => {
    const seen = new Set<string>();
    return (locations?.countries || [])
      .map((country) => ({
        code: country.currencyCode,
        label: `${country.currencyCode} - ${country.name}`,
      }))
      .filter((item) => {
        if (!item.code || seen.has(item.code)) return false;
        seen.add(item.code);
        return true;
      });
  }, [locations?.countries]);

  const [form, setForm] = useState<FormState>({
    title: '',
    short_description: '',
    description: '',
    experience_type_key: '',
    booking_type: 'quote',
    base_price: '',
    currency_code: 'INR',
    min_guests: '',
    max_guests: '',
    advance_notice_hours: '48',
    city: '',
    city_id: '',
    areasText: '',
    cuisinesText: '',
    dietTypesText: '',
    serviceStylesText: '',
    eventTypesText: '',
  });
  const [images, setImages] = useState<ServiceMedia[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (!service) return;
    const attributes = service.attributes || {};
    setForm({
      title: service.title || '',
      short_description: service.short_description || '',
      description: service.description || '',
      experience_type_key: service.experience_type_key || '',
      booking_type: service.booking_type || 'quote',
      base_price: service.base_price == null ? '' : String(service.base_price),
      currency_code: service.currency_code || 'INR',
      min_guests: service.min_guests == null ? '' : String(service.min_guests),
      max_guests: service.max_guests == null ? '' : String(service.max_guests),
      advance_notice_hours: String(service.advance_notice_hours || 48),
      city: String(
        attributes.city || firstAreaValue(service.service_areas, 'city')
      ),
      city_id: String(
        attributes.city_id || firstAreaValue(service.service_areas, 'city_id')
      ),
      areasText: getAreasText(service.service_areas),
      cuisinesText: getArray(attributes.cuisines).join(', '),
      dietTypesText: getArray(attributes.diet_types).join(', '),
      serviceStylesText: getArray(attributes.service_styles).join(', '),
      eventTypesText: getArray(attributes.event_types).join(', '),
    });
    setImages(normalizeServiceMedia(service.media || []));
  }, [service]);

  if (isLoading) return <div style={styles.panel}>Loading service...</div>;
  if (error || !service)
    return <div style={styles.panel}>Service not found.</div>;

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const areas = splitList(form.areasText);
    const attributes = {
      ...(service.attributes || {}),
      cuisines: splitList(form.cuisinesText),
      diet_types: splitList(form.dietTypesText),
      service_styles: splitList(form.serviceStylesText),
      event_types: splitList(form.eventTypesText),
      city: form.city,
      city_id: form.city_id || null,
      location_model: 'service_area',
    };
    const payload: PartnerServicePayload = {
      service_key: service.service_key,
      experience_type_key:
        form.experience_type_key ||
        service.experience_type_key ||
        'event_catering',
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      booking_type: form.booking_type,
      pricing_model: service.pricing_model || 'package',
      base_price: form.base_price ? Number(form.base_price) : null,
      currency_code: form.currency_code || service.currency_code || 'INR',
      min_guests: form.min_guests ? Number(form.min_guests) : null,
      max_guests: form.max_guests ? Number(form.max_guests) : null,
      advance_notice_hours: Number(form.advance_notice_hours || 48),
      service_areas: areas.map((area) => ({
        city_id: form.city_id || null,
        city: form.city,
        area,
        service_area_id: null,
        postal_code: null,
        latitude: null,
        longitude: null,
        radius_km: null,
      })),
      media: toServiceMediaPayload(images),
      attributes,
      is_active: service.is_active,
    };
    updateService.mutate({ serviceId: service.id, payload });
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length || uploadingImages) return;
    setImageError('');
    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file, offset) => {
          const asset = await uploadImageAsset(
            {
              scope: 'partner_service_media',
              partnerId: service.partner_id,
              serviceId: service.id,
              fileName: file.name,
              contentType: file.type,
              fileSize: file.size,
            },
            file
          );
          return { ...asset, sortOrder: images.length + offset };
        })
      );
      setImages((current) => [...current, ...uploaded]);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : 'Unable to upload service image.'
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (image: ServiceMedia) => {
    setImages((current) =>
      current
        .filter((item) => item.key !== image.key)
        .map((item, index) => ({ ...item, sortOrder: index }))
    );
    try {
      await deleteImageAsset({
        fileKey: image.key,
        partnerId: service.partner_id,
      });
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : 'Image was removed from the form, but storage delete failed.'
      );
    }
  };

  return (
    <form style={styles.page} onSubmit={submit}>
      <div style={styles.header}>
        <div>
          <button
            type="button"
            style={styles.backButton}
            onClick={() =>
              router.push(`/partner/services/catering/${service.id}`)
            }
          >
            Back to service
          </button>
          <h1 style={styles.title}>Edit Catering Service</h1>
          <p style={styles.subtitle}>
            Refine the public listing, pricing basics, delivery areas, and
            service photos.
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
        <h2 style={styles.sectionTitle}>Listing details</h2>
        <div style={styles.grid}>
          <Field label="Offering name">
            <input
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              style={styles.input}
              required
            />
          </Field>
          <Field label="Experience type">
            <SelectWrap>
              <select
                value={form.experience_type_key}
                onChange={(event) =>
                  setField('experience_type_key', event.target.value)
                }
                style={styles.select}
              >
                {experienceTypes.length === 0 && (
                  <option value={form.experience_type_key}>
                    {form.experience_type_key || 'Event catering'}
                  </option>
                )}
                {experienceTypes.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </SelectWrap>
          </Field>
          <Field label="Booking type">
            <SelectWrap>
              <select
                value={form.booking_type}
                onChange={(event) =>
                  setField(
                    'booking_type',
                    event.target.value as FormState['booking_type']
                  )
                }
                style={styles.select}
              >
                <option value="quote">Quote request</option>
                <option value="request_only">Request only</option>
                <option value="instant">Instant booking</option>
              </select>
            </SelectWrap>
          </Field>
          <Field label="Short description">
            <input
              value={form.short_description}
              onChange={(event) =>
                setField('short_description', event.target.value)
              }
              style={styles.input}
              maxLength={160}
            />
          </Field>
        </div>
        <Field label="Full description">
          <textarea
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            style={styles.textarea}
            rows={6}
          />
        </Field>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Audience & menu tags</h2>
        <div style={styles.grid}>
          <Field label="Event types">
            <input
              value={form.eventTypesText}
              onChange={(event) =>
                setField('eventTypesText', event.target.value)
              }
              style={styles.input}
              placeholder="Wedding, Corporate, Birthday"
            />
          </Field>
          <Field label="Cuisines">
            <input
              value={form.cuisinesText}
              onChange={(event) => setField('cuisinesText', event.target.value)}
              style={styles.input}
              placeholder="Indian, Continental, Italian"
            />
          </Field>
          <Field label="Diet options">
            <input
              value={form.dietTypesText}
              onChange={(event) =>
                setField('dietTypesText', event.target.value)
              }
              style={styles.input}
              placeholder="Veg, Non veg, Vegan"
            />
          </Field>
          <Field label="Service styles">
            <input
              value={form.serviceStylesText}
              onChange={(event) =>
                setField('serviceStylesText', event.target.value)
              }
              style={styles.input}
              placeholder="Buffet, Plated, Live counters"
            />
          </Field>
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Pricing & delivery</h2>
        <div style={styles.grid}>
          <Field label="Currency">
            {currencies.length > 0 ? (
              <SelectWrap>
                <select
                  value={form.currency_code}
                  onChange={(event) =>
                    setField('currency_code', event.target.value)
                  }
                  style={styles.select}
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            ) : (
              <input
                value={form.currency_code}
                onChange={(event) =>
                  setField('currency_code', event.target.value.toUpperCase())
                }
                style={styles.input}
                maxLength={3}
              />
            )}
          </Field>
          <Field label="Starting price">
            <input
              type="number"
              value={form.base_price}
              onChange={(event) => setField('base_price', event.target.value)}
              style={styles.input}
              min={0}
            />
          </Field>
          <Field label="Minimum guests">
            <input
              type="number"
              value={form.min_guests}
              onChange={(event) => setField('min_guests', event.target.value)}
              style={styles.input}
              min={1}
            />
          </Field>
          <Field label="Maximum guests">
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
          <Field label="City">
            <input
              value={form.city}
              onChange={(event) => setField('city', event.target.value)}
              style={styles.input}
            />
          </Field>
        </div>
        <Field label="Service areas">
          <textarea
            value={form.areasText}
            onChange={(event) => setField('areasText', event.target.value)}
            style={styles.textarea}
            rows={3}
            placeholder="One or more areas, separated by commas"
          />
        </Field>
      </section>

      <section style={styles.panel}>
        <div style={styles.mediaBlock}>
          <div>
            <h2 style={styles.sectionTitle}>Service images</h2>
            <p style={styles.sectionSubtitle}>
              The first image is used as the cover. Add or remove photos, then
              save changes.
            </p>
          </div>
          <div style={styles.imageGrid}>
            {images.map((image, index) => (
              <div key={`${image.key}-${index}`} style={styles.imageTile}>
                <img
                  src={image.url}
                  alt="Catering service"
                  style={styles.image}
                />
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  style={styles.removeImageButton}
                >
                  Remove
                </button>
                {index === 0 && <span style={styles.coverBadge}>Cover</span>}
              </div>
            ))}
            <label style={styles.addImageTile}>
              <span>{uploadingImages ? 'Uploading...' : '+ Add photos'}</span>
              <small>JPG, PNG, or WebP</small>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                hidden
                disabled={uploadingImages}
                onChange={(event) => {
                  uploadImages(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
          </div>
          {imageError && <p style={styles.errorText}>{imageError}</p>}
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Saved packages, menu, and add-ons</h2>
        <p style={styles.sectionSubtitle}>
          These are preserved with the service. A full nested package/menu
          editor can sit here next.
        </p>
        <div style={styles.summaryGrid}>
          <Summary
            label="Packages"
            value={String(service.pricing_tiers?.length || 0)}
          />
          <Summary
            label="Menu sections"
            value={String(service.menu_sections?.length || 0)}
          />
          <Summary
            label="Menu items"
            value={String(service.menu_items?.length || 0)}
          />
          <Summary
            label="Add-ons"
            value={String(service.addons?.length || 0)}
          />
        </div>
      </section>

      {updateService.error && (
        <p style={styles.errorText}>{updateService.error.message}</p>
      )}
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
function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.selectWrap}>
      {children}
      <span aria-hidden="true" style={styles.selectChevron}>
        v
      </span>
    </div>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.summaryCard}>
      <span>{label}</span>
      <strong>{value}</strong>
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
function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
function firstAreaValue(areas: unknown[], key: string) {
  const area = getRecord(areas?.[0]);
  return String(area[key] || '');
}
function getAreasText(areas: unknown[]) {
  return areas
    .map((item) => {
      const area = getRecord(item);
      return String(area.area || area.name || area.city || '').trim();
    })
    .filter(Boolean)
    .join(', ');
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
  primaryButton: {
    border: 'none',
    borderRadius: 8,
    background: '#43a047',
    color: '#ffffff',
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #e8ecf2',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: { margin: 0, color: '#111827', fontSize: 16, fontWeight: 600 },
  sectionSubtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.45,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 },
  label: { color: '#475569', fontSize: 12, fontWeight: 600 },
  input: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 11px',
    fontSize: 14,
    color: '#111827',
  },
  selectWrap: { position: 'relative', width: '100%' },
  select: {
    width: '100%',
    height: 42,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    padding: '0 36px 0 11px',
    fontSize: 14,
    color: '#111827',
    background: '#ffffff',
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
  },
  selectChevron: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none',
    fontSize: 12,
  },
  textarea: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 11px',
    fontSize: 14,
    color: '#111827',
    resize: 'vertical',
  },
  mediaBlock: { display: 'flex', flexDirection: 'column', gap: 14 },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },
  imageTile: {
    position: 'relative',
    height: 130,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #e8ecf2',
    background: '#f8fafc',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  removeImageButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    border: 'none',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.94)',
    color: '#dc2626',
    padding: '6px 9px',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
  },
  coverBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    borderRadius: 999,
    background: 'rgba(17,24,39,0.78)',
    color: '#ffffff',
    padding: '5px 8px',
    fontSize: 11,
    fontWeight: 600,
  },
  addImageTile: {
    minHeight: 130,
    borderRadius: 10,
    border: '1.5px dashed #b7dfbd',
    background: '#f0fdf4',
    color: '#43a047',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 600,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10,
    marginTop: 14,
  },
  summaryCard: {
    display: 'grid',
    gap: 5,
    border: '1px solid #eef2f7',
    borderRadius: 10,
    padding: 12,
    background: '#fbfcff',
    color: '#64748b',
    fontSize: 12,
  },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: 600 },
};
