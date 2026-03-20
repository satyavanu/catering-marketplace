export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CatererData {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  price: number;
}

export interface VenueData {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
}

export interface DecorationData {
  id: string;
  name: string;
  type: string;
  price: number;
}

export interface NewsletterSubscription {
  email: string;
}