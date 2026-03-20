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
  company: string;
  type: string;
  theme: string;
  rating: number;
  reviews: number;
  image: string;
  details: string;
  country: string;
  price: any;
}

export interface NewsletterSubscription {
  email: string;
}

export interface Reply {
  id: string;
  name: string;
  text: string;
  date: string;
  avatar?: string;
  isOwner?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  verified?: boolean;
  helpful?: number;
  replies?: Reply[];
}