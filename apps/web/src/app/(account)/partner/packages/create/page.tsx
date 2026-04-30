'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useCatererMenuItems } from '@catering-marketplace/query-client';

type Step = 'basic' | 'sections' | 'items' | 'pricing' | 'subscription' | 'review';

interface Section {
  id: string;
  name: string;
  selection_type: 'fixed' | 'single' | 'multi';
  min_select?: number;
  max_select?: number;
  items: SectionItem[];
}

interface SectionItem {
  itemId: string;
  priceOverride?: number;
}

interface PackageFormData {
  name: string;
  description: string;
  is_subscribable: boolean;
  sections: Section[];
  pricing: {
    base_price?: number;
    min_guests?: number;
    min_order_value?: number;
  };
  subscription?: {
    meal_types: string[];
    available_days: string[];
    allowed_frequencies: string[];
    min_duration_days: number;
    max_duration_days?: number;
    cutoff_hours: number;
  };
}

export default function CreatePackagePage() {
  const router = useRouter();
  const { data: menuItems = [] } = useCatererMenuItems();

  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [messages, setMessages] = useState({ error: '', success: '' });

  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    is_subscribable: false,
    sections: [],
    pricing: {},
    subscription: {
      meal_types: [],
      available_days: [],
      allowed_frequencies: [],
      min_duration_days: 7,
      cutoff_hours: 24,
    },
  });

  const [newSection, setNewSection] = useState({
    name: '',
    selection_type: 'single' as const,
    min_select: 1,
    max_select: 1,
  });

  const [selectedSectionForItems, setSelectedSectionForItems] = useState<string>('');
  const [selectedItemsForSection, setSelectedItemsForSection] = useState<string[]>([]);

  // Step navigation
  const steps: Step[] = formData.is_subscribable 
    ? ['basic', 'sections', 'items', 'subscription', 'review']
    : ['basic', 'sections', 'items', 'pricing', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  const goToStep = (step: Step) => {
    setMessages({ error: '', success: '' });
    setCurrentStep(step);
  };

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      goToStep(steps[currentStepIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      goToStep(steps[currentStepIndex - 1]);
    }
  };

  // ============ STEP: BASIC INFO ============
  const validateBasicInfo = () => {
    if (!formData.name.trim()) {
      setMessages({ error: 'Package name is required', success: '' });
      return false;
    }
    if (!formData.is_subscribable && (!formData.pricing.base_price || !formData.pricing.min_guests)) {
      setMessages({ error: 'Enter base price and min guests', success: '' });
      return false;
    }
    return true;
  };

  // ============ STEP: SECTIONS ============
  const addSection = () => {
    if (!newSection.name.trim()) {
      setMessages({ error: 'Section name is required', success: '' });
      return;
    }

    if (formData.is_subscribable && newSection.selection_type === 'multi') {
      if (newSection.min_select < 1) {
        setMessages({ error: 'Min selection must be at least 1', success: '' });
        return;
      }
      if (newSection.max_select < newSection.min_select) {
        setMessages({ error: 'Max selection must be >= min selection', success: '' });
        return;
      }
    }

    if (!formData.is_subscribable && newSection.selection_type === 'multi') {
      if (newSection.min_select < 1) {
        setMessages({ error: 'Min selection must be at least 1', success: '' });
        return;
      }
      if (newSection.max_select < newSection.min_select) {
        setMessages({ error: 'Max selection must be >= min selection', success: '' });
        return;
      }
    }

    const section: Section = {
      id: `section_${Date.now()}`,
      name: newSection.name,
      selection_type: newSection.selection_type,
      items: [],
    };

    if (newSection.selection_type === 'multi') {
      section.min_select = newSection.min_select;
      section.max_select = newSection.max_select;
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, section],
    }));

    setNewSection({ name: '', selection_type: 'single', min_select: 1, max_select: 1 });
    setMessages({ error: '', success: 'Section added!' });
    setTimeout(() => setMessages({ error: '', success: '' }), 2000);
  };

  const deleteSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    if (selectedSectionForItems === sectionId) {
      setSelectedSectionForItems('');
      setSelectedItemsForSection([]);
    }
  };

  // ============ STEP: ITEMS ============
  const currentSectionForItems = formData.sections.find(
    (s) => s.id === selectedSectionForItems
  );

  const toggleItemForSection = (itemId: string) => {
    setSelectedItemsForSection((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const addItemsToSection = () => {
    if (!currentSectionForItems) {
      setMessages({ error: 'No section selected', success: '' });
      return;
    }

    if (selectedItemsForSection.length === 0) {
      setMessages({ error: 'Select at least one item', success: '' });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === currentSectionForItems.id
          ? {
              ...s,
              items: [
                ...new Set([
                  ...s.items.map((i) => i.itemId),
                  ...selectedItemsForSection,
                ]),
              ].map((itemId) => ({
                itemId,
              })),
            }
          : s
      ),
    }));

    setSelectedItemsForSection([]);
    setMessages({ error: '', success: 'Items added to section!' });
    setTimeout(() => setMessages({ error: '', success: '' }), 2000);
  };

  const removeItemFromSection = (itemId: string) => {
    if (!currentSectionForItems) return;

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === currentSectionForItems.id
          ? { ...s, items: s.items.filter((i) => i.itemId !== itemId) }
          : s
      ),
    }));
  };

  // ============ STEP: SUBSCRIPTION ============
  const toggleMealType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription!,
        meal_types: prev.subscription!.meal_types.includes(type)
          ? prev.subscription!.meal_types.filter((t) => t !== type)
          : [...prev.subscription!.meal_types, type],
      },
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription!,
        available_days: prev.subscription!.available_days.includes(day)
          ? prev.subscription!.available_days.filter((d) => d !== day)
          : [...prev.subscription!.available_days, day],
      },
    }));
  };

  const toggleFrequency = (freq: string) => {
    setFormData((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription!,
        allowed_frequencies: prev.subscription!.allowed_frequencies.includes(freq)
          ? prev.subscription!.allowed_frequencies.filter((f) => f !== freq)
          : [...prev.subscription!.allowed_frequencies, freq],
      },
    }));
  };

  // ============ STEP: REVIEW ============
  const publishPackage = async () => {
    try {
      console.log('Publishing package:', formData);
      setMessages({ error: '', success: 'Package created successfully!' });
      setTimeout(() => router.push('/caterer/packages'), 2000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create package';
      setMessages({ error: msg, success: '' });
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => router.push('/caterer/packages')}
          style={styles.backButton}
        >
          <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
          Back
        </button>
        <h1 style={styles.pageTitle}>Create Package</h1>
        <div style={{ width: '60px' }} />
      </div>

      {/* Step Indicator */}
      <div style={styles.stepIndicator}>
        {steps.map((step, idx) => (
          <div key={step} style={styles.stepContainer}>
            <button
              onClick={() => goToStep(step)}
              style={{
                ...styles.stepDot,
                backgroundColor:
                  idx <= currentStepIndex ? '#2563eb' : '#e2e8f0',
                color: idx <= currentStepIndex ? 'white' : '#94a3b8',
              }}
            >
              {idx < currentStepIndex ? (
                <CheckIcon style={{ width: '16px', height: '16px' }} />
              ) : (
                idx + 1
              )}
            </button>
            <span
              style={{
                fontSize: '12px',
                color: idx <= currentStepIndex ? '#2563eb' : '#94a3b8',
                fontWeight: idx === currentStepIndex ? '600' : '400',
                marginTop: '8px',
                textAlign: 'center',
              }}
            >
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
            {idx < steps.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '100%',
                  width: '20px',
                  height: '2px',
                  backgroundColor: idx < currentStepIndex ? '#2563eb' : '#e2e8f0',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Messages */}
      {messages.error && <div style={styles.alertError}>{messages.error}</div>}
      {messages.success && <div style={styles.alertSuccess}>{messages.success}</div>}

      {/* Step Content */}
      <div style={styles.stepContent}>
        {/* STEP 1: BASIC INFO */}
        {currentStep === 'basic' && (
          <div>
            <h2 style={styles.stepTitle}>Basic Information</h2>
            <p style={styles.stepSubtitle}>Package name, description, and package type</p>

            <div style={styles.formGroup}>
              <label style={styles.label}>Package Name *</label>
              <input
                type="text"
                placeholder="e.g., Premium Lunch Box"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Describe your package..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Package Type *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type"
                    value="customizable"
                    checked={!formData.is_subscribable}
                    onChange={() => setFormData({ ...formData, is_subscribable: false })}
                    style={styles.radio}
                  />
                  Customizable - Customers pick items and choose quantity
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type"
                    value="subscription"
                    checked={formData.is_subscribable}
                    onChange={() => setFormData({ ...formData, is_subscribable: true })}
                    style={styles.radio}
                  />
                  Subscription - Recurring meal package
                </label>
              </div>
            </div>

            {!formData.is_subscribable && (
              <div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Base Price per Person *</label>
                    <div style={styles.priceInput}>
                      <span style={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.pricing.base_price || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: {
                              ...formData.pricing,
                              base_price: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        style={{ ...styles.input, paddingLeft: '32px' }}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Min Guests *</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={formData.pricing.min_guests || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            min_guests: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Min Order Value (Optional)</label>
                  <div style={styles.priceInput}>
                    <span style={styles.currencySymbol}>₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.pricing.min_order_value || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            min_order_value: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      style={{ ...styles.input, paddingLeft: '32px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SECTIONS */}
        {currentStep === 'sections' && (
          <div>
            <h2 style={styles.stepTitle}>Add Sections</h2>
            <p style={styles.stepSubtitle}>
              Sections are categories like Starters, Main Course, Desserts, etc.
            </p>

            {formData.sections.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={styles.sectionListTitle}>Sections Added</h3>
                {formData.sections.map((section) => (
                  <div key={section.id} style={styles.sectionListItem}>
                    <div>
                      <p style={styles.sectionItemName}>{section.name}</p>
                      <p style={styles.sectionItemMeta}>
                        {section.selection_type === 'fixed'
                          ? 'Fixed items'
                          : section.selection_type === 'single'
                          ? 'Choose 1 item'
                          : `Choose up to ${section.max_select} items`}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteSection(section.id)}
                      style={styles.deleteButton}
                    >
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.addSectionCard}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Section Name</label>
                <input
                  type="text"
                  placeholder="e.g., Starters, Main Course"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              {!formData.is_subscribable && (
                <div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Selection Type</label>
                    <select
                      value={newSection.selection_type}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          selection_type: e.target.value as any,
                        })
                      }
                      style={styles.input}
                    >
                      <option value="fixed">Fixed - Same for all</option>
                      <option value="single">Single - Choose 1</option>
                      <option value="multi">Multiple - Choose many</option>
                    </select>
                  </div>

                  {newSection.selection_type === 'multi' && (
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Max Select</label>
                        <input
                          type="number"
                          value={newSection.max_select}
                          onChange={(e) =>
                            setNewSection({
                              ...newSection,
                              max_select: parseInt(e.target.value),
                            })
                          }
                          style={styles.input}
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.is_subscribable && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Max Items per Day</label>
                  <input
                    type="number"
                    value={newSection.max_select}
                    onChange={(e) =>
                      setNewSection({
                        ...newSection,
                        max_select: parseInt(e.target.value),
                      })
                    }
                    style={styles.input}
                    min="1"
                  />
                </div>
              )}

              <button onClick={addSection} style={styles.buttonPrimary}>
                <PlusIcon style={{ width: '16px', height: '16px' }} />
                Add Section
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ADD ITEMS */}
        {currentStep === 'items' && (
          <div>
            <h2 style={styles.stepTitle}>Add Items to Sections</h2>
            <p style={styles.stepSubtitle}>Select menu items from your global menu</p>

            {formData.sections.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No sections yet</p>
                <p style={styles.emptyStateSubtext}>
                  Go back and add at least one section
                </p>
              </div>
            ) : (
              <div>
                {/* Section Selector */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Section to Add Items *</label>
                  <select
                    value={selectedSectionForItems}
                    onChange={(e) => {
                      setSelectedSectionForItems(e.target.value);
                      setSelectedItemsForSection([]);
                      setMessages({ error: '', success: '' });
                    }}
                    style={styles.input}
                  >
                    <option value="">Choose a section...</option>
                    {formData.sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name} ({section.items.length} items)
                      </option>
                    ))}
                  </select>
                </div>

                {currentSectionForItems && (
                  <div style={styles.itemsContainer}>
                    {/* Section Info Card */}
                    <div style={styles.sectionInfoCard}>
                      <div>
                        <p style={styles.sectionInfoTitle}>{currentSectionForItems.name}</p>
                        <p style={styles.sectionInfoMeta}>
                          {currentSectionForItems.selection_type === 'fixed'
                            ? 'Fixed items (same for all)'
                            : currentSectionForItems.selection_type === 'single'
                            ? 'Single item (choose 1)'
                            : `Multiple items (choose up to ${currentSectionForItems.max_select})`}
                        </p>
                      </div>
                      {currentSectionForItems.items.length > 0 && (
                        <span style={styles.itemCountBadge}>
                          {currentSectionForItems.items.length} items
                        </span>
                      )}
                    </div>

                    {/* Menu Items Grid */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                          Available Menu Items
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                          {menuItems.length} items available
                        </p>
                      </div>

                      {menuItems.length > 0 ? (
                        <div style={styles.itemsGrid}>
                          {menuItems.map((item) => (
                            <label
                              key={item.id}
                              style={{
                                ...styles.itemCard,
                                backgroundColor: selectedItemsForSection.includes(item.id)
                                  ? '#eff6ff'
                                  : 'white',
                                borderColor: selectedItemsForSection.includes(item.id)
                                  ? '#2563eb'
                                  : '#e2e8f0',
                                borderWidth: selectedItemsForSection.includes(item.id)
                                  ? '2px'
                                  : '1px',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedItemsForSection.includes(item.id)}
                                onChange={() => toggleItemForSection(item.id)}
                                style={styles.checkbox}
                              />
                              <div style={{ flex: 1 }}>
                                <p style={styles.itemName}>{item.name}</p>
                                {item.description && (
                                  <p style={styles.itemDescription}>{item.description}</p>
                                )}
                                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                  <span style={styles.itemTag}>
                                    {item.is_veg ? 'Veg' : 'Non-Veg'}
                                  </span>
                                  {item.spice_level && (
                                    <span style={styles.itemTag}>
                                      {item.spice_level === 'mild'
                                        ? 'Mild'
                                        : item.spice_level === 'medium'
                                        ? 'Medium'
                                        : 'Spicy'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span style={styles.itemPrice}>₹{item.price || 0}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div style={styles.emptyState}>
                          <p style={styles.emptyStateText}>No menu items created yet</p>
                          <p style={styles.emptyStateSubtext}>
                            Create menu items first before adding them to sections
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Already Added Items */}
                    {currentSectionForItems.items.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0, marginBottom: '12px' }}>
                          Items in This Section
                        </h3>
                        <div style={styles.addedItemsList}>
                          {currentSectionForItems.items.map((sectionItem) => {
                            const item = menuItems.find((m) => m.id === sectionItem.itemId);
                            return (
                              <div key={sectionItem.itemId} style={styles.addedItemRow}>
                                <div style={{ flex: 1 }}>
                                  <p style={styles.addedItemName}>{item?.name}</p>
                                  <p style={styles.addedItemPrice}>
                                    ₹{item?.price || 0}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeItemFromSection(sectionItem.itemId)}
                                  style={styles.removeItemButton}
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={addItemsToSection}
                        disabled={selectedItemsForSection.length === 0}
                        style={{
                          ...styles.buttonPrimary,
                          opacity: selectedItemsForSection.length === 0 ? 0.5 : 1,
                          cursor: selectedItemsForSection.length === 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <PlusIcon style={{ width: '16px', height: '16px' }} />
                        Add {selectedItemsForSection.length > 0 ? selectedItemsForSection.length : ''}{' '}
                        Selected Item{selectedItemsForSection.length !== 1 ? 's' : ''}
                      </button>

                      <button
                        onClick={() => router.push('/caterer/menu')}
                        style={styles.buttonSecondary}
                      >
                        Create New Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: PRICING (Only for Customizable) */}
        {currentStep === 'pricing' && !formData.is_subscribable && (
          <div>
            <h2 style={styles.stepTitle}>Configure Pricing</h2>
            <p style={styles.stepSubtitle}>Review and confirm your package pricing</p>

            <div style={styles.reviewCard}>
              <h3 style={styles.reviewTitle}>Customizable Package Pricing</h3>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Base Price per Person:</span>
                <span style={styles.reviewValue}>₹{formData.pricing.base_price || 'N/A'}</span>
              </div>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Min Guests:</span>
                <span style={styles.reviewValue}>{formData.pricing.min_guests || 'N/A'}</span>
              </div>
              {formData.pricing.min_order_value && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Min Order Value:</span>
                  <span style={styles.reviewValue}>
                    ₹{formData.pricing.min_order_value}
                  </span>
                </div>
              )}
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '16px', textAlign: 'center' }}>
              To change pricing, go back to the Basic Information step
            </p>
          </div>
        )}

        {/* STEP 4/5: SUBSCRIPTION (Only if subscribable) */}
        {currentStep === 'subscription' && formData.is_subscribable && (
          <div>
            <h2 style={styles.stepTitle}>Subscription Settings</h2>
            <p style={styles.stepSubtitle}>Configure when customers can subscribe to this package</p>

            <div style={styles.formGroup}>
              <label style={styles.label}>Meal Types *</label>
              <div style={styles.buttonGroup}>
                {['breakfast', 'lunch', 'dinner'].map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleMealType(type)}
                    style={{
                      ...styles.tagButton,
                      backgroundColor: formData.subscription?.meal_types.includes(type)
                        ? '#2563eb'
                        : '#e2e8f0',
                      color: formData.subscription?.meal_types.includes(type)
                        ? 'white'
                        : '#64748b',
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Available Days *</label>
              <div style={styles.buttonGroup}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day.toLowerCase())}
                    style={{
                      ...styles.tagButton,
                      backgroundColor: formData.subscription?.available_days.includes(
                        day.toLowerCase()
                      )
                        ? '#2563eb'
                        : '#e2e8f0',
                      color: formData.subscription?.available_days.includes(
                        day.toLowerCase()
                      )
                        ? 'white'
                        : '#64748b',
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Allowed Frequencies *</label>
              <div style={styles.buttonGroup}>
                {['daily', 'weekly'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => toggleFrequency(freq)}
                    style={{
                      ...styles.tagButton,
                      backgroundColor: formData.subscription?.allowed_frequencies.includes(
                        freq
                      )
                        ? '#2563eb'
                        : '#e2e8f0',
                      color: formData.subscription?.allowed_frequencies.includes(freq)
                        ? 'white'
                        : '#64748b',
                    }}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Min Duration (days) *</label>
                <input
                  type="number"
                  value={formData.subscription?.min_duration_days || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription: {
                        ...formData.subscription!,
                        min_duration_days: parseInt(e.target.value) || 7,
                      },
                    })
                  }
                  style={styles.input}
                  min="1"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Max Duration (Optional)</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={formData.subscription?.max_duration_days || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription: {
                        ...formData.subscription!,
                        max_duration_days: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      },
                    })
                  }
                  style={styles.input}
                  min="1"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Order Cutoff (hours before) *</label>
              <input
                type="number"
                value={formData.subscription?.cutoff_hours || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscription: {
                      ...formData.subscription!,
                      cutoff_hours: parseInt(e.target.value) || 24,
                    },
                  })
                }
                style={styles.input}
                min="1"
              />
            </div>
          </div>
        )}

        {/* STEP 5/6: REVIEW */}
        {currentStep === 'review' && (
          <div>
            <h2 style={styles.stepTitle}>Review & Publish</h2>
            <p style={styles.stepSubtitle}>Check everything before publishing your package</p>

            <div style={styles.reviewCard}>
              <h3 style={styles.reviewTitle}>Package Details</h3>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Name:</span>
                <span style={styles.reviewValue}>{formData.name}</span>
              </div>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Type:</span>
                <span style={styles.reviewValue}>
                  {formData.is_subscribable ? 'Subscription' : 'Customizable'}
                </span>
              </div>
              {formData.description && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Description:</span>
                  <span style={styles.reviewValue}>{formData.description}</span>
                </div>
              )}
            </div>

            <div style={styles.reviewCard}>
              <h3 style={styles.reviewTitle}>Sections & Items</h3>
              {formData.sections.length > 0 ? (
                formData.sections.map((section) => (
                  <div key={section.id} style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1e293b' }}>
                      {section.name}
                    </p>
                    <div style={{ marginLeft: '16px' }}>
                      {section.items.length > 0 ? (
                        section.items.map((sectionItem) => {
                          const item = menuItems.find((m) => m.id === sectionItem.itemId);
                          return (
                            <div
                              key={sectionItem.itemId}
                              style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                            >
                              {item?.name} - ₹{item?.price || 0}
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                          No items added
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>No sections added</p>
              )}
            </div>

            {!formData.is_subscribable && (
              <div style={styles.reviewCard}>
                <h3 style={styles.reviewTitle}>Pricing</h3>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Base Price per Person:</span>
                  <span style={styles.reviewValue}>
                    ₹{formData.pricing.base_price || 'N/A'}
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Min Guests:</span>
                  <span style={styles.reviewValue}>
                    {formData.pricing.min_guests || 'N/A'}
                  </span>
                </div>
                {formData.pricing.min_order_value && (
                  <div style={styles.reviewRow}>
                    <span style={styles.reviewLabel}>Min Order Value:</span>
                    <span style={styles.reviewValue}>
                      ₹{formData.pricing.min_order_value}
                    </span>
                  </div>
                )}
              </div>
            )}

            {formData.is_subscribable && formData.subscription && (
              <div style={styles.reviewCard}>
                <h3 style={styles.reviewTitle}>Subscription Details</h3>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Meal Types:</span>
                  <span style={styles.reviewValue}>
                    {formData.subscription.meal_types.length > 0
                      ? formData.subscription.meal_types
                          .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                          .join(', ')
                      : 'N/A'}
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Available Days:</span>
                  <span style={styles.reviewValue}>
                    {formData.subscription.available_days.length > 0
                      ? formData.subscription.available_days
                          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                          .join(', ')
                      : 'N/A'}
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Frequencies:</span>
                  <span style={styles.reviewValue}>
                    {formData.subscription.allowed_frequencies.length > 0
                      ? formData.subscription.allowed_frequencies
                          .map((f) => f.charAt(0).toUpperCase() + f.slice(1))
                          .join(', ')
                      : 'N/A'}
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Min Duration:</span>
                  <span style={styles.reviewValue}>
                    {formData.subscription.min_duration_days || 'N/A'} days
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Max Duration:</span>
                  <span style={styles.reviewValue}>
                    {formData.subscription.max_duration_days
                      ? `${formData.subscription.max_duration_days} days`
                      : 'No limit'}
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Order Cutoff:</span>
                  <span style={styles.reviewValue}>
                    {formData.subscription.cutoff_hours || 'N/A'} hours
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={publishPackage}
              style={{ ...styles.buttonPrimary, width: '100%', justifyContent: 'center', marginTop: '16px' }}
            >
              <CheckIcon style={{ width: '16px', height: '16px' }} />
              Publish Package
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={styles.footerNav}>
        <button
          onClick={goPrev}
          disabled={currentStepIndex === 0}
          style={{
            ...styles.buttonSecondary,
            opacity: currentStepIndex === 0 ? 0.5 : 1,
            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeftIcon style={{ width: '16px', height: '16px' }} />
          Previous
        </button>

        <button
          onClick={() => {
            if (currentStep === 'basic' && !validateBasicInfo()) return;
            goNext();
          }}
          disabled={currentStepIndex === steps.length - 1}
          style={{
            ...styles.buttonPrimary,
            opacity: currentStepIndex === steps.length - 1 ? 0.5 : 1,
            cursor: currentStepIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Next
          <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
}

// ============ STYLES ============
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    backgroundColor: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  backButton: {
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#2563eb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '600',
    fontSize: '14px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    position: 'relative',
    overflowX: 'auto' as const,
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    minWidth: '80px',
  },
  stepDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '32px',
    marginBottom: '24px',
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  stepSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: 'white',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  addSectionCard: {
    backgroundColor: '#f0f9ff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
  },
  sectionListTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  sectionListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '8px',
  },
  sectionItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  sectionItemMeta: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  deleteButton: {
    padding: '6px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
  },
  itemsContainer: {
    marginBottom: '24px',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  itemCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  itemDescription: {
    fontSize: '12px',
    color: '#64748b',
    margin: '2px 0 0 0',
    fontStyle: 'italic',
  },
  itemTag: {
    fontSize: '11px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    display: 'inline-block',
  },
  itemPrice: {
    fontSize: '12px',
    color: '#ea580c',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  priceInput: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  currencySymbol: {
    position: 'absolute' as const,
    left: '12px',
    fontSize: '14px',
    color: '#64748b',
    pointerEvents: 'none',
  },
  sectionInfoCard: {
    backgroundColor: '#f0f9ff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionInfoTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  sectionInfoMeta: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  itemCountBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  addedItemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  addedItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#d1fae5',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
  },
  addedItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#065f46',
    margin: 0,
  },
  addedItemPrice: {
    fontSize: '12px',
    color: '#047857',
    margin: 0,
    fontWeight: '500',
  },
  removeItemButton: {
    padding: '4px 8px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  tagButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px',
  },
  reviewTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  reviewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    marginBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
  },
  reviewLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #e2e8f0',
  },
  emptyStateText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  emptyStateSubtext: {
    fontSize: '13px',
    color: '#64748b',
    margin: '8px 0 0 0',
  },
  footerNav: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  alertError: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    color: '#7f1d1d',
    marginBottom: '16px',
    fontSize: '14px',
  },
  alertSuccess: {
    padding: '12px 16px',
    backgroundColor: '#d1fae5',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    color: '#065f46',
    marginBottom: '16px',
    fontSize: '14px',
  },
};