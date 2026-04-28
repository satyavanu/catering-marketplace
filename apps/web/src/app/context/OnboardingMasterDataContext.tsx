'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useOnboardingMasterData,
  useOnboardingLocations,
  type OnboardingMasterData,
  type OnboardingLocations,
} from '@catering-marketplace/query-client';

interface OnboardingMasterDataContextType {
  masterData: OnboardingMasterData | undefined;
  locations: OnboardingLocations | undefined;
  isLoadingMasterData: boolean;
  isLoadingLocations: boolean;
  isLoading: boolean;
  error: Error | null;
  masterDataError: Error | null;
  locationsError: Error | null;
}

const OnboardingMasterDataContext = createContext<
  OnboardingMasterDataContextType | undefined
>(undefined);

export function OnboardingMasterDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: masterData,
    isLoading: isLoadingMasterData,
    error: masterDataError,
  } = useOnboardingMasterData();

  const {
    data: locations,
    isLoading: isLoadingLocations,
    error: locationsError,
  } = useOnboardingLocations();

  console.log('Master Data:', masterData);
  console.log('Locations Data:', locations);

  const isLoading = isLoadingMasterData || isLoadingLocations;
  const error = (masterDataError || locationsError) as Error | null;

  const value: OnboardingMasterDataContextType = {
    masterData,
    locations,
    isLoadingMasterData,
    isLoadingLocations,
    isLoading,
    error,
    masterDataError: masterDataError || null,
    locationsError: locationsError || null,
  };

  return (
    <OnboardingMasterDataContext.Provider value={value}>
      {children}
    </OnboardingMasterDataContext.Provider>
  );
}

/**
 * Hook to use onboarding master data context
 * @returns Context value with master data, locations, loading states, and errors
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