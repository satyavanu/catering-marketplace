'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  ChevronRight,
  Search,
  Filter,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Menu,
  Settings,
  Upload,
  AlertCircle,
} from 'lucide-react';

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Appetizers', color: '#FFE5CC' },
    { id: 2, name: 'Main Course', color: '#CCE5FF' },
    { id: 3, name: 'Desserts', color: '#FFE5F0' },
    { id: 4, name: 'Beverages', color: '#E5FFCC' },
    { id: 5, name: 'Salads', color: '#FFCCF0' },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#FFE5CC',
  });

  const [subCategories, setSubCategories] = useState({
    1: ['Cold', 'Hot', 'Vegan'],
    2: ['Vegetarian', 'Non-Veg', 'Seafood'],
    3: ['Chocolate', 'Fruit-based', 'Ice Cream'],
    4: ['Soft Drinks', 'Alcoholic', 'Hot Beverages'],
    5: ['Green Salad', 'Pasta Salad', 'Fruit Salad'],
  });

  const [listings, setListings] = useState([
    {
      id: 1,
      name: 'Chicken Tikka Appetizer',
      category: 1,
      subCategory: 'Hot',
      description: 'Tender chicken pieces marinated in yogurt and spices',
      price: 150,
      servings: 'Per plate',
      image: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: '20 mins',
      ingredients: 'Chicken, Yogurt, Spices',
      allergens: ['Dairy'],
    },
    {
      id: 2,
      name: 'Chocolate Brownie',
      category: 3,
      subCategory: 'Chocolate',
      description: 'Rich and fudgy chocolate brownies',
      price: 80,
      servings: 'Per piece',
      image: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: '15 mins',
      ingredients: 'Chocolate, Flour, Eggs, Butter',
      allergens: ['Nuts', 'Dairy'],
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    description: '',
    price: '',
    servings: 'Per plate',
    prepTime: '',
    ingredients: '',
    allergens: [],
    offer: {
      hasOffer: false,
      discountType: 'percentage', // 'percentage' or 'fixed'
      discountValue: '',
      offerDescription: '',
    },
    image: null,
    imagePreview: null,
  });

  const handleCreateNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      subCategory: '',
      description: '',
      price: '',
      servings: 'Per plate',
      prepTime: '',
      ingredients: '',
      allergens: [],
      offer: {
        hasOffer: false,
        discountType: 'percentage',
        discountValue: '',
        offerDescription: '',
      },
      image: null,
      imagePreview: null,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      subCategory: item.subCategory,
      description: item.description,
      price: item.price,
      servings: item.servings,
      prepTime: item.prepTime,
      ingredients: item.ingredients,
      allergens: item.allergens || [],
      offer: item.offer || {
        hasOffer: false,
        discountType: 'percentage',
        discountValue: '',
        offerDescription: '',
      },
      image: null,
      imagePreview: item.image,
    });
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill in required fields');
      return;
    }

    if (editingItem) {
      setListings(
        listings.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, id: item.id }
            : item
        )
      );
      setShowEditModal(false);
    } else {
      setListings([
        ...listings,
        {
          ...formData,
          id: Date.now(),
          isAvailable: true,
        },
      ]);
      setShowCreateModal(false);
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setListings(listings.filter((item) => item.id !== id));
    }
  };

  const handleToggleAvailability = (id) => {
    setListings(
      listings.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
    setCategories([...categories, { id: newId, name: newCategory.name, color: newCategory.color }]);
    setSubCategories({ ...subCategories, [newId]: [] });
    setNewCategory({ name: '', color: '#FFE5CC' });
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Delete this category? Items in this category will not be deleted.')) {
      setCategories(categories.filter((cat) => cat.id !== id));
      const newSubCats = { ...subCategories };
      delete newSubCats[id];
      setSubCategories(newSubCats);
    }
  };

  const calculateDiscountedPrice = (price, offer) => {
    if (!offer.hasOffer || !offer.discountValue) return price;
    if (offer.discountType === 'percentage') {
      return (price - (price * offer.discountValue) / 100).toFixed(2);
    } else {
      return (price - offer.discountValue).toFixed(2);
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === parseInt(filterCategory);
    const matchesTab = activeTab === 'all' || (activeTab === 'available' && item.isAvailable) || (activeTab === 'unavailable' && !item.isAvailable);
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId)?.name || '';
  };

  const InputField = ({ label, type = 'text', value, onChange, placeholder, required }) => (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>
        {label}
        {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, required }) => (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>
        {label}
        {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <select value={value} onChange={onChange} style={styles.input}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder, rows = 4 }) => (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{ ...styles.input, resize: 'vertical' }}
      />
    </div>
  );

  const CheckboxGroup = ({ label, options, value, onChange }) => (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>{label}</label>
      <div style={styles.checkboxGroup}>
        {options.map((option) => (
          <label key={option} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...value, option]);
                } else {
                  onChange(value.filter((item) => item !== option));
                }
              }}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .listings-mobile-menu-btn {
            display: flex !important;
          }

          .listings-header {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }

          .listings-header-buttons {
            width: 100% !important;
            flex-direction: column !important;
            gap: 8px !important;
          }

          .listings-search-bar {
            width: 100% !important;
          }

          .listings-controls {
            width: 100% !important;
            flex-direction: column !important;
            gap: 12px !important;
          }

          .listings-grid {
            grid-template-columns: 1fr !important;
          }

          .listings-modal {
            width: 95vw !important;
            max-height: 95vh !important;
            overflow-y: auto !important;
          }

          .listings-category-modal {
            width: 90vw !important;
            max-height: 90vh !important;
          }

          .form-row {
            grid-template-columns: 1fr !important;
          }

          .listings-tabs {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }

          .listings-tab-button {
            flex: 1 !important;
            min-width: 80px !important;
            font-size: 0.75rem !important;
          }

          .category-grid {
            grid-template-columns: 1fr !important;
          }

          .offer-section {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .listings-container {
            padding: 0.5rem !important;
          }

          .listings-header-title {
            font-size: 1.25rem !important;
          }

          .listings-grid {
            gap: 12px !important;
          }

          .listings-tab-button {
            padding: 8px 10px !important;
            font-size: 0.7rem !important;
          }

          .buttonCreate {
            width: 100% !important;
            padding: 10px 12px !important;
          }

          .card-meta-price {
            flex-direction: column !important;
            gap: 6px !important;
          }
        }
      `}</style>

      <div style={styles.container} className="listings-container">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileMenuBtn}
          className="listings-mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <Menu size={24} color="#111827" />
        </button>

        {/* Header */}
        <div style={styles.header} className="listings-header">
          <div>
            <h1 style={styles.title} className="listings-header-title">
              Menu Listings
            </h1>
            <p style={styles.subtitle}>
              Manage your catering menu items and availability
            </p>
          </div>
          <div style={styles.headerButtons} className="listings-header-buttons">
            <button onClick={handleCreateNew} style={styles.buttonCreate} className="buttonCreate">
              <Plus size={20} />
              Add Item
            </button>
            <button onClick={() => setShowCategoryModal(true)} style={styles.buttonSecondaryCreate}>
              <Settings size={20} />
              Categories
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={styles.controlsWrapper}>
          <div style={styles.searchBar} className="listings-search-bar">
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.controls} className="listings-controls">
            <div style={styles.filterGroup}>
              <Filter size={18} color="#6b7280" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs} className="listings-tabs">
          {[
            { id: 'all', label: 'All Items', count: listings.length },
            {
              id: 'available',
              label: 'Available',
              count: listings.filter((l) => l.isAvailable).length,
            },
            {
              id: 'unavailable',
              label: 'Unavailable',
              count: listings.filter((l) => !l.isAvailable).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab.id ? styles.tabButtonActive : styles.tabButtonInactive),
              }}
              className="listings-tab-button"
            >
              {tab.label}
              <span style={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div style={styles.emptyState}>
            <ImageIcon size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No items found</h3>
            <p style={styles.emptyText}>
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first menu item to get started'}
            </p>
            {searchTerm === '' && filterCategory === 'all' && (
              <button onClick={handleCreateNew} style={styles.buttonPrimary}>
                <Plus size={18} />
                Create First Item
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid} className="listings-grid">
            {filteredListings.map((item) => {
              const discountedPrice = item.offer ? calculateDiscountedPrice(item.price, item.offer) : item.price;
              return (
                <div key={item.id} style={styles.card}>
                  <div style={styles.cardImage}>
                    <img
                      src={item.imagePreview || item.image}
                      alt={item.name}
                      style={styles.image}
                    />
                    <div style={styles.cardImageOverlay}>
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        style={{
                          ...styles.buttonIconSmall,
                          backgroundColor: item.isAvailable ? '#10b981' : '#ef4444',
                        }}
                        title={item.isAvailable ? 'Click to make unavailable' : 'Click to make available'}
                      >
                        {item.isAvailable ? (
                          <Eye size={18} color="white" />
                        ) : (
                          <EyeOff size={18} color="white" />
                        )}
                      </button>
                    </div>
                    <div style={styles.categoryBadge}>
                      {getCategoryName(item.category)}
                    </div>
                    {item.offer?.hasOffer && (
                      <div style={styles.offerBadge}>
                        {item.offer.discountType === 'percentage' 
                          ? `${item.offer.discountValue}% OFF` 
                          : `₹${item.offer.discountValue} OFF`}
                      </div>
                    )}
                    {!item.isAvailable && <div style={styles.unavailableBadge}>Unavailable</div>}
                  </div>
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{item.name}</h3>
                    <p style={styles.cardSubCategory}>{item.subCategory}</p>
                    <p style={styles.cardDescription}>{item.description}</p>
                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Prep:</span>
                        <span style={styles.metaValue}>{item.prepTime}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Servings:</span>
                        <span style={styles.metaValue}>{item.servings}</span>
                      </div>
                    </div>
                    <div style={styles.priceSection}>
                      {item.offer?.hasOffer ? (
                        <div style={styles.priceWithDiscount}>
                          <span style={styles.originalPrice}>₹{item.price}</span>
                          <span style={styles.discountedPrice}>₹{discountedPrice}</span>
                        </div>
                      ) : (
                        <span style={styles.regularPrice}>₹{item.price}</span>
                      )}
                    </div>
                    {item.allergens && item.allergens.length > 0 && (
                      <div style={styles.allergens}>
                        <AlertCircle size={14} color="#dc2626" />
                        <span style={styles.allergensText}>
                          {item.allergens.join(', ')}
                        </span>
                      </div>
                    )}
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={styles.buttonSmallEdit}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={styles.buttonSmallDelete}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create/Edit Item Modal */}
        {(showCreateModal || showEditModal) && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent} className="listings-modal">
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  style={styles.closeButton}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={styles.modalBody}>
                {/* Image Upload */}
                <div style={styles.imageUploadSection}>
                  <div
                    style={styles.imageUploadBox}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      if (e.dataTransfer.files?.[0]) {
                        handleImageChange({
                          target: { files: e.dataTransfer.files },
                        });
                      }
                    }}
                  >
                    {formData.imagePreview ? (
                      <div style={styles.previewContainer}>
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          style={styles.previewImage}
                        />
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              image: null,
                              imagePreview: null,
                            })
                          }
                          style={styles.removeImageBtn}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={styles.uploadPrompt}>
                        <Upload size={32} color="#9ca3af" />
                        <p style={styles.uploadText}>
                          Drag and drop your image here or click to browse
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                          id="image-input"
                        />
                        <label htmlFor="image-input" style={styles.uploadLabel}>
                          Browse Files
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Grid */}
                <div style={styles.formGrid}>
                  <InputField
                    label="Item Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Chicken Tikka"
                    required
                  />

                  <SelectField
                    label="Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: parseInt(e.target.value),
                        subCategory: '',
                      })
                    }
                    options={categories}
                    required
                  />

                  {formData.category && (
                    <SelectField
                      label="Sub Category"
                      value={formData.subCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subCategory: e.target.value,
                        })
                      }
                      options={subCategories[formData.category]?.map((sub) => ({
                        id: sub,
                        name: sub,
                      })) || []}
                    />
                  )}

                  <InputField
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="100"
                    required
                  />

                  <InputField
                    label="Servings"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                    placeholder="Per plate"
                  />

                  <InputField
                    label="Prep Time"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({ ...formData, prepTime: e.target.value })
                    }
                    placeholder="20 mins"
                  />
                </div>

                {/* Text Areas */}
                <TextAreaField
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your dish..."
                  rows={3}
                />

                <TextAreaField
                  label="Ingredients"
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  placeholder="List ingredients separated by commas"
                  rows={2}
                />

                {/* Allergens */}
                <CheckboxGroup
                  label="Allergens"
                  options={['Dairy', 'Nuts', 'Gluten', 'Eggs', 'Shellfish', 'Soy']}
                  value={formData.allergens}
                  onChange={(allergens) =>
                    setFormData({ ...formData, allergens })
                  }
                />

                {/* Offer Section */}
                <div style={styles.offerSection} className="offer-section">
                  <div style={styles.offerToggle}>
                    <label style={styles.formLabel}>Add Offer (Optional)</label>
                    <label style={styles.switchLabel}>
                      <input
                        type="checkbox"
                        checked={formData.offer.hasOffer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: { ...formData.offer, hasOffer: e.target.checked },
                          })
                        }
                        style={styles.checkboxInput}
                      />
                      <span style={styles.switchSlider} />
                    </label>
                  </div>

                  {formData.offer.hasOffer && (
                    <>
                      <div style={styles.formGroupInline}>
                        <label style={styles.formLabel}>Discount Type</label>
                        <select
                          value={formData.offer.discountType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: { ...formData.offer, discountType: e.target.value },
                            })
                          }
                          style={styles.input}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>

                      <div style={styles.formGroupInline}>
                        <label style={styles.formLabel}>
                          Discount {formData.offer.discountType === 'percentage' ? '(%)' : '(₹)'}
                        </label>
                        <input
                          type="number"
                          value={formData.offer.discountValue}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: { ...formData.offer, discountValue: e.target.value },
                            })
                          }
                          placeholder={formData.offer.discountType === 'percentage' ? '10' : '50'}
                          style={styles.input}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <TextAreaField
                          label="Offer Description"
                          value={formData.offer.offerDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: { ...formData.offer, offerDescription: e.target.value },
                            })
                          }
                          placeholder="e.g., Limited time offer - Valid till month end"
                          rows={2}
                        />
                      </div>

                      {formData.price && formData.offer.discountValue && (
                        <div style={styles.discountPreview}>
                          <p style={styles.discountPreviewText}>
                            Original: ₹{formData.price} → Discounted: ₹
                            {calculateDiscountedPrice(parseFloat(formData.price), formData.offer)}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Modal Actions */}
                <div style={styles.modalActions}>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                    }}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                  <button onClick={handleSaveItem} style={styles.buttonPrimary}>
                    {editingItem ? 'Update Item' : 'Create Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent} className="listings-category-modal">
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Manage Categories</h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={styles.modalBody}>
                {/* Add New Category */}
                <div style={styles.categorySection}>
                  <h3 style={styles.sectionTitle}>Add New Category</h3>
                  <div style={styles.newCategoryForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Category Name</label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({ ...newCategory, name: e.target.value })
                        }
                        placeholder="e.g., Breads"
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Color</label>
                      <div style={styles.colorPickerWrapper}>
                        <input
                          type="color"
                          value={newCategory.color}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, color: e.target.value })
                          }
                          style={styles.colorPicker}
                        />
                        <span style={styles.colorHex}>{newCategory.color}</span>
                      </div>
                    </div>
                    <button onClick={handleAddCategory} style={styles.buttonPrimary}>
                      <Plus size={18} />
                      Add Category
                    </button>
                  </div>
                </div>

                {/* Existing Categories */}
                <div style={styles.categorySection}>
                  <h3 style={styles.sectionTitle}>Existing Categories</h3>
                  <div style={styles.categoryGrid} className="category-grid">
                    {categories.map((cat) => (
                      <div key={cat.id} style={styles.categoryCard}>
                        <div
                          style={{
                            ...styles.categoryColorBox,
                            backgroundColor: cat.color,
                          }}
                        />
                        <div style={styles.categoryInfo}>
                          <h4 style={styles.categoryName}>{cat.name}</h4>
                          <p style={styles.categoryCount}>
                            {listings.filter((item) => item.category === cat.id).length} items
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          style={styles.buttonCategoryDelete}
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={styles.modalActions}>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    style={styles.buttonPrimary}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: 'clamp(1rem, 3vw, 2rem)',
  },
  mobileMenuBtn: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  headerButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  buttonCreate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  },
  buttonSecondaryCreate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  },
  controlsWrapper: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    flexWrap: 'wrap',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '200px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: 'transparent',
    color: '#111827',
    fontFamily: 'inherit',
  },
  controls: {
    display: 'flex',
    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  filterSelect: {
    border: 'none',
    outline: 'none',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    backgroundColor: 'transparent',
    color: '#111827',
    cursor: 'pointer',
    minWidth: '150px',
    padding: '8px 0',
    fontFamily: 'inherit',
  },
  tabs: {
    display: 'flex',
    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#ffffff',
    color: '#6b7280',
  },
  tabButtonActive: {
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderColor: '#2563eb',
  },
  tabButtonInactive: {
    backgroundColor: '#ffffff',
    color: '#6b7280',
    borderColor: '#d1d5db',
  },
  tabCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    fontSize: '0.7rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 80vw, 320px), 1fr))',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardImage: {
    position: 'relative' as const,
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  cardImageOverlay: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '8px',
  },
  buttonIconSmall: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  categoryBadge: {
    position: 'absolute' as const,
    bottom: '8px',
    left: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  offerBadge: {
    position: 'absolute' as const,
    top: '8px',
    left: '8px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  unavailableBadge: {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  cardContent: {
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardTitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  cardSubCategory: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  cardDescription: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
    color: '#6b7280',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  cardMeta: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '12px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  metaLabel: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
  },
  metaValue: {
    fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
    fontWeight: '700',
    color: '#111827',
  },
  priceSection: {
    marginBottom: '12px',
  },
  regularPrice: {
    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    fontWeight: '700',
    color: '#111827',
  },
  priceWithDiscount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  originalPrice: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
    color: '#9ca3af',
    textDecoration: 'line-through',
    fontWeight: '600',
  },
  discountedPrice: {
    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    fontWeight: '700',
    color: '#ef4444',
  },
  allergens: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.7rem',
    color: '#dc2626',
    marginBottom: '12px',
    padding: '6px 8px',
    backgroundColor: '#fee2e2',
    borderRadius: '4px',
  },
  allergensText: {
    fontWeight: '500',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  buttonSmallEdit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    flex: 1,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonSmallDelete: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    flex: 1,
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  buttonSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: 1,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 3vw, 1.5rem)',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  emptyTitle: {
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    marginBottom: '16px',
  },
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
    paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky' as const,
    top: 0,
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },
  modalBody: {
    padding: 'clamp(1rem, 3vw, 1.5rem)',
  },
  imageUploadSection: {
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  imageUploadBox: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    textAlign: 'center' as const,
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  previewContainer: {
    position: 'relative' as const,
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '250px',
    borderRadius: '8px',
  },
  removeImageBtn: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPrompt: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  uploadText: {
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    color: '#6b7280',
    margin: 0,
  },
  uploadLabel: {
    display: 'inline-block',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  formGroupInline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  formLabel: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
    backgroundColor: '#ffffff',
    color: '#111827',
    fontFamily: 'inherit',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'clamp(0.5rem, 1vw, 1rem)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: '#374151',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  checkboxInput: {
    marginRight: '8px',
    cursor: 'pointer',
    width: '16px',
    height: '16px',
  },
  switchLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative' as const,
  },
  switchSlider: {
    display: 'inline-block',
    width: '44px',
    height: '24px',
    backgroundColor: '#d1d5db',
    borderRadius: '12px',
    position: 'relative' as const,
    transition: 'background-color 0.3s',
  },
  offerToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  offerSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  discountPreview: {
    gridColumn: '1 / -1',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '12px',
  },
  discountPreviewText: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#166534',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'clamp(1.5rem, 4vw, 2rem)',
    paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
    borderTop: '1px solid #e5e7eb',
  },
  categorySection: {
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
  },
  sectionTitle: {
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 16px 0',
  },
  newCategoryForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '24px',
  },
  colorPickerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  colorPicker: {
    width: '50px',
    height: '40px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  colorHex: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 80vw, 250px), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
  },
  categoryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  },
  categoryColorBox: {
    width: '40px',
    height: '40px',
    borderRadius: '6px',
    flexShrink: 0,
  },
  categoryInfo: {
    flex: 1,
    minWidth: 0,
  },
  categoryName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  categoryCount: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: 0,
  },
  buttonCategoryDelete: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
};