'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CompletionData {
  capabilities: number;
  serviceAreas: number;
  menuItems: number;
  packages: number;
  hasKYC: boolean;
}

interface OnboardingStatusProps {
  completionData: CompletionData;
  isLoading: boolean;
  error: string;
  onComplete: () => Promise<void>;
  styles: { [key: string]: React.CSSProperties };
}

export default function OnboardingStatus({
  completionData,
  isLoading,
  error,
  onComplete,
  styles,
}: OnboardingStatusProps) {
  const getChecklistItems = () => [
    {
      id: 'profile',
      title: 'Profile Created',
      description: 'Your caterer profile is live',
      isDone: true,
      icon: '✓',
    },
    {
      id: 'capabilities',
      title: 'Capabilities Added',
      description: `${completionData.capabilities} service(s) listed`,
      isDone: completionData.capabilities > 0,
      icon: completionData.capabilities > 0 ? '✓' : '⏳',
    },
    {
      id: 'serviceAreas',
      title: 'Service Areas Added',
      description: `${completionData.serviceAreas} area(s) covered`,
      isDone: completionData.serviceAreas > 0,
      icon: completionData.serviceAreas > 0 ? '✓' : '⏳',
    },
    {
      id: 'menuItems',
      title: 'Menu Items Added',
      description: `${completionData.menuItems} items added`,
      isDone: completionData.menuItems > 0,
      icon: completionData.menuItems > 0 ? '✓' : '⏳',
    },
    {
      id: 'kyc',
      title: 'Complete KYC',
      description: 'Add PAN/UPI to receive payments',
      isDone: completionData.hasKYC,
      icon: completionData.hasKYC ? '✓' : '⏳',
    },
    {
      id: 'packages',
      title: 'Create Packages',
      description: `${completionData.packages} package(s) created`,
      isDone: completionData.packages > 0,
      icon: completionData.packages > 0 ? '✓' : '⏳',
    },
  ];

  const checklistItems = getChecklistItems();
  const completedCount = checklistItems.filter((item) => item.isDone).length;
  const completionPercentage = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <>
      <div style={styles.completeContainer}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.title}>You're All Set!</h1>
        <p style={styles.subtitle}>
          Your profile is live. Complete the checklist to maximize visibility
        </p>

        <div
          style={{
            ...styles.progressContainer,
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <div
            style={{
              ...styles.progressBar,
              width: `${completionPercentage}%`,
            }}
          />
        </div>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0,
            marginBottom: '1.5rem',
          }}
        >
          {completedCount} of {checklistItems.length} completed ({completionPercentage}%)
        </p>

        <div style={styles.completionChecklist}>
          {checklistItems.map((item) => (
            <div key={item.id} style={styles.checklistItem}>
              <div
                style={
                  item.isDone
                    ? styles.checklistDone
                    : styles.checklistPending
                }
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.checklistTitle}>{item.title}</h4>
                <p style={styles.checklistText}>{item.description}</p>
              </div>
              {item.isDone && (
                <div
                  style={{
                    fontSize: '1.25rem',
                    color: '#10b981',
                    marginLeft: '0.5rem',
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          onClick={onComplete}
          disabled={isLoading}
          style={{
            ...styles.ctaButton,
            marginTop: '2rem',
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#ea580c';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 16px rgba(249, 115, 22, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f97316';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isLoading ? 'Starting...' : 'Go to Dashboard'}
          <ArrowRight size={20} />
        </button>

        <p
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginTop: '1rem',
            margin: '1rem 0 0 0',
          }}
        >
          You can update your profile anytime from the dashboard
        </p>
      </div>
    </>
  );
}