'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Info } from 'lucide-react'; // Added Check and Info for consistent feedback
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
  error: string; // This passed error can be used for server-side or global errors
  onFormDataChange: (formData: BusinessDetailsFormData, isValid: boolean) => void;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties }; // Base styles passed from parent
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
  error: globalError, // Renamed to avoid conflict with local formError
  onFormDataChange,
  onBack,
  styles, // Base component styles
  masterData,
}: BusinessDetailsProps) {
  // Local state for form fields
  const [localYearsInBusiness, setLocalYearsInBusiness] = useState(yearsInBusiness);
  const [localCuisines, setLocalCuisines] = useState<string[]>(cuisines);
  const [localSpecializations, setLocalSpecializations] = useState<string[]>(specializations);
  const [localDietTypes, setLocalDietTypes] = useState<string[]>(dietTypes);
  const [localCapacityRange, setLocalCapacityRange] = useState(capacityRange);
  const [localBaseCity, setLocalBaseCity] = useState(baseCity);

  // Validation state variables
  const [yearsInBusinessError, setYearsInBusinessError] = useState(false);
  const [cuisinesError, setCuisinesError] = useState(false);
  // specializations are optional, so no error state for them
  const [dietTypesError, setDietTypesError] = useState(false);
  const [capacityRangeError, setCapacityRangeError] = useState(false);
  const [baseCityError, setBaseCityError] = useState(false);
  const [formError, setFormError] = useState(''); // For general form submission errors

  // Get data from master data props
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

  // Form validation logic, runs on state changes
  const isFormValid = React.useMemo(() => {
    return !!(
      localYearsInBusiness.trim() &&
      (localCuisines.length > 0 || localSpecializations.length > 0) && // At least one cuisine OR specialization
      localDietTypes.length > 0 &&
      localCapacityRange.trim() &&
      localBaseCity.trim()
    );
  }, [
    localYearsInBusiness,
    localCuisines,
    localSpecializations,
    localDietTypes,
    localCapacityRange,
    localBaseCity,
  ]);

  // Pass form data and validity back to parent whenever local state changes
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

    // Clear specific errors if input becomes valid
    if (localYearsInBusiness.trim()) setYearsInBusinessError(false);
    if (localCuisines.length > 0 || localSpecializations.length > 0) setCuisinesError(false);
    if (localDietTypes.length > 0) setDietTypesError(false);
    if (localCapacityRange.trim()) setCapacityRangeError(false);
    if (localBaseCity.trim()) setBaseCityError(false);

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
    setCuisinesError(false); // Clear error on interaction
  };

  // Handle specialization toggle
  const handleSpecializationToggle = (specializationId: string) => {
    setLocalSpecializations((prev) =>
      prev.includes(specializationId)
        ? prev.filter((id) => id !== specializationId)
        : [...prev, specializationId]
    );
    // Note: specializations are optional, no error to clear
  };

  // Handle diet type toggle
  const handleDietTypeToggle = (dietTypeId: string) => {
    setLocalDietTypes((prev) =>
      prev.includes(dietTypeId) ? prev.filter((id) => id !== dietTypeId) : [...prev, dietTypeId]
    );
    setDietTypesError(false); // Clear error on interaction
  };

  // Handle continue button click
  const handleContinue = () => {
    // Manually trigger validation for immediate feedback
    const yearsValid = localYearsInBusiness.trim() !== '';
    const cuisinesOrSpecializationsValid = (localCuisines.length > 0 || localSpecializations.length > 0);
    const dietTypesValid = localDietTypes.length > 0;
    const capacityValid = localCapacityRange.trim() !== '';
    const cityValid = localBaseCity.trim() !== '';

    setYearsInBusinessError(!yearsValid);
    setCuisinesError(!cuisinesOrSpecializationsValid);
    setDietTypesError(!dietTypesValid);
    setCapacityRangeError(!capacityValid);
    setBaseCityError(!cityValid);

    if (isFormValid) {
      setFormError(''); // Clear any generic form errors
      onFormDataChange({
        yearsInBusiness: localYearsInBusiness,
        cuisines: localCuisines,
        specializations: localSpecializations,
        dietTypes: localDietTypes,
        capacityRange: localCapacityRange,
        baseCity: localBaseCity,
      }, true);
      // Parent will handle navigation to the next step
    } else {
      setFormError('Please correct the highlighted fields before continuing.');
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

      <div style={styles.profileForm}> {/* Using a div here, form doesn't actually submit */}
        {/* Years in Business */}
        <div style={profileStyles.stepSection}>
          <label style={styles.label}>Years of Catering Experience *</label>
          <select
            value={localYearsInBusiness}
            onChange={(e) => {
              setLocalYearsInBusiness(e.target.value);
              setYearsInBusinessError(false);
            }}
            onBlur={() => setYearsInBusinessError(localYearsInBusiness.trim() === '')}
            style={{
              ...styles.input,
              borderColor: yearsInBusinessError ? '#ef4444' : styles.input.borderColor,
            }}
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
          {yearsInBusinessError && (
             <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please select your years of experience.
             </p>
          )}
        </div>

        {/* Cuisines - Multi Select */}
        <div style={profileStyles.stepSection}>
          <label style={styles.label}>
            Cuisines You Specialize In * <span style={{ fontSize: '0.875rem', color: '#666' }}>
              (Select at least 1)
            </span>
          </label>
          <p style={styles.helpText}>
            Choose all the cuisines you can prepare. This helps clients find caterers matching
            their food preferences.
          </p>
          <div style={profileStyles.categoryGrid}>
            {cuisinesOnly.map((cuisine) => (
              <button
                key={cuisine.id}
                type="button"
                onClick={() => handleCuisineToggle(cuisine.id)}
                style={{
                  ...profileStyles.tagButton,
                  ...(localCuisines.includes(cuisine.id)
                    ? profileStyles.tagButtonActive
                    : profileStyles.tagButtonInactive),
                  ...(cuisinesError && profileStyles.tagErrorOutline),
                  ...(!isLoading && {
                    ':hover': profileStyles.tagButtonHover,
                  }),
                }}
                disabled={isLoading}
              >
                {localCuisines.includes(cuisine.id) && (
                  <Check size={14} style={{ marginRight: '0.5rem' }} />
                )}
                {cuisine.label}
              </button>
            ))}
          </div>
          {(localCuisines.length > 0 || localSpecializations.length > 0) && (
            <p style={profileStyles.selectionSummary}>
              <Check size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> {localCuisines.length + localSpecializations.length} specialisation(s) selected
            </p>
          )}
          {cuisinesError && (
             <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please select at least one cuisine or specialization.
             </p>
          )}
        </div>

        {/* Specializations - Multi Select */}
        <div style={profileStyles.stepSection}>
          <label style={styles.label}>
            Special Services & Offerings{' '}
            <span style={{ fontSize: '0.875rem', color: '#666' }}>(Optional)</span>
          </label>
          <p style={styles.helpText}>
            Highlight any unique services like live cooking, themed menus, dietary customizations,
            or special event concepts.
          </p>
          <div style={profileStyles.categoryGrid}>
            {specializationsOnly.map((specialization) => (
              <button
                key={specialization.id}
                type="button"
                onClick={() => handleSpecializationToggle(specialization.id)}
                style={{
                  ...profileStyles.tagButton,
                  ...(localSpecializations.includes(specialization.id)
                    ? profileStyles.tagButtonActive
                    : profileStyles.tagButtonInactive),
                  ...(!isLoading && {
                    ':hover': profileStyles.tagButtonHover,
                  }),
                }}
                disabled={isLoading}
              >
                {localSpecializations.includes(specialization.id) && (
                  <Check size={14} style={{ marginRight: '0.5rem' }} />
                )}
                {specialization.label}
              </button>
            ))}
          </div>
          {localSpecializations.length > 0 && (
            <p style={profileStyles.selectionSummary}>
              <Check size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> {localSpecializations.length} service(s) selected
            </p>
          )}
        </div>

        {/* Diet Types - Multi Select */}
        <div style={profileStyles.stepSection}>
          <label style={styles.label}>
            Dietary Options You Offer * <span style={{ fontSize: '0.875rem', color: '#666' }}>
              (Select at least 1)
            </span>
          </label>
          <p style={styles.helpText}>
            Choose all dietary preferences you can accommodate (vegetarian, vegan, gluten-free,
            etc.). This expands your client base.
          </p>
          <div style={profileStyles.categoryGrid}>
            {dietTypesList.map((dietType) => (
              <button
                key={dietType.id}
                type="button"
                onClick={() => handleDietTypeToggle(dietType.id)}
                style={{
                  ...profileStyles.tagButton,
                  ...(localDietTypes.includes(dietType.id)
                    ? profileStyles.tagButtonActive
                    : profileStyles.tagButtonInactive),
                  ...(dietTypesError && profileStyles.tagErrorOutline),
                  ...(!isLoading && {
                    ':hover': profileStyles.tagButtonHover,
                  }),
                }}
                disabled={isLoading}
              >
                {localDietTypes.includes(dietType.id) && (
                  <Check size={14} style={{ marginRight: '0.5rem' }} />
                )}
                {dietType.label}
              </button>
            ))}
          </div>
          {localDietTypes.length > 0 && (
            <p style={profileStyles.selectionSummary}>
              <Check size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> {localDietTypes.length} option(s) selected
            </p>
          )}
          {dietTypesError && (
             <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please select at least one dietary option.
             </p>
          )}
        </div>

        {/* Capacity Range */}
        <div style={profileStyles.stepSection}>
          <label style={styles.label}>Maximum Guest Capacity *</label>
          <select
            value={localCapacityRange}
            onChange={(e) => {
              setLocalCapacityRange(e.target.value);
              setCapacityRangeError(false);
            }}
            onBlur={() => setCapacityRangeError(localCapacityRange.trim() === '')}
            style={{
              ...styles.input,
              borderColor: capacityRangeError ? '#ef4444' : styles.input.borderColor,
            }}
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
          {capacityRangeError && (
             <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please select your maximum guest capacity.
             </p>
          )}
        </div>

        {/* Base City */}
        <div style={profileStyles.stepSection}>
          <label style={styles.label}>Primary Service City *</label>
          <select
            value={localBaseCity}
            onChange={(e) => {
              setLocalBaseCity(e.target.value);
              setBaseCityError(false);
            }}
            onBlur={() => setBaseCityError(localBaseCity.trim() === '')}
            style={{
              ...styles.input,
              borderColor: baseCityError ? '#ef4444' : styles.input.borderColor,
            }}
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
          {baseCityError && (
             <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please select your primary service city.
             </p>
          )}
        </div>

        {/* Global Error Message from props or local form error */}
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
            style={{
              ...styles.submitButton, // Using parent's submit button base style
              ...(!isFormValid && { opacity: 0.6, cursor: 'not-allowed' }),
              ...(isLoading && { opacity: 0.6, cursor: 'not-allowed' }),
              position: 'relative', // For spinner
              ...styles.backButton, // Specific styles for back button
            }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isLoading || !isFormValid}
            style={{
              ...styles.submitButton, // Using parent's submit button base style
              ...(!isFormValid && { opacity: 0.6, cursor: 'not-allowed' }),
              ...(isLoading && { opacity: 0.6, cursor: 'not-allowed' }),
              position: 'relative', // For spinner
            }}
          >
            {isLoading ? (
              <>
                <span style={profileStyles.spinner}></span>
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// Additional styles for a professional and modern look
const profileStyles: { [key: string]: React.CSSProperties } = {
  stepSection: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    position: 'relative', // For absolute positioning of error icons if needed
  },

  // Reusing validationError from previous component
  validationError: {
    fontSize: '0.85rem',
    color: '#ef4444',
    margin: '0.5rem 0 0 0', // Adjusted margin for inline errors
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
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
  },

  // Styles for Multi-Select Tags (Cuisines, Specializations, Diet Types)
  categoryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '0.5rem', // Slightly less margin than main form groups
    marginBottom: '1rem', // Space before summary/error
  },

  tagButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    borderRadius: '9999px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb', // Very light gray for inactive
    color: '#374151',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)', // Subtle shadow
  },

  tagButtonActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
    color: '#3730a3',
    boxShadow: '0 2px 5px rgba(79, 70, 229, 0.1)',
  },

  tagButtonInactive: {
    // Already defined in tagButton, keeping it explicit for clarity
  },

  tagButtonHover: { // For standard inline styling, you'd use onMouseEnter/onMouseLeave
    borderColor: '#93c5fd', // Lighter blue on hover
    backgroundColor: '#e0f2fe', // Even lighter background on hover
    color: '#2563eb', // Deeper blue text
    boxShadow: '0 2px 5px rgba(37, 99, 235, 0.08)',
  },

  tagErrorOutline: {
    border: '1px solid #ef4444', // Red border for unselected tags in an invalid section
    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)', // Red glow
  },

  selectionSummary: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0.5rem', // Closer to the tags
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#10b981',
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
  // Keyframes for spin animation should be in a global CSS file or equivalent:
  // @keyframes spin {
  //   from { transform: rotate(0deg); }
  //   to { transform: rotate(360deg); }
  // }

  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2.5rem',
    gap: '1rem',
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
    flex: '1',
  }
};
