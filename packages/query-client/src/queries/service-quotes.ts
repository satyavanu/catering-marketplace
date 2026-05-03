import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import type { PriceUnit } from './partner-services';

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

export type QuoteRequestStatus =
  | 'requested'
  | 'partner_reviewing'
  | 'quoted'
  | 'customer_accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface QuoteRequest {
  id: string;
  customer_id: string;
  partner_id: string;
  service_id: string;
  event_date: string | null;
  event_time: string;
  guest_count: number;
  location_text: string;
  city_id: string;
  postal_code: string;
  occasion: string;
  customer_notes: string;
  status: QuoteRequestStatus;
  estimated_price: number | null;
  final_price: number | null;
  currency_code: string;
  partner_notes: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestItemPayload {
  service_menu_item_id?: string;
  section_key: string;
  section_label?: string;
  item_name: string;
  quantity?: number;
  price_snapshot?: number;
  price_unit?: Extract<PriceUnit, 'per_guest' | 'per_item' | 'flat'>;
  notes?: string;
}

export interface QuoteRequestAddonPayload {
  addon_id?: string;
  addon_key?: string;
  addon_label: string;
  quantity?: number;
  price_snapshot?: number;
  price_unit?: Extract<PriceUnit, 'flat' | 'per_guest' | 'per_item'>;
}

export interface CreateQuoteRequestPayload {
  service_id: string;
  event_date?: string;
  event_time?: string;
  guest_count: number;
  location_text?: string;
  city_id?: string;
  postal_code?: string;
  occasion?: string;
  customer_notes?: string;
  items?: QuoteRequestItemPayload[];
  addons?: QuoteRequestAddonPayload[];
}

export interface SendQuotePayload {
  quoteRequestId: string;
  estimated_price?: number | null;
  final_price?: number | null;
  partner_notes?: string;
}

export const serviceQuoteQueryKeys = {
  all: ['service-quotes'] as const,
  customerList: () => [...serviceQuoteQueryKeys.all, 'customer'] as const,
  partnerList: () => [...serviceQuoteQueryKeys.all, 'partner'] as const,
};

export const createQuoteRequest = (payload: CreateQuoteRequestPayload) =>
  apiPost<QuoteRequest>('/api/v1/quote-requests', payload);

export const fetchCustomerQuoteRequests = () =>
  apiGet<QuoteRequest[]>('/api/v1/customer/quote-requests');

export const cancelQuoteRequest = (quoteRequestId: string) =>
  apiPost<QuoteRequest>(
    `/api/v1/customer/quote-requests/${quoteRequestId}/cancel`
  );

export const acceptQuoteRequest = (quoteRequestId: string) =>
  apiPost<QuoteRequest>(
    `/api/v1/customer/quote-requests/${quoteRequestId}/accept`
  );

export const fetchPartnerQuoteRequests = () =>
  apiGet<QuoteRequest[]>('/api/v1/partner/quote-requests');

export const reviewQuoteRequest = (quoteRequestId: string) =>
  apiPost<QuoteRequest>(
    `/api/v1/partner/quote-requests/${quoteRequestId}/review`
  );

export const rejectQuoteRequest = (quoteRequestId: string) =>
  apiPost<QuoteRequest>(
    `/api/v1/partner/quote-requests/${quoteRequestId}/reject`
  );

export const sendQuote = ({ quoteRequestId, ...payload }: SendQuotePayload) =>
  apiPost<QuoteRequest>(
    `/api/v1/partner/quote-requests/${quoteRequestId}/send-quote`,
    payload
  );

export const useCreateQuoteRequest = (
  options?: UseMutationOptions<QuoteRequest, Error, CreateQuoteRequestPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceQuoteQueryKeys.customerList(),
      });
    },
    ...options,
  });
};

export const useCustomerQuoteRequests = (
  options?: UseQueryOptions<QuoteRequest[], Error>
) =>
  useQuery({
    queryKey: serviceQuoteQueryKeys.customerList(),
    queryFn: fetchCustomerQuoteRequests,
    staleTime: 30 * 1000,
    ...options,
  });

export const usePartnerQuoteRequests = (
  options?: UseQueryOptions<QuoteRequest[], Error>
) =>
  useQuery({
    queryKey: serviceQuoteQueryKeys.partnerList(),
    queryFn: fetchPartnerQuoteRequests,
    staleTime: 30 * 1000,
    ...options,
  });

function invalidateQuotes(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({
    queryKey: serviceQuoteQueryKeys.customerList(),
  });
  queryClient.invalidateQueries({
    queryKey: serviceQuoteQueryKeys.partnerList(),
  });
}

export const useCancelQuoteRequest = (
  options?: UseMutationOptions<QuoteRequest, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelQuoteRequest,
    onSuccess: () => invalidateQuotes(queryClient),
    ...options,
  });
};

export const useAcceptQuoteRequest = (
  options?: UseMutationOptions<QuoteRequest, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptQuoteRequest,
    onSuccess: () => invalidateQuotes(queryClient),
    ...options,
  });
};

export const useReviewQuoteRequest = (
  options?: UseMutationOptions<QuoteRequest, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewQuoteRequest,
    onSuccess: () => invalidateQuotes(queryClient),
    ...options,
  });
};

export const useRejectQuoteRequest = (
  options?: UseMutationOptions<QuoteRequest, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectQuoteRequest,
    onSuccess: () => invalidateQuotes(queryClient),
    ...options,
  });
};

export const useSendQuote = (
  options?: UseMutationOptions<QuoteRequest, Error, SendQuotePayload>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendQuote,
    onSuccess: () => invalidateQuotes(queryClient),
    ...options,
  });
};
