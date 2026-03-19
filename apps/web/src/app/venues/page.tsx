'use client';

import React, { useState } from 'react';
import { MapPinIcon, StarIcon, UsersIcon, HeartIcon, ListBulletIcon, MapIcon, SparklesIcon, FireIcon, AdjustmentsHorizontalIcon, CheckCircleIcon, ShieldCheckIcon, CreditCardIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Link from 'next/link';

const VenuesPage = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    capacity: '',
    venueType: '',
    occasion: '',
  });

  // ...existing code...

  const categories = [
    { id: 1, name: "Banquet Halls", icon: "🏢" },
    { id: 2, name: "Outdoor Venues", icon: "🌳" },
    { id: 3, name: "Private Spaces", icon: "🔒" },
    { id: 4, name: "Rooftops", icon: "🌆" },
    { id: 5, name: "Gardens", icon: "🌸" },
    { id: 6, name: "Resorts", icon: "🏖️" },
    { id: 7, name: "Galleries", icon: "🖼️" },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      priceRange: '',
      capacity: '',
      venueType: '',
      occasion: '',
    });
  };

  const isFiltersActive = Object.values(filters).some(val => val !== '');

  const venues = [
    {
      id: 1,
      name: "Grand Ballroom Palace",
      location: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      capacity: "500-1000",
      price: "$5,000 - $15,000",
      pricePerPerson: "$10 - $30",
      rating: 4.9,
      reviews: 287,
      image: "https://images.unsplash.com/photo-1519167758481-83f19106c9f3?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Parking", "Catering", "Sound System"],
      tags: ["Luxury", "Banquet", "Indoor"],
      isFeatured: true,
    },
    {
      id: 2,
      name: "Elegant Garden Villa",
      location: "Los Angeles, CA",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      capacity: "200-400",
      price: "$3,000 - $8,000",
      pricePerPerson: "$15 - $40",
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop",
      amenities: ["Garden", "Outdoor Deck", "Parking", "Lighting"],
      tags: ["Outdoor", "Garden", "Romantic"],
      isFeatured: false,
    },
    {
      id: 3,
      name: "Modern Rooftop Loft",
      location: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 },
      capacity: "150-300",
      price: "$2,500 - $6,000",
      pricePerPerson: "$20 - $45",
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=300&fit=crop",
      amenities: ["City View", "Rooftop Bar", "Lounge", "Projector"],
      tags: ["Rooftop", "Modern", "City View"],
      isFeatured: true,
    },
    {
      id: 4,
      name: "Beachside Resort",
      location: "Miami, FL",
      coordinates: { lat: 25.7617, lng: -80.1918 },
      capacity: "300-800",
      price: "$4,000 - $12,000",
      pricePerPerson: "$12 - $35",
      rating: 4.9,
      reviews: 412,
      image: "https://images.unsplash.com/photo-1510578474443-d4c4c9a0a4e5?w=500&h=300&fit=crop",
      amenities: ["Beach Access", "Pool", "Sunset View", "Water Sports"],
      tags: ["Luxury", "Beach", "Outdoor"],
      isFeatured: true,
    },
    {
      id: 5,
      name: "Historic Manor House",
      location: "Boston, MA",
      coordinates: { lat: 42.3601, lng: -71.0589 },
      capacity: "100-250",
      price: "$2,000 - $5,000",
      pricePerPerson: "$18 - $38",
      rating: 4.6,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1519914213002-6f6a0b0e0e5c?w=500&h=300&fit=crop",
      amenities: ["Vintage Decor", "Fireplace", "Terrace", "Library"],
      tags: ["Vintage", "Intimate", "Historic"],
      isFeatured: false,
    },
    {
      id: 6,
      name: "Contemporary Art Gallery",
      location: "Seattle, WA",
      coordinates: { lat: 47.6062, lng: -122.3321 },
      capacity: "50-200",
      price: "$1,500 - $4,000",
      pricePerPerson: "$25 - $50",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop",
      amenities: ["Art Installation", "Minimalist Design", "Natural Light", "Sculpture Garden"],
      tags: ["Modern", "Artistic", "Unique"],
      isFeatured: false,
    },
  ];

  // ...existing code...

  const PopularVenueCard = ({ venue }: { venue: typeof venues[0] }) => (
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
      {/* Image Container */}
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
          src={venue.image}
          alt={venue.name}
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

        {/* Featured Badge */}
        {venue.isFeatured && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#f97316",
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

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(venue.id)}
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
              color: favorites.includes(venue.id) ? "#ef4444" : "#94a3b8",
              fill: favorites.includes(venue.id) ? "#ef4444" : "none",
              transition: "all 0.2s ease",
            }}
          />
        </button>

        {/* Price Tag */}
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
          {venue.pricePerPerson}/person
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: "18px" }}>
        {/* Header with Rating */}
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
              {venue.name}
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
                {venue.rating}
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                ({venue.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "14px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <MapPinIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
          <span>{venue.location}</span>
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          {venue.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "11px",
                padding: "5px 10px",
                backgroundColor: "#f0f4ff",
                color: "#667eea",
                borderRadius: "6px",
                fontWeight: "600",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#667eea";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f4ff";
                e.currentTarget.style.color = "#667eea";
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#e2e8f0",
            marginBottom: "14px",
          }}
        />

        {/* Capacity and Price */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#94a3b8",
                margin: "0 0 4px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Capacity
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <UsersIcon style={{ width: "14px", height: "14px", color: "#667eea" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                {venue.capacity}
              </span>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#94a3b8",
                margin: "0 0 4px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total Price
            </p>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#667eea" }}>
              {venue.price}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/venues/${venue.id}`} style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#764ba2";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#667eea";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            View Details & Book
          </button>
        </Link>
      </div>
    </div>
  );

  // ...existing VenueCard component...

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            margin: "0 0 12px 0",
            letterSpacing: "-1px",
          }}
        >
          Find Your Perfect Venue
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            margin: 0,
            fontWeight: "500",
          }}
        >
          Discover and book stunning venues for your special events
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
        {/* CATEGORY SECTION */}
        <div style={{ marginBottom: "64px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 12px 0",
              }}
            >
              Explore by Category
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Browse our curated collection of premium venues
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {categories.map((category) => (
              <div key={category.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" }}>
                <span style={{ fontSize: "20px" }}>{category.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ENHANCED FILTERS SECTION */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            marginBottom: "40px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AdjustmentsHorizontalIcon style={{ width: "20px", height: "20px", color: "#667eea" }} />
              Find Your Venue
            </h2>

            {/* View Toggle */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                backgroundColor: "#f8fafc",
                padding: "6px",
                borderRadius: "10px",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: viewMode === "grid" ? "white" : "transparent",
                  color: viewMode === "grid" ? "#667eea" : "#94a3b8",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  boxShadow: viewMode === "grid" ? "0 2px 4px rgba(0, 0, 0, 0.08)" : "none",
                }}
              >
                <ListBulletIcon style={{ width: "16px", height: "16px" }} />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: viewMode === "map" ? "white" : "transparent",
                  color: viewMode === "map" ? "#667eea" : "#94a3b8",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  boxShadow: viewMode === "map" ? "0 2px 4px rgba(0, 0, 0, 0.08)" : "none",
                }}
              >
                <MapIcon style={{ width: "16px", height: "16px" }} />
                Map
              </button>
            </div>
          </div>

          {/* Filter Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Location Filter */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                📍 Location
              </label>
              <input
                type="text"
                placeholder="Search by city or state..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.location ? "#f0f4ff" : "white",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                💰 Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.priceRange ? "#f0f4ff" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Any Budget</option>
                <option value="under-2000">Under $2,000</option>
                <option value="2000-5000">$2,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-20000">$10,000 - $20,000</option>
                <option value="over-20000">$20,000+</option>
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                👥 Guest Capacity
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.capacity ? "#f0f4ff" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Any Size</option>
                <option value="50-100">50 - 100 guests</option>
                <option value="100-250">100 - 250 guests</option>
                <option value="250-500">250 - 500 guests</option>
                <option value="500-1000">500 - 1,000 guests</option>
                <option value="1000+">1,000+ guests</option>
              </select>
            </div>

            {/* Venue Type Filter */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                🏢 Venue Type
              </label>
              <select
                value={filters.venueType}
                onChange={(e) => handleFilterChange('venueType', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.venueType ? "#f0f4ff" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Venues</option>
                <option value="banquet">Banquets & Halls</option>
                <option value="outdoor">Outdoor Venues</option>
                <option value="private">Private Spaces</option>
                <option value="rooftop">Rooftop</option>
                <option value="garden">Garden</option>
                <option value="resort">Resort</option>
                <option value="gallery">Gallery/Museum</option>
              </select>
            </div>

            {/* Occasion Filter */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                🎉 Occasion
              </label>
              <select
                value={filters.occasion}
                onChange={(e) => handleFilterChange('occasion', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.occasion ? "#f0f4ff" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Occasions</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Party</option>
                <option value="corporate">Corporate Event</option>
                <option value="anniversary">Anniversary</option>
                <option value="engagement">Engagement</option>
                <option value="private">Private Party</option>
                <option value="conference">Conference</option>
                <option value="product-launch">Product Launch</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "12px",
              gridColumn: "1 / -1",
            }}
          >
            <button
              style={{
                width: "100%",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#764ba2";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#667eea";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🔍 Search Venues
            </button>

            {isFiltersActive && (
              <button
                onClick={resetFilters}
                style={{
                  backgroundColor: "white",
                  color: "#667eea",
                  border: "1.5px solid #667eea",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {isFiltersActive && (
            <div
              style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  margin: "0 0 12px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Active Filters
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {filters.location && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#e0e7ff",
                      color: "#667eea",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    📍 {filters.location}
                    <span
                      onClick={() => handleFilterChange('location', '')}
                      style={{ cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕
                    </span>
                  </span>
                )}
                {filters.priceRange && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#e0e7ff",
                      color: "#667eea",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    💰 {filters.priceRange}
                    <span
                      onClick={() => handleFilterChange('priceRange', '')}
                      style={{ cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕
                    </span>
                  </span>
                )}
                {filters.capacity && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#e0e7ff",
                      color: "#667eea",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    👥 {filters.capacity}
                    <span
                      onClick={() => handleFilterChange('capacity', '')}
                      style={{ cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕
                    </span>
                  </span>
                )}
                {filters.venueType && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#e0e7ff",
                      color: "#667eea",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🏢 {filters.venueType}
                    <span
                      onClick={() => handleFilterChange('venueType', '')}
                      style={{ cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕
                    </span>
                  </span>
                )}
                {filters.occasion && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#e0e7ff",
                      color: "#667eea",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🎉 {filters.occasion}
                    <span
                      onClick={() => handleFilterChange('occasion', '')}
                      style={{ cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* POPULAR VENUES SECTION */}
        <div style={{ marginBottom: "64px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FireIcon style={{ width: "32px", height: "32px", color: "#f97316" }} />
              Popular Venues
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Discover our most loved and highest-rated venues
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {venues.map((venue) => (
              <PopularVenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#1e293b",
              margin: 0,
            }}
          >
            All Available Venues
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: "6px 0 0 0",
              fontWeight: "500",
            }}
          >
            {venues.length} stunning venues to choose from
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {venues.map((venue) => (
              <PopularVenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}

        {/* Map View */}
        {viewMode === "map" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              height: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#e0e7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <MapIcon style={{ width: "48px", height: "48px", color: "#667eea" }} />
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 6px 0",
                  }}
                >
                  Map View Coming Soon
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  Interactive map with venue locations will be available soon
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WHY CHOOSE US - TRUST SECTION */}
        <div style={{ marginTop: "80px", marginBottom: "80px" }}>
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 12px 0",
              }}
            >
              Why Choose Our Platform?
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              We're committed to making your event planning experience seamless, secure, and exceptional
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {/* Trust Card 1: Verified Venues */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#e0e7ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <ShieldCheckIcon style={{ width: "32px", height: "32px", color: "#667eea" }} />
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                }}
              >
                Verified Venues
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                All venues on our platform are thoroughly verified and curated. We ensure quality standards and authenticity for every listing you see.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#667eea",
                }}
              >
                <CheckCircleIcon style={{ width: "16px", height: "16px" }} />
                100% Quality Assured
              </div>
            </div>

            {/* Trust Card 2: Easy Booking */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#fef3c7",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <SparklesIcon style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                }}
              >
                Seamless Booking
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                Our intuitive booking process takes just minutes. Browse, compare, and reserve your venue with a few clicks. No hassle, no complications.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#f59e0b",
                }}
              >
                <CheckCircleIcon style={{ width: "16px", height: "16px" }} />
                Book in Minutes
              </div>
            </div>

            {/* Trust Card 3: Transparent Pricing */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#dcfce7",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <CreditCardIcon style={{ width: "32px", height: "32px", color: "#16a34a" }} />
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                }}
              >
                Transparent Pricing
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                No hidden fees or surprise charges. See exactly what you're paying upfront. What you see is what you get - complete transparency guaranteed.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#16a34a",
                }}
              >
                <CheckCircleIcon style={{ width: "16px", height: "16px" }} />
                No Hidden Fees
              </div>
            </div>

            {/* Trust Card 4: Secure Payments */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f3e8ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <ShieldCheckIcon style={{ width: "32px", height: "32px", color: "#a855f7" }} />
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                }}
              >
                Secure Payments
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                Your payment information is protected with industry-leading encryption. We partner with trusted payment providers for your peace of mind.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#a855f7",
                }}
              >
                <CheckCircleIcon style={{ width: "16px", height: "16px" }} />
                SSL Encrypted
              </div>
            </div>

            {/* Trust Card 5: Expert Support */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#fee2e2",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <UserGroupIcon style={{ width: "32px", height: "32px", color: "#ef4444" }} />
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                }}
              >
                Expert Support Team
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                Our dedicated support team is available 24/7 to help you. Have questions? Need assistance? We're here for you every step of the way.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ef4444",
                }}
              >
                <CheckCircleIcon style={{ width: "16px", height: "16px" }} />
                24/7 Support
              </div>
            </div>

            {/* Trust Card 6: Community Reviews */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#cffafe",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <HeartIcon style={{ width: "32px", height: "32px", color: "#0891b2" }} />
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                }}
              >
                Trusted by Thousands
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                Join thousands of happy clients who've successfully planned their events. Read real reviews and see verified feedback from our community.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0891b2",
                }}
              >
                <CheckCircleIcon style={{ width: "16px", height: "16px" }} />
                12,000+ Happy Events
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div
            style={{
              marginTop: "60px",
              backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              padding: "48px 32px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "40px",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "white",
                  margin: "0 0 8px 0",
                }}
              >
                500+
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                Verified Venues
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "white",
                  margin: "0 0 8px 0",
                }}
              >
                12K+
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                Successful Bookings
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "white",
                  margin: "0 0 8px 0",
                }}
              >
                4.8★
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                Average Rating
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "white",
                  margin: "0 0 8px 0",
                }}
              >
                50+
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                Cities Covered
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "64px 32px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#1e293b",
              margin: "0 0 12px 0",
            }}
          >
            Find Your Perfect Venue Today
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              margin: "0 0 32px 0",
              fontWeight: "500",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Start planning your dream event with our curated collection of premium venues
          </p>

          <button
            style={{
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              padding: "14px 32px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#764ba2";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#667eea";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Explore All Venues →
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;