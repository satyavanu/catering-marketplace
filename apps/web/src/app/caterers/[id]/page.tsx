'use client';

import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Check, Star, MapPin, Clock, Users, Package, Utensils, X, ArrowLeft, Filter, Plus, Trash2 } from 'lucide-react';

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

interface UserAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface BookingOptions {
  guests: number;
  date: string;
  time: string;
  packageType: 'basic' | 'premium' | 'deluxe';
  sampleMenu: string;
  staffRequired: number;
  userName: string;
  userContact: string;
  selectedAddressId: string;
  customAddress: string;
  additionalServices: {
    serveFood: boolean;
    decoration: boolean;
    cleanup: boolean;
    beverageService: boolean;
  };
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  event: string;
  timestamp: number;
}

interface CatererStory {
  id: string;
  image: string;
  title: string;
  timestamp: string;
}

interface CatererSocial {
  platform: string;
  url: string;
  icon: string;
  followers: string;
}

type TabType = 'overview' | 'menu' | 'reviews' | 'gallery' | 'location';
type CheckoutStep = 'menu' | 'details' | 'booking' | 'payment' | 'confirmation';
type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';
type ReviewDisplay = 'grid' | 'list';
type AddressType = 'existing' | 'custom';

export default function CatererDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [cart, setCart] = useState<CartCategory[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('menu');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedItemsPerCategory, setSelectedItemsPerCategory] = useState<{ [key: string]: MenuItem[] }>({});
  const [addressType, setAddressType] = useState<AddressType>('existing');
  const [bookingOptions, setBookingOptions] = useState<BookingOptions>({
    guests: 50,
    date: '',
    time: '12:00',
    packageType: 'basic',
    sampleMenu: '',
    staffRequired: 0,
    userName: '',
    userContact: '',
    selectedAddressId: 'addr-1',
    customAddress: '',
    additionalServices: {
      serveFood: false,
      decoration: false,
      cleanup: false,
      beverageService: false,
    },
  });

  const [activeStory, setActiveStory] = useState<string | null>(null);

  // Review filters
  const [reviewSort, setReviewSort] = useState<ReviewSort>('newest');
  const [reviewDisplay, setReviewDisplay] = useState<ReviewDisplay>('grid');

  // Mock user data with addresses
  const userData = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 12345',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        address: '456 Residential Avenue, Andheri',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400053',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Office',
        address: '789 Business Plaza, BKC',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400051',
        isDefault: false,
      },
      {
        id: 'addr-3',
        label: 'Other',
        address: '321 Event Hall, Powai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400076',
        isDefault: false,
      },
    ],
  };

  // Mock data
  const catererData = {
    id: params.id,
    name: 'Maharaja Catering',
    rating: 4.8,
    reviews: 342,
    location: 'Mumbai, Maharashtra',
    address: '123 Food Street, Bandra, Mumbai 400050',
    latitude: 19.0596,
    longitude: 72.8295,
    experience: '12 years',
    image: '🍽️',
    cuisine: 'North Indian, Multi-Cuisine',
    minGuests: 20,
    maxGuests: 1000,
    description: 'Experience authentic North Indian cuisine with our premium catering services. We specialize in weddings, corporate events, and private celebrations with customized menus.',
    highlights: ['Expert Chefs', 'Fresh Ingredients', 'Hygienic Preparation', 'On-Time Delivery', 'Professional Staff', 'Customized Menus'],
    availableFor: ['Weddings', 'Corporate Events', 'Birthdays', 'Anniversaries', 'Private Parties', 'Festivals'],
    responseTime: '2 hours',
    deliveryRange: '15 km',
    phone: '+91 98765 43210',
    email: 'info@maharajatering.com',
    operatingHours: '10:00 AM - 10:00 PM',
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

  const reviews: Review[] = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent service! Food was delicious and presentation was amazing. Highly recommended!',
      event: 'Wedding Reception',
      timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
    {
      id: 2,
      author: 'Priya Singh',
      rating: 5,
      date: '1 month ago',
      comment: 'Perfect for our corporate event. Professional staff and great coordination.',
      event: 'Corporate Event',
      timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: 3,
      author: 'Amit Patel',
      rating: 4,
      date: '1.5 months ago',
      comment: 'Good food quality but slight delay in delivery. Overall satisfied.',
      event: 'Birthday Party',
      timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
    },
    {
      id: 4,
      author: 'Neha Sharma',
      rating: 5,
      date: '2 months ago',
      comment: 'Amazing taste and very professional team. Will definitely book again!',
      event: 'Anniversary Dinner',
      timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
    {
      id: 5,
      author: 'Vikram Singh',
      rating: 3,
      date: '2.5 months ago',
      comment: 'Food was average. Service could have been better.',
      event: 'Private Party',
      timestamp: Date.now() - 75 * 24 * 60 * 60 * 1000,
    },
  ];

  // Add social links data
  const socialLinks: CatererSocial[] = [
    { platform: 'Instagram', url: '#', icon: '📷', followers: '12.5K' },
    { platform: 'Facebook', url: '#', icon: '👍', followers: '8.3K' },
    { platform: 'YouTube', url: '#', icon: '▶️', followers: '5.2K' },
    { platform: 'TikTok', url: '#', icon: '🎵', followers: '3.8K' },
  ];

  // Add stories data
  const stories: CatererStory[] = [
    { id: 'story-1', image: '🍛', title: 'Wedding Menu', timestamp: '2h ago' },
    { id: 'story-2', image: '🎂', title: 'Birthday Bash', timestamp: '5h ago' },
    { id: 'story-3', image: '🍜', title: 'Corporate Event', timestamp: '1d ago' },
    { id: 'story-4', image: '🍱', title: 'Plating Art', timestamp: '2d ago' },
    { id: 'story-5', image: '👨‍🍳', title: 'Chef Team', timestamp: '3d ago' },
    { id: 'story-6', image: '🎉', title: 'Recent Event', timestamp: '4d ago' },
  ];

  // Sort reviews
  const getSortedReviews = (): Review[] => {
    const sorted = [...reviews];
    switch (reviewSort) {
      case 'newest':
        return sorted.sort((a, b) => b.timestamp - a.timestamp);
      case 'oldest':
        return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  // Get selected address details
  const getSelectedAddress = (): UserAddress | null => {
    return userData.addresses.find((addr) => addr.id === bookingOptions.selectedAddressId) || null;
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.categoryPrice * item.quantity, 0);
  const platformFee = cartSubtotal * 0.05;
  const tax = (cartSubtotal + platformFee) * 0.18;
  const additionalServicesCost = calculateAdditionalServices();

  function calculateAdditionalServices(): number {
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

  // Functions
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

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setCheckoutStep('menu');
    setCart([]);
    setSelectedItemsPerCategory({});
    setAddressType('existing');
    setBookingOptions({
      guests: 50,
      date: '',
      time: '12:00',
      packageType: 'basic',
      sampleMenu: '',
      staffRequired: 0,
      userName: userData.name,
      userContact: userData.phone,
      selectedAddressId: 'addr-1',
      customAddress: '',
      additionalServices: {
        serveFood: false,
        decoration: false,
        cleanup: false,
        beverageService: false,
      },
    });
  };

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

        /* Header Navigation */
        .header-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .nav-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-back {
          background: none;
          border: none;
          color: #4f46e5;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s ease;
        }

        .nav-back:hover {
          color: #7c3aed;
        }

        /* Enhanced Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 48px 0;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(100px, -100px);
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          transform: translate(-50px, 50px);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .hero-info h1 {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .hero-icon {
          font-size: 100px;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }

        .hero-meta {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          font-size: 16px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.15);
          padding: 12px 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .meta-row:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateX(4px);
        }

        .meta-row strong {
          font-weight: 700;
          min-width: 120px;
        }

        .hero-description {
          font-size: 16px;
          line-height: 1.8;
          opacity: 0.98;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.1);
          padding: 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .highlights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .highlight-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          text-align: center;
        }

        .highlight-badge:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .cta-button {
          background: white;
          color: #4f46e5;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
        }

        /* Hero Right Section - Social & Stories */
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Social Links */
        .social-section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .social-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.9;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }

        .social-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .social-link {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          text-decoration: none;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .social-icon {
          font-size: 24px;
        }

        .social-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .social-platform {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .social-followers {
          font-size: 13px;
          font-weight: 700;
        }

        /* Stories Section */
        .stories-section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .stories-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.9;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        @media (max-width: 1024px) {
          .stories-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stories-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .story-thumbnail {
          aspect-ratio: 1;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          position: relative;
          overflow: hidden;
          group: 'story';
        }

        .story-thumbnail::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.3s ease;
        }

        .story-thumbnail:hover::before {
          background: rgba(0, 0, 0, 0.2);
        }

        .story-thumbnail:hover {
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .story-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .story-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .story-label {
          font-size: 9px;
          font-weight: 700;
          text-align: center;
          opacity: 0.9;
          line-height: 1.2;
        }

        /* Story Modal */
        .story-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .story-modal-content {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .story-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .story-modal-title {
          font-weight: 700;
          color: white;
          font-size: 16px;
        }

        .story-modal-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 24px;
          transition: opacity 0.2s ease;
        }

        .story-modal-close:hover {
          opacity: 0.7;
        }

        .story-modal-body {
          padding: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .story-modal-icon {
          font-size: 80px;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }

        .story-modal-text {
          color: white;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.6;
        }

        .story-modal-timestamp {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-weight: 600;
        }

        .story-modal-action {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
          width: 100%;
        }

        .story-modal-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        /* Tabs */
        .tabs-container {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 32px;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .tabs {
          display: flex;
          gap: 0;
        }

        .tab {
          background: none;
          border: none;
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
          position: relative;
          white-space: nowrap;
        }

        .tab:hover {
          color: #4f46e5;
          background: #f9fafb;
        }

        .tab.active {
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        /* Tab Content */
        .tab-content {
          background: white;
          padding: 32px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Overview Tab */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .overview-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .card-item-label {
          font-weight: 600;
          color: #111827;
        }

        /* Menu Tab */
        .menu-section {
          margin-bottom: 32px;
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
          border-radius: 0 0 12px 12px;
          padding: 20px;
          background: white;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

        /* Reviews Tab */
        .reviews-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .control-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .control-label {
          font-weight: 600;
          color: #111827;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .control-select {
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          background: white;
          color: #111827;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .control-select:hover {
          border-color: #4f46e5;
        }

        .control-select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .review-card:hover {
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
          border-color: #4f46e5;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
        }

        .review-author {
          font-weight: 700;
          color: #111827;
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .stars {
          display: flex;
          gap: 4px;
          color: #fbbf24;
          font-size: 14px;
        }

        .review-event {
          background: #e0e7ff;
          color: #4f46e5;
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .review-comment {
          color: #4b5563;
          line-height: 1.6;
          font-size: 14px;
        }

        /* Location Tab */
        .location-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .location-grid {
            grid-template-columns: 1fr;
          }
        }

        .map-container {
          background: #e5e7eb;
          border-radius: 12px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #9ca3af;
        }

        .location-info-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
        }

        .location-info-item {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .location-info-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .location-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .location-content {
          flex: 1;
        }

        .location-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .location-value {
          color: #111827;
          font-size: 14px;
          font-weight: 500;
        }

        .location-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }

        .location-link:hover {
          text-decoration: underline;
        }

        /* Booking Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 0;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
        }

        .modal-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 24px;
          transition: opacity 0.2s ease;
        }

        .modal-close:hover {
          opacity: 0.8;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        /* Step Indicator */
        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
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

        /* Checkout Sections */
        .checkout-section {
          display: none;
        }

        .checkout-section.active {
          display: block;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        /* Address Selection */
        .address-type-selector {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .address-type-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .address-type-btn:hover {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .address-type-btn.active {
          border-color: #4f46e5;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
          color: #4f46e5;
        }

        .address-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .address-card {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          position: relative;
        }

        .address-card:hover {
          border-color: #4f46e5;
          background: #f0f4ff;
        }

        .address-card.active {
          border-color: #4f46e5;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .address-card-radio {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          transition: all 0.2s ease;
        }

        .address-card.active .address-card-radio {
          background: #4f46e5;
          border-color: #4f46e5;
          color: white;
        }

        .address-label {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .address-text {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .address-details {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
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

        /* Cart Summary */
        .cart-summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 13px;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-item.total {
          border-bottom: 2px solid #e5e7eb;
          padding-top: 12px;
          font-weight: 700;
          font-size: 15px;
          color: #111827;
        }

        .summary-value {
          font-weight: 600;
          color: #4f46e5;
        }

        /* Payment Methods */
        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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

        /* Confirmation */
        .confirmation-box {
          text-align: center;
          padding: 48px 24px;
        }

        .confirmation-icon {
          font-size: 80px;
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
          margin-bottom: 32px;
        }

        .booking-details {
          background: #f9fafb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 16px;
          color: #111827;
          font-weight: 700;
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

        .info-section {
          background: #f0f4ff;
          border: 1px solid #c7d2fe;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .info-title {
          font-weight: 700;
          color: #4f46e5;
          font-size: 14px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-label {
          font-size: 11px;
          color: #4f46e5;
          font-weight: 600;
          text-transform: uppercase;
        }

        .info-value {
          font-size: 13px;
          color: #111827;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
          }

          .highlights-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .modal-body {
            padding: 16px;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .reviews-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .control-group {
            width: 100%;
          }

          .control-select {
            width: 100%;
          }

          .address-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header Navigation */}
      <div className="header-nav">
        <div className="container">
          <div className="nav-content">
            <button className="nav-back" onClick={() => window.history.back()}>
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            {/* Left Side */}
            <div>
              <div className="hero-info">
                <div className="hero-icon">{catererData.image}</div>
                <h1>{catererData.name}</h1>
                <div className="hero-meta">
                  <div className="meta-row">
                    <strong>⭐ Rating</strong>
                    <span>{catererData.rating} ({catererData.reviews} reviews)</span>
                  </div>
                  <div className="meta-row">
                    <strong>📍 Location</strong>
                    <span>{catererData.location}</span>
                  </div>
                  <div className="meta-row">
                    <strong>⏱️ Response</strong>
                    <span>{catererData.responseTime}</span>
                  </div>
                  <div className="meta-row">
                    <strong>👥 Capacity</strong>
                    <span>{catererData.minGuests} - {catererData.maxGuests} guests</span>
                  </div>
                </div>
              </div>
              <p className="hero-description">{catererData.description}</p>
              <div className="highlights-grid">
                {catererData.highlights.slice(0, 6).map((highlight, idx) => (
                  <div key={idx} className="highlight-badge">{highlight}</div>
                ))}
              </div>
              <button 
                className="cta-button"
                onClick={() => {
                  setBookingOptions({
                    ...bookingOptions,
                    userName: userData.name,
                    userContact: userData.phone,
                  });
                  setShowBookingModal(true);
                }}
              >
                <ShoppingCart size={20} />
                Book Now
              </button>
            </div>

            {/* Right Side - Social & Stories */}
            <div className="hero-right">
              {/* Social Links */}
              <div className="social-section">
                <div className="social-title">🌐 Follow Us</div>
                <div className="social-links">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="social-icon">{social.icon}</div>
                      <div className="social-info">
                        <div className="social-platform">{social.platform}</div>
                        <div className="social-followers">{social.followers}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Stories */}
              <div className="stories-section">
                <div className="stories-title">📸 Stories</div>
                <div className="stories-grid">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className="story-thumbnail"
                      onClick={() => setActiveStory(story.id)}
                      title={`${story.title} - ${story.timestamp}`}
                    >
                      <div className="story-content">
                        <div className="story-icon">{story.image}</div>
                        <div className="story-label">{story.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {activeStory && (
        <div className="story-modal-overlay" onClick={() => setActiveStory(null)}>
          <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="story-modal-header">
              <div className="story-modal-title">
                {stories.find(s => s.id === activeStory)?.title}
              </div>
              <button className="story-modal-close" onClick={() => setActiveStory(null)}>
                ×
              </button>
            </div>
            <div className="story-modal-body">
              <div className="story-modal-icon">
                {stories.find(s => s.id === activeStory)?.image}
              </div>
              <div className="story-modal-text">
                {stories.find(s => s.id === activeStory)?.title}
              </div>
              <div className="story-modal-timestamp">
                {stories.find(s => s.id === activeStory)?.timestamp}
              </div>
              <button className="story-modal-action">View Full Story</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="container">
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
            <button
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`tab ${activeTab === 'location' ? 'active' : ''}`}
              onClick={() => setActiveTab('location')}
            >
              Location
            </button>
            <button
              className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="card-title">
                    <Utensils size={20} />
                    Specialties
                  </div>
                  <div className="card-content">
                    {catererData.availableFor.map((item, idx) => (
                      <div key={idx} className="card-item">
                        <span style={{ fontSize: '16px' }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-title">
                    <Users size={20} />
                    Capacity
                  </div>
                  <div className="card-content">
                    <div className="card-item">
                      <span className="card-item-label">Min Guests:</span>
                      <span>{catererData.minGuests}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-item-label">Max Guests:</span>
                      <span>{catererData.maxGuests}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-item-label">Delivery Range:</span>
                      <span>{catererData.deliveryRange}</span>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-title">
                    <Clock size={20} />
                    Service Info
                  </div>
                  <div className="card-content">
                    <div className="card-item">
                      <span className="card-item-label">Experience:</span>
                      <span>{catererData.experience}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-item-label">Cuisine:</span>
                      <span>{catererData.cuisine}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-item-label">Response Time:</span>
                      <span>{catererData.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                Explore our diverse menu options. Customize your selection during booking.
              </p>
              {menuCategories.map((category) => (
                <div key={category.id} className="category-container">
                  <div className="category-header">
                    <div className="category-info">
                      <div className="category-name">{category.name}</div>
                      <div className="category-description">{category.description}</div>
                    </div>
                    <div className="category-price">₹{category.price}</div>
                  </div>
                  <div className="category-expanded">
                    <div className="items-grid">
                      {category.items.map((item) => (
                        <div key={item.id} className="item-card">
                          <div className="item-icon">{item.image}</div>
                          <div className="item-name">{item.name}</div>
                          <div className="item-description">{item.description}</div>
                          <div className="item-footer">
                            <span className="item-price">₹{item.price}</span>
                            {item.vegetarian && <span className="veg-badge">VEG</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="reviews-controls">
                <div className="control-group">
                  <label className="control-label">
                    <Filter size={16} />
                    Sort By:
                  </label>
                  <select
                    className="control-select"
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as ReviewSort)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>

                <div className="control-group">
                  <label className="control-label">Display:</label>
                  <select
                    className="control-select"
                    value={reviewDisplay}
                    onChange={(e) => setReviewDisplay(e.target.value as ReviewDisplay)}
                  >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                  </select>
                </div>
              </div>

              {reviewDisplay === 'grid' ? (
                <div className="reviews-grid">
                  {getSortedReviews().map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div>
                          <div className="review-author">{review.author}</div>
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="review-meta" style={{ marginBottom: '12px' }}>
                        <span>{review.date}</span>
                      </div>
                      <div className="review-event">{review.event}</div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="reviews-list">
                  {getSortedReviews().map((review) => (
                    <div key={review.id} className="review-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <div className="review-author">{review.author}</div>
                          <div className="review-meta">
                            <span>{review.date}</span>
                          </div>
                        </div>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <div className="review-event">{review.event}</div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div>
              <div className="location-grid">
                <div className="map-container">
                  📍 Map Integration Coming Soon
                </div>
                <div className="location-info-card">
                  <div className="location-info-item">
                    <div className="location-icon">📍</div>
                    <div className="location-content">
                      <div className="location-label">Address</div>
                      <div className="location-value">{catererData.address}</div>
                    </div>
                  </div>

                  <div className="location-info-item">
                    <div className="location-icon">📱</div>
                    <div className="location-content">
                      <div className="location-label">Phone</div>
                      <div className="location-value">
                        <a href={`tel:${catererData.phone}`} className="location-link">{catererData.phone}</a>
                      </div>
                    </div>
                  </div>

                  <div className="location-info-item">
                    <div className="location-icon">✉️</div>
                    <div className="location-content">
                      <div className="location-label">Email</div>
                      <div className="location-value">
                        <a href={`mailto:${catererData.email}`} className="location-link">{catererData.email}</a>
                      </div>
                    </div>
                  </div>

                  <div className="location-info-item">
                    <div className="location-icon">🕐</div>
                    <div className="location-content">
                      <div className="location-label">Operating Hours</div>
                      <div className="location-value">{catererData.operatingHours}</div>
                    </div>
                  </div>

                  <div className="location-info-item">
                    <div className="location-icon">🚗</div>
                    <div className="location-content">
                      <div className="location-label">Delivery Range</div>
                      <div className="location-value">Within {catererData.deliveryRange}</div>
                    </div>
                  </div>

                  <div className="location-info-item">
                    <div className="location-icon">📌</div>
                    <div className="location-content">
                      <div className="location-label">Coordinates</div>
                      <div className="location-value">
                        {catererData.latitude.toFixed(4)}, {catererData.longitude.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📸</div>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>Gallery coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) closeBookingModal();
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">
                {checkoutStep === 'menu' && '📋 Build Your Menu'}
                {checkoutStep === 'details' && '👤 Booking Details'}
                {checkoutStep === 'booking' && '📅 Event Details'}
                {checkoutStep === 'payment' && '💳 Payment'}
                {checkoutStep === 'confirmation' && '✅ Confirmed'}
              </div>
              <button className="modal-close" onClick={closeBookingModal}>×</button>
            </div>

            <div className="modal-body">
              {/* Step Indicator */}
              <div className="step-indicator">
                <div className={`step-badge ${checkoutStep === 'menu' ? 'active' : checkoutStep !== 'menu' ? 'completed' : ''}`}>
                  <span>1</span> Menu
                </div>
                <div className={`step-badge ${checkoutStep === 'details' ? 'active' : ['booking', 'payment', 'confirmation'].includes(checkoutStep) ? 'completed' : ''}`}>
                  <span>2</span> Details
                </div>
                <div className={`step-badge ${checkoutStep === 'booking' ? 'active' : ['payment', 'confirmation'].includes(checkoutStep) ? 'completed' : ''}`}>
                  <span>3</span> Booking
                </div>
                <div className={`step-badge ${checkoutStep === 'payment' ? 'active' : checkoutStep === 'confirmation' ? 'completed' : ''}`}>
                  <span>4</span> Payment
                </div>
                <div className={`step-badge ${checkoutStep === 'confirmation' ? 'active' : ''}`}>
                  <span>5</span> Confirmed
                </div>
              </div>

              {/* Menu Selection */}
              <div className={`checkout-section ${checkoutStep === 'menu' ? 'active' : ''}`}>
                {menuCategories.map((category) => {
                  const selectedItems = selectedItemsPerCategory[category.id] || [];
                  const isExpanded = expandedCategory === category.id;

                  return (
                    <div key={category.id} className="category-container">
                      <div
                        className={`category-header ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      >
                        <div className="category-info">
                          <div className="category-name">{category.name}</div>
                          <div className="category-description">{category.description}</div>
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
                              const isSelected = selectedItems.some((i) => i.id === item.id);
                              return (
                                <div
                                  key={item.id}
                                  className={`item-card ${isSelected ? 'selected' : ''}`}
                                  onClick={() => toggleItemSelection(category.id, item)}
                                >
                                  <div className="item-checkbox">
                                    {isSelected && <Check size={16} />}
                                  </div>
                                  <div className="item-icon">{item.image}</div>
                                  <div className="item-name">{item.name}</div>
                                  <div className="item-description">{item.description}</div>
                                  <div className="item-footer">
                                    <span className="item-price">₹{item.price}</span>
                                    {item.vegetarian && <span className="veg-badge">VEG</span>}
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

                {cart.length > 0 && (
                  <>
                    <div className="cart-summary" style={{ marginTop: '32px' }}>
                      <div style={{ marginBottom: '12px', fontWeight: '700', fontSize: '14px' }}>Your Cart</div>
                      {cart.map((item) => (
                        <div key={item.categoryId} className="summary-item" style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <span>{item.categoryName} (x{item.quantity})</span>
                          <span className="summary-value">₹{(item.categoryPrice * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="summary-item total">
                        <span>Total:</span>
                        <span className="summary-value">₹{Math.round(finalTotal).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="button-group">
                      <button className="btn-secondary" onClick={() => setCart([])}>Clear</button>
                      <button
                        className="btn-primary"
                        onClick={() => setCheckoutStep('details')}
                        disabled={cart.length === 0}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Booking Details */}
              <div className={`checkout-section ${checkoutStep === 'details' ? 'active' : ''}`}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={bookingOptions.userName}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, userName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={bookingOptions.userContact}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, userContact: e.target.value })}
                    />
                  </div>
                </div>

                <div className="address-type-selector">
                  <button
                    className={`address-type-btn ${addressType === 'existing' ? 'active' : ''}`}
                    onClick={() => setAddressType('existing')}
                  >
                    <MapPin size={16} />
                    Select Address
                  </button>
                  <button
                    className={`address-type-btn ${addressType === 'custom' ? 'active' : ''}`}
                    onClick={() => setAddressType('custom')}
                  >
                    <Plus size={16} />
                    Add New Address
                  </button>
                </div>

                {addressType === 'existing' && (
                  <div className="address-cards">
                    {userData.addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`address-card ${bookingOptions.selectedAddressId === address.id ? 'active' : ''}`}
                        onClick={() => setBookingOptions({ ...bookingOptions, selectedAddressId: address.id })}
                      >
                        <div className="address-card-radio">
                          {bookingOptions.selectedAddressId === address.id && <Check size={16} />}
                        </div>
                        <div className="address-label">{address.label}</div>
                        <div className="address-text">{address.address}</div>
                        <div className="address-details">
                          {address.city}, {address.state} - {address.zipCode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {addressType === 'custom' && (
                  <div className="form-group">
                    <label className="form-label">Custom Address</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={bookingOptions.customAddress}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, customAddress: e.target.value })}
                    />
                  </div>
                )}

                <div className="button-group">
                  <button className="btn-secondary" onClick={() => setCheckoutStep('menu')}>← Back</button>
                  <button
                    className="btn-primary"
                    onClick={() => setCheckoutStep('booking')}
                    disabled={!bookingOptions.userName || !bookingOptions.userContact || (addressType === 'custom' && !bookingOptions.customAddress)}
                  >
                    Continue
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className={`checkout-section ${checkoutStep === 'booking' ? 'active' : ''}`}>
                <div style={{ marginBottom: '24px' }}>
                  <div className="form-label" style={{ marginBottom: '12px' }}>Select Your Package</div>
                  <div className="package-grid">
                    {[
                      { type: 'basic' as const, multiplier: 1 },
                      { type: 'premium' as const, multiplier: 1.25 },
                      { type: 'deluxe' as const, multiplier: 1.5 },
                    ].map((pkg) => (
                      <div
                        key={pkg.type}
                        className={`package-card ${bookingOptions.packageType === pkg.type ? 'active' : ''}`}
                        onClick={() => setBookingOptions({ ...bookingOptions, packageType: pkg.type })}
                      >
                        <div className="package-name">{pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}</div>
                        <div className="package-multiplier">{pkg.multiplier}x</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Number of Guests</label>
                    <input
                      type="number"
                      className="form-input"
                      min={catererData.minGuests}
                      max={catererData.maxGuests}
                      value={bookingOptions.guests}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, guests: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingOptions.date}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={bookingOptions.time}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, time: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Menu Type</label>
                    <select
                      className="form-select"
                      value={bookingOptions.sampleMenu}
                      onChange={(e) => setBookingOptions({ ...bookingOptions, sampleMenu: e.target.value })}
                    >
                      <option value="">Select Type</option>
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
                      onChange={(e) => setBookingOptions({ ...bookingOptions, staffRequired: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                  <div className="form-label" style={{ marginBottom: '12px' }}>Additional Services</div>
                  <div className="services-grid">
                    {[
                      { key: 'serveFood' as const, label: 'Serving & Setup', price: `₹${bookingOptions.guests * 50}` },
                      { key: 'decoration' as const, label: 'Decoration', price: '₹5,000' },
                      { key: 'cleanup' as const, label: 'Cleanup', price: '₹2,000' },
                      { key: 'beverageService' as const, label: 'Beverage Service', price: `₹${bookingOptions.guests * 100}` },
                    ].map((service) => (
                      <label key={service.key} className="service-checkbox">
                        <input
                          type="checkbox"
                          checked={bookingOptions.additionalServices[service.key]}
                          onChange={(e) => setBookingOptions({
                            ...bookingOptions,
                            additionalServices: {
                              ...bookingOptions.additionalServices,
                              [service.key]: e.target.checked,
                            },
                          })}
                        />
                        <div className="service-label">
                          <span className="service-name">{service.label}</span>
                          <span className="service-price">{service.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="cart-summary">
                  <div className="summary-item">
                    <span>Menu Subtotal:</span>
                    <span className="summary-value">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Platform Fee (5%):</span>
                    <span className="summary-value">₹{Math.round(platformFee).toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Tax (18%):</span>
                    <span className="summary-value">₹{Math.round(tax).toLocaleString()}</span>
                  </div>
                  {additionalServicesCost > 0 && (
                    <div className="summary-item">
                      <span>Services:</span>
                      <span className="summary-value">₹{Math.round(additionalServicesCost).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span className="summary-value">₹{Math.round(finalTotalWithPackage).toLocaleString()}</span>
                  </div>
                </div>

                <div className="button-group">
                  <button className="btn-secondary" onClick={() => setCheckoutStep('details')}>← Back</button>
                  <button
                    className="btn-primary"
                    onClick={() => setCheckoutStep('payment')}
                    disabled={!bookingOptions.date || !bookingOptions.sampleMenu}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>

              {/* Payment */}
              <div className={`checkout-section ${checkoutStep === 'payment' ? 'active' : ''}`}>
                <div className="form-label" style={{ marginBottom: '12px' }}>Select Payment Method</div>
                <div className="payment-methods">
                  {[
                    { id: 'card', name: 'Card', icon: '💳' },
                    { id: 'upi', name: 'UPI', icon: '📱' },
                    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
                    { id: 'wallet', name: 'Wallet', icon: '👛' },
                  ].map((method) => (
                    <div key={method.id} className="payment-method active">
                      <div className="payment-icon">{method.icon}</div>
                      <div className="payment-name">{method.name}</div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div style={{ marginBottom: '12px', fontWeight: '700' }}>Order Summary</div>
                  <div className="summary-item">
                    <span>Menu Items:</span>
                    <span className="summary-value">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Fees & Taxes:</span>
                    <span className="summary-value">₹{Math.round(platformFee + tax).toLocaleString()}</span>
                  </div>
                  {additionalServicesCost > 0 && (
                    <div className="summary-item">
                      <span>Services:</span>
                      <span className="summary-value">₹{Math.round(additionalServicesCost).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-item total">
                    <span>Amount to Pay:</span>
                    <span className="summary-value">₹{Math.round(finalTotalWithPackage).toLocaleString()}</span>
                  </div>
                </div>

                <div className="button-group">
                  <button className="btn-secondary" onClick={() => setCheckoutStep('booking')}>← Back</button>
                  <button className="btn-primary" onClick={() => setCheckoutStep('confirmation')}>Pay & Confirm</button>
                </div>
              </div>

              {/* Confirmation */}
              <div className={`checkout-section ${checkoutStep === 'confirmation' ? 'active' : ''}`}>
                <div className="confirmation-box">
                  <div className="confirmation-icon">✅</div>
                  <div className="confirmation-title">Booking Confirmed!</div>
                  <div className="confirmation-message">
                    Your catering booking has been successfully confirmed. The caterer will contact you within 2 hours.
                  </div>

                  <div className="booking-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <div className="detail-label">Booking ID</div>
                        <div className="detail-value">#BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Date & Time</div>
                        <div className="detail-value">{bookingOptions.date} at {bookingOptions.time}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Guests</div>
                        <div className="detail-value">{bookingOptions.guests} people</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Total Amount</div>
                        <div className="detail-value" style={{ color: '#4f46e5' }}>
                          ₹{Math.round(finalTotalWithPackage).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn-secondary btn-full" onClick={closeBookingModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}