'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { OnboardingMasterData } from '@catering-marketplace/query-client';

interface Cuisine {
  id: string;
  key: string;
  label: string;
  type: 'cuisine' | 'specialization';
}

interface DietType {
  id: string;
  key: string;
  label: string;
}

interface CapacityRange {
  id: string;
  key: string;
  label: string;
  min_guests: number;
  max_guests: number | null;
}

interface BusinessDetailsFormData {
  yearsInBusiness: string;
  cuisines: string[];
  specializations: string[];
  dietTypes: string[];
  capacityRange: string;
  baseCity: string;
}

interface BusinessDetailsProps {
  yearsInBusiness: string;
  cuisines: string[];
  specializations: string[];
  dietTypes: string[];
  capacityRange: string;
  baseCity: string;
  isLoading: boolean;
  error: string;
  onFormDataChange: (formData: BusinessDetailsFormData, isValid: boolean) => void;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
  masterData?: OnboardingMasterData;
}

export default function BusinessDetails({
  yearsInBusiness,
  cuisines,
  specializations,
  dietTypes,
  capacityRange,
  baseCity,
  isLoading,
  error,
  onFormDataChange,
  onBack,
  styles,
  masterData,
}: BusinessDetailsProps) {
  // Local state for form
  const [localYearsInBusiness, setLocalYearsInBusiness] = useState(yearsInBusiness);
  const [localCuisines, setLocalCuisines] = useState<string[]>(cuisines);
  const [localSpecializations, setLocalSpecializations] = useState<string[]>(specializations);
  const [localDietTypes, setLocalDietTypes] = useState<string[]>(dietTypes);
  const [localCapacityRange, setLocalCapacityRange] = useState(capacityRange);
  const [localBaseCity, setLocalBaseCity] = useState(baseCity);

  // Form validation
  const isFormValid = !!(
    localYearsInBusiness.trim() &&
    (localCuisines.length > 0 || localSpecializations.length > 0) &&
    localDietTypes.length > 0 &&
    localCapacityRange.trim() &&
    localBaseCity.trim()
  );

  // Get data from master data
  const cuisinesList = masterData?.cuisines || [];
  const cuisinesOnly = cuisinesList.filter((c) => c.type === 'cuisine');
  const specializationsOnly = cuisinesList.filter((c) => c.type === 'specialization');
  const dietTypesList = masterData?.diet_types || [];
  const capacityRangesList = masterData?.capacity_ranges || [];

  // Get cities list
  const citiesList = [
    { code: 'delhi', name: 'Delhi' },
    { code: 'mumbai', name: 'Mumbai' },
    { code: 'bangalore', name: 'Bangalore' },
    { code: 'hyderabad', name: 'Hyderabad' },
    { code: 'pune', name: 'Pune' },
    { code: 'kolkata', name: 'Kolkata' },
    { code: 'chennai', name: 'Chennai' },
    { code: 'ahmedabad', name: 'Ahmedabad' },
  ];

  // Pass form data back to parent whenever it changes
  useEffect(() => {
    const formData: BusinessDetailsFormData = {
      yearsInBusiness: localYearsInBusiness,
      cuisines: localCuisines,
      specializations: localSpecializations,
      dietTypes: localDietTypes,
      capacityRange: localCapacityRange,
      baseCity: localBaseCity,
    };
    onFormDataChange(formData, isFormValid);
  }, [
    localYearsInBusiness,
    localCuisines,
    localSpecializations,
    localDietTypes,
    localCapacityRange,
    localBaseCity,
    isFormValid,
    onFormDataChange,
  ]);

  // Handle cuisine toggle
  const handleCuisineToggle = (cuisineId: string) => {
    setLocalCuisines((prev) =>
      prev.includes(cuisineId) ? prev.filter((id) => id !== cuisineId) : [...prev, cuisineId]
    );
  };

  // Handle specialization toggle
  const handleSpecializationToggle = (specializationId: string) => {
    setLocalSpecializations((prev) =>
      prev.includes(specializationId)
        ? prev.filter((id) => id !== specializationId)
        : [...prev, specializationId]
    );
  };

  // Handle diet type toggle
  const handleDietTypeToggle = (dietTypeId: string) => {
    setLocalDietTypes((prev) =>
      prev.includes(dietTypeId) ? prev.filter((id) => id !== dietTypeId) : [...prev, dietTypeId]
    );
  };

  // Handle continue button - only enabled if form is valid
  const handleContinue = () => {
    if (isFormValid) {
      // Parent will handle navigation
      // The callback already passed the valid data
    }
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Showcase Your Expertise</h1>
        <p style={styles.subtitle}>
          Share your culinary specialties, dietary offerings, and service capacity. This helps us
          match you with the perfect events and clients who appreciate your unique skills.
        </p>
      </div>

      <div style={styles.profileForm}>
        {/* Years in Business */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Years of Catering Experience *</label>
          <select
            value={localYearsInBusiness}
            onChange={(e) => setLocalYearsInBusiness(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            required
          >
            <option value="">Select your experience level</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="more-than-10">More than 10 years</option>
          </select>
          <p style={styles.helpText}>
            Your experience helps clients understand your expertise level
          </p>
        </div>

        {/* Cuisines - Multi Select */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Cuisines You Specialize In * <span style={{ fontSize: '0.875rem', color: '#666' }}>
              (Select at least 1)
            </span>
          </label>
          <p style={styles.helpText}>
            Choose all the cuisines you can prepare. This helps clients find caterers matching
            their food preferences.
          </p>
          <div style={styles.multiSelectGrid}>
            {cuisinesOnly.map((cuisine) => (
              <button
                key={cuisine.id}
                type="button"
                onClick={() => handleCuisineToggle(cuisine.id)}
                style={{
                  ...styles.multiSelectTag,
                  ...(localCuisines.includes(cuisine.id)
                    ? styles.multiSelectTagActive
                    : styles.multiSelectTagInactive),
                }}
                onMouseEnter={(e) => {
                  if (!localCuisines.includes(cuisine.id)) {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!localCuisines.includes(cuisine.id)) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
                disabled={isLoading}
              >
                {cuisine.label}
              </button>
            ))}
          </div>
          {localCuisines.length > 0 && (
            <p style={styles.selectedCount}>✓ {localCuisines.length} cuisine(s) selected</p>
          )}
        </div>

        {/* Specializations - Multi Select */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Special Services & Offerings{' '}
            <span style={{ fontSize: '0.875rem', color: '#666' }}>(Optional)</span>
          </label>
          <p style={styles.helpText}>
            Highlight any unique services like live cooking, themed menus, dietary customizations,
            or special event concepts.
          </p>
          <div style={styles.multiSelectGrid}>
            {specializationsOnly.map((specialization) => (
              <button
                key={specialization.id}
                type="button"
                onClick={() => handleSpecializationToggle(specialization.id)}
                style={{
                  ...styles.multiSelectTag,
                  ...(localSpecializations.includes(specialization.id)
                    ? styles.multiSelectTagActive
                    : styles.multiSelectTagInactive),
                }}
                onMouseEnter={(e) => {
                  if (!localSpecializations.includes(specialization.id)) {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!localSpecializations.includes(specialization.id)) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
                disabled={isLoading}
              >
                {specialization.label}
              </button>
            ))}
          </div>
          {localSpecializations.length > 0 && (
            <p style={styles.selectedCount}>
              ✓ {localSpecializations.length} service(s) selected
            </p>
          )}
        </div>

        {/* Diet Types - Multi Select */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Dietary Options You Offer * <span style={{ fontSize: '0.875rem', color: '#666' }}>
              (Select at least 1)
            </span>
          </label>
          <p style={styles.helpText}>
            Choose all dietary preferences you can accommodate (vegetarian, vegan, gluten-free,
            etc.). This expands your client base.
          </p>
          <div style={styles.multiSelectGrid}>
            {dietTypesList.map((dietType) => (
              <button
                key={dietType.id}
                type="button"
                onClick={() => handleDietTypeToggle(dietType.id)}
                style={{
                  ...styles.multiSelectTag,
                  ...(localDietTypes.includes(dietType.id)
                    ? styles.multiSelectTagActive
                    : styles.multiSelectTagInactive),
                }}
                onMouseEnter={(e) => {
                  if (!localDietTypes.includes(dietType.id)) {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!localDietTypes.includes(dietType.id)) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
                disabled={isLoading}
              >
                {dietType.label}
              </button>
            ))}
          </div>
          {localDietTypes.length > 0 && (
            <p style={styles.selectedCount}>✓ {localDietTypes.length} option(s) selected</p>
          )}
        </div>

        {/* Capacity Range */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Maximum Guest Capacity *</label>
          <select
            value={localCapacityRange}
            onChange={(e) => setLocalCapacityRange(e.target.value)}
            style={styles.input}
            disabled={isLoading || capacityRangesList.length === 0}
            required
          >
            <option value="">Select your serving capacity</option>
            {capacityRangesList.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
          <p style={styles.helpText}>
            This is the maximum number of guests you can comfortably serve at once. Clients will
            search for caterers based on their event size.
          </p>
        </div>

        {/* Base City */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Primary Service City *</label>
          <select
            value={localBaseCity}
            onChange={(e) => setLocalBaseCity(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            required
          >
            <option value="">Select your primary city</option>
            {citiesList.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
          <p style={styles.helpText}>
            Choose the city where you're primarily based. You can expand to additional cities
            later. Clients will see you based on their event location.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
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
          {isLoading ? 'Saving...' : 'Continue'}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          style={styles.backButton}
        >
          Back
        </button>
      </div>
    </>
  );
}