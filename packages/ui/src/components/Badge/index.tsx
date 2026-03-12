import React from 'react';

interface BadgeProps {
  label: string;
  color?: 'green' | 'yellow' | 'red' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'gray' }) => {
  const colorMap = {
    green: { bg: '#d1fae5', text: '#065f46' },
    yellow: { bg: '#fef3c7', text: '#92400e' },
    red: { bg: '#fee2e2', text: '#991b1b' },
    gray: { bg: '#f3f4f6', text: '#4b5563' },
  };

  const { bg, text } = colorMap[color];

  return (
    <span
      style={{
        padding: '0.35rem 0.75rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: bg,
        color: text,
      }}
    >
      {label}
    </span>
  );
};