'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useOnboardingMasterData,
  type OnboardingMasterData,
} from '@catering-marketplace/query-client';

interface OnboardingMasterDataContextType {
  data: OnboardingMasterData | undefined;
  isLoading: boolean;
  error: Error | null;
}

const OnboardingMasterDataContext = createContext<
  OnboardingMasterDataContextType | undefined
>(undefined);

export function OnboardingMasterDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data, isLoading, error } = useOnboardingMasterData();

  const value: OnboardingMasterDataContextType = {
    data,
    isLoading,
    error: error || null,
  };

  return (
    <OnboardingMasterDataContext.Provider value={value}>
      {children}
    </OnboardingMasterDataContext.Provider>
  );
}

/**
 * Hook to use onboarding master data context
 * @returns Context value with master data, loading state, and error
 */
export function useOnboardingMasterDataContext() {
  const context = useContext(OnboardingMasterDataContext);

  if (context === undefined) {
    throw new Error(
      'useOnboardingMasterDataContext must be used within OnboardingMasterDataProvider'
    );
  }

  return context;
}