import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
      }}
      {...props}
    >
      {title && (
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', margin: 0 }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};