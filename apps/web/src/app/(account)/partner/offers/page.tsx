'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  type PartnerCoupon,
  type PartnerCouponPayload,
  useCreatePartnerCoupon,
  useDeletePartnerCoupon,
  useMyPartnerServices,
  usePartnerCoupons,
  useUpdatePartnerCoupon,
} from '@catering-marketplace/query-client';
import { useSession } from 'next-auth/react';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';
import { useServiceCatalogMetaContext } from '@/app/context/ServiceCatalogMetaContext';

type TargetMode = 'all' | 'service_key' | 'service_id';
type SnackbarState = { message: string; tone: 'success' | 'error' } | null;

type FormState = {
  id: string;
  title: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed_amount';
  discountValue: string;
  currencyCode: string;
  maxDiscountAmount: string;
  minOrderAmount: string;
  startsAt: string;
  endsAt: string;
  maxRedemptions: string;
  perCustomerLimit: string;
  isActive: boolean;
  targetMode: TargetMode;
  targetValue: string;
};

const buildEmptyForm = (currencyCode = 'INR'): FormState => ({
  id: '',
  title: '',
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: '10',
  currencyCode,
  maxDiscountAmount: '',
  minOrderAmount: '',
  startsAt: '',
  endsAt: '',
  maxRedemptions: '',
  perCustomerLimit: '1',
  isActive: true,
  targetMode: 'all',
  targetValue: '',
});

const emptyForm = buildEmptyForm();

export default function PartnerOffersPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [snackbar, setSnackbar] = useState<SnackbarState>(null);
  const [deletingCouponId, setDeletingCouponId] = useState('');
  const { data: session } = useSession();
  const { locations } = useOnboardingMasterDataContext();
  const { data: rawCoupons, isLoading, error } = usePartnerCoupons();
  const { data: rawServices } = useMyPartnerServices();
  const coupons = normalizeList<PartnerCoupon>(rawCoupons);
  const services = normalizeList<{
    id: string;
    title: string;
    currency_code?: string;
  }>(rawServices);
  const { serviceTypes, getServiceType } = useServiceCatalogMetaContext();
  const defaultCurrency = getDefaultCurrencyCode(
    session?.user,
    locations,
    services
  );
  const currencySymbol = getCurrencySymbol(defaultCurrency, locations);
  const showSnackbar = (tone: 'success' | 'error', message: string) =>
    setSnackbar({ tone, message });
  const resetForm = () => setForm(buildEmptyForm(defaultCurrency));
  const createCoupon = useCreatePartnerCoupon({
    onSuccess: () => {
      resetForm();
      showSnackbar('success', 'Offer created successfully.');
    },
    onError: (mutationError) =>
      showSnackbar('error', mutationError.message || 'Could not create offer.'),
  });
  const updateCoupon = useUpdatePartnerCoupon({
    onSuccess: () => {
      resetForm();
      showSnackbar('success', 'Offer updated successfully.');
    },
    onError: (mutationError) =>
      showSnackbar('error', mutationError.message || 'Could not update offer.'),
  });
  const deleteCoupon = useDeletePartnerCoupon({
    onSuccess: () => showSnackbar('success', 'Offer deleted successfully.'),
    onError: (mutationError) =>
      showSnackbar('error', mutationError.message || 'Could not delete offer.'),
    onSettled: () => setDeletingCouponId(''),
  });
  const isSaving = createCoupon.isPending || updateCoupon.isPending;

  useEffect(() => {
    if (!form.id && form.currencyCode !== defaultCurrency) {
      setForm((current) => ({ ...current, currencyCode: defaultCurrency }));
    }
  }, [defaultCurrency, form.currencyCode, form.id]);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timer = window.setTimeout(() => setSnackbar(null), 3200);
    return () => window.clearTimeout(timer);
  }, [snackbar]);

  const stats = useMemo(() => {
    const active = coupons.filter(
      (coupon) => getCouponStatus(coupon) === 'Active'
    ).length;
    const scheduled = coupons.filter(
      (coupon) => getCouponStatus(coupon) === 'Scheduled'
    ).length;
    const redemptions = coupons.reduce(
      (sum, coupon) => sum + (coupon.redemptions_count || 0),
      0
    );
    return { active, scheduled, redemptions };
  }, [coupons]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = toPayload(form);
    if (form.id) updateCoupon.mutate({ couponId: form.id, payload });
    else createCoupon.mutate(payload);
  };

  const removeCoupon = (couponId: string) => {
    setDeletingCouponId(couponId);
    deleteCoupon.mutate(couponId);
  };

  const editCoupon = (coupon: PartnerCoupon) => setForm(fromCoupon(coupon));

  return (
    <div style={styles.page}>
      <style>{offerAnimationStyles}</style>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Offers & Discounts</h1>
          <p style={styles.subtitle}>
            Create conversion-friendly codes for private events, catering
            packages, and chef services.
          </p>
        </div>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={resetForm}
        >
          New offer
        </button>
      </div>

      <div style={styles.statsGrid}>
        <Stat label="Active offers" value={stats.active} />
        <Stat label="Scheduled" value={stats.scheduled} />
        <Stat label="Redemptions" value={stats.redemptions} />
      </div>

      <div style={styles.layout}>
        <form style={styles.panel} onSubmit={submit}>
          <div style={styles.panelHeader}>
            <h2 style={styles.sectionTitle}>
              {form.id ? 'Edit offer' : 'Create offer'}
            </h2>
            <span style={styles.helper}>
              Discounts apply to the partner service price before checkout fees.
            </span>
          </div>

          <div style={styles.grid2}>
            <Field label="Offer title" required>
              <input
                required
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                style={styles.input}
                placeholder="Private dining launch offer"
              />
            </Field>
            <Field label="Coupon code" required>
              <input
                required
                value={form.code}
                onChange={(e) => setField('code', cleanCode(e.target.value))}
                style={styles.input}
                placeholder="AMIR30"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              style={styles.textarea}
              rows={3}
              placeholder="A short note shown to your team and later customers."
            />
          </Field>

          <div style={styles.grid3}>
            <Field label="Discount type" required>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setField(
                    'discountType',
                    e.target.value as FormState['discountType']
                  )
                }
                style={styles.select}
              >
                <option value="percent">Percentage</option>
                <option value="fixed_amount">Fixed amount</option>
              </select>
            </Field>
            <Field
              required
              label={
                form.discountType === 'percent'
                  ? 'Discount %'
                  : `Discount amount (${currencySymbol})`
              }
            >
              <input
                required
                type="number"
                min={1}
                max={form.discountType === 'percent' ? 100 : undefined}
                value={form.discountValue}
                onChange={(e) => setField('discountValue', e.target.value)}
                style={styles.input}
              />
            </Field>
          </div>

          <div style={styles.grid3}>
            <Field label={`Min booking value (${currencySymbol})`}>
              <input
                type="number"
                min={0}
                value={form.minOrderAmount}
                onChange={(e) => setField('minOrderAmount', e.target.value)}
                style={styles.input}
                placeholder="Optional"
              />
            </Field>
            <Field label={`Max discount cap (${currencySymbol})`}>
              <input
                type="number"
                min={0}
                value={form.maxDiscountAmount}
                onChange={(e) => setField('maxDiscountAmount', e.target.value)}
                style={styles.input}
                placeholder="Optional"
              />
            </Field>
            <Field label="Max redemptions">
              <input
                type="number"
                min={1}
                value={form.maxRedemptions}
                onChange={(e) => setField('maxRedemptions', e.target.value)}
                style={styles.input}
                placeholder="Optional"
              />
            </Field>
          </div>

          <div style={styles.grid3}>
            <Field label="Starts">
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setField('startsAt', e.target.value)}
                style={styles.input}
              />
            </Field>
            <Field label="Ends">
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setField('endsAt', e.target.value)}
                style={styles.input}
              />
            </Field>
            <Field label="Per customer limit" required>
              <input
                type="number"
                min={1}
                value={form.perCustomerLimit}
                onChange={(e) => setField('perCustomerLimit', e.target.value)}
                style={styles.input}
              />
            </Field>
          </div>

          <div style={styles.grid2}>
            <Field label="Applies to" required>
              <select
                value={form.targetMode}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    targetMode: e.target.value as TargetMode,
                    targetValue: '',
                  }))
                }
                style={styles.select}
              >
                <option value="all">All my services</option>
                <option value="service_key">Service type</option>
                <option value="service_id">Specific listing</option>
              </select>
            </Field>
            {form.targetMode === 'service_key' && (
              <Field label="Service type" required>
                <select
                  value={form.targetValue}
                  onChange={(e) => setField('targetValue', e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Select type</option>
                  {serviceTypes.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {form.targetMode === 'service_id' && (
              <Field label="Service listing" required>
                <select
                  value={form.targetValue}
                  onChange={(e) => setField('targetValue', e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Select listing</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>

          <label style={styles.toggleRow}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
            />
            <span>Offer is active</span>
          </label>

          {(createCoupon.error || updateCoupon.error) && (
            <p style={styles.errorText}>
              {createCoupon.error?.message || updateCoupon.error?.message}
            </p>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.primaryButton}
              disabled={isSaving}
            >
              <span style={styles.buttonContent}>
                {isSaving && <span style={styles.buttonSpinner} />}
                {isSaving
                  ? 'Saving...'
                  : form.id
                    ? 'Save changes'
                    : 'Create offer'}
              </span>
            </button>
          </div>
        </form>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.sectionTitle}>Your offers</h2>
            <span style={styles.helper}>{coupons.length} total</span>
          </div>
          {isLoading ? (
            <p style={styles.empty}>Loading offers...</p>
          ) : error ? (
            <p style={styles.errorText}>{error.message}</p>
          ) : coupons.length === 0 ? (
            <p style={styles.empty}>
              No offers yet. Create a launch code for your next service.
            </p>
          ) : (
            <div style={styles.offerList}>
              {coupons.map((coupon) => {
                const isDeleting = deletingCouponId === coupon.id;
                return (
                  <article key={coupon.id} style={styles.offerCard}>
                    <div style={styles.offerTop}>
                      <div>
                        <span style={styles.code}>{coupon.code}</span>
                        <h3 style={styles.offerTitle}>{coupon.title}</h3>
                      </div>
                      <span
                        style={{
                          ...styles.status,
                          ...statusTone(getCouponStatus(coupon)),
                        }}
                      >
                        {getCouponStatus(coupon)}
                      </span>
                    </div>
                    <p style={styles.offerMeta}>
                      {formatDiscount(coupon)}
                      {coupon.min_order_amount
                        ? ` · Min ${money(coupon.min_order_amount, coupon.currency_code)}`
                        : ''}
                      {coupon.max_discount_amount
                        ? ` · Cap ${money(coupon.max_discount_amount, coupon.currency_code)}`
                        : ''}
                    </p>
                    <p style={styles.offerMeta}>
                      {formatTarget(coupon, services, getServiceType)} ·{' '}
                      {coupon.redemptions_count || 0}
                      {coupon.max_redemptions
                        ? `/${coupon.max_redemptions}`
                        : ''}{' '}
                      used
                    </p>
                    <div style={styles.cardActions}>
                      <button
                        type="button"
                        style={styles.linkButton}
                        onClick={() => editCoupon(coupon)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={styles.dangerLink}
                        disabled={isDeleting}
                        onClick={() => removeCoupon(coupon.id)}
                      >
                        <span style={styles.buttonContent}>
                          {isDeleting && <span style={styles.linkSpinner} />}
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {snackbar && (
        <div
          role="status"
          aria-live="polite"
          style={{
            ...styles.snackbar,
            ...(snackbar.tone === 'success'
              ? styles.snackbarSuccess
              : styles.snackbarError),
          }}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}

function getSessionCountryCode(user: unknown) {
  const record = (user || {}) as {
    countryCode?: string;
    country_code?: string;
    partner?: { countryCode?: string; country_code?: string } | null;
  };
  return (
    record.countryCode ||
    record.country_code ||
    record.partner?.countryCode ||
    record.partner?.country_code ||
    ''
  );
}

function getDefaultCurrencyCode(
  user: unknown,
  locations:
    | { countries?: { code: string; currencyCode: string }[] }
    | undefined,
  services: { currency_code?: string }[]
) {
  const countryCode = getSessionCountryCode(user);
  const countryCurrency = locations?.countries?.find(
    (country) => country.code === countryCode
  )?.currencyCode;
  return (
    countryCurrency ||
    services.find((service) => service.currency_code)?.currency_code ||
    'INR'
  );
}

function getCurrencySymbol(
  currencyCode: string,
  locations:
    | { countries?: { currencyCode: string; currencySymbol?: string }[] }
    | undefined
) {
  return (
    locations?.countries?.find(
      (country) => country.currencyCode === currencyCode
    )?.currencySymbol || currencyCode
  );
}

function normalizeList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.items)) return record.items as T[];
    if (record.data && typeof record.data === 'object') {
      const nested = record.data as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data as T[];
      if (Array.isArray(nested.items)) return nested.items as T[];
    }
  }
  return [];
}

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </span>
      {children}
    </label>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function cleanCode(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 32);
}
function numberOrNull(value: string) {
  return value === '' ? null : Number(value);
}
function toIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}
function toLocalInput(value?: string | null) {
  return value ? value.slice(0, 16) : '';
}
function toPayload(form: FormState): PartnerCouponPayload {
  return {
    code: form.code,
    title: form.title,
    description: form.description,
    discount_type: form.discountType,
    discount_value: Number(form.discountValue || 0),
    currency_code: form.currencyCode || undefined,
    max_discount_amount: numberOrNull(form.maxDiscountAmount),
    min_order_amount: numberOrNull(form.minOrderAmount),
    starts_at: toIso(form.startsAt),
    ends_at: toIso(form.endsAt),
    max_redemptions: numberOrNull(form.maxRedemptions),
    per_customer_limit: Number(form.perCustomerLimit || 1),
    is_active: form.isActive,
    targets:
      form.targetMode === 'all'
        ? []
        : [
            {
              service_key:
                form.targetMode === 'service_key' ? form.targetValue : null,
              service_id:
                form.targetMode === 'service_id' ? form.targetValue : null,
            },
          ],
  };
}
function fromCoupon(coupon: PartnerCoupon): FormState {
  const target = coupon.targets?.[0];
  const targetMode: TargetMode = target?.service_id
    ? 'service_id'
    : target?.service_key
      ? 'service_key'
      : 'all';
  return {
    id: coupon.id,
    title: coupon.title,
    code: coupon.code,
    description: coupon.description || '',
    discountType: coupon.discount_type,
    discountValue: String(coupon.discount_value || ''),
    currencyCode: coupon.currency_code || 'INR',
    maxDiscountAmount:
      coupon.max_discount_amount == null
        ? ''
        : String(coupon.max_discount_amount),
    minOrderAmount:
      coupon.min_order_amount == null ? '' : String(coupon.min_order_amount),
    startsAt: toLocalInput(coupon.starts_at),
    endsAt: toLocalInput(coupon.ends_at),
    maxRedemptions:
      coupon.max_redemptions == null ? '' : String(coupon.max_redemptions),
    perCustomerLimit: String(coupon.per_customer_limit || 1),
    isActive: coupon.is_active,
    targetMode,
    targetValue: target?.service_id || target?.service_key || '',
  };
}
function getCouponStatus(coupon: PartnerCoupon) {
  const now = Date.now();
  if (!coupon.is_active) return 'Paused';
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now)
    return 'Scheduled';
  if (coupon.ends_at && new Date(coupon.ends_at).getTime() < now)
    return 'Expired';
  return 'Active';
}
function statusTone(status: string) {
  if (status === 'Active') return { background: '#dcfce7', color: '#15803d' };
  if (status === 'Scheduled')
    return { background: '#e0f2fe', color: '#0369a1' };
  if (status === 'Expired') return { background: '#f1f5f9', color: '#64748b' };
  return { background: '#fee2e2', color: '#b91c1c' };
}
function formatDiscount(coupon: PartnerCoupon) {
  return coupon.discount_type === 'percent'
    ? `${coupon.discount_value}% off`
    : `${money(coupon.discount_value, coupon.currency_code)} off`;
}
function money(value: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
function formatTarget(
  coupon: PartnerCoupon,
  services: { id: string; title: string }[],
  getServiceType: (key: string) => { label: string } | undefined
) {
  const target = coupon.targets?.[0];
  if (!target) return 'All services';
  if (target.service_id)
    return (
      services.find((service) => service.id === target.service_id)?.title ||
      'Specific listing'
    );
  if (target.service_key)
    return getServiceType(target.service_key)?.label || target.service_key;
  return 'All services';
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
  title: { margin: 0, color: '#111827', fontSize: 27, fontWeight: 600 },
  subtitle: { margin: '7px 0 0', color: '#64748b', fontSize: 14 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
    gap: 12,
  },
  stat: {
    display: 'grid',
    gap: 6,
    background: '#ffffff',
    border: '1px solid #e8ecf2',
    borderRadius: 10,
    padding: 16,
    color: '#64748b',
    fontSize: 13,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))',
    gap: 16,
    alignItems: 'start',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #e8ecf2',
    borderRadius: 12,
    padding: 18,
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  sectionTitle: { margin: 0, color: '#111827', fontSize: 17, fontWeight: 600 },
  helper: { color: '#64748b', fontSize: 12, lineHeight: 1.45 },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
    gap: 12,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
    gap: 12,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 13 },
  label: { color: '#475569', fontSize: 12, fontWeight: 600 },
  required: { color: '#dc2626', fontWeight: 700 },
  input: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 11px',
    fontSize: 14,
    color: '#111827',
  },
  select: {
    width: '100%',
    height: 40,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '0 10px',
    background: '#ffffff',
    color: '#111827',
    fontSize: 14,
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
  toggleRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#475569',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryButton: {
    border: 'none',
    borderRadius: 8,
    background: '#43a047',
    color: '#ffffff',
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 40,
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
  offerList: { display: 'grid', gap: 10 },
  offerCard: {
    border: '1px solid #eef2f7',
    borderRadius: 10,
    padding: 13,
    background: '#fbfcff',
  },
  offerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start',
  },
  code: {
    display: 'inline-flex',
    borderRadius: 6,
    background: '#ecfdf3',
    color: '#2e7d32',
    padding: '4px 7px',
    fontSize: 12,
    fontWeight: 700,
  },
  offerTitle: {
    margin: '8px 0 0',
    color: '#111827',
    fontSize: 15,
    fontWeight: 600,
  },
  status: {
    borderRadius: 999,
    padding: '5px 8px',
    fontSize: 11,
    fontWeight: 700,
  },
  offerMeta: {
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.45,
  },
  cardActions: { display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' },
  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#2563eb',
    padding: 0,
    fontWeight: 700,
    cursor: 'pointer',
  },
  dangerLink: {
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    padding: 0,
    fontWeight: 700,
    cursor: 'pointer',
  },
  buttonContent: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 0,
  },
  buttonSpinner: {
    width: 14,
    height: 14,
    borderRadius: '999px',
    border: '2px solid rgba(255,255,255,0.45)',
    borderTopColor: '#ffffff',
    animation: 'offerSpin 0.8s linear infinite',
  },
  linkSpinner: {
    width: 12,
    height: 12,
    borderRadius: '999px',
    border: '2px solid rgba(220,38,38,0.25)',
    borderTopColor: '#dc2626',
    animation: 'offerSpin 0.8s linear infinite',
  },
  snackbar: {
    position: 'fixed',
    right: 24,
    bottom: 24,
    zIndex: 60,
    borderRadius: 10,
    padding: '11px 14px',
    boxShadow: '0 18px 42px rgba(15, 23, 42, 0.18)',
    fontSize: 13,
    fontWeight: 700,
    maxWidth: 'min(360px, calc(100vw - 32px))',
  },
  snackbarSuccess: {
    background: '#ecfdf3',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  snackbarError: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
  },
  empty: { color: '#64748b', fontSize: 14, margin: 0 },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: 600 },
};

const offerAnimationStyles = `
  @keyframes offerSpin {
    to { transform: rotate(360deg); }
  }
`;
