'use client';

import React, { useState } from 'react';
import { MenuItem } from '@catering/types';
import { Card, Button } from '@catering/ui';

export default function MenuPage() {
  const [menuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Italian Pasta Pack', category: 'Main Course', price: '$45', servings: '10 people', status: 'Available', description: 'Assorted pastas with marinara sauce' },
    { id: 2, name: 'Grilled Chicken Platter', category: 'Main Course', price: '$55', servings: '10 people', status: 'Available', description: 'Herb-grilled chicken with vegetables' },
    { id: 3, name: 'Mediterranean Salad', category: 'Appetizer', price: '$25', servings: '8 people', status: 'Available', description: 'Fresh greens with feta and olives' },
    { id: 4, name: 'Seafood Platter', category: 'Main Course', price: '$75', servings: '12 people', status: 'Out of Stock', description: 'Mixed fresh seafood with lemon' },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Menu Management
        </h1>
        <Button variant="primary">
          + Add Menu Item
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {menuItems.map((item) => (
          <Card key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                  {item.name}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                  {item.category}
                </p>
              </div>
              <span
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: item.status === 'Available' ? '#d1fae5' : '#fee2e2',
                  color: item.status === 'Available' ? '#065f46' : '#991b1b',
                }}
              >
                {item.status}
              </span>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              {item.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              <div>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>Price:</span> {item.price}
              </div>
              <div>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>Servings:</span> {item.servings}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}