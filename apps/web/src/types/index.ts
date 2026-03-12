export interface Caterer {
  id: string;
  name: string;
  services: string[];
  description: string;
  rating: number;
  imageUrl: string;
}

export interface Menu {
  id: string;
  catererId: string;
  title: string;
  description: string;
  price: number;
  available: boolean;
}

export interface Cater {
  id: number;
  name: string;
  cuisine: string;
  pricePerPerson: number;
  reviews: number;
  rating: number;
}