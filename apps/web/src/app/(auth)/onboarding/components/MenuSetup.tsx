'use client';

import React, { useState } from 'react';
import { AlertCircle, Plus, Trash2, Upload } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  imageFile?: File;
}

interface MenuSetupProps {
  menuItems: MenuItem[];
  newMenuItem: Partial<MenuItem>;
  imagePreview: string | null;
  isLoading: boolean;
  error: string;
  onMenuItemNameChange: (value: string) => void;
  onMenuItemPriceChange: (value: number) => void;
  onMenuItemDescriptionChange: (value: string) => void;
  onImageChange: (file: File | null, preview: string | null) => void;
  onAddMenuItem: () => void;
  onRemoveMenuItem: (id: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
  styles: { [key: string]: React.CSSProperties };
}

export default function MenuSetup({
  menuItems,
  newMenuItem,
  imagePreview,
  isLoading,
  error,
  onMenuItemNameChange,
  onMenuItemPriceChange,
  onMenuItemDescriptionChange,
  onImageChange,
  onAddMenuItem,
  onRemoveMenuItem,
  onSubmit,
  onSkip,
  onBack,
  styles,
}: MenuSetupProps) {
  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🍽️ Menu Setup
        </h1>
        <p style={styles.subtitle}>
          Add your signature dishes {menuItems.length > 0 && `(${menuItems.length} items)`}
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
            Add at least 1 item to get started
          </p>
        </div>

        <div style={styles.menuForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dish Name *</label>
            <input
              type="text"
              value={newMenuItem.name || ''}
              onChange={(e) => onMenuItemNameChange(e.target.value)}
              placeholder="e.g., Biryani"
              style={styles.input}
              disabled={isLoading}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                type="number"
                value={newMenuItem.price || ''}
                onChange={(e) => onMenuItemPriceChange(parseFloat(e.target.value) || 0)}
                placeholder="e.g., 250"
                style={styles.input}
                disabled={isLoading}
                min="0"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description (Optional)</label>
            <textarea
              value={newMenuItem.description || ''}
              onChange={(e) => onMenuItemDescriptionChange(e.target.value)}
              placeholder="e.g., Aromatic basmati with tender mutton"
              style={{
                ...styles.input,
                minHeight: '80px',
                resize: 'vertical',
              }}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Dish Image (Optional)</label>
            <div style={styles.imageUploadWrapper}>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    onImageChange(null, null);
                    return;
                  }

                  // Validate file type
                  if (!['image/png', 'image/jpeg'].includes(file.type)) {
                    return;
                  }

                  // Validate file size (100KB = 102400 bytes)
                  if (file.size > 102400) {
                    return;
                  }

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onImageChange(file, reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
                style={styles.fileInput}
                disabled={isLoading}
                accept=".png,.jpg,.jpeg"
              />
              <Upload size={24} color="#6b7280" style={{ marginBottom: '0.5rem' }} />
              <p style={styles.helpText}>PNG or JPG (Max 100KB)</p>
            </div>
            {imagePreview && (
              <div style={styles.imagePreviewContainer}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.imagePreview}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onAddMenuItem}
            disabled={
              isLoading ||
              !newMenuItem.name?.trim() ||
              !newMenuItem.price
            }
            style={{
              ...styles.addButton,
              width: '100%',
              marginBottom: '1.5rem',
              opacity:
                isLoading || !newMenuItem.name?.trim() || !newMenuItem.price
                  ? 0.6
                  : 1,
            }}
            onMouseEnter={(e) => {
              if (
                !isLoading &&
                newMenuItem.name?.trim() &&
                newMenuItem.price
              ) {
                e.currentTarget.style.backgroundColor = '#059669';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <Plus size={18} /> Add Dish
          </button>
        </div>

        {menuItems.length > 0 && (
          <div style={styles.itemsList}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
              Menu Items ({menuItems.length})
            </h3>
            {menuItems.map((item) => (
              <div key={item.id} style={styles.listItem}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.listItemImage}
                  />
                )}
                <div style={styles.itemContent}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  {item.description && (
                    <p style={styles.itemDescription}>{item.description}</p>
                  )}
                </div>
                <div style={styles.itemPrice}>₹{item.price}</div>
                <button
                  type="button"
                  onClick={() => onRemoveMenuItem(item.id)}
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
            ))}
          </div>
        )}

        {error && <div style={styles.errorMessage}>{error}</div>}

        {menuItems.length > 0 ? (
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
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              style={styles.skipButton}
            >
              Skip for Now
            </button>
          </>
        )}

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