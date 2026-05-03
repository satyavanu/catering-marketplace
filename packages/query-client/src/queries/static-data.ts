import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../config/axios';
import type { ExperienceType, ServiceType } from './service-catalog';

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

// Location-related Types
export interface ServiceArea {
  id: string;
  name: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  serviceAreas: ServiceArea[];
}

export interface State {
  id: string;
  name: string;
  code: string;
  cities: City[];
}

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
  currencyCode: string;
  currencySymbol: string;
  languageCode: string;
  locale: string;
  states: State[];
}

export interface OnboardingLocations {
  countries: Country[];
}

export interface OnboardingLocationsResponse {
  data: OnboardingLocations;
  success: boolean;
  message?: string;
}

export interface OnboardingMasterData {
  business_types: BusinessType[];
  event_types: EventType[];
  cuisines: Cuisine[];
  diet_types: DietType[];
  service_styles: ServiceStyle[];
  capacity_ranges: CapacityRange[];
  cities: Record<string, string>[];
}

export interface OnboardingMasterDataResponse {
  data: OnboardingMasterData;
  success: boolean;
  message?: string;
}

export interface ServiceCatalogStaticData {
  service_types: ServiceType[];
  experience_types: ExperienceType[];
}

export interface ServiceCatalogStaticDataResponse {
  data: ServiceCatalogStaticData;
  success?: boolean;
  message?: string;
}

// Query keys
export const staticDataQueryKeys = {
  all: ['static-data'] as const,
  onboardingMasterData: () =>
    [...staticDataQueryKeys.all, 'onboarding-master-data'] as const,
  businessTypes: () => [...staticDataQueryKeys.all, 'business-types'] as const,
  eventTypes: () => [...staticDataQueryKeys.all, 'event-types'] as const,
  cuisines: () => [...staticDataQueryKeys.all, 'cuisines'] as const,
  dietTypes: () => [...staticDataQueryKeys.all, 'diet-types'] as const,
  serviceStyles: () => [...staticDataQueryKeys.all, 'service-styles'] as const,
  capacityRanges: () =>
    [...staticDataQueryKeys.all, 'capacity-ranges'] as const,
  serviceCatalog: () =>
    [...staticDataQueryKeys.all, 'service-catalog'] as const,
  serviceCatalogServiceTypes: () =>
    [...staticDataQueryKeys.serviceCatalog(), 'service-types'] as const,
  serviceCatalogExperienceTypes: (serviceKey?: string) =>
    serviceKey
      ? ([
          ...staticDataQueryKeys.serviceCatalog(),
          'experience-types',
          serviceKey,
        ] as const)
      : ([
          ...staticDataQueryKeys.serviceCatalog(),
          'experience-types',
        ] as const),
  onboardingLocations: () =>
    [...staticDataQueryKeys.all, 'onboarding-locations'] as const,
  countries: () => [...staticDataQueryKeys.all, 'countries'] as const,
  states: (countryCode?: string) =>
    countryCode
      ? ([...staticDataQueryKeys.all, 'states', countryCode] as const)
      : ([...staticDataQueryKeys.all, 'states'] as const),
  cities: (countryCode?: string, stateCode?: string) =>
    countryCode && stateCode
      ? ([
          ...staticDataQueryKeys.all,
          'cities',
          countryCode,
          stateCode,
        ] as const)
      : ([...staticDataQueryKeys.all, 'cities'] as const),
  serviceAreas: (cityId?: string) =>
    cityId
      ? ([...staticDataQueryKeys.all, 'service-areas', cityId] as const)
      : ([...staticDataQueryKeys.all, 'service-areas'] as const),
};

// API Functions
const fetchOnboardingMasterData = async (): Promise<OnboardingMasterData> => {
  const response = await apiClient.get<OnboardingMasterDataResponse>(
    `${API_BASE_URL}/api/master-data/onboarding`
  );

  if (!response.data?.data) {
    throw new Error('Invalid response format from onboarding master data API');
  }

  return response.data.data;
};

export const fetchServiceCatalogStaticData =
  async (): Promise<ServiceCatalogStaticData> => {
    const response = await apiClient.get<ServiceCatalogStaticDataResponse>(
      `${API_BASE_URL}/api/static?meta=service_catalog`
    );

    if (!response.data?.data) {
      throw new Error(
        'Invalid response format from service catalog static data API'
      );
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

export const useServiceCatalogStaticData = (
  options?: UseQueryOptions<ServiceCatalogStaticData, Error>
) => {
  return useQuery<ServiceCatalogStaticData, Error>({
    queryKey: staticDataQueryKeys.serviceCatalog(),
    queryFn: fetchServiceCatalogStaticData,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

export const useStaticServiceTypes = (
  options?: UseQueryOptions<ServiceType[], Error>
) => {
  return useQuery<ServiceType[], Error>({
    queryKey: staticDataQueryKeys.serviceCatalogServiceTypes(),
    queryFn: async () => {
      const data = await fetchServiceCatalogStaticData();
      return data.service_types;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

export const useStaticExperienceTypes = (
  serviceKey?: string,
  options?: UseQueryOptions<ExperienceType[], Error>
) => {
  return useQuery<ExperienceType[], Error>({
    queryKey: staticDataQueryKeys.serviceCatalogExperienceTypes(serviceKey),
    queryFn: async () => {
      const data = await fetchServiceCatalogStaticData();
      return serviceKey
        ? data.experience_types.filter(
            (item) => item.service_key === serviceKey
          )
        : data.experience_types;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
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
export const useCuisines = (options?: UseQueryOptions<Cuisine[], Error>) => {
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
export const useDietTypes = (options?: UseQueryOptions<DietType[], Error>) => {
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

/**
 * Fetch onboarding locations with countries, states, cities, and service areas
 * @returns Promise with onboarding locations data
 */
const fetchOnboardingLocations = async (): Promise<OnboardingLocations> => {
  const response = await apiClient.get<OnboardingLocationsResponse>(
    `${API_BASE_URL}/api/static?meta=onboarding_locations`
  );

  if (!response.data?.data) {
    throw new Error('Invalid response format from onboarding locations API');
  }

  return response.data.data;
};

// Query Hooks - Locations
/**
 * Hook to fetch all onboarding locations (countries, states, cities, service areas)
 * @param options - Additional query options
 * @returns Query result with onboarding locations
 */
export const useOnboardingLocations = (
  options?: UseQueryOptions<OnboardingLocations, Error>
) => {
  return useQuery<OnboardingLocations, Error>({
    queryKey: staticDataQueryKeys.onboardingLocations(),
    queryFn: fetchOnboardingLocations,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch all countries
 * @param options - Additional query options
 * @returns Query result with countries array
 */
export const useCountries = (options?: UseQueryOptions<Country[], Error>) => {
  return useQuery<Country[], Error>({
    queryKey: staticDataQueryKeys.countries(),
    queryFn: async () => {
      const data = await fetchOnboardingLocations();
      return data.countries;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    ...options,
  });
};

/**
 * Hook to fetch states for a specific country
 * @param countryCode - ISO country code (e.g., 'IN')
 * @param options - Additional query options
 * @returns Query result with states array
 */
export const useStates = (
  countryCode: string,
  options?: UseQueryOptions<State[], Error>
) => {
  return useQuery<State[], Error>({
    queryKey: staticDataQueryKeys.states(countryCode),
    queryFn: async () => {
      const data = await fetchOnboardingLocations();
      const country = data.countries.find((c) => c.code === countryCode);

      if (!country) {
        throw new Error(`Country with code ${countryCode} not found`);
      }

      return country.states;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!countryCode,
    ...options,
  });
};

/**
 * Hook to fetch cities for a specific country and state
 * @param countryCode - ISO country code (e.g., 'IN')
 * @param stateCode - State code (e.g., 'TS')
 * @param options - Additional query options
 * @returns Query result with cities array
 */
export const useCities = (
  countryCode: string,
  stateCode: string,
  options?: UseQueryOptions<City[], Error>
) => {
  return useQuery<City[], Error>({
    queryKey: staticDataQueryKeys.cities(countryCode, stateCode),
    queryFn: async () => {
      const data = await fetchOnboardingLocations();
      const country = data.countries.find((c) => c.code === countryCode);

      if (!country) {
        throw new Error(`Country with code ${countryCode} not found`);
      }

      const state = country.states.find((s) => s.code === stateCode);

      if (!state) {
        throw new Error(
          `State with code ${stateCode} not found in ${countryCode}`
        );
      }

      return state.cities;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!countryCode && !!stateCode,
    ...options,
  });
};

/**
 * Hook to fetch service areas for a specific city
 * @param cityId - City ID
 * @param options - Additional query options
 * @returns Query result with service areas array
 */

export const useServiceAreas = (
  cityId: string,
  options?: UseQueryOptions<ServiceArea[], Error>
) => {
  return useQuery<ServiceArea[], Error>({
    queryKey: staticDataQueryKeys.serviceAreas(cityId),
    queryFn: async () => {
      const data = await fetchOnboardingLocations();

      // Flatten all cities from all countries and states
      const allCities: City[] = [];
      data.countries.forEach((country) => {
        country.states.forEach((state) => {
          allCities.push(...state.cities);
        });
      });

      const city = allCities.find((c) => c.id === cityId);

      if (!city) {
        throw new Error(`City with ID ${cityId} not found`);
      }

      return city.serviceAreas;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!cityId,
    ...options,
  });
};

/**
 * Hook to fetch a specific city by ID with all its service areas
 * @param cityId - City ID
 * @param options - Additional query options
 * @returns Query result with city data
 */
export const useCity = (
  cityId: string,
  options?: UseQueryOptions<City, Error>
) => {
  return useQuery<City, Error>({
    queryKey: [...staticDataQueryKeys.cities(), cityId],
    queryFn: async () => {
      const data = await fetchOnboardingLocations();

      // Flatten all cities from all countries and states
      for (const country of data.countries) {
        for (const state of country.states) {
          const city = state.cities.find((c) => c.id === cityId);
          if (city) {
            return city;
          }
        }
      }

      throw new Error(`City with ID ${cityId} not found`);
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!cityId,
    ...options,
  });
};

/**
 * Hook to search for cities by name across all countries and states
 * @param searchQuery - Search query (city name)
 * @param options - Additional query options
 * @returns Query result with matching cities array
 */
export const useSearchCities = (
  searchQuery: string,
  options?: UseQueryOptions<City[], Error>
) => {
  return useQuery<City[], Error>({
    queryKey: [...staticDataQueryKeys.cities(), 'search', searchQuery],
    queryFn: async () => {
      const data = await fetchOnboardingLocations();
      const query = searchQuery.toLowerCase();
      const results: City[] = [];

      for (const country of data.countries) {
        for (const state of country.states) {
          for (const city of state.cities) {
            if (
              city.name.toLowerCase().includes(query) ||
              state.name.toLowerCase().includes(query)
            ) {
              results.push(city);
            }
          }
        }
      }

      return results;
    },
    staleTime: 60 * 60 * 1000,

    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!searchQuery && searchQuery.length > 1,
    ...options,
  });
};

/**
 * Hook to fetch all cities for a specific country (across all states)
 * @param countryCode - ISO country code (e.g., 'IN')
 * @param options - Additional query options
 * @returns Query result with cities array from all states
 */
export const useCitiesByCountry = (
  countryCode: string,
  options?: UseQueryOptions<City[], Error>
) => {
  return useQuery<City[], Error>({
    queryKey: [...staticDataQueryKeys.cities(countryCode)],
    queryFn: async () => {
      const data = await fetchOnboardingLocations();
      const country = data.countries.find((c) => c.code === countryCode);

      if (!country) {
        throw new Error(`Country with code ${countryCode} not found`);
      }
      const allCities: City[] = [];
      country.states.forEach((state) => {
        allCities.push(...state.cities);
      });

      return allCities;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!countryCode,
    ...options,
  });
};
