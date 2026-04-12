'use client';

import { memo, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';
import {
  useCategories,
  useDeleteCategory,
  type MenuCategory,
} from '@catering-marketplace/query-client';
import { AddMenuCategoryModal } from './AddMenuCategoryModal';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  offer?: number;
  finalPrice: number;
  dietary: string[];
  halal: boolean;
  vegan: boolean;
  glutenFree: boolean;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  optionalIngredients: string[];
  availability: 'available' | 'unavailable' | 'out-of-stock';
  images?: string[];
  image?: string;
  prepTime: number;
  servings: number;
}


interface MenuManagementProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onAddMenuItem: () => void;
  onEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: number) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  menuView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onCategoriesFetch: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

 function MenuManagementContent({
  items,
  onAddMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
  onCategoryChange,
  selectedCategory,
  menuView,
  onViewChange,
}: MenuManagementProps) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );

  // Fetch categories from API
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const deleteCategoryMutation = useDeleteCategory();

  const handleAddMenuCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this category? All items in this category will be unassigned.'
      )
    ) {
      deleteCategoryMutation.mutate(id);
      // Reset selection if deleted category was selected
      if (selectedCategory === categories.find((c) => c.id === id)?.name) {
        onCategoryChange('all');
      }
    }
  };

  const handleCategorySaved = () => {
    setEditingCategory(null);
    setShowCategoryModal(false);
    // Categories will be refetched automatically via React Query
  };

  const filteredMenuItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (categoriesError) {
    return (
      <div style={styles.errorState}>
        <p>❌ Failed to load categories</p>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          {categoriesError instanceof Error
            ? categoriesError.message
            : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Categories Section */}
      <div style={styles.categoriesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Categories</h2>
        </div>

        {/* Categories Grid with Add Button */}
        <div style={styles.categoriesGrid}>
          {/* Add New Category Button */}
          <button
            onClick={handleAddMenuCategory}
            style={styles.addCategoryButton}
            title="Add new category"
            disabled={categoriesLoading}
          >
            <div style={styles.addCategoryIcon}>
              <PlusIcon style={{ width: '32px', height: '32px' }} />
            </div>
            <span style={styles.addCategoryText}>Add Category</span>
          </button>

          {/* All Items Category - Only show if categories exist */}
          {categories.length > 0 && (
            <button
              onClick={() => onCategoryChange('all')}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === 'all'
                  ? styles.categoryButtonActive
                  : {}),
              }}
            >
              <div style={styles.categoryThumbnail}>
                <span style={styles.categoryThumbnailIcon}>📋</span>
              </div>
              <div style={styles.categoryInfo}>
                <h4 style={styles.categoryButtonName}>All Items</h4>
                <p style={styles.categoryButtonCount}>{items.length} items</p>
              </div>
            </button>
          )}

          {/* Existing Categories */}
          {categoriesLoading ? (
            <div style={styles.loadingState}>Loading categories...</div>
          ) : categories.length === 0 ? (
            <div style={styles.emptyStateSmall}>
              <p>No categories yet. Create your first one!</p>
            </div>
          ) : (
            categories
              .sort((a, b) => a.display_order - b.display_order)
              .map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    ...styles.categoryButtonWrapper,
                    ...(selectedCategory === cat.name
                      ? styles.categoryButtonWrapperActive
                      : {}),
                  }}
                  onMouseEnter={(e) => {
                    const actionsDiv = e.currentTarget.querySelector(
                      '[data-actions]'
                    ) as HTMLElement;
                    if (actionsDiv) {
                      actionsDiv.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const actionsDiv = e.currentTarget.querySelector(
                      '[data-actions]'
                    ) as HTMLElement;
                    if (actionsDiv) {
                      actionsDiv.style.opacity = '0';
                    }
                  }}
                >
                  <button
                    onClick={() => onCategoryChange(cat.name)}
                    style={{
                      ...styles.categoryButton,
                      ...(selectedCategory === cat.name
                        ? styles.categoryButtonActive
                        : {}),
                    }}
                  >
                    <div style={styles.categoryThumbnail}>
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          style={styles.categoryThumbnailImage}
                        />
                      ) : (
                        <span style={styles.categoryThumbnailIcon}>🥘</span>
                      )}
                    </div>
                    <div style={styles.categoryInfo}>
                      <h4 style={styles.categoryButtonName}>{cat.name}</h4>
                      <p style={styles.categoryButtonCount}>
                        {items.filter((i) => i.category === cat.name).length}{' '}
                        items
                      </p>
                    </div>
                  </button>

                  {/* Category Actions */}
                  <div
                    style={styles.categoryActions}
                    data-actions
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    <button
                      onClick={() => handleEditCategory(cat)}
                      style={styles.categoryActionButton}
                      title="Edit category"
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <PencilIcon
                        style={{ width: '14px', height: '14px' }}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{
                        ...styles.categoryActionButton,
                        ...styles.categoryActionButtonDanger,
                      }}
                      title="Delete category"
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Menu Items Section */}
      <div style={styles.menuItemsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {selectedCategory === 'all'
              ? 'All Menu Items'
              : selectedCategory}{' '}
            ({filteredMenuItems.length})
          </h2>
          <div style={styles.viewControls}>
            <button
              onClick={() => onViewChange('grid')}
              style={{
                ...styles.viewButton,
                ...(menuView === 'grid' ? styles.viewButtonActive : {}),
              }}
              title="Grid View"
            >
              <SquaresPlusIcon style={{ width: '18px', height: '18px' }} />
            </button>
            <button
              onClick={() => onViewChange('list')}
              style={{
                ...styles.viewButton,
                ...(menuView === 'list' ? styles.viewButtonActive : {}),
              }}
              title="List View"
            >
              <Bars3Icon style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={onAddMenuItem} style={styles.buttonPrimary}>
              <PlusIcon style={{ width: '18px', height: '18px' }} />
              Add Item
            </button>
          </div>
        </div>

        {/* Grid View */}
        {menuView === 'grid' && (
          <div style={styles.menuItemsGrid}>
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => (
                <div key={item.id} style={styles.menuItemCard}>
                  {/* Image Display */}
                  {item.images && item.images.length > 0 && (
                    <div style={styles.itemImageContainer}>
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={styles.itemImage}
                      />
                      {item.images.length > 1 && (
                        <div style={styles.imageCount}>
                          {item.images.length} photos
                        </div>
                      )}
                    </div>
                  )}

                  {/* Item Header */}
                  <div style={styles.itemCardHeader}>
                    <div>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemCategory}>{item.category}</p>
                    </div>
                    <span
                      style={{
                        ...styles.availabilityBadge,
                        backgroundColor:
                          item.availability === 'available'
                            ? '#dcfce7'
                            : item.availability === 'unavailable'
                              ? '#fee2e2'
                              : '#fef3c7',
                        color:
                          item.availability === 'available'
                            ? '#166534'
                            : item.availability === 'unavailable'
                              ? '#991b1b'
                              : '#92400e',
                      }}
                    >
                      {item.availability}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={styles.itemDescription}>{item.description}</p>

                  {/* Price Section */}
                  <div style={styles.priceSection}>
                    <div style={styles.priceBox}>
                      <span style={styles.originalPrice}>₹{item.price}</span>
                      {item.offer > 0 && (
                        <>
                          <span style={styles.offerBadge}>
                            {item.offer}% OFF
                          </span>
                          <span style={styles.finalPrice}>
                            ₹{item.finalPrice}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dietary & Standards */}
                  <div style={styles.dietarySection}>
                    {item.halal && (
                      <span style={styles.standardBadge}>🕌 Halal</span>
                    )}
                    {item.vegan && (
                      <span style={styles.standardBadge}>🌱 Vegan</span>
                    )}
                    {item.glutenFree && (
                      <span style={styles.standardBadge}>
                        🌾 Gluten Free
                      </span>
                    )}
                    {item.dietary.map((d) => (
                      <span key={d} style={styles.dietaryBadge}>
                        {d === 'vegetarian' && '🥬'}
                        {d === 'non-vegetarian' && '🍗'}
                        {d === 'vegan' && '🥒'}
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Nutrition Info */}
                  <div style={styles.nutritionGrid}>
                    <div style={styles.nutritionItem}>
                      <span style={styles.nutritionLabel}>Calories</span>
                      <span style={styles.nutritionValue}>
                        {item.nutrition.calories}
                      </span>
                    </div>
                    <div style={styles.nutritionItem}>
                      <span style={styles.nutritionLabel}>Protein</span>
                      <span style={styles.nutritionValue}>
                        {item.nutrition.protein}g
                      </span>
                    </div>
                    <div style={styles.nutritionItem}>
                      <span style={styles.nutritionLabel}>Carbs</span>
                      <span style={styles.nutritionValue}>
                        {item.nutrition.carbs}g
                      </span>
                    </div>
                    <div style={styles.nutritionItem}>
                      <span style={styles.nutritionLabel}>Fat</span>
                      <span style={styles.nutritionValue}>
                        {item.nutrition.fat}g
                      </span>
                    </div>
                  </div>

                  {/* Prep Time & Servings */}
                  <div style={styles.metaInfoRow}>
                    <span style={styles.metaInfo}>
                      ⏱️ {item.prepTime} min
                    </span>
                    <span style={styles.metaInfo}>
                      👥 {item.servings} servings
                    </span>
                  </div>

                  {/* Item Actions */}
                  <div style={styles.itemActions}>
                    <button
                      onClick={() => onEditMenuItem(item)}
                      style={styles.buttonItemEdit}
                    >
                      <PencilIcon style={{ width: '14px', height: '14px' }} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteMenuItem(item.id)}
                      style={styles.buttonItemDelete}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>No items in this category</p>
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {menuView === 'list' && (
          <div style={styles.menuItemsList}>
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => (
                <div key={item.id} style={styles.menuItemListRow}>
                  <div style={styles.listRowLeft}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemDescription}>
                      {item.description}
                    </p>
                    <div style={styles.listRowTags}>
                      {item.dietary.map((d) => (
                        <span key={d} style={styles.dietaryBadge}>
                          {d}
                        </span>
                      ))}
                      {item.halal && (
                        <span style={styles.standardBadge}>🕌 Halal</span>
                      )}
                      {item.vegan && (
                        <span style={styles.standardBadge}>🌱 Vegan</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.listRowMeta}>
                    <span style={styles.metaInfo}>
                      ⏱️ {item.prepTime} min
                    </span>
                    <span style={styles.metaInfo}>
                      👥 {item.servings} servings
                    </span>
                    <span
                      style={{
                        ...styles.availabilityBadge,
                        backgroundColor:
                          item.availability === 'available'
                            ? '#dcfce7'
                            : '#fee2e2',
                        color:
                          item.availability === 'available'
                            ? '#166534'
                            : '#991b1b',
                      }}
                    >
                      {item.availability}
                    </span>
                  </div>
                  <div style={styles.listRowPrice}>
                    {item.offer > 0 && (
                      <span style={styles.offerBadge}>
                        {item.offer}% OFF
                      </span>
                    )}
                    <span style={styles.finalPrice}>
                      ₹{item.finalPrice}
                    </span>
                  </div>
                  <div style={styles.listRowActions}>
                    <button
                      onClick={() => onEditMenuItem(item)}
                      style={styles.buttonSmall}
                    >
                      <PencilIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      onClick={() => onDeleteMenuItem(item.id)}
                      style={styles.buttonSmallDanger}
                    >
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>No items in this category</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <AddMenuCategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        onSuccess={handleCategorySaved}
        editingCategory={editingCategory}
      />
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
  },
  categoriesSection: {
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
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
  },
  addCategoryButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'white',
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '180px',
  },
  addCategoryIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    border: '2px dashed #3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
    transition: 'all 0.2s ease',
  },
  addCategoryText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center' as const,
  },
  categoryButtonWrapper: {
    position: 'relative' as const,
    transition: 'all 0.2s ease',
  },
  categoryButtonWrapperActive: {
    transform: 'scale(1.05)',
  },
  categoryButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '180px',
    width: '100%',
    position: 'relative' as const,
  },
  categoryButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    outline: '3px solid #2563eb',
    outlineOffset: '2px',
  },
  categoryThumbnail: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    border: '2px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
  },
  categoryThumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },
  categoryThumbnailIcon: {
    fontSize: '40px',
    lineHeight: '1',
  },
  categoryInfo: {
    textAlign: 'center' as const,
    flex: 1,
    width: '100%',
  },
  categoryButtonName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  categoryButtonCount: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  categoryActions: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  categoryActionButton: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'white',
    color: '#2563eb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  categoryActionButtonDanger: {
    color: '#dc2626',
  },
  menuItemsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  viewControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  viewButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#2563eb',
  },
  buttonPrimary: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  menuItemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },
  menuItemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
  },
  itemImageContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '200px',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },
  imageCount: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  itemCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 16px 12px 16px',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  itemCategory: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  availabilityBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap' as const,
  },
  itemDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
    padding: '0 16px',
  },
  priceSection: {
    marginBottom: '12px',
    padding: '0 16px',
  },
  priceBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  originalPrice: {
    fontSize: '14px',
    color: '#9ca3af',
    textDecoration: 'line-through',
  },
  offerBadge: {
    padding: '2px 6px',
    backgroundColor: '#fecaca',
    color: '#991b1b',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
  },
  finalPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#10b981',
  },
  dietarySection: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    marginBottom: '12px',
    padding: '0 16px',
  },
  standardBadge: {
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  dietaryBadge: {
    padding: '3px 8px',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '12px',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    margin: '0 16px 12px 16px',
  },
  nutritionItem: {
    textAlign: 'center' as const,
  },
  nutritionLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
  },
  nutritionValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    display: 'block',
  },
  metaInfoRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    padding: '0 16px',
  },
  metaInfo: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
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
  buttonSmall: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  buttonSmallDanger: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #dc2626',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  menuItemListRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    gap: '16px',
  },
  listRowLeft: {
    flex: 1,
  },
  listRowMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    minWidth: '200px',
  },
  listRowTags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    marginTop: '8px',
  },
  listRowPrice: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '4px',
  },
  listRowActions: {
    display: 'flex',
    gap: '8px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#64748b',
  },
  emptyStateSmall: {
    gridColumn: '1 / -1',
    textAlign: 'center' as const,
    padding: '20px',
    color: '#94a3b8',
    fontSize: '13px',
  },
  loadingState: {
    gridColumn: '1 / -1',
    textAlign: 'center' as const,
    padding: '20px',
    color: '#94a3b8',
    fontSize: '13px',
  },
  errorState: {
    padding: '24px',
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    textAlign: 'center' as const,
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
};


export const MenuManagement = memo(MenuManagementContent);