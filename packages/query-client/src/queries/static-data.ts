import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../config/axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Type Definitions
export interface MasterDataItem {
  id: string;
  key: string;
  label: string;
  [key: string]: any;
}

export interface BusinessType extends MasterDataItem {
  key: string;
  label: string;
}

export interface EventType extends MasterDataItem {
  key: string;
  label: string;
  category: 'personal' | 'wedding' | 'corporate' | 'cultural' | 'special';
}

export interface Cuisine extends MasterDataItem {
  key: string;
  label: string;
  type: 'cuisine' | 'specialization';
}

export interface DietType extends MasterDataItem {
  key: string;
  label: string;
}

export interface ServiceStyle extends MasterDataItem {
  key: string;
  label: string;
}

export interface CapacityRange extends MasterDataItem {
  key: string;
  label: string;
  min_guests: number;
  max_guests: number | null;
}

export interface OnboardingMasterData {
  business_types: BusinessType[];
  event_types: EventType[];
  cuisines: Cuisine[];
  diet_types: DietType[];
  service_styles: ServiceStyle[];
  capacity_ranges: CapacityRange[];
}

export interface OnboardingMasterDataResponse {
  data: OnboardingMasterData;
  success: boolean;
  message?: string;
}

// Query keys
export const staticDataQueryKeys = {
  all: ['static-data'] as const,
  onboardingMasterData: () => [...staticDataQueryKeys.all, 'onboarding-master-data'] as const,
  businessTypes: () => [...staticDataQueryKeys.all, 'business-types'] as const,
  eventTypes: () => [...staticDataQueryKeys.all, 'event-types'] as const,
  cuisines: () => [...staticDataQueryKeys.all, 'cuisines'] as const,
  dietTypes: () => [...staticDataQueryKeys.all, 'diet-types'] as const,
  serviceStyles: () => [...staticDataQueryKeys.all, 'service-styles'] as const,
  capacityRanges: () => [...staticDataQueryKeys.all, 'capacity-ranges'] as const,
};

// API Functions
const fetchOnboardingMasterData = async (): Promise<OnboardingMasterData> => {
  const response = await apiClient.get<OnboardingMasterDataResponse>(
     `${API_BASE_URL}/api/master-data/onboarding`,
  );




  if (!response.data?.data) {
    throw new Error('Invalid response format from onboarding master data API');
  }

  return response.data.data;
};

// Query Hooks
/**
 * Hook to fetch all onboarding master data
 * @param options - Additional query options
 * @returns Query result with onboarding master data
 */
export const useOnboardingMasterData = (
  options?: UseQueryOptions<OnboardingMasterData, Error>
) => {
  return useQuery<OnboardingMasterData, Error>({
    queryKey: staticDataQueryKeys.onboardingMasterData(),
    queryFn: fetchOnboardingMasterData,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch business types only
 * @param options - Additional query options
 * @returns Query result with business types array
 */
export const useBusinessTypes = (
  options?: UseQueryOptions<BusinessType[], Error>
) => {
  return useQuery<BusinessType[], Error>({
    queryKey: staticDataQueryKeys.businessTypes(),
    queryFn: async () => {
      const data = await fetchOnboardingMasterData();
      return data.business_types;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch event types only
 * @param options - Additional query options
 * @returns Query result with event types array
 */
export const useEventTypes = (
  options?: UseQueryOptions<EventType[], Error>
) => {
  return useQuery<EventType[], Error>({
    queryKey: staticDataQueryKeys.eventTypes(),
    queryFn: async () => {
      const data = await fetchOnboardingMasterData();
      return data.event_types;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch cuisines only
 * @param options - Additional query options
 * @returns Query result with cuisines array
 */
export const useCuisines = (
  options?: UseQueryOptions<Cuisine[], Error>
) => {
  return useQuery<Cuisine[], Error>({
    queryKey: staticDataQueryKeys.cuisines(),
    queryFn: async () => {
      const data = await fetchOnboardingMasterData();
      return data.cuisines;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch diet types only
 * @param options - Additional query options
 * @returns Query result with diet types array
 */
export const useDietTypes = (
  options?: UseQueryOptions<DietType[], Error>
) => {
  return useQuery<DietType[], Error>({
    queryKey: staticDataQueryKeys.dietTypes(),
    queryFn: async () => {
      const data = await fetchOnboardingMasterData();
      return data.diet_types;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch service styles only
 * @param options - Additional query options
 * @returns Query result with service styles array
 */
export const useServiceStyles = (
  options?: UseQueryOptions<ServiceStyle[], Error>
) => {
  return useQuery<ServiceStyle[], Error>({
    queryKey: staticDataQueryKeys.serviceStyles(),
    queryFn: async () => {
      const data = await fetchOnboardingMasterData();
      return data.service_styles;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch capacity ranges only
 * @param options - Additional query options
 * @returns Query result with capacity ranges array
 */
export const useCapacityRanges = (
  options?: UseQueryOptions<CapacityRange[], Error>
) => {
  return useQuery<CapacityRange[], Error>({
    queryKey: staticDataQueryKeys.capacityRanges(),
    queryFn: async () => {
      const data = await fetchOnboardingMasterData();
      return data.capacity_ranges;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};