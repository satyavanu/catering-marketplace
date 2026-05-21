import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface AdminPushCampaign {
  id: string;
  title: string;
  body: string;
  image_url?: string | null;
  deeplink_url?: string | null;
  target_type: string;
  target_topic_key?: string | null;
  status: string;
  sent_at?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  expires_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateAdminPushCampaignPayload {
  title: string;
  body: string;
  imageUrl?: string;
  deeplinkUrl?: string;
  targetType: string;
  targetTopicKey: string;
  sendNow: boolean;
  startsAt?: string;
  endsAt?: string;
  expiresAt?: string;
}

async function getAdminHeaders() {
  const session = await getSession();
  const accessToken = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;

  if (!accessToken) {
    throw new Error('Admin session is missing an access token.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

async function parseError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data?.error || data?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchAdminPushCampaigns(): Promise<AdminPushCampaign[]> {
  const response = await fetch(
    `${API_URL}/api/v1/admin/notification-campaigns`,
    {
      headers: await getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseError(response, 'Unable to load push campaigns.')
    );
  }

  const json = await response.json();
  return json?.data?.items ?? json?.items ?? [];
}

export async function createAdminPushCampaign(
  payload: CreateAdminPushCampaignPayload
): Promise<AdminPushCampaign> {
  const response = await fetch(
    `${API_URL}/api/v1/admin/notification-campaigns`,
    {
      method: 'POST',
      headers: await getAdminHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      json?.error || json?.message || 'Unable to create push campaign.'
    );
  }

  return json?.data;
}
