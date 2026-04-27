'use client';

import React, { useMemo, useState } from 'react';
import type { KycBankData, StepComponentProps } from '../types';

type KycBankProps = StepComponentProps<KycBankData>;

const DEFAULT_DATA: KycBankData = {
  panNumber: '',
  gstNumber: '',
  fssaiNumber: '',
  accountHolderName: '',
  accountNumber: '',
  ifscCode: '',
  upiHandle: '',
};

type FieldName = keyof KycBankData;

export default function KycPayments({
  initialData,
  onSubmitForm,
  onBack,
  isLoading = false,
  error,
}: KycBankProps) {
  const [formData, setFormData] = useState<KycBankData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  const [touched, setTouched] = useState<Set<FieldName>>(new Set());
  const [localError, setLocalError] = useState('');

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  const fssaiRegex = /^[0-9]{14}$/;
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  const accountRegex = /^[0-9]{9,18}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  const updateField = (field: FieldName, value: string) => {
    let nextValue = value;

    if (field === 'panNumber' || field === 'gstNumber' || field === 'ifscCode') {
      nextValue = value.toUpperCase();
    }

    if (field === 'accountNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 18);
    }

    if (field === 'fssaiNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 14);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: nextValue,
    }));

    setLocalError('');
  };

  const markTouched = (field: FieldName) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const getFieldError = (field: FieldName) => {
    const value = String(formData[field] || '').trim();

    switch (field) {
      case 'panNumber':
        if (!value) return 'PAN number is required.';
        if (!panRegex.test(value)) return 'Enter a valid PAN number.';
        return '';

      case 'gstNumber':
        if (!value) return '';
        if (!gstRegex.test(value)) return 'Enter a valid GST number.';
        return '';

      case 'fssaiNumber':
        if (!value) return '';
        if (!fssaiRegex.test(value)) return 'Enter a valid 14-digit FSSAI number.';
        return '';

      case 'accountHolderName':
        if (!value) return 'Account holder name is required.';
        if (value.length < 2) return 'Enter a valid account holder name.';
        return '';

      case 'accountNumber':
        if (!value) return 'Bank account number is required.';
        if (!accountRegex.test(value)) return 'Account number should be 9–18 digits.';
        return '';

      case 'ifscCode':
        if (!value) return 'IFSC code is required.';
        if (!ifscRegex.test(value)) return 'Enter a valid IFSC code.';
        return '';

      case 'upiHandle':
        if (!value) return '';
        if (!upiRegex.test(value)) return 'Enter a valid UPI handle.';
        return '';

      default:
        return '';
    }
  };

  const errors = useMemo(() => {
    const fields: FieldName[] = [
      'panNumber',
      'gstNumber',
      'fssaiNumber',
      'accountHolderName',
      'accountNumber',
      'ifscCode',
      'upiHandle',
    ];

    return fields
      .map((field) => ({
        field,
        message: getFieldError(field),
      }))
      .filter((item) => item.message);
  }, [formData]);

  const isFormValid = errors.length === 0;

  const shouldShowError = (field: FieldName) => {
    return touched.has(field) && !!getFieldError(field);
  };

  const handleSubmit = async () => {
    const allFields: FieldName[] = [
      'panNumber',
      'gstNumber',
      'fssaiNumber',
      'accountHolderName',
      'accountNumber',
      'ifscCode',
      'upiHandle',
    ];

    setTouched(new Set(allFields));

    if (!isFormValid || isLoading) {
      setLocalError('Please fix the highlighted fields before continuing.');
      return;
    }

    await onSubmitForm({
      panNumber: formData.panNumber?.trim().toUpperCase() || null,
      gstNumber: formData.gstNumber?.trim().toUpperCase() || null,
      fssaiNumber: formData.fssaiNumber?.trim() || null,
      accountHolderName: formData.accountHolderName?.trim() || null,
      accountNumber: formData.accountNumber?.trim() || null,
      ifscCode: formData.ifscCode?.trim().toUpperCase() || null,
      upiHandle: formData.upiHandle?.trim().toLowerCase() || null,
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>KYC & Payout Details</h1>
        <p style={styles.subtitle}>
          Add your verification and payout information. PAN and bank details are required.
        </p>
      </div>

      <div style={styles.form}>
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Tax & Compliance</h2>
              <p style={styles.helperText}>
                PAN is required. GST and FSSAI can be added if applicable.
              </p>
            </div>
          </div>

          <div style={styles.twoColumnGrid}>
            <Field
              label="PAN number"
              required
              value={formData.panNumber || ''}
              placeholder="ABCDE1234F"
              maxLength={10}
              disabled={isLoading}
              error={shouldShowError('panNumber') ? getFieldError('panNumber') : ''}
              helperText="Required for identity and payout compliance."
              onBlur={() => markTouched('panNumber')}
              onChange={(value) => updateField('panNumber', value)}
            />

            <Field
              label="GST number"
              value={formData.gstNumber || ''}
              placeholder="27ABCDE1234F1Z5"
              maxLength={15}
              disabled={isLoading}
              error={shouldShowError('gstNumber') ? getFieldError('gstNumber') : ''}
              helperText="Optional. Add this if you are GST registered."
              onBlur={() => markTouched('gstNumber')}
              onChange={(value) => updateField('gstNumber', value)}
            />

            <Field
              label="FSSAI license number"
              value={formData.fssaiNumber || ''}
              placeholder="14-digit FSSAI number"
              maxLength={14}
              disabled={isLoading}
              error={
                shouldShowError('fssaiNumber')
                  ? getFieldError('fssaiNumber')
                  : ''
              }
              helperText="Optional during onboarding, but recommended for food partners."
              onBlur={() => markTouched('fssaiNumber')}
              onChange={(value) => updateField('fssaiNumber', value)}
            />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Bank Account</h2>
              <p style={styles.helperText}>
                This account will be used for partner payouts.
              </p>
            </div>
          </div>

          <div style={styles.twoColumnGrid}>
            <Field
              label="Account holder name"
              required
              value={formData.accountHolderName || ''}
              placeholder="Enter account holder name"
              disabled={isLoading}
              error={
                shouldShowError('accountHolderName')
                  ? getFieldError('accountHolderName')
                  : ''
              }
              helperText="Use the exact name shown on the bank account."
              onBlur={() => markTouched('accountHolderName')}
              onChange={(value) => updateField('accountHolderName', value)}
            />

            <Field
              label="Bank account number"
              required
              value={formData.accountNumber || ''}
              placeholder="Enter bank account number"
              maxLength={18}
              inputMode="numeric"
              disabled={isLoading}
              error={
                shouldShowError('accountNumber')
                  ? getFieldError('accountNumber')
                  : ''
              }
              helperText="Enter 9–18 digits. Double-check before continuing."
              onBlur={() => markTouched('accountNumber')}
              onChange={(value) => updateField('accountNumber', value)}
            />

            <Field
              label="IFSC code"
              required
              value={formData.ifscCode || ''}
              placeholder="SBIN0001234"
              maxLength={11}
              disabled={isLoading}
              error={shouldShowError('ifscCode') ? getFieldError('ifscCode') : ''}
              helperText="You can find this on your cheque book or banking app."
              onBlur={() => markTouched('ifscCode')}
              onChange={(value) => updateField('ifscCode', value)}
            />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>UPI</h2>
              <p style={styles.helperText}>
                Optional. Add a UPI handle if you want to support faster payout options later.
              </p>
            </div>
          </div>

          <Field
            label="UPI handle"
            value={formData.upiHandle || ''}
            placeholder="name@bank"
            disabled={isLoading}
            error={shouldShowError('upiHandle') ? getFieldError('upiHandle') : ''}
            helperText="Example: ravi@okaxis, priya@paytm, kitchen@upi."
            onBlur={() => markTouched('upiHandle')}
            onChange={(value) => updateField('upiHandle', value)}
          />
        </section>

        <section style={styles.summaryBox}>
          <h3 style={styles.summaryTitle}>Before you continue</h3>
          <ul style={styles.summaryList}>
            <li>PAN should match the partner or business owner.</li>
            <li>Bank details should be accurate for successful payouts.</li>
            <li>GST, FSSAI, and UPI can be updated later if needed.</li>
          </ul>
        </section>

        {(error || localError) && (
          <div style={styles.error}>{error || localError}</div>
        )}

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

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  onChange: (value: string) => void;
  onBlur: () => void;
}

function Field({
  label,
  value,
  placeholder,
  helperText,
  error,
  required,
  disabled,
  maxLength,
  inputMode,
  onChange,
  onBlur,
}: FieldProps) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>

      {helperText && <p style={styles.fieldHelperText}>{helperText}</p>}

      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...styles.input,
          ...(error ? styles.inputError : {}),
        }}
      />

      {error && <p style={styles.validationText}>{error}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '820px',
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
    lineHeight: 1.5,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  section: {
    padding: '1.25rem',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
  },

  sectionHeader: {
    marginBottom: '1rem',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#111827',
  },

  helperText: {
    margin: '0.35rem 0 0 0',
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },

  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#374151',
  },

  required: {
    color: '#dc2626',
  },

  fieldHelperText: {
    margin: 0,
    fontSize: '0.82rem',
    color: '#6b7280',
    lineHeight: 1.45,
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

  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fff7f7',
  },

  validationText: {
    margin: 0,
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#dc2626',
  },

  summaryBox: {
    padding: '1.25rem',
    borderRadius: '1rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
  },

  summaryTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '1rem',
    fontWeight: 800,
    color: '#111827',
  },

  summaryList: {
    margin: 0,
    paddingLeft: '1.2rem',
    color: '#4b5563',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 600,
  },

  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    marginTop: '0.5rem',
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
};