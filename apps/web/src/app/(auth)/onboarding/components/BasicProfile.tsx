'use client';

import React from 'react';
import {
  AlertCircle,
} from 'lucide-react';

type EventType = 'weddings' | 'birthdays' | 'corporate' | 'house-parties' | 'anniversaries';
type BusinessType = 'home-chef' | 'small-caterer' | 'catering-service';

interface BasicProfileProps {
  fullName: string;
  businessName: string;
  businessType: BusinessType;
  eventsHandled: EventType[];
  isLoading: boolean;
  error: string;
  onFullNameChange: (value: string) => void;
  onBusinessNameChange: (value: string) => void;
  onBusinessTypeChange: (value: BusinessType) => void;
  onEventsChange: (eventId: EventType) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  styles: { [key: string]: React.CSSProperties };
}

const EVENTS = [
  { id: 'weddings', label: 'Weddings', icon: '💍' },
  { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
  { id: 'corporate', label: 'Corporate Events', icon: '🏢' },
  { id: 'house-parties', label: 'House Parties', icon: '🏠' },
  { id: 'anniversaries', label: 'Anniversaries', icon: '💑' },
];

export default function BasicProfile({
  fullName,
  businessName,
  businessType,
  eventsHandled,
  isLoading,
  error,
  onFullNameChange,
  onBusinessNameChange,
  onBusinessTypeChange,
  onEventsChange,
  onSubmit,
  styles,
}: BasicProfileProps) {
  const isFormValid =
    fullName.trim() &&
    businessName.trim() &&
    eventsHandled.length > 0;

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Basic Profile</h1>
        <p style={styles.subtitle}>Tell us about your catering business</p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Your full name"
            style={styles.input}
            disabled={isLoading}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Business Name *</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            placeholder="Your catering business name"
            style={styles.input}
            disabled={isLoading}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Business Type *</label>
          <select
            value={businessType}
            onChange={(e) => onBusinessTypeChange(e.target.value as BusinessType)}
            style={styles.input}
            disabled={isLoading}
            required
          >
            <option value="home-chef">Home Chef</option>
            <option value="small-caterer">Small Caterer</option>
            <option value="catering-service">Catering Service</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Events You Handle *</label>
          <p style={styles.helpText}>Select one or more</p>
          <div style={styles.eventGrid}>
            {EVENTS.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventsChange(event.id as EventType)}
                style={{
                  ...styles.eventTag,
                  ...(eventsHandled.includes(event.id as EventType)
                    ? styles.eventTagActive
                    : styles.eventTagInactive),
                }}
                onMouseEnter={(e) => {
                  if (!eventsHandled.includes(event.id as EventType)) {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!eventsHandled.includes(event.id as EventType)) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                  {event.icon}
                </span>
                {event.label}
              </button>
            ))}
          </div>
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
      </form>
    </>
  );
}