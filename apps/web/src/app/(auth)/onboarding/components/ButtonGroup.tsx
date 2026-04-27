// components/ButtonGroup.tsx

import React from 'react';

interface ButtonGroupProps {
  onBack: (() => void) | null; 
  onBackLabel?: string;
  onNextLabel?: string;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  styles: { [key: string]: React.CSSProperties };
}

export default function ButtonGroup({
  onBack,
  onBackLabel = '← Back',
  onNextLabel = 'Continue to Next Step',
  isNextDisabled = false,
  isNextLoading = false,
  styles,
}: ButtonGroupProps) {
  const mergedStyles: any = {
    ...styles.profileStyles,
    ...profileStyles,
  };

  return (
    <div style={mergedStyles.buttonGroup}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={isNextLoading} // Disable back button while next step is processing
          style={{
            ...mergedStyles.backButton,
            ...(isNextLoading && mergedStyles.buttonDisabled),
          }}
        >
          {onBackLabel}
        </button>
      )}

      <button
        type="submit" // This button will trigger form submission by default
        disabled={isNextDisabled || isNextLoading}
        style={{
          ...mergedStyles.submitButton, // Assuming base submit button style is here
          ...((isNextDisabled || isNextLoading) && mergedStyles.buttonDisabled),
          position: 'relative', // For spinner positioning
        }}
      >
        {isNextLoading ? (
          <>
            <span style={mergedStyles.spinner}></span>
            Saving...
          </>
        ) : (
          onNextLabel
        )}
      </button>
    </div>
  );
}

// Local styles specific to ButtonGroup, merged with global ones
const profileStyles: { [key: string]: React.CSSProperties } = {
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2.5rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.5rem',
    gap: '1rem',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
    marginRight: '0.5rem',
    verticalAlign: 'middle',
  },
};
