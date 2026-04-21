'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
  businessName: string;
  businessType: string[];
  eventsHandled: string[];
}

interface BasicProfileProps {
  fullName: string;
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
  const [localBusinessName, setLocalBusinessName] = useState(businessName);
  const [localBusinessType, setLocalBusinessType] = useState<string[]>(businessType);
  const [localEventsHandled, setLocalEventsHandled] = useState<string[]>(eventsHandled);

  // Form validation
  const isFormValid =
    localFullName.trim().length > 0 &&
    localBusinessName.trim().length > 0 &&
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
      businessName: localBusinessName,
      businessType: localBusinessType,
      eventsHandled: localEventsHandled,
    });
  }, [localFullName, localBusinessName, localBusinessType, localEventsHandled, onFormDataChange]);

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
        {/* Full Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            value={localFullName}
            onChange={(e) => {
              if (e.target.value.length <= 255) setLocalFullName(e.target.value);
            }}
            placeholder="Your full name"
            style={styles.input}
            disabled={isLoading}
            required
          />
          <p style={styles.charCounter}>{localFullName.length}/255</p>
        </div>

        {/* Business Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Business Name *</label>
          <input
            type="text"
            value={localBusinessName}
            onChange={(e) => {
              if (e.target.value.length <= 255) setLocalBusinessName(e.target.value);
            }}
            placeholder="Your catering business name"
            style={styles.input}
            disabled={isLoading}
            required
          />
          <p style={styles.charCounter}>{localBusinessName.length}/255</p>
        </div>

        {/* Business Type - Multiple Selection */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Business Type(s) * <span style={{ fontSize: '0.875rem', color: '#666' }}>
              (Select at least 1)
            </span>
          </label>
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
        </div>

        {/* Events You Handle - Multiple Selection */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Events You Handle * <span style={{ fontSize: '0.875rem', color: '#666' }}>
              (Select at least 1)
            </span>
          </label>
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
        </div>

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
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </>
  );
}