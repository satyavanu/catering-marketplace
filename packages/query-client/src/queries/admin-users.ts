import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const accessToken = session?.user?.accessToken;
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

async function parseApiError(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}

async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'GET', headers });
  if (!res.ok) throw new Error(await parseApiError(res, 'Request failed'));
  const json = await res.json();
  return json?.data ?? json;
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseApiError(res, 'Update failed'));
  const json = await res.json();
  return json?.data ?? json;
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await parseApiError(res, 'Action failed'));
  const json = await res.json();
  return json?.data ?? json;
}

export type AdminUserRole =
  | 'user'
  | 'partner'
  | 'admin'
  | 'super_admin'
  | 'customer'
  | 'caterer';

export type AdminUserStatus = 'pending' | 'active' | 'suspended';

export interface AdminUser {
  ID: string;
  Email: string;
  Phone: string;
  EmailVerified: boolean;
  PhoneVerified: boolean;
  FirstName: string;
  LastName: string;
  FullName: string;
  Role: AdminUserRole | string;
  Status: AdminUserStatus | string;
  CountryCode: string;
  AvatarURL: string;
  RegistrationIP: string;
  LastLoginIP: string;
  CreatedAt: string;
  UpdatedAt: string;
  ActiveSessions: number;
}

export interface AdminUserSession {
  ID: string;
  DeviceInfo: string;
  UserAgent: string;
  IPAddress: string;
  Location: string;
  IsActive: boolean;
  CreatedAt: string;
  LastSeenAt?: string;
  ExpiresAt?: string;
  LoggedOutAt?: string;
}

export interface AdminUserDetail {
  user: AdminUser;
  sessions: AdminUserSession[];
}

export interface AdminUserFilters {
  search?: string;
  role?: string;
  status?: string;
  limit?: number;
}

export interface UpdateAdminUserPayload {
  userId: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  role?: AdminUserRole;
  status?: AdminUserStatus;
  country_code?: string;
  avatar_url?: string;
}

export const adminUserQueryKeys = {
  all: ['admin-users'] as const,
  list: (filters?: AdminUserFilters) =>
    [...adminUserQueryKeys.all, 'list', filters ?? {}] as const,
  detail: (userId?: string) =>
    [...adminUserQueryKeys.all, 'detail', userId] as const,
};

const buildQuery = (filters?: AdminUserFilters) => {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.role) params.set('role', filters.role);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.limit) params.set('limit', String(filters.limit));
  return params.toString();
};

export const fetchAdminUsers = (filters?: AdminUserFilters) => {
  const query = buildQuery(filters);
  return apiGet<AdminUser[]>(`/api/v1/admin/users${query ? `?${query}` : ''}`);
};

export const fetchAdminUser = (userId: string) =>
  apiGet<AdminUserDetail>(`/api/v1/admin/users/${userId}`);

export const updateAdminUser = (payload: UpdateAdminUserPayload) => {
  const { userId, ...body } = payload;
  return apiPatch<AdminUser>(`/api/v1/admin/users/${userId}`, body);
};

export const revokeAdminUserSessions = (userId: string) =>
  apiPost<{ revoked: number }>(`/api/v1/admin/users/${userId}/revoke-sessions`);

export const useAdminUsers = (
  filters?: AdminUserFilters,
  options?: UseQueryOptions<AdminUser[], Error>
) =>
  useQuery({
    queryKey: adminUserQueryKeys.list(filters),
    queryFn: () => fetchAdminUsers(filters),
    staleTime: 30 * 1000,
    ...options,
  });

export const useAdminUser = (
  userId?: string,
  options?: UseQueryOptions<AdminUserDetail, Error>
) =>
  useQuery({
    queryKey: adminUserQueryKeys.detail(userId),
    queryFn: () => fetchAdminUser(userId || ''),
    enabled: Boolean(userId),
    ...options,
  });

export const useUpdateAdminUser = (
  options?: UseMutationOptions<AdminUser, Error, UpdateAdminUserPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminUserQueryKeys.detail(variables.userId),
      });
    },
    ...options,
  });
};

export const useRevokeAdminUserSessions = (
  options?: UseMutationOptions<{ revoked: number }, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeAdminUserSessions,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminUserQueryKeys.detail(userId),
      });
    },
    ...options,
  });
};
