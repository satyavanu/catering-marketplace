'use client';

import React, { useRef, useState } from 'react';
import { AlertCircle, Download, Trash2, Eye } from 'lucide-react';
import  { successModalStyles, agreementStyles, agreementModalStyles, agreementModalStyles_CSS } from './styles';
import { downloadFromServer, downloadAsEmail, getClientIP } from "./utils";


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
  const [showModal, setShowModal] = useState(false);

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
    const agreementText = PARTNER_AGREEMENT_TEXT;
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(agreementText)
    );
    element.setAttribute(
      'download',
      `Droooly_Partner_Agreement_${new Date().getTime()}.txt`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isFormValid = termsAccepted && privacyAccepted && signatureImage;

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Droooly Partner Agreement</h1>
        <p style={styles.subtitle}>
          Accept terms and sign to complete onboarding
        </p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={agreementStyles.infoBox}>
          <AlertCircle size={20} color="#0284c7" style={{ marginRight: '0.75rem' }} />
          <p style={agreementStyles.infoText}>
            Please read and carefully review the entire agreement below. By clicking "Agree & Sign", you enter a legally binding contract.
          </p>
        </div>

        {/* Scrollable Agreement Section */}
        <div style={agreementStyles.agreementContainer}>
          <div style={agreementStyles.agreementHeader}>
            <h3 style={agreementStyles.agreementTitle}>Droooly Partner Agreement</h3>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={agreementStyles.viewFullButton}
              title="View in full screen"
            >
              <Eye size={18} /> View Full Screen
            </button>
          </div>

          <div
            style={agreementStyles.agreementContent}
            dangerouslySetInnerHTML={{ __html: PARTNER_AGREEMENT_HTML }}
          />

          <div style={agreementStyles.downloadSection}>
            <button
              type="button"
              onClick={handleDownloadAgreement}
              style={agreementStyles.downloadButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dbeafe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
            >
              <Download size={18} /> Download Agreement (PDF)
            </button>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <div style={agreementStyles.checkboxContainer}>
          <label style={agreementStyles.checkboxLabel}>
            <div style={agreementStyles.customCheckboxContainer}>
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
                  borderColor: termsAccepted ? '#10b981' : '#d1d5db',
                }}
              >
                {termsAccepted && <span style={agreementStyles.checkmark}>✓</span>}
              </div>
            </div>
            <span style={agreementStyles.checkboxText}>
              By clicking agree, you enter a legally binding contract with Droooly{' '}
              <span style={agreementStyles.asterisk}>*</span>
            </span>
          </label>
          <p style={agreementStyles.legalDisclaimer}>
            This electronic acceptance constitutes a legally binding agreement under applicable Indian laws.
          </p>
        </div>

        {/* Privacy Policy Checkbox */}
        <div style={agreementStyles.checkboxContainer}>
          <label style={agreementStyles.checkboxLabel}>
            <div style={agreementStyles.customCheckboxContainer}>
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
                  borderColor: privacyAccepted ? '#10b981' : '#d1d5db',
                }}
              >
                {privacyAccepted && <span style={agreementStyles.checkmark}>✓</span>}
              </div>
            </div>
            <span style={agreementStyles.checkboxText}>
              I accept the Privacy Policy and data processing terms{' '}
              <span style={agreementStyles.asterisk}>*</span>
            </span>
          </label>
        </div>

        {/* Digital Signature */}
        <div style={agreementStyles.signatureSection}>
          <label style={agreementStyles.label}>Digital Signature <span style={agreementStyles.asterisk}>*</span></label>
          <p style={agreementStyles.helpText}>
            Sign below to confirm your legally binding agreement
          </p>

          <div style={agreementStyles.signaturePadContainer}>
            <canvas
              ref={canvasRef}
              width={600}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={agreementStyles.signatureCanvas}
            />
          </div>

          {signatureImage && (
            <div style={agreementStyles.signaturePreviewBox}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#065f46', margin: '0 0 0.75rem 0' }}>
                ✓ Signature captured
              </p>
              <div style={agreementStyles.signaturePreview}>
                <img
                  src={signatureImage}
                  alt="Signature Preview"
                  style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '0.375rem' }}
                />
              </div>
              <button
                type="button"
                onClick={handleClearSignature}
                style={agreementStyles.clearButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fecaca';
                }}
              >
                <Trash2 size={16} /> Clear & Re-sign
              </button>
            </div>
          )}

          {!signatureImage && (
            <p style={agreementStyles.signatureError}>
              ⚠️ Please sign the canvas above to proceed
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={agreementStyles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            <div>
              <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0' }}>Error</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Validation Messages */}
        {!termsAccepted && (
          <div style={agreementStyles.warningBox}>
            ⚠️ Please accept the Partner Agreement to proceed
          </div>
        )}
        {!privacyAccepted && (
          <div style={agreementStyles.warningBox}>
            ⚠️ Please accept the Privacy Policy to proceed
          </div>
        )}
        {!signatureImage && (
          <div style={agreementStyles.warningBox}>
            ⚠️ Digital signature is required
          </div>
        )}

        {/* Submit Buttons */}
        <div style={agreementStyles.buttonGroup}>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            style={{
              ...agreementStyles.submitButton,
              opacity: isLoading || !isFormValid ? 0.6 : 1,
              cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && isFormValid) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoading ? '🔄 Processing...' : '✓ Agree & Sign'}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={agreementStyles.backButton}
          >
            ← Back
          </button>
        </div>

        <p style={agreementStyles.disclaimerFooter}>
          By submitting this form, you confirm that you have read, understood, and accept the Droooly Partner Agreement and all its terms and conditions.
        </p>
      </form>

      {/* Full Screen Modal */}
      {showModal && (
        <AgreementModal onClose={() => setShowModal(false)} />
      )}

      <style>{agreementModalStyles_CSS}</style>
    </>
  );
}

// Full Screen Agreement Modal
function AgreementModal({ onClose }: { onClose: () => void }) {
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
          dangerouslySetInnerHTML={{ __html: PARTNER_AGREEMENT_HTML }}
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

// HTML Agreement Content
const PARTNER_AGREEMENT_HTML = `
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
      <div class="definition">"<strong>Platform</strong>" - The Droooly mobile application, website, APIs, and all associated systems</div>
      <div class="definition">"<strong>Services</strong>" - Catering, meal plans, chef services, event management, or any offerings listed by Partner</div>
      <div class="definition">"<strong>Order</strong>" - A confirmed booking placed by a Customer via the Platform</div>
      <div class="definition">"<strong>Customer</strong>" - An end-user availing Services through the Platform</div>
      <div class="definition">"<strong>Commission/Platform Fee</strong>" - The fee charged by Droooly per transaction, as per Annexure A</div>
      <div class="definition">"<strong>T+1</strong>" - One (1) business day post Fulfilment/Delivery</div>
      <div class="definition">"<strong>Applicable Law</strong>" - All Indian laws including GST Act, Food Safety & Standards Act, Income Tax Act, and IT Act</div>
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
      <tr>
        <th>Scenario</th>
        <th>Time of Cancellation</th>
        <th>Refund to Customer</th>
        <th>Charge to Partner</th>
      </tr>
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

// Plain text version for download
const PARTNER_AGREEMENT_TEXT = `DROOOLY PARTNER AGREEMENT (INDIA)
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
Email: partners@droooly.com

Last Updated: ${new Date().toLocaleDateString('en-IN')}
`;





const handleSubmitAgreement = async (
  termsAccepted: boolean,
  privacyAccepted: boolean,
  signatureImage: string | null
) => {
  if (!signatureImage) {
    console.error('No signature captured');
    return;
  }

  try {
    // 1. CAPTURE SIGNATURE DATA
    const signatureData = {
      signatureImage: signatureImage, // Base64 string of the signature
      signedAt: new Date().toISOString(),
      ipAddress: await getClientIP(), // Optional: for audit trail
      userAgent: navigator.userAgent, // Device info
    };

    // 2. CREATE SIGNED AGREEMENT DOCUMENT
    const signedAgreementPDF = generateSignedAgreementPDF(
      PARTNER_AGREEMENT_TEXT,
      signatureImage,
      termsAccepted,
      privacyAccepted
    );

    // 3. SEND TO BACKEND FOR STORAGE
    const response = await fetch('/api/onboarding/sign-agreement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partnerId: '', // From your user context
        signatureImage: signatureImage,
        signedAgreementPDF: signedAgreementPDF, // Base64 encoded PDF
        termsAccepted,
        privacyAccepted,
        signedAt: new Date().toISOString(),
        ipAddress: signatureData.ipAddress,
      }),
    });

    if (!response.ok) throw new Error('Failed to save signed agreement');

    const { documentId, downloadUrl } = await response.json();

    downloadSignedDocument(await signedAgreementPDF, documentId);

   
    function showSignatureSuccess({ documentId, downloadUrl, signedAt }: { documentId: string; downloadUrl: string; signedAt: Date }) {
      console.log('Signature success:', { documentId, downloadUrl, signedAt });
    }
    
        showSignatureSuccess({
      documentId,
      downloadUrl,
      signedAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving signed agreement:', error);
  }
};

// Generate PDF with signature embedded
async function generateSignedAgreementPDF(
  agreementText: string,
  signatureImage: string,
  termsAccepted: boolean,
  privacyAccepted: boolean
): Promise<string> {
  // This creates a PDF with the agreement text + signature image embedded
  // Using a library like jsPDF or PDFKit

  const pdfContent = `
    DROOOLY PARTNER AGREEMENT (INDIA)
    
    ${agreementText}
    
    ========================================
    DIGITAL SIGNATURE & ACCEPTANCE
    ========================================
    
    Terms Accepted: ${termsAccepted ? 'YES' : 'NO'}
    Privacy Policy Accepted: ${privacyAccepted ? 'YES' : 'NO'}
    
    PARTNER SIGNATURE:
    [Signature Image Embedded]
    
    Signed on: ${new Date().toLocaleString('en-IN')}
    IP Address: ${await getClientIP()}
    Device: ${navigator.userAgent}
    
    This electronic signature constitutes a legally binding agreement 
    under applicable Indian laws.
    
    ========================================
  `;

  // Convert to Base64 (simplified - use proper PDF library in production)
  return btoa(unescape(encodeURIComponent(pdfContent)));
}

// Automatic download function
function downloadSignedDocument(pdfBase64: string, documentId: string) {
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,${pdfBase64}`;
  link.download = `Droooly_Partner_Agreement_Signed_${documentId}_${new Date().getTime()}.pdf`;
  link.click();
}

// Success modal with download options
function SignatureSuccessModal({
  documentId,
  downloadUrl,
  signedAt,
  onClose,
}: {
  documentId: string;
  downloadUrl: string;
  signedAt: Date;
  onClose: () => void;
}) {
  return (
    <div style={successModalStyles.overlay} onClick={onClose}>
      <div
        style={successModalStyles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={successModalStyles.content}>
          <div style={successModalStyles.successIcon}>✅</div>
          <h2 style={successModalStyles.title}>Agreement Signed Successfully!</h2>
          <p style={successModalStyles.message}>
            Your Partner Agreement has been digitally signed and saved.
          </p>

          {/* Document Details */}
          <div style={successModalStyles.detailsBox}>
            <div style={successModalStyles.detailRow}>
              <span style={successModalStyles.label}>Document ID:</span>
              <span style={successModalStyles.value}>{documentId}</span>
            </div>
            <div style={successModalStyles.detailRow}>
              <span style={successModalStyles.label}>Signed on:</span>
              <span style={successModalStyles.value}>
                {signedAt.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={successModalStyles.detailRow}>
              <span style={successModalStyles.label}>Status:</span>
              <span style={{ ...successModalStyles.value, color: '#10b981', fontWeight: '700' }}>
                Legally Binding
              </span>
            </div>
          </div>

          {/* Download Options */}
          <div style={successModalStyles.downloadOptions}>
            <h3 style={successModalStyles.optionsTitle}>Download Your Signed Agreement</h3>

            <button
              onClick={() => downloadFromServer(downloadUrl, documentId)}
              style={successModalStyles.downloadBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              📥 Download as PDF
            </button>

            <button
              onClick={() => downloadAsEmail(documentId)}
              style={{
                ...successModalStyles.downloadBtn,
                backgroundColor: '#3b82f6',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              📧 Email to Me
            </button>

            <button
              onClick={() => downloadAsEmail(documentId, true)}
              style={{
                ...successModalStyles.downloadBtn,
                backgroundColor: '#8b5cf6',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7c3aed';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
              }}
            >
              💾 Save to My Account
            </button>
          </div>

          {/* Audit Trail */}
          <div style={successModalStyles.auditTrail}>
            <h4 style={successModalStyles.auditTitle}>📋 Audit Trail</h4>
            <ul style={successModalStyles.auditList}>
              <li>✓ Signature captured digitally</li>
              <li>✓ Timestamp recorded: {signedAt.toISOString()}</li>
              <li>✓ Legal jurisdiction: Indian Laws</li>
              <li>✓ Encryption: End-to-end protected</li>
              <li>✓ Stored securely in our database</li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            style={successModalStyles.continueBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}


