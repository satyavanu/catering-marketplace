'use client';

import React from 'react';
import { FireIcon, MapIcon } from '@heroicons/react/24/outline';

interface ServiceGridProps<T> {
  items: T[];
  viewMode: 'grid' | 'map';
  cardComponent: React.ComponentType<{ item: T }>;
  title: string;
  description: string;
  gridColumns?: string;
  mapPlaceholder?: string;
}

const ServiceGrid = React.forwardRef<HTMLDivElement, ServiceGridProps<any>>(
  ({
    items,
    viewMode,
    cardComponent: CardComponent,
    title,
    description,
    gridColumns = 'repeat(auto-fill, minmax(300px, 1fr))',
    mapPlaceholder = 'Interactive map will be available soon',
  }, ref) => {
    return (
      <div ref={ref} style={{ marginBottom: '80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1e293b',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <FireIcon style={{ width: '32px', height: '32px', color: '#f59e0b' }} />
            {title}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500',
            }}
          >
            {description}
          </p>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: gridColumns,
              gap: '28px',
            }}
          >
            {items.map((item, index) => (
              <CardComponent key={item.id || index} item={item} />
            ))}
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              height: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <MapIcon style={{ width: '48px', height: '48px', color: '#f59e0b' }} />
              <div style={{ textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 6px 0',
                  }}
                >
                  Map View Coming Soon
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0,
                  }}
                >
                  {mapPlaceholder}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && viewMode === 'grid' && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '60px 40px',
              textAlign: 'center',
              border: '2px dashed #e2e8f0',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: '#94a3b8',
                fontWeight: '600',
              }}
            >
              No services found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ServiceGrid.displayName = 'ServiceGrid';

export default ServiceGrid;