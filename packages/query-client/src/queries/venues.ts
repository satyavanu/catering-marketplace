import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/axios';
import { VenueData, PaginationParams } from '../types';

export const venuesQueryKeys = {
  all: ['venues'] as const,
  lists: () => [...venuesQueryKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...venuesQueryKeys.lists(), params] as const,
  details: () => [...venuesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...venuesQueryKeys.details(), id] as const,
  byType: (type: string) => [...venuesQueryKeys.lists(), 'type', type] as const,
};

const fetchVenues = async (params: PaginationParams): Promise<VenueData[]> => {
  const response = await apiClient.get('/venues', { params });
  return response.data;
};

const fetchVenueById = async (id: string): Promise<VenueData> => {
  const response = await apiClient.get(`/venues/${id}`);
  return response.data;
};

export const useVenues = (params: PaginationParams) => {
  return useQuery({
    queryKey: venuesQueryKeys.list(params),
    queryFn: () => fetchVenues(params),
  });
};

export const useVenueById = (id: string) => {
  return useQuery({
    queryKey: venuesQueryKeys.detail(id),
    queryFn: () => fetchVenueById(id),
    enabled: !!id,
  });
};