'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Info, Ban, ReceiptText, Banknote, CreditCard, Wallet } from 'lucide-react';

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
  field: keyof KYCFormData; // Ensure field type is correct
  message: string;
}

interface KYCPaymentsProps {
  formData: KYCFormData;
  isLoading: boolean;
  error: string; // Global error from parent or server
  onFormDataChange: (formData: KYCFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void; // Added onBack prop
  styles: { [key: string]: React.CSSProperties }; // Base styles from parent
}

export default function KYCPayments({
  formData,
  isLoading,
  error: globalError, // Renamed to avoid collision with local formError
  onFormDataChange,
  onSubmit,
  onBack, // Destructure onBack prop
  styles,
}: KYCPaymentsProps) {
  const [localFormData, setLocalFormData] = useState<KYCFormData>(formData);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [fieldTouched, setFieldTouched] = useState<Set<keyof KYCFormData>>(new Set()); // Corrected Set type
  const [formError, setFormError] = useState(''); // Local form submission error
  const [allFieldsInitiallyTouched, setAllFieldsInitiallyTouched] = useState(false); // New state for initial validation

  // Regex for validation
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9]{1}$/;
  const fssaiRegex = /^[0-9]{10}$/; // Assuming 10 digits as per original
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
  const accountRegex = /^[0-9]{9,18}$/; // 9-18 digits without spaces
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  // Validate individual field formats
  const validatePAN = (pan: string) => panRegex.test(pan.toUpperCase());
  const validateGST = (gst: string) => !gst.trim() || gstRegex.test(gst.toUpperCase());
  const validateFSSAI = (fssai: string) => !fssai.trim() || fssaiRegex.test(fssai);
  const validateUPI = (upi: string) => !upi.trim() || upiRegex.test(upi.toLowerCase());
  const validateBankAccount = (account: string) => accountRegex.test(account.replace(/\s/g, ''));
  const validateIFSC = (ifsc: string) => ifscRegex.test(ifsc.toUpperCase());

  // Function to perform all form validation
  const performValidation = useMemo(() => {
    return (): ValidationError[] => {
      const errors: ValidationError[] = [];

      // PAN Number
      if (!localFormData.panNumber.trim()) {
        errors.push({ field: 'panNumber', message: 'PAN Number is required.' });
      } else if (!validatePAN(localFormData.panNumber)) {
        errors.push({ field: 'panNumber', message: 'Invalid PAN format (e.g., ABCDE1234F).' });
      }

      // GST Number (Optional)
      if (localFormData.gstNumber.trim() && !validateGST(localFormData.gstNumber)) {
        errors.push({ field: 'gstNumber', message: 'Invalid GST format (e.g., 27ABCDE1234F1Z0).' });
      }

      // FSSAI Number (Optional)
      if (localFormData.fssaiNumber.trim() && !validateFSSAI(localFormData.fssaiNumber)) {
        errors.push({ field: 'fssaiNumber', message: 'Invalid FSSAI format (10 digits).' });
      }

      // Account Holder Name
      if (!localFormData.accountHolderName.trim()) {
        errors.push({ field: 'accountHolderName', message: 'Account Holder Name is required.' });
      }

      // Bank Account Number
      if (!localFormData.bankAccountNumber.trim()) {
        errors.push({ field: 'bankAccountNumber', message: 'Bank Account Number is required.' });
      } else if (!validateBankAccount(localFormData.bankAccountNumber)) {
        errors.push({ field: 'bankAccountNumber', message: 'Invalid account number (9-18 digits).' });
      }

      // IFSC Code
      if (!localFormData.bankIfscCode.trim()) {
        errors.push({ field: 'bankIfscCode', message: 'IFSC Code is required.' });
      } else if (!validateIFSC(localFormData.bankIfscCode)) {
        errors.push({ field: 'bankIfscCode', message: 'Invalid IFSC format (e.g., SBIN0001234).' });
      }

      // UPI Handle (Optional)
      if (localFormData.upiHandle.trim() && !validateUPI(localFormData.upiHandle)) {
        errors.push({ field: 'upiHandle', message: 'Invalid UPI format (e.g., user@bank).' });
      }
      return errors;
    };
  }, [localFormData]);

  // Initial validation when component mounts or formData changes initially
  useEffect(() => {
    // Only perform initial full validation if formData is fully populated
    const isFormDataComplete = Object.values(formData).every(value => value !== '' && value !== null);
    if (isFormDataComplete) {
      const initialErrors = performValidation();
      setValidationErrors(initialErrors);
      setAllFieldsInitiallyTouched(true); // Mark all fields as touched for initial display
      setFieldTouched(new Set(Object.keys(formData) as Array<keyof KYCFormData>));
    }
  }, [formData, performValidation]); // Dependency on formData to re-initiate validation


  // Re-validate form whenever localFormData or fieldTouched changes
  useEffect(() => {
    if (fieldTouched.size > 0 || allFieldsInitiallyTouched) {
      const currentErrors = performValidation();
      setValidationErrors(currentErrors);
    }
  }, [localFormData, fieldTouched, allFieldsInitiallyTouched, performValidation]);

  // Pass form data up to parent component
  useEffect(() => {
    onFormDataChange(localFormData);
  }, [localFormData, onFormDataChange]);


  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    // Specific cleaning/case-conversion for relevant fields
    let processedValue = value;
    if (field === 'panNumber' || field === 'gstNumber' || field === 'bankIfscCode') {
      processedValue = value.toUpperCase();
    } else if (field === 'fssaiNumber' || field === 'bankAccountNumber') {
      processedValue = value.replace(/\D/g, ''); // Digits only
    } else if (field === 'upiHandle') {
      processedValue = value.toLowerCase();
    } else if (field === 'accountHolderName') {
        processedValue = value.replace(/[^a-zA-Z\s.]/g, ''); // Letters, spaces, and dots
    }

    setLocalFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    setFieldTouched((prev) => new Set([...prev, field])); // Mark field as touched
  };

  const getFieldError = (field: keyof KYCFormData): string | undefined => {
    return validationErrors.find((err) => err.field === field)?.message;
  };

  const isFieldValid = (field: keyof KYCFormData): boolean => {
    // A field is valid if it's touched (or initially pre-filled) and has no error
    return (fieldTouched.has(field) || allFieldsInitiallyTouched) && !getFieldError(field);
  };

  const allRequiredFieldsFilledAndValid = useMemo(() => {
    // Check mandatory fields: PAN, Account Holder Name, Bank Account Number, IFSC
    const mandatoryFields: Array<keyof KYCFormData> = ['panNumber', 'accountHolderName', 'bankAccountNumber', 'bankIfscCode'];
    return mandatoryFields.every(field => {
      // For a mandatory field to be considered "filled and valid" for button enabling,
      // it must not have an error AND must have a non-empty value.
      return localFormData[field].trim() !== '' && !validationErrors.some(err => err.field === field);
    });
  }, [localFormData, validationErrors]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldTouched(new Set(Object.keys(localFormData) as Array<keyof KYCFormData>)); // Mark all fields as touched
    setAllFieldsInitiallyTouched(true); // Ensure all errors are visible on submit

    const latestErrors = performValidation();
    setValidationErrors(latestErrors);

    if (latestErrors.length === 0) {
      setFormError(''); // Clear any previous local error
      await onSubmit(e);
    } else {
      setFormError('Please fill in all mandatory fields and fix validation errors.');
    }
  };


  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>🏦 KYC & Payment Details</h1>
        <p style={styles.subtitle}>
          Verify your identity and set up your bank account for secure payments.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} style={styles.profileForm}>
        {/* Important Notice */}
        <div style={kycStyles.noticeBox}>
          <AlertCircle size={20} color="#0284c7" style={{ marginRight: '0.75rem' }} />
          <div>
            <p style={kycStyles.noticeTitle}>⚠️ Important Information</p>
            <p style={kycStyles.noticeText}>
              Your bank details and PAN information must match your registered documents and caterer entity. We
              verify this during onboarding for security and compliance.
            </p>
          </div>
        </div>

        {/* Section 1: Tax & Regulatory Details */}
        <div style={kycStyles.section}>
          <div style={profileStyles.stepHeader}> {/* Re-using header style */}
            <h2 style={profileStyles.stepTitle}>
                <ReceiptText size={24} style={{ marginRight: '0.6rem', color: '#4f46e5' }} />
                Tax & Regulatory Details
            </h2>
            <span style={{...kycStyles.tagLabel, backgroundColor: '#fff3cd', color: '#92400e'}}>
                PAN is mandatory | GST & FSSAI optional
            </span>
          </div>

          {[
            { field: 'panNumber', label: 'PAN Number', optional: false, placeholder: 'E.g., ABCDE1234F', helpText: 'Permanent Account Number (Format: ABCDE1234F). This identifies your business or individual entity for tax purposes.', infoText: 'You can find your PAN on your PAN card or Income Tax return.', maxLength: 10 },
            { field: 'gstNumber', label: 'GST Number', optional: true, placeholder: 'E.g., 27ABCDE1234F1Z0', helpText: 'Goods and Services Tax Identification Number (Format: 27ABCDE1234F1Z0). If registered for GST, provide your number.', infoText: 'Providing your GSTIN can expedite business verification processes.', maxLength: 15 },
            { field: 'fssaiNumber', label: 'FSSAI License Number', optional: true, placeholder: 'E.g., 1234567890', helpText: 'Food Safety & Standards Authority of India License (10 digits). Highly recommended for food service providers.', infoText: 'A valid FSSAI license is typically mandatory for all food businesses.', maxLength: 10, type: 'number' },
          ].map((item) => (
            <div style={styles.formGroup} key={item.field}>
              <label style={styles.label}>
                {item.label} {item.optional ? <span style={kycStyles.optional}>(Optional)</span> : <span style={kycStyles.mandatory}>*</span>}
              </label>
              <p style={styles.helpText}>{item.helpText}</p>
              <div style={kycStyles.inputWrapper}>
                <input
                  type={item.type || 'text'}
                  value={localFormData[item.field]}
                  onChange={(e) => handleInputChange(item.field as keyof KYCFormData, e.target.value)}
                  onBlur={() => setFieldTouched((prev) => new Set([...prev, item.field as keyof KYCFormData]))}
                  placeholder={item.placeholder}
                  maxLength={item.maxLength}
                  style={{
                    ...styles.input,
                    borderColor: getFieldError(item.field as keyof KYCFormData)
                      ? '#dc2626'
                      : isFieldValid(item.field as keyof KYCFormData) ? '#10b981' : styles.input.borderColor,
                  }}
                  disabled={isLoading}
                />
                {(isFieldValid(item.field as keyof KYCFormData) && localFormData[item.field]) && <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />}
              </div>
              {getFieldError(item.field as keyof KYCFormData) && (
                <p style={profileStyles.validationError}>
                  <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> {getFieldError(item.field as keyof KYCFormData)}
                </p>
              )}
              <p style={profileStyles.infoNote}>
                <Info size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                {item.infoText}
              </p>
            </div>
          ))}
        </div>

        {/* Section 2: Bank Account Details */}
        <div style={kycStyles.section}>
          <div style={profileStyles.stepHeader}>
            <h2 style={profileStyles.stepTitle}>
                <Banknote size={24} style={{ marginRight: '0.6rem', color: '#4f46e5' }} />
                Bank Account Details
            </h2>
            <span style={{...kycStyles.tagLabel, backgroundColor: '#ffe4e6', color: '#ef4444'}}>
                All fields mandatory
            </span>
          </div>

          {[
            { field: 'accountHolderName', label: 'Account Holder Name', placeholder: 'E.g., Priya Sharma', helpText: 'This name must exactly match the name on your PAN card and bank account.', infoText: '' },
            { field: 'bankAccountNumber', label: 'Bank Account Number', placeholder: 'E.g., 123456789012345678', helpText: '9–18 digits. Please double-check for accuracy to ensure successful payouts.', infoText: `We prioritize your privacy. Your account number is secured and used only for payouts.`, type: 'number', maxLength: 18 },
            { field: 'bankIfscCode', label: 'Bank IFSC Code', placeholder: 'E.g., SBIN0001234', helpText: 'Indian Financial System Code (Format: SBIN0001234). Find this on your bank\'s website or cheque book.', infoText: 'The IFSC code is crucial for inter-bank electronic fund transfers.', maxLength: 11 },
          ].map((item) => (
            <div style={styles.formGroup} key={item.field}>
              <label style={styles.label}>{item.label} <span style={kycStyles.mandatory}>*</span></label>
              <p style={styles.helpText}>{item.helpText}</p>
              <div style={kycStyles.inputWrapper}>
                <input
                  type={item.type || 'text'}
                  value={localFormData[item.field]}
                  onChange={(e) => handleInputChange(item.field as keyof KYCFormData, e.target.value)}
                  onBlur={() => setFieldTouched((prev) => new Set([...prev, item.field as keyof KYCFormData]))}
                  placeholder={item.placeholder}
                  maxLength={item.maxLength}
                  style={{
                    ...styles.input,
                    borderColor: getFieldError(item.field as keyof KYCFormData)
                      ? '#dc2626'
                      : isFieldValid(item.field as keyof KYCFormData) ? '#10b981' : styles.input.borderColor,
                  }}
                  disabled={isLoading}
                />
                {isFieldValid(item.field as keyof KYCFormData) && <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />}
              </div>
              {getFieldError(item.field as keyof KYCFormData) && (
                <p style={profileStyles.validationError}>
                  <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> {getFieldError(item.field as keyof KYCFormData)}
                </p>
              )}
              {item.infoText &&
                <p style={profileStyles.infoNote}>
                  <Info size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  {item.infoText}
                </p>
              }
            </div>
          ))}
        </div>

        {/* Section 3: UPI Handle (OPTIONAL) */}
        <div style={kycStyles.section}>
          <div style={profileStyles.stepHeader}>
            <h2 style={profileStyles.stepTitle}>
                <Wallet size={24} style={{ marginRight: '0.6rem', color: '#4f46e5' }} />
                UPI Payment Handle
            </h2>
            <span style={{...kycStyles.tagLabel, backgroundColor: '#e0f2fe', color: '#0284c7'}}>
                Optional - For faster payouts
            </span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>UPI Handle <span style={kycStyles.optional}>(Optional)</span></label>
            <p style={styles.helpText}>
              E.g., username@bankname or 9876543210@paytm. This allows for instant transfers.
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.upiHandle}
                onChange={(e) => handleInputChange('upiHandle', e.target.value)}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'upiHandle']))}
                placeholder="E.g., priya123@googleplay"
                style={{
                  ...styles.input,
                  borderColor: getFieldError('upiHandle')
                    ? '#dc2626'
                    : isFieldValid('upiHandle') ? '#10b981' : styles.input.borderColor,
                }}
                disabled={isLoading}
              />
              {(isFieldValid('upiHandle') && localFormData.upiHandle) && <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />}
            </div>
            {getFieldError('upiHandle') && (
              <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> {getFieldError('upiHandle')}
              </p>
            )}
            <p style={profileStyles.infoNote}>
              <Info size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
              If provided, we'll try to use UPI for instant payouts. Otherwise, bank transfer (T+1 processing time) will be used.
            </p>
          </div>
        </div>

        {/* Verification Checklist */}
        <div style={kycStyles.checklistBox}>
          <h3 style={kycStyles.checklistTitle}>
            <CheckCircle size={20} style={{ marginRight: '0.6rem' }} /> Verification Summary
          </h3>
          <ul style={kycStyles.checklistItems}>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {isFieldValid('panNumber') && localFormData.panNumber.trim() !== '' ? '✓' : '○'}
              </span>
              Valid PAN number provided
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {isFieldValid('accountHolderName') && localFormData.accountHolderName.trim() !== '' ? '✓' : '○'}
              </span>
              Account holder name provided
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {isFieldValid('bankAccountNumber') && localFormData.bankAccountNumber.trim() !== '' ? '✓' : '○'}
              </span>
              Valid bank account number provided
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {isFieldValid('bankIfscCode') && localFormData.bankIfscCode.trim() !== '' ? '✓' : '○'}
              </span>
              Valid IFSC code provided
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {(localFormData.gstNumber.trim() === '' || (isFieldValid('gstNumber') && localFormData.gstNumber.trim() !== '')) ? '✓' : '○'}
              </span>
              GST Number (Optional) is valid or not provided
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {(localFormData.fssaiNumber.trim() === '' || (isFieldValid('fssaiNumber') && localFormData.fssaiNumber.trim() !== '')) ? '✓' : '○'}
              </span>
              FSSAI License (Optional) is valid or not provided
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {(localFormData.upiHandle.trim() === '' || (isFieldValid('upiHandle') && localFormData.upiHandle.trim() !== '')) ? '✓' : '○'}
              </span>
              UPI Handle (Optional) is valid or not provided
            </li>
          </ul>
           {!allRequiredFieldsFilledAndValid && (
             <p style={{...profileStyles.validationError, marginTop: '1rem'}}>
               <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please complete all mandatory sections above.
             </p>
           )}
        </div>


        {/* Global Error Message from props or local form error */}
        {(globalError || formError) && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {globalError || formError}
          </div>
        )}

        {/* Buttons */}
        <div style={profileStyles.buttonGroup}>
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={profileStyles.backButton}
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading || validationErrors.length > 0 || !allRequiredFieldsFilledAndValid}
            style={{
              ...styles.submitButton,
              ...((isLoading || validationErrors.length > 0 || !allRequiredFieldsFilledAndValid) && profileStyles.buttonDisabled),
              position: 'relative', // For spinner
            }}
          >
            {isLoading ? (
              <>
                <span style={profileStyles.spinner}></span>
                Verifying Details...
              </>
            ) : (
              '✓ Continue to Agreement'
            )}
          </button>
        </div>
      </form>
    </>
  );
}

// Re-using common profile styles for consistent look and feel
// This set of styles should be defined once and passed to all components:
const profileStyles: { [key: string]: React.CSSProperties } = {
  stepHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e5e7eb',
    gap: '1rem', // Space between title and tag
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  validationError: {
    fontSize: '0.85rem',
    color: '#ef4444', // Red color for consistency
    margin: '0.5rem 0 0 0', // Adjusted margin for inline errors
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  infoNote: {
    fontSize: '0.85rem',
    color: '#0284c7',
    margin: '0.75rem 0 0 0',
    fontStyle: 'italic',
    padding: '0.75rem',
    backgroundColor: '#eff6ff',
    borderRadius: '0.375rem',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    animation: 'spin 1s linear infinite', // Requires `@keyframes spin` in CSS
    display: 'inline-block',
    marginRight: '0.5rem',
    verticalAlign: 'middle',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end', // Aligned to right for primary action
    gap: '1rem',
    marginTop: '2.5rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.5rem',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    ':hover': {
      backgroundColor: '#f3f4f6',
      borderColor: '#9ca3af',
      boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    },
  }
};


// KYC Specific Styles (extending or overriding base styles)
const kycStyles: { [key: string]: React.CSSProperties } = {
  noticeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: '#fffbeb', // Warmer background for notice
    border: '2px solid #fcd34d', // Yellow border
    borderRadius: '0.75rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  noticeTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#92400e', // Darker yellow/orange for title
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  noticeText: {
    fontSize: '0.85rem',
    color: '#b45309', // Medium yellow/orange for text
    margin: 0,
    lineHeight: '1.5',
  } as React.CSSProperties,

  section: {
    backgroundColor: '#ffffff', // White section background
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)', // Subtle shadow
  } as React.CSSProperties,

  tagLabel: { // Replaced sectionSubtitle with a more generic tag-like label
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.35rem 0.8rem',
    borderRadius: '9999px', // Pill shape
    whiteSpace: 'nowrap', // Prevent text wrapping
    flexShrink: 0,
  } as React.CSSProperties,

  mandatory: {
    color: '#dc2626',
    fontWeight: '700',
  } as React.CSSProperties,

  optional: {
    color: '#6b7280',
    fontSize: '0.85rem',
    fontWeight: '500',
  } as React.CSSProperties,

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  validIcon: {
    position: 'absolute',
    right: '12px',
    pointerEvents: 'none', // Allow clicks to pass through
  } as React.CSSProperties,

  checklistBox: {
    backgroundColor: '#ecfdf5',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '2px solid #6ee7b7',
    marginBottom: '2rem',
  } as React.CSSProperties,

  checklistTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#065f46',
    margin: '0 0 1rem 0',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  checklistItems: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,

  checklistItem: {
    fontSize: '0.9rem',
    color: '#047857',
    margin: '0.75rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  } as React.CSSProperties,

  checklistIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    border: '2px solid #6ee7b7',
    borderRadius: '50%',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#10b981',
    flexShrink: 0,
  } as React.CSSProperties,
};

// Merge for final export (ensure profileStyles are available)
// This is a simplified merge, in a real project you'd manage styles more systematically
Object.assign(kycStyles, profileStyles);
