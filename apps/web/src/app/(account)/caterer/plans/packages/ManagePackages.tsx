'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { MenuItem, MenuCategory, EventPackage } from '../types';

interface EventPackagesProps {
  packages: EventPackage[];
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  onAddPackage: () => void;
  onEditPackage: (pkg: EventPackage) => void;
  onDeletePackage: (id: number) => void;
  onSavePackage: (formData: any) => void;
  showPackageForm: boolean;
  onClosePackageForm: () => void;
  editingPackageId: number | null;
  packageFormData: any;
  onPackageFormDataChange: (data: any) => void;
}

export function EventPackages({
  packages,
  menuItems,
  menuCategories,
  onAddPackage,
  onEditPackage,
  onDeletePackage,
  onSavePackage,
  showPackageForm,
  onClosePackageForm,
  editingPackageId,
  packageFormData,
  onPackageFormDataChange,
}: EventPackagesProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<
    Array<{ itemId: number; itemName: string; price: number }>
  >([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const IMAGE_UPLOAD_CONFIG = {
    maxFileSize: 5 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  };

  // Initialize form data when opening/editing
  useEffect(() => {
    if (showPackageForm && editingPackageId) {
      const existingPackage = packages.find(p => p.id === editingPackageId);
      if (existingPackage && existingPackage.items) {
        setSelectedMenuItems(
          Array.isArray(existingPackage.items)
            ? existingPackage.items.map((item: any) => ({
                itemId: item.itemId || item.id,
                itemName: item.itemName || item.name,
                price: item.price,
              }))
            : []
        );
      }
    }
  }, [showPackageForm, editingPackageId, packages]);

  const validateImageFile = (file: File): string | null => {
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      return `${file.name}: File size exceeds ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit`;
    }

    if (!IMAGE_UPLOAD_CONFIG.allowedFormats.includes(file.type)) {
      return `${file.name}: Invalid file format. Allowed: ${IMAGE_UPLOAD_CONFIG.allowedExtensions.join(
        ', '
      )}`;
    }

    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const errors: string[] = [];
    const newFiles: File[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);

      if (validationError) {
        errors.push(validationError);
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            setImagePreviews((prev) => [...prev, e.target.result]);
          }
        };
        reader.readAsDataURL(file);
        newFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadErrors((prev) => [...prev, ...errors]);
    } else {
      setUploadErrors([]);
      setApiError(null);
    }

    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < imageFiles.length) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddMenuItem = (item: MenuItem) => {
    const exists = selectedMenuItems.find((m) => m.itemId === item.id);
    if (!exists) {
      setSelectedMenuItems((prev) => [
        ...prev,
        {
          itemId: item.id,
          itemName: item.name,
          price: item.price,
        },
      ]);
    }
  };

  const handleRemoveMenuItem = (itemId: number) => {
    setSelectedMenuItems((prev) => prev.filter((m) => m.itemId !== itemId));
  };

  const handleAddAddonGroup = () => {
    const newAddonGroup = {
      id: Date.now(),
      name: '',
      is_required: false,
      min_select: 1,
      max_select: 1,
      is_unlimited: false,
      addons: [] as Array<{ id: number; name: string; price: number }>,
    };
    onPackageFormDataChange({
      ...packageFormData,
      addon_groups: [
        ...(packageFormData.addon_groups || []),
        newAddonGroup,
      ],
    });
  };

  const handleRemoveAddonGroup = (groupId: number) => {
    onPackageFormDataChange({
      ...packageFormData,
      addon_groups: (packageFormData.addon_groups || []).filter(
        (g: any) => g.id !== groupId
      ),
    });
  };

  const handleUpdateAddonGroup = (groupId: number, updates: any) => {
    onPackageFormDataChange({
      ...packageFormData,
      addon_groups: (packageFormData.addon_groups || []).map((g: any) =>
        g.id === groupId ? { ...g, ...updates } : g
      ),
    });
  };

  const handleAddAddon = (groupId: number) => {
    const newAddon = {
      id: Date.now(),
      name: '',
      price: 0,
    };
    onPackageFormDataChange({
      ...packageFormData,
      addon_groups: (packageFormData.addon_groups || []).map((g: any) =>
        g.id === groupId
          ? { ...g, addons: [...(g.addons || []), newAddon] }
          : g
      ),
    });
  };

  const handleRemoveAddon = (groupId: number, addonId: number) => {
    onPackageFormDataChange({
      ...packageFormData,
      addon_groups: (packageFormData.addon_groups || []).map((g: any) =>
        g.id === groupId
          ? {
              ...g,
              addons: g.addons.filter((a: any) => a.id !== addonId),
            }
          : g
      ),
    });
  };

  const handleUpdateAddon = (
    groupId: number,
    addonId: number,
    updates: any
  ) => {
    onPackageFormDataChange({
      ...packageFormData,
      addon_groups: (packageFormData.addon_groups || []).map((g: any) =>
        g.id === groupId
          ? {
              ...g,
              addons: g.addons.map((a: any) =>
                a.id === addonId ? { ...a, ...updates } : a
              ),
            }
          : g
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setUploadErrors([]);

    if (!packageFormData.name.trim()) {
      setApiError('Please enter package name');
      return;
    }

    if (!packageFormData.price) {
      setApiError('Please enter price');
      return;
    }

    if (!editingPackageId && imageFiles.length === 0) {
      setApiError('Please upload at least one package image');
      return;
    }

    if (selectedMenuItems.length === 0) {
      setApiError('Please select at least one menu item');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', packageFormData.name.trim());
      formData.append('description', packageFormData.description.trim());
      formData.append('pricing', packageFormData.pricing);
      formData.append('price', packageFormData.price.toString());
      formData.append('maxPeople', packageFormData.maxPeople?.toString() || '');
      formData.append('minGuests', packageFormData.minGuests?.toString() || '');
      formData.append('maxGuests', packageFormData.maxGuests?.toString() || '');

      // Subscription fields
      formData.append('allow_subscription', packageFormData.allow_subscription?.toString() || 'false');
      formData.append('subscription_interval', packageFormData.subscription_interval || 'weekly');
      formData.append('subscription_price', packageFormData.subscription_price?.toString() || '');
      formData.append('subscription_description', packageFormData.subscription_description?.trim() || '');

      // Menu items (no qty, just items)
      formData.append('menuItems', JSON.stringify(selectedMenuItems));

      // Addon groups
      formData.append('addon_groups', JSON.stringify(packageFormData.addon_groups || []));

      // Images
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      onSavePackage(formData);

      setImageFiles([]);
      setImagePreviews([]);
      setSelectedMenuItems([]);
      setUploadErrors([]);
      setApiError(null);
      onClosePackageForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setApiError(errorMessage);
      console.error('Error saving package:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showPackageForm) {
    return (
      <>
        {/* Event Packages Statistics */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>
              📦
            </div>
            <div>
              <p style={styles.statLabel}>Total Packages</p>
              <p style={styles.statValue}>{packages.length}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4' }}>
              ✅
            </div>
            <div>
              <p style={styles.statLabel}>Active</p>
              <p style={styles.statValue}>
                {packages.filter((p) => p.status === 'active').length}
              </p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>
              📊
            </div>
            <div>
              <p style={styles.statLabel}>With Subscriptions</p>
              <p style={styles.statValue}>
                {packages.filter((p: any) => p.allow_subscription).length}
              </p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#fee2e2' }}>
              💰
            </div>
            <div>
              <p style={styles.statLabel}>Avg Price</p>
              <p style={styles.statValue}>
                ₹
                {packages.length > 0
                  ? Math.round(
                      packages.reduce((sum, p) => sum + p.price, 0) /
                        packages.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Event Packages List */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Event Packages</h2>
            <button onClick={onAddPackage} style={styles.buttonPrimary}>
              <PlusIcon style={{ width: '18px', height: '18px' }} />
              Add Package
            </button>
          </div>

          {packages.length > 0 ? (
            <div style={styles.packagesList}>
              {packages.map((pkg: any) => (
                <div key={pkg.id} style={styles.packageCard}>
                  <div style={styles.packageHeader}>
                    <div style={styles.packageInfo}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={styles.packageName}>{pkg.name}</h3>
                        {pkg.allow_subscription && (
                          <span style={styles.subscriptionBadge}>
                            <CheckCircleIcon style={{ width: '14px', height: '14px' }} />
                            Recurring
                          </span>
                        )}
                      </div>
                      <p style={styles.packageDescription}>
                        {pkg.description}
                      </p>
                      <div style={styles.packageMeta}>
                        <span style={styles.metaBadge}>
                          👥 {pkg.servings}
                        </span>
                        <span style={styles.metaBadge}>
                          📅 {pkg.createdDate}
                        </span>
                        <span style={styles.metaBadge}>
                          📦 {pkg.orders} orders
                        </span>
                      </div>
                    </div>
                    <div style={styles.packageStatus}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor:
                            pkg.status === 'active' ? '#dcfce7' : '#fee2e2',
                          color:
                            pkg.status === 'active' ? '#166534' : '#991b1b',
                        }}
                      >
                        {pkg.status}
                      </span>
                    </div>
                  </div>

                  <div style={styles.packageContent}>
                    <div style={styles.packageItems}>
                      <h4 style={styles.contentTitle}>📝 Items Included:</h4>
                      <div style={styles.itemsList}>
                        {Array.isArray(pkg.items) &&
                          pkg.items.map((item: any, idx: number) => (
                            <span key={idx} style={styles.itemTag}>
                              {typeof item === 'string'
                                ? item
                                : item.itemName || item.name}
                            </span>
                          ))}
                      </div>
                    </div>

                    {pkg.addon_groups && pkg.addon_groups.length > 0 && (
                      <div style={styles.packageAddOns}>
                        <h4 style={styles.contentTitle}>
                          ➕ Add-on Groups:
                        </h4>
                        <div style={styles.addonGroupsList}>
                          {pkg.addon_groups.map((group: any) => (
                            <div key={group.id} style={styles.addonGroupBadge}>
                              <strong>{group.name}</strong>
                              <span style={styles.addonGroupInfo}>
                                {group.is_unlimited ? '∞' : group.max_select} options
                                {group.is_required && ' (Required)'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={styles.packagePricing}>
                      <div>
                        <span style={styles.pricingLabel}>
                          {pkg.pricing === 'per_person'
                            ? 'Price per Person'
                            : 'Fixed Price'}
                        </span>
                        <span style={styles.pricingValue}>₹{pkg.price}</span>
                      </div>
                      {pkg.allow_subscription && pkg.subscription_price && (
                        <div>
                          <span style={styles.pricingLabel}>
                            Subscription ({pkg.subscription_interval})
                          </span>
                          <span style={styles.subscriptionPrice}>
                            ₹{pkg.subscription_price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.packageActions}>
                    <button
                      onClick={() => onEditPackage(pkg)}
                      style={styles.buttonItemEdit}
                    >
                      <PencilIcon style={{ width: '14px', height: '14px' }} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePackage(pkg.id)}
                      style={styles.buttonItemDelete}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No event packages created yet. Start by creating one!</p>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div style={styles.modal}>
      <div
        style={styles.modalOverlay}
        onClick={!isSubmitting ? onClosePackageForm : undefined}
      />
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {editingPackageId ? 'Edit' : 'Add'} Event Package
          </h2>
          <button
            onClick={onClosePackageForm}
            style={styles.closeButton}
            disabled={isSubmitting}
            type="button"
          >
            <XMarkIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.modalBody}>
          {apiError && (
            <div style={styles.errorContainer}>
              <div style={styles.errorMessage}>⚠️ {apiError}</div>
            </div>
          )}

          {/* Image Upload Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Package Images {!editingPackageId && <span style={{ color: '#dc2626' }}>*</span>}
            </label>

            {imagePreviews.length > 0 && (
              <div style={styles.imagePreviewsGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={styles.imagePreviewItem}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={styles.removeImageButton}
                      disabled={isSubmitting}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.imageUploadContainer}>
              <input
                type="file"
                accept={IMAGE_UPLOAD_CONFIG.allowedExtensions.join(',')}
                onChange={handleImageUpload}
                style={styles.fileInput}
                id="package-image-upload"
                disabled={isSubmitting}
                multiple
              />
              <label
                htmlFor="package-image-upload"
                style={{
                  ...styles.uploadLabel,
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  pointerEvents: isSubmitting ? 'none' : 'auto',
                }}
              >
                <PhotoIcon style={{ width: '32px', height: '32px' }} />
                <span style={styles.uploadText}>
                  Click to upload or drag and drop
                </span>
                <small style={styles.uploadHint}>
                  PNG, JPG, JPEG, WEBP up to {IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB each
                </small>
              </label>
            </div>

            {uploadErrors.length > 0 && (
              <div style={styles.errorContainer}>
                {uploadErrors.map((error, idx) => (
                  <div key={idx} style={styles.errorMessage}>
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Package Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Package Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Classic Vegetarian"
              value={packageFormData.name}
              onChange={(e) =>
                onPackageFormDataChange({
                  ...packageFormData,
                  name: e.target.value,
                })
              }
              style={styles.input}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Package description"
              value={packageFormData.description}
              onChange={(e) =>
                onPackageFormDataChange({
                  ...packageFormData,
                  description: e.target.value,
                })
              }
              style={{
                ...styles.input,
                minHeight: '80px',
                resize: 'vertical',
              }}
              disabled={isSubmitting}
            />
          </div>

          {/* Pricing Section */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pricing Type</label>
              <select
                value={packageFormData.pricing}
                onChange={(e) =>
                  onPackageFormDataChange({
                    ...packageFormData,
                    pricing: e.target.value as any,
                  })
                }
                style={styles.input}
                disabled={isSubmitting}
              >
                <option value="per_person">Per Person</option>
                <option value="fixed">Fixed Price</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Price <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={styles.priceInput}>
                <span style={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  placeholder="0"
                  value={packageFormData.price}
                  onChange={(e) =>
                    onPackageFormDataChange({
                      ...packageFormData,
                      price: e.target.value,
                    })
                  }
                  style={{
                    ...styles.input,
                    marginLeft: 0,
                    paddingLeft: '8px',
                  }}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          {/* Guest Limits */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Min Guests</label>
              <input
                type="number"
                placeholder="e.g., 20"
                value={packageFormData.minGuests}
                onChange={(e) =>
                  onPackageFormDataChange({
                    ...packageFormData,
                    minGuests: e.target.value,
                  })
                }
                style={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Max Guests</label>
              <input
                type="number"
                placeholder="e.g., 200"
                value={packageFormData.maxGuests}
                onChange={(e) =>
                  onPackageFormDataChange({
                    ...packageFormData,
                    maxGuests: e.target.value,
                  })
                }
                style={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Max People</label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={packageFormData.maxPeople}
                onChange={(e) =>
                  onPackageFormDataChange({
                    ...packageFormData,
                    maxPeople: e.target.value,
                  })
                }
                style={styles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Subscription Section */}
          <div style={styles.subscriptionSection}>
            <div style={styles.subscriptionHeader}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={packageFormData.allow_subscription || false}
                  onChange={(e) =>
                    onPackageFormDataChange({
                      ...packageFormData,
                      allow_subscription: e.target.checked,
                    })
                  }
                  disabled={isSubmitting}
                />
                Allow Recurring Subscriptions
              </label>
              <p style={styles.helperText}>
                Enable customers to subscribe for recurring orders
              </p>
            </div>

            {packageFormData.allow_subscription && (
              <div style={styles.subscriptionFields}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subscription Interval</label>
                    <select
                      value={packageFormData.subscription_interval || 'weekly'}
                      onChange={(e) =>
                        onPackageFormDataChange({
                          ...packageFormData,
                          subscription_interval: e.target.value,
                        })
                      }
                      style={styles.input}
                      disabled={isSubmitting}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subscription Price</label>
                    <div style={styles.priceInput}>
                      <span style={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        placeholder="Subscription price"
                        value={packageFormData.subscription_price}
                        onChange={(e) =>
                          onPackageFormDataChange({
                            ...packageFormData,
                            subscription_price: e.target.value,
                          })
                        }
                        style={{
                          ...styles.input,
                          marginLeft: 0,
                          paddingLeft: '8px',
                        }}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Subscription Description</label>
                  <textarea
                    placeholder="e.g., Get fresh meals delivered weekly"
                    value={packageFormData.subscription_description}
                    onChange={(e) =>
                      onPackageFormDataChange({
                        ...packageFormData,
                        subscription_description: e.target.value,
                      })
                    }
                    style={{
                      ...styles.input,
                      minHeight: '60px',
                      resize: 'vertical',
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Menu Items Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Select Menu Items <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <p style={styles.helperText}>
              Select items to include in this package (no quantities needed)
            </p>
            <div style={styles.menuItemsSelector}>
              {menuCategories.map((category) => (
                <div key={category.id} style={styles.categorySection}>
                  <h4 style={styles.categoryTitle}>{category.name}</h4>
                  <div style={styles.itemsGrid}>
                    {menuItems
                      .filter((item) => item.category === category.id || item.category === category.name)
                      .map((item) => {
                        const selected = selectedMenuItems.find(
                          (m) => m.itemId === item.id
                        );
                        return (
                          <div
                            key={item.id}
                            style={{
                              ...styles.menuItemSelector,
                              ...(selected
                                ? styles.menuItemSelectorSelected
                                : {}),
                            }}
                            onClick={() => handleAddMenuItem(item)}
                          >
                            <div style={styles.itemInfo}>
                              <p style={styles.itemNameSmall}>{item.name}</p>
                              <span style={styles.itemPriceSmall}>
                                ₹{item.price}
                              </span>
                            </div>
                            {selected && (
                              <div style={styles.selectedIndicator}>
                                <CheckCircleIcon
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    color: '#2563eb',
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            {selectedMenuItems.length > 0 && (
              <div style={styles.selectedItemsSummary}>
                <h4 style={styles.summaryTitle}>
                  Selected Items ({selectedMenuItems.length})
                </h4>
                <div style={styles.selectedItemsList}>
                  {selectedMenuItems.map((item) => (
                    <div key={item.itemId} style={styles.selectedItem}>
                      <div style={styles.selectedItemInfo}>
                        <span style={styles.selectedItemName}>
                          {item.itemName}
                        </span>
                        <span style={styles.selectedItemQty}>
                          ₹{item.price}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(item.itemId)}
                        style={styles.removeSelectedButton}
                        disabled={isSubmitting}
                      >
                        <TrashIcon style={{ width: '12px', height: '12px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add-on Groups */}
          <div style={styles.formGroup}>
            <div style={styles.addonGroupsHeader}>
              <label style={styles.label}>Add-on Groups (Optional)</label>
              <button
                type="button"
                onClick={handleAddAddonGroup}
                style={styles.buttonSmall}
                disabled={isSubmitting}
              >
                <PlusIcon style={{ width: '14px', height: '14px' }} />
                Add Group
              </button>
            </div>

            {(packageFormData.addon_groups || []).length === 0 ? (
              <p style={styles.helperText}>
                No add-on groups yet. Click "Add Group" to create one.
              </p>
            ) : (
              <div style={styles.addonGroupsList}>
                {(packageFormData.addon_groups || []).map((group: any) => (
                  <div key={group.id} style={styles.addonGroup}>
                    <div style={styles.addonGroupHeader}>
                      <input
                        type="text"
                        placeholder="Group name (e.g., Beverages)"
                        value={group.name}
                        onChange={(e) =>
                          handleUpdateAddonGroup(group.id, {
                            name: e.target.value,
                          })
                        }
                        style={styles.input}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAddonGroup(group.id)}
                        style={styles.buttonDanger}
                        disabled={isSubmitting}
                      >
                        <TrashIcon style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>

                    <div style={styles.addonGroupSettings}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={group.is_required}
                          onChange={(e) =>
                            handleUpdateAddonGroup(group.id, {
                              is_required: e.target.checked,
                            })
                          }
                          disabled={isSubmitting}
                        />
                        Required
                      </label>

                      <div style={{ ...styles.formGroup, minWidth: '120px' }}>
                        <label style={{ ...styles.label, fontSize: '11px' }}>
                          Min Selections
                        </label>
                        <input
                          type="number"
                          placeholder="Min"
                          value={group.min_select}
                          onChange={(e) =>
                            handleUpdateAddonGroup(group.id, {
                              min_select: parseInt(e.target.value) || 0,
                            })
                          }
                          style={{ ...styles.input, fontSize: '13px' }}
                          disabled={isSubmitting}
                          min="0"
                        />
                      </div>

                      <div style={{ ...styles.formGroup, minWidth: '120px' }}>
                        <label style={{ ...styles.label, fontSize: '11px' }}>
                          Max Selections
                        </label>
                        <input
                          type="number"
                          placeholder="Max"
                          value={group.is_unlimited ? '∞' : group.max_select}
                          onChange={(e) => {
                            if (e.target.value === '∞' || e.target.value === '') {
                              handleUpdateAddonGroup(group.id, {
                                is_unlimited: true,
                                max_select: 0,
                              });
                            } else {
                              handleUpdateAddonGroup(group.id, {
                                max_select: parseInt(e.target.value) || 1,
                                is_unlimited: false,
                              });
                            }
                          }}
                          style={{ ...styles.input, fontSize: '13px' }}
                          disabled={isSubmitting}
                          min="1"
                        />
                      </div>

                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={group.is_unlimited || false}
                          onChange={(e) =>
                            handleUpdateAddonGroup(group.id, {
                              is_unlimited: e.target.checked,
                              max_select: e.target.checked ? 0 : 1,
                            })
                          }
                          disabled={isSubmitting}
                        />
                        Unlimited
                      </label>
                    </div>

                    <div style={styles.addonsContainer}>
                      <div style={styles.addonsHeader}>
                        <h5 style={styles.addonsTitle}>
                          Add-ons ({(group.addons || []).length})
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleAddAddon(group.id)}
                          style={styles.buttonSmall}
                          disabled={isSubmitting}
                        >
                          <PlusIcon style={{ width: '12px', height: '12px' }} />
                          Add
                        </button>
                      </div>

                      {(group.addons || []).length === 0 ? (
                        <p style={styles.emptyAddonsMessage}>No add-ons yet</p>
                      ) : (
                        (group.addons || []).map((addon: any) => (
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
                              style={{
                                ...styles.input,
                                flex: 1,
                              }}
                              disabled={isSubmitting}
                            />
                            <div style={styles.priceInput}>
                              <span style={styles.currencySymbol}>₹</span>
                              <input
                                type="number"
                                placeholder="Price"
                                value={addon.price}
                                onChange={(e) =>
                                  handleUpdateAddon(group.id, addon.id, {
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                style={{
                                  ...styles.input,
                                  marginLeft: 0,
                                  paddingLeft: '4px',
                                  width: '80px',
                                }}
                                disabled={isSubmitting}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAddon(group.id, addon.id)
                              }
                              style={styles.buttonDanger}
                              disabled={isSubmitting}
                            >
                              <TrashIcon
                                style={{
                                  width: '14px',
                                  height: '14px',
                                }}
                              />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={onClosePackageForm}
              style={styles.buttonSecondary}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.buttonPrimary,
                opacity:
                  !packageFormData.name.trim() ||
                  !packageFormData.price ||
                  selectedMenuItems.length === 0 ||
                  isSubmitting
                    ? 0.6
                    : 1,
                cursor:
                  !packageFormData.name.trim() ||
                  !packageFormData.price ||
                  selectedMenuItems.length === 0 ||
                  isSubmitting
                    ? 'not-allowed'
                    : 'pointer',
              }}
              disabled={
                !packageFormData.name.trim() ||
                !packageFormData.price ||
                selectedMenuItems.length === 0 ||
                isSubmitting
              }
            >
              {isSubmitting
                ? editingPackageId
                  ? 'Updating...'
                  : 'Adding...'
                : editingPackageId
                  ? 'Update Package'
                  : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: 0,
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '4px 0 0 0',
  },
  section: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  packagesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '16px',
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
  packageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  subscriptionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
  },
  packageDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  packageMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  metaBadge: {
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  packageStatus: {
    marginLeft: '16px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  packageContent: {
    flex: 1,
    marginBottom: '16px',
  },
  contentTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  packageItems: {
    marginBottom: '12px',
  },
  itemsList: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  itemTag: {
    padding: '3px 8px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  packageAddOns: {
    marginBottom: '12px',
  },
  addonGroupsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  addonGroupBadge: {
    padding: '6px 10px',
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addonGroupInfo: {
    fontSize: '10px',
    opacity: 0.8,
  },
  packagePricing: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  pricingLabel: {
    fontSize: '12px',
    color: '#166534',
    fontWeight: '600',
  },
  pricingValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#166534',
  },
  subscriptionPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0c4a6e',
  },
  packageActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  buttonItemEdit: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: 'white',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  buttonItemDelete: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #dc2626',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#64748b',
  },
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
    maxWidth: '900px',
    width: '100%',
    maxHeight: '95vh',
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
  priceInput: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  currencySymbol: {
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    borderRight: '1px solid #e2e8f0',
  },
  subscriptionSection: {
    padding: '16px',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  },
  subscriptionHeader: {
    marginBottom: '12px',
  },
  subscriptionFields: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #bfdbfe',
  },
  imageUploadContainer: {
    borderRadius: '8px',
    border: '2px dashed #cbd5e1',
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
  },
  uploadText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
    display: 'block',
  },
  imagePreviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
    marginBottom: '12px',
  },
  imagePreviewItem: {
    position: 'relative' as const,
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  previewImage: {
    width: '100%',
    height: '100px',
    objectFit: 'cover' as const,
    display: 'block',
  },
  removeImageButton: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontWeight: '600',
    fontSize: '10px',
    transition: 'all 0.2s ease',
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
  menuItemsSelector: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '12px',
    maxHeight: '400px',
    overflow: 'auto',
  },
  categorySection: {
    marginBottom: '16px',
  },
  categoryTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px',
  },
  menuItemSelector: {
    padding: '12px',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  menuItemSelectorSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  itemNameSmall: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemPriceSmall: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#10b981',
  },
  selectedIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  selectedItemsSummary: {
    padding: '12px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
    marginTop: '12px',
  },
  summaryTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0c4a6e',
    margin: '0 0 8px 0',
  },
  selectedItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  selectedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontSize: '12px',
  },
  selectedItemInfo: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flex: 1,
  },
  selectedItemName: {
    fontWeight: '600',
    color: '#1e293b',
  },
  selectedItemQty: {
    fontSize: '11px',
    color: '#64748b',
  },
  removeSelectedButton: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  helperText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
  addonGroupsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  buttonSmall: {
    padding: '6px 10px',
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
    padding: '6px 10px',
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
    transition: 'all 0.2s ease',
  },
  addonGroupsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  addonGroup: {
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  addonGroupHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  addonGroupSettings: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#1e293b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    margin: 0,
  },
  addonsContainer: {
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '6px',
  },
  addonsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  addonsTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  emptyAddonsMessage: {
    fontSize: '11px',
    color: '#94a3b8',
    margin: 0,
    textAlign: 'center' as const,
    padding: '8px',
  },
  addonRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '6px',
    alignItems: 'center',
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
};