import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  offer?: number;
  finalPrice: number;
  dietary: string[];
  halal: boolean;
  vegan: boolean;
  glutenFree: boolean;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  optionalIngredients: string[];
  availability: 'available' | 'unavailable' | 'out-of-stock';
  images?: string[];
  image?: string;
  prepTime: number;
  servings: number;
  tags: string[];
  addon_groups?: Array<{
    id?: string;
    name: string;
    min_select: number;
    max_select: number;
    is_required: boolean;
    addons: Array<{
      id?: string;
      name: string;
      price: number;
    }>;
  }>;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Query Keys
export const menuItemKeys = {
  all: ['menuItems'] as const,
  lists: () => [...menuItemKeys.all, 'list'] as const,
  list: (filters?: { category?: string; availability?: string }) =>
    [...menuItemKeys.lists(), { filters }] as const,
  details: () => [...menuItemKeys.all, 'detail'] as const,
  detail: (id: string) => [...menuItemKeys.details(), id] as const,
  byCategory: (category: string) =>
    [...menuItemKeys.lists(), { category }] as const,
};

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get authorization headers with access token
 */
export async function getAuthHeaders(includeContentType: boolean = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();


  console.log("Getting auth headers. Session:", session);

  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  return headers;
}

// API Functions
export const menuItemApi = {
  // GET all menu items
  getMenuItems: async (filters?: {
    category?: string;
    availability?: string;
  }): Promise<MenuItem[]> => {
    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams();

      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters?.availability) {
        params.append('availability', filters.availability);
      }

      const queryString = params.toString() ? `?${params}` : '';
      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items${queryString}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch menu items: ${res.status}`);
      }

      const response = await res.json();

      // Extract data array from response
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // GET single menu item
  getMenuItem: async (id: string): Promise<MenuItem> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items/${id}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch menu item: ${res.status}`);
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  },

  // GET items by category
  getMenuItemsByCategory: async (category: string): Promise<MenuItem[]> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items?category=${encodeURIComponent(category)}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch menu items by category: ${res.status}`);
      }

      const response = await res.json();
      return response.data && Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw error;
    }
  },

  // CREATE menu item with FormData (multipart/form-data for image upload)
  createMenuItem: async (data: FormData): Promise<MenuItem> => {
    try {
      const session = await getSession();
      const headers = new Headers();

      // Don't set Content-Type header - browser will set it with boundary
      if (session?.user?.accessToken) {
        headers.set('Authorization', `Bearer ${session.user.accessToken}`);
      }

      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items`,
        {
          method: 'POST',
          headers,
          body: data,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to create menu item: ${res.status}`);
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  // UPDATE menu item with FormData (multipart/form-data for image upload)
  updateMenuItem: async (
    id: string,
    data: FormData
  ): Promise<MenuItem> => {
    try {
      const session = await getSession();
      const headers = new Headers();

      // Don't set Content-Type header - browser will set it with boundary
      if (session?.user?.accessToken) {
        headers.set('Authorization', `Bearer ${session.user.accessToken}`);
      }

      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items/${id}`,
        {
          method: 'PUT',
          headers,
          body: data,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to update menu item: ${res.status}`);
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // DELETE menu item
  deleteMenuItem: async (id: string): Promise<void> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items/${id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to delete menu item: ${res.status}`);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // BULK DELETE menu items
  bulkDeleteMenuItems: async (ids: string[]): Promise<void> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/menu/items/bulk-delete`,
        {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ ids }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to bulk delete menu items: ${res.status}`);
      }
    } catch (error) {
      console.error('Error bulk deleting menu items:', error);
      throw error;
    }
  },
};

// React Query Hooks
export const useMenuItems = (filters?: {
  category?: string;
  availability?: string;
}) => {
  return useQuery({
    queryKey: menuItemKeys.list(filters),
    queryFn: () => menuItemApi.getMenuItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useMenuItem = (id: string) => {
  return useQuery({
    queryKey: menuItemKeys.detail(id),
    queryFn: () => menuItemApi.getMenuItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMenuItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: menuItemKeys.byCategory(category),
    queryFn: () => menuItemApi.getMenuItemsByCategory(category),
    enabled: !!category && category !== 'all',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      menuItemApi.createMenuItem(data),
    onSuccess: (newItem) => {
      // Invalidate all menu item queries
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
      if (newItem.category) {
        queryClient.invalidateQueries({
          queryKey: menuItemKeys.byCategory(newItem.category),
        });
      }
      // Add to cache
      queryClient.setQueryData(menuItemKeys.detail(newItem.id), newItem);
    },
    onError: (error: Error) => {
      console.error('Create menu item error:', error.message);
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => menuItemApi.updateMenuItem(id, data),
    onSuccess: (updatedItem, { id }) => {
      // Update cache
      queryClient.setQueryData(menuItemKeys.detail(id), updatedItem);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
      if (updatedItem.category) {
        queryClient.invalidateQueries({
          queryKey: menuItemKeys.byCategory(updatedItem.category),
        });
      }
    },
    onError: (error: Error) => {
      console.error('Update menu item error:', error.message);
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuItemApi.deleteMenuItem(id),
    onSuccess: () => {
      // Invalidate all queries
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Delete menu item error:', error.message);
    },
  });
};

export const useBulkDeleteMenuItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => menuItemApi.bulkDeleteMenuItems(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Bulk delete menu items error:', error.message);
    },
  });
};