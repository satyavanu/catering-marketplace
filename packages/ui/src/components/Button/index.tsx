import React from 'react';
import { useTheme } from '@catering/themes';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: 'white',
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: '#1f2937',
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
          color: 'white',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.35rem 0.75rem', fontSize: '0.75rem' };
      case 'md':
        return { padding: '0.75rem 1rem', fontSize: '0.875rem' };
      case 'lg':
        return { padding: '0.875rem 1.5rem', fontSize: '1rem' };
      default:
        return {};
    }
  };

  return (
    <button
      style={{
        border: 'none',
        borderRadius: '0.5rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ...getVariantStyles(),
        ...getSizeStyles(),
      }}
      {...props}
    >
      {children}
    </button>
  );
};