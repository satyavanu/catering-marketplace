import { getSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

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

export interface RegisterNotificationDeviceTokenPayload {
  token: string;
  platform: 'web' | 'ios' | 'android';
  provider?: 'firebase';
  device_id?: string;
  user_agent?: string;
}

export interface DeactivateNotificationDeviceTokenPayload {
  token: string;
  provider?: 'firebase';
}

export interface AccountNotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_user_id?: string | null;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountNotificationList {
  items: AccountNotificationItem[];
  unread_count: number;
}

export interface FetchAccountNotificationsOptions {
  limit?: number;
  unread_only?: boolean;
}

export interface NotificationPreference {
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
}

export type UpdateNotificationPreferencePayload =
  Partial<NotificationPreference>;

export const accountNotificationKeys = {
  all: ['account-notifications'] as const,
  list: (options?: FetchAccountNotificationsOptions) =>
    [...accountNotificationKeys.all, 'list', options ?? {}] as const,
  preferences: () => [...accountNotificationKeys.all, 'preferences'] as const,
};

export const registerNotificationDeviceToken = async (
  payload: RegisterNotificationDeviceTokenPayload
) => {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/v1/notifications/device-tokens`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        provider: 'firebase',
        ...payload,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, 'Failed to register device token')
    );
  }

  return res.json();
};

export const fetchAccountNotifications = async (
  options?: FetchAccountNotificationsOptions
): Promise<AccountNotificationList> => {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();

  if (options?.limit) {
    params.set('limit', String(options.limit));
  }

  if (options?.unread_only) {
    params.set('unread_only', 'true');
  }

  const queryString = params.toString();
  const res = await fetch(
    `${API_BASE_URL}/api/v1/notifications${queryString ? `?${queryString}` : ''}`,
    { headers }
  );

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to fetch notifications'));
  }

  const json = await res.json();
  const data = json?.data ?? json;

  return {
    items: Array.isArray(data?.items) ? data.items : [],
    unread_count:
      typeof data?.unread_count === 'number' ? data.unread_count : 0,
  };
};

export const markAccountNotificationRead = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/v1/notifications/items/${id}/read`,
    {
      method: 'POST',
      headers,
    }
  );

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, 'Failed to mark notification as read')
    );
  }

  return res.json();
};

export const markAllAccountNotificationsRead = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/v1/notifications/mark-all-read`,
    {
      method: 'POST',
      headers,
    }
  );

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, 'Failed to mark notifications as read')
    );
  }

  return res.json();
};

export const deleteAccountNotification = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/v1/notifications/items/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to delete notification'));
  }

  return res.json();
};

export const clearAccountNotifications = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/v1/notifications/clear`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to clear notifications'));
  }

  return res.json();
};

export const fetchNotificationPreference =
  async (): Promise<NotificationPreference> => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_BASE_URL}/api/v1/notifications/preferences`,
      {
        headers,
      }
    );

    if (!res.ok) {
      throw new Error(
        await parseApiError(res, 'Failed to fetch notification preferences')
      );
    }

    const json = await res.json();
    return json?.data ?? json;
  };

export const updateNotificationPreference = async (
  payload: UpdateNotificationPreferencePayload
): Promise<NotificationPreference> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/v1/notifications/preferences`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, 'Failed to update notification preferences')
    );
  }

  const json = await res.json();
  return json?.data ?? json;
};

export const useAccountNotifications = (
  options?: FetchAccountNotificationsOptions,
  queryOptions?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: accountNotificationKeys.list(options),
    queryFn: () => fetchAccountNotifications(options),
    enabled: queryOptions?.enabled ?? true,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

export const useMarkAccountNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAccountNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountNotificationKeys.all,
      });
    },
  });
};

export const useMarkAllAccountNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAccountNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountNotificationKeys.all,
      });
    },
  });
};

export const useDeleteAccountNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountNotification,
    onSuccess: (_, id) => {
      queryClient.setQueriesData<AccountNotificationList>(
        { queryKey: accountNotificationKeys.all },
        (current) => {
          if (!current) return current;

          const deleted = current.items.find((item) => item.id === id);
          return {
            items: current.items.filter((item) => item.id !== id),
            unread_count:
              deleted && !deleted.is_read
                ? Math.max(0, current.unread_count - 1)
                : current.unread_count,
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: accountNotificationKeys.all,
      });
    },
  });
};

export const useClearAccountNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAccountNotifications,
    onSuccess: () => {
      queryClient.setQueriesData<AccountNotificationList>(
        { queryKey: accountNotificationKeys.all },
        (current) =>
          current
            ? {
                items: [],
                unread_count: 0,
              }
            : current
      );
      queryClient.invalidateQueries({
        queryKey: accountNotificationKeys.all,
      });
    },
  });
};

export const useNotificationPreference = () =>
  useQuery({
    queryKey: accountNotificationKeys.preferences(),
    queryFn: fetchNotificationPreference,
    staleTime: 60_000,
  });

export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountNotificationKeys.preferences(),
      });
    },
  });
};

export const deactivateNotificationDeviceToken = async (
  payload: DeactivateNotificationDeviceTokenPayload
) => {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/v1/notifications/device-tokens`,
    {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        provider: 'firebase',
        ...payload,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, 'Failed to deactivate device token')
    );
  }

  return res.json();
};
