export interface MenuCategory {
    id: number;
    name: string;
    description: string;
    itemCount: number;
    icon: string;
}

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


export const MOCK_CATEGORIES: MenuCategory[] = [
    { id: 1, name: 'Starters', description: 'Appetizers and snacks', itemCount: 12, icon: '🥘' },
    { id: 2, name: 'Main Course', description: 'Main dishes and curries', itemCount: 18, icon: '🍛' },
    { id: 3, name: 'Breads', description: 'Naan, Roti, Paratha', itemCount: 8, icon: '🥖' },
    { id: 4, name: 'Rice & Biryani', description: 'Rice dishes and Biryani', itemCount: 10, icon: '🍚' },
    { id: 5, name: 'Desserts', description: 'Sweet dishes', itemCount: 6, icon: '🍰' },
    { id: 6, name: 'Beverages', description: 'Drinks and juices', itemCount: 5, icon: '🥤' },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
    {
        id: 1,
        name: 'Paneer Tikka',
        category: 'Starters',
        description: 'Cottage cheese marinated in yogurt and spices, grilled to perfection',
        price: 250,
        offer: 10,
        finalPrice: 225,
        dietary: ['vegetarian'],
        halal: false,
        vegan: false,
        glutenFree: true,
        nutrition: { calories: 180, protein: 22, carbs: 5, fat: 8, fiber: 1 },
        optionalIngredients: ['Extra Mint', 'Lemon'],
        availability: 'available',
        images: [],
        prepTime: 15,
        servings: 2,
    },
    {
        id: 2,
        name: 'Butter Chicken',
        category: 'Main Course',
        description: 'Tender chicken in a creamy tomato-based sauce with butter and cream',
        price: 320,
        offer: 0,
        finalPrice: 320,
        dietary: ['non-vegetarian'],
        halal: true,
        vegan: false,
        glutenFree: true,
        nutrition: { calories: 280, protein: 32, carbs: 8, fat: 14, fiber: 0 },
        optionalIngredients: ['Extra Cream', 'Green Peas'],
        availability: 'available',
        images: [],
        prepTime: 20,
        servings: 2,
    },
    {
        id: 3,
        name: 'Tandoori Naan',
        category: 'Breads',
        description: 'Traditional Indian bread baked in a clay oven',
        price: 80,
        offer: 0,
        finalPrice: 80,
        dietary: ['vegetarian'],
        halal: false,
        vegan: false,
        glutenFree: false,
        nutrition: { calories: 250, protein: 8, carbs: 45, fat: 3, fiber: 2 },
        optionalIngredients: ['Garlic', 'Butter', 'Cheese'],
        availability: 'available',
        images: [],
        prepTime: 5,
        servings: 1,
    },
    {
        id: 4,
        name: 'Biryani',
        category: 'Rice & Biryani',
        description: 'Fragrant rice cooked with meat and spices',
        price: 280,
        offer: 15,
        finalPrice: 238,
        dietary: ['non-vegetarian'],
        halal: true,
        vegan: false,
        glutenFree: true,
        nutrition: { calories: 450, protein: 28, carbs: 52, fat: 16, fiber: 3 },
        optionalIngredients: ['Extra Meat', 'Boiled Eggs'],
        availability: 'available',
        images: [],
        prepTime: 25,
        servings: 2,
    },
];