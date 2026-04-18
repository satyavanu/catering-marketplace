'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Cater {
  id: number;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerPerson: number;
  country: string;
}

const allCaters: Cater[] = [
  { id: 1, name: 'Elegant Events Catering', cuisine: 'French & International', image: '👨‍🍳', rating: 4.8, reviews: 128, pricePerPerson: 45, country: 'United States' },
  { id: 2, name: 'Spice Route Kitchen', cuisine: 'Indian & Asian Fusion', image: '🍜', rating: 4.6, reviews: 95, pricePerPerson: 35, country: 'United Kingdom' },
  { id: 3, name: 'Mediterranean Bites', cuisine: 'Mediterranean & Greek', image: '🥗', rating: 4.7, reviews: 110, pricePerPerson: 40, country: 'Australia' },
  { id: 4, name: 'Grill Master BBQ', cuisine: 'American BBQ', image: '🔥', rating: 4.5, reviews: 87, pricePerPerson: 30, country: 'United States' },
  { id: 5, name: 'Tokyo Street Kitchen', cuisine: 'Japanese', image: '🍱', rating: 4.9, reviews: 142, pricePerPerson: 50, country: 'Japan' },
];

export default function ByCuisinePage() {
  const params = useParams();
  const cuisine = decodeURIComponent(params.cuisine as string);
  const filteredCaters = allCaters.filter((c) => c.cuisine === cuisine);

  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#f97316', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <div className="max-w-7xl px-4">
          <Link href="/caterers" style={{ color: 'white', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
            ← Back to All Caterers
          </Link>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {cuisine} Caterers
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>
            {filteredCaters.length} caterers found
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem' }}>
        {filteredCaters.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredCaters.map((cater) => (
              <Link key={cater.id} href={`/caters/${cater.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    border: '1px solid #e5e7eb',
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
                  <div style={{ width: '100%', height: '180px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                    {cater.image}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                      {cater.name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      📍 {cater.country}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                        ★ {cater.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#f97316' }}>
                      From ${cater.pricePerPerson}/person
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              No {cuisine} caterers found.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}