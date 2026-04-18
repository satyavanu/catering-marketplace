'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  XMarkIcon,
  ChevronDownIcon,
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
  mealsPerDay: number;
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
  cuisineType: 'veg' | 'non-veg' | 'vegan' | 'mixed';
  keyHighlights: string[];
  useCaseTags: string[];
  bookingType: 'instant' | 'confirmation';
  availability: 'available' | 'limited' | 'fully-booked';
  slotsLeft?: number;
  timesBooked: number;
  deliveryTime: string;
  preparationTime: string;
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
    mealsPerDay: 1,
    description: 'Perfect breakfast for a healthy start',
    fullDescription: 'Start your day right with our healthy breakfast bundle.',
    items: ['Vegetable Poha', 'Idli Sambar', 'Dosa', 'Fresh Juices', 'Eggs', 'Bread Toast'],
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
    deliveryTime: '7:00 AM - 9:00 AM',
    preparationTime: '30 mins',
  },
  {
    id: 2,
    name: 'Office Lunch Pro',
    mealType: 'lunch',
    mealTypeLabel: '🍽️ Lunch',
    price: 7999,
    originalPrice: 9999,
    duration: 'monthly',
    durationLabel: 'Monthly',
    mealsPerWeek: 5,
    mealsPerDay: 1,
    description: 'Complete lunch meals for office workers',
    fullDescription: 'Professional meal planning for busy schedules.',
    items: ['Biryani', 'Butter Chicken', 'Dal', 'Rice', 'Salad', 'Dessert'],
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
    useCaseTags: ['Best for working professionals'],
    bookingType: 'confirmation',
    availability: 'limited',
    slotsLeft: 2,
    timesBooked: 567,
    deliveryTime: '12:00 PM - 1:30 PM',
    preparationTime: '45 mins',
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
    mealsPerDay: 1,
    description: 'Premium dinner for families',
    fullDescription: 'Premium dining experience at home.',
    items: ['Tandoori Chicken', 'Paneer Tikka Masala', 'Biryani', 'Dal Makhani', 'Naan', 'Rice'],
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
    deliveryTime: '6:30 PM - 8:00 PM',
    preparationTime: '60 mins',
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
    mealsPerDay: 3,
    description: 'Breakfast, Lunch & Dinner in one plan',
    fullDescription: 'Complete meal solution for the entire day.',
    items: ['Breakfast items', 'Lunch items', 'Dinner items', 'Snacks', 'Desserts', 'Beverages'],
    addOns: [
      { id: 7, name: 'Extra Snacks Pack', price: 800 },
      { id: 8, name: 'Premium Beverages', price: 600 },
    ],
    rating: 4.9,
    reviews: 512,
    subscribers: 2100,
    badge: 'Best Value',
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
    deliveryTime: 'Multiple times',
    preparationTime: 'Varies',
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
    mealsPerDay: 1,
    description: 'Healthy snacks throughout the day',
    fullDescription: 'Perfect for those who want healthy snacking options.',
    items: ['Samosa', 'Pakora', 'Cookies', 'Fresh Fruits', 'Nuts Mix', 'Yogurt'],
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
    deliveryTime: '4:00 PM - 5:00 PM',
    preparationTime: '20 mins',
  },
  {
    id: 6,
    name: 'Vegan Weekday Special',
    mealType: 'lunch',
    mealTypeLabel: '🍽️ Lunch',
    price: 5999,
    originalPrice: 7499,
    duration: 'monthly',
    durationLabel: 'Monthly',
    mealsPerWeek: 5,
    mealsPerDay: 1,
    description: '100% plant-based nutritious meals',
    fullDescription: 'Delicious vegan meals with complete nutrition.',
    items: ['Tofu Stir Fry', 'Quinoa Bowl', 'Dal Tadka', 'Roti', 'Salad', 'Fruit Dessert'],
    addOns: [
      { id: 11, name: 'Protein Boost', price: 150 },
    ],
    rating: 4.7,
    reviews: 123,
    subscribers: 450,
    badge: 'Eco-Friendly',
    color: 'from-green-500 to-teal-500',
    image: '🌱',
    tags: ['vegan', 'healthy', 'eco-friendly'],
    catererId: 4,
    catererName: 'Green Kitchen',
    catererLogo: '🥦',
    catererVerified: true,
    cuisineType: 'vegan',
    keyHighlights: ['100% Plant-based', 'Sustainable', 'High protein'],
    useCaseTags: ['Vegans', 'Eco-conscious'],
    bookingType: 'instant',
    availability: 'available',
    timesBooked: 234,
    deliveryTime: '12:30 PM - 1:30 PM',
    preparationTime: '40 mins',
  },
];

export default function MealPackagesPage({ initialCity }: { initialCity?: string }) {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [mealTypeFilter, setMealTypeFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<string | null>(null);

  const cities: City[] = [
    { id: 1, name: 'Mumbai', slug: 'mumbai', emoji: '🌊', description: 'Metropolitan hub', activeVendors: 45, popularPlans: 128 },
    { id: 2, name: 'Bangalore', slug: 'bangalore', emoji: '🏙️', description: 'Tech city', activeVendors: 38, popularPlans: 112 },
    { id: 3, name: 'Delhi', slug: 'delhi', emoji: '🏛️', description: 'Capital city', activeVendors: 52, popularPlans: 156 },
    { id: 4, name: 'Hyderabad', slug: 'hyderabad', emoji: '🏞️', description: 'City of pearls', activeVendors: 32, popularPlans: 98 },
    { id: 5, name: 'Pune', slug: 'pune', emoji: '⛰️', description: 'Queen of Deccan', activeVendors: 28, popularPlans: 89 },
  ];

  useEffect(() => {
    if (initialCity) {
      const city = cities.find(c => c.slug === initialCity);
      if (city) {
        setSelectedCity(city);
        setShowCitySelector(false);
      }
    }
    setIsLoading(false);
  }, [initialCity]);

  const filteredPlans = useMemo(() => {
    return allPlans.filter(plan => {
      if (cuisineFilter && plan.cuisineType !== cuisineFilter) return false;
      if (mealTypeFilter && plan.mealType !== mealTypeFilter) return false;
      if (durationFilter && plan.duration !== durationFilter) return false;
      
      if (priceFilter) {
        if (priceFilter === 'budget' && plan.price > 5000) return false;
        if (priceFilter === 'mid' && (plan.price <= 5000 || plan.price > 12000)) return false;
        if (priceFilter === 'premium' && plan.price <= 12000) return false;
      }

      return true;
    });
  }, [cuisineFilter, mealTypeFilter, priceFilter, durationFilter]);

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setShowCitySelector(false);
    router.push(`/meals?city=${city.slug}`);
  };

  const handleChangeCity = () => {
    setShowCitySelector(true);
  };

  const handleSelectPlan = (plan: MealPlan) => {
    setSelectedPlan(plan.id);
    const citySlug = selectedCity?.slug || 'mumbai';
    router.push(`/checkout?planId=${plan.id}&city=${citySlug}`);
  };

  const handleHelpChoose = () => {
    router.push('/help-choose-plan');
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* City Selector Modal */}
      {showCitySelector && (
        <CitySelector
          cities={cities}
          onSelectCity={handleSelectCity}
        />
      )}

      {/* Main Content - Only show when city is selected */}
      {!showCitySelector && selectedCity && (
        <>
          {/* Top Context Bar */}
          <TopContextBar selectedCity={selectedCity} onChangeCity={handleChangeCity} />

          {/* Simple Header */}
          <SimpleHeader />

          {/* Quick Filters */}
          <QuickFilters
            cuisineFilter={cuisineFilter}
            setCuisineFilter={setCuisineFilter}
            mealTypeFilter={mealTypeFilter}
            setMealTypeFilter={setMealTypeFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
          />

          {/* Plans Grid */}
          <PlansGrid
            plans={filteredPlans}
            selectedPlan={selectedPlan}
            onSelectPlan={handleSelectPlan}
          />

          {/* Help Me Choose CTA */}
          <HelpChooseCTA onHelpChoose={handleHelpChoose} />
        </>
      )}
    </div>
  );
}

// Top Context Bar Component
function TopContextBar({ selectedCity, onChangeCity }: any) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPinIcon style={{ width: '18px', height: '18px', color: '#2563eb' }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            Delivering to: <strong>{selectedCity.emoji} {selectedCity.name}</strong>
          </span>
        </div>

        <button
          onClick={onChangeCity}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#2563eb',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
            (e.currentTarget as HTMLElement).style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          }}
        >
          Change Location
        </button>
      </div>
    </div>
  );
}

// City Selector Modal
function CitySelector({ cities, onSelectCity }: any) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
          📍 Select Your City
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>
          Choose your location to see available meal plans
        </p>

        <div style={{ display: 'grid', gap: '10px' }}>
          {cities.map((city: City) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2563eb';
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
              }}
            >
              <span style={{ fontSize: '24px' }}>{city.emoji}</span>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  {city.name}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                  {city.activeVendors} vendors • {city.popularPlans} plans
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple Header Component
function SimpleHeader() {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '40px 20px',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>
          🍱 Healthy Meals Delivered Daily
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
          Choose a plan that fits your lifestyle
        </p>
      </div>
    </div>
  );
}

// Quick Filters Component
function QuickFilters({
  cuisineFilter,
  setCuisineFilter,
  mealTypeFilter,
  setMealTypeFilter,
  priceFilter,
  setPriceFilter,
  durationFilter,
  setDurationFilter,
}: any) {
  const cuisineOptions = [
    { id: 'veg', label: '🥬 Veg', value: 'veg' },
    { id: 'non-veg', label: '🍗 Non-veg', value: 'non-veg' },
    { id: 'vegan', label: '🌱 Vegan', value: 'vegan' },
    { id: 'mixed', label: '🍲 Mixed', value: 'mixed' },
  ];

  const mealTypeOptions = [
    { id: 'breakfast', label: '🌅 Breakfast', value: 'breakfast' },
    { id: 'lunch', label: '🍽️ Lunch', value: 'lunch' },
    { id: 'dinner', label: '🌙 Dinner', value: 'dinner' },
    { id: 'snacks', label: '🥨 Snacks', value: 'snacks' },
  ];

  const priceOptions = [
    { id: 'budget', label: '💰 Budget (< ₹5000)', value: 'budget' },
    { id: 'mid', label: '💵 Mid-range (₹5000 - ₹12000)', value: 'mid' },
    { id: 'premium', label: '💎 Premium (> ₹12000)', value: 'premium' },
  ];

  const durationOptions = [
    { id: 'weekly', label: '📅 Weekly', value: 'weekly' },
    { id: 'monthly', label: '📅 Monthly', value: 'monthly' },
  ];

  const hasActiveFilters = cuisineFilter || mealTypeFilter || priceFilter || durationFilter;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px 20px',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Cuisine Filter */}
        <FilterGroup
          label="🥗 Cuisine Type"
          options={cuisineOptions}
          selectedValue={cuisineFilter}
          onChange={setCuisineFilter}
        />

        {/* Meal Type Filter */}
        <FilterGroup
          label="⏰ Meal Type"
          options={mealTypeOptions}
          selectedValue={mealTypeFilter}
          onChange={setMealTypeFilter}
        />

        {/* Price Range Filter */}
        <FilterGroup
          label="💰 Price Range"
          options={priceOptions}
          selectedValue={priceFilter}
          onChange={setPriceFilter}
        />

        {/* Duration Filter */}
        <FilterGroup
          label="📅 Duration"
          options={durationOptions}
          selectedValue={durationFilter}
          onChange={setDurationFilter}
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setCuisineFilter(null);
              setMealTypeFilter(null);
              setPriceFilter(null);
              setDurationFilter(null);
            }}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#fee2e2';
              (e.currentTarget as HTMLElement).style.color = '#991b1b';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
              (e.currentTarget as HTMLElement).style.color = '#64748b';
            }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

// Filter Group Component
function FilterGroup({ label, options, selectedValue, onChange }: any) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
        {label}
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onChange(null)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: selectedValue === null ? '2px solid #2563eb' : '1px solid #e2e8f0',
            backgroundColor: selectedValue === null ? '#dbeafe' : 'white',
            color: selectedValue === null ? '#1e40af' : '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (selectedValue !== null) {
              (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedValue !== null) {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
            }
          }}
        >
          All
        </button>

        {options.map((option: any) => (
          <button
            key={option.id}
            onClick={() => onChange(option.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedValue === option.value ? '2px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: selectedValue === option.value ? '#dbeafe' : 'white',
              color: selectedValue === option.value ? '#1e40af' : '#64748b',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedValue !== option.value) {
                (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedValue !== option.value) {
                (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
              }
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Plans Grid Component
function PlansGrid({ plans, selectedPlan, onSelectPlan }: any) {
  if (plans.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          No plans found
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
    }}>
      {plans.map((plan: MealPlan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan === plan.id}
          onSelect={() => onSelectPlan(plan)}
        />
      ))}
    </div>
  );
}

// Plan Card Component
function PlanCard({ plan, isSelected, onSelect }: any) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 8px 16px rgba(37, 99, 235, 0.15)' : 'none',
        opacity: plan.availability === 'fully-booked' ? 0.6 : 1,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Badge & Availability */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '10px',
          fontWeight: '700',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
        }}>
          ⭐ {plan.badge}
        </span>

        {plan.availability === 'limited' && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '10px',
            fontWeight: '700',
            backgroundColor: '#fef3c7',
            color: '#92400e',
          }}>
            ⚡ Only {plan.slotsLeft} left
          </span>
        )}

        {plan.availability === 'fully-booked' && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '10px',
            fontWeight: '700',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
          }}>
            ❌ Fully Booked
          </span>
        )}
      </div>

      {/* Plan Icon & Name */}
      <div>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>{plan.image}</div>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
          {plan.name}
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
          {plan.description}
        </p>
      </div>

      {/* Meals Per Day */}
      <div style={{
        padding: '12px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#0c4a6e',
      }}>
        {plan.mealsPerDay === 1 && `1 meal/day • ${plan.mealsPerWeek} days/week`}
        {plan.mealsPerDay === 2 && `2 meals/day • ${plan.mealsPerWeek} days/week`}
        {plan.mealsPerDay === 3 && `3 meals/day • 7 days/week`}
      </div>

      {/* Cuisine & Highlights */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: '600',
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
        }}>
          {plan.cuisineType === 'veg' && '🥬 Veg'}
          {plan.cuisineType === 'non-veg' && '🍗 Non-veg'}
          {plan.cuisineType === 'vegan' && '🌱 Vegan'}
          {plan.cuisineType === 'mixed' && '🍲 Mixed'}
        </span>
        {plan.keyHighlights.slice(0, 1).map((h, i) => (
          <span key={i} style={{
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '600',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
          }}>
            ✓ {h}
          </span>
        ))}
      </div>

      {/* Delivery Time */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#64748b',
      }}>
        🕐 {plan.deliveryTime}
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px' }}>⭐ {plan.rating}</span>
        <span style={{ fontSize: '12px', color: '#64748b' }}>({plan.reviews} reviews)</span>
      </div>

      {/* Price */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '8px',
        borderTop: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
            ₹{plan.price}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>/{plan.durationLabel.toLowerCase()}</span>
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
          <strike>₹{plan.originalPrice}</strike> Save ₹{plan.originalPrice - plan.price}
        </p>
      </div>

      {/* Choose Plan Button */}
      <button
        onClick={onSelect}
        disabled={plan.availability === 'fully-booked'}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: plan.availability === 'fully-booked' ? '#cbd5e1' : isSelected ? '#1e40af' : '#2563eb',
          color: 'white',
          cursor: plan.availability === 'fully-booked' ? 'not-allowed' : 'pointer',
          fontWeight: '700',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          marginTop: '8px',
          opacity: plan.availability === 'fully-booked' ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (plan.availability !== 'fully-booked' && !isSelected) {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#1e40af';
          }
        }}
        onMouseLeave={(e) => {
          if (plan.availability !== 'fully-booked' && !isSelected) {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb';
          }
        }}
      >
        {plan.availability === 'fully-booked' ? 'Fully Booked' : isSelected ? '✓ Selected' : 'Choose Plan'}
      </button>
    </div>
  );
}

// Help Choose CTA Component
function HelpChooseCTA({ onHelpChoose }: any) {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: 'white',
      borderTop: '1px solid #e2e8f0',
    }}>
      <div style={{
        padding: '32px 24px',
        borderRadius: '12px',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
          🤔 Not sure which plan to pick?
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
          Let our AI recommendation engine help you find the perfect meal plan
        </p>
        <button
          onClick={onHelpChoose}
          style={{
            marginTop: '8px',
            padding: '12px 32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'white',
            color: '#667eea',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
          }}
        >
          Help Me Choose →
        </button>
      </div>
    </div>
  );
}