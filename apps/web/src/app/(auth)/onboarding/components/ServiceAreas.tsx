'use client';

import React, { useMemo, useState } from 'react';
import type { DeliveryServiceData, StepComponentProps } from '../types';

type DistanceUnit = 'km' | 'mile';

export interface CityData {
  id: string;
  code?: string;
  name: string;
  state?: string;
  countryCode: string;
  pincodes?: string[];
}

export interface ServiceAreasProps
  extends StepComponentProps<DeliveryServiceData> {
  cities?: CityData[];
}

const DEFAULT_DATA: DeliveryServiceData = {
  canServeEntireCity: false,
  deliveryAvailable: true,
  pickupAvailable: false,
  freeDeliveryRadius: null,
  maxDeliveryDistance: null,
  distanceUnit: 'km',
  extraChargePerDistanceUnit: null,
  minOrderValue: null,
  serviceAreas: [],
};

export default function ServiceAreas({
  initialData,
  onSubmitForm,
  onBack,
  isLoading = false,
  error,
  cities = [],
}: ServiceAreasProps) {
  const [formData, setFormData] = useState<DeliveryServiceData>({
    ...DEFAULT_DATA,
    ...initialData,
    serviceAreas: initialData?.serviceAreas || [],
  });

  const [newPincode, setNewPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');

  const distanceLabel = formData.distanceUnit === 'mile' ? 'mile' : 'km';

  const isFormValid = useMemo(() => {
    if (!formData.deliveryAvailable && !formData.pickupAvailable) return false;

    if (formData.deliveryAvailable && !formData.canServeEntireCity) {
      return formData.serviceAreas.length > 0;
    }

    return true;
  }, [formData]);

  const updateField = <K extends keyof DeliveryServiceData>(
    field: K,
    value: DeliveryServiceData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toNumberOrNull = (value: string) => {
    if (value.trim() === '') return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const validatePincode = (pincode: string): CityData | null => {
    return cities.find((city) => city.pincodes?.includes(pincode)) || null;
  };

  const handleAddPincode = () => {
    const cleanPincode = newPincode.trim();

    if (!/^\d{6}$/.test(cleanPincode)) {
      setPincodeMessage('Enter a valid 6-digit pincode.');
      return;
    }

    const city = validatePincode(cleanPincode);

    if (!city) {
      setPincodeMessage('This pincode is not currently serviceable.');
      return;
    }

    const alreadyExists = formData.serviceAreas.some(
      (area) =>
        area.pincode === cleanPincode &&
        area.cityId === city.id
    );

    if (alreadyExists) {
      setPincodeMessage('This pincode is already added.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      serviceAreas: [
        ...prev.serviceAreas,
        {
          id: crypto.randomUUID(),
          pincode: cleanPincode,
          cityId: city.id,
          countryCode: city.countryCode || 'IN',
          latitude: null,
          longitude: null,
        },
      ],
    }));

    setNewPincode('');
    setPincodeMessage('');
  };

  const handleRemoveServiceArea = (id?: string) => {
    if (!id) return;

    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((area) => area.id !== id),
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    await onSubmitForm({
      ...formData,
      serviceAreas: formData.canServeEntireCity
        ? []
        : formData.serviceAreas,
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>Delivery & Service Areas</h1>
        <p style={styles.subtitle}>
          Define where you can serve customers and how delivery should work.
        </p>
      </div>

      <div style={styles.form}>
        <section style={styles.section}>
          <label style={styles.label}>Service availability</label>
          <p style={styles.helperText}>
            Choose whether customers can request delivery, pickup, or both.
          </p>

          <div style={styles.segmentGroup}>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateField('deliveryAvailable', !formData.deliveryAvailable)
              }
              style={{
                ...styles.segmentButton,
                ...(formData.deliveryAvailable
                  ? styles.segmentButtonActive
                  : {}),
              }}
            >
              Delivery
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateField('pickupAvailable', !formData.pickupAvailable)
              }
              style={{
                ...styles.segmentButton,
                ...(formData.pickupAvailable
                  ? styles.segmentButtonActive
                  : {}),
              }}
            >
              Pickup
            </button>
          </div>
        </section>

        {formData.deliveryAvailable && (
          <>
            <section style={styles.section}>
              <label style={styles.label}>Delivery coverage</label>
              <p style={styles.helperText}>
                Choose whether you can serve the entire city or only selected
                pincodes.
              </p>

              <div style={styles.segmentGroup}>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => updateField('canServeEntireCity', true)}
                  style={{
                    ...styles.segmentButton,
                    ...(formData.canServeEntireCity
                      ? styles.segmentButtonActive
                      : {}),
                  }}
                >
                  Entire city
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => updateField('canServeEntireCity', false)}
                  style={{
                    ...styles.segmentButton,
                    ...(!formData.canServeEntireCity
                      ? styles.segmentButtonActive
                      : {}),
                  }}
                >
                  Selected pincodes
                </button>
              </div>
            </section>

            <section style={styles.section}>
              <label style={styles.label}>Distance settings</label>
              <p style={styles.helperText}>
                These settings help calculate delivery availability and charges.
              </p>

              <div style={styles.twoColumnGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>Distance unit</label>
                  <select
                    value={formData.distanceUnit}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField(
                        'distanceUnit',
                        event.target.value as DistanceUnit
                      )
                    }
                    style={styles.input}
                  >
                    <option value="km">Kilometres</option>
                    <option value="mile">Miles</option>
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>
                    Max delivery distance
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={isLoading}
                    value={formData.maxDeliveryDistance ?? ''}
                    onChange={(event) =>
                      updateField(
                        'maxDeliveryDistance',
                        toNumberOrNull(event.target.value)
                      )
                    }
                    placeholder={`Example: 10 ${distanceLabel}`}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>
                    Free delivery radius
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={isLoading}
                    value={formData.freeDeliveryRadius ?? ''}
                    onChange={(event) =>
                      updateField(
                        'freeDeliveryRadius',
                        toNumberOrNull(event.target.value)
                      )
                    }
                    placeholder={`Example: 3 ${distanceLabel}`}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>
                    Extra charge per {distanceLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={isLoading}
                    value={formData.extraChargePerDistanceUnit ?? ''}
                    onChange={(event) =>
                      updateField(
                        'extraChargePerDistanceUnit',
                        toNumberOrNull(event.target.value)
                      )
                    }
                    placeholder="Example: 20"
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>Minimum order value</label>
                  <input
                    type="number"
                    min={0}
                    disabled={isLoading}
                    value={formData.minOrderValue ?? ''}
                    onChange={(event) =>
                      updateField(
                        'minOrderValue',
                        toNumberOrNull(event.target.value)
                      )
                    }
                    placeholder="Example: 500"
                    style={styles.input}
                  />
                </div>
              </div>
            </section>

            {!formData.canServeEntireCity && (
              <section style={styles.section}>
                <label style={styles.label}>Service pincodes</label>
                <p style={styles.helperText}>
                  Add valid pincodes you can currently serve. The city will be
                  matched from master data.
                </p>

                <div style={styles.pincodeRow}>
                  <input
                    value={newPincode}
                    disabled={isLoading}
                    onChange={(event) => {
                      setNewPincode(
                        event.target.value.replace(/\D/g, '').slice(0, 6)
                      );
                      setPincodeMessage('');
                    }}
                    placeholder="Enter 6-digit pincode"
                    style={styles.input}
                  />

                  <button
                    type="button"
                    onClick={handleAddPincode}
                    disabled={isLoading || newPincode.length !== 6}
                    style={{
                      ...styles.addButton,
                      ...(isLoading || newPincode.length !== 6
                        ? styles.disabledButton
                        : {}),
                    }}
                  >
                    Add
                  </button>
                </div>

                {pincodeMessage && (
                  <p style={styles.validationMessage}>{pincodeMessage}</p>
                )}

                {formData.serviceAreas.length > 0 ? (
                  <div style={styles.areaList}>
                    {formData.serviceAreas.map((area) => {
                      const city = cities.find(
                        (item) => item.id === area.cityId
                      );

                      return (
                        <div
                          key={area.id || `${area.cityId}-${area.pincode}`}
                          style={styles.areaItem}
                        >
                          <div>
                            <strong style={styles.areaTitle}>
                              {area.pincode}
                            </strong>
                            <p style={styles.areaMeta}>
                              {city?.name || 'Unknown city'}
                              {city?.state ? `, ${city.state}` : ''}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleRemoveServiceArea(area.id)}
                            style={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={styles.emptyText}>
                    No service pincodes added yet.
                  </p>
                )}
              </section>
            )}
          </>
        )}

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
    gap: '1.25rem',
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

  smallLabel: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#374151',
  },

  helperText: {
    margin: '0 0 1rem 0',
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },

  segmentGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },

  segmentButton: {
    padding: '1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '0.95rem',
    fontWeight: 800,
    cursor: 'pointer',
  },

  segmentButtonActive: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
    color: '#c2410c',
  },

  input: {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.875rem',
    border: '1.5px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#ffffff',
  },

  pincodeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '0.75rem',
    alignItems: 'center',
  },

  addButton: {
    padding: '0.95rem 1.25rem',
    border: 'none',
    borderRadius: '0.875rem',
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  areaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1rem',
  },

  areaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.875rem',
    borderRadius: '0.875rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
  },

  areaTitle: {
    color: '#111827',
    fontSize: '0.95rem',
  },

  areaMeta: {
    margin: '0.25rem 0 0 0',
    color: '#6b7280',
    fontSize: '0.85rem',
  },

  removeButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#dc2626',
    fontWeight: 800,
    cursor: 'pointer',
  },

  validationMessage: {
    margin: '0.75rem 0 0 0',
    color: '#dc2626',
    fontSize: '0.875rem',
    fontWeight: 600,
  },

  emptyText: {
    margin: '1rem 0 0 0',
    color: '#6b7280',
    fontSize: '0.875rem',
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