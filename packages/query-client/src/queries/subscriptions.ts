import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Subscription {
  id: number;
  name: string;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'mixed';
  duration: 'weekly' | 'monthly';
  price: number;
  currency: string;
  mealsPerWeek: number;
  daysPerWeek: number;
  items: Record<string, string[]>;
  addOns: { id: number; name: string; price: number }[];
  status: 'active' | 'inactive';
  createdDate: string;
  subscribers: number;
  image?: string;
  minSubscribers?: number;
  maxSubscribers?: number;
}

// Mock Data
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 101,
    name: 'Healthy Morning Bundle',
    description: 'Perfect breakfast and light snacks',
    mealType: 'breakfast',
    duration: 'monthly',
    price: 4999,
    currency: '₹',
    mealsPerWeek: 5,
    daysPerWeek: 5,
    items: {
      breakfast: ['Vegetable Poha', 'Idli Sambar', 'Dosa', 'Fresh Juices', 'Eggs', 'Bread Toast'],
      snacks: ['Samosa', 'Pakora', 'Cookies', 'Fresh Fruits'],
    },
    addOns: [
      { id: 1, name: 'Extra Dessert', price: 500 },
      { id: 2, name: 'Premium Juice', price: 300 },
    ],
    status: 'active',
    createdDate: 'March 1, 2025',
    subscribers: 15,
    minSubscribers: 5,
    maxSubscribers: 100,
  },
  {
    id: 102,
    name: 'Office Lunch Plan',
    description: 'Complete lunch solution for offices',
    mealType: 'lunch',
    duration: 'monthly',
    price: 7999,
    currency: '₹',
    mealsPerWeek: 5,
    daysPerWeek: 5,
    items: {
      main: ['Butter Chicken', 'Dal Makhani', 'Paneer Tikka'],
      sides: ['Rice', 'Naan', 'Salad', 'Raita'],
    },
    addOns: [{ id: 1, name: 'Extra Dessert', price: 300 }],
    status: 'active',
    createdDate: 'February 15, 2025',
    subscribers: 8,
    minSubscribers: 10,
    maxSubscribers: 50,
  },
  {
    id: 103,
    name: 'Weekend Dinner Special',
    description: 'Premium dinner packages for weekends',
    mealType: 'dinner',
    duration: 'weekly',
    price: 2999,
    currency: '₹',
    mealsPerWeek: 2,
    daysPerWeek: 2,
    items: {
      main: ['Tandoori Chicken', 'Biryani', 'Paneer Butter Masala'],
      bread: ['Naan', 'Roti'],
      dessert: ['Gulab Jamun', 'Kheer'],
    },
    addOns: [
      { id: 1, name: 'Extra Chicken', price: 400 },
      { id: 2, name: 'Wine Pairing', price: 800 },
    ],
    status: 'active',
    createdDate: 'February 20, 2025',
    subscribers: 6,
    minSubscribers: 3,
    maxSubscribers: 30,
  },
  {
    id: 104,
    name: 'All-Day Mixed Meals',
    description: 'Breakfast, lunch, and dinner combined',
    mealType: 'mixed',
    duration: 'monthly',
    price: 12999,
    currency: '₹',
    mealsPerWeek: 5,
    daysPerWeek: 5,
    items: {
      breakfast: ['Idli', 'Dosa', 'Poha'],
      lunch: ['Biryani', 'Curry', 'Rice'],
      dinner: ['Tandoori Items', 'Paneer Dishes', 'Bread'],
    },
    addOns: [
      { id: 1, name: 'Premium Ingredients', price: 1500 },
      { id: 2, name: 'Extra Servings', price: 500 },
    ],
    status: 'inactive',
    createdDate: 'January 10, 2025',
    subscribers: 2,
    minSubscribers: 10,
    maxSubscribers: 100,
  },
];

// In-memory store for mock data
let mockSubscriptions: Subscription[] = [...MOCK_SUBSCRIPTIONS];
let subscriptionIdCounter = Math.max(...mockSubscriptions.map(sub => sub.id), 0) + 1;

// Query Keys
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters?: { status?: 'active' | 'inactive'; mealType?: string }) =>
    [...subscriptionKeys.lists(), { filters }] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: number) => [...subscriptionKeys.details(), id] as const,
  byMealType: (mealType: string) =>
    [...subscriptionKeys.lists(), { mealType }] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to false when real API is ready

export const subscriptionApi = {
  // GET all subscriptions
  getSubscriptions: async (filters?: {
    status?: 'active' | 'inactive';
    mealType?: string;
  }): Promise<Subscription[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let subscriptions = [...mockSubscriptions];
      
      if (filters?.status) {
        subscriptions = subscriptions.filter(sub => sub.status === filters.status);
      }
      
      if (filters?.mealType) {
        subscriptions = subscriptions.filter(sub => sub.mealType === filters.mealType);
      }
      
      return subscriptions;
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.mealType) params.append('mealType', filters.mealType);

    const res = await fetch(
      `${API_BASE_URL}/subscriptions${params.toString() ? `?${params}` : ''}`
    );
    if (!res.ok) throw new Error('Failed to fetch subscriptions');
    return res.json();
  },

  // GET single subscription
  getSubscription: async (id: number): Promise<Subscription> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const sub = mockSubscriptions.find(s => s.id === id);
      if (!sub) throw new Error('Subscription not found');
      return sub;
    }

    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch subscription');
    return res.json();
  },

  // GET subscriptions by meal type
  getSubscriptionsByMealType: async (mealType: string): Promise<Subscription[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSubscriptions.filter(sub => sub.mealType === mealType);
    }

    const res = await fetch(`${API_BASE_URL}/subscriptions?mealType=${mealType}`);
    if (!res.ok) throw new Error('Failed to fetch subscriptions by meal type');
    return res.json();
  },

  // CREATE subscription
  createSubscription: async (data: Omit<Subscription, 'id'>): Promise<Subscription> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newSubscription: Subscription = {
        id: subscriptionIdCounter++,
        ...data,
      };
      
      mockSubscriptions.push(newSubscription);
      return newSubscription;
    }

    const res = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create subscription');
    return res.json();
  },

  // UPDATE subscription
  updateSubscription: async (id: number, data: Partial<Subscription>): Promise<Subscription> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockSubscriptions.findIndex(sub => sub.id === id);
      if (index === -1) throw new Error('Subscription not found');
      
      mockSubscriptions[index] = {
        ...mockSubscriptions[index],
        ...data,
        id: mockSubscriptions[index].id,
      };
      
      return mockSubscriptions[index];
    }

    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update subscription');
    return res.json();
  },

  // DELETE subscription
  deleteSubscription: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockSubscriptions.findIndex(sub => sub.id === id);
      if (index === -1) throw new Error('Subscription not found');
      
      mockSubscriptions.splice(index, 1);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete subscription');
  },

  // BULK DELETE subscriptions
  bulkDeleteSubscriptions: async (ids: number[]): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      mockSubscriptions = mockSubscriptions.filter(sub => !ids.includes(sub.id));
      return;
    }

    const res = await fetch(`${API_BASE_URL}/subscriptions/bulk-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete subscriptions');
  },
};

// Hooks
export const useSubscriptions = (filters?: {
  status?: 'active' | 'inactive';
  mealType?: string;
}) => {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => subscriptionApi.getSubscriptions(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => subscriptionApi.getSubscription(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubscriptionsByMealType = (mealType: string) => {
  return useQuery({
    queryKey: subscriptionKeys.byMealType(mealType),
    queryFn: () => subscriptionApi.getSubscriptionsByMealType(mealType),
    enabled: !!mealType,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Subscription, 'id'>) =>
      subscriptionApi.createSubscription(data),
    onSuccess: (newSubscription) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.byMealType(newSubscription.mealType),
      });
      queryClient.setQueryData(
        subscriptionKeys.detail(newSubscription.id),
        newSubscription
      );
    },
    onError: (error) => {
      console.error('Failed to create subscription:', error);
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Subscription> }) =>
      subscriptionApi.updateSubscription(id, data),
    onSuccess: (updatedSubscription, { id }) => {
      queryClient.setQueryData(subscriptionKeys.detail(id), updatedSubscription);
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.byMealType(updatedSubscription.mealType),
      });
    },
    onError: (error) => {
      console.error('Failed to update subscription:', error);
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscriptionApi.deleteSubscription(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: subscriptionKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete subscription:', error);
    },
  });
};

export const useBulkDeleteSubscriptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => subscriptionApi.bulkDeleteSubscriptions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete subscriptions:', error);
    },
  });
};

// Helper functions
export const resetMockSubscriptions = () => {
  mockSubscriptions = [...MOCK_SUBSCRIPTIONS];
  subscriptionIdCounter = Math.max(...mockSubscriptions.map(sub => sub.id), 0) + 1;
};

export const getMockSubscriptions = () => [...mockSubscriptions];