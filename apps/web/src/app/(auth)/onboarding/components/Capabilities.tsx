'use client';

import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

type CapabilityType =
  | 'menu-planning'
  | 'setup-arrangements'
  | 'professional-staff'
  | 'equipment'
  | 'cleanup'
  | 'beverage-service';

interface CapabilitiesProps {
  selectedCapabilities: CapabilityType[];
  isLoading: boolean;
  error: string;
  onCapabilityToggle: (capabilityId: CapabilityType) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

const CAPABILITIES = [
  { id: 'menu-planning', label: 'Menu Planning & Customization', icon: '🍽️' },
  { id: 'setup-arrangements', label: 'Setup & Table Arrangements', icon: '🪑' },
  { id: 'professional-staff', label: 'Professional Staff Service', icon: '👥' },
  { id: 'equipment', label: 'Equipment & Utensils', icon: '🔪' },
  { id: 'cleanup', label: 'Cleanup & Disposal', icon: '🧹' },
  { id: 'beverage-service', label: 'Beverage Service', icon: '🥂' },
];

export default function Capabilities({
  selectedCapabilities,
  isLoading,
  error,
  onCapabilityToggle,
  onSubmit,
  onBack,
  styles,
}: CapabilitiesProps) {
  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Capabilities</h1>
        <p style={styles.subtitle}>What services can you provide?</p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.infoBox}>
          <AlertCircle
            size={20}
            color="#0284c7"
            style={{ marginRight: '0.75rem' }}
          />
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            Select all the services you can provide
          </p>
        </div>

        <div style={styles.capabilitiesGrid}>
          {CAPABILITIES.map((capability) => (
            <button
              key={capability.id}
              type="button"
              onClick={() => onCapabilityToggle(capability.id as CapabilityType)}
              style={{
                ...styles.capabilityCard,
                ...(selectedCapabilities.includes(capability.id as CapabilityType)
                  ? styles.capabilityCardActive
                  : styles.capabilityCardInactive),
              }}
              onMouseEnter={(e) => {
                if (!selectedCapabilities.includes(capability.id as CapabilityType)) {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                  e.currentTarget.style.borderColor = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedCapabilities.includes(capability.id as CapabilityType)) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              {selectedCapabilities.includes(capability.id as CapabilityType) && (
                <Check size={20} style={{ marginRight: '0.5rem' }} />
              )}
              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                {capability.icon}
              </span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                {capability.label}
              </span>
            </button>
          ))}
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          disabled={isLoading || selectedCapabilities.length === 0}
          style={{
            ...styles.submitButton,
            opacity: isLoading || selectedCapabilities.length === 0 ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading && selectedCapabilities.length > 0) {
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