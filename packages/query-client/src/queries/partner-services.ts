import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';
import type { BookingType } from './service-catalog';

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

async function apiDelete<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders(false);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Delete failed'));
  }

  const json = await res.json();
  return json?.data ?? json;
}

export type PartnerServiceStatus =
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'inactive';

export type PricingModel =
  | 'per_person'
  | 'per_event'
  | 'per_plate'
  | 'package'
  | 'starting_from'
  | 'custom_quote';

export type PriceUnit = 'flat' | 'per_guest' | 'per_item' | 'per_plate';
export type FoodType = 'veg' | 'non_veg' | 'vegan' | 'egg';

export interface PartnerService {
  id: string;
  partner_id: string;
  service_key: string;
  experience_type_key: string;
  title: string;
  short_description: string;
  description: string;
  status: PartnerServiceStatus;
  booking_type: BookingType;
  pricing_model: PricingModel | '';
  base_price: number | null;
  currency_code: string;
  min_guests: number | null;
  max_guests: number | null;
  advance_notice_hours: number;
  service_areas: unknown[];
  media: unknown[];
  attributes: Record<string, unknown>;
  rejection_reason: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerServicePricingTier {
  id: string;
  service_id: string;
  min_guests: number;
  max_guests: number | null;
  price: number;
  price_unit: Extract<PriceUnit, 'per_guest' | 'per_plate' | 'flat'>;
  created_at: string;
}

export interface PartnerServiceMenuSection {
  id: string;
  service_id: string;
  key: string;
  label: string;
  min_select: number;
  max_select: number | null;
  is_required: boolean;
  sort_order: number;
  created_at: string;
}

export interface PartnerServiceMenuItem {
  id: string;
  service_id: string;
  section_id: string;
  name: string;
  description: string;
  food_type: FoodType | '';
  is_included: boolean;
  extra_price: number;
  price_unit: Extract<PriceUnit, 'per_guest' | 'per_item' | 'flat'>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface PartnerServiceAddon {
  id: string;
  service_id: string;
  key: string;
  label: string;
  description: string;
  price: number;
  price_unit: Extract<PriceUnit, 'flat' | 'per_guest' | 'per_item'>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface PartnerServiceDetail extends PartnerService {
  pricing_tiers: PartnerServicePricingTier[];
  menu_sections: PartnerServiceMenuSection[];
  menu_items: PartnerServiceMenuItem[];
  addons: PartnerServiceAddon[];
}

export interface PartnerServicePayload {
  service_key: string;
  experience_type_key?: string;
  title: string;
  short_description?: string;
  description?: string;
  booking_type: BookingType;
  pricing_model?: PricingModel;
  base_price?: number | null;
  currency_code?: string;
  min_guests?: number | null;
  max_guests?: number | null;
  advance_notice_hours?: number;
  service_areas?: unknown[];
  media?: unknown[];
  attributes?: Record<string, unknown>;
  is_active?: boolean;
}

export interface UpdatePartnerServicePayload {
  serviceId: string;
  payload: PartnerServicePayload;
}

export interface SetPartnerServiceActivePayload {
  serviceId: string;
  is_active: boolean;
}

export interface PricingTierPayload {
  serviceId: string;
  min_guests: number;
  max_guests?: number | null;
  price: number;
  price_unit?: Extract<PriceUnit, 'per_guest' | 'per_plate' | 'flat'>;
}

export interface MenuSectionPayload {
  serviceId: string;
  key: string;
  label: string;
  min_select?: number;
  max_select?: number | null;
  is_required?: boolean;
  sort_order?: number;
}

export interface MenuItemPayload {
  serviceId: string;
  section_id: string;
  name: string;
  description?: string;
  food_type?: FoodType;
  is_included?: boolean;
  extra_price?: number;
  price_unit?: Extract<PriceUnit, 'per_guest' | 'per_item' | 'flat'>;
  is_active?: boolean;
  sort_order?: number;
}

export interface AddonPayload {
  serviceId: string;
  key: string;
  label: string;
  description?: string;
  price?: number;
  price_unit?: Extract<PriceUnit, 'flat' | 'per_guest' | 'per_item'>;
  is_active?: boolean;
  sort_order?: number;
}

export interface DeleteChildPayload {
  serviceId: string;
  childId: string;
}

export interface PublicServiceFilters {
  service_key?: string;
  experience_type_key?: string;
}

export interface AdminPartnerServiceFilters extends PublicServiceFilters {
  status?: PartnerServiceStatus;
  partner_id?: string;
}

export interface RejectPartnerServicePayload {
  serviceId: string;
  reason: string;
}

export const partnerServiceQueryKeys = {
  all: ['partner-services'] as const,
  mine: (ownerKey?: string) =>
    ownerKey
      ? ([...partnerServiceQueryKeys.all, 'mine', ownerKey] as const)
      : ([...partnerServiceQueryKeys.all, 'mine'] as const),
  mineDetail: (serviceId: string, ownerKey?: string) =>
    ownerKey
      ? ([
          ...partnerServiceQueryKeys.all,
          'mine-detail',
          serviceId,
          ownerKey,
        ] as const)
      : ([...partnerServiceQueryKeys.all, 'mine-detail', serviceId] as const),
  publicList: (filters?: PublicServiceFilters) =>
    [...partnerServiceQueryKeys.all, 'public', filters || {}] as const,
  publicDetail: (serviceId: string) =>
    [...partnerServiceQueryKeys.all, 'public-detail', serviceId] as const,
  adminList: (filters?: AdminPartnerServiceFilters) =>
    [...partnerServiceQueryKeys.all, 'admin', filters || {}] as const,
  adminDetail: (serviceId: string) =>
    [...partnerServiceQueryKeys.all, 'admin-detail', serviceId] as const,
};

function toQueryString(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

export const fetchPublicServices = (filters?: PublicServiceFilters) =>
  apiGet<PartnerService[]>(
    `/api/v1/services${toQueryString({
      service_key: filters?.service_key,
      experience_type_key: filters?.experience_type_key,
    })}`
  );

export const fetchPublicService = (serviceId: string) =>
  apiGet<PartnerServiceDetail>(`/api/v1/services/${serviceId}`);

export const fetchMyPartnerServices = () =>
  apiGet<PartnerService[]>('/api/v1/partner/services');

export const fetchMyPartnerService = (serviceId: string) =>
  apiGet<PartnerServiceDetail>(`/api/v1/partner/services/${serviceId}`);

export const createPartnerService = (payload: PartnerServicePayload) =>
  apiPost<PartnerService>('/api/v1/partner/services', payload);

export const updatePartnerService = ({
  serviceId,
  payload,
}: UpdatePartnerServicePayload) =>
  apiPatch<PartnerService>(`/api/v1/partner/services/${serviceId}`, payload);

export const setPartnerServiceActive = ({
  serviceId,
  is_active,
}: SetPartnerServiceActivePayload) =>
  apiPatch<PartnerService>(`/api/v1/partner/services/${serviceId}/active`, {
    is_active,
  });

export const deletePartnerService = (serviceId: string) =>
  apiDelete(`/api/v1/partner/services/${serviceId}`);

export const submitPartnerService = (serviceId: string) =>
  apiPost<PartnerService>(`/api/v1/partner/services/${serviceId}/submit`);

export const createPartnerServicePricingTier = ({
  serviceId,
  ...payload
}: PricingTierPayload) =>
  apiPost<PartnerServicePricingTier>(
    `/api/v1/partner/services/${serviceId}/pricing-tiers`,
    payload
  );

export const deletePartnerServicePricingTier = ({
  serviceId,
  childId,
}: DeleteChildPayload) =>
  apiDelete(`/api/v1/partner/services/${serviceId}/pricing-tiers/${childId}`);

export const createPartnerServiceMenuSection = ({
  serviceId,
  ...payload
}: MenuSectionPayload) =>
  apiPost<PartnerServiceMenuSection>(
    `/api/v1/partner/services/${serviceId}/menu-sections`,
    payload
  );

export const deletePartnerServiceMenuSection = ({
  serviceId,
  childId,
}: DeleteChildPayload) =>
  apiDelete(`/api/v1/partner/services/${serviceId}/menu-sections/${childId}`);

export const createPartnerServiceMenuItem = ({
  serviceId,
  ...payload
}: MenuItemPayload) =>
  apiPost<PartnerServiceMenuItem>(
    `/api/v1/partner/services/${serviceId}/menu-items`,
    payload
  );

export const deletePartnerServiceMenuItem = ({
  serviceId,
  childId,
}: DeleteChildPayload) =>
  apiDelete(`/api/v1/partner/services/${serviceId}/menu-items/${childId}`);

export const createPartnerServiceAddon = ({
  serviceId,
  ...payload
}: AddonPayload) =>
  apiPost<PartnerServiceAddon>(
    `/api/v1/partner/services/${serviceId}/addons`,
    payload
  );

export const deletePartnerServiceAddon = ({
  serviceId,
  childId,
}: DeleteChildPayload) =>
  apiDelete(`/api/v1/partner/services/${serviceId}/addons/${childId}`);

export const fetchAdminPartnerServices = (
  filters?: AdminPartnerServiceFilters
) =>
  apiGet<PartnerService[]>(
    `/api/v1/admin/partner-services${toQueryString({
      status: filters?.status,
      partner_id: filters?.partner_id,
      service_key: filters?.service_key,
      experience_type_key: filters?.experience_type_key,
    })}`
  );

export const fetchAdminPartnerService = (serviceId: string) =>
  apiGet<PartnerServiceDetail>(`/api/v1/admin/partner-services/${serviceId}`);

export const approvePartnerService = (serviceId: string) =>
  apiPost<PartnerService>(
    `/api/v1/admin/partner-services/${serviceId}/approve`
  );

export const rejectPartnerService = ({
  serviceId,
  reason,
}: RejectPartnerServicePayload) =>
  apiPost<PartnerService>(
    `/api/v1/admin/partner-services/${serviceId}/reject`,
    { reason }
  );

export const deactivatePartnerService = (serviceId: string) =>
  apiPost<PartnerService>(
    `/api/v1/admin/partner-services/${serviceId}/deactivate`
  );

export const usePublicServices = (
  filters?: PublicServiceFilters,
  options?: UseQueryOptions<PartnerService[], Error>
) =>
  useQuery({
    queryKey: partnerServiceQueryKeys.publicList(filters),
    queryFn: () => fetchPublicServices(filters),
    staleTime: 60 * 1000,
    ...options,
  });

export const usePublicService = (
  serviceId?: string,
  options?: UseQueryOptions<PartnerServiceDetail, Error>
) =>
  useQuery({
    queryKey: partnerServiceQueryKeys.publicDetail(serviceId || ''),
    queryFn: () => fetchPublicService(serviceId || ''),
    enabled: Boolean(serviceId),
    ...options,
  });

export const useMyPartnerServices = (
  options?: UseQueryOptions<PartnerService[], Error>
) => {
  const { data: session } = useSession();
  const ownerKey =
    (session?.user as { id?: string; email?: string } | undefined)?.id ||
    (session?.user as { email?: string } | undefined)?.email ||
    'anonymous';

  return useQuery({
    queryKey: partnerServiceQueryKeys.mine(ownerKey),
    queryFn: fetchMyPartnerServices,
    enabled: ownerKey !== 'anonymous',
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useMyPartnerService = (
  serviceId?: string,
  options?: UseQueryOptions<PartnerServiceDetail, Error>
) => {
  const { data: session } = useSession();
  const ownerKey =
    (session?.user as { id?: string; email?: string } | undefined)?.id ||
    (session?.user as { email?: string } | undefined)?.email ||
    'anonymous';

  return useQuery({
    queryKey: partnerServiceQueryKeys.mineDetail(serviceId || '', ownerKey),
    queryFn: () => fetchMyPartnerService(serviceId || ''),
    enabled: Boolean(serviceId) && ownerKey !== 'anonymous',
    ...options,
  });
};

export const useAdminPartnerServices = (
  filters?: AdminPartnerServiceFilters,
  options?: UseQueryOptions<PartnerService[], Error>
) =>
  useQuery({
    queryKey: partnerServiceQueryKeys.adminList(filters),
    queryFn: () => fetchAdminPartnerServices(filters),
    staleTime: 30 * 1000,
    ...options,
  });

export const useAdminPartnerService = (
  serviceId?: string,
  options?: UseQueryOptions<PartnerServiceDetail, Error>
) =>
  useQuery({
    queryKey: partnerServiceQueryKeys.adminDetail(serviceId || ''),
    queryFn: () => fetchAdminPartnerService(serviceId || ''),
    enabled: Boolean(serviceId),
    ...options,
  });

function invalidateService(
  queryClient: ReturnType<typeof useQueryClient>,
  id?: string
) {
  queryClient.invalidateQueries({ queryKey: partnerServiceQueryKeys.mine() });
  queryClient.invalidateQueries({ queryKey: partnerServiceQueryKeys.all });
  if (id) {
    queryClient.invalidateQueries({
      queryKey: partnerServiceQueryKeys.mineDetail(id),
    });
    queryClient.invalidateQueries({
      queryKey: partnerServiceQueryKeys.publicDetail(id),
    });
    queryClient.invalidateQueries({
      queryKey: partnerServiceQueryKeys.adminDetail(id),
    });
  }
}

function upsertServiceCache(
  queryClient: ReturnType<typeof useQueryClient>,
  service: PartnerService
) {
  queryClient.setQueriesData<PartnerService[]>(
    { queryKey: partnerServiceQueryKeys.mine() },
    (current) => {
      if (!current) return [service];

      const exists = current.some((item) => item.id === service.id);
      if (!exists) return [service, ...current];

      return current.map((item) =>
        item.id === service.id ? { ...item, ...service } : item
      );
    }
  );

  queryClient.setQueriesData<PartnerServiceDetail>(
    { queryKey: partnerServiceQueryKeys.mineDetail(service.id) },
    (current) =>
      ({
        ...(current || {}),
        ...service,
      }) as PartnerServiceDetail
  );
}

function removeServiceCache(
  queryClient: ReturnType<typeof useQueryClient>,
  serviceId: string
) {
  queryClient.setQueriesData<PartnerService[]>(
    { queryKey: partnerServiceQueryKeys.mine() },
    (current) => current?.filter((item) => item.id !== serviceId) || []
  );
  queryClient.removeQueries({
    queryKey: partnerServiceQueryKeys.mineDetail(serviceId),
  });
}

export const useCreatePartnerService = (
  options?: UseMutationOptions<PartnerService, Error, PartnerServicePayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createPartnerService,
    onSuccess: (data, variables, context, mutation) => {
      upsertServiceCache(queryClient, data);
      invalidateService(queryClient, data.id);
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useUpdatePartnerService = (
  options?: UseMutationOptions<
    PartnerService,
    Error,
    UpdatePartnerServicePayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: updatePartnerService,
    onSuccess: (data, variables, context, mutation) => {
      upsertServiceCache(queryClient, data);
      invalidateService(queryClient, data.id);
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDeletePartnerService = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deletePartnerService,
    onSuccess: (data, serviceId, context, mutation) => {
      removeServiceCache(queryClient, serviceId);
      invalidateService(queryClient, serviceId);
      options?.onSuccess?.(data, serviceId, context, mutation);
    },
  });
};

export const useSetPartnerServiceActive = (
  options?: UseMutationOptions<
    PartnerService,
    Error,
    SetPartnerServiceActivePayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: setPartnerServiceActive,
    onSuccess: (data, variables, context, mutation) => {
      upsertServiceCache(queryClient, data);
      invalidateService(queryClient, data.id);
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useSubmitPartnerService = (
  options?: UseMutationOptions<PartnerService, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: submitPartnerService,
    onSuccess: (data, variables, context, mutation) => {
      upsertServiceCache(queryClient, data);
      invalidateService(queryClient, data.id);
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useCreatePartnerServicePricingTier = (
  options?: UseMutationOptions<
    PartnerServicePricingTier,
    Error,
    PricingTierPayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerServicePricingTier,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useDeletePartnerServicePricingTier = (
  options?: UseMutationOptions<unknown, Error, DeleteChildPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePartnerServicePricingTier,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useCreatePartnerServiceMenuSection = (
  options?: UseMutationOptions<
    PartnerServiceMenuSection,
    Error,
    MenuSectionPayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerServiceMenuSection,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useDeletePartnerServiceMenuSection = (
  options?: UseMutationOptions<unknown, Error, DeleteChildPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePartnerServiceMenuSection,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useCreatePartnerServiceMenuItem = (
  options?: UseMutationOptions<PartnerServiceMenuItem, Error, MenuItemPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerServiceMenuItem,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useDeletePartnerServiceMenuItem = (
  options?: UseMutationOptions<unknown, Error, DeleteChildPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePartnerServiceMenuItem,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useCreatePartnerServiceAddon = (
  options?: UseMutationOptions<PartnerServiceAddon, Error, AddonPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerServiceAddon,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useDeletePartnerServiceAddon = (
  options?: UseMutationOptions<unknown, Error, DeleteChildPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePartnerServiceAddon,
    onSuccess: (_, variables) =>
      invalidateService(queryClient, variables.serviceId),
    ...options,
  });
};

export const useApprovePartnerService = (
  options?: UseMutationOptions<PartnerService, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approvePartnerService,
    onSuccess: (data) => invalidateService(queryClient, data.id),
    ...options,
  });
};

export const useRejectPartnerService = (
  options?: UseMutationOptions<
    PartnerService,
    Error,
    RejectPartnerServicePayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectPartnerService,
    onSuccess: (data) => invalidateService(queryClient, data.id),
    ...options,
  });
};

export const useDeactivatePartnerService = (
  options?: UseMutationOptions<PartnerService, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivatePartnerService,
    onSuccess: (data) => invalidateService(queryClient, data.id),
    ...options,
  });
};
