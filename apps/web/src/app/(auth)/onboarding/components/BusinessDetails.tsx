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

interface BusinessDetailsProps extends StepComponentProps<BusinessDetailsData> {
  masterData?: OnboardingMasterData;
}

const DEFAULT_DATA: BusinessDetailsData = {
  businessTypeIds: [],
  cuisineIds: [],
  eventTypeIds: [],
  dietTypeIds: [],
  serviceStyleIds: [],
};

type SectionKey =
  | 'businessTypeIds'
  | 'cuisineIds'
  | 'dietTypeIds'
  | 'eventTypeIds'
  | 'serviceStyleIds';

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

  const [openSection, setOpenSection] = useState<SectionKey>('businessTypeIds');
  const [search, setSearch] = useState<Record<string, string>>({});

  const businessTypes = masterData?.business_types || [];
  const eventTypes = masterData?.event_types || [];
  const cuisines = masterData?.cuisines || [];
  const dietTypes = masterData?.diet_types || [];
  const serviceStyles = masterData?.service_styles || [];

  const cuisinesOnly = cuisines.filter((item) => item.type === 'cuisine');
  const specializationsOnly = cuisines.filter(
    (item) => item.type === 'specialization'
  );

  const allCuisineOptions = [...cuisinesOnly, ...specializationsOnly];

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

  const renderOptions = (
    options: MasterOption[],
    selectedIds: string[],
    field: SectionKey,
    emptyText: string,
    searchable = false
  ) => {
    const query = search[field]?.toLowerCase() || '';

    const filteredOptions = searchable
      ? options.filter((option) => option.label.toLowerCase().includes(query))
      : options;

    if (!options.length) {
      return <p style={styles.helperText}>{emptyText}</p>;
    }

    return (
      <>
        {searchable && options.length > 8 && (
          <input
            value={search[field] || ''}
            onChange={(e) =>
              setSearch((prev) => ({
                ...prev,
                [field]: e.target.value,
              }))
            }
            placeholder="Search and select..."
            style={styles.searchInput}
          />
        )}

        <div style={styles.optionGrid}>
          {filteredOptions.map((option) => {
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
                {selected && <span style={styles.checkIcon}>✓</span>}
                {option.label}
              </button>
            );
          })}
        </div>

        {filteredOptions.length === 0 && (
          <p style={styles.helperText}>No matching options found.</p>
        )}
      </>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
      
        <h1 style={styles.title}>What do you offer?</h1>

        <p style={styles.subtitle}>
          Select your food services, cuisines, and customer serving style.
        </p>
      </div>

      <div style={styles.summaryBox}>
        <strong>Minimum requirement:</strong> select at least one option from
        each required section.
      </div>

      <div style={styles.form}>
        <SelectionSection
          title="Business types"
          required
          helper="Choose what best describes your work."
          count={formData.businessTypeIds.length}
          isOpen={openSection === 'businessTypeIds'}
          onToggle={() => setOpenSection('businessTypeIds')}
        >
          {renderOptions(
            businessTypes,
            formData.businessTypeIds,
            'businessTypeIds',
            'No business types available.'
          )}
        </SelectionSection>

        <SelectionSection
          title="Cuisines & specializations"
          required
          helper="Select cuisines and signature food categories you can prepare."
          count={formData.cuisineIds.length}
          isOpen={openSection === 'cuisineIds'}
          onToggle={() => setOpenSection('cuisineIds')}
        >
          {renderOptions(
            allCuisineOptions,
            formData.cuisineIds,
            'cuisineIds',
            'No cuisines available.',
            true
          )}
        </SelectionSection>

        <SelectionSection
          title="Dietary options"
          required
          helper="Select dietary preferences you can support safely."
          count={formData.dietTypeIds.length}
          isOpen={openSection === 'dietTypeIds'}
          onToggle={() => setOpenSection('dietTypeIds')}
        >
          {renderOptions(
            dietTypes,
            formData.dietTypeIds,
            'dietTypeIds',
            'No dietary options available.'
          )}
        </SelectionSection>

        <SelectionSection
          title="Event types"
          required
          helper="Choose the booking occasions you can handle."
          count={formData.eventTypeIds.length}
          isOpen={openSection === 'eventTypeIds'}
          onToggle={() => setOpenSection('eventTypeIds')}
        >
          {renderOptions(
            eventTypes,
            formData.eventTypeIds,
            'eventTypeIds',
            'No event types available.',
            true
          )}
        </SelectionSection>

        <SelectionSection
          title="Service styles"
          required
          helper="Select how you can serve customers."
          count={formData.serviceStyleIds.length}
          isOpen={openSection === 'serviceStyleIds'}
          onToggle={() => setOpenSection('serviceStyleIds')}
        >
          {renderOptions(
            serviceStyles,
            formData.serviceStyleIds,
            'serviceStyleIds',
            'No service styles available.'
          )}
        </SelectionSection>

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
            {isLoading ? 'Saving...' : 'Save and Continue'} →
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

function SelectionSection({
  title,
  helper,
  required,
  count,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  helper: string;
  required?: boolean;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section}>
      <button type="button" onClick={onToggle} style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>
            {title} {required && <span style={styles.required}>*</span>}
          </h2>

          <p style={styles.helperText}>
            {helper}{' '}
            {required && count === 0 && (
              <span style={styles.requiredText}>Select at least one.</span>
            )}
          </p>
        </div>

        <div style={styles.sectionRight}>
          <span
            style={{
              ...styles.countPill,
              ...(count > 0 ? styles.countPillActive : {}),
            }}
          >
            {count > 0 ? `${count} selected` : 'Required'}
          </span>

          <span style={styles.chevron}>{isOpen ? '−' : '+'}</span>
        </div>
      </button>

      {isOpen && <div style={styles.sectionBody}>{children}</div>}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: '820px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.5rem',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    boxShadow: '0 18px 45px rgba(17, 24, 39, 0.08)',
  },

  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },

  logoBadge: {
    width: 76,
    height: 76,
    margin: '0 auto 1rem',
    borderRadius: '999px',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(255, 75, 31, 0.12))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: 58,
    height: 58,
    objectFit: 'contain',
    borderRadius: '999px',
  },

  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.04em',
  },

  subtitle: {
    maxWidth: 460,
    margin: '0.6rem auto 0',
    fontSize: '0.95rem',
    color: '#6b7280',
    lineHeight: 1.55,
  },

  summaryBox: {
    padding: '0.95rem 1rem',
    marginBottom: '1.25rem',
    borderRadius: '1rem',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.07), rgba(255, 75, 31, 0.06))',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    color: '#374151',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  section: {
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  sectionHeader: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 900,
    color: '#111827',
  },

  sectionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    flexShrink: 0,
  },

  sectionBody: {
    padding: '0 1rem 1rem',
  },

  required: {
    color: '#ff4b1f',
  },

  requiredText: {
    color: '#ff4b1f',
    fontWeight: 800,
  },

  helperText: {
    margin: '0.35rem 0 0 0',
    fontSize: '0.84rem',
    color: '#6b7280',
    lineHeight: 1.45,
  },

  countPill: {
    padding: '0.35rem 0.65rem',
    borderRadius: '999px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    fontSize: '0.75rem',
    fontWeight: 900,
    whiteSpace: 'nowrap',
  },

  countPillActive: {
    backgroundColor: '#f5f3ff',
    color: '#7c3aed',
  },

  chevron: {
    width: 26,
    height: 26,
    borderRadius: '999px',
    backgroundColor: '#f9fafb',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7c3aed',
    fontWeight: 900,
    fontSize: '1.1rem',
  },

  searchInput: {
    width: '100%',
    padding: '0.85rem 1rem',
    marginBottom: '0.85rem',
    borderRadius: '0.85rem',
    border: '1.5px solid #e5e7eb',
    fontSize: '0.95rem',
    outline: 'none',
  },

  optionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.65rem',
  },

  optionButton: {
    padding: '0.7rem 0.95rem',
    borderRadius: '999px',
    border: '1.5px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '0.88rem',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },

  optionButtonSelected: {
    borderColor: '#7c3aed',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(255, 75, 31, 0.07))',
    color: '#5b21b6',
  },

  checkIcon: {
    width: 17,
    height: 17,
    borderRadius: '999px',
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.68rem',
    fontWeight: 900,
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
    borderRadius: '0.9rem',
    background: 'linear-gradient(135deg, #7c3aed 0%, #ff4b1f 100%)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 14px 28px rgba(124, 58, 237, 0.22)',
  },

  secondaryButton: {
    width: '100%',
    padding: '1rem',
    borderRadius: '0.9rem',
    border: '1.5px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
  },

  disabledButton: {
    background: '#d1d5db',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },

  error: {
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
};