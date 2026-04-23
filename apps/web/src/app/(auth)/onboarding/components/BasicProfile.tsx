'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

type PartnerType = 'individual' | 'business' | null;

interface BusinessType {
  id: string;
  key: string;
  label: string;
}

interface EventTypeData {
  id: string;
  key: string;
  label: string;
  category: 'personal' | 'wedding' | 'corporate' | 'cultural' | 'special';
}

interface BasicProfileFormData {
  fullName: string;
  partnerType: PartnerType;
  businessName: string;
  businessType: string[];
  eventsHandled: string[];
}

interface BasicProfileProps {
  fullName: string;
  partnerType: PartnerType;
  businessName: string;
  businessType: string[];
  eventsHandled: string[];
  isLoading: boolean;
  error: string;
  onFormDataChange: (formData: BasicProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  styles: { [key: string]: React.CSSProperties };
  businessTypes: BusinessType[];
  eventTypes: EventTypeData[];
}

export default function BasicProfile({
  fullName,
  partnerType,
  businessName,
  businessType,
  eventsHandled,
  isLoading,
  error,
  onFormDataChange,
  onSubmit,
  styles,
  businessTypes,
  eventTypes,
}: BasicProfileProps) {
  // Local state for form data
  const [localFullName, setLocalFullName] = useState(fullName);
  const [localPartnerType, setLocalPartnerType] = useState<PartnerType>(partnerType);
  const [localBusinessName, setLocalBusinessName] = useState(businessName);
  const [localBusinessType, setLocalBusinessType] = useState<string[]>(businessType);
  const [localEventsHandled, setLocalEventsHandled] = useState<string[]>(eventsHandled);

  // Form validation
  const isFormValid =
    localFullName.trim().length > 0 &&
    localPartnerType !== null &&
    (localPartnerType === 'individual' || localBusinessName.trim().length > 0) &&
    localBusinessType.length >= 1 &&
    localEventsHandled.length >= 1;

  // Group events by category
  const eventsByCategory = eventTypes.reduce(
    (acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    },
    {} as Record<string, EventTypeData[]>
  );

  const categoryOrder = ['personal', 'wedding', 'corporate', 'cultural', 'special'];

  // Pass form data back to parent whenever it changes
  useEffect(() => {
    onFormDataChange({
      fullName: localFullName,
      partnerType: localPartnerType,
      businessName: localBusinessName,
      businessType: localBusinessType,
      eventsHandled: localEventsHandled,
    });
  }, [
    localFullName,
    localPartnerType,
    localBusinessName,
    localBusinessType,
    localEventsHandled,
    onFormDataChange,
  ]);

  // Handle business type toggle
  const handleBusinessTypeToggle = (typeId: string) => {
    setLocalBusinessType((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  // Handle event toggle
  const handleEventToggle = (eventId: string) => {
    setLocalEventsHandled((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Create Your Catering Profile</h1>
        <p style={styles.subtitle}>
          Let us know more about your business and the services you offer. This will help us
          showcase your expertise to potential clients.
        </p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        {/* Step 1: Full Name */}
        <div style={profileStyles.stepSection}>
          <div style={profileStyles.stepHeader}>
            <h2 style={profileStyles.stepTitle}>Step 1 — Tell Us Your Name</h2>
            <span style={profileStyles.stepNumber}>1</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              value={localFullName}
              onChange={(e) => {
                if (e.target.value.length <= 255) setLocalFullName(e.target.value);
              }}
              placeholder="Enter your full name"
              style={styles.input}
              disabled={isLoading}
              required
            />
            <p style={styles.charCounter}>{localFullName.length}/255</p>
          </div>
        </div>

        {/* Step 2: What Are You? */}
        <div style={profileStyles.stepSection}>
          <div style={profileStyles.stepHeader}>
            <h2 style={profileStyles.stepTitle}>Step 2 — What Are You?</h2>
            <span style={profileStyles.stepNumber}>2</span>
          </div>

          <div style={styles.formGroup}>
            <p style={styles.helpText}>
              Choose the option that best describes your business
            </p>

            <div style={profileStyles.partnerTypeGrid}>
              {/* Individual / Home Chef Option */}
              <button
                type="button"
                onClick={() => {
                  setLocalPartnerType('individual');
                  setLocalBusinessName(localFullName); // Auto-fill with full name
                }}
                style={{
                  ...profileStyles.partnerTypeCard,
                  ...(localPartnerType === 'individual'
                    ? profileStyles.partnerTypeCardActive
                    : profileStyles.partnerTypeCardInactive),
                }}
                disabled={isLoading}
              >
                <div style={profileStyles.partnerTypeIcon}>🏠</div>
                <div style={profileStyles.partnerTypeContent}>
                  <h3 style={profileStyles.partnerTypeTitle}>Individual / Home Chef</h3>
                  <p style={profileStyles.partnerTypeDescription}>
                    Operating from home as a solo chef or home-based caterer
                  </p>
                </div>
                {localPartnerType === 'individual' && (
                  <div style={profileStyles.checkmark}>✓</div>
                )}
              </button>

              {/* Business / Catering Company Option */}
              <button
                type="button"
                onClick={() => setLocalPartnerType('business')}
                style={{
                  ...profileStyles.partnerTypeCard,
                  ...(localPartnerType === 'business'
                    ? profileStyles.partnerTypeCardActive
                    : profileStyles.partnerTypeCardInactive),
                }}
                disabled={isLoading}
              >
                <div style={profileStyles.partnerTypeIcon}>🏢</div>
                <div style={profileStyles.partnerTypeContent}>
                  <h3 style={profileStyles.partnerTypeTitle}>Business / Catering Company</h3>
                  <p style={profileStyles.partnerTypeDescription}>
                    Registered business with team, kitchen facilities, or commercial setup
                  </p>
                </div>
                {localPartnerType === 'business' && (
                  <div style={profileStyles.checkmark}>✓</div>
                )}
              </button>
            </div>

            {!localPartnerType && (
              <p style={profileStyles.validationError}>
                ⚠️ Please select your partner type to continue
              </p>
            )}
          </div>
        </div>

        {/* Step 3: Business Name (Conditional) */}
        {localPartnerType && (
          <div style={profileStyles.stepSection}>
            <div style={profileStyles.stepHeader}>
              <h2 style={profileStyles.stepTitle}>
                Step 3 — {localPartnerType === 'individual' ? 'Your Brand Name' : 'Business Name'}
              </h2>
              <span style={profileStyles.stepNumber}>3</span>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {localPartnerType === 'individual' ? 'Brand / Chef Name' : 'Business Name'} *
              </label>
              <p style={styles.helpText}>
                {localPartnerType === 'individual'
                  ? 'How would you like customers to know you?'
                  : 'The official name of your catering business'}
              </p>
              <input
                type="text"
                value={localBusinessName}
                onChange={(e) => {
                  if (e.target.value.length <= 255) setLocalBusinessName(e.target.value);
                }}
                placeholder={
                  localPartnerType === 'individual'
                    ? 'e.g., "Chef Priya\'s Kitchen"'
                    : 'e.g., "Droooly Catering Co."'
                }
                style={styles.input}
                disabled={isLoading}
                required
              />
              <p style={styles.charCounter}>{localBusinessName.length}/255</p>

              {localPartnerType === 'individual' && (
                <p style={profileStyles.infoNote}>
                  💡 Tip: Use your name or a catchy brand name that customers will remember.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Business Type - Multiple Selection */}
        {localPartnerType && (
          <div style={profileStyles.stepSection}>
            <div style={profileStyles.stepHeader}>
              <h2 style={profileStyles.stepTitle}>Step 4 — Business Type(s)</h2>
              <span style={profileStyles.stepNumber}>4</span>
            </div>

            <div style={styles.formGroup}>
              <p style={styles.helpText}>
                Select one or more business types that match your services
              </p>
              <div style={styles.businessTypeGrid}>
                {businessTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleBusinessTypeToggle(type.id)}
                    style={{
                      ...styles.businessTypeTag,
                      ...(localBusinessType.includes(type.id)
                        ? styles.businessTypeTag
                        : styles.businessTypeTagInactive),
                    }}
                    disabled={isLoading}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {localBusinessType.length > 0 && (
                <p style={styles.selectedCount}>
                  ✓ {localBusinessType.length} business type(s) selected
                </p>
              )}
              {localBusinessType.length === 0 && (
                <p style={profileStyles.validationError}>
                  ⚠️ Please select at least one business type
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Events You Handle - Multiple Selection */}
        {localPartnerType && (
          <div style={profileStyles.stepSection}>
            <div style={profileStyles.stepHeader}>
              <h2 style={profileStyles.stepTitle}>Step 5 — Events You Handle</h2>
              <span style={profileStyles.stepNumber}>5</span>
            </div>

            <div style={styles.formGroup}>
              <p style={styles.helpText}>
                Select one or more event types you can cater for
              </p>

              {categoryOrder.map((category) => {
                const eventsInCategory = eventsByCategory[category] || [];
                if (eventsInCategory.length === 0) return null;

                return (
                  <div key={category} style={styles.categorySection}>
                    <h3 style={styles.categoryTitle}>
                      {category.charAt(0).toUpperCase() + category.slice(1)} Events
                    </h3>
                    <div style={styles.eventGrid}>
                      {eventsInCategory.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => handleEventToggle(event.id)}
                          style={{
                            ...styles.eventTag,
                            ...(localEventsHandled.includes(event.id)
                              ? styles.eventTagActive
                              : styles.eventTagInactive),
                          }}
                          disabled={isLoading}
                        >
                          {event.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {localEventsHandled.length > 0 && (
                <p style={styles.selectedCount}>
                  ✓ {localEventsHandled.length} event type(s) selected
                </p>
              )}
              {localEventsHandled.length === 0 && (
                <p style={profileStyles.validationError}>
                  ⚠️ Please select at least one event type
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          style={{
            ...styles.submitButton,
            opacity: isLoading || !isFormValid ? 0.6 : 1,
            cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Saving...' : 'Continue to Next Step'}
        </button>
      </form>
    </>
  );
}

// Additional styles for partner type selection
const profileStyles: { [key: string]: React.CSSProperties } = {
  stepSection: {
    marginBottom: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,

  stepHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  } as React.CSSProperties,

  stepNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '50%',
    fontSize: '0.9rem',
    fontWeight: '700',
  } as React.CSSProperties,

  partnerTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.25rem',
    marginTop: '1rem',
  } as React.CSSProperties,

  partnerTypeCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    textAlign: 'left',
  } as React.CSSProperties,

  partnerTypeCardActive: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
  } as React.CSSProperties,

  partnerTypeCardInactive: {
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  } as React.CSSProperties,

  partnerTypeIcon: {
    fontSize: '2rem',
    lineHeight: '1',
    flexShrink: 0,
  } as React.CSSProperties,

  partnerTypeContent: {
    flex: 1,
  } as React.CSSProperties,

  partnerTypeTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  partnerTypeDescription: {
    fontSize: '0.85rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  } as React.CSSProperties,

  checkmark: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    fontSize: '1.2rem',
    fontWeight: '700',
  } as React.CSSProperties,

  validationError: {
    fontSize: '0.85rem',
    color: '#dc2626',
    margin: '1rem 0 0 0',
    fontWeight: '500',
  } as React.CSSProperties,

  infoNote: {
    fontSize: '0.85rem',
    color: '#0284c7',
    margin: '0.75rem 0 0 0',
    fontStyle: 'italic',
    padding: '0.75rem',
    backgroundColor: '#eff6ff',
    borderRadius: '0.375rem',
    border: '1px solid #bfdbfe',
  } as React.CSSProperties,
};