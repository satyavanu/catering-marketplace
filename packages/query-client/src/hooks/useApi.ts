'use client';

import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

export function useApi() {
  const { data: session } = useSession();

  const request = useCallback(
    async <T = any>(
      url: string,
      options: RequestInit = {}
    ): Promise<T> => {
      const headers = new Headers(options.headers || {});
      if (session?.user?.accessToken) {
        headers.set('Authorization', `Bearer ${session.user.accessToken}`);
      }

      headers.set('Content-Type', 'application/json');

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    },
    [session?.user?.accessToken]
  );

  return { request };
}