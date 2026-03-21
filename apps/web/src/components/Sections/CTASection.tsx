'use client';

import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttons: CTAButton[];
  backgroundGradient?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttons,
  backgroundGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  backgroundColor,
  accentColor = '#f59e0b',
  textColor = 'white',
}) => {
  const bgStyle = backgroundGradient ? { background: backgroundGradient } : { backgroundColor };

  return (
    <div
      style={{
        ...bgStyle,
        color: textColor,
        padding: '80px 32px',
        textAlign: 'center',
        borderRadius: '24px',
        marginBottom: '80px',
      }}
    >
      {/* Content */}
      <h2
        style={{
          fontSize: '42px',
          fontWeight: '800',
          margin: '0 0 20px 0',
          letterSpacing: '-1px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: '18px',
          opacity: 0.95,
          margin: '0 0 40px 0',
          fontWeight: '500',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6',
        }}
      >
        {description}
      </p>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            style={{
              padding: button.variant === 'secondary' ? '12px 28px' : '14px 32px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.5px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor:
                button.variant === 'secondary'
                  ? `${textColor}15`
                  : textColor,
              color:
                button.variant === 'secondary'
                  ? textColor
                  : '#1e293b',
              borderWidth: button.variant === 'secondary' ? '1.5px' : '0px',
              borderColor: button.variant === 'secondary' ? textColor : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (button.variant === 'secondary') {
                e.currentTarget.style.backgroundColor = `${textColor}25`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              } else {
                e.currentTarget.style.backgroundColor = '#fef3c7';
                e.currentTarget.style.color = '#d97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (button.variant === 'secondary') {
                e.currentTarget.style.backgroundColor = `${textColor}15`;
                e.currentTarget.style.transform = 'translateY(0)';
              } else {
                e.currentTarget.style.backgroundColor = textColor;
                e.currentTarget.style.color = '#1e293b';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {button.label}
            {button.icon ? (
              button.icon
            ) : button.variant !== 'secondary' ? (
              <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CTASection;