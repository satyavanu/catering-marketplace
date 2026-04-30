'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Package {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  minGuests: number;
  maxGuests: number;
  isActive: boolean;
  createdDate: string;
  categoriesCount: number;
}

interface Dish {
  id: number;
  name: string;
  category: 'veg' | 'non-veg' | 'vegan';
  price?: string;
  description?: string;
}

interface MenuSection {
  id: number;
  name: string;
  dishes: Dish[];
}

export default function NewMenuPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const [sections, setSections] = useState<MenuSection[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [expandedSectionId, setExpandedSectionId] = useState<number | null>(null);
  const [showAddDish, setShowAddDish] = useState<number | null>(null);

  const [newDish, setNewDish] = useState({
    name: '',
    category: 'veg' as 'veg' | 'non-veg' | 'vegan',
    description: '',
  });

  const [useFromPackage, setUseFromPackage] = useState('');

  // Load packages from localStorage
  useEffect(() => {
    const savedPackages = localStorage.getItem('catering_packages');
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    }
    setMounted(true);
  }, []);

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      alert('Please enter a section name');
      return;
    }
    setSections([
      ...sections,
      {
        id: Math.max(...sections.map((s) => s.id), 0) + 1,
        name: newSectionName,
        dishes: [],
      },
    ]);
    setNewSectionName('');
  };

  const handleAddDish = (sectionId: number) => {
    if (!newDish.name.trim()) {
      alert('Please enter a dish name');
      return;
    }

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              dishes: [
                ...section.dishes,
                {
                  id: Math.max(...section.dishes.map((d) => d.id), 0) + 1,
                  name: newDish.name,
                  category: newDish.category,
                  description: newDish.description,
                },
              ],
            }
          : section
      )
    );

    setNewDish({ name: '', category: 'veg', description: '' });
    setShowAddDish(null);
  };

  const handleDeleteDish = (sectionId: number, dishId: number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              dishes: section.dishes.filter((d) => d.id !== dishId),
            }
          : section
      )
    );
  };

  const handleDeleteSection = (sectionId: number) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const handleSaveMenu = () => {
    if (!formData.name.trim()) {
      alert('Please enter a menu name');
      return;
    }

    if (sections.length === 0) {
      alert('Please add at least one section');
      return;
    }

    if (sections.some((s) => s.dishes.length === 0)) {
      alert('Each section must have at least one dish');
      return;
    }

    const newMenu = {
      id: Math.max(...(JSON.parse(localStorage.getItem('catering_menus') || '[]') as Array<{ id: number }>).map((m) => m.id), 0) + 1,
      name: formData.name,
      description: formData.description,
      coverImage: null,
      isActive: formData.isActive,
      createdDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      sectionsCount: sections.length,
      sections: sections,
    };

    const existingMenus = JSON.parse(localStorage.getItem('catering_menus') || '[]');
    localStorage.setItem('catering_menus', JSON.stringify([...existingMenus, newMenu]));

    alert('Menu created successfully!');
    router.push('/caterer/packages');
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>
        <div>
          <h1 style={styles.title}>📋 Create Simple Menu</h1>
          <p style={styles.subtitle}>Organize dishes by sections (appetizers, mains, desserts, etc.)</p>
        </div>
      </div>

      {/* MENU DETAILS SECTION */}
      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.cardTitle}>Menu Information</h2>
          <span style={styles.helpIcon}>ℹ️</span>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Menu Name *</label>
          <input
            type="text"
            placeholder="e.g., North Indian Menu, Vegetarian Delight, Festival Special"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
          />
          <p style={styles.helperText}>Give your menu a descriptive name</p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            placeholder="Describe this menu. E.g., A curated selection of North Indian dishes perfect for family gatherings"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
          />
          <p style={styles.helperText}>Optional: Help customers understand what this menu offers</p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Active Menu
          </label>
          <p style={styles.helperText}>Active menus are visible to customers</p>
        </div>
      </div>

      {/* SECTIONS MANAGEMENT */}
      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.cardTitle}>Menu Sections</h2>
          <span style={styles.helpIcon}>📂</span>
        </div>
        <p style={styles.sectionDescription}>Add sections like Appetizers, Mains, Desserts, etc. Each section will contain dishes</p>

        <div style={styles.addSectionBox}>
          <div style={styles.addSectionInputs}>
            <input
              type="text"
              placeholder="E.g., Appetizers, Main Course, Desserts, Beverages"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleAddSection} style={styles.buttonAdd}>
              ➕ Add Section
            </button>
          </div>
        </div>

        {sections.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No sections yet. Add your first section above.</p>
          </div>
        ) : (
          <div style={styles.sectionsContainer}>
            {sections.map((section) => (
              <div key={section.id} style={styles.sectionCard}>
                <div
                  style={styles.sectionCardHeader}
                  onClick={() =>
                    setExpandedSectionId(expandedSectionId === section.id ? null : section.id)
                  }
                >
                  <div style={styles.sectionCardTitle}>
                    <span style={styles.expandIcon}>
                      {expandedSectionId === section.id ? '▼' : '▶'}
                    </span>
                    <h3 style={styles.sectionName}>{section.name}</h3>
                    <span style={styles.dishCount}>
                      {section.dishes.length} {section.dishes.length === 1 ? 'dish' : 'dishes'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    style={styles.btnDelete}
                  >
                    🗑️
                  </button>
                </div>

                {expandedSectionId === section.id && (
                  <div style={styles.sectionContent}>
                    {/* DISHES LIST */}
                    {section.dishes.length > 0 && (
                      <div style={styles.dishesList}>
                        {section.dishes.map((dish) => (
                          <div key={dish.id} style={styles.dishItem}>
                            <div style={styles.dishInfo}>
                              <div style={styles.dishName}>
                                <span
                                  style={{
                                    ...styles.categoryBadge,
                                    backgroundColor:
                                      dish.category === 'veg'
                                        ? '#d1fae5'
                                        : dish.category === 'non-veg'
                                        ? '#fee2e2'
                                        : '#fef3c7',
                                  }}
                                >
                                  {dish.category === 'veg'
                                    ? '🟢 Veg'
                                    : dish.category === 'non-veg'
                                    ? '🔴 Non-Veg'
                                    : '🟡 Vegan'}
                                </span>
                                <span>{dish.name}</span>
                              </div>
                              {dish.description && (
                                <p style={styles.dishDescription}>{dish.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteDish(section.id, dish.id)}
                              style={styles.btnDeleteDish}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ADD DISH FORM */}
                    {showAddDish === section.id ? (
                      <div style={styles.addDishForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Dish Name *</label>
                          <input
                            type="text"
                            placeholder="E.g., Paneer Tikka, Butter Chicken"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                            style={styles.input}
                          />
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Category *</label>
                            <select
                              value={newDish.category}
                              onChange={(e) =>
                                setNewDish({
                                  ...newDish,
                                  category: e.target.value as 'veg' | 'non-veg' | 'vegan',
                                })
                              }
                              style={styles.input}
                            >
                              <option value="veg">🟢 Vegetarian</option>
                              <option value="non-veg">🔴 Non-Vegetarian</option>
                              <option value="vegan">🟡 Vegan</option>
                            </select>
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Description</label>
                          <textarea
                            placeholder="E.g., Cottage cheese marinated in yogurt and spices"
                            value={newDish.description}
                            onChange={(e) =>
                              setNewDish({ ...newDish, description: e.target.value })
                            }
                            style={{
                              ...styles.input,
                              minHeight: '60px',
                              resize: 'vertical',
                            }}
                          />
                        </div>

                        <div style={styles.formActions}>
                          <button
                            onClick={() => setShowAddDish(null)}
                            style={styles.buttonSecondary}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddDish(section.id)}
                            style={styles.buttonPrimary}
                          >
                            ✓ Add Dish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddDish(section.id)}
                        style={styles.buttonAddDish}
                      >
                        ➕ Add Dish to {section.name}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* USE FROM PACKAGE SUGGESTION */}
      {packages.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.cardTitle}>Quick Start (Optional)</h2>
            <span style={styles.helpIcon}>💡</span>
          </div>
          <p style={styles.sectionDescription}>
            You can manually create your menu as shown above, or create a simple menu from an existing package
          </p>

          <div style={styles.packagesList}>
            {packages.map((pkg) => (
              <div key={pkg.id} style={styles.packageOption}>
                <div>
                  <p style={styles.packageName}>{pkg.name}</p>
                  <p style={styles.packageMeta}>₹{pkg.basePrice} • {pkg.minGuests}-{pkg.maxGuests} guests</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={styles.actions}>
        <button onClick={() => router.back()} style={styles.buttonSecondary}>
          ✕ Cancel
        </button>
        <button onClick={handleSaveMenu} style={styles.buttonPrimary}>
          ✓ Save Menu
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
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
  card: {
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
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  helpIcon: {
    fontSize: '18px',
    cursor: 'help',
  },
  sectionDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 16px 0',
    fontStyle: 'italic',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
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
  addSectionBox: {
    marginBottom: '20px',
  },
  addSectionInputs: {
    display: 'flex',
    gap: '12px',
  },
  buttonAdd: {
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    whiteSpace: 'nowrap' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
    color: '#64748b',
  },
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  sectionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    cursor: 'pointer',
    backgroundColor: 'white',
    transition: 'background-color 0.2s',
  },
  sectionCardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  expandIcon: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  sectionName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  dishCount: {
    fontSize: '12px',
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  btnDelete: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  sectionContent: {
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  dishesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '16px',
  },
  dishItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  categoryBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  dishDescription: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    marginTop: '4px',
  },
  btnDeleteDish: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  addDishForm: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px',
  },
  buttonAddDish: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#10b981',
    border: '1px solid #d1fae5',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  packagesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  packageOption: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  packageName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  packageMeta: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
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