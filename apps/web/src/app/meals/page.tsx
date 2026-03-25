'use client';

import { useState, useMemo } from 'react';
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
} from '@heroicons/react/24/outline';

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
}

export default function MealPackagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

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
      badge: 'Best Value',
      color: 'from-green-500 to-emerald-500',
      image: '🍽️',
      tags: ['office', 'balanced', 'filling'],
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
    },
  ];

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

  const handleSelectPlan = (plan: MealPlan) => {
    setSelectedPlan(plan.id);
    // Navigate to checkout page with plan ID
    router.push(`/checkout?planId=${plan.id}`);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection />

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
      />

      {/* Results Info */}
      <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
          Showing <strong>{filteredPlans.length}</strong> of <strong>{allPlans.length}</strong> plans
        </span>
      </div>

      {/* Plans Grid */}
      <PlansGrid 
        plans={filteredPlans} 
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
      />

      {/* Policies Section */}
      <PoliciesSection />
    </div>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '40px',
      paddingBottom: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '50px', color: 'white', fontSize: '13px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <SparklesIcon style={{ width: '16px', height: '16px' }} />
          Premium Meal Subscriptions
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: '800', color: 'white', margin: '0 0 24px 0', lineHeight: '1.2' }}>
          Nourish Your Life with
          <span style={{ background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Personalized Meal Plans</span>
        </h1>

        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', margin: '0 auto 32px', maxWidth: '600px', lineHeight: '1.6' }}>
          Discover flexible subscription plans tailored to your lifestyle. Save up to 30% and enjoy nutritious, delicious food delivered to your doorstep.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '60px', flexWrap: 'wrap' }}>
          <button style={{ padding: '14px 32px', borderRadius: '50px', border: 'none', backgroundColor: 'white', color: '#667eea', cursor: 'pointer', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Explore Plans
            <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

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
      </div>
    </div>
  );
}

// How It Works Component
function HowItWorksSection() {
  const steps = [
    { number: '1', title: 'Choose Your Plan', description: 'Select from our curated meal plans', icon: '📋' },
    { number: '2', title: 'Select Days & Quantity', description: 'Pick delivery days and quantity', icon: '📅' },
    { number: '3', title: 'Enter Details & Pay', description: 'Provide delivery info and pay', icon: '💳' },
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
}: any) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
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
          }}
        >
          <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            ⭐ {plan.badge}
          </div>

          <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '8px' }}>{plan.image}</div>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{plan.name}</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{plan.mealTypeLabel}</p>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{plan.description}</p>

          <div style={{ backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>₹</span>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b' }}>{plan.price}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>/{plan.durationLabel.toLowerCase()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '1px' }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} style={{ width: '14px', height: '14px', color: i < Math.floor(plan.rating) ? '#fbbf24' : '#d1d5db', fill: i < Math.floor(plan.rating) ? '#fbbf24' : 'none' }} />
              ))}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{plan.rating}</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>({plan.reviews})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '11px', color: '#475569', fontWeight: '500' }}>
            <CalendarIcon style={{ width: '16px', height: '16px' }} />
            {plan.mealsPerWeek} meals/week
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0, listStyle: 'none' }}>
            {plan.items.slice(0, 3).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#475569' }}>
                <CheckIcon style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan(plan)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedPlan === plan.id ? '#1e40af' : '#2563eb',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <ShoppingCartIcon style={{ width: '16px', height: '16px' }} />
            {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
          </button>
        </div>
      ))}
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