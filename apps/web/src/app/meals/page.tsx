'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  CheckIcon,
  ShoppingCartIcon,
  StarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

// ...existing interfaces...

interface MealPlan {
  id: number;
  name: string;
  mealType: string;
  mealTypeLabel: string;
  price: number;
  originalPrice: number;
  duration: string;
  durationLabel: string;
  mealsPerWeek: number;
  description: string;
  fullDescription: string;
  items: string[];
  addOns: Array<{ id: number; name: string; price: number }>;
  rating: number;
  reviews: number;
  subscribers: number;
  badge: string;
  color: string;
  image: string;
  tags: string[];
  catererId: number;
  catererName: string;
  catererLogo?: string;
  catererVerified: boolean;
  // NEW FIELDS
  cuisineType: 'veg' | 'non-veg' | 'vegan' | 'mixed';
  keyHighlights: string[];
  useCaseTags: string[];
  bookingType: 'instant' | 'confirmation';
  availability: 'available' | 'limited' | 'fully-booked';
  slotsLeft?: number;
  timesBooked: number;
}

interface City {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  description: string;
  activeVendors: number;
  popularPlans: number;
}

interface ArrivalPack {
  id: number;
  name: string;
  emoji: string;
  description: string;
  duration: string;
  mealsIncluded: number;
  price: number;
  originalPrice: number;
  badge: string;
  highlights: string[];
  items: string[];
  rating: number;
  reviews: number;
  catererName: string;
  catererLogo: string;
  catererVerified: boolean;
  deliveryTime: string;
}

// Add arrival packs data
const arrivalPacks: ArrivalPack[] = [
  {
    id: 101,
    name: 'Welcome to Kolkata',
    emoji: '✈️',
    description: 'Get settled with delicious local flavors',
    duration: '3 Days',
    mealsIncluded: 9,
    price: 1999,
    originalPrice: 2499,
    badge: '✈️ Travel Friendly',
    highlights: ['Same day delivery', 'Local cuisine', 'No subscription'],
    items: ['Luchi Aloo', 'Machli Jhol', 'Cholar Dal', 'Rice', 'Mishti Doi'],
    rating: 4.8,
    reviews: 234,
    catererName: 'Kolkata Home Kitchens',
    catererLogo: '👨‍🍳',
    catererVerified: true,
    deliveryTime: 'Today, 6 PM',
  },
  {
    id: 102,
    name: 'Mumbai Munchies',
    emoji: '✈️',
    description: 'Street food vibes & home-cooked meals',
    duration: '3 Days',
    mealsIncluded: 9,
    price: 1799,
    originalPrice: 2299,
    badge: '✈️ Travel Friendly',
    highlights: ['Same day delivery', 'Street food edition', 'No subscription'],
    items: ['Pav Bhaji', 'Vada Pav', 'Misal Pav', 'Biryani', 'Kheer'],
    rating: 4.7,
    reviews: 189,
    catererName: 'Mumbai Street Kitchen',
    catererLogo: '🍳',
    catererVerified: true,
    deliveryTime: 'Today, 5 PM',
  },
  {
    id: 103,
    name: 'Bangalore Bites',
    emoji: '✈️',
    description: 'Tech city favorites with international touch',
    duration: '3 Days',
    mealsIncluded: 9,
    price: 2099,
    originalPrice: 2699,
    badge: '✈️ Travel Friendly',
    highlights: ['Same day delivery', 'Fusion cuisine', 'No subscription'],
    items: ['Idiyappam', 'Sambar', 'Dosa', 'Butter Chicken', 'Gulab Jamun'],
    rating: 4.9,
    reviews: 312,
    catererName: 'Bangalore Kitchen',
    catererLogo: '🥘',
    catererVerified: true,
    deliveryTime: 'Today, 7 PM',
  },
];

export default function MealPackagesPage({ initialCity }: { initialCity?: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);

  const cities: City[] = [
    { id: 1, name: 'Mumbai', slug: 'mumbai', emoji: '🌊', description: 'Metropolitan hub', activeVendors: 45, popularPlans: 128 },
    { id: 2, name: 'Bangalore', slug: 'bangalore', emoji: '🏙️', description: 'Tech city', activeVendors: 38, popularPlans: 112 },
    { id: 3, name: 'Delhi', slug: 'delhi', emoji: '🏛️', description: 'Capital city', activeVendors: 52, popularPlans: 156 },
    { id: 4, name: 'Pune', slug: 'pune', emoji: '⛰️', description: 'Queen of Deccan', activeVendors: 28, popularPlans: 89 },
    { id: 5, name: 'Hyderabad', slug: 'hyderabad', emoji: '🏞️', description: 'City of pearls', activeVendors: 32, popularPlans: 98 },
    { id: 6, name: 'Chennai', slug: 'chennai', emoji: '🌴', description: 'Gateway of South', activeVendors: 24, popularPlans: 76 },
    { id: 7, name: 'Kolkata', slug: 'kolkata', emoji: '🎭', description: 'City of joy', activeVendors: 18, popularPlans: 64 },
    { id: 8, name: 'Jaipur', slug: 'jaipur', emoji: '🏰', description: 'Pink city', activeVendors: 15, popularPlans: 52 },
  ];

  const allPlans: MealPlan[] = [
    {
      id: 1,
      name: 'Healthy Morning Bundle',
      mealType: 'breakfast',
      mealTypeLabel: '🌅 Breakfast',
      price: 4999,
      originalPrice: 5999,
      duration: 'monthly',
      durationLabel: 'Monthly',
      mealsPerWeek: 5,
      description: 'Perfect breakfast and light snacks for a healthy start',
      fullDescription: 'Start your day right with our healthy breakfast bundle. Includes fresh vegetables, proteins, and whole grains.',
      items: ['Vegetable Poha', 'Idli Sambar', 'Dosa', 'Fresh Juices', 'Eggs', 'Bread Toast', 'Fresh Fruits', 'Yogurt'],
      addOns: [
        { id: 1, name: 'Extra Dessert', price: 500 },
        { id: 2, name: 'Premium Juice', price: 300 },
      ],
      rating: 4.8,
      reviews: 245,
      subscribers: 1200,
      badge: 'Most Popular',
      color: 'from-orange-500 to-yellow-500',
      image: '🌅',
      tags: ['vegetarian', 'healthy', 'quick'],
      catererId: 1,
      catererName: 'Sharma Caterers',
      catererLogo: '👨‍🍳',
      catererVerified: true,
      cuisineType: 'veg',
      keyHighlights: ['High protein', 'Gluten-free options', 'Fresh ingredients'],
      useCaseTags: ['Best for students', 'Quick breakfast'],
      bookingType: 'confirmation',
      availability: 'available',
      timesBooked: 342,
    },
    {
      id: 2,
      name: 'Lunch Pro Plan',
      mealType: 'lunch',
      mealTypeLabel: '🍽️ Lunch',
      price: 7999,
      originalPrice: 9999,
      duration: 'monthly',
      durationLabel: 'Monthly',
      mealsPerWeek: 5,
      description: 'Complete lunch meals for office workers with balanced nutrition',
      fullDescription: 'Professional meal planning for busy schedules.',
      items: ['Biryani', 'Butter Chicken', 'Dal', 'Rice', 'Salad', 'Dessert', 'Bread', 'Raita'],
      addOns: [
        { id: 3, name: 'Extra Rice', price: 100 },
        { id: 4, name: 'Extra Dessert', price: 200 },
      ],
      rating: 4.9,
      reviews: 356,
      subscribers: 1850,
      badge: 'Best Seller',
      color: 'from-green-500 to-emerald-500',
      image: '🍽️',
      tags: ['office', 'balanced', 'filling'],
      catererId: 2,
      catererName: 'Royal Kitchen Co.',
      catererLogo: '👑',
      catererVerified: true,
      cuisineType: 'mixed',
      keyHighlights: ['Office-friendly', 'Balanced nutrition', 'Ready-to-eat'],
      useCaseTags: ['Best for working professionals', 'Office lunch'],
      bookingType: 'confirmation',
      availability: 'limited',
      slotsLeft: 2,
      timesBooked: 567,
    },
    {
      id: 3,
      name: 'Evening Dinner Deluxe',
      mealType: 'dinner',
      mealTypeLabel: '🌙 Dinner',
      price: 12999,
      originalPrice: 15999,
      duration: 'monthly',
      durationLabel: 'Monthly',
      mealsPerWeek: 6,
      description: 'Premium dinner for families with gourmet selections',
      fullDescription: 'Premium dining experience at home.',
      items: ['Tandoori Chicken', 'Paneer Tikka Masala', 'Biryani', 'Dal Makhani', 'Naan', 'Rice', 'Salad', 'Dessert'],
      addOns: [
        { id: 5, name: 'Wine Pairing', price: 1000 },
        { id: 6, name: 'Starter Platter', price: 500 },
      ],
      rating: 4.7,
      reviews: 189,
      subscribers: 950,
      badge: 'Premium',
      color: 'from-purple-500 to-pink-500',
      image: '🌙',
      tags: ['premium', 'family', 'gourmet'],
      catererId: 3,
      catererName: 'Gourmet Delights',
      catererLogo: '⭐',
      catererVerified: true,
      cuisineType: 'non-veg',
      keyHighlights: ['Premium ingredients', 'Family-sized portions', 'Gourmet experience'],
      useCaseTags: ['Family plan', 'Special occasions'],
      bookingType: 'confirmation',
      availability: 'limited',
      slotsLeft: 1,
      timesBooked: 234,
    },
    {
      id: 4,
      name: 'All-Day Combo',
      mealType: 'all',
      mealTypeLabel: '🥘 All Meals',
      price: 18999,
      originalPrice: 24999,
      duration: 'monthly',
      durationLabel: 'Monthly',
      mealsPerWeek: 7,
      description: 'Breakfast, Lunch & Dinner all in one comprehensive plan',
      fullDescription: 'Complete meal solution for the entire day.',
      items: ['Breakfast items', 'Lunch items', 'Dinner items', 'Snacks', 'Desserts', 'Beverages', 'Salads', 'Breads'],
      addOns: [
        { id: 7, name: 'Extra Snacks Pack', price: 800 },
        { id: 8, name: 'Premium Beverages', price: 600 },
      ],
      rating: 4.9,
      reviews: 512,
      subscribers: 2100,
      badge: 'Best Seller',
      color: 'from-blue-500 to-cyan-500',
      image: '🥘',
      tags: ['complete', 'family', 'convenient'],
      catererId: 1,
      catererName: 'Sharma Caterers',
      catererLogo: '👨‍🍳',
      catererVerified: true,
      cuisineType: 'mixed',
      keyHighlights: ['Complete nutrition', 'All meals included', 'Best value'],
      useCaseTags: ['Family plan', 'Best value'],
      bookingType: 'confirmation',
      availability: 'available',
      timesBooked: 678,
    },
    {
      id: 5,
      name: 'Snack & Light Bites',
      mealType: 'snacks',
      mealTypeLabel: '🥨 Snacks',
      price: 2999,
      originalPrice: 3999,
      duration: 'monthly',
      durationLabel: 'Monthly',
      mealsPerWeek: 5,
      description: 'Healthy snacks and light bites throughout the day',
      fullDescription: 'Perfect for those who want healthy snacking options.',
      items: ['Samosa', 'Pakora', 'Cookies', 'Fresh Fruits', 'Nuts Mix', 'Yogurt', 'Smoothies', 'Granola'],
      addOns: [
        { id: 9, name: 'Premium Nuts', price: 400 },
        { id: 10, name: 'Organic Cookies', price: 300 },
      ],
      rating: 4.6,
      reviews: 178,
      subscribers: 650,
      badge: 'Budget Friendly',
      color: 'from-red-500 to-pink-500',
      image: '🥨',
      tags: ['snacks', 'healthy', 'budget'],
      catererId: 2,
      catererName: 'Fresh Bites Kitchen',
      catererLogo: '🥗',
      catererVerified: true,
      cuisineType: 'vegan',
      keyHighlights: ['Organic', 'Low calorie', 'Budget-friendly'],
      useCaseTags: ['Health conscious', 'Fitness enthusiasts'],
      bookingType: 'confirmation',
      availability: 'fully-booked',
      timesBooked: 445,
    },
  ];

  // Initialize city from prop on mount
  useEffect(() => {
    if (initialCity) {
      const city = cities.find(c => c.slug === initialCity);
      if (city) {
        setSelectedCity(city);
      }
    }
    setIsLoading(false);
  }, [initialCity]);

  const filteredCities = useMemo(() => {
    if (!searchLocation) return cities;
    return cities.filter(city =>
      city.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      city.description.toLowerCase().includes(searchLocation.toLowerCase())
    );
  }, [searchLocation]);

  const filteredPlans = useMemo(() => {
    let filtered = allPlans.filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));

      const matchesMealType = selectedMealType === 'all' || plan.mealType === selectedMealType;
      const matchesDuration = selectedDuration === 'all' || plan.duration === selectedDuration;
      const matchesPrice = plan.price >= priceRange[0] && plan.price <= priceRange[1];

      return matchesSearch && matchesMealType && matchesDuration && matchesPrice;
    });

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'subscribers') {
      filtered.sort((a, b) => b.subscribers - a.subscribers);
    }

    return filtered;
  }, [searchQuery, selectedMealType, selectedDuration, priceRange, sortBy]);

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    router.push(`/city/${city.slug}/meals`);
  };

  const handleSelectPlan = (plan: MealPlan) => {
    setSelectedPlan(plan.id);
    const citySlug = selectedCity?.slug || 'mumbai';
    router.push(`/checkout?planId=${plan.id}&city=${citySlug}`);
  };

  const showCitySelector = !selectedCity;

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px', color: '#64748b', fontWeight: '600' }}>Loading meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection selectedCity={selectedCity} />

      {/* City Selector - Only show if no city selected */}
      {showCitySelector && (
        <CitySelector
          cities={filteredCities}
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          onSelectCity={handleSelectCity}
        />
      )}

      {/* Show meals content only if city is selected */}
      {selectedCity && (
        <>
          {/* Arrival Packs - NEW SECTION */}
          <ArrivalPacksSection selectedCity={selectedCity} arrivalPacks={arrivalPacks} onSelectPlan={handleSelectPlan} />

          {/* How It Works */}
          <HowItWorksSection />

          {/* Search & Filter */}
          <SearchFilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedMealType={selectedMealType}
            setSelectedMealType={setSelectedMealType}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCity={selectedCity}
            onChangeCity={() => setSelectedCity(null)}
          />

          {/* Results Info */}
          <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              Showing <strong>{filteredPlans.length}</strong> of <strong>{allPlans.length}</strong> subscription plans in {selectedCity.name}
            </span>
          </div>

          {/* Subscription Plans Section - UPDATED TITLE */}
          <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 20px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>📅 Monthly Subscriptions</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>Flexible plans for every lifestyle</p>
          </div>

          {/* Plans Grid */}
          <PlansGrid 
            plans={filteredPlans} 
            selectedPlan={selectedPlan}
            onSelectPlan={handleSelectPlan}
          />

          {/* Policies Section */}
          <PoliciesSection />
        </>
      )}
    </div>
  );
}

// Hero Section Component
function HeroSection({ selectedCity }: { selectedCity: any }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '40px',
      paddingBottom: selectedCity ? '80px' : '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '50px', color: 'white', fontSize: '13px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <SparklesIcon style={{ width: '16px', height: '16px' }} />
          Premium Meal Subscriptions
        </div>

        <h1 style={{ fontSize: selectedCity ? '40px' : '48px', fontWeight: '800', color: 'white', margin: '0 0 24px 0', lineHeight: '1.2' }}>
          {selectedCity ? (
            <>
              Nourish Your Life in <span style={{ background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{selectedCity.name}</span>
            </>
          ) : (
            <>
              Nourish Your Life with
              <span style={{ background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Personalized Meal Plans</span>
            </>
          )}
        </h1>

        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', margin: '0 auto 32px', maxWidth: '600px', lineHeight: '1.6' }}>
          {selectedCity
            ? `Discover flexible subscription plans tailored to your lifestyle in ${selectedCity.name}. Save up to 30% and enjoy nutritious food delivered to your doorstep.`
            : 'Discover flexible subscription plans tailored to your lifestyle. Save up to 30% and enjoy nutritious, delicious food delivered to your doorstep.'}
        </p>

        {!selectedCity && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '60px', flexWrap: 'wrap' }}>
            <button style={{ padding: '14px 32px', borderRadius: '50px', border: 'none', backgroundColor: 'white', color: '#667eea', cursor: 'pointer', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Select Your City
              <MapPinIcon style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        )}

        {!selectedCity && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap', padding: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>8000+</span>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>Happy Customers</span>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>4.8★</span>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>Average Rating</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// City Selector Component
function CitySelector({ cities, searchLocation, setSearchLocation, onSelectCity }: any) {
  return (
    <div style={{ backgroundColor: 'white', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', textAlign: 'center', margin: '0 0 12px 0' }}>Select Your City</h2>
        <p style={{ fontSize: '16px', color: '#64748b', textAlign: 'center', margin: '0 0 32px 0' }}>Choose your location to see available meal plans</p>

        {/* Search Box */}
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 40px', display: 'flex' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Cities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {cities.map((city: City) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              style={{
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px 20px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2563eb';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '48px' }}>{city.emoji}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{city.name}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{city.description}</p>
              <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>{city.activeVendors}</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Vendors</span>
                </div>
                <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>{city.popularPlans}</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Plans</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// How It Works Component
function HowItWorksSection() {
  const steps = [
    { number: '1', title: 'Choose Your Plan', description: 'Select from our curated meal plans', icon: '📋' },
    { number: '2', title: 'Select Days & Quantity', description: 'Pick delivery days and quantity', icon: '📅' },
    { number: '3', title: 'Enter Details & Request Booking', description: 'Provide delivery info and request booking', icon: '📋' },
    { number: '4', title: 'Enjoy Your Meals', description: 'Fresh meals delivered to your doorstep', icon: '🎉' },
  ];

  return (
    <div style={{ padding: '80px 20px', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#1e293b', textAlign: 'center', margin: '0 0 12px 0' }}>How It Works</h2>
        <p style={{ fontSize: '18px', color: '#64748b', textAlign: 'center', margin: '0 0 40px 0' }}>Your journey to healthier eating in 4 simple steps</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {steps.map((step) => (
            <div key={step.number} style={{ padding: '32px 24px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', fontWeight: '800', marginBottom: '16px' }}>{step.number}</div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Search & Filter Component
function SearchFilterSection({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  selectedMealType,
  setSelectedMealType,
  selectedDuration,
  setSelectedDuration,
  priceRange,
  setPriceRange,
  selectedCity,
  onChangeCity,
}: any) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* City Selector Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={onChangeCity}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '2px solid #2563eb',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          <MapPinIcon style={{ width: '16px', height: '16px' }} />
          {selectedCity?.emoji} {selectedCity?.name}
          <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <MagnifyingGlassIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', flex: 1, minWidth: '150px' }}
        >
          <option value="popular">Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '2px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <AdjustmentsHorizontalIcon style={{ width: '18px', height: '18px' }} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0, marginBottom: '12px' }}>Meal Type</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['all', 'breakfast', 'lunch', 'snacks', 'dinner'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: selectedMealType === type ? '2px solid #2563eb' : '2px solid #e2e8f0',
                    backgroundColor: selectedMealType === type ? '#dbeafe' : '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: selectedMealType === type ? '#1e40af' : '#64748b',
                  }}
                >
                  {type === 'all' && 'All'}
                  {type === 'breakfast' && 'Breakfast'}
                  {type === 'lunch' && 'Lunch'}
                  {type === 'snacks' && 'Snacks'}
                  {type === 'dinner' && 'Dinner'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0, marginBottom: '12px' }}>Price Range</h4>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              <input type="range" min="0" max="25000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Plans Grid Component
function PlansGrid({ plans, selectedPlan, onSelectPlan }: any) {
  if (plans.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>No plans found</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {plans.map((plan: MealPlan) => (
        <div
          key={plan.id}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: selectedPlan === plan.id ? '2px solid #2563eb' : '2px solid #e2e8f0',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: selectedPlan === plan.id ? '0 8px 16px rgba(37, 99, 235, 0.1)' : 'none',
            opacity: plan.availability === 'fully-booked' ? 0.75 : 1,
          }}
        >
          {/* Top Badge Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <div style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              ⭐ {plan.badge}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {plan.availability === 'limited' && (
                <div style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '700', backgroundColor: '#fef3c7', color: '#92400e' }}>
                  ⚡ Only {plan.slotsLeft} left
                </div>
              )}
              {plan.availability === 'fully-booked' && (
                <div style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '700', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                  ❌ Fully Booked
                </div>
              )}
            </div>
          </div>

          {/* Plan Icon */}
          <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '8px' }}>{plan.image}</div>

          {/* Plan Name & Type */}
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{plan.name}</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{plan.mealTypeLabel}</p>

          {/* Cuisine & Key Highlights */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '600', backgroundColor: '#f0f9ff', color: '#0369a1', textTransform: 'capitalize' }}>
              {plan.cuisineType === 'veg' && '🥬 Vegetarian'}
              {plan.cuisineType === 'non-veg' && '🍗 Non-veg'}
              {plan.cuisineType === 'vegan' && '🌱 Vegan'}
              {plan.cuisineType === 'mixed' && '🍲 Mixed'}
            </span>
            {plan.keyHighlights.slice(0, 2).map((highlight, idx) => (
              <span key={idx} style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '600', backgroundColor: '#ecfdf5', color: '#065f46' }}>
                ✓ {highlight}
              </span>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{plan.description}</p>

          {/* Use Case Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {plan.useCaseTags.map((tag, idx) => (
              <span key={idx} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', backgroundColor: '#f3e8ff', color: '#6b21a8', whiteSpace: 'nowrap' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Caterer Trust Signals */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
            }}>
              {plan.catererLogo}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  by {plan.catererName}
                </p>
                {plan.catererVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e40af' }}>✓</span>
                    <span style={{ fontSize: '9px', fontWeight: '600', color: '#1e40af' }}>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div style={{ backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>₹</span>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b' }}>{plan.price}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>/{plan.durationLabel.toLowerCase()}</span>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '1px' }}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  style={{ width: '14px', height: '14px', color: i < Math.floor(plan.rating) ? '#fbbf24' : '#d1d5db' }}
                  fill={i < Math.floor(plan.rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{plan.rating}</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>({plan.reviews})</span>
          </div>

          {/* Urgency & Conversion Boosters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', backgroundColor: '#ecfdf5', borderRadius: '6px', fontSize: '10px', color: '#065f46', fontWeight: '600' }}>
              <span>👥</span>
              <span>{plan.subscribers}+ subscribed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', backgroundColor: '#fef3c7', borderRadius: '6px', fontSize: '10px', color: '#92400e', fontWeight: '600' }}>
              <span>📊</span>
              <span>Booked {plan.timesBooked}x</span>
            </div>
          </div>

          {/* Meals Per Week */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '11px', color: '#475569', fontWeight: '500' }}>
            <svg
              style={{ width: '16px', height: '16px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {plan.mealsPerWeek} meals/week
          </div>

          {/* Items Preview */}
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0, listStyle: 'none' }}>
            {plan.items.slice(0, 3).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#475569' }}>
                <svg
                  style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0, marginTop: '2px' }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Booking Type Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#ecfdf5', borderRadius: '6px', fontSize: '10px', color: '#065f46', fontWeight: '600' }}>
            {plan.bookingType === 'confirmation' ? (
              <>
                <span>⏳</span>
                <span>Requires confirmation</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Instant booking available</span>
              </>
            )}
          </div>

          {/* Choose Plan Button */}
          <button
            onClick={() => onSelectPlan(plan)}
            disabled={plan.availability === 'fully-booked'}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: plan.availability === 'fully-booked' ? '#cbd5e1' : selectedPlan === plan.id ? '#1e40af' : '#2563eb',
              color: 'white',
              cursor: plan.availability === 'fully-booked' ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '8px',
              transition: 'all 0.2s ease',
              opacity: plan.availability === 'fully-booked' ? 0.6 : 1,
            }}
          >
            <svg
              style={{ width: '16px', height: '16px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0a2 2 0 11-4 0 2 2 0 014 0m6 0a2 2 0 11-4 0 2 2 0 014 0" />
            </svg>
            {plan.availability === 'fully-booked' ? 'Fully Booked' : selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
          </button>
        </div>
      ))}
    </div>
  );
}

// NEW: Arrival Packs Section Component
function ArrivalPacksSection({ selectedCity, arrivalPacks, onSelectPlan }: any) {
  return (
    <div style={{ backgroundColor: 'white', padding: '60px 20px', borderBottom: '2px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
            ✈️ Just Landed in {selectedCity?.name}?
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
            No time to cook? Get delicious meals delivered today. Perfect for travelers and new residents.
          </p>
        </div>

        {/* Arrival Packs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {arrivalPacks.slice(0, 3).map((pack: ArrivalPack) => (
            <div
              key={pack.id}
              style={{
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 32px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.2)';
              }}
            >
              {/* Background Decoration */}
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', fontSize: '120px', opacity: 0.1 }}>
                {pack.emoji}
              </div>

              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', backdropFilter: 'blur(10px)' }}>
                  {pack.badge}
                </div>
                <div style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', backgroundColor: 'rgba(255, 235, 59, 0.9)', color: '#333' }}>
                  ⏰ {pack.deliveryTime}
                </div>
              </div>

              {/* Pack Icon */}
              <div style={{ fontSize: '56px', marginBottom: '8px' }}>{pack.emoji}</div>

              {/* Pack Name & Description */}
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0, marginBottom: '4px' }}>
                {pack.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', margin: 0, marginBottom: '12px', lineHeight: '1.4' }}>
                {pack.description}
              </p>

              {/* Duration & Meals Included */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginBottom: '4px', textTransform: 'uppercase' }}>
                    Duration
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0 }}>
                    {pack.duration}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginBottom: '4px', textTransform: 'uppercase' }}>
                    Meals
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0 }}>
                    {pack.mealsIncluded} meals
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {pack.highlights.map((highlight, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', whiteSpace: 'nowrap' }}>
                    ✓ {highlight}
                  </span>
                ))}
              </div>

              {/* Caterer Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {pack.catererLogo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pack.catererName}
                  </p>
                  {pack.catererVerified && (
                    <p style={{ fontSize: '9px', fontWeight: '600', color: '#fbbf24', margin: '2px 0 0 0' }}>
                      ✓ Verified
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '1px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ fontSize: '12px', color: i < Math.floor(pack.rating) ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)' }}>
                      ★
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>{pack.rating}</span>
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>({pack.reviews})</span>
              </div>

              {/* Price & CTA */}
              <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)' }}>₹</span>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>{pack.price}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'line-through' }}>₹{pack.originalPrice}</span>
                </div>

                <button
                  onClick={() => {
                    const planData = {
                      id: pack.id,
                      name: pack.name,
                      price: pack.price,
                      mealType: 'arrival',
                      duration: pack.duration,
                      mealsIncluded: pack.mealsIncluded,
                    };
                    onSelectPlan(planData);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'white',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
                    (e.currentTarget as HTMLElement).style.color = '#1e40af';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                    (e.currentTarget as HTMLElement).style.color = '#667eea';
                  }}
                >
                  <svg
                    style={{ width: '16px', height: '16px' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Order Now
                </button>
              </div>

              {/* Items Preview */}
              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                <strong style={{ display: 'block', marginBottom: '6px', color: 'white' }}>Included meals:</strong>
                {pack.items.join(' • ')}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '2px solid #bfdbfe', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: '600', margin: 0 }}>
            💡 Not interested in arrival packs? Browse our <strong>monthly subscription plans</strong> below for better long-term savings!
          </p>
        </div>
      </div>
    </div>
  );
}

// Policies Section Component
function PoliciesSection() {
  const policies = [
    { icon: '🚚', title: 'Free Delivery', description: 'Free delivery on orders above ₹5000' },
    { icon: '💰', title: 'Refund Policy', description: 'Get 100% refund within 7 days' },
    { icon: '❌', title: 'Cancellation', description: 'Cancel anytime. No hidden charges' },
    { icon: '⏰', title: 'Modifications', description: 'Modify your subscription anytime' },
  ];

  return (
    <div style={{ padding: '80px 20px', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#1e293b', textAlign: 'center', margin: 0, marginBottom: '40px' }}>Our Policies</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {policies.map((policy, idx) => (
            <div key={idx} style={{ padding: '28px 24px', borderRadius: '12px', backgroundColor: 'white', border: '2px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{policy.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>{policy.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{policy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}