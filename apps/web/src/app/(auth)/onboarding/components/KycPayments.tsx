'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

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

export default function KYCPayments({
  formData,
  isLoading,
  error,
  onFormDataChange,
  onSubmit,
  styles,
}: KYCPaymentsProps) {
  const [localFormData, setLocalFormData] = useState<KYCFormData>(formData);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Set<string>>(new Set());

  // PAN validation regex (Format: AAAPL5055K)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  // GST validation regex (Format: 27AABPL5055K1Z0)
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9]{1}$/;

  // FSSAI validation (10 digits)
  const fssaiRegex = /^[0-9]{10}$/;

  // UPI validation (username@bankname or mobile@bankname)
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;

  // Bank Account validation (9-18 digits)
  const accountRegex = /^[0-9]{9,18}$/;

  // IFSC validation (Format: SBIN0001234)
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  // Validate PAN format
  const validatePAN = (pan: string): boolean => {
    return panRegex.test(pan.toUpperCase());
  };

  // Validate GST format
  const validateGST = (gst: string): boolean => {
    if (!gst.trim()) return true; // Optional field
    return gstRegex.test(gst.toUpperCase());
  };

  // Validate FSSAI format
  const validateFSSAI = (fssai: string): boolean => {
    if (!fssai.trim()) return true; // Optional field
    return fssaiRegex.test(fssai);
  };

  // Validate UPI format
  const validateUPI = (upi: string): boolean => {
    if (!upi.trim()) return true; // Optional field
    return upiRegex.test(upi.toLowerCase());
  };

  // Validate Bank Account
  const validateBankAccount = (account: string): boolean => {
    return accountRegex.test(account.replace(/\s/g, ''));
  };

  // Validate IFSC Code
  const validateIFSC = (ifsc: string): boolean => {
    return ifscRegex.test(ifsc.toUpperCase());
  };

  // Validate PAN and Account Holder Name Match
  const validatePANNameMatch = (pan: string, accountHolder: string): boolean => {
    // Extract initials from PAN (first 5 characters are name initials)
    const panInitials = pan.substring(0, 5).toUpperCase();
    const accountHolderInitials = accountHolder
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();

    // Check if at least the first 3 characters match
    return panInitials.substring(0, 3) === accountHolderInitials.substring(0, 3);
  };

  // Validate all fields
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!localFormData.panNumber.trim()) {
      errors.push({ field: 'panNumber', message: 'PAN Number is required' });
    } else if (!validatePAN(localFormData.panNumber)) {
      errors.push({
        field: 'panNumber',
        message: 'Invalid PAN format. Expected format: AAAPL5055K',
      });
    }
    if (localFormData.gstNumber.trim() && !validateGST(localFormData.gstNumber)) {
      errors.push({
        field: 'gstNumber',
        message: 'Invalid GST format. Expected format: 27AABPL5055K1Z0',
      });
    }
    if (localFormData.fssaiNumber.trim() && !validateFSSAI(localFormData.fssaiNumber)) {
      errors.push({
        field: 'fssaiNumber',
        message: 'Invalid FSSAI format. Expected 10 digits',
      });
    }
    if (localFormData.upiHandle.trim() && !validateUPI(localFormData.upiHandle)) {
      errors.push({
        field: 'upiHandle',
        message: 'Invalid UPI format. Expected format: username@bankname or mobile@bankname',
      });
    }
    if (!localFormData.accountHolderName.trim()) {
      errors.push({ field: 'accountHolderName', message: 'Account Holder Name is required' });
    }

    if (!localFormData.bankAccountNumber.trim()) {
      errors.push({ field: 'bankAccountNumber', message: 'Bank Account Number is required' });
    } else if (!validateBankAccount(localFormData.bankAccountNumber)) {
      errors.push({
        field: 'bankAccountNumber',
        message: 'Invalid account number. Expected 9-18 digits',
      });
    }

    if (!localFormData.bankIfscCode.trim()) {
      errors.push({ field: 'bankIfscCode', message: 'IFSC Code is required' });
    } else if (!validateIFSC(localFormData.bankIfscCode)) {
      errors.push({
        field: 'bankIfscCode',
        message: 'Invalid IFSC Code. Expected format: SBIN0001234',
      });
    }

    return errors;
  };

  // Update validation errors whenever form data changes
  useEffect(() => {
    if (fieldTouched.size > 0) {
      setValidationErrors(validateForm());
    }
  }, [localFormData, fieldTouched]);

  // Pass form data back to parent
  useEffect(() => {
    onFormDataChange(localFormData);
  }, [localFormData, onFormDataChange]);

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value.toUpperCase(),
    }));
    setFieldTouched((prev) => new Set([...prev, field]));
  };

  const getFieldError = (field: string): ValidationError | undefined => {
    return validationErrors.find((err) => err.field === field);
  };

  const isFieldValid = (field: string): boolean => {
    return !getFieldError(field);
  };

  const isFormValid = validationErrors.length === 0 && fieldTouched.size > 0;

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>🏦 KYC & Payment Details</h1>
        <p style={styles.subtitle}>
          Verify your identity and set up your bank account for payments
        </p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        {/* Important Notice */}
        <div style={kycStyles.noticeBox}>
          <AlertCircle size={20} color="#0284c7" style={{ marginRight: '0.75rem' }} />
          <div>
            <p style={kycStyles.noticeTitle}>⚠️ Important Information</p>
            <p style={kycStyles.noticeText}>
              Your bank details and PAN information must match your registered documents. We
              verify this during onboarding for security and compliance.
            </p>
          </div>
        </div>

        {/* Section 1: Tax & Regulatory Details */}
        <div style={kycStyles.section}>
          <div style={kycStyles.sectionHeader}>
            <h2 style={kycStyles.sectionTitle}>📋 Tax & Regulatory Details</h2>
            <span style={kycStyles.sectionSubtitle}>PAN is mandatory | GST & FSSAI optional</span>
          </div>

          {/* PAN Number (MANDATORY) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              PAN Number <span style={kycStyles.mandatory}>*</span>
            </label>
            <p style={styles.helpText}>
              Permanent Account Number (Format: AAAPL5055K) - Required for all partners
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'panNumber']))}
                placeholder="E.g., ABCPL1234K"
                maxLength={10}
                style={{
                  ...styles.input,
                  borderColor: getFieldError('panNumber')
                    ? '#dc2626'
                    : isFieldValid('panNumber') && localFormData.panNumber
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.panNumber && isFieldValid('panNumber') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('panNumber') && (
              <p style={kycStyles.errorText}>{getFieldError('panNumber')?.message}</p>
            )}
            <p style={kycStyles.infoText}>
              💡 You can find your PAN on your PAN card or Income Tax return
            </p>
          </div>

          {/* GST Number (OPTIONAL) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              GST Number <span style={kycStyles.optional}>(Optional)</span>
            </label>
            <p style={styles.helpText}>
              Goods and Services Tax Registration (Format: 27AABPL5055K1Z0)
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'gstNumber']))}
                placeholder="E.g., 27ABCPL1234K1Z0"
                maxLength={15}
                style={{
                  ...styles.input,
                  borderColor: getFieldError('gstNumber')
                    ? '#dc2626'
                    : isFieldValid('gstNumber') && localFormData.gstNumber
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.gstNumber && isFieldValid('gstNumber') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('gstNumber') && (
              <p style={kycStyles.errorText}>{getFieldError('gstNumber')?.message}</p>
            )}
            <p style={kycStyles.infoText}>
              💡 If registered for GST, add your number for faster verification
            </p>
          </div>

          {/* FSSAI Number (OPTIONAL) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              FSSAI License Number <span style={kycStyles.optional}>(Optional)</span>
            </label>
            <p style={styles.helpText}>
              Food Safety & Standards Authority License (10 digits) - Highly recommended
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.fssaiNumber}
                onChange={(e) => handleInputChange('fssaiNumber', e.target.value.replace(/\D/g, ''))}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'fssaiNumber']))}
                placeholder="E.g., 1234567890"
                maxLength={10}
                style={{
                  ...styles.input,
                  borderColor: getFieldError('fssaiNumber')
                    ? '#dc2626'
                    : isFieldValid('fssaiNumber') && localFormData.fssaiNumber
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.fssaiNumber && isFieldValid('fssaiNumber') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('fssaiNumber') && (
              <p style={kycStyles.errorText}>{getFieldError('fssaiNumber')?.message}</p>
            )}
            <p style={kycStyles.infoText}>
              💡 FSSAI is mandatory for food businesses. Check your license document
            </p>
          </div>
        </div>

        {/* Section 2: Bank Account Details */}
        <div style={kycStyles.section}>
          <div style={kycStyles.sectionHeader}>
            <h2 style={kycStyles.sectionTitle}>🏦 Bank Account Details</h2>
            <span style={kycStyles.sectionSubtitle}>
              All fields mandatory | Must match PAN holder
            </span>
          </div>

          {/* Account Holder Name (MANDATORY) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Account Holder Name <span style={kycStyles.mandatory}>*</span>
            </label>
            <p style={styles.helpText}>
              Must match the name on your PAN card and bank account (First 3 characters should
              match with PAN)
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.accountHolderName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setLocalFormData((prev) => ({
                    ...prev,
                    accountHolderName: value,
                  }));
                  setFieldTouched((prev) => new Set([...prev, 'accountHolderName']));
                }}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'accountHolderName']))}
                placeholder="E.g., Priya Sharma"
                style={{
                  ...styles.input,
                  borderColor: getFieldError('accountHolderName')
                    ? '#dc2626'
                    : isFieldValid('accountHolderName') && localFormData.accountHolderName
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.accountHolderName && isFieldValid('accountHolderName') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('accountHolderName') && (
              <p style={kycStyles.errorText}>{getFieldError('accountHolderName')?.message}</p>
            )}
          </div>

          {/* Bank Account Number (MANDATORY) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Bank Account Number <span style={kycStyles.mandatory}>*</span>
            </label>
            <p style={styles.helpText}>9–18 digits (without spaces)</p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.bankAccountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setLocalFormData((prev) => ({
                    ...prev,
                    bankAccountNumber: value,
                  }));
                  setFieldTouched((prev) => new Set([...prev, 'bankAccountNumber']));
                }}
                onBlur={() =>
                  setFieldTouched((prev) => new Set([...prev, 'bankAccountNumber']))
                }
                placeholder="E.g., 123456789012345"
                style={{
                  ...styles.input,
                  borderColor: getFieldError('bankAccountNumber')
                    ? '#dc2626'
                    : isFieldValid('bankAccountNumber') && localFormData.bankAccountNumber
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.bankAccountNumber && isFieldValid('bankAccountNumber') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('bankAccountNumber') && (
              <p style={kycStyles.errorText}>{getFieldError('bankAccountNumber')?.message}</p>
            )}
            <p style={kycStyles.infoText}>
              💡 Don't share your account number with anyone other than Droooly
            </p>
          </div>

          {/* IFSC Code (MANDATORY) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Bank IFSC Code <span style={kycStyles.mandatory}>*</span>
            </label>
            <p style={styles.helpText}>
              Indian Financial System Code (Format: SBIN0001234) - Find on your bank's website
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.bankIfscCode}
                onChange={(e) => handleInputChange('bankIfscCode', e.target.value)}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'bankIfscCode']))}
                placeholder="E.g., SBIN0001234"
                maxLength={11}
                style={{
                  ...styles.input,
                  borderColor: getFieldError('bankIfscCode')
                    ? '#dc2626'
                    : isFieldValid('bankIfscCode') && localFormData.bankIfscCode
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.bankIfscCode && isFieldValid('bankIfscCode') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('bankIfscCode') && (
              <p style={kycStyles.errorText}>{getFieldError('bankIfscCode')?.message}</p>
            )}
          </div>
        </div>

        {/* Section 3: UPI Handle (OPTIONAL) */}
        <div style={kycStyles.section}>
          <div style={kycStyles.sectionHeader}>
            <h2 style={kycStyles.sectionTitle}>📱 UPI Payment Handle</h2>
            <span style={kycStyles.sectionSubtitle}>Optional - for faster payouts</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              UPI Handle <span style={kycStyles.optional}>(Optional)</span>
            </label>
            <p style={styles.helpText}>
              E.g., username@googleplay or 9876543210@paytm (for faster instant transfers)
            </p>
            <div style={kycStyles.inputWrapper}>
              <input
                type="text"
                value={localFormData.upiHandle}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  setLocalFormData((prev) => ({
                    ...prev,
                    upiHandle: value,
                  }));
                  setFieldTouched((prev) => new Set([...prev, 'upiHandle']));
                }}
                onBlur={() => setFieldTouched((prev) => new Set([...prev, 'upiHandle']))}
                placeholder="E.g., priya123@googleplay"
                style={{
                  ...styles.input,
                  borderColor: getFieldError('upiHandle')
                    ? '#dc2626'
                    : isFieldValid('upiHandle') && localFormData.upiHandle
                      ? '#10b981'
                      : '#d1d5db',
                }}
                disabled={isLoading}
              />
              {localFormData.upiHandle && isFieldValid('upiHandle') && (
                <CheckCircle size={18} color="#10b981" style={kycStyles.validIcon} />
              )}
            </div>
            {getFieldError('upiHandle') && (
              <p style={kycStyles.errorText}>{getFieldError('upiHandle')?.message}</p>
            )}
            <p style={kycStyles.infoText}>
              💡 We'll use UPI for instant payouts if provided, otherwise bank transfer (T+1)
            </p>
          </div>
        </div>

        {/* Verification Checklist */}
        <div style={kycStyles.checklistBox}>
          <h3 style={kycStyles.checklistTitle}>✓ Verification Checklist</h3>
          <ul style={kycStyles.checklistItems}>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {localFormData.panNumber && isFieldValid('panNumber') ? '✓' : '○'}
              </span>
              PAN number is valid
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {localFormData.accountHolderName &&
                localFormData.panNumber &&
                isFieldValid('accountHolderName')
                  ? '✓'
                  : '○'}
              </span>
              Account holder name matches PAN
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {localFormData.bankAccountNumber && isFieldValid('bankAccountNumber') ? '✓' : '○'}
              </span>
              Valid bank account number
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {localFormData.bankIfscCode && isFieldValid('bankIfscCode') ? '✓' : '○'}
              </span>
              Valid IFSC code
            </li>
            <li style={kycStyles.checklistItem}>
              <span style={kycStyles.checklistIcon}>
                {!getFieldError('gstNumber') || !localFormData.gstNumber ? '✓' : '○'}
              </span>
              GST verified (if applicable)
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          style={{
            ...styles.submitButton,
            opacity: isLoading || !isFormValid ? 0.6 : 1,
            cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? '⏳ Verifying Details...' : '✓ Continue to Agreement'}
        </button>

        {/* Form Status */}
        {fieldTouched.size > 0 && !isFormValid && (
          <p style={kycStyles.formStatus}>
            ⚠️ Please fill in all mandatory fields and fix validation errors
          </p>
        )}
      </form>
    </>
  );
}

// KYC Specific Styles
const kycStyles: { [key: string]: React.CSSProperties } = {
  noticeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: '#eff6ff',
    border: '2px solid #0284c7',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  noticeTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#0c4a6e',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  noticeText: {
    fontSize: '0.85rem',
    color: '#0369a1',
    margin: 0,
    lineHeight: '1.5',
  } as React.CSSProperties,

  section: {
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e5e7eb',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  } as React.CSSProperties,

  sectionSubtitle: {
    fontSize: '0.75rem',
    color: '#6b7280',
    backgroundColor: '#fff3cd',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontWeight: '500',
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

  checklistBox: {
    backgroundColor: '#ecfdf5',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '2px solid #6ee7b7',
    marginBottom: '2rem',
  } as React.CSSProperties,

  checklistTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#065f46',
    margin: '0 0 1rem 0',
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

  formStatus: {
    fontSize: '0.85rem',
    color: '#92400e',
    backgroundColor: '#fef3c7',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #fcd34d',
    margin: '1rem 0 0 0',
  } as React.CSSProperties,
};