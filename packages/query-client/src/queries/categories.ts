import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

export interface MenuCategory {
  itemCount: number;
  icon: string;
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get authorization headers with access token
 */
async function getAuthHeaders(includeContentType: boolean = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  // Only set Content-Type if includeContentType is true
  // For FormData, don't set Content-Type - let browser set it with boundary
  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  return headers;
}

export const categoryApi = {
  // GET all categories
  getCategories: async (): Promise<MenuCategory[]> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${API_BASE_URL}/api/v1/menu/categories`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }

      const response = await res.json();

      // Extract data array from response
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // Fallback if response structure is different
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // GET single category
  getCategory: async (id: string): Promise<MenuCategory> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${API_BASE_URL}/api/v1/menu/categories/${id}`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch category: ${res.status}`);
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // CREATE category with FormData (supports image upload)
  createCategory: async (data: FormData | Omit<MenuCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<MenuCategory> => {
    try {
      const isFormData = data instanceof FormData;
      
      // Don't set Content-Type for FormData - browser will set it automatically with boundary
      const headers = await getAuthHeaders(!isFormData);

      const res = await fetch(`${API_BASE_URL}/api/v1/menu/categories`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to create category: ${res.status}`);
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // UPDATE category
  updateCategory: async (
    id: string,
    data: Partial<Omit<MenuCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<MenuCategory> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${API_BASE_URL}/api/v1/menu/categories/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to update category: ${res.status}`);
      }

      const response = await res.json();
      return response.data || response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // DELETE category
  deleteCategory: async (id: string): Promise<void> => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${API_BASE_URL}/api/v1/menu/categories/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to delete category: ${res.status}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

// React Query Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoryApi.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Omit<MenuCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      categoryApi.createCategory(data),
    onSuccess: (newCategory) => {
      // Update the categories list
      queryClient.setQueryData(categoryKeys.lists(), (old: MenuCategory[] | undefined) => {
        if (!old) return [newCategory];
        return [...old, newCategory];
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Create category error:', error.message);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<MenuCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (updatedCategory, { id }) => {
      // Update the specific category detail
      queryClient.setQueryData(categoryKeys.detail(id), updatedCategory);

      // Update in the list
      queryClient.setQueryData(categoryKeys.lists(), (old: MenuCategory[] | undefined) => {
        if (!old) return [updatedCategory];
        return old.map((cat) => (cat.id === id ? updatedCategory : cat));
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Update category error:', error.message);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: (_, id) => {
      // Remove from list
      queryClient.setQueryData(categoryKeys.lists(), (old: MenuCategory[] | undefined) => {
        if (!old) return [];
        return old.filter((cat) => cat.id !== id);
      });

      // Remove detail
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Delete category error:', error.message);
    },
  });
};