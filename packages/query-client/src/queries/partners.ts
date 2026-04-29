import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

// API base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '[localhost](http://localhost:8080)';

// =====================
// Auth ഹെൽപ്പർ
// =====================
async function getAuthHeaders(includeContentType: boolean = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  return headers;
}

// =====================
// Types
// =====================
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'deactivated';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface PartnerListResponse {
  data: Partner[];
  success: boolean;
  message?: string;
}

// =====================
// Query Keys
// =====================
export const partnerQueryKeys = {
  all: ['partners'] as const,
  me: () => [...partnerQueryKeys.all, 'me'] as const,
  detail: (partnerId: string) => [...partnerQueryKeys.all, 'detail', partnerId] as const,
  adminList: () => [...partnerQueryKeys.all, 'admin-list'] as const,
  adminDetail: (partnerId: string) => [...partnerQueryKeys.all, 'admin-detail', partnerId] as const,
};

// =====================
// API Calls
// =====================

// Get my profile
const fetchMyPartner = async (): Promise<Partner> => {
  const headers = await getAuthHeaders(false);

  const res = await fetch(`${API_BASE_URL}/api/v1/partners/me`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) throw new Error('Failed to fetch partner profile');

  const data = await res.json();
  return data.data;
};

// Get partner by ID
const fetchPartnerById = async (partnerId: string): Promise<Partner> => {
  const headers = await getAuthHeaders(false);

  const res = await fetch(`${API_BASE_URL}/api/v1/partners/${partnerId}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) throw new Error('Failed to fetch partner');

  const data = await res.json();
  return data.data;
};

// Update partner
const updatePartner = async ({ partnerId, payload }: { partnerId: string; payload: Partial<Partner> }) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/v1/partners/${partnerId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update partner');

  return res.json();
};

// Admin: list partners
const fetchAdminPartners = async (): Promise<Partner[]> => {
  const headers = await getAuthHeaders(false);

  const res = await fetch(`${API_BASE_URL}/api/v1/admin/partners`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) throw new Error('Failed to fetch partners');

  const data = await res.json();
  return data.data;
};

// Admin: get partner
const fetchAdminPartnerById = async (partnerId: string): Promise<Partner> => {
  const headers = await getAuthHeaders(false);

  const res = await fetch(`${API_BASE_URL}/api/v1/admin/partners/${partnerId}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) throw new Error('Failed to fetch partner');

  const data = await res.json();
  return data.data;
};

// Admin actions (approve/reject/suspend/deactivate)
const adminAction = async (url: string) => {
  const headers = await getAuthHeaders(false);

  const res = await fetch(url, {
    method: 'POST',
    headers,
  });

  if (!res.ok) throw new Error('Action failed');

  return res.json();
};

// =====================
// Query Hooks
// =====================

export const useMyPartner = (options?: UseQueryOptions<Partner, Error>) =>
  useQuery({
    queryKey: partnerQueryKeys.me(),
    queryFn: fetchMyPartner,
    staleTime: 60 * 60 * 1000,
    ...options,
  });

export const usePartner = (partnerId: string, options?: UseQueryOptions<Partner, Error>) =>
  useQuery({
    queryKey: partnerQueryKeys.detail(partnerId),
    queryFn: () => fetchPartnerById(partnerId),
    enabled: !!partnerId,
    ...options,
  });

export const useAdminPartners = (options?: UseQueryOptions<Partner[], Error>) =>
  useQuery({
    queryKey: partnerQueryKeys.adminList(),
    queryFn: fetchAdminPartners,
    ...options,
  });

export const useAdminPartner = (partnerId: string, options?: UseQueryOptions<Partner, Error>) =>
  useQuery({
    queryKey: partnerQueryKeys.adminDetail(partnerId),
    queryFn: () => fetchAdminPartnerById(partnerId),
    enabled: !!partnerId,
    ...options,
  });

// =====================
// Mutations
// =====================

export const useUpdatePartner = (
  options?: UseMutationOptions<any, Error, { partnerId: string; payload: Partial<Partner> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePartner,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.detail(variables.partnerId) });
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.me() });
    },
    ...options,
  });
};

// Admin Actions Hooks

export const useApprovePartner = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) =>
      adminAction(`${API_BASE_URL}/api/v1/admin/partners/${partnerId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.adminList() });
    },
    ...options,
  });
};

export const useRejectPartner = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) =>
      adminAction(`${API_BASE_URL}/api/v1/admin/partners/${partnerId}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.adminList() });
    },
    ...options,
  });
};

export const useSuspendPartner = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) =>
      adminAction(`${API_BASE_URL}/api/v1/admin/partners/${partnerId}/suspend`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.adminList() });
    },
    ...options,
  });
};

export const useDeactivatePartner = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) =>
      adminAction(`${API_BASE_URL}/api/v1/admin/partners/${partnerId}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.adminList() });
    },
    ...options,
  });
};
