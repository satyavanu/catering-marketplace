'use client';

import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: string;
  bgColor: string;
  borderColor: string;
}

export default function DashboardCard({
  title,
  value,
  subtext,
  icon,
  bgColor,
  borderColor,
}: DashboardCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', margin: 0 }}>
          {title}
        </h3>
        <div
          style={{
            fontSize: '1.75rem',
            backgroundColor: bgColor,
            borderRadius: '0.5rem',
            padding: '0.5rem',
            lineHeight: '1',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: '1rem 0' }}>
        {value}
      </p>

      {/* Subtext */}
      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
        {subtext}
      </p>
    </div>
  );
}