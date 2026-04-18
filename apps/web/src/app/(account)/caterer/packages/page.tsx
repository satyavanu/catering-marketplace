'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  StarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  useCatererMenuItems,
  useCreateCatererMenuItem,
  useDeleteCatererMenuItem,
  useUpdateCatererMenuItem,
  useCollections,
} from '@catering-marketplace/query-client';
import { useQueryClient } from '@tanstack/react-query';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_veg: boolean;
  spice_level: 'mild' | 'medium' | 'spicy' | '';
  price: number;
  created_at?: string;
}

interface Package {
  id: string;
  name: string;
  description: string;
  type: 'fixed' | 'customizable';
  is_subscribable: boolean;
  base_price: number;
  min_guests: number;
  sections_count: number;
  is_active: boolean;
}

type Tab = 'menu' | 'packages';

export default function MenuManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // API
  const { data: menuItems = [], isLoading: menuLoading } = useCatererMenuItems();
  const { data: packages = [], isLoading: packagesLoading } = useCollections();
  const createItemMutation = useCreateCatererMenuItem();
  const deleteItemMutation = useDeleteCatererMenuItem();
  const updateItemMutation = useUpdateCatererMenuItem();

  // State
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVeg, setFilterVeg] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [filterSpice, setFilterSpice] = useState<'' | 'mild' | 'medium' | 'spicy'>('');

  // Form state - Simplified
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_files: [] as File[],
    image_preview: [] as string[],
    is_veg: true,
    spice_level: '' as 'mild' | 'medium' | 'spicy' | '',
    price: 0,
  });

  const [messages, setMessages] = useState({ error: '', success: '' });

  // Constants
  const MAX_FILE_SIZE = 500 * 1024; // 500KB
  const ALLOWED_FORMATS = ['image/png', 'image/jpeg'];
  const MAX_IMAGES = 3;

  // Handlers
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_files: [],
      image_preview: [],
      is_veg: true,
      spice_level: '',
      price: 0,
    });
    setEditingId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const errors: string[] = [];

    // Check total images count
    if (formData.image_files.length + files.length > MAX_IMAGES) {
      errors.push(`Maximum ${MAX_IMAGES} images allowed`);
    }

    // Validate each file
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach((file) => {
      if (!ALLOWED_FORMATS.includes(file.type)) {
        errors.push(`${file.name}: Only PNG and JPG formats allowed`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 500KB`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image_preview: [...prev.image_preview, e.target?.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (errors.length > 0) {
      setMessages({ error: errors.join(', '), success: '' });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image_files: [...prev.image_files, ...validFiles],
    }));

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_files: prev.image_files.filter((_, i) => i !== index),
      image_preview: prev.image_preview.filter((_, i) => i !== index),
    }));
  };

  const handleSaveMenuItem = async () => {
    if (!formData.name.trim()) {
      setMessages({ error: 'Please enter item name', success: '' });
      return;
    }

    if (formData.price <= 0) {
      setMessages({ error: 'Please enter a valid price', success: '' });
      return;
    }

    try {
      // For now, we'll use the first image preview as URL
      // In production, you'd upload to cloud storage and get URL
      const imageUrl = formData.image_preview[0] || undefined;

      if (editingId) {
        await updateItemMutation.mutateAsync({
          id: editingId,
          data: {
            name: formData.name,
            description: formData.description || undefined,
            image_url: imageUrl,
            is_veg: formData.is_veg,
            spice_level: formData.spice_level || undefined,
            price: formData.price,
          },
        });
        setMessages({ error: '', success: 'Item updated successfully!' });
      } else {
        await createItemMutation.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
          image_url: imageUrl,
          is_veg: formData.is_veg,
          spice_level: formData.spice_level || undefined,
          price: formData.price,
        });
        setMessages({ error: '', success: 'Item created successfully!' });
      }

      await queryClient.refetchQueries({
        queryKey: ['catererMenuItems'],
        type: 'active',
      });

      resetForm();
      setShowCreateModal(false);
      setTimeout(() => setMessages({ error: '', success: '' }), 2000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save item';
      setMessages({ error: msg, success: '' });
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteItemMutation.mutateAsync(id);
      setMessages({ error: '', success: 'Item deleted successfully!' });

      await queryClient.refetchQueries({
        queryKey: ['catererMenuItems'],
        type: 'active',
      });

      setTimeout(() => setMessages({ error: '', success: '' }), 2000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete item';
      setMessages({ error: msg, success: '' });
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      image_files: [],
      image_preview: item.image_url ? [item.image_url] : [],
      is_veg: item.is_veg,
      spice_level: item.spice_level || '',
      price: item.price,
    });
    setEditingId(item.id);
    setShowCreateModal(true);
  };

  // Filters
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVeg =
      filterVeg === 'all' ||
      (filterVeg === 'veg' && item.is_veg) ||
      (filterVeg === 'nonveg' && !item.is_veg);

    const matchesSpice = filterSpice === '' || item.spice_level === filterSpice;

    return matchesSearch && matchesVeg && matchesSpice;
  });

  const activePackages = packages.filter((pkg) => pkg.is_active);
  const fixedPackages = activePackages.filter((pkg) => pkg.type === 'fixed');
  const customizablePackages = activePackages.filter((pkg) => pkg.type === 'customizable');
  const subscribablePackages = activePackages.filter((pkg) => pkg.is_subscribable);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>🍛 Menu Management</h1>
          <p style={styles.pageSubtitle}>Manage your global menu items and packages</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/caterer/packages/create')}
            style={styles.buttonPrimary}
          >
            <PlusIcon style={{ width: '16px', height: '16px' }} />
            Create Package
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ ...styles.buttonPrimary, backgroundColor: '#059669' }}
          >
            <PlusIcon style={{ width: '16px', height: '16px' }} />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Messages */}
      {messages.error && <div style={styles.alertError}>{messages.error}</div>}
      {messages.success && <div style={styles.alertSuccess}>{messages.success}</div>}

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('menu')}
          style={{
            ...styles.tabButton,
            borderBottomColor: activeTab === 'menu' ? '#2563eb' : 'transparent',
            color: activeTab === 'menu' ? '#2563eb' : '#64748b',
          }}
        >
          📋 Menu Items
          <span style={styles.badge}>{menuItems.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          style={{
            ...styles.tabButton,
            borderBottomColor: activeTab === 'packages' ? '#2563eb' : 'transparent',
            color: activeTab === 'packages' ? '#2563eb' : '#64748b',
          }}
        >
          📦 Packages
          <span style={styles.badge}>{activePackages.length}</span>
        </button>
      </div>

      {/* MENU TAB */}
      {activeTab === 'menu' && (
        <div>
          {/* Filters */}
          <div style={styles.filterSection}>
            <div style={styles.searchInputWrapper}>
              <MagnifyingGlassIcon
                style={{ width: '16px', height: '16px', color: '#94a3b8' }}
              />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <select
              value={filterVeg}
              onChange={(e) => setFilterVeg(e.target.value as 'all' | 'veg' | 'nonveg')}
              style={styles.filterSelect}
            >
              <option value="all">All Items</option>
              <option value="veg">🥬 Vegetarian</option>
              <option value="nonveg">🍖 Non-Veg</option>
            </select>

            <select
              value={filterSpice}
              onChange={(e) => setFilterSpice(e.target.value as any)}
              style={styles.filterSelect}
            >
              <option value="">All Spice Levels</option>
              <option value="mild">🌶️ Mild</option>
              <option value="medium">🌶️🌶️ Medium</option>
              <option value="spicy">🌶️🌶️🌶️ Spicy</option>
            </select>
          </div>

          {/* Menu Items Grid */}
          {menuLoading ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>⏳ Loading menu items...</p>
            </div>
          ) : filteredMenuItems.length > 0 ? (
            <div style={styles.menuGrid}>
              {filteredMenuItems.map((item) => (
                <div key={item.id} style={styles.menuCard}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={styles.menuCardImage}
                    />
                  )}
                  <div style={styles.menuCardContent}>
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={styles.menuCardTitle}>{item.name}</h3>
                      {item.description && (
                        <p style={styles.menuCardDescription}>{item.description}</p>
                      )}
                    </div>

                    <div style={styles.menuCardTags}>
                      <span style={styles.tag}>
                        {item.is_veg ? '🥬 Veg' : '🍖 Non-Veg'}
                      </span>
                      {item.spice_level && (
                        <span style={styles.tag}>
                          {item.spice_level === 'mild'
                            ? '🌶️ Mild'
                            : item.spice_level === 'medium'
                            ? '🌶️🌶️ Medium'
                            : '🌶️🌶️🌶️ Spicy'}
                        </span>
                      )}
                    </div>

                    <div style={styles.menuCardFooter}>
                      <div>
                        <p style={styles.price}>₹{item.price}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditMenuItem(item)}
                          style={styles.buttonIcon}
                          title="Edit"
                        >
                          <PencilIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          style={styles.buttonIconDelete}
                          title="Delete"
                        >
                          <TrashIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>🍽️ No menu items yet</p>
              <p style={styles.emptyStateSubtext}>
                Create your first menu item to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={styles.buttonPrimary}
              >
                <PlusIcon style={{ width: '16px', height: '16px' }} />
                Create First Item
              </button>
            </div>
          )}
        </div>
      )}

      {/* PACKAGES TAB */}
      {activeTab === 'packages' && (
        <div>
          {/* Package Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>📦 Total Packages</p>
              <p style={styles.statValue}>{activePackages.length}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>🔒 Fixed Packages</p>
              <p style={styles.statValue}>{fixedPackages.length}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>🎨 Customizable</p>
              <p style={styles.statValue}>{customizablePackages.length}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>📅 Subscribable</p>
              <p style={styles.statValue}>{subscribablePackages.length}</p>
            </div>
          </div>

          {packagesLoading ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>⏳ Loading packages...</p>
            </div>
          ) : activePackages.length > 0 ? (
            <div>
              {/* Fixed Packages Section */}
              {fixedPackages.length > 0 && (
                <div style={styles.packageSection}>
                  <h2 style={styles.sectionTitle}>🔒 Fixed Packages</h2>
                  <p style={styles.sectionSubtitle}>
                    Same items for all customers, no customization
                  </p>
                  <div style={styles.packageGrid}>
                    {fixedPackages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        onEdit={() =>
                          router.push(`/caterer/packages/${pkg.id}/edit`)
                        }
                        onView={() =>
                          router.push(`/caterer/packages/${pkg.id}`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Customizable Packages Section */}
              {customizablePackages.length > 0 && (
                <div style={styles.packageSection}>
                  <h2 style={styles.sectionTitle}>🎨 Customizable Packages</h2>
                  <p style={styles.sectionSubtitle}>
                    Customers can pick items from sections
                  </p>
                  <div style={styles.packageGrid}>
                    {customizablePackages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        onEdit={() =>
                          router.push(`/caterer/packages/${pkg.id}/edit`)
                        }
                        onView={() =>
                          router.push(`/caterer/packages/${pkg.id}`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribable Packages Section */}
              {subscribablePackages.length > 0 && (
                <div style={styles.packageSection}>
                  <h2 style={styles.sectionTitle}>📅 Subscription Plans</h2>
                  <p style={styles.sectionSubtitle}>
                    Available for recurring orders
                  </p>
                  <div style={styles.packageGrid}>
                    {subscribablePackages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        showSubscriptionBadge
                        onEdit={() =>
                          router.push(`/caterer/packages/${pkg.id}/edit`)
                        }
                        onView={() =>
                          router.push(`/caterer/packages/${pkg.id}`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>📦 No packages created yet</p>
              <p style={styles.emptyStateSubtext}>
                Create your first package to start taking orders
              </p>
              <button
                onClick={() => router.push('/caterer/packages/create')}
                style={styles.buttonPrimary}
              >
                <PlusIcon style={{ width: '16px', height: '16px' }} />
                Create First Package
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Item Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, maxWidth: '700px' }}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId ? '✏️ Edit Menu Item' : '🍛 Create New Menu Item'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                style={styles.modalCloseButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              {/* Item Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Paneer Tikka"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={styles.input}
                />
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe this item..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              {/* Image Upload */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Images ({formData.image_preview.length}/{MAX_IMAGES})
                </label>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                  }}
                >
                  PNG or JPG only, max 500KB each
                </p>

                {formData.image_preview.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    {formData.image_preview.map((preview, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f1f5f9',
                          aspectRatio: '1',
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${idx}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0',
                          }}
                        >
                          <XMarkIcon style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.image_preview.length < MAX_IMAGES && (
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '2px dashed #bfdbfe',
                      backgroundColor: '#f0f9ff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = '#bfdbfe';
                      e.currentTarget.style.backgroundColor = '#f0f9ff';
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2563eb',
                        marginBottom: '4px',
                      }}
                    >
                      📸 Click to upload or drag
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Veg/Non-Veg Toggle */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Type *</label>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px',
                  }}
                >
                  <button
                    onClick={() =>
                      setFormData({ ...formData, is_veg: true })
                    }
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: formData.is_veg ? '#10b981' : '#e2e8f0',
                      color: formData.is_veg ? 'white' : '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    🥬 Vegetarian
                  </button>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, is_veg: false })
                    }
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: !formData.is_veg ? '#dc2626' : '#e2e8f0',
                      color: !formData.is_veg ? 'white' : '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    🍖 Non-Veg
                  </button>
                </div>
              </div>

              {/* Spice Level and Price Row */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Spice Level</label>
                  <select
                    value={formData.spice_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        spice_level: e.target.value as any,
                      })
                    }
                    style={styles.input}
                  >
                    <option value="">Not specified</option>
                    <option value="mild">🌶️ Mild</option>
                    <option value="medium">🌶️🌶️ Medium</option>
                    <option value="spicy">🌶️🌶️🌶️ Spicy</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    style={styles.input}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                style={styles.buttonSecondary}
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
      )}
    </div>
  );
}

// Package Card Component
function PackageCard({
  pkg,
  onEdit,
  onView,
  showSubscriptionBadge = false,
}: {
  pkg: Package;
  onEdit: () => void;
  onView: () => void;
  showSubscriptionBadge?: boolean;
}) {
  return (
    <div style={styles.packageCard}>
      {showSubscriptionBadge && (
        <div style={styles.subscriptionBadge}>
          <StarIcon style={{ width: '14px', height: '14px' }} />
          Subscribable
        </div>
      )}

      <div style={styles.packageCardHeader}>
        <div>
          <h3 style={styles.packageCardTitle}>{pkg.name}</h3>
          <p style={styles.packageCardMeta}>
            {pkg.type === 'fixed' ? '🔒 Fixed' : '🎨 Customizable'} • {pkg.sections_count} sections
          </p>
        </div>
      </div>

      {pkg.description && (
        <p style={styles.packageCardDescription}>{pkg.description}</p>
      )}

      <div style={styles.packageCardPrice}>
        <span style={styles.priceLabel}>From:</span>
        <span style={styles.priceValue}>
          ₹{pkg.base_price}
          {pkg.min_guests && <span style={styles.priceMeta}> per person</span>}
        </span>
      </div>

      {pkg.min_guests && (
        <p style={styles.packageCardInfo}>👥 Minimum {pkg.min_guests} guests</p>
      )}

      <div style={styles.packageCardActions}>
        <button onClick={onView} style={styles.buttonSecondary}>
          View
        </button>
        <button onClick={onEdit} style={styles.buttonPrimary}>
          <PencilIcon style={{ width: '16px', height: '16px' }} />
          Edit
        </button>
      </div>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  tabContainer: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: 'white',
    padding: '0 24px',
  },
  tabButton: {
    padding: '16px 0',
    border: 'none',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    fontSize: '12px',
    fontWeight: '700',
  },
  filterSection: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '250px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
  },
  filterSelect: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    fontSize: '14px',
    cursor: 'pointer',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  menuCardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    backgroundColor: '#f1f5f9',
  },
  menuCardContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
  },
  menuCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  menuCardDescription: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
  menuCardTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
    marginBottom: '12px',
  },
  tag: {
    fontSize: '11px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  menuCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ea580c',
    margin: 0,
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    marginBottom: '8px',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2563eb',
    margin: 0,
  },
  packageSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    marginBottom: '16px',
  },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '20px',
    position: 'relative' as const,
    transition: 'all 0.2s ease',
  },
  subscriptionBadge: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
  packageCardHeader: {
    marginBottom: '12px',
  },
  packageCardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  packageCardMeta: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  packageCardDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    marginBottom: '16px',
    fontStyle: 'italic',
  },
  packageCardPrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#0c4a6e',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb',
  },
  priceMeta: {
    fontSize: '12px',
    color: '#0c4a6e',
    fontWeight: '500',
  },
  packageCardInfo: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    marginBottom: '16px',
  },
  packageCardActions: {
    display: 'flex',
    gap: '8px',
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
    marginBottom: '24px',
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
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
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
  alertError: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    color: '#7f1d1d',
    marginBottom: '16px',
    fontSize: '14px',
  },
  alertSuccess: {
    padding: '12px 16px',
    backgroundColor: '#d1fae5',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    color: '#065f46',
    marginBottom: '16px',
    fontSize: '14px',
  },
};