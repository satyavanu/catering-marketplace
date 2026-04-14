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
  const [activeTab, setActiveTab] = useState<'all' | 'add-package' | 'bulk'>('all');
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
  });

  // Filtered & sorted packages
  const filtered = collections
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.base_price - b.base_price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // ============ HANDLERS ============
  const handleCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      image_url: '',
      pricing_type: 'per_plate',
      base_price: '350',
      currency_code: 'INR',
      min_guests: '50',
      max_guests: '500',
      is_active: true,
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add-package');
  };

  const handleEdit = (pkg: MenuCollection) => {
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
      setFormError('Package name is required');
      return;
    }

    if (!form.base_price || isNaN(parseFloat(form.base_price))) {
      setFormError('Valid base price is required');
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
      };

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: { ...payload, is_active: form.is_active },
        });
        setFormSuccess('Package updated successfully!');
      } else {
        await createMutation.mutateAsync(payload);
        setFormSuccess('Package created successfully!');
      }

      setTimeout(() => {
        setActiveTab('all');
        setEditingId(null);
      }, 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      setFormSuccess('Package deleted successfully!');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete package');
    }
  };

  const handleView = (id: string) => {
    router.push(`/caterer/packages/${id}`);
  };

  // ============ EMPTY STATE ============
  if (!isLoading && collections.length === 0 && activeTab === 'all') {
    return (
      <div style={styles.container}>
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyStateContent}>
            <h1 style={styles.emptyStateTitle}>🍽️ Create Your First Catering Package</h1>
            <p style={styles.emptyStateSubtitle}>
              Showcase your catering offerings to attract customers.
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
              </div>
            </div>

            <div style={styles.actionButtonsContainer}>
              <button onClick={handleCreate} style={styles.buttonCreatePackage}>
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
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setActiveTab('all')} style={styles.backButton}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>
              {editingId ? '✏️ Edit Package' : '📦 Add New Package'}
            </h1>
            <p style={styles.subtitle}>
              {editingId
                ? 'Update your package details'
                : 'Create a new catering package with pricing and guest limits'}
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
                <label style={styles.label}>Package Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Special Hyderabadi Biryani, Wedding Gold Package"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                <p style={styles.helperText}>Give your package a catchy name that describes the offering</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="e.g., Includes biryani, raita, salad, dessert, and beverages. Perfect for celebrations and events."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                <p style={styles.helperText}>Describe what's included in this package</p>
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
                <p style={styles.helperText}>Link to an image that represents this package</p>
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
                  <p style={styles.helperText}>How you charge for this package</p>
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
                <h3 style={styles.sectionSubtitle}>Guest Requirements</h3>
                <span style={styles.helpIcon}>👥</span>
              </div>

              <div style={styles.guestGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Minimum Guests *</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={form.min_guests}
                    onChange={(e) => setForm({ ...form, min_guests: e.target.value })}
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    min="1"
                  />
                  <p style={styles.helperText}>Minimum guests required for this package</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Maximum Guests *</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={form.max_guests}
                    onChange={(e) => setForm({ ...form, max_guests: e.target.value })}
                    style={styles.input}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    min="1"
                  />
                  <p style={styles.helperText}>Maximum guests this package can serve</p>
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
                  Active Package
                </label>
                <p style={styles.helperText}>
                  Active packages are visible to customers. Inactive packages are hidden.
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
                  ? 'Update Package'
                  : 'Create Package'}
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
          <h1 style={styles.title}>🍽️ Package Management</h1>
          <p style={styles.subtitle}>Manage your catering packages</p>
        </div>
      </div>

      <div style={styles.controlsSection}>
        <div style={styles.searchAndSort}>
          <input
            type="text"
            placeholder="Search packages..."
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
          <button onClick={handleCreate} style={styles.buttonPrimary}>
            ➕ Create Package
          </button>
        </div>
      </div>

      {formSuccess && <div style={styles.alertSuccess}><p>{formSuccess}</p></div>}
      {formError && <div style={styles.alertError}><p>{formError}</p></div>}

      <div style={styles.section}>
        {isLoading ? (
          <div style={styles.loadingState}>
            <p>Loading packages...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <p>❌ Error loading packages</p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <h2 style={styles.sectionTitle}>📦 Packages ({filtered.length})</h2>
            <div style={styles.grid}>
              {filtered.map((pkg) => (
                <div key={pkg.id} style={styles.card}>
                  {pkg.image_url && (
                    <div
                      style={{
                        ...styles.cardImage,
                        backgroundImage: `url(${pkg.image_url})`,
                      }}
                    />
                  )}
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{pkg.name}</h3>
                    {pkg.description && (
                      <p style={styles.cardDesc}>{pkg.description}</p>
                    )}
                    <div style={styles.cardMeta}>
                      <span style={styles.metaBadge}>
                        {pkg.pricing_type === 'per_plate'
                          ? `₹${pkg.base_price}/plate`
                          : pkg.pricing_type === 'per_person'
                          ? `₹${pkg.base_price}/person`
                          : pkg.pricing_type === 'fixed'
                          ? `₹${pkg.base_price} fixed`
                          : 'On Request'}
                      </span>
                      <span style={styles.metaBadge}>
                        {pkg.min_guests}-{pkg.max_guests} guests
                      </span>
                      <span
                        style={{
                          ...styles.metaBadge,
                          backgroundColor: pkg.is_active ? '#d1fae5' : '#fee2e2',
                          color: pkg.is_active ? '#065f46' : '#7f1d1d',
                        }}
                      >
                        {pkg.is_active ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleView(pkg.id)}
                        style={styles.btnSmall}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEdit(pkg)}
                        style={styles.btnSmall}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
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
            <p>No packages found</p>
            <button onClick={handleCreate} style={styles.buttonPrimary}>
              Create First Package
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
};