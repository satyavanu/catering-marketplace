'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingCartIcon,
  StarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

type CheckoutStep = 'date' | 'user-info' | 'payment' | 'confirmation';

interface PricingBreakdown {
  planPrice: number;
  addOnsPrice: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  subtotalAfterDiscount: number;
  vat: number;
  gst: number;
  totalTax: number;
  finalTotal: number;
}

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

const PRICING_CONFIG = {
  DELIVERY_FEE: {
    base: 50,
    perKm: 10,
    minDistance: 0,
    maxDistance: 10,
    freeDeliveryAbove: 5000,
  },
  PLATFORM_FEE_PERCENTAGE: 5,
  DISCOUNT_PERCENTAGE: 10,
  VAT_PERCENTAGE: 2.5,
  GST_PERCENTAGE: 5,
};

const ALL_PLANS: MealPlan[] = [
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

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = parseInt(searchParams.get('planId') || '1');

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('date');
  const [deliveryDistance, setDeliveryDistance] = useState(5);

  const [subscriptionData, setSubscriptionData] = useState({
    planId,
    planName: '',
    duration: 'monthly',
    startDate: '',
    selectedDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    quantity: 1,
    addOns: [] as number[],
  });

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    apartmentNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [orderConfirmation, setOrderConfirmation] = useState({
    orderId: '',
    orderDate: '',
    subscriptionStartDate: '',
  });

  const currentPlan = ALL_PLANS.find((p) => p.id === planId);

  useEffect(() => {
    if (currentPlan) {
      setSubscriptionData((prev) => ({
        ...prev,
        planName: currentPlan.name,
      }));
    }
  }, [currentPlan]);

  const calculateDaysPerWeek = () => {
    return Object.values(subscriptionData.selectedDays).filter(Boolean).length;
  };

  const calculateDeliveryFee = (): number => {
    const { base, perKm, minDistance, maxDistance, freeDeliveryAbove } = PRICING_CONFIG.DELIVERY_FEE;

    const basePrice = calculateBasePriceOnly();
    if (basePrice >= freeDeliveryAbove) {
      return 0;
    }

    if (deliveryDistance <= minDistance) return 0;
    if (deliveryDistance > maxDistance) {
      return base + (deliveryDistance - maxDistance) * perKm;
    }
    return base;
  };

  const calculateBasePriceOnly = (): number => {
    if (!currentPlan) return 0;

    const selectedAddOns = currentPlan.addOns.filter((addon) => subscriptionData.addOns.includes(addon.id));
    const addOnTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);

    let basePrice = currentPlan.price;

    if (subscriptionData.duration === 'weekly') {
      basePrice = Math.round((currentPlan.price / 4) * subscriptionData.quantity);
    } else if (subscriptionData.duration === 'quarterly') {
      basePrice = Math.round(currentPlan.price * 3 * subscriptionData.quantity);
    } else {
      basePrice = currentPlan.price * subscriptionData.quantity;
    }

    return basePrice + addOnTotal;
  };

  const calculatePricingBreakdown = (): PricingBreakdown => {
    if (!currentPlan) {
      return {
        planPrice: 0,
        addOnsPrice: 0,
        subtotal: 0,
        deliveryFee: 0,
        platformFee: 0,
        discount: 0,
        subtotalAfterDiscount: 0,
        vat: 0,
        gst: 0,
        totalTax: 0,
        finalTotal: 0,
      };
    }

    let planPrice = currentPlan.price;
    if (subscriptionData.duration === 'weekly') {
      planPrice = Math.round((currentPlan.price / 4) * subscriptionData.quantity);
    } else if (subscriptionData.duration === 'quarterly') {
      planPrice = Math.round(currentPlan.price * 3 * subscriptionData.quantity);
    } else {
      planPrice = currentPlan.price * subscriptionData.quantity;
    }

    const selectedAddOns = currentPlan.addOns.filter((addon) => subscriptionData.addOns.includes(addon.id));
    const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);

    const subtotal = planPrice + addOnsPrice;
    const deliveryFee = calculateDeliveryFee();
    const platformFee = Math.round((subtotal + deliveryFee) * (PRICING_CONFIG.PLATFORM_FEE_PERCENTAGE / 100));
    const subtotalBeforeDiscount = subtotal + deliveryFee + platformFee;
    const discount = Math.round(subtotalBeforeDiscount * (PRICING_CONFIG.DISCOUNT_PERCENTAGE / 100));
    const subtotalAfterDiscount = subtotalBeforeDiscount - discount;
    const vat = Math.round(subtotalAfterDiscount * (PRICING_CONFIG.VAT_PERCENTAGE / 100));
    const gst = Math.round(subtotalAfterDiscount * (PRICING_CONFIG.GST_PERCENTAGE / 100));
    const totalTax = vat + gst;
    const finalTotal = subtotalAfterDiscount + totalTax;

    return {
      planPrice,
      addOnsPrice,
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      subtotalAfterDiscount,
      vat,
      gst,
      totalTax,
      finalTotal,
    };
  };

  const handleNextStep = () => {
    if (checkoutStep === 'date') {
      if (!subscriptionData.startDate) {
        alert('Please select a start date');
        return;
      }
      if (calculateDaysPerWeek() === 0) {
        alert('Please select at least one day');
        return;
      }
      setCheckoutStep('user-info');
    } else if (checkoutStep === 'user-info') {
      if (!userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.phone || !userInfo.address || !userInfo.city || !userInfo.postalCode) {
        alert('Please fill in all required fields');
        return;
      }
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      if (paymentMethod === 'card') {
        if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
          alert('Please fill in all card details');
          return;
        }
      }
      const orderId = `ORD-${Date.now()}`;
      const orderDate = new Date().toLocaleDateString();
      const subscriptionStartDate = subscriptionData.startDate;

      setOrderConfirmation({
        orderId,
        orderDate,
        subscriptionStartDate,
      });
      setCheckoutStep('confirmation');
    }
  };

  const handlePreviousStep = () => {
    if (checkoutStep === 'confirmation') setCheckoutStep('payment');
    else if (checkoutStep === 'payment') setCheckoutStep('user-info');
    else if (checkoutStep === 'user-info') setCheckoutStep('date');
  };

  const pricingBreakdown = calculatePricingBreakdown();

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/meals')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: '600' }}
          >
            <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
            <span style={{ display: 'none', fontSize: '14px' }} className="hidden sm:inline">Back to Meals</span>
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center', flex: 1 }}>Checkout</h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Main Content */}
          <div style={{ gridColumn: 'span 1', minHeight: '400px' }}>
            {/* Progress Indicator */}
            <ProgressIndicator currentStep={checkoutStep} />

            {/* Step Content */}
            <div style={{ marginTop: '24px', backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
              {checkoutStep === 'date' && (
                <DateSelectionStep
                  subscriptionData={subscriptionData}
                  setSubscriptionData={setSubscriptionData}
                  calculateDaysPerWeek={calculateDaysPerWeek}
                  currentPlan={currentPlan}
                  deliveryDistance={deliveryDistance}
                  setDeliveryDistance={setDeliveryDistance}
                />
              )}

              {checkoutStep === 'user-info' && (
                <UserInfoStep userInfo={userInfo} setUserInfo={setUserInfo} />
              )}

              {checkoutStep === 'payment' && (
                <PaymentStep paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} cardDetails={cardDetails} setCardDetails={setCardDetails} />
              )}

              {checkoutStep === 'confirmation' && (
                <ConfirmationStep
                  orderConfirmation={orderConfirmation}
                  subscriptionData={subscriptionData}
                  userInfo={userInfo}
                  calculateDaysPerWeek={calculateDaysPerWeek}
                  pricingBreakdown={pricingBreakdown}
                  currentPlan={currentPlan}
                />
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                {checkoutStep !== 'confirmation' && (
                  <>
                    <button
                      onClick={() => {
                        if (checkoutStep === 'date') {
                          router.push('/meals');
                        } else {
                          handlePreviousStep();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
                      {checkoutStep === 'date' ? 'Back to Meals' : 'Back'}
                    </button>
                    <button
                      onClick={handleNextStep}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {checkoutStep === 'payment' ? 'Complete Payment' : 'Next Step'}
                      <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </>
                )}
                {checkoutStep === 'confirmation' && (
                  <button
                    onClick={() => router.push('/meals')}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    Continue Shopping
                    <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div style={{ gridColumn: 'span 1' }}>
            <OrderSummary
              currentPlan={currentPlan}
              subscriptionData={subscriptionData}
              calculateDaysPerWeek={calculateDaysPerWeek}
              pricingBreakdown={pricingBreakdown}
              deliveryDistance={deliveryDistance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress Indicator Component
function ProgressIndicator({ currentStep }: { currentStep: CheckoutStep }) {
  const steps = [
    { id: 'date', label: 'Schedule' },
    { id: 'user-info', label: 'Details' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Confirmed' },
  ];

  const stepOrder = ['date', 'user-info', 'payment', 'confirmation'];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {steps.map((step, idx) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: idx <= currentIndex ? '#2563eb' : '#e2e8f0',
                color: idx <= currentIndex ? 'white' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {idx < currentIndex ? <CheckIcon style={{ width: '20px', height: '20px' }} /> : idx + 1}
            </div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: idx <= currentIndex ? '#1e293b' : '#94a3b8', marginTop: '6px', whiteSpace: 'nowrap' }}>
              {step.label}
            </label>
          </div>
          {idx < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: '2px',
                backgroundColor: idx < currentIndex ? '#2563eb' : '#e2e8f0',
                margin: '0 12px',
                marginBottom: '24px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Order Summary Component
function OrderSummary({ currentPlan, subscriptionData, calculateDaysPerWeek, pricingBreakdown, deliveryDistance }: any) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'sticky', top: '80px' }}>
      {/* Plan Info */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '36px' }}>{currentPlan?.image}</div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{currentPlan?.name}</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>{currentPlan?.mealTypeLabel}</p>
          </div>
        </div>
      </div>

      {/* Summary Details */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: '#64748b' }}>Duration:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>{subscriptionData.duration}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: '#64748b' }}>Days/Week:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>{calculateDaysPerWeek()} days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: '#64748b' }}>Quantity:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>{subscriptionData.quantity} {subscriptionData.quantity === 1 ? 'person' : 'people'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: '#64748b' }}>Delivery Distance:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>{deliveryDistance} km</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <PricingBreakdownCard pricingBreakdown={pricingBreakdown} />
    </div>
  );
}

// Pricing Breakdown Card
function PricingBreakdownCard({ pricingBreakdown }: any) {
  return (
    <div style={{ padding: '20px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' }}>Price Breakdown</h4>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
        <span>Plan</span>
        <span>₹{pricingBreakdown.planPrice}</span>
      </div>

      {pricingBreakdown.addOnsPrice > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
          <span>Add-ons</span>
          <span>₹{pricingBreakdown.addOnsPrice}</span>
        </div>
      )}

      {pricingBreakdown.deliveryFee > 0 ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
          <span>Delivery</span>
          <span>₹{pricingBreakdown.deliveryFee}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#10b981', marginBottom: '6px', fontWeight: '600' }}>
          <span>Delivery</span>
          <span>FREE ✓</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
        <span>Platform Fee</span>
        <span>₹{pricingBreakdown.platformFee}</span>
      </div>

      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }} />

      {pricingBreakdown.discount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#10b981', marginBottom: '6px', fontWeight: '600' }}>
          <span>Discount (10%)</span>
          <span>-₹{pricingBreakdown.discount}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
        <span>VAT (2.5%)</span>
        <span>₹{pricingBreakdown.vat}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
        <span>GST (5%)</span>
        <span>₹{pricingBreakdown.gst}</span>
      </div>

      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>
        <span>Total</span>
        <span>₹{pricingBreakdown.finalTotal}</span>
      </div>
    </div>
  );
}

// Date Selection Step
function DateSelectionStep({ subscriptionData, setSubscriptionData, calculateDaysPerWeek, currentPlan, deliveryDistance, setDeliveryDistance }: any) {
  return (
    <>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' }}>📅 Schedule Your Delivery</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {['weekly', 'monthly', 'quarterly'].map((duration) => (
          <button
            key={duration}
            onClick={() => setSubscriptionData({ ...subscriptionData, duration })}
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              border: subscriptionData.duration === duration ? '2px solid #2563eb' : '2px solid #e2e8f0',
              backgroundColor: subscriptionData.duration === duration ? '#dbeafe' : '#f8fafc',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              color: subscriptionData.duration === duration ? '#1e40af' : '#64748b',
            }}
          >
            {duration === 'weekly' && '📆 Weekly'}
            {duration === 'monthly' && '📅 Monthly'}
            {duration === 'quarterly' && '📊 Quarterly'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>Start Date *</label>
        <input
          type="date"
          value={subscriptionData.startDate}
          onChange={(e) => setSubscriptionData({ ...subscriptionData, startDate: e.target.value })}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Select Days ({calculateDaysPerWeek()} days) *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {Object.entries(subscriptionData.selectedDays).map(([day, selected]: [string, any]) => (
            <button
              key={day}
              onClick={() => {
                setSubscriptionData({
                  ...subscriptionData,
                  selectedDays: {
                    ...subscriptionData.selectedDays,
                    [day]: !subscriptionData.selectedDays[day],
                  },
                });
              }}
              style={{
                padding: '10px 8px',
                borderRadius: '8px',
                border: selected ? '2px solid #2563eb' : '2px solid #e2e8f0',
                backgroundColor: selected ? '#dbeafe' : '#f8fafc',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
                color: selected ? '#1e40af' : '#64748b',
              }}
            >
              {day.charAt(0).toUpperCase() + day.slice(1, 3)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>Number of People *</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
          <button
            onClick={() =>
              setSubscriptionData({
                ...subscriptionData,
                quantity: Math.max(1, subscriptionData.quantity - 1),
              })
            }
            style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#2563eb' }}
          >
            −
          </button>
          <input
            type="number"
            value={subscriptionData.quantity}
            onChange={(e) =>
              setSubscriptionData({
                ...subscriptionData,
                quantity: Math.max(1, parseInt(e.target.value) || 1),
              })
            }
            style={{ width: '50px', padding: '8px 4px', border: 'none', textAlign: 'center', fontSize: '14px', fontWeight: '700', backgroundColor: 'transparent' }}
            min="1"
          />
          <button
            onClick={() =>
              setSubscriptionData({
                ...subscriptionData,
                quantity: subscriptionData.quantity + 1,
              })
            }
            style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#2563eb' }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>Delivery Distance *</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            value={deliveryDistance}
            onChange={(e) => setDeliveryDistance(Math.max(0, parseFloat(e.target.value) || 0))}
            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            min="0"
            step="0.5"
          />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>km</span>
        </div>
      </div>

      {currentPlan?.addOns && currentPlan.addOns.length > 0 && (
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Add Optional Items</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentPlan.addOns.map((addon: any) => (
              <button
                key={addon.id}
                onClick={() => {
                  setSubscriptionData({
                    ...subscriptionData,
                    addOns: subscriptionData.addOns.includes(addon.id)
                      ? subscriptionData.addOns.filter((id: number) => id !== addon.id)
                      : [...subscriptionData.addOns, addon.id],
                  });
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: subscriptionData.addOns.includes(addon.id) ? '2px solid #2563eb' : '2px solid #e2e8f0',
                  backgroundColor: subscriptionData.addOns.includes(addon.id) ? '#dbeafe' : '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <input type="checkbox" checked={subscriptionData.addOns.includes(addon.id)} onChange={() => {}} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{addon.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>+₹{addon.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// User Info Step
function UserInfoStep({ userInfo, setUserInfo }: any) {
  return (
    <>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' }}>👤 Delivery Information</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>First Name *</label>
          <input
            type="text"
            value={userInfo.firstName}
            onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            placeholder="John"
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Last Name *</label>
          <input
            type="text"
            value={userInfo.lastName}
            onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            placeholder="Doe"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Email *</label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Phone *</label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Address *</label>
        <input
          type="text"
          value={userInfo.address}
          onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
          placeholder="Street address"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>City *</label>
          <input
            type="text"
            value={userInfo.city}
            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            placeholder="City"
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Postal Code *</label>
          <input
            type="text"
            value={userInfo.postalCode}
            onChange={(e) => setUserInfo({ ...userInfo, postalCode: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            placeholder="123456"
          />
        </div>
      </div>
    </>
  );
}

// Payment Step
function PaymentStep({ paymentMethod, setPaymentMethod, cardDetails, setCardDetails }: any) {
  return (
    <>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' }}>💳 Payment Method</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'card', label: '💳 Card' },
          { id: 'upi', label: '📱 UPI' },
          { id: 'wallet', label: '👛 Wallet' },
        ].map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              border: paymentMethod === method.id ? '2px solid #2563eb' : '2px solid #e2e8f0',
              backgroundColor: paymentMethod === method.id ? '#dbeafe' : '#f8fafc',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              color: paymentMethod === method.id ? '#1e40af' : '#64748b',
            }}
          >
            {method.label}
          </button>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Cardholder Name *</label>
            <input
              type="text"
              value={cardDetails.cardName}
              onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
              placeholder="John Doe"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Card Number *</label>
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Expiry Date *</label>
              <input
                type="text"
                value={cardDetails.expiryDate}
                onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>CVV *</label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Confirmation Step
function ConfirmationStep({ orderConfirmation, subscriptionData, userInfo, calculateDaysPerWeek, pricingBreakdown, currentPlan }: any) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
        <CheckCircleIcon style={{ width: '60px', height: '60px', color: '#10b981', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0, marginBottom: '8px' }}>Order Confirmed! 🎉</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Your subscription is all set to start</p>
      </div>

      <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0 0 4px 0' }}>Order ID</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{orderConfirmation.orderId}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0 0 4px 0' }}>Order Date</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{orderConfirmation.orderDate}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0 0 4px 0' }}>Starts From</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{orderConfirmation.subscriptionStartDate}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0 0 4px 0' }}>Days/Week</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{calculateDaysPerWeek()} days</p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#ecfdf5', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#047857', margin: '0 0 12px 0' }}>What Happens Next?</h3>
        <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
          <li style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>Confirmation email sent to <strong>{userInfo.email}</strong></li>
          <li style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>Meals prepared fresh on <strong>{orderConfirmation.subscriptionStartDate}</strong></li>
          <li style={{ fontSize: '12px', color: '#065f46' }}>Delivery between 7-9 AM at your address</li>
        </ul>
      </div>
    </>
  );
}