'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  type MenuCollection,
} from '@catering-marketplace/query-client';

export default function PackagesPage() {
  const router = useRouter();

  // Real API queries
  const { data: collections = [], isLoading, error } = useCollections();
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  // UI state only
  const [activeTab, setActiveTab] = useState<'all' | 'add-package' | 'bulk' | 'simple-menu'>('all');
  const [menuType, setMenuType] = useState<'catering' | 'simple'>('catering');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'name'>('newest');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    pricing_type: 'per_plate' as 'per_plate' | 'per_person' | 'fixed' | 'on_request',
    base_price: '350',
    currency_code: 'INR',
    min_guests: '50',
    max_guests: '500',
    is_active: true,
    menu_type: 'catering' as 'catering' | 'simple',
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

  // ============ HANDLERS ============
  const handleCreate = (type: 'catering' | 'simple') => {
    setMenuType(type);
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      image_url: '',
      pricing_type: type === 'simple' ? 'fixed' : 'per_plate',
      base_price: type === 'simple' ? '0' : '350',
      currency_code: 'INR',
      min_guests: type === 'simple' ? '1' : '50',
      max_guests: type === 'simple' ? '999' : '500',
      is_active: true,
      menu_type: type,
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-package');
  };

  const handleEdit = (pkg: MenuCollection) => {
    setMenuType(pkg.menu_type === 'simple' ? 'simple' : 'catering');
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      image_url: pkg.image_url || '',
      pricing_type: pkg.pricing_type,
      base_price: pkg.base_price.toString(),
      currency_code: pkg.currency_code,
      min_guests: pkg.min_guests.toString(),
      max_guests: pkg.max_guests.toString(),
      is_active: pkg.is_active,
      menu_type: pkg.menu_type === 'simple' ? 'simple' : 'catering',
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-package');
  };

  const handleSave = async () => {
    setFormError('');
    setFormSuccess('');

    // Validation
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }

    if (!form.base_price || isNaN(parseFloat(form.base_price))) {
      setFormError('Valid price is required');
      return;
    }

    if (parseInt(form.min_guests) > parseInt(form.max_guests)) {
      setFormError('Minimum guests cannot exceed maximum guests');
      return;
    }

    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        image_url: form.image_url || undefined,
        pricing_type: form.pricing_type,
        base_price: parseFloat(form.base_price),
        currency_code: form.currency_code,
        min_guests: parseInt(form.min_guests),
        max_guests: parseInt(form.max_guests),
        menu_type: form.menu_type,
      };

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: { ...payload, is_active: form.is_active },
        });
        setFormSuccess(`${form.menu_type === 'simple' ? 'Simple Menu' : 'Package'} updated successfully!`);
      } else {
        await createMutation.mutateAsync(payload);
        setFormSuccess(`${form.menu_type === 'simple' ? 'Simple Menu' : 'Package'} created successfully!`);
      }

      setTimeout(() => {
        setActiveTab('all');
        setMenuType('catering');
        setEditingId(null);
      }, 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      setFormSuccess('Deleted successfully!');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleView = (id: string, type: string) => {
    if (type === 'simple') {
      router.push(`/caterer/menus/${id}`);
    } else {
      router.push(`/caterer/packages/${id}`);
    }
  };

 // ============ EMPTY STATE ============
 if (!isLoading && collections.length === 0 && activeTab === 'all') {
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
                Perfect for complete meal offerings with flexible pricing options. Great for weddings, corporate events, and celebrations.
              </p>
              <div style={styles.optionDetails}>
                <p style={styles.detailTitle}>What you can do:</p>
                <ul style={styles.detailList}>
                  <li>Set pricing type (per plate, per person, fixed, or on request)</li>
                  <li>Define guest range (minimum & maximum)</li>
                  <li>Add multiple dish categories to each package</li>
                  <li>Include descriptions and images</li>
                </ul>
              </div>
              <p style={styles.optionExample}>
                <strong>Example:</strong> "Wedding Gold Package" - ₹500/plate for 100-500 guests
              </p>
              <button 
                onClick={() => handleCreate('catering')}
                style={styles.optionButton}
              >
                ➕ Create Package
              </button>
            </div>

            <div style={styles.optionCard}>
              <div style={styles.optionIcon}>📋</div>
              <h3 style={styles.optionTitle}>Simple Menu</h3>
              <p style={styles.optionDescription}>
                Quick and easy way to showcase your dishes without complex pricing structures. Perfect for restaurants and cloud kitchens.
              </p>
              <div style={styles.optionDetails}>
                <p style={styles.detailTitle}>What you can do:</p>
                <ul style={styles.detailList}>
                  <li>Create a basic menu with dish categories</li>
                  <li>Set fixed or flexible pricing</li>
                  <li>Add dietary information (Veg, Vegan, Gluten-free)</li>
                  <li>Include spice levels and descriptions</li>
                </ul>
              </div>
              <p style={styles.optionExample}>
                <strong>Example:</strong> Create "North Indian" or "Chinese" categories with dishes
              </p>
              <button 
                onClick={() => handleCreate('simple')}
                style={styles.optionButton}
              >
                📋 Create Simple Menu
              </button>
            </div>

            <div style={styles.optionCard}>
              <div style={styles.optionIcon}>📤</div>
              <h3 style={styles.optionTitle}>Bulk Upload</h3>
              <p style={styles.optionDescription}>
                Import multiple packages and dishes at once using CSV/Excel. Fastest way to get your entire menu online.
              </p>
              <div style={styles.optionDetails}>
                <p style={styles.detailTitle}>What you can do:</p>
                <ul style={styles.detailList}>
                  <li>Upload CSV/Excel file with package details</li>
                  <li>Add multiple dishes in bulk</li>
                  <li>Auto-categorize and organize items</li>
                  <li>Update existing packages quickly</li>
                </ul>
              </div>
              <p style={styles.optionExample}>
                <strong>Example:</strong> Upload 50+ dishes with pricing in one go
              </p>
              <button 
                style={styles.optionButtonBulk}
                title="Upload CSV file with your packages"
              >
                📤 Bulk Upload
              </button>
            </div>
          </div>

          <div style={styles.actionButtonsContainer}>
            <button onClick={() => handleCreate('catering')} style={styles.buttonCreatePackage}>
              ➕ Create First Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  // ============ ADD/EDIT PACKAGE ============
  if (activeTab === 'add-package') {
    const isSimpleMenu = form.menu_type === 'simple';
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                <p style={styles.helperText}>Give your {isSimpleMenu ? 'menu' : 'package'} a catchy name</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder={isSimpleMenu ? "e.g., Authentic North Indian dishes including biryani, tandoori..." : "e.g., Includes biryani, raita, salad, dessert, and beverages..."}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                <p style={styles.helperText}>Describe what's included</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  style={styles.input}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                <p style={styles.helperText}>Link to an image representing this {isSimpleMenu ? 'menu' : 'package'}</p>
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
                    value={form.base_price}
                    onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    step="0.01"
                    min="0"
                  />
                  <p style={styles.helperText}>Price amount</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Pricing Type *</label>
                  <select
                    value={form.pricing_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pricing_type: e.target.value as 'per_plate' | 'per_person' | 'fixed' | 'on_request',
                      })
                    }
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
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
                    value={form.currency_code}
                    onChange={(e) => setForm({ ...form, currency_code: e.target.value.toUpperCase() })}
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
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
                  <label style={styles.label}>{isSimpleMenu ? 'Min' : 'Minimum'} {isSimpleMenu ? 'Orders' : 'Guests'} *</label>
                  <input
                    type="number"
                    placeholder={isSimpleMenu ? "1" : "50"}
                    value={form.min_guests}
                    onChange={(e) => setForm({ ...form, min_guests: e.target.value })}
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    min="1"
                  />
                  <p style={styles.helperText}>Minimum {isSimpleMenu ? 'orders' : 'guests'} required</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{isSimpleMenu ? 'Max' : 'Maximum'} {isSimpleMenu ? 'Orders' : 'Guests'} *</label>
                  <input
                    type="number"
                    placeholder={isSimpleMenu ? "999" : "500"}
                    value={form.max_guests}
                    onChange={(e) => setForm({ ...form, max_guests: e.target.value })}
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    min="1"
                  />
                  <p style={styles.helperText}>Maximum {isSimpleMenu ? 'orders' : 'guests'} this can serve</p>
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Status</h3>
                <span style={styles.helpIcon}>⚙️</span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                  Active
                </label>
                <p style={styles.helperText}>
                  Active {isSimpleMenu ? 'menus' : 'packages'} are visible to customers.
                </p>
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                onClick={() => setActiveTab('all')}
                style={styles.buttonSecondary}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={styles.buttonPrimary}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
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
          <p style={styles.subtitle}>Manage your catering packages and menus</p>
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
            onClick={() => handleCreate('catering')} 
            style={{...styles.buttonPrimary, backgroundColor: menuType === 'catering' ? '#2563eb' : '#94a3b8'}}
          >
            ➕ Package
          </button>
          <button 
            onClick={() => handleCreate('simple')} 
            style={{...styles.buttonPrimary, backgroundColor: menuType === 'simple' ? '#7c3aed' : '#94a3b8'}}
          >
            ➕ Menu
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
          📦 Catering Packages
        </button>
        <button
          onClick={() => setMenuType('simple')}
          style={{
            ...styles.tabButton,
            borderBottom: menuType === 'simple' ? '3px solid #7c3aed' : '3px solid transparent',
            color: menuType === 'simple' ? '#7c3aed' : '#64748b',
          }}
        >
          📋 Simple Menus
        </button>
      </div>

      <div style={styles.section}>
        {isLoading ? (
          <div style={styles.loadingState}>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <p>❌ Error loading data</p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        ) : filtered.length > 0 ? (
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
                        {item.min_guests}-{item.max_guests}
                      </span>
                      <span
                        style={{
                          ...styles.metaBadge,
                          backgroundColor: item.is_active ? '#d1fae5' : '#fee2e2',
                          color: item.is_active ? '#065f46' : '#7f1d1d',
                        }}
                      >
                        {item.is_active ? '🟢 Active' : '🔴 Inactive'}
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
                        onClick={() => handleEdit(item)}
                        style={styles.btnSmall}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={styles.btnSmallDanger}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? '⏳' : '🗑️'} Delete
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
              onClick={() => handleCreate(menuType)} 
              style={styles.buttonPrimary}
            >
              Create {menuType === 'simple' ? 'Menu' : 'Package'}
            </button>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
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
  optionDetails: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
  },
  detailTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  detailList: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    paddingLeft: '20px',
    lineHeight: '1.6',
  },
  optionExample: {
    fontSize: '12px',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    padding: '8px 12px',
    borderRadius: '6px',
    margin: 0,
    borderLeft: '3px solid #2563eb',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    marginTop: '32px',
  },
  buttonCreatePackage: {
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
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
  },
  tabButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  optionButtonBulk: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginTop: '12px',
    transition: 'all 0.2s ease',
  },
};