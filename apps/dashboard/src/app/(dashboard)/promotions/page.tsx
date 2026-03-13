'use client';

import React, { useState } from 'react';

interface Discount {
  id: number;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicableTo: 'all' | 'menu' | 'category';
  menuIds?: number[];
  categories?: string[];
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired';
  usageCount: number;
  maxUsage?: number;
  isStackable: boolean;
}

interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'freeitem';
  discountValue: number;
  freeItem?: string;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableTo: 'all' | 'specific';
  applicableMenus?: number[];
  validFrom: string;
  validTo: string;
  maxRedemptions: number;
  redemptionCount: number;
  usedBy: string[];
  status: 'active' | 'draft' | 'expired' | 'paused' | 'scheduled';
  createdAt: string;
  estimatedRevenue: number;
}

interface FeaturedMenu {
  id: number;
  menuId: number;
  menuName: string;
  menuImage: string;
  description: string;
  originalPrice: number;
  promotionalPrice: number;
  discount: number;
  servings: number;
  highlights: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired';
  views: number;
  clicks: number;
  orders: number;
  revenue: number;
  position: 'banner' | 'sidebar' | 'homepage';
  priority: number;
}

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<'discounts' | 'coupons' | 'featured' | 'analytics'>('discounts');
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: 1,
      name: 'Spring Wedding Season',
      description: '15% off all wedding packages',
      type: 'percentage',
      value: 15,
      applicableTo: 'category',
      categories: ['Wedding'],
      minOrderValue: 500,
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      status: 'active',
      usageCount: 42,
      maxUsage: 100,
      isStackable: false,
    },
    {
      id: 2,
      name: 'Corporate Bulk Order',
      description: '$100 off orders over $1000',
      type: 'fixed',
      value: 100,
      applicableTo: 'all',
      minOrderValue: 1000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'active',
      usageCount: 28,
      isStackable: false,
    },
    {
      id: 3,
      name: 'Summer BBQ Special',
      description: '20% off BBQ menus',
      type: 'percentage',
      value: 20,
      applicableTo: 'category',
      categories: ['BBQ', 'Casual'],
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      status: 'scheduled',
      usageCount: 0,
      isStackable: true,
    },
    {
      id: 4,
      name: 'Birthday Party Bundle',
      description: '$50 off birthday packages',
      type: 'fixed',
      value: 50,
      applicableTo: 'category',
      categories: ['Birthday'],
      minOrderValue: 300,
      startDate: '2026-03-15',
      endDate: '2026-12-15',
      status: 'active',
      usageCount: 67,
      maxUsage: 150,
      isStackable: false,
    },
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      code: 'WELCOME20',
      description: '20% off first order',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 100,
      applicableTo: 'all',
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      maxRedemptions: 500,
      redemptionCount: 312,
      usedBy: ['customer1', 'customer2', 'customer3'],
      status: 'active',
      createdAt: '2026-01-01',
      estimatedRevenue: 12480,
    },
    {
      id: 2,
      code: 'SUMMER50',
      description: '$50 off orders over $300',
      discountType: 'fixed',
      discountValue: 50,
      minOrderValue: 300,
      applicableTo: 'all',
      validFrom: '2026-06-01',
      validTo: '2026-08-31',
      maxRedemptions: 200,
      redemptionCount: 0,
      usedBy: [],
      status: 'scheduled',
      createdAt: '2026-05-15',
      estimatedRevenue: 0,
    },
    {
      id: 3,
      code: 'FREESALAD',
      description: 'Free garden salad with order',
      discountType: 'freeitem',
      discountValue: 25,
      freeItem: 'Garden Salad',
      applicableTo: 'specific',
      applicableMenus: [1, 2, 3],
      validFrom: '2026-03-01',
      validTo: '2026-03-31',
      maxRedemptions: 150,
      redemptionCount: 89,
      usedBy: [],
      status: 'active',
      createdAt: '2026-02-20',
      estimatedRevenue: 2225,
    },
    {
      id: 4,
      code: 'LOYALTY15',
      description: '15% off for returning customers',
      discountType: 'percentage',
      discountValue: 15,
      applicableTo: 'all',
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      maxRedemptions: 1000,
      redemptionCount: 156,
      usedBy: [],
      status: 'active',
      createdAt: '2026-01-15',
      estimatedRevenue: 4680,
    },
  ]);

  const [featuredMenus, setFeaturedMenus] = useState<FeaturedMenu[]>([
    {
      id: 1,
      menuId: 101,
      menuName: 'Premium Wedding Buffet',
      menuImage: '🍽️',
      description: 'Elegant 5-course wedding menu with premium selections',
      originalPrice: 95,
      promotionalPrice: 80,
      discount: 15,
      servings: 100,
      highlights: ['5-course menu', 'Premium proteins', 'Custom dessert', 'Premium beverages'],
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      status: 'active',
      views: 2543,
      clicks: 342,
      orders: 28,
      revenue: 2240,
      position: 'banner',
      priority: 1,
    },
    {
      id: 2,
      menuId: 102,
      menuName: 'Corporate Lunch Box',
      menuImage: '📦',
      description: 'Quick, professional lunch boxes perfect for business events',
      originalPrice: 18,
      promotionalPrice: 15,
      discount: 16,
      servings: 50,
      highlights: ['Sandwich options', 'Fresh sides', 'Beverages included'],
      startDate: '2026-03-10',
      endDate: '2026-06-30',
      status: 'active',
      views: 1892,
      clicks: 421,
      orders: 156,
      revenue: 2340,
      position: 'homepage',
      priority: 2,
    },
    {
      id: 3,
      menuId: 103,
      menuName: 'Summer BBQ Party',
      menuImage: '🔥',
      description: 'Classic BBQ menu with all the fixings',
      originalPrice: 28,
      promotionalPrice: 22,
      discount: 21,
      servings: 50,
      highlights: ['BBQ ribs', 'Grilled chicken', 'Sides', 'Dessert'],
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      status: 'scheduled',
      views: 342,
      clicks: 45,
      orders: 0,
      revenue: 0,
      position: 'sidebar',
      priority: 3,
    },
    {
      id: 4,
      menuId: 104,
      menuName: 'Birthday Celebration Package',
      menuImage: '🎂',
      description: 'Fun and festive menu perfect for birthday celebrations',
      originalPrice: 35,
      promotionalPrice: 28,
      discount: 20,
      servings: 50,
      highlights: ['Custom cake', 'Party snacks', 'Decorations', 'Setup included'],
      startDate: '2026-03-15',
      endDate: '2026-12-31',
      status: 'active',
      views: 1234,
      clicks: 234,
      orders: 67,
      revenue: 1876,
      position: 'homepage',
      priority: 2,
    },
  ]);

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'scheduled':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'expired':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'draft':
        return { bg: '#e0e7ff', text: '#3730a3' };
      case 'paused':
        return { bg: '#f3f4f6', text: '#4b5563' };
      default:
        return { bg: '#f3f4f6', text: '#1f2937' };
    }
  };

  // Calculate promotion metrics
  const promotionMetrics = {
    totalDiscounts: discounts.filter((d) => d.status === 'active').length,
    activeCoupons: coupons.filter((c) => c.status === 'active').length,
    featuredMenusActive: featuredMenus.filter((m) => m.status === 'active').length,
    totalRevenue: coupons.reduce((sum, c) => sum + c.estimatedRevenue, 0) + featuredMenus.reduce((sum, m) => sum + m.revenue, 0),
    totalRedemptions: coupons.reduce((sum, c) => sum + c.redemptionCount, 0),
    totalFeaturedOrders: featuredMenus.reduce((sum, m) => sum + m.orders, 0),
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
          🎯 Promotions & Offers
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
          Manage discounts, coupons, and featured menus to attract customers
        </p>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Active Discounts', value: promotionMetrics.totalDiscounts, color: '#667eea', icon: '🏷️' },
          { label: 'Active Coupons', value: promotionMetrics.activeCoupons, color: '#10b981', icon: '🎟️' },
          { label: 'Featured Menus', value: promotionMetrics.featuredMenusActive, color: '#f59e0b', icon: '⭐' },
          { label: 'Total Revenue', value: `$${(promotionMetrics.totalRevenue / 1000).toFixed(1)}k`, color: '#8b5cf6', icon: '💰' },
        ].map((metric, idx) => (
          <div key={idx} style={{ ...cardStyle, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  {metric.label}
                </p>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.75rem', fontWeight: 'bold', color: metric.color }}>
                  {metric.value}
                </p>
              </div>
              <span style={{ fontSize: '2rem' }}>{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
        {(['discounts', 'coupons', 'featured', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              color: activeTab === tab ? '#667eea' : '#6b7280',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = '#1f2937';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            {tab === 'discounts' && '🏷️ Discounts'}
            {tab === 'coupons' && '🎟️ Coupons'}
            {tab === 'featured' && '⭐ Featured Menus'}
            {tab === 'analytics' && '📊 Analytics'}
          </button>
        ))}
      </div>

      {/* Discounts Tab */}
      {activeTab === 'discounts' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowDiscountModal(true);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
            >
              + Create New Discount
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {discounts.map((discount) => {
              const statusColor = getStatusColor(discount.status);
              const usage = discount.maxUsage ? `${discount.usageCount}/${discount.maxUsage}` : `${discount.usageCount} used`;

              return (
                <div key={discount.id} style={{ ...cardStyle, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
                        {discount.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {discount.description}
                      </p>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {discount.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                        DISCOUNT VALUE
                      </p>
                      <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                        {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                        APPLIES TO
                      </p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                        {discount.applicableTo === 'all' ? 'All Orders' : discount.applicableTo === 'category' ? 'Specific Categories' : 'Specific Menus'}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                        USAGE
                      </p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                        {usage}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                        VALID PERIOD
                      </p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                        {discount.startDate} - {discount.endDate}
                      </p>
                    </div>
                  </div>

                  {discount.minOrderValue && (
                    <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                        ℹ️ Minimum order value: <strong>${discount.minOrderValue}</strong>
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setSelectedItem(discount);
                        setShowDiscountModal(true);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dbeafe',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#0c4a6e',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#fee2e2',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#991b1b',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowCouponModal(true);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              + Create New Coupon
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {coupons.map((coupon) => {
              const statusColor = getStatusColor(coupon.status);
              const conversionRate = coupon.redemptionCount > 0 ? ((coupon.redemptionCount / (coupon.maxRedemptions * 0.5)) * 100).toFixed(1) : '0';

              return (
                <div key={coupon.id} style={{ ...cardStyle, padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div style={{ backgroundColor: '#f3f4f6', padding: '0.75rem 1.25rem', borderRadius: '0.375rem', border: '2px dashed #d1d5db' }}>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                          {coupon.code}
                        </p>
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {coupon.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                      {coupon.description}
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                          DISCOUNT
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : coupon.discountType === 'fixed'
                              ? `$${coupon.discountValue}`
                              : `Free ${coupon.freeItem}`}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                          REDEEMED
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#667eea' }}>
                          {coupon.redemptionCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                        VALID FROM
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#1f2937' }}>
                        {new Date(coupon.validFrom).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                        EXPIRES
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#1f2937' }}>
                        {new Date(coupon.validTo).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setSelectedItem(coupon);
                        setShowCouponModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dbeafe',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#0c4a6e',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        backgroundColor: '#fee2e2',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#991b1b',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Menus Tab */}
      {activeTab === 'featured' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowFeaturedModal(true);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d97706')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f59e0b')}
            >
              + Feature a Menu
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {featuredMenus.map((menu) => {
              const statusColor = getStatusColor(menu.status);
              const roi = ((menu.revenue / (menu.originalPrice * menu.orders)) * 100).toFixed(0);

              return (
                <div key={menu.id} style={{ ...cardStyle, overflow: 'hidden' }}>
                  {/* Image Section */}
                  <div
                    style={{
                      backgroundColor: '#f9fafb',
                      padding: '2rem',
                      textAlign: 'center',
                      fontSize: '3rem',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {menu.menuImage}
                  </div>

                  {/* Content Section */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {menu.menuName}
                        </h3>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.375rem',
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                          }}
                        >
                          {menu.status}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
                        {menu.description}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div
                      style={{
                        backgroundColor: '#f9fafb',
                        padding: '1rem',
                        borderRadius: '0.375rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', textDecoration: 'line-through' }}>
                          ${menu.originalPrice}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                          ${menu.promotionalPrice}
                        </span>
                        <span
                          style={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          Save {menu.discount}%
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                        Per serving for {menu.servings} guests
                      </p>
                    </div>

                    {/* Highlights */}
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                        HIGHLIGHTS
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {menu.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-block',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              borderRadius: '0.25rem',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                            }}
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280', fontWeight: '500' }}>
                            VIEWS
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>
                            {menu.views}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280', fontWeight: '500' }}>
                            ORDERS
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 'bold', color: '#10b981' }}>
                            {menu.orders}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280', fontWeight: '500' }}>
                            REVENUE
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 'bold', color: '#667eea' }}>
                            ${menu.revenue}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280', fontWeight: '500' }}>
                            CTR
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 'bold', color: '#f59e0b' }}>
                            {((menu.clicks / menu.views) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
                      📅 {new Date(menu.startDate).toLocaleDateString()} - {new Date(menu.endDate).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedItem(menu);
                          setShowFeaturedModal(true);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dbeafe',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#0c4a6e',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fee2e2',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#991b1b',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Performance Overview */}
          <div style={{ ...cardStyle, padding: '1.5rem', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
              📊 Performance Overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    Promotion Effectiveness
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    78%
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#10b981',
                      width: '78%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    Coupon Redemption Rate
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    62%
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#667eea',
                      width: '62%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    Featured Menu Click Rate
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    14%
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#f59e0b',
                      width: '14%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Items */}
          <div style={{ ...cardStyle, padding: '1.5rem', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
              🏆 Top Performing
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  WELCOME20
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  312 redemptions • $12,480 revenue
                </p>
              </div>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  Corporate Lunch Box
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  156 orders • $2,340 revenue
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  Premium Wedding Buffet
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  28 orders • $2,240 revenue
                </p>
              </div>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div style={{ ...cardStyle, padding: '1.5rem', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
              💡 Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#065f46', fontWeight: '600' }}>
                  ✓ Coupon WELCOME20 performing well
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#047857' }}>
                  Consider extending validity
                </p>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.375rem', border: '1px solid #fcd34d' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e', fontWeight: '600' }}>
                  📈 Featured menus have low CTR
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#78350f' }}>
                  Try different placement or design
                </p>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '0.375rem', border: '1px solid #93c5fd' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#0c4a6e', fontWeight: '600' }}>
                  🎯 Create summer promotions
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#075985' }}>
                  Peak season is approaching
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}