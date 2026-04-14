import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from './menu-items';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Consent Types & Interfaces
 */
export interface ConsentData {
    agreeTerms: boolean;
    agreePrivacy: boolean;
    emailMarketing: boolean;
    smsMarketing: boolean;
    pushNotifications: boolean;
}

export interface ConsentRecord extends ConsentData {
    id: string;
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConsentResponse {
    data: ConsentRecord;
    message: string;
    timestamp: string;
}

export interface ConsentsListResponse {
    data: ConsentRecord[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
    message: string;
    timestamp: string;
}

export interface ConsentHistoryResponse {
    data: {
        id: string;
        userId: string;
        changes: Array<{
            field: keyof ConsentData;
            oldValue: boolean;
            newValue: boolean;
            changedAt: string;
        }>;
        createdAt: string;
        updatedAt: string;
    };
    message: string;
    timestamp: string;
}

/**
 * Consent Query Keys
 */
export const consentKeys = {
    all: ['consents'] as const,
    lists: () => [...consentKeys.all, 'list'] as const,
    list: (filters?: { userId?: string; page?: number; pageSize?: number }) =>
        [...consentKeys.lists(), { filters }] as const,
    detail: () => [...consentKeys.all, 'detail'] as const,
    current: () => [...consentKeys.all, 'current'] as const,
    history: () => [...consentKeys.all, 'history'] as const,
};

/**
 * Consent API Functions
 */
export const consentApi = {
    /**
     * Get current user's consent record
     */
    getCurrentConsent: async (): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders();

        console.log('📋 Fetching current consent...');

        const res = await fetch(`${API_BASE_URL}/consents/current`, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Failed to fetch current consent:', errorData);
            throw new Error(errorData.message || 'Failed to fetch current consent');
        }

        const data = await res.json();
        console.log('✅ Current consent fetched:', data);
        return data.data;
    },

    /**
     * Get consent record by ID
     */
    getConsentById: async (id: string): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders();

        const res = await fetch(`${API_BASE_URL}/consents/${id}`, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch consent');
        }

        return res.json();
    },

    /**
     * Get all user consents (paginated)
     */
    listConsents: async (filters?: {
        page?: number;
        pageSize?: number;
    }): Promise<ConsentsListResponse> => {
        const headers = await getAuthHeaders();

        const params = new URLSearchParams();
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));

        const res = await fetch(
            `${API_BASE_URL}/consents${params.toString() ? `?${params}` : ''}`,
            {
                method: 'GET',
                headers,
            }
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch consents');
        }

        return res.json();
    },

    /**
     * Save or update consent (used in onboarding)
     */
    saveConsent: async (data: ConsentData): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders(true);

        console.log('📤 Saving consent data...', data);
        console.log('📋 Headers:', {
            hasAuthorization: (headers as Headers).has('Authorization'),
            hasContentType: (headers as Headers).has('Content-Type'),
        });

        const res = await fetch(`${API_BASE_URL}/api/consents/save`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        console.log('📥 Response status:', res.status);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Failed to save consent:', errorData);
            throw new Error(errorData.message || 'Failed to save consent');
        }

        const result = await res.json();
        console.log('✅ Consent saved successfully:', result);
        return result.data;
    },

    /**
     * Complete onboarding with consent
     */
    completeOnboarding: async (data: ConsentData): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders(true);

        console.log('🔄 Completing onboarding with consent...');

        const res = await fetch(`${API_BASE_URL}/api/consents/save`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Failed to complete onboarding:', errorData);
            throw new Error(errorData.message || 'Failed to complete onboarding');
        }

        const result = await res.json();
        console.log('✅ Onboarding completed:', result);
        return result.data;
    },

    /**
     * Update communication preferences
     */
    updateCommunicationPreferences: async (data: {
        emailMarketing: boolean;
        smsMarketing: boolean;
        pushNotifications: boolean;
    }): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders(true);

        console.log('📬 Updating communication preferences...');

        const res = await fetch(`${API_BASE_URL}/consents/communication`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Failed to update communication preferences:', errorData);
            throw new Error(
                errorData.message || 'Failed to update communication preferences'
            );
        }

        const result = await res.json();
        console.log('✅ Communication preferences updated:', result);
        return result.data;
    },

    /**
     * Accept terms and conditions
     */
    acceptTermsAndConditions: async (data: {
        agreeTerms: boolean;
        agreePrivacy: boolean;
    }): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders(true);

        console.log('⚖️ Accepting terms and conditions...');

        const res = await fetch(`${API_BASE_URL}/consents/accept`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Failed to accept terms:', errorData);
            throw new Error(errorData.message || 'Failed to accept terms');
        }

        const result = await res.json();
        console.log('✅ Terms accepted:', result);
        return result.data;
    },

    /**
     * Revoke specific consent
     */
    revokeConsent: async (consentType: keyof ConsentData): Promise<ConsentRecord> => {
        const headers = await getAuthHeaders(true);

        console.log(`🚫 Revoking consent for: ${consentType}`);

        const res = await fetch(`${API_BASE_URL}/consents/revoke`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ type: consentType }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to revoke consent');
        }

        return res.json();
    },

    /**
     * Get consent history
     */
    getConsentHistory: async (): Promise<ConsentHistoryResponse> => {
        const headers = await getAuthHeaders();

        console.log('📜 Fetching consent history...');

        const res = await fetch(`${API_BASE_URL}/consents/history`, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch consent history');
        }

        return res.json();
    },

    /**
     * Export consent data
     */
    exportConsentData: async (format: 'json' | 'csv' = 'json'): Promise<Blob> => {
        const headers = await getAuthHeaders();

        console.log(`📥 Exporting consent data as ${format}...`);

        const res = await fetch(
            `${API_BASE_URL}/consents/export?format=${format}`,
            {
                method: 'GET',
                headers,
            }
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to export consent data');
        }

        return res.blob();
    },

    /**
     * Delete consent record (GDPR - right to be forgotten)
     */
    deleteConsentRecord: async (id: string): Promise<{ message: string }> => {
        const headers = await getAuthHeaders();

        console.log(`🗑️ Deleting consent record: ${id}`);

        const res = await fetch(`${API_BASE_URL}/consents/${id}`, {
            method: 'DELETE',
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete consent record');
        }

        return res.json();
    },
};

/**
 * React Query Hooks
 */

/**
 * Hook: Get current user's consent
 */
export const useCurrentConsent = () => {
    return useQuery({
        queryKey: consentKeys.current(),
        queryFn: () => consentApi.getCurrentConsent(),
        staleTime: 1000 * 60 * 30, // 30 minutes
        retry: 2,
    });
};

/**
 * Hook: Get consent by ID
 */
export const useConsentById = (id: string) => {
    return useQuery({
        queryKey: consentKeys.detail(),
        queryFn: () => consentApi.getConsentById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 30,
    });
};

/**
 * Hook: List all consents with pagination
 */
export const useListConsents = (filters?: {
    page?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: consentKeys.list(filters),
        queryFn: () => consentApi.listConsents(filters),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook: Save consent (onboarding)
 */
export const useSaveConsent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConsentData) => consentApi.saveConsent(data),
        onSuccess: (response) => {
            queryClient.setQueryData(consentKeys.current(), response);
            queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
            console.log('✨ Consent saved and cache updated');
        },
        onError: (error) => {
            console.error('❌ Error saving consent:', error);
        },
    });
};

/**
 * Hook: Complete onboarding
 */
export const useCompleteOnboarding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConsentData) => consentApi.completeOnboarding(data),
        onSuccess: (response) => {
            queryClient.setQueryData(consentKeys.current(), response);
            queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
            console.log('✨ Onboarding completed');
        },
        onError: (error) => {
            console.error('❌ Error completing onboarding:', error);
        },
    });
};

/**
 * Hook: Update communication preferences
 */
export const useUpdateCommunicationPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            emailMarketing: boolean;
            smsMarketing: boolean;
            pushNotifications: boolean;
        }) => consentApi.updateCommunicationPreferences(data),
        onSuccess: (response) => {
            queryClient.setQueryData(consentKeys.current(), response);
            queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
            console.log('✨ Communication preferences updated');
        },
        onError: (error) => {
            console.error('❌ Error updating communication preferences:', error);
        },
    });
};

/**
 * Hook: Accept terms and conditions
 */
export const useAcceptTermsAndConditions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            agreeTerms: boolean;
            agreePrivacy: boolean;
        }) => consentApi.acceptTermsAndConditions(data),
        onSuccess: (response) => {
            queryClient.setQueryData(consentKeys.current(), response);
            queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
            console.log('✨ Terms and conditions accepted');
        },
        onError: (error) => {
            console.error('❌ Error accepting terms:', error);
        },
    });
};

/**
 * Hook: Revoke consent
 */
export const useRevokeConsent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (consentType: keyof ConsentData) =>
            consentApi.revokeConsent(consentType),
        onSuccess: (response) => {
            queryClient.setQueryData(consentKeys.current(), response);
            queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
            console.log('✨ Consent revoked');
        },
        onError: (error) => {
            console.error('❌ Error revoking consent:', error);
        },
    });
};

/**
 * Hook: Get consent history
 */
export const useConsentHistory = () => {
    return useQuery({
        queryKey: consentKeys.history(),
        queryFn: () => consentApi.getConsentHistory(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

/**
 * Hook: Export consent data
 */
export const useExportConsentData = () => {
    return useMutation({
        mutationFn: (format?: 'json' | 'csv') =>
            consentApi.exportConsentData(format),
        onSuccess: (blob, format) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `consent-data-${Date.now()}.${format || 'json'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('✨ Consent data exported');
        },
        onError: (error) => {
            console.error('❌ Error exporting consent data:', error);
        },
    });
};

/**
 * Hook: Delete consent record
 */
export const useDeleteConsentRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => consentApi.deleteConsentRecord(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: consentKeys.current() });
            console.log('✨ Consent record deleted');
        },
        onError: (error) => {
            console.error('❌ Error deleting consent record:', error);
        },
    });
};

/**
 * Helper Functions
 */

/**
 * Check if all mandatory consents are accepted
 */
export const isMandatoryConsentComplete = (consent: ConsentRecord): boolean => {
    return consent.agreeTerms && consent.agreePrivacy;
};

/**
 * Get consent summary
 */
export const getConsentSummary = (consent: ConsentRecord) => {
    return {
        mandatoryAccepted:
            consent.agreeTerms && consent.agreePrivacy,
        marketingOptIn:
            consent.emailMarketing ||
            consent.smsMarketing ||
            consent.pushNotifications,
        emailOptIn: consent.emailMarketing,
        smsOptIn: consent.smsMarketing,
        pushOptIn: consent.pushNotifications,
    };
};

/**
 * Format consent record for display
 */
export const formatConsentRecord = (consent: ConsentRecord) => {
    return {
        id: consent.id,
        userId: consent.userId,
        terms: {
            accepted: consent.agreeTerms,
            timestamp: consent.updatedAt,
        },
        privacy: {
            accepted: consent.agreePrivacy,
            timestamp: consent.updatedAt,
        },
        marketing: {
            email: consent.emailMarketing,
            sms: consent.smsMarketing,
            push: consent.pushNotifications,
            timestamp: consent.updatedAt,
        },
        createdAt: consent.createdAt,
        updatedAt: consent.updatedAt,
    };
};