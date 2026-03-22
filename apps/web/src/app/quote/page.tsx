'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

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

const QuotePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('serviceId');
  const serviceName = searchParams.get('serviceName');
  const selectedItems = searchParams.get('selectedItems')?.split(',').filter(Boolean) || [];
  const fromLogin = searchParams.get('fromLogin') === 'true';

  const ENABLE_ORDERING = true;

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mode States
  const [mode, setMode] = useState<'quote' | 'order'>('quote');
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [submitted, setSubmitted] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'success' | 'failed'>('success');

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

  const [orderSummary, setOrderSummary] = useState<any>(null);

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
          
          // If coming from login, switch to order mode
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
    // Store current quote state in sessionStorage for retrieval after login
    sessionStorage.setItem('quoteParams', JSON.stringify({
      serviceId,
      serviceName,
      selectedItems,
    }));

    // Redirect to login with returnUrl that includes fromLogin flag
    const returnUrl = `/quote?fromLogin=true&serviceId=${serviceId}&serviceName=${encodeURIComponent(serviceName || '')}&selectedItems=${selectedItems.join(',')}`;
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

  const calculateOrderTotal = () => {
    const servicesTotal = formData.selectedServices.reduce((total, id) => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === id);
      return total + (service?.price || 0);
    }, 0);
    return servicesTotal + (parseInt(formData.guestCount || '0') * 500);
  };

  const getAddressDisplay = () => {
    if (formData.useExistingAddress && currentUser?.addresses) {
      const addr = currentUser.addresses.find((a: any) => a.id === formData.selectedAddressId);
      return addr || { address: formData.address, city: formData.city, zipCode: formData.zipCode };
    }
    return { address: formData.address, city: formData.city, zipCode: formData.zipCode };
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'quote') {
      console.log('Quote Request:', { ...formData, serviceId, serviceName, selectedItems });
      setSubmitted(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      // Move to payment step for orders
      setStep('payment');
    }
  };

  const handlePaymentSubmit = () => {
    if (!formData.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Simulate payment processing (randomly success or fail for demo)
    const isSuccess = Math.random() > 0.3;

    const orderData = {
      ...formData,
      serviceId,
      serviceName,
      selectedItems,
      selectedServices: formData.selectedServices.map(id =>
        ADDITIONAL_SERVICES.find(s => s.id === id)
      ),
      total: calculateOrderTotal(),
      orderId: `ORD-${Date.now()}`,
      paymentMethod: PAYMENT_METHODS.find(m => m.id === formData.selectedPaymentMethod)?.name,
      orderDate: new Date().toLocaleDateString('en-IN'),
      status: isSuccess ? 'success' : 'failed',
    };

    console.log('Order Submission:', orderData);
    setOrderSummary(orderData);
    setOrderStatus(isSuccess ? 'success' : 'failed');
    setStep('confirmation');
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Order Confirmation Screen
  if (step === 'confirmation') {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Status Header */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              marginBottom: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: orderStatus === 'success' ? '#dcfce7' : '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              {orderStatus === 'success' ? (
                <CheckCircleIcon style={{ width: '60px', height: '60px', color: '#22c55e' }} />
              ) : (
                <XMarkIcon style={{ width: '60px', height: '60px', color: '#dc2626' }} />
              )}
            </div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#1e293b',
                margin: '0 0 12px 0',
              }}
            >
              {orderStatus === 'success' ? 'Order Confirmed! 🎉' : 'Payment Failed ❌'}
            </h1>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
              {orderStatus === 'success'
                ? 'Your catering order has been successfully placed.'
                : 'Your payment could not be processed. Please try again.'}
            </p>
          </div>

          {/* Order Details */}
          {orderStatus === 'success' && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid #e2e8f0',
              }}
            >
              {/* Order ID */}
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', margin: 0, marginBottom: '6px' }}>
                  ORDER ID
                </p>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0, fontFamily: 'monospace' }}>
                  {orderSummary?.orderId}
                </p>
              </div>

              {/* Event Details */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>
                  📋 Event Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Service
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.serviceName}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Event Type
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.eventType}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Date & Time
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.eventDate} at {orderSummary?.eventTime}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Guests
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.guestCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>
                  📍 Delivery Address
                </h2>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #f59e0b',
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {getAddressDisplay().address}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0 0 0' }}>
                    {getAddressDisplay().city}, {getAddressDisplay().zipCode}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>
                  👤 Contact Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Name
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.fullName}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Phone
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.phone}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', gridColumn: '1 / -1' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>
                      Email
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {orderSummary?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>
                  💳 Payment Method
                </h2>
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {orderSummary?.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              {orderSummary?.selectedItems?.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>
                    🍽️ Menu Items
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {orderSummary?.selectedItems?.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                        }}
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Services */}
              {orderSummary?.selectedServices?.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>
                    ⭐ Additional Services
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {orderSummary?.selectedServices?.map((service: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#f8fafc',
                          padding: '12px',
                          borderRadius: '8px',
                          borderLeft: '4px solid #22c55e',
                        }}
                      >
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                          {service.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                          ₹{service.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>
                    Base Catering ({orderSummary?.guestCount} guests × ₹500)
                  </span>
                  <span style={{ fontWeight: '700', color: '#1e293b' }}>
                    ₹{(parseInt(orderSummary?.guestCount || '0') * 500).toLocaleString('en-IN')}
                  </span>
                </div>
                {orderSummary?.selectedServices?.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b', fontWeight: '600' }}>
                      Additional Services
                    </span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>
                      ₹
                      {orderSummary?.selectedServices
                        ?.reduce((total: number, s: any) => total + (s?.price || 0), 0)
                        .toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    borderTop: '2px solid #e2e8f0',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: '900',
                  }}
                >
                  <span style={{ color: '#1e293b' }}>Total Amount</span>
                  <span style={{ color: '#22c55e' }}>
                    ₹{orderSummary?.total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Failure Message */}
          {orderStatus === 'failed' && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                  Unfortunately, your payment could not be processed. This might be due to:
                </p>
                <ul style={{ fontSize: '14px', color: '#64748b', margin: '16px 0 0 0', paddingLeft: '20px' }}>
                  <li>Insufficient funds</li>
                  <li>Network connectivity issues</li>
                  <li>Invalid payment details</li>
                </ul>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  onClick={() => setStep('payment')}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d97706';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                  }}
                >
                  Try Another Payment
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setStep('form');
                  }}
                  style={{
                    backgroundColor: 'white',
                    color: '#1e293b',
                    border: '2px solid #e2e8f0',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  Go Home
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {orderStatus === 'success' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #e2e8f0',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setStep('form');
                }}
                style={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#22c55e';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Payment Selection Screen
  if (step === 'payment') {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 32px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            <button
              onClick={() => setStep('form')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
              Back
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                color: '#64748b',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '40px',
              fontWeight: '900',
              color: '#1e293b',
              margin: '0 0 8px 0',
              marginBottom: '48px',
            }}
          >
            Select Payment Method
          </h1>

          {/* Order Summary Card */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}
          >
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', margin: 0 }}>
                Order Total
              </p>
              <p style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b', margin: '8px 0 0 0' }}>
                ₹{calculateOrderTotal().toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', margin: 0 }}>
                Delivery
              </p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: '8px 0 0 0' }}>
                {formData.eventDate} at {formData.eventTime}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid #e2e8f0',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0' }}>
              💳 Choose Payment Method
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    border: formData.selectedPaymentMethod === method.id
                      ? '2px solid #f59e0b'
                      : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: formData.selectedPaymentMethod === method.id
                      ? '#fffbeb'
                      : 'white',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (formData.selectedPaymentMethod !== method.id) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.selectedPaymentMethod !== method.id) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.selectedPaymentMethod === method.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectedPaymentMethod: e.target.value }))}
                    style={{
                      marginRight: '16px',
                      cursor: 'pointer',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>{method.icon}</span>
                      <p style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                        {method.name}
                      </p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                onClick={() => setStep('form')}
                style={{
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #e2e8f0',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Back to Order Form
              </button>
              <button
                onClick={handlePaymentSubmit}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Screen
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 32px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => router.back()}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
              Back
            </button>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Sign Out ({currentUser?.fullName || currentUser?.name})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Mode Toggle */}
        {ENABLE_ORDERING && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '48px',
              backgroundColor: 'white',
              padding: '8px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              width: 'fit-content',
            }}
          >
            <button
              onClick={() => {
                setMode('quote');
                setSubmitted(false);
              }}
              style={{
                backgroundColor: mode === 'quote' ? '#f59e0b' : 'transparent',
                color: mode === 'quote' ? 'white' : '#64748b',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <DocumentTextIcon style={{ width: '16px', height: '16px' }} />
              Get Quote
            </button>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  handleLoginRedirect();
                } else {
                  setMode('order');
                  setSubmitted(false);
                }
              }}
              style={{
                backgroundColor: mode === 'order' ? '#f59e0b' : 'transparent',
                color: mode === 'order' ? 'white' : '#64748b',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShoppingCartIcon style={{ width: '16px', height: '16px' }} />
              Order Now
            </button>
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: '900',
              color: '#1e293b',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}
          >
            {mode === 'quote' ? 'Get Your Custom Quote' : 'Place Your Order'}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            {serviceName && `for ${serviceName}`}
          </p>
        </div>

        {/* Form Container */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            marginBottom: '48px',
          }}
        >
          {/* Login Required Message */}
          {mode === 'order' && !isLoggedIn && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '16px', color: '#92400e', fontWeight: '700', margin: '0 0 12px 0' }}>
                🔐 Please Login to Continue
              </p>
              <p style={{ fontSize: '14px', color: '#b45309', margin: 0 }}>
                You need to sign in to your account to place an order.
              </p>
              <button
                onClick={handleLoginRedirect}
                style={{
                  marginTop: '16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                }}
              >
                Go to Sign In
              </button>
            </div>
          )}

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '32px',
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#92400e', margin: '0 0 12px 0' }}>
                📋 Selected Items from Menu:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedItems.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Show form only if quote mode or user is logged in for order mode */}
          {mode === 'quote' || (mode === 'order' && isLoggedIn) ? (
            <form onSubmit={handleSubmitForm}>
              {/* ...rest of the form remains the same... */}
              {/* Event Details */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>
                  Event Details
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
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
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                      {mode === 'order' ? 'Event Time *' : 'Event Time'}
                    </label>
                    <input
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      required={mode === 'order'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                      Number of Guests *
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
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Select an event type...</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate">Corporate Event</option>
                      <option value="Birthday">Birthday Party</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Private Dinner">Private Dinner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address - Only for Orders */}
              {mode === 'order' && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>
                    📍 Delivery Address
                  </h2>

                  {currentUser?.addresses?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: formData.useExistingAddress ? '#fffbeb' : 'white',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.useExistingAddress}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              useExistingAddress: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '12px', cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>
                          Use saved address from my profile
                        </span>
                      </label>
                    </div>
                  )}

                  {formData.useExistingAddress && currentUser?.addresses?.length > 0 ? (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                        Select Address *
                      </label>
                      <select
                        value={formData.selectedAddressId}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            selectedAddressId: e.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      >
                        {currentUser.addresses.map((addr: any) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.label} - {addr.address}, {addr.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your street address"
                          required={mode === 'order' && !formData.useExistingAddress}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            required={mode === 'order' && !formData.useExistingAddress}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontFamily: 'inherit',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="ZIP"
                            required={mode === 'order' && !formData.useExistingAddress}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontFamily: 'inherit',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Contact Information */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>
                  Contact Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
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
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        backgroundColor: isLoggedIn ? '#f8fafc' : 'white',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                      Phone Number *
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
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        backgroundColor: isLoggedIn ? '#f8fafc' : 'white',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                    Email Address *
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
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      backgroundColor: isLoggedIn ? '#f8fafc' : 'white',
                    }}
                  />
                </div>
              </div>

              {/* Additional Services - Only for Orders */}
              {mode === 'order' && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>
                    ⭐ Additional Services
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {ADDITIONAL_SERVICES.map(service => (
                      <label
                        key={service.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          padding: '16px',
                          border: formData.selectedServices.includes(service.id)
                            ? '2px solid #f59e0b'
                            : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          backgroundColor: formData.selectedServices.includes(service.id)
                            ? '#fffbeb'
                            : 'white',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!formData.selectedServices.includes(service.id)) {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!formData.selectedServices.includes(service.id)) {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          style={{
                            marginRight: '12px',
                            marginTop: '2px',
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                          }}
                        />
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                            {service.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            {service.description}
                          </p>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b', margin: '6px 0 0 0' }}>
                            ₹{service.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>
                  {mode === 'order' ? '📝 Special Requests' : 'Budget & Special Requests'}
                </h2>

                {mode === 'quote' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                      Estimated Budget (Optional)
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹1,00,000"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                    Special Requests or Dietary Requirements
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Tell us about any special requirements, dietary restrictions, or preferences..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>

              {/* Order Summary - Only for Orders */}
              {mode === 'order' && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '32px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                      Base Catering ({formData.guestCount} guests × ₹500)
                    </span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>
                      ₹{(parseInt(formData.guestCount || '0') * 500).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {formData.selectedServices.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                        Additional Services ({formData.selectedServices.length})
                      </span>
                      <span style={{ fontWeight: '700', color: '#1e293b' }}>
                        ₹
                        {formData.selectedServices
                          .reduce((total, id) => {
                            const service = ADDITIONAL_SERVICES.find(s => s.id === id);
                            return total + (service?.price || 0);
                          }, 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      borderTop: '2px solid #e2e8f0',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '16px',
                      fontWeight: '900',
                    }}
                  >
                    <span style={{ color: '#1e293b' }}>Total Amount</span>
                    <span style={{ color: '#f59e0b' }}>
                      ₹{calculateOrderTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {mode === 'quote' ? 'Submit Quote Request' : 'Proceed to Payment'}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuotePage;