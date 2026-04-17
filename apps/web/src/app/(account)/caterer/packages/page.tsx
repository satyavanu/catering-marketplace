'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import {
  useCreateCollection,
  useCreateCollectionSection,
  useCreateItem,
  useCatererMenuItems,
  useCreateCatererMenuItem,
} from '@catering-marketplace/query-client';
import { useQueryClient } from '@tanstack/react-query';

type PackageStep = 'basic' | 'sections' | 'pricing' | 'subscription' | 'addons' | 'review';

interface Section {
  id: string;
  name: string;
  description: string;
  selection_type: 'fixed' | 'single' | 'multi';
  max_items_selectable: number;
  items: string[]; // item IDs
  additional_charge_type: 'none' | 'per_item' | 'percentage';
  additional_charge_amount: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  is_veg: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level: 'mild' | 'medium' | 'spicy' | '';
  pricing_type: string;
  price: number;
}

export default function CreatePackagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // API mutations
  const createPackageMutation = useCreateCollection();
  const createSectionMutation = useCreateCollectionSection();
  const createItemMutation = useCreateItem();
  const createGlobalItemMutation = useCreateCatererMenuItem();

  // Queries
  const { data: globalMenuItems = [] } = useCatererMenuItems();

  // Current step
  const [currentStep, setCurrentStep] = useState<PackageStep>('basic');

  // Package data
  const [packageData, setPackageData] = useState({
    name: '',
    description: '',
    type: 'fixed' as 'fixed' | 'customizable',
    is_subscribable: false,
    currency_code: 'INR',
  });

  // Sections data
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Current section being edited
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    description: '',
    selection_type: 'fixed' as 'fixed' | 'single' | 'multi',
    max_items_selectable: 1,
    additional_charge_type: 'none' as 'none' | 'per_item' | 'percentage',
    additional_charge_amount: 0,
  });

  // Global menu item creation
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [globalItemForm, setGlobalItemForm] = useState({
    name: '',
    description: '',
    image_url: '',
    is_veg: true,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: '' as 'mild' | 'medium' | 'spicy' | '',
    pricing_type: 'per_plate',
    price: 0,
    currency_code: 'INR',
  });

  // Item selection for section
  const [selectedSectionForItems, setSelectedSectionForItems] = useState<string | null>(null);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Pricing data
  const [pricingData, setPricingData] = useState({
    base_price: 0,
    min_guests: 2,
    min_order_value: 0,
  });

  // Subscription data
  const [subscriptionData, setSubscriptionData] = useState({
    meal_types: [] as ('breakfast' | 'lunch' | 'dinner')[],
    available_days: [] as string[],
    allowed_frequencies: [] as ('daily' | 'weekly')[],
    min_duration_days: 7,
    max_duration_days: 365,
    cutoff_hours: 24,
  });

  // Addons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: sectionForm.name,
      description: sectionForm.description,
      selection_type: sectionForm.selection_type,
      max_items_selectable: sectionForm.max_items_selectable,
      items: [],
      additional_charge_type: sectionForm.additional_charge_type,
      additional_charge_amount: sectionForm.additional_charge_amount,
    };

    if (editingSectionId) {
      setSections((prev) =>
        prev.map((s) => (s.id === editingSectionId ? { ...newSection, id: editingSectionId } : s))
      );
      setEditingSectionId(null);
    } else {
      setSections((prev) => [...prev, newSection]);
    }

    setSectionForm({
      name: '',
      description: '',
      selection_type: 'fixed',
      max_items_selectable: 1,
      additional_charge_type: 'none',
      additional_charge_amount: 0,
    });

    setSuccessMessage(
      editingSectionId ? 'Section updated successfully!' : 'Section added successfully!'
    );
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSuccessMessage('Section deleted');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const startEditSection = (section: Section) => {
    setSectionForm({
      name: section.name,
      description: section.description,
      selection_type: section.selection_type,
      max_items_selectable: section.max_items_selectable,
      additional_charge_type: section.additional_charge_type,
      additional_charge_amount: section.additional_charge_amount,
    });
    setEditingSectionId(section.id);
  };

  const addItemsToSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: [...new Set([...s.items, ...selectedItemIds])],
            }
          : s
      )
    );

    setSelectedSectionForItems(null);
    setSelectedItemIds([]);
    setItemSearchTerm('');
    setSuccessMessage(`Added ${selectedItemIds.length} item(s) to section!`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const removeItemFromSection = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i !== itemId) } : s
      )
    );
  };

  const createGlobalMenuItem = async () => {
    if (!globalItemForm.name.trim()) {
      setErrorMessage('Please enter item name');
      return;
    }

    try {
      const newItem = await createGlobalItemMutation.mutateAsync({
        name: globalItemForm.name,
        description: globalItemForm.description || undefined,
        image_url: globalItemForm.image_url || undefined,
        is_veg: globalItemForm.is_veg,
        is_vegan: globalItemForm.is_vegan,
        is_gluten_free: globalItemForm.is_gluten_free,
        spice_level: globalItemForm.spice_level || undefined,
        pricing_type: globalItemForm.pricing_type,
        price: globalItemForm.price || undefined,
        currency_code: globalItemForm.currency_code,
      });

      await queryClient.refetchQueries({
        queryKey: ['catererMenuItems'],
        type: 'active',
      });

      if (newItem?.id && selectedSectionForItems) {
        setSelectedItemIds((prev) => [...prev, newItem.id]);
      }

      setGlobalItemForm({
        name: '',
        description: '',
        image_url: '',
        is_veg: true,
        is_vegan: false,
        is_gluten_free: false,
        spice_level: '',
        pricing_type: 'per_plate',
        price: 0,
        currency_code: 'INR',
      });
      setShowCreateItemModal(false);
      setSuccessMessage('Menu item created!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create item';
      setErrorMessage(msg);
    }
  };

  const createPackageFlow = async () => {
    if (!packageData.name.trim()) {
      setErrorMessage('Please enter package name');
      return;
    }

    if (sections.length === 0) {
      setErrorMessage('Please add at least one section');
      return;
    }

    if (pricingData.base_price <= 0) {
      setErrorMessage('Please set a valid base price');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Create package
      const newPackage = await createPackageMutation.mutateAsync({
        name: packageData.name,
        description: packageData.description || undefined,
        type: packageData.type,
        is_subscribable: packageData.is_subscribable,
        base_price: pricingData.base_price,
        min_guests: pricingData.min_guests,
        currency_code: packageData.currency_code,
        pricing_type: packageData.type === 'fixed' ? 'per_person' : 'custom',
      });

      if (!newPackage?.id) throw new Error('Failed to create package');

      // Create sections with items
      for (const section of sections) {
        const newSection = await createSectionMutation.mutateAsync({
          collectionId: newPackage.id,
          data: {
            name: section.name,
            description: section.description || undefined,
            selection_type: section.selection_type,
            max_items_selectable: section.max_items_selectable,
            additional_charge_type: section.additional_charge_type,
            additional_charge_amount: section.additional_charge_amount,
          },
        });

        if (newSection?.id) {
          // Add items to section
          for (const itemId of section.items) {
            const globalItem = globalMenuItems.find((i) => i.id === itemId);
            if (globalItem) {
              await createItemMutation.mutateAsync({
                sectionId: newSection.id,
                data: {
                  name: globalItem.name,
                  description: globalItem.description || undefined,
                  is_veg: globalItem.is_veg,
                  is_vegan: globalItem.is_vegan,
                  is_gluten_free: globalItem.is_gluten_free,
                  spice_level: globalItem.spice_level || undefined,
                  pricing_type: globalItem.pricing_type,
                  price: globalItem.price,
                  currency_code: globalItem.currency_code,
                },
              });
            }
          }
        }
      }

      setSuccessMessage('Package created successfully!');
      setTimeout(() => router.push('/caterer/packages'), 2000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create package';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered items
  const filteredMenuItems = globalMenuItems.filter((item) =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  const currentSelectedSection = sections.find((s) => s.id === selectedSectionForItems);
  const getItemName = (itemId: string) =>
    globalMenuItems.find((i) => i.id === itemId)?.name || 'Unknown Item';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>
        <div>
          <h1 style={styles.pageTitle}>📦 Create New Package</h1>
          <p style={styles.pageSubtitle}>Build your catering package step by step</p>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && <div style={styles.alertError}>{errorMessage}</div>}
      {successMessage && <div style={styles.alertSuccess}>{successMessage}</div>}

      {/* Progress Steps */}
      <div style={styles.progressContainer}>
        {(['basic', 'sections', 'pricing', 'subscription', 'addons', 'review'] as const).map(
          (step, idx) => (
            <div key={step} style={styles.progressStep}>
              <div
                style={{
                  ...styles.stepCircle,
                  backgroundColor:
                    currentStep === step ? '#2563eb' : step < currentStep ? '#16a34a' : '#e2e8f0',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentStep(step)}
              >
                {step < currentStep ? (
                  <CheckIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                ) : (
                  <span style={{ color: step === currentStep ? 'white' : '#64748b' }}>
                    {idx + 1}
                  </span>
                )}
              </div>
              <span style={styles.stepLabel}>
                {step === 'basic'
                  ? 'Basic Info'
                  : step === 'sections'
                  ? 'Sections'
                  : step === 'pricing'
                  ? 'Pricing'
                  : step === 'subscription'
                  ? 'Subscription'
                  : step === 'addons'
                  ? 'Add-ons'
                  : 'Review'}
              </span>
            </div>
          )
        )}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* STEP 1: Basic Info */}
        {currentStep === 'basic' && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📋 Package Basic Information</h2>

            <div style={styles.formGroupSection}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Package Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Wedding Deluxe, Corporate Lunch"
                  value={packageData.name}
                  onChange={(e) => setPackageData({ ...packageData, name: e.target.value })}
                  style={styles.input}
                />
                <p style={styles.helperText}>Name your package</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe what's included in this package..."
                  value={packageData.description}
                  onChange={(e) =>
                    setPackageData({ ...packageData, description: e.target.value })
                  }
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                />
                <p style={styles.helperText}>Help customers understand your package</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Package Type *</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      checked={packageData.type === 'fixed'}
                      onChange={() => setPackageData({ ...packageData, type: 'fixed' })}
                      style={styles.radio}
                    />
                    🔒 Fixed (Same items for all)
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      checked={packageData.type === 'customizable'}
                      onChange={() => setPackageData({ ...packageData, type: 'customizable' })}
                      style={styles.radio}
                    />
                    🎨 Customizable (Customers choose items)
                  </label>
                </div>
                <p style={styles.helperText}>
                  Fixed = predefined items, Customizable = customers pick from sections
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={packageData.is_subscribable}
                    onChange={(e) =>
                      setPackageData({ ...packageData, is_subscribable: e.target.checked })
                    }
                    style={styles.checkbox}
                  />
                  <span>Available for Subscription Plans</span>
                </label>
                <p style={styles.helperText}>Allow customers to subscribe to this package</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Currency</label>
                <input
                  type="text"
                  placeholder="INR"
                  value={packageData.currency_code}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      currency_code: e.target.value.toUpperCase(),
                    })
                  }
                  style={styles.input}
                  maxLength={3}
                />
              </div>
            </div>

            <div style={styles.stepActions}>
              <button onClick={() => setCurrentStep('sections')} style={styles.buttonPrimary}>
                Next: Add Sections →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Sections */}
        {currentStep === 'sections' && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📂 Menu Sections</h2>
            <p style={styles.stepDescription}>
              Organize items into sections (e.g., Appetizers, Main Course, Desserts)
            </p>

            {/* Add Section Form */}
            <div style={styles.formGroupSection}>
              <h3 style={styles.formSectionTitle}>➕ {editingSectionId ? 'Edit' : 'Add'} Section</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Section Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Starters, Main Course"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  placeholder="e.g., Light appetizers to start"
                  value={sectionForm.description}
                  onChange={(e) =>
                    setSectionForm({ ...sectionForm, description: e.target.value })
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Selection Type *</label>
                  <select
                    value={sectionForm.selection_type}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        selection_type: e.target.value as 'fixed' | 'single' | 'multi',
                      })
                    }
                    style={styles.input}
                  >
                    <option value="fixed">Fixed (All items included)</option>
                    <option value="single">Choose 1 Item</option>
                    <option value="multi">Choose Multiple</option>
                  </select>
                </div>

                {sectionForm.selection_type !== 'fixed' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Max Items *</label>
                    <input
                      type="number"
                      min="1"
                      value={sectionForm.max_items_selectable}
                      onChange={(e) =>
                        setSectionForm({
                          ...sectionForm,
                          max_items_selectable: parseInt(e.target.value) || 1,
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Additional Charge Type</label>
                  <select
                    value={sectionForm.additional_charge_type}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        additional_charge_type: e.target.value as 'none' | 'per_item' | 'percentage',
                      })
                    }
                    style={styles.input}
                  >
                    <option value="none">No Charge</option>
                    <option value="per_item">Per Item</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                {sectionForm.additional_charge_type !== 'none' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      {sectionForm.additional_charge_type === 'per_item' ? 'Charge (₹)' : 'Charge (%)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sectionForm.additional_charge_amount}
                      onChange={(e) =>
                        setSectionForm({
                          ...sectionForm,
                          additional_charge_amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                <button onClick={addSection} style={styles.buttonPrimary}>
                  <PlusIcon style={{ width: '16px', height: '16px' }} />
                  {editingSectionId ? 'Update Section' : 'Add Section'}
                </button>
                {editingSectionId && (
                  <button
                    onClick={() => {
                      setEditingSectionId(null);
                      setSectionForm({
                        name: '',
                        description: '',
                        selection_type: 'fixed',
                        max_items_selectable: 1,
                        additional_charge_type: 'none',
                        additional_charge_amount: 0,
                      });
                    }}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Sections List */}
            {sections.length > 0 && (
              <div style={styles.sectionsList}>
                <h3 style={styles.subsectionTitle}>Your Sections</h3>
                {sections.map((section) => (
                  <div key={section.id} style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        style={styles.expandButton}
                      >
                        {expandedSections.includes(section.id) ? (
                          <ChevronUpIcon style={{ width: '20px', height: '20px' }} />
                        ) : (
                          <ChevronDownIcon style={{ width: '20px', height: '20px' }} />
                        )}
                      </button>
                      <div style={{ flex: 1 }}>
                        <p style={styles.sectionName}>{section.name}</p>
                        <p style={styles.sectionMeta}>
                          {section.items.length} items • {section.selection_type}
                        </p>
                      </div>
                      <button
                        onClick={() => startEditSection(section)}
                        style={styles.buttonIcon}
                      >
                        <PencilIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        style={styles.buttonIconDelete}
                      >
                        <TrashIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>

                    {expandedSections.includes(section.id) && (
                      <div style={styles.sectionContent}>
                        {section.items.length > 0 ? (
                          <div style={styles.itemsList}>
                            {section.items.map((itemId) => (
                              <div key={itemId} style={styles.itemRow}>
                                <span>• {getItemName(itemId)}</span>
                                <button
                                  onClick={() => removeItemFromSection(section.id, itemId)}
                                  style={styles.buttonIconDelete}
                                >
                                  <TrashIcon style={{ width: '14px', height: '14px' }} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={styles.emptyText}>No items added yet</p>
                        )}

                        <button
                          onClick={() => {
                            setSelectedSectionForItems(section.id);
                            setSelectedItemIds([]);
                          }}
                          style={styles.addItemButton}
                        >
                          <PlusIcon style={{ width: '16px', height: '16px' }} />
                          Add Items to {section.name}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Select Items Modal */}
            {selectedSectionForItems && (
              <div style={styles.modalOverlay}>
                <div style={{ ...styles.modal, maxWidth: '700px' }}>
                  <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>
                      🍛 Add Items to {currentSelectedSection?.name}
                    </h2>
                    <button
                      onClick={() => setSelectedSectionForItems(null)}
                      style={styles.modalCloseButton}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={styles.modalContent}>
                    <div style={styles.searchContainer}>
                      <div style={styles.searchInputWrapper}>
                        <MagnifyingGlassIcon
                          style={{ width: '16px', height: '16px', color: '#94a3b8' }}
                        />
                        <input
                          type="text"
                          placeholder="Search menu items..."
                          value={itemSearchTerm}
                          onChange={(e) => setItemSearchTerm(e.target.value)}
                          style={styles.searchInput}
                        />
                      </div>
                      <button
                        onClick={() => setShowCreateItemModal(true)}
                        style={{ ...styles.buttonPrimary, whiteSpace: 'nowrap' }}
                      >
                        <PlusIcon style={{ width: '16px', height: '16px' }} />
                        New Item
                      </button>
                    </div>

                    <div style={styles.itemsContainer}>
                      {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              ...styles.itemCheckbox,
                              backgroundColor: selectedItemIds.includes(item.id)
                                ? '#eff6ff'
                                : 'white',
                              borderColor: selectedItemIds.includes(item.id)
                                ? '#2563eb'
                                : '#e2e8f0',
                            }}
                            onClick={() => {
                              setSelectedItemIds((prev) =>
                                prev.includes(item.id)
                                  ? prev.filter((id) => id !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedItemIds.includes(item.id)}
                              onChange={() => {}}
                              style={styles.checkbox}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div style={styles.itemContent}>
                              <p style={styles.itemName}>{item.name}</p>
                              <div style={styles.itemMetaTags}>
                                <span style={styles.itemTag}>
                                  {item.is_veg ? '🥬 Veg' : '🍖 Non-Veg'}
                                </span>
                                {item.is_vegan && <span style={styles.itemTag}>🌱 Vegan</span>}
                                {item.is_gluten_free && <span style={styles.itemTag}>🌾 GF</span>}
                              </div>
                              {item.description && (
                                <p style={styles.itemDescription}>{item.description}</p>
                              )}
                              {item.price > 0 && (
                                <p style={styles.itemPrice}>₹{item.price}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={styles.emptyItems}>No items found</div>
                      )}
                    </div>

                    <p style={styles.selectedCount}>
                      {selectedItemIds.length} item{selectedItemIds.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      onClick={() => setSelectedSectionForItems(null)}
                      style={styles.buttonSecondary}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addItemsToSection(selectedSectionForItems)}
                      style={styles.buttonPrimary}
                      disabled={selectedItemIds.length === 0}
                    >
                      Add {selectedItemIds.length} Item{selectedItemIds.length !== 1 ? 's' : ''}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Create Item Modal */}
            {showCreateItemModal && (
              <div style={styles.modalOverlay}>
                <div style={{ ...styles.modal, maxWidth: '600px' }}>
                  <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>🍛 Create New Menu Item</h2>
                    <button
                      onClick={() => setShowCreateItemModal(false)}
                      style={styles.modalCloseButton}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={styles.modalContent}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Item Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Paneer Tikka"
                        value={globalItemForm.name}
                        onChange={(e) =>
                          setGlobalItemForm({ ...globalItemForm, name: e.target.value })
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Description</label>
                      <textarea
                        placeholder="Describe this item..."
                        value={globalItemForm.description}
                        onChange={(e) =>
                          setGlobalItemForm({ ...globalItemForm, description: e.target.value })
                        }
                        style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Type</label>
                        <div style={styles.radioGroup}>
                          <label style={styles.radioLabel}>
                            <input
                              type="radio"
                              checked={globalItemForm.is_veg}
                              onChange={() =>
                                setGlobalItemForm({
                                  ...globalItemForm,
                                  is_veg: true,
                                  is_vegan: false,
                                })
                              }
                              style={styles.radio}
                            />
                            🥬 Veg
                          </label>
                          <label style={styles.radioLabel}>
                            <input
                              type="radio"
                              checked={!globalItemForm.is_veg}
                              onChange={() =>
                                setGlobalItemForm({ ...globalItemForm, is_veg: false })
                              }
                              style={styles.radio}
                            />
                            🍖 Non-Veg
                          </label>
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Spice Level</label>
                        <select
                          value={globalItemForm.spice_level}
                          onChange={(e) =>
                            setGlobalItemForm({
                              ...globalItemForm,
                              spice_level: e.target.value as 'mild' | 'medium' | 'spicy' | '',
                            })
                          }
                          style={styles.input}
                        >
                          <option value="">Not specified</option>
                          <option value="mild">🌶️ Mild</option>
                          <option value="medium">🌶️🌶️ Medium</option>
                          <option value="spicy">🌶️🌶️🌶️ Spicy</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.checkboxGrid}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={globalItemForm.is_vegan}
                          onChange={(e) =>
                            setGlobalItemForm({
                              ...globalItemForm,
                              is_vegan: e.target.checked,
                            })
                          }
                          style={styles.checkbox}
                        />
                        🌱 Vegan
                      </label>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={globalItemForm.is_gluten_free}
                          onChange={(e) =>
                            setGlobalItemForm({
                              ...globalItemForm,
                              is_gluten_free: e.target.checked,
                            })
                          }
                          style={styles.checkbox}
                        />
                        🌾 Gluten Free
                      </label>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Pricing Type *</label>
                        <select
                          value={globalItemForm.pricing_type}
                          onChange={(e) =>
                            setGlobalItemForm({
                              ...globalItemForm,
                              pricing_type: e.target.value,
                            })
                          }
                          style={styles.input}
                        >
                          <option value="included">Included</option>
                          <option value="per_plate">Per Plate</option>
                          <option value="per_person">Per Person</option>
                          <option value="extra">Extra Charge</option>
                        </select>
                      </div>

                      {globalItemForm.pricing_type !== 'included' && (
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Price *</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={globalItemForm.price}
                            onChange={(e) =>
                              setGlobalItemForm({
                                ...globalItemForm,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            style={styles.input}
                            step="0.01"
                            min="0"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      onClick={() => setShowCreateItemModal(false)}
                      style={styles.buttonSecondary}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createGlobalMenuItem}
                      style={styles.buttonPrimary}
                      disabled={createGlobalItemMutation.isPending}
                    >
                      {createGlobalItemMutation.isPending ? '⏳ Creating...' : 'Create Item'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.stepActions}>
              <button onClick={() => setCurrentStep('basic')} style={styles.buttonSecondary}>
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('pricing')}
                style={styles.buttonPrimary}
                disabled={sections.length === 0}
              >
                Next: Pricing →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing */}
        {currentStep === 'pricing' && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>💰 Pricing</h2>

            <div style={styles.formGroupSection}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Base Price Per Person *</label>
                <input
                  type="number"
                  placeholder="500"
                  value={pricingData.base_price}
                  onChange={(e) =>
                    setPricingData({
                      ...pricingData,
                      base_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  style={styles.input}
                  step="0.01"
                  min="0"
                />
                <p style={styles.helperText}>Price per person for this package</p>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Minimum Guests *</label>
                  <input
                    type="number"
                    placeholder="2"
                    value={pricingData.min_guests}
                    onChange={(e) =>
                      setPricingData({
                        ...pricingData,
                        min_guests: parseInt(e.target.value) || 2,
                      })
                    }
                    style={styles.input}
                    min="1"
                  />
                  <p style={styles.helperText}>Minimum number of guests required</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Minimum Order Value</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={pricingData.min_order_value}
                    onChange={(e) =>
                      setPricingData({
                        ...pricingData,
                        min_order_value: parseFloat(e.target.value) || 0,
                      })
                    }
                    style={styles.input}
                    step="0.01"
                    min="0"
                  />
                  <p style={styles.helperText}>Minimum total order value (if any)</p>
                </div>
              </div>
            </div>

            <div style={styles.stepActions}>
              <button onClick={() => setCurrentStep('sections')} style={styles.buttonSecondary}>
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('subscription')}
                style={styles.buttonPrimary}
              >
                Next: Subscription →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Subscription */}
        {currentStep === 'subscription' && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📅 Subscription Configuration (Optional)</h2>
            <p style={styles.stepDescription}>
              Configure this only if "Available for Subscription" was enabled
            </p>

            {packageData.is_subscribable ? (
              <div style={styles.formGroupSection}>
                <h3 style={styles.formSectionTitle}>Meal Types</h3>
                <div style={styles.checkboxGrid}>
                  {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                    <label key={meal} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={subscriptionData.meal_types.includes(meal)}
                        onChange={(e) =>
                          setSubscriptionData({
                            ...subscriptionData,
                            meal_types: e.target.checked
                              ? [...subscriptionData.meal_types, meal]
                              : subscriptionData.meal_types.filter((m) => m !== meal),
                          })
                        }
                        style={styles.checkbox}
                      />
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </label>
                  ))}
                </div>

                <h3 style={styles.formSectionTitle} style={{ marginTop: '24px' }}>
                  Available Days
                </h3>
                <div style={styles.checkboxGrid}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <label key={day} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={subscriptionData.available_days.includes(day)}
                        onChange={(e) =>
                          setSubscriptionData({
                            ...subscriptionData,
                            available_days: e.target.checked
                              ? [...subscriptionData.available_days, day]
                              : subscriptionData.available_days.filter((d) => d !== day),
                          })
                        }
                        style={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>

                <h3 style={styles.formSectionTitle} style={{ marginTop: '24px' }}>
                  Allowed Frequencies
                </h3>
                <div style={styles.checkboxGrid}>
                  {(['daily', 'weekly'] as const).map((freq) => (
                    <label key={freq} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={subscriptionData.allowed_frequencies.includes(freq)}
                        onChange={(e) =>
                          setSubscriptionData({
                            ...subscriptionData,
                            allowed_frequencies: e.target.checked
                              ? [...subscriptionData.allowed_frequencies, freq]
                              : subscriptionData.allowed_frequencies.filter((f) => f !== freq),
                          })
                        }
                        style={styles.checkbox}
                      />
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </label>
                  ))}
                </div>

                <div style={styles.formRow} style={{ marginTop: '24px' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Minimum Duration (Days)</label>
                    <input
                      type="number"
                      value={subscriptionData.min_duration_days}
                      onChange={(e) =>
                        setSubscriptionData({
                          ...subscriptionData,
                          min_duration_days: parseInt(e.target.value) || 7,
                        })
                      }
                      style={styles.input}
                      min="1"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Maximum Duration (Days)</label>
                    <input
                      type="number"
                      value={subscriptionData.max_duration_days}
                      onChange={(e) =>
                        setSubscriptionData({
                          ...subscriptionData,
                          max_duration_days: parseInt(e.target.value) || 365,
                        })
                      }
                      style={styles.input}
                      min="1"
                    />
                  </div>
                </div>

                <div style={styles.formGroup} style={{ marginTop: '16px' }}>
                  <label style={styles.label}>Order Cutoff (Hours Before)</label>
                  <input
                    type="number"
                    value={subscriptionData.cutoff_hours}
                    onChange={(e) =>
                      setSubscriptionData({
                        ...subscriptionData,
                        cutoff_hours: parseInt(e.target.value) || 24,
                      })
                    }
                    style={styles.input}
                    min="1"
                  />
                  <p style={styles.helperText}>
                    e.g., 24 = customers must order 24 hours in advance
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  ...styles.formGroupSection,
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                }}
              >
                <p style={{ color: '#0c4a6e' }}>
                  ℹ️ Subscription is not enabled for this package. Enable it in Step 1 to configure
                  subscription settings.
                </p>
              </div>
            )}

            <div style={styles.stepActions}>
              <button onClick={() => setCurrentStep('pricing')} style={styles.buttonSecondary}>
                ← Back
              </button>
              <button onClick={() => setCurrentStep('review')} style={styles.buttonPrimary}>
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review */}
        {currentStep === 'review' && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>✅ Review Your Package</h2>

            {/* Package Info */}
            <div style={styles.reviewSection}>
              <h3 style={styles.reviewTitle}>📦 Package Information</h3>
              <div style={styles.reviewContent}>
                <p>
                  <strong>Name:</strong> {packageData.name}
                </p>
                <p>
                  <strong>Type:</strong>{' '}
                  {packageData.type === 'fixed' ? '🔒 Fixed' : '🎨 Customizable'}
                </p>
                <p>
                  <strong>Subscribable:</strong> {packageData.is_subscribable ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            </div>

            {/* Sections Review */}
            <div style={styles.reviewSection}>
              <h3 style={styles.reviewTitle}>📂 Sections ({sections.length})</h3>
              {sections.map((section) => (
                <div key={section.id} style={styles.reviewContent}>
                  <p>
                    <strong>{section.name}</strong>
                  </p>
                  <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                    <li>Selection: {section.selection_type}</li>
                    <li>Items: {section.items.length}</li>
                    {section.additional_charge_type !== 'none' && (
                      <li>
                        Charge: {section.additional_charge_type === 'per_item' ? '₹' : ''}
                        {section.additional_charge_amount}
                        {section.additional_charge_type === 'percentage' ? '%' : ''}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            {/* Pricing Review */}
            <div style={styles.reviewSection}>
              <h3 style={styles.reviewTitle}>💰 Pricing</h3>
              <div style={styles.reviewContent}>
                <p>
                  <strong>Base Price:</strong> ₹{pricingData.base_price} per person
                </p>
                <p>
                  <strong>Minimum Guests:</strong> {pricingData.min_guests}
                </p>
                {pricingData.min_order_value > 0 && (
                  <p>
                    <strong>Minimum Order Value:</strong> ₹{pricingData.min_order_value}
                  </p>
                )}
              </div>
            </div>

            {/* Create Button */}
            <div style={styles.stepActions}>
              <button onClick={() => setCurrentStep('subscription')} style={styles.buttonSecondary}>
                ← Back
              </button>
              <button
                onClick={createPackageFlow}
                style={{ ...styles.buttonPrimary, backgroundColor: '#16a34a' }}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Creating Package...' : '🚀 Create Package'}
              </button>
            </div>
          </div>
        )}
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
    gap: '24px',
    marginBottom: '32px',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  backButton: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    whiteSpace: 'nowrap' as const,
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  progressContainer: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    marginBottom: '32px',
    overflowX: 'auto' as const,
    padding: '16px 0',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  stepLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
  },
  mainContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepContent: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  stepDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    marginBottom: '24px',
  },
  formGroupSection: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  formSectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: '#64748b',
    margin: 0,
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    marginBottom: '16px',
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
    boxSizing: 'border-box' as const,
  },
  helperText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  radio: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  sectionsList: {
    marginBottom: '24px',
  },
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '16px',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  expandButton: {
    padding: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
  },
  sectionName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  sectionMeta: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  buttonIcon: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  buttonIconDelete: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  sectionContent: {
    padding: '16px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '12px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1e293b',
  },
  emptyText: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: 0,
    marginBottom: '12px',
  },
  addItemButton: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
    backgroundColor: 'white',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  modalCloseButton: {
    padding: '4px 8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '20px',
  },
  modalContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    display: 'flex',
    gap: '8px',
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '350px',
    overflowY: 'auto' as const,
    marginBottom: '12px',
  },
  itemCheckbox: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    marginBottom: '6px',
  },
  itemMetaTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
    marginBottom: '6px',
  },
  itemTag: {
    fontSize: '11px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    padding: '2px 6px',
    borderRadius: '3px',
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: '12px',
    color: '#ea580c',
    margin: '4px 0 0 0',
    fontWeight: '600',
  },
  emptyItems: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#94a3b8',
  },
  selectedCount: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
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
    transition: 'all 0.2s ease',
  },
  stepActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
  },
  reviewSection: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  reviewTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '12px',
  },
  reviewContent: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
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