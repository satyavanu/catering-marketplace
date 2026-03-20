import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/axios';
import { CatererData, PaginationParams } from '../types';

export const caterersQueryKeys = {
  all: ['caterers'] as const,
  lists: () => [...caterersQueryKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...caterersQueryKeys.lists(), params] as const,
  details: () => [...caterersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...caterersQueryKeys.details(), id] as const,
  byCuisine: (cuisine: string) => [...caterersQueryKeys.lists(), 'cuisine', cuisine] as const,
  byEvent: (eventType: string) => [...caterersQueryKeys.lists(), 'event', eventType] as const,
};

const fetchCaterers = async (params: PaginationParams): Promise<CatererData[]> => {
  const response = await apiClient.get('/caterers', { params });
  return response.data;
};

const fetchCatererById = async (id: string): Promise<CatererData> => {
  const response = await apiClient.get(`/caterers/${id}`);
  return response.data;
};

const fetchCaterersByCuisine = async (cuisine: string, params: PaginationParams): Promise<CatererData[]> => {
  const response = await apiClient.get(`/caterers/cuisine/${cuisine}`, { params });
  return response.data;
};

export const useCaterers = (params: PaginationParams) => {
  return useQuery({
    queryKey: caterersQueryKeys.list(params),
    queryFn: () => fetchCaterers(params),
  });
};

export const useCatererById = (id: string) => {
  return useQuery({
    queryKey: caterersQueryKeys.detail(id),
    queryFn: () => fetchCatererById(id),
    enabled: !!id,
  });
};

export const useCaterersByCuisine = (cuisine: string, params: PaginationParams) => {
  return useQuery({
    queryKey: caterersQueryKeys.byCuisine(cuisine),
    queryFn: () => fetchCaterersByCuisine(cuisine, params),
    enabled: !!cuisine,
  });
};