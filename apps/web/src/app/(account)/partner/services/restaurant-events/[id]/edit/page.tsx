'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  deleteImageAsset,
  type PartnerServicePayload,
  type UploadedAsset,
  uploadImageAsset,
  useMyPartnerService,
  useUpdatePartnerService,
} from '@catering-marketplace/query-client';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';

type ServiceMedia = UploadedAsset & { type?: string; sortOrder: number };

type FormState = {
  title: string;
  short_description: string;
  description: string;
  experience_type_key: string;
  base_price: string;
  currency_code: string;
  min_guests: string;
  max_guests: string;
  advance_notice_hours: string;
  city: string;
  city_id: string;
  address: string;
  venue_type: string;
  seating_style: string;
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

export default function EditRestaurantEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serviceId = params?.id;
  const { getExperienceTypesForService, getAttributeGroup } =
    useServiceCatalogMetaContext();
  const experienceTypes = getExperienceTypesForService(
    'restaurant_private_event'
  ).filter((item) => item.is_active);
  const venueOptions =
    getAttributeGroup('restaurant_private_event', 'venue_type')?.options || [];
  const seatingOptions =
    getAttributeGroup('restaurant_private_event', 'seating_style')?.options ||
    [];
  const { data: service, isLoading, error } = useMyPartnerService(serviceId);
  const updateService = useUpdatePartnerService({
    onSuccess: (updated) =>
      router.push(`/partner/services/restaurant-events/${updated.id}`),
  });
  const [form, setForm] = useState<FormState>({
    title: '',
    short_description: '',
    description: '',
    experience_type_key: '',
    base_price: '',
    currency_code: 'INR',
    min_guests: '',
    max_guests: '',
    advance_notice_hours: '72',
    city: '',
    city_id: '',
    address: '',
    venue_type: 'private_room',
    seating_style: 'seated',
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
      base_price: service.base_price == null ? '' : String(service.base_price),
      currency_code: service.currency_code || 'INR',
      min_guests: service.min_guests == null ? '' : String(service.min_guests),
      max_guests: service.max_guests == null ? '' : String(service.max_guests),
      advance_notice_hours: String(service.advance_notice_hours || 72),
      city: String(attributes.city || ''),
      city_id: String(attributes.city_id || ''),
      address: String(attributes.address || ''),
      venue_type: String(attributes.venue_type || 'private_room'),
      seating_style: String(attributes.seating_style || 'seated'),
    });
    setImages(normalizeServiceMedia(service.media || []));
  }, [service]);

  if (isLoading) return <div style={styles.panel}>Loading service...</div>;
  if (error || !service)
    return <div style={styles.panel}>Service not found.</div>;

  const setField = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const attributes = {
      ...(service.attributes || {}),
      city: form.city,
      city_id: form.city_id || null,
      address: form.address,
      venue_type: form.venue_type,
      seating_style: form.seating_style,
      location_model: 'hosted_location',
    };
    const payload: PartnerServicePayload = {
      service_key: service.service_key,
      experience_type_key:
        form.experience_type_key || service.experience_type_key,
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      booking_type: service.booking_type,
      pricing_model: service.pricing_model || 'package',
      base_price: form.base_price ? Number(form.base_price) : null,
      currency_code: form.currency_code || service.currency_code || 'INR',
      min_guests: form.min_guests ? Number(form.min_guests) : null,
      max_guests: form.max_guests ? Number(form.max_guests) : null,
      advance_notice_hours: Number(form.advance_notice_hours || 72),
      service_areas: [
        {
          city_id: form.city_id || null,
          city: form.city,
          area: form.address,
          service_area_id: null,
          postal_code: null,
          latitude: null,
          longitude: null,
          radius_km: null,
        },
      ],
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
              router.push(`/partner/services/restaurant-events/${service.id}`)
            }
          >
            Back to service
          </button>
          <h1 style={styles.title}>Edit Restaurant Private Event</h1>
          <p style={styles.subtitle}>
            Refine hosted dining details, packages, pricing, and event photos.
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
                    {form.experience_type_key || 'Private event'}
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
          <Field label="Venue type">
            <SelectWrap>
              <select
                value={form.venue_type}
                onChange={(event) => setField('venue_type', event.target.value)}
                style={styles.select}
              >
                {optionRows(venueOptions, [
                  'private_room',
                  'full_buyout',
                  'rooftop',
                  'banquet',
                ]).map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </SelectWrap>
          </Field>
          <Field label="Seating style">
            <SelectWrap>
              <select
                value={form.seating_style}
                onChange={(event) =>
                  setField('seating_style', event.target.value)
                }
                style={styles.select}
              >
                {optionRows(seatingOptions, [
                  'seated',
                  'buffet',
                  'cocktail',
                  'mixed',
                ]).map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </SelectWrap>
          </Field>
          <Field label="City">
            <input
              value={form.city}
              onChange={(event) => setField('city', event.target.value)}
              style={styles.input}
            />
          </Field>
          <Field label="Restaurant address">
            <input
              value={form.address}
              onChange={(event) => setField('address', event.target.value)}
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
          <Field label="Currency">
            <input
              value={form.currency_code}
              onChange={(event) =>
                setField('currency_code', event.target.value.toUpperCase())
              }
              style={styles.input}
              maxLength={3}
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
        <div style={styles.mediaBlock}>
          <div>
            <h2 style={styles.sectionTitle}>Event images</h2>
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
                  alt="Restaurant event"
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
function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function optionRows(
  options: { key: string; label: string }[],
  fallback: string[]
) {
  return options.length
    ? options
    : fallback.map((key) => ({
        key,
        label: key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      }));
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
  mediaBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginTop: 8,
  },
  sectionTitle: { margin: 0, color: '#111827', fontSize: 16, fontWeight: 600 },
  sectionSubtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.45,
  },
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
  textarea: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 11px',
    fontSize: 14,
    color: '#111827',
    resize: 'vertical',
  },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: 600 },
};
