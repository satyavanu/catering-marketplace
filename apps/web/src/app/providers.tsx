'use client';

import { QueryProvider } from '@catering-marketplace/query-client';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}