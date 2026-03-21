import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/axios';

export interface CateringService {
  id: number;
  title: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerPerson: string;
  guestCount: string;
  tags: string[];
  isFeatured: boolean;
  description: string;
  duration: string;
  included: string[];
}

// Mock catering data
export const mockCateringServices: CateringService[] = [
  {
    id: 1,
    title: "Premium Multi-Cuisine Catering",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 528,
    pricePerPerson: "₹2,499",
    guestCount: "50-500",
    tags: ["Multi-Cuisine", "Premium", "Full Service"],
    isFeatured: true,
    description: "Exquisite culinary excellence for your special events with professional service",
    duration: "Customizable",
    included: ["Customized menu", "Professional waitstaff", "Premium plating", "Bar service"],
  },
  {
    id: 2,
    title: "Italian Fine Dining Catering",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 342,
    pricePerPerson: "₹1,999",
    guestCount: "20-200",
    tags: ["Italian", "Fine Dining", "European"],
    isFeatured: false,
    description: "Authentic Italian cuisine prepared by certified Italian chefs",
    duration: "Customizable",
    included: ["4-course menu", "Wine pairings", "Chef supervision", "Elegant plating"],
  },
  {
    id: 3,
    title: "Indian Feast Catering Service",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 612,
    pricePerPerson: "₹1,499",
    guestCount: "50-1000",
    tags: ["Indian", "Traditional", "Authentic"],
    isFeatured: true,
    description: "Authentic Indian catering with traditional recipes and modern presentation",
    duration: "Customizable",
    included: ["Multi-course Indian menu", "Dessert options", "Beverage service", "Setup & cleanup"],
  },
  {
    id: 4,
    title: "Asian Fusion Catering",
    location: "Singapore, Singapore",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop",
    rating: 4.7,
    reviews: 289,
    pricePerPerson: "₹1,799",
    guestCount: "30-300",
    tags: ["Asian Fusion", "Modern", "Creative"],
    isFeatured: false,
    description: "Creative blend of Asian cuisines with contemporary plating",
    duration: "Customizable",
    included: ["Fusion menu", "Chef's special", "Live cooking station", "Drink pairings"],
  },
  {
    id: 5,
    title: "Vegetarian Gourmet Catering",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 276,
    pricePerPerson: "₹1,299",
    guestCount: "20-400",
    tags: ["Vegetarian", "Gourmet", "Healthy"],
    isFeatured: true,
    description: "Sophisticated vegetarian and vegan menus for conscious diners",
    duration: "Customizable",
    included: ["Gourmet veg menu", "Vegan options", "Nutritionist-approved", "Creative plating"],
  },
  {
    id: 6,
    title: "BBQ & Grill Catering",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=300&fit=crop",
    rating: 4.6,
    reviews: 198,
    pricePerPerson: "₹999",
    guestCount: "50-300",
    tags: ["BBQ", "Casual", "Outdoor"],
    isFeatured: false,
    description: "Smoky, delicious BBQ and grilled specialties for casual gatherings",
    duration: "Customizable",
    included: ["Smoked meats", "Grilled vegetables", "Sides & sauces", "Outdoor setup"],
  },
];

export const cateringServicesQueryKeys = {
  all: ['cateringServices'] as const,
  list: () => [...cateringServicesQueryKeys.all, 'list'] as const,
  filtered: (filters?: any) => [...cateringServicesQueryKeys.list(), { filters }] as const,
};

export const useCateringServices = (filters?: any) => {
  return useQuery({
    queryKey: cateringServicesQueryKeys.filtered(filters),
    queryFn: async (): Promise<CateringService[]> => {
      try {
        const response = await apiClient.get('/catering/services', { params: filters });
        return response.data;
      } catch (error) {
        console.warn('Using mock catering services');
        return mockCateringServices;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};