'use client';

import React from 'react';
import Link from 'next/link';

interface Cater {
  id: number;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerPerson: number;
  specialties: string[];
  availability: string;
}

const mockCaters: Cater[] = [
  {
    id: 1,
    name: 'Elegant Events Catering',
    cuisine: 'French & International',
    image: '👨‍🍳',
    rating: 4.8,
    reviews: 128,
    pricePerPerson: 45,
    specialties: ['Weddings', 'Corporate Events'],
    availability: 'Year-round',
  },
  {
    id: 2,
    name: 'Spice Route Kitchen',
    cuisine: 'Indian & Asian Fusion',
    image: '🍜',
    rating: 4.6,
    reviews: 95,
    pricePerPerson: 35,
    specialties: ['Weddings', 'Parties'],
    availability: 'Weekdays & Weekends',
  },
  {
    id: 3,
    name: 'Mediterranean Bites',
    cuisine: 'Mediterranean & Greek',
    image: '🥗',
    rating: 4.7,
    reviews: 110,
    pricePerPerson: 40,
    specialties: ['Corporate', 'Private Events'],
    availability: 'Year-round',
  },
  {
    id: 4,
    name: 'Grill Master BBQ',
    cuisine: 'American BBQ',
    image: '🔥',
    rating: 4.5,
    reviews: 87,
    pricePerPerson: 30,
    specialties: ['Parties', 'Outdoor Events'],
    availability: 'Seasonal',
  },
];

const LatestCaters = () => {
  return (
    <section id="latest-caters" style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: 'white' }}>
      <div className="max-w-7xl px-4">
        {/* Header with View All */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Latest Caterers
            </h2>
            <p style={{ color: '#6b7280' }}>
              Trending catering services loved by customers
            </p>
          </div>
          <Link href="/caterers" style={{ color: '#f97316', fontWeight: '600', textDecoration: 'none', fontSize: '0.875rem' }}>
            View All Caterers →
          </Link>
        </div>

        {/* Caters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {mockCaters.map((cater) => (
            <Link
              key={cater.id}
              href={`/caters/${cater.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  border: '1px solid #e5e7eb',
                  height: '100%',
                  cursor: 'pointer',
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
                  {cater.image}
                </div>

                {/* Content Section */}
                <div style={{ padding: '1.5rem' }}>
                  {/* Name and Cuisine */}
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                    {cater.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    {cater.cuisine}
                  </p>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                      ★★★★★ {cater.rating}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      ({cater.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      From <span style={{ fontSize: '1.25rem', color: '#f97316' }}>${cater.pricePerPerson}</span> per person
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {cater.availability}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cater.specialties.map((spec, idx) => (
                        <span key={idx} style={{ fontSize: '0.7rem', color: '#6b7280', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/caters/${cater.id}`;
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#f97316',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCaters;