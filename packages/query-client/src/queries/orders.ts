import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type OrderType = 'ONE_TIME' | 'BULK' | 'SUBSCRIPTION';
export type DeliverySlot = 'BREAKFAST' | 'LUNCH' | 'DINNER';
export type DeliveryStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'FAILED' | 'REFUNDED' | 'DUE';
export type ReferenceLabel = 'Order' | 'Quote' | 'Subscription';

export interface OrderListItem {
  id: string;
  type: OrderType;
  customer_name: string;
  delivery_date: string;
  delivery_slot?: DeliverySlot;
  delivery_status: DeliveryStatus;
  payment_status: PaymentStatus;
  amount?: number;
  reference_id?: string;
  reference_label?: ReferenceLabel;
}

export interface OrderDetail extends OrderListItem {
  items?: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  addOns?: {
    id: number;
    name: string;
    price: number;
  }[];
  notes?: string;
  delivery_address?: string;
  contact_number?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Mock Data
const MOCK_ORDERS: OrderDetail[] = [
  // ONE_TIME Orders
  {
    id: 'DEL-5001',
    type: 'ONE_TIME',
    customer_name: 'Ravi Kumar',
    delivery_date: '2026-03-28',
    delivery_slot: 'LUNCH',
    delivery_status: 'DELIVERED',
    payment_status: 'PAID',
    amount: 1200,
    reference_id: 'ORD-101',
    reference_label: 'Order',
    items: [
      { id: 1, name: 'Paneer Tikka', quantity: 2, price: 250, subtotal: 500 },
      { id: 2, name: 'Butter Chicken', quantity: 2, price: 320, subtotal: 640 },
      { id: 3, name: 'Naan', quantity: 4, price: 80, subtotal: 320 },
    ],
    addOns: [
      { id: 1, name: 'Extra Raita', price: 50 },
      { id: 2, name: 'Pickle & Papad', price: 30 },
    ],
    notes: 'Please deliver before 1 PM',
    delivery_address: '123 Main Street, Bangalore',
    contact_number: '+91-9876543210',
    email: 'ravi@example.com',
    created_at: '2026-03-27T10:30:00Z',
    updated_at: '2026-03-28T12:45:00Z',
  },
  {
    id: 'DEL-5002',
    type: 'ONE_TIME',
    customer_name: 'Priya Singh',
    delivery_date: '2026-03-29',
    delivery_slot: 'DINNER',
    delivery_status: 'OUT_FOR_DELIVERY',
    payment_status: 'PAID',
    amount: 1800,
    reference_id: 'ORD-102',
    reference_label: 'Order',
    items: [
      { id: 4, name: 'Tandoori Chicken', quantity: 1, price: 380, subtotal: 380 },
      { id: 5, name: 'Biryani', quantity: 2, price: 280, subtotal: 560 },
      { id: 6, name: 'Gulab Jamun', quantity: 4, price: 120, subtotal: 480 },
    ],
    addOns: [
      { id: 3, name: 'Dessert Pack', price: 200 },
    ],
    notes: 'Ring doorbell twice',
    delivery_address: '456 Oak Avenue, Bangalore',
    contact_number: '+91-9876543211',
    email: 'priya@example.com',
    created_at: '2026-03-28T14:20:00Z',
    updated_at: '2026-03-29T18:00:00Z',
  },
  {
    id: 'DEL-5003',
    type: 'ONE_TIME',
    customer_name: 'Arjun Verma',
    delivery_date: '2026-03-30',
    delivery_slot: 'BREAKFAST',
    delivery_status: 'PENDING',
    payment_status: 'PENDING',
    amount: 650,
    reference_id: 'ORD-103',
    reference_label: 'Order',
    items: [
      { id: 7, name: 'Idli Sambar', quantity: 4, price: 120, subtotal: 480 },
      { id: 8, name: 'Dosa', quantity: 2, price: 100, subtotal: 200 },
    ],
    addOns: [],
    notes: 'Vegetarian items only',
    delivery_address: '789 Maple Drive, Bangalore',
    contact_number: '+91-9876543212',
    email: 'arjun@example.com',
    created_at: '2026-03-29T09:15:00Z',
    updated_at: '2026-03-29T09:15:00Z',
  },

  // BULK Orders (Quotes)
  {
    id: 'DEL-6001',
    type: 'BULK',
    customer_name: 'ABC Corp',
    delivery_date: '2026-03-30',
    delivery_slot: 'LUNCH',
    delivery_status: 'PREPARING',
    payment_status: 'PARTIAL',
    amount: 50000,
    reference_id: 'Q-55',
    reference_label: 'Quote',
    items: [
      { id: 1, name: 'Paneer Tikka', quantity: 50, price: 250, subtotal: 12500 },
      { id: 2, name: 'Butter Chicken', quantity: 50, price: 320, subtotal: 16000 },
      { id: 3, name: 'Naan', quantity: 100, price: 80, subtotal: 8000 },
      { id: 5, name: 'Biryani', quantity: 30, price: 280, subtotal: 8400 },
    ],
    addOns: [
      { id: 1, name: 'Extra Raita (10L)', price: 1500 },
      { id: 2, name: 'Dessert Pack (100)', price: 3600 },
    ],
    notes: 'Corporate event - 100 guests. Requires serving staff',
    delivery_address: 'ABC Corp Office, MG Road, Bangalore',
    contact_number: '+91-9876543213',
    email: 'events@abccorp.com',
    created_at: '2026-03-25T11:00:00Z',
    updated_at: '2026-03-29T16:30:00Z',
  },
  {
    id: 'DEL-6002',
    type: 'BULK',
    customer_name: 'XYZ Hotel',
    delivery_date: '2026-03-31',
    delivery_slot: 'DINNER',
    delivery_status: 'PENDING',
    payment_status: 'DUE',
    amount: 75000,
    reference_id: 'Q-56',
    reference_label: 'Quote',
    items: [
      { id: 4, name: 'Tandoori Chicken', quantity: 100, price: 380, subtotal: 38000 },
      { id: 5, name: 'Biryani', quantity: 60, price: 280, subtotal: 16800 },
      { id: 6, name: 'Gulab Jamun', quantity: 150, price: 120, subtotal: 18000 },
    ],
    addOns: [
      { id: 4, name: 'Beverage Service (150)', price: 2200 },
    ],
    notes: 'Wedding reception for 150 guests. Full catering with setup',
    delivery_address: 'XYZ Hotel Grand Ballroom, Whitefield, Bangalore',
    contact_number: '+91-9876543214',
    email: 'catering@xyzhotel.com',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-27T14:00:00Z',
  },

  // SUBSCRIPTION Orders
  {
    id: 'DEL-7001',
    type: 'SUBSCRIPTION',
    customer_name: 'Healthy Minds Gym',
    delivery_date: '2026-03-28',
    delivery_slot: 'BREAKFAST',
    delivery_status: 'DELIVERED',
    payment_status: 'PAID',
    amount: 4999,
    reference_id: 'SUB-201',
    reference_label: 'Subscription',
    items: [
      { id: 1, name: 'Vegetable Poha', quantity: 25, price: 0, subtotal: 0 },
      { id: 7, name: 'Idli Sambar', quantity: 25, price: 0, subtotal: 0 },
      { id: 8, name: 'Dosa', quantity: 25, price: 0, subtotal: 0 },
      { id: 9, name: 'Fresh Orange Juice', quantity: 50, price: 0, subtotal: 0 },
    ],
    addOns: [
      { id: 5, name: 'Protein Powder Add-on (25 servings)', price: 1250 },
    ],
    notes: 'Gym subscription - 25 members daily',
    delivery_address: 'Healthy Minds Gym, Indiranagar, Bangalore',
    contact_number: '+91-9876543215',
    email: 'admin@healthyminds.com',
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-03-28T06:30:00Z',
  },
  {
    id: 'DEL-7002',
    type: 'SUBSCRIPTION',
    customer_name: 'Tech Startup Inc',
    delivery_date: '2026-03-28',
    delivery_slot: 'LUNCH',
    delivery_status: 'PREPARING',
    payment_status: 'PAID',
    amount: 7999,
    reference_id: 'SUB-202',
    reference_label: 'Subscription',
    items: [
      { id: 2, name: 'Butter Chicken', quantity: 40, price: 0, subtotal: 0 },
      { id: 5, name: 'Biryani', quantity: 30, price: 0, subtotal: 0 },
      { id: 3, name: 'Naan', quantity: 80, price: 0, subtotal: 0 },
      { id: 10, name: 'Mixed Salad', quantity: 40, price: 0, subtotal: 0 },
    ],
    addOns: [
      { id: 6, name: 'Dessert Daily (40 servings)', price: 1600 },
    ],
    notes: 'Office lunch subscription - 40 employees, 5 days/week',
    delivery_address: 'Tech Startup Inc, Koramangala, Bangalore',
    contact_number: '+91-9876543216',
    email: 'hr@techstartup.com',
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-28T11:00:00Z',
  },
  {
    id: 'DEL-7003',
    type: 'SUBSCRIPTION',
    customer_name: 'Phoenix Fitness',
    delivery_date: '2026-03-27',
    delivery_slot: 'DINNER',
    delivery_status: 'CANCELLED',
    payment_status: 'REFUNDED',
    amount: 2999,
    reference_id: 'SUB-203',
    reference_label: 'Subscription',
    items: [],
    addOns: [],
    notes: 'Cancelled due to gym closure',
    delivery_address: 'Phoenix Fitness, Whitefield, Bangalore',
    contact_number: '+91-9876543217',
    email: 'manager@phoenixfitness.com',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-03-27T09:00:00Z',
  },
];

// In-memory store for mock data
let mockOrders: OrderDetail[] = [...MOCK_ORDERS];
let orderIdCounter = parseInt(
  Math.max(...mockOrders.map(order => parseInt(order.id.split('-')[1]))).toString(),
  10
) + 1;

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: {
    type?: OrderType;
    delivery_status?: DeliveryStatus;
    payment_status?: PaymentStatus;
  }) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  byType: (type: OrderType) => [...orderKeys.lists(), { type }] as const,
  byStatus: (status: DeliveryStatus) => [...orderKeys.lists(), { status }] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to false when real API is ready

export const orderApi = {
  // GET all orders (list view)
  getOrders: async (filters?: {
    type?: OrderType;
    delivery_status?: DeliveryStatus;
    payment_status?: PaymentStatus;
  }): Promise<OrderListItem[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      let orders = mockOrders.map(order => ({
        id: order.id,
        type: order.type,
        customer_name: order.customer_name,
        delivery_date: order.delivery_date,
        delivery_slot: order.delivery_slot,
        delivery_status: order.delivery_status,
        payment_status: order.payment_status,
        amount: order.amount,
        reference_id: order.reference_id,
        reference_label: order.reference_label,
      } as OrderListItem));

      if (filters?.type) {
        orders = orders.filter(order => order.type === filters.type);
      }

      if (filters?.delivery_status) {
        orders = orders.filter(order => order.delivery_status === filters.delivery_status);
      }

      if (filters?.payment_status) {
        orders = orders.filter(order => order.payment_status === filters.payment_status);
      }

      return orders;
    }

    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.delivery_status) params.append('delivery_status', filters.delivery_status);
    if (filters?.payment_status) params.append('payment_status', filters.payment_status);

    const res = await fetch(
      `${API_BASE_URL}/orders${params.toString() ? `?${params}` : ''}`
    );
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  // GET single order (detail view)
  getOrder: async (id: string): Promise<OrderDetail> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }

    const res = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  // GET orders by type
  getOrdersByType: async (type: OrderType): Promise<OrderListItem[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockOrders
        .filter(order => order.type === type)
        .map(order => ({
          id: order.id,
          type: order.type,
          customer_name: order.customer_name,
          delivery_date: order.delivery_date,
          delivery_slot: order.delivery_slot,
          delivery_status: order.delivery_status,
          payment_status: order.payment_status,
          amount: order.amount,
          reference_id: order.reference_id,
          reference_label: order.reference_label,
        } as OrderListItem));
    }

    const res = await fetch(`${API_BASE_URL}/orders?type=${type}`);
    if (!res.ok) throw new Error('Failed to fetch orders by type');
    return res.json();
  },

  // GET orders by delivery status
  getOrdersByDeliveryStatus: async (status: DeliveryStatus): Promise<OrderListItem[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockOrders
        .filter(order => order.delivery_status === status)
        .map(order => ({
          id: order.id,
          type: order.type,
          customer_name: order.customer_name,
          delivery_date: order.delivery_date,
          delivery_slot: order.delivery_slot,
          delivery_status: order.delivery_status,
          payment_status: order.payment_status,
          amount: order.amount,
          reference_id: order.reference_id,
          reference_label: order.reference_label,
        } as OrderListItem));
    }

    const res = await fetch(`${API_BASE_URL}/orders?delivery_status=${status}`);
    if (!res.ok) throw new Error('Failed to fetch orders by status');
    return res.json();
  },

  // CREATE order
  createOrder: async (data: Omit<OrderDetail, 'id'>): Promise<OrderDetail> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const prefix = data.type === 'ONE_TIME' ? 'DEL' : data.type === 'BULK' ? 'DEL' : 'DEL';
      const newOrder: OrderDetail = {
        id: `${prefix}-${orderIdCounter++}`,
        ...data,
      };

      mockOrders.push(newOrder);
      return newOrder;
    }

    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  // UPDATE order
  updateOrder: async (id: string, data: Partial<OrderDetail>): Promise<OrderDetail> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockOrders.findIndex(order => order.id === id);
      if (index === -1) throw new Error('Order not found');

      mockOrders[index] = {
        ...mockOrders[index],
        ...data,
        id: mockOrders[index].id,
        updated_at: new Date().toISOString(),
      };

      return mockOrders[index];
    }

    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  },

  // DELETE order
  deleteOrder: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockOrders.findIndex(order => order.id === id);
      if (index === -1) throw new Error('Order not found');

      mockOrders.splice(index, 1);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete order');
  },

  // BULK DELETE orders
  bulkDeleteOrders: async (ids: string[]): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));

      mockOrders = mockOrders.filter(order => !ids.includes(order.id));
      return;
    }

    const res = await fetch(`${API_BASE_URL}/orders/bulk-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete orders');
  },

  // UPDATE order status
  updateOrderDeliveryStatus: async (
    id: string,
    status: DeliveryStatus
  ): Promise<OrderDetail> => {
    return orderApi.updateOrder(id, { delivery_status: status });
  },

  // UPDATE payment status
  updateOrderPaymentStatus: async (
    id: string,
    status: PaymentStatus
  ): Promise<OrderDetail> => {
    return orderApi.updateOrder(id, { payment_status: status });
  },
};

// Hooks
export const useOrders = (filters?: {
  type?: OrderType;
  delivery_status?: DeliveryStatus;
  payment_status?: PaymentStatus;
}) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderApi.getOrders(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes (orders change frequently)
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getOrder(id),
    staleTime: 1000 * 60 * 2,
    enabled: !!id,
  });
};

export const useOrdersByType = (type: OrderType) => {
  return useQuery({
    queryKey: orderKeys.byType(type),
    queryFn: () => orderApi.getOrdersByType(type),
    enabled: !!type,
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrdersByDeliveryStatus = (status: DeliveryStatus) => {
  return useQuery({
    queryKey: orderKeys.byStatus(status),
    queryFn: () => orderApi.getOrdersByDeliveryStatus(status),
    enabled: !!status,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<OrderDetail, 'id'>) => orderApi.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.byType(newOrder.type) });
      queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OrderDetail> }) =>
      orderApi.updateOrder(id, data),
    onSuccess: (updatedOrder, { id }) => {
      queryClient.setQueryData(orderKeys.detail(id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.byType(updatedOrder.type) });
      queryClient.invalidateQueries({ queryKey: orderKeys.byStatus(updatedOrder.delivery_status) });
    },
    onError: (error) => {
      console.error('Failed to update order:', error);
    },
  });
};

export const useUpdateOrderDeliveryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DeliveryStatus }) =>
      orderApi.updateOrderDeliveryStatus(id, status),
    onSuccess: (updatedOrder, { id }) => {
      queryClient.setQueryData(orderKeys.detail(id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update delivery status:', error);
    },
  });
};

export const useUpdateOrderPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      orderApi.updateOrderPaymentStatus(id, status),
    onSuccess: (updatedOrder, { id }) => {
      queryClient.setQueryData(orderKeys.detail(id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update payment status:', error);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderApi.deleteOrder(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: orderKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete order:', error);
    },
  });
};

export const useBulkDeleteOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => orderApi.bulkDeleteOrders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete orders:', error);
    },
  });
};

// Helper functions
export const resetMockOrders = () => {
  mockOrders = [...MOCK_ORDERS];
  orderIdCounter = parseInt(
    Math.max(...mockOrders.map(order => parseInt(order.id.split('-')[1]))).toString(),
    10
  ) + 1;
};

export const getMockOrders = () => [...mockOrders];

// Helper function to get order summary statistics
export const getOrderStatistics = () => {
  const stats = {
    totalOrders: mockOrders.length,
    totalRevenue: mockOrders.reduce((sum, order) => sum + (order.amount || 0), 0),
    byType: {
      ONE_TIME: mockOrders.filter(o => o.type === 'ONE_TIME').length,
      BULK: mockOrders.filter(o => o.type === 'BULK').length,
      SUBSCRIPTION: mockOrders.filter(o => o.type === 'SUBSCRIPTION').length,
    },
    byDeliveryStatus: {
      PENDING: mockOrders.filter(o => o.delivery_status === 'PENDING').length,
      PREPARING: mockOrders.filter(o => o.delivery_status === 'PREPARING').length,
      OUT_FOR_DELIVERY: mockOrders.filter(o => o.delivery_status === 'OUT_FOR_DELIVERY').length,
      DELIVERED: mockOrders.filter(o => o.delivery_status === 'DELIVERED').length,
      CANCELLED: mockOrders.filter(o => o.delivery_status === 'CANCELLED').length,
    },
    byPaymentStatus: {
      PENDING: mockOrders.filter(o => o.payment_status === 'PENDING').length,
      PARTIAL: mockOrders.filter(o => o.payment_status === 'PARTIAL').length,
      PAID: mockOrders.filter(o => o.payment_status === 'PAID').length,
      FAILED: mockOrders.filter(o => o.payment_status === 'FAILED').length,
      REFUNDED: mockOrders.filter(o => o.payment_status === 'REFUNDED').length,
      DUE: mockOrders.filter(o => o.payment_status === 'DUE').length,
    },
  };
  return stats;
};