// Auth types
export interface AuthToken {
  email: string;
  businessName?: string;
  loginTime: string;
  role?: 'customer' | 'caterer' | 'admin';
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'caterer' | 'admin';
  createdAt: string;
}

// Caterer types
export interface Caterer {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  description: string;
  image?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rating: number;
  reviewCount: number;
  minGuests: number;
  maxGuests: number;
  cuisineTypes: string[];
  availability: string[];
  verified: boolean;
  createdAt: string;
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
}

// Menu item types
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  servings: string;
  status: 'Available' | 'Out of Stock';
  description: string;
}

// Order types
export interface Order {
  id: string;
  customer: string;
  guests?: number;
  amount: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
}

// Event types
export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  guestCount: number;
  budget: number;
  description: string;
  dietaryRestrictions?: string[];
  createdAt: string;
}

// Quote types
export interface Quote {
  id: string;
  catererId: string;
  catererName: string;
  eventId: string;
  price: number;
  menuItems: MenuItem[];
  notes: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string;
}

// Review types
export interface Review {
  id: string;
  catererID: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Booking types
export interface Booking {
  id: string;
  customerId: string;
  catererId: string;
  eventId: string;
  eventDate: string;
  guestCount: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}