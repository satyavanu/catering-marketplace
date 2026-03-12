'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingStep {
  businessType: string;
  cuisineTypes: string[];
  location: string;
  serviceAreas: string[];
  minGuestCount: number;
  maxGuestCount: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingStep>({
    businessType: '',
    cuisineTypes: [],
    location: '',
    serviceAreas: [],
    minGuestCount: 10,
    maxGuestCount: 500,
  });

  const businessTypes = ['Fine Dining', 'Casual Catering', 'Fast Casual', 'Food Truck', 'Private Chef'];
  const cuisineOptions = ['Italian', 'Indian', 'French', 'Asian', 'Mediterranean', 'American', 'Mexican', 'Thai'];
  const serviceAreaOptions = ['Downtown', 'Suburbs', 'Rural', 'Remote Catering'];

  const handleBusinessTypeSelect = (type: string) => {
    setData((prev) => ({ ...prev, businessType: type }));
  };

  const handleCuisineToggle = (cuisine: string) => {
    setData((prev) => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter((c) => c !== cuisine)
        : [...prev.cuisineTypes, cuisine],
    }));
  };

  const handleServiceAreaToggle = (area: string) => {
    setData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter((a) => a !== area)
        : [...prev.serviceAreas, area],
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Welcome to CaterHub
          </h1>
          <p style={{ color: '#6b7280' }}>
            Let's set up your catering business (Step {step} of 4)
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: s <= step ? '#f97316' : '#e5e7eb',
                borderRadius: '9999px',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>

        {/* Step 1: Business Type */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              What type of catering business are you?
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {businessTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleBusinessTypeSelect(type)}
                  style={{
                    padding: '1rem',
                    backgroundColor: data.businessType === type ? '#f97316' : 'white',
                    color: data.businessType === type ? 'white' : '#1f2937',
                    border: data.businessType === type ? 'none' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (data.businessType !== type) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (data.businessType !== type) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Cuisine Types */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              What cuisines do you specialize in?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => handleCuisineToggle(cuisine)}
                  style={{
                    padding: '1rem',
                    backgroundColor: data.cuisineTypes.includes(cuisine) ? '#f97316' : 'white',
                    color: data.cuisineTypes.includes(cuisine) ? 'white' : '#1f2937',
                    border: data.cuisineTypes.includes(cuisine) ? 'none' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!data.cuisineTypes.includes(cuisine)) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!data.cuisineTypes.includes(cuisine)) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Service Areas */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              Where do you provide services?
            </h2>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {serviceAreaOptions.map((area) => (
                <label
                  key={area}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={data.serviceAreas.includes(area)}
                    onChange={() => handleServiceAreaToggle(area)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{area}</span>
                </label>
              ))}
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Location / City
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., New York, USA"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}

        {/* Step 4: Capacity */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              What's your catering capacity?
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Minimum Guest Count
                </label>
                <input
                  type="number"
                  value={data.minGuestCount}
                  onChange={(e) => setData((prev) => ({ ...prev, minGuestCount: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Maximum Guest Count
                </label>
                <input
                  type="number"
                  value={data.maxGuestCount}
                  onChange={(e) => setData((prev) => ({ ...prev, maxGuestCount: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: step === 1 ? '#e5e7eb' : 'white',
              color: step === 1 ? '#9ca3af' : '#1f2937',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Back
          </button>
          <button
            onClick={step === 4 ? handleComplete : handleNext}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            {step === 4 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}