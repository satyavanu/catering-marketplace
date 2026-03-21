import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/axios';

export interface FilterOption {
  value: string;
  label: string;
}

export interface CateringFilters {
  locations: FilterOption[];
  priceRanges: FilterOption[];
  guestCounts: FilterOption[];
  cuisineTypes: FilterOption[];
  occasions: FilterOption[];
}

// Mock data for filters
export const mockFilterData: CateringFilters = {
  locations: [
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'mumbai', label: 'Mumbai, India' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'london', label: 'London, UK' },
    { value: 'austin', label: 'Austin, TX' },
  ],
  priceRanges: [
    { value: 'under-1000', label: 'Under ₹1,000' },
    { value: '1000-1500', label: '₹1,000 - ₹1,500' },
    { value: '1500-2000', label: '₹1,500 - ₹2,000' },
    { value: '2000-3000', label: '₹2,000 - ₹3,000' },
    { value: 'over-3000', label: '₹3,000+' },
  ],
  guestCounts: [
    { value: '20-50', label: '20 - 50 guests' },
    { value: '50-100', label: '50 - 100 guests' },
    { value: '100-200', label: '100 - 200 guests' },
    { value: '200-500', label: '200 - 500 guests' },
    { value: '500+', label: '500+ guests' },
  ],
  cuisineTypes: [
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Asian Fusion', label: 'Asian Fusion' },
    { value: 'Continental', label: 'Continental' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'BBQ', label: 'BBQ & Grill' },
  ],
  occasions: [
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Corporate', label: 'Corporate Event' },
    { value: 'Birthday', label: 'Birthday Party' },
    { value: 'Anniversary', label: 'Anniversary' },
    { value: 'Private', label: 'Private Dinner' },
  ],
};

export const cateringFilterKeys = {
  all: ['cateringFilters'] as const,
  list: () => [...cateringFilterKeys.all, 'list'] as const,
};

export const useCateringFilters = () => {
  return useQuery({
    queryKey: cateringFilterKeys.list(),
    queryFn: async (): Promise<CateringFilters> => {
      try {
        const response = await apiClient.get('/catering/filters');
        return response.data;
      } catch (error) {
        console.warn('Using mock catering filters');
        return mockFilterData;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};