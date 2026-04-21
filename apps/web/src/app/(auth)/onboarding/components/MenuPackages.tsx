'use client';

import React from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface Package {
  id: string;
  name: string;
  type: 'fixed' | 'customizable';
  minGuests: number;
  maxGuests: number;
  minPrice: number;
  maxPrice: number;
  menuItemIds: string[];
}

interface MenuPackagesProps {
  packages: Package[];
  newPackage: Partial<Package>;
  selectedMenuItemsForPackage: string[];
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string;
  onPackageNameChange: (value: string) => void;
  onPackageTypeChange: (value: 'fixed' | 'customizable') => void;
  onMinGuestsChange: (value: number) => void;
  onMaxGuestsChange: (value: number) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onMenuItemToggle: (itemId: string) => void;
  onAddPackage: () => void;
  onRemovePackage: (id: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

export default function MenuPackages({
  packages,
  newPackage,
  selectedMenuItemsForPackage,
  menuItems,
  isLoading,
  error,
  onPackageNameChange,
  onPackageTypeChange,
  onMinGuestsChange,
  onMaxGuestsChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMenuItemToggle,
  onAddPackage,
  onRemovePackage,
  onSubmit,
  onSkip,
  onBack,
  styles,
}: MenuPackagesProps) {
  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>
          📦 Create Packages
        </h1>
        <p style={styles.subtitle}>
          Bundle your dishes into packages {packages.length > 0 && `(${packages.length} created)`}
        </p>
      </div>

      <form onSubmit={onSubmit} style={styles.profileForm}>
        <div style={styles.infoBox}>
          <AlertCircle
            size={20}
            color="#0284c7"
            style={{ marginRight: '0.75rem' }}
          />
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            Packages are optional - you can skip this for now
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div
            style={{
              ...styles.infoBox,
              backgroundColor: '#fef3c7',
              borderColor: '#fde68a',
            }}
          >
            <AlertCircle
              size={20}
              color="#b45309"
              style={{ marginRight: '0.75rem' }}
            />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f' }}>
              Add menu items first to create packages
            </p>
          </div>
        ) : (
          <div style={styles.menuForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Package Name *</label>
              <input
                type="text"
                value={newPackage.name || ''}
                onChange={(e) => onPackageNameChange(e.target.value)}
                placeholder="e.g., Wedding Package, Corporate Package"
                style={styles.input}
                disabled={isLoading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Package Type *</label>
              <div style={styles.radioGroup}>
                {[
                  { value: 'fixed', label: 'Fixed Package', desc: 'Predefined menu' },
                  {
                    value: 'customizable',
                    label: 'Customizable Package',
                    desc: 'Customer can choose items',
                  },
                ].map((type) => (
                  <label key={type.value} style={styles.radioLabel}>
                    <input
                      type="radio"
                      value={type.value}
                      checked={newPackage.type === type.value}
                      onChange={(e) =>
                        onPackageTypeChange(e.target.value as 'fixed' | 'customizable')
                      }
                      disabled={isLoading}
                      style={styles.radioInput}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{type.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {type.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Min Guests *</label>
                <input
                  type="number"
                  value={newPackage.minGuests || 10}
                  onChange={(e) => onMinGuestsChange(parseInt(e.target.value) || 10)}
                  style={styles.input}
                  disabled={isLoading}
                  min="1"
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Max Guests *</label>
                <input
                  type="number"
                  value={newPackage.maxGuests || 100}
                  onChange={(e) =>
                    onMaxGuestsChange(parseInt(e.target.value) || 100)
                  }
                  style={styles.input}
                  disabled={isLoading}
                  min="1"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Min Price (₹) *</label>
                <input
                  type="number"
                  value={newPackage.minPrice || ''}
                  onChange={(e) =>
                    onMinPriceChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="e.g., 500"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Max Price (₹) *</label>
                <input
                  type="number"
                  value={newPackage.maxPrice || ''}
                  onChange={(e) =>
                    onMaxPriceChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="e.g., 1000"
                  style={styles.input}
                  disabled={isLoading}
                  min="0"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Menu Items *</label>
              <p style={styles.helpText}>
                Choose {newPackage.type === 'fixed' ? '3+ items' : '1+ item'} to include
              </p>
              <div style={styles.menuItemsCheckList}>
                {menuItems.map((item) => (
                  <label key={item.id} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedMenuItemsForPackage.includes(item.id)}
                      onChange={() => onMenuItemToggle(item.id)}
                      style={styles.checkbox}
                      disabled={isLoading}
                    />
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <span style={{ marginLeft: 'auto', color: '#f97316', fontWeight: '600' }}>
                      ₹{item.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onAddPackage}
              disabled={
                isLoading ||
                !newPackage.name?.trim() ||
                !newPackage.minGuests ||
                !newPackage.maxGuests ||
                !newPackage.minPrice ||
                !newPackage.maxPrice ||
                selectedMenuItemsForPackage.length === 0
              }
              style={{
                ...styles.addButton,
                width: '100%',
                marginBottom: '1.5rem',
                opacity:
                  isLoading ||
                  !newPackage.name?.trim() ||
                  !newPackage.minGuests ||
                  !newPackage.maxGuests ||
                  !newPackage.minPrice ||
                  !newPackage.maxPrice ||
                  selectedMenuItemsForPackage.length === 0
                    ? 0.6
                    : 1,
              }}
              onMouseEnter={(e) => {
                if (
                  !isLoading &&
                  newPackage.name?.trim() &&
                  newPackage.minGuests &&
                  newPackage.maxGuests &&
                  newPackage.minPrice &&
                  newPackage.maxPrice &&
                  selectedMenuItemsForPackage.length > 0
                ) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              <Plus size={18} /> Add Package
            </button>
          </div>
        )}

        {packages.length > 0 && (
          <div style={styles.itemsList}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
              Created Packages ({packages.length})
            </h3>
            {packages.map((pkg) => {
              const packageMenuItems = menuItems.filter((item) =>
                pkg.menuItemIds.includes(item.id)
              );
              const totalPrice = packageMenuItems.reduce((sum, item) => sum + item.price, 0);

              return (
                <div key={pkg.id} style={styles.listItem}>
                  <div style={styles.itemContent}>
                    <h4 style={styles.itemName}>{pkg.name}</h4>
                    <p style={styles.itemCategory}>
                      {pkg.type === 'fixed' ? '📌 Fixed' : '⚙️ Customizable'} •{' '}
                      {pkg.minGuests}-{pkg.maxGuests} guests
                    </p>
                    <p style={styles.itemPrice}>
                      ₹{pkg.minPrice} - ₹{pkg.maxPrice}
                    </p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                      <div>
                        <p style={styles.helpText}>
                          {packageMenuItems.length} item(s) • Total: ₹{totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemovePackage(pkg.id)}
                    disabled={isLoading}
                    style={{
                      ...styles.deleteButton,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.submitButton,
            opacity: isLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#ea580c';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f97316';
          }}
        >
          {isLoading ? 'Saving...' : 'Complete Setup'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          style={styles.skipButton}
        >
          Skip for Now
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          style={styles.backButton}
        >
          Back
        </button>
      </form>
    </>
  );
}