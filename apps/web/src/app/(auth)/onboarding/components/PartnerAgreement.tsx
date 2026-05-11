'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
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

 
  const downloadAgreementPdf = async () => {
    const agreementElement = document.getElementById('agreement-content');
  
    if (!agreementElement) return;
  
    const canvas = await html2canvas(agreementElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY,
    });
  
    const imgData = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
  
    const imgWidth = pageWidth;
    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;
  
    let heightLeft = imgHeight;
    let position = 0;
  
    // First page
    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
  
    heightLeft -= pageHeight;
  
    // Additional pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
  
      pdf.addPage();
  
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
  
      heightLeft -= pageHeight;
    }
  
    pdf.save(
      `Droooly_Partner_Agreement_${Date.now()}.pdf`
    );
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
        {/*
        <section style={styles.noticeBox}>
          <h2 style={styles.noticeTitle}>Legal confirmation</h2>
          <p style={styles.noticeText}>
            Your acceptance and digital signature will be recorded as your
            consent to the Droooly Partner Agreement.
          </p>
        </section>
   */}
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
                onClick={downloadAgreementPdf}
                disabled={isLoading}
                style={styles.secondarySmallButton}
              >
                Download PDF
              </button>
            </div>
          </div>

     

          <div style={styles.agreementPreview}>
  <div id="agreement-content" style={styles.pdfPage}>
    <ReactMarkdown
      components={{
        img: ({ src, alt }) => (
          <img
            src={src || ''}
            alt={alt || 'Droooly Logo'}
            style={styles.logo}
            crossOrigin="anonymous"
          />
        ),
        h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
        h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
        h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
        p: ({ children }) => <p style={styles.p}>{children}</p>,
        ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
        li: ({ children }) => <li style={styles.li}>{children}</li>,
        hr: () => <div style={styles.hr} />,
        strong: ({ children }) => <strong style={styles.strong}>{children}</strong>,
      }}
    >
      {agreementText}
    </ReactMarkdown>
  </div>
</div>
        </section>

{/*
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
        */}

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
{/*
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
 */}
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

            <div style={styles.agreementPreview}>
  <div id="agreement-content" style={styles.pdfPage}>
    <ReactMarkdown
      components={{
        img: ({ src, alt }) => (
          <img
            src={src || ''}
            alt={alt || 'Droooly Logo'}
            style={styles.logo}
            crossOrigin="anonymous"
          />
        ),
        h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
        h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
        h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
        p: ({ children }) => <p style={styles.p}>{children}</p>,
        ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
        li: ({ children }) => <li style={styles.li}>{children}</li>,
        hr: () => <div style={styles.hr} />,
        strong: ({ children }) => <strong style={styles.strong}>{children}</strong>,
      }}
    >
      {agreementText}
    </ReactMarkdown>
  </div>
</div>
          </div>
        </div>
      )}
    </div>
  );
}

const DROOOLY_LOGO_URL =
  'https://ckklrguidafoseanzmdk.supabase.co/storage/v1/object/public/assets/logo/logo.png';

export function generateAgreementText() {
  return `
# DROOOLY PARTNER PLATFORM AGREEMENT

![Droooly Logo](${DROOOLY_LOGO_URL})

**Version:** 1.0  
**Effective Date:** ${new Date().toLocaleDateString('en-IN')}

This Partner Platform Agreement (“Agreement”) is entered into between:

## Droooly Labs Private Limited

A company incorporated under the Companies Act, 2013, having its registered office at:

SVN Square, India

(hereinafter referred to as “Droooly”, “Company”, “Platform”, “we”, “our”, or “us”)

AND

The individual, sole proprietor, partnership, company, chef, caterer, restaurant, cloud kitchen, event provider, or business entity registering on the Droooly platform (“Partner”, “Service Provider”, “you”, or “your”).

By registering, onboarding, digitally signing, accessing, listing, accepting bookings, or using the Droooly platform, you acknowledge that you have read, understood, and agreed to be legally bound by this Agreement.

---

# 1. PLATFORM NATURE

1.1 Droooly operates as a technology-enabled marketplace platform facilitating:

- discovery
- booking
- quotations
- customer interactions
- payment processing
- scheduling
- hospitality experiences
- chef services
- catering services
- restaurant event services
- food-related marketplace services

1.2 Droooly acts solely as a marketplace intermediary and technology platform unless explicitly stated otherwise.

1.3 The Partner acts as an independent service provider and remains solely responsible for:

- food preparation
- service fulfillment
- hygiene
- safety
- staffing
- packaging
- transportation
- delivery
- legal compliance
- customer execution
- operational quality

---

# 2. ELIGIBILITY

The Partner represents and warrants that:

- all information submitted is accurate and complete;
- the Partner has authority to enter into this Agreement;
- all licenses and registrations are valid;
- the Partner complies with all applicable laws and regulations.

Droooly reserves the right to:

- reject onboarding;
- request additional verification;
- suspend accounts;
- terminate onboarding applications.

---

# 3. KYC, VERIFICATION, AND COMPLIANCE

The Partner agrees to provide valid and accurate:

- PAN details;
- GST details;
- FSSAI licenses;
- bank account details;
- identity proof;
- address proof;
- business registration documents;
- any additional compliance documentation requested by Droooly.

Droooly may conduct verification through third-party verification providers.

Submission of documents does not guarantee approval.

---

# 4. LISTINGS AND SERVICE INFORMATION

The Partner shall maintain accurate:

- pricing;
- menus;
- packages;
- images;
- descriptions;
- preparation timelines;
- service areas;
- availability;
- cancellation terms.

Misleading, copied, fraudulent, deceptive, unlawful, offensive, obscene, or infringing content is prohibited.

Droooly reserves the right to:

- edit listings;
- reject listings;
- remove listings;
- suspend visibility;
- moderate content;
- disable accounts.

---

# 5. FOOD SAFETY AND QUALITY

The Partner is solely responsible for:

- hygienic preparation;
- food safety compliance;
- lawful ingredient sourcing;
- allergen disclosures;
- proper storage;
- proper transportation;
- staff hygiene;
- packaging quality;
- customer safety.

Droooly shall not be liable for:

- food poisoning;
- contamination;
- allergic reactions;
- unsafe preparation;
- expired ingredients;
- customer injuries;
- food quality disputes.

---

# 6. BOOKINGS, QUOTATIONS, AND CUSTOMER INTERACTIONS

Partners may receive:

- direct bookings;
- quote requests;
- customer inquiries;
- event requests;
- negotiation requests;
- premium experience bookings.

The Partner agrees to:

- respond within reasonable timelines;
- honor accepted bookings;
- avoid price manipulation after confirmation;
- maintain professional conduct.

---

# 7. COMMERCIAL TERMS, COMMISSIONS, FEES, AND PAYOUTS

## 7.1 Platform Charges

Droooly may charge:

- platform commission fees;
- convenience fees;
- service facilitation fees;
- onboarding fees;
- verification fees;
- promotional fees;
- advertising fees;
- payment gateway fees;
- cancellation penalties;
- dispute handling fees;
- logistics coordination charges;
- technology platform fees.

---

## 7.2 Current Commercial Structures

### Chef Services
Platform commission ranging from **8% to 15%** per completed booking.

### Catering Services
Commission ranging from **5% to 12%** on confirmed order values, deposits, or milestone payments.

### Restaurant Event Bookings
Commission ranging from **10% to 18%** on reservation or event booking values.

### Premium Experiences
Higher commission structures may apply for luxury, destination, rooftop, yacht, private dining, or curated hospitality experiences.

---

## 7.3 Customer Convenience Fees

Droooly may independently charge customers:

- convenience fees;
- booking fees;
- service fees;
- processing charges;
- surge fees;
- operational charges;
- applicable taxes.

Such charges may not form part of Partner payouts.

---

## 7.4 GST and Taxes

- All platform commissions and charges are exclusive of GST unless explicitly stated otherwise.
- Applicable GST and taxes shall be additionally charged where required under law.
- The Partner remains solely responsible for GST filings and statutory compliance.
- Droooly may deduct TDS or statutory deductions where applicable.

---

## 7.5 Settlement and Payouts

Payouts may be delayed, adjusted, withheld, reversed, or suspended in cases involving:

- fraud reviews;
- customer disputes;
- refunds;
- chargebacks;
- policy violations;
- failed verification;
- excessive complaints.

Droooly reserves the right to maintain reserve balances or temporary payout holds where operationally necessary.

---

## 7.6 Refunds and Chargebacks

Customer refunds may be initiated by Droooly to protect customer trust and marketplace integrity.

Refund amounts may be recovered from:

- future payouts;
- reserve balances;
- pending settlements.

Repeated refund incidents may result in:

- penalties;
- reduced visibility;
- payout holds;
- suspension;
- permanent termination.

---

## 7.7 Pricing Integrity

The Partner shall not:

- manipulate prices after confirmation;
- artificially inflate quotations;
- demand offline settlements;
- bypass the platform payment flow.

Violations may result in:

- immediate suspension;
- payout withholding;
- penalties;
- permanent termination;
- legal proceedings.

---

## 7.8 Customer Lead Ownership

All customer inquiries, quote requests, bookings, event requests, and marketplace-generated leads originating through Droooly shall remain platform-originated leads.

The Partner shall not misuse platform-generated customer relationships to avoid commissions or marketplace policies.

---

# 8. PROHIBITED ACTIVITIES

The Partner shall not:

- upload unlawful content;
- promote banned substances;
- sell prohibited items;
- upload offensive or hateful material;
- upload sexually explicit content;
- violate food safety laws;
- engage in fraud;
- manipulate reviews;
- misuse customer data;
- infringe intellectual property;
- impersonate another entity.

---

# 9. CUSTOMER DATA AND PRIVACY

Customer information shared through the platform shall only be used for legitimate order fulfillment purposes.

The Partner shall not:

- resell customer data;
- unlawfully share customer information;
- spam customers;
- misuse personal information.

---

# 10. INTELLECTUAL PROPERTY

The Partner grants Droooly a non-exclusive, worldwide, royalty-free license to use:

- logos;
- menus;
- service descriptions;
- images;
- marketing materials;
- trademarks.

for marketplace operations, advertising, and promotional activities.

---

# 11. INDEMNITY

The Partner agrees to indemnify and hold harmless Droooly against:

- customer claims;
- food safety violations;
- legal proceedings;
- fraud;
- intellectual property claims;
- negligence;
- regulatory penalties;
- breaches of this Agreement.

---

# 12. LIMITATION OF LIABILITY

Droooly functions solely as a marketplace intermediary platform.

Droooly does not guarantee:

- bookings;
- revenue;
- customer traffic;
- uninterrupted platform availability;
- business growth.

Droooly’s aggregate liability shall never exceed platform fees earned from the Partner during the preceding three (3) months.

---

# 13. SUSPENSION AND TERMINATION

Droooly may suspend, restrict, delist, or terminate accounts for:

- fraud;
- unsafe food practices;
- fake reviews;
- excessive complaints;
- illegal activity;
- payment abuse;
- reputational harm;
- policy violations.

---

# 14. GOVERNING LAW AND JURISDICTION

This Agreement shall be governed by the laws of India.

Courts located in Hyderabad, Telangana, India shall have exclusive jurisdiction.

Droooly may elect arbitration where applicable under Indian arbitration laws.

---

# 15. DIGITAL ACCEPTANCE

By digitally accepting this Agreement, the Partner:

- acknowledges enforceability of electronic acceptance;
- confirms authenticity of submitted information;
- agrees to all platform policies;
- accepts digital records maintained by Droooly as valid evidence.

---

# CONTACT

## Droooly Labs Private Limited

SVN Square, India

Email: legal@droooly.com

---

# PARTNER ACCEPTANCE

I hereby confirm that:

- I have read and understood this Agreement;
- the submitted information is accurate;
- I agree to comply with Droooly policies;
- I legally accept this Agreement.

---

**Partner Name:** _______________________

**Business Name:** _______________________

**Digital Signature:** _______________________

**Date:** _______________________

---

END OF AGREEMENT
`;
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
    background: '#f3f4f8',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 24,
    maxHeight: 620,
    overflowY: 'auto',
  },
  
  pdfPage: {
    background: '#ffffff',
    color: '#111827',
    width: '794px',
    minHeight: '1123px',
    margin: '0 auto',
    padding: '56px 64px',
    borderRadius: 10,
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.12)',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 13,
    lineHeight: 1.7,
  },
  
  logo: {
    display: 'block',
    width: 180,
    height: 'auto',
    margin: '0 auto 24px',
  },
  
  h1: {
    fontSize: 22,
    lineHeight: 1.25,
    color: '#5b3df5',
    textAlign: 'center' as const,
    margin: '22px 0 14px',
    fontWeight: 900,
    letterSpacing: '-0.02em',
  },
  
  h2: {
    fontSize: 16,
    color: '#111827',
    margin: '22px 0 10px',
    fontWeight: 850,
  },
  
  h3: {
    fontSize: 14,
    color: '#374151',
    margin: '18px 0 8px',
    fontWeight: 800,
  },
  
  p: {
    margin: '7px 0',
    color: '#374151',
  },
  
  ul: {
    margin: '8px 0 12px 20px',
    padding: 0,
  },
  
  li: {
    margin: '4px 0',
    color: '#374151',
  },
  
  hr: {
    borderTop: '1px solid #e5e7eb',
    margin: '18px 0',
  },
  
  strong: {
    color: '#111827',
    fontWeight: 800,
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
