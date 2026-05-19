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
  advanceAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus: string;
  paymentSummary?: PaymentSummary;
  payoutStatus: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  addressLine1?: string;
  cityName?: string;
  postalCode?: string;
  countryCode?: string;
  billingType?: string;
  companyName?: string;
  taxNumberType?: string;
  taxNumber?: string;
  billingDetails?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  pricingSnapshot?: Record<string, unknown>;
  cancellationReason?: string;
  cancelledBy?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingOrderSummary {
  id: string;
  orderNumber: string;
  razorpayOrderId?: string;
  status: string;
  paymentStage?: string;
  totalAmount: number;
  currency: string;
  paidAt?: string;
  createdAt: string;
  payments?: BookingPaymentSummary[];
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
  orders?: BookingOrderSummary[];
  order?: BookingOrderSummary;
  payment?: BookingPaymentSummary;
}

export interface PaymentSummary {
  advanceAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: string;
  isAdvancePaid?: boolean | null;
  isFullyPaid: boolean;
  nextPayment?: {
    type: string;
    amount: number;
  } | null;
}

export interface PartnerBookingCalendarItem {
  id: string;
  bookingNumber: string;
  title: string;
  status: string;
  paymentStatus: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  guestCount: number;
  customerName?: string;
  customerPhone?: string;
  location: string;
  currency: string;
  totalAmount: number;
  balanceAmount: number;
  serviceType: string;
  bookingType: string;
  quoteId?: string;
  flags?: string[];
}

export interface PartnerBookingCalendarResponse {
  from?: string;
  to?: string;
  items: PartnerBookingCalendarItem[];
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

export interface CancelBookingPayload {
  bookingId: string;
  reason: string;
}

export const bookingQueryKeys = {
  all: ['bookings'] as const,
  customer: () => [...bookingQueryKeys.all, 'customer'] as const,
  customerDetail: (bookingId: string) =>
    [...bookingQueryKeys.customer(), bookingId] as const,
  partner: () => [...bookingQueryKeys.all, 'partner'] as const,
  partnerDetail: (bookingId: string) =>
    [...bookingQueryKeys.partner(), bookingId] as const,
  partnerCalendar: (from?: string, to?: string) =>
    [...bookingQueryKeys.partner(), 'calendar', from || '', to || ''] as const,
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

export const getPartnerBookingCalendar = (params?: {
  from?: string;
  to?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);

  const queryString = searchParams.toString();
  return apiGet<PartnerBookingCalendarResponse>(
    `/api/v1/partner/bookings/calendar${queryString ? `?${queryString}` : ''}`
  );
};

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

export const cancelPartnerBooking = (payload: CancelBookingPayload) =>
  apiPost<Booking>(`/api/v1/partner/bookings/${payload.bookingId}/cancel`, {
    reason: payload.reason,
  });

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

export const usePartnerBookingCalendar = (
  params?: { from?: string; to?: string },
  enabled = true
) =>
  useQuery({
    queryKey: bookingQueryKeys.partnerCalendar(params?.from, params?.to),
    queryFn: () => getPartnerBookingCalendar(params),
    enabled,
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

export const useCancelPartnerBooking = (
  options?: UseMutationOptions<Booking, Error, CancelBookingPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPartnerBooking,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};
