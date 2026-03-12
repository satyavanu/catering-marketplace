import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#1f2937',
          boxSizing: 'border-box',
        }}
        {...props}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
          {error}
        </p>
      )}
    </div>
  );
};