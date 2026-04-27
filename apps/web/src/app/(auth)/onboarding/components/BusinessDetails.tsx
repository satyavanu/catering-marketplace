'use client';

import React, { useMemo, useState } from 'react';
import type { BusinessDetailsData, StepComponentProps } from '../types';
import type { OnboardingMasterData } from '@catering-marketplace/query-client';

type MasterOption = {
  id: string;
  key: string;
  label: string;
  type?: 'cuisine' | 'specialization';
  category?: string;
};

interface BusinessDetailsProps
  extends StepComponentProps<BusinessDetailsData> {
  masterData?: OnboardingMasterData;
}

const DEFAULT_DATA: BusinessDetailsData = {
  businessTypeIds: [],
  cuisineIds: [],
  eventTypeIds: [],
  dietTypeIds: [],
  serviceStyleIds: [],
};

export default function BusinessDetails({
  initialData,
  onSubmitForm,
  onBack,
  isLoading = false,
  error,
  masterData,
}: BusinessDetailsProps) {
  const [formData, setFormData] = useState<BusinessDetailsData>({
    ...DEFAULT_DATA,
    ...initialData,
  });

  const businessTypes = masterData?.business_types || [];
  const eventTypes = masterData?.event_types || [];
  const cuisines = masterData?.cuisines || [];
  const dietTypes = masterData?.diet_types || [];
  const serviceStyles = masterData?.service_styles || [];

  const cuisinesOnly = cuisines.filter((item) => item.type === 'cuisine');
  const specializationsOnly = cuisines.filter(
    (item) => item.type === 'specialization'
  );

  const eventsByCategory = useMemo(() => {
    return eventTypes.reduce<Record<string, typeof eventTypes>>((acc, item) => {
      const category = item.category || 'other';
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [eventTypes]);

  const isFormValid = useMemo(() => {
    return (
      formData.businessTypeIds.length > 0 &&
      formData.cuisineIds.length > 0 &&
      formData.eventTypeIds.length > 0 &&
      formData.dietTypeIds.length > 0 &&
      formData.serviceStyleIds.length > 0
    );
  }, [formData]);

  const toggleValue = <K extends keyof BusinessDetailsData>(
    field: K,
    value: string
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field] as string[];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [field]: nextValues,
      };
    });
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;
    await onSubmitForm(formData);
  };

  const renderOptionGrid = (
    options: MasterOption[],
    selectedIds: string[],
    field: keyof BusinessDetailsData,
    emptyText: string
  ) => {
    if (!options.length) {
      return <p style={styles.helperText}>{emptyText}</p>;
    }

    return (
      <div style={styles.optionGrid}>
        {options.map((option) => {
          const selected = selectedIds.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              disabled={isLoading}
              onClick={() => toggleValue(field, option.id)}
              style={{
                ...styles.optionButton,
                ...(selected ? styles.optionButtonSelected : {}),
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>Business Details</h1>
        <p style={styles.subtitle}>
          Choose the services, food categories, and event types you can support.
        </p>
      </div>

      <div style={styles.form}>
        <section style={styles.section}>
          <label style={styles.label}>Business types</label>
          <p style={styles.helperText}>
            Select all formats that match your work.
          </p>

          {renderOptionGrid(
            businessTypes,
            formData.businessTypeIds,
            'businessTypeIds',
            'No business types available.'
          )}

          <SelectionCount count={formData.businessTypeIds.length} />
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Cuisines</label>
          <p style={styles.helperText}>
            Select the cuisines you regularly prepare.
          </p>

          {renderOptionGrid(
            cuisinesOnly,
            formData.cuisineIds,
            'cuisineIds',
            'No cuisines available.'
          )}

          <SelectionCount count={formData.cuisineIds.length} />
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Specializations</label>
          <p style={styles.helperText}>
            Optional: select any special food categories or signature offerings.
          </p>

          {renderOptionGrid(
            specializationsOnly,
            formData.cuisineIds,
            'cuisineIds',
            'No specializations available.'
          )}
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Dietary options</label>
          <p style={styles.helperText}>
            Select dietary preferences you can safely support.
          </p>

          {renderOptionGrid(
            dietTypes,
            formData.dietTypeIds,
            'dietTypeIds',
            'No diet types available.'
          )}

          <SelectionCount count={formData.dietTypeIds.length} />
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Event types</label>
          <p style={styles.helperText}>
            Select the event categories you can handle.
          </p>

          {Object.entries(eventsByCategory).map(([category, items]) => (
            <div key={category} style={styles.categoryBlock}>
              <h3 style={styles.categoryTitle}>{formatCategory(category)}</h3>

              {renderOptionGrid(
                items,
                formData.eventTypeIds,
                'eventTypeIds',
                'No event types available.'
              )}
            </div>
          ))}

          <SelectionCount count={formData.eventTypeIds.length} />
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Service styles</label>
          <p style={styles.helperText}>
            Select how you can serve customers.
          </p>

          {renderOptionGrid(
            serviceStyles,
            formData.serviceStyleIds,
            'serviceStyleIds',
            'No service styles available.'
          )}

          <SelectionCount count={formData.serviceStyleIds.length} />
        </section>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            style={{
              ...styles.primaryButton,
              ...(!isFormValid || isLoading ? styles.disabledButton : {}),
            }}
          >
            {isLoading ? 'Saving...' : 'Save and Continue'}
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
    </div>
  );
}

function SelectionCount({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <p style={styles.selectionCount}>
      {count} selected
    </p>
  );
}

function formatCategory(category: string) {
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '820px',
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
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  section: {
    padding: '1.25rem',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
  },

  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '0.35rem',
  },

  helperText: {
    margin: '0 0 1rem 0',
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },

  optionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },

  optionButton: {
    padding: '0.75rem 1rem',
    borderRadius: '999px',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
  },

  optionButtonSelected: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
    color: '#c2410c',
  },

  categoryBlock: {
    marginTop: '1rem',
  },

  categoryTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#374151',
  },

  selectionCount: {
    margin: '0.875rem 0 0 0',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#16a34a',
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

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
};