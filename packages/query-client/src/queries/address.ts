import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type AddressType = 'home' | 'work' | 'other';

export interface Address {
  id: number;
  userId: string;
  type: AddressType;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  type: AddressType;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  instructions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {}

export interface AddressResponse {
  data: Address;
  message: string;
  timestamp: string;
}

export interface AddressListResponse {
  data: Address[];
  message: string;
  timestamp: string;
}

// Mock Data
const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    userId: 'USR-001',
    type: 'home',
    label: 'Home',
    fullName: 'John Doe',
    phone: '+1 (555) 123-4567',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    isDefault: true,
    instructions: 'Ring doorbell twice, dog inside',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 2,
    userId: 'USR-001',
    type: 'work',
    label: 'Office',
    fullName: 'John Doe',
    phone: '+1 (555) 123-4567',
    street: '456 Corporate Plaza, Suite 300',
    city: 'New York',
    state: 'NY',
    postalCode: '10002',
    country: 'USA',
    isDefault: false,
    instructions: 'Main entrance, call reception',
    coordinates: {
      latitude: 40.7138,
      longitude: -74.005,
    },
    createdAt: '2024-03-20T14:20:00Z',
    updatedAt: '2024-03-20T14:20:00Z',
  },
  {
    id: 3,
    userId: 'USR-001',
    type: 'other',
    label: 'Parents House',
    fullName: 'Jane Doe',
    phone: '+1 (555) 987-6543',
    street: '789 Oak Avenue',
    city: 'Boston',
    state: 'MA',
    postalCode: '02101',
    country: 'USA',
    isDefault: false,
    instructions: 'Leave at backyard gate',
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0589,
    },
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-02-10T09:15:00Z',
  },
];

// In-memory store for mock data
let mockAddresses: Address[] = [...MOCK_ADDRESSES];
let addressIdCounter = Math.max(...mockAddresses.map(addr => addr.id), 0) + 1;

// Query Keys
export const addressKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
  list: (filters?: { type?: AddressType }) => [...addressKeys.lists(), { filters }] as const,
  details: () => [...addressKeys.all, 'detail'] as const,
  detail: (id: number) => [...addressKeys.details(), id] as const,
  default: () => [...addressKeys.all, 'default'] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to false when real API is ready

export const addressApi = {
  // GET all addresses
  getAddresses: async (filters?: {
    type?: AddressType;
  }): Promise<AddressListResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      let addresses = [...mockAddresses];

      if (filters?.type) {
        addresses = addresses.filter(addr => addr.type === filters.type);
      }

      return {
        data: addresses,
        message: 'Addresses fetched successfully',
        timestamp: new Date().toISOString(),
      };
    }

    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);

    const res = await fetch(
      `${API_BASE_URL}/addresses${params.toString() ? `?${params}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      }
    );
    if (!res.ok) throw new Error('Failed to fetch addresses');
    return res.json();
  },

  // GET default address
  getDefaultAddress: async (): Promise<AddressResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const defaultAddr = mockAddresses.find(addr => addr.isDefault);
      if (!defaultAddr) throw new Error('No default address found');

      return {
        data: defaultAddr,
        message: 'Default address fetched successfully',
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses/default`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch default address');
    return res.json();
  },

  // GET single address
  getAddress: async (id: number): Promise<AddressResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const address = mockAddresses.find(addr => addr.id === id);
      if (!address) throw new Error('Address not found');

      return {
        data: address,
        message: 'Address fetched successfully',
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch address');
    return res.json();
  },

  // CREATE address
  createAddress: async (data: CreateAddressInput): Promise<AddressResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      // If new address is marked as default, unmark others
      if (data.isDefault) {
        mockAddresses.forEach(addr => {
          addr.isDefault = false;
        });
      }

      const newAddress: Address = {
        id: addressIdCounter++,
        userId: 'USR-001', // Demo user ID
        ...data,
        isDefault: data.isDefault || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockAddresses.push(newAddress);

      return {
        data: newAddress,
        message: 'Address created successfully',
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create address');
    return res.json();
  },

  // UPDATE address
  updateAddress: async (id: number, data: UpdateAddressInput): Promise<AddressResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockAddresses.findIndex(addr => addr.id === id);
      if (index === -1) throw new Error('Address not found');

      // If updating to default, unmark others
      if (data.isDefault) {
        mockAddresses.forEach((addr, idx) => {
          if (idx !== index) {
            addr.isDefault = false;
          }
        });
      }

      mockAddresses[index] = {
        ...mockAddresses[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return {
        data: mockAddresses[index],
        message: 'Address updated successfully',
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update address');
    return res.json();
  },

  // SET as default address
  setDefaultAddress: async (id: number): Promise<AddressResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockAddresses.findIndex(addr => addr.id === id);
      if (index === -1) throw new Error('Address not found');

      mockAddresses.forEach((addr, idx) => {
        addr.isDefault = idx === index;
      });

      return {
        data: mockAddresses[index],
        message: 'Default address updated successfully',
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses/${id}/set-default`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
    if (!res.ok) throw new Error('Failed to set default address');
    return res.json();
  },

  // DELETE address
  deleteAddress: async (id: number): Promise<{ message: string }> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockAddresses.findIndex(addr => addr.id === id);
      if (index === -1) throw new Error('Address not found');

      mockAddresses.splice(index, 1);

      // If deleted address was default, mark first as default
      if (mockAddresses.length > 0 && !mockAddresses.some(addr => addr.isDefault)) {
        mockAddresses[0].isDefault = true;
      }

      return {
        message: 'Address deleted successfully',
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete address');
    return res.json();
  },

  // BULK DELETE addresses
  bulkDeleteAddresses: async (ids: number[]): Promise<{ message: string }> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      mockAddresses = mockAddresses.filter(addr => !ids.includes(addr.id));

      // If no default address left, mark first as default
      if (mockAddresses.length > 0 && !mockAddresses.some(addr => addr.isDefault)) {
        mockAddresses[0].isDefault = true;
      }

      return {
        message: 'Addresses deleted successfully',
      };
    }

    const res = await fetch(`${API_BASE_URL}/addresses/bulk-delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete addresses');
    return res.json();
  },
};

// Hooks
export const useAddresses = (filters?: { type?: AddressType }) => {
  return useQuery({
    queryKey: addressKeys.list(filters),
    queryFn: () => addressApi.getAddresses(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDefaultAddress = () => {
  return useQuery({
    queryKey: addressKeys.default(),
    queryFn: () => addressApi.getDefaultAddress(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useAddress = (id: number) => {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => addressApi.getAddress(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressInput) => addressApi.createAddress(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.setQueryData(addressKeys.detail(response.data.id), response);
      if (response.data.isDefault) {
        queryClient.invalidateQueries({ queryKey: addressKeys.default() });
      }
    },
    onError: (error) => {
      console.error('Failed to create address:', error);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressInput }) =>
      addressApi.updateAddress(id, data),
    onSuccess: (response) => {
      queryClient.setQueryData(addressKeys.detail(response.data.id), response);
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      if (response.data.isDefault) {
        queryClient.invalidateQueries({ queryKey: addressKeys.default() });
      }
    },
    onError: (error) => {
      console.error('Failed to update address:', error);
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.setDefaultAddress(id),
    onSuccess: (response) => {
      queryClient.setQueryData(addressKeys.detail(response.data.id), response);
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({ queryKey: addressKeys.default() });
    },
    onError: (error) => {
      console.error('Failed to set default address:', error);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.deleteAddress(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: addressKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({ queryKey: addressKeys.default() });
    },
    onError: (error) => {
      console.error('Failed to delete address:', error);
    },
  });
};

export const useBulkDeleteAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => addressApi.bulkDeleteAddresses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({ queryKey: addressKeys.default() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete addresses:', error);
    },
  });
};

// Helper functions
export const resetMockAddresses = () => {
  mockAddresses = [...MOCK_ADDRESSES];
  addressIdCounter = Math.max(...mockAddresses.map(addr => addr.id), 0) + 1;
};

export const getMockAddresses = () => [...mockAddresses];

// Helper function to format address
export const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
};