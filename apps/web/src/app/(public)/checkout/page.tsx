'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePublicService } from '@catering-marketplace/query-client';
import {
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingCartIcon,
  StarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  SparklesIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

type CheckoutStep =
  | 'date'
  | 'user-info'
  | 'approval'
  | 'review'
  | 'payment'
  | 'confirmation';

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

type ServiceBookingIntent = {
  type: 'partner_service';
  serviceId: string;
  serviceKey: string;
  title: string;
  location: string;
  date: string;
  guests: number;
  couponCode: string;
  subtotal: number;
  discount: number;
  estimatedTotal: number;
  currencyCode: string;
  createdAt: string;
};

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
    fullDescription:
      'Start your day right with our healthy breakfast bundle. Includes fresh vegetables, proteins, and whole grains.',
    items: [
      'Vegetable Poha',
      'Idli Sambar',
      'Dosa',
      'Fresh Juices',
      'Eggs',
      'Bread Toast',
      'Fresh Fruits',
      'Yogurt',
    ],
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
    description:
      'Complete lunch meals for office workers with balanced nutrition',
    fullDescription: 'Professional meal planning for busy schedules.',
    items: [
      'Biryani',
      'Butter Chicken',
      'Dal',
      'Rice',
      'Salad',
      'Dessert',
      'Bread',
      'Raita',
    ],
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
    items: [
      'Tandoori Chicken',
      'Paneer Tikka Masala',
      'Biryani',
      'Dal Makhani',
      'Naan',
      'Rice',
      'Salad',
      'Dessert',
    ],
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
    items: [
      'Breakfast items',
      'Lunch items',
      'Dinner items',
      'Snacks',
      'Desserts',
      'Beverages',
      'Salads',
      'Breads',
    ],
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
    items: [
      'Samosa',
      'Pakora',
      'Cookies',
      'Fresh Fruits',
      'Nuts Mix',
      'Yogurt',
      'Smoothies',
      'Granola',
    ],
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
  const { status: sessionStatus } = useSession();
  const planId = parseInt(searchParams.get('planId') || '1');
  const isServiceBooking = searchParams.get('intent') === 'service-booking';

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('date');
  const [deliveryDistance, setDeliveryDistance] = useState(5);
  const [approvalStatus, setApprovalStatus] = useState<
    'pending' | 'approved' | 'rejected'
  >('pending');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
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
  const [serviceIntent, setServiceIntent] =
    useState<ServiceBookingIntent | null>(null);

  const currentPlan = ALL_PLANS.find((p) => p.id === planId);
  const serviceId = serviceIntent?.serviceId || '';
  const {
    data: serviceDetail,
    isLoading: isServiceLoading,
    error: serviceError,
  } = usePublicService(isServiceBooking ? serviceId : '');

  useEffect(() => {
    if (currentPlan) {
      setSubscriptionData((prev) => ({
        ...prev,
        planName: currentPlan.name,
      }));
    }
  }, [currentPlan]);

  useEffect(() => {
    if (!isServiceBooking || typeof window === 'undefined') return;

    const rawIntent = window.sessionStorage.getItem('droooly:booking-intent');
    if (!rawIntent) return;

    try {
      const parsed = JSON.parse(rawIntent) as ServiceBookingIntent;
      if (parsed?.type === 'partner_service' && parsed.serviceId) {
        setServiceIntent(parsed);
      }
    } catch (error) {
      console.error('Unable to read booking intent', error);
    }
  }, [isServiceBooking]);

  useEffect(() => {
    if (!isServiceBooking || sessionStatus !== 'unauthenticated') return;
    const checkoutPath = '/checkout?intent=service-booking';
    router.replace(
      `/login?mode=signin&callbackUrl=${encodeURIComponent(checkoutPath)}`
    );
  }, [isServiceBooking, router, sessionStatus]);

  const calculateDaysPerWeek = () => {
    return Object.values(subscriptionData.selectedDays).filter(Boolean).length;
  };

  const calculateDeliveryFee = (): number => {
    const { base, perKm, minDistance, maxDistance, freeDeliveryAbove } =
      PRICING_CONFIG.DELIVERY_FEE;

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

    const selectedAddOns = currentPlan.addOns.filter((addon) =>
      subscriptionData.addOns.includes(addon.id)
    );
    const addOnTotal = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    let basePrice = currentPlan.price;

    if (subscriptionData.duration === 'weekly') {
      basePrice = Math.round(
        (currentPlan.price / 4) * subscriptionData.quantity
      );
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
      planPrice = Math.round(
        (currentPlan.price / 4) * subscriptionData.quantity
      );
    } else if (subscriptionData.duration === 'quarterly') {
      planPrice = Math.round(currentPlan.price * 3 * subscriptionData.quantity);
    } else {
      planPrice = currentPlan.price * subscriptionData.quantity;
    }

    const selectedAddOns = currentPlan.addOns.filter((addon) =>
      subscriptionData.addOns.includes(addon.id)
    );
    const addOnsPrice = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    const subtotal = planPrice + addOnsPrice;
    const deliveryFee = calculateDeliveryFee();
    const platformFee = Math.round(
      (subtotal + deliveryFee) * (PRICING_CONFIG.PLATFORM_FEE_PERCENTAGE / 100)
    );
    const subtotalBeforeDiscount = subtotal + deliveryFee + platformFee;
    const discount = Math.round(
      subtotalBeforeDiscount * (PRICING_CONFIG.DISCOUNT_PERCENTAGE / 100)
    );
    const subtotalAfterDiscount = subtotalBeforeDiscount - discount;
    const vat = Math.round(
      subtotalAfterDiscount * (PRICING_CONFIG.VAT_PERCENTAGE / 100)
    );
    const gst = Math.round(
      subtotalAfterDiscount * (PRICING_CONFIG.GST_PERCENTAGE / 100)
    );
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

  const handleCompletePayment = async () => {
    try {
      setIsProcessingPayment(true);

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(pricingBreakdown.finalTotal * 100),
          currency: 'INR',
          notes: {
            checkout_type: 'meal_plan',
            plan_id: subscriptionData.planId,
            plan_name: subscriptionData.planName,
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        order_id: data.order_id,

        name: 'Droooly',
        description: 'Meal Plan Subscription',

        handler: function (response: any) {
          console.log('SUCCESS', response);

          // ✅ Store order confirmation
          const orderId = response.razorpay_order_id;
          const orderDate = new Date().toLocaleDateString();

          setOrderConfirmation({
            orderId,
            orderDate,
            subscriptionStartDate: subscriptionData.startDate,
          });

          // 👉 move to success UI
          setCheckoutStep('confirmation');
        },

        modal: {
          ondismiss: function () {
            console.log('Payment popup closed');
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleServicePayment = async () => {
    if (!serviceIntent || serviceTotal <= 0) {
      alert('Please choose a valid service before continuing.');
      return;
    }

    if (sessionStatus !== 'authenticated') {
      const checkoutPath = '/checkout?intent=service-booking';
      router.push(
        `/login?mode=signin&callbackUrl=${encodeURIComponent(checkoutPath)}`
      );
      return;
    }

    try {
      setIsProcessingPayment(true);

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(serviceTotal * 100),
          currency: serviceCurrency,
          receipt:
            `svc_${serviceIntent.serviceId.slice(0, 8)}_${Date.now()}`.slice(
              0,
              40
            ),
          notes: {
            checkout_type: 'partner_service',
            service_id: serviceIntent.serviceId,
            service_key: serviceIntent.serviceKey,
            guests: String(serviceIntent.guests),
            coupon_code: serviceIntent.couponCode || '',
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || serviceCurrency,
        order_id: data.order_id,
        name: 'Droooly',
        description: serviceIntent.title,
        handler: function (response: any) {
          setOrderConfirmation({
            orderId: response.razorpay_order_id,
            orderDate: new Date().toLocaleDateString(),
            subscriptionStartDate: serviceIntent.date || 'To be scheduled',
          });

          if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem('droooly:booking-intent');
          }

          setCheckoutStep('confirmation');
          setIsProcessingPayment(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Service payment error:', error);
      alert('Something went wrong. Please try again.');
      setIsProcessingPayment(false);
    }
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
      if (
        !userInfo.firstName ||
        !userInfo.lastName ||
        !userInfo.email ||
        !userInfo.phone ||
        !userInfo.address ||
        !userInfo.city ||
        !userInfo.postalCode
      ) {
        alert('Please fill in all required fields');
        return;
      }
      setCheckoutStep('approval');
      setTimeout(() => {
        setApprovalStatus('approved');
      }, 2000);
    } else if (checkoutStep === 'approval') {
      if (approvalStatus === 'approved') {
        setCheckoutStep('review');
      }
    } else if (checkoutStep === 'review') {
      if (!termsAccepted) {
        alert('Please accept the terms and conditions');
        return;
      }
      setCheckoutStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (checkoutStep === 'payment') setCheckoutStep('review');
    else if (checkoutStep === 'review') setCheckoutStep('approval');
    else if (checkoutStep === 'approval') setCheckoutStep('user-info');
    else if (checkoutStep === 'user-info') setCheckoutStep('date');
  };

  const pricingBreakdown = calculatePricingBreakdown();
  const serviceCurrency =
    serviceIntent?.currencyCode || serviceDetail?.currency_code || 'INR';
  const fallbackServiceTotal =
    (Number(serviceDetail?.base_price) || 0) *
    Math.max(serviceIntent?.guests || 1, 1);
  const serviceTotal = Math.max(
    Number(serviceIntent?.estimatedTotal) || fallbackServiceTotal,
    0
  );

  if (isServiceBooking) {
    return (
      <ServiceCheckout
        intent={serviceIntent}
        service={serviceDetail}
        isLoading={isServiceLoading}
        error={serviceError}
        currency={serviceCurrency}
        total={serviceTotal}
        isProcessingPayment={isProcessingPayment}
        isAuthenticated={sessionStatus === 'authenticated'}
        orderConfirmation={orderConfirmation}
        isConfirmed={checkoutStep === 'confirmation'}
        onBack={() => router.push('/')}
        onPay={handleServicePayment}
      />
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-500px) rotate(720deg); opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .confetti-piece {
          position: fixed;
          pointer-events: none;
          animation: confetti 3s ease-out forwards;
        }

        .gradient-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }

        .gradient-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        .gradient-btn:active:not(:disabled) {
          transform: translateY(0px);
        }

        .gradient-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirmation-card {
          animation: slideInUp 0.6s ease-out;
        }

        .success-icon {
          animation: pulse 0.6s ease-out;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => router.push('/meal-plans')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#667eea',
              fontWeight: '600',
            }}
          >
            <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
            <span style={{ fontSize: '14px' }} className="hidden sm:inline">
              Back to Meals
            </span>
          </button>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              flex: 1,
            }}
          >
            Secure Checkout
          </h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div
          className="service-checkout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              checkoutStep === 'confirmation'
                ? '1fr'
                : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Main Content */}
          <div style={{ gridColumn: 'span 1', minHeight: '400px' }}>
            {/* Progress Indicator - Hide on confirmation */}
            {checkoutStep !== 'confirmation' && (
              <ProgressIndicator
                currentStep={checkoutStep}
                approvalStatus={approvalStatus}
              />
            )}

            {/* Step Content */}
            <div
              style={{
                marginTop: checkoutStep === 'confirmation' ? '0' : '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
              }}
            >
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

              {checkoutStep === 'approval' && (
                <ApprovalStep
                  approvalStatus={approvalStatus}
                  currentPlan={currentPlan}
                />
              )}

              {checkoutStep === 'review' && (
                <ReviewStep
                  subscriptionData={subscriptionData}
                  userInfo={userInfo}
                  currentPlan={currentPlan}
                  calculateDaysPerWeek={calculateDaysPerWeek}
                  pricingBreakdown={pricingBreakdown}
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                />
              )}

              {checkoutStep === 'payment' && (
                <PaymentStep pricingBreakdown={pricingBreakdown} />
              )}

              {checkoutStep === 'confirmation' && (
                <ConfirmationStep
                  orderConfirmation={orderConfirmation}
                  currentPlan={currentPlan}
                  subscriptionData={subscriptionData}
                  userInfo={userInfo}
                  calculateDaysPerWeek={calculateDaysPerWeek}
                  pricingBreakdown={pricingBreakdown}
                />
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                {checkoutStep !== 'confirmation' && (
                  <>
                    <button
                      onClick={() => {
                        if (checkoutStep === 'date') {
                          router.push('/meal-plans');
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
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          '#f8fafc';
                        (e.currentTarget as HTMLElement).style.borderColor =
                          '#cbd5e1';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          'white';
                        (e.currentTarget as HTMLElement).style.borderColor =
                          '#e2e8f0';
                      }}
                    >
                      <ArrowLeftIcon
                        style={{ width: '16px', height: '16px' }}
                      />
                      {checkoutStep === 'date' ? 'Back to Meals' : 'Back'}
                    </button>
                    <button
                      onClick={
                        checkoutStep === 'payment'
                          ? handleCompletePayment
                          : handleNextStep
                      }
                      disabled={isProcessingPayment}
                      className="gradient-btn"
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        color: 'white',
                        cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid white',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                          Processing...
                        </>
                      ) : checkoutStep === 'payment' ? (
                        <>
                          <LockClosedIcon
                            style={{ width: '16px', height: '16px' }}
                          />
                          Complete Payment
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRightIcon
                            style={{ width: '16px', height: '16px' }}
                          />
                        </>
                      )}
                    </button>
                  </>
                )}

                {checkoutStep === 'confirmation' && (
                  <button
                    onClick={() => router.push('/meal-plans')}
                    className="gradient-btn"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: 'none',
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
                    <CheckIcon style={{ width: '16px', height: '16px' }} />
                    Back to Home
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary (Hidden on confirmation) */}
          {checkoutStep !== 'confirmation' && (
            <div style={{ gridColumn: 'span 1' }}>
              <OrderSummary
                currentPlan={currentPlan}
                subscriptionData={subscriptionData}
                calculateDaysPerWeek={calculateDaysPerWeek}
                pricingBreakdown={pricingBreakdown}
                deliveryDistance={deliveryDistance}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCheckout({
  intent,
  service,
  isLoading,
  error,
  currency,
  total,
  isProcessingPayment,
  isAuthenticated,
  orderConfirmation,
  isConfirmed,
  onBack,
  onPay,
}: any) {
  const title = service?.title || intent?.title || 'Selected service';
  const description =
    service?.short_description ||
    service?.description ||
    'Review your booking details before secure payment.';

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 760px) {
          .service-checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .service-checkout-panel {
            position: static !important;
          }
        }
      `}</style>
      <div
        style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 20px' }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            border: '1px solid #e2e8f0',
            background: 'white',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          Back to search
        </button>

        <div
          className="service-checkout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 0.8fr)',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <section
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: 28,
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
            }}
          >
            <p style={{ color: '#16a34a', fontWeight: 800, margin: 0 }}>
              Secure checkout
            </p>
            <h1 style={{ fontSize: 34, lineHeight: 1.1, margin: '10px 0' }}>
              {isConfirmed ? 'Booking payment received' : title}
            </h1>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 640 }}>
              {isConfirmed
                ? 'We have received your payment confirmation. The order capture and partner workflow can now continue from the backend flow.'
                : description}
            </p>

            {isLoading && (
              <p style={{ color: '#64748b' }}>Loading service details...</p>
            )}
            {error && (
              <p style={{ color: '#b91c1c' }}>
                We could not refresh this service. You can go back and select it
                again.
              </p>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 14,
                marginTop: 24,
              }}
            >
              <ServiceInfo
                label="Location"
                value={intent?.location || 'To confirm'}
              />
              <ServiceInfo label="Date" value={intent?.date || 'To schedule'} />
              <ServiceInfo
                label="Guests"
                value={String(intent?.guests || '-')}
              />
              <ServiceInfo
                label="Coupon"
                value={intent?.couponCode || 'No coupon applied'}
              />
            </div>

            {isConfirmed && (
              <div
                style={{
                  marginTop: 26,
                  padding: 18,
                  borderRadius: 14,
                  background: '#ecfdf5',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                }}
              >
                Razorpay order: {orderConfirmation.orderId}
              </div>
            )}
          </section>

          <aside
            className="service-checkout-panel"
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: 24,
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
              position: 'sticky',
              top: 20,
            }}
          >
            <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>
              Booking summary
            </h2>
            <SummaryLine label="Service" value={title} />
            <SummaryLine
              label="Subtotal"
              value={formatCheckoutMoney(intent?.subtotal || total, currency)}
            />
            <SummaryLine
              label="Discount"
              value={`-${formatCheckoutMoney(intent?.discount || 0, currency)}`}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #e2e8f0',
                paddingTop: 16,
                marginTop: 16,
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              <span>Total</span>
              <span>{formatCheckoutMoney(total, currency)}</span>
            </div>
            <button
              type="button"
              onClick={onPay}
              disabled={
                !intent || total <= 0 || isProcessingPayment || isConfirmed
              }
              style={{
                width: '100%',
                marginTop: 22,
                border: 0,
                borderRadius: 12,
                padding: '14px 18px',
                background: '#16a34a',
                color: 'white',
                fontWeight: 900,
                cursor:
                  !intent || total <= 0 || isProcessingPayment || isConfirmed
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  !intent || total <= 0 || isProcessingPayment || isConfirmed
                    ? 0.55
                    : 1,
              }}
            >
              {isConfirmed
                ? 'Payment confirmed'
                : isProcessingPayment
                  ? 'Opening Razorpay...'
                  : isAuthenticated
                    ? 'Pay securely with Razorpay'
                    : 'Sign in to continue'}
            </button>
            <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>
              No payment links are created here. This opens the Razorpay order
              checkout directly.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ServiceInfo({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 14,
        background: '#f8fafc',
      }}
    >
      <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ color: '#0f172a', fontSize: 15, fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 0',
        color: '#334155',
      }}
    >
      <span>{label}</span>
      <strong style={{ textAlign: 'right' }}>{value}</strong>
    </div>
  );
}

function formatCheckoutMoney(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

// Progress Indicator Component
function ProgressIndicator({
  currentStep,
  approvalStatus,
}: {
  currentStep: CheckoutStep;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}) {
  const steps = [
    { id: 'date', label: 'Schedule', icon: '📅' },
    { id: 'user-info', label: 'Details', icon: '👤' },
    { id: 'approval', label: 'Approval', icon: '✓' },
    { id: 'review', label: 'Review', icon: '📋' },
    { id: 'payment', label: 'Payment', icon: '💳' },
  ];

  const stepOrder = ['date', 'user-info', 'approval', 'review', 'payment'];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {steps.map((step, idx) => (
        <div
          key={step.id}
          style={{ display: 'flex', alignItems: 'center', flex: 1 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background:
                  idx <= currentIndex
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#e2e8f0',
                color: idx <= currentIndex ? 'white' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow:
                  idx <= currentIndex
                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                    : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {idx < currentIndex ? '✓' : step.icon}
            </div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: idx <= currentIndex ? '#667eea' : '#94a3b8',
                marginTop: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </label>
          </div>
          {idx < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: '3px',
                background:
                  idx < currentIndex
                    ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                    : '#e2e8f0',
                margin: '0 12px',
                marginBottom: '24px',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Order Summary Component
function OrderSummary({
  currentPlan,
  subscriptionData,
  calculateDaysPerWeek,
  pricingBreakdown,
  deliveryDistance,
}: any) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'sticky',
        top: '80px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Plan Info */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontSize: '36px' }}>{currentPlan?.image}</div>
          <div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                margin: 0,
              }}
            >
              {currentPlan?.name}
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '4px 0 0 0',
              }}
            >
              {currentPlan?.mealTypeLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Details */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#64748b' }}>Duration:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {subscriptionData.duration}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#64748b' }}>Days/Week:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {calculateDaysPerWeek()} days
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#64748b' }}>Quantity:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {subscriptionData.quantity}{' '}
            {subscriptionData.quantity === 1 ? 'person' : 'people'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
          }}
        >
          <span style={{ color: '#64748b' }}>Delivery Distance:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {deliveryDistance} km
          </span>
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
      <h4
        style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 12px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Price Breakdown
      </h4>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '6px',
        }}
      >
        <span>Plan</span>
        <span>₹{pricingBreakdown.planPrice}</span>
      </div>

      {pricingBreakdown.addOnsPrice > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '6px',
          }}
        >
          <span>Add-ons</span>
          <span>₹{pricingBreakdown.addOnsPrice}</span>
        </div>
      )}

      {pricingBreakdown.deliveryFee > 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '6px',
          }}
        >
          <span>Delivery</span>
          <span>₹{pricingBreakdown.deliveryFee}</span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#10b981',
            marginBottom: '6px',
            fontWeight: '600',
          }}
        >
          <span>Delivery</span>
          <span>FREE ✓</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '6px',
        }}
      >
        <span>Platform Fee</span>
        <span>₹{pricingBreakdown.platformFee}</span>
      </div>

      <div
        style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }}
      />

      {pricingBreakdown.discount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#10b981',
            marginBottom: '6px',
            fontWeight: '600',
          }}
        >
          <span>Discount (10%)</span>
          <span>-₹{pricingBreakdown.discount}</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '6px',
        }}
      >
        <span>VAT (2.5%)</span>
        <span>₹{pricingBreakdown.vat}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '8px',
        }}
      >
        <span>GST (5%)</span>
        <span>₹{pricingBreakdown.gst}</span>
      </div>

      <div
        style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        <span>Total</span>
        <span>₹{pricingBreakdown.finalTotal}</span>
      </div>
    </div>
  );
}

// Date Selection Step
function DateSelectionStep({
  subscriptionData,
  setSubscriptionData,
  calculateDaysPerWeek,
  currentPlan,
  deliveryDistance,
  setDeliveryDistance,
}: any) {
  return (
    <>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 20px 0',
        }}
      >
        📅 Schedule Your Delivery
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {['weekly', 'monthly', 'quarterly'].map((duration) => (
          <button
            key={duration}
            onClick={() =>
              setSubscriptionData({ ...subscriptionData, duration })
            }
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              border:
                subscriptionData.duration === duration
                  ? 'none'
                  : '2px solid #e2e8f0',
              background:
                subscriptionData.duration === duration
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              color:
                subscriptionData.duration === duration ? 'white' : '#64748b',
              transition: 'all 0.2s ease',
              boxShadow:
                subscriptionData.duration === duration
                  ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                  : 'none',
            }}
          >
            {duration === 'weekly' && '📆 Weekly'}
            {duration === 'monthly' && '📅 Monthly'}
            {duration === 'quarterly' && '📊 Quarterly'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1e293b',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Start Date *
        </label>
        <input
          type="date"
          value={subscriptionData.startDate}
          onChange={(e) =>
            setSubscriptionData({
              ...subscriptionData,
              startDate: e.target.value,
            })
          }
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1e293b',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          Select Days ({calculateDaysPerWeek()} days) *
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
          }}
        >
          {Object.entries(subscriptionData.selectedDays).map(
            ([day, selected]: [string, any]) => (
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
                  border: 'none',
                  background: selected
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f8fafc',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: selected ? 'transparent' : '#e2e8f0',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: selected ? 'white' : '#64748b',
                  transition: 'all 0.2s ease',
                  boxShadow: selected
                    ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                    : 'none',
                }}
              >
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
              </button>
            )
          )}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1e293b',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Number of People *
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            width: 'fit-content',
          }}
        >
          <button
            onClick={() =>
              setSubscriptionData({
                ...subscriptionData,
                quantity: Math.max(1, subscriptionData.quantity - 1),
              })
            }
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              color: '#667eea',
            }}
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
            style={{
              width: '50px',
              padding: '8px 4px',
              border: 'none',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '700',
              backgroundColor: 'transparent',
            }}
            min="1"
          />
          <button
            onClick={() =>
              setSubscriptionData({
                ...subscriptionData,
                quantity: subscriptionData.quantity + 1,
              })
            }
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              color: '#667eea',
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1e293b',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Delivery Distance *
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            value={deliveryDistance}
            onChange={(e) =>
              setDeliveryDistance(Math.max(0, parseFloat(e.target.value) || 0))
            }
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
            }}
            min="0"
            step="0.5"
          />
          <span
            style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}
          >
            km
          </span>
        </div>
      </div>

      {currentPlan?.addOns && currentPlan.addOns.length > 0 && (
        <div>
          <label
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1e293b',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Add Optional Items
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentPlan.addOns.map((addon: any) => (
              <button
                key={addon.id}
                onClick={() => {
                  setSubscriptionData({
                    ...subscriptionData,
                    addOns: subscriptionData.addOns.includes(addon.id)
                      ? subscriptionData.addOns.filter(
                          (id: number) => id !== addon.id
                        )
                      : [...subscriptionData.addOns, addon.id],
                  });
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: subscriptionData.addOns.includes(addon.id)
                    ? 'none'
                    : '2px solid #e2e8f0',
                  background: subscriptionData.addOns.includes(addon.id)
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: subscriptionData.addOns.includes(addon.id)
                    ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                    : 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={subscriptionData.addOns.includes(addon.id)}
                  onChange={() => {}}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: subscriptionData.addOns.includes(addon.id)
                        ? 'white'
                        : '#1e293b',
                    }}
                  >
                    {addon.name}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: subscriptionData.addOns.includes(addon.id)
                        ? 'white'
                        : '#10b981',
                    }}
                  >
                    +₹{addon.price}
                  </span>
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
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 20px 0',
        }}
      >
        👤 Delivery Information
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            First Name *
          </label>
          <input
            type="text"
            value={userInfo.firstName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, firstName: e.target.value })
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            placeholder="John"
          />
        </div>
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Last Name *
          </label>
          <input
            type="text"
            value={userInfo.lastName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, lastName: e.target.value })
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            placeholder="Doe"
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Email *
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Phone *
          </label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#475569',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          Address *
        </label>
        <input
          type="text"
          value={userInfo.address}
          onChange={(e) =>
            setUserInfo({ ...userInfo, address: e.target.value })
          }
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
          placeholder="Street address"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}
      >
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            City *
          </label>
          <input
            type="text"
            value={userInfo.city}
            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            placeholder="City"
          />
        </div>
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#475569',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Postal Code *
          </label>
          <input
            type="text"
            value={userInfo.postalCode}
            onChange={(e) =>
              setUserInfo({ ...userInfo, postalCode: e.target.value })
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            placeholder="123456"
          />
        </div>
      </div>
    </>
  );
}

// Payment Step
function PaymentStep({ pricingBreakdown }: any) {
  return (
    <>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 20px 0',
        }}
      >
        💳 Secure Payment
      </h2>

      <div
        style={{
          backgroundColor: '#f0f9ff',
          borderLeft: '4px solid #667eea',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LockClosedIcon
            style={{
              width: '20px',
              height: '20px',
              color: '#667eea',
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#667eea',
                margin: 0,
              }}
            >
              Secure Payment Gateway
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#0c4a6e',
                margin: '4px 0 0 0',
              }}
            >
              Your payment is processed by Razorpay. We never store your card
              details.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span
            style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}
          >
            Final Amount
          </span>
          <span
            style={{
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ₹{pricingBreakdown.finalTotal}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          Including all taxes and fees
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#ecfdf5',
          borderLeft: '4px solid #10b981',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircleIcon
            style={{
              width: '20px',
              height: '20px',
              color: '#10b981',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: '12px',
              color: '#065f46',
              margin: 0,
              fontWeight: '500',
            }}
          >
            ✓ 100% secure and encrypted • ✓ Money-back guarantee
          </p>
        </div>
      </div>
    </>
  );
}

// Approval Step
function ApprovalStep({ approvalStatus, currentPlan }: any) {
  return (
    <>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 20px 0',
        }}
      >
        ⏳ Approval Process
      </h2>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        {approvalStatus === 'pending' && (
          <>
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                animation: 'spin 2s linear infinite',
              }}
            >
              ⏳
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Your order is being reviewed by our catering team.
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '8px 0 0 0',
              }}
            >
              Please wait a moment...
            </p>
          </>
        )}
        {approvalStatus === 'approved' && (
          <>
            <CheckCircleIcon
              style={{
                width: '60px',
                height: '60px',
                color: '#10b981',
                marginBottom: '16px',
              }}
            />
            <p
              style={{
                fontSize: '14px',
                color: '#064e3b',
                fontWeight: '600',
                margin: 0,
              }}
            >
              ✓ Your order has been approved!
            </p>
          </>
        )}
      </div>
    </>
  );
}

// Review Step
function ReviewStep({
  subscriptionData,
  userInfo,
  currentPlan,
  calculateDaysPerWeek,
  pricingBreakdown,
  termsAccepted,
  setTermsAccepted,
}: any) {
  return (
    <>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 20px 0',
        }}
      >
        📄 Review Your Order
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 12px 0',
          }}
        >
          Plan Details
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '36px' }}>{currentPlan?.image}</div>
          <div>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {currentPlan?.name}
            </h4>
            <p
              style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '4px 0 0 0',
              }}
            >
              {currentPlan?.mealTypeLabel}
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#64748b' }}>Duration:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {subscriptionData.duration}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#64748b' }}>Days/Week:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {calculateDaysPerWeek()} days
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
          }}
        >
          <span style={{ color: '#64748b' }}>Quantity:</span>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>
            {subscriptionData.quantity}{' '}
            {subscriptionData.quantity === 1 ? 'person' : 'people'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 12px 0',
          }}
        >
          Delivery Information
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#64748b',
                margin: '0 0 4px 0',
              }}
            >
              Name
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {userInfo.firstName} {userInfo.lastName}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#64748b',
                margin: '0 0 4px 0',
              }}
            >
              Email
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {userInfo.email}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#64748b',
                margin: '0 0 4px 0',
              }}
            >
              Phone
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {userInfo.phone}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#64748b',
                margin: '0 0 4px 0',
              }}
            >
              City
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {userInfo.city}
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 4px 0',
            }}
          >
            Address
          </p>
          <p
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0,
            }}
          >
            {userInfo.address}, {userInfo.postalCode}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 12px 0',
          }}
        >
          Price Breakdown
        </h3>
        <PricingBreakdownCard pricingBreakdown={pricingBreakdown} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          style={{
            width: '16px',
            height: '16px',
            cursor: 'pointer',
            marginTop: '3px',
            flexShrink: 0,
          }}
        />
        <label
          style={{
            fontSize: '12px',
            color: '#92400e',
            fontWeight: '500',
            cursor: 'pointer',
            margin: 0,
          }}
        >
          I agree to the{' '}
          <span style={{ fontWeight: '700' }}>terms and conditions</span>, and
          understand that I will be charged ₹{pricingBreakdown.finalTotal} for
          this subscription. Cancellation is allowed anytime.
        </label>
      </div>
    </>
  );
}

// Confirmation Step - NEW
function ConfirmationStep({
  orderConfirmation,
  currentPlan,
  subscriptionData,
  userInfo,
  calculateDaysPerWeek,
  pricingBreakdown,
}: any) {
  return (
    <div className="confirmation-card">
      {/* Success Icon */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          className="success-icon"
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircleIcon
            style={{ width: '48px', height: '48px', color: 'white' }}
          />
        </div>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0',
          }}
        >
          Congratulations! 🎉
        </h2>
        <p
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#10b981',
            margin: '0 0 4px 0',
          }}
        >
          Your order has been confirmed
        </p>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
          We're excited to serve you delicious meals!
        </p>
      </div>

      {/* Order Details */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '2px solid #dcfce7',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#10b981',
            margin: '0 0 16px 0',
          }}
        >
          📦 Order Confirmation Details
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6ee7b7',
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
                letterSpacing: '0.5px',
              }}
            >
              Order ID
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                fontFamily: 'monospace',
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #dcfce7',
              }}
            >
              {orderConfirmation.orderId}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6ee7b7',
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
                letterSpacing: '0.5px',
              }}
            >
              Order Date
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {orderConfirmation.orderDate}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6ee7b7',
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
                letterSpacing: '0.5px',
              }}
            >
              Delivery Start
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
              }}
            >
              {orderConfirmation.subscriptionStartDate}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Details Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 12px 0',
          }}
        >
          🍽️ Meal Plan Details
        </h3>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '48px' }}>{currentPlan?.image}</div>
            <div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                {currentPlan?.name}
              </h4>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: '4px 0 0 0',
                }}
              >
                {currentPlan?.mealTypeLabel}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#64748b',
                  margin: '0 0 4px 0',
                }}
              >
                Duration
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                {subscriptionData.duration.charAt(0).toUpperCase() +
                  subscriptionData.duration.slice(1)}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#64748b',
                  margin: '0 0 4px 0',
                }}
              >
                Days Per Week
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                {calculateDaysPerWeek()} days
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#64748b',
                  margin: '0 0 4px 0',
                }}
              >
                Quantity
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                {subscriptionData.quantity}{' '}
                {subscriptionData.quantity === 1 ? 'person' : 'people'}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#64748b',
                  margin: '0 0 4px 0',
                }}
              >
                Delivery To
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                {userInfo.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 12px 0',
          }}
        >
          📍 Delivery Address
        </h3>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0',
            }}
          >
            {userInfo.firstName} {userInfo.lastName}
          </p>
          <p
            style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}
          >
            {userInfo.address}
          </p>
          <p
            style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}
          >
            {userInfo.city}, {userInfo.postalCode}
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>
            {userInfo.email}
          </p>
          <p
            style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}
          >
            {userInfo.phone}
          </p>
        </div>
      </div>

      {/* Order Total */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 12px 0',
          }}
        >
          💰 Order Total
        </h3>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Plan Price
            </span>
            <span
              style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}
            >
              ₹{pricingBreakdown.planPrice}
            </span>
          </div>
          {pricingBreakdown.addOnsPrice > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Add-ons
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1e293b',
                }}
              >
                ₹{pricingBreakdown.addOnsPrice}
              </span>
            </div>
          )}
          {pricingBreakdown.deliveryFee > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Delivery Fee
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1e293b',
                }}
              >
                ₹{pricingBreakdown.deliveryFee}
              </span>
            </div>
          )}
          <div
            style={{
              height: '1px',
              backgroundColor: '#e2e8f0',
              margin: '8px 0',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span
              style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}
            >
              Total Paid
            </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₹{pricingBreakdown.finalTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div
        style={{
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #fde68a',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#92400e',
            margin: '0 0 12px 0',
          }}
        >
          📋 What's Next?
        </h3>
        <ul
          style={{
            fontSize: '12px',
            color: '#92400e',
            margin: 0,
            paddingLeft: '20px',
          }}
        >
          <li style={{ marginBottom: '8px' }}>
            You'll receive a confirmation email shortly
          </li>
          <li style={{ marginBottom: '8px' }}>
            Your first meal will be delivered on{' '}
            <strong>{orderConfirmation.subscriptionStartDate}</strong>
          </li>
          <li style={{ marginBottom: '8px' }}>
            You can manage your subscription from your account dashboard
          </li>
          <li>
            Our catering team will contact you if they need any clarifications
          </li>
        </ul>
      </div>
    </div>
  );
}
