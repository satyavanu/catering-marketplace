'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { AlertCircle, Download, Trash2, Eye, CheckCircle, Info } from 'lucide-react';
// Assuming downloadFromServer, downloadAsEmail, getClientIP are correctly implemented in utils.js
import { downloadFromServer, downloadAsEmail, getClientIP } from "./utils"; // Ensure these paths are correct


interface PartnerAgreementProps {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  signatureImage: string | null; // signaturePad likely handled internally, image is the output
  isLoading: boolean;
  error: string; // Global error from parent or server
  onTermsAcceptChange: (accepted: boolean) => void;
  onPrivacyAcceptChange: (accepted: boolean) => void;
  onSignatureDraw: (base64Image: string) => void; // Now passes base64 string
  onSignatureClear: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void; // Back button to previous step
  styles: { [key: string]: React.CSSProperties }; // Base styles from parent
}

export default function PartnerAgreement({
  termsAccepted,
  privacyAccepted,
  signatureImage,
  isLoading,
  error: globalError, // Renamed to avoid collision with local formError
  onTermsAcceptChange,
  onPrivacyAcceptChange,
  onSignatureDraw,
  onSignatureClear,
  onSubmit, // Submit handler for agreement form
  onBack, // Back button to KYC & Payments
  styles,
}: PartnerAgreementProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [showModal, setShowModal] = useState(false);

  // State for validation errors specifically for this form step
  const [termsError, setTermsError] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  const [formError, setFormError] = useState(''); // General submission error for this form

  // Dynamically generate agreement text with current date
  const PARTNER_AGREEMENT_HTML = useMemo(() => generateAgreementHtml(), []);
  const PARTNER_AGREEMENT_TEXT = useMemo(() => generateAgreementText(), []); // For download


  // Form validity for button enable/disable
  const isFormValid = useMemo(() => {
    return termsAccepted && privacyAccepted && !!signatureImage;
  }, [termsAccepted, privacyAccepted, signatureImage]);


  // Effect to clear errors when conditions are met
  useEffect(() => {
    if (termsAccepted) setTermsError(false);
    if (privacyAccepted) setPrivacyError(false);
    if (signatureImage) setSignatureError(false);
  }, [termsAccepted, privacyAccepted, signatureImage]);

  // Canvas drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isLoading) return;
    isDrawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect(); // Correctly get rect
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current || isLoading) return;
    const rect = canvasRef.current.getBoundingClientRect(); // Correctly get rect
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!canvasRef.current || isLoading) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    onSignatureDraw(canvas.toDataURL()); // Pass Base64 image
    setSignatureError(false); // Clear signature error on drawing
  };

  const handleClearSignature = () => {
    if (!canvasRef.current || isLoading) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    onSignatureClear(); // Notify parent that signature is cleared
  };

  const handleDownloadAgreement = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(PARTNER_AGREEMENT_TEXT)
    );
    element.setAttribute(
      'download',
      `Droooly_Partner_Agreement_${new Date().getTime()}.txt` // Use .txt for a quick plain text download
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    // For a real PDF, you'd integrate a client-side PDF generation library (e.g., jsPDF) here
  };

  // Override onSubmit to add client-side validation for this component
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation for this step
    let hasValidationError = false;
    if (!termsAccepted) { setTermsError(true); hasValidationError = true; }
    if (!privacyAccepted) { setPrivacyError(true); hasValidationError = true; }
    if (!signatureImage) { setSignatureError(true); hasValidationError = true; }

    if (hasValidationError) {
      setFormError('Please review and agree to all terms, and provide your signature.');
      // Scroll to the first error if needed
      return;
    }

    setFormError(''); // Clear general form error
    await onSubmit(e);
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Secure Your Partnership</h1>
        <p style={styles.subtitle}>
          One last step! Please review the agreement, accept the terms, and provide your digital signature to finalize your onboarding with Droooly.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} style={styles.profileForm}>
        {/* Important Notice */}
        <div style={agreementStyles.noticeBox}>
          <AlertCircle size={20} color="#0284c7" style={{ marginRight: '0.75rem' }} />
          <div>
            <p style={agreementStyles.noticeTitle}>⚠️ Critical Last Step</p>
            <p style={agreementStyles.noticeText}>
              Carefully read the entire agreement. Your acceptance and digital signature create a legally binding contract under Indian laws. Proceed only when fully understood.
            </p>
          </div>
        </div>

        {/* Scrollable Agreement Section */}
        <div style={agreementStyles.agreementCard}>
          <div style={agreementStyles.agreementHeader}>
            <h3 style={agreementStyles.agreementTitle}>Droooly Partner Agreement</h3>
            <div style={agreementStyles.agreementActions}>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={agreementStyles.viewFullButton}
                title="View in full screen"
                disabled={isLoading}
              >
                <Eye size={18} style={{ marginRight: '0.5rem' }} /> View Full Screen
              </button>
              <button
                type="button"
                onClick={handleDownloadAgreement}
                style={agreementStyles.downloadButton}
                title="Download as Plain Text"
                disabled={isLoading}
              >
                <Download size={18} style={{ marginRight: '0.5rem' }} /> Download as TXT
              </button>
            </div>
          </div>

          <div
            style={agreementStyles.agreementContent}
            dangerouslySetInnerHTML={{ __html: PARTNER_AGREEMENT_HTML }}
          />
        </div>

        {/* Acceptance Checkbox - Terms */}
        <div style={styles.formGroup}> {/* Re-using standard formGroup */}
            <label style={agreementStyles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => onTermsAcceptChange(e.target.checked)}
                    disabled={isLoading}
                    style={agreementStyles.hiddenCheckbox}
                    required
                />
                <div
                    style={{
                        ...agreementStyles.customCheckbox,
                        backgroundColor: termsAccepted ? '#10b981' : 'white',
                        borderColor: termsAccepted ? '#10b981' : (termsError ? '#ef4444' : '#d1d5db'),
                        boxShadow: termsError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
                    }}
                >
                    {termsAccepted && <CheckCircle size={16} color="white" />}
                </div>
                <span style={agreementStyles.checkboxText}>
                    I have read, understood, and agree to the Droooly Partner Agreement. <span style={agreementStyles.asterisk}>*</span>
                </span>
            </label>
            {termsError && (
                <p style={profileStyles.validationError}>
                    <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> You must accept the Partner Agreement to proceed.
                </p>
            )}
            <p style={agreementStyles.legalDisclaimer}>
                This electronic acceptance constitutes a legally binding agreement under applicable Indian laws.
            </p>
        </div>

        {/* Privacy Policy Checkbox %} */}
        <div style={styles.formGroup}>
            <label style={agreementStyles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => onPrivacyAcceptChange(e.target.checked)}
                    disabled={isLoading}
                    style={agreementStyles.hiddenCheckbox}
                    required
                />
                <div
                    style={{
                        ...agreementStyles.customCheckbox,
                        backgroundColor: privacyAccepted ? '#10b981' : 'white',
                        borderColor: privacyAccepted ? '#10b981' : (privacyError ? '#ef4444' : '#d1d5db'),
                        boxShadow: privacyError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
                    }}
                >
                    {privacyAccepted && <CheckCircle size={16} color="white" />}
                </div>
                <span style={agreementStyles.checkboxText}>
                    I accept the Privacy Policy and data processing terms. <span style={agreementStyles.asterisk}>*</span>
                </span>
            </label>
            {privacyError && (
                <p style={profileStyles.validationError}>
                    <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> You must accept the Privacy Policy to proceed.
                </p>
            )}
        </div>

        {/* Digital Signature */}
        <div style={agreementStyles.signatureSection}>
          <label style={styles.label}>Digital Signature <span style={agreementStyles.asterisk}>*</span></label>
          <p style={styles.helpText}>
            Kindly use your mouse or trackpad to sign digitally in the box below. This acts as your official consent.
          </p>

          <div
            style={{
              ...agreementStyles.signaturePadContainer,
              borderColor: signatureError ? '#ef4444' : '#e5e7eb',
              boxShadow: signatureError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
              backgroundColor: isLoading ? '#f9fafb' : '#ffffff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <canvas
              ref={canvasRef}
              width={600} // Ensure width and height are consistent or responsive
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={agreementStyles.signatureCanvas}
            />
             {isLoading && (
              <div style={agreementStyles.overlayLoader}>
                <span style={profileStyles.spinner}></span>
              </div>
            )}
          </div>

          <div style={agreementStyles.signatureFeedback}>
              {signatureImage && (
                  <div style={agreementStyles.signaturePreviewBox}>
                      <p style={profileStyles.selectionSummary}>
                          <CheckCircle size={16} style={{ marginRight: '0.4rem' }} /> Signature recorded successfully!
                      </p>
                      <div style={agreementStyles.signatureActions}>
                          <button
                              type="button"
                              onClick={handleClearSignature}
                              style={agreementStyles.clearButton}
                              disabled={isLoading}
                          >
                              <Trash2 size={16} /> Re-sign
                          </button>
                      </div>
                  </div>
              )}

              {!signatureImage && (
                  <p style={profileStyles.validationError}>
                      <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Your digital signature is required to proceed.
                  </p>
              )}
          </div>
        </div>

        {/* General Form Error Message */}
        {(globalError || formError) && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {globalError || formError}
          </div>
        )}

        {/* Action Buttons */}
        <div style={profileStyles.buttonGroup}>
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={profileStyles.backButton}
          >
            ← Back to KYC & Payments
          </button>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            style={{
              ...styles.submitButton,
              ...((isLoading || !isFormValid) && profileStyles.buttonDisabled),
              position: 'relative', // For spinner
            }}
          >
            {isLoading ? (
              <>
                <span style={profileStyles.spinner}></span>
                Processing...
              </>
            ) : (
              '✓ Agree & Sign'
            )}
          </button>
        </div>

        <p style={agreementStyles.disclaimerFooter}>
          By submitting this form, you confirm that you have read, understood, and accept the Droooly Partner Agreement and all its terms and conditions.
        </p>
      </form>

      {/* Full Screen Modal */}
      {showModal && (
        <AgreementModal onClose={() => setShowModal(false)} agreementHtml={PARTNER_AGREEMENT_HTML} />
      )}
    </>
  );
}

// Full Screen Agreement Modal (Modified to accept agreementHtml as prop)
function AgreementModal({ onClose, agreementHtml }: { onClose: () => void; agreementHtml: string }) {
  return (
    <div style={agreementModalStyles.overlay} onClick={onClose}>
      <div style={agreementModalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={agreementModalStyles.modalHeader}>
          <h2 style={agreementModalStyles.modalTitle}>Droooly Partner Agreement</h2>
          <button
            type="button"
            onClick={onClose}
            style={agreementModalStyles.closeButton}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div
          style={agreementModalStyles.modalContent}
          dangerouslySetInnerHTML={{ __html: agreementHtml }}
        />

        <div style={agreementModalStyles.modalFooter}>
          <button type="button" onClick={onClose} style={agreementModalStyles.closeButtonFooter}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// --- AGREEMENT CONTENT ---
// Function to generate the HTML agreement content
const generateAgreementHtml = () => `
<div class="agreement-document">
  <div class="agreement-header">
    <h1>DROOOLY PARTNER AGREEMENT (INDIA)</h1>
    <p class="agreement-date"><strong>Effective Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  <section class="agreement-parties">
    <h2>Parties to the Agreement</h2>
    <p><strong>DROOOLY PRIVATE LIMITED.</strong>, a company incorporated under the Companies Act, 2013, having its registered office at Hyderabad, Telangana, India (hereinafter referred to as "Droooly" or "Platform");</p>
    <p><strong>AND</strong></p>
    <p>The Partner whose details are registered on the Platform (hereinafter referred to as "Partner").</p>
    <p>Droooly and Partner are collectively referred to as the "Parties" and individually as a "Party".</p>
  </section>

  <section class="agreement-section">
    <h2>1. DEFINITIONS</h2>
    <div class="definitions-box">
      <p class="definition">"<strong>Platform</strong>" - The Droooly mobile application, website, APIs, and all associated systems</p>
      <p class="definition">"<strong>Services</strong>" - Catering, meal plans, chef services, event management, or any offerings listed by Partner</p>
      <p class="definition">"<strong>Order</strong>" - A confirmed booking placed by a Customer via the Platform</p>
      <p class="definition">"<strong>Customer</strong>" - An end-user availing Services through the Platform</p>
      <p class="definition">"<strong>Commission/Platform Fee</strong>" - The fee charged by Droooly per transaction, as per Annexure A</p>
      <p class="definition">"<strong>T+1</strong>" - One (1) business day post Fulfilment/Delivery</p>
      <p class="definition">"<strong>Applicable Law</strong>" - All Indian laws including GST Act, Food Safety & Standards Act, Income Tax Act, and IT Act</p>
    </div>
  </section>

  <section class="agreement-section">
    <h2>2. APPOINTMENT & GRANT OF RIGHTS</h2>
    <p>Droooly hereby grants Partner a <strong>non-exclusive, revocable, non-transferable</strong> right to list and provide Services on the Platform, subject to:</p>
    <ul>
      <li>Successful KYC verification</li>
      <li>Compliance with this Agreement and all Applicable Laws</li>
      <li>Payment of applicable Platform Fees</li>
      <li>Maintenance of service quality standards</li>
    </ul>
    <p><strong>Important:</strong> This is NOT an employment, agency, partnership, or joint venture relationship.</p>
  </section>

  <section class="agreement-section">
    <h2>3. NATURE OF RELATIONSHIP</h2>
    <p>The relationship between Droooly and Partner is strictly <strong>principal-to-principal on an independent contractor basis.</strong></p>
    <p>Partner is:</p>
    <ul>
      <li>Solely responsible for all taxes, GST, and regulatory compliance</li>
      <li>Responsible for quality, safety, and timely delivery of Services</li>
      <li>Responsible for insurance, licenses, and certifications</li>
      <li>NOT an employee, agent, or representative of Droooly</li>
    </ul>
  </section>

  <section class="agreement-section">
    <h2>4. KYC VERIFICATION & ELIGIBILITY</h2>
    <p>Partner shall submit and maintain valid documentation including:</p>
    <ul>
      <li>PAN Card (Individual/Company)</li>
      <li>Aadhaar or Voter ID (Authorized Signatory)</li>
      <li>GST Registration Certificate (if applicable)</li>
      <li>FSSAI License (mandatory for food services)</li>
      <li>Cancelled Cheque / Bank Account Proof</li>
      <li>Business Address Proof (Rent Agreement / Utility Bill)</li>
      <li>Partnership Deed / Certificate of Incorporation (if applicable)</li>
    </ul>
    <p><strong>Droooly reserves the right to:</strong></p>
    <ul>
      <li>Conduct third-party KYC/AML verification</li>
      <li>Request additional documentation at any time</li>
      <li>Suspend or reject applications based on verification results</li>
      <li>Deactivate accounts upon compliance failures</li>
    </ul>
  </section>

  <section class="agreement-section">
    <h2>5. LISTINGS & SERVICE AREA DEFINITION</h2>
    <p><strong>Partner shall ensure:</strong></p>
    <ul>
      <li>All listings are accurate, current, and non-misleading</li>
      <li>Clear specification of dishes, ingredients, allergens, and customizations</li>
      <li>Transparent pricing with all taxes and fees included</li>
      <li>Defined kitchen location, serviceable PIN codes, and delivery radius</li>
      <li>Compliance with food labeling and safety standards</li>
    </ul>
    <p><strong>Droooly may:</strong></p>
    <ul>
      <li>Standardize listings for platform consistency</li>
      <li>Remove misleading or non-compliant listings</li>
      <li>Adjust service areas based on performance metrics</li>
    </ul>
  </section>

  <section class="agreement-section">
    <h2>6. ORDERS & FULFILMENT OBLIGATIONS</h2>
    <p><strong>Order Processing:</strong></p>
    <ul>
      <li>Orders are confirmed upon successful payment</li>
      <li>Partner must accept/reject within 5 minutes of Order placement</li>
      <li>Rejection rate exceeding 10% may result in account suspension</li>
    </ul>
    <p><strong>Fulfilment Requirements:</strong></p>
    <ul>
      <li>Prepare and deliver Services as per Order specifications</li>
      <li>Maintain food safety and hygiene standards</li>
      <li>Deliver on time (Partner responsible for delivery logistics)</li>
      <li>Maintain packaging quality and presentation</li>
      <li>Handle special dietary requirements and allergies responsibly</li>
    </ul>
  </section>

  <section class="agreement-section">
    <h2>7. PAYMENTS & COMMISSION STRUCTURE</h2>
    <h3>7.1 Platform Fee/Commission</h3>
    <p>Droooly shall charge a Commission as per Annexure A (currently 15-25% based on service category), calculated on the Order value before taxes.</p>

    <h3>7.2 GST Compliance</h3>
    <p>Partner shall:</p>
    <ul>
      <li>Charge GST as per the Central Goods and Services Tax Act, 2017</li>
      <li>File GST returns on time</li>
      <li>Issue tax invoices to Customers</li>
      <li>Maintain GST compliance records</li>
    </ul>

    <h3>7.3 TDS (Tax Deducted at Source)</h3>
    <p>Droooly shall deduct TDS under Section 194-O of the Income Tax Act, 1961 (currently 1% or as amended per law).</p>
    <ul>
      <li>TDS is calculated on gross Order value</li>
      <li>TDS certificates issued monthly</li>
      <li>Partner responsible for TDS filing in their returns</li>
    </ul>

    <h3>7.4 Payout Terms</h3>
    <p><strong>Payout Schedule: T+1 (Next Business Day)</strong></p>
    <ul>
      <li>Net Payable = Order Value - Commission - GST - TDS - Refunds - Penalties</li>
      <li>Payouts credited to Partner's registered bank account</li>
      <li>Subject to no pending disputes or chargebacks</li>
      <li>Minimum payout threshold: ₹500</li>
    </ul>

    <h3>7.5 Additional Charges</h3>
    <p>Droooly may charge:</p>
    <ul>
      <li>Late delivery penalty: ₹50-200 per Order</li>
      <li>Quality complaint charge-back: 10-100% of Order value</li>
      <li>Cancellation fees: As per cancellation policy</li>
      <li>Premium listing fee: Optional (for featured placement)</li>
    </ul>
  </section>

  <section class="agreement-section">
    <h2>8. CANCELLATIONS, REFUNDS & CHARGEBACKS</h2>
    <p><strong>Cancellation Policy Matrix:</strong></p>
    <table class="cancellation-table">
      <thead>
        <tr>
          <th>Scenario</th>
          <th>Time of Cancellation</th>
          <th>Refund to Customer</th>
          <th>Charge to Partner</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Customer cancels</td>
          <td>&gt;24 hrs before</td>
          <td>100%</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Customer cancels</td>
          <td>6–24 hrs</td>
          <td>Partial</td>
          <td>Minimal</td>
        </tr>
        <tr>
          <td>Customer cancels</td>
          <td>&lt;6 hrs</td>
          <td>No refund</td>
          <td>Full payout to Partner</td>
        </tr>
        <tr>
          <td>Partner cancels</td>
          <td>Any time</td>
          <td>100%</td>
          <td>Penalty + compensation</td>
        </tr>
        <tr>
          <td>Late delivery (&gt;30 min)</td>
          <td>NA</td>
          <td>Partial refund</td>
          <td>Penalty</td>
        </tr>
        <tr>
          <td>Wrong/defective order</td>
          <td>NA</td>
          <td>Full refund</td>
          <td>Full deduction</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="agreement-section">
    <h2>9. FOOD SAFETY & COMPLIANCE</h2>
    <p>Partner shall strictly comply with:</p>
    <ul>
      <li>Food Safety and Standards Act, 2006 (FSSA)</li>
      <li>FSSAI guidelines and packaging standards</li>
      <li>Hygiene and sanitation requirements</li>
      <li>Allergen disclosure and labeling</li>
      <li>Proper food storage and temperature control</li>
      <li>Regular health certifications and inspections</li>
    </ul>
    <p><strong>Non-compliance may result in:</strong> Immediate account suspension, legal action, and liability for customer health issues.</p>
  </section>

  <section class="agreement-section">
    <h2>10. CUSTOMER DISPUTES & GRIEVANCE REDRESSAL</h2>
    <p>Droooly acts as a facilitator and mediator for disputes.</p>
    <p><strong>Partner shall:</strong></p>
    <ul>
      <li>Respond to Customer complaints within 24 hours</li>
      <li>Provide resolution or replacement within 48 hours</li>
      <li>Maintain records of all complaints and resolutions</li>
      <li>Provide evidence when requested (photos, invoices, etc.)</li>
    </ul>
    <p><strong>Non-cooperation may result in:</strong> Complaint charge-back, account suspension, or permanent deactivation.</p>
  </section>

  <section class="agreement-section">
    <h2>11. PROHIBITED CONDUCT</h2>
    <p>Partner shall NOT:</p>
    <ul>
      <li>Circumvent Platform payments or solicit direct payments from Customers</li>
      <li>Share Customer contact details or engage outside the Platform</li>
      <li>Engage in fraudulent, deceptive, or illegal activities</li>
      <li>Violate any Applicable Law (tax, food safety, labor laws)</li>
      <li>Use Platform data for unauthorized purposes</li>
      <li>Compromise Platform security or attempt unauthorized access</li>
      <li>Post defamatory, offensive, or proprietary content</li>
    </ul>
    <p><strong>Consequences:</strong> Immediate account suspension, legal action, and liability for damages.</p>
  </section>

  <section class="agreement-section">
    <h2>12. SUSPENSION & TERMINATION</h2>
    <h3>12.1 Immediate Suspension (Without Notice)</h3>
    <ul>
      <li>Failed KYC verification</li>
      <li>Multiple Customer complaints (Quality, Safety, Timeliness)</li>
      <li>Fraud or illegal activity detected</li>
      <li>Rejection rate exceeding 10% in a week</li>
      <li>Non-compliance with food safety regulations</li>
      <li>Payment default or chargeback fraud</li>
    </ul>

    <h3>12.2 Termination for Cause</h3>
    <p>Droooly may terminate this Agreement with 7 days written notice if:</p>
    <ul>
      <li>Partner repeatedly breaches agreement terms</li>
      <li>Partner engages in illegal activities</li>
      <li>Partner fails to maintain KYC compliance</li>
      <li>Partner receives final warning for food safety violations</li>
    </ul>

    <h3>12.3 Termination Without Cause</h3>
    <p>Either party may terminate with 30 days written notice.</p>

    <h3>12.4 Effect of Termination</h3>
    <ul>
      <li>All pending Orders must be fulfilled as per Agreement</li>
      <li>Outstanding payouts settled within T+7</li>
      <li>Partner account and listings deactivated</li>
      <li>Restrictions on re-registration for repeat offenders</li>
    </ul>
  </section>

  <section class="agreement-section">
    <h2>13. INDEMNIFICATION & LIABILITY</h2>
    <p><strong>Partner shall indemnify Droooly against:</strong></p>
    <ul>
      <li>Claims arising from food quality, allergic reactions, or food poisoning</li>
      <li>Legal violations or regulatory non-compliance</li>
      <li>Third-party claims (Customer lawsuits, etc.)</li>
      <li>Intellectual property infringement</li>
      <li>Breach of confidentiality</li>
    </ul>
    <p><strong>Limitation of Liability:</strong></p>
    <p>Droooly shall NOT be liable for indirect, incidental, consequential damages, or Partner's lost profits, even if advised of possibility of such damages.</p>
  </section>

  <section class="agreement-section">
    <h2>14. INTELLECTUAL PROPERTY & CONFIDENTIALITY</h2>
    <p><strong>Partner Intellectual Property:</strong> Partner retains rights to original content (recipes, photos) but grants Droooly a non-exclusive license to display on Platform.</p>
    <p><strong>Confidentiality:</strong> Partner shall not disclose Droooly's proprietary algorithms, pricing models, or business strategies.</p>
  </section>

  <section class="agreement-section">
    <h2>15. GENERAL PROVISIONS</h2>
    <p><strong>Governing Law:</strong> This Agreement shall be governed by Indian laws.</p>
    <p><strong>Jurisdiction:</strong> Exclusive jurisdiction with courts at New Delhi, India.</p>
    <p><strong>Entire Agreement:</strong> This Agreement and all Schedules constitute the entire agreement.</p>
    <p><strong>Modifications:</strong> Droooly may modify terms with 15 days written notice. Continued use constitutes acceptance.</p>
    <p><strong>Severability:</strong> If any provision is invalid, remaining provisions continue in effect.</p>
  </section>

  <section class="agreement-section agreement-acceptance">
    <h2>ACCEPTANCE & LEGAL ACKNOWLEDGMENT</h2>
    <p>By registering and checking the "I Agree" checkbox on the Droooly Partner Portal, Partner expressly acknowledges:</p>
    <ol>
      <li>Having read and understood this entire Agreement</li>
      <li>Having the authority to enter into this Agreement</li>
      <li>Agreeing to be bound by all terms and conditions</li>
      <li>Acknowledging receipt of a copy of this Agreement</li>
      <li>Understanding that this is a legally binding contract under Indian law</li>
    </ol>
    <div class="legal-notice">
      <strong>Legal Notice:</strong> This electronic acceptance constitutes a legally binding agreement under applicable Indian laws. The Partner acknowledges receipt and understanding of all terms contained herein.
    </div>
  </section>

  <div class="agreement-footer">
    <p><strong>For questions or clarifications, contact:</strong></p>
    <p>Email: partners@droooly.com | Support: +91-XXXX-XXXX-XXX</p>
    <p style="font-size: 0.85rem; color: #6b7280;">Last Updated: ${new Date().toLocaleDateString('en-IN')}</p>
  </div>
</div>
`;

// Function to generate the plain text agreement content (for download)
const generateAgreementText = () => `DROOOLY PARTNER AGREEMENT (INDIA)
Lawyer-Grade Version with Detailed Schedules & Compliance Clauses

Effective Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}

PARTIES TO THE AGREEMENT

DROOOLY PRIVATE LIMITED., a company incorporated under the Companies Act, 2013, having its registered office at New Delhi, India (hereinafter referred to as "Droooly" or "Platform");

AND

The Partner whose details are registered on the Platform (hereinafter referred to as "Partner").

Droooly and Partner are collectively referred to as the "Parties" and individually as a "Party".

1. DEFINITIONS

Unless the context otherwise requires:

"Platform" - The Droooly mobile application, website, APIs, and all associated systems.
"Services" - Catering, meal plans, chef services, event management, or any offerings listed by Partner.
"Order" - A confirmed booking placed by a Customer via the Platform.
"Customer" - An end-user availing Services through the Platform.
"Commission/Platform Fee" - The fee charged by Droooly per transaction, as per Annexure A.
"T+1" - One (1) business day post Fulfilment/Delivery.
"Applicable Law" - All Indian laws including GST Act, Food Safety & Standards Act, Income Tax Act, and IT Act.

2. APPOINTMENT & GRANT OF RIGHTS

Droooly hereby grants Partner a non-exclusive, revocable, non-transferable right to list and provide Services on the Platform, subject to:
- Successful KYC verification
- Compliance with this Agreement and all Applicable Laws
- Payment of applicable Platform Fees
- Maintenance of service quality standards

IMPORTANT: This is NOT an employment, agency, partnership, or joint venture relationship.

3. NATURE OF RELATIONSHIP

The relationship between Droooly and Partner is strictly principal-to-principal on an independent contractor basis.

Partner is:
- Solely responsible for all taxes, GST, and regulatory compliance
- Responsible for quality, safety, and timely delivery of Services
- Responsible for insurance, licenses, and certifications
- NOT an employee, agent, or representative of Droooly

4. KYC VERIFICATION & ELIGIBILITY

Partner shall submit and maintain valid documentation including:
- PAN Card (Individual/Company)
- Aadhaar or Voter ID (Authorized Signatory)
- GST Registration Certificate (if applicable)
- FSSAI License (mandatory for food services)
- Cancelled Cheque / Bank Account Proof
- Business Address Proof (Rent Agreement / Utility Bill)
- Partnership Deed / Certificate of Incorporation (if applicable)

Droooly reserves the right to:
- Conduct third-party KYC/AML verification
- Request additional documentation at any time
- Suspend or reject applications based on verification results
- Deactivate accounts upon compliance failures

5. LISTINGS & SERVICE AREA DEFINITION

Partner shall ensure:
- All listings are accurate, current, and non-misleading
- Clear specification of dishes, ingredients, allergens, and customizations
- Transparent pricing with all taxes and fees included
- Defined kitchen location, serviceable PIN codes, and delivery radius
- Compliance with food labeling and safety standards

Droooly may:
- Standardize listings for platform consistency
- Remove misleading or non-compliant listings
- Adjust service areas based on performance metrics

6. ORDERS & FULFILMENT OBLIGATIONS

Order Processing:
- Orders are confirmed upon successful payment
- Partner must accept/reject within 5 minutes of Order placement
- Rejection rate exceeding 10% may result in account suspension

Fulfilment Requirements:
- Prepare and deliver Services as per Order specifications
- Maintain food safety and hygiene standards
- Deliver on time (Partner responsible for delivery logistics)
- Maintain packaging quality and presentation
- Handle special dietary requirements and allergies responsibly

7. PAYMENTS & COMMISSION STRUCTURE

7.1 Platform Fee/Commission
Droooly shall charge a Commission as per Annexure A (currently 15-25% based on service category), calculated on the Order value before taxes.

7.2 GST Compliance
Partner shall:
- Charge GST as per the Central Goods and Services Tax Act, 2017
- File GST returns on time
- Issue tax invoices to Customers
- Maintain GST compliance records

7.3 TDS (Tax Deducted at Source)
Droooly shall deduct TDS under Section 194-O of the Income Tax Act, 1961 (currently 1% or as amended per law).
- TDS is calculated on gross Order value
- TDS certificates issued monthly
- Partner responsible for TDS filing in their returns

7.4 Payout Terms
PAYOUT SCHEDULE: T+1 (Next Business Day)
- Net Payable = Order Value - Commission - GST - TDS - Refunds - Penalties
- Payouts credited to Partner's registered bank account
- Subject to no pending disputes or chargebacks
- Minimum payout threshold: ₹500

7.5 Additional Charges
Droooly may charge:
- Late delivery penalty: ₹50-200 per Order
- Quality complaint charge-back: 10-100% of Order value
- Cancellation fees: As per cancellation policy
- Premium listing fee: Optional (for featured placement)

8. CANCELLATIONS, REFUNDS & CHARGEBACKS

CANCELLATION POLICY MATRIX:
- Customer cancels >24 hrs before: 100% refund, 0 charge to Partner
- Customer cancels 6–24 hrs: Partial refund, Minimal charge to Partner
- Customer cancels <6 hrs: No refund, Full payout to Partner
- Partner cancels (any time): 100% refund to Customer, Penalty + compensation charge to Partner
- Late delivery (>30 min): Partial refund, Penalty to Partner
- Wrong/defective order: Full refund, Full deduction from Partner

Droooly reserves the unilateral right to:
- Process refunds to Customers
- Recover amounts from Partner payouts

9. FOOD SAFETY & COMPLIANCE

Partner shall strictly comply with:
- Food Safety and Standards Act, 2006 (FSSA)
- FSSAI guidelines and packaging standards
- Hygiene and sanitation requirements
- Allergen disclosure and labeling
- Proper food storage and temperature control
- Regular health certifications and inspections

Non-compliance may result in: Immediate account suspension, legal action, and liability for customer health issues.

10. CUSTOMER DISPUTES & GRIEVANCE REDRESSAL

Droooly acts as a facilitator and mediator for disputes.

Partner shall:
- Respond to Customer complaints within 24 hours
- Provide resolution or replacement within 48 hours
- Maintain records of all complaints and resolutions
- Provide evidence when requested (photos, invoices, etc.)

Non-cooperation may result in: Complaint charge-back, account suspension, or permanent deactivation.

11. PROHIBITED CONDUCT

Partner shall NOT:
- Circumvent Platform payments or solicit direct payments from Customers
- Share Customer contact details or engage outside the Platform
- Engage in fraudulent, deceptive, or illegal activities
- Violate any Applicable Law (tax, food safety, labor laws)
- Use Platform data for unauthorized purposes
- Compromise Platform security or attempt unauthorized access
- Post defamatory, offensive, or proprietary content

Consequences: Immediate account suspension, legal action, and liability for damages.

12. SUSPENSION & TERMINATION

12.1 Immediate Suspension (Without Notice):
- Failed KYC verification
- Multiple Customer complaints (Quality, Safety, Timeliness)
- Fraud or illegal activity detected
- Rejection rate exceeding 10% in a week
- Non-compliance with food safety regulations
- Payment default or chargeback fraud

12.2 Termination for Cause:
Droooly may terminate this Agreement with 7 days written notice if:
- Partner repeatedly breaches agreement terms
- Partner engages in illegal activities
- Partner fails to maintain KYC compliance
- Partner receives final warning for food safety violations

12.3 Termination Without Cause:
Either party may terminate with 30 days written notice.

12.4 Effect of Termination:
- All pending Orders must be fulfilled as per Agreement
- Outstanding payouts settled within T+7
- Partner account and listings deactivated
- Restrictions on re-registration for repeat offenders

13. INDEMNIFICATION & LIABILITY

Partner shall indemnify Droooly against:
- Claims arising from food quality, allergic reactions, or food poisoning
- Legal violations or regulatory non-compliance
- Third-party claims (Customer lawsuits, etc.)
- Intellectual property infringement
- Breach of confidentiality

Limitation of Liability:
Droooly shall NOT be liable for indirect, incidental, consequential damages, or Partner's lost profits, even if advised of possibility of such damages.

14. INTELLECTUAL PROPERTY & CONFIDENTIALITY

Partner Intellectual Property: Partner retains rights to original content (recipes, photos) but grants Droooly a non-exclusive license to display on Platform.

Confidentiality: Partner shall not disclose Droooly's proprietary algorithms, pricing models, or business strategies.

15. GENERAL PROVISIONS

Governing Law: This Agreement shall be governed by Indian laws.
Jurisdiction: Exclusive jurisdiction with courts at New Delhi, India.
Entire Agreement: This Agreement and all Schedules constitute the entire agreement.
Modifications: Droooly may modify terms with 15 days written notice. Continued use constitutes acceptance.
Severability: If any provision is invalid, remaining provisions continue in effect.

ACCEPTANCE & LEGAL ACKNOWLEDGMENT

By registering and checking the "I Agree" checkbox on the Droooly Partner Portal, Partner expressly acknowledges:

1. Having read and understood this entire Agreement
2. Having the authority to enter into this Agreement
3. Agreeing to be bound by all terms and conditions
4. Acknowledging receipt of a copy of this Agreement
5. Understanding that this is a legally binding contract under Indian law

LEGAL NOTICE: This electronic acceptance constitutes a legally binding agreement under applicable Indian laws. The Partner acknowledges receipt and understanding of all terms contained herein.

For questions or clarifications, contact:
Email: partners@droooly.com | Support: +91-XXXX-XXXX-XXX

Last Updated: ${new Date().toLocaleDateString('en-IN')}`;


// --- STYLES ---
// (You would typically import these from a separate styles file or use a CSS-in-JS library)

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
    gap: '1rem',
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
    color: '#ef4444',
    margin: '0.5rem 0 0 0',
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
    justifyContent: 'flex-end',
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
  },
};

const agreementStyles: { [key: string]: React.CSSProperties } = {
  // Global Agreement Container
  agreementCard: { // Renamed from agreementContainer for clarity
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
    overflow: 'hidden', // Contains inner elements
  },

  // Info Box
  noticeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: '#fffbeb',
    border: '2px solid #fcd34d',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
  },
  noticeTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 0.25rem 0',
  },
  noticeText: {
    fontSize: '0.85rem',
    color: '#b45309',
    margin: 0,
    lineHeight: '1.5',
  },

  // Agreement Content Headers
  agreementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  agreementTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  agreementActions: { // Container for view full and download buttons
    display: 'flex',
    gap: '0.75rem',
  },
  viewFullButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #3b82f6',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#dbeafe',
      borderColor: '#2563eb',
      color: '#1e40af',
    },
    ':disabled': profileStyles.buttonDisabled,
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #a78bfa',
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#ede9fe',
      borderColor: '#7c3aed',
      color: '#6d28d9',
    },
    ':disabled': profileStyles.buttonDisabled,
  },

  agreementContent: {
    maxHeight: '400px', // Fixed height with scroll
    overflowY: 'scroll',
    padding: '1.5rem',
    lineHeight: '1.6',
    color: '#374151',
    fontSize: '0.9rem',
    borderBottom: '1px solid #e5e7eb',
    position: 'relative', // For fading effect
  },
  // Inner HTML styles for agreement content (applied via class names inside dangerouslySetInnerHTML)
  // These would typically be in a global CSS or a dedicated component CSS
  // agreement-document (main wrapper)
  // .agreement-document h1, h2, h3 { color: #111827; margin-bottom: 0.75rem; }
  // .agreement-document p { margin-bottom: 0.75rem; }
  // .agreement-document ul, ol { margin-left: 1.25rem; margin-bottom: 0.75rem; }
  // .definitions-box { background-color: #f9fafb; padding: 1rem; border-left: 4px solid #6366f1; margin: 1rem 0; }
  // .definition { margin-bottom: 0.5rem; }
  // .cancellation-table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
  // .cancellation-table th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
  // .cancellation-table th { background-color: #eff6ff; font-weight: 600; color: #1f2937; }
  // .legal-notice { border: 1px solid #fcd34d; background-color: #fffbeb; padding: 1rem; margin-top: 1.5rem; color: #92400e; }


  // Acceptance Checkbox
  checkboxContainer: {
    marginBottom: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    gap: '0.75rem',
  },
  hiddenCheckbox: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  customCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '0.25rem',
    border: '2px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease-in-out',
  },
  checkmark: {
    color: 'white',
    fontSize: '0.9rem',
    lineHeight: '1',
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: '0.95rem',
    color: '#1f2937',
    fontWeight: '500',
  },
  asterisk: {
    color: '#dc2626',
    marginLeft: '0.25rem',
  },
  legalDisclaimer: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    marginLeft: '2.5rem', // Aligned with checkbox text
  },
  warningBox: { // Specific warnings for this page
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
    color: '#92400e',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    gap: '0.5rem',
  },

  // Digital Signature
  signatureSection: {
    marginTop: '2rem',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    position: 'relative',
  },
  signaturePadContainer: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    position: 'relative',
    overflow: 'hidden', // Hide overflow potentially caused by drawing
    transition: 'all 0.2s ease-in-out',
  },
  signatureCanvas: {
    display: 'block', // Remove extra space below canvas
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  overlayLoader: { // For when canvas is disabled/loading
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  signatureFeedback: {
    marginTop: '1rem',
    minHeight: '40px', // Keep space consistent
  },
  signaturePreviewBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  signaturePreview: {
    maxWidth: '100%',
    maxHeight: '120px',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #ef4444',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#fca5a5',
      borderColor: '#dc2626',
      color: '#b91c1c',
    },
    ':disabled': profileStyles.buttonDisabled,
  },

  // Error Message
  errorMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: '#fee2e2', // Light red background
    border: '1px solid #ef4444', // Red border
    color: '#dc2626', // Dark red text
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },

  // Combined with profileStyles
  ...profileStyles, // Ensure profileStyles are merged last or explicitly defined
};


// Specific styles for the Success Modal
const successModalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    maxWidth: '500px',
    width: '90%',
    padding: '2rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    animation: 'fadeInUp 0.3s ease-out', // Assuming keyframes are defined
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: '3rem',
    color: '#10b981',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.75rem',
  },
  message: {
    fontSize: '1rem',
    color: '#4b5563',
    marginBottom: '1.5rem',
  },
  detailsBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    padding: '1rem',
    width: '100%',
    marginBottom: '1.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    borderBottom: '1px solid #e5e7eb',
    ':last-child': { borderBottom: 'none' },
  },
  label: {
    fontWeight: '600',
    color: '#4b5563',
  },
  value: {
    color: '#1f2937',
  },
  downloadOptions: {
    width: '100%',
    marginBottom: '1.5rem',
  },
  optionsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.75rem',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    marginBottom: '0.75rem',
  },
  auditTrail: {
    textAlign: 'left',
    width: '100%',
    backgroundColor: '#ecfdf5',
    border: '1px solid #d1fae5',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  auditTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#065f46',
    marginBottom: '0.75rem',
  },
  auditList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '0.875rem',
    color: '#047857',
  },
  auditListItem: {
    marginBottom: '0.4rem',
  },
  continueBtn: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
};


// Specific styles for the Fullscreen Agreement Modal
const agreementModalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    width: '90%',
    maxWidth: '900px',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    animation: 'scaleIn 0.3s ease-out', // Assuming animation keyframes are defined
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.75rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: '0.75rem',
    borderTopRightRadius: '0.75rem',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
    ':hover': {
      color: '#ef4444',
    },
  },
  modalContent: {
    flexGrow: 1,
    overflowY: 'scroll',
    padding: '1.75rem',
    lineHeight: '1.6',
    color: '#374151',
    fontSize: '0.95rem',
  },
  modalFooter: {
    padding: '1rem 1.75rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#f9fafb',
    borderBottomLeftRadius: '0.75rem',
    borderBottomRightRadius: '0.75rem',
  },
  closeButtonFooter: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#f3f4f6',
      borderColor: '#9ca3af',
    },
  },
};

// CSS for agreement content (to be injected for dangerouslySetInnerHTML)
// This is critical for making the agreement content look good consistently both in the form and modal
const agreementModalStyles_CSS = `
.agreement-document {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  line-height: 1.6;
  color: #374151;
  font-size: 0.95rem;
}
.agreement-document h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
  text-align: center;
}
.agreement-document h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 2rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}
.agreement-document h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
}
.agreement-document p {
  margin-bottom: 0.8rem;
}
.agreement-document ul, .agreement-document ol {
  margin-left: 1.5rem;
  margin-bottom: 0.8rem;
  list-style-position: outside;
}
.agreement-document li {
    margin-bottom: 0.4rem;
}
.agreement-parties {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.definitions-box {
  background-color: #f0f4ff;
  padding: 1rem 1.5rem;
  border-left: 4px solid #6366f1;
  margin: 1rem 0;
  border-radius: 0.25rem;
}
.definition {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
.cancellation-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.85rem;
}
.cancellation-table th, .cancellation-table td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  text-align: left;
}
.cancellation-table thead th {
  background-color: #eef2ff;
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
}
.cancellation-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
.agreement-acceptance ol {
    list-style-type: decimal;
    margin-left: 1.5rem;
}
.legal-notice {
  border: 1px solid #fcd34d;
  background-color: #fffbeb;
  padding: 1rem;
  margin-top: 1.5rem;
  color: #92400e;
  border-radius: 0.25rem;
}
.agreement-footer {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}
.agreement-footer p {
  margin-bottom: 0.5rem;
}

/* Animations for modals */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
`;


// --- Global CSS for animations (place in public/globals.css or similar) ---
// For the spinner and modal animations to work, you'd typically have these in a global CSS file.
// If you don't have one, you might need to create a <style> tag and insert them via JS,
// but for an actual Next.js application, an external CSS file is preferred.
/*
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
*/
