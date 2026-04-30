
interface MenuItem {
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
    images?: string[];
    image?: string;
    prepTime: number;
    servings: number;
  }
  
  interface MenuCategory {
    id:   string;
    category_id?: string;
    name: string;
    description: string;
    itemCount: number;
    icon: string;
    updatedAt: string;
    createdAt: string;
    displayOrder?: number;


  }
  
  interface EventPackage {
    id: number;
    name: string;
    description: string;
    type: 'event';
    pricing: 'per_person' | 'fixed';
    price: number;
    currency: string;
    servings: string;
    items: string[];
    addOns: { id: number; name: string; price: number }[];
    status: 'active' | 'inactive';
    createdDate: string;
    orders: number;
    minGuests?: number;
    maxGuests?: number;
    duration?: string;
  }
  
  interface Subscription {
    id: number;
    name: string;
    description: string;
    type: 'subscription';
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
  }


  export type { MenuItem, MenuCategory, EventPackage, Subscription };