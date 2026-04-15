'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  useCatererMenuItems,
  useCreateCatererMenuItem,
  useUpdateCatererMenuItem,
  useDeleteCatererMenuItem,
  type MenuCollection,
  type CatererMenuItem,
} from '@catering-marketplace/query-client';

export default function PackagesPage() {
  const router = useRouter();

  // Real API queries
  const { data: collections = [], isLoading, error } = useCollections();
  const { data: menuItems = [], isLoading: itemsLoading } = useCatererMenuItems();
  const createCollectionMutation = useCreateCollection();
  const updateCollectionMutation = useUpdateCollection();
  const deleteCollectionMutation = useDeleteCollection();
  const createItemMutation = useCreateCatererMenuItem();
  const updateItemMutation = useUpdateCatererMenuItem();
  const deleteItemMutation = useDeleteCatererMenuItem();

  // UI state only
  const [activeTab, setActiveTab] = useState<'all' | 'add-package' | 'add-item'>('all');
  const [menuType, setMenuType] = useState<'catering' | 'simple' | 'items'>('catering');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'name'>('newest');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Package Form state
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    image_url: '',
    pricing_type: 'per_plate' as 'per_plate' | 'per_person' | 'fixed' | 'on_request',
    base_price: '350',
    currency_code: 'INR',
    min_guests: '50',
    max_guests: '500',
    is_active: true,
  });

  // Menu Item Form state
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    image_url: '',
    is_veg: true,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: '' as 'mild' | 'medium' | 'spicy' | '',
    pricing_type: 'per_plate' as 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person',
    price: '200',
    currency_code: 'INR',
    sort_order: 1,
  });

  // Filtered & sorted packages
  const filtered = collections
    .filter((p) => {
      const typeMatch = menuType === 'catering' ? !p.menu_type || p.menu_type === 'catering' : p.menu_type === 'simple';
      return typeMatch && (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.base_price - b.base_price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Filtered & sorted menu items
  const filteredItems = menuItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // ============ HANDLERS - PACKAGES ============
  const handleCreatePackage = (type: 'catering' | 'simple') => {
    setMenuType(type);
    setEditingId(null);
    setPackageForm({
      name: '',
      description: '',
      image_url: '',
      pricing_type: type === 'simple' ? 'fixed' : 'per_plate',
      base_price: type === 'simple' ? '0' : '350',
      currency_code: 'INR',
      min_guests: type === 'simple' ? '1' : '50',
      max_guests: type === 'simple' ? '999' : '500',
      is_active: true,
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-package');
  };

  const handleEditPackage = (pkg: MenuCollection) => {
    setMenuType(pkg.menu_type === 'simple' ? 'simple' : 'catering');
    setEditingId(pkg.id);
    setPackageForm({
      name: pkg.name,
      description: pkg.description || '',
      image_url: pkg.image_url || '',
      pricing_type: pkg.pricing_type,
      base_price: pkg.base_price.toString(),
      currency_code: pkg.currency_code,
      min_guests: pkg.min_guests.toString(),
      max_guests: pkg.max_guests.toString(),
      is_active: pkg.is_active,
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-package');
  };

  const handleSavePackage = async () => {
    setFormError('');
    setFormSuccess('');

    if (!packageForm.name.trim()) {
      setFormError('Name is required');
      return;
    }

    if (!packageForm.base_price || isNaN(parseFloat(packageForm.base_price))) {
      setFormError('Valid price is required');
      return;
    }

    if (parseInt(packageForm.min_guests) > parseInt(packageForm.max_guests)) {
      setFormError('Minimum guests cannot exceed maximum guests');
      return;
    }

    try {
      const payload = {
        name: packageForm.name,
        description: packageForm.description || undefined,
        image_url: packageForm.image_url || undefined,
        pricing_type: packageForm.pricing_type,
        base_price: parseFloat(packageForm.base_price),
        currency_code: packageForm.currency_code,
        min_guests: parseInt(packageForm.min_guests),
        max_guests: parseInt(packageForm.max_guests),
        menu_type: menuType,
      };

      if (editingId) {
        await updateCollectionMutation.mutateAsync({
          id: editingId,
          data: { ...payload, is_active: packageForm.is_active },
        });
        setFormSuccess(`Package updated successfully!`);
      } else {
        await createCollectionMutation.mutateAsync(payload);
        setFormSuccess(`Package created successfully!`);
      }

      setTimeout(() => {
        setActiveTab('all');
        setEditingId(null);
      }, 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  // ============ HANDLERS - MENU ITEMS ============
  const handleCreateMenuItem = () => {
    setEditingId(null);
    setItemForm({
      name: '',
      description: '',
      image_url: '',
      is_veg: true,
      is_vegan: false,
      is_gluten_free: false,
      spice_level: '',
      pricing_type: 'per_plate',
      price: '200',
      currency_code: 'INR',
      sort_order: 1,
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-item');
  };

  const handleEditMenuItem = (item: CatererMenuItem) => {
    setEditingId(item.id);
    setItemForm({
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || '',
      is_veg: item.is_veg,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      spice_level: item.spice_level || '',
      pricing_type: item.pricing_type,
      price: item.price?.toString() || '200',
      currency_code: item.currency_code || 'INR',
      sort_order: item.sort_order,
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-item');
  };

  const handleSaveMenuItem = async () => {
    setFormError('');
    setFormSuccess('');

    if (!itemForm.name.trim()) {
      setFormError('Item name is required');
      return;
    }

    if (!itemForm.price || isNaN(parseFloat(itemForm.price))) {
      setFormError('Valid price is required');
      return;
    }

    try {
      const payload = {
        section_id: 'standalone', // Global menu item
        name: itemForm.name,
        description: itemForm.description || undefined,
        image_url: itemForm.image_url || undefined,
        is_veg: itemForm.is_veg,
        is_vegan: itemForm.is_vegan,
        is_gluten_free: itemForm.is_gluten_free,
        spice_level: itemForm.spice_level || undefined,
        pricing_type: itemForm.pricing_type,
        price: parseFloat(itemForm.price),
        currency_code: itemForm.currency_code,
        sort_order: itemForm.sort_order,
      };

      if (editingId) {
        await updateItemMutation.mutateAsync({
          id: editingId,
          data: payload,
        });
        setFormSuccess('Menu item updated successfully!');
      } else {
        await createItemMutation.mutateAsync(payload);
        setFormSuccess('Menu item created successfully!');
      }

      setTimeout(() => {
        setActiveTab('all');
        setMenuType('items');
        setEditingId(null);
      }, 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      await deleteCollectionMutation.mutateAsync(id);
      setFormSuccess('Package deleted successfully!');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      await deleteItemMutation.mutateAsync(id);
      setFormSuccess('Menu item deleted successfully!');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleView = (id: string, type: string) => {
    if (type === 'item') {
      router.push(`/caterer/items/${id}`);
    } else if (type === 'simple') {
      router.push(`/caterer/menus/${id}`);
    } else {
      router.push(`/caterer/packages/${id}`);
    }
  };

  // ============ EMPTY STATE ============
  if (!isLoading && !itemsLoading && collections.length === 0 && menuItems.length === 0 && activeTab === 'all') {
    return (
      <div style={styles.container}>
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyStateContent}>
            <h1 style={styles.emptyStateTitle}>🍽️ Create Your First Offering</h1>
            <p style={styles.emptyStateSubtitle}>
              Showcase your catering offerings to attract customers. Choose how you want to get started.
            </p>

            <div style={styles.optionsContainer}>
              <div style={styles.optionCard}>
                <div style={styles.optionIcon}>📦</div>
                <h3 style={styles.optionTitle}>Create Catering Packages</h3>
                <p style={styles.optionDescription}>
                  Perfect for complete meal offerings with flexible pricing options.
                </p>
                <button 
                  onClick={() => handleCreatePackage('catering')}
                  style={styles.optionButton}
                >
                  ➕ Create Package
                </button>
              </div>

              <div style={styles.optionCard}>
                <div style={styles.optionIcon}>📋</div>
                <h3 style={styles.optionTitle}>Simple Menu</h3>
                <p style={styles.optionDescription}>
                  Quick way to showcase your dishes with sections and items.
                </p>
                <button 
                  onClick={() => handleCreatePackage('simple')}
                  style={styles.optionButton}
                >
                  📋 Create Menu
                </button>
              </div>

              <div style={styles.optionCard}>
                <div style={styles.optionIcon}>🍛</div>
                <h3 style={styles.optionTitle}>Menu Items</h3>
                <p style={styles.optionDescription}>
                  Create standalone menu items (dishes) with individual pricing.
                </p>
                <button 
                  onClick={handleCreateMenuItem}
                  style={{...styles.optionButton, backgroundColor: '#10b981'}}
                >
                  🍛 Create Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ADD/EDIT MENU ITEM ============
  if (activeTab === 'add-item') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setActiveTab('all')} style={styles.backButton}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>
              {editingId ? '✏️ Edit Menu Item' : '🍛 Create Menu Item'}
            </h1>
            <p style={styles.subtitle}>
              {editingId ? 'Update item details' : 'Create a new standalone menu item'}
            </p>
          </div>
        </div>

        {formError && <div style={styles.alertError}><p>{formError}</p></div>}
        {formSuccess && <div style={styles.alertSuccess}><p>{formSuccess}</p></div>}

        <div style={styles.section}>
          <div style={styles.largeFormContainer}>
            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Item Information</h3>
                <span style={styles.helpIcon}>🍛</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Paneer Tikka"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
                <p style={styles.helperText}>Name of the dish</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="e.g., Grilled paneer cubes marinated in yogurt and spices"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
                <p style={styles.helperText}>Describe the item</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={itemForm.image_url}
                  onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                />
                <p style={styles.helperText}>Link to item image</p>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Dietary Information</h3>
                <span style={styles.helpIcon}>🌿</span>
              </div>

              <div style={styles.checkboxGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      checked={itemForm.is_veg}
                      onChange={(e) => setItemForm({ ...itemForm, is_veg: e.target.checked })}
                      style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                      disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    />
                    Vegetarian
                  </label>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      checked={itemForm.is_vegan}
                      onChange={(e) => setItemForm({ ...itemForm, is_vegan: e.target.checked })}
                      style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                      disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    />
                    Vegan
                  </label>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      checked={itemForm.is_gluten_free}
                      onChange={(e) => setItemForm({ ...itemForm, is_gluten_free: e.target.checked })}
                      style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                      disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    />
                    Gluten Free
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Spice Level</label>
                <select
                  value={itemForm.spice_level}
                  onChange={(e) => setItemForm({ ...itemForm, spice_level: e.target.value as 'mild' | 'medium' | 'spicy' | '' })}
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                >
                  <option value="">Not Specified</option>
                  <option value="mild">🟢 Mild</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="spicy">🔴 Spicy</option>
                </select>
                <p style={styles.helperText}>Heat level of the dish</p>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Pricing</h3>
                <span style={styles.helpIcon}>💰</span>
              </div>

              <div style={styles.pricingGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price *</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    style={styles.input}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    step="0.01"
                    min="0"
                  />
                  <p style={styles.helperText}>Item price</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Pricing Type *</label>
                  <select
                    value={itemForm.pricing_type}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        pricing_type: e.target.value as 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person',
                      })
                    }
                    style={styles.input}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  >
                    <option value="per_plate">Per Plate</option>
                    <option value="per_person">Per Person</option>
                    <option value="included">Included</option>
                    <option value="extra">Extra Charge</option>
                    <option value="on_request">On Request</option>
                  </select>
                  <p style={styles.helperText}>How you charge for this item</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Currency Code *</label>
                  <input
                    type="text"
                    placeholder="INR"
                    value={itemForm.currency_code}
                    onChange={(e) => setItemForm({ ...itemForm, currency_code: e.target.value.toUpperCase() })}
                    style={styles.input}
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    maxLength={3}
                  />
                  <p style={styles.helperText}>Currency code (INR, USD, etc.)</p>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Display Order</label>
                <input
                  type="number"
                  placeholder="1"
                  value={itemForm.sort_order}
                  onChange={(e) => setItemForm({ ...itemForm, sort_order: parseInt(e.target.value) || 1 })}
                  style={styles.input}
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  min="1"
                />
                <p style={styles.helperText}>Order in which items are displayed</p>
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                onClick={() => setActiveTab('all')}
                style={styles.buttonSecondary}
                disabled={createItemMutation.isPending || updateItemMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMenuItem}
                style={styles.buttonPrimary}
                disabled={createItemMutation.isPending || updateItemMutation.isPending}
              >
                {createItemMutation.isPending || updateItemMutation.isPending
                  ? '⏳ Saving...'
                  : editingId
                  ? 'Update Item'
                  : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ADD/EDIT PACKAGE ============
  if (activeTab === 'add-package') {
    const isSimpleMenu = menuType === 'simple';
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setActiveTab('all')} style={styles.backButton}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>
              {editingId ? `✏️ Edit ${isSimpleMenu ? 'Menu' : 'Package'}` : `📦 Add New ${isSimpleMenu ? 'Menu' : 'Package'}`}
            </h1>
            <p style={styles.subtitle}>
              {editingId
                ? `Update your ${isSimpleMenu ? 'menu' : 'package'} details`
                : `Create a new ${isSimpleMenu ? 'simple menu' : 'catering package'}`}
            </p>
          </div>
        </div>

        {formError && <div style={styles.alertError}><p>{formError}</p></div>}
        {formSuccess && <div style={styles.alertSuccess}><p>{formSuccess}</p></div>}

        <div style={styles.section}>
          <div style={styles.largeFormContainer}>
            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Basic Information</h3>
                <span style={styles.helpIcon}>ℹ️</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isSimpleMenu ? 'Menu' : 'Package'} Name *</label>
                <input
                  type="text"
                  placeholder={isSimpleMenu ? "e.g., North Indian Menu" : "e.g., Wedding Gold Package"}
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  style={styles.input}
                  disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                />
                <p style={styles.helperText}>Give your {isSimpleMenu ? 'menu' : 'package'} a catchy name</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder={isSimpleMenu ? "e.g., Authentic North Indian dishes..." : "e.g., Includes biryani, raita, salad, dessert..."}
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                  disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                />
                <p style={styles.helperText}>Describe what's included</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={packageForm.image_url}
                  onChange={(e) => setPackageForm({ ...packageForm, image_url: e.target.value })}
                  style={styles.input}
                  disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                />
                <p style={styles.helperText}>Link to an image</p>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Pricing Details</h3>
                <span style={styles.helpIcon}>💰</span>
              </div>

              <div style={styles.pricingGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Base Price *</label>
                  <input
                    type="number"
                    placeholder="350"
                    value={packageForm.base_price}
                    onChange={(e) => setPackageForm({ ...packageForm, base_price: e.target.value })}
                    style={styles.input}
                    disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                    step="0.01"
                    min="0"
                  />
                  <p style={styles.helperText}>Price amount</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Pricing Type *</label>
                  <select
                    value={packageForm.pricing_type}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        pricing_type: e.target.value as 'per_plate' | 'per_person' | 'fixed' | 'on_request',
                      })
                    }
                    style={styles.input}
                    disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                  >
                    <option value="per_plate">Per Plate</option>
                    <option value="per_person">Per Person</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="on_request">On Request</option>
                  </select>
                  <p style={styles.helperText}>How you charge</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Currency Code *</label>
                  <input
                    type="text"
                    placeholder="INR"
                    value={packageForm.currency_code}
                    onChange={(e) => setPackageForm({ ...packageForm, currency_code: e.target.value.toUpperCase() })}
                    style={styles.input}
                    disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                    maxLength={3}
                  />
                  <p style={styles.helperText}>e.g., INR, USD, GBP</p>
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>{isSimpleMenu ? 'Menu Capacity' : 'Guest Requirements'}</h3>
                <span style={styles.helpIcon}>👥</span>
              </div>

              <div style={styles.guestGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Minimum {isSimpleMenu ? 'Orders' : 'Guests'} *</label>
                  <input
                    type="number"
                    placeholder={isSimpleMenu ? "1" : "50"}
                    value={packageForm.min_guests}
                    onChange={(e) => setPackageForm({ ...packageForm, min_guests: e.target.value })}
                    style={styles.input}
                    disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                    min="1"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Maximum {isSimpleMenu ? 'Orders' : 'Guests'} *</label>
                  <input
                    type="number"
                    placeholder={isSimpleMenu ? "999" : "500"}
                    value={packageForm.max_guests}
                    onChange={(e) => setPackageForm({ ...packageForm, max_guests: e.target.value })}
                    style={styles.input}
                    disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                onClick={() => setActiveTab('all')}
                style={styles.buttonSecondary}
                disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePackage}
                style={styles.buttonPrimary}
                disabled={createCollectionMutation.isPending || updateCollectionMutation.isPending}
              >
                {createCollectionMutation.isPending || updateCollectionMutation.isPending
                  ? '⏳ Saving...'
                  : editingId
                  ? `Update ${isSimpleMenu ? 'Menu' : 'Package'}`
                  : `Create ${isSimpleMenu ? 'Menu' : 'Package'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN VIEW ============
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🍽️ Menu Management</h1>
          <p style={styles.subtitle}>Manage your catering packages, menus, and items</p>
        </div>
      </div>

      <div style={styles.controlsSection}>
        <div style={styles.searchAndSort}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'price' | 'name')}
            style={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <div style={styles.actionButtons}>
          <button 
            onClick={() => handleCreatePackage('catering')} 
            style={{...styles.buttonPrimary, backgroundColor: '#2563eb'}}
          >
            ➕ Package
          </button>
          <button 
            onClick={() => handleCreatePackage('simple')} 
            style={{...styles.buttonPrimary, backgroundColor: '#7c3aed'}}
          >
            ➕ Menu
          </button>
          <button 
            onClick={handleCreateMenuItem} 
            style={{...styles.buttonPrimary, backgroundColor: '#10b981'}}
          >
            🍛 Item
          </button>
        </div>
      </div>

      {formSuccess && <div style={styles.alertSuccess}><p>{formSuccess}</p></div>}
      {formError && <div style={styles.alertError}><p>{formError}</p></div>}

      <div style={styles.tabContainer}>
        <button
          onClick={() => setMenuType('catering')}
          style={{
            ...styles.tabButton,
            borderBottom: menuType === 'catering' ? '3px solid #2563eb' : '3px solid transparent',
            color: menuType === 'catering' ? '#2563eb' : '#64748b',
          }}
        >
          📦 Packages ({collections.filter((p) => !p.menu_type || p.menu_type === 'catering').length})
        </button>
        <button
          onClick={() => setMenuType('simple')}
          style={{
            ...styles.tabButton,
            borderBottom: menuType === 'simple' ? '3px solid #7c3aed' : '3px solid transparent',
            color: menuType === 'simple' ? '#7c3aed' : '#64748b',
          }}
        >
          📋 Menus ({collections.filter((p) => p.menu_type === 'simple').length})
        </button>
        <button
          onClick={() => setMenuType('items')}
          style={{
            ...styles.tabButton,
            borderBottom: menuType === 'items' ? '3px solid #10b981' : '3px solid transparent',
            color: menuType === 'items' ? '#10b981' : '#64748b',
          }}
        >
          🍛 Items ({menuItems.length})
        </button>
      </div>

      <div style={styles.section}>
        {(isLoading || itemsLoading) ? (
          <div style={styles.loadingState}>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <p>❌ Error loading data</p>
          </div>
        ) : menuType === 'items' ? (
          // MENU ITEMS VIEW
          filteredItems.length > 0 ? (
            <>
              <h2 style={styles.sectionTitle}>🍛 Menu Items ({filteredItems.length})</h2>
              <div style={styles.grid}>
                {filteredItems.map((item) => (
                  <div key={item.id} style={styles.card}>
                    {item.image_url && (
                      <div
                        style={{
                          ...styles.cardImage,
                          backgroundImage: `url(${item.image_url})`,
                        }}
                      />
                    )}
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{item.name}</h3>
                      {item.description && (
                        <p style={styles.cardDesc}>{item.description}</p>
                      )}
                      <div style={styles.cardMeta}>
                        <span style={styles.metaBadge}>
                          ₹{item.price} {item.pricing_type === 'per_plate' ? '/plate' : ''}
                        </span>
                        {item.is_veg && <span style={styles.metaBadge}>🟢 Veg</span>}
                        {item.is_vegan && <span style={styles.metaBadge}>🌱 Vegan</span>}
                        {item.is_gluten_free && <span style={styles.metaBadge}>🌾 GF</span>}
                        {item.spice_level && (
                          <span style={styles.metaBadge}>
                            {item.spice_level === 'mild' ? '🟢' : item.spice_level === 'medium' ? '🟡' : '🔴'} {item.spice_level}
                          </span>
                        )}
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => handleView(item.id, 'item')}
                          style={styles.btnSmall}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleEditMenuItem(item)}
                          style={styles.btnSmall}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          style={styles.btnSmallDanger}
                          disabled={deleteItemMutation.isPending}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <p>No menu items found</p>
              <button 
                onClick={handleCreateMenuItem} 
                style={styles.buttonPrimary}
              >
                Create Item
              </button>
            </div>
          )
        ) : (
          // PACKAGES/MENUS VIEW
          filtered.length > 0 ? (
            <>
              <h2 style={styles.sectionTitle}>
                {menuType === 'catering' ? '📦 Catering Packages' : '📋 Simple Menus'} ({filtered.length})
              </h2>
              <div style={styles.grid}>
                {filtered.map((item) => (
                  <div key={item.id} style={styles.card}>
                    {item.image_url && (
                      <div
                        style={{
                          ...styles.cardImage,
                          backgroundImage: `url(${item.image_url})`,
                        }}
                      />
                    )}
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{item.name}</h3>
                      {item.description && (
                        <p style={styles.cardDesc}>{item.description}</p>
                      )}
                      <div style={styles.cardMeta}>
                        <span style={styles.metaBadge}>
                          {item.pricing_type === 'per_plate'
                            ? `₹${item.base_price}/plate`
                            : item.pricing_type === 'per_person'
                            ? `₹${item.base_price}/person`
                            : item.pricing_type === 'fixed'
                            ? `₹${item.base_price} fixed`
                            : 'On Request'}
                        </span>
                        <span style={styles.metaBadge}>
                          👥 {item.min_guests}-{item.max_guests}
                        </span>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => handleView(item.id, item.menu_type || 'catering')}
                          style={styles.btnSmall}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleEditPackage(item)}
                          style={styles.btnSmall}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(item.id)}
                          style={styles.btnSmallDanger}
                          disabled={deleteCollectionMutation.isPending}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <p>No {menuType === 'simple' ? 'menus' : 'packages'} found</p>
              <button 
                onClick={() => handleCreatePackage(menuType as 'catering' | 'simple')} 
                style={styles.buttonPrimary}
              >
                Create {menuType === 'simple' ? 'Menu' : 'Package'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ============ STYLES ============
const styles: { [key: string]: React.CSSProperties } = {
  // ...existing styles...
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  container: {
    padding: '24px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
    fontSize: '16px',
  },
  errorState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    border: '1px solid #fecaca',
    color: '#7f1d1d',
  },
  alertError: {
    padding: '16px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    color: '#7f1d1d',
    marginBottom: '16px',
    fontSize: '14px',
  },
  alertSuccess: {
    padding: '16px',
    backgroundColor: '#d1fae5',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    color: '#065f46',
    marginBottom: '16px',
    fontSize: '14px',
  },
  emptyStateContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
  },
  emptyStateContent: {
    textAlign: 'center',
    maxWidth: '1000px',
    width: '100%',
  },
  emptyStateTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },
  emptyStateSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  optionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '28px',
    textAlign: 'left' as const,
  },
  optionIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  optionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  optionDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 16px 0',
  },
  optionButton: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginTop: '12px',
    transition: 'all 0.2s ease',
  },
  header: {
    marginBottom: '24px',
  },
  backButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  controlsSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchAndSort: {
    display: 'flex',
    gap: '12px',
    flex: 1,
    minWidth: '300px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  sortSelect: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '24px',
    overflowX: 'auto' as const,
  },
  tabButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  cardImage: {
    width: '100%',
    height: '180px',
    backgroundColor: '#e2e8f0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  cardMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginBottom: '12px',
  },
  metaBadge: {
    fontSize: '12px',
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  btnSmall: {
    flex: 1,
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  btnSmallDanger: {
    flex: 1,
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #e2e8f0',
  },
  largeFormContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  formSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '28px',
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  helpIcon: {
    fontSize: '18px',
    cursor: 'help',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
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
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  helperText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  guestGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '28px',
  },
  buttonPrimary: {
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  buttonSecondary: {
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};