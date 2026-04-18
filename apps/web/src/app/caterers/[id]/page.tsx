'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  StarIcon,
  MapPinIcon,
  HeartIcon,
  ShareIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  XMarkIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { QuoteModal } from '../components/QuoteModal';

// Mock data
const ALL_CATERING_SERVICES = [
  {
    id: 1,
    title: 'Premium Multi-Cuisine Catering',
    location: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&h=600&fit=crop',
    rating: 4.9,
    reviews: 528,
    pricePerPerson: 550,
    priceRange: '₹500 - ₹700/plate',
    minGuests: 50,
    maxGuests: 500,
    cuisine: ['Multi-Cuisine', 'Indian', 'Continental'],
    serviceType: ['Full Service', 'Delivery', 'Buffet'],
    description: 'Transform your event with exquisite culinary excellence. Our team of experienced chefs creates customized menus using premium ingredients.',
    highlights: [
      { icon: '👨‍🍳', text: 'Experienced Chefs' },
      { icon: '📋', text: 'Customizable Menus' },
      { icon: '✨', text: 'Premium Ingredients' },
      { icon: '⏰', text: 'On-Time Delivery' },
      { icon: '✅', text: 'Hygienic Preparation' },
      { icon: '🌱', text: 'Veg & Non-Veg Options' },
    ],
    included: [
      'Menu Planning & Customization',
      'Setup & Table Arrangements',
      'Professional Staff Service',
      'Equipment & Utensils',
      'Cleanup & Disposal',
      'Beverage Service',
    ],
    occasions: ['Weddings', 'Birthdays', 'Corporate Events', 'House Parties', 'Anniversaries'],
    menu: {
      starters: [
        { name: 'Paneer Tikka', desc: 'Grilled cottage cheese with Indian spices', type: 'veg', price: '₹120' },
        { name: 'Chicken Lollipop', desc: 'Crispy fried chicken appetizer', type: 'non-veg', price: '₹150' },
        { name: 'Spring Rolls', desc: 'Vegetable-filled golden rolls', type: 'veg', price: '₹100' },
        { name: 'Fish Pakora', desc: 'Deep-fried fish with gram flour batter', type: 'non-veg', price: '₹160' },
        { name: 'Tandoori Mushroom', desc: 'Marinated & grilled mushrooms', type: 'veg', price: '₹130' },
        { name: 'Shrimp Tempura', desc: 'Battered & fried shrimp', type: 'non-veg', price: '₹180' },
      ],
      mains: [
        { name: 'Butter Chicken', desc: 'Creamy tomato-based chicken curry', type: 'non-veg', price: '₹280' },
        { name: 'Paneer Butter Masala', desc: 'Rich cottage cheese in tomato gravy', type: 'veg', price: '₹240' },
        { name: 'Biryani', desc: 'Fragrant rice with meat or vegetables', type: 'both', price: '₹320' },
        { name: 'Dal Makhani', desc: 'Creamy lentil preparation', type: 'veg', price: '₹200' },
        { name: 'Rogan Josh', desc: 'Aromatic meat curry with spices', type: 'non-veg', price: '₹300' },
        { name: 'Chole Bhature', desc: 'Fried bread with chickpea curry', type: 'veg', price: '₹180' },
      ],
      desserts: [
        { name: 'Gulab Jamun', desc: 'Milk solids in sugar syrup', type: 'veg', price: '₹60' },
        { name: 'Kheer', desc: 'Rice pudding with nuts', type: 'veg', price: '₹80' },
        { name: 'Ice Cream', desc: 'Various flavors available', type: 'veg', price: '₹100' },
        { name: 'Rasmalai', desc: 'Soft cheese discs in sweet cream', type: 'veg', price: '₹90' },
      ],
      beverages: [
        { name: 'Mango Lassi', desc: 'Yogurt-based mango drink', type: 'veg', price: '₹80' },
        { name: 'Fresh Lemonade', desc: 'Homemade fresh lemonade', type: 'veg', price: '₹50' },
        { name: 'Iced Tea', desc: 'Refreshing chilled tea', type: 'veg', price: '₹40' },
        { name: 'Soft Beverages', desc: 'Assorted sodas & juices', type: 'veg', price: '₹60' },
      ],
    },
    packages: [
      { name: 'Starter', people: '50-100', price: '₹25,000 - ₹35,000', items: 'Starters + Mains + Dessert' },
      { name: 'Standard', people: '100-250', price: '₹50,000 - ₹90,000', items: 'Extended Menu + Beverages' },
      { name: 'Premium', people: '250-500', price: '₹120,000 - ₹200,000', items: 'Full Customization + Staff' },
    ],
    yearsInBusiness: 8,
    bookedThisMonth: 45,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504674900436-24658a62558b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    ],
  },
];



// ============= MENU DRAWER COMPONENT =============
const MenuDrawer = ({ isOpen, onClose, menu, serviceTitle, onGetQuote }: any) => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const categories = [
    { id: 'starters', label: '🥘 Starters', count: menu.starters.length },
    { id: 'mains', label: '🍛 Main Course', count: menu.mains.length },
    { id: 'desserts', label: '🍰 Desserts', count: menu.desserts.length },
    { id: 'beverages', label: '🥤 Beverages', count: menu.beverages.length },
  ];

  const currentItems = menu[activeCategory as keyof typeof menu] || [];

  const toggleItemSelection = (itemName: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemName) ? prev.filter((i) => i !== itemName) : [...prev, itemName]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 49,
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 51,
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: 0 }}>
            🍽️ Full Menu
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XMarkIcon style={{ width: '24px', height: '24px', color: '#1e293b' }} />
          </button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            overflowX: 'auto',
            backgroundColor: '#f9fafb',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: activeCategory === cat.id ? '#ede9fe' : 'transparent',
                color: activeCategory === cat.id ? '#667eea' : '#6b7280',
                border: activeCategory === cat.id ? '1px solid #ddd6fe' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.id) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {cat.label} <span style={{ fontSize: '0.7rem', opacity: 0.7, marginLeft: '0.25rem' }}>({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentItems.map((item: any, idx: number) => (
              <div
                key={idx}
                onClick={() => toggleItemSelection(item.name)}
                style={{
                  padding: '1rem',
                  border: selectedItems.includes(item.name) ? '2px solid #667eea' : '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: selectedItems.includes(item.name) ? '#ede9fe' : 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Checkbox + Name */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '0.4rem',
                      border: '2px solid ' + (selectedItems.includes(item.name) ? '#667eea' : '#d1d5db'),
                      backgroundColor: selectedItems.includes(item.name) ? '#667eea' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {selectedItems.includes(item.name) && (
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Tags & Price */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: '28px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.3rem 0.6rem',
                      backgroundColor: item.type === 'veg' ? '#dcfce7' : item.type === 'non-veg' ? '#fee2e2' : '#fef3c7',
                      color: item.type === 'veg' ? '#16a34a' : item.type === 'non-veg' ? '#dc2626' : '#b45309',
                      borderRadius: '0.3rem',
                      fontWeight: '700',
                      border: '1px solid ' + (item.type === 'veg' ? '#bbf7d0' : item.type === 'non-veg' ? '#fecaca' : '#fcd34d'),
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.type === 'veg' ? '🌱 Veg' : item.type === 'non-veg' ? '🍖 Non-Veg' : '🌱🍖 Both'}
                  </span>
                  {item.price && (
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#667eea', marginLeft: 'auto' }}>
                      {item.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            display: 'flex',
            gap: '1rem',
            position: 'sticky',
            bottom: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ede9fe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Back
          </button>

          <button
            onClick={() => {
              onGetQuote();
              onClose();
            }}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            }}
          >
            Get Quote
            <span style={{ marginLeft: '0.5rem' }}>→</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          div[style*="maxWidth: 600px"] {
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

// ============= MAIN PAGE COMPONENT =============
const CateringDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const cateringId = params.id as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const service = useMemo(
    () => ALL_CATERING_SERVICES.find(s => s.id === parseInt(cateringId)),
    [cateringId]
  );

  if (!service) {
    return (
      <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: 'clamp(24px, 8vw, 40px)' }}>
            Service Not Found
          </h1>
          <Link href="/caterers">
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Back to Caterers
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: `Check out ${service.title}`,
        url: window.location.href,
      });
    }
  };

  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* MENU DRAWER */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        menu={service.menu}
        serviceTitle={service.title}
        onGetQuote={handleGetQuote}
      />

      {/* QUOTE MODAL */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        caterer={service}
      />

      {/* STICKY HEADER */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              color: '#1e293b',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              style={{
                background: isFavorite ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: isFavorite ? 'white' : '#1e293b',
                border: isFavorite ? 'none' : '1px solid #e5e7eb',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isFavorite) e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                if (!isFavorite) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <HeartIcon style={{ width: '16px', height: '16px', fill: isFavorite ? 'white' : 'none' }} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={handleShare}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e5e7eb',
                color: '#1e293b',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ShareIcon style={{ width: '16px', height: '16px' }} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* TOP SECTION - Image + Info + CTA */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            backgroundColor: 'white',
            borderRadius: '1.25rem',
            padding: '2rem',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* LEFT - Image Gallery */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
                marginBottom: '1rem',
                height: '300px',
                width: '100%',
              }}
            >
              <img
                src={service.images[selectedImageIdx]}
                alt={service.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />

              {/* Verified Badge */}
              {service.verified && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <CheckCircleIcon style={{ width: '16px', height: '16px' }} />
                  Verified
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {service.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx}`}
                  onClick={() => setSelectedImageIdx(idx)}
                  style={{
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: selectedImageIdx === idx ? '2px solid #667eea' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    opacity: selectedImageIdx === idx ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedImageIdx !== idx) e.currentTarget.style.opacity = '0.6';
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT - Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Cuisine & Service Type Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {service.cuisine.map((c, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    backgroundColor: '#ede9fe',
                    color: '#667eea',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    border: '1px solid #ddd6fe',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: 'clamp(24px, 8vw, 36px)',
                fontWeight: '900',
                color: '#111827',
                margin: 0,
                lineHeight: '1.2',
              }}
            >
              {service.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: '1.2rem', opacity: i < Math.floor(service.rating) ? 1 : 0.3 }}>
                    ⭐
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>
                {service.rating}/5
              </span>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                ({service.reviews} reviews)
              </span>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', fontWeight: '600' }}>
              <MapPinIcon style={{ width: '18px', height: '18px' }} />
              {service.location}
            </div>

            {/* Trust Indicators */}
            <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span>✅ {service.yearsInBusiness} years in business</span>
              <span>📊 Booked {service.bookedThisMonth}+ times this month</span>
            </div>

            {/* PRICING BOX */}
            <div
              style={{
                backgroundColor: '#ede9fe',
                border: '2px solid #667eea',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginTop: '1rem',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Starting From
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '900', color: '#667eea', margin: 0, marginBottom: '0.5rem' }}>
                ₹{service.pricePerPerson}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0, fontWeight: '600' }}>
                per person • {service.minGuests}-{service.maxGuests} guests
              </p>
            </div>

            {/* CTA BUTTONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleGetQuote}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                }}
              >
                Get Quote
                <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
              </button>

              <button
                onClick={() => setIsMenuDrawerOpen(true)}
                style={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ede9fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                View Menu
              </button>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS SECTION */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {service.highlights.map((highlight, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{highlight.icon}</div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                {highlight.text}
              </p>
            </div>
          ))}
        </div>

        {/* ABOUT SECTION */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 1rem 0' }}>
            About This Caterer
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#475569', margin: 0 }}>
            {service.description}
          </p>
        </div>

        {/* WHAT'S INCLUDED */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#667eea' }} />
            What's Included
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {service.included.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                <span style={{ color: '#667eea', fontWeight: '800' }}>✓</span>
                <span style={{ fontWeight: '600' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PERFECT FOR */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 1.5rem 0' }}>
            🎉 Perfect For
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {service.occasions.map((occasion, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#ede9fe',
                  color: '#667eea',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: '1px solid #ddd6fe',
                }}
              >
                {occasion}
              </span>
            ))}
          </div>
        </div>

        {/* PACKAGES */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 1.5rem 0' }}>
            📦 Package Options
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {service.packages.map((pkg, idx) => (
              <div
                key={idx}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>
                  {pkg.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 1rem 0', fontWeight: '600' }}>
                  👥 {pkg.people} guests
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#667eea', margin: '1rem 0' }}>
                  {pkg.price}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '1rem 0', fontWeight: '600' }}>
                  ✓ {pkg.items}
                </p>
                <button
                  onClick={handleGetQuote}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '1rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '300px',
              height: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
            }}
          />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 1rem 0' }}>
              Ready to Book {service.title}?
            </h2>
            <p style={{ fontSize: '1.1rem', margin: '0 0 2rem 0', opacity: 0.95 }}>
              Get a custom quote for your event today.
            </p>
            <button
              onClick={handleGetQuote}
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Quote Now
              <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringDetailPage;