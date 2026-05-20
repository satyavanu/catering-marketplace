import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface AdminCampaignLead {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  city: string;
  partnerType: string;
  status: string;
  source: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UpdateAdminCampaignLeadPayload {
  status?: string;
  partnerType?: string;
  city?: string;
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

export async function fetchAdminCampaignLeads(): Promise<AdminCampaignLead[]> {
  const response = await fetch(`${API_URL}/api/admin/campaign-leads`, {
    headers: await getAdminHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await parseError(response, 'Unable to load campaign leads.')
    );
  }

  const json = await response.json();
  return json?.data?.items ?? json?.items ?? [];
}

export async function updateAdminCampaignLead(
  id: string,
  payload: UpdateAdminCampaignLeadPayload
) {
  const response = await fetch(
    `${API_URL}/api/admin/campaign-leads/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: await getAdminHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseError(response, 'Unable to update campaign lead.')
    );
  }

  return response.json();
}
