'use client';

import React, { useRef, useState } from 'react';
import { AlertCircle, Download, Trash2, Eye } from 'lucide-react';

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

// Styles for the agreement component
const agreementStyles: { [key: string]: React.CSSProperties } = {
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #0284c7',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  infoText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#0c4a6e',
    fontWeight: '500',
    lineHeight: '1.6',
  } as React.CSSProperties,

  agreementContainer: {
    border: '2px solid #e5e7eb',
    borderRadius: '1rem',
    backgroundColor: '#f9fafb',
    marginBottom: '2rem',
    overflow: 'hidden',
  } as React.CSSProperties,

  agreementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white',
  } as React.CSSProperties,

  agreementTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  } as React.CSSProperties,

  viewFullButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#eff6ff',
    border: '1px solid #0284c7',
    color: '#0284c7',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  agreementContent: {
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '1.5rem',
    backgroundColor: 'white',
  } as React.CSSProperties,

  downloadSection: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fafafa',
  } as React.CSSProperties,

  downloadButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#eff6ff',
    border: '2px solid #0284c7',
    color: '#0284c7',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  checkboxContainer: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
  } as React.CSSProperties,

  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  customCheckboxContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '0.25rem',
  } as React.CSSProperties,

  hiddenCheckbox: {
    width: 0,
    height: 0,
    opacity: 0,
    cursor: 'pointer',
  } as React.CSSProperties,

  customCheckbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '0.375rem',
    border: '2px solid',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,

  checkmark: {
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  } as React.CSSProperties,

  checkboxText: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: '1.6',
  } as React.CSSProperties,

  asterisk: {
    color: '#dc2626',
    fontWeight: '700',
  } as React.CSSProperties,

  legalDisclaimer: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: '0.75rem 0 0 2.375rem',
    fontStyle: 'italic',
    lineHeight: '1.5',
  } as React.CSSProperties,

  signatureSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  helpText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  signaturePadContainer: {
    marginBottom: '1rem',
  } as React.CSSProperties,

  signatureCanvas: {
    display: 'block',
    width: '100%',
    height: 'auto',
    border: '2px dashed #cbd5e1',
    borderRadius: '0.5rem',
    cursor: 'crosshair',
    backgroundColor: 'white',
  } as React.CSSProperties,

  signaturePreviewBox: {
    padding: '1rem',
    backgroundColor: '#ecfdf5',
    border: '2px solid #86efac',
    borderRadius: '0.5rem',
  } as React.CSSProperties,

  signaturePreview: {
    marginBottom: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    display: 'flex',
    justifyContent: 'center',
  } as React.CSSProperties,

  clearButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fecaca',
    border: 'none',
    color: '#7f1d1d',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  signatureError: {
    fontSize: '0.85rem',
    color: '#dc2626',
    margin: '0.75rem 0 0 0',
    fontWeight: '500',
  } as React.CSSProperties,

  errorMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#991b1b',
    marginBottom: '1rem',
  } as React.CSSProperties,

  warningBox: {
    padding: '0.875rem 1rem',
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '0.5rem',
    color: '#92400e',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap',
  } as React.CSSProperties,

  submitButton: {
    flex: 1,
    minWidth: '200px',
    padding: '1rem 2rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  backButton: {
    flex: 1,
    minWidth: '120px',
    padding: '1rem 2rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  disclaimerFooter: {
    fontSize: '0.8rem',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: '1.5rem',
    lineHeight: '1.6',
    fontWeight: '500',
  } as React.CSSProperties,
};

// Modal Styles
const agreementModalStyles: { [key: string]: React.CSSProperties & { [key: string]: any } } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as React.CSSProperties,

  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    width: '95%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
  } as React.CSSProperties,

  modalHeader: {
    padding: '1.5rem',
    borderBottom: '2px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    flexShrink: 0,
  } as React.CSSProperties,

  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  } as React.CSSProperties,

  closeButton: {
    padding: '0.5rem 0.75rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '1.5rem',
    lineHeight: '1',
    transition: 'color 0.2s ease',
  } as React.CSSProperties,

  modalContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
  } as React.CSSProperties,

  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#f9fafb',
    flexShrink: 0,
  } as React.CSSProperties,

  closeButtonFooter: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
};

// CSS for HTML content styling
const agreementModalStyles_CSS = `
  .agreement-document {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1f2937;
    line-height: 1.8;
  }

  .agreement-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .agreement-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .agreement-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0;
  }

  .agreement-date {
    font-size: 0.85rem;
    color: #9ca3af;
    margin: 0.75rem 0 0 0;
  }

  .agreement-parties {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .agreement-parties h2 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 1rem 0;
  }

  .agreement-parties p {
    margin: 0.75rem 0;
    color: #374151;
  }

  .agreement-section {
    margin-bottom: 0.5rem;
  }

  .agreement-section h2 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #111827;
    margin: 1.5rem 0 0.75rem 0;
    border-left: 4px solid #667eea;
    padding-left: 1rem;
  }

  .agreement-section h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #374151;
    margin: 1rem 0 0.5rem 0;
  }

  .agreement-section p {
    margin: 0.75rem 0;
    color: #374151;
  }

  .agreement-section ul, .agreement-section ol {
    margin: 0.75rem 0;
    padding-left: 1.75rem;
  }

  .agreement-section li {
    margin-bottom: 0.5rem;
    color: #374151;
  }

  .definitions-box {
    background: #f9fafb;
    padding: 1.25rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .definition {
    margin-bottom: 0.75rem;
    color: #374151;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .definition:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .cancellation-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    border: 1px solid #e5e7eb;
  }

  .cancellation-table th {
    background: #f3f4f6;
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #111827;
    border-bottom: 2px solid #e5e7eb;
    font-size: 0.875rem;
  }

  .cancellation-table td {
    padding: 0.75rem;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
  }

  .cancellation-table tr:hover {
    background: #f9fafb;
  }

  .agreement-acceptance {
    background: #ecfdf5;
    padding: 1.5rem;
    border: 2px solid #6ee7b7;
    border-radius: 0.75rem;
    margin: 2rem 0;
  }

  .legal-notice {
    background: #fef3c7;
    padding: 1rem;
    border-left: 4px solid #f59e0b;
    border-radius: 0.375rem;
    margin: 1rem 0 0 0;
    color: #92400e;
    font-size: 0.85rem;
  }

  .agreement-footer {
    text-align: center;
    padding: 1.5rem 0;
    margin-top: 2rem;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
    font-size: 0.85rem;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;