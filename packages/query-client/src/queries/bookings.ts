import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
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
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Request failed'));
  }

  const json = await res.json();
  return json?.data ?? json;
}

export interface CreateBookingPayload {
  serviceId: string;
  quoteId?: string;
  bookingType?: 'instant' | 'quote_based';
  serviceType: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  guestCount: number;
  adultsCount?: number;
  childrenCount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  cityId?: string;
  cityName?: string;
  postalCode?: string;
  countryCode?: string;
  specialInstructions?: string;
  couponId?: string;
  metadata?: Record<string, unknown>;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  partnerId: string;
  serviceId?: string;
  quoteId?: string;
  bookingType: string;
  serviceType: string;
  status: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  guestCount: number;
  currency: string;
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  platformFeeAmount: number;
  partnerEarningAmount: number;
  totalAmount: number;
  paymentStatus: string;
  payoutStatus: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  addressLine1?: string;
  cityName?: string;
  postalCode?: string;
  countryCode?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingOrderSummary {
  id: string;
  orderNumber: string;
  razorpayOrderId?: string;
  status: string;
  totalAmount: number;
  currency: string;
  paidAt?: string;
  createdAt: string;
}

export interface BookingPaymentSummary {
  id: string;
  razorpayPaymentId?: string;
  status: string;
  method?: string;
  amount: number;
  currency: string;
  capturedAt?: string;
  errorCode?: string;
  errorDescription?: string;
  createdAt: string;
}

export interface BookingDetail extends Booking {
  order?: BookingOrderSummary;
  payment?: BookingPaymentSummary;
}

export interface PaymentOrder {
  booking: Booking;
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  amountMinor: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const bookingQueryKeys = {
  all: ['bookings'] as const,
  customer: () => [...bookingQueryKeys.all, 'customer'] as const,
  customerDetail: (bookingId: string) =>
    [...bookingQueryKeys.customer(), bookingId] as const,
  partner: () => [...bookingQueryKeys.all, 'partner'] as const,
  partnerDetail: (bookingId: string) =>
    [...bookingQueryKeys.partner(), bookingId] as const,
  adminPartner: (partnerId: string) =>
    [...bookingQueryKeys.all, 'admin-partner', partnerId] as const,
};

export const getCustomerBookings = () =>
  apiGet<BookingDetail[]>('/api/v1/bookings');

export const getCustomerBooking = (bookingId: string) =>
  apiGet<BookingDetail>(`/api/v1/bookings/${bookingId}`);

export const getPartnerBookings = () =>
  apiGet<BookingDetail[]>('/api/v1/partner/bookings');

export const getPartnerBooking = (bookingId: string) =>
  apiGet<BookingDetail>(`/api/v1/partner/bookings/${bookingId}`);

export const getAdminPartnerBookings = (partnerId: string) =>
  apiGet<BookingDetail[]>(`/api/v1/admin/partners/${partnerId}/bookings`);

export const createBooking = (payload: CreateBookingPayload) =>
  apiPost<Booking>('/api/v1/bookings', payload);

export const createBookingPaymentOrder = (bookingId: string) =>
  apiPost<PaymentOrder>(`/api/v1/bookings/${bookingId}/payment-order`);

export const verifyBookingPayment = (payload: VerifyPaymentPayload) =>
  apiPost<Booking>('/api/v1/bookings/payments/verify', payload);

export const completeBooking = (bookingId: string) =>
  apiPost<Booking>(`/api/v1/bookings/${bookingId}/complete`);

export const useCustomerBookings = (enabled = true) =>
  useQuery({
    queryKey: bookingQueryKeys.customer(),
    queryFn: getCustomerBookings,
    enabled,
  });

export const useCustomerBooking = (bookingId: string) =>
  useQuery({
    queryKey: bookingQueryKeys.customerDetail(bookingId),
    queryFn: () => getCustomerBooking(bookingId),
    enabled: Boolean(bookingId),
  });

export const usePartnerBookings = (enabled = true) =>
  useQuery({
    queryKey: bookingQueryKeys.partner(),
    queryFn: getPartnerBookings,
    enabled,
  });

export const usePartnerBooking = (bookingId: string) =>
  useQuery({
    queryKey: bookingQueryKeys.partnerDetail(bookingId),
    queryFn: () => getPartnerBooking(bookingId),
    enabled: Boolean(bookingId),
  });

export const useAdminPartnerBookings = (partnerId?: string) =>
  useQuery({
    queryKey: bookingQueryKeys.adminPartner(partnerId || ''),
    queryFn: () => getAdminPartnerBookings(partnerId || ''),
    enabled: Boolean(partnerId),
  });

export const useCreateBooking = (
  options?: UseMutationOptions<Booking, Error, CreateBookingPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
    },
    ...options,
  });
};

export const useCreateBookingPaymentOrder = (
  options?: UseMutationOptions<PaymentOrder, Error, string>
) =>
  useMutation({
    mutationFn: createBookingPaymentOrder,
    ...options,
  });

export const useVerifyBookingPayment = (
  options?: UseMutationOptions<Booking, Error, VerifyPaymentPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyBookingPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
    },
    ...options,
  });
};

export const useCompleteBooking = (
  options?: UseMutationOptions<Booking, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
    },
    ...options,
  });
};
