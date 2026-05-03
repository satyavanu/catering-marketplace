'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@catering-marketplace/query-client';
import { OnboardingMasterDataProvider } from './context/OnboardingMasterDataContext';
import { ServiceCatalogMetaProvider } from './context/ServiceCatalogMetaContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <OnboardingMasterDataProvider>
          <ServiceCatalogMetaProvider>{children}</ServiceCatalogMetaProvider>
        </OnboardingMasterDataProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
