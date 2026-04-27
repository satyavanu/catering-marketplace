import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type OnboardingStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

export type OnboardingStep =
  | 'basic_profile'
  | 'business_profile'
  | 'kitchen_service_details'
  | 'service_areas'
  | 'documents_kyc'
  | 'partner_agreement'
  | 'review_submit'
  | 'completed';

export interface OnboardingSession {
  sessionId: string;
  userId: string;
  status: OnboardingStatus;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  onboardingData: Record<string, unknown>;
  kycStatus: Record<string, unknown>;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveOnboardingStepPayload {
  sessionId: string;
  step: OnboardingStep;
  stepData: Record<string, unknown>;
  nextStep: OnboardingStep;
}

export interface SubmitOnboardingPayload {
  sessionId: string;
}

export const onboardingKeys = {
  all: ['onboarding'] as const,
  session: () => [...onboardingKeys.all, 'session'] as const,
  sessionDetail: (sessionId: string) =>
    [...onboardingKeys.session(), sessionId] as const,
};

export async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  headers.set('Content-Type', 'application/json');

  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  return headers;
}

async function parseApiError(res: Response, fallback: string): Promise<never> {
  let message = fallback;

  try {
    const errorData = await res.json();
    message = errorData.error || errorData.message || fallback;
  } catch {
    // ignore json parse error
  }

  if (res.status === 401) {
    throw new Error('Unauthorized - Please login again');
  }

  throw new Error(message);
}

export const onboardingApi = {
  startOrResumeSession: async (): Promise<OnboardingSession> => {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE_URL}/api/v1/partner/onboarding/session`, {
      method: 'POST',
      headers,
    });

    if (!res.ok) {
      return parseApiError(res, `Failed to start onboarding session: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  },

  getCurrentSession: async (): Promise<OnboardingSession> => {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE_URL}/api/v1/partner/onboarding/session`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      return parseApiError(res, `Failed to fetch onboarding session: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  },

  saveStep: async ({
    sessionId,
    step,
    stepData,
    nextStep,
  }: SaveOnboardingStepPayload): Promise<OnboardingSession> => {
    const headers = await getAuthHeaders();

    const res = await fetch(
      `${API_BASE_URL}/api/v1/partner/onboarding/session/${sessionId}/step`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          step,
          stepData,
          nextStep,
        }),
      }
    );

    if (!res.ok) {
      return parseApiError(res, `Failed to save onboarding step: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  },

  submitSession: async ({
    sessionId,
  }: SubmitOnboardingPayload): Promise<OnboardingSession> => {
    const headers = await getAuthHeaders();

    const res = await fetch(
      `${API_BASE_URL}/api/v1/partner/onboarding/session/${sessionId}/submit`,
      {
        method: 'POST',
        headers,
      }
    );

    if (!res.ok) {
      return parseApiError(res, `Failed to submit onboarding: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  },
};

export const useStartOrResumeOnboardingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.startOrResumeSession,
    onSuccess: (session) => {
      queryClient.setQueryData(onboardingKeys.session(), session);
      queryClient.setQueryData(
        onboardingKeys.sessionDetail(session.sessionId),
        session
      );
    },
    onError: (error: Error) => {
      console.error('Start onboarding session error:', error.message);
    },
  });
};

export const useCurrentOnboardingSession = () => {
  return useQuery({
    queryKey: onboardingKeys.session(),
    queryFn: onboardingApi.getCurrentSession,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

export const useSaveOnboardingStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.saveStep,
    onSuccess: (session, variables) => {
      queryClient.setQueryData(onboardingKeys.session(), session);
      queryClient.setQueryData(
        onboardingKeys.sessionDetail(variables.sessionId),
        session
      );
    },
    onError: (error: Error) => {
      console.error('Save onboarding step error:', error.message);
    },
  });
};

export const useSubmitOnboardingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.submitSession,
    onSuccess: (session) => {
      queryClient.setQueryData(onboardingKeys.session(), session);
      queryClient.setQueryData(
        onboardingKeys.sessionDetail(session.sessionId),
        session
      );
      queryClient.invalidateQueries({ queryKey: onboardingKeys.session() });
    },
    onError: (error: Error) => {
      console.error('Submit onboarding error:', error.message);
    },
  });
};