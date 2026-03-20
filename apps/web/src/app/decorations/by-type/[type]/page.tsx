'use client';

import React, { useState } from 'react';
import { useDecorationsByType } from '@catering-marketplace/query-client';
import { useParams } from 'next/navigation';
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DecorationsByTypePage() {
  const params = useParams();
  const type = decodeURIComponent(params.type as string);
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });
  const { data: decorations = [], isLoading, error } = useDecorationsByType(type, pagination);
  const [favorites, setFavorites] = useState<string[]>([]);

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading {type} decorations...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center' }}>Error loading decorations</div>;

  const toggleFavorite = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]));
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 32px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '42px', fontWeight: '800', margin: 0 }}>
          {type} Decorations
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: '12px 0 0 0' }}>
          Explore our beautiful {type.toLowerCase()} collection
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {decorations.map((decor) => (
            <Link key={decor.id} href={`/decorations/${decor.id}`}>
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: '#e2e8f0',
                  }}
                >
                  <img
                    src={decor.image}
                    alt={decor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(decor.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'white',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <HeartIcon
                      style={{
                        width: '18px',
                        height: '18px',
                        color: favorites.includes(decor.id) ? '#ef4444' : '#94a3b8',
                        fill: favorites.includes(decor.id) ? '#ef4444' : 'none',
                      }}
                    />
                  </button>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0' }}>
                    {decor.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>
                    {decor.company}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarIcon style={{ width: '16px', height: '16px', color: '#f59e0b', fill: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {decor.rating}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#667eea' }}>
                      {decor.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}