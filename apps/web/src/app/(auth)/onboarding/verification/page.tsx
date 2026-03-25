'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Check,
  AlertCircle,
  ChevronRight,
  Clock,
  RefreshCw,
  Mail,
  Phone,
  DollarSign,
  FileCheck,
  ShieldCheck,
  X,
  Eye,
  Download,
} from 'lucide-react';

interface VerificationData {
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  bankName: string;
  accountNumber: string;
  foodLicenseNumber: string;
  aadhaarLastFourDigits: string;
}

interface VerificationItem {
  status: 'pending' | 'verified' | 'failed';
  verifiedAt: string | null;
  failureReason?: string;
  retryCount: number;
}

export default function VerificationStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatedValue, setUpdatedValue] = useState('');

  const [verificationData, setVerificationData] = useState<VerificationData>({
    businessName: 'Tasty Kitchen',
    ownerName: 'Raj Kumar',
    ownerEmail: 'raj@example.com',
    ownerPhone: '+91-9876543210',
    bankName: 'HDFC Bank',
    accountNumber: '1234567890123',
    foodLicenseNumber: 'FL-2024-DL-000123',
    aadhaarLastFourDigits: '1234',
  });

  const [verificationStatus, setVerificationStatus] = useState({
    email: { status: 'pending', verifiedAt: null, failureReason: '', retryCount: 0 } as VerificationItem,
    phone: { status: 'pending', verifiedAt: null, failureReason: '', retryCount: 0 } as VerificationItem,
    bank: { status: 'pending', verifiedAt: null, failureReason: '', retryCount: 0 } as VerificationItem,
    foodLicense: { status: 'pending', verifiedAt: null, failureReason: '', retryCount: 0 } as VerificationItem,
    aadhaar: { status: 'pending', verifiedAt: null, failureReason: '', retryCount: 0 } as VerificationItem,
    documents: { status: 'pending', verifiedAt: null, failureReason: '', retryCount: 0 } as VerificationItem,
  });

  useEffect(() => {
    simulateVerification();
  }, []);

  const simulateVerification = () => {
    const verificationTimings = [
      { key: 'email', delay: 2000, shouldFail: false },
      { key: 'phone', delay: 4000, shouldFail: false },
      { key: 'documents', delay: 6000, shouldFail: false },
      { key: 'foodLicense', delay: 8000, shouldFail: false },
      { key: 'aadhaar', delay: 10000, shouldFail: false },
      { key: 'bank', delay: 12000, shouldFail: Math.random() > 0.7 }, // 30% chance to fail
    ];

    verificationTimings.forEach(({ key, delay, shouldFail }) => {
      setTimeout(() => {
        if (shouldFail) {
          setVerificationStatus((prev) => ({
            ...prev,
            [key]: {
              status: 'failed',
              verifiedAt: null,
              failureReason: getFailureReason(key),
              retryCount: 0,
            },
          }));
        } else {
          setVerificationStatus((prev) => ({
            ...prev,
            [key]: {
              status: 'verified',
              verifiedAt: new Date().toLocaleTimeString(),
              failureReason: '',
              retryCount: prev[key as keyof typeof prev].retryCount,
            },
          }));
        }
      }, delay);
    });
  };

  const getFailureReason = (field: string): string => {
    const reasons: Record<string, string> = {
      email: 'Email verification link expired. Please update your email.',
      phone: 'SMS verification code failed. Please verify your phone number.',
      bank: 'Bank account details do not match our records. Please recheck.',
      foodLicense: 'Food license number could not be validated. Please upload a clearer copy.',
      aadhaar: 'Aadhaar verification failed. Please try again with correct details.',
      documents: 'Document quality is poor. Please upload clearer copies.',
    };
    return reasons[field] || 'Verification failed. Please try again.';
  };

  const handleEditStart = (field: string, currentValue: string) => {
    setEditingField(field);
    setUpdatedValue(currentValue);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setUpdatedValue('');
  };

  const handleEditSave = (field: string) => {
    if (!updatedValue.trim()) {
      alert('Please enter a valid value');
      return;
    }

    // Validate based on field type
    if (field === 'ownerEmail' && !isValidEmail(updatedValue)) {
      alert('Please enter a valid email address');
      return;
    }

    if (field === 'ownerPhone' && !isValidPhone(updatedValue)) {
      alert('Please enter a valid phone number');
      return;
    }

    setVerificationData((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    // Reset status to pending for re-verification
    const statusKey = getStatusKeyFromField(field);
    setVerificationStatus((prev) => ({
      ...prev,
      [statusKey]: {
        status: 'pending',
        verifiedAt: null,
        failureReason: '',
        retryCount: prev[statusKey as keyof typeof prev].retryCount + 1,
      },
    }));

    setEditingField(null);
    setUpdatedValue('');

    // Simulate re-verification
    setTimeout(() => {
      setVerificationStatus((prev) => ({
        ...prev,
        [statusKey]: {
          status: 'verified',
          verifiedAt: new Date().toLocaleTimeString(),
          failureReason: '',
          retryCount: prev[statusKey as keyof typeof prev].retryCount,
        },
      }));
    }, 2000);
  };

  const getStatusKeyFromField = (field: string): string => {
    const mapping: Record<string, string> = {
      ownerEmail: 'email',
      ownerPhone: 'phone',
      bankName: 'bank',
      accountNumber: 'bank',
      foodLicenseNumber: 'foodLicense',
      aadhaarLastFourDigits: 'aadhaar',
    };
    return mapping[field] || field;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const allVerified = Object.values(verificationStatus).every((v) => v.status === 'verified');
  const anyFailed = Object.values(verificationStatus).some((v) => v.status === 'failed');

  const renderVerificationItem = (
    label: string,
    value: string,
    statusKey: keyof typeof verificationStatus,
    fieldName: string
  ) => {
    const status = verificationStatus[statusKey];
    const isFailed = status.status === 'failed';

    return (
      <div
        key={statusKey}
        style={{
          ...styles.verificationItem,
          backgroundColor: isFailed ? '#fef2f2' : 'white',
          borderColor: isFailed ? '#fecaca' : '#e5e7eb',
        }}
      >
        <div style={styles.itemLeft}>
          <div
            style={{
              ...styles.itemIcon,
              backgroundColor:
                status.status === 'verified'
                  ? '#dcfce7'
                  : status.status === 'failed'
                    ? '#fee2e2'
                    : '#f3f4f6',
            }}
          >
            {status.status === 'verified' && (
              <Check size={24} color="#10b981" />
            )}
            {status.status === 'failed' && (
              <AlertCircle size={24} color="#ef4444" />
            )}
            {status.status === 'pending' && (
              <Clock size={24} color="#9ca3af" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={styles.itemLabel}>{label}</p>
            {editingField === fieldName ? (
              <div style={styles.editFieldContainer}>
                <input
                  type="text"
                  value={updatedValue}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  style={styles.editInput}
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave(fieldName)}
                  style={{ ...styles.editButton, backgroundColor: '#10b981' }}
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleEditCancel}
                  style={{ ...styles.editButton, backgroundColor: '#ef4444' }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <p
                style={{
                  ...styles.itemValue,
                  color: isFailed ? '#dc2626' : '#6b7280',
                }}
              >
                {value}
              </p>
            )}
            {isFailed && status.failureReason && (
              <p style={styles.failureReason}>
                ⚠️ {status.failureReason}
              </p>
            )}
          </div>
        </div>

        <div style={styles.itemRight}>
          {status.status === 'pending' && (
            <div style={styles.pendingBadge}>
              <Clock size={16} />
              <span>Verifying...</span>
            </div>
          )}

          {status.status === 'verified' && (
            <div style={styles.verifiedBadge}>
              <Check size={16} />
              <span>Verified</span>
            </div>
          )}

          {status.status === 'failed' && (
            <button
              onClick={() => handleEditStart(fieldName, value)}
              style={styles.editFailedButton}
            >
              <RefreshCw size={14} />
              <span>Fix & Retry</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.verificationContainer}>
        {/* Header */}
        {!anyFailed && (
          <div style={styles.successAnimation}>
            <div style={styles.checkmarkCircle}>
              <Check size={64} color="white" strokeWidth={1.5} />
            </div>
          </div>
        )}

        <h1 style={styles.thankYouTitle}>
          {anyFailed ? '⚠️ Verification Update Needed' : `Thank You, ${verificationData.ownerName}!`}
        </h1>
        <p style={styles.thankYouSubtitle}>
          {anyFailed
            ? 'Some verification checks failed. Please update the details and try again.'
            : 'Your registration has been submitted successfully'}
        </p>

        {/* Verification Box */}
        <div style={styles.verificationBox}>
          <h2 style={styles.verificationTitle}>📋 Verification Status</h2>
          <p style={styles.verificationInfo}>
            {anyFailed
              ? 'Please correct the fields marked as failed and well re-verify them immediately.'
              : 'Your account is undergoing verification. This typically takes 24-48 hours. Youll receive updates via email and SMS.'}
          </p>

          {/* Verification Items */}
          <div style={styles.verificationItems}>
            {renderVerificationItem(
              'Email Verification',
              verificationData.ownerEmail,
              'email',
              'ownerEmail'
            )}

            {renderVerificationItem(
              'Phone Verification',
              verificationData.ownerPhone,
              'phone',
              'ownerPhone'
            )}

            {renderVerificationItem(
              'Documents Review',
              'PAN, TAN, Registration',
              'documents',
              'documents'
            )}

            {renderVerificationItem(
              'Food License',
              verificationData.foodLicenseNumber,
              'foodLicense',
              'foodLicenseNumber'
            )}

            {renderVerificationItem(
              'Aadhaar Verification',
              `XXXX-XXXX-${verificationData.aadhaarLastFourDigits}`,
              'aadhaar',
              'aadhaarLastFourDigits'
            )}

            {renderVerificationItem(
              'Bank Account Verification',
              `${verificationData.bankName} • ...${verificationData.accountNumber.slice(-4)}`,
              'bank',
              'accountNumber'
            )}
          </div>

          {/* Status Message */}
          <div
            style={{
              ...styles.infoBox,
              backgroundColor: allVerified ? '#dcfce7' : anyFailed ? '#fee2e2' : '#fef3c7',
              borderColor: allVerified ? '#bbf7d0' : anyFailed ? '#fecaca' : '#fde68a',
              color: allVerified ? '#166534' : anyFailed ? '#991b1b' : '#92400e',
            }}
          >
            <AlertCircle size={20} />
            <p>
              {allVerified
                ? '✅ All verifications completed! Your account is now active and ready to use.'
                : anyFailed
                  ? '❌ Please fix the failed items and we\'ll re-verify them right away.'
                  : '⏳ Verification in progress. You can continue setting up your profile while we verify your details.'}
            </p>
          </div>

          {/* Retry Summary */}
          {anyFailed && (
            <div style={styles.retrySummary}>
              <h3 style={styles.retrySummaryTitle}>🔄 Items Requiring Attention</h3>
              <div style={styles.failedItemsList}>
                {Object.entries(verificationStatus).map(([key, status]) => {
                  if (status.status === 'failed') {
                    return (
                      <div key={key} style={styles.failedItemsListItem}>
                        <X size={16} color="#ef4444" />
                        <span>{getFailureReason(key)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div style={styles.documentsBox}>
          <h3 style={styles.documentsTitle}>📄 Uploaded Documents</h3>
          <div style={styles.documentsList}>
            <div style={styles.documentItem}>
              <FileCheck size={20} color="#2563eb" />
              <div style={styles.documentInfo}>
                <p style={styles.documentName}>Food License Certificate</p>
                <p style={styles.documentStatus}>Verified ✓</p>
              </div>
              <Eye size={18} color="#2563eb" style={{ cursor: 'pointer' }} />
            </div>
            <div style={styles.documentItem}>
              <FileCheck size={20} color="#2563eb" />
              <div style={styles.documentInfo}>
                <p style={styles.documentName}>FSSAI Certificate</p>
                <p style={styles.documentStatus}>Verified ✓</p>
              </div>
              <Eye size={18} color="#2563eb" style={{ cursor: 'pointer' }} />
            </div>
            <div style={styles.documentItem}>
              <FileCheck size={20} color="#2563eb" />
              <div style={styles.documentInfo}>
                <p style={styles.documentName}>Bank Statement</p>
                <p style={styles.documentStatus}>Verified ✓</p>
              </div>
              <Eye size={18} color="#2563eb" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {allVerified && (
          <div style={styles.nextStepsBox}>
            <h3 style={styles.nextStepsTitle}>📋 What's Next?</h3>
            <div style={styles.nextStepsList}>
              <div style={styles.nextStepItem}>
                <div style={styles.stepNumber}>1</div>
                <div>
                  <p style={styles.stepItemTitle}>Complete Your Profile</p>
                  <p style={styles.stepItemDesc}>Add photos, menu items, and pricing</p>
                </div>
              </div>
              <div style={styles.nextStepItem}>
                <div style={styles.stepNumber}>2</div>
                <div>
                  <p style={styles.stepItemTitle}>Set Up Availability</p>
                  <p style={styles.stepItemDesc}>Configure your delivery schedule</p>
                </div>
              </div>
              <div style={styles.nextStepItem}>
                <div style={styles.stepNumber}>3</div>
                <div>
                  <p style={styles.stepItemTitle}>Start Accepting Orders</p>
                  <p style={styles.stepItemDesc}>Begin receiving orders from customers</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.actionButtonsContainer}>
          {allVerified ? (
            <>
              <button style={{ ...styles.buttonPrimary, flex: 1 }}>
                Go to Dashboard
                <ChevronRight size={18} />
              </button>
            </>
          ) : anyFailed ? (
            <>
              <button
                onClick={() => router.push('/onboarding')}
                style={{ ...styles.buttonSecondary, flex: 1 }}
              >
                ← Back to Edit Form
              </button>
              <button style={{ ...styles.buttonPrimary, flex: 1 }}>
                Continue Waiting
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                style={{ ...styles.buttonPrimary, flex: 1 }}
              >
                Go to Dashboard
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Contact Support */}
        <div style={styles.supportBox}>
          <p style={styles.supportTitle}>Need Help?</p>
          <p style={styles.supportText}>
            Contact our support team at <strong>support@caterhub.com</strong> or call{' '}
            <strong>+91-1234-567890</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  verificationContainer: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  successAnimation: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  checkmarkCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'scaleIn 0.5s ease-out',
  },
  thankYouTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 0.5rem 0',
    textAlign: 'center' as const,
  },
  thankYouSubtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0 0 2rem 0',
    textAlign: 'center' as const,
  },
  verificationBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '2rem',
    marginBottom: '2rem',
  },
  verificationTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  },
  verificationInfo: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0 0 1.5rem 0',
  },
  verificationItems: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  verificationItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
  },
  itemIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  itemValue: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  editFieldContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
    alignItems: 'center',
  },
  editInput: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #3b82f6',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    flex: 1,
    boxSizing: 'border-box' as const,
  },
  editButton: {
    padding: '0.5rem 0.75rem',
    border: 'none',
    borderRadius: '0.375rem',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  failureReason: {
    fontSize: '0.75rem',
    color: '#dc2626',
    marginTop: '0.5rem',
    fontStyle: 'italic',
    margin: '0.5rem 0 0 0',
  },
  itemRight: {
    display: 'flex',
    gap: '0.5rem',
  },
  pendingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  verifiedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  editFailedButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  infoBox: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid',
  },
  retrySummary: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginTop: '1rem',
  },
  retrySummaryTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#991b1b',
    margin: '0 0 0.75rem 0',
  },
  failedItemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  failedItemsListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.75rem',
    color: '#991b1b',
  },
  documentsBox: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  documentsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 1rem 0',
  },
  documentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  documentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  documentStatus: {
    fontSize: '0.75rem',
    color: '#10b981',
    margin: '0.25rem 0 0 0',
  },
  nextStepsBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bfdbfe',
    borderRadius: '0.75rem',
    padding: '2rem',
    marginBottom: '2rem',
  },
  nextStepsTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0c4a6e',
    margin: '0 0 1rem 0',
  },
  nextStepsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  nextStepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  stepItemTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  stepItemDesc: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  buttonPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    backgroundColor: '#f97316',
    color: 'white',
  },
  buttonSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #d1d5db',
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
  },
  supportBox: {
    textAlign: 'center' as const,
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
  },
  supportTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  supportText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.5rem 0 0 0',
  },
};