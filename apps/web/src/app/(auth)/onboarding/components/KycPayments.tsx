'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Loader, Upload } from 'lucide-react';

interface BankDetails {
  BANK: string;
  ADDRESS: string;
  CENTRE: string;
  CITY: string;
  MICR: string;
  NEFT: boolean;
  RTGS: boolean;
  IMPS: boolean;
  UPI: boolean;
}

interface KycPaymentsProps {
  panNumber: string;
  panFile: File | null;
  ifscCode: string;
  accountNumber: string;
  accountHolderName: string;
  upiId: string;
  bankDetails: BankDetails | null;
  isValidatingIFSC: boolean;
  ifscError: string;
  isLoading: boolean;
  error: string;
  onPanNumberChange: (value: string) => void;
  onPanFileChange: (file: File | null) => void;
  onIfscCodeChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onAccountHolderNameChange: (value: string) => void;
  onUpiIdChange: (value: string) => void;
  onIfscValidate: (code: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

export default function KycPayments({
  panNumber,
  panFile,
  ifscCode,
  accountNumber,
  accountHolderName,
  upiId,
  bankDetails,
  isValidatingIFSC,
  ifscError,
  isLoading,
  error,
  onPanNumberChange,
  onPanFileChange,
  onIfscCodeChange,
  onAccountNumberChange,
  onAccountHolderNameChange,
  onUpiIdChange,
  onIfscValidate,
  onSubmit,
  onSkip,
  onBack,
  styles,
}: KycPaymentsProps) {
  const ifscTimeoutRef = useRef<NodeJS.Timeout>();

  const handleIfscChange = (value: string) => {
    const uppercaseValue = value.toUpperCase();
    onIfscCodeChange(uppercaseValue);

    if (ifscTimeoutRef.current) {
      clearTimeout(ifscTimeoutRef.current);
    }

    if (uppercaseValue.length >= 4) {
      ifscTimeoutRef.current = setTimeout(() => {
        onIfscValidate(uppercaseValue);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (ifscTimeoutRef.current) {
        clearTimeout(ifscTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🛡️ KYC & Payments
        </h1>
        <p style={styles.subtitle}>Complete KYC to receive payments</p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.infoBox}>
          <AlertCircle
            size={20}
            color="#0284c7"
            style={{ marginRight: '0.75rem' }}
          />
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            You can skip this for now and complete later
          </p>
        </div>

        {/* PAN Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>PAN Number (Optional)</label>
          <input
            type="text"
            value={panNumber}
            onChange={(e) => onPanNumberChange(e.target.value.toUpperCase())}
            placeholder="e.g., AAAAA1234B"
            style={styles.input}
            disabled={isLoading}
            maxLength={10}
          />
          <p style={styles.helpText}>10-character PAN number</p>
        </div>

        {panNumber && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload PAN Certificate</label>
            <div style={styles.fileInputWrapper}>
              <input
                type="file"
                onChange={(e) => onPanFileChange(e.target.files?.[0] || null)}
                style={styles.fileInput}
                disabled={isLoading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Upload size={24} color="#6b7280" style={{ marginBottom: '0.5rem' }} />
              <p style={styles.helpText}>PDF, JPG, or PNG (Max 5MB)</p>
            </div>
            {panFile && <p style={styles.fileName}>✓ {panFile.name}</p>}
          </div>
        )}

        <div style={styles.divider} />

        {/* Bank Details Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Account Holder Name (Optional)</label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => onAccountHolderNameChange(e.target.value)}
            placeholder="Name as per bank account"
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Account Number (Optional)</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) =>
              onAccountNumberChange(e.target.value.replace(/[^\d]/g, ''))
            }
            placeholder="Your account number"
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>IFSC Code (Optional)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => handleIfscChange(e.target.value)}
              placeholder="e.g., SBIN0001234"
              style={styles.input}
              disabled={isLoading}
              maxLength={11}
            />
            {isValidatingIFSC && (
              <div
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <Loader
                  size={18}
                  color="#f97316"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              </div>
            )}
          </div>
          <p style={styles.helpText}>11-character IFSC code</p>

          {bankDetails && (
            <div style={styles.bankDetailsBox}>
              <div style={styles.bankDetailsRow}>
                <span style={styles.bankDetailsLabel}>Bank:</span>
                <span style={styles.bankDetailsValue}>
                  {bankDetails.BANK}
                </span>
              </div>
              <div style={styles.bankDetailsRow}>
                <span style={styles.bankDetailsLabel}>Branch:</span>
                <span style={styles.bankDetailsValue}>
                  {bankDetails.CENTRE}
                </span>
              </div>
              <div style={styles.bankDetailsRow}>
                <span style={styles.bankDetailsLabel}>City:</span>
                <span style={styles.bankDetailsValue}>
                  {bankDetails.CITY}
                </span>
              </div>
            </div>
          )}

          {ifscError && (
            <div
              style={{
                ...styles.errorMessage,
                marginTop: '0.75rem',
                marginBottom: 0,
              }}
            >
              {ifscError}
            </div>
          )}
        </div>

        {/* UPI Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>UPI ID (Optional)</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => onUpiIdChange(e.target.value)}
            placeholder="e.g., yourname@upi"
            style={styles.input}
            disabled={isLoading}
          />
          <p style={styles.helpText}>For quick payments</p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Submit Buttons */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.submitButton,
            opacity: isLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#ea580c';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f97316';
          }}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          style={styles.skipButton}
        >
          Skip for Now
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          style={styles.backButton}
        >
          Back
        </button>
      </form>
    </>
  );
}