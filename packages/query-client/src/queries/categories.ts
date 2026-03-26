import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MenuCategory {
    id: number;
    name: string;
    description: string;
    itemCount: number;
    icon: string;
}

// Query Keys
export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (filters?: string) => [...categoryKeys.lists(), { filters }] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const categoryApi = {
    // GET all categories
    getCategories: async (): Promise<MenuCategory[]> => {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
    },

    // GET single category
    getCategory: async (id: number): Promise<MenuCategory> => {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        return res.json();
    },

    // CREATE category
    createCategory: async (data: Omit<MenuCategory, 'id' | 'itemCount'>): Promise<MenuCategory> => {
        const res = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create category');
        return res.json();
    },

    // UPDATE category
    updateCategory: async (id: number, data: Partial<MenuCategory>): Promise<MenuCategory> => {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update category');
        return res.json();
    },

    // DELETE category
    deleteCategory: async (id: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete category');
    },
};

// Hooks
export const useCategories = () => {
    return useQuery({
        queryKey: categoryKeys.lists(),
        queryFn: categoryApi.getCategories,
    });
};

export const useCategory = (id: number) => {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => categoryApi.getCategory(id),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<MenuCategory, 'id' | 'itemCount'>) =>
            categoryApi.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<MenuCategory> }) =>
            categoryApi.updateCategory(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => categoryApi.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
};