import type { AuthToken } from '@catering/types';

export function setAuthToken(token: AuthToken): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('authToken', JSON.stringify(token));
    } catch (e) {
      console.error('Failed to set auth token:', e);
    }
  }
}

export function getAuthToken(): AuthToken | null {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const token = localStorage.getItem('authToken');
      return token ? JSON.parse(token) : null;
    } catch (e) {
      console.error('Failed to get auth token:', e);
      return null;
    }
  }
  return null;
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem('authToken');
    } catch (e) {
      console.error('Failed to clear auth token:', e);
    }
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}