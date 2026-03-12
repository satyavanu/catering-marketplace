export const STATUS_COLORS = {
  Completed: { bg: '#d1fae5', text: '#065f46' },
  Processing: { bg: '#fef3c7', text: '#92400e' },
  Pending: { bg: '#fee2e2', text: '#991b1b' },
  Cancelled: { bg: '#f3f4f6', text: '#4b5563' },
} as const;

export const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Orders', href: '/dashboard/orders', icon: '📋' },
  { label: 'Menu', href: '/dashboard/menu', icon: '🍽️' },
  { label: 'Customers', href: '/dashboard/customers', icon: '👥' },
  { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
] as const;

export const API_BASE_URL = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  : process.env.API_URL || 'http://localhost:3000';

export const ROLES = {
  CUSTOMER: 'customer',
  CATERER: 'caterer',
  ADMIN: 'admin',
} as const;

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const MENU_STATUS = {
  AVAILABLE: 'Available',
  OUT_OF_STOCK: 'Out of Stock',
} as const;