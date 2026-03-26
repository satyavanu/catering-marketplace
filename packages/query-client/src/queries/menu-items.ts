import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MenuItem {
  id: number;
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
  image?: string;
  prepTime: number;
  servings: number;
}

// Query Keys
export const menuItemKeys = {
  all: ['menuItems'] as const,
  lists: () => [...menuItemKeys.all, 'list'] as const,
  list: (filters?: { category?: string; availability?: string }) =>
    [...menuItemKeys.lists(), { filters }] as const,
  details: () => [...menuItemKeys.all, 'detail'] as const,
  detail: (id: number) => [...menuItemKeys.details(), id] as const,
  byCategory: (category: string) =>
    [...menuItemKeys.lists(), { category }] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const menuItemApi = {
  // GET all menu items
  getMenuItems: async (filters?: {
    category?: string;
    availability?: string;
  }): Promise<MenuItem[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.availability) params.append('availability', filters.availability);

    const res = await fetch(
      `${API_BASE_URL}/menu-items${params.toString() ? `?${params}` : ''}`
    );
    if (!res.ok) throw new Error('Failed to fetch menu items');
    return res.json();
  },

  // GET single menu item
  getMenuItem: async (id: number): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/${id}`);
    if (!res.ok) throw new Error('Failed to fetch menu item');
    return res.json();
  },

  // GET items by category
  getMenuItemsByCategory: async (category: string): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items?category=${category}`);
    if (!res.ok) throw new Error('Failed to fetch menu items by category');
    return res.json();
  },

  // CREATE menu item
  createMenuItem: async (data: Omit<MenuItem, 'id' | 'finalPrice'>): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE_URL}/menu-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create menu item');
    return res.json();
  },

  // UPDATE menu item
  updateMenuItem: async (id: number, data: Partial<MenuItem>): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update menu item');
    return res.json();
  },

  // DELETE menu item
  deleteMenuItem: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete menu item');
  },

  // BULK DELETE menu items
  bulkDeleteMenuItems: async (ids: number[]): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/bulk-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete menu items');
  },
};

// Hooks
export const useMenuItems = (filters?: {
  category?: string;
  availability?: string;
}) => {
  return useQuery({
    queryKey: menuItemKeys.list(filters),
    queryFn: () => menuItemApi.getMenuItems(filters),
  });
};

export const useMenuItem = (id: number) => {
  return useQuery({
    queryKey: menuItemKeys.detail(id),
    queryFn: () => menuItemApi.getMenuItem(id),
  });
};

export const useMenuItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: menuItemKeys.byCategory(category),
    queryFn: () => menuItemApi.getMenuItemsByCategory(category),
    enabled: !!category,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<MenuItem, 'id' | 'finalPrice'>) =>
      menuItemApi.createMenuItem(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuItemKeys.byCategory(newItem.category),
      });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MenuItem> }) =>
      menuItemApi.updateMenuItem(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: menuItemKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuItemKeys.byCategory(updatedItem.category),
      });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => menuItemApi.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
    },
  });
};

export const useBulkDeleteMenuItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => menuItemApi.bulkDeleteMenuItems(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
    },
  });
};