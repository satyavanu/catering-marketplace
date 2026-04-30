'use client';

import { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  TagIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

import { MOCK_MENU_ITEMS } from './mock';
import { MenuManagement } from './components/MenuManagement';
import { AddMenuItemModal } from './components/AddMenuItemModal';
import { EventPackages } from './packages/ManagePackages';
import { useCategories } from '@catering-marketplace/query-client';

import { MenuCategory, MenuItem, EventPackage, Subscription } from './types';

export default function CatererPlansPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'event' | 'subscription'>(
    'menu'
  );
  const [menuView, setMenuView] = useState<'grid' | 'list'>('grid');
  const [uploadErrors, setUploadErrors] = useState<string[]>([]); 

  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<any>('all');

  // Sync categories from API to local state
  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      setMenuCategories(
        categoriesData.map((category) => ({
          ...category,
          id: category.id,
          itemCount: category.itemCount || 0,
          icon: category.icon || '🥘',
        }))
      );
    }
  }, [categoriesData]);
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
      items: [
        'Paneer Tikka',
        'Dal Makhani',
        'Naan',
        'Rice',
        'Salad',
        'Dessert',
      ],
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
      items: [
        'Butter Chicken',
        'Tandoori Chicken',
        'Biryani',
        'Naan',
        'Dessert',
      ],
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
        breakfast: [
          'Vegetable Poha',
          'Idli Sambar',
          'Dosa',
          'Fresh Juices',
          'Eggs',
          'Bread Toast',
        ],
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
      addOns: [{ id: 1, name: 'Extra Dessert', price: 300 }],
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
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<
    number | null
  >(null);

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
    dietary: item.dietary || [],
    halal: item.halal || false,
    vegan: item.vegan || false,
    availability: item.availability || 'available',
    glutenFree: item.glutenFree || false,
    nutrition: {
      calories: item?.nutrition?.calories?.toString() || '0',
      protein: item?.nutrition?.protein?.toString() || '0',
      carbs: item?.nutrition?.carbs?.toString() || '0',
      fat: item?.nutrition?.fat?.toString() || '0',
      fiber: item?.nutrition?.fiber?.toString() || '0',
    },
    optionalIngredients: item.optionalIngredients || [],
    prepTime: item.prepTime?.toString() || '0',
    servings: item.servings?.toString() || '1',
    images: item.images || [],
  });
  setUploadErrors([]);
  setShowMenuForm(true); // This opens the modal
};

  const handleSaveMenuItem = () => {
    if (!menuFormData.name || !menuFormData.category || !menuFormData.price) {
      alert('Please fill all required fields');
      return;
    }

    const finalPrice =
      parseInt(menuFormData.price) - (parseInt(menuFormData.offer) || 0);

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
                minGuests: packageFormData.minGuests
                  ? parseInt(packageFormData.minGuests)
                  : undefined,
                maxGuests: packageFormData.maxGuests
                  ? parseInt(packageFormData.maxGuests)
                  : undefined,
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
        minGuests: packageFormData.minGuests
          ? parseInt(packageFormData.minGuests)
          : undefined,
        maxGuests: packageFormData.maxGuests
          ? parseInt(packageFormData.maxGuests)
          : undefined,
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

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );

  const handleAddMenuCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
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
            ...(activeTab === 'subscription'
              ? styles.tabActive
              : styles.tabInactive),
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
              <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>
                🍽️
              </div>
              <div>
                <p style={styles.statLabel}>Total Items</p>
                <p style={styles.statValue}>{menuItems.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4' }}>
                📂
              </div>
              <div>
                <p style={styles.statLabel}>Categories</p>
                <p style={styles.statValue}>{menuCategories.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>
                ✅
              </div>
              <div>
                <p style={styles.statLabel}>Available</p>
                <p style={styles.statValue}>
                  {
                    menuItems.filter((i) => i.availability === 'available')
                      .length
                  }
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>
                💰
              </div>
              <div>
                <p style={styles.statLabel}>Avg Price</p>
                <p style={styles.statValue}>
                  ₹
                  {menuItems.length > 0
                    ? Math.round(
                        menuItems.reduce((sum, i) => sum + i.price, 0) /
                          menuItems.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </div>
          /* Menu Management */
          <MenuManagement
            categories={menuCategories}
            items={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onEditMenuItem={handleEditMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
            menuView={menuView}
            onViewChange={setMenuView}
          />
          {/* Menu Item Form Modal */}
          <AddMenuItemModal
            isOpen={showMenuForm}
            onClose={() => setShowMenuForm(false)}
            onSuccess={() => {
              setShowMenuForm(false);
            }}
            categories={menuCategories}
            editingItem={
              editingMenuId
                ? menuItems.find((i) => i.id === editingMenuId)
                : null
            }
            formData={menuFormData}
            onFormDataChange={setMenuFormData}
            onSave={handleSaveMenuItem}
          />
        </>
      )}

      {/* EVENT PACKAGES TAB */}
      {activeTab === 'event' && (
        <>
          <EventPackages
            packages={packages}
            menuItems={menuItems}
            menuCategories={menuCategories}
            onAddPackage={handleAddPackage}
            onEditPackage={handleEditPackage}
            onDeletePackage={handleDeletePackage}
            onSavePackage={handleSavePackage}
            showPackageForm={showPackageForm}
            onClosePackageForm={() => setShowPackageForm(false)}
            editingPackageId={editingPackageId}
            packageFormData={packageFormData}
            onPackageFormDataChange={setPackageFormData}
          />
        </>
      )}

      {/* SUBSCRIPTIONS TAB */}
      {activeTab === 'subscription' && (
        <>
          {/* Subscriptions Statistics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#eff6ff' }}>
                📅
              </div>
              <div>
                <p style={styles.statLabel}>Total Plans</p>
                <p style={styles.statValue}>{subscriptions.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4' }}>
                👥
              </div>
              <div>
                <p style={styles.statLabel}>Total Subscribers</p>
                <p style={styles.statValue}>
                  {subscriptions.reduce((sum, s) => sum + s.subscribers, 0)}
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>
                ✅
              </div>
              <div>
                <p style={styles.statLabel}>Active Plans</p>
                <p style={styles.statValue}>
                  {subscriptions.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>
                💰
              </div>
              <div>
                <p style={styles.statLabel}>Avg Monthly Price</p>
                <p style={styles.statValue}>
                  ₹
                  {subscriptions.length > 0
                    ? Math.round(
                        subscriptions.reduce((sum, s) => sum + s.price, 0) /
                          subscriptions.length
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
              <button
                onClick={handleAddSubscription}
                style={styles.buttonPrimary}
              >
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
                        <p style={styles.subscriptionDescription}>
                          {sub.description}
                        </p>
                        <div style={styles.subscriptionMeta}>
                          <span style={styles.metaBadge}>
                            {sub.mealType === 'breakfast' && '🌅'}
                            {sub.mealType === 'lunch' && '🍽️'}
                            {sub.mealType === 'dinner' && '🌙'}
                            {sub.mealType === 'mixed' && '🍴'}
                            {sub.mealType}
                          </span>
                          <span style={styles.metaBadge}>
                            📆 {sub.duration}
                          </span>
                          <span style={styles.metaBadge}>
                            👥 {sub.subscribers} subscribers
                          </span>
                          <span style={styles.metaBadge}>
                            📅 {sub.createdDate}
                          </span>
                        </div>
                      </div>
                      <div style={styles.subscriptionStatus}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor:
                              sub.status === 'active' ? '#dcfce7' : '#fee2e2',
                            color:
                              sub.status === 'active' ? '#166534' : '#991b1b',
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
                          {sub.mealsPerWeek} meals per week • {sub.daysPerWeek}{' '}
                          days per week
                        </p>
                      </div>

                      {Object.entries(sub.items).length > 0 && (
                        <div style={styles.subscriptionItems}>
                          <h4 style={styles.contentTitle}>🍽️ Meal Items:</h4>
                          {Object.entries(sub.items).map(
                            ([category, items]) => (
                              <div key={category} style={styles.itemCategory}>
                                <p style={styles.itemCategoryTitle}>
                                  {category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                                  :
                                </p>
                                <div style={styles.itemsList}>
                                  {items.map((item, idx) => (
                                    <span key={idx} style={styles.itemTag}>
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {sub.addOns && sub.addOns.length > 0 && (
                        <div style={styles.subscriptionAddOns}>
                          <h4 style={styles.contentTitle}>➕ Add-ons:</h4>
                          <div style={styles.addOnsList}>
                            {sub.addOns.map((addon) => (
                              <span key={addon.id} style={styles.addonTag}>
                                {addon.name}{' '}
                                <span style={styles.addonPrice}>
                                  (₹{addon.price})
                                </span>
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
                      <button
                        onClick={() => handleEditSubscription(sub)}
                        style={styles.buttonItemEdit}
                      >
                        <PencilIcon style={{ width: '14px', height: '14px' }} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        style={styles.buttonItemDelete}
                      >
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
              <div
                style={styles.modalOverlay}
                onClick={() => setShowSubscriptionForm(false)}
              />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    {editingSubscriptionId ? 'Edit' : 'Add'} Subscription Plan
                  </h2>
                  <button
                    onClick={() => setShowSubscriptionForm(false)}
                    style={styles.closeButton}
                  >
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
                        setSubscriptionFormData({
                          ...subscriptionFormData,
                          name: e.target.value,
                        })
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
                      style={{
                        ...styles.input,
                        minHeight: '80px',
                        resize: 'vertical',
                      }}
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
                            setSubscriptionFormData({
                              ...subscriptionFormData,
                              price: e.target.value,
                            })
                          }
                          style={{
                            ...styles.input,
                            marginLeft: 0,
                            paddingLeft: '8px',
                          }}
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
                    <button
                      onClick={() => setShowSubscriptionForm(false)}
                      style={styles.buttonSecondary}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSubscription}
                      style={styles.buttonPrimary}
                    >
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

