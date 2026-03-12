'use client';

import React, { useState } from 'react';

export default function MenuPage() {
  const [menuItems] = useState([
    { id: 1, name: 'Italian Pasta Pack', category: 'Mains', price: '$45', servings: '10 people', status: 'Available' },
    { id: 2, name: 'Grilled Chicken Platter', category: 'Mains', price: '$55', servings: '10 people', status: 'Available' },
    { id: 3, name: 'Mediterranean Salad', category: 'Sides', price: '$25', servings: '8 people', status: 'Available' },
    { id: 4, name: 'Chocolate Dessert Box', category: 'Desserts', price: '$35', servings: '12 pieces', status: 'Out of Stock' },
    { id: 5, name: 'Fresh Fruit Platters', category: 'Sides', price: '$30', servings: '15 people', status: 'Available' },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Menu Management
        </h1>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
        >
          + Add Menu Item
        </button>
      </div>

      {/* Menu Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                    {item.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                    {item.category}
                  </span>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: item.status === 'Available' ? '#d1fae5' : '#fee2e2',
                    color: item.status === 'Available' ? '#065f46' : '#991b1b',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                  <strong>Price:</strong> {item.price}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                  <strong>Servings:</strong> {item.servings}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#e5e7eb',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#fee2e2',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#991b1b',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}