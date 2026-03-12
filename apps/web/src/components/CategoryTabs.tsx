'use client';

import React, { useState } from 'react';

interface Category {
  id: number;
  name: string;
  description: string;
  count: number;
  icon: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Wedding Catering',
    description: 'Premium catering services for your special day. From intimate ceremonies to grand receptions.',
    count: 245,
    icon: '💍',
  },
  {
    id: 2,
    name: 'Corporate Catering',
    description: 'Professional catering for business events, conferences, and corporate meetings.',
    count: 189,
    icon: '🏢',
  },
  {
    id: 3,
    name: 'Birthday Catering',
    description: 'Fun and festive catering for birthday celebrations of all sizes.',
    count: 167,
    icon: '🎂',
  },
  {
    id: 4,
    name: 'Private Chef',
    description: 'Exclusive private chef services for intimate dinners and special occasions.',
    count: 124,
    icon: '👨‍🍳',
  },
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const activeCategory = categories[activeTab];

  return (
    <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: 'white' }}>
      <div className="max-w-7xl px-4">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Explore by Category
          </h2>
          <p style={{ color: '#6b7280' }}>
            Find the perfect catering service for your event type
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(index)}
              style={{
                padding: '0.75rem 1.5rem',
                border: activeTab === index ? 'none' : '1px solid #e5e7eb',
                backgroundColor: activeTab === index ? '#f97316' : 'white',
                color: activeTab === index ? 'white' : '#111827',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== index) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== index) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>{activeCategory.icon}</div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                {activeCategory.name}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                {activeCategory.description}
              </p>
              <p style={{ color: '#f97316', fontWeight: '600', fontSize: '0.875rem' }}>
                {activeCategory.count}+ Available Caterers
              </p>
            </div>
          </div>

          <button
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            Browse {activeCategory.name}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CategoryTabs;