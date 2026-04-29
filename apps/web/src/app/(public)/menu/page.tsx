'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  StarIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock menu data
const MENU_DATA: Record<number, any> = {
  1: {
    appetizers: [
      { name: 'Bruschetta Trio', description: 'Tomato, Garlic & Basil', price: '₹299' },
      { name: 'Shrimp Skewers', description: 'Grilled with herbs', price: '₹399' },
      { name: 'Cheese Platter', description: 'Assorted premium cheeses', price: '₹349' },
    ],
    mains: [
      { name: 'Pan-Seared Salmon', description: 'With lemon butter sauce', price: '₹799' },
      { name: 'Filet Mignon', description: 'Aged beef with truffle oil', price: '₹1,099' },
      { name: 'Vegetable Wellington', description: 'With mushroom duxelles', price: '₹699' },
    ],
    desserts: [
      { name: 'Chocolate Lava Cake', description: 'With vanilla ice cream', price: '₹399' },
      { name: 'Tiramisu', description: 'Traditional Italian style', price: '₹349' },
      { name: 'Fruit Tart', description: 'Fresh seasonal fruits', price: '₹299' },
    ],
  },
  2: {
    appetizers: [
      { name: 'Calamari Fritti', description: 'Crispy squid with aioli', price: '₹399' },
      { name: 'Caprese Salad', description: 'Tomato, mozzarella & basil', price: '₹299' },
      { name: 'Garlic Bread', description: 'Toasted with olive oil', price: '₹199' },
    ],
    mains: [
      { name: 'Pasta Carbonara', description: 'Classic Roman style', price: '₹599' },
      { name: 'Risotto ai Funghi', description: 'Mushroom risotto', price: '₹699' },
      { name: 'Branzino al Forno', description: 'Baked sea bass', price: '₹899' },
    ],
    desserts: [
      { name: 'Panna Cotta', description: 'Vanilla with berry sauce', price: '₹349' },
      { name: 'Gelato Assortment', description: 'Three flavors', price: '₹299' },
      { name: 'Zabaglione', description: 'Traditional custard', price: '₹299' },
    ],
  },
  3: {
    appetizers: [
      { name: 'Samosa', description: 'Vegetable or chicken', price: '₹149' },
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese', price: '₹299' },
      { name: 'Pakora', description: 'Mixed vegetable fritters', price: '₹199' },
    ],
    mains: [
      { name: 'Butter Chicken', description: 'Creamy tomato sauce', price: '₹499' },
      { name: 'Biryani', description: 'Fragrant basmati rice', price: '₹399' },
      { name: 'Paneer Masala', description: 'Cottage cheese curry', price: '₹349' },
    ],
    desserts: [
      { name: 'Gulab Jamun', description: 'Milk solids in syrup', price: '₹149' },
      { name: 'Kheer', description: 'Rice pudding with nuts', price: '₹129' },
      { name: 'Jalebi', description: 'Sweet spiral pastry', price: '₹99' },
    ],
  },
};

const MenuPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = parseInt(searchParams.get('serviceId') || '0');
  const serviceName = searchParams.get('serviceName') || 'Catering Service';
  const [cart, setCart] = useState<string[]>([]);

  const menu = MENU_DATA[serviceId] || MENU_DATA[1];

  const handleAddToCart = (itemName: string) => {
    setCart([...cart, itemName]);
  };

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
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

            <div
              style={{
                position: 'relative',
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
              }}
            >
              <ShoppingCartIcon style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '6px' }} />
              Cart ({cart.length})
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
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
            {serviceName}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            Explore our carefully curated menu
          </p>
        </div>

        {/* Menu Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
          {/* Appetizers */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '24px',
                marginTop: 0,
              }}
            >
              🥗 Appetizers
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {menu.appetizers?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b' }}>
                      {item.price}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                    {item.description}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item.name)}
                    style={{
                      width: '100%',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
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
                    Add to Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mains */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '24px',
                marginTop: 0,
              }}
            >
              🍽️ Main Courses
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {menu.mains?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b' }}>
                      {item.price}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                    {item.description}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item.name)}
                    style={{
                      width: '100%',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
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
                    Add to Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '24px',
                marginTop: 0,
              }}
            >
              🍰 Desserts
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {menu.desserts?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b' }}>
                      {item.price}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                    {item.description}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item.name)}
                    style={{
                      width: '100%',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
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
                    Add to Quote
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <button
            onClick={() => router.push(`/quote?serviceId=${serviceId}&selectedItems=${cart.join(',')}`)}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '16px 48px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
              display: 'inline-block',
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
            Proceed to Get Quote ({cart.length} items)
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;