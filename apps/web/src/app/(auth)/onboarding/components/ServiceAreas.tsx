'use client';

import React, { useState } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

interface ServiceArea {
  pincode: string;
  city: string;
  state: string;
}

interface CityData {
  code: string;
  name: string;
  pincodes: string[];
}

interface ServiceAreasProps {
  serviceAreas: ServiceArea[];
  newPincode: string;
  pincodeValidationMessage: string;
  isLoading: boolean;
  error: string;
  onPincodeChange: (pincode: string) => void;
  onAddServiceArea: () => void;
  onRemoveServiceArea: (pincode: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  onValidatePincode: (pincode: string) => CityData | null;
  styles: { [key: string]: React.CSSProperties };
  allowedCities: CityData[];
}

export default function ServiceAreas({
  serviceAreas,
  newPincode,
  pincodeValidationMessage,
  isLoading,
  error,
  onPincodeChange,
  onAddServiceArea,
  onRemoveServiceArea,
  onSubmit,
  onBack,
  onValidatePincode,
  styles,
  allowedCities,
}: ServiceAreasProps) {
  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Service Areas</h1>
        <p style={styles.subtitle}>Where can you deliver?</p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.infoBox}>
          <AlertCircle
            size={20}
            color="#0284c7"
            style={{ marginRight: '0.75rem' }}
          />
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            Add pincodes from serviceable areas only
          </p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Pincode *</label>
          <div style={styles.pincodeInputGroup}>
            <input
              type="text"
              value={newPincode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                onPincodeChange(value);
                if (value.length === 6) {
                  onValidatePincode(value);
                }
              }}
              placeholder="Enter 6-digit pincode"
              style={styles.input}
              disabled={isLoading}
              maxLength={6}
              required
            />
            <button
              type="button"
              onClick={onAddServiceArea}
              disabled={
                isLoading ||
                !newPincode.trim() ||
                !pincodeValidationMessage.startsWith('✓')
              }
              style={{
                ...styles.addButton,
                opacity:
                  isLoading || !newPincode.trim()
                    ? 0.6
                    : 1,
              }}
              onMouseEnter={(e) => {
                if (
                  !isLoading &&
                  newPincode.trim() &&
                  pincodeValidationMessage.startsWith('✓')
                ) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              <Plus size={18} />
            </button>
          </div>
          {pincodeValidationMessage && (
            <p
              style={{
                ...styles.helpText,
                color: pincodeValidationMessage.startsWith('✓')
                  ? '#15803d'
                  : '#dc2626',
                marginTop: '0.5rem',
              }}
            >
              {pincodeValidationMessage}
            </p>
          )}
        </div>

        {serviceAreas.length > 0 && (
          <div style={styles.serviceAreasList}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
              Added Service Areas ({serviceAreas.length})
            </h3>
            {serviceAreas.map((area) => (
              <div key={area.pincode} style={styles.serviceAreaItem}>
                <div style={styles.areaContent}>
                  <h4 style={styles.areaTitle}>{area.pincode}</h4>
                  <p style={styles.areaSubtitle}>{area.city}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveServiceArea(area.pincode)}
                  disabled={isLoading}
                  style={{
                    ...styles.deleteButton,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!pincodeValidationMessage && newPincode && (
          <div
            style={{
              ...styles.infoBox,
              backgroundColor: '#fef3c7',
              borderColor: '#fde68a',
              marginTop: '1rem',
            }}
          >
            <AlertCircle
              size={20}
              color="#b45309"
              style={{ marginRight: '0.75rem' }}
            />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f' }}>
              Type complete 6-digit pincode
            </p>
          </div>
        )}

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          disabled={isLoading || serviceAreas.length === 0}
          style={{
            ...styles.submitButton,
            opacity: isLoading || serviceAreas.length === 0 ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading && serviceAreas.length > 0) {
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