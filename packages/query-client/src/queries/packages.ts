import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface EventPackage {
  id: number;
  name: string;
  description: string;
  pricing: 'per_person' | 'fixed';
  price: number;
  currency: string;
  servings: string;
  items: string[];
  addOns: { id: number; name: string; price: number }[];
  status: 'active' | 'inactive';
  createdDate: string;
  orders: number;
  minGuests?: number;
  maxGuests?: number;
  duration?: string;
  image?: string;
}

// Mock Data
const MOCK_PACKAGES: EventPackage[] = [
  {
    id: 1,
    name: 'Classic Vegetarian',
    description: 'A wonderful selection of vegetarian dishes',
    pricing: 'per_person',
    price: 350,
    currency: '₹',
    servings: '20-50',
    items: ['Paneer Tikka', 'Dal Makhani', 'Naan', 'Rice', 'Salad', 'Dessert'],
    addOns: [
      { id: 1, name: 'Extra Naan', price: 50 },
      { id: 2, name: 'Raita', price: 30 },
      { id: 3, name: 'Pickle & Papad', price: 25 },
    ],
    status: 'active',
    createdDate: 'March 15, 2025',
    orders: 12,
    minGuests: 20,
    maxGuests: 200,
  },
  {
    id: 2,
    name: 'Premium Non-Veg',
    description: 'Deluxe selection with premium meat items',
    pricing: 'per_person',
    price: 450,
    currency: '₹',
    servings: '30-100',
    items: ['Butter Chicken', 'Tandoori Chicken', 'Biryani', 'Naan', 'Dessert'],
    addOns: [
      { id: 1, name: 'Extra Chicken', price: 80 },
      { id: 2, name: 'Seafood', price: 120 },
    ],
    status: 'active',
    createdDate: 'March 10, 2025',
    orders: 8,
    minGuests: 30,
    maxGuests: 300,
  },
  {
    id: 3,
    name: 'Budget Combo',
    description: 'Affordable party package for everyone',
    pricing: 'per_person',
    price: 250,
    currency: '₹',
    servings: '20-80',
    items: ['Tandoori Naan', 'Rice', 'Curry', 'Salad'],
    addOns: [
      { id: 1, name: 'Extra Curry', price: 40 },
    ],
    status: 'active',
    createdDate: 'March 5, 2025',
    orders: 5,
    minGuests: 20,
    maxGuests: 150,
  },
];

// In-memory store for mock data
let mockPackages: EventPackage[] = [...MOCK_PACKAGES];
let packageIdCounter = Math.max(...mockPackages.map(pkg => pkg.id), 0) + 1;

// Query Keys
export const packageKeys = {
  all: ['packages'] as const,
  lists: () => [...packageKeys.all, 'list'] as const,
  list: (filters?: { status?: 'active' | 'inactive' }) =>
    [...packageKeys.lists(), { filters }] as const,
  details: () => [...packageKeys.all, 'detail'] as const,
  detail: (id: number) => [...packageKeys.details(), id] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to false when real API is ready

export const packageApi = {
  // GET all packages
  getPackages: async (filters?: {
    status?: 'active' | 'inactive';
  }): Promise<EventPackage[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let packages = [...mockPackages];
      
      if (filters?.status) {
        packages = packages.filter(pkg => pkg.status === filters.status);
      }
      
      return packages;
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    const res = await fetch(
      `${API_BASE_URL}/packages${params.toString() ? `?${params}` : ''}`
    );
    if (!res.ok) throw new Error('Failed to fetch packages');
    return res.json();
  },

  // GET single package
  getPackage: async (id: number): Promise<EventPackage> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const pkg = mockPackages.find(p => p.id === id);
      if (!pkg) throw new Error('Package not found');
      return pkg;
    }

    const res = await fetch(`${API_BASE_URL}/packages/${id}`);
    if (!res.ok) throw new Error('Failed to fetch package');
    return res.json();
  },

  // CREATE package
  createPackage: async (data: Omit<EventPackage, 'id'>): Promise<EventPackage> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPackage: EventPackage = {
        id: packageIdCounter++,
        ...data,
      };
      
      mockPackages.push(newPackage);
      return newPackage;
    }

    const res = await fetch(`${API_BASE_URL}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create package');
    return res.json();
  },

  // UPDATE package
  updatePackage: async (id: number, data: Partial<EventPackage>): Promise<EventPackage> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockPackages.findIndex(pkg => pkg.id === id);
      if (index === -1) throw new Error('Package not found');
      
      mockPackages[index] = {
        ...mockPackages[index],
        ...data,
        id: mockPackages[index].id,
      };
      
      return mockPackages[index];
    }

    const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update package');
    return res.json();
  },

  // DELETE package
  deletePackage: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockPackages.findIndex(pkg => pkg.id === id);
      if (index === -1) throw new Error('Package not found');
      
      mockPackages.splice(index, 1);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete package');
  },

  // BULK DELETE packages
  bulkDeletePackages: async (ids: number[]): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      mockPackages = mockPackages.filter(pkg => !ids.includes(pkg.id));
      return;
    }

    const res = await fetch(`${API_BASE_URL}/packages/bulk-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete packages');
  },
};

// Hooks
export const usePackages = (filters?: {
  status?: 'active' | 'inactive';
}) => {
  return useQuery({
    queryKey: packageKeys.list(filters),
    queryFn: () => packageApi.getPackages(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePackage = (id: number) => {
  return useQuery({
    queryKey: packageKeys.detail(id),
    queryFn: () => packageApi.getPackage(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<EventPackage, 'id'>) =>
      packageApi.createPackage(data),
    onSuccess: (newPackage) => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.setQueryData(
        packageKeys.detail(newPackage.id),
        newPackage
      );
    },
    onError: (error) => {
      console.error('Failed to create package:', error);
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventPackage> }) =>
      packageApi.updatePackage(id, data),
    onSuccess: (updatedPackage, { id }) => {
      queryClient.setQueryData(packageKeys.detail(id), updatedPackage);
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update package:', error);
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => packageApi.deletePackage(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: packageKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete package:', error);
    },
  });
};

export const useBulkDeletePackages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => packageApi.bulkDeletePackages(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete packages:', error);
    },
  });
};

// Helper functions
export const resetMockPackages = () => {
  mockPackages = [...MOCK_PACKAGES];
  packageIdCounter = Math.max(...mockPackages.map(pkg => pkg.id), 0) + 1;
};

export const getMockPackages = () => [...mockPackages];