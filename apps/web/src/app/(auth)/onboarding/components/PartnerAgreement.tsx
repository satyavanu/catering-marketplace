'use client';

import React, { useMemo, useRef, useState } from 'react';
import type { AgreementData, StepComponentProps } from '../types';
import { getOnboardingPresignedUploadUrl, uploadFileToS3 } from '@catering-marketplace/query-client';

type PartnerAgreementProps = StepComponentProps<AgreementData> & {
  sessionId: string;
};

const DEFAULT_DATA: AgreementData = {
  agreementVersionId: '',
  termsAccepted: false,
  privacyAccepted: false,
  signatureImage: null,
  otpVerified: true,
  signedDocumentUrl: null,
  acceptedAt: null,
};

export default function PartnerAgreement({
  initialData,
  sessionId,
  onSubmitForm,
  onBack,
  isLoading = false,
  error,
}: PartnerAgreementProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const [formData, setFormData] = useState<AgreementData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  const [showFullAgreement, setShowFullAgreement] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const agreementText = useMemo(() => generateAgreementText(), []);

  const isFormValid =
    !!formData.agreementVersionId &&
    formData.termsAccepted &&
    formData.privacyAccepted &&
    !!formData.signatureImage;

  const updateField = <K extends keyof AgreementData>(
    field: K,
    value: AgreementData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError('');
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isLoading) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current || isLoading) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current || isLoading) return;

    isDrawing.current = false;

    const image = canvasRef.current.toDataURL('image/png');
    updateField('signatureImage', image);
  };

  const clearSignature = () => {
    if (!canvasRef.current || isLoading) return;

    const ctx = canvasRef.current.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    updateField('signatureImage', null);
  };

  const downloadAgreement = () => {
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
      agreementText
    )}`;
    element.download = `Droooly_Partner_Agreement_${Date.now()}.txt`;
    element.click();
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading || isUploading) {
      setLocalError('Please accept the agreement and add your signature.');
      return;
    }

    try {
      setLocalError('');
      setIsUploading(true);

      const acceptedAt = new Date().toISOString();

      const signedAgreementPayload = {
        agreementVersionId: formData.agreementVersionId,
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
        otpVerified: formData.otpVerified,
        acceptedAt,
        signatureImage: formData.signatureImage,
        signedBy: 'partner',
      };

      const agreementBlob = new Blob(
        [JSON.stringify(signedAgreementPayload, null, 2)],
        { type: 'application/json' }
      );

      const { uploadUrl, fileKey } = await getOnboardingPresignedUploadUrl({
        sessionId,
        documentType: 'partner_agreement',
        fileName: `partner-agreement-${Date.now()}.json`,
        contentType: 'application/json',
        fileSize: agreementBlob.size,
      });

      await uploadFileToS3(uploadUrl, agreementBlob);

      await onSubmitForm({
        ...formData,
        acceptedAt,
        signedDocumentUrl: fileKey,
      });
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to sign agreement.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>Partner Agreement</h1>
        <p style={styles.subtitle}>
          Review the agreement, accept the required terms, and provide your
          digital signature to complete onboarding.
        </p>
      </div>

      <div style={styles.form}>
        <section style={styles.noticeBox}>
          <h2 style={styles.noticeTitle}>Legal confirmation</h2>
          <p style={styles.noticeText}>
            Your acceptance and digital signature will be recorded as your
            consent to the Droooly Partner Agreement.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Agreement document</h2>
              <p style={styles.helperText}>
                Read the document before continuing. You can open it in a larger
                view or download a text copy.
              </p>
            </div>

            <div style={styles.actionRow}>
              <button
                type="button"
                onClick={() => setShowFullAgreement(true)}
                disabled={isLoading}
                style={styles.secondarySmallButton}
              >
                View full agreement
              </button>

              <button
                type="button"
                onClick={downloadAgreement}
                disabled={isLoading}
                style={styles.secondarySmallButton}
              >
                Download TXT
              </button>
            </div>
          </div>

          <div style={styles.agreementPreview}>
            <pre style={styles.agreementText}>{agreementText}</pre>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Agreement version</h2>
          <p style={styles.helperText}>
            In production, this should come from your active agreement_versions
            row.
          </p>

          <input
            value={formData.agreementVersionId}
            disabled={isLoading}
            onChange={(event) =>
              updateField('agreementVersionId', event.target.value)
            }
            placeholder="Agreement version ID"
            style={styles.input}
          />
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Acceptance</h2>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              disabled={isLoading}
              onChange={(event) =>
                updateField('termsAccepted', event.target.checked)
              }
              style={styles.checkbox}
            />
            <span style={styles.checkboxText}>
              I have read, understood, and agree to the Droooly Partner
              Agreement.
            </span>
          </label>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={formData.privacyAccepted}
              disabled={isLoading}
              onChange={(event) =>
                updateField('privacyAccepted', event.target.checked)
              }
              style={styles.checkbox}
            />
            <span style={styles.checkboxText}>
              I accept the Privacy Policy and data processing terms.
            </span>
          </label>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Digital signature</h2>
          <p style={styles.helperText}>
            Sign inside the box using your mouse or trackpad.
          </p>

          <div style={styles.signatureBox}>
            <canvas
              ref={canvasRef}
              width={640}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={styles.signatureCanvas}
            />
          </div>

          <div style={styles.signatureFooter}>
            <span
              style={{
                ...styles.signatureStatus,
                color: formData.signatureImage ? '#16a34a' : '#6b7280',
              }}
            >
              {formData.signatureImage
                ? 'Signature captured'
                : 'Signature required'}
            </span>

            <button
              type="button"
              onClick={clearSignature}
              disabled={isLoading || !formData.signatureImage}
              style={styles.clearButton}
            >
              Clear signature
            </button>
          </div>
        </section>

        <section style={styles.summaryBox}>
          <h3 style={styles.summaryTitle}>What happens after this?</h3>
          <ul style={styles.summaryList}>
            <li>
              Your signature can be uploaded to S3 in the final submit flow.
            </li>
            <li>The returned S3 URL should be stored as signedDocumentUrl.</li>
            <li>The backend should create the partner agreement record.</li>
          </ul>
        </section>

        {(error || localError) && (
          <div style={styles.error}>{error || localError}</div>
        )}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading || isUploading}
            style={{
              ...styles.primaryButton,
              ...(!isFormValid || isLoading ? styles.disabledButton : {}),
            }}
          >
            {isUploading
              ? 'Uploading agreement...'
              : isLoading
                ? 'Saving...'
                : 'Sign & Continue'}
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

      {showFullAgreement && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowFullAgreement(false)}
        >
          <div
            style={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Droooly Partner Agreement</h2>
              <button
                type="button"
                onClick={() => setShowFullAgreement(false)}
                style={styles.modalCloseButton}
              >
                Close
              </button>
            </div>

            <pre style={styles.modalText}>{agreementText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function generateAgreementText() {
  return `DROOOLY PARTNER AGREEMENT

Effective Date: ${new Date().toLocaleDateString('en-IN')}

1. Appointment
Droooly allows the partner to list and provide food, catering, chef, meal, or related services through the platform.

2. Independent Partner Relationship
The partner acts as an independent service provider and is responsible for taxes, licenses, quality, food safety, delivery, and compliance.

3. KYC and Compliance
The partner must provide accurate KYC, bank, PAN, GST, FSSAI, and business details where applicable.

4. Listings and Orders
The partner must maintain accurate listings, pricing, availability, service areas, and order fulfilment commitments.

5. Payments and Payouts
Payouts will be processed as per Droooly's payout policies after deducting applicable platform fees, taxes, refunds, or penalties.

6. Cancellations and Refunds
Cancellations, refunds, and disputes will be handled according to Droooly's cancellation and refund policies.

7. Food Safety
The partner is responsible for food quality, hygiene, packaging, allergens, preparation standards, and applicable food safety compliance.

8. Suspension and Termination
Droooly may suspend or terminate a partner account for failed verification, fraud, unsafe food practices, repeated complaints, or policy violations.

9. Data and Privacy
The partner agrees to Droooly's privacy and data processing terms.

10. Acceptance
By accepting this agreement and providing a digital signature, the partner confirms that they have read, understood, and agreed to these terms.`;
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '860px',
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

  noticeBox: {
    padding: '1.25rem',
    borderRadius: '1rem',
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
  },

  noticeTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 800,
    color: '#9a3412',
  },

  noticeText: {
    margin: '0.4rem 0 0 0',
    fontSize: '0.9rem',
    color: '#9a3412',
    lineHeight: 1.5,
  },

  section: {
    padding: '1.25rem',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'flex-start',
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

  actionRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  secondarySmallButton: {
    padding: '0.65rem 0.9rem',
    borderRadius: '0.75rem',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontWeight: 700,
    cursor: 'pointer',
  },

  agreementPreview: {
    maxHeight: '260px',
    overflowY: 'auto',
    padding: '1rem',
    borderRadius: '0.875rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
  },

  agreementText: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#374151',
  },

  input: {
    width: '100%',
    marginTop: '1rem',
    padding: '0.95rem 1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
  },

  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.85rem 0',
    cursor: 'pointer',
  },

  checkbox: {
    marginTop: '0.2rem',
    width: '18px',
    height: '18px',
    accentColor: '#f97316',
  },

  checkboxText: {
    fontSize: '0.95rem',
    color: '#374151',
    lineHeight: 1.5,
    fontWeight: 600,
  },

  signatureBox: {
    marginTop: '1rem',
    border: '1.5px dashed #d1d5db',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  signatureCanvas: {
    width: '100%',
    height: '180px',
    display: 'block',
    cursor: 'crosshair',
  },

  signatureFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '0.75rem',
  },

  signatureStatus: {
    fontSize: '0.875rem',
    fontWeight: 700,
  },

  clearButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#dc2626',
    fontWeight: 800,
    cursor: 'pointer',
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

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    zIndex: 1000,
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    width: 'min(900px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    padding: '1.5rem',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '1rem',
    marginBottom: '1rem',
  },

  modalTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#111827',
  },

  modalCloseButton: {
    padding: '0.65rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
  },

  modalText: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: '#374151',
  },
};
