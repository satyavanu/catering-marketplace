'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

interface PackageItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price?: number;
}

interface PackageCategory {
  name: string;
  label: string;
  minSelect: number;
  maxSelect: number;
  items: PackageItem[];
  defaults?: string[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface Package {
  id: string;
  name: string;
  basePrice: number;
  minGuests: number;
  maxGuests: number;
  description: string;
  isCustomizable: boolean;
  extraItemPrice?: number; // Price per extra item if customizable
  categories?: PackageCategory[];
  addOns?: AddOn[];
  fixedItems?: string[]; // For non-customizable packages
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  caterer: any;
  packages?: Package[];
}

const defaultPackages: Package[] = [
  {
    id: 'pkg_1',
    name: 'Premium Package',
    basePrice: 250,
    minGuests: 50,
    maxGuests: 500,
    description: 'Full customization with premium selections',
    isCustomizable: true,
    extraItemPrice: 25,
    categories: [
      {
        name: 'starters',
        label: 'Starters',
        minSelect: 0,
        maxSelect: 3,
        defaults: ['ps1', 'ps2'],
        items: [
          { id: 'ps1', name: 'Paneer Tikka', category: 'starters' },
          { id: 'ps2', name: 'Veg Spring Roll', category: 'starters' },
          { id: 'ps3', name: 'Hara Bhara Kebab', category: 'starters' },
          { id: 'ps4', name: 'Samosa', category: 'starters' },
        ],
      },
      {
        name: 'main_course',
        label: 'Main Course',
        minSelect: 1,
        maxSelect: 5,
        defaults: ['pm1', 'pm2'],
        items: [
          { id: 'pm1', name: 'Dal Makhani', category: 'main_course' },
          { id: 'pm2', name: 'Paneer Butter Masala', category: 'main_course' },
          { id: 'pm3', name: 'Biryani', category: 'main_course' },
          { id: 'pm4', name: 'Rogan Josh', category: 'main_course' },
        ],
      },
      {
        name: 'desserts',
        label: 'Desserts',
        minSelect: 0,
        maxSelect: 2,
        defaults: ['pd1'],
        items: [
          { id: 'pd1', name: 'Gulab Jamun', category: 'desserts' },
          { id: 'pd2', name: 'Kheer', category: 'desserts' },
          { id: 'pd3', name: 'Gajar Ka Halwa', category: 'desserts' },
        ],
      },
    ],
    addOns: [
      { id: 'ao1', name: 'Live Counter Service', price: 50 },
      { id: 'ao2', name: 'Extra Dessert Package', price: 75 },
      { id: 'ao3', name: 'Beverage Package', price: 100 },
    ],
  },
  {
    id: 'pkg_2',
    name: 'Standard Package',
    basePrice: 150,
    minGuests: 30,
    maxGuests: 300,
    description: 'Basic selections with essential items',
    isCustomizable: true,
    extraItemPrice: 20,
    categories: [
      {
        name: 'starters',
        label: 'Starters',
        minSelect: 0,
        maxSelect: 2,
        defaults: ['ps1'],
        items: [
          { id: 'ps1', name: 'Paneer Tikka', category: 'starters' },
          { id: 'ps2', name: 'Veg Spring Roll', category: 'starters' },
          { id: 'ps3', name: 'Samosa', category: 'starters' },
        ],
      },
      {
        name: 'main_course',
        label: 'Main Course',
        minSelect: 1,
        maxSelect: 3,
        defaults: ['pm1'],
        items: [
          { id: 'pm1', name: 'Dal Makhani', category: 'main_course' },
          { id: 'pm2', name: 'Paneer Butter Masala', category: 'main_course' },
          { id: 'pm3', name: 'Biryani', category: 'main_course' },
        ],
      },
      {
        name: 'desserts',
        label: 'Desserts',
        minSelect: 0,
        maxSelect: 1,
        defaults: [],
        items: [
          { id: 'pd1', name: 'Gulab Jamun', category: 'desserts' },
          { id: 'pd2', name: 'Kheer', category: 'desserts' },
        ],
      },
    ],
    addOns: [
      { id: 'ao1', name: 'Live Counter Service', price: 50 },
      { id: 'ao3', name: 'Beverage Package', price: 100 },
    ],
  },
  {
    id: 'pkg_3',
    name: 'Budget Package',
    basePrice: 100,
    minGuests: 20,
    maxGuests: 200,
    description: 'Fixed menu - no customization available',
    isCustomizable: false,
    fixedItems: [
      'Paneer Tikka',
      'Veg Spring Roll',
      'Dal Makhani',
      'Paneer Butter Masala',
      'Naan',
      'Gulab Jamun',
    ],
    addOns: [
      { id: 'ao1', name: 'Live Counter Service', price: 50 },
    ],
  },
];

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  caterer,
  packages = defaultPackages,
}) => {
  // Reset state when modal closes
  const getInitialState = () => ({
    step: 1,
    selectedPackage: null as Package | null,
    guestCount: 100,
    selectedItems: {} as Record<string, string[]>,
    selectedAddOns: [] as string[],
    extraItemsCount: 0,
    contactForm: {
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      eventType: '',
      name: '',
      phone: '',
      email: '',
    },
    errors: {} as Record<string, string>,
    isSubmitted: false,
  });

  const [state, setState] = useState(getInitialState());

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setState(getInitialState());
    }
  }, [isOpen]);

  const {
    step,
    selectedPackage,
    guestCount,
    selectedItems,
    selectedAddOns,
    extraItemsCount,
    contactForm,
    errors,
    isSubmitted,
  } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const calculateEstimatedPrice = () => {
    if (!selectedPackage) return 0;
    const baseTotal = selectedPackage.basePrice * guestCount;
    const extraItemsTotal = extraItemsCount * (selectedPackage.extraItemPrice || 0) * guestCount;
    const addOnTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = selectedPackage.addOns?.find((a) => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return baseTotal + extraItemsTotal + addOnTotal;
  };

  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce((sum, items) => sum + items.length, 0);
  };

  const getTotalAllowedItems = () => {
    if (!selectedPackage || !selectedPackage.categories) return 0;
    return selectedPackage.categories.reduce((sum, cat) => sum + cat.maxSelect, 0);
  };

  const getExtraItemsCount = () => {
    if (!selectedPackage || !selectedPackage.categories) return 0;
    let extra = 0;
    selectedPackage.categories.forEach((cat) => {
      const selected = selectedItems[cat.name]?.length || 0;
      if (selected > cat.maxSelect) {
        extra += selected - cat.maxSelect;
      }
    });
    return extra;
  };

  const handleSelectPackage = (pkg: Package) => {
    if (!pkg.isCustomizable) {
      // Non-customizable package - skip to step 4
      updateState({
        selectedPackage: pkg,
        selectedItems: {},
        step: 4,
      });
    } else {
      // Customizable package - initialize with defaults
      const defaultItems: Record<string, string[]> = {};
      pkg.categories?.forEach((cat) => {
        defaultItems[cat.name] = cat.defaults || [];
      });

      updateState({
        selectedPackage: pkg,
        selectedItems: defaultItems,
        extraItemsCount: 0,
        step: 2,
      });
    }
  };

  const handleSelectItem = (categoryName: string, itemId: string) => {
    if (!selectedPackage || !selectedPackage.categories) return;

    updateState({
      selectedItems: ((prev) => {
        const categoryItems = prev[categoryName] || [];
        const category = selectedPackage.categories!.find((c) => c.name === categoryName);
        if (!category) return prev;

        if (categoryItems.includes(itemId)) {
          return {
            ...prev,
            [categoryName]: categoryItems.filter((id) => id !== itemId),
          };
        }

        return {
          ...prev,
          [categoryName]: [...categoryItems, itemId],
        };
      })(selectedItems),
    });

    // Update extra items count
    const extra = getExtraItemsCount();
    updateState({ extraItemsCount: extra });
  };

  const handleAddOnToggle = (addonId: string) => {
    updateState({
      selectedAddOns: selectedAddOns.includes(addonId)
        ? selectedAddOns.filter((id) => id !== addonId)
        : [...selectedAddOns, addonId],
    });
  };

  const handleContactChange = (field: string, value: string) => {
    updateState({
      contactForm: { ...contactForm, [field]: value },
      errors: {
        ...errors,
        [field]: undefined,
      },
    });
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 2) {
      // Item selection validation
      if (!selectedPackage || !selectedPackage.categories) return false;
      for (const category of selectedPackage.categories) {
        const selected = selectedItems[category.name]?.length || 0;
        if (selected < category.minSelect) {
          newErrors[category.name] = `Select at least ${category.minSelect} items`;
        }
      }
    } else if (stepNum === 6) {
      // Event details validation
      if (!contactForm.eventDate) newErrors.eventDate = 'Event date is required';
      if (!contactForm.eventLocation) newErrors.eventLocation = 'Location is required';
    } else if (stepNum === 7) {
      // Contact form validation
      if (!contactForm.name) newErrors.name = 'Name is required';
      if (!contactForm.phone) newErrors.phone = 'Phone is required';
      if (!contactForm.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
        newErrors.email = 'Invalid email';
      }
    }

    updateState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      updateState({ step: step + 1 });
    }
  };

  const handleBack = () => {
    if (step === 2) {
      updateState({ step: 1, selectedPackage: null, selectedItems: {}, selectedAddOns: [], extraItemsCount: 0 });
    } else if (step === 4 && selectedPackage && !selectedPackage.isCustomizable) {
      // Non-customizable package back to step 1
      updateState({ step: 1, selectedPackage: null, selectedItems: {}, selectedAddOns: [], extraItemsCount: 0 });
    } else {
      updateState({ step: step - 1 });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(7) || !selectedPackage) return;

    const payload = {
      caterer_id: caterer?.id,
      package_id: selectedPackage.id,
      selected_items: selectedPackage.isCustomizable ? selectedItems : {},
      add_ons: selectedAddOns,
      guests: guestCount,
      event_date: contactForm.eventDate,
      event_time: contactForm.eventTime,
      event_location: contactForm.eventLocation,
      event_type: contactForm.eventType,
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email,
      extra_items_count: extraItemsCount,
      estimated_price: calculateEstimatedPrice(),
    };

    console.log('Quote Request Payload:', payload);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateState({ isSubmitted: true });
  };

  if (!isOpen) return null;

  // Success Screen
  if (isSubmitted) {
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 49,
            animation: 'fadeIn 0.3s ease-out',
          }}
        />

        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '500px',
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
            zIndex: 50,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            animation: 'slideUp 0.3s ease-out',
            textAlign: 'center',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <XMarkIcon style={{ width: '24px', height: '24px' }} />
          </button>

          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircleIcon style={{ width: '48px', height: '48px', color: 'white' }} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827', margin: '0 0 1rem 0' }}>
            Request Sent! 🎉
          </h2>

          <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
            Your customized quote request for <strong>{selectedPackage?.name}</strong> has been sent to{' '}
            <strong>{caterer?.title}</strong>
          </p>

          <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>
              Estimated Cost
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', fontWeight: '900', color: '#2563eb' }}>
              ₹{calculateEstimatedPrice().toLocaleString('en-IN')}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
              for {guestCount} guests
            </p>
            {extraItemsCount > 0 && (
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#059669', fontWeight: '600' }}>
                + {extraItemsCount} extra item{extraItemsCount !== 1 ? 's' : ''} @ ₹{selectedPackage?.extraItemPrice}/person
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ede9fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                window.location.href = '/caterers';
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Browse More
            </button>
          </div>
        </div>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, -40%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </>
    );
  }

  const stepTitle = () => {
    if (step === 1) return '📦 Select Package';
    if (step === 2) return '🍽️ Customize Items';
    if (step === 3) return '➕ Add-ons';
    if (step === 4) return '👥 Guest Count';
    if (step === 5) return '🎯 Event Type';
    if (step === 6) return '📅 Event Details';
    if (step === 7) return '👤 Contact Info';
  };

  const getTotalSteps = () => {
    if (!selectedPackage) return 7;
    return selectedPackage.isCustomizable ? 7 : 6;
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 49,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          zIndex: 50,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#667eea', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
              Step {step} of {getTotalSteps()}
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              {stepTitle()}
            </h2>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <XMarkIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', backgroundColor: '#e5e7eb' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              width: `${(step / getTotalSteps()) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {/* Step 1: Select Package */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '1rem',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {!pkg.isCustomizable && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: '#f3f4f6',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#6b7280',
                      }}
                    >
                      <LockClosedIcon style={{ width: '12px', height: '12px' }} />
                      Fixed Menu
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                      {pkg.name}
                    </h3>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#667eea' }}>
                      ₹{pkg.basePrice}/person
                    </span>
                  </div>

                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                    {pkg.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                    <div>
                      <p style={{ margin: 0, color: '#6b7280', fontWeight: '600' }}>Guest Range</p>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontWeight: '700' }}>
                        {pkg.minGuests}–{pkg.maxGuests}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#6b7280', fontWeight: '600' }}>
                        {pkg.isCustomizable ? 'Customizable' : 'Fixed Menu'}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontWeight: '700' }}>
                        {pkg.isCustomizable && pkg.categories ? `${pkg.categories.length} categories` : `${pkg.fixedItems?.length || 0} items`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Customize Items (Only for customizable packages) */}
          {step === 2 && selectedPackage && selectedPackage.isCustomizable && selectedPackage.categories && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {selectedPackage.categories.map((category) => {
                const selected = selectedItems[category.name]?.length || 0;
                const hasError = errors[category.name];
                const canAddMore = selected < category.maxSelect;

                return (
                  <div key={category.name}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        {category.label}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: selected > 0 ? '#047857' : '#6b7280', fontWeight: '600', margin: 0 }}>
                        {selected}/{category.maxSelect} selected
                        {selected > category.maxSelect && (
                          <span style={{ color: '#dc2626', marginLeft: '0.5rem' }}>
                            +{selected - category.maxSelect} extra
                          </span>
                        )}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {category.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem(category.name, item.id)}
                          style={{
                            padding: '1rem',
                            border: selectedItems[category.name]?.includes(item.id) ? '2px solid #2563eb' : '1px solid #d1d5db',
                            backgroundColor: selectedItems[category.name]?.includes(item.id) ? '#eff6ff' : 'white',
                            borderRadius: '0.75rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedItems[category.name]?.includes(item.id)) {
                              e.currentTarget.style.borderColor = '#bfdbfe';
                              e.currentTarget.style.backgroundColor = '#f0f9ff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedItems[category.name]?.includes(item.id)) {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '0.375rem',
                              border: '2px solid #d1d5db',
                              backgroundColor: selectedItems[category.name]?.includes(item.id) ? '#2563eb' : 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {selectedItems[category.name]?.includes(item.id) && (
                              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>
                            )}
                          </div>
                          <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{item.name}</p>
                        </button>
                      ))}
                    </div>

                    {hasError && (
                      <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.75rem 0 0 0' }}>
                        ⚠️ {hasError}
                      </p>
                    )}
                  </div>
                );
              })}

              {extraItemsCount > 0 && (
                <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #f59e0b' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontWeight: '600' }}>
                    💡 You selected {extraItemsCount} extra item{extraItemsCount !== 1 ? 's' : ''}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#b45309' }}>
                    Additional cost: ₹{selectedPackage.extraItemPrice} per guest
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2 Alternative: Non-customizable package info */}
          {step === 2 && selectedPackage && !selectedPackage.isCustomizable && (
            <div>
              <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <LockClosedIcon style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
                    Fixed Menu
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                  This package comes with a curated selection of items. No customization available.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', margin: '0 0 1rem 0' }}>
                  📋 Menu Items
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {selectedPackage.fixedItems?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        borderLeft: '3px solid #667eea',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>
                        ✓ {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add-ons */}
          {step === 3 && selectedPackage && selectedPackage.addOns && selectedPackage.addOns.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
                Enhance your package with optional add-ons (all optional)
              </p>

              {selectedPackage.addOns.map((addon) => (
                <button
                  key={addon.id}
                  onClick={() => handleAddOnToggle(addon.id)}
                  style={{
                    padding: '1rem',
                    border: selectedAddOns.includes(addon.id) ? '2px solid #2563eb' : '1px solid #d1d5db',
                    backgroundColor: selectedAddOns.includes(addon.id) ? '#eff6ff' : 'white',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedAddOns.includes(addon.id)) {
                      e.currentTarget.style.borderColor = '#bfdbfe';
                      e.currentTarget.style.backgroundColor = '#f0f9ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedAddOns.includes(addon.id)) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '0.375rem',
                        border: '2px solid #d1d5db',
                        backgroundColor: selectedAddOns.includes(addon.id) ? '#2563eb' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {selectedAddOns.includes(addon.id) && (
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{addon.name}</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>
                    +₹{addon.price}
                  </p>
                </button>
              ))}

              <div style={{ marginTop: '1rem', backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#0c4a6e' }}>
                  Add-ons total: ₹{selectedAddOns.reduce((sum, id) => sum + (selectedPackage.addOns?.find((a) => a.id === id)?.price || 0), 0)}
                </p>
              </div>
            </div>
          )}

          {/* Step 3 Alternative: No add-ons available */}
          {step === 3 && selectedPackage && (!selectedPackage.addOns || selectedPackage.addOns.length === 0) && (
            <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                No add-ons available for this package
              </p>
            </div>
          )}

          {/* Step 4: Guest Count */}
          {step === 4 && selectedPackage && (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                <UsersIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} />
                Number of Guests
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                  onClick={() => updateState({ guestCount: Math.max(selectedPackage.minGuests, guestCount - 10) })}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <MinusIcon style={{ width: '20px', height: '20px' }} />
                </button>

                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => {
                    const val = Math.min(
                      selectedPackage.maxGuests,
                      Math.max(selectedPackage.minGuests, parseInt(e.target.value) || 0)
                    );
                    updateState({ guestCount: val });
                  }}
                  min={selectedPackage.minGuests}
                  max={selectedPackage.maxGuests}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    boxSizing: 'border-box',
                  }}
                />

                <button
                  onClick={() => updateState({ guestCount: Math.min(selectedPackage.maxGuests, guestCount + 10) })}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <PlusIcon style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#0c4a6e' }}>
                  Base cost: ₹{(selectedPackage.basePrice * guestCount).toLocaleString('en-IN')} ({guestCount} guests × ₹{selectedPackage.basePrice})
                </p>
              </div>

              {extraItemsCount > 0 && (
                <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534' }}>
                    Extra items: ₹{(extraItemsCount * (selectedPackage.extraItemPrice || 0) * guestCount).toLocaleString('en-IN')} ({extraItemsCount} items × ₹{selectedPackage.extraItemPrice} × {guestCount} guests)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Event Type (for customizable) or Step 5 for non-customizable */}
          {step === 5 && (
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '1rem' }}>
                🎉 What's your event?
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['Wedding', 'Birthday', 'Corporate', 'Anniversary'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleContactChange('eventType', type)}
                    style={{
                      padding: '1rem',
                      border: contactForm.eventType === type ? '2px solid #667eea' : '1px solid #d1d5db',
                      backgroundColor: contactForm.eventType === type ? '#ede9fe' : 'white',
                      color: contactForm.eventType === type ? '#667eea' : '#475569',
                      borderRadius: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (contactForm.eventType !== type) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (contactForm.eventType !== type) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {type === 'Wedding' && '💍'}
                    {type === 'Birthday' && '🎂'}
                    {type === 'Corporate' && '💼'}
                    {type === 'Anniversary' && '💕'}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Event Details */}
          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Event Date */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                  <CalendarIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} />
                  Event Date *
                </label>
                <input
                  type="date"
                  value={contactForm.eventDate}
                  onChange={(e) => handleContactChange('eventDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.eventDate ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.eventDate && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>{errors.eventDate}</p>}
              </div>

              {/* Event Time */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                  <ClockIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} />
                  Event Time (Optional)
                </label>
                <input
                  type="time"
                  value={contactForm.eventTime}
                  onChange={(e) => handleContactChange('eventTime', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Event Location */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                  <MapPinIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} />
                  Event Location *
                </label>
                <input
                  type="text"
                  placeholder="City, Venue"
                  value={contactForm.eventLocation}
                  onChange={(e) => handleContactChange('eventLocation', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.eventLocation ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.eventLocation && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>{errors.eventLocation}</p>}
              </div>
            </div>
          )}

          {/* Step 7: Contact Info */}
          {step === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#0c4a6e', fontWeight: '600' }}>
                  📦 {selectedPackage?.name}
                </p>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.25rem', fontWeight: '700', color: '#2563eb' }}>
                  ₹{calculateEstimatedPrice().toLocaleString('en-IN')}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                  {guestCount} guests {extraItemsCount > 0 && `• +${extraItemsCount} extra item${extraItemsCount !== 1 ? 's' : ''}`} • {selectedAddOns.length} add-on{selectedAddOns.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={contactForm.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.name ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.name && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={contactForm.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.phone ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.phone && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.email ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.email && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>{errors.email}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'grid',
            gridTemplateColumns: step === 1 ? '1fr' : '1fr 1fr',
            gap: '1rem',
          }}
        >
          {step > 1 && (
            <button
              onClick={handleBack}
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ede9fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              ← Back
            </button>
          )}

          <button
            onClick={step === getTotalSteps() ? handleSubmit : handleNext}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              gridColumn: step === 1 ? '1 / -1' : 'auto',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {step === getTotalSteps() ? 'Request Quote' : 'Next'}
            {step < getTotalSteps() && <ArrowRightIcon style={{ width: '18px', height: '18px' }} />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 640px) {
          div[style*="maxWidth: 600px"] {
            max-width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export { QuoteModal };