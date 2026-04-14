'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface Package {
  id: number;
  name: string;
  description: string;
  coverImage: File | null;
  pricingType: 'per_plate' | 'fixed';
  basePrice: number;
  currency: string;
  minGuests: number;
  maxGuests: number;
  isActive: boolean;
  createdDate: string;
  categoriesCount: number;
}

interface Menu {
  id: number;
  name: string;
  description: string;
  coverImage: File | null;
  isActive: boolean;
  createdDate: string;
  sectionsCount: number;
}

export default function PackagesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // State for packages and menus
  const [packages, setPackages] = useState<Package[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'simple-menus' | 'add-package' | 'bulk'>('all');
  const [showWhatToCreate, setShowWhatToCreate] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'name'>('newest');
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: null as File | null,
    pricingType: 'per_plate' as 'per_plate' | 'fixed',
    basePrice: '350',
    currency: 'INR',
    minGuests: '50',
    maxGuests: '500',
    isActive: true,
  });

  const [bulkFormData, setBulkFormData] = useState({
    uploadMethod: 'excel' as 'excel' | 'json',
    file: null as File | null,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPackages = localStorage.getItem('catering_packages');
    const savedMenus = localStorage.getItem('catering_menus');

    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
      setShowWhatToCreate(false);
    }
    if (savedMenus) {
      setMenus(JSON.parse(savedMenus));
      setShowWhatToCreate(false);
    }

    setMounted(true);
  }, []);

  // Save packages to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('catering_packages', JSON.stringify(packages));
    }
  }, [packages, mounted]);

  // Save menus to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('catering_menus', JSON.stringify(menus));
    }
  }, [menus, mounted]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.basePrice - b.basePrice;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'newest':
          default:
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        }
      });
  }, [packages, searchTerm, sortBy]);

  // Filtered menus
  const filteredMenus = useMemo(() => {
    return menus
      .filter((menu) =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });
  }, [menus, searchTerm, sortBy]);

  // ============ PACKAGE HANDLERS ============
  const handleCreatePackage = () => {
    setEditingPackageId(null);
    setFormData({
      name: '',
      description: '',
      coverImage: null,
      pricingType: 'per_plate',
      basePrice: '350',
      currency: 'INR',
      minGuests: '50',
      maxGuests: '500',
      isActive: true,
    });
    setActiveTab('add-package');
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackageId(pkg.id);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      coverImage: null,
      pricingType: pkg.pricingType,
      basePrice: pkg.basePrice.toString(),
      currency: pkg.currency,
      minGuests: pkg.minGuests.toString(),
      maxGuests: pkg.maxGuests.toString(),
      isActive: pkg.isActive,
    });
    setActiveTab('add-package');
  };

  const handleSavePackage = () => {
    if (!formData.name.trim() || !formData.basePrice) {
      alert('Please fill in required fields');
      return;
    }

    if (editingPackageId) {
      // Update existing package
      setPackages(
        packages.map((pkg) =>
          pkg.id === editingPackageId
            ? {
                ...pkg,
                name: formData.name,
                description: formData.description,
                pricingType: formData.pricingType,
                basePrice: parseInt(formData.basePrice),
                currency: formData.currency,
                minGuests: parseInt(formData.minGuests),
                maxGuests: parseInt(formData.maxGuests),
                isActive: formData.isActive,
              }
            : pkg
        )
      );
      alert('Package updated successfully!');
    } else {
      // Create new package
      const newPackage: Package = {
        id: packages.length > 0 ? Math.max(...packages.map((p) => p.id)) + 1 : 1,
        name: formData.name,
        description: formData.description,
        coverImage: null,
        pricingType: formData.pricingType,
        basePrice: parseInt(formData.basePrice),
        currency: formData.currency,
        minGuests: parseInt(formData.minGuests),
        maxGuests: parseInt(formData.maxGuests),
        isActive: formData.isActive,
        createdDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        categoriesCount: 0,
      };
      setPackages([...packages, newPackage]);
      setShowWhatToCreate(false);
      alert('Package created successfully!');
    }

    setActiveTab('all');
    setEditingPackageId(null);
  };

  const handleDeletePackage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
      alert('Package deleted successfully!');
    }
  };

  const handleViewPackage = (id: number) => {
    router.push(`/caterer/packages/${id}`);
  };

  // ============ SIMPLE MENU HANDLERS ============
  const handleCreateSimpleMenu = () => {
    router.push('/caterer/packages/menus/new');
  };

  const handleEditMenu = (menuId: number) => {
    router.push(`/caterer/packages/menus/${menuId}/edit`);
  };

  const handleViewMenu = (menuId: number) => {
    router.push(`/caterer/packages/menus/${menuId}`);
  };

  const handleDeleteMenu = (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      setMenus(menus.filter((menu) => menu.id !== id));
      alert('Menu deleted successfully!');
    }
  };

  // ============ BULK UPLOAD HANDLERS ============
  const handleBulkUpload = () => {
    if (!bulkFormData.file) {
      alert('Please select a file');
      return;
    }
    alert(`Bulk upload would process ${bulkFormData.file.name}`);
    setActiveTab('all');
    setBulkFormData({ uploadMethod: 'excel', file: null });
  };

  const downloadTemplate = () => {
    const template = `Package Name,Description,Base Price,Currency,Min Guests,Max Guests,Pricing Type,Is Active
Special Hyderabadi Biryani,Aromatic biryani with rice,350,INR,50,500,per_plate,true
North Indian Thali,Complete north indian meal,400,INR,30,300,per_plate,true`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packages_template.csv';
    a.click();
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  // ============ EMPTY STATE ============
  if (showWhatToCreate && packages.length === 0 && menus.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyStateContent}>
            <h1 style={styles.emptyStateTitle}>🍽️ Create Your First Menu</h1>
            <p style={styles.emptyStateSubtitle}>
              Showcase your catering offerings to attract customers.
            </p>

            <div style={styles.optionsContainer}>
              <div style={styles.optionCard}>
                <div style={styles.optionIcon}>📦</div>
                <h3 style={styles.optionTitle}>Create Catering Packages</h3>
                <p style={styles.optionDescription}>
                  Perfect for complete meal offerings with fixed pricing per plate. Great for weddings, corporate events, and celebrations.
                </p>
                <div style={styles.optionDetails}>
                  <p style={styles.detailTitle}>What you can do:</p>
                  <ul style={styles.detailList}>
                    <li>Set per-plate or fixed pricing</li>
                    <li>Define guest range (minimum & maximum)</li>
                    <li>Add multiple dish categories</li>
                    <li>Include customization options</li>
                  </ul>
                </div>
                <p style={styles.optionExample}>
                  <strong>Example:</strong> "Wedding Gold Package" - ₹500/plate for 100-500 guests
                </p>
              </div>

              <div style={styles.optionCard}>
                <div style={styles.optionIcon}>📋</div>
                <h3 style={styles.optionTitle}>Create Simple Menus</h3>
                <p style={styles.optionDescription}>
                  Organize dishes by sections without package pricing. Ideal for à la carte menus or item-by-item ordering.
                </p>
                <div style={styles.optionDetails}>
                  <p style={styles.detailTitle}>What you can do:</p>
                  <ul style={styles.detailList}>
                    <li>Organize dishes into sections</li>
                    <li>No package pricing required</li>
                    <li>Quick and easy setup</li>
                    <li>Perfect for à la carte menus</li>
                  </ul>
                </div>
                <p style={styles.optionExample}>
                  <strong>Example:</strong> "North Indian Menu" with sections like Appetizers, Main Course, Desserts
                </p>
              </div>
            </div>

            <div style={styles.comparisonTable}>
              <h3 style={styles.comparisonTitle}>Quick Comparison</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Feature</th>
                    <th style={styles.tableHeader}>Catering Packages</th>
                    <th style={styles.tableHeader}>Simple Menus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Pricing</td>
                    <td style={styles.tableCell}>Per-plate or fixed</td>
                    <td style={styles.tableCell}>No pricing</td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Guest Range</td>
                    <td style={styles.tableCell}>Min & Max guests</td>
                    <td style={styles.tableCell}>Not required</td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Categories</td>
                    <td style={styles.tableCell}>Multiple categories</td>
                    <td style={styles.tableCell}>Sections only</td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Best For</td>
                    <td style={styles.tableCell}>Events, catering orders</td>
                    <td style={styles.tableCell}>À la carte, item listing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={styles.actionButtonsContainer}>
              <button onClick={handleCreatePackage} style={styles.buttonCreatePackage}>
                <PlusIcon style={{ width: '20px', height: '20px' }} />
                Create Catering Package
              </button>
              <button onClick={handleCreateSimpleMenu} style={styles.buttonCreateMenu}>
                <PlusIcon style={{ width: '20px', height: '20px' }} />
                Create Simple Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ BULK UPLOAD TAB ============
  if (activeTab === 'bulk') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setActiveTab('all')} style={styles.backButton}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>📤 Bulk Upload Packages</h1>
            <p style={styles.subtitle}>Import multiple packages at once</p>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.formContainer}>
            <div style={styles.formSection}>
              <h3 style={styles.sectionSubtitle}>Choose Upload Method</h3>

              <div style={styles.methodsGrid}>
                <label style={styles.methodOption}>
                  <input
                    type="radio"
                    name="uploadMethod"
                    value="excel"
                    checked={bulkFormData.uploadMethod === 'excel'}
                    onChange={(e) =>
                      setBulkFormData({
                        ...bulkFormData,
                        uploadMethod: e.target.value as 'excel' | 'json',
                      })
                    }
                    style={styles.radio}
                  />
                  <span style={styles.methodLabel}>Excel/CSV Template</span>
                </label>

                <label style={styles.methodOption}>
                  <input
                    type="radio"
                    name="uploadMethod"
                    value="json"
                    checked={bulkFormData.uploadMethod === 'json'}
                    onChange={(e) =>
                      setBulkFormData({
                        ...bulkFormData,
                        uploadMethod: e.target.value as 'excel' | 'json',
                      })
                    }
                    style={styles.radio}
                  />
                  <span style={styles.methodLabel}>JSON Upload</span>
                </label>
              </div>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionSubtitle}>Upload File</h3>

              <div style={styles.fileUploadBox}>
                <input
                  type="file"
                  accept={bulkFormData.uploadMethod === 'excel' ? '.xlsx,.csv' : '.json'}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setBulkFormData({ ...bulkFormData, file: e.target.files[0] });
                    }
                  }}
                  style={styles.fileInput}
                  id="bulkFile"
                />
                <label htmlFor="bulkFile" style={styles.uploadLabel}>
                  <span style={styles.uploadIcon}>📁</span>
                  <span style={styles.uploadText}>Click to select or drag and drop</span>
                  {bulkFormData.file && <span style={styles.uploadHint}>✓ {bulkFormData.file.name}</span>}
                </label>
              </div>

              {bulkFormData.uploadMethod === 'excel' && (
                <button onClick={downloadTemplate} style={styles.buttonSecondary}>
                  📥 Download Template
                </button>
              )}
            </div>

            <div style={styles.formActions}>
              <button onClick={() => setActiveTab('all')} style={styles.buttonSecondary}>
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFormData.file}
                style={{
                  ...styles.buttonPrimary,
                  opacity: !bulkFormData.file ? 0.5 : 1,
                  cursor: !bulkFormData.file ? 'not-allowed' : 'pointer',
                }}
              >
                📤 Import Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ADD PACKAGE TAB ============
  if (activeTab === 'add-package') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setActiveTab('all')} style={styles.backButton}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>
              {editingPackageId ? '✏️ Edit Package' : '📦 Add New Package'}
            </h1>
            <p style={styles.subtitle}>
              {editingPackageId ? 'Update your package details' : 'Create a new catering package with pricing and guest limits'}
            </p>
          </div>
        </div>

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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                />
                <p style={styles.helperText}>Give your package a catchy name that describes the offering</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="e.g., Includes biryani, raita, salad, dessert, and beverages. Perfect for celebrations and events."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                />
                <p style={styles.helperText}>Describe what's included in this package to help customers understand the offering</p>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionSubtitle}>Pricing Details</h3>
                <span style={styles.helpIcon}>💰</span>
              </div>

              <div style={styles.pricingGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Base Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="350"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    style={styles.input}
                  />
                  <p style={styles.helperText}>Price per plate (₹)</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Pricing Type</label>
                  <select
                    value={formData.pricingType}
                    onChange={(e) => setFormData({ ...formData, pricingType: e.target.value as 'per_plate' | 'fixed' })}
                    style={styles.input}
                  >
                    <option value="per_plate">Per Plate</option>
                    <option value="fixed">Fixed Price</option>
                  </select>
                  <p style={styles.helperText}>How you charge for this package</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    style={styles.input}
                  />
                  <p style={styles.helperText}>e.g., INR</p>
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
                    value={formData.minGuests}
                    onChange={(e) => setFormData({ ...formData, minGuests: e.target.value })}
                    style={styles.input}
                  />
                  <p style={styles.helperText}>Minimum guests required for this package</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Maximum Guests *</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                    style={styles.input}
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
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  Active Package
                </label>
                <p style={styles.helperText}>Active packages are visible to customers. Inactive packages are hidden.</p>
              </div>
            </div>

            <div style={styles.formActions}>
              <button onClick={() => setActiveTab('all')} style={styles.buttonSecondary}>
                Cancel
              </button>
              <button onClick={handleSavePackage} style={styles.buttonPrimary}>
                {editingPackageId ? 'Update Package' : 'Create Package'}
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

      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            ...styles.tab,
            ...(activeTab === 'all' ? styles.tabActive : styles.tabInactive),
          }}
        >
          📦 All ({packages.length + menus.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          style={{
            ...styles.tab,
            ...(activeTab === 'packages' ? styles.tabActive : styles.tabInactive),
          }}
        >
          📦 Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('simple-menus')}
          style={{
            ...styles.tab,
            ...(activeTab === 'simple-menus' ? styles.tabActive : styles.tabInactive),
          }}
        >
          📋 Menus ({menus.length})
        </button>
        <button onClick={handleCreatePackage} style={{ ...styles.tab, backgroundColor: '#2563eb', color: 'white' }}>
          ➕ Package
        </button>
        <button onClick={handleCreateSimpleMenu} style={{ ...styles.tab, backgroundColor: '#10b981', color: 'white' }}>
          ➕ Menu
        </button>
        <button onClick={() => setActiveTab('bulk')} style={{ ...styles.tab, backgroundColor: '#f59e0b', color: 'white' }}>
          📤 Upload
        </button>
      </div>

      {/* ALL VIEW */}
      {activeTab === 'all' && (
        <div style={styles.section}>
          {packages.length > 0 && (
            <>
              <h2 style={styles.sectionTitle}>📦 Packages ({packages.length})</h2>
              <div style={styles.grid}>
                {filteredPackages.map((pkg) => (
                  <div key={pkg.id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{pkg.name}</h3>
                    <p style={styles.cardDesc}>{pkg.description}</p>
                    <div style={styles.cardMeta}>
                      <span>₹{pkg.basePrice}/plate</span>
                      <span>{pkg.minGuests}-{pkg.maxGuests} guests</span>
                    </div>
                    <div style={styles.cardActions}>
                      <button onClick={() => handleViewPackage(pkg.id)} style={styles.btnSmall}>
                        👁️ View
                      </button>
                      <button onClick={() => handleEditPackage(pkg)} style={styles.btnSmall}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeletePackage(pkg.id)} style={styles.btnSmallDanger}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {menus.length > 0 && (
            <>
              <h2 style={styles.sectionTitle}>📋 Menus ({menus.length})</h2>
              <div style={styles.grid}>
                {filteredMenus.map((menu) => (
                  <div key={menu.id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{menu.name}</h3>
                    <p style={styles.cardDesc}>{menu.description}</p>
                    <div style={styles.cardMeta}>
                      <span>{menu.sectionsCount} sections</span>
                    </div>
                    <div style={styles.cardActions}>
                      <button onClick={() => handleViewMenu(menu.id)} style={styles.btnSmall}>
                        👁️ View
                      </button>
                      <button onClick={() => handleEditMenu(menu.id)} style={styles.btnSmall}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteMenu(menu.id)} style={styles.btnSmallDanger}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {packages.length === 0 && menus.length === 0 && (
            <div style={styles.emptyState}>
              <p>No packages or menus yet</p>
              <button onClick={handleCreatePackage} style={styles.buttonPrimary}>
                Create First Package
              </button>
            </div>
          )}
        </div>
      )}

      {/* PACKAGES ONLY */}
      {activeTab === 'packages' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📦 Catering Packages</h2>
          {filteredPackages.length > 0 ? (
            <div style={styles.grid}>
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{pkg.name}</h3>
                  <p style={styles.cardDesc}>{pkg.description}</p>
                  <div style={styles.cardMeta}>
                    <span>₹{pkg.basePrice}/plate</span>
                    <span>{pkg.minGuests}-{pkg.maxGuests} guests</span>
                  </div>
                  <div style={styles.cardActions}>
                    <button onClick={() => handleViewPackage(pkg.id)} style={styles.btnSmall}>
                      👁️ View
                    </button>
                    <button onClick={() => handleEditPackage(pkg)} style={styles.btnSmall}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeletePackage(pkg.id)} style={styles.btnSmallDanger}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No packages created yet</p>
              <button onClick={handleCreatePackage} style={styles.buttonPrimary}>
                Create Package
              </button>
            </div>
          )}
        </div>
      )}

      {/* MENUS ONLY */}
      {activeTab === 'simple-menus' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Simple Menus</h2>
          {filteredMenus.length > 0 ? (
            <div style={styles.grid}>
              {filteredMenus.map((menu) => (
                <div key={menu.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{menu.name}</h3>
                  <p style={styles.cardDesc}>{menu.description}</p>
                  <div style={styles.cardMeta}>
                    <span>{menu.sectionsCount} sections</span>
                  </div>
                  <div style={styles.cardActions}>
                    <button onClick={() => handleViewMenu(menu.id)} style={styles.btnSmall}>
                      👁️ View
                    </button>
                    <button onClick={() => handleEditMenu(menu.id)} style={styles.btnSmall}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteMenu(menu.id)} style={styles.btnSmallDanger}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No menus created yet</p>
              <button onClick={handleCreateSimpleMenu} style={styles.buttonPrimary}>
                Create Menu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  emptyStateContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
  },
  emptyStateContent: {
    textAlign: 'center',
    maxWidth: '1200px',
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
  comparisonTable: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    marginBottom: '32px',
  },
  comparisonTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: '2px solid #e2e8f0',
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left' as const,
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
  },
  tableCell: {
    padding: '12px',
    fontSize: '13px',
    color: '#64748b',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonCreateMenu: {
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  tab: {
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
  tabActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: '1px solid #2563eb',
  },
  tabInactive: {
    backgroundColor: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
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
    marginBottom: '16px',
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
  },
  cardMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '12px',
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
    border: '1px solid #dc2626',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #e2e8f0',
  },
  largeFormContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  formContainer: {
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
  methodsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  methodOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  radio: {
    cursor: 'pointer',
  },
  methodLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  fileUploadBox: {
    position: 'relative' as const,
    marginBottom: '16px',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    border: '2px dashed #2563eb',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#eff6ff',
  },
  uploadIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  uploadText: {
    fontSize: '14px',
    color: '#2563eb',
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#10b981',
    marginTop: '8px',
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