'use client';

import React from 'react';
import { ListBulletIcon, MapIcon } from '@heroicons/react/24/outline';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        backgroundColor: '#f8fafc',
        padding: '6px',
        borderRadius: '10px',
      }}
    >
      <button
        onClick={() => onViewModeChange('grid')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
          color: viewMode === 'grid' ? '#f59e0b' : '#94a3b8',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none',
        }}
      >
        <ListBulletIcon style={{ width: '16px', height: '16px' }} />
        List
      </button>
      <button
        onClick={() => onViewModeChange('map')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: viewMode === 'map' ? 'white' : 'transparent',
          color: viewMode === 'map' ? '#f59e0b' : '#94a3b8',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          boxShadow: viewMode === 'map' ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none',
        }}
      >
        <MapIcon style={{ width: '16px', height: '16px' }} />
        Map
      </button>
    </div>
  );
};

export default ViewModeToggle;