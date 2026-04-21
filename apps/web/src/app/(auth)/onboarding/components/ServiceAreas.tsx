'use client';

import React, { useState } from 'react';
import { AlertCircle, Plus, Trash2, MapPin } from 'lucide-react';

interface ServiceArea {
  pincode: string;
  city: string;
  state: string;
}

interface DeliverySettings {
  freeDeliveryRadius: number;
  maxDeliveryDistance: number;
  extraChargePerKm: number;
}

interface ServiceAreasProps {
  kitchenAddress: string;
  kitchenPincode: string;
  canServeEntireCity: boolean;
  serviceAreas: ServiceArea[];
  deliverySettings: DeliverySettings;
  isLoading: boolean;
  error: string;
  onSubmit: (formData: ServiceAreasFormData) => Promise<void>;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

interface ServiceAreasFormData {
  kitchenAddress: string;
  kitchenPincode: string;
  canServeEntireCity: boolean;
  serviceAreas: ServiceArea[];
  deliverySettings: DeliverySettings;
}

interface CityData {
  code: string;
  name: string;
  pincodes: string[];
}

export default function ServiceAreas({
  kitchenAddress,
  kitchenPincode,
  canServeEntireCity,
  serviceAreas,
  deliverySettings,
  isLoading,
  error,
  onSubmit,
  onBack,
  styles,
}: ServiceAreasProps) {
  // Local state
  const [localKitchenAddress, setLocalKitchenAddress] =
    useState(kitchenAddress);
  const [localKitchenPincode, setLocalKitchenPincode] =
    useState(kitchenPincode);
  const [localCanServeEntireCity, setLocalCanServeEntireCity] =
    useState(canServeEntireCity);
  const [localServiceAreas, setLocalServiceAreas] =
    useState<ServiceArea[]>(serviceAreas);
  const [localNewPincode, setLocalNewPincode] = useState('');
  const [pincodeValidationMessage, setPincodeValidationMessage] = useState('');
  const [localDeliverySettings, setLocalDeliverySettings] =
    useState<DeliverySettings>(
      deliverySettings || {
        freeDeliveryRadius: 0,
        maxDeliveryDistance: 0,
        extraChargePerKm: 0,
      }
    );

  // Validation for kitchen location
  const isKitchenLocationValid =
    localKitchenAddress &&
    localKitchenAddress.trim().length > 0 &&
    localKitchenPincode &&
    localKitchenPincode.trim().length === 6;

  // Validation for service areas
  const isServiceAreasValid =
    isKitchenLocationValid &&
    (localCanServeEntireCity ||
      (localServiceAreas && localServiceAreas.length > 0));

  // Validation for delivery settings (optional but if filled, must be valid)
  const hasDeliverySettings =
    localDeliverySettings &&
    (localDeliverySettings.freeDeliveryRadius > 0 ||
      localDeliverySettings.maxDeliveryDistance > 0 ||
      localDeliverySettings.extraChargePerKm > 0);

  const isDeliverySettingsValid =
    !hasDeliverySettings ||
    (localDeliverySettings.freeDeliveryRadius > 0 &&
      localDeliverySettings.maxDeliveryDistance >
        localDeliverySettings.freeDeliveryRadius &&
      localDeliverySettings.extraChargePerKm >= 0);

  const isFormValid = isServiceAreasValid && isDeliverySettingsValid;

  // Mock pincode validation - replace with real API call
  const validatePincode = (pincode: string): CityData | null => {
    const validPincodes: Record<string, CityData> = {
      '110001': {
        code: 'delhi',
        name: 'Delhi',
        pincodes: ['110001', '110002'],
      },
      '400001': {
        code: 'mumbai',
        name: 'Mumbai',
        pincodes: ['400001', '400002'],
      },
      '560001': {
        code: 'bangalore',
        name: 'Bangalore',
        pincodes: ['560001', '560002'],
      },
    };
    return validPincodes[pincode] || null;
  };

  const handleAddServiceArea = () => {
    if (!localNewPincode.trim() || localNewPincode.length !== 6) return;

    const cityData = validatePincode(localNewPincode);
    if (!cityData) {
      setPincodeValidationMessage('✗ Pincode not serviceable');
      return;
    }

    // Check if already added
    if (localServiceAreas.some((area) => area.pincode === localNewPincode)) {
      setPincodeValidationMessage('✗ Pincode already added');
      return;
    }

    // Add to service areas
    setLocalServiceAreas([
      ...localServiceAreas,
      {
        pincode: localNewPincode,
        city: cityData.name,
        state: 'State',
      },
    ]);

    // Reset input
    setLocalNewPincode('');
    setPincodeValidationMessage('');
  };

  const handleRemoveServiceArea = (pincode: string) => {
    setLocalServiceAreas(
      localServiceAreas.filter((area) => area.pincode !== pincode)
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const formData: ServiceAreasFormData = {
      kitchenAddress: localKitchenAddress,
      kitchenPincode: localKitchenPincode,
      canServeEntireCity: localCanServeEntireCity,
      serviceAreas: localServiceAreas,
      deliverySettings: localDeliverySettings,
    };

    await onSubmit(formData);
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Service Coverage</h1>
        <p style={styles.subtitle}>
          Define your service area and delivery options to reach the right
          customers
        </p>
      </div>

      <div style={styles.profileForm}>
        {/* SECTION 1: Kitchen Location */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>
            <MapPin size={20} style={{ marginRight: '0.5rem' }} />
            Kitchen Location
          </h2>
          <p style={styles.sectionSubtitle}>
            Where is your kitchen based? This helps customers know your delivery
            origin.
          </p>

          {/* Kitchen Address */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Kitchen Address *</label>
            <textarea
              value={localKitchenAddress}
              onChange={(e) => setLocalKitchenAddress(e.target.value)}
              placeholder="Enter your complete kitchen address (e.g., 123 Main Street, Building A, Floor 2)"
              style={
                {
                  ...styles.input,
                  minHeight: '80px',
                  resize: 'vertical',
                } as React.CSSProperties
              }
              disabled={isLoading}
              required
            />
            <p style={styles.helpText}>
              This address is where your food is prepared. Customers can see
              this to understand delivery timelines.
            </p>
          </div>

          {/* Kitchen Pincode */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode *</label>
            <input
              type="text"
              value={localKitchenPincode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                if (value.length <= 6) setLocalKitchenPincode(value);
              }}
              placeholder="Enter 6-digit pincode"
              style={styles.input}
              disabled={isLoading}
              maxLength={6}
              required
            />
            <p style={styles.helpText}>
              {localKitchenPincode && localKitchenPincode.length === 6
                ? '✓ Pincode valid'
                : `${(localKitchenPincode || '').length}/6 digits`}
            </p>
          </div>
        </div>

        {/* SECTION 2: Service Coverage */}
        {isKitchenLocationValid && (
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>Service Coverage</h2>
            <p style={styles.sectionSubtitle}>
              Define the areas where you can deliver your catering services.
            </p>

            {/* Can Serve Entire City Toggle */}
            <div style={styles.formGroup}>
              <div style={styles.toggleSection}>
                <div>
                  <label style={styles.label}>
                    Can you serve the entire city?
                  </label>
                  <p style={styles.helpText}>
                    If yes, you're available for any event in your primary city.
                    If no, you can specify specific pincodes you cover.
                  </p>
                </div>
                <div style={styles.toggleButtons}>
                  <button
                    type="button"
                    onClick={() => setLocalCanServeEntireCity(true)}
                    style={{
                      ...styles.toggleButton,
                      ...(localCanServeEntireCity
                        ? styles.toggleButtonActive
                        : styles.toggleButtonInactive),
                    }}
                    disabled={isLoading}
                  >
                    Yes, Entire City
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalCanServeEntireCity(false)}
                    style={{
                      ...styles.toggleButton,
                      ...(!localCanServeEntireCity
                        ? styles.toggleButtonActive
                        : styles.toggleButtonInactive),
                    }}
                    disabled={isLoading}
                  >
                    No, Specific Areas
                  </button>
                </div>
              </div>

              {localCanServeEntireCity && (
                <div style={styles.infoBox}>
                  <AlertCircle
                    size={20}
                    color="#10b981"
                    style={{ marginRight: '0.75rem' }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#065f46',
                    }}
                  >
                    Great! Your kitchen pincode ({localKitchenPincode}) is set
                    as your service area for now. You can update delivery
                    charges below.
                  </p>
                </div>
              )}
            </div>

            {/* Specific Pincodes Section */}
            {!localCanServeEntireCity && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Add Service Pincodes *</label>
                <p style={styles.helpText}>
                  Add pincodes where you can deliver. Customers in these areas
                  will see your services.
                </p>

                {/* Pincode Input */}
                <div style={styles.pincodeInputGroup}>
                  <input
                    type="text"
                    value={localNewPincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setLocalNewPincode(value);
                      if (value.length === 6) {
                        const cityData = validatePincode(value);
                        if (cityData) {
                          setPincodeValidationMessage('✓ Pincode valid');
                        } else {
                          setPincodeValidationMessage(
                            '✗ Pincode not serviceable'
                          );
                        }
                      } else {
                        setPincodeValidationMessage('');
                      }
                    }}
                    placeholder="Enter 6-digit pincode"
                    style={styles.input}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceArea}
                    disabled={
                      isLoading ||
                      !localNewPincode ||
                      !localNewPincode.trim() ||
                      !pincodeValidationMessage.startsWith('✓')
                    }
                    style={{
                      ...styles.addButton,
                      opacity:
                        isLoading || !localNewPincode || !localNewPincode.trim()
                          ? 0.6
                          : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !isLoading &&
                        localNewPincode &&
                        localNewPincode.trim() &&
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

                {/* Service Areas List */}
                {localServiceAreas && localServiceAreas.length > 0 && (
                  <div style={styles.serviceAreasList}>
                    <h3 style={styles.listTitle}>
                      Service Pincodes ({localServiceAreas.length})
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      {localServiceAreas.map((area) => (
                        <div key={area.pincode} style={styles.serviceAreaItem}>
                          <div style={styles.areaContent}>
                            <h4 style={styles.areaTitle}>{area.pincode}</h4>
                            <p style={styles.areaSubtitle}>{area.city}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveServiceArea(area.pincode)
                            }
                            disabled={isLoading}
                            style={{
                              ...styles.deleteButton,
                              opacity: isLoading ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.opacity = '0.8';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            title="Remove this pincode"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: Delivery Settings (Optional) */}
        {isServiceAreasValid && (
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>Delivery Charges (Optional)</h2>
            <p style={styles.sectionSubtitle}>
              Set your delivery radius and charges. You can update this later.
            </p>

            <div style={styles.deliveryGrid}>
              <div style={styles.deliveryFormGroup}>
                <label style={styles.label}>Free Delivery Radius (km)</label>
                <input
                  type="number"
                  value={localDeliverySettings.freeDeliveryRadius ?? ''}
                  onChange={(e) =>
                    setLocalDeliverySettings({
                      ...localDeliverySettings,
                      freeDeliveryRadius: e.target.value
                        ? parseInt(e.target.value, 10)
                        : 0,
                    })
                  }
                  placeholder="e.g., 5"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                />
                <p style={styles.helpText}>
                  Customers within this radius get free delivery
                </p>
              </div>

              <div style={styles.deliveryFormGroup}>
                <label style={styles.label}>
                  Max Delivery Distance (km)
                </label>
                <input
                  type="number"
                  value={localDeliverySettings.maxDeliveryDistance ?? ''}
                  onChange={(e) =>
                    setLocalDeliverySettings({
                      ...localDeliverySettings,
                      maxDeliveryDistance: e.target.value
                        ? parseInt(e.target.value, 10)
                        : 0,
                    })
                  }
                  placeholder="e.g., 20"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                />
                <p style={styles.helpText}>
                  You won't deliver beyond this distance
                </p>
              </div>

              <div style={styles.deliveryFormGroup}>
                <label style={styles.label}>Extra Charge per km (₹)</label>
                <input
                  type="number"
                  value={localDeliverySettings.extraChargePerKm ?? ''}
                  onChange={(e) =>
                    setLocalDeliverySettings({
                      ...localDeliverySettings,
                      extraChargePerKm: e.target.value
                        ? parseFloat(e.target.value)
                        : 0,
                    })
                  }
                  placeholder="e.g., 10"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                  step="0.5"
                />
                <p style={styles.helpText}>
                  Charge per km beyond free delivery radius
                </p>
              </div>
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

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            style={{
              ...styles.submitButton,
              opacity: isLoading || !isFormValid ? 0.6 : 1,
              cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
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
        </div>
      </div>
    </>
  );
}
