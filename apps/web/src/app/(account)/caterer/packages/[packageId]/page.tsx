'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  // Mock data - replace with API call
  const [packageData, setPackageData] = useState({
    id: parseInt(packageId) || 1,
    name: 'Special Hyderabadi Biryani',
    description: 'Aromatic biryani with premium basmati rice and spices',
    coverImage: null,
    pricingType: 'per_plate',
    basePrice: 350,
    currency: 'INR',
    minGuests: 50,
    maxGuests: 500,
    isActive: true,
    createdDate: 'March 15, 2025',
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Biryani & Rice',
      description: 'Aromatic rice-based dishes',
      sortOrder: 1,
      isActive: true,
      dishes: [
        {
          id: 1,
          name: 'Chicken Biryani',
          description: 'Fragrant basmati rice with tender chicken',
          type: 'non_veg',
          spiceLevel: 'medium',
          pricing: 'included',
          price: 0,
          isActive: true,
        },
        {
          id: 2,
          name: 'Mutton Biryani',
          description: 'Premium mutton with aromatic spices',
          type: 'non_veg',
          spiceLevel: 'spicy',
          pricing: 'included',
          price: 0,
          isActive: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Desserts',
      description: 'Sweet treats and desserts',
      sortOrder: 2,
      isActive: true,
      dishes: [
        {
          id: 3,
          name: 'Double Ka Meetha',
          description: 'Traditional Indian sweet bread pudding',
          type: 'veg',
          spiceLevel: 'mild',
          pricing: 'included',
          price: 0,
          isActive: true,
        },
      ],
    },
  ]);

  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [selectedCategoryForDish, setSelectedCategoryForDish] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingDish, setEditingDish] = useState<number | null>(null);

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    sortOrder: 1,
    isActive: true,
  });

  const [dishFormData, setDishFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    type: 'veg',
    spiceLevel: 'medium',
    pricing: 'included',
    price: '0',
    isActive: true,
  });

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Add/Edit Category
  const handleSaveCategory = () => {
    if (!categoryFormData.name) {
      alert('Please enter category name');
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory
            ? { ...cat, ...categoryFormData }
            : cat
        )
      );
    } else {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        ...categoryFormData,
        dishes: [],
      };
      setCategories([...categories, newCategory]);
      setExpandedCategories([...expandedCategories, newCategory.id]);
    }

    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 1,
      isActive: true,
    });
    setEditingCategory(null);
    setShowAddCategoryModal(false);
  };

  // Delete Category
  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  // Add/Edit Dish
  const handleSaveDish = () => {
    if (!dishFormData.name || !selectedCategoryForDish) {
      alert('Please fill required fields');
      return;
    }

    setCategories(
      categories.map((cat) => {
        if (cat.id === selectedCategoryForDish) {
          if (editingDish) {
            return {
              ...cat,
              dishes: cat.dishes.map((dish) =>
                dish.id === editingDish
                  ? { ...dish, ...dishFormData }
                  : dish
              ),
            };
          } else {
            const newDish = {
              id: Math.max(
                ...cat.dishes.map((d) => d.id),
                ...categories.flatMap((c) => c.dishes.map((d) => d.id)),
                0
              ) + 1,
              ...dishFormData,
            };
            return {
              ...cat,
              dishes: [...cat.dishes, newDish],
            };
          }
        }
        return cat;
      })
    );

    setDishFormData({
      name: '',
      description: '',
      image: null,
      type: 'veg',
      spiceLevel: 'medium',
      pricing: 'included',
      price: '0',
      isActive: true,
    });
    setEditingDish(null);
    setShowAddDishModal(false);
  };

  // Delete Dish
  const handleDeleteDish = (categoryId: number, dishId: number) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                dishes: cat.dishes.filter((dish) => dish.id !== dishId),
              }
            : cat
        )
      );
    }
  };

  const openAddCategoryModal = () => {
    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 1,
      isActive: true,
    });
    setEditingCategory(null);
    setShowAddCategoryModal(true);
  };

  const openEditCategoryModal = (category: typeof categories[0]) => {
    setCategoryFormData({
      name: category.name,
      description: category.description,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setEditingCategory(category.id);
    setShowAddCategoryModal(true);
  };

  const openAddDishModal = (categoryId: number) => {
    setSelectedCategoryForDish(categoryId);
    setDishFormData({
      name: '',
      description: '',
      image: null,
      type: 'veg',
      spiceLevel: 'medium',
      pricing: 'included',
      price: '0',
      isActive: true,
    });
    setEditingDish(null);
    setShowAddDishModal(true);
  };

  const openEditDishModal = (categoryId: number, dish: typeof categories[0]['dishes'][0]) => {
    setSelectedCategoryForDish(categoryId);
    setDishFormData({
      name: dish.name,
      description: dish.description,
      image: null,
      type: dish.type,
      spiceLevel: dish.spiceLevel,
      pricing: dish.pricing,
      price: dish.price.toString(),
      isActive: dish.isActive,
    });
    setEditingDish(dish.id);
    setShowAddDishModal(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => router.back()}
          style={styles.backButton}
        >
          ← Back
        </button>

        <div style={styles.headerContent}>
          <h1 style={styles.packageTitle}>📦 {packageData.name}</h1>
          <p style={styles.packageMeta}>
            {packageData.currency} {packageData.basePrice} per plate | Min Guests: {packageData.minGuests}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => router.push(`/caterer/packages/${packageId}/edit`)}
            style={styles.buttonPrimary}
          >
            <PencilIcon style={{ width: '16px', height: '16px' }} />
            Edit Package
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Add Category Button */}
        <div style={styles.addCategoryButtonContainer}>
          <button
            onClick={openAddCategoryModal}
            style={styles.addCategoryButton}
          >
            <PlusIcon style={{ width: '18px', height: '18px' }} />
            Add Category
          </button>
        </div>

        {/* Categories List */}
        <div style={styles.categoriesList}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} style={styles.categoryCard}>
                {/* Category Header */}
                <div style={styles.categoryHeader}>
                  <div style={styles.categoryTitleSection}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      style={styles.expandButton}
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronUpIcon style={{ width: '20px', height: '20px' }} />
                      ) : (
                        <ChevronDownIcon style={{ width: '20px', height: '20px' }} />
                      )}
                    </button>
                    <div style={styles.categoryInfo}>
                      <h3 style={styles.categoryName}>📂 {category.name}</h3>
                      <p style={styles.categoryDescription}>{category.description}</p>
                    </div>
                  </div>

                  <div style={styles.categoryActions}>
                    <button
                      onClick={() => openEditCategoryModal(category)}
                      style={styles.buttonIcon}
                      title="Edit"
                    >
                      <PencilIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      style={styles.buttonIconDelete}
                      title="Delete"
                    >
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>

                {/* Category Content - Expanded */}
                {expandedCategories.includes(category.id) && (
                  <div style={styles.categoryContent}>
                    {/* Dishes List */}
                    <div style={styles.dishesList}>
                      {category.dishes.length > 0 ? (
                        category.dishes.map((dish) => (
                          <div key={dish.id} style={styles.dishItem}>
                            <div style={styles.dishInfo}>
                              <div style={styles.dishNameSection}>
                                <p style={styles.dishName}>• {dish.name}</p>
                                <div style={styles.dishMeta}>
                                  <span style={styles.dishType}>
                                    {dish.type === 'veg' ? '🥬' : '🍖'} {dish.type === 'veg' ? 'Veg' : 'Non-Veg'}
                                  </span>
                                  <span style={styles.dishSpice}>
                                    {dish.spiceLevel === 'mild' && '🌶️'}
                                    {dish.spiceLevel === 'medium' && '🌶️🌶️'}
                                    {dish.spiceLevel === 'spicy' && '🌶️🌶️🌶️'} {dish.spiceLevel.charAt(0).toUpperCase() + dish.spiceLevel.slice(1)}
                                  </span>
                                </div>
                              </div>
                              {dish.description && (
                                <p style={styles.dishDescription}>{dish.description}</p>
                              )}
                            </div>

                            <div style={styles.dishActions}>
                              <button
                                onClick={() => openEditDishModal(category.id, dish)}
                                style={styles.buttonIcon}
                                title="Edit"
                              >
                                <PencilIcon style={{ width: '16px', height: '16px' }} />
                              </button>
                              <button
                                onClick={() => handleDeleteDish(category.id, dish.id)}
                                style={styles.buttonIconDelete}
                                title="Delete"
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
                      onClick={() => openAddDishModal(category.id)}
                      style={styles.addDishButton}
                    >
                      <PlusIcon style={{ width: '16px', height: '16px' }} />
                      Add Dish
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>No categories yet</p>
              <p style={styles.emptyStateSubtext}>Create your first category to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddCategoryModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingCategory ? '✏️ Edit Category' : '📂 Add Menu Category'}
              </h2>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setEditingCategory(null);
                }}
                style={styles.modalCloseButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Biryani & Rice"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe this category..."
                  value={categoryFormData.description}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, description: e.target.value })
                  }
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sort Order</label>
                <input
                  type="number"
                  value={categoryFormData.sortOrder}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, sortOrder: parseInt(e.target.value) })
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={categoryFormData.isActive}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, isActive: e.target.checked })
                    }
                    style={styles.checkbox}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setEditingCategory(null);
                }}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button onClick={handleSaveCategory} style={styles.buttonPrimary}>
                {editingCategory ? 'Update' : 'Save'}
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
              <h2 style={styles.modalTitle}>
                {editingDish ? '✏️ Edit Dish' : '🥘 Add Dish'}
              </h2>
              <button
                onClick={() => {
                  setShowAddDishModal(false);
                  setEditingDish(null);
                  setSelectedCategoryForDish(null);
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
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, name: e.target.value })
                  }
                  style={styles.input}
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
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image</label>
                <div style={styles.imageUploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setDishFormData({ ...dishFormData, image: e.target.files[0] });
                      }
                    }}
                    style={styles.fileInput}
                    id="dishImage"
                  />
                  <label htmlFor="dishImage" style={styles.uploadLabel}>
                    <span style={styles.uploadIcon}>📸</span>
                    <span style={styles.uploadText}>Click to upload</span>
                    {dishFormData.image && (
                      <span style={styles.uploadHint}>✓ {dishFormData.image.name}</span>
                    )}
                  </label>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="dishType"
                        value="veg"
                        checked={dishFormData.type === 'veg'}
                        onChange={(e) =>
                          setDishFormData({ ...dishFormData, type: e.target.value })
                        }
                        style={styles.radio}
                      />
                      🥬 Veg
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="dishType"
                        value="non_veg"
                        checked={dishFormData.type === 'non_veg'}
                        onChange={(e) =>
                          setDishFormData({ ...dishFormData, type: e.target.value })
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
                    value={dishFormData.spiceLevel}
                    onChange={(e) =>
                      setDishFormData({ ...dishFormData, spiceLevel: e.target.value })
                    }
                    style={styles.input}
                  >
                    <option value="mild">🌶️ Mild</option>
                    <option value="medium">🌶️🌶️ Medium</option>
                    <option value="spicy">🌶️🌶️🌶️ Spicy</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Pricing</label>
                  <select
                    value={dishFormData.pricing}
                    onChange={(e) =>
                      setDishFormData({ ...dishFormData, pricing: e.target.value })
                    }
                    style={styles.input}
                  >
                    <option value="included">Included</option>
                    <option value="addon">Add-on</option>
                  </select>
                </div>

                {dishFormData.pricing === 'addon' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={dishFormData.price}
                      onChange={(e) =>
                        setDishFormData({ ...dishFormData, price: e.target.value })
                      }
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={dishFormData.isActive}
                    onChange={(e) =>
                      setDishFormData({ ...dishFormData, isActive: e.target.checked })
                    }
                    style={styles.checkbox}
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
                  setSelectedCategoryForDish(null);
                }}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button onClick={handleSaveDish} style={styles.buttonPrimary}>
                {editingDish ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
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
  addCategoryButtonContainer: {
    marginBottom: '24px',
  },
  addCategoryButton: {
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
  categoriesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  categoryTitleSection: {
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
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  categoryDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  categoryActions: {
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
  categoryContent: {
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
    gap: '12px',
    fontSize: '12px',
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  imageUploadBox: {
    borderRadius: '8px',
    border: '2px dashed #cbd5e1',
    padding: '20px',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  uploadIcon: {
    fontSize: '28px',
  },
  uploadText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  },
  uploadHint: {
    fontSize: '11px',
    color: '#10b981',
    display: 'block',
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
};