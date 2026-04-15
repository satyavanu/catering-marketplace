'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  useCollection,
  useCollectionSections,
  useCreateCollectionSection,
  useUpdateSection,
  useDeleteSection,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  type MenuSection,
  type MenuItem,
} from '@catering-marketplace/query-client';
import { useQueryClient } from '@tanstack/react-query';

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;
  const queryClient = useQueryClient();

  // Real API queries
  const { data: packageData, isLoading: packageLoading } = useCollection(packageId);
  const { data: sections = [], isLoading: sectionsLoading } = useCollectionSections(packageId);
  
  const createSectionMutation = useCreateCollectionSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  // Local UI state
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [selectedSectionForDish, setSelectedSectionForDish] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for section
  const [sectionFormData, setSectionFormData] = useState({
    name: '',
    description: '',
    sort_order: 1,
    is_active: true,
    max_items_selectable: 1,
    additional_charge_type: 'none' as 'none' | 'per_item' | 'percentage',
    additional_charge_amount: '0',
    additional_charge_description: '',
  });

  // Form state for dish
  const [dishFormData, setDishFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_veg: true,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 'medium' as 'mild' | 'medium' | 'spicy',
    pricing_type: 'included' as 'included' | 'extra' | 'on_request',
    price: '0',
    currency_code: 'INR',
    sort_order: 1,
    is_active: true,
  });

  // Initialize expanded categories
  useEffect(() => {
    if (sections.length > 0) {
      setExpandedCategories(sections.map((s) => s.id));
    }
  }, [sections]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  // ============ SECTION HANDLERS ============
  const handleSaveSection = async () => {
    if (!sectionFormData.name.trim()) {
      setErrorMessage('Please enter section name');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editingSection) {
        await updateSectionMutation.mutateAsync({
          id: editingSection,
          data: {
            name: sectionFormData.name,
            description: sectionFormData.description || undefined,
            sort_order: sectionFormData.sort_order,
            is_active: sectionFormData.is_active,
            max_items_selectable: sectionFormData.max_items_selectable,
            additional_charge_type: sectionFormData.additional_charge_type,
            additional_charge_amount: 
              sectionFormData.additional_charge_type !== 'none' 
                ? parseFloat(sectionFormData.additional_charge_amount) 
                : 0,
            additional_charge_description: sectionFormData.additional_charge_description || undefined,
          },
        });
        setSuccessMessage('Menu Section updated successfully!');
      } else {
        await createSectionMutation.mutateAsync({
          collectionId: packageId,
          data: {
            name: sectionFormData.name,
            description: sectionFormData.description || undefined,
            sort_order: sectionFormData.sort_order,
            max_items_selectable: sectionFormData.max_items_selectable,
            additional_charge_type: sectionFormData.additional_charge_type,
            additional_charge_amount: 
              sectionFormData.additional_charge_type !== 'none' 
                ? parseFloat(sectionFormData.additional_charge_amount) 
                : 0,
            additional_charge_description: sectionFormData.additional_charge_description || undefined,
          },
        });
        setSuccessMessage('Menu Section created successfully!');
      }

      await queryClient.refetchQueries({
        queryKey: ['collectionSections', packageId],
        type: 'active',
      });

      setSectionFormData({
        name: '',
        description: '',
        sort_order: 1,
        is_active: true,
        max_items_selectable: 1,
        additional_charge_type: 'none',
        additional_charge_amount: '0',
        additional_charge_description: '',
      });
      setEditingSection(null);
      setShowAddSectionModal(false);

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save section';
      setErrorMessage(errorMsg);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section and all its items?')) return;

    try {
      await deleteSectionMutation.mutateAsync(sectionId);
      setSuccessMessage('Menu Section deleted successfully!');
      
      await queryClient.refetchQueries({
        queryKey: ['collectionSections', packageId],
        type: 'active',
      });

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete section';
      setErrorMessage(errorMsg);
    }
  };

  // ============ DISH HANDLERS ============
  const handleSaveDish = async () => {
    if (!dishFormData.name.trim() || !selectedSectionForDish) {
      setErrorMessage('Please fill required fields');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        name: dishFormData.name,
        description: dishFormData.description || undefined,
        image_url: dishFormData.image_url || undefined,
        is_veg: dishFormData.is_veg,
        is_vegan: dishFormData.is_vegan,
        is_gluten_free: dishFormData.is_gluten_free,
        spice_level: dishFormData.spice_level,
        pricing_type: dishFormData.pricing_type,
        price: dishFormData.pricing_type === 'included' ? undefined : parseFloat(dishFormData.price),
        currency_code: dishFormData.currency_code,
        sort_order: dishFormData.sort_order,
      };

      if (editingDish) {
        await updateItemMutation.mutateAsync({
          id: editingDish,
          data: {
            ...payload,
            is_active: dishFormData.is_active,
          },
        });
        setSuccessMessage('Dish updated successfully!');
      } else {
        await createItemMutation.mutateAsync({
          sectionId: selectedSectionForDish,
          data: payload,
        });
        setSuccessMessage('Dish created successfully!');
      }

      await queryClient.refetchQueries({
        queryKey: ['collectionSections', packageId],
        type: 'active',
      });

      setDishFormData({
        name: '',
        description: '',
        image_url: '',
        is_veg: true,
        is_vegan: false,
        is_gluten_free: false,
        spice_level: 'medium',
        pricing_type: 'included',
        price: '0',
        currency_code: 'INR',
        sort_order: 1,
        is_active: true,
      });
      setEditingDish(null);
      setSelectedSectionForDish(null);
      setShowAddDishModal(false);

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save dish';
      setErrorMessage(errorMsg);
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;

    try {
      await deleteItemMutation.mutateAsync(dishId);
      setSuccessMessage('Dish deleted successfully!');
      
      await queryClient.refetchQueries({
        queryKey: ['collectionSections', packageId],
        type: 'active',
      });

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete dish';
      setErrorMessage(errorMsg);
    }
  };

  const openAddSectionModal = () => {
    setSectionFormData({
      name: '',
      description: '',
      sort_order: (sections.length + 1) * 10,
      is_active: true,
      max_items_selectable: 1,
      additional_charge_type: 'none',
      additional_charge_amount: '0',
      additional_charge_description: '',
    });
    setEditingSection(null);
    setShowAddSectionModal(true);
    setErrorMessage('');
  };

  const openEditSectionModal = (section: MenuSection) => {
    setSectionFormData({
      name: section.name,
      description: section.description || '',
      sort_order: section.sort_order,
      is_active: section.is_active,
      max_items_selectable: (section.max_items_selectable as number) || 1,
      additional_charge_type: (section.additional_charge_type as 'none' | 'per_item' | 'percentage') || 'none',
      additional_charge_amount: (section.additional_charge_amount as number)?.toString() || '0',
      additional_charge_description: (section.additional_charge_description as string) || '',
    });
    setEditingSection(section.id);
    setShowAddSectionModal(true);
    setErrorMessage('');
  };

  const openAddDishModal = (sectionId: string) => {
    setSelectedSectionForDish(sectionId);
    setDishFormData({
      name: '',
      description: '',
      image_url: '',
      is_veg: true,
      is_vegan: false,
      is_gluten_free: false,
      spice_level: 'medium',
      pricing_type: 'included',
      price: '0',
      currency_code: 'INR',
      sort_order: 1,
      is_active: true,
    });
    setEditingDish(null);
    setShowAddDishModal(true);
    setErrorMessage('');
  };

  const openEditDishModal = (sectionId: string, dish: MenuItem) => {
    setSelectedSectionForDish(sectionId);
    setDishFormData({
      name: dish.name,
      description: dish.description || '',
      image_url: dish.image_url || '',
      is_veg: dish.is_veg,
      is_vegan: dish.is_vegan,
      is_gluten_free: dish.is_gluten_free,
      spice_level: dish.spice_level || 'medium',
      pricing_type: (dish.pricing_type as 'included' | 'extra' | 'on_request') || 'included',
      price: dish.price?.toString() || '0',
      currency_code: dish.currency_code || 'INR',
      sort_order: dish.sort_order,
      is_active: dish.is_active,
    });
    setEditingDish(dish.id);
    setShowAddDishModal(true);
    setErrorMessage('');
  };

  // Loading state
  if (packageLoading || sectionsLoading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#64748b' }}>Loading package details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!packageData) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#dc2626' }}>Package not found</p>
          <button
            onClick={() => router.back()}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>

        <div style={styles.headerContent}>
          <h1 style={styles.packageTitle}>📦 {packageData.name}</h1>
          <p style={styles.packageMeta}>
            {packageData.currency_code} {packageData.base_price} {packageData.pricing_type} | Min
            Guests: {packageData.min_guests}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button onClick={() => router.push(`/caterer/packages/${packageId}/edit`)} style={styles.buttonPrimary}>
            <PencilIcon style={{ width: '16px', height: '16px' }} />
            Edit Package
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            color: '#7f1d1d',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#d1fae5',
            borderRadius: '8px',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Add Menu Section Button */}
        <div style={styles.addSectionButtonContainer}>
          <button onClick={openAddSectionModal} style={styles.addSectionButton}>
            <PlusIcon style={{ width: '18px', height: '18px' }} />
            Add Menu Section
          </button>
          <p style={styles.sectionHint}>Organize your menu items into sections (e.g., Appetizers, Main Course, Desserts)</p>
        </div>

        {/* Sections List */}
        <div style={styles.sectionsList}>
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} style={styles.sectionCard}>
                {/* Section Header */}
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionTitleSection}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      style={styles.expandButton}
                    >
                      {expandedCategories.includes(section.id) ? (
                        <ChevronUpIcon style={{ width: '20px', height: '20px' }} />
                      ) : (
                        <ChevronDownIcon style={{ width: '20px', height: '20px' }} />
                      )}
                    </button>
                    <div style={styles.sectionInfo}>
                      <h3 style={styles.sectionName}>📂 {section.name}</h3>
                      <p style={styles.sectionDescription}>{section.description}</p>
                      
                      {/* Section Meta Info */}
                      <div style={styles.sectionMetaInfo}>
                        <span style={styles.metaBadge}>
                          📋 {section.items?.length || 0} items
                        </span>
                        {section.max_items_selectable && (
                          <span style={styles.metaBadge}>
                            🔢 Max selectable: {section.max_items_selectable}
                          </span>
                        )}
                        {section.additional_charge_type !== 'none' && (
                          <span style={styles.metaBadgeWarning}>
                            {section.additional_charge_type === 'per_item' 
                              ? `💰 +₹${section.additional_charge_amount} per item`
                              : `💰 +${section.additional_charge_amount}% charge`
                            }
                          </span>
                        )}
                        {!section.is_active && (
                          <span style={styles.metaBadgeDanger}>🔴 Inactive</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={styles.sectionActions}>
                    <button
                      onClick={() => openEditSectionModal(section)}
                      style={styles.buttonIcon}
                      title="Edit"
                    >
                      <PencilIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      style={styles.buttonIconDelete}
                      title="Delete"
                      disabled={deleteSectionMutation.isPending}
                    >
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>

                {/* Section Content - Expanded */}
                {expandedCategories.includes(section.id) && (
                  <div style={styles.sectionContent}>
                    {/* Dishes List */}
                    <div style={styles.dishesList}>
                      {section.items && section.items.length > 0 ? (
                        section.items
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((dish) => (
                            <div key={dish.id} style={styles.dishItem}>
                              <div style={styles.dishInfo}>
                                <div style={styles.dishNameSection}>
                                  <p style={styles.dishName}>• {dish.name}</p>
                                  <div style={styles.dishMeta}>
                                    <span style={styles.dishType}>
                                      {dish.is_veg ? '🥬' : '🍖'} {dish.is_veg ? 'Veg' : 'Non-Veg'}
                                    </span>
                                    <span style={styles.dishSpice}>
                                      {dish.spice_level === 'mild' && '🌶️'}
                                      {dish.spice_level === 'medium' && '🌶️🌶️'}
                                      {dish.spice_level === 'spicy' && '🌶️🌶️🌶️'}{' '}
                                      {dish.spice_level
                                        ? dish.spice_level.charAt(0).toUpperCase() +
                                          dish.spice_level.slice(1)
                                        : 'Medium'}
                                    </span>
                                    {dish.is_vegan && <span style={styles.dishVegan}>🌱 Vegan</span>}
                                    {dish.is_gluten_free && <span style={styles.dishGF}>🌾 GF</span>}
                                    {dish.pricing_type !== 'included' && dish.price && (
                                      <span style={styles.dishPrice}>
                                        +₹{dish.price}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {dish.description && (
                                  <p style={styles.dishDescription}>{dish.description}</p>
                                )}
                              </div>

                              <div style={styles.dishActions}>
                                <button
                                  onClick={() => openEditDishModal(section.id, dish)}
                                  style={styles.buttonIcon}
                                  title="Edit"
                                >
                                  <PencilIcon style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button
                                  onClick={() => handleDeleteDish(dish.id)}
                                  style={styles.buttonIconDelete}
                                  title="Delete"
                                  disabled={deleteItemMutation.isPending}
                                >
                                  <TrashIcon style={{ width: '16px', height: '16px' }} />
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p style={styles.emptyDishes}>No dishes added yet</p>
                      )}
                    </div>

                    {/* Add Dish Button */}
                    <button
                      onClick={() => openAddDishModal(section.id)}
                      style={styles.addDishButton}
                    >
                      <PlusIcon style={{ width: '16px', height: '16px' }} />
                      Add Dish to {section.name}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>No menu sections yet</p>
              <p style={styles.emptyStateSubtext}>Create your first section to organize menu items</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Menu Section Modal */}
      {showAddSectionModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, maxWidth: '600px' }}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingSection ? '✏️ Edit Menu Section' : '📂 Add Menu Section'}
              </h2>
              <button
                onClick={() => {
                  setShowAddSectionModal(false);
                  setEditingSection(null);
                }}
                style={styles.modalCloseButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              {/* Basic Info */}
              <div style={styles.formGroupSection}>
                <h3 style={styles.formSectionTitle}>📋 Basic Information</h3>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Section Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Appetizers, Main Course, Desserts"
                    value={sectionFormData.name}
                    onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
                    style={styles.input}
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                  />
                  <p style={styles.helperText}>Name of this menu section</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    placeholder="e.g., Starters and light bites to begin your meal..."
                    value={sectionFormData.description}
                    onChange={(e) =>
                      setSectionFormData({ ...sectionFormData, description: e.target.value })
                    }
                    style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                  />
                  <p style={styles.helperText}>Optional: Describe this section</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Sort Order</label>
                  <input
                    type="number"
                    value={sectionFormData.sort_order}
                    onChange={(e) =>
                      setSectionFormData({ ...sectionFormData, sort_order: parseInt(e.target.value) })
                    }
                    style={styles.input}
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                  />
                  <p style={styles.helperText}>Lower numbers appear first</p>
                </div>
              </div>

              {/* Selection Rules */}
              <div style={styles.formGroupSection}>
                <h3 style={styles.formSectionTitle}>🔢 Selection Rules</h3>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Maximum Items Selectable *</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={sectionFormData.max_items_selectable}
                    onChange={(e) =>
                      setSectionFormData({
                        ...sectionFormData,
                        max_items_selectable: parseInt(e.target.value) || 1,
                      })
                    }
                    style={styles.input}
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                    min="1"
                  />
                  <p style={styles.helperText}>
                    How many items can customers choose from this section? (e.g., 1 for main course, 2 for sides)
                  </p>
                </div>
              </div>

              {/* Additional Charges */}
              <div style={styles.formGroupSection}>
                <h3 style={styles.formSectionTitle}>💰 Additional Charges (Optional)</h3>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Additional Charge Type</label>
                  <select
                    value={sectionFormData.additional_charge_type}
                    onChange={(e) =>
                      setSectionFormData({
                        ...sectionFormData,
                        additional_charge_type: e.target.value as 'none' | 'per_item' | 'percentage',
                      })
                    }
                    style={styles.input}
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                  >
                    <option value="none">No Additional Charge</option>
                    <option value="per_item">Fixed Charge Per Item Selected</option>
                    <option value="percentage">Percentage Charge on Total</option>
                  </select>
                  <p style={styles.helperText}>
                    How should additional items in this section be charged?
                  </p>
                </div>

                {sectionFormData.additional_charge_type !== 'none' && (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        {sectionFormData.additional_charge_type === 'per_item' 
                          ? 'Charge Per Item (₹)' 
                          : 'Percentage (%)'}
                      </label>
                      <input
                        type="number"
                        placeholder={sectionFormData.additional_charge_type === 'per_item' ? '50' : '10'}
                        value={sectionFormData.additional_charge_amount}
                        onChange={(e) =>
                          setSectionFormData({
                            ...sectionFormData,
                            additional_charge_amount: e.target.value,
                          })
                        }
                        style={styles.input}
                        disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                        step="0.01"
                        min="0"
                      />
                      <p style={styles.helperText}>
                        {sectionFormData.additional_charge_type === 'per_item'
                          ? 'Amount charged per additional item selected'
                          : 'Percentage added to the total bill'}
                      </p>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Charge Description (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Premium side dish charge, Extra protein upcharge"
                        value={sectionFormData.additional_charge_description}
                        onChange={(e) =>
                          setSectionFormData({
                            ...sectionFormData,
                            additional_charge_description: e.target.value,
                          })
                        }
                        style={styles.input}
                        disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                      />
                      <p style={styles.helperText}>Brief description shown to customers</p>
                    </div>

                    {/* Charge Preview */}
                    <div style={styles.chargePreview}>
                      <p style={styles.chargePreviewTitle}>💡 Charge Example:</p>
                      <p style={styles.chargePreviewText}>
                        {sectionFormData.additional_charge_type === 'per_item'
                          ? `If customer selects 2 items, extra charge = ₹${(parseFloat(sectionFormData.additional_charge_amount) || 0) * (sectionFormData.max_items_selectable - 1)}`
                          : `If total is ₹1000, charge = ₹${Math.round(1000 * (parseFloat(sectionFormData.additional_charge_amount) || 0) / 100)}`}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Status */}
              <div style={styles.formGroupSection}>
                <div style={styles.formGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={sectionFormData.is_active}
                      onChange={(e) =>
                        setSectionFormData({ ...sectionFormData, is_active: e.target.checked })
                      }
                      style={styles.checkbox}
                      disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                    />
                    <span>Active (Show to customers)</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowAddSectionModal(false);
                  setEditingSection(null);
                }}
                style={styles.buttonSecondary}
                disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                style={styles.buttonPrimary}
                disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
              >
                {createSectionMutation.isPending || updateSectionMutation.isPending
                  ? '⏳ Saving...'
                  : editingSection
                  ? 'Update Section'
                  : 'Create Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Dish Modal */}
      {showAddDishModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingDish ? '✏️ Edit Dish' : '🥘 Add Dish'}</h2>
              <button
                onClick={() => {
                  setShowAddDishModal(false);
                  setEditingDish(null);
                  setSelectedSectionForDish(null);
                }}
                style={styles.modalCloseButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dish Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Chicken Biryani"
                  value={dishFormData.name}
                  onChange={(e) => setDishFormData({ ...dishFormData, name: e.target.value })}
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Fragrant basmati rice with tender chicken..."
                  value={dishFormData.description}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, description: e.target.value })
                  }
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={dishFormData.image_url}
                  onChange={(e) => setDishFormData({ ...dishFormData, image_url: e.target.value })}
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="dishType"
                        checked={dishFormData.is_veg}
                        onChange={() =>
                          setDishFormData({ ...dishFormData, is_veg: true, is_vegan: false })
                        }
                        style={styles.radio}
                        disabled={createItemMutation.isPending || updateItemMutation.isPending}
                      />
                      🥬 Veg
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="dishType"
                        checked={!dishFormData.is_veg}
                        onChange={() => setDishFormData({ ...dishFormData, is_veg: false })}
                        style={styles.radio}
                        disabled={createItemMutation.isPending || updateItemMutation.isPending}
                      />
                      🍖 Non-Veg
                    </label>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Spice Level</label>
                  <select
                    value={dishFormData.spice_level}
                    onChange={(e) =>
                      setDishFormData({
                        ...dishFormData,
                        spice_level: e.target.value as 'mild' | 'medium' | 'spicy',
                      })
                    }
                    style={styles.input}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  >
                    <option value="mild">🌶️ Mild</option>
                    <option value="medium">🌶️🌶️ Medium</option>
                    <option value="spicy">🌶️🌶️🌶️ Spicy</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dietary Info</label>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dishFormData.is_vegan}
                        onChange={(e) =>
                          setDishFormData({ ...dishFormData, is_vegan: e.target.checked })
                        }
                        style={styles.checkbox}
                        disabled={createItemMutation.isPending || updateItemMutation.isPending}
                      />
                      <span>Vegan</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dishFormData.is_gluten_free}
                        onChange={(e) =>
                          setDishFormData({ ...dishFormData, is_gluten_free: e.target.checked })
                        }
                        style={styles.checkbox}
                        disabled={createItemMutation.isPending || updateItemMutation.isPending}
                      />
                      <span>Gluten Free</span>
                    </label>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Pricing Type</label>
                  <select
                    value={dishFormData.pricing_type}
                    onChange={(e) =>
                      setDishFormData({
                        ...dishFormData,
                        pricing_type: e.target.value as 'included' | 'extra' | 'on_request',
                      })
                    }
                    style={styles.input}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  >
                    <option value="included">Included</option>
                    <option value="extra">Extra Charge</option>
                    <option value="on_request">On Request</option>
                  </select>
                </div>
              </div>

              {dishFormData.pricing_type === 'extra' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={dishFormData.price}
                    onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                    style={styles.input}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    step="0.01"
                    min="0"
                  />
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Sort Order</label>
                <input
                  type="number"
                  value={dishFormData.sort_order}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, sort_order: parseInt(e.target.value) })
                  }
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={dishFormData.is_active}
                    onChange={(e) =>
                      setDishFormData({ ...dishFormData, is_active: e.target.checked })
                    }
                    style={styles.checkbox}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowAddDishModal(false);
                  setEditingDish(null);
                  setSelectedSectionForDish(null);
                }}
                style={styles.buttonSecondary}
                disabled={createItemMutation.isPending || updateItemMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDish}
                style={styles.buttonPrimary}
                disabled={createItemMutation.isPending || updateItemMutation.isPending}
              >
                {createItemMutation.isPending || updateItemMutation.isPending
                  ? '⏳ Saving...'
                  : editingDish
                  ? 'Update'
                  : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
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
    alignItems: 'flex-start',
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
    transition: 'all 0.2s ease',
    minWidth: '80px',
  },
  headerContent: {
    flex: 1,
  },
  packageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  packageMeta: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
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
    whiteSpace: 'nowrap' as const,
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
  mainContent: {
    maxWidth: '900px',
  },
  addSectionButtonContainer: {
    marginBottom: '24px',
  },
  addSectionButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  sectionHint: {
    fontSize: '12px',
    color: '#64748b',
    margin: '8px 0 0 0',
    fontStyle: 'italic',
  },
  sectionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  sectionTitleSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  expandButton: {
    padding: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    minWidth: '32px',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  sectionDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    marginBottom: '8px',
  },
  sectionMetaInfo: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    fontSize: '12px',
  },
  metaBadge: {
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  metaBadgeWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  metaBadgeDanger: {
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  sectionActions: {
    display: 'flex',
    gap: '8px',
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
    transition: 'all 0.2s ease',
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
    transition: 'all 0.2s ease',
  },
  sectionContent: {
    padding: '16px',
  },
  dishesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '16px',
  },
  dishItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #2563eb',
  },
  dishInfo: {
    flex: 1,
  },
  dishNameSection: {
    marginBottom: '8px',
  },
  dishName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '6px',
  },
  dishMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    flexWrap: 'wrap' as const,
  },
  dishType: {
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  dishSpice: {
    backgroundColor: '#fed7aa',
    color: '#7c2d12',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  dishVegan: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  dishGF: {
    backgroundColor: '#fce7f3',
    color: '#be185d',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  dishPrice: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  dishDescription: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
  dishActions: {
    display: 'flex',
    gap: '6px',
    flexShrink: 0,
  },
  emptyDishes: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    fontSize: '13px',
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    margin: 0,
  },
  addDishButton: {
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
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px dashed #e2e8f0',
  },
  emptyStateText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
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
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
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
    fontWeight: 'bold',
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
  formGroupSection: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  formSectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: '#64748b',
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
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
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
  chargePreview: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '12px',
    marginTop: '8px',
  },
  chargePreviewTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e40af',
    margin: 0,
    marginBottom: '4px',
  },
  chargePreviewText: {
    fontSize: '12px',
    color: '#1e40af',
    margin: 0,
  },
};