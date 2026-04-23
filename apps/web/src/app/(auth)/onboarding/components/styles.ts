const successModalStyles: { [key: string]: React.CSSProperties } = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    } as React.CSSProperties,
  
    modal: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      width: '95%',
      maxWidth: '600px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
      animation: 'slideUp 0.3s ease',
    } as React.CSSProperties,
  
    content: {
      padding: '3rem 2rem',
    } as React.CSSProperties,
  
    successIcon: {
      fontSize: '4rem',
      textAlign: 'center',
      marginBottom: '1rem',
    } as React.CSSProperties,
  
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#111827',
      textAlign: 'center',
      margin: '0 0 0.75rem 0',
    } as React.CSSProperties,
  
    message: {
      fontSize: '0.95rem',
      color: '#6b7280',
      textAlign: 'center',
      margin: '0 0 2rem 0',
      lineHeight: '1.6',
    } as React.CSSProperties,
  
    detailsBox: {
      backgroundColor: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem',
      border: '1px solid #e5e7eb',
    } as React.CSSProperties,
  
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e5e7eb',
    } as React.CSSProperties,
  
    label: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#6b7280',
    } as React.CSSProperties,
  
    value: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#1f2937',
      fontFamily: 'monospace',
    } as React.CSSProperties,
  
    downloadOptions: {
      marginBottom: '1.5rem',
    } as React.CSSProperties,
  
    optionsTitle: {
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 1rem 0',
    } as React.CSSProperties,
  
    downloadBtn: {
      width: '100%',
      padding: '0.875rem 1.5rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '0.75rem',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  
    auditTrail: {
      backgroundColor: '#ecfdf5',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #6ee7b7',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
  
    auditTitle: {
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#065f46',
      margin: '0 0 0.75rem 0',
    } as React.CSSProperties,
  
    auditList: {
      fontSize: '0.8rem',
      color: '#047857',
      margin: 0,
      paddingLeft: '1.25rem',
      lineHeight: '1.8',
    } as React.CSSProperties,
  
    continueBtn: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#e5e7eb',
      color: '#374151',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  };


  // Styles for the agreement component
  const agreementStyles: { [key: string]: React.CSSProperties } = {
    infoBox: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '1rem',
      backgroundColor: '#eff6ff',
      borderLeft: '4px solid #0284c7',
      borderRadius: '0.5rem',
      marginBottom: '2rem',
    } as React.CSSProperties,
  
    infoText: {
      margin: 0,
      fontSize: '0.9rem',
      color: '#0c4a6e',
      fontWeight: '500',
      lineHeight: '1.6',
    } as React.CSSProperties,
  
    agreementContainer: {
      border: '2px solid #e5e7eb',
      borderRadius: '1rem',
      backgroundColor: '#f9fafb',
      marginBottom: '2rem',
      overflow: 'hidden',
    } as React.CSSProperties,
  
    agreementHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'white',
    } as React.CSSProperties,
  
    agreementTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
    } as React.CSSProperties,
  
    viewFullButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#eff6ff',
      border: '1px solid #0284c7',
      color: '#0284c7',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  
    agreementContent: {
      maxHeight: '500px',
      overflowY: 'auto',
      padding: '1.5rem',
      backgroundColor: 'white',
    } as React.CSSProperties,
  
    downloadSection: {
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#fafafa',
    } as React.CSSProperties,
  
    downloadButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#eff6ff',
      border: '2px solid #0284c7',
      color: '#0284c7',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  
    checkboxContainer: {
      marginBottom: '1.5rem',
      padding: '1.25rem',
      backgroundColor: '#f9fafb',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
    } as React.CSSProperties,
  
    checkboxLabel: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.875rem',
      cursor: 'pointer',
      marginBottom: '0.75rem',
    } as React.CSSProperties,
  
    customCheckboxContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: '0.25rem',
    } as React.CSSProperties,
  
    hiddenCheckbox: {
      width: 0,
      height: 0,
      opacity: 0,
      cursor: 'pointer',
    } as React.CSSProperties,
  
    customCheckbox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      borderRadius: '0.375rem',
      border: '2px solid',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      flexShrink: 0,
    } as React.CSSProperties,
  
    checkmark: {
      color: 'white',
      fontSize: '0.8rem',
      fontWeight: 'bold',
    } as React.CSSProperties,
  
    checkboxText: {
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#1f2937',
      lineHeight: '1.6',
    } as React.CSSProperties,
  
    asterisk: {
      color: '#dc2626',
      fontWeight: '700',
    } as React.CSSProperties,
  
    legalDisclaimer: {
      fontSize: '0.8rem',
      color: '#6b7280',
      margin: '0.75rem 0 0 2.375rem',
      fontStyle: 'italic',
      lineHeight: '1.5',
    } as React.CSSProperties,
  
    signatureSection: {
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
    } as React.CSSProperties,
  
    label: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem',
    } as React.CSSProperties,
  
    helpText: {
      fontSize: '0.875rem',
      color: '#6b7280',
      margin: '0 0 1rem 0',
    } as React.CSSProperties,
  
    signaturePadContainer: {
      marginBottom: '1rem',
    } as React.CSSProperties,
  
    signatureCanvas: {
      display: 'block',
      width: '100%',
      height: 'auto',
      border: '2px dashed #cbd5e1',
      borderRadius: '0.5rem',
      cursor: 'crosshair',
      backgroundColor: 'white',
    } as React.CSSProperties,
  
    signaturePreviewBox: {
      padding: '1rem',
      backgroundColor: '#ecfdf5',
      border: '2px solid #86efac',
      borderRadius: '0.5rem',
    } as React.CSSProperties,
  
    signaturePreview: {
      marginBottom: '0.75rem',
      padding: '0.75rem',
      backgroundColor: 'white',
      borderRadius: '0.375rem',
      display: 'flex',
      justifyContent: 'center',
    } as React.CSSProperties,
  
    clearButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#fecaca',
      border: 'none',
      color: '#7f1d1d',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  
    signatureError: {
      fontSize: '0.85rem',
      color: '#dc2626',
      margin: '0.75rem 0 0 0',
      fontWeight: '500',
    } as React.CSSProperties,
  
    errorMessage: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      color: '#991b1b',
      marginBottom: '1rem',
    } as React.CSSProperties,
  
    warningBox: {
      padding: '0.875rem 1rem',
      backgroundColor: '#fef3c7',
      border: '1px solid #fcd34d',
      borderRadius: '0.5rem',
      color: '#92400e',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.75rem',
    } as React.CSSProperties,
  
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
      flexWrap: 'wrap',
    } as React.CSSProperties,
  
    submitButton: {
      flex: 1,
      minWidth: '200px',
      padding: '1rem 2rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    } as React.CSSProperties,
  
    backButton: {
      flex: 1,
      minWidth: '120px',
      padding: '1rem 2rem',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  
    disclaimerFooter: {
      fontSize: '0.8rem',
      color: '#6b7280',
      textAlign: 'center',
      marginTop: '1.5rem',
      lineHeight: '1.6',
      fontWeight: '500',
    } as React.CSSProperties,
  };
  
  // Modal Styles
  const agreementModalStyles: { [key: string]: React.CSSProperties & { [key: string]: any } } = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    } as React.CSSProperties,
  
    modal: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      width: '95%',
      maxWidth: '900px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    } as React.CSSProperties,
  
    modalHeader: {
      padding: '1.5rem',
      borderBottom: '2px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      flexShrink: 0,
    } as React.CSSProperties,
  
    modalTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
    } as React.CSSProperties,
  
    closeButton: {
      padding: '0.5rem 0.75rem',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#6b7280',
      cursor: 'pointer',
      fontSize: '1.5rem',
      lineHeight: '1',
      transition: 'color 0.2s ease',
    } as React.CSSProperties,
  
    modalContent: {
      flex: 1,
      overflowY: 'auto',
      padding: '2rem',
    } as React.CSSProperties,
  
    modalFooter: {
      padding: '1.5rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: '#f9fafb',
      flexShrink: 0,
    } as React.CSSProperties,
  
    closeButtonFooter: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  };
  
  // CSS for HTML content styling
  const agreementModalStyles_CSS = `
    .agreement-document {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1f2937;
      line-height: 1.8;
    }
  
    .agreement-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
  
    .agreement-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }
  
    .agreement-subtitle {
      font-size: 0.95rem;
      color: #6b7280;
      margin: 0;
    }
  
    .agreement-date {
      font-size: 0.85rem;
      color: #9ca3af;
      margin: 0.75rem 0 0 0;
    }
  
    .agreement-parties {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
  
    .agreement-parties h2 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
    }
  
    .agreement-parties p {
      margin: 0.75rem 0;
      color: #374151;
    }
  
    .agreement-section {
      margin-bottom: 0.5rem;
    }
  
    .agreement-section h2 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #111827;
      margin: 1.5rem 0 0.75rem 0;
      border-left: 4px solid #667eea;
      padding-left: 1rem;
    }
  
    .agreement-section h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #374151;
      margin: 1rem 0 0.5rem 0;
    }
  
    .agreement-section p {
      margin: 0.75rem 0;
      color: #374151;
    }
  
    .agreement-section ul, .agreement-section ol {
      margin: 0.75rem 0;
      padding-left: 1.75rem;
    }
  
    .agreement-section li {
      margin-bottom: 0.5rem;
      color: #374151;
    }
  
    .definitions-box {
      background: #f9fafb;
      padding: 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }
  
    .definition {
      margin-bottom: 0.75rem;
      color: #374151;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }
  
    .definition:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  
    .cancellation-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      border: 1px solid #e5e7eb;
    }
  
    .cancellation-table th {
      background: #f3f4f6;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #111827;
      border-bottom: 2px solid #e5e7eb;
      font-size: 0.875rem;
    }
  
    .cancellation-table td {
      padding: 0.75rem;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
    }
  
    .cancellation-table tr:hover {
      background: #f9fafb;
    }
  
    .agreement-acceptance {
      background: #ecfdf5;
      padding: 1.5rem;
      border: 2px solid #6ee7b7;
      border-radius: 0.75rem;
      margin: 2rem 0;
    }
  
    .legal-notice {
      background: #fef3c7;
      padding: 1rem;
      border-left: 4px solid #f59e0b;
      border-radius: 0.375rem;
      margin: 1rem 0 0 0;
      color: #92400e;
      font-size: 0.85rem;
    }
  
    .agreement-footer {
      text-align: center;
      padding: 1.5rem 0;
      margin-top: 2rem;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.85rem;
    }
  
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
    }
  
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
  
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;


  export { successModalStyles, agreementStyles, agreementModalStyles, agreementModalStyles_CSS };