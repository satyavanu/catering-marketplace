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
} from '@heroicons/react/24/outline';

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
    prepTime: 25,
    servings: 2,
  },
];

export default function CatererPlansPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'event' | 'subscription'>('menu');
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(MOCK_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [packages, setPackages] = useState([
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
    },
  ]);

  const [subscriptions, setSubscriptions] = useState([
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
  ]);

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

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
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: '🥘',
  });

  const [ingredientInput, setIngredientInput] = useState('');

  const dietaryOptions = [
    { value: 'vegetarian', label: '🌱 Vegetarian' },
    { value: 'vegan', label: '🥒 Vegan' },
    { value: 'non-vegetarian', label: '🍗 Non-Vegetarian' },
  ];

  const filteredMenuItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

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
    });
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
    });
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
      };
      setMenuItems([...menuItems, newMenuItem]);
    }

    setShowMenuForm(false);
  };

  const handleDeleteMenuItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setMenuFormData({
        ...menuFormData,
        optionalIngredients: [...menuFormData.optionalIngredients, ingredientInput.trim()],
      });
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setMenuFormData({
      ...menuFormData,
      optionalIngredients: menuFormData.optionalIngredients.filter((_, i) => i !== index),
    });
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
                <p style={styles.statValue}>{menuItems.filter((i) => i.availability === 'available').length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>💰</div>
              <div>
                <p style={styles.statLabel}>Avg Price</p>
                <p style={styles.statValue}>
                  ₹{menuItems.length > 0 ? Math.round(menuItems.reduce((sum, i) => sum + i.price, 0) / menuItems.length) : 0}
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
                  {selectedCategory === 'all' ? 'All Menu Items' : selectedCategory}
                </h2>
                <button onClick={handleAddMenuItem} style={styles.buttonPrimary}>
                  <PlusIcon style={{ width: '18px', height: '18px' }} />
                  Add Item
                </button>
              </div>

              <div style={styles.menuItemsGrid}>
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item) => (
                    <div key={item.id} style={styles.menuItemCard}>
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
                        <button
                          onClick={() => handleEditMenuItem(item)}
                          style={styles.buttonItemEdit}
                        >
                          <PencilIcon style={{ width: '14px', height: '14px' }} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          style={styles.buttonItemDelete}
                        >
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
            </div>
          </div>

          {/* Menu Item Form Modal */}
          {showMenuForm && (
            <div style={styles.modal}>
              <div style={styles.modalOverlay} onClick={() => setShowMenuForm(false)} />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>{editingMenuId ? 'Edit' : 'Add'} Menu Item</h2>
                  <button
                    onClick={() => setShowMenuForm(false)}
                    style={styles.closeButton}
                  >
                    <XMarkIcon style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={styles.modalBody}>
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
                        onChange={(e) => setMenuFormData({ ...menuFormData, availability: e.target.value as any })}
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
                      onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
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
                      <label style={styles.label}>Offer (%) </label>
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
                          onChange={(e) => setMenuFormData({ ...menuFormData, glutenFree: e.target.checked })}
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

                  {/* Optional Ingredients */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Optional Ingredients</label>
                    <div style={styles.ingredientsContainer}>
                      {menuFormData.optionalIngredients.map((ing, idx) => (
                        <div key={idx} style={styles.ingredientTag}>
                          <span>{ing}</span>
                          <button
                            onClick={() => handleRemoveIngredient(idx)}
                            style={styles.removeIngrButton}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={styles.addIngredientRow}>
                      <input
                        type="text"
                        placeholder="e.g., Extra Garlic"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddIngredient();
                          }
                        }}
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <button onClick={handleAddIngredient} style={styles.addButton}>
                        <PlusIcon style={{ width: '16px', height: '16px' }} />
                      </button>
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
              <div style={{ ...styles.modalContent, maxWidth: '500px' }}>
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
                    <textarea
                      placeholder="Category description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Icon (Emoji)</label>
                    <input
                      type="text"
                      placeholder="🥘"
                      maxLength={2}
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

      {/* EVENT PACKAGES TAB - Keep existing code */}
      {activeTab === 'event' && <div style={{ padding: '24px' }}>Event packages coming soon...</div>}

      {/* SUBSCRIPTIONS TAB - Keep existing code */}
      {activeTab === 'subscription' && <div style={{ padding: '24px' }}>Subscriptions coming soon...</div>}
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
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
  itemCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
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
  },
  priceSection: {
    marginBottom: '12px',
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
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
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
  },
  metaInfo: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  ingredientsSection: {
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
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
  ingredientsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '12px',
  },
  ingredientTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#0c4a6e',
  },
  removeIngrButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#0c4a6e',
    fontSize: '16px',
    padding: 0,
  },
  addIngredientRow: {
    display: 'flex',
    gap: '8px',
  },
  addButton: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
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
};