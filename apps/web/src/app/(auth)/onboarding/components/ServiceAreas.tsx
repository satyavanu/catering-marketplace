'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Plus, Trash2, MapPin, Check, XCircle, Info } from 'lucide-react';

interface ServiceArea {
  pincode: string;
  city: string;
  state: string; // Added state to the mock data for completeness
}

interface DeliverySettings {
  freeDeliveryRadius: number | null; // Changed to null for initial empty state
  maxDeliveryDistance: number | null; // Changed to null for initial empty state
  extraChargePerKm: number | null; // Changed to null for initial empty state
}

interface ServiceAreasProps {
  kitchenAddress: string;
  kitchenPincode: string;
  canServeEntireCity: boolean;
  serviceAreas: ServiceArea[];
  deliverySettings: DeliverySettings | null; // Can be null initially
  isLoading: boolean;
  error: string; // Passed error for global/server-side messages
  onSubmit: (formData: ServiceAreasFormData) => Promise<void>;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties }; // Base styles from parent
}

interface ServiceAreasFormData {
  kitchenAddress: string;
  kitchenPincode: string;
  canServeEntireCity: boolean;
  serviceAreas: ServiceArea[];
  deliverySettings: DeliverySettings; // Must be non-null on submit
}

interface CityData {
  code: string;
  name: string;
  pincodes: string[];
  state: string; // Added state
}

export default function ServiceAreas({
  kitchenAddress,
  kitchenPincode,
  canServeEntireCity,
  serviceAreas,
  deliverySettings,
  isLoading,
  error: globalError, // Renamed for clarity
  onSubmit,
  onBack,
  styles,
}: ServiceAreasProps) {
  // Local state for form fields
  const [localKitchenAddress, setLocalKitchenAddress] = useState(kitchenAddress);
  const [localKitchenPincode, setLocalKitchenPincode] = useState(kitchenPincode);
  const [localCanServeEntireCity, setLocalCanServeEntireCity] = useState(canServeEntireCity);
  const [localServiceAreas, setLocalServiceAreas] = useState<ServiceArea[]>(serviceAreas);
  const [localNewPincode, setLocalNewPincode] = useState('');
  const [pincodeValidationMessage, setPincodeValidationMessage] = useState('');
  const [localDeliverySettings, setLocalDeliverySettings] = useState<DeliverySettings>(
    deliverySettings || {
      freeDeliveryRadius: null,
      maxDeliveryDistance: null,
      extraChargePerKm: null,
    }
  );

  // Validation State variables
  const [kitchenAddressError, setKitchenAddressError] = useState(false);
  const [kitchenPincodeError, setKitchenPincodeError] = useState(false);
  const [serviceAreasSelectionError, setServiceAreasSelectionError] = useState(false);
  const [deliverySettingsError, setDeliverySettingsError] = useState(''); // Specific message for delivery issues
  const [formError, setFormError] = useState(''); // General and initial submission error

  // Mock pincode validation - replace with real API call
  const validatePincode = (pincode: string): CityData | null => {
    // In a real app, this would be an API call
    const validPincodes: Record<string, CityData> = {
      '110001': {
        code: 'delhi',
        name: 'Delhi',
        pincodes: ['110001', '110002'],
        state: 'Delhi',
      },
      '400001': {
        code: 'mumbai',
        name: 'Mumbai',
        pincodes: ['400001', '400002'],
        state: 'Maharashtra',
      },
      '560001': {
        code: 'bangalore',
        name: 'Bengaluru',
        pincodes: ['560001', '560002'],
        state: 'Karnataka',
      },
      '600001': {
        code: 'chennai',
        name: 'Chennai',
        pincodes: ['600001', '600002'],
        state: 'Tamil Nadu',
      }
      // Add more fake pincodes for testing
    };
    return validPincodes[pincode] || null;
  };

  // Derived validation states
  const isKitchenLocationValid =
    localKitchenAddress.trim().length > 0 && localKitchenPincode.trim().length === 6;

  const isServiceAreasSectionValid =
    isKitchenLocationValid &&
    (localCanServeEntireCity || (localServiceAreas && localServiceAreas.length > 0));

  // Delivery settings validation
  const isDeliverySettingsPopulated =
    localDeliverySettings.freeDeliveryRadius !== null &&
    localDeliverySettings.freeDeliveryRadius > 0 ||
    localDeliverySettings.maxDeliveryDistance !== null &&
    localDeliverySettings.maxDeliveryDistance > 0 ||
    localDeliverySettings.extraChargePerKm !== null &&
    localDeliverySettings.extraChargePerKm > 0;

  const isDeliverySettingsValid = (function () {
    if (!isDeliverySettingsPopulated) return true; // It's optional

    const free = localDeliverySettings.freeDeliveryRadius ?? 0;
    const max = localDeliverySettings.maxDeliveryDistance ?? 0;
    const charge = localDeliverySettings.extraChargePerKm ?? 0;

    if (free < 0 || max < 0 || charge < 0) {
      setDeliverySettingsError('Values cannot be negative.');
      return false;
    }
    if (max > 0 && free >= max) {
      setDeliverySettingsError('Max delivery distance must be greater than free delivery radius.');
      return false;
    }
    if (free > 0 && max === 0) {
      // If free delivery is set, max delivery should also be set (and > free)
      setDeliverySettingsError('If free delivery is set, please also set a max delivery distance.');
      return false;
    }
    setDeliverySettingsError(''); // Clear error if logic passes
    return true;
  })();

  const isFormValid = isServiceAreasSectionValid && isDeliverySettingsValid;

  // Clear specific errors on input change
  useEffect(() => {
    if (localKitchenAddress.trim().length > 0) setKitchenAddressError(false);
    if (localKitchenPincode.trim().length === 6) setKitchenPincodeError(false);
    if (localCanServeEntireCity || localServiceAreas.length > 0) setServiceAreasSelectionError(false);
  }, [localKitchenAddress, localKitchenPincode, localCanServeEntireCity, localServiceAreas, localDeliverySettings]);


  const handleAddServicePincode = () => {
    // Clear previous message
    setPincodeValidationMessage('');

    if (!localNewPincode.trim() || localNewPincode.trim().length !== 6) {
      setPincodeValidationMessage('Invalid 6-digit pincode.');
      return;
    }

    const cityData = validatePincode(localNewPincode.trim());
    if (!cityData) {
      setPincodeValidationMessage('Pincode not serviceable.');
      return;
    }

    // Check if already added
    if (localServiceAreas.some((area) => area.pincode === localNewPincode.trim())) {
      setPincodeValidationMessage('Pincode already added.');
      return;
    }

    // Add to service areas
    setLocalServiceAreas([
      ...localServiceAreas,
      {
        pincode: localNewPincode.trim(),
        city: cityData.name,
        state: cityData.state,
      },
    ]);

    // Reset input
    setLocalNewPincode('');
    setPincodeValidationMessage('');
    setServiceAreasSelectionError(false); // Clear error if new area added
  };

  const handleRemoveServiceArea = (pincode: string) => {
    setLocalServiceAreas(
      localServiceAreas.filter((area) => area.pincode !== pincode)
    );
  };


  // Handle form submission
  const handleSubmit = async () => {
    // Manual validation for feedback
    let formHasErrors = false;

    if (localKitchenAddress.trim().length === 0) {
      setKitchenAddressError(true);
      formHasErrors = true;
    }
    if (localKitchenPincode.trim().length !== 6) {
      setKitchenPincodeError(true);
      formHasErrors = true;
    }
    if (!localCanServeEntireCity && localServiceAreas.length === 0) {
      setServiceAreasSelectionError(true);
      formHasErrors = true;
    }

    // Re-evaluate delivery settings validity (will update localDeliverySettingsError)
    const currentDeliveryValid = (function () {
        if (!isDeliverySettingsPopulated) return true;

        const free = localDeliverySettings.freeDeliveryRadius ?? 0;
        const max = localDeliverySettings.maxDeliveryDistance ?? 0;
        const charge = localDeliverySettings.extraChargePerKm ?? 0;

        if (free < 0 || max < 0 || charge < 0) {
            setDeliverySettingsError('Values cannot be negative.');
            return false;
        }
        if (max > 0 && free >= max) {
            setDeliverySettingsError('Max delivery distance must be greater than free delivery radius.');
            return false;
        }
        if (free > 0 && max === 0) {
             setDeliverySettingsError('If free delivery is set, please also set a maximum delivery distance.');
             return false;
        }
        setDeliverySettingsError('');
        return true;
    })();

    if (!currentDeliveryValid) {
        formHasErrors = true;
    }


    if (formHasErrors) {
      setFormError('Please correct the highlighted fields before continuing.');
      return;
    }


    const formData: ServiceAreasFormData = {
      kitchenAddress: localKitchenAddress.trim(),
      kitchenPincode: localKitchenPincode.trim(),
      canServeEntireCity: localCanServeEntireCity,
      serviceAreas: localServiceAreas,
      deliverySettings: {
        freeDeliveryRadius: localDeliverySettings.freeDeliveryRadius !== null ? localDeliverySettings.freeDeliveryRadius : 0,
        maxDeliveryDistance: localDeliverySettings.maxDeliveryDistance !== null ? localDeliverySettings.maxDeliveryDistance : 0,
        extraChargePerKm: localDeliverySettings.extraChargePerKm !== null ? localDeliverySettings.extraChargePerKm : 0,
      },
    };

    setFormError(''); // Clear general error before submitting
    await onSubmit(formData);
  };


  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Service Coverage</h1>
        <p style={styles.subtitle}>
          Define your service area and delivery options to reach the right
          customers.
        </p>
      </div>

      <div style={styles.profileForm}>
        {/* SECTION 1: Kitchen Location */}
        <div style={profileStyles.stepSection}>
            <div style={profileStyles.stepHeader}>
                <h2 style={profileStyles.stepTitle}>
                    <MapPin size={24} style={{ marginRight: '0.6rem', color: '#4f46e5' }} />
                    Kitchen Location
                </h2>
            </div>
          <p style={styles.helpText}>
            Where is your kitchen based? This is your central point for delivery calculations and customer visibility.
          </p>

          {/* Kitchen Address */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Kitchen Address *</label>
            <textarea
              value={localKitchenAddress}
              onChange={(e) => {
                setLocalKitchenAddress(e.target.value);
                setKitchenAddressError(false);
              }}
              onBlur={() => setKitchenAddressError(localKitchenAddress.trim().length === 0)}
              placeholder="e.g., 123 Main Street, Building A, Floor 2"
              style={{
                ...styles.input,
                minHeight: '80px',
                resize: 'vertical',
                borderColor: kitchenAddressError ? '#ef4444' : styles.input.borderColor,
              }}
              disabled={isLoading}
              required
            />
            <p style={styles.charCounter}>{localKitchenAddress.length}/255</p>
            {kitchenAddressError && (
              <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Kitchen address is required.
              </p>
            )}
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
                setKitchenPincodeError(false);
              }}
              onBlur={() => {
                const isValid = localKitchenPincode.trim().length === 6 && validatePincode(localKitchenPincode.trim());
                setKitchenPincodeError(!isValid);
              }}
              placeholder="Enter 6-digit pincode"
              style={{
                ...styles.input,
                borderColor: kitchenPincodeError ? '#ef4444' : styles.input.borderColor,
              }}
              disabled={isLoading}
              maxLength={6}
              required
            />
            {(localKitchenPincode.length === 6 && !validatePincode(localKitchenPincode.trim())) && (
                <p style={profileStyles.validationError}>
                    <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Pincode is invalid or not serviceable.
                </p>
            )}
            {(localKitchenPincode.length === 6 && validatePincode(localKitchenPincode.trim())) && (
                <p style={{...profileStyles.selectionSummary, marginTop: '0.5rem'}}>
                    <Check size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Pincode identified: {validatePincode(localKitchenPincode.trim())?.name}, {validatePincode(localKitchenPincode.trim())?.state}
                </p>
            )}
            {!kitchenPincodeError && localKitchenPincode.length < 6 && (
                <p style={styles.charCounter}>{localKitchenPincode.length}/6 digits</p>
            )}
            {kitchenPincodeError && (
              <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> A valid 6-digit pincode is required.
              </p>
            )}
          </div>
        </div>

        {/* SECTION 2: Service Coverage */}
        {isKitchenLocationValid && (
          <div style={profileStyles.stepSection}>
            <div style={profileStyles.stepHeader}>
                <h2 style={profileStyles.stepTitle}>
                    <Info size={24} style={{ marginRight: '0.6rem', color: '#4f46e5' }} />
                    Service Coverage
                </h2>
            </div>
            <p style={styles.helpText}>
              Define the areas exactly where you can deliver. This determines which customers can find your services.
            </p>

            {/* Can Serve Entire City Toggle */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Where can you serve?</label>
              <div style={profileStyles.toggleSwitch}>
                  <button
                    type="button"
                    onClick={() => setLocalCanServeEntireCity(true)}
                    style={{
                      ...profileStyles.toggleButton,
                      ...(localCanServeEntireCity
                        ? profileStyles.toggleButtonActive
                        : profileStyles.toggleButtonInactive),
                      ...(!isLoading && {':hover': profileStyles.toggleButtonHover}),
                    }}
                    disabled={isLoading}
                  >
                    Entire City
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalCanServeEntireCity(false)}
                    style={{
                      ...profileStyles.toggleButton,
                      ...(!localCanServeEntireCity
                        ? profileStyles.toggleButtonActive
                        : profileStyles.toggleButtonInactive),
                      ...(!isLoading && {':hover': profileStyles.toggleButtonHover}),
                    }}
                    disabled={isLoading}
                  >
                    Specific Pincodes
                  </button>
                </div>
              </div>

              {localCanServeEntireCity && (
                <p style={profileStyles.infoNote}>
                  <Info size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  You will be visible to all customers in the city associated with your kitchen pincode.
                </p>
              )}

            {/* Specific Pincodes Section */}
            {!localCanServeEntireCity && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Specific Pincodes You Cover *</label>
                <p style={styles.helpText}>
                  Add each 6-digit pincode where you can deliver. Customers in these areas will see your services.
                </p>

                {/* Pincode Input */}
                <div style={profileStyles.pincodeInputGroup}>
                  <input
                    type="text"
                    value={localNewPincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setLocalNewPincode(value);
                      if (value.length === 6) {
                        const cityData = validatePincode(value);
                        if (cityData) {
                          setPincodeValidationMessage(<span style={{ color: '#15803d' }}><Check size={16} /> Valid Pincode: {cityData.name}, {cityData.state}</span>);
                        } else {
                          setPincodeValidationMessage(<span style={{ color: '#dc2626' }}><XCircle size={16} /> Pincode not serviceable.</span>);
                        }
                      } else {
                        setPincodeValidationMessage('');
                      }
                    }}
                    onKeyDown={(e) => { // Allow adding with Enter key
                        if (e.key === 'Enter' && !isLoading && !pincodeValidationMessage.includes('✗') && localNewPincode.trim().length === 6) {
                            e.preventDefault();
                            handleAddServicePincode();
                        }
                    }}
                    placeholder="Enter 6-digit pincode"
                    style={{
                      ...styles.input,
                      flex: 1, // Take up remaining space
                      borderColor: (pincodeValidationMessage.includes('✗') || serviceAreasSelectionError) ? '#ef4444' : styles.input.borderColor,
                    }}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleAddServicePincode}
                    disabled={
                      isLoading ||
                      !localNewPincode.trim() ||
                      localNewPincode.trim().length !== 6 ||
                      pincodeValidationMessage.includes('✗') // Disable if validation message shows error
                    }
                    style={{
                      ...profileStyles.addButton,
                      ...(isLoading || !localNewPincode.trim() || localNewPincode.trim().length !== 6 || pincodeValidationMessage.includes('✗') ? profileStyles.buttonDisabled : {}),
                    }}
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                {pincodeValidationMessage && (
                  <p style={{...styles.helpText, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                    {pincodeValidationMessage}
                  </p>
                )}
                {serviceAreasSelectionError && (
                    <p style={profileStyles.validationError}>
                        <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Please add at least one service pincode.
                    </p>
                )}


                {/* Service Areas List */}
                {localServiceAreas && localServiceAreas.length > 0 && (
                  <div style={profileStyles.listContainer}>
                    <h3 style={profileStyles.listTitle}>
                      Currently Serving ({localServiceAreas.length})
                    </h3>
                    <div style={profileStyles.tagGrid}>
                      {localServiceAreas.map((area) => (
                        <div key={area.pincode} style={profileStyles.serviceAreaTag}>
                          <div style={profileStyles.tagContent}>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>{area.pincode}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{area.city}, {area.state}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceArea(area.pincode)}
                            disabled={isLoading}
                            style={profileStyles.tagRemoveButton}
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
        {isServiceAreasSectionValid && (
          <div style={profileStyles.stepSection}>
            <div style={profileStyles.stepHeader}>
                <h2 style={profileStyles.stepTitle}>
                    <Info size={24} style={{ marginRight: '0.6rem', color: '#4f46e5' }} />
                    Delivery Charges <span style={{ color: '#6b7280', fontSize: '0.9em' }}>(Optional)</span>
                </h2>
            </div>
            <p style={styles.helpText}>
              Set your delivery radius and charges. This helps manage customer expectations and delivery fees.
            </p>

            <div style={profileStyles.deliveryGrid}>
              <div style={profileStyles.deliveryFormGroup}>
                <label style={styles.label}>Free Delivery Radius (km)</label>
                <input
                  type="number"
                  value={localDeliverySettings.freeDeliveryRadius ?? ''}
                  onChange={(e) =>
                    setLocalDeliverySettings({
                      ...localDeliverySettings,
                      freeDeliveryRadius: e.target.value
                        ? Math.max(0, parseInt(e.target.value, 10))
                        : null,
                    })
                  }
                  onBlur={() => setDeliverySettingsError('')} // Re-validate on blur
                  placeholder="e.g., 5"
                  style={{
                    ...styles.input,
                    ...(deliverySettingsError && profileStyles.inputError),
                  }}
                  disabled={isLoading}
                  min="0"
                />
                <p style={styles.helpText}>
                  Customers within this radius get free delivery. Enter 0 or leave blank for no free delivery.
                </p>
              </div>

              <div style={profileStyles.deliveryFormGroup}>
                <label style={styles.label}>Max Delivery Distance (km)</label>
                <input
                  type="number"
                  value={localDeliverySettings.maxDeliveryDistance ?? ''}
                  onChange={(e) =>
                    setLocalDeliverySettings({
                      ...localDeliverySettings,
                      maxDeliveryDistance: e.target.value
                        ? Math.max(0, parseInt(e.target.value, 10))
                        : null,
                    })
                  }
                  onBlur={() => setDeliverySettingsError('')} // Re-validate on blur
                  placeholder="e.g., 20"
                  style={{
                    ...styles.input,
                    ...(deliverySettingsError && profileStyles.inputError),
                  }}
                  disabled={isLoading}
                  min="0"
                />
                <p style={styles.helpText}>
                  You won't deliver beyond this distance.
                </p>
              </div>

              <div style={profileStyles.deliveryFormGroup}>
                <label style={styles.label}>Extra Charge per km (₹)</label>
                <input
                  type="number"
                  value={localDeliverySettings.extraChargePerKm ?? ''}
                  onChange={(e) =>
                    setLocalDeliverySettings({
                      ...localDeliverySettings,
                      extraChargePerKm: e.target.value
                        ? Math.max(0, parseFloat(e.target.value))
                        : null,
                    })
                  }
                  onBlur={() => setDeliverySettingsError('')} // Re-validate on blur
                  placeholder="e.g., 10"
                  style={{
                    ...styles.input,
                    ...(deliverySettingsError && profileStyles.inputError),
                  }}
                  disabled={isLoading}
                  min="0"
                  step="0.5"
                />
                <p style={styles.helpText}>
                  Charge per km beyond the free delivery radius. Enter 0 for no extra charge.
                </p>
              </div>
            </div>
            {deliverySettingsError && (
              <p style={profileStyles.validationError}>
                <AlertCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} /> Delivery settings error: {deliverySettingsError}
              </p>
            )}
          </div>
        )}

        {/* Combined Error Message */}
        {(globalError || formError) && (
          <div style={styles.errorMessage}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            {globalError || formError}
          </div>
        )}

        {/* Buttons */}
        <div style={profileStyles.buttonGroup}>
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={profileStyles.backButton}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            style={{
              ...styles.submitButton, // Using parent's submit button base style
              ...(!isFormValid && profileStyles.buttonDisabled),
              ...(isLoading && profileStyles.buttonDisabled),
              position: 'relative', // For spinner
            }}
          >
            {isLoading ? (
              <>
                <span style={profileStyles.spinner}></span>
                Saving...
              </>
            ) : (
              'Save and Continue'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// Re-using common profile styles for consistency
const profileStyles: { [key: string]: React.CSSProperties } = {
  stepSection: {
    marginBottom: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e5e7eb',
    position: 'relative',
  },

  stepHeader: { // Re-using from previous component for consistent header style
    display: 'flex',
    alignItems: 'center', // Align icon and title
    marginBottom: '1.5rem',
  },

  stepTitle: { // Re-using from previous component for consistent title style
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    display: 'flex', // Allow icon and text to align
    alignItems: 'center',
  },

  validationError: {
    fontSize: '0.85rem',
    color: '#ef4444',
    margin: '0.5rem 0 0 0',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },

  infoNote: {
    fontSize: '0.85rem',
    color: '#0284c7',
    margin: '1rem 0 0 0',
    fontStyle: 'italic',
    padding: '0.75rem',
    backgroundColor: '#eff6ff',
    borderRadius: '0.375rem',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },

  // Toggle Switch for Service Coverage
  toggleSwitch: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderRadius: '0.5rem',
    backgroundColor: '#e5e7eb',
    padding: '0.25rem',
    gap: '0.25rem',
    marginTop: '0.75rem',
  },
  toggleButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    textAlign: 'center',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#4b5563',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    color: '#4f46e5',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  toggleButtonInactive: {
    backgroundColor: 'transparent',
    color: '#6b7280',
  },
  toggleButtonHover: {
    backgroundColor: '#d1d5db',
    // color: '#1f2937',
  },


  // Pincode Input Group
  pincodeInputGroup: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.75rem',
    alignItems: 'stretch', // Ensure items stretch to fill container height
  },
  addButton: {
    padding: '0.75rem 1.25rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#10b981', // Green for add button
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexShrink: 0, // Prevent button from shrinking
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
    '&:hover': {
        backgroundColor: '#059669',
    },
  },

  // Service Area Tags (similar to multi-select tags)
  listContainer: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  listTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  serviceAreaTag: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 0.8rem',
    borderRadius: '9999px', // Pill shape
    border: '1px solid #d1d5db',
    backgroundColor: '#fefefe',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  tagContent: {
    marginRight: '0.5rem',
  },
  tagRemoveButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'color 0.2s ease-in-out',
    ':hover': {
        color: '#ef4444',
        backgroundColor: '#fee2e2',
    },
  },

  // Delivery Settings Grid
  deliveryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  deliveryFormGroup: { // Re-scoped formGroup for smaller elements within grid
    marginBottom: '0', // No bottom margin for these inner groups
  },
  inputError: {
    borderColor: '#ef4444', // Red border for error state
  },

  // General Button Styles
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end', // Aligned to right for primary action
    gap: '1rem',
    marginTop: '2.5rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.5rem',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    ':hover': {
      backgroundColor: '#f3f4f6',
      borderColor: '#9ca3af',
      boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    },
  },
  buttonDisabled: { // General disabled style
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    animation: 'spin 1s linear infinite', // Needs @keyframes spin in CSS
    display: 'inline-block',
    marginRight: '0.5rem',
    verticalAlign: 'middle',
  },
};
