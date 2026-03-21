'use client';

import React from 'react';

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  title: string;
  description?: string;
  benefits: Benefit[];
  backgroundColor?: string;
  accentColor?: string;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  title,
  description,
  benefits,
  backgroundColor = '#f8fafc',
  accentColor = '#f59e0b',
}) => {
  return (
    <div
      style={{
        backgroundColor,
        padding: '80px 32px',
        borderRadius: '24px',
        marginBottom: '80px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#1e293b',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px',
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Benefits Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Icon Container */}
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: `${accentColor}20`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ color: accentColor, fontSize: '28px' }}>
                {benefit.icon}
              </div>
            </div>

            {/* Content */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 12px 0',
              }}
            >
              {benefit.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0,
                lineHeight: '1.6',
              }}
            >
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;