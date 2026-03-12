'use client';

import React from 'react';

interface Menu {
  id: number;
  name: string;
  caterer: string;
  description: string;
  image: string;
  price: number;
  priceLabel: string;
  minGuests: number;
  cuisines: string[];
  dietary: string[];
}

const mockMenus: Menu[] = [
  {
    id: 1,
    name: 'Gourmet Wedding Feast',
    caterer: 'Elegant Bites Catering',
    description: 'Sophisticated multi-course dinner',
    image: '🍗',
    price: 45,
    priceLabel: '$45',
    minGuests: 50,
    cuisines: ['Italian Cuisine'],
    dietary: ['Halal'],
  },
  {
    id: 2,
    name: 'Corporate Lunch Buffet',
    caterer: 'BizCater Services',
    description: 'Professional business catering',
    image: '🍱',
    price: 30,
    priceLabel: '$30',
    minGuests: 20,
    cuisines: ['Continental'],
    dietary: ['Vegetarian'],
  },
  {
    id: 3,
    name: 'BBQ Party Platter',
    caterer: 'Smoky Delights',
    description: 'Delicious grilled specialties',
    image: '🍖',
    price: 25,
    priceLabel: '$25',
    minGuests: 30,
    cuisines: ['American BBQ'],
    dietary: ['Kosher'],
  },
  {
    id: 4,
    name: 'Luxury Canapé Selection',
    caterer: "Chef's Finest",
    description: 'Premium appetizers and bites',
    image: '🥂',
    price: 55,
    priceLabel: '$55',
    minGuests: 20,
    cuisines: ['French'],
    dietary: ['Gluten-free'],
  },
];

const LatestMenus = () => {
  return (
    <section id="menus" style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' }}>
      <div className="max-w-7xl px-4">
        {/* Header with View All */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Latest Menus
            </h2>
            <p style={{ color: '#6b7280' }}>
              Delicious new offerings for your events
            </p>
          </div>
          <a href="#" style={{ color: '#f97316', fontWeight: '600', textDecoration: 'none', fontSize: '0.875rem' }}>
            View All Menus →
          </a>
        </div>

        {/* Menu Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {mockMenus.map((menu) => (
            <div
              key={menu.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                border: '1px solid #e5e7eb',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image Section */}
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                {menu.image}
              </div>

              {/* Content Section */}
              <div style={{ padding: '1.5rem' }}>
                {/* Title and Caterer */}
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                  {menu.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                  {menu.caterer}
                </p>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', minHeight: '2.5rem' }}>
                  {menu.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    From <span style={{ fontSize: '1.25rem', color: '#f97316' }}>{menu.priceLabel}</span> per person
                  </p>
                </div>

                {/* Meta Info */}
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Min. {menu.minGuests} Guests
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {menu.cuisines.map((cuisine, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', color: '#6b7280', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}>
                        {cuisine}
                      </span>
                    ))}
                    {menu.dietary.map((diet, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', color: '#6b7280', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}>
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#f5f5f5',
                    color: '#111827',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#f97316';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestMenus;