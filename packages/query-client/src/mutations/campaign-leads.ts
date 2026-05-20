import { useMutation } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface CampaignLeadPayload {
  campaign: string;
  name: string;
  phone: string;
  city?: string;
  source?: string;
  medium?: string;
  term?: string;
  content?: string;
  fcm_token?: string;
  notification_permission?: NotificationPermission | 'unsupported';
  page_url?: string;
  user_agent?: string;
}

export interface CampaignLeadResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

async function parseApiError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function createCampaignLead(
  payload: CampaignLeadPayload
): Promise<CampaignLeadResponse> {
  const response = await fetch(`${API_URL}/api/v1/campaign-leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, 'Could not save campaign lead')
    );
  }

  return response.json();
}

export function useCreateCampaignLead() {
  return useMutation({
    mutationFn: createCampaignLead,
  });
}
