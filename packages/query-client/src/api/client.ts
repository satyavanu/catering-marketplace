'use client';

import { getSession } from 'next-auth/react';

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Add authorization header if token exists
 */
async function addAuthHeader(
  headers: Headers,
  skipAuth: boolean = false
): Promise<void> {
  if (skipAuth) return;

  try {
    const session = await getSession();
    if (session?.user?.accessToken) {
      headers.set('Authorization', `Bearer ${session.user.accessToken}`);
    }
  } catch (error) {
    console.warn('Failed to get session for auth header:', error);
  }
}

/**
 * Main API client function
 */
export async function apiClient<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    skipAuth = false,
    timeout = DEFAULT_TIMEOUT,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  try {
    // Ensure URL is absolute
    const absoluteUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;

    // Setup headers
    const headers = new Headers(customHeaders);
    
    // Add auth header
    await addAuthHeader(headers, skipAuth);

    // Add content type if not already set
    if (!headers.has('Content-Type') && fetchOptions.body) {
      headers.set('Content-Type', 'application/json');
    }

    // Make request
    const response = await fetchWithTimeout(absoluteUrl, {
      ...fetchOptions,
      headers,
    }, timeout);

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle success
    if (response.ok) {
      return {
        success: true,
        data,
        status: response.status,
      };
    }

    // Handle error responses
    return {
      success: false,
      error: data?.error || data?.message || response.statusText,
      data,
      status: response.status,
      message: data?.message,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        success: false,
        error: 'Network error - please check your connection',
      };
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: `Request timeout (${timeout}ms)`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Specific HTTP method wrappers
 */

export async function apiGet<T = any>(
  url: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    ...options,
    method: 'GET',
  });
}

export async function apiPost<T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    ...options,
    method: 'POST',
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function apiPut<T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    ...options,
    method: 'PUT',
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function apiPatch<T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    ...options,
    method: 'PATCH',
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function apiDelete<T = any>(
  url: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    ...options,
    method: 'DELETE',
  });
}