'use client';

import { QueryProvider } from '@catering-marketplace/query-client';
import React from 'react';
import { AuthProvider } from '@catering-marketplace/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </AuthProvider>
  );
}
