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

// Mock Data
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'Paneer Tikka',
    category: 'Starters',
    description: 'Cottage cheese marinated in yogurt and spices, grilled to perfection',
    price: 250,
    offer: 10,
    finalPrice: 225,
    dietary: ['vegetarian'],
    halal: false,
    vegan: false,
    glutenFree: true,
    nutrition: { calories: 180, protein: 22, carbs: 5, fat: 8, fiber: 1 },
    optionalIngredients: ['Extra Mint', 'Lemon'],
    availability: 'available',
    prepTime: 15,
    servings: 2,
  },
  {
    id: 2,
    name: 'Butter Chicken',
    category: 'Main Course',
    description: 'Tender chicken in a creamy tomato-based sauce with butter and cream',
    price: 320,
    offer: 0,
    finalPrice: 320,
    dietary: ['non-vegetarian'],
    halal: true,
    vegan: false,
    glutenFree: true,
    nutrition: { calories: 280, protein: 32, carbs: 8, fat: 14, fiber: 0 },
    optionalIngredients: ['Extra Cream', 'Green Peas'],
    availability: 'available',
    prepTime: 20,
    servings: 2,
  },
  {
    id: 3,
    name: 'Tandoori Naan',
    category: 'Breads',
    description: 'Traditional Indian bread baked in a clay oven',
    price: 80,
    offer: 0,
    finalPrice: 80,
    dietary: ['vegetarian'],
    halal: false,
    vegan: false,
    glutenFree: false,
    nutrition: { calories: 250, protein: 8, carbs: 45, fat: 3, fiber: 2 },
    optionalIngredients: ['Garlic', 'Butter', 'Cheese'],
    availability: 'available',
    prepTime: 5,
    servings: 1,
  },
  {
    id: 4,
    name: 'Biryani',
    category: 'Rice & Biryani',
    description: 'Fragrant rice cooked with meat and spices',
    price: 280,
    offer: 15,
    finalPrice: 238,
    dietary: ['non-vegetarian'],
    halal: true,
    vegan: false,
    glutenFree: true,
    nutrition: { calories: 450, protein: 28, carbs: 52, fat: 16, fiber: 3 },
    optionalIngredients: ['Extra Meat', 'Boiled Eggs'],
    availability: 'available',
    prepTime: 25,
    servings: 2,
  },
  {
    id: 5,
    name: 'Dal Makhani',
    category: 'Main Course',
    description: 'Creamy lentil curry with butter and cream',
    price: 200,
    offer: 5,
    finalPrice: 190,
    dietary: ['vegetarian'],
    halal: false,
    vegan: false,
    glutenFree: true,
    nutrition: { calories: 220, protein: 18, carbs: 22, fat: 10, fiber: 4 },
    optionalIngredients: ['Extra Cream', 'Kasuri Methi'],
    availability: 'available',
    prepTime: 18,
    servings: 2,
  },
  {
    id: 6,
    name: 'Gulab Jamun',
    category: 'Desserts',
    description: 'Soft milk solids in sugar syrup, garnished with nuts',
    price: 120,
    offer: 0,
    finalPrice: 120,
    dietary: ['vegetarian'],
    halal: false,
    vegan: false,
    glutenFree: false,
    nutrition: { calories: 180, protein: 4, carbs: 35, fat: 5, fiber: 0 },
    optionalIngredients: ['Extra Syrup', 'Nuts'],
    availability: 'available',
    prepTime: 2,
    servings: 1,
  },
];

// In-memory store for mock data
let mockMenuItems: MenuItem[] = [...MOCK_MENU_ITEMS];
let menuItemIdCounter = Math.max(...mockMenuItems.map(item => item.id), 0) + 1;

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
const USE_MOCK_DATA = true; // Set to false when real API is ready

export const menuItemApi = {
  // GET all menu items
  getMenuItems: async (filters?: {
    category?: string;
    availability?: string;
  }): Promise<MenuItem[]> => {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let items = [...mockMenuItems];
      
      if (filters?.category && filters.category !== 'all') {
        items = items.filter(item => item.category === filters.category);
      }
      
      if (filters?.availability) {
        items = items.filter(item => item.availability === filters.availability);
      }
      
      return items;
    }

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const item = mockMenuItems.find(item => item.id === id);
      if (!item) throw new Error('Menu item not found');
      return item;
    }

    const res = await fetch(`${API_BASE_URL}/menu-items/${id}`);
    if (!res.ok) throw new Error('Failed to fetch menu item');
    return res.json();
  },

  // GET items by category
  getMenuItemsByCategory: async (category: string): Promise<MenuItem[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockMenuItems.filter(item => item.category === category);
    }

    const res = await fetch(`${API_BASE_URL}/menu-items?category=${category}`);
    if (!res.ok) throw new Error('Failed to fetch menu items by category');
    return res.json();
  },

  // CREATE menu item
  createMenuItem: async (data: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newItem: MenuItem = {
        id: menuItemIdCounter++,
        ...data,
      };
      
      mockMenuItems.push(newItem);
      return newItem;
    }

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockMenuItems.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Menu item not found');
      
      mockMenuItems[index] = {
        ...mockMenuItems[index],
        ...data,
        id: mockMenuItems[index].id, // Preserve original ID
      };
      
      return mockMenuItems[index];
    }

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockMenuItems.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Menu item not found');
      
      mockMenuItems.splice(index, 1);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete menu item');
  },

  // BULK DELETE menu items
  bulkDeleteMenuItems: async (ids: number[]): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      mockMenuItems = mockMenuItems.filter(item => !ids.includes(item.id));
      return;
    }

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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMenuItem = (id: number) => {
  return useQuery({
    queryKey: menuItemKeys.detail(id),
    queryFn: () => menuItemApi.getMenuItem(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMenuItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: menuItemKeys.byCategory(category),
    queryFn: () => menuItemApi.getMenuItemsByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<MenuItem, 'id'>) =>
      menuItemApi.createMenuItem(data),
    onSuccess: (newItem) => {
      // Invalidate all menu item queries
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuItemKeys.byCategory(newItem.category),
      });
      // Optionally add to cache
      queryClient.setQueryData(
        menuItemKeys.detail(newItem.id),
        newItem
      );
    },
    onError: (error) => {
      console.error('Failed to create menu item:', error);
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MenuItem> }) =>
      menuItemApi.updateMenuItem(id, data),
    onSuccess: (updatedItem, { id }) => {
      // Update cache
      queryClient.setQueryData(menuItemKeys.detail(id), updatedItem);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuItemKeys.byCategory(updatedItem.category),
      });
    },
    onError: (error) => {
      console.error('Failed to update menu item:', error);
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => menuItemApi.deleteMenuItem(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: menuItemKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete menu item:', error);
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
    onError: (error) => {
      console.error('Failed to bulk delete menu items:', error);
    },
  });
};

// Helper function to reset mock data (useful for testing)
export const resetMockMenuItems = () => {
  mockMenuItems = [...MOCK_MENU_ITEMS];
  menuItemIdCounter = Math.max(...mockMenuItems.map(item => item.id), 0) + 1;
};

// Helper function to get current mock data (for debugging)
export const getMockMenuItems = () => [...mockMenuItems];