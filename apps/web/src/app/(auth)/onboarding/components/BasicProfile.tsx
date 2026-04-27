'use client';

import React, { useMemo, useState } from 'react';
import type { BasicProfileData, StepComponentProps } from '../types';

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
  const [formData, setFormData] = useState<BasicProfileData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  const isBusiness = formData.partnerType === 'business';

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    await onSubmitForm({
      ...formData,
      contactName: formData.contactName.trim(),
      businessName: formData.businessName?.trim() || null,
      businessDescription: formData.businessDescription?.trim() || null,
      kitchenAddress: formData.kitchenAddress.trim(),
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>Basic Profile</h1>
        <p style={styles.subtitle}>
          Tell us who you are and where your kitchen or business is based.
        </p>
      </div>

      <div style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Partner type</label>

          <div style={styles.segmentGroup}>
            <button
              type="button"
              onClick={() => updateField('partnerType', 'individual')}
              disabled={isLoading}
              style={{
                ...styles.segmentButton,
                ...(formData.partnerType === 'individual'
                  ? styles.segmentButtonActive
                  : {}),
              }}
            >
              Individual
            </button>

            <button
              type="button"
              onClick={() => updateField('partnerType', 'business')}
              disabled={isLoading}
              style={{
                ...styles.segmentButton,
                ...(formData.partnerType === 'business'
                  ? styles.segmentButtonActive
                  : {}),
              }}
            >
              Business
            </button>
          </div>

          <p style={styles.helperText}>
            Choose Individual if you cook personally. Choose Business if you
            operate under a brand, kitchen, or catering company.
          </p>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Contact name</label>
          <input
            value={formData.contactName}
            disabled={isLoading}
            onChange={(e) => updateField('contactName', e.target.value)}
            placeholder="Enter your full name"
            style={styles.input}
          />
          <p style={styles.helperText}>
            This should be the main person responsible for the partner account.
          </p>
        </div>

        {isBusiness && (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Business name</label>
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
            onChange={(e) =>
              updateField('businessDescription', e.target.value)
            }
            placeholder="Example: Homemade South Indian meals, party catering, and festival food orders."
            rows={4}
            style={styles.textarea}
          />
          <p style={styles.helperText}>
            Keep it short and clear. Customers will see this on your profile.
          </p>
        </div>

        <div style={styles.twoColumnGrid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Country</label>
            <select
              value={formData.countryCode}
              disabled={isLoading}
              onChange={(e) => updateField('countryCode', e.target.value)}
              style={styles.input}
            >
              <option value="IN">India</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Base city</label>
            <select
              value={formData.baseCityId}
              disabled={isLoading}
              onChange={(e) => updateField('baseCityId', e.target.value)}
              style={styles.input}
            >
              <option value="">Select city</option>
              {/* Replace with DB/API cities */}
              <option value="hyderabad-city-id">Hyderabad</option>
              <option value="bangalore-city-id">Bengaluru</option>
              <option value="mumbai-city-id">Mumbai</option>
              <option value="delhi-city-id">Delhi</option>
            </select>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Kitchen address</label>
          <textarea
            value={formData.kitchenAddress}
            disabled={isLoading}
            onChange={(e) => updateField('kitchenAddress', e.target.value)}
            placeholder="Enter your kitchen or pickup address"
            rows={3}
            style={styles.textarea}
          />
          <p style={styles.helperText}>
            This helps us calculate delivery and service areas. It does not need
            to be publicly visible.
          </p>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Capacity range</label>
          <select
            value={formData.capacityRangeId}
            disabled={isLoading}
            onChange={(e) => updateField('capacityRangeId', e.target.value)}
            style={styles.input}
          >
            <option value="">Select capacity</option>
            {/* Replace with DB/API capacity ranges */}
            <option value="1-10-id">1–10 People</option>
            <option value="10-50-id">10–50 People</option>
            <option value="50-200-id">50–200 People</option>
            <option value="200-plus-id">200+ People</option>
          </select>
          <p style={styles.helperText}>
            Select the usual order size you can comfortably handle.
          </p>
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
            {isLoading ? 'Saving...' : 'Save and Continue'}
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
    borderRadius: '1.25rem',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  },

  header: {
    marginBottom: '2rem',
  },

  title: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#111827',
  },

  subtitle: {
    marginTop: '0.5rem',
    fontSize: '0.95rem',
    color: '#6b7280',
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
    fontWeight: 700,
    color: '#374151',
  },

  helperText: {
    margin: 0,
    fontSize: '0.82rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },

  input: {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#ffffff',
  },

  textarea: {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
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

  segmentGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },

  segmentButton: {
    padding: '1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '0.95rem',
    fontWeight: 800,
    cursor: 'pointer',
  },

  segmentButtonActive: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
    color: '#c2410c',
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
    borderRadius: '0.875rem',
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
  },

  secondaryButton: {
    width: '100%',
    padding: '1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
};