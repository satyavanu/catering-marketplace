'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken } from '@catering/shared';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has token
    const token = getAuthToken();
    const isLoginPage = pathname === '/login';

    if (!token && !isLoginPage) {
      // No token and not on login page - redirect to login
      router.push('/login');
      setIsLoading(false);
      return;
    }

    if (token && isLoginPage) {
      // Has token and on login page - redirect to dashboard
      router.push('/');
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}