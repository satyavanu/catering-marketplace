'use client';

import React, { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
  prepTime: number;
}

const mockMenuItems: MenuItem[] = [
  {
    id: 'M-001',
    name: 'Grilled Salmon',
    category: 'Main Course',
    description: 'Fresh salmon with lemon butter sauce',
    price: 24.99,
    available: true,
    image: '🍣',
    prepTime: 20,
  },
  {
    id: 'M-002',
    name: 'Caesar Salad',
    category: 'Appetizer',
    description: 'Classic caesar salad with croutons',
    price: 12.99,
    available: true,
    image: '🥗',
    prepTime: 5,
  },
  {
    id: 'M-003',
    name: 'Chocolate Cake',
    category: 'Dessert',
    description: 'Rich chocolate cake with frosting',
    price: 8.99,
    available: false,
    image: '🍰',
    prepTime: 0,
  },
  {
    id: 'M-004',
    name: 'Beef Wellington',
    category: 'Main Course',
    description: 'Tender beef wrapped in pastry',
    price: 32.99,
    available: true,
    image: '🥩',
    prepTime: 30,
  },
  {
    id: 'M-005',
    name: 'Vegetable Platter',
    category: 'Side Dish',
    description: 'Seasonal vegetables with herbs',
    price: 9.99,
    available: true,
    image: '🥦',
    prepTime: 10,
  },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = ['All', 'Main Course', 'Appetizer', 'Side Dish', 'Dessert', 'Beverage'];

  const filteredItems = selectedCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === selectedCategory);

  const toggleAvailability = (id: string) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Menu Management
        </h1>
        <p style={{ color: '#6b7280' }}>Manage your catering menu items and availability.</p>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: selectedCategory === category ? '#f97316' : 'white',
              color: selectedCategory === category ? 'white' : '#6b7280',
              border: selectedCategory === category ? 'none' : '1px solid #e5e7eb',
              borderRadius: '9999px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s',
              opacity: item.available ? 1 : 0.6,
            }}
          >
            {/* Item Image */}
            <div
              style={{
                width: '100%',
                height: '150px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              {item.image}
            </div>

            {/* Item Details */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>{item.category}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{item.description}</p>
              </div>

              {/* Price and Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Price</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316' }}>${item.price.toFixed(2)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Prep Time</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>{item.prepTime} min</p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleAvailability(item.id)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: item.available ? '#22c55e' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {item.available ? '✓ Available' : '✗ Unavailable'}
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', color: '#6b7280' }}>
          No menu items found in this category.
        </div>
      )}
    </div>
  );
}