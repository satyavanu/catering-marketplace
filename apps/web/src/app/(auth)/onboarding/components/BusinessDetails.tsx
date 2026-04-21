'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

type DietType = 'veg' | 'non-veg' | 'both';

interface BusinessDetailsProps {
  yearsInBusiness: string;
  cuisines: string[];
  dietType: DietType;
  capacity: string;
  baseCity: string;
  isLoading: boolean;
  error: string;
  onYearsChange: (value: string) => void;
  onCuisinesChange: (cuisine: string) => void;
  onDietTypeChange: (value: DietType) => void;
  onCapacityChange: (value: string) => void;
  onBaseCityChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
  allowedCities: Array<{ code: string; name: string }>;
}

const CUISINES = [
  'South Indian',
  'North Indian',
  'Chinese',
  'Continental',
  'Italian',
  'Mughlai',
  'Desserts',
  'Bakery',
  'Fusion',
  'Other',
];

export default function BusinessDetails({
  yearsInBusiness,
  cuisines,
  dietType,
  capacity,
  baseCity,
  isLoading,
  error,
  onYearsChange,
  onCuisinesChange,
  onDietTypeChange,
  onCapacityChange,
  onBaseCityChange,
  onSubmit,
  onBack,
  styles,
  allowedCities,
}: BusinessDetailsProps) {
  const isFormValid =
    yearsInBusiness &&
    cuisines.length > 0 &&
    capacity.trim() &&
    baseCity.trim();

  const handleCuisineChange = (cuisine: string) => {
    onCuisinesChange(cuisine);
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Business Details</h1>
        <p style={styles.subtitle}>Tell us more about your specializations</p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Years in Business *</label>
          <select
            value={yearsInBusiness}
            onChange={(e) => onYearsChange(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            required
          >
            <option value="">Select years</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="more-than-10">More than 10 years</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cuisines / Specializations *</label>
          <div style={styles.checkboxGroup}>
            {CUISINES.map((cuisine) => (
              <label key={cuisine} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={cuisines.includes(cuisine)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleCuisineChange(cuisine);
                    } else {
                      handleCuisineChange(cuisine);
                    }
                  }}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                {cuisine}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Diet Type *</label>
          <div style={styles.radioGroup}>
            {[
              { value: 'veg', label: 'Vegetarian' },
              { value: 'non-veg', label: 'Non-Vegetarian' },
              { value: 'both', label: 'Both' },
            ].map((diet) => (
              <label key={diet.value} style={styles.radioLabel}>
                <input
                  type="radio"
                  value={diet.value}
                  checked={dietType === diet.value}
                  onChange={(e) => onDietTypeChange(e.target.value as DietType)}
                  disabled={isLoading}
                  style={styles.radioInput}
                />
                {diet.label}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Approx Capacity (people) *</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => onCapacityChange(e.target.value)}
            placeholder="e.g., 50, 100, 500"
            style={styles.input}
            disabled={isLoading}
            min="1"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Base City *</label>
          <select
            value={baseCity}
            onChange={(e) => onBaseCityChange(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            required
          >
            <option value="">Select city</option>
            {allowedCities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
          <p style={styles.helpText}>Choose from our serviceable cities</p>
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
          {isLoading ? 'Saving...' : 'Continue'}
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