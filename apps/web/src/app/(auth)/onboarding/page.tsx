'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, AlertCircle, ChevronRight, Clock, RefreshCw, Mail, Phone, DollarSign, FileCheck, ShieldCheck } from 'lucide-react';

interface OnboardingStep {
  // Business Basic Info
  businessName: string;
  businessType: string;
  businessDescription: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;

  // Legal & Tax
  tan: string;
  registrationId: string;
  registrationType: string;
  vatNumber: string;
  panNumber: string;

  // Food License
  foodLicenseNumber: string;
  foodLicenseExpiryDate: string;
  foodLicenseDocument: File | null;
  fssaiCertificateDocument: File | null;

  // Aadhaar Verification
  aadhaarNumber: string;
  aadhaarLastFourDigits: string;
  aadhaarVerified: boolean;
  aadhaarDocument: File | null;

  // Business Details
  cuisineTypes: string[];
  location: string;
  serviceAreas: string[];
  minGuestCount: number;
  maxGuestCount: number;

  // Bank Details
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankDocument: File | null;

  // Business Insights
  yearlyRevenue: string;
  yearsInBusiness: number;
  staffCount: number;
  averageOrderValue: number;
}

const BUSINESS_TYPES = ['Fine Dining', 'Casual Catering', 'Fast Casual', 'Cloud Kitchen', 'Food Truck', 'Private Chef', 'Meal Prep', 'Corporate Catering'];
const CUISINE_OPTIONS = ['Italian', 'Indian', 'French', 'Asian', 'Mediterranean', 'American', 'Mexican', 'Thai', 'Chinese', 'Continental'];
const SERVICE_AREAS = ['Downtown', 'Suburbs', 'Rural', 'Remote Catering', 'Event Venues', 'Corporate Offices'];
const REGISTRATION_TYPES = ['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Public Limited'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState({
    email: { status: 'pending', verifiedAt: null as string | null },
    phone: { status: 'pending', verifiedAt: null as string | null },
    bank: { status: 'pending', verifiedAt: null as string | null },
    foodLicense: { status: 'pending', verifiedAt: null as string | null },
    aadhaar: { status: 'pending', verifiedAt: null as string | null },
    documents: { status: 'pending', verifiedAt: null as string | null },
  });

  const [documentUploads, setDocumentUploads] = useState({
    foodLicense: null,
    fssaiCertificate: null,
    aadhaar: null,
    bankStatement: null,
  });

  const [data, setData] = useState<OnboardingStep>({
    businessName: '',
    businessType: '',
    businessDescription: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    tan: '',
    registrationId: '',
    registrationType: '',
    vatNumber: '',
    panNumber: '',
    foodLicenseNumber: '',
    foodLicenseExpiryDate: '',
    foodLicenseDocument: null,
    fssaiCertificateDocument: null,
    aadhaarNumber: '',
    aadhaarLastFourDigits: '',
    aadhaarVerified: false,
    aadhaarDocument: null,
    cuisineTypes: [],
    location: '',
    serviceAreas: [],
    minGuestCount: 10,
    maxGuestCount: 500,
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankDocument: null,
    yearlyRevenue: '',
    yearsInBusiness: 1,
    staffCount: 1,
    averageOrderValue: 5000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFileUpload = (fieldName: string, file: File) => {
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[fieldName] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [fieldName]: current + Math.random() * 30 };
      });
    }, 200);

    setData((prev) => ({ ...prev, [fieldName]: file }));
    setDocumentUploads((prev) => ({
      ...prev,
      [fieldName.replace('Document', '')]: file.name,
    }));

    setTimeout(() => {
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));
    }, 1500);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!data.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!data.businessType) newErrors.businessType = 'Business type is required';
        if (!data.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!data.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
        if (!data.ownerPhone.trim()) newErrors.ownerPhone = 'Phone is required';
        break;

      case 2:
        if (!data.tan.trim()) newErrors.tan = 'TAN is required';
        if (!data.panNumber.trim()) newErrors.panNumber = 'PAN is required';
        if (!data.registrationId.trim()) newErrors.registrationId = 'Registration ID is required';
        if (!data.registrationType) newErrors.registrationType = 'Registration type is required';
        if (!data.vatNumber.trim()) newErrors.vatNumber = 'VAT number is required';
        break;

      case 3:
        if (!data.foodLicenseNumber.trim()) newErrors.foodLicenseNumber = 'Food license number is required';
        if (!data.foodLicenseExpiryDate) newErrors.foodLicenseExpiryDate = 'Expiry date is required';
        if (!data.foodLicenseDocument) newErrors.foodLicenseDocument = 'Food license document is required';
        if (!data.fssaiCertificateDocument) newErrors.fssaiCertificateDocument = 'FSSAI certificate is required';
        break;

      case 4:
        if (!data.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'Aadhaar number is required';
        if (!data.aadhaarDocument) newErrors.aadhaarDocument = 'Aadhaar document is required';
        break;

      case 5:
        if (data.cuisineTypes.length === 0) newErrors.cuisineTypes = 'Select at least one cuisine';
        if (!data.location.trim()) newErrors.location = 'Location is required';
        if (data.serviceAreas.length === 0) newErrors.serviceAreas = 'Select at least one service area';
        break;

      case 6:
        if (!data.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!data.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        if (!data.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (!data.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        if (!data.bankDocument) newErrors.bankDocument = 'Bank statement is required';
        break;

      case 7:
        if (!data.yearlyRevenue) newErrors.yearlyRevenue = 'Yearly revenue is required';
        if (data.yearsInBusiness < 0) newErrors.yearsInBusiness = 'Invalid years in business';
        if (data.staffCount < 1) newErrors.staffCount = 'Staff count must be at least 1';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 7) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    if (validateStep(7)) {
      console.log('Onboarding Complete:', data);
      // Redirect to verification page
      router.push('/onboarding/verification');
    }
  };

  const handleRetryVerification = (field: string) => {
    setEditingField(field);
  };

  const handleUpdateField = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setVerificationStatus((prev) => ({
      ...prev,
      [field]: { status: 'pending', verifiedAt: null },
    }));
    setEditingField(null);
  };

  const updateField = (field: keyof OnboardingStep, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleCuisine = (cuisine: string) => {
    updateField('cuisineTypes', 
      data.cuisineTypes.includes(cuisine)
        ? data.cuisineTypes.filter((c) => c !== cuisine)
        : [...data.cuisineTypes, cuisine]
    );
  };

  const toggleServiceArea = (area: string) => {
    updateField('serviceAreas',
      data.serviceAreas.includes(area)
        ? data.serviceAreas.filter((a) => a !== area)
        : [...data.serviceAreas, area]
    );
  };

  const renderStepIndicator = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${(step / 7) * 100}%`,
          }}
        />
      </div>
      <p style={styles.progressText}>Step {step} of 7</p>
    </div>
  );

  const renderInputField = (label: string, fieldName: string, type = 'text', placeholder = '') => (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={data[fieldName as keyof OnboardingStep] as string}
        onChange={(e) => updateField(fieldName as keyof OnboardingStep, e.target.value)}
        placeholder={placeholder}
        style={{ ...styles.input, borderColor: errors[fieldName] ? '#ef4444' : '#d1d5db' }}
      />
      {errors[fieldName] && <p style={styles.errorText}>{errors[fieldName]}</p>}
    </div>
  );

  const renderFileUpload = (label: string, fieldName: string, acceptedFormats = '.pdf,.jpg,.jpeg,.png') => (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <div
        style={{
          ...styles.uploadBox,
          borderColor: errors[fieldName] ? '#ef4444' : '#d1d5db',
        }}
      >
        <input
          type="file"
          accept={acceptedFormats}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(fieldName, e.target.files[0]);
            }
          }}
          style={styles.fileInput}
        />
        <Upload size={32} color="#9ca3af" />
        <p style={styles.uploadText}>Drag and drop or click to upload</p>
        <p style={styles.uploadSubtext}>{acceptedFormats}</p>
      </div>

      {uploadProgress[fieldName] !== undefined && uploadProgress[fieldName] > 0 && uploadProgress[fieldName] < 100 && (
        <div style={styles.progressBarSmall}>
          <div style={{ ...styles.progressFillSmall, width: `${uploadProgress[fieldName]}%` }} />
        </div>
      )}

      {uploadProgress[fieldName] === 100 && (
        <div style={styles.successMessage}>
          <Check size={16} color="#10b981" />
          <span>{documentUploads[fieldName as keyof typeof documentUploads]} uploaded</span>
        </div>
      )}

      {errors[fieldName] && <p style={styles.errorText}>{errors[fieldName]}</p>}
    </div>
  );

  // Original Registration Flow
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>CaterHub Business Registration</h1>
            <p style={styles.subtitle}>Complete KYC and set up your catering business</p>
          </div>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Business Basic Information */}
        {step === 1 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📋 Business Information</h2>
            <div style={styles.formGrid}>
              {renderInputField('Business Name', 'businessName', 'text', 'e.g., Tasty Kitchen')}
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Business Type</label>
                <select
                  value={data.businessType}
                  onChange={(e) => updateField('businessType', e.target.value)}
                  style={{ ...styles.input, borderColor: errors.businessType ? '#ef4444' : '#d1d5db' }}
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.businessType && <p style={styles.errorText}>{errors.businessType}</p>}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Business Description</label>
                  <textarea
                    value={data.businessDescription}
                    onChange={(e) => updateField('businessDescription', e.target.value)}
                    placeholder="Tell us about your catering business..."
                    style={{ ...styles.input, ...styles.textarea, resize: 'none' }}
                    rows={3}
                  />
                </div>
              </div>

              {renderInputField('Owner Name', 'ownerName', 'text', 'Full name')}
              {renderInputField('Email', 'ownerEmail', 'email', 'owner@example.com')}
              {renderInputField('Phone Number', 'ownerPhone', 'tel', '+91-9876543210')}
            </div>
          </div>
        )}

        {/* Step 2: Legal & Tax Information */}
        {step === 2 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>🏛️ Legal & Tax Details</h2>
            <div style={styles.formGrid}>
              {renderInputField('PAN Number', 'panNumber', 'text', 'e.g., ABCDE1234F')}
              {renderInputField('TAN (Tax Account Number)', 'tan', 'text', 'e.g., AAAA00001A1A')}
              {renderInputField('Registration ID (UDYAM)', 'registrationId', 'text', 'e.g., UDYAM-DL-04-0123456')}

              <div style={styles.formGroup}>
                <label style={styles.label}>Registration Type</label>
                <select
                  value={data.registrationType}
                  onChange={(e) => updateField('registrationType', e.target.value)}
                  style={{ ...styles.input, borderColor: errors.registrationType ? '#ef4444' : '#d1d5db' }}
                >
                  <option value="">Select registration type</option>
                  {REGISTRATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.registrationType && <p style={styles.errorText}>{errors.registrationType}</p>}
              </div>

              {renderInputField('VAT/GST Number', 'vatNumber', 'text', 'e.g., 07AABCU9603R1Z0')}
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={20} color="#2563eb" />
              <p>Ensure all tax and registration details are accurate. They'll be verified during the onboarding process.</p>
            </div>
          </div>
        )}

        {/* Step 3: Food License & FSSAI */}
        {step === 3 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>🍽️ Food License & FSSAI</h2>
            <div style={styles.formGrid}>
              {renderInputField('Food License Number', 'foodLicenseNumber', 'text', 'e.g., FL-20XX-DL-000123')}
              {renderInputField('License Expiry Date', 'foodLicenseExpiryDate', 'date')}
              {renderFileUpload('Food License Document', 'foodLicenseDocument')}
              {renderFileUpload('FSSAI Certificate', 'fssaiCertificateDocument')}
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={20} color="#f59e0b" />
              <p>Upload clear copies of your food license and FSSAI certificate. Documents must be legible and within validity period.</p>
            </div>
          </div>
        )}

        {/* Step 4: Aadhaar Verification */}
        {step === 4 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>🆔 Aadhaar Verification</h2>
            <div style={styles.formGrid}>
              {renderInputField('Aadhaar Number', 'aadhaarNumber', 'text', 'e.g., 1234-5678-9012')}
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Last 4 Digits (for verification)</label>
                <input
                  type="text"
                  value={data.aadhaarLastFourDigits}
                  onChange={(e) => updateField('aadhaarLastFourDigits', e.target.value.slice(-4))}
                  placeholder="XXXX"
                  maxLength={4}
                  style={styles.input}
                />
              </div>

              {renderFileUpload('Aadhaar Document', 'aadhaarDocument')}
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={20} color="#2563eb" />
              <p>Your Aadhaar information is encrypted and used only for verification purposes as per government KYC norms.</p>
            </div>
          </div>
        )}

        {/* Step 5: Cuisine & Service Areas */}
        {step === 5 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>🍲 Cuisine Types & Service Areas</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Cuisines You Specialize In</label>
              <div style={styles.gridGroup}>
                {CUISINE_OPTIONS.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    style={{
                      ...styles.chipButton,
                      backgroundColor: data.cuisineTypes.includes(cuisine) ? '#f97316' : 'white',
                      color: data.cuisineTypes.includes(cuisine) ? 'white' : '#1f2937',
                      borderColor: data.cuisineTypes.includes(cuisine) ? '#f97316' : '#d1d5db',
                    }}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
              {errors.cuisineTypes && <p style={styles.errorText}>{errors.cuisineTypes}</p>}
            </div>

            <div style={styles.formGrid}>
              {renderInputField('Location/City', 'location', 'text', 'e.g., New Delhi')}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Service Areas</label>
              <div style={styles.gridGroup}>
                {SERVICE_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleServiceArea(area)}
                    style={{
                      ...styles.chipButton,
                      backgroundColor: data.serviceAreas.includes(area) ? '#2563eb' : 'white',
                      color: data.serviceAreas.includes(area) ? 'white' : '#1f2937',
                      borderColor: data.serviceAreas.includes(area) ? '#2563eb' : '#d1d5db',
                    }}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {errors.serviceAreas && <p style={styles.errorText}>{errors.serviceAreas}</p>}
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Minimum Guest Count</label>
                <input
                  type="number"
                  value={data.minGuestCount}
                  onChange={(e) => updateField('minGuestCount', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Maximum Guest Count</label>
                <input
                  type="number"
                  value={data.maxGuestCount}
                  onChange={(e) => updateField('maxGuestCount', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Bank Account Details */}
        {step === 6 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>🏦 Bank Account Details</h2>
            <div style={styles.formGrid}>
              {renderInputField('Bank Name', 'bankName', 'text', 'e.g., HDFC Bank')}
              {renderInputField('Account Holder Name', 'accountHolderName', 'text', 'Name as per bank records')}
              {renderInputField('Account Number', 'accountNumber', 'text', 'e.g., 1234567890123')}
              {renderInputField('IFSC Code', 'ifscCode', 'text', 'e.g., HDFC0000001')}
              {renderFileUpload('Bank Statement', 'bankDocument', '.pdf')}
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={20} color="#10b981" />
              <p>All payments from customers will be transferred to this account. Ensure the details are correct.</p>
            </div>
          </div>
        )}

        {/* Step 7: Business Insights */}
        {step === 7 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📊 Business Insights</h2>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Yearly Revenue</label>
                <select
                  value={data.yearlyRevenue}
                  onChange={(e) => updateField('yearlyRevenue', e.target.value)}
                  style={{ ...styles.input, borderColor: errors.yearlyRevenue ? '#ef4444' : '#d1d5db' }}
                >
                  <option value="">Select range</option>
                  <option value="0-10L">₹0 - ₹10 Lakh</option>
                  <option value="10L-50L">₹10 Lakh - ₹50 Lakh</option>
                  <option value="50L-1Cr">₹50 Lakh - ₹1 Crore</option>
                  <option value="1Cr-5Cr">₹1 Crore - ₹5 Crore</option>
                  <option value="5Cr+">₹5 Crore+</option>
                </select>
                {errors.yearlyRevenue && <p style={styles.errorText}>{errors.yearlyRevenue}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Years in Business</label>
                <input
                  type="number"
                  value={data.yearsInBusiness}
                  onChange={(e) => updateField('yearsInBusiness', parseInt(e.target.value))}
                  min={0}
                  style={styles.input}
                />
                {errors.yearsInBusiness && <p style={styles.errorText}>{errors.yearsInBusiness}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Staff Count</label>
                <input
                  type="number"
                  value={data.staffCount}
                  onChange={(e) => updateField('staffCount', parseInt(e.target.value))}
                  min={1}
                  style={styles.input}
                />
                {errors.staffCount && <p style={styles.errorText}>{errors.staffCount}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Average Order Value (₹)</label>
                <input
                  type="number"
                  value={data.averageOrderValue}
                  onChange={(e) => updateField('averageOrderValue', parseInt(e.target.value))}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.summaryBox}>
              <h3 style={styles.summaryTitle}>📋 Registration Summary</h3>
              <div style={styles.summaryGrid}>
                <div>
                  <p style={styles.summaryLabel}>Business</p>
                  <p style={styles.summaryValue}>{data.businessName}</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Owner</p>
                  <p style={styles.summaryValue}>{data.ownerName}</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Cuisines</p>
                  <p style={styles.summaryValue}>{data.cuisineTypes.join(', ')}</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Location</p>
                  <p style={styles.summaryValue}>{data.location}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={styles.navigationButtons}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              opacity: step === 1 ? 0.5 : 1,
              cursor: step === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Back
          </button>

          <button
            onClick={step === 7 ? handleComplete : handleNext}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            {step === 7 ? 'Complete Registration' : 'Next'}
            <ChevronRight size={18} />
          </button>
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
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '3rem 2rem',
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
  },
  verificationItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
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
  retryButton: {
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
    marginTop: '1.5rem',
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
  // ... rest of existing styles ...
  header: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  progressContainer: {
    marginBottom: '2rem',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden' as const,
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  stepContent: {
    marginBottom: '2rem',
  },
  stepTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1.5rem',
    margin: '0 0 1.5rem 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  },
  textarea: {
    fontFamily: 'inherit',
    minHeight: '100px',
    resize: 'vertical' as const,
  },
  errorText: {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: '0.25rem',
    margin: '0.25rem 0 0 0',
  },
  uploadBox: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '2rem',
    textAlign: 'center' as const,
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative' as const,
  },
  fileInput: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0,
    cursor: 'pointer',
  },
  uploadText: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1f2937',
    margin: '0.75rem 0 0 0',
  },
  uploadSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  progressBarSmall: {
    width: '100%',
    height: '2px',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden' as const,
    marginTop: '0.5rem',
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem',
    fontSize: '0.875rem',
    color: '#10b981',
  },
  chipButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  gridGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  navigationButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e5e7eb',
  },
  button: {
    flex: 1,
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
  },
  buttonPrimary: {
    backgroundColor: '#f97316',
    color: 'white',
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    border: '1px solid #d1d5db',
  },
  summaryBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginTop: '1.5rem',
  },
  summaryTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1rem',
    margin: '0 0 1rem 0',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    marginBottom: '0.25rem',
    margin: '0 0 0.25rem 0',
  },
  summaryValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
};