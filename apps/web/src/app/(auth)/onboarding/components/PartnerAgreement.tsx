'use client';

import React, { useRef } from 'react';
import { AlertCircle, Download, Trash2 } from 'lucide-react';

interface PartnerAgreementProps {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  signaturePad: HTMLCanvasElement | null;
  signatureImage: string | null;
  isLoading: boolean;
  error: string;
  onTermsAcceptChange: (accepted: boolean) => void;
  onPrivacyAcceptChange: (accepted: boolean) => void;
  onSignatureDraw: (canvas: HTMLCanvasElement) => void;
  onSignatureClear: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

export default function PartnerAgreement({
  termsAccepted,
  privacyAccepted,
  signaturePad,
  signatureImage,
  isLoading,
  error,
  onTermsAcceptChange,
  onPrivacyAcceptChange,
  onSignatureDraw,
  onSignatureClear,
  onSubmit,
  onBack,
  styles,
}: PartnerAgreementProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    isDrawing.current = true;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    isDrawing.current = false;

    const canvas = canvasRef.current;
    onSignatureDraw(canvas);
  };

  const handleClearSignature = () => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    onSignatureClear();
  };

  const handleDownloadAgreement = () => {
    // Create a simple agreement text document
    const agreementText = `
CATERING MARKETPLACE - PARTNER AGREEMENT

Effective Date: ${new Date().toLocaleDateString()}

1. ACCEPTANCE OF TERMS
The undersigned hereby agrees to become a partner with Catering Marketplace and accepts all terms and conditions outlined in this agreement.

2. SERVICES
Partner agrees to provide catering services as described in their profile and maintain quality standards as per our guidelines.

3. PAYMENT TERMS
Payments will be processed within 3-5 business days after event completion. Partner is responsible for providing valid banking details or UPI ID.

4. CANCELLATION POLICY
Partner must adhere to the platform's cancellation policies. Repeated violations may result in account suspension.

5. COMPLIANCE
Partner agrees to comply with all applicable laws and regulations, including GST registration and food safety certifications.

6. INTELLECTUAL PROPERTY
All content uploaded to the platform remains the property of Catering Marketplace. Partner grants permission for platform usage and marketing.

7. LIABILITY
Catering Marketplace is not liable for individual transaction disputes. Partners are responsible for service delivery.

8. TERMINATION
Either party may terminate this agreement with 30 days written notice.

9. CONFIDENTIALITY
Partner agrees to maintain confidentiality of customer information obtained through the platform.

10. DISPUTE RESOLUTION
All disputes will be resolved through mediation or arbitration as per the platform's dispute resolution policy.

Signature: _______________________
Date: _______________________
Name: _______________________
    `;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(agreementText)
    );
    element.setAttribute(
      'download',
      `Partner_Agreement_${new Date().getTime()}.txt`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isFormValid =
    termsAccepted && privacyAccepted && signatureImage;

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>
          📋 Partner Agreement
        </h1>
        <p style={styles.subtitle}>
          Accept terms and sign to complete onboarding
        </p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.infoBox}>
          <AlertCircle
            size={20}
            color="#0284c7"
            style={{ marginRight: '0.75rem' }}
          />
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            Please read and accept the agreement before proceeding
          </p>
        </div>

        {/* Agreement Section */}
        <div style={styles.formGroup}>
          <div style={styles.agreementBox}>
            <h3 style={styles.agreementTitle}>Partner Agreement Terms</h3>
            <div style={styles.agreementContent}>
              <h4>1. Acceptance of Terms</h4>
              <p>
                You agree to become a partner with Catering Marketplace and accept
                all terms and conditions outlined in this agreement.
              </p>

              <h4>2. Services</h4>
              <p>
                You agree to provide catering services as described in your profile
                and maintain quality standards as per our guidelines.
              </p>

              <h4>3. Payment Terms</h4>
              <p>
                Payments will be processed within 3-5 business days after event
                completion. You are responsible for providing valid banking details
                or UPI ID.
              </p>

              <h4>4. Cancellation Policy</h4>
              <p>
                You must adhere to the platform's cancellation policies. Repeated
                violations may result in account suspension.
              </p>

              <h4>5. Compliance</h4>
              <p>
                You agree to comply with all applicable laws and regulations,
                including GST registration and food safety certifications.
              </p>

              <h4>6. Intellectual Property</h4>
              <p>
                All content uploaded to the platform remains our property. You grant
                permission for platform usage and marketing purposes.
              </p>

              <h4>7. Confidentiality</h4>
              <p>
                You agree to maintain confidentiality of customer information
                obtained through the platform.
              </p>

              <h4>8. Dispute Resolution</h4>
              <p>
                All disputes will be resolved through mediation or arbitration as per
                our dispute resolution policy.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadAgreement}
              style={styles.downloadButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ecfdf5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
              }}
            >
              <Download size={18} /> Download Agreement
            </button>
          </div>
        </div>

        {/* Acceptance Checkboxes */}
        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => onTermsAcceptChange(e.target.checked)}
              disabled={isLoading}
              style={styles.checkbox}
              required
            />
            <span>
              I accept the{' '}
              <strong>Partner Agreement Terms & Conditions</strong> *
            </span>
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => onPrivacyAcceptChange(e.target.checked)}
              disabled={isLoading}
              style={styles.checkbox}
              required
            />
            <span>
              I accept the <strong>Privacy Policy</strong> *
            </span>
          </label>
        </div>

        {/* Digital Signature */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Digital Signature *</label>
          <p style={styles.helpText}>
            Sign below to confirm your agreement
          </p>

          <div style={styles.signaturePadContainer}>
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={styles.signatureCanvas}
            />
            {signatureImage && (
              <div style={styles.signaturePreview}>
                <img
                  src={signatureImage}
                  alt="Signature Preview"
                  style={{ maxWidth: '100%', maxHeight: '100px' }}
                />
              </div>
            )}
          </div>

          {signatureImage && (
            <button
              type="button"
              onClick={handleClearSignature}
              style={styles.clearButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fecaca';
              }}
            >
              <Trash2 size={18} /> Clear Signature
            </button>
          )}

          {!signatureImage && (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#dc2626',
                marginTop: '0.5rem',
              }}
            >
              Please sign the canvas above
            </p>
          )}
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          style={{
            ...styles.submitButton,
            opacity: isLoading || !isFormValid ? 0.6 : 1,
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
          {isLoading ? 'Processing...' : 'Accept & Complete'}
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