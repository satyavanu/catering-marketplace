import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getAuthHeaders(includeContentType = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();
  if (includeContentType) headers.set('Content-Type', 'application/json');
  const accessToken = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
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
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: await getAuthHeaders(false),
  });
  if (!res.ok) throw new Error(await parseApiError(res, 'Request failed'));
  const json = await res.json();
  return json?.data ?? json;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseApiError(res, 'Action failed'));
  const json = await res.json();
  return json?.data ?? json;
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseApiError(res, 'Update failed'));
  const json = await res.json();
  return json?.data ?? json;
}

async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(false),
  });
  if (!res.ok) throw new Error(await parseApiError(res, 'Delete failed'));
  const json = await res.json();
  return json?.data ?? json;
}

export type PartnerCouponDiscountType = 'percent' | 'fixed_amount';

export interface PartnerCouponTarget {
  id?: string;
  coupon_id?: string;
  service_id?: string | null;
  service_key?: string | null;
  package_key?: string | null;
  created_at?: string;
}

export interface PartnerCoupon {
  id: string;
  partner_id: string;
  code: string;
  title: string;
  description: string;
  discount_type: PartnerCouponDiscountType;
  discount_value: number;
  currency_code: string;
  max_discount_amount: number | null;
  min_order_amount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  max_redemptions: number | null;
  per_customer_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  redemptions_count: number;
  targets: PartnerCouponTarget[];
}

export interface PartnerCouponPayload {
  code: string;
  title: string;
  description?: string;
  discount_type: PartnerCouponDiscountType;
  discount_value: number;
  currency_code?: string;
  max_discount_amount?: number | null;
  min_order_amount?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  max_redemptions?: number | null;
  per_customer_limit?: number;
  is_active?: boolean;
  targets?: PartnerCouponTarget[];
}

export interface UpdatePartnerCouponPayload {
  couponId: string;
  payload: PartnerCouponPayload;
}

export const partnerCouponQueryKeys = {
  all: ['partner-coupons'] as const,
  mine: (ownerKey?: string) =>
    ownerKey
      ? ([...partnerCouponQueryKeys.all, 'mine', ownerKey] as const)
      : ([...partnerCouponQueryKeys.all, 'mine'] as const),
};

export const fetchPartnerCoupons = () =>
  apiGet<PartnerCoupon[]>('/api/v1/partner/coupons');
export const createPartnerCoupon = (payload: PartnerCouponPayload) =>
  apiPost<PartnerCoupon>('/api/v1/partner/coupons', payload);
export const updatePartnerCoupon = ({
  couponId,
  payload,
}: UpdatePartnerCouponPayload) =>
  apiPatch<PartnerCoupon>(`/api/v1/partner/coupons/${couponId}`, payload);
export const deletePartnerCoupon = (couponId: string) =>
  apiDelete(`/api/v1/partner/coupons/${couponId}`);

export const usePartnerCoupons = (
  options?: UseQueryOptions<PartnerCoupon[], Error>
) => {
  const { data: session } = useSession();
  const ownerKey =
    (session?.user as { id?: string; email?: string } | undefined)?.id ||
    (session?.user as { email?: string } | undefined)?.email ||
    'anonymous';

  return useQuery({
    queryKey: partnerCouponQueryKeys.mine(ownerKey),
    queryFn: fetchPartnerCoupons,
    enabled: ownerKey !== 'anonymous',
    staleTime: 30 * 1000,
    ...options,
  });
};

function upsertCouponCache(
  queryClient: ReturnType<typeof useQueryClient>,
  coupon: PartnerCoupon
) {
  queryClient.setQueriesData<PartnerCoupon[]>(
    { queryKey: partnerCouponQueryKeys.mine() },
    (current) => {
      if (!current) return [coupon];
      return current.some((item) => item.id === coupon.id)
        ? current.map((item) => (item.id === coupon.id ? coupon : item))
        : [coupon, ...current];
    }
  );
}

export const useCreatePartnerCoupon = (
  options?: UseMutationOptions<PartnerCoupon, Error, PartnerCouponPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createPartnerCoupon,
    onSuccess: (data, variables, context, mutation) => {
      upsertCouponCache(queryClient, data);
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useUpdatePartnerCoupon = (
  options?: UseMutationOptions<PartnerCoupon, Error, UpdatePartnerCouponPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: updatePartnerCoupon,
    onSuccess: (data, variables, context, mutation) => {
      upsertCouponCache(queryClient, data);
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDeletePartnerCoupon = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deletePartnerCoupon,
    onSuccess: (data, couponId, context, mutation) => {
      queryClient.setQueriesData<PartnerCoupon[]>(
        { queryKey: partnerCouponQueryKeys.mine() },
        (current) => current?.filter((item) => item.id !== couponId) || []
      );
      options?.onSuccess?.(data, couponId, context, mutation);
    },
  });
};
