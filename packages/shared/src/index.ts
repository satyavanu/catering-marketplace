export * from './utils';
export * from './hooks';
export * from './constants';

// Re-export auth utilities
export { setAuthToken, getAuthToken, clearAuthToken, isAuthenticated } from './utils/auth';

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
}

// Auth hook - Client only
export function useAuth() {
  const { getAuthToken, clearAuthToken, setAuthToken } = require('./utils/auth');
  const token = getAuthToken();
  
  return {
    isAuthenticated: !!token,
    user: token,
    logout: () => clearAuthToken(),
    login: (credentials: any) => setAuthToken(credentials),
  };
}

// API utilities
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const baseUrl = typeof window !== 'undefined' 
    ? (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:3000'
    : (typeof process !== 'undefined' && process.env.API_URL) || 'http://localhost:3000';

  const url = `${baseUrl}${endpoint}`;
  const { getAuthToken } = require('./utils/auth');
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token.email}` }),
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Format utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Storage utilities
export const storage = {
  setItem: (key: string, value: any) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to set storage item:', e);
      }
    }
  },
  getItem: (key: string) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Failed to get storage item:', e);
        return null;
      }
    }
    return null;
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove storage item:', e);
      }
    }
  },
  clear: () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    }
  },
};

// String utilities
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// Object utilities
export function isEmpty(obj: any): boolean {
  return obj === null || obj === undefined || Object.keys(obj).length === 0;
}

export function omit(obj: Record<string, any>, keys: string[]): Record<string, any> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function pick(obj: Record<string, any>, keys: string[]): Record<string, any> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Record<string, any>);
}