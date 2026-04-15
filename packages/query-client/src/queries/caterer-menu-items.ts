import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

export interface CatererMenuItem {
  id: string;
  section_id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_veg: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level?: 'mild' | 'medium' | 'spicy';
  pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
  price?: number;
  currency_code?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Query Keys
export const catererMenuItemKeys = {
  all: ['catererMenuItems'] as const,
  lists: () => [...catererMenuItemKeys.all, 'list'] as const,
  list: (filters?: { section_id?: string; is_active?: boolean }) =>
    [...catererMenuItemKeys.lists(), { filters }] as const,
  details: () => [...catererMenuItemKeys.all, 'detail'] as const,
  detail: (id: string) => [...catererMenuItemKeys.details(), id] as const,
  bySection: (sectionId: string) =>
    [...catererMenuItemKeys.lists(), { sectionId }] as const,
};

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get authorization headers with access token
 */
async function getAuthHeaders(includeContentType: boolean = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  return headers;
}

// API Functions
export const catererMenuItemApi = {
  /**
   * Create a menu item in a section
   */
  createMenuItem: async (data: {
    section_id: string;
    name: string;
    description?: string;
    image_url?: string;
    is_veg: boolean;
    is_vegan: boolean;
    is_gluten_free: boolean;
    spice_level?: 'mild' | 'medium' | 'spicy';
    pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
    price?: number;
    currency_code?: string;
    sort_order: number;
  }): Promise<CatererMenuItem> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create menu item: ${res.status}`
        );
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  /**
   * Get all menu items for caterer
   */
  getMenuItems: async (filters?: {
    section_id?: string;
    is_active?: boolean;
  }): Promise<CatererMenuItem[]> => {
    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams();

      if (filters?.section_id) {
        params.append('section_id', filters.section_id);
      }
      if (filters?.is_active !== undefined) {
        params.append('is_active', filters.is_active.toString());
      }

      const queryString = params.toString() ? `?${params}` : '';
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items${queryString}`,
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

  /**
   * Get single menu item
   */
  getMenuItem: async (itemId: string): Promise<CatererMenuItem> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items/${itemId}`,
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

  /**
   * Get items by section
   */
  getMenuItemsBySection: async (sectionId: string): Promise<CatererMenuItem[]> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items?section_id=${encodeURIComponent(sectionId)}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch menu items by section: ${res.status}`);
      }

      const response = await res.json();
      return response.data && Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching menu items by section:', error);
      throw error;
    }
  },

  /**
   * Update a menu item
   */
  updateMenuItem: async (
    itemId: string,
    data: Partial<{
      name: string;
      description: string;
      image_url: string;
      is_veg: boolean;
      is_vegan: boolean;
      is_gluten_free: boolean;
      spice_level: 'mild' | 'medium' | 'spicy';
      pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
      price: number;
      currency_code: string;
      sort_order: number;
      is_active: boolean;
    }>
  ): Promise<CatererMenuItem> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items/${itemId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update menu item: ${res.status}`
        );
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  /**
   * Delete a menu item
   */
  deleteMenuItem: async (itemId: string): Promise<void> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items/${itemId}`,
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
};

// ============ REACT QUERY HOOKS ============

/**
 * Get all menu items for caterer
 */
export const useCatererMenuItems = (filters?: {
  section_id?: string;
  is_active?: boolean;
}) => {
  return useQuery({
    queryKey: catererMenuItemKeys.list(filters),
    queryFn: () => catererMenuItemApi.getMenuItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
};

/**
 * Get single menu item
 */
export const useCatererMenuItem = (itemId: string | null) => {
  return useQuery({
    queryKey: catererMenuItemKeys.detail(itemId || ''),
    queryFn: () => catererMenuItemApi.getMenuItem(itemId!),
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Get menu items by section
 */
export const useCatererMenuItemsBySection = (sectionId: string | null) => {
  return useQuery({
    queryKey: catererMenuItemKeys.bySection(sectionId || ''),
    queryFn: () => catererMenuItemApi.getMenuItemsBySection(sectionId!),
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create a menu item
 */
export const useCreateCatererMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof catererMenuItemApi.createMenuItem>[0]) =>
      catererMenuItemApi.createMenuItem(data),
    onSuccess: (newItem) => {
      // Invalidate all menu item queries
      queryClient.invalidateQueries({
        queryKey: catererMenuItemKeys.lists(),
      });
      // Invalidate section-specific queries
      queryClient.invalidateQueries({
        queryKey: catererMenuItemKeys.bySection(newItem.section_id),
      });
      // Add to cache
      queryClient.setQueryData(
        catererMenuItemKeys.detail(newItem.id),
        newItem
      );
    },
    onError: (error: Error) => {
      console.error('Create menu item error:', error.message);
    },
  });
};

/**
 * Update a menu item
 */
export const useUpdateCatererMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof catererMenuItemApi.updateMenuItem>[1];
    }) => catererMenuItemApi.updateMenuItem(id, data),
    onSuccess: (updatedItem, { id }) => {
      // Update cache
      queryClient.setQueryData(
        catererMenuItemKeys.detail(id),
        updatedItem
      );
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: catererMenuItemKeys.lists(),
      });
      // Invalidate section-specific queries
      queryClient.invalidateQueries({
        queryKey: catererMenuItemKeys.bySection(updatedItem.section_id),
      });
    },
    onError: (error: Error) => {
      console.error('Update menu item error:', error.message);
    },
  });
};

/**
 * Delete a menu item
 */
export const useDeleteCatererMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) =>
      catererMenuItemApi.deleteMenuItem(itemId),
    onSuccess: () => {
      // Invalidate all queries
      queryClient.invalidateQueries({
        queryKey: catererMenuItemKeys.lists(),
      });
    },
    onError: (error: Error) => {
      console.error('Delete menu item error:', error.message);
    },
  });
};