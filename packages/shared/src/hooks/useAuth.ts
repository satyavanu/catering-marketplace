'use client';

import { getAuthToken, setAuthToken, clearAuthToken } from '../utils/auth';

export function useAuth() {
  const token = getAuthToken();
  
  return {
    isAuthenticated: !!token,
    user: token,
    logout: () => clearAuthToken(),
    login: (credentials: any) => setAuthToken(credentials),
  };
}