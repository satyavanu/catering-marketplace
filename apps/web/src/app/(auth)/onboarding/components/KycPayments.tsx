'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface KYCFormData {
  panNumber: string;
  gstNumber: string;
  fssaiNumber: string;
  upiHandle: string;
  accountHolderName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface KYCPaymentsProps {
  formData: KYCFormData;
  isLoading: boolean;
  error: string;
  onFormDataChange: (formData: KYCFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  styles: { [key: string]: React.CSSProperties };
}

const DEFAULT_FORM_DATA: KYCFormData = {
  panNumber: '',
  gstNumber: '',
  fssaiNumber: '',
  upiHandle: '',
  accountHolderName: '',
  bankAccountNumber: '',
  bankIfscCode: '',
};

export default function KYCPayments({
  formData = DEFAULT_FORM_DATA,
  isLoading = false,
  error = '',
  onFormDataChange,
  onSubmit,
  styles = {},
}: KYCPaymentsProps) {
  const [localFormData, setLocalFormData] = useState<KYCFormData>(formData || DEFAULT_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [fieldTouched, setFieldTouched] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['mandatory']));
  const panInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (panInputRef.current) {
      panInputRef.current.focus();
    }
  }, []);

  // Sync local form data with parent form data ONLY on initial load
  useEffect(() => {
    // Only sync if parent formData is different AND is being controlled from outside
    // Don't sync if user is typing
    if (fieldTouched.size === 0 && formData && JSON.stringify(formData) !== JSON.stringify(localFormData)) {
      setLocalFormData(formData);
    }
  }, []); // Empty dependency - only run once on mount

  // Validation function
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!localFormData.panNumber) {
      errors.push({ field: 'panNumber', message: 'PAN number is required.' });
    }
    if (!localFormData.gstNumber) {
      errors.push({ field: 'gstNumber', message: 'GST number is required.' });
    }
    if (!localFormData.fssaiNumber) {
      errors.push({ field: 'fssaiNumber', message: 'FSSAI number is required.' });
    }
    if (!localFormData.upiHandle) {
      errors.push({ field: 'upiHandle', message: 'UPI handle is required.' });
    }
    if (!localFormData.accountHolderName) {
      errors.push({ field: 'accountHolderName', message: 'Account holder name is required.' });
    }
    if (!localFormData.bankAccountNumber) {
      errors.push({ field: 'bankAccountNumber', message: 'Bank account number is required.' });
    }
    if (!localFormData.bankIfscCode) {
      errors.push({ field: 'bankIfscCode', message: 'Bank IFSC code is required.' });
    }

    return errors;
  };

  // Update validation errors whenever form data changes
  useEffect(() => {
    if (fieldTouched.size > 0) {
      setValidationErrors(validateForm());
    }
  }, [localFormData, fieldTouched]);

  // Pass form data to parent ONLY after validation
  useEffect(() => {
    if (onFormDataChange && fieldTouched.size > 0) {
      onFormDataChange(localFormData);
    }
  }, [localFormData, onFormDataChange, fieldTouched]);

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    let processedValue = value;

    // Auto-uppercase for PAN, GST, IFSC, FSSAI
    if (['panNumber', 'gstNumber', 'bankIfscCode', 'fssaiNumber'].includes(field)) {
      processedValue = value.toUpperCase();
    }

    // For bank account, remove non-numeric characters
    if (field === 'bankAccountNumber') {
      processedValue = value.replace(/\D/g, '');
    }

    // For account holder name, remove special characters but keep spaces
    if (field === 'accountHolderName') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    // For UPI, keep lowercase
    if (field === 'upiHandle') {
      processedValue = value.toLowerCase();
    }

    // Update local state
    setLocalFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Mark field as touched
    setFieldTouched((prev) => new Set([...prev, field]));
  };

  // ...rest of the component remains the same...

// ... rest of styles remain the same
const kycStyles: { [key: string]: React.CSSProperties } = {
  header: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,

  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: 0,
  } as React.CSSProperties,

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  infoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.875rem 1rem',
    backgroundColor: '#eff6ff',
    border: '1px solid #7dd3fc',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    color: '#0369a1',
  } as React.CSSProperties,

  infoBoxText: {
    margin: 0,
    lineHeight: '1.4',
  } as React.CSSProperties,

  collapsibleSection: {
    marginBottom: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  } as React.CSSProperties,

  sectionHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  } as React.CSSProperties,

  sectionIcon: {
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  } as React.CSSProperties,

  sectionSubtitle: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
    display: 'block',
    marginTop: '0.25rem',
  } as React.CSSProperties,

  sectionContent: {
    padding: '0 1.25rem 1.25rem 1.25rem',
    backgroundColor: '#f9fafb',
  } as React.CSSProperties,

  sectionNotice: {
    fontSize: '0.85rem',
    color: '#0369a1',
    backgroundColor: '#eff6ff',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    margin: '0 0 1.5rem 0',
  } as React.CSSProperties,

  formGroup: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  mandatory: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: '0.85rem',
  } as React.CSSProperties,

  optional: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: '0.8rem',
  } as React.CSSProperties,

  helpText: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0.25rem 0 0.75rem 0',
  } as React.CSSProperties,

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  validIcon: {
    position: 'absolute',
    right: '12px',
    pointerEvents: 'none',
  } as React.CSSProperties,

  errorText: {
    fontSize: '0.8rem',
    color: '#dc2626',
    margin: '0.5rem 0 0 0',
    fontWeight: '500',
  } as React.CSSProperties,

  infoText: {
    fontSize: '0.8rem',
    color: '#0284c7',
    margin: '0.5rem 0 0 0',
    fontStyle: 'italic',
  } as React.CSSProperties,

  statusSection: {
    backgroundColor: '#ecfdf5',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1.5px solid #6ee7b7',
    marginBottom: '2rem',
    marginTop: '1.5rem',
  } as React.CSSProperties,

  statusTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#065f46',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  statusList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,

  statusItem: {
    fontSize: '0.9rem',
    color: '#047857',
    margin: '0.625rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'opacity 0.2s ease',
  } as React.CSSProperties,

  statusCheck: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    backgroundColor: 'white',
    border: '2px solid #6ee7b7',
    borderRadius: '50%',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#10b981',
    flexShrink: 0,
  } as React.CSSProperties,

  skipText: {
    fontSize: '0.85rem',
    color: '#0c5f35',
    margin: '1rem 0 0 0',
    fontStyle: 'italic',
  } as React.CSSProperties,

  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '1rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    border: '1px solid #fca5a5',
  } as React.CSSProperties,

  submitButton: {
    padding: '0.875rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '44px',
  } as React.CSSProperties,
}
};