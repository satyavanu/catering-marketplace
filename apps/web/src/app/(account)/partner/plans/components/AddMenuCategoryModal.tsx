'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  useCreateCategory,
  useUpdateCategory,
  useCategories,
  type MenuCategory,
} from '@catering-marketplace/query-client';

interface AddMenuCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: MenuCategory) => void;
  editingCategory?: MenuCategory | null;
}

const IMAGE_UPLOAD_CONFIG = {
  maxFileSize: 2 * 1024 * 1024, // 2MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
};

export function AddMenuCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  editingCategory,
}: AddMenuCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 1,
    is_active: true,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all categories to calculate next display order
  const { data: allCategories = [], isLoading: categoriesLoading } = useCategories();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const isLoading =
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    isSubmitting ||
    categoriesLoading;

  const isFormValid = formData.name.trim().length > 0 && (editingCategory || imageFiles.length > 0);

  // Initialize form with editing category data or set default sort order
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          description: editingCategory.description,
          sort_order: editingCategory.display_order,
          is_active: true,
        });
        // For edit, load existing image
        if (editingCategory.image_url) {
          setImagePreviews([editingCategory.image_url]);
        }
        setImageFiles([]);
      } else {
        // Set sort order to next available (max + 1)
        const maxOrder = allCategories.reduce(
          (max, cat) => Math.max(max, cat.display_order),
          0
        );
        setFormData({
          name: '',
          description: '',
          sort_order: maxOrder + 1,
          is_active: true,
        });
        setImagePreviews([]);
        setImageFiles([]);
      }
      setApiError(null);
      setUploadErrors([]);
    }
  }, [editingCategory, isOpen, allCategories]);

  const validateImageFile = (file: File): string | null => {
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      return `${file.name}: File size exceeds ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit`;
    }

    if (!IMAGE_UPLOAD_CONFIG.allowedFormats.includes(file.type)) {
      return `${file.name}: Invalid file format. Allowed: ${IMAGE_UPLOAD_CONFIG.allowedExtensions.join(', ')}`;
    }

    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const errors: string[] = [];
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    let successCount = 0;

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);

      if (validationError) {
        errors.push(validationError);
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            setImagePreviews((prev) => [...prev, e.target.result]);
            successCount++;
          }
        };
        reader.onerror = () => {
          errors.push(`${file.name}: Failed to read file`);
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
    // If removing a new file, also remove from imageFiles
    if (index < imageFiles.length) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setUploadErrors([]);

    // Final validation
    if (!formData.name.trim()) {
      setApiError('Please enter category name');
      return;
    }

    if (!editingCategory && imageFiles.length === 0) {
      setApiError('Please upload at least one category image');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        const updatePayload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          display_order: formData.sort_order,
        };

        console.log('Updating category with payload:', updatePayload);

        const updatedCategory = await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: updatePayload,
        });

        console.log('Category updated successfully:', updatedCategory);
        onSuccess(updatedCategory);
        resetForm();
        onClose();
      } else {
        // Create new category with FormData
        const payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('description', formData.description.trim());
        payload.append('display_order', formData.sort_order.toString());
        payload.append('is_active', formData.is_active.toString());

        // Append all image files - use 'image' field name for array
        imageFiles.forEach((file) => {
          payload.append('image', file);
        });

        // Debug: Log FormData entries
        console.log('Creating category with FormData:');
        for (const [key, value] of payload.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(name=${value.name}, size=${value.size} bytes, type=${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        const newCategory = await createCategoryMutation.mutateAsync(payload);
        console.log('Category created successfully:', newCategory);
        onSuccess(newCategory);
        resetForm();
        onClose();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setApiError(errorMessage);
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sort_order: 1,
      is_active: true,
    });
    setImagePreviews([]);
    setImageFiles([]);
    setUploadErrors([]);
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modal}>
      <div
        style={styles.modalOverlay}
        onClick={!isLoading ? handleClose : undefined}
      />
      <div style={styles.modalContent}>
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {editingCategory ? 'Edit' : 'Add'} Menu Category
          </h2>
          <button
            onClick={handleClose}
            style={styles.closeButton}
            disabled={isLoading}
            type="button"
          >
            <XMarkIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={styles.modalBody}>
          {/* Loading State */}
          {categoriesLoading && (
            <div style={styles.infoContainer}>
              <div style={styles.infoMessage}>Loading categories...</div>
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div style={styles.errorContainer}>
              <div style={styles.errorMessage}>⚠️ {apiError}</div>
            </div>
          )}

          {/* Image Upload Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category Images {!editingCategory && <span style={{ color: '#dc2626' }}>*</span>}
            </label>

            {/* Image Previews */}
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
                      disabled={isLoading}
                      title="Remove this image"
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                    <div style={styles.imageIndex}>{index + 1}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div style={styles.imageUploadContainer}>
              <input
                type="file"
                accept={IMAGE_UPLOAD_CONFIG.allowedExtensions.join(',')}
                onChange={handleImageUpload}
                style={styles.fileInput}
                id="category-image-upload"
                disabled={isLoading}
                multiple
              />
              <label
                htmlFor="category-image-upload"
                style={{
                  ...styles.uploadLabel,
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  pointerEvents: isLoading ? 'none' : 'auto',
                }}
              >
                <PhotoIcon style={{ width: '32px', height: '32px' }} />
                <span style={styles.uploadText}>
                  Click to upload or drag and drop
                </span>
                <small style={styles.uploadHint}>
                  {`PNG, JPG, JPEG, WEBP up to ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB each. Multiple files allowed.`}
                </small>
              </label>
            </div>

            {/* Upload Errors */}
            {uploadErrors.length > 0 && (
              <div style={styles.errorContainer}>
                {uploadErrors.map((error, idx) => (
                  <div key={idx} style={styles.errorMessage}>
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            )}

            {/* Image Count */}
            {imagePreviews.length > 0 && (
              <small style={styles.helperText}>
                {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected
              </small>
            )}
          </div>

          {/* Category Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Appetizers, Main Course"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={styles.input}
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="e.g., Delicious starters to begin your meal"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={{
                ...styles.input,
                minHeight: '80px',
                resize: 'vertical',
              }}
              disabled={isLoading}
            />
          </div>

          {/* Sort Order */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Display Order</label>
            <input
              type="number"
              placeholder="1"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sort_order: parseInt(e.target.value) || 1,
                })
              }
              style={styles.input}
              disabled={isLoading}
              min="1"
            />
            <small style={styles.helperText}>
              Lower numbers appear first in the menu
            </small>
          </div>

          {/* Active Status */}
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                disabled={isLoading}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              Category is Active
            </label>
          </div>

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={handleClose}
              style={styles.buttonSecondary}
              disabled={isLoading}
              title={isLoading ? 'Please wait...' : 'Cancel'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.buttonPrimary,
                opacity: !isFormValid || isLoading ? 0.6 : 1,
                cursor: !isFormValid || isLoading ? 'not-allowed' : 'pointer',
              }}
              disabled={!isFormValid || isLoading}
              title={
                !isFormValid
                  ? editingCategory
                    ? 'Enter category name'
                    : 'Enter category name and upload image'
                  : isLoading
                    ? 'Processing...'
                    : 'Save category'
              }
            >
              {isLoading
                ? editingCategory
                  ? 'Updating...'
                  : 'Adding...'
                : editingCategory
                  ? 'Update Category'
                  : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
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
    maxWidth: '500px',
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
  checkboxLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
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
  helperText: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '4px',
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
  infoContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  infoMessage: {
    padding: '10px 12px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    borderRadius: '6px',
    fontSize: '13px',
    border: '1px solid #bfdbfe',
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