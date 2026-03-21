'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { FireIcon, ArrowRightIcon, BoltIcon, TruckIcon, ShieldCheckIcon, StarIcon, HeartIcon, MapPinIcon, ClockIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import ServiceContainer from '@/components/ServiceDisplay/ServiceContainer';
import BenefitsSection from '@/components/Sections/BenefitsSection';
import CTASection from '@/components/Sections/CTASection';
import { FilterConfig } from '@/components/ServiceFilters/FilterSection';
import Link from 'next/link';

// Mock data - same as in main page
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
  },
  {
    id: 4,
    title: "Asian Fusion Catering",
    location: "Singapore, Singapore",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop",
    rating: 4.7,
    reviews: 289,
    pricePerPerson: "₹1,799",
    guestCount: "30-300",
    tags: ["Asian Fusion", "Modern", "Creative"],
    isFeatured: false,
    cuisineType: "Asian Fusion",
    occasion: "Corporate",
    priceRange: "1500-2000",
    country: "Singapore",
  },
  {
    id: 5,
    title: "Vegetarian Gourmet Catering",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 276,
    pricePerPerson: "₹1,299",
    guestCount: "20-400",
    tags: ["Vegetarian", "Gourmet", "Healthy"],
    isFeatured: true,
    cuisineType: "Vegetarian",
    occasion: "Birthday",
    priceRange: "1000-1500",
    country: "United Kingdom",
  },
  {
    id: 6,
    title: "BBQ & Grill Catering",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=300&fit=crop",
    rating: 4.6,
    reviews: 198,
    pricePerPerson: "₹999",
    guestCount: "50-300",
    tags: ["BBQ", "Casual", "Outdoor"],
    isFeatured: false,
    cuisineType: "BBQ",
    occasion: "Private",
    priceRange: "under-1000",
    country: "United States",
  },
];

const COUNTRY_DETAILS: Record<string, { emoji: string; flag: string; description: string }> = {
  'united-states': {
    emoji: '🇺🇸',
    flag: '🦅',
    description: 'Premium catering services across America',
  },
  'india': {
    emoji: '🇮🇳',
    flag: '🧡',
    description: 'Authentic Indian culinary excellence',
  },
  'united-kingdom': {
    emoji: '🇬🇧',
    flag: '☕',
    description: 'British sophistication meets modern cuisine',
  },
  'singapore': {
    emoji: '🇸🇬',
    flag: '✨',
    description: 'Asian fusion and multicultural flavors',
  },
};

const CountryFilterPage = () => {
  const params = useParams();
  const countrySlug = params.country as string;
  const [favorites, setFavorites] = useState<number[]>([]);

  // Decode and normalize country slug
  const countryName = decodeURIComponent(countrySlug)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const countryKey = countrySlug.toLowerCase();
  const countryDetail = COUNTRY_DETAILS[countryKey] || {
    emoji: '🌍',
    flag: '🍽️',
    description: 'Discover premium catering services',
  };

  // Filter services by country
  const filteredServices = ALL_CATERING_SERVICES.filter(
    service => service.country.toLowerCase() === countryName.toLowerCase()
  );

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filterConfig: FilterConfig[] = [
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Search by city...',
      icon: '📍',
    },
    {
      name: 'cuisineType',
      label: 'Cuisine Type',
      type: 'select',
      icon: '🍜',
      options: [
        { value: 'Indian', label: 'Indian' },
        { value: 'Italian', label: 'Italian' },
        { value: 'Asian Fusion', label: 'Asian Fusion' },
        { value: 'Multi-Cuisine', label: 'Multi-Cuisine' },
        { value: 'Vegetarian', label: 'Vegetarian' },
        { value: 'BBQ', label: 'BBQ & Grill' },
      ],
    },
    {
      name: 'priceRange',
      label: 'Price per Person',
      type: 'select',
      icon: '💰',
      options: [
        { value: 'under-1000', label: 'Under ₹1,000' },
        { value: '1000-1500', label: '₹1,000 - ₹1,500' },
        { value: '1500-2000', label: '₹1,500 - ₹2,000' },
        { value: '2000-3000', label: '₹2,000 - ₹3,000' },
        { value: 'over-3000', label: '₹3,000+' },
      ],
    },
  ];

  const handleFilterApply = (filters: Record<string, string | string[]>) => {
    return filteredServices.filter(service => {
      if (filters.location && !service.location.toLowerCase().includes(String(filters.location).toLowerCase())) {
        return false;
      }
      if (filters.cuisineType && service.cuisineType !== filters.cuisineType) {
        return false;
      }
      if (filters.priceRange && service.priceRange !== filters.priceRange) {
        return false;
      }
      return true;
    });
  };

  const CateringCard = ({ item }: { item: typeof ALL_CATERING_SERVICES[0] }) => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.12)";
        e.currentTarget.style.transform = "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "220px",
          overflow: "hidden",
          backgroundColor: "#e2e8f0",
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.transform = "scale(1)";
          }}
        />

        {item.isFeatured && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#f59e0b",
              color: "white",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 10,
            }}
          >
            <FireIcon style={{ width: "14px", height: "14px" }} />
            Featured
          </div>
        )}

        <button
          onClick={() => toggleFavorite(item.id)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "white",
            border: "none",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.12)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.12)";
          }}
        >
          <HeartIcon
            style={{
              width: "20px",
              height: "20px",
              color: favorites.includes(item.id) ? "#f59e0b" : "#94a3b8",
              fill: favorites.includes(item.id) ? "#f59e0b" : "none",
              transition: "all 0.2s ease",
            }}
          />
        </button>

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "700",
            backdropFilter: "blur(4px)",
          }}
        >
          {item.pricePerPerson}/person
        </div>
      </div>

      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            marginBottom: "12px",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 4px 0",
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <StarIcon style={{ width: "16px", height: "16px", color: "#f59e0b", fill: "#f59e0b" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                {item.rating}
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                ({item.reviews})
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <MapPinIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
          <span>{item.location}</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          {item.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "11px",
                padding: "5px 10px",
                backgroundColor: "#fef3c7",
                color: "#f59e0b",
                borderRadius: "6px",
                fontWeight: "600",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/catering/${item.id}`} style={{ textDecoration: "none", marginTop: "auto" }}>
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
  );

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          color: "white",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <Link href="/catering" style={{ textDecoration: "none", color: "white" }}>
            <button
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <ArrowLeftIcon style={{ width: "16px", height: "16px" }} />
              Back to Catering
            </button>
          </Link>
        </div>

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            margin: "0 0 12px 0",
            letterSpacing: "-1px",
          }}
        >
          {countryDetail.emoji} Catering in {countryName}
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            margin: 0,
            fontWeight: "500",
          }}
        >
          {countryDetail.description}
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "48px 32px",
        }}
      >
        {/* SERVICE CONTAINER */}
        <ServiceContainer
          initialItems={filteredServices}
          filterConfig={filterConfig}
          cardComponent={CateringCard}
          title={`Catering Services in ${countryName}`}
          description={`Discover ${filteredServices.length} exceptional catering options across ${countryName}`}
          onFilterApply={handleFilterApply}
          mapPlaceholder={`Interactive map with catering service locations in ${countryName}`}
        />

        {/* BENEFITS SECTION */}
        <BenefitsSection
          title={`Premium Catering in ${countryName}`}
          description="Experience world-class catering services with local expertise"
          benefits={[
            {
              icon: <BoltIcon style={{ width: '24px', height: '24px' }} />,
              title: "Local Expertise",
              description: "Catering providers with deep knowledge of regional preferences.",
            },
            {
              icon: <TruckIcon style={{ width: '24px', height: '24px' }} />,
              title: "Fast Delivery",
              description: "Quick and reliable delivery across the region.",
            },
            {
              icon: <ShieldCheckIcon style={{ width: '24px', height: '24px' }} />,
              title: "Quality Assured",
              description: "Certified and trusted catering professionals.",
            },
            {
              icon: <CheckIcon style={{ width: '24px', height: '24px' }} />,
              title: "Flexible Options",
              description: "Customizable menus to suit all preferences.",
            },
            {
              icon: <StarIcon style={{ width: '24px', height: '24px' }} />,
              title: "Premium Quality",
              description: "Only the finest local and international ingredients.",
            },
            {
              icon: <ClockIcon style={{ width: '24px', height: '24px' }} />,
              title: "Local Support",
              description: "24/7 support from our local team.",
            },
          ]}
        />

        {/* CTA SECTION */}
        <CTASection
          title={`Hire Catering Services in ${countryName}`}
          description={`Browse our curated selection of catering services in ${countryName}. Book your perfect service for any occasion.`}
          buttons={[
            {
              label: "Browse Services",
              href: "#",
              variant: "primary",
            },
            {
              label: "Get Quote",
              href: "#",
              variant: "secondary",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CountryFilterPage;