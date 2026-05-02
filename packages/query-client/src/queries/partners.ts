import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getAuthHeaders(includeContentType = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

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
  const headers = await getAuthHeaders(false);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Request failed'));
  }

  const json = await res.json();
  return json?.data ?? json;
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders(true);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Action failed'));
  }

  const json = await res.json();
  return json?.data ?? json;
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders(true);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Update failed'));
  }

  const json = await res.json();
  return json?.data ?? json;
}

export type PartnerStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'deactivated';

export type VerificationStatus =
  | 'missing'
  | 'pending'
  | 'uploaded'
  | 'verified'
  | 'rejected'
  | 'invalid'
  | 'not_applicable';

export interface AdminPartnerRow {
  id: string;
  userId?: string;
  name: string;
  countryCode?: string;
  businessName: string;
  businessType: string;
  city?: string;
  email?: string;
  phone?: string;
  status: PartnerStatus;
  submittedOn?: string;
  createdAt?: string;
  updatedAt?: string;
  documentsUploaded?: number;
  documentsRequired?: number;
  panStatus?: VerificationStatus;
  gstStatus?: VerificationStatus;
  fssaiStatus?: VerificationStatus;
}

export interface PartnerDocument {
  id: string;
  type: string;
  status: VerificationStatus;
  fileName?: string;
  fileUrl?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}

export interface AdminPartnerDetail extends AdminPartnerRow {
  profile?: {
    legalName?: string;
    address?: string;
    serviceAreas?: string[];
    cuisines?: string[];
    description?: string;
  };
  documents?: PartnerDocument[];
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface RejectPartnerPayload {
  partnerId: string;
  reason: string;
  notifyPartner?: boolean;
}

export interface UpdatePartnerPayload {
  partnerId: string;
  payload: Partial<Partner>;
}

export const partnerQueryKeys = {
  all: ['partners'] as const,
  me: () => [...partnerQueryKeys.all, 'me'] as const,
  detail: (partnerId: string) =>
    [...partnerQueryKeys.all, 'detail', partnerId] as const,
  adminList: () => [...partnerQueryKeys.all, 'admin-list'] as const,
  adminDetail: (partnerId: string) =>
    [...partnerQueryKeys.all, 'admin-detail', partnerId] as const,
};

const fetchMyPartner = () => apiGet<Partner>('/api/v1/partners/me');

const fetchPartnerById = (partnerId: string) =>
  apiGet<Partner>(`/api/v1/partners/${partnerId}`);

const updatePartner = ({ partnerId, payload }: UpdatePartnerPayload) =>
  apiPatch(`/api/v1/partners/${partnerId}`, payload);

const fetchAdminPartners = () =>
  apiGet<AdminPartnerRow[]>('/api/v1/admin/partners');

const fetchAdminPartnerById = (partnerId: string) =>
  apiGet<AdminPartnerDetail>(`/api/v1/admin/partners/${partnerId}`);

const approvePartner = (partnerId: string) =>
  apiPost(`/api/v1/admin/partners/${partnerId}/approve`);

const rejectPartner = ({
  partnerId,
  reason,
  notifyPartner = true,
}: RejectPartnerPayload) =>
  apiPost(`/api/v1/admin/partners/${partnerId}/reject`, {
    reason,
    notifyPartner,
  });

const suspendPartner = (partnerId: string) =>
  apiPost(`/api/v1/admin/partners/${partnerId}/suspend`);

const deactivatePartner = (partnerId: string) =>
  apiPost(`/api/v1/admin/partners/${partnerId}/deactivate`);

export const useMyPartner = (options?: UseQueryOptions<Partner, Error>) =>
  useQuery({
    queryKey: partnerQueryKeys.me(),
    queryFn: fetchMyPartner,
    staleTime: 60 * 60 * 1000,
    ...options,
  });

export const usePartner = (
  partnerId: string,
  options?: UseQueryOptions<Partner, Error>
) =>
  useQuery({
    queryKey: partnerQueryKeys.detail(partnerId),
    queryFn: () => fetchPartnerById(partnerId),
    enabled: Boolean(partnerId),
    ...options,
  });

export const useAdminPartners = (
  options?: UseQueryOptions<AdminPartnerRow[], Error>
) =>
  useQuery({
    queryKey: partnerQueryKeys.adminList(),
    queryFn: fetchAdminPartners,
    staleTime: 30 * 1000,
    ...options,
  });

export const useAdminPartner = (
  partnerId?: string,
  options?: UseQueryOptions<AdminPartnerDetail, Error>
) =>
  useQuery({
    queryKey: partnerQueryKeys.adminDetail(partnerId || ''),
    queryFn: () => fetchAdminPartnerById(partnerId || ''),
    enabled: Boolean(partnerId),
    ...options,
  });

export const useUpdatePartner = (
  options?: UseMutationOptions<unknown, Error, UpdatePartnerPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePartner,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.detail(variables.partnerId),
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.me(),
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminList(),
      });
    },
    ...options,
  });
};

export const useApprovePartner = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvePartner,
    onSuccess: (_, partnerId) => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminList(),
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminDetail(partnerId),
      });
    },
    ...options,
  });
};

export const useRejectPartner = (
  options?: UseMutationOptions<unknown, Error, RejectPartnerPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectPartner,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminList(),
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminDetail(variables.partnerId),
      });
    },
    ...options,
  });
};

export const useSuspendPartner = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendPartner,
    onSuccess: (_, partnerId) => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminList(),
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminDetail(partnerId),
      });
    },
    ...options,
  });
};

export const useDeactivatePartner = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivatePartner,
    onSuccess: (_, partnerId) => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminList(),
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.adminDetail(partnerId),
      });
    },
    ...options,
  });
};