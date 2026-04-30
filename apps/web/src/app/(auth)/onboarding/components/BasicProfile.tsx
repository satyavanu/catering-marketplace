'use client';

import React, { useMemo, useState, useEffect } from 'react';
import type { BasicProfileData, StepComponentProps } from '../types';
import { useOnboardingMasterDataContext } from '@/app/context/OnboardingMasterDataContext';

type BasicProfileProps = StepComponentProps<BasicProfileData>;

const DEFAULT_DATA: BasicProfileData = {
  partnerType: 'individual',
  contactName: '',
  businessName: '',
  businessDescription: '',
  countryCode: 'IN',
  baseCityId: '',
  kitchenAddress: '',
  latitude: null,
  longitude: null,
  capacityRangeId: '',
};

export default function BasicProfile({
  initialData,
  onSubmitForm,
  onBack,
  isLoading = false,
  error,
}: BasicProfileProps) {
  const { locations, masterData, isLoading: isLoadingContext } =
    useOnboardingMasterDataContext();

  const [formData, setFormData] = useState<BasicProfileData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  const [availableCities, setAvailableCities] = useState<any[]>([]);
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [availableCapacityRanges, setAvailableCapacityRanges] = useState<any[]>(
    []
  );

  const isBusiness = formData.partnerType === 'business';

  useEffect(() => {
    if (locations?.countries) setAvailableCountries(locations.countries);
  }, [locations]);

  useEffect(() => {
    if (!locations?.countries) return;

    const selectedCountry = locations.countries.find(
      (c) => c.code === formData.countryCode
    );

    if (!selectedCountry) {
      setAvailableCities([]);
      return;
    }

    const citiesInCountry = selectedCountry.states.reduce(
      (acc: any[], state) => [...acc, ...state.cities],
      []
    );

    setAvailableCities(citiesInCountry);

    if (
      formData.baseCityId &&
      !citiesInCountry.some((c) => c.id === formData.baseCityId)
    ) {
      setFormData((prev) => ({ ...prev, baseCityId: '' }));
    }
  }, [formData.countryCode, formData.baseCityId, locations]);

  useEffect(() => {
    if (masterData?.capacity_ranges) {
      setAvailableCapacityRanges(masterData.capacity_ranges);
    }
  }, [masterData]);

  const isFormValid = useMemo(() => {
    if (!formData.partnerType) return false;
    if (!formData.contactName.trim()) return false;
    if (isBusiness && !formData.businessName?.trim()) return false;
    if (!formData.countryCode.trim()) return false;
    if (!formData.baseCityId.trim()) return false;
    if (!formData.kitchenAddress.trim()) return false;
    if (!formData.capacityRangeId.trim()) return false;
    return true;
  }, [formData, isBusiness]);

  const updateField = <K extends keyof BasicProfileData>(
    field: K,
    value: BasicProfileData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading || isLoadingContext) return;

    await onSubmitForm({
      ...formData,
      contactName: formData.contactName.trim(),
      businessName: formData.businessName?.trim() || null,
      businessDescription: formData.businessDescription?.trim() || null,
      kitchenAddress: formData.kitchenAddress.trim(),
    });
  };

  if (isLoadingContext) {
    return (
      <div style={styles.card}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading your profile form...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        

        <h1 style={styles.title}>Tell us about yourself</h1>

        <p style={styles.subtitle}>
          This helps us create your partner profile and prepare your dashboard.
        </p>
      </div>

      <div style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            How do you want to join Droooly? <span style={styles.required}>*</span>
          </label>

          <div style={styles.partnerTypeGrid}>
            <button
              type="button"
              onClick={() => updateField('partnerType', 'individual')}
              disabled={isLoading}
              style={{
                ...styles.partnerTypeCard,
                ...(formData.partnerType === 'individual'
                  ? styles.partnerTypeCardActive
                  : {}),
              }}
            >
              <span style={styles.partnerIconWrap}>👨‍🍳</span>

              <span style={styles.partnerText}>
                <strong>Caterer / Cook</strong>
                <small>I provide food services personally.</small>
              </span>

              <span
                style={{
                  ...styles.radioDot,
                  ...(formData.partnerType === 'individual'
                    ? styles.radioDotActive
                    : {}),
                }}
              />
            </button>

            <button
              type="button"
              onClick={() => updateField('partnerType', 'business')}
              disabled={isLoading}
              style={{
                ...styles.partnerTypeCard,
                ...(formData.partnerType === 'business'
                  ? styles.partnerTypeCardActive
                  : {}),
              }}
            >
              <span style={styles.partnerIconWrap}>🏢</span>

              <span style={styles.partnerText}>
                <strong>Business / Company</strong>
                <small>I represent a brand, kitchen, or catering company.</small>
              </span>

              <span
                style={{
                  ...styles.radioDot,
                  ...(formData.partnerType === 'business'
                    ? styles.radioDotActive
                    : {}),
                }}
              />
            </button>
          </div>
        </div>

        <div style={styles.sectionDivider}>
          <span>Profile details</span>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Contact name <span style={styles.required}>*</span>
          </label>

          <input
            value={formData.contactName}
            disabled={isLoading}
            onChange={(e) => updateField('contactName', e.target.value)}
            placeholder="Enter your full name"
            style={styles.input}
          />
        </div>

        {isBusiness && (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Business name <span style={styles.required}>*</span>
            </label>

            <input
              value={formData.businessName || ''}
              disabled={isLoading}
              onChange={(e) => updateField('businessName', e.target.value)}
              placeholder="Enter your business or brand name"
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Business description</label>

          <textarea
            value={formData.businessDescription || ''}
            disabled={isLoading}
            onChange={(e) => updateField('businessDescription', e.target.value)}
            placeholder="Example: Homemade South Indian meals, party catering, and festival orders."
            rows={4}
            style={styles.textarea}
          />

          <p style={styles.helperText}>
            Keep it short. Customers may see this on your public profile.
          </p>
        </div>

        <div style={styles.twoColumnGrid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Country <span style={styles.required}>*</span>
            </label>

            <select
              value={formData.countryCode}
              disabled={isLoading || availableCountries.length === 0}
              onChange={(e) => updateField('countryCode', e.target.value)}
              style={styles.input}
            >
              <option value="">Select country</option>
              {availableCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.currencySymbol})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Base city <span style={styles.required}>*</span>
            </label>

            <select
              value={formData.baseCityId}
              disabled={isLoading || availableCities.length === 0}
              onChange={(e) => updateField('baseCityId', e.target.value)}
              style={styles.input}
            >
              <option value="">
                {availableCities.length === 0
                  ? 'No cities available'
                  : 'Select city'}
              </option>

              {availableCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Kitchen / pickup address <span style={styles.required}>*</span>
          </label>

          <textarea
            value={formData.kitchenAddress}
            disabled={isLoading}
            onChange={(e) => updateField('kitchenAddress', e.target.value)}
            placeholder="Enter your kitchen or pickup address"
            rows={3}
            style={styles.textarea}
          />

          <p style={styles.helperText}>
            Used for verification, delivery calculations, and service-area setup.
          </p>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Capacity range <span style={styles.required}>*</span>
          </label>

          <select
            value={formData.capacityRangeId}
            disabled={isLoading || availableCapacityRanges.length === 0}
            onChange={(e) => updateField('capacityRangeId', e.target.value)}
            style={styles.input}
          >
            <option value="">Select capacity</option>

            {availableCapacityRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
                {range.min_guests && range.max_guests
                  ? ` (${range.min_guests}–${range.max_guests} people)`
                  : range.min_guests
                    ? ` (${range.min_guests}+ people)`
                    : ''}
              </option>
            ))}
          </select>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            style={{
              ...styles.primaryButton,
              ...(!isFormValid || isLoading ? styles.disabledButton : {}),
            }}
          >
            {isLoading ? 'Saving...' : 'Save and Continue'} →
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              style={styles.secondaryButton}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '720px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.5rem',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    boxShadow: '0 18px 45px rgba(17, 24, 39, 0.08)',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  logoBadge: {
    width: 76,
    height: 76,
    margin: '0 auto 1rem',
    borderRadius: '999px',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(255, 75, 31, 0.12))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: 58,
    height: 58,
    objectFit: 'contain',
    borderRadius: '999px',
  },

  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.04em',
  },

  subtitle: {
    maxWidth: 440,
    margin: '0.6rem auto 0',
    fontSize: '0.95rem',
    color: '#6b7280',
    lineHeight: 1.55,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#374151',
  },

  required: {
    color: '#ff4b1f',
  },

  helperText: {
    margin: 0,
    fontSize: '0.82rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },

  partnerTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '0.9rem',
  },

  partnerTypeCard: {
    width: '100%',
    minHeight: 92,
    padding: '1rem',
    borderRadius: '1rem',
    border: '1.5px solid #e5e7eb',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
  },

  partnerTypeCardActive: {
    borderColor: '#7c3aed',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(255, 75, 31, 0.05))',
    boxShadow: '0 10px 26px rgba(124, 58, 237, 0.12)',
  },

  partnerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: '999px',
    backgroundColor: '#f5f3ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 21,
    flexShrink: 0,
  },

  partnerText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    color: '#111827',
  },

  radioDot: {
    width: 18,
    height: 18,
    borderRadius: '999px',
    border: '2px solid #d1d5db',
    flexShrink: 0,
  },

  radioDotActive: {
    borderColor: '#7c3aed',
    background: '#7c3aed',
    boxShadow: 'inset 0 0 0 4px #ffffff',
  },

  sectionDivider: {
    marginTop: '0.25rem',
    paddingTop: '1.2rem',
    borderTop: '1px solid #f1f1f1',
    color: '#7c3aed',
    fontSize: '0.78rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  input: {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.9rem',
    border: '1.5px solid #e5e7eb',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#ffffff',
  },

  textarea: {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.9rem',
    border: '1.5px solid #e5e7eb',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },

  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    marginTop: '0.75rem',
  },

  primaryButton: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.9rem',
    background: 'linear-gradient(135deg, #7c3aed 0%, #ff4b1f 100%)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 14px 28px rgba(124, 58, 237, 0.22)',
  },

  secondaryButton: {
    width: '100%',
    padding: '1rem',
    borderRadius: '0.9rem',
    border: '1.5px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
  },

  disabledButton: {
    background: '#d1d5db',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 700,
  },

  loadingContainer: {
    padding: '2rem',
    textAlign: 'center',
  },

  loadingText: {
    margin: 0,
    fontSize: '1rem',
    color: '#6b7280',
  },
};