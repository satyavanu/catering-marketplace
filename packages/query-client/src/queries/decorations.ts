import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/axios';
import { DecorationData, PaginationParams } from '../types';

// Mock data for development/testing
export const MOCK_DECORATIONS: DecorationData[] = [
  {
    id: '1',
    name: 'Luxury Floral Arrangements',
    company: 'Bloom & Blossom',
    price: 800,
    rating: 4.9,
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&h=300&fit=crop',
    theme: 'Floral',
    details: 'Premium fresh flower arrangements and installations',
    type: 'Floral',
    country: 'USA',
  },
  {
    id: '2',
    name: 'Modern Lighting Design',
    company: 'Illuminate Events',
    price: 1200,
    rating: 4.8,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop',
    theme: 'Lighting',
    details: 'Professional LED lighting and special effects',
    type: 'Lighting',
    country: 'USA',
  },
  {
    id: '3',
    name: 'Elegant Table Settings',
    company: 'Luxe Table Design',
    price: 500,
    rating: 4.7,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop',
    theme: 'Table Decor',
    details: 'Custom tablecloths, runners, and centerpieces',
    type: 'Table Decor',
    country: 'USA',
  },
  {
    id: '4',
    name: 'Backdrop & Arch Rentals',
    company: 'Photo Perfect Backdrops',
    price: 400,
    rating: 4.8,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
    theme: 'Backdrops',
    details: 'Custom designed backdrops and wedding arches',
    type: 'Backdrops',
    country: 'Canada',
  },
  {
    id: '5',
    name: 'Balloon Installations',
    company: 'Airborne Celebrations',
    price: 600,
    rating: 4.6,
    reviews: 289,
    image: 'https://images.unsplash.com/photo-1514626585111-9f3f3ba7cb97?w=500&h=300&fit=crop',
    theme: 'Balloons',
    details: 'Creative balloon arches, garlands, and installations',
    type: 'Balloons',
    country: 'USA',
  },
  {
    id: '6',
    name: 'Draping & Fabric Design',
    company: 'Elegante Fabrics',
    price: 700,
    rating: 4.9,
    reviews: 356,
    image: 'https://images.unsplash.com/photo-1508003535872-a647146629cd?w=500&h=300&fit=crop',
    theme: 'Draping',
    details: 'Premium fabric draping and ceiling installations',
    type: 'Draping',
    country: 'USA',
  },
];

export const decorationsQueryKeys = {
  all: ['decorations'] as const,
  lists: () => [...decorationsQueryKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...decorationsQueryKeys.lists(), params] as const,
  details: () => [...decorationsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...decorationsQueryKeys.details(), id] as const,
  byType: (type: string, params?: PaginationParams) => [...decorationsQueryKeys.lists(), 'type', type, params] as const,
  byCountry: (country: string, params?: PaginationParams) => [...decorationsQueryKeys.lists(), 'country', country, params] as const,
  byTypeAndCountry: (type: string, country: string, params?: PaginationParams) => [...decorationsQueryKeys.lists(), 'type', type, 'country', country, params] as const,
};

const fetchDecorations = async (params: PaginationParams): Promise<DecorationData[]> => {
  try {
    const response = await apiClient.get('/decorations', { params });
    return response.data;
  } catch (error) {
    // Fallback to mock data in development
    console.warn('Using mock decoration data');
    return MOCK_DECORATIONS;
  }
};

const fetchDecorationById = async (id: string): Promise<DecorationData> => {
  try {
    const response = await apiClient.get(`/decorations/${id}`);
    return response.data;
  } catch (error) {
    // Fallback to mock data
    const decoration = MOCK_DECORATIONS.find(d => d.id === id);
    if (!decoration) throw new Error('Decoration not found');
    return decoration;
  }
};

const fetchDecorationsByType = async (type: string, params: PaginationParams): Promise<DecorationData[]> => {
  try {
    const response = await apiClient.get(`/decorations/by-type/${encodeURIComponent(type)}`, { params });
    return response.data;
  } catch (error) {
    // Fallback to mock data
    console.warn('Using mock decoration data filtered by type');
    return MOCK_DECORATIONS.filter(d => d.type.toLowerCase() === type.toLowerCase());
  }
};

const fetchDecorationsByCountry = async (country: string, params: PaginationParams): Promise<DecorationData[]> => {
  try {
    const response = await apiClient.get(`/decorations/by-country/${encodeURIComponent(country)}`, { params });
    return response.data;
  } catch (error) {
    // Fallback to mock data
    console.warn('Using mock decoration data filtered by country');
    return MOCK_DECORATIONS.filter(d => d.country.toLowerCase() === country.toLowerCase());
  }
};

const fetchDecorationsByTypeAndCountry = async (
  type: string,
  country: string,
  params: PaginationParams
): Promise<DecorationData[]> => {
  try {
    const response = await apiClient.get(
      `/decorations/by-type/${encodeURIComponent(type)}/by-country/${encodeURIComponent(country)}`,
      { params }
    );
    return response.data;
  } catch (error) {
    // Fallback to mock data
    console.warn('Using mock decoration data filtered by type and country');
    return MOCK_DECORATIONS.filter(
      d => d.type.toLowerCase() === type.toLowerCase() && d.country.toLowerCase() === country.toLowerCase()
    );
  }
};

export const useDecorations = (params: PaginationParams) => {
  return useQuery({
    queryKey: decorationsQueryKeys.list(params),
    queryFn: () => fetchDecorations(params),
  });
};

export const useDecorationById = (id: string) => {
  return useQuery({
    queryKey: decorationsQueryKeys.detail(id),
    queryFn: () => fetchDecorationById(id),
    enabled: !!id,
  });
};

export const useDecorationsByType = (type: string, params: PaginationParams) => {
  return useQuery({
    queryKey: decorationsQueryKeys.byType(type, params),
    queryFn: () => fetchDecorationsByType(type, params),
    enabled: !!type,
  });
};

export const useDecorationsByCountry = (country: string, params: PaginationParams) => {
  return useQuery({
    queryKey: decorationsQueryKeys.byCountry(country, params),
    queryFn: () => fetchDecorationsByCountry(country, params),
    enabled: !!country,
  });
};

export const useDecorationsByTypeAndCountry = (
  type: string,
  country: string,
  params: PaginationParams
) => {
  return useQuery({
    queryKey: decorationsQueryKeys.byTypeAndCountry(type, country, params),
    queryFn: () => fetchDecorationsByTypeAndCountry(type, country, params),
    enabled: !!type && !!country,
  });
};