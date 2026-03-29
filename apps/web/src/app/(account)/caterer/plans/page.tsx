'use client';

import { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ChevronDownIcon,
  TagIcon,
  UserGroupIcon,
  CalendarIcon,
  SparklesIcon,
  Bars3Icon,
  SquaresPlusIcon,
  StarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

// Image Upload Configuration
const IMAGE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  maxFiles: 5,
};

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
  id: number;
  name: string;
  description: string;
  itemCount: number;
  icon: string;
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

const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 1, name: 'Starters', description: 'Appetizers and snacks', itemCount: 12, icon: '🥘' },
  { id: 2, name: 'Main Course', description: 'Main dishes and curries', itemCount: 18, icon: '🍛' },
  { id: 3, name: 'Breads', description: 'Naan, Roti, Paratha', itemCount: 8, icon: '🥖' },
  { id: 4, name: 'Rice & Biryani', description: 'Rice dishes and Biryani', itemCount: 10, icon: '🍚' },
  { id: 5, name: 'Desserts', description: 'Sweet dishes', itemCount: 6, icon: '🍰' },
  { id: 6, name: 'Beverages', description: 'Drinks and juices', itemCount: 5, icon: '🥤' },
];

const MOCK_MENU_ITEMS: MenuItem[] = [
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

export default function CatererPlansPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'event' | 'subscription'>('menu');
  const [menuView, setMenuView] = useState<'grid' | 'list'>('grid');
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(MOCK_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [packages, setPackages] = useState<EventPackage[]>([
    {
      id: 1,
      name: 'Classic Vegetarian',
      description: 'A wonderful selection of vegetarian dishes',
      type: 'event',
      pricing: 'per_person',
      price: 350,
      currency: '₹',
      servings: '20-50',
      items: ['Paneer Tikka', 'Dal Makhani', 'Naan', 'Rice', 'Salad', 'Dessert'],
      addOns: [
        { id: 1, name: 'Extra Naan', price: 50 },
        { id: 2, name: 'Raita', price: 30 },
        { id: 3, name: 'Pickle & Papad', price: 25 },
      ],
      status: 'active',
      createdDate: 'March 15, 2025',
      orders: 12,
      minGuests: 20,
      maxGuests: 200,
    },
    {
      id: 2,
      name: 'Premium Non-Veg',
      description: 'Deluxe selection with premium meat items',
      type: 'event',
      pricing: 'per_person',
      price: 450,
      currency: '₹',
      servings: '30-100',
      items: ['Butter Chicken', 'Tandoori Chicken', 'Biryani', 'Naan', 'Dessert'],
      addOns: [
        { id: 1, name: 'Extra Chicken', price: 80 },
        { id: 2, name: 'Seafood', price: 120 },
      ],
      status: 'active',
      createdDate: 'March 10, 2025',
      orders: 8,
      minGuests: 30,
      maxGuests: 300,
    },
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 101,
      name: 'Healthy Morning Bundle',
      description: 'Perfect breakfast and light snacks',
      type: 'subscription',
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
    },
    {
      id: 102,
      name: 'Office Lunch Plan',
      description: 'Complete lunch solution for offices',
      type: 'subscription',
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
      addOns: [
        { id: 1, name: 'Extra Dessert', price: 300 },
      ],
      status: 'active',
      createdDate: 'February 15, 2025',
      subscribers: 8,
    },
  ]);

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<number | null>(null);

  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    offer: '',
    dietary: [] as string[],
    halal: false,
    vegan: false,
    glutenFree: false,
    nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
    optionalIngredients: [] as string[],
    availability: 'available' as const,
    prepTime: '',
    servings: '',
    images: [] as string[],
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: '🥘',
  });

  const [packageFormData, setPackageFormData] = useState({
    name: '',
    description: '',
    pricing: 'per_person' as const,
    price: '',
    servings: '',
    minGuests: '',
    maxGuests: '',
    duration: '',
    items: [] as string[],
    addOns: [] as { id: number; name: string; price: number }[],
  });

  const [subscriptionFormData, setSubscriptionFormData] = useState({
    name: '',
    description: '',
    mealType: 'breakfast' as const,
    duration: 'monthly' as const,
    price: '',
    mealsPerWeek: '',
    daysPerWeek: '',
    items: {} as Record<string, string[]>,
    addOns: [] as { id: number; name: string; price: number }[],
  });

  const [ingredientInput, setIngredientInput] = useState('');
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const dietaryOptions = [
    { value: 'vegetarian', label: '🌱 Vegetarian' },
    { value: 'vegan', label: '🥒 Vegan' },
    { value: 'non-vegetarian', label: '🍗 Non-Vegetarian' },
  ];

  const filteredMenuItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Image Upload Functions
  const validateImageFile = (file: File): string | null => {
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      return `File size exceeds ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit. File: ${file.name}`;
    }

    if (!IMAGE_UPLOAD_CONFIG.allowedFormats.includes(file.type)) {
      return `Invalid file format. Allowed formats: ${IMAGE_UPLOAD_CONFIG.allowedExtensions.join(', ')}. File: ${file.name}`;
    }

    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const errors: string[] = [];
    let filesProcessed = 0;

    const totalImages = menuFormData.images.length + files.length;
    if (totalImages > IMAGE_UPLOAD_CONFIG.maxFiles) {
      errors.push(
        `Maximum ${IMAGE_UPLOAD_CONFIG.maxFiles} images allowed. You're trying to upload ${totalImages} total.`
      );
    }

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setMenuFormData((prev) => ({
            ...prev,
            images: [...prev.images, e.target.result as string],
          }));
        }
        filesProcessed++;
      };
      reader.readAsDataURL(file);
    });

    setUploadErrors(errors);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setMenuFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setUploadErrors([]);
  };

  // Menu Management Functions
  const handleAddMenuCategory = () => {
    setEditingCategoryId(null);
    setCategoryFormData({ name: '', description: '', icon: '🥘' });
    setShowCategoryForm(true);
  };

  const handleSaveCategory = () => {
    if (!categoryFormData.name.trim()) {
      alert('Please enter category name');
      return;
    }

    if (editingCategoryId) {
      setMenuCategories(
        menuCategories.map((cat) =>
          cat.id === editingCategoryId
            ? {
                ...cat,
                name: categoryFormData.name,
                description: categoryFormData.description,
                icon: categoryFormData.icon,
              }
            : cat
        )
      );
    } else {
      const newCategory: MenuCategory = {
        id: Math.max(...menuCategories.map((c) => c.id), 0) + 1,
        name: categoryFormData.name,
        description: categoryFormData.description,
        icon: categoryFormData.icon,
        itemCount: 0,
      };
      setMenuCategories([...menuCategories, newCategory]);
    }

    setShowCategoryForm(false);
  };

  const handleAddMenuItem = () => {
    setEditingMenuId(null);
    setMenuFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      offer: '',
      dietary: [],
      halal: false,
      vegan: false,
      glutenFree: false,
      nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
      optionalIngredients: [],
      availability: 'available',
      prepTime: '',
      servings: '',
      images: [],
    });
    setUploadErrors([]);
    setShowMenuForm(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuId(item.id);
    setMenuFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      offer: (item.offer || 0).toString(),
      dietary: item.dietary,
      halal: item.halal,
      vegan: item.vegan,
      glutenFree: item.glutenFree,
      nutrition: {
        calories: item.nutrition.calories.toString(),
        protein: item.nutrition.protein.toString(),
        carbs: item.nutrition.carbs.toString(),
        fat: item.nutrition.fat.toString(),
        fiber: item.nutrition.fiber.toString(),
      },
      optionalIngredients: [...item.optionalIngredients],
      availability: item.availability,
      prepTime: item.prepTime.toString(),
      servings: item.servings.toString(),
      images: item.images || [],
    });
    setUploadErrors([]);
    setShowMenuForm(true);
  };

  const handleSaveMenuItem = () => {
    if (!menuFormData.name || !menuFormData.category || !menuFormData.price) {
      alert('Please fill all required fields');
      return;
    }

    const finalPrice = parseInt(menuFormData.price) - (parseInt(menuFormData.offer) || 0);

    if (editingMenuId) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingMenuId
            ? {
                ...item,
                name: menuFormData.name,
                category: menuFormData.category,
                description: menuFormData.description,
                price: parseInt(menuFormData.price),
                offer: parseInt(menuFormData.offer) || 0,
                finalPrice,
                dietary: menuFormData.dietary,
                halal: menuFormData.halal,
                vegan: menuFormData.vegan,
                glutenFree: menuFormData.glutenFree,
                nutrition: {
                  calories: parseInt(menuFormData.nutrition.calories) || 0,
                  protein: parseInt(menuFormData.nutrition.protein) || 0,
                  carbs: parseInt(menuFormData.nutrition.carbs) || 0,
                  fat: parseInt(menuFormData.nutrition.fat) || 0,
                  fiber: parseInt(menuFormData.nutrition.fiber) || 0,
                },
                optionalIngredients: menuFormData.optionalIngredients,
                availability: menuFormData.availability,
                prepTime: parseInt(menuFormData.prepTime) || 0,
                servings: parseInt(menuFormData.servings) || 1,
                images: menuFormData.images,
              }
            : item
        )
      );
    } else {
      const newMenuItem: MenuItem = {
        id: Math.max(...menuItems.map((i) => i.id), 0) + 1,
        name: menuFormData.name,
        category: menuFormData.category,
        description: menuFormData.description,
        price: parseInt(menuFormData.price),
        offer: parseInt(menuFormData.offer) || 0,
        finalPrice,
        dietary: menuFormData.dietary,
        halal: menuFormData.halal,
        vegan: menuFormData.vegan,
        glutenFree: menuFormData.glutenFree,
        nutrition: {
          calories: parseInt(menuFormData.nutrition.calories) || 0,
          protein: parseInt(menuFormData.nutrition.protein) || 0,
          carbs: parseInt(menuFormData.nutrition.carbs) || 0,
          fat: parseInt(menuFormData.nutrition.fat) || 0,
          fiber: parseInt(menuFormData.nutrition.fiber) || 0,
        },
        optionalIngredients: menuFormData.optionalIngredients,
        availability: menuFormData.availability,
        prepTime: parseInt(menuFormData.prepTime) || 0,
        servings: parseInt(menuFormData.servings) || 1,
        images: menuFormData.images,
      };
      setMenuItems([...menuItems, newMenuItem]);
    }

    setShowMenuForm(false);
    setUploadErrors([]);
  };

  const handleDeleteMenuItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  // Event Package Functions
  const handleAddPackage = () => {
    setEditingPackageId(null);
    setPackageFormData({
      name: '',
      description: '',
      pricing: 'per_person',
      price: '',
      servings: '',
      minGuests: '',
      maxGuests: '',
      duration: '',
      items: [],
      addOns: [],
    });
    setShowPackageForm(true);
  };

  const handleEditPackage = (pkg: EventPackage) => {
    setEditingPackageId(pkg.id);
    setPackageFormData({
      name: pkg.name,
      description: pkg.description,
      pricing: pkg.pricing,
      price: pkg.price.toString(),
      servings: pkg.servings,
      minGuests: pkg.minGuests?.toString() || '',
      maxGuests: pkg.maxGuests?.toString() || '',
      duration: pkg.duration || '',
      items: [...pkg.items],
      addOns: [...pkg.addOns],
    });
    setShowPackageForm(true);
  };

  const handleSavePackage = () => {
    if (!packageFormData.name || !packageFormData.price) {
      alert('Please fill required fields');
      return;
    }

    if (editingPackageId) {
      setPackages(
        packages.map((pkg) =>
          pkg.id === editingPackageId
            ? {
                ...pkg,
                name: packageFormData.name,
                description: packageFormData.description,
                pricing: packageFormData.pricing,
                price: parseInt(packageFormData.price),
                servings: packageFormData.servings,
                minGuests: packageFormData.minGuests ? parseInt(packageFormData.minGuests) : undefined,
                maxGuests: packageFormData.maxGuests ? parseInt(packageFormData.maxGuests) : undefined,
                duration: packageFormData.duration,
                items: packageFormData.items,
                addOns: packageFormData.addOns,
              }
            : pkg
        )
      );
    } else {
      const newPackage: EventPackage = {
        id: Math.max(...packages.map((p) => p.id), 0) + 1,
        name: packageFormData.name,
        description: packageFormData.description,
        type: 'event',
        pricing: packageFormData.pricing,
        price: parseInt(packageFormData.price),
        currency: '₹',
        servings: packageFormData.servings,
        items: packageFormData.items,
        addOns: packageFormData.addOns,
        status: 'active',
        createdDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        orders: 0,
        minGuests: packageFormData.minGuests ? parseInt(packageFormData.minGuests) : undefined,
        maxGuests: packageFormData.maxGuests ? parseInt(packageFormData.maxGuests) : undefined,
      };
      setPackages([...packages, newPackage]);
    }

    setShowPackageForm(false);
  };

  const handleDeletePackage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
    }
  };

  // Subscription Functions
  const handleAddSubscription = () => {
    setEditingSubscriptionId(null);
    setSubscriptionFormData({
      name: '',
      description: '',
      mealType: 'breakfast',
      duration: 'monthly',
      price: '',
      mealsPerWeek: '',
      daysPerWeek: '',
      items: {},
      addOns: [],
    });
    setShowSubscriptionForm(true);
  };

  const handleEditSubscription = (sub: Subscription) => {
    setEditingSubscriptionId(sub.id);
    setSubscriptionFormData({
      name: sub.name,
      description: sub.description,
      mealType: sub.mealType,
      duration: sub.duration,
      price: sub.price.toString(),
      mealsPerWeek: sub.mealsPerWeek.toString(),
      daysPerWeek: sub.daysPerWeek.toString(),
      items: { ...sub.items },
      addOns: [...sub.addOns],
    });
    setShowSubscriptionForm(true);
  };

  const handleSaveSubscription = () => {
    if (!subscriptionFormData.name || !subscriptionFormData.price) {
      alert('Please fill required fields');
      return;
    }

    if (editingSubscriptionId) {
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === editingSubscriptionId
            ? {
                ...sub,
                name: subscriptionFormData.name,
                description: subscriptionFormData.description,
                mealType: subscriptionFormData.mealType,
                duration: subscriptionFormData.duration,
                price: parseInt(subscriptionFormData.price),
                mealsPerWeek: parseInt(subscriptionFormData.mealsPerWeek) || 0,
                daysPerWeek: parseInt(subscriptionFormData.daysPerWeek) || 0,
                items: subscriptionFormData.items,
                addOns: subscriptionFormData.addOns,
              }
            : sub
        )
      );
    } else {
      const newSubscription: Subscription = {
        id: Math.max(...subscriptions.map((s) => s.id), 0) + 1,
        name: subscriptionFormData.name,
        description: subscriptionFormData.description,
        type: 'subscription',
        mealType: subscriptionFormData.mealType,
        duration: subscriptionFormData.duration,
        price: parseInt(subscriptionFormData.price),
        currency: '₹',
        mealsPerWeek: parseInt(subscriptionFormData.mealsPerWeek) || 0,
        daysPerWeek: parseInt(subscriptionFormData.daysPerWeek) || 0,
        items: subscriptionFormData.items,
        addOns: subscriptionFormData.addOns,
        status: 'active',
        createdDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        subscribers: 0,
      };
      setSubscriptions([...subscriptions, newSubscription]);
    }

    setShowSubscriptionForm(false);
  };

  const handleDeleteSubscription = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    }
  };

  const handleToggleDietary = (dietary: string) => {
    setMenuFormData({
      ...menuFormData,
      dietary: menuFormData.dietary.includes(dietary)
        ? menuFormData.dietary.filter((d) => d !== dietary)
        : [...menuFormData.dietary, dietary],
    });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Catering Management</h1>
          <p style={styles.subtitle}>Manage menu, packages and subscriptions</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('menu')}
          style={{
            ...styles.tab,
            ...(activeTab === 'menu' ? styles.tabActive : styles.tabInactive),
          }}
        >
          🍽️ Menu ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('event')}
          style={{
            ...styles.tab,
            ...(activeTab === 'event' ? styles.tabActive : styles.tabInactive),
          }}
        >
          <TagIcon style={{ width: '18px', height: '18px' }} />
          Event Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          style={{
            ...styles.tab,
            ...(activeTab === 'subscription' ? styles.tabActive : styles.tabInactive),
          }}
        >
          <CalendarIcon style={{ width: '18px', height: '18px' }} />
          Subscriptions ({subscriptions.length})
        </button>
      </div>

      {/* MENU TAB */}
      {activeTab === 'menu' && (
        <>
          {/* Menu Statistics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>🍽️</div>
              <div>
                <p style={styles.statLabel}>Total Items</p>
                <p style={styles.statValue}>{menuItems.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4' }}>📂</div>
              <div>
                <p style={styles.statLabel}>Categories</p>
                <p style={styles.statValue}>{menuCategories.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>✅</div>
              <div>
                <p style={styles.statLabel}>Available</p>
                <p style={styles.statValue}>
                  {menuItems.filter((i) => i.availability === 'available').length}
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>💰</div>
              <div>
                <p style={styles.statLabel}>Avg Price</p>
                <p style={styles.statValue}>
                  ₹
                  {menuItems.length > 0
                    ? Math.round(menuItems.reduce((sum, i) => sum + i.price, 0) / menuItems.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Management */}
          <div style={styles.menuManagement}>
            {/* Categories Section */}
            <div style={styles.categorySection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Categories</h2>
                <button onClick={handleAddMenuCategory} style={styles.buttonSmall}>
                  <PlusIcon style={{ width: '16px', height: '16px' }} />
                  Add Category
                </button>
              </div>

              <div style={styles.categoriesGrid}>
                {menuCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{
                      ...styles.categoryCard,
                      ...(selectedCategory === cat.name ? styles.categoryCardSelected : {}),
                    }}
                  >
                    <span style={styles.categoryIcon}>{cat.icon}</span>
                    <h4 style={styles.categoryName}>{cat.name}</h4>
                    <p style={styles.categoryCount}>{cat.itemCount} items</p>
                  </div>
                ))}
                <div
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    ...styles.categoryCard,
                    ...(selectedCategory === 'all' ? styles.categoryCardSelected : {}),
                  }}
                >
                  <span style={styles.categoryIcon}>📋</span>
                  <h4 style={styles.categoryName}>All Items</h4>
                  <p style={styles.categoryCount}>{menuItems.length} total</p>
                </div>
              </div>
            </div>

            {/* Menu Items Section */}
            <div style={styles.menuItemsSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  {selectedCategory === 'all' ? 'All Menu Items' : selectedCategory} (
                  {filteredMenuItems.length})
                </h2>
                <div style={styles.viewControls}>
                  <button
                    onClick={() => setMenuView('grid')}
                    style={{
                      ...styles.viewButton,
                      ...(menuView === 'grid' ? styles.viewButtonActive : {}),
                    }}
                    title="Grid View"
                  >
                    <SquaresPlusIcon style={{ width: '18px', height: '18px' }} />
                  </button>
                  <button
                    onClick={() => setMenuView('list')}
                    style={{
                      ...styles.viewButton,
                      ...(menuView === 'list' ? styles.viewButtonActive : {}),
                    }}
                    title="List View"
                  >
                    <Bars3Icon style={{ width: '18px', height: '18px' }} />
                  </button>
                  <button onClick={handleAddMenuItem} style={styles.buttonPrimary}>
                    <PlusIcon style={{ width: '18px', height: '18px' }} />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Grid View */}
              {menuView === 'grid' && (
                <div style={styles.menuItemsGrid}>
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((item) => (
                      <div key={item.id} style={styles.menuItemCard}>
                        {/* Image Display */}
                        {item.images && item.images.length > 0 && (
                          <div style={styles.itemImageContainer}>
                            <img src={item.images[0]} alt={item.name} style={styles.itemImage} />
                            {item.images.length > 1 && (
                              <div style={styles.imageCount}>{item.images.length} photos</div>
                            )}
                          </div>
                        )}

                        {/* Item Header */}
                        <div style={styles.itemCardHeader}>
                          <div>
                            <h3 style={styles.itemName}>{item.name}</h3>
                            <p style={styles.itemCategory}>{item.category}</p>
                          </div>
                          <span
                            style={{
                              ...styles.availabilityBadge,
                              backgroundColor:
                                item.availability === 'available'
                                  ? '#dcfce7'
                                  : item.availability === 'unavailable'
                                    ? '#fee2e2'
                                    : '#fef3c7',
                              color:
                                item.availability === 'available'
                                  ? '#166534'
                                  : item.availability === 'unavailable'
                                    ? '#991b1b'
                                    : '#92400e',
                            }}
                          >
                            {item.availability}
                          </span>
                        </div>

                        {/* Description */}
                        <p style={styles.itemDescription}>{item.description}</p>

                        {/* Price Section */}
                        <div style={styles.priceSection}>
                          <div style={styles.priceBox}>
                            <span style={styles.originalPrice}>₹{item.price}</span>
                            {item.offer > 0 && (
                              <>
                                <span style={styles.offerBadge}>{item.offer}% OFF</span>
                                <span style={styles.finalPrice}>₹{item.finalPrice}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Dietary & Standards */}
                        <div style={styles.dietarySection}>
                          {item.halal && <span style={styles.standardBadge}>🕌 Halal</span>}
                          {item.vegan && <span style={styles.standardBadge}>🌱 Vegan</span>}
                          {item.glutenFree && <span style={styles.standardBadge}>🌾 Gluten Free</span>}
                          {item.dietary.map((d) => (
                            <span key={d} style={styles.dietaryBadge}>
                              {d === 'vegetarian' && '🥬'}
                              {d === 'non-vegetarian' && '🍗'}
                              {d === 'vegan' && '🥒'}
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Nutrition Info */}
                        <div style={styles.nutritionGrid}>
                          <div style={styles.nutritionItem}>
                            <span style={styles.nutritionLabel}>Calories</span>
                            <span style={styles.nutritionValue}>{item.nutrition.calories}</span>
                          </div>
                          <div style={styles.nutritionItem}>
                            <span style={styles.nutritionLabel}>Protein</span>
                            <span style={styles.nutritionValue}>{item.nutrition.protein}g</span>
                          </div>
                          <div style={styles.nutritionItem}>
                            <span style={styles.nutritionLabel}>Carbs</span>
                            <span style={styles.nutritionValue}>{item.nutrition.carbs}g</span>
                          </div>
                          <div style={styles.nutritionItem}>
                            <span style={styles.nutritionLabel}>Fat</span>
                            <span style={styles.nutritionValue}>{item.nutrition.fat}g</span>
                          </div>
                        </div>

                        {/* Prep Time & Servings */}
                        <div style={styles.metaInfoRow}>
                          <span style={styles.metaInfo}>⏱️ {item.prepTime} min</span>
                          <span style={styles.metaInfo}>👥 {item.servings} servings</span>
                        </div>

                        {/* Optional Ingredients */}
                        {item.optionalIngredients.length > 0 && (
                          <div style={styles.ingredientsSection}>
                            <p style={styles.ingredientsTitle}>Optional Add-ons:</p>
                            <div style={styles.ingredientsList}>
                              {item.optionalIngredients.map((ing, idx) => (
                                <span key={idx} style={styles.ingredientBadge}>
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Item Actions */}
                        <div style={styles.itemActions}>
                          <button onClick={() => handleEditMenuItem(item)} style={styles.buttonItemEdit}>
                            <PencilIcon style={{ width: '14px', height: '14px' }} />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteMenuItem(item.id)} style={styles.buttonItemDelete}>
                            <TrashIcon style={{ width: '14px', height: '14px' }} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyState}>
                      <p>No items in this category</p>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {menuView === 'list' && (
                <div style={styles.menuItemsList}>
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((item) => (
                      <div key={item.id} style={styles.menuItemListRow}>
                        <div style={styles.listRowLeft}>
                          <h3 style={styles.itemName}>{item.name}</h3>
                          <p style={styles.itemDescription}>{item.description}</p>
                          <div style={styles.listRowTags}>
                            {item.dietary.map((d) => (
                              <span key={d} style={styles.dietaryBadge}>
                                {d}
                              </span>
                            ))}
                            {item.halal && <span style={styles.standardBadge}>🕌 Halal</span>}
                            {item.vegan && <span style={styles.standardBadge}>🌱 Vegan</span>}
                          </div>
                        </div>
                        <div style={styles.listRowMeta}>
                          <span style={styles.metaInfo}>⏱️ {item.prepTime} min</span>
                          <span style={styles.metaInfo}>👥 {item.servings} servings</span>
                          <span
                            style={{
                              ...styles.availabilityBadge,
                              backgroundColor:
                                item.availability === 'available' ? '#dcfce7' : '#fee2e2',
                              color: item.availability === 'available' ? '#166534' : '#991b1b',
                            }}
                          >
                            {item.availability}
                          </span>
                        </div>
                        <div style={styles.listRowPrice}>
                          {item.offer > 0 && <span style={styles.offerBadge}>{item.offer}% OFF</span>}
                          <span style={styles.finalPrice}>₹{item.finalPrice}</span>
                        </div>
                        <div style={styles.listRowActions}>
                          <button onClick={() => handleEditMenuItem(item)} style={styles.buttonSmall}>
                            <PencilIcon style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            style={styles.buttonSmallDanger}
                          >
                            <TrashIcon style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyState}>
                      <p>No items in this category</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Menu Item Form Modal */}
          {showMenuForm && (
            <div style={styles.modal}>
              <div style={styles.modalOverlay} onClick={() => setShowMenuForm(false)} />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>{editingMenuId ? 'Edit' : 'Add'} Menu Item</h2>
                  <button onClick={() => setShowMenuForm(false)} style={styles.closeButton}>
                    <XMarkIcon style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={styles.modalBody}>
                  {/* Image Upload Section */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Item Images</label>
                    <div style={styles.imageUploadContainer}>
                      <input
                        type="file"
                        multiple
                        accept={IMAGE_UPLOAD_CONFIG.allowedExtensions.join(',')}
                        onChange={handleImageUpload}
                        style={styles.fileInput}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" style={styles.uploadLabel}>
                        <PhotoIcon style={{ width: '32px', height: '32px' }} />
                        <span style={styles.uploadText}>Click to upload or drag and drop</span>
                        <small style={styles.uploadHint}>
                          {`PNG, JPG, JPEG, WEBP up to ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB (Max ${IMAGE_UPLOAD_CONFIG.maxFiles} files)`}
                        </small>
                      </label>
                    </div>

                    {/* Upload Errors */}
                    {uploadErrors.length > 0 && (
                      <div style={styles.errorContainer}>
                        {uploadErrors.map((error, idx) => (
                          <div key={idx} style={styles.errorMessage}>
                            ⚠️ {error}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Image Preview Gallery */}
                    {menuFormData.images.length > 0 && (
                      <div style={styles.imageGallery}>
                        <h4 style={styles.galleryTitle}>
                          Uploaded Images ({menuFormData.images.length}/{IMAGE_UPLOAD_CONFIG.maxFiles})
                        </h4>
                        <div style={styles.imageGrid}>
                          {menuFormData.images.map((image, idx) => (
                            <div key={idx} style={styles.imageCard}>
                              <img src={image} alt={`Preview ${idx + 1}`} style={styles.imagePreview} />
                              <button
                                onClick={() => handleRemoveImage(idx)}
                                style={styles.removeImageButton}
                                title="Remove image"
                              >
                                <TrashIcon style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Item Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Paneer Tikka"
                      value={menuFormData.name}
                      onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Category *</label>
                      <select
                        value={menuFormData.category}
                        onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                        style={styles.input}
                      >
                        <option value="">Select Category</option>
                        {menuCategories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Availability</label>
                      <select
                        value={menuFormData.availability}
                        onChange={(e) =>
                          setMenuFormData({ ...menuFormData, availability: e.target.value as any })
                        }
                        style={styles.input}
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="out-of-stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      placeholder="Item description"
                      value={menuFormData.description}
                      onChange={(e) =>
                        setMenuFormData({ ...menuFormData, description: e.target.value })
                      }
                      style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  {/* Pricing */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Price *</label>
                      <div style={styles.priceInput}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={menuFormData.price}
                          onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                          style={{ ...styles.input, marginLeft: 0, paddingLeft: '8px' }}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Offer (%)</label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={menuFormData.offer}
                        onChange={(e) => setMenuFormData({ ...menuFormData, offer: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  {/* Dietary Standards */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Dietary Standards</label>
                    <div style={styles.checkboxGroup}>
                      {dietaryOptions.map((option) => (
                        <label key={option.value} style={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={menuFormData.dietary.includes(option.value)}
                            onChange={() => handleToggleDietary(option.value)}
                            style={styles.checkbox}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Standards */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Special Standards</label>
                    <div style={styles.checkboxGroup}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={menuFormData.halal}
                          onChange={(e) => setMenuFormData({ ...menuFormData, halal: e.target.checked })}
                          style={styles.checkbox}
                        />
                        🕌 Halal Certified
                      </label>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={menuFormData.vegan}
                          onChange={(e) => setMenuFormData({ ...menuFormData, vegan: e.target.checked })}
                          style={styles.checkbox}
                        />
                        🌱 Vegan
                      </label>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={menuFormData.glutenFree}
                          onChange={(e) =>
                            setMenuFormData({ ...menuFormData, glutenFree: e.target.checked })
                          }
                          style={styles.checkbox}
                        />
                        🌾 Gluten Free
                      </label>
                    </div>
                  </div>

                  {/* Nutrition Info */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nutrition Information (per serving)</label>
                    <div style={styles.nutritionFormGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.smallLabel}>Calories</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={menuFormData.nutrition.calories}
                          onChange={(e) =>
                            setMenuFormData({
                              ...menuFormData,
                              nutrition: { ...menuFormData.nutrition, calories: e.target.value },
                            })
                          }
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.smallLabel}>Protein (g)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={menuFormData.nutrition.protein}
                          onChange={(e) =>
                            setMenuFormData({
                              ...menuFormData,
                              nutrition: { ...menuFormData.nutrition, protein: e.target.value },
                            })
                          }
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.smallLabel}>Carbs (g)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={menuFormData.nutrition.carbs}
                          onChange={(e) =>
                            setMenuFormData({
                              ...menuFormData,
                              nutrition: { ...menuFormData.nutrition, carbs: e.target.value },
                            })
                          }
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.smallLabel}>Fat (g)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={menuFormData.nutrition.fat}
                          onChange={(e) =>
                            setMenuFormData({
                              ...menuFormData,
                              nutrition: { ...menuFormData.nutrition, fat: e.target.value },
                            })
                          }
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.smallLabel}>Fiber (g)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={menuFormData.nutrition.fiber}
                          onChange={(e) =>
                            setMenuFormData({
                              ...menuFormData,
                              nutrition: { ...menuFormData.nutrition, fiber: e.target.value },
                            })
                          }
                          style={styles.input}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prep Time & Servings */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Prep Time (minutes)</label>
                      <input
                        type="number"
                        placeholder="15"
                        value={menuFormData.prepTime}
                        onChange={(e) => setMenuFormData({ ...menuFormData, prepTime: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Servings</label>
                      <input
                        type="number"
                        placeholder="2"
                        value={menuFormData.servings}
                        onChange={(e) => setMenuFormData({ ...menuFormData, servings: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div style={styles.formActions}>
                    <button onClick={() => setShowMenuForm(false)} style={styles.buttonSecondary}>
                      Cancel
                    </button>
                    <button onClick={handleSaveMenuItem} style={styles.buttonPrimary}>
                      {editingMenuId ? 'Update' : 'Add'} Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Form Modal */}
          {showCategoryForm && (
            <div style={styles.modal}>
              <div style={styles.modalOverlay} onClick={() => setShowCategoryForm(false)} />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>{editingCategoryId ? 'Edit' : 'Add'} Category</h2>
                  <button onClick={() => setShowCategoryForm(false)} style={styles.closeButton}>
                    <XMarkIcon style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={styles.modalBody}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Starters"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <input
                      type="text"
                      placeholder="Category description"
                      value={categoryFormData.description}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, description: e.target.value })
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Icon Emoji</label>
                    <input
                      type="text"
                      placeholder="e.g., 🥘"
                      value={categoryFormData.icon}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formActions}>
                    <button onClick={() => setShowCategoryForm(false)} style={styles.buttonSecondary}>
                      Cancel
                    </button>
                    <button onClick={handleSaveCategory} style={styles.buttonPrimary}>
                      {editingCategoryId ? 'Update' : 'Add'} Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* EVENT PACKAGES TAB */}
      {activeTab === 'event' && (
        <>
          {/* Event Packages Statistics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>📦</div>
              <div>
                <p style={styles.statLabel}>Total Packages</p>
                <p style={styles.statValue}>{packages.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4' }}>✅</div>
              <div>
                <p style={styles.statLabel}>Active</p>
                <p style={styles.statValue}>{packages.filter((p) => p.status === 'active').length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>📊</div>
              <div>
                <p style={styles.statLabel}>Total Orders</p>
                <p style={styles.statValue}>{packages.reduce((sum, p) => sum + p.orders, 0)}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#fee2e2' }}>💰</div>
              <div>
                <p style={styles.statLabel}>Avg Price</p>
                <p style={styles.statValue}>
                  ₹
                  {packages.length > 0
                    ? Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Event Packages List */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Event Packages</h2>
              <button onClick={handleAddPackage} style={styles.buttonPrimary}>
                <PlusIcon style={{ width: '18px', height: '18px' }} />
                Add Package
              </button>
            </div>

            {packages.length > 0 ? (
              <div style={styles.packagesList}>
                {packages.map((pkg) => (
                  <div key={pkg.id} style={styles.packageCard}>
                    <div style={styles.packageHeader}>
                      <div style={styles.packageInfo}>
                        <h3 style={styles.packageName}>{pkg.name}</h3>
                        <p style={styles.packageDescription}>{pkg.description}</p>
                        <div style={styles.packageMeta}>
                          <span style={styles.metaBadge}>👥 {pkg.servings}</span>
                          <span style={styles.metaBadge}>📅 {pkg.createdDate}</span>
                          <span style={styles.metaBadge}>📦 {pkg.orders} orders</span>
                        </div>
                      </div>
                      <div style={styles.packageStatus}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: pkg.status === 'active' ? '#dcfce7' : '#fee2e2',
                            color: pkg.status === 'active' ? '#166534' : '#991b1b',
                          }}
                        >
                          {pkg.status}
                        </span>
                      </div>
                    </div>

                    <div style={styles.packageContent}>
                      <div style={styles.packageItems}>
                        <h4 style={styles.contentTitle}>📝 Items Included:</h4>
                        <div style={styles.itemsList}>
                          {pkg.items.map((item, idx) => (
                            <span key={idx} style={styles.itemTag}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {pkg.addOns && pkg.addOns.length > 0 && (
                        <div style={styles.packageAddOns}>
                          <h4 style={styles.contentTitle}>➕ Add-ons Available:</h4>
                          <div style={styles.addOnsList}>
                            {pkg.addOns.map((addon) => (
                              <span key={addon.id} style={styles.addonTag}>
                                {addon.name} <span style={styles.addonPrice}>(₹{addon.price})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={styles.packagePricing}>
                        <span style={styles.pricingLabel}>
                          {pkg.pricing === 'per_person' ? 'Price per Person' : 'Fixed Price'}
                        </span>
                        <span style={styles.pricingValue}>₹{pkg.price}</span>
                      </div>
                    </div>

                    <div style={styles.packageActions}>
                      <button onClick={() => handleEditPackage(pkg)} style={styles.buttonItemEdit}>
                        <PencilIcon style={{ width: '14px', height: '14px' }} />
                        Edit
                      </button>
                      <button onClick={() => handleDeletePackage(pkg.id)} style={styles.buttonItemDelete}>
                        <TrashIcon style={{ width: '14px', height: '14px' }} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No event packages created yet. Start by creating one!</p>
              </div>
            )}
          </div>

          {/* Event Package Form Modal */}
          {showPackageForm && (
            <div style={styles.modal}>
              <div style={styles.modalOverlay} onClick={() => setShowPackageForm(false)} />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>{editingPackageId ? 'Edit' : 'Add'} Event Package</h2>
                  <button onClick={() => setShowPackageForm(false)} style={styles.closeButton}>
                    <XMarkIcon style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={styles.modalBody}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Package Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Classic Vegetarian"
                      value={packageFormData.name}
                      onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      placeholder="Package description"
                      value={packageFormData.description}
                      onChange={(e) =>
                        setPackageFormData({ ...packageFormData, description: e.target.value })
                      }
                      style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Pricing Type</label>
                      <select
                        value={packageFormData.pricing}
                        onChange={(e) =>
                          setPackageFormData({ ...packageFormData, pricing: e.target.value as any })
                        }
                        style={styles.input}
                      >
                        <option value="per_person">Per Person</option>
                        <option value="fixed">Fixed Price</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Price *</label>
                      <div style={styles.priceInput}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={packageFormData.price}
                          onChange={(e) =>
                            setPackageFormData({ ...packageFormData, price: e.target.value })
                          }
                          style={{ ...styles.input, marginLeft: 0, paddingLeft: '8px' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Min Guests</label>
                      <input
                        type="number"
                        placeholder="e.g., 20"
                        value={packageFormData.minGuests}
                        onChange={(e) =>
                          setPackageFormData({ ...packageFormData, minGuests: e.target.value })
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Max Guests</label>
                      <input
                        type="number"
                        placeholder="e.g., 200"
                        value={packageFormData.maxGuests}
                        onChange={(e) =>
                          setPackageFormData({ ...packageFormData, maxGuests: e.target.value })
                        }
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formActions}>
                    <button onClick={() => setShowPackageForm(false)} style={styles.buttonSecondary}>
                      Cancel
                    </button>
                    <button onClick={handleSavePackage} style={styles.buttonPrimary}>
                      {editingPackageId ? 'Update' : 'Add'} Package
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUBSCRIPTIONS TAB */}
      {activeTab === 'subscription' && (
        <>
          {/* Subscriptions Statistics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>📅</div>
              <div>
                <p style={styles.statLabel}>Total Plans</p>
                <p style={styles.statValue}>{subscriptions.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4' }}>👥</div>
              <div>
                <p style={styles.statLabel}>Total Subscribers</p>
                <p style={styles.statValue}>
                  {subscriptions.reduce((sum, s) => sum + s.subscribers, 0)}
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>✅</div>
              <div>
                <p style={styles.statLabel}>Active Plans</p>
                <p style={styles.statValue}>
                  {subscriptions.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>💰</div>
              <div>
                <p style={styles.statLabel}>Avg Monthly Price</p>
                <p style={styles.statValue}>
                  ₹
                  {subscriptions.length > 0
                    ? Math.round(
                        subscriptions.reduce((sum, s) => sum + s.price, 0) / subscriptions.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Subscriptions List */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Subscription Plans</h2>
              <button onClick={handleAddSubscription} style={styles.buttonPrimary}>
                <PlusIcon style={{ width: '18px', height: '18px' }} />
                Add Plan
              </button>
            </div>

            {subscriptions.length > 0 ? (
              <div style={styles.subscriptionsList}>
                {subscriptions.map((sub) => (
                  <div key={sub.id} style={styles.subscriptionCard}>
                    <div style={styles.subscriptionHeader}>
                      <div style={styles.subscriptionInfo}>
                        <h3 style={styles.subscriptionName}>{sub.name}</h3>
                        <p style={styles.subscriptionDescription}>{sub.description}</p>
                        <div style={styles.subscriptionMeta}>
                          <span style={styles.metaBadge}>
                            {sub.mealType === 'breakfast' && '🌅'}
                            {sub.mealType === 'lunch' && '🍽️'}
                            {sub.mealType === 'dinner' && '🌙'}
                            {sub.mealType === 'mixed' && '🍴'}
                            {sub.mealType}
                          </span>
                          <span style={styles.metaBadge}>📆 {sub.duration}</span>
                          <span style={styles.metaBadge}>👥 {sub.subscribers} subscribers</span>
                          <span style={styles.metaBadge}>📅 {sub.createdDate}</span>
                        </div>
                      </div>
                      <div style={styles.subscriptionStatus}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: sub.status === 'active' ? '#dcfce7' : '#fee2e2',
                            color: sub.status === 'active' ? '#166534' : '#991b1b',
                          }}
                        >
                          {sub.status}
                        </span>
                      </div>
                    </div>

                    <div style={styles.subscriptionContent}>
                      <div style={styles.subscriptionDetails}>
                        <h4 style={styles.contentTitle}>📅 Meals & Days:</h4>
                        <p style={styles.detailText}>
                          {sub.mealsPerWeek} meals per week • {sub.daysPerWeek} days per week
                        </p>
                      </div>

                      {Object.entries(sub.items).length > 0 && (
                        <div style={styles.subscriptionItems}>
                          <h4 style={styles.contentTitle}>🍽️ Meal Items:</h4>
                          {Object.entries(sub.items).map(([category, items]) => (
                            <div key={category} style={styles.itemCategory}>
                              <p style={styles.itemCategoryTitle}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}:
                              </p>
                              <div style={styles.itemsList}>
                                {items.map((item, idx) => (
                                  <span key={idx} style={styles.itemTag}>
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {sub.addOns && sub.addOns.length > 0 && (
                        <div style={styles.subscriptionAddOns}>
                          <h4 style={styles.contentTitle}>➕ Add-ons:</h4>
                          <div style={styles.addOnsList}>
                            {sub.addOns.map((addon) => (
                              <span key={addon.id} style={styles.addonTag}>
                                {addon.name} <span style={styles.addonPrice}>(₹{addon.price})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={styles.subscriptionPricing}>
                        <span style={styles.pricingLabel}>Monthly Price</span>
                        <span style={styles.pricingValue}>₹{sub.price}</span>
                      </div>
                    </div>

                    <div style={styles.subscriptionActions}>
                      <button onClick={() => handleEditSubscription(sub)} style={styles.buttonItemEdit}>
                        <PencilIcon style={{ width: '14px', height: '14px' }} />
                        Edit
                      </button>
                      <button onClick={() => handleDeleteSubscription(sub.id)} style={styles.buttonItemDelete}>
                        <TrashIcon style={{ width: '14px', height: '14px' }} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No subscription plans created yet. Start by creating one!</p>
              </div>
            )}
          </div>

          {/* Subscription Form Modal */}
          {showSubscriptionForm && (
            <div style={styles.modal}>
              <div style={styles.modalOverlay} onClick={() => setShowSubscriptionForm(false)} />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    {editingSubscriptionId ? 'Edit' : 'Add'} Subscription Plan
                  </h2>
                  <button onClick={() => setShowSubscriptionForm(false)} style={styles.closeButton}>
                    <XMarkIcon style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={styles.modalBody}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Plan Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Healthy Morning Bundle"
                      value={subscriptionFormData.name}
                      onChange={(e) =>
                        setSubscriptionFormData({ ...subscriptionFormData, name: e.target.value })
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      placeholder="Plan description"
                      value={subscriptionFormData.description}
                      onChange={(e) =>
                        setSubscriptionFormData({
                          ...subscriptionFormData,
                          description: e.target.value,
                        })
                      }
                      style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Meal Type</label>
                      <select
                        value={subscriptionFormData.mealType}
                        onChange={(e) =>
                          setSubscriptionFormData({
                            ...subscriptionFormData,
                            mealType: e.target.value as any,
                          })
                        }
                        style={styles.input}
                      >
                        <option value="breakfast">🌅 Breakfast</option>
                        <option value="lunch">🍽️ Lunch</option>
                        <option value="dinner">🌙 Dinner</option>
                        <option value="mixed">🍴 Mixed</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Duration</label>
                      <select
                        value={subscriptionFormData.duration}
                        onChange={(e) =>
                          setSubscriptionFormData({
                            ...subscriptionFormData,
                            duration: e.target.value as any,
                          })
                        }
                        style={styles.input}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Price *</label>
                      <div style={styles.priceInput}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={subscriptionFormData.price}
                          onChange={(e) =>
                            setSubscriptionFormData({ ...subscriptionFormData, price: e.target.value })
                          }
                          style={{ ...styles.input, marginLeft: 0, paddingLeft: '8px' }}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Meals/Week</label>
                      <input
                        type="number"
                        placeholder="5"
                        value={subscriptionFormData.mealsPerWeek}
                        onChange={(e) =>
                          setSubscriptionFormData({
                            ...subscriptionFormData,
                            mealsPerWeek: e.target.value,
                          })
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Days/Week</label>
                      <input
                        type="number"
                        placeholder="5"
                        value={subscriptionFormData.daysPerWeek}
                        onChange={(e) =>
                          setSubscriptionFormData({
                            ...subscriptionFormData,
                            daysPerWeek: e.target.value,
                          })
                        }
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formActions}>
                    <button onClick={() => setShowSubscriptionForm(false)} style={styles.buttonSecondary}>
                      Cancel
                    </button>
                    <button onClick={handleSaveSubscription} style={styles.buttonPrimary}>
                      {editingSubscriptionId ? 'Update' : 'Add'} Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderBottom: '3px solid #2563eb',
  },
  tabInactive: {
    backgroundColor: 'transparent',
    color: '#64748b',
    borderBottom: '3px solid transparent',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: 0,
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '4px 0 0 0',
  },
  viewControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  viewButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#2563eb',
  },
  menuManagement: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
  },
  categorySection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  menuItemsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
  },
  categoryCard: {
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
  },
  categoryCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  categoryIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '8px',
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  categoryCount: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  menuItemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },
  menuItemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  menuItemListRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    gap: '16px',
  },
  listRowLeft: {
    flex: 1,
  },
  listRowMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    minWidth: '200px',
  },
  listRowTags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    marginTop: '8px',
  },
  listRowPrice: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '4px',
  },
  listRowActions: {
    display: 'flex',
    gap: '8px',
  },
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
  },
  itemImageContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '200px',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },
  imageCount: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  itemCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 16px 12px 16px',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  itemCategory: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  availabilityBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap' as const,
  },
  itemDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
    padding: '0 16px',
  },
  priceSection: {
    marginBottom: '12px',
    padding: '0 16px',
  },
  priceBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  originalPrice: {
    fontSize: '14px',
    color: '#9ca3af',
    textDecoration: 'line-through',
  },
  offerBadge: {
    padding: '2px 6px',
    backgroundColor: '#fecaca',
    color: '#991b1b',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
  },
  finalPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#10b981',
  },
  dietarySection: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    marginBottom: '12px',
    padding: '0 16px',
  },
  standardBadge: {
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  dietaryBadge: {
    padding: '3px 8px',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '12px',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    margin: '0 16px 12px 16px',
  },
  nutritionItem: {
    textAlign: 'center' as const,
  },
  nutritionLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
  },
  nutritionValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    display: 'block',
  },
  metaInfoRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    padding: '0 16px',
  },
  metaInfo: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  ingredientsSection: {
    marginBottom: '12px',
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    margin: '0 16px 12px 16px',
  },
  ingredientsTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 8px 0',
  },
  ingredientsList: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  ingredientBadge: {
    padding: '2px 6px',
    backgroundColor: '#fcd34d',
    color: '#78350f',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  buttonItemEdit: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: 'white',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  buttonItemDelete: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #dc2626',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  buttonSmall: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  buttonSmallDanger: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #dc2626',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  section: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  packagesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '16px',
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
  packageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  packageDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  packageMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  metaBadge: {
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  packageStatus: {
    marginLeft: '16px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  packageContent: {
    flex: 1,
    marginBottom: '16px',
  },
  contentTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  packageItems: {
    marginBottom: '12px',
  },
  itemsList: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  itemTag: {
    padding: '3px 8px',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  packageAddOns: {
    marginBottom: '12px',
  },
  addOnsList: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  addonTag: {
    padding: '3px 8px',
    backgroundColor: '#e9d5ff',
    color: '#6b21a8',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  addonPrice: {
    fontSize: '10px',
    opacity: 0.8,
  },
  packagePricing: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  pricingLabel: {
    fontSize: '12px',
    color: '#166534',
    fontWeight: '600',
  },
  pricingValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#166534',
  },
  packageActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  subscriptionsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
    gap: '16px',
  },
  subscriptionCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
  subscriptionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  subscriptionDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  subscriptionMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  subscriptionStatus: {
    marginLeft: '16px',
  },
  subscriptionContent: {
    flex: 1,
    marginBottom: '16px',
  },
  subscriptionDetails: {
    marginBottom: '12px',
  },
  detailText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  subscriptionItems: {
    marginBottom: '12px',
  },
  itemCategory: {
    marginBottom: '8px',
  },
  itemCategoryTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  subscriptionAddOns: {
    marginBottom: '12px',
  },
  subscriptionPricing: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  subscriptionActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#64748b',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'relative' as const,
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  smallLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  priceInput: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  currencySymbol: {
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    borderRight: '1px solid #e2e8f0',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  nutritionFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  imageUploadContainer: {
    borderRadius: '8px',
    border: '2px dashed #cbd5e1',
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#64748b',
  },
  uploadText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
    display: 'block',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginTop: '12px',
  },
  errorMessage: {
    padding: '10px 12px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '6px',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  imageGallery: {
    marginTop: '16px',
  },
  galleryTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
  },
  imageCard: {
    position: 'relative' as const,
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  imagePreview: {
    width: '100%',
    height: '120px',
    objectFit: 'cover' as const,
    display: 'block',
  },
  removeImageButton: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
};