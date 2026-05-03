import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getAuthHeaders(includeContentType = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;
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

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders(true);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
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

export type BookingType = 'instant' | 'quote' | 'request_only';

export interface ServiceType {
  id: string;
  key: string;
  label: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ExperienceType {
  id: string;
  service_key: string;
  key: string;
  label: string;
  description: string;
  booking_type: BookingType;
  metadata: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UpsertServiceTypePayload {
  key: string;
  label: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpsertExperienceTypePayload {
  service_key: string;
  key: string;
  label: string;
  description?: string;
  booking_type?: BookingType;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  sort_order?: number;
}

export const serviceCatalogQueryKeys = {
  all: ['service-catalog'] as const,
  serviceTypes: () =>
    [...serviceCatalogQueryKeys.all, 'service-types'] as const,
  serviceType: (key: string) =>
    [...serviceCatalogQueryKeys.serviceTypes(), key] as const,
  experienceTypes: (serviceKey?: string) =>
    [
      ...serviceCatalogQueryKeys.all,
      'experience-types',
      serviceKey || 'all',
    ] as const,
};

export const fetchServiceTypes = () =>
  apiGet<ServiceType[]>('/api/v1/service-types');

export const fetchServiceType = (key: string) =>
  apiGet<ServiceType>(`/api/v1/service-types/${key}`);

export const fetchExperienceTypes = (serviceKey?: string) =>
  serviceKey
    ? apiGet<ExperienceType[]>(
        `/api/v1/experience-types/by-service/${serviceKey}`
      )
    : apiGet<ExperienceType[]>('/api/v1/experience-types');

export const upsertServiceType = (payload: UpsertServiceTypePayload) =>
  apiPost<ServiceType>('/api/v1/admin/service-types', payload);

export const updateServiceType = (payload: UpsertServiceTypePayload) =>
  apiPatch<ServiceType>(`/api/v1/admin/service-types/${payload.key}`, payload);

export const upsertExperienceType = (payload: UpsertExperienceTypePayload) =>
  apiPost<ExperienceType>('/api/v1/admin/experience-types', payload);

export const updateExperienceType = (payload: UpsertExperienceTypePayload) =>
  apiPatch<ExperienceType>(
    `/api/v1/admin/experience-types/${payload.key}`,
    payload
  );

export const useServiceTypes = (
  options?: UseQueryOptions<ServiceType[], Error>
) =>
  useQuery({
    queryKey: serviceCatalogQueryKeys.serviceTypes(),
    queryFn: fetchServiceTypes,
    staleTime: 60 * 60 * 1000,
    ...options,
  });

export const useServiceType = (
  key?: string,
  options?: UseQueryOptions<ServiceType, Error>
) =>
  useQuery({
    queryKey: serviceCatalogQueryKeys.serviceType(key || ''),
    queryFn: () => fetchServiceType(key || ''),
    enabled: Boolean(key),
    staleTime: 60 * 60 * 1000,
    ...options,
  });

export const useExperienceTypes = (
  serviceKey?: string,
  options?: UseQueryOptions<ExperienceType[], Error>
) =>
  useQuery({
    queryKey: serviceCatalogQueryKeys.experienceTypes(serviceKey),
    queryFn: () => fetchExperienceTypes(serviceKey),
    staleTime: 60 * 60 * 1000,
    ...options,
  });

export const useUpsertServiceType = (
  options?: UseMutationOptions<ServiceType, Error, UpsertServiceTypePayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertServiceType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.serviceTypes(),
      });
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.serviceType(data.key),
      });
    },
    ...options,
  });
};

export const useUpdateServiceType = (
  options?: UseMutationOptions<ServiceType, Error, UpsertServiceTypePayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.serviceTypes(),
      });
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.serviceType(data.key),
      });
    },
    ...options,
  });
};

export const useUpsertExperienceType = (
  options?: UseMutationOptions<
    ExperienceType,
    Error,
    UpsertExperienceTypePayload
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertExperienceType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.experienceTypes(data.service_key),
      });
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.experienceTypes(),
      });
    },
    ...options,
  });
};

export const useUpdateExperienceType = (
  options?: UseMutationOptions<
    ExperienceType,
    Error,
    UpsertExperienceTypePayload
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExperienceType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.experienceTypes(data.service_key),
      });
      queryClient.invalidateQueries({
        queryKey: serviceCatalogQueryKeys.experienceTypes(),
      });
    },
    ...options,
  });
};
