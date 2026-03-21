'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  FireIcon,
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Breadcrumb from '@/components/Navigation/Breadcrumb';
import BenefitsSection from '@/components/Sections/BenefitsSection';
import CTASection from '@/components/Sections/CTASection';
import Link from 'next/link';

// Mock data
const ALL_CATERING_SERVICES = [
  {
    id: 1,
    title: "Premium Multi-Cuisine Catering",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 528,
    pricePerPerson: "₹2,499",
    guestCount: "50-500",
    tags: ["Multi-Cuisine", "Premium", "Full Service"],
    isFeatured: true,
    cuisineType: "Multi-Cuisine",
    occasion: "Wedding",
    priceRange: "over-3000",
    country: "United States",
    description: "Transform your event with exquisite culinary excellence.",
    included: [
      "👨‍🍳 Customized Menu Design",
      "🍽️ Multi-Course Meals",
      "💼 Professional Waitstaff",
      "🏆 Premium Plating & Presentation",
      "🍷 Bar & Beverage Service",
      "🧹 Complete Setup & Cleanup",
    ],
    occasions: ["Weddings 💒", "Corporate Events 🏢", "Celebrations 🎊", "Private Dinners 🍽️"],
    whyLoveIt: [
      { icon: "👨‍🍳", text: "Michelin-trained chefs" },
      { icon: "🎨", text: "Artistic food presentation" },
      { icon: "🌍", text: "Global cuisine expertise" },
      { icon: "📦", text: "Complete catering service" },
      { icon: "⏰", text: "Perfect timing & coordination" },
      { icon: "💚", text: "Dietary accommodations" },
    ],
  },
  {
    id: 2,
    title: "Italian Fine Dining Catering",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 342,
    pricePerPerson: "₹1,999",
    guestCount: "20-200",
    tags: ["Italian", "Fine Dining", "European"],
    isFeatured: false,
    cuisineType: "Italian",
    occasion: "Corporate",
    priceRange: "2000-3000",
    country: "United States",
    description: "Authentic Italian flavors prepared with traditional methods.",
    included: [
      "🇮🇹 Authentic Italian Menu",
      "🍝 Fresh Pasta Daily",
      "🍷 Wine Pairing Selection",
      "👨‍🍳 Italian Chef Service",
      "🧀 Premium Italian Ingredients",
      "🎭 Fine Dining Experience",
    ],
    occasions: ["Corporate Events 🏢", "Private Dinners 🍽️", "Celebrations 🎊"],
    whyLoveIt: [
      { icon: "🇮🇹", text: "Authentic Italian recipes" },
      { icon: "👨‍🍳", text: "Trained Italian chefs" },
      { icon: "🍷", text: "Premium wine selection" },
      { icon: "🧀", text: "Imported ingredients" },
      { icon: "🎨", text: "Artistic plating" },
      { icon: "⏰", text: "Timeless elegance" },
    ],
  },
  {
    id: 3,
    title: "Indian Feast Catering Service",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 612,
    pricePerPerson: "₹1,499",
    guestCount: "50-1000",
    tags: ["Indian", "Traditional", "Authentic"],
    isFeatured: true,
    cuisineType: "Indian",
    occasion: "Wedding",
    priceRange: "1500-2000",
    country: "India",
    description: "Traditional Indian spices and aromatic culinary excellence.",
    included: [
      "🌶️ Authentic Spice Blends",
      "🍲 Traditional Curries",
      "🍞 Fresh Bread & Naan",
      "🥗 Fresh Vegetable Dishes",
      "🍛 Rice & Grain Specialties",
      "🧑‍🍳 Experienced Indian Chefs",
    ],
    occasions: ["Weddings 💒", "Celebrations 🎊", "Family Gatherings 👨‍👩‍👧‍👦"],
    whyLoveIt: [
      { icon: "🌶️", text: "Authentic spice blends" },
      { icon: "👨‍🍳", text: "Experienced chefs" },
      { icon: "🌾", text: "Fresh ingredients" },
      { icon: "🎊", text: "Traditional recipes" },
      { icon: "💚", text: "Veg & non-veg options" },
      { icon: "⏰", text: "Perfect timing" },
    ],
  },
];

const CateringDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cateringId = params.id as string;
  const [isFavorite, setIsFavorite] = useState(false);

  // Get service from mock data
  const service = useMemo(
    () => ALL_CATERING_SERVICES.find(s => s.id === parseInt(cateringId)),
    [cateringId]
  );

  // Get the source for breadcrumb (cuisine, country, or main catering page)
  const source = searchParams.get('from');

  // Build breadcrumb items dynamically
  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        label: 'Home',
        href: '/',
        icon: undefined,
      },
      {
        label: 'Catering',
        href: '/catering',
        icon: undefined,
      },
    ];

    // Add intermediate breadcrumb based on source
    if (source === 'cuisine' && service?.cuisineType) {
      items.push({
        label: `${service.cuisineType} Catering`,
        href: `/catering/by-cuisine/${service.cuisineType.toLowerCase().replace(/\s+/g, '-')}`,
        icon: undefined,
      });
    } else if (source === 'country' && service?.country) {
      items.push({
        label: `${service.country}`,
        href: `/catering/by-country/${service.country.toLowerCase().replace(/\s+/g, '-')}`,
        icon: undefined,
      });
    }

    // Add current page
    items.push({
      label: service?.title || 'Service Details',
      href: undefined,
      icon: undefined,
    });

    return items;
  }, [source, service]);

  if (!service) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '48px 32px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#1e293b', marginBottom: '16px' }}>Service Not Found</h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            The catering service you're looking for doesn't exist.
          </p>
          <Link href="/catering">
            <button
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
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
              Back to Catering
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
        text: `Check out ${service.title} - Premium catering service in ${service.location}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header with Navigation */}
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
              marginBottom: '12px',
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  backgroundColor: isFavorite ? '#f59e0b' : 'transparent',
                  border: `2px solid ${isFavorite ? '#f59e0b' : '#e2e8f0'}`,
                  color: isFavorite ? 'white' : '#1e293b',
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
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.borderColor = '#f59e0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isFavorite ? '#f59e0b' : 'transparent';
                }}
              >
                <HeartIcon
                  style={{
                    width: '16px',
                    height: '16px',
                    fill: isFavorite ? 'white' : 'none',
                  }}
                />
                {isFavorite ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleShare}
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
                <ShareIcon style={{ width: '16px', height: '16px' }} />
                Share
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} accentColor="#f59e0b" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Hero Section with Image */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            marginBottom: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left - Image Gallery */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#e2e8f0',
                marginBottom: '16px',
                height: '400px',
              }}
            >
              <img
                src={service.image}
                alt={service.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />

              {service.isFeatured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <FireIcon style={{ width: '18px', height: '18px' }} />
                  Featured Service
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}
            >
              {[service.image, service.image, service.image].map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: '80px',
                    backgroundColor: '#e2e8f0',
                    cursor: 'pointer',
                    opacity: idx === 0 ? 1 : 0.6,
                    border: idx === 0 ? '2px solid #f59e0b' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = idx === 0 ? '1' : '0.6';
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Details */}
          <div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {service.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#fef3c7',
                    color: '#f59e0b',
                    borderRadius: '8px',
                    fontWeight: '700',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '40px',
                fontWeight: '900',
                color: '#1e293b',
                margin: '0 0 16px 0',
                lineHeight: '1.2',
                letterSpacing: '-0.5px',
              }}
            >
              {service.title}
            </h1>

            {/* Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: '18px', opacity: i < Math.floor(service.rating) ? 1 : 0.3 }}>
                    ⭐
                  </span>
                ))}
              </div>
              <div>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                  {service.rating}/5
                </span>
                <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>
                  ({service.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '15px',
                color: '#475569',
                fontWeight: '600',
              }}
            >
              <MapPinIcon style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              {service.location}, {service.country}
            </div>

            {/* Pricing */}
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                borderLeft: '4px solid #f59e0b',
              }}
            >
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Starting From
              </div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#f59e0b', lineHeight: '1' }}>
                {service.pricePerPerson}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>
                per person • {service.guestCount} guests
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
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
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.3)';
                }}
              >
                Get Custom Quote
              </button>

              <Link href={`/catering/${service.id}`} style={{ textDecoration: "none", marginTop: "auto" }}>
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d97706";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f59e0b";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  View Menu
                  <ArrowRightIcon style={{ width: "14px", height: "14px" }} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Description & Details Sections */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            marginBottom: '64px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '16px',
              marginTop: 0,
            }}
          >
            About This Service
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#475569',
              marginBottom: '32px',
              margin: 0,
            }}
          >
            {service.description}
          </p>

          {/* Grid Layout for Info Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* What's Included */}
            {service.included && service.included.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#1e293b',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                  What's Included
                </h3>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {service.included.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '14px',
                        color: '#475569',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#fef3c7',
                          borderRadius: '50%',
                          fontSize: '12px',
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perfect For */}
            {service.occasions && service.occasions.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#1e293b',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🎉 Perfect For
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {service.occasions.map((occasion, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '14px',
                        padding: '10px 14px',
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why You'll Love It */}
        {service.whyLoveIt && service.whyLoveIt.length > 0 && (
          <BenefitsSection
            title="Why You'll Love It"
            benefits={service.whyLoveIt.map((benefit) => ({
              icon: benefit.icon,
              title: benefit.text,
              description: '',
            }))}
            accentColor="#f59e0b"
            backgroundColor="white"
          />
        )}

        {/* CTA Section */}
        <CTASection
          title={`Ready to Book ${service.title}?`}
          description="Get a custom quote for your event. Our team will work with you to create the perfect catering experience tailored to your needs."
          buttons={[
            {
              label: "Get Custom Quote",
              href: "#",
              variant: "primary",
            },
            {
              label: "Contact Us",
              href: "#",
              variant: "secondary",
            },
          ]}
          accentColor="#f59e0b"
        />
      </div>
    </div>
  );
};

export default CateringDetailPage;