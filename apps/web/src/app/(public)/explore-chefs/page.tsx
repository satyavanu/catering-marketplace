'use client';

import { useState, useMemo, CSSProperties, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ============ TYPES ============
interface Chef {
  id: string;
  name: string;
  chefType: 'HOME_CHEF' | 'CATERER' | 'PRIVATE_CHEF' | 'MEAL_PLAN_PROVIDER';
  profileImage: string;
  rating: number;
  reviewsCount: number;
  city: string;
  cuisines: string[];
  specialties: string[];
  pricePerPlate: number;
  pricePerSession?: number;
  pricePerWeek?: number;
  isAvailableToday: boolean;
  isVerified: boolean;
  hygieneCertified: boolean;
  experience: number;
  totalOrders: number;
  repeatCustomerPercent: number;
  responseTime: string;
  bio: string;
  minGuests?: number;
  maxGuests?: number;
  includesHelper?: boolean;
  instantBook?: boolean;
  tags?: string[];
}

interface City {
  id: string;
  name: string;
}

interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

type IntentType = 'events' | 'private' | 'meals' | null;

// ============ ENHANCED STYLES ============
const styles = {
  pageContainer: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  } as CSSProperties,

  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '48px 20px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  } as CSSProperties,

  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  } as CSSProperties,

  heroTitle: {
    fontSize: '42px',
    fontWeight: '900',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  } as CSSProperties,

  heroSubtitle: {
    fontSize: '16px',
    opacity: 0.95,
    margin: '0 0 32px 0',
    lineHeight: '1.6',
  } as CSSProperties,

  intentSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  } as CSSProperties,

  intentButton: {
    padding: '18px 24px',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  intentButtonActive: {
    padding: '18px 24px',
    borderRadius: '12px',
    border: '2px solid white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  } as CSSProperties,

  intentLabel: {
    fontSize: '24px',
  } as CSSProperties,

  intentText: {
    fontSize: '12px',
    opacity: 0.9,
  } as CSSProperties,

  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  } as CSSProperties,

  heroStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  } as CSSProperties,

  heroStatValue: {
    fontSize: '28px',
    fontWeight: '800',
  } as CSSProperties,

  heroStatLabel: {
    fontSize: '12px',
    opacity: 0.9,
    fontWeight: '500',
  } as CSSProperties,

  trustBadges: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
    padding: '16px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    flexWrap: 'wrap',
  } as CSSProperties,

  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
  } as CSSProperties,

  filterSectionContainer: {
    backgroundColor: 'white',
    padding: '28px 20px',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  } as CSSProperties,

  maxWidthWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as CSSProperties,

  filterGridWrapper: {
    marginBottom: '20px',
  } as CSSProperties,

  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  } as CSSProperties,

  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as CSSProperties,

  filterLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  } as CSSProperties,

  filterInput: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '13px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  } as CSSProperties,

  filterSelect: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  filterActionsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as CSSProperties,

  resetBtn: {
    padding: '10px 18px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  resultsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  } as CSSProperties,

  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
  } as CSSProperties,

  resultsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  } as CSSProperties,

  resultsCount: {
    fontSize: '15px',
    color: '#1e293b',
    fontWeight: '700',
  } as CSSProperties,

  resultsSubtext: {
    fontSize: '13px',
    color: '#64748b',
  } as CSSProperties,

  sortContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  } as CSSProperties,

  sortLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  } as CSSProperties,

  sortSelect: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '13px',
    cursor: 'pointer',
    backgroundColor: 'white',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  } as CSSProperties,

  chefCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,

  chefCardHovered: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px solid #667eea',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-8px)',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,

  cardImageContainer: {
    width: '100%',
    height: '180px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    position: 'relative',
    overflow: 'hidden',
  } as CSSProperties,

  badgeContainer: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  } as CSSProperties,

  badge: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#fff',
    color: '#667eea',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  } as CSSProperties,

  badgeVerified: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
  } as CSSProperties,

  badgeTrending: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#fef3c7',
    color: '#92400e',
  } as CSSProperties,

  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  } as CSSProperties,

  priceSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '8px',
  } as CSSProperties,

  priceValue: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#667eea',
  } as CSSProperties,

  priceUnit: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  } as CSSProperties,

  cardHeader: {
    marginBottom: '4px',
  } as CSSProperties,

  chefTypeTag: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#667eea',
    backgroundColor: '#eef2ff',
    padding: '4px 10px',
    borderRadius: '6px',
    marginBottom: '6px',
  } as CSSProperties,

  chefName: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0,
    lineHeight: '1.3',
  } as CSSProperties,

  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  } as CSSProperties,

  ratingValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '700',
  } as CSSProperties,

  starIcon: {
    color: '#f59e0b',
  } as CSSProperties,

  reviewCount: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  } as CSSProperties,

  bestForSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    fontSize: '12px',
  } as CSSProperties,

  bestForItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#475569',
  } as CSSProperties,

  cuisinesList: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  } as CSSProperties,

  cuisineTag: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
  } as CSSProperties,

  ctaSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  } as CSSProperties,

  quickViewBtn: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #667eea',
    backgroundColor: 'white',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  bookBtn: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  } as CSSProperties,

  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  } as CSSProperties,

  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  } as CSSProperties,

  emptyTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 10px 0',
  } as CSSProperties,

  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 24px 0',
    maxWidth: '400px',
  } as CSSProperties,

  quickViewModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  } as CSSProperties,

  quickViewContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '32px',
  } as CSSProperties,

  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f1f5f9',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,

  modalTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 16px 0',
  } as CSSProperties,

  modalPrice: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#667eea',
    margin: '0 0 16px 0',
  } as CSSProperties,

  modalDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  } as CSSProperties,

  modalDetailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#475569',
  } as CSSProperties,
};

// ============ DATA ============
const AVAILABLE_CITIES: City[] = [
  { id: '1', name: 'Hyderabad' },
  { id: '2', name: 'Bangalore' },
  { id: '3', name: 'Mumbai' },
  { id: '4', name: 'Delhi' },
  { id: '5', name: 'Pune' },
];

const CHEF_TYPES: FilterOption[] = [
  { id: 'HOME_CHEF', label: '🏠 Home Chef' },
  { id: 'CATERER', label: '🍽️ Caterer' },
  { id: 'PRIVATE_CHEF', label: '👨‍🍳 Private Chef' },
  { id: 'MEAL_PLAN_PROVIDER', label: '🥗 Meal Plans' },
];

const SAMPLE_CHEFS: Chef[] = [
  {
    id: '1',
    name: 'Chef Rajesh Sharma',
    chefType: 'HOME_CHEF',
    profileImage: '👨‍🍳',
    rating: 4.8,
    reviewsCount: 245,
    city: 'Hyderabad',
    cuisines: ['North Indian', 'Chinese'],
    specialties: ['Biryani', 'Butter Chicken'],
    pricePerPlate: 250,
    isAvailableToday: true,
    isVerified: true,
    hygieneCertified: true,
    experience: 8,
    totalOrders: 342,
    repeatCustomerPercent: 78,
    responseTime: '< 2 hours',
    bio: 'Passionate home chef specializing in authentic North Indian flavors.',
    minGuests: 5,
    maxGuests: 50,
    includesHelper: false,
    instantBook: true,
    tags: ['⚡ Available Today', '🔥 Popular'],
  },
  {
    id: '2',
    name: 'Royal Kitchen Co.',
    chefType: 'CATERER',
    profileImage: '👑',
    rating: 4.9,
    reviewsCount: 356,
    city: 'Hyderabad',
    cuisines: ['Multi-cuisine', 'Italian'],
    specialties: ['Wedding Catering', 'Corporate Events'],
    pricePerPlate: 400,
    isAvailableToday: false,
    isVerified: true,
    hygieneCertified: true,
    experience: 15,
    totalOrders: 567,
    repeatCustomerPercent: 85,
    responseTime: '< 1 hour',
    bio: 'Premium catering service for weddings and corporate events.',
    minGuests: 50,
    maxGuests: 500,
    includesHelper: true,
    instantBook: false,
    tags: ['🏆 Top Rated', '🔥 Most Popular'],
  },
  {
    id: '3',
    name: 'Chef Priya Sharma',
    chefType: 'PRIVATE_CHEF',
    profileImage: '👩‍🍳',
    rating: 4.7,
    reviewsCount: 189,
    city: 'Bangalore',
    cuisines: ['South Indian', 'Kerala'],
    specialties: ['Appam', 'Fish Curry'],
    pricePerSession: 5000,
    isAvailableToday: true,
    isVerified: true,
    hygieneCertified: true,
    experience: 12,
    totalOrders: 234,
    repeatCustomerPercent: 82,
    responseTime: '< 4 hours',
    bio: 'Exclusive private chef for intimate dinners and special occasions.',
    minGuests: 2,
    maxGuests: 10,
    includesHelper: false,
    instantBook: true,
    tags: ['⚡ Available Today'],
  },
  {
    id: '4',
    name: 'FitMeals Kitchen',
    chefType: 'MEAL_PLAN_PROVIDER',
    profileImage: '🥗',
    rating: 4.6,
    reviewsCount: 178,
    city: 'Mumbai',
    cuisines: ['Healthy', 'Protein-Rich'],
    specialties: ['Meal Prep', 'Fitness Plans'],
    pricePerWeek: 2000,
    isAvailableToday: true,
    isVerified: true,
    hygieneCertified: true,
    experience: 5,
    totalOrders: 445,
    repeatCustomerPercent: 76,
    responseTime: '< 1 hour',
    bio: 'Healthy, nutritious meal plans tailored to your fitness goals.',
    includesHelper: false,
    instantBook: true,
    tags: ['⚡ Available Today'],
  },
  {
    id: '5',
    name: 'Maharaja Catering',
    chefType: 'CATERER',
    profileImage: '🍽️',
    rating: 4.8,
    reviewsCount: 512,
    city: 'Hyderabad',
    cuisines: ['Hyderabadi', 'Mughlai'],
    specialties: ['Biryani', 'Kebabs'],
    pricePerPlate: 320,
    isAvailableToday: false,
    isVerified: true,
    hygieneCertified: true,
    experience: 20,
    totalOrders: 678,
    repeatCustomerPercent: 88,
    responseTime: '< 30 mins',
    bio: 'Authentic Hyderabadi cuisine specialists.',
    minGuests: 100,
    maxGuests: 500,
    includesHelper: true,
    instantBook: false,
    tags: ['🏆 Top Rated'],
  },
  {
    id: '6',
    name: 'Chef Arun Kumar',
    chefType: 'HOME_CHEF',
    profileImage: '👨‍🍳',
    rating: 4.5,
    reviewsCount: 123,
    city: 'Pune',
    cuisines: ['Bakery', 'Desserts'],
    specialties: ['Cakes', 'Custom Desserts'],
    pricePerPlate: 200,
    isAvailableToday: true,
    isVerified: false,
    hygieneCertified: false,
    experience: 6,
    totalOrders: 234,
    repeatCustomerPercent: 65,
    responseTime: '< 3 hours',
    bio: 'Passionate baker creating custom desserts.',
    minGuests: 3,
    maxGuests: 30,
    includesHelper: false,
    instantBook: true,
    tags: [],
  },
  {
    id: '7',
    name: 'Continental Express',
    chefType: 'CATERER',
    profileImage: '🍴',
    rating: 4.4,
    reviewsCount: 98,
    city: 'Delhi',
    cuisines: ['Continental', 'Italian'],
    specialties: ['Pasta', 'Grills'],
    pricePerPlate: 450,
    isAvailableToday: true,
    isVerified: true,
    hygieneCertified: true,
    experience: 10,
    totalOrders: 312,
    repeatCustomerPercent: 72,
    responseTime: '< 2 hours',
    bio: 'Continental cuisine specialists.',
    minGuests: 30,
    maxGuests: 200,
    includesHelper: true,
    instantBook: true,
    tags: ['⚡ Available Today'],
  },
  {
    id: '8',
    name: 'Spice Route Kitchen',
    chefType: 'HOME_CHEF',
    profileImage: '👨‍🍳',
    rating: 4.7,
    reviewsCount: 267,
    city: 'Bangalore',
    cuisines: ['North Indian', 'South Indian'],
    specialties: ['Fusion Cuisine', 'Traditional Recipes'],
    pricePerPlate: 280,
    isAvailableToday: true,
    isVerified: true,
    hygieneCertified: true,
    experience: 9,
    totalOrders: 401,
    repeatCustomerPercent: 79,
    responseTime: '< 1.5 hours',
    bio: 'Culinary artist blending traditional recipes with modern techniques.',
    minGuests: 5,
    maxGuests: 40,
    includesHelper: false,
    instantBook: true,
    tags: ['⚡ Available Today', '🔥 Popular'],
  },
];

// ============ MAIN COMPONENT ============
export default function ExploreChefs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<City>(AVAILABLE_CITIES[0]);
  const [selectedChefType, setSelectedChefType] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedIntent, setSelectedIntent] = useState<IntentType>(null);
  const [quickViewChef, setQuickViewChef] = useState<Chef | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const cuisine = searchParams.get('cuisine');

    if (city) {
      const foundCity = AVAILABLE_CITIES.find((c) => c.name === city);
      if (foundCity) setSelectedCity(foundCity);
    }
    if (type) setSelectedChefType(type);
    if (cuisine) setSelectedCuisine(cuisine);
  }, [searchParams]);

  const filteredChefs = useMemo(() => {
    let results = SAMPLE_CHEFS.filter((chef) => {
      if (chef.city !== selectedCity.name) return false;
      if (selectedChefType && chef.chefType !== selectedChefType) return false;
      if (selectedCuisine && !chef.cuisines.includes(selectedCuisine)) return false;
      if (searchQuery && !chef.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      if (minPrice) {
        const price = chef.pricePerPlate || chef.pricePerSession || chef.pricePerWeek || 0;
        if (price < parseInt(minPrice)) return false;
      }
      if (maxPrice) {
        const price = chef.pricePerPlate || chef.pricePerSession || chef.pricePerWeek || 0;
        if (price > parseInt(maxPrice)) return false;
      }

      return true;
    });

    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      const priceA = (a.pricePerPlate || a.pricePerSession || a.pricePerWeek) || 0;
      const priceB = (b.pricePerPlate || b.pricePerSession || b.pricePerWeek) || 0;
      results.sort((a, b) => priceA - priceB);
    } else if (sortBy === 'price-high') {
      const priceA = (a.pricePerPlate || a.pricePerSession || a.pricePerWeek) || 0;
      const priceB = (b.pricePerPlate || b.pricePerSession || b.pricePerWeek) || 0;
      results.sort((a, b) => priceB - priceA);
    } else if (sortBy === 'reviews') {
      results.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'available') {
      results.sort((a, b) => (b.isAvailableToday ? 1 : 0) - (a.isAvailableToday ? 1 : 0));
    }

    return results;
  }, [selectedCity, selectedChefType, selectedCuisine, searchQuery, sortBy, minPrice, maxPrice]);

  const handleChefClick = (chefId: string) => {
    router.push(`/explore-chefs/${chefId}`);
  };

  const resetFilters = () => {
    setSelectedChefType('');
    setSelectedCuisine('');
    setSearchQuery('');
    setSortBy('relevance');
    setMinPrice('');
    setMaxPrice('');
    setSelectedIntent(null);
  };

  const getPriceDisplay = (chef: Chef) => {
    if (chef.pricePerPlate) return `₹${chef.pricePerPlate} / person`;
    if (chef.pricePerSession) return `₹${chef.pricePerSession} / session`;
    if (chef.pricePerWeek) return `₹${chef.pricePerWeek} / week`;
    return 'Custom pricing';
  };

  const getPriceUnit = (chef: Chef) => {
    if (chef.pricePerPlate) return 'per person';
    if (chef.pricePerSession) return 'per session';
    if (chef.pricePerWeek) return 'per week';
    return '';
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>👨‍🍳 Find Your Perfect Chef</h1>
          <p style={styles.heroSubtitle}>
            Book experienced chefs for events, private dining, meal plans, or home cooking
          </p>

          {/* Intent Buttons */}
          <div style={styles.intentSection}>
            <button
              onClick={() => setSelectedIntent(selectedIntent === 'events' ? null : 'events')}
              style={selectedIntent === 'events' ? styles.intentButtonActive : styles.intentButton}
            >
              <div style={styles.intentLabel}>🍽️</div>
              <div style={styles.intentText}>Event Catering</div>
            </button>
            <button
              onClick={() => setSelectedIntent(selectedIntent === 'private' ? null : 'private')}
              style={selectedIntent === 'private' ? styles.intentButtonActive : styles.intentButton}
            >
              <div style={styles.intentLabel}>👨‍🍳</div>
              <div style={styles.intentText}>Private Chef</div>
            </button>
            <button
              onClick={() => setSelectedIntent(selectedIntent === 'meals' ? null : 'meals')}
              style={selectedIntent === 'meals' ? styles.intentButtonActive : styles.intentButton}
            >
              <div style={styles.intentLabel}>🥗</div>
              <div style={styles.intentText}>Meal Plans</div>
            </button>
          </div>

          {/* Trust Badges */}
          <div style={styles.trustBadges}>
            <div style={styles.trustBadge}>✓ Verified Chefs</div>
            <div style={styles.trustBadge}>🔒 Secure Payments</div>
            <div style={styles.trustBadge}>↩️ Easy Cancellations</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSectionContainer}>
        <div style={styles.maxWidthWrapper}>
          <div style={styles.filterGridWrapper}>
            <div style={styles.filterGrid}>
              {/* City Selection */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>📍 Location</label>
                <select
                  value={selectedCity.id}
                  onChange={(e) => {
                    const city = AVAILABLE_CITIES.find((c) => c.id === e.target.value);
                    if (city) setSelectedCity(city);
                  }}
                  style={styles.filterSelect}
                >
                  {AVAILABLE_CITIES.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chef Type */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>👨‍🍳 Chef Type</label>
                <select
                  value={selectedChefType}
                  onChange={(e) => setSelectedChefType(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="">All Types</option>
                  {CHEF_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Min */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>💰 Min Budget</label>
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={styles.filterInput}
                />
              </div>

              {/* Budget Max */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>💰 Max Budget</label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={styles.filterInput}
                />
              </div>

              {/* Search */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>🔍 Search</label>
                <input
                  type="text"
                  placeholder="Chef name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.filterInput}
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div style={styles.filterActionsRow}>
            <button onClick={resetFilters} style={styles.resetBtn}>
              ✕ Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={styles.resultsContainer}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsInfo}>
            <div style={styles.resultsCount}>
              {filteredChefs.length > 0 ? filteredChefs.length : 'No'} Results
            </div>
            <div style={styles.resultsSubtext}>
              {filteredChefs.length > 0 ? 'Top chefs' : 'Try adjusting filters'}
            </div>
          </div>
          <div style={styles.sortContainer}>
            <span style={styles.sortLabel}>Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
              <option value="relevance">Relevance</option>
              <option value="rating">⭐ Top Rated</option>
              <option value="reviews">📊 Most Reviewed</option>
              <option value="available">⚡ Available Today</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💰 Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredChefs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No chefs found</h3>
            <p style={styles.emptyText}>Try adjusting your filters, budget, or search criteria</p>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            {filteredChefs.map((chef) => (
              <ChefCard
                key={chef.id}
                chef={chef}
                onViewProfile={() => handleChefClick(chef.id)}
                onQuickView={() => setQuickViewChef(chef)}
                getPriceDisplay={getPriceDisplay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewChef && (
        <div style={styles.quickViewModal} onClick={() => setQuickViewChef(null)}>
          <div style={styles.quickViewContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setQuickViewChef(null)}>
              ✕
            </button>
            <h2 style={styles.modalTitle}>{quickViewChef.name}</h2>
            <div style={styles.modalPrice}>{getPriceDisplay(quickViewChef)}</div>

            <div style={styles.modalDetails}>
              <div style={styles.modalDetailRow}>⭐ {quickViewChef.rating} ({quickViewChef.reviewsCount} bookings)</div>
              <div style={styles.modalDetailRow}>📍 {quickViewChef.city}</div>
              <div style={styles.modalDetailRow}>
                👥 Serves: {quickViewChef.minGuests || 'Custom'} {quickViewChef.maxGuests ? `- ${quickViewChef.maxGuests}` : ''} people
              </div>
              {quickViewChef.includesHelper && (
                <div style={styles.modalDetailRow}>👨‍🍳 Includes 1 helper</div>
              )}
              <div style={styles.modalDetailRow}>🍳 {quickViewChef.cuisines.join(', ')}</div>
            </div>

            <button
              style={styles.bookBtn}
              onClick={() => {
                handleChefClick(quickViewChef.id);
                setQuickViewChef(null);
              }}
            >
              View Packages & Book →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ CHEF CARD COMPONENT ============
interface ChefCardProps {
  chef: Chef;
  onViewProfile: () => void;
  onQuickView: () => void;
  getPriceDisplay: (chef: Chef) => string;
}

function ChefCard({ chef, onViewProfile, onQuickView, getPriceDisplay }: ChefCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getChefTypeLabel = () => {
    const labels: Record<string, string> = {
      HOME_CHEF: 'Home Chef',
      CATERER: 'Caterer',
      PRIVATE_CHEF: 'Private Chef',
      MEAL_PLAN_PROVIDER: 'Meal Plans',
    };
    return labels[chef.chefType] || 'Chef';
  };

  return (
    <div
      style={isHovered ? styles.chefCardHovered : styles.chefCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div style={styles.cardImageContainer}>
        {chef.profileImage}
        <div style={styles.badgeContainer}>
          {chef.isVerified && <div style={styles.badgeVerified}>✓ Verified</div>}
          {chef.isAvailableToday && <div style={styles.badge}>⚡ Available Today</div>}
          {chef.tags?.includes('🏆 Top Rated') && <div style={styles.badgeTrending}>🏆 Top Rated</div>}
        </div>
      </div>

      {/* Content */}
      <div style={styles.cardContent}>
        {/* Price - TOP PRIORITY */}
        <div style={styles.priceSection}>
          <div style={styles.priceValue}>{getPriceDisplay(chef).split(' /')[0]}</div>
          <div style={styles.priceUnit}>{getPriceDisplay(chef).split(' /')[1]}</div>
        </div>

        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.chefTypeTag}>{getChefTypeLabel()}</div>
          <h3 style={styles.chefName}>{chef.name}</h3>
        </div>

        {/* Rating */}
        <div style={styles.ratingSection}>
          <div style={styles.ratingValue}>
            <span style={styles.starIcon}>⭐</span>
            <span>{chef.rating}</span>
          </div>
          <div style={styles.reviewCount}>({chef.reviewsCount} bookings)</div>
        </div>

        {/* Best For */}
        <div style={styles.bestForSection}>
          <div style={styles.bestForItem}>
            ✓ Best for: {chef.chefType === 'HOME_CHEF' ? 'Home Events' : chef.chefType === 'CATERER' ? 'Large Events' : 'Intimate Dining'}
          </div>
          {chef.minGuests && (
            <div style={styles.bestForItem}>
              ✓ Serves: {chef.minGuests}–{chef.maxGuests || '∞'} people
            </div>
          )}
          {chef.includesHelper && <div style={styles.bestForItem}>✓ Includes: 1 helper</div>}
        </div>

        {/* Cuisines */}
        <div style={styles.cuisinesList}>
          {chef.cuisines.slice(0, 2).map((cuisine, idx) => (
            <span key={idx} style={styles.cuisineTag}>
              {cuisine}
            </span>
          ))}
          {chef.cuisines.length > 2 && <span style={styles.cuisineTag}>+{chef.cuisines.length - 2}</span>}
        </div>

        {/* CTAs */}
        <div style={styles.ctaSection}>
          <button style={styles.quickViewBtn} onClick={onQuickView}>
            Quick View
          </button>
          <button style={styles.bookBtn} onClick={onViewProfile}>
            Book →
          </button>
        </div>
      </div>
    </div>
  );
}