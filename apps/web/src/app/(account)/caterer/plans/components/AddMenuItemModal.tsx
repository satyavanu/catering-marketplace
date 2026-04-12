'use client';

import { useState } from 'react';
import { XMarkIcon, TrashIcon, PhotoIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  useCreateMenuItem,
  useUpdateMenuItem,
  type MenuItem,
} from '@catering-marketplace/query-client';

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Addon {
  id?: string;
  name: string;
  price: number;
}

interface AddonGroup {
  id?: string;
  name: string;
  min_select: number;
  max_select: number;
  is_required: boolean;
  addons: Addon[];
}

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: MenuItem) => void;
  categories: MenuCategory[];
  editingItem?: MenuItem | null;
  formData: {
    name: string;
    category: string;
    description: string;
    price: string;
    offer: string;
    dietary: string[];
    halal: boolean;
    vegan: boolean;
    glutenFree: boolean;
    nutrition: {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
      fiber: string;
    };
    optionalIngredients: string[];
    availability: 'available' | 'unavailable' | 'out-of-stock';
    prepTime: string;
    servings: string;
    images: string[];
    tags: string[];
    addon_groups: AddonGroup[];
  };
  onFormDataChange: (data: any) => void;
}

const IMAGE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  maxFiles: 5,
};

const dietaryOptions = [
  { value: 'vegetarian', label: '🌱 Vegetarian' },
  { value: 'vegan', label: '🥒 Vegan' },
  { value: 'non-vegetarian', label: '🍗 Non-Vegetarian' },
];

const tagOptions = [
  { value: 'spicy', label: '🌶️ Spicy' },
  { value: 'bestseller', label: '⭐ Bestseller' },
  { value: 'new', label: '✨ New' },
  { value: 'gluten-free', label: '🌾 Gluten Free' },
  { value: 'dairy-free', label: '🥛 Dairy Free' },
];

export function AddMenuItemModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
  editingItem,
  formData,
  onFormDataChange,
}: AddMenuItemModalProps) {
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAddonGroup, setExpandedAddonGroup] = useState<string | null>(null);

  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();

  const isLoading =
    createMenuItemMutation.isPending ||
    updateMenuItemMutation.isPending ||
    isSubmitting;

  const validateImageFile = (file: File): string | null => {
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      return `File size exceeds ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit.`;
    }
    if (!IMAGE_UPLOAD_CONFIG.allowedFormats.includes(file.type)) {
      return `Invalid file format. Allowed: ${IMAGE_UPLOAD_CONFIG.allowedExtensions.join(', ')}`;
    }
    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const errors: string[] = [];
    const newFiles: File[] = [];

    const totalImages = formData.images.length + imageFiles.length + files.length;
    if (totalImages > IMAGE_UPLOAD_CONFIG.maxFiles) {
      errors.push(
        `Maximum ${IMAGE_UPLOAD_CONFIG.maxFiles} images allowed. Total: ${totalImages}`
      );
      setUploadErrors(errors);
      event.target.value = '';
      return;
    }

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          onFormDataChange({
            ...formData,
            images: [...formData.images, e.target.result],
          });
        }
      };
      reader.onerror = () => {
        errors.push(`${file.name}: Failed to read file`);
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });

    if (errors.length > 0) {
      setUploadErrors(errors);
    } else {
      setUploadErrors([]);
      setApiError(null);
    }

    setImageFiles((prev) => [...prev, ...newFiles]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    onFormDataChange({
      ...formData,
      images: newImages,
    });

    if (index >= formData.images.length - imageFiles.length) {
      const fileIndex = index - (formData.images.length - imageFiles.length);
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setUploadErrors([]);
  };

  const handleToggleDietary = (dietary: string) => {
    onFormDataChange({
      ...formData,
      dietary: formData.dietary.includes(dietary)
        ? formData.dietary.filter((d) => d !== dietary)
        : [...formData.dietary, dietary],
    });
  };

  const handleToggleTag = (tag: string) => {
    onFormDataChange({
      ...formData,
      tags: formData.tags.includes(tag)
        ? formData.tags.filter((t) => t !== tag)
        : [...formData.tags, tag],
    });
  };

  const handleAddAddonGroup = () => {
    const newGroup: AddonGroup = {
      id: `group-${Date.now()}`,
      name: '',
      min_select: 0,
      max_select: 1,
      is_required: false,
      addons: [],
    };
    onFormDataChange({
      ...formData,
      addon_groups: [...formData.addon_groups, newGroup],
    });
    setExpandedAddonGroup(newGroup.id);
  };

  const handleRemoveAddonGroup = (groupId: string | undefined) => {
    onFormDataChange({
      ...formData,
      addon_groups: formData.addon_groups.filter((g) => g.id !== groupId),
    });
  };

  const handleUpdateAddonGroup = (groupId: string | undefined, updates: Partial<AddonGroup>) => {
    onFormDataChange({
      ...formData,
      addon_groups: formData.addon_groups.map((g) =>
        g.id === groupId ? { ...g, ...updates } : g
      ),
    });
  };

  const handleAddAddon = (groupId: string | undefined) => {
    onFormDataChange({
      ...formData,
      addon_groups: formData.addon_groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              addons: [
                ...g.addons,
                { id: `addon-${Date.now()}`, name: '', price: 0 },
              ],
            }
          : g
      ),
    });
  };

  const handleUpdateAddon = (
    groupId: string | undefined,
    addonId: string | undefined,
    updates: Partial<Addon>
  ) => {
    onFormDataChange({
      ...formData,
      addon_groups: formData.addon_groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              addons: g.addons.map((a) =>
                a.id === addonId ? { ...a, ...updates } : a
              ),
            }
          : g
      ),
    });
  };

  const handleRemoveAddon = (groupId: string | undefined, addonId: string | undefined) => {
    onFormDataChange({
      ...formData,
      addon_groups: formData.addon_groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              addons: g.addons.filter((a) => a.id !== addonId),
            }
          : g
      ),
    });
  };

  const handleClose = () => {
    setUploadErrors([]);
    setApiError(null);
    setImageFiles([]);
    onClose();
  };

  const handleSave = async () => {
    setApiError(null);

    if (!formData.name.trim()) {
      setApiError('Please enter item name');
      return;
    }
    if (!formData.category) {
      setApiError('Please select a category');
      return;
    }
    if (!formData.price) {
      setApiError('Please enter price');
      return;
    }

    if (!editingItem && imageFiles.length === 0) {
      setApiError('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const price = parseFloat(formData.price);
      const offer = parseFloat(formData.offer || '0');
      const finalPrice = price - (price * offer) / 100;

      // Create FormData object for multipart/form-data
      const formDataObj = new FormData();

      // Append basic fields
      formDataObj.append('name', formData.name.trim());
      formDataObj.append('category_id', formData.category);
      formDataObj.append('description', formData.description.trim());
      formDataObj.append('price', price.toString());
      formDataObj.append('offer', offer.toString());
      formDataObj.append('finalPrice', finalPrice.toString());
      formDataObj.append('availability', formData.availability);
      formDataObj.append('prepTime', (parseInt(formData.prepTime) || 0).toString());
      formDataObj.append('servings', (parseInt(formData.servings) || 1).toString());

      // Append boolean fields
      formDataObj.append('halal', formData.halal.toString());
      formDataObj.append('vegan', formData.vegan.toString());
      formDataObj.append('glutenFree', formData.glutenFree.toString());

      // Append arrays as JSON strings (handle undefined/null cases)
      formDataObj.append('dietary', JSON.stringify(formData.dietary || []));
      formDataObj.append('tags', JSON.stringify(formData.tags || []));
      formDataObj.append('optionalIngredients', JSON.stringify(formData.optionalIngredients || []));

      // Append nutrition as JSON object
      formDataObj.append(
        'nutrition',
        JSON.stringify({
          calories: parseInt(formData.nutrition?.calories) || 0,
          protein: parseInt(formData.nutrition?.protein) || 0,
          carbs: parseInt(formData.nutrition?.carbs) || 0,
          fat: parseInt(formData.nutrition?.fat) || 0,
          fiber: parseInt(formData.nutrition?.fiber) || 0,
        })
      );

      // Append addon groups as JSON object (handle undefined/null cases)
      formDataObj.append('addon_groups', JSON.stringify(formData.addon_groups || []));

      // Append image files - use File objects from imageFiles state, not base64 strings
      imageFiles.forEach((file, index) => {
        formDataObj.append(`images`, file);
      });

      if (editingItem) {
        const updatedItem = await updateMenuItemMutation.mutateAsync({
          id: editingItem.id,
          data: formDataObj,
        });
        onSuccess(updatedItem);
      } else {
        const newItem = await createMenuItemMutation.mutateAsync(formDataObj);
        onSuccess(newItem);
      }

      // Reset form
      onFormDataChange({
        name: '',
        category: '',
        description: '',
        price: '',
        offer: '',
        dietary: [],
        halal: false,
        vegan: false,
        glutenFree: false,
        nutrition: {
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
        },
        optionalIngredients: [],
        availability: 'available' as const,
        prepTime: '',
        servings: '',
        images: [],
        tags: [],
        addon_groups: [],
      });
      setImageFiles([]);
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setApiError(errorMessage);
      console.error('Error saving menu item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modal}>
      <div style={styles.modalOverlay} onClick={!isLoading ? handleClose : undefined} />
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{editingItem ? 'Edit' : 'Add'} Menu Item</h2>
          <button onClick={handleClose} style={styles.closeButton} disabled={isLoading}>
            <XMarkIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        <div style={styles.modalBody}>
          {apiError && (
            <div style={styles.errorContainer}>
              <div style={styles.errorMessage}>⚠️ {apiError}</div>
            </div>
          )}

          {/* Image Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Item Images (Max 5) {!editingItem && '*'}</label>
            {formData.images.length < IMAGE_UPLOAD_CONFIG.maxFiles ? (
              <div style={styles.imageUploadContainer}>
                <input
                  type="file"
                  multiple
                  accept={IMAGE_UPLOAD_CONFIG.allowedExtensions.join(',')}
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                  id="image-upload"
                  disabled={isLoading}
                />
                <label htmlFor="image-upload" style={styles.uploadLabel}>
                  <PhotoIcon style={{ width: '32px', height: '32px' }} />
                  <span style={styles.uploadText}>Click to upload or drag and drop</span>
                  <small style={styles.uploadHint}>
                    PNG, JPG, JPEG, WEBP up to {IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB
                  </small>
                </label>
              </div>
            ) : (
              <div style={styles.maxImagesReached}>
                <p>Maximum 5 images uploaded</p>
              </div>
            )}

            {uploadErrors.length > 0 && (
              <div style={styles.errorContainer}>
                {uploadErrors.map((error, idx) => (
                  <div key={idx} style={styles.errorMessage}>
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            )}

            {formData.images.length > 0 && (
              <div style={styles.imageGallery}>
                <h4 style={styles.galleryTitle}>
                  Uploaded Images ({formData.images.length}/{IMAGE_UPLOAD_CONFIG.maxFiles})
                </h4>
                <div style={styles.imageGrid}>
                  {formData.images.map((image, idx) => (
                    <div key={idx} style={styles.imageCard}>
                      <img src={image} alt={`Preview ${idx + 1}`} style={styles.imagePreview} />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        style={styles.removeImageButton}
                        disabled={isLoading}
                        title="Remove image"
                      >
                        <TrashIcon style={{ width: '14px', height: '14px' }} />
                      </button>
                      <div style={styles.imageIndex}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Item Name *</label>
            <input
              type="text"
              placeholder="e.g., Paneer Tikka"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
                style={styles.input}
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Availability</label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    availability: e.target.value as any,
                  })
                }
                style={styles.input}
                disabled={isLoading}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Item description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              disabled={isLoading}
            />
          </div>

          {/* Pricing */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => onFormDataChange({ ...formData, price: e.target.value })}
                style={styles.input}
                disabled={isLoading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Offer (%)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={formData.offer}
                onChange={(e) => onFormDataChange({ ...formData, offer: e.target.value })}
                style={styles.input}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Dietary */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Dietary Standards</label>
            <div style={styles.checkboxGroup}>
              {dietaryOptions.map((option) => (
                <label key={option.value} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.dietary.includes(option.value)}
                    onChange={() => handleToggleDietary(option.value)}
                    style={styles.checkbox}
                    disabled={isLoading}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Special Standards */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Special Standards</label>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.halal}
                  onChange={(e) => onFormDataChange({ ...formData, halal: e.target.checked })}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                🕌 Halal Certified
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.vegan}
                  onChange={(e) => onFormDataChange({ ...formData, vegan: e.target.checked })}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                🌱 Vegan
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.glutenFree}
                  onChange={(e) => onFormDataChange({ ...formData, glutenFree: e.target.checked })}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                🌾 Gluten Free
              </label>
            </div>
          </div>

          {/* Tags Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Tags</label>
            <div style={styles.checkboxGroup}>
              {tagOptions.map((option) => (
                <label key={option.value} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData?.tags?.includes(option.value)}
                    onChange={() => handleToggleTag(option.value)}
                    style={styles.checkbox}
                    disabled={isLoading}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Nutrition Information */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Nutrition Information (per serving)</label>
            <div style={styles.nutritionFormGrid}>
              <div style={styles.formGroup}>
                <label style={styles.smallLabel}>Calories</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.nutrition.calories}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      nutrition: { ...formData.nutrition, calories: e.target.value },
                    })
                  }
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.smallLabel}>Protein (g)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.nutrition.protein}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      nutrition: { ...formData.nutrition, protein: e.target.value },
                    })
                  }
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.smallLabel}>Carbs (g)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.nutrition.carbs}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      nutrition: { ...formData.nutrition, carbs: e.target.value },
                    })
                  }
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.smallLabel}>Fat (g)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.nutrition.fat}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      nutrition: { ...formData.nutrition, fat: e.target.value },
                    })
                  }
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.smallLabel}>Fiber (g)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.nutrition.fiber}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      nutrition: { ...formData.nutrition, fiber: e.target.value },
                    })
                  }
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Prep Time & Servings */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prep Time (minutes)</label>
              <input
                type="number"
                placeholder="15"
                value={formData.prepTime}
                onChange={(e) => onFormDataChange({ ...formData, prepTime: e.target.value })}
                style={styles.input}
                disabled={isLoading}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Servings</label>
              <input
                type="number"
                placeholder="2"
                value={formData.servings}
                onChange={(e) => onFormDataChange({ ...formData, servings: e.target.value })}
                style={styles.input}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Addon Groups Section */}
          <div style={styles.addonSection}>
            <div style={styles.addonSectionHeader}>
              <h3 style={styles.addonSectionTitle}>Add-on Groups (Optional)</h3>
              <button
                onClick={handleAddAddonGroup}
                style={styles.buttonSmall}
                disabled={isLoading}
              >
                <PlusIcon style={{ width: '16px', height: '16px' }} />
                Add Group
              </button>
            </div>

            {formData.addon_groups?.length === 0 ? (
              <p style={styles.emptyMessage}>
                No add-on groups yet. Click "Add Group" to create one.
              </p>
            ) : (
              formData.addon_groups?.map((group) => (
                <div key={group.id} style={styles.addonGroupCard}>
                  <div
                    style={styles.addonGroupHeader}
                    onClick={() =>
                      setExpandedAddonGroup(
                        expandedAddonGroup === group.id ? null : group.id || null
                      )
                    }
                  >
                    <div style={{ flex: 1, cursor: 'pointer' }}>
                      <input
                        type="text"
                        placeholder="Group name (e.g., Size, Extras)"
                        value={group.name}
                        onChange={(e) =>
                          handleUpdateAddonGroup(group.id, { name: e.target.value })
                        }
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          ...styles.input,
                          marginBottom: '8px',
                        }}
                        disabled={isLoading}
                      />
                      <div style={styles.addonGroupMeta}>
                        <label style={styles.smallCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={group.is_required}
                            onChange={(e) =>
                              handleUpdateAddonGroup(group.id, {
                                is_required: e.target.checked,
                              })
                            }
                            style={styles.checkbox}
                            disabled={isLoading}
                            onClick={(e) => e.stopPropagation()}
                          />
                          Required
                        </label>
                        <div style={styles.addonGroupControls}>
                          <label style={styles.smallLabel}>
                            Min:
                            <input
                              type="number"
                              min="0"
                              value={group.min_select}
                              onChange={(e) =>
                                handleUpdateAddonGroup(group.id, {
                                  min_select: parseInt(e.target.value) || 0,
                                })
                              }
                              style={{ ...styles.input, width: '60px', marginLeft: '4px' }}
                              disabled={isLoading}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                          <label style={styles.smallLabel}>
                            Max:
                            <input
                              type="number"
                              min="0"
                              value={group.max_select}
                              onChange={(e) =>
                                handleUpdateAddonGroup(group.id, {
                                  max_select: parseInt(e.target.value) || 1,
                                })
                              }
                              style={{ ...styles.input, width: '60px', marginLeft: '4px' }}
                              disabled={isLoading}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAddonGroup(group.id);
                      }}
                      style={styles.buttonDanger}
                      disabled={isLoading}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                    <ChevronDownIcon
                      style={{
                        width: '20px',
                        height: '20px',
                        transform: expandedAddonGroup === group.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </div>

                  {expandedAddonGroup === group.id && (
                    <div style={styles.addonGroupContent}>
                      <div style={styles.addonsContainer}>
                        <div style={styles.addonsHeader}>
                          <h4 style={styles.addonsTitle}>
                            Add-ons ({group.addons.length})
                          </h4>
                          <button
                            onClick={() => handleAddAddon(group.id)}
                            style={styles.buttonSmall}
                            disabled={isLoading}
                          >
                            <PlusIcon style={{ width: '14px', height: '14px' }} />
                            Add
                          </button>
                        </div>

                        {group.addons.length === 0 ? (
                          <p style={styles.emptyAddonsMessage}>No add-ons yet</p>
                        ) : (
                          group.addons.map((addon) => (
                            <div key={addon.id} style={styles.addonRow}>
                              <input
                                type="text"
                                placeholder="Add-on name"
                                value={addon.name}
                                onChange={(e) =>
                                  handleUpdateAddon(group.id, addon.id, {
                                    name: e.target.value,
                                  })
                                }
                                style={{ ...styles.input, flex: 1 }}
                                disabled={isLoading}
                              />
                              <input
                                type="number"
                                placeholder="Price"
                                value={addon.price}
                                onChange={(e) =>
                                  handleUpdateAddon(group.id, addon.id, {
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                style={{ ...styles.input, width: '100px' }}
                                disabled={isLoading}
                              />
                              <button
                                onClick={() => handleRemoveAddon(group.id, addon.id)}
                                style={styles.buttonDanger}
                                disabled={isLoading}
                              >
                                <TrashIcon style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button onClick={handleClose} style={styles.buttonSecondary} disabled={isLoading}>
              Cancel
            </button>
            <button onClick={handleSave} style={styles.buttonPrimary} disabled={isLoading}>
              {isLoading
                ? editingItem
                  ? 'Updating...'
                  : 'Adding...'
                : editingItem
                  ? 'Update Item'
                  : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
  },
  modalContent: {
    position: 'relative' as const,
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  smallLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  smallCheckboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  nutritionFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
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
  buttonSmall: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  buttonDanger: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  imageUploadContainer: {
    borderRadius: '8px',
    border: '2px dashed #cbd5e1',
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
  },
  maxImagesReached: {
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#f0fdf4',
    color: '#166534',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#64748b',
  },
  uploadText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8',
    display: 'block',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  errorMessage: {
    padding: '10px 12px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '6px',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  imageGallery: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  galleryTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
  },
  imageCard: {
    position: 'relative' as const,
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  imagePreview: {
    width: '100%',
    height: '120px',
    objectFit: 'cover' as const,
  },
  removeImageButton: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIndex: {
    position: 'absolute' as const,
    bottom: '4px',
    left: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '600',
  },
  addonSection: {
    paddingTop: '20px',
    borderTop: '2px solid #e2e8f0',
  },
  addonSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  addonSectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  addonGroupCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  addonGroupHeader: {
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  addonGroupMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    fontSize: '12px',
  },
  addonGroupControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  addonGroupContent: {
    padding: '12px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
  },
  addonsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  addonsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  addonsTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  addonRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '13px',
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
  },
  emptyAddonsMessage: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    fontSize: '12px',
    padding: '8px',
    margin: 0,
  },
};