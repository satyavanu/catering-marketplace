'use client';

import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  servings: number;
  image: string;
  vegetarian: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  minItems: number;
  maxItems: number;
  items: MenuItem[];
  price: number;
}

interface CartCategory {
  categoryId: string;
  categoryName: string;
  selectedItems: MenuItem[];
  categoryPrice: number;
  quantity: number;
}

interface BookingOptions {
  guests: number;
  date: string;
  time: string;
  packageType: 'basic' | 'premium' | 'deluxe';
  sampleMenu: string;
  staffRequired: number;
  additionalServices: {
    serveFood: boolean;
    decoration: boolean;
    cleanup: boolean;
    beverageService: boolean;
  };
}

export default function CatererDetailsPage({ params }: { params: { id: string } }) {
  const [cart, setCart] = useState<CartCategory[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'menu' | 'booking' | 'payment' | 'confirmation'>('menu');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedItemsPerCategory, setSelectedItemsPerCategory] = useState<{ [key: string]: MenuItem[] }>({});
  const [bookingOptions, setBookingOptions] = useState<BookingOptions>({
    guests: 50,
    date: '',
    time: '12:00',
    packageType: 'basic',
    sampleMenu: '',
    staffRequired: 0,
    additionalServices: {
      serveFood: false,
      decoration: false,
      cleanup: false,
      beverageService: false,
    },
  });

  // Mock data
  const catererData = {
    id: params.id,
    name: 'Maharaja Catering',
    rating: 4.8,
    reviews: 342,
    location: 'Mumbai, Maharashtra',
    experience: '12 years',
    image: '🍽️',
    cuisine: 'North Indian, Multi-Cuisine',
    minGuests: 20,
    maxGuests: 1000,
  };

  const menuCategories: MenuCategory[] = [
    {
      id: 'appetizers',
      name: 'Appetizers',
      description: 'Select 2-3 starters for your event',
      minItems: 2,
      maxItems: 3,
      price: 450,
      items: [
        {
          id: 'app-1',
          name: 'Paneer Tikka',
          description: 'Marinated cottage cheese skewers',
          price: 450,
          category: 'Appetizers',
          servings: 5,
          image: '🍗',
          vegetarian: true,
        },
        {
          id: 'app-2',
          name: 'Tandoori Chicken',
          description: 'Spiced and roasted chicken',
          price: 550,
          category: 'Appetizers',
          servings: 5,
          image: '🍗',
          vegetarian: false,
        },
        {
          id: 'app-3',
          name: 'Shrimp Koliwada',
          description: 'Crispy fried shrimp',
          price: 650,
          category: 'Appetizers',
          servings: 5,
          image: '🦐',
          vegetarian: false,
        },
        {
          id: 'app-4',
          name: 'Hara Bhara Kebab',
          description: 'Green vegetable kebabs',
          price: 350,
          category: 'Appetizers',
          servings: 5,
          image: '🌿',
          vegetarian: true,
        },
      ],
    },
    {
      id: 'maincourse',
      name: 'Main Course',
      description: 'Select 3-4 main dishes for your event',
      minItems: 3,
      maxItems: 4,
      price: 350,
      items: [
        {
          id: 'main-1',
          name: 'Biryani - Chicken',
          description: 'Fragrant basmati rice with chicken',
          price: 350,
          category: 'Main Course',
          servings: 3,
          image: '🍚',
          vegetarian: false,
        },
        {
          id: 'main-2',
          name: 'Dal Makhani',
          description: 'Creamy lentil curry',
          price: 300,
          category: 'Main Course',
          servings: 3,
          image: '🍲',
          vegetarian: true,
        },
        {
          id: 'main-3',
          name: 'Butter Chicken',
          description: 'Tender chicken in rich tomato gravy',
          price: 400,
          category: 'Main Course',
          servings: 3,
          image: '🍛',
          vegetarian: false,
        },
        {
          id: 'main-4',
          name: 'Paneer Butter Masala',
          description: 'Cottage cheese in creamy sauce',
          price: 350,
          category: 'Main Course',
          servings: 3,
          image: '🍛',
          vegetarian: true,
        },
        {
          id: 'main-5',
          name: 'Lamb Rogan Josh',
          description: 'Aromatic lamb curry',
          price: 450,
          category: 'Main Course',
          servings: 3,
          image: '🍖',
          vegetarian: false,
        },
      ],
    },
    {
      id: 'bread',
      name: 'Breads',
      description: 'Select 2-3 bread items',
      minItems: 2,
      maxItems: 3,
      price: 80,
      items: [
        {
          id: 'bread-1',
          name: 'Naan',
          description: 'Traditional oven baked bread',
          price: 80,
          category: 'Breads',
          servings: 1,
          image: '🍞',
          vegetarian: true,
        },
        {
          id: 'bread-2',
          name: 'Garlic Naan',
          description: 'Naan with garlic butter',
          price: 100,
          category: 'Breads',
          servings: 1,
          image: '🍞',
          vegetarian: true,
        },
        {
          id: 'bread-3',
          name: 'Roti',
          description: 'Whole wheat bread',
          price: 50,
          category: 'Breads',
          servings: 1,
          image: '🥖',
          vegetarian: true,
        },
      ],
    },
    {
      id: 'desserts',
      name: 'Desserts',
      description: 'Select 1-2 dessert options',
      minItems: 1,
      maxItems: 2,
      price: 200,
      items: [
        {
          id: 'des-1',
          name: 'Gulab Jamun',
          description: 'Sweet fried dumplings in syrup',
          price: 200,
          category: 'Desserts',
          servings: 4,
          image: '🍮',
          vegetarian: true,
        },
        {
          id: 'des-2',
          name: 'Kheer',
          description: 'Rice pudding with nuts',
          price: 180,
          category: 'Desserts',
          servings: 4,
          image: '🍶',
          vegetarian: true,
        },
        {
          id: 'des-3',
          name: 'Ice Cream',
          description: 'Assorted ice cream flavors',
          price: 150,
          category: 'Desserts',
          servings: 4,
          image: '🍨',
          vegetarian: true,
        },
      ],
    },
  ];

  const toggleItemSelection = (categoryId: string, item: MenuItem) => {
    setSelectedItemsPerCategory((prev) => {
      const current = prev[categoryId] || [];
      const category = menuCategories.find((c) => c.id === categoryId);
      if (!category) return prev;

      const isSelected = current.some((i) => i.id === item.id);
      if (isSelected) {
        return {
          ...prev,
          [categoryId]: current.filter((i) => i.id !== item.id),
        };
      }

      if (current.length < category.maxItems) {
        return {
          ...prev,
          [categoryId]: [...current, item],
        };
      }

      return prev;
    });
  };

  const addCategoryToCart = (categoryId: string) => {
    const category = menuCategories.find((c) => c.id === categoryId);
    const selectedItems = selectedItemsPerCategory[categoryId] || [];

    if (!category || selectedItems.length < category.minItems) {
      alert(`Please select at least ${category?.minItems} items from ${category?.name}`);
      return;
    }

    const existingCartItem = cart.find((c) => c.categoryId === categoryId);
    if (existingCartItem) {
      setCart((prev) =>
        prev.map((c) =>
          c.categoryId === categoryId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          categoryId,
          categoryName: category.name,
          selectedItems,
          categoryPrice: category.price,
          quantity: 1,
        },
      ]);
    }

    setSelectedItemsPerCategory((prev) => ({
      ...prev,
      [categoryId]: [],
    }));
    setExpandedCategory(null);
  };

  const removeFromCart = (categoryId: string) => {
    setCart((prev) => prev.filter((c) => c.categoryId !== categoryId));
  };

  const updateCartQuantity = (categoryId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(categoryId);
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.categoryId === categoryId ? { ...c, quantity } : c
      )
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.categoryPrice * item.quantity, 0);
  const platformFee = cartSubtotal * 0.05;
  const tax = (cartSubtotal + platformFee) * 0.18;
  const additionalServicesCost = calculateAdditionalServices();

  function calculateAdditionalServices() {
    let cost = 0;
    if (bookingOptions.additionalServices.serveFood) cost += bookingOptions.guests * 50;
    if (bookingOptions.additionalServices.decoration) cost += 5000;
    if (bookingOptions.additionalServices.cleanup) cost += 2000;
    if (bookingOptions.additionalServices.beverageService) cost += bookingOptions.guests * 100;
    return cost;
  }

  const finalTotal = cartSubtotal + platformFee + tax + additionalServicesCost;
  const packageMultiplier = bookingOptions.packageType === 'premium' ? 1.25 : bookingOptions.packageType === 'deluxe' ? 1.5 : 1;
  const finalTotalWithPackage = finalTotal * packageMultiplier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* Header */
        .caterer-header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 40px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 40px;
        }

        @media (max-width: 768px) {
          .header-content {
            gap: 20px;
          }
        }

        .caterer-info {
          flex: 1;
        }

        .caterer-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .caterer-name {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .caterer-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          opacity: 0.95;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
          margin-top: 8px;
          font-size: 12px;
        }

        .cart-button {
          position: relative;
          background: white;
          color: #4f46e5;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          height: fit-content;
        }

        .cart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        /* Step Indicator */
        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 24px 0;
          flex-wrap: wrap;
        }

        .step-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .step-badge.active {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border-color: #4f46e5;
        }

        .step-badge.completed {
          background: #dcfce7;
          color: #15803d;
          border-color: #15803d;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          font-size: 12px;
        }

        /* Main Content */
        .main-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          margin: 32px 0;
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }

        /* Menu Section */
        .menu-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #111827;
        }

        .category-container {
          margin-bottom: 24px;
        }

        .category-header {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-header:hover {
          border-color: #4f46e5;
          background: white;
        }

        .category-header.expanded {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .category-info {
          flex: 1;
        }

        .category-name {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .category-description {
          font-size: 13px;
          color: #6b7280;
        }

        .category-price {
          font-size: 16px;
          font-weight: 700;
          color: #4f46e5;
          margin-left: 16px;
          min-width: 80px;
          text-align: right;
        }

        .expand-icon {
          margin-left: 12px;
          color: #4f46e5;
          transition: transform 0.3s ease;
        }

        .category-expanded {
          border: 2px solid #4f46e5;
          border-top: none;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-radius: 0 0 12px 12px;
          padding: 20px;
          background: white;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .item-card {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .item-card:hover {
          border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
        }

        .item-card.selected {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .item-checkbox {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          transition: all 0.2s ease;
        }

        .item-card.selected .item-checkbox {
          background: #4f46e5;
          border-color: #4f46e5;
          color: white;
        }

        .item-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .item-name {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2px;
        }

        .item-description {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .item-price {
          font-weight: 700;
          color: #4f46e5;
        }

        .veg-badge {
          background: #dcfce7;
          color: #15803d;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
          font-size: 10px;
        }

        .selection-info {
          background: #f0f4ff;
          border: 1px solid #c7d2fe;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #4f46e5;
        }

        .add-category-btn {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .add-category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .add-category-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Sidebar Cart */
        .cart-sidebar {
          position: relative;
        }

        .cart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 140px;
          max-height: calc(100vh - 180px);
          overflow-y: auto;
        }

        .cart-header {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cart-empty {
          text-align: center;
          color: #6b7280;
          padding: 32px 0;
          font-size: 14px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .cart-item {
          background: #f9fafb;
          border-radius: 8px;
          padding: 12px;
          border: 1px solid #e5e7eb;
        }

        .cart-item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }

        .cart-item-name {
          font-weight: 700;
          color: #111827;
          font-size: 14px;
        }

        .cart-item-price {
          color: #4f46e5;
          font-weight: 700;
          font-size: 13px;
        }

        .cart-item-selected {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .selected-items-list {
          font-size: 11px;
          color: #6b7280;
          list-style: none;
          margin-bottom: 8px;
        }

        .selected-items-list li {
          padding: 2px 0;
        }

        .quantity-control {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .qty-btn {
          background: white;
          border: 1px solid #e5e7eb;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          color: #4f46e5;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .qty-btn:hover {
          background: #f3f4f6;
          border-color: #4f46e5;
        }

        .qty-display {
          font-weight: 700;
          color: #111827;
          font-size: 13px;
          min-width: 20px;
          text-align: center;
        }

        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        /* Price Breakdown */
        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 12px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-label {
          color: #6b7280;
          font-weight: 500;
        }

        .price-value {
          color: #111827;
          font-weight: 600;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 2px solid #e5e7eb;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        .total-amount {
          color: #4f46e5;
        }

        /* Booking Section */
        .booking-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 600;
          color: #111827;
          font-size: 13px;
        }

        .form-input, .form-select {
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 13px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .package-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .package-card {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          text-align: center;
        }

        .package-card:hover {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .package-card.active {
          border-color: #4f46e5;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
        }

        .package-name {
          font-weight: 700;
          font-size: 14px;
          color: #111827;
          margin-bottom: 6px;
        }

        .package-multiplier {
          font-size: 12px;
          color: #6b7280;
        }

        .services-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #e5e7eb;
        }

        .services-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #111827;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .service-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .service-checkbox:hover {
          border-color: #4f46e5;
          background: white;
        }

        .service-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .service-label {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          cursor: pointer;
        }

        .service-name {
          font-weight: 600;
          color: #111827;
          font-size: 13px;
        }

        .service-price {
          font-size: 11px;
          color: #4f46e5;
          font-weight: 600;
        }

        /* Payment Section */
        .payment-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .payment-method {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          background: white;
        }

        .payment-method:hover {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .payment-method.active {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .payment-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .payment-name {
          font-weight: 700;
          font-size: 14px;
          color: #111827;
        }

        .confirmation-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .confirmation-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .confirmation-title {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .confirmation-message {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }

        .summary-label {
          color: #6b7280;
          font-weight: 500;
        }

        .summary-value {
          color: #111827;
          font-weight: 600;
        }

        /* Buttons */
        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          flex: 1;
          background: white;
          color: #4f46e5;
          border: 2px solid #4f46e5;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #f0f4ff;
        }

        .btn-full {
          width: 100%;
        }
      `}</style>

      {/* Header */}
      <div className="caterer-header">
        <div className="container">
          <div className="header-content">
            <div className="caterer-info">
              <div className="caterer-icon">{catererData.image}</div>
              <h1 className="caterer-name">{catererData.name}</h1>
              <div className="caterer-meta">
                <div className="meta-item">
                  <span>⭐ {catererData.rating} ({catererData.reviews})</span>
                </div>
                <div className="meta-item">
                  <span>📍 {catererData.location}</span>
                </div>
                <div className="meta-item">
                  <span>🍽️ {catererData.cuisine}</span>
                </div>
              </div>
              <div className="rating-badge">
                {catererData.minGuests} - {catererData.maxGuests} guests
              </div>
            </div>
            <button 
              className="cart-button"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart size={18} />
              Cart
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="container">
        <div className="step-indicator">
          <div className={`step-badge ${['menu', 'booking', 'payment', 'confirmation'].indexOf(checkoutStep) >= 0 ? 'active' : ''} ${checkoutStep !== 'menu' ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            Menu
          </div>
          <div className={`step-badge ${checkoutStep === 'booking' || checkoutStep === 'payment' || checkoutStep === 'confirmation' ? 'active' : ''} ${['payment', 'confirmation'].includes(checkoutStep) ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            Booking
          </div>
          <div className={`step-badge ${checkoutStep === 'payment' || checkoutStep === 'confirmation' ? 'active' : ''} ${checkoutStep === 'confirmation' ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            Payment
          </div>
          <div className={`step-badge ${checkoutStep === 'confirmation' ? 'active' : ''}`}>
            <span className="step-number">4</span>
            Confirmation
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {checkoutStep === 'menu' && (
          <div className="main-content">
            {/* Menu Section */}
            <div className="menu-section">
              <h2 className="section-title">📋 Build Your Menu</h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                Select items from each category to create your perfect menu for the event
              </p>

              {menuCategories.map((category) => {
                const selectedItems = selectedItemsPerCategory[category.id] || [];
                const isExpanded = expandedCategory === category.id;

                return (
                  <div key={category.id} className="category-container">
                    <div
                      className={`category-header ${isExpanded ? 'expanded' : ''}`}
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : category.id)
                      }
                    >
                      <div className="category-info">
                        <div className="category-name">{category.name}</div>
                        <div className="category-description">
                          {category.description}
                        </div>
                      </div>
                      <div className="category-price">₹{category.price}</div>
                      <div className="expand-icon">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="category-expanded">
                        <div className="selection-info">
                          Selected: {selectedItems.length} / {category.maxItems} ({category.minItems} min)
                        </div>

                        <div className="items-grid">
                          {category.items.map((item) => {
                            const isSelected = selectedItems.some(
                              (i) => i.id === item.id
                            );
                            return (
                              <div
                                key={item.id}
                                className={`item-card ${isSelected ? 'selected' : ''}`}
                                onClick={() =>
                                  toggleItemSelection(category.id, item)
                                }
                              >
                                <div className="item-checkbox">
                                  {isSelected && <Check size={16} />}
                                </div>
                                <div className="item-icon">{item.image}</div>
                                <div className="item-name">{item.name}</div>
                                <div className="item-description">
                                  {item.description}
                                </div>
                                <div className="item-footer">
                                  <span className="item-price">₹{item.price}</span>
                                  {item.vegetarian && (
                                    <span className="veg-badge">VEG</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          className="add-category-btn"
                          onClick={() => addCategoryToCart(category.id)}
                          disabled={selectedItems.length < category.minItems}
                        >
                          Add {category.name} to Cart
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar Cart */}
            {showCart && (
              <div className="cart-sidebar">
                <div className="cart-container">
                  <div className="cart-header">
                    <ShoppingCart size={18} />
                    Your Menu
                  </div>

                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      <p>Cart is empty</p>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>
                        Add menu categories
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="cart-items">
                        {cart.map((cartItem) => (
                          <div key={cartItem.categoryId} className="cart-item">
                            <div className="cart-item-header">
                              <div className="cart-item-name">
                                {cartItem.categoryName}
                              </div>
                              <div className="cart-item-price">
                                ₹{(
                                  cartItem.categoryPrice * cartItem.quantity
                                ).toLocaleString()}
                              </div>
                            </div>
                            <div className="cart-item-selected">
                              {cartItem.selectedItems.length} items selected
                            </div>
                            <ul className="selected-items-list">
                              {cartItem.selectedItems.map((item) => (
                                <li key={item.id}>• {item.name}</li>
                              ))}
                            </ul>
                            <div className="quantity-control">
                              <button
                                className="qty-btn"
                                onClick={() =>
                                  updateCartQuantity(
                                    cartItem.categoryId,
                                    cartItem.quantity - 1
                                  )
                                }
                              >
                                −
                              </button>
                              <div className="qty-display">
                                {cartItem.quantity}x
                              </div>
                              <button
                                className="qty-btn"
                                onClick={() =>
                                  updateCartQuantity(
                                    cartItem.categoryId,
                                    cartItem.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                              <button
                                className="remove-btn"
                                onClick={() =>
                                  removeFromCart(cartItem.categoryId)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="price-breakdown">
                        <div className="price-row">
                          <span className="price-label">Subtotal:</span>
                          <span className="price-value">
                            ₹{cartSubtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="price-row">
                          <span className="price-label">Platform Fee:</span>
                          <span className="price-value">
                            ₹{Math.round(platformFee).toLocaleString()}
                          </span>
                        </div>
                        <div className="price-row">
                          <span className="price-label">Tax (18%):</span>
                          <span className="price-value">
                            ₹{Math.round(tax).toLocaleString()}
                          </span>
                        </div>
                        <div className="divider"></div>
                        <div className="total-row">
                          <span>Total:</span>
                          <span className="total-amount">
                            ₹{Math.round(finalTotal).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        className="btn-primary btn-full"
                        onClick={() => setCheckoutStep('booking')}
                      >
                        Continue to Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {checkoutStep === 'booking' && (
          <div className="booking-section">
            <h2 className="section-title">📅 Booking Details</h2>

            {/* Package Selection */}
            <div style={{ marginBottom: '24px' }}>
              <div className="form-label" style={{ marginBottom: '12px' }}>
                Select Your Package
              </div>
              <div className="package-grid">
                {[
                  { type: 'basic', multiplier: 1 },
                  { type: 'premium', multiplier: 1.25 },
                  { type: 'deluxe', multiplier: 1.5 },
                ].map((pkg) => (
                  <div
                    key={pkg.type}
                    className={`package-card ${
                      bookingOptions.packageType === pkg.type ? 'active' : ''
                    }`}
                    onClick={() =>
                      setBookingOptions({
                        ...bookingOptions,
                        packageType: pkg.type as any,
                      })
                    }
                  >
                    <div className="package-name">
                      {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                    </div>
                    <div className="package-multiplier">{pkg.multiplier}x</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Options */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <input
                  type="number"
                  className="form-input"
                  min={catererData.minGuests}
                  max={catererData.maxGuests}
                  value={bookingOptions.guests}
                  onChange={(e) =>
                    setBookingOptions({
                      ...bookingOptions,
                      guests: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingOptions.date}
                  onChange={(e) =>
                    setBookingOptions({
                      ...bookingOptions,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={bookingOptions.time}
                  onChange={(e) =>
                    setBookingOptions({
                      ...bookingOptions,
                      time: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sample Menu</label>
                <select
                  className="form-select"
                  value={bookingOptions.sampleMenu}
                  onChange={(e) =>
                    setBookingOptions({
                      ...bookingOptions,
                      sampleMenu: e.target.value,
                    })
                  }
                >
                  <option value="">Select Menu Type</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Serving Staff</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={bookingOptions.staffRequired}
                  onChange={(e) =>
                    setBookingOptions({
                      ...bookingOptions,
                      staffRequired: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Additional Services */}
            <div className="services-section">
              <div className="services-title">Additional Services</div>
              <div className="services-grid">
                {[
                  {
                    key: 'serveFood',
                    label: 'Serving & Setup',
                    price: `₹${bookingOptions.guests * 50}`,
                  },
                  {
                    key: 'decoration',
                    label: 'Decoration',
                    price: '₹5,000',
                  },
                  {
                    key: 'cleanup',
                    label: 'Cleanup',
                    price: '₹2,000',
                  },
                  {
                    key: 'beverageService',
                    label: 'Beverage Service',
                    price: `₹${bookingOptions.guests * 100}`,
                  },
                ].map((service) => (
                  <label key={service.key} className="service-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        bookingOptions.additionalServices[
                          service.key as keyof typeof bookingOptions.additionalServices
                        ]
                      }
                      onChange={(e) =>
                        setBookingOptions({
                          ...bookingOptions,
                          additionalServices: {
                            ...bookingOptions.additionalServices,
                            [service.key]: e.target.checked,
                          },
                        })
                      }
                    />
                    <div className="service-label">
                      <span className="service-name">{service.label}</span>
                      <span className="service-price">{service.price}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div
              style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '24px',
              }}
            >
              <div className="summary-item">
                <span className="summary-label">Menu Subtotal:</span>
                <span className="summary-value">
                  ₹{cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Platform Fee (5%):</span>
                <span className="summary-value">
                  ₹{Math.round(platformFee).toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tax (18%):</span>
                <span className="summary-value">
                  ₹{Math.round(tax).toLocaleString()}
                </span>
              </div>
              {additionalServicesCost > 0 && (
                <div className="summary-item">
                  <span className="summary-label">Services:</span>
                  <span className="summary-value">
                    ₹{Math.round(additionalServicesCost).toLocaleString()}
                  </span>
                </div>
              )}
              <div
                className="summary-item"
                style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}
              >
                <span className="summary-label">Package Multiplier:</span>
                <span className="summary-value">{packageMultiplier}x</span>
              </div>
              <div
                className="summary-item"
                style={{ paddingTop: '12px', fontWeight: 700, fontSize: '16px' }}
              >
                <span>Total Amount:</span>
                <span style={{ color: '#4f46e5' }}>
                  ₹{Math.round(finalTotalWithPackage).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={() => setCheckoutStep('menu')}
              >
                ← Edit Menu
              </button>
              <button
                className="btn-primary"
                onClick={() => setCheckoutStep('payment')}
                disabled={!bookingOptions.date || !bookingOptions.sampleMenu}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="payment-section">
            <h2 className="section-title">💳 Payment Method</h2>

            <div className="payment-methods">
              {[
                { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
                { id: 'upi', name: 'UPI', icon: '📱' },
                { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
                { id: 'wallet', name: 'Wallet', icon: '👛' },
              ].map((method) => (
                <div
                  key={method.id}
                  className={`payment-method ${
                    bookingOptions.packageType === 'deluxe' ? 'active' : ''
                  }`}
                >
                  <div className="payment-icon">{method.icon}</div>
                  <div className="payment-name">{method.name}</div>
                </div>
              ))}
            </div>

            {/* Final Order Summary */}
            <div
              style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ marginBottom: '12px', fontWeight: 700, fontSize: '14px' }}>
                Order Summary
              </div>
              <div className="summary-item">
                <span className="summary-label">Menu Items:</span>
                <span className="summary-value">
                  ₹{cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Fees & Taxes:</span>
                <span className="summary-value">
                  ₹{Math.round(platformFee + tax).toLocaleString()}
                </span>
              </div>
              {additionalServicesCost > 0 && (
                <div className="summary-item">
                  <span className="summary-label">Additional Services:</span>
                  <span className="summary-value">
                    ₹{Math.round(additionalServicesCost).toLocaleString()}
                  </span>
                </div>
              )}
              <div
                className="summary-item"
                style={{
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '12px',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                <span>Amount to Pay:</span>
                <span style={{ color: '#4f46e5' }}>
                  ₹{Math.round(finalTotalWithPackage).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={() => setCheckoutStep('booking')}
              >
                ← Back
              </button>
              <button
                className="btn-primary"
                onClick={() => setCheckoutStep('confirmation')}
              >
                Pay & Confirm
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'confirmation' && (
          <div className="confirmation-section">
            <div className="confirmation-icon">✅</div>
            <h2 className="confirmation-title">Booking Confirmed!</h2>
            <p className="confirmation-message">
              Your catering booking has been successfully confirmed. You will receive
              a confirmation email shortly with all the details.
            </p>

            {/* Booking Details Summary */}
            <div
              style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '24px',
                margin: '24px 0',
                textAlign: 'left',
              }}
            >
              <div style={{ marginBottom: '16px', fontWeight: 700 }}>
                Booking Details
              </div>
              <div className="summary-item">
                <span className="summary-label">Booking ID:</span>
                <span className="summary-value">#BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Caterer:</span>
                <span className="summary-value">{catererData.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Date:</span>
                <span className="summary-value">{bookingOptions.date}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time:</span>
                <span className="summary-value">{bookingOptions.time}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Number of Guests:</span>
                <span className="summary-value">{bookingOptions.guests}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Amount:</span>
                <span
                  className="summary-value"
                  style={{ color: '#4f46e5', fontWeight: 700, fontSize: '16px' }}
                >
                  ₹{Math.round(finalTotalWithPackage).toLocaleString()}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
              A confirmation has been sent to your email. The caterer will contact
              you within 2 hours to confirm final details.
            </p>

            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={() => window.location.href = '/bookings'}
              >
                View My Bookings
              </button>
              <button
                className="btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}