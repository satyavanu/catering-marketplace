'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

// Mock menu items from the service
const MENU_ITEMS = [
  {
    id: 1,
    category: 'Appetizers',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with spices',
    servingSize: 'per serving',
    image: '🥘',
  },
  {
    id: 2,
    category: 'Appetizers',
    name: 'Samosa',
    description: 'Crispy fried pastries with potato & peas',
    servingSize: 'per piece',
    image: '🥐',
  },
  {
    id: 3,
    category: 'Main Course',
    name: 'Butter Chicken',
    description: 'Tender chicken in creamy tomato gravy',
    servingSize: 'per serving',
    image: '🍗',
  },
  {
    id: 4,
    category: 'Main Course',
    name: 'Biryani',
    description: 'Fragrant rice with meat and spices',
    servingSize: 'per serving',
    image: '🍚',
  },
  {
    id: 5,
    category: 'Main Course',
    name: 'Dal Makhani',
    description: 'Creamy black lentils',
    servingSize: 'per serving',
    image: '🫕',
  },
  {
    id: 6,
    category: 'Desserts',
    name: 'Gulab Jamun',
    description: 'Soft milk solids in sugar syrup',
    servingSize: 'per piece',
    image: '🍮',
  },
  {
    id: 7,
    category: 'Desserts',
    name: 'Kheer',
    description: 'Rice pudding with cardamom & nuts',
    servingSize: 'per serving',
    image: '🥛',
  },
  {
    id: 8,
    category: 'Beverages',
    name: 'Lassi',
    description: 'Traditional yogurt drink',
    servingSize: 'per glass',
    image: '🥤',
  },
];

// Mock additional services
const ADDITIONAL_SERVICES = [
  { id: 1, name: 'Professional Servers', price: 5000, description: 'Per service staff member' },
  { id: 2, name: 'Decorations', price: 15000, description: 'Basic event decoration' },
  { id: 3, name: 'Bar Service', price: 20000, description: 'Bartender and beverages setup' },
  { id: 4, name: 'Setup & Cleanup', price: 10000, description: 'Complete setup and cleanup' },
  { id: 5, name: 'Premium Tableware', price: 8000, description: 'Upgrade to premium plates & cutlery' },
  { id: 6, name: 'Live Cooking Station', price: 25000, description: 'Chef cooking live at your event' },
];

// Mock payment methods
const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
  { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'wallet', name: 'Digital Wallet', icon: '👛', description: 'PayPal, Apple Pay' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
];

const TERMS_AND_CONDITIONS = [
  {
    title: 'Cancellation Policy',
    description: 'Free cancellation up to 14 days before the event. 50% charges apply for cancellations between 7-14 days. No refund within 7 days of the event.',
  },
  {
    title: '100% Refund Policy',
    description: 'We guarantee 100% refund of your full payment if we fail to deliver the service on your event date. No questions asked.',
  },
  {
    title: 'Payment Terms',
    description: 'Full payment required after quote approval. Payment is held securely until event completion.',
  },
  {
    title: 'Menu Customization',
    description: 'Menu can be customized up to 10 days before the event. Changes within 10 days may incur additional charges.',
  },
  {
    title: 'Guest Count',
    description: 'Final guest count must be confirmed 5 days before the event. Additional guests can be accommodated on availability.',
  },
  {
    title: 'Dietary Requirements',
    description: 'Please inform us of any dietary restrictions at the time of booking. Special requests are subject to availability.',
  },
];

const QuotePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('serviceId');
  const serviceName = searchParams.get('serviceName');
  const fromLogin = searchParams.get('fromLogin') === 'true';

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mode & Step States
  const [mode, setMode] = useState<'quote' | 'order'>('quote');
  const [step, setStep] = useState<'form' | 'menu-selection' | 'quote-confirmation' | 'catering-review' | 'terms' | 'payment' | 'confirmation'>('form');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [orderStatus, setOrderStatus] = useState<'success' | 'failed'>('success');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const [formData, setFormData] = useState({
    eventDate: '',
    guestCount: '',
    eventType: '',
    fullName: '',
    email: '',
    phone: '',
    budget: '',
    specialRequests: '',
    eventTime: '',
    address: '',
    city: '',
    zipCode: '',
    selectedServices: [] as number[],
    selectedAddressId: '',
    useExistingAddress: false,
    selectedPaymentMethod: '',
  });

  // Menu selection state
  const [selectedMenuItems, setSelectedMenuItems] = useState<{ [key: number]: number }>({});

  const [quoteData, setQuoteData] = useState<any>(null);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [caterResponse, setCaterResponse] = useState<any>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (userStr && token) {
          const user = JSON.parse(userStr);
          setIsLoggedIn(true);
          setCurrentUser(user);
          setFormData(prev => ({
            ...prev,
            fullName: user.fullName || user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            selectedAddressId: user.addresses?.[0]?.id || '',
            useExistingAddress: user.addresses && user.addresses.length > 0,
          }));

          setMode('order');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [fromLogin]);

  const handleLoginRedirect = () => {
    const returnUrl = `/quote?fromLogin=true&serviceId=${serviceId}&serviceName=${encodeURIComponent(serviceName || '')}`;
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setFormData({
      eventDate: '',
      guestCount: '',
      eventType: '',
      fullName: '',
      email: '',
      phone: '',
      budget: '',
      specialRequests: '',
      eventTime: '',
      address: '',
      city: '',
      zipCode: '',
      selectedServices: [],
      selectedAddressId: '',
      useExistingAddress: false,
      selectedPaymentMethod: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const updateMenuItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedMenuItems(prev => {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      });
    } else {
      setSelectedMenuItems(prev => ({
        ...prev,
        [itemId]: quantity,
      }));
    }
  };

  const getSelectedMenuDetails = () => {
    return Object.entries(selectedMenuItems)
      .map(([itemId, quantity]) => {
        const item = MENU_ITEMS.find(m => m.id === parseInt(itemId));
        return item ? { ...item, quantity } : null;
      })
      .filter(Boolean);
  };

  const calculateOrderTotal = () => {
    const servicesTotal = formData.selectedServices.reduce((total, id) => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === id);
      return total + (service?.price || 0);
    }, 0);
    return servicesTotal + (parseInt(formData.guestCount || '0') * 500);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'quote') {
      // Move to menu selection
      setStep('menu-selection');
    } else {
      // Move to menu selection for orders
      setStep('menu-selection');
    }
  };

  const handleSubmitMenuAndCreateQuote = async () => {
    if (Object.keys(selectedMenuItems).length === 0) {
      alert('Please select at least one menu item');
      return;
    }

    setIsSubmittingQuote(true);

    try {
      // Prepare quote data
      const newQuoteData = {
        quoteId: `QT-${Date.now()}`,
        ...formData,
        serviceId,
        serviceName,
        selectedMenuItems: getSelectedMenuDetails(),
        selectedServices: formData.selectedServices.map(id =>
          ADDITIONAL_SERVICES.find(s => s.id === id)
        ),
        guestCount: formData.guestCount,
        createdAt: new Date().toLocaleDateString('en-IN'),
        status: 'pending',
        userId: currentUser?.id,
      };

      // TODO: Send to backend API
      // const response = await fetch('/api/quotes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newQuoteData),
      // });

      // Simulate backend response
      console.log('Submitting quote to backend:', newQuoteData);

      setQuoteData(newQuoteData);
      setStep('quote-confirmation');
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  // Simulate catering approval (in real app, this comes from backend)
  const simulateCateringApproval = () => {
    const approvedQuote = {
      ...quoteData,
      status: 'approved',
      approvedAt: new Date().toLocaleDateString('en-IN'),
      approvedBy: 'Catering Team',
      totalPrice: calculateOrderTotal(),
      breakdown: {
        basePrice: parseInt(formData.guestCount || '0') * 500,
        servicesPrice: formData.selectedServices.reduce((total, id) => {
          const service = ADDITIONAL_SERVICES.find(s => s.id === id);
          return total + (service?.price || 0);
        }, 0),
      },
    };

    setCaterResponse(approvedQuote);
    setQuoteStatus('approved');
    setStep('terms');
  };

  const handleAcceptTerms = () => {
    if (termsAccepted) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = () => {
    if (!formData.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const isSuccess = Math.random() > 0.2;

    const finalOrder = {
      ...caterResponse,
      orderId: `ORD-${Date.now()}`,
      paymentMethod: PAYMENT_METHODS.find(m => m.id === formData.selectedPaymentMethod)?.name,
      paymentDate: new Date().toLocaleDateString('en-IN'),
      paymentStatus: isSuccess ? 'completed' : 'failed',
      refundPolicy: '100% refundable in case of non-delivery',
    };

    console.log('Final Order:', finalOrder);
    setOrderSummary(finalOrder);
    setOrderStatus(isSuccess ? 'success' : 'failed');
    setStep('confirmation');
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 5vw, 32px)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(40px, 12vw, 48px)', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#64748b', fontSize: 'clamp(14px, 4vw, 16px)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Menu Selection Screen
  if (step === 'menu-selection') {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px, 5vw, 40px)' }}>
            <button
              onClick={() => setStep('form')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
              }}
            >
              <ArrowLeftIcon style={{ width: '16px', height: '16px', minWidth: '16px' }} />
            </button>
            <h1 style={{ fontSize: 'clamp(24px, 8vw, 40px)', fontWeight: '900', color: '#1e293b', margin: 0 }}>
              🍽️ Select Menu Items
            </h1>
          </div>

          {/* Info */}
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: 'clamp(12px, 3vw, 16px)', marginBottom: 'clamp(16px, 4vw, 24px)' }}>
            <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#1e40af', margin: 0 }}>
              ℹ️ Choose menu items for your event. The catering team will review and provide exact pricing.
            </p>
          </div>

          {/* Menu by Category */}
          {['Appetizers', 'Main Course', 'Desserts', 'Beverages'].map(category => (
            <div key={category} style={{ marginBottom: 'clamp(24px, 5vw, 40px)' }}>
              <h2 style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '800', color: '#1e293b', marginBottom: 'clamp(12px, 3vw, 16px)' }}>
                {category}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'clamp(12px, 2vw, 16px)',
              }}>
                {MENU_ITEMS.filter(item => item.category === category).map(item => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: 'clamp(14px, 3vw, 18px)',
                      border: selectedMenuItems[item.id]
                        ? '2px solid #6366f1'
                        : '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: 'clamp(28px, 6vw, 36px)' }}>{item.image}</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
                          {item.name}
                        </h3>
                        <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#64748b', margin: 0 }}>
                          {item.description}
                        </p>
                        <p style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: '#94a3b8', margin: '4px 0 0 0' }}>
                          {item.servingSize}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    {selectedMenuItems[item.id] ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#e0e7ff',
                        padding: '8px',
                        borderRadius: '8px',
                      }}>
                        <button
                          onClick={() => updateMenuItemQuantity(item.id, (selectedMenuItems[item.id] || 0) - 1)}
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid #c7d2fe',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MinusIcon style={{ width: '14px', height: '14px', color: '#6366f1' }} />
                        </button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', color: '#6366f1', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                          {selectedMenuItems[item.id]}
                        </span>
                        <button
                          onClick={() => updateMenuItemQuantity(item.id, (selectedMenuItems[item.id] || 0) + 1)}
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid #c7d2fe',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PlusIcon style={{ width: '14px', height: '14px', color: '#6366f1' }} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateMenuItemQuantity(item.id, 1)}
                        style={{
                          width: '100%',
                          backgroundColor: '#f1f5f9',
                          color: '#6366f1',
                          border: '1px solid #cbd5e1',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: 'clamp(12px, 2.5vw, 13px)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e0e7ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                      >
                        <PlusIcon style={{ width: '14px', height: '14px', marginRight: '6px', display: 'inline' }} />
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Selected Items Summary */}
          {Object.keys(selectedMenuItems).length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: 'clamp(16px, 3vw, 20px)', marginBottom: 'clamp(20px, 4vw, 32px)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
                ✓ Selected Items ({Object.keys(selectedMenuItems).length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {getSelectedMenuDetails().map(item => (
                  <div key={item?.id} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        {item?.name}
                      </p>
                      <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#64748b', margin: '2px 0 0 0' }}>
                        Qty: {item?.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => updateMenuItemQuantity(item?.id, 0)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <TrashIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
            <button
              onClick={() => setStep('form')}
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={handleSubmitMenuAndCreateQuote}
              disabled={Object.keys(selectedMenuItems).length === 0 || isSubmittingQuote}
              style={{
                backgroundColor: Object.keys(selectedMenuItems).length > 0 ? '#6366f1' : '#cbd5e1',
                color: 'white',
                border: 'none',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: Object.keys(selectedMenuItems).length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              {isSubmittingQuote ? 'Submitting...' : 'Continue to Confirmation'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quote Confirmation Screen
  if (step === 'quote-confirmation' && quoteData) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: 'clamp(16px, 4vw, 32px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Status Header */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: 'clamp(24px, 5vw, 48px)',
              textAlign: 'center',
              marginBottom: 'clamp(16px, 5vw, 32px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                width: 'clamp(70px, 20vw, 100px)',
                height: 'clamp(70px, 20vw, 100px)',
                backgroundColor: '#e0e7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto clamp(16px, 3vw, 24px)',
              }}
            >
              <DocumentTextIcon style={{ width: 'clamp(40px, 12vw, 60px)', height: 'clamp(40px, 12vw, 60px)', color: '#6366f1' }} />
            </div>
            <h1
              style={{
                fontSize: 'clamp(24px, 8vw, 36px)',
                fontWeight: '900',
                color: '#1e293b',
                margin: '0 0 12px 0',
              }}
            >
              Quote Request Submitted! ✅
            </h1>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', margin: 0 }}>
              Your quote has been sent to our catering team. They will review your menu selection and send you a detailed quote within 24 hours.
            </p>
          </div>

          {/* Quote Details */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: 'clamp(16px, 4vw, 32px)',
              marginBottom: 'clamp(16px, 5vw, 32px)',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Quote ID */}
            <div
              style={{
                backgroundColor: '#e0e7ff',
                border: '1px solid #c7d2fe',
                borderRadius: '12px',
                padding: 'clamp(12px, 3vw, 16px)',
                marginBottom: 'clamp(16px, 4vw, 24px)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '700', color: '#4338ca', margin: 0, marginBottom: '6px' }}>
                QUOTE ID
              </p>
              <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: '#1e293b', margin: 0, fontFamily: 'monospace' }}>
                {quoteData?.quoteId}
              </p>
            </div>

            {/* Event Details */}
            <div style={{ marginBottom: 'clamp(16px, 5vw, 32px)' }}>
              <h2 style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: '800', color: '#1e293b', margin: '0 0 clamp(12px, 3vw, 16px) 0' }}>
                📋 Event Details
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 'clamp(12px, 3vw, 16px)',
              }}>
                <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(12px, 3vw, 16px)', borderRadius: '12px' }}>
                  <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                    Event Date
                  </p>
                  <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    {quoteData?.eventDate}
                  </p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(12px, 3vw, 16px)', borderRadius: '12px' }}>
                  <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                    Event Type
                  </p>
                  <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    {quoteData?.eventType}
                  </p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(12px, 3vw, 16px)', borderRadius: '12px' }}>
                  <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                    Guests
                  </p>
                  <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    {quoteData?.guestCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Menu Items */}
            <div style={{ marginBottom: 'clamp(16px, 5vw, 32px)' }}>
              <h2 style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: '800', color: '#1e293b', margin: '0 0 clamp(12px, 3vw, 16px) 0' }}>
                🍽️ Menu Selection
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'clamp(10px, 2vw, 12px)',
              }}>
                {quoteData?.selectedMenuItems?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: 'clamp(10px, 2vw, 12px)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #6366f1',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>{item.image}</span>
                      <p style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        {item.name}
                      </p>
                    </div>
                    <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#64748b', margin: 0 }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div
              style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: 'clamp(12px, 3vw, 16px)',
              }}
            >
              <p style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', color: '#1e40af', margin: 0, fontWeight: '600' }}>
                ⏱️ What happens next?
              </p>
              <ul style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#1e40af', margin: '12px 0 0 0', paddingLeft: '20px' }}>
                <li>Our catering team reviews your menu selection</li>
                <li>You'll receive a detailed quote with pricing within 24 hours</li>
                <li>Once you approve the quote, you can proceed to payment</li>
                <li>Full payment is required to secure your booking</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                // Simulate catering review
                setTimeout(() => {
                  simulateCateringApproval();
                }, 2000);
              }}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Simulate Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Terms and Conditions Screen
  if (step === 'terms' && caterResponse) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px, 5vw, 40px)' }}>
            <button
              onClick={() => router.back()}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
              }}
            >
              <ArrowLeftIcon style={{ width: '16px', height: '16px', minWidth: '16px' }} />
            </button>
          </div>

          {/* Approved Quote Details */}
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', padding: 'clamp(14px, 3vw, 20px)', marginBottom: 'clamp(20px, 5vw, 32px)' }}>
            <h2 style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: '800', color: '#15803d', margin: '0 0 12px 0' }}>
              ✓ Your Quote Has Been Approved!
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(12px, 2vw, 16px)' }}>
              <div>
                <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#15803d', fontWeight: '600', margin: 0 }}>Total Price</p>
                <p style={{ fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: '900', color: '#1e293b', margin: '4px 0 0 0' }}>
                  ₹{caterResponse?.totalPrice?.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#15803d', fontWeight: '600', margin: 0 }}>Base Price</p>
                <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>
                  ₹{caterResponse?.breakdown?.basePrice?.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#15803d', fontWeight: '600', margin: 0 }}>Services</p>
                <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>
                  ₹{caterResponse?.breakdown?.servicesPrice?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(24px, 8vw, 40px)',
              fontWeight: '900',
              color: '#1e293b',
              margin: '0 0 12px 0',
            }}
          >
            📋 Terms & Conditions
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', margin: '0 0 clamp(20px, 5vw, 40px) 0' }}>
            Please review and accept our terms before proceeding with payment
          </p>

          {/* Terms Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 3vw, 24px)',
            marginBottom: 'clamp(24px, 5vw, 40px)',
          }}>
            {TERMS_AND_CONDITIONS.map((term, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: 'clamp(16px, 3vw, 20px)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>
                  {term.title}
                </h3>
                <p style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', lineHeight: '1.6', color: '#64748b', margin: 0 }}>
                  {term.description}
                </p>
              </div>
            ))}
          </div>

          {/* Acceptance Checkbox */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: 'clamp(16px, 3vw, 20px)',
              border: '1px solid #e2e8f0',
              marginBottom: 'clamp(20px, 4vw, 32px)',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{
                  marginTop: '4px',
                  cursor: 'pointer',
                  width: '20px',
                  height: '20px',
                  minWidth: '20px',
                }}
              />
              <div>
                <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0' }}>
                  I agree to the Terms & Conditions
                </p>
                <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#64748b', margin: 0 }}>
                  I understand the 100% refund policy in case of non-delivery and agree to all payment terms.
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Decline
            </button>
            <button
              onClick={handleAcceptTerms}
              disabled={!termsAccepted}
              style={{
                backgroundColor: termsAccepted ? '#6366f1' : '#cbd5e1',
                color: 'white',
                border: 'none',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: termsAccepted ? 'pointer' : 'not-allowed',
              }}
            >
              Accept & Pay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Screen
  if (step === 'payment' && caterResponse) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px, 5vw, 40px)' }}>
            <button
              onClick={() => setStep('terms')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
              }}
            >
              <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 8vw, 40px)', fontWeight: '900', color: '#1e293b', margin: '0 0 12px 0' }}>
            💳 Complete Payment
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', marginBottom: 'clamp(20px, 5vw, 40px)' }}>
            Your full payment is 100% refundable if we fail to deliver the service
          </p>

          {/* Payment Details */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: 'clamp(16px, 3vw, 24px)', marginBottom: 'clamp(20px, 5vw, 32px)', border: '1px solid #e2e8f0' }}>
            {/* Amount */}
            <div style={{ textAlign: 'center', paddingBottom: 'clamp(16px, 3vw, 24px)', borderBottom: '2px solid #e2e8f0', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
              <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#64748b', margin: 0, marginBottom: '8px', fontWeight: '600' }}>
                Total Amount to Pay
              </p>
              <p style={{ fontSize: 'clamp(36px, 10vw, 48px)', fontWeight: '900', color: '#6366f1', margin: 0 }}>
                ₹{caterResponse?.totalPrice?.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Refund Policy */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: 'clamp(12px, 2vw, 16px)', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
              <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#15803d', fontWeight: '700', margin: '0 0 8px 0' }}>
                ✓ 100% Refund Guarantee
              </p>
              <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#166534', margin: 0 }}>
                {caterResponse?.refundPolicy}
              </p>
            </div>

            {/* Payment Methods */}
            <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '800', color: '#1e293b', margin: '0 0 clamp(12px, 2vw, 16px) 0' }}>
              Select Payment Method
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'clamp(10px, 2vw, 12px)',
              marginBottom: 'clamp(16px, 3vw, 24px)',
            }}>
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'clamp(12px, 2vw, 16px)',
                    border: formData.selectedPaymentMethod === method.id
                      ? '2px solid #6366f1'
                      : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: formData.selectedPaymentMethod === method.id
                      ? '#e0e7ff'
                      : 'white',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.selectedPaymentMethod === method.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectedPaymentMethod: e.target.value }))}
                    style={{ marginRight: '12px', cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>{method.icon}</span>
                      <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        {method.name}
                      </p>
                    </div>
                    <p style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: '#64748b', margin: 0 }}>
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
            <button
              onClick={() => setStep('terms')}
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={handlePaymentSubmit}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final Confirmation Screen
  if (step === 'confirmation' && orderSummary) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: 'clamp(16px, 4vw, 32px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Status Header */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: 'clamp(24px, 5vw, 48px)',
              textAlign: 'center',
              marginBottom: 'clamp(16px, 5vw, 32px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                width: 'clamp(70px, 20vw, 100px)',
                height: 'clamp(70px, 20vw, 100px)',
                backgroundColor: orderStatus === 'success' ? '#dcfce7' : '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto clamp(16px, 3vw, 24px)',
              }}
            >
              {orderStatus === 'success' ? (
                <CheckCircleIcon style={{ width: 'clamp(40px, 12vw, 60px)', height: 'clamp(40px, 12vw, 60px)', color: '#22c55e' }} />
              ) : (
                <XMarkIcon style={{ width: 'clamp(40px, 12vw, 60px)', height: 'clamp(40px, 12vw, 60px)', color: '#dc2626' }} />
              )}
            </div>
            <h1
              style={{
                fontSize: 'clamp(24px, 8vw, 36px)',
                fontWeight: '900',
                color: '#1e293b',
                margin: '0 0 12px 0',
              }}
            >
              {orderStatus === 'success' ? 'Booking Confirmed! 🎉' : 'Payment Failed ❌'}
            </h1>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', margin: 0 }}>
              {orderStatus === 'success'
                ? 'Your catering booking has been confirmed. A confirmation email has been sent.'
                : 'Your payment could not be processed. Please try again.'}
            </p>
          </div>

          {/* Booking Details */}
          {orderStatus === 'success' && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: 'clamp(16px, 4vw, 32px)', marginBottom: 'clamp(16px, 5vw, 32px)', border: '1px solid #e2e8f0' }}>
              {/* Order ID */}
              <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', padding: 'clamp(12px, 3vw, 16px)', marginBottom: 'clamp(16px, 4vw, 24px)', textAlign: 'center' }}>
                <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '700', color: '#15803d', margin: 0, marginBottom: '6px' }}>
                  BOOKING CONFIRMED
                </p>
                <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: '#1e293b', margin: 0, fontFamily: 'monospace' }}>
                  {orderSummary?.orderId}
                </p>
              </div>

              {/* Payment Confirmation */}
              <div style={{ marginBottom: 'clamp(16px, 5vw, 32px)' }}>
                <h2 style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: '800', color: '#1e293b', margin: '0 0 clamp(12px, 3vw, 16px) 0' }}>
                  ✓ Payment Completed
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
                  <div style={{ backgroundColor: '#dcfce7', padding: 'clamp(12px, 3vw, 16px)', borderRadius: '12px' }}>
                    <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#15803d', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Amount Paid
                    </p>
                    <p style={{ fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                      ₹{orderSummary?.totalPrice?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f0fdf4', padding: 'clamp(12px, 3vw, 16px)', borderRadius: '12px' }}>
                    <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#15803d', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Refund Status
                    </p>
                    <p style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      100% Refundable
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: 'clamp(14px, 3vw, 20px)' }}>
                <h3 style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: '800', color: '#1e40af', margin: '0 0 12px 0' }}>
                  📌 What's Next?
                </h3>
                <ul style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', color: '#1e40af', margin: 0, paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Confirmation Email:</strong> Check your email for full booking details
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Refund Guarantee:</strong> Your payment is 100% refundable if we don't deliver
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Final Confirmation:</strong> We'll contact you 2 days before your event
                  </li>
                  <li>
                    <strong>24/7 Support:</strong> Reach out anytime with questions
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
            {orderStatus === 'success' && (
              <button
                onClick={() => {
                  handleLogout();
                  router.push('/bookings');
                }}
                style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: 'clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)',
                  borderRadius: '12px',
                  fontSize: 'clamp(13px, 2.5vw, 15px)',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                View My Bookings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Quote Form Screen
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: 'clamp(12px, 3vw, 16px) clamp(16px, 5vw, 32px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => router.back()}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
              }}
            >
              <ArrowLeftIcon style={{ width: '16px', height: '16px', minWidth: '16px' }} />
            </button>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)' }}>
        {/* Title */}
        <div style={{ marginBottom: 'clamp(20px, 5vw, 40px)' }}>
          <h1
            style={{
              fontSize: 'clamp(24px, 8vw, 40px)',
              fontWeight: '900',
              color: '#1e293b',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Get Your Custom Quote
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#64748b', margin: 0 }}>
            {serviceName && `for ${serviceName}`}
          </p>
        </div>

        {/* Form Container */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: 'clamp(16px, 3vw, 32px)',
            border: '1px solid #e2e8f0',
          }}
        >
          {mode === 'order' && !isLoggedIn && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '12px',
                padding: 'clamp(14px, 3vw, 20px)',
                marginBottom: 'clamp(16px, 4vw, 24px)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#92400e', fontWeight: '700', margin: '0 0 12px 0' }}>
                🔐 Please Login to Continue
              </p>
              <button
                onClick={handleLoginRedirect}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: 'clamp(10px, 2vw, 12px) clamp(14px, 3vw, 20px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Go to Sign In
              </button>
            </div>
          )}

          {mode === 'quote' || (mode === 'order' && isLoggedIn) ? (
            <form onSubmit={handleSubmitForm}>
              {/* Event Details */}
              <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
                <h2 style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: '800', color: '#1e293b', marginBottom: 'clamp(12px, 2vw, 16px)', marginTop: 0 }}>
                  Event Details
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(10px, 2vw, 16px)', marginBottom: 'clamp(10px, 2vw, 16px)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                      Guests *
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      placeholder="e.g., 50"
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Select type...</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Private Dinner">Private Dinner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
                <h2 style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: '800', color: '#1e293b', marginBottom: 'clamp(12px, 2vw, 16px)', marginTop: 0 }}>
                  Contact Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(10px, 2vw, 16px)', marginBottom: 'clamp(10px, 2vw, 16px)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      disabled={isLoggedIn}
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        backgroundColor: isLoggedIn ? '#f8fafc' : 'white',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone"
                      required
                      disabled={isLoggedIn}
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        backgroundColor: isLoggedIn ? '#f8fafc' : 'white',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoggedIn}
                    style={{
                      width: '100%',
                      padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: 'clamp(11px, 2.5vw, 13px)',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      backgroundColor: isLoggedIn ? '#f8fafc' : 'white',
                    }}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
                <label style={{ display: 'block', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  Special Requests or Dietary Requirements
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Tell us about any special requirements..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: 'clamp(11px, 2.5vw, 13px)',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(14px, 3vw, 20px)',
                  borderRadius: '12px',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6366f1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Next: Choose Menu →
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuotePage;