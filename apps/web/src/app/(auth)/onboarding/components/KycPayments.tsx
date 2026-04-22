'use client';

import React, { useState, useRef } from 'react';
import { AlertCircle, Upload, X, CheckCircle, ChevronDown } from 'lucide-react';

interface DocumentUpload {
  type: string;
  name: string;
  file: File | null;
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
  } | null;
  frontFile?: File | null;
  backFile?: File | null;
  frontMetadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
  } | null;
  backMetadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
  } | null;
}

interface KycPaymentsFormData {
  documents: {
    fssaiLicense: DocumentUpload;
    panCard: DocumentUpload;
    gstCertificate: DocumentUpload;
    cancelledCheque: DocumentUpload;
    businessAddressProof: DocumentUpload;
    ownerIdentity: DocumentUpload;
    partnershipDeed?: DocumentUpload;
  };
  upiId: string;
}

interface KycPaymentsProps {
  upiId: string;
  isLoading: boolean;
  error: string;
  onUpiIdChange: (value: string) => void;
  onSubmit: (formData: KycPaymentsFormData) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

const DOCUMENT_CATEGORIES = [
  {
    id: 'business',
    title: 'Business Registration',
    icon: '🏢',
    documents: [
      {
        id: 'fssaiLicense',
        name: 'FSSAI License',
        description: 'Proof of food safety certification',
        required: true,
        hasFrontBack: false,
      },
      {
        id: 'gstCertificate',
        name: 'GST Certificate',
        description: 'Essential for tax and invoice generation',
        required: true,
        hasFrontBack: false,
      },
      {
        id: 'partnershipDeed',
        name: 'Partnership Deed / CoI',
        description: 'Only if business is NOT a sole proprietorship',
        required: false,
        hasFrontBack: false,
      },
    ],
  },
  {
    id: 'financial',
    title: 'Financial & Banking',
    icon: '🏦',
    documents: [
      {
        id: 'cancelledCheque',
        name: 'Cancelled Cheque',
        description: 'Must match legal name on PAN/GST',
        required: true,
        hasFrontBack: false,
      },
      {
        id: 'panCard',
        name: 'PAN Card',
        description: 'Individual (proprietors) or Company PAN',
        required: true,
        hasFrontBack: true,
      },
    ],
  },
  {
    id: 'owner',
    title: 'Owner & Address',
    icon: '👤',
    documents: [
      {
        id: 'ownerIdentity',
        name: "Owner's Identity",
        description: 'Aadhaar or Voter ID',
        required: true,
        hasFrontBack: true,
      },
      {
        id: 'businessAddressProof',
        name: 'Business Address Proof',
        description: 'Rent agreement or utility bill',
        required: true,
        hasFrontBack: false,
      },
    ],
  },
];

export default function KycPayments({
  upiId,
  isLoading,
  error,
  onUpiIdChange,
  onSubmit,
  onSkip,
  onBack,
  styles,
}: KycPaymentsProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [expandedCategory, setExpandedCategory] = useState<string>('business');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const [documents, setDocuments] = useState<{ [key: string]: DocumentUpload }>({
    fssaiLicense: { type: 'fssaiLicense', name: 'FSSAI License', file: null, metadata: null },
    panCard: {
      type: 'panCard',
      name: 'PAN Card',
      file: null,
      metadata: null,
      frontFile: null,
      backFile: null,
      frontMetadata: null,
      backMetadata: null,
    },
    gstCertificate: { type: 'gstCertificate', name: 'GST Certificate', file: null, metadata: null },
    cancelledCheque: { type: 'cancelledCheque', name: 'Cancelled Cheque', file: null, metadata: null },
    businessAddressProof: {
      type: 'businessAddressProof',
      name: 'Business Address Proof',
      file: null,
      metadata: null,
    },
    ownerIdentity: {
      type: 'ownerIdentity',
      name: "Owner's Identity",
      file: null,
      metadata: null,
      frontFile: null,
      backFile: null,
      frontMetadata: null,
      backMetadata: null,
    },
    partnershipDeed: { type: 'partnershipDeed', name: 'Partnership Deed', file: null, metadata: null },
  });

  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({});

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSizeKB = 500;
    const maxSizeBytes = maxSizeKB * 1024;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF, JPG, or PNG files are allowed' };
    }

    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size must be less than ${maxSizeKB}KB` };
    }

    return { valid: true };
  };

  const getFileMetadata = (file: File) => ({
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadedAt: new Date().toISOString(),
  });

  const handleFileChange = (docId: string, file: File | null, side?: 'front' | 'back') => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setFileErrors((prev) => ({
        ...prev,
        [side ? `${docId}-${side}` : docId]: validation.error || '',
      }));
      return;
    }

    setFileErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[side ? `${docId}-${side}` : docId];
      return newErrors;
    });

    setDocuments((prev) => {
      if (side) {
        return {
          ...prev,
          [docId]: {
            ...prev[docId],
            [`${side}File`]: file,
            [`${side}Metadata`]: getFileMetadata(file),
          },
        };
      }

      return {
        ...prev,
        [docId]: {
          ...prev[docId],
          file,
          metadata: getFileMetadata(file),
        },
      };
    });

    setSelectedDoc(null);
  };

  const handleRemoveFile = (docId: string, side?: 'front' | 'back') => {
    setDocuments((prev) => {
      if (side) {
        return {
          ...prev,
          [docId]: {
            ...prev[docId],
            [`${side}File`]: null,
            [`${side}Metadata`]: null,
          },
        };
      }

      return {
        ...prev,
        [docId]: {
          ...prev[docId],
          file: null,
          metadata: null,
        },
      };
    });

    setFileErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[side ? `${docId}-${side}` : docId];
      return newErrors;
    });
  };

  // Check required documents
  const requiredDocsFilled = DOCUMENT_CATEGORIES.flatMap((cat) => cat.documents)
    .filter((doc) => doc.required)
    .every((doc) => {
      const docData = documents[doc.id];
      if (doc.hasFrontBack) {
        return docData.frontFile && docData.backFile;
      }
      return docData.file;
    });

  const isFormValid = requiredDocsFilled && upiId.trim().length > 0;

  const getDocumentStatus = (docId: string) => {
    const doc = DOCUMENT_CATEGORIES.flatMap((cat) => cat.documents).find((d) => d.id === docId);
    if (!doc) return null;

    const docData = documents[docId];

    if (doc.hasFrontBack) {
      if (docData.frontFile && docData.backFile) return 'complete';
      if (docData.frontFile || docData.backFile) return 'partial';
    } else {
      if (docData.file) return 'complete';
    }

    return 'pending';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    const formData: KycPaymentsFormData = {
      documents: {
        fssaiLicense: documents.fssaiLicense,
        panCard: documents.panCard,
        gstCertificate: documents.gstCertificate,
        cancelledCheque: documents.cancelledCheque,
        businessAddressProof: documents.businessAddressProof,
        ownerIdentity: documents.ownerIdentity,
        partnershipDeed: documents.partnershipDeed,
      },
      upiId,
    };

    await onSubmit(formData);
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>🛡️ KYC & Payments</h1>
        <p style={styles.subtitle}>
          Complete KYC to receive payments. We'll verify your documents to ensure compliance.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.profileForm}>
        {/* Info Box */}
        <div style={styles.infoBox}>
          <AlertCircle size={20} color="#0284c7" style={{ marginRight: '0.75rem' }} />
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            You can skip KYC for now, but you won't receive payments until it's complete. All
            documents must be clear and match your registered business details.
          </p>
        </div>

        {/* Two Column Layout */}
        <div style={kycStyles.mainContainer}>
          {/* Left: Document Categories List */}
          <div style={kycStyles.categoriesPanel}>
            <h2 style={kycStyles.panelTitle}>Required Documents</h2>
            <p style={kycStyles.panelSubtitle}>
              Upload clear scans or photos (PDF, JPG, PNG - Max 500KB)
            </p>

            {DOCUMENT_CATEGORIES.map((category) => (
              <div key={category.id} style={kycStyles.categorySection}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category.id ? '' : category.id)
                  }
                  style={kycStyles.categoryHeader}
                >
                  <span style={kycStyles.categoryIcon}>{category.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h3 style={kycStyles.categoryTitle}>{category.title}</h3>
                    <p style={kycStyles.categoryCount}>
                      {category.documents.filter((d) => getDocumentStatus(d.id) === 'complete')
                        .length}/{category.documents.length} uploaded
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: expandedCategory === category.id ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {expandedCategory === category.id && (
                  <div style={kycStyles.documentsList}>
                    {category.documents.map((doc) => {
                      const status = getDocumentStatus(doc.id);
                      const isSelected = selectedDoc === doc.id;

                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setSelectedDoc(isSelected ? null : doc.id)}
                          style={{
                            ...kycStyles.documentListItem,
                            ...(isSelected ? kycStyles.documentListItemSelected : {}),
                            ...(status === 'complete' ? kycStyles.documentListItemComplete : {}),
                          }}
                        >
                          <div style={kycStyles.documentListInfo}>
                            <h4 style={kycStyles.documentListName}>
                              {doc.name}
                              {doc.required && (
                                <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>
                              )}
                            </h4>
                            <p style={kycStyles.documentListDesc}>{doc.description}</p>
                            {doc.hasFrontBack && (
                              <p style={kycStyles.documentListSides}>
                                Front {documents[doc.id].frontFile ? '✓' : '○'} • Back{' '}
                                {documents[doc.id].backFile ? '✓' : '○'}
                              </p>
                            )}
                          </div>
                          {status === 'complete' && (
                            <CheckCircle size={20} color="#10b981" />
                          )}
                          {status === 'partial' && (
                            <div style={kycStyles.partialIndicator}>⚠️</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Upload Section */}
          <div style={kycStyles.uploadPanel}>
            {selectedDoc ? (
              <UploadSection
                docId={selectedDoc}
                docConfig={DOCUMENT_CATEGORIES.flatMap((cat) => cat.documents).find(
                  (d) => d.id === selectedDoc
                )!}
                docData={documents[selectedDoc]}
                fileErrors={fileErrors}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
                fileInputRefs={fileInputRefs}
                isLoading={isLoading}
                styles={kycStyles}
              />
            ) : (
              <div style={kycStyles.uploadPanelEmpty}>
                <Upload size={48} color="#d1d5db" />
                <p style={kycStyles.uploadPanelEmptyText}>Select a document to upload</p>
              </div>
            )}
          </div>
        </div>

        {/* UPI Section */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Payment Details</h2>
          <p style={styles.sectionSubtitle}>
            We'll verify your UPI and set up direct bank transfers for your earnings
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>UPI ID *</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => onUpiIdChange(e.target.value)}
              placeholder="e.g., yourname@googleplay or yourname@okhdfcbank"
              style={styles.input}
              disabled={isLoading}
              required
            />
            <p style={styles.helpText}>
              Your UPI will be used for quick settlements. We'll verify it with a penny drop test.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {/* Validation Error */}
        {!requiredDocsFilled && (
          <div style={kycStyles.warningMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            Please upload all required documents (marked with *)
          </div>
        )}

        {/* Submit Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            style={{
              ...styles.submitButton,
              opacity: isLoading || !isFormValid ? 0.6 : 1,
              cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && isFormValid) {
                e.currentTarget.style.backgroundColor = '#ea580c';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f97316';
            }}
          >
            {isLoading ? 'Uploading...' : 'Complete KYC'}
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
        </div>
      </form>
    </>
  );
}

// Separate Upload Section Component
interface UploadSectionProps {
  docId: string;
  docConfig: any;
  docData: DocumentUpload;
  fileErrors: { [key: string]: string };
  onFileChange: (docId: string, file: File | null, side?: 'front' | 'back') => void;
  onRemoveFile: (docId: string, side?: 'front' | 'back') => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  isLoading: boolean;
  styles: { [key: string]: React.CSSProperties };
}

function UploadSection({
  docId,
  docConfig,
  docData,
  fileErrors,
  onFileChange,
  onRemoveFile,
  fileInputRefs,
  isLoading,
  styles,
}: UploadSectionProps) {
  return (
    <div style={styles.uploadSectionContent}>
      <div style={styles.uploadHeader}>
        <h3 style={styles.uploadTitle}>{docConfig.name}</h3>
        <p style={styles.uploadDesc}>{docConfig.description}</p>
      </div>

      {/* Single File */}
      {!docConfig.hasFrontBack && (
        <div style={styles.uploadContainer}>
          {!docData.file ? (
            <FileUploadBox
              onClick={() => fileInputRefs.current[docId]?.click()}
              onDragDrop={(file) => onFileChange(docId, file)}
              isLoading={isLoading}
              styles={styles}
            >
              <input
                ref={(el) => {
                  if (el) fileInputRefs.current[docId] = el;
                }}
                type="file"
                onChange={(e) => onFileChange(docId, e.target.files?.[0] || null)}
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isLoading}
              />
            </FileUploadBox>
          ) : (
            <FileUploadedItem
              fileName={docData.metadata?.fileName || ''}
              fileSize={docData.metadata?.fileSize || 0}
              onRemove={() => onRemoveFile(docId)}
            />
          )}

          {fileErrors[docId] && (
            <div style={styles.uploadError}>
              <AlertCircle size={16} />
              {fileErrors[docId]}
            </div>
          )}
        </div>
      )}

      {/* Front & Back */}
      {docConfig.hasFrontBack && (
        <div style={styles.frontBackGrid}>
          {/* Front */}
          <div>
            <h4 style={styles.sideTitle}>Front Side</h4>
            {!docData.frontFile ? (
              <FileUploadBox
                onClick={() => fileInputRefs.current[`${docId}-front`]?.click()}
                onDragDrop={(file) => onFileChange(docId, file, 'front')}
                isLoading={isLoading}
                styles={styles}
              >
                <input
                  ref={(el) => {
                    if (el) fileInputRefs.current[`${docId}-front`] = el;
                  }}
                  type="file"
                  onChange={(e) => onFileChange(docId, e.target.files?.[0] || null, 'front')}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isLoading}
                />
              </FileUploadBox>
            ) : (
              <FileUploadedItem
                fileName={docData.frontMetadata?.fileName || ''}
                fileSize={docData.frontMetadata?.fileSize || 0}
                onRemove={() => onRemoveFile(docId, 'front')}
              />
            )}
            {fileErrors[`${docId}-front`] && (
              <div style={styles.uploadError}>
                <AlertCircle size={16} />
                {fileErrors[`${docId}-front`]}
              </div>
            )}
          </div>

          {/* Back */}
          <div>
            <h4 style={styles.sideTitle}>Back Side</h4>
            {!docData.backFile ? (
              <FileUploadBox
                onClick={() => fileInputRefs.current[`${docId}-back`]?.click()}
                onDragDrop={(file) => onFileChange(docId, file, 'back')}
                isLoading={isLoading}
                styles={styles}
              >
                <input
                  ref={(el) => {
                    if (el) fileInputRefs.current[`${docId}-back`] = el;
                  }}
                  type="file"
                  onChange={(e) => onFileChange(docId, e.target.files?.[0] || null, 'back')}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isLoading}
                />
              </FileUploadBox>
            ) : (
              <FileUploadedItem
                fileName={docData.backMetadata?.fileName || ''}
                fileSize={docData.backMetadata?.fileSize || 0}
                onRemove={() => onRemoveFile(docId, 'back')}
              />
            )}
            {fileErrors[`${docId}-back`] && (
              <div style={styles.uploadError}>
                <AlertCircle size={16} />
                {fileErrors[`${docId}-back`]}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// File Upload Box Component
function FileUploadBox({
  onClick,
  onDragDrop,
  isLoading,
  styles,
  children,
}: {
  onClick: () => void;
  onDragDrop: (file: File) => void;
  isLoading: boolean;
  styles: { [key: string]: React.CSSProperties };
  children?: React.ReactNode;
}) {
  return (
    <div
      style={styles.fileUploadBox}
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = '#f3f4f6';
        e.currentTarget.style.borderColor = '#667eea';
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.borderColor = '#e5e7eb';
        onDragDrop(e.dataTransfer.files[0]);
      }}
    >
      <Upload size={32} color="#9ca3af" style={{ marginBottom: '0.5rem' }} />
      <p style={styles.uploadText}>Click to upload or drag and drop</p>
      <p style={styles.uploadSubtext}>PDF, JPG, PNG (Max 500KB)</p>
    </div>
  );
}

// File Uploaded Item Component
function FileUploadedItem({
  fileName,
  fileSize,
  onRemove,
}: {
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}) {
  const kycStyles = {
    fileItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #86efac',
      borderRadius: '0.375rem',
    } as React.CSSProperties,
  };

  return (
    <div style={kycStyles.fileItem}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <CheckCircle size={20} color="#10b981" />
        <div style={{ marginLeft: '0.75rem' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            {fileName}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
            {(fileSize / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        style={{
          padding: '0.5rem',
          border: 'none',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Styles
const kycStyles = {
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem',
    marginTop: '1.5rem',
  } as React.CSSProperties,

  categoriesPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,

  panelTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  panelSubtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  categorySection: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  } as React.CSSProperties,

  categoryHeader: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  } as React.CSSProperties,

  categoryIcon: {
    fontSize: '1.5rem',
    minWidth: '1.5rem',
  } as React.CSSProperties,

  categoryTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  } as React.CSSProperties,

  categoryCount: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: '0.25rem 0 0 0',
  } as React.CSSProperties,

  documentsList: {
    padding: '0.75rem',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as React.CSSProperties,

  documentListItem: {
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,

  documentListItemSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#667eea',
    borderWidth: '2px',
  } as React.CSSProperties,

  documentListItemComplete: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  } as React.CSSProperties,

  documentListInfo: {
    flex: 1,
  } as React.CSSProperties,

  documentListName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  documentListDesc: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  documentListSides: {
    fontSize: '0.7rem',
    color: '#9ca3af',
    margin: '0.25rem 0 0 0',
    fontWeight: '500',
  } as React.CSSProperties,

  partialIndicator: {
    fontSize: '1rem',
  } as React.CSSProperties,

  uploadPanel: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: '#fafafa',
    padding: '2rem',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    sticky: 'top',
    top: '2rem',
  } as React.CSSProperties,

  uploadPanelEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    color: '#9ca3af',
  } as React.CSSProperties,

  uploadPanelEmptyText: {
    fontSize: '1rem',
    color: '#9ca3af',
    margin: 0,
  } as React.CSSProperties,

  uploadSectionContent: {
    width: '100%',
  } as React.CSSProperties,

  uploadHeader: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  uploadTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  uploadDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,

  fileUploadBox: {
    border: '2px dashed #e5e7eb',
    borderRadius: '0.5rem',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
  } as React.CSSProperties,

  uploadText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0.5rem 0 0.25rem 0',
  } as React.CSSProperties,

  uploadSubtext: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: 0,
  } as React.CSSProperties,

  uploadError: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #dc2626',
    borderRadius: '0.375rem',
    color: '#991b1b',
    fontSize: '0.875rem',
  } as React.CSSProperties,

  frontBackGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  } as React.CSSProperties,

  sideTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.75rem',
    margin: '0 0 0.75rem 0',
  } as React.CSSProperties,

  warningMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0.875rem 1rem',
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #f59e0b',
    borderRadius: '0.375rem',
    color: '#92400e',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
};