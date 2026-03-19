'use client';

import React, { useState } from 'react';
import { MapPinIcon, StarIcon, HeartIcon, ListBulletIcon, MapIcon, AdjustmentsHorizontalIcon, CheckCircleIcon, ShieldCheckIcon, CreditCardIcon, UserGroupIcon, FireIcon, CheckIcon, CalendarIcon, SparklesIcon, ArrowRightIcon, BoltIcon, TruckIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Link from 'next/link';

const CateringPage = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    guestCount: '',
    cuisineType: '',
    occasion: '',
  });

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
      guestCount: '',
      cuisineType: '',
      occasion: '',
    });
  };

  const isFiltersActive = Object.values(filters).some(val => val !== '');

  const cateringServices = [
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
      description: "Exquisite culinary excellence for your special events with professional service",
      duration: "Customizable",
      included: ["Customized menu", "Professional waitstaff", "Premium plating", "Bar service"],
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
      description: "Authentic Italian cuisine prepared by certified Italian chefs",
      duration: "Customizable",
      included: ["4-course menu", "Wine pairings", "Chef supervision", "Elegant plating"],
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
      description: "Authentic Indian catering with traditional recipes and modern presentation",
      duration: "Customizable",
      included: ["Multi-course Indian menu", "Dessert options", "Beverage service", "Setup & cleanup"],
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
      description: "Creative blend of Asian cuisines with contemporary plating",
      duration: "Customizable",
      included: ["Fusion menu", "Chef's special", "Live cooking station", "Drink pairings"],
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
      description: "Sophisticated vegetarian and vegan menus for conscious diners",
      duration: "Customizable",
      included: ["Gourmet veg menu", "Vegan options", "Nutritionist-approved", "Creative plating"],
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
      description: "Smoky, delicious BBQ and grilled specialties for casual gatherings",
      duration: "Customizable",
      included: ["Smoked meats", "Grilled vegetables", "Sides & sauces", "Outdoor setup"],
    },
  ];

  const CateringCard = ({ catering }: { catering: typeof cateringServices[0] }) => (
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
          src={catering.image}
          alt={catering.title}
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
        {catering.isFeatured && (
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

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(catering.id)}
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
              color: favorites.includes(catering.id) ? "#f59e0b" : "#94a3b8",
              fill: favorites.includes(catering.id) ? "#f59e0b" : "none",
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
          {catering.pricePerPerson}/person
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
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
              {catering.title}
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
                {catering.rating}
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                ({catering.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Location & Duration */}
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
          <span>{catering.location}</span>
        </div>

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
          <ClockIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
          <span>{catering.duration}</span>
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
          {catering.tags.map((tag, idx) => (
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
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f59e0b";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fef3c7";
                e.currentTarget.style.color = "#f59e0b";
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

        {/* Guest Count */}
        <div style={{ marginBottom: "14px", flex: 1 }}>
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
            Guest Capacity
          </p>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#f59e0b" }}>
            {catering.guestCount}
          </span>
        </div>

        {/* CTA Button */}
        <Link href={`/catering/${catering.id}`} style={{ textDecoration: "none" }}>
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
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            margin: "0 0 12px 0",
            letterSpacing: "-1px",
          }}
        >
          🍽️ Premium Catering Services
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            margin: 0,
            fontWeight: "500",
          }}
        >
          Exquisite culinary experiences tailored for every occasion
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
        {/* FEATURED CATERING SECTION */}
        <div style={{ marginBottom: "80px" }}>
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
              <SparklesIcon style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
              Premium Featured Catering Service
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Our most celebrated and in-demand catering experience
            </p>
          </div>

          {/* Premium Multi-Cuisine Featured Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(245, 158, 11, 0.15)",
              border: "2px solid #fef3c7",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 24px 64px rgba(245, 158, 11, 0.2)";
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 48px rgba(245, 158, 11, 0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                minHeight: "550px",
              }}
            >
              {/* Left Side - Image */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#e2e8f0",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&h=800&fit=crop"
                  alt="Premium Multi-Cuisine Catering"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.transform = "scale(1.06)";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.transform = "scale(1)";
                  }}
                />

                {/* Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    zIndex: 10,
                    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  <FireIcon style={{ width: "18px", height: "18px" }} />
                  Most Popular
                </div>
              </div>

              {/* Right Side - Content */}
              <div
                style={{
                  padding: "56px 48px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#fffbf0",
                }}
              >
                {/* Header Section */}
                <div>
                  {/* Label */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#f59e0b",
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                      }}
                    >
                      👨‍🍳 Premium Catering
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "36px",
                      fontWeight: "900",
                      color: "#1e293b",
                      margin: "0 0 12px 0",
                      lineHeight: "1.2",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Premium Multi-Cuisine Catering
                  </h3>

                  {/* Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "28px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "3px" }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: "18px" }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: "700",
                      }}
                    >
                      4.9/5 (528 reviews)
                    </span>
                  </div>

                  {/* Main Description */}
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#475569",
                      lineHeight: "1.8",
                      margin: "0 0 28px 0",
                      fontWeight: "500",
                    }}
                  >
                    Transform your event with exquisite culinary excellence. Our award-winning chefs craft personalized menus featuring the finest ingredients, stunning presentations, and impeccable service. From intimate gatherings to grand celebrations, we deliver unforgettable dining experiences that delight every palate.
                  </p>

                  {/* What's Included */}
                  <div style={{ marginBottom: "28px" }}>
                    <h4
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: "#1e293b",
                        margin: "0 0 14px 0",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      ✓ What's Included
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        "👨‍🍳 Customized Menu Design",
                        "🍽️ Multi-Course Meals",
                        "💼 Professional Waitstaff",
                        "🏆 Premium Plating & Presentation",
                        "🍷 Bar & Beverage Service",
                        "🧹 Complete Setup & Cleanup",
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "14px",
                            color: "#475569",
                            fontWeight: "500",
                          }}
                        >
                          <CheckIcon
                            style={{
                              width: "18px",
                              height: "18px",
                              color: "#f59e0b",
                              flexShrink: 0,
                            }}
                          />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Perfect For */}
                  <div style={{ marginBottom: "28px" }}>
                    <h4
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: "#1e293b",
                        margin: "0 0 12px 0",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      🎉 Perfect For
                    </h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {["Weddings 💒", "Corporate Events 🏢", "Celebrations 🎊", "Private Dinners 🍽️"].map(
                        (occasion, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "13px",
                              padding: "8px 14px",
                              backgroundColor: "#fef3c7",
                              color: "#d97706",
                              borderRadius: "8px",
                              fontWeight: "700",
                              border: "1px solid rgba(245, 158, 11, 0.3)",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f59e0b";
                              e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#fef3c7";
                              e.currentTarget.style.color = "#d97706";
                            }}
                          >
                            {occasion}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Why You'll Love It */}
                  <div style={{ marginBottom: "28px" }}>
                    <h4
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: "#1e293b",
                        margin: "0 0 14px 0",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      💫 Why You'll Love It
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { icon: "👨‍🍳", text: "Michelin-trained chefs" },
                        { icon: "🎨", text: "Artistic food presentation" },
                        { icon: "🌍", text: "Global cuisine expertise" },
                        { icon: "📦", text: "Complete catering service" },
                        { icon: "⏰", text: "Perfect timing & coordination" },
                        { icon: "💚", text: "Dietary accommodations" },
                      ].map((benefit, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: "13px",
                            color: "#475569",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>{benefit.icon}</span>
                          {benefit.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Section - Location & Pricing */}
                <div>
                  {/* Service Area */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                      borderBottom: "2px solid #e2e8f0",
                      backgroundColor: "#fef9f3",
                      padding: "14px",
                      borderRadius: "10px",
                      marginLeft: "-14px",
                      marginRight: "-14px",
                      paddingLeft: "14px",
                    }}
                  >
                    <TruckIcon
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "#f59e0b",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#94a3b8",
                          margin: "0 0 6px 0",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        📍 Service Area & Delivery
                      </p>
                      <p
                        style={{
                          fontSize: "15px",
                          color: "#475569",
                          fontWeight: "600",
                          margin: 0,
                          lineHeight: "1.6",
                        }}
                      >
                        Serving 50-500 guests at your venue. Full delivery, setup, and on-site chef coordination included
                      </p>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.2fr",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          margin: "0 0 8px 0",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        Starting From
                      </p>
                      <div
                        style={{
                          fontSize: "32px",
                          fontWeight: "900",
                          color: "#f59e0b",
                          lineHeight: "1",
                        }}
                      >
                        ₹2,499
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          margin: "6px 0 0 0",
                          fontWeight: "600",
                        }}
                      >
                        per person
                      </p>
                    </div>

                    <button
                      style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                        border: "none",
                        padding: "16px 24px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "800",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "center",
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        letterSpacing: "0.5px",
                        boxShadow: "0 8px 20px rgba(245, 158, 11, 0.25)",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#d97706";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 28px rgba(245, 158, 11, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f59e0b";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(245, 158, 11, 0.25)";
                      }}
                    >
                      Get Custom Quote
                      <ArrowRightIcon style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
            marginTop: "80px",
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
              <AdjustmentsHorizontalIcon style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
              Find Your Perfect Catering
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
                  color: viewMode === "grid" ? "#f59e0b" : "#94a3b8",
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
                  color: viewMode === "map" ? "#f59e0b" : "#94a3b8",
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
                placeholder="Search by city..."
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
                  backgroundColor: filters.location ? "#fef3c7" : "white",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
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
                💰 Price per Person
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
                  backgroundColor: filters.priceRange ? "#fef3c7" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Any Budget</option>
                <option value="under-1000">Under ₹1,000</option>
                <option value="1000-1500">₹1,000 - ₹1,500</option>
                <option value="1500-2000">₹1,500 - ₹2,000</option>
                <option value="2000-3000">₹2,000 - ₹3,000</option>
                <option value="over-3000">₹3,000+</option>
              </select>
            </div>

            {/* Guest Count Filter */}
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
                👥 Guest Count
              </label>
              <select
                value={filters.guestCount}
                onChange={(e) => handleFilterChange('guestCount', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.guestCount ? "#fef3c7" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Any Size</option>
                <option value="20-50">20 - 50 guests</option>
                <option value="50-100">50 - 100 guests</option>
                <option value="100-200">100 - 200 guests</option>
                <option value="200-500">200 - 500 guests</option>
                <option value="500+">500+ guests</option>
              </select>
            </div>

            {/* Cuisine Type Filter */}
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
                🍜 Cuisine Type
              </label>
              <select
                value={filters.cuisineType}
                onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.cuisineType ? "#fef3c7" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Cuisines</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Asian Fusion">Asian Fusion</option>
                <option value="Continental">Continental</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="BBQ">BBQ & Grill</option>
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
                  backgroundColor: filters.occasion ? "#fef3c7" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Occasions</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Private">Private Dinner</option>
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
                backgroundColor: "#f59e0b",
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
              🔍 Search Catering
            </button>

            {isFiltersActive && (
              <button
                onClick={resetFilters}
                style={{
                  backgroundColor: "white",
                  color: "#f59e0b",
                  border: "1.5px solid #f59e0b",
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
                  e.currentTarget.style.backgroundColor = "#fef3c7";
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
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
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
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
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
                {filters.guestCount && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    👥 {filters.guestCount}
                    <span
                      onClick={() => handleFilterChange('guestCount', '')}
                      style={{ cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕
                    </span>
                  </span>
                )}
                {filters.cuisineType && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🍜 {filters.cuisineType}
                    <span
                      onClick={() => handleFilterChange('cuisineType', '')}
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
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
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

        {/* ALL CATERING SECTION */}
        <div style={{ marginBottom: "80px" }}>
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
              <FireIcon style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
              All Catering Services
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Discover {cateringServices.length} exceptional catering options for your event
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
              {cateringServices.map((catering) => (
                <CateringCard key={catering.id} catering={catering} />
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
                  backgroundColor: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <MapIcon style={{ width: "48px", height: "48px", color: "#f59e0b" }} />
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
                    Interactive map with catering service locations will be available soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CATERING BENEFITS SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "80px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <ShieldCheckIcon
              style={{
                width: "32px",
                height: "32px",
                color: "#f59e0b",
                marginBottom: "12px",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 8px 0",
              }}
            >
              100% Quality Assured
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Premium ingredients and expert preparation guaranteed
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <BoltIcon
              style={{
                width: "32px",
                height: "32px",
                color: "#f59e0b",
                marginBottom: "12px",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 8px 0",
              }}
            >
              Quick Booking & Coordination
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Easy booking with dedicated event coordinator support
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <TruckIcon
              style={{
                width: "32px",
                height: "32px",
                color: "#f59e0b",
                marginBottom: "12px",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 8px 0",
              }}
            >
              Full-Service Delivery
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Complete setup, service, and cleanup included
            </p>
          </div>
        </div>

        {/* FINAL CTA SECTION */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fef08a 100%)",
            borderRadius: "20px",
            padding: "64px 40px",
            textAlign: "center",
            border: "2px solid #f59e0b",
            marginBottom: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "200px",
              height: "200px",
              backgroundColor: "#f59e0b",
              borderRadius: "50%",
              opacity: 0.1,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 16px 0",
                letterSpacing: "-0.5px",
              }}
            >
              Make Your Event Unforgettable with Exceptional Catering
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#64748b",
                margin: "0 0 32px 0",
                fontWeight: "500",
                maxWidth: "700px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: "1.8",
              }}
            >
              Book professional catering today and delight your guests with world-class cuisine. Limited time availability for premium services!
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "16px 40px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.5px",
                  boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d97706";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(245, 158, 11, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f59e0b";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(245, 158, 11, 0.3)";
                }}
              >
                Get a Custom Catering Quote
                <ArrowRightIcon style={{ width: "18px", height: "18px" }} />
              </button>

              <button
                style={{
                  backgroundColor: "white",
                  color: "#f59e0b",
                  border: "2px solid #f59e0b",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fef3c7";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(245, 158, 11, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Browse Services
              </button>
            </div>

            {/* Trust indicators */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                <span style={{ fontSize: "16px" }}>✓</span>
                Expert Chefs
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                <span style={{ fontSize: "16px" }}>✓</span>
                Customizable Menus
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                <span style={{ fontSize: "16px" }}>✓</span>
                Full Service Included
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringPage;