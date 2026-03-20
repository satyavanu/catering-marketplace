'use client';

import React, { useState } from 'react';
import { MapPinIcon, StarIcon, HeartIcon, ListBulletIcon, MapIcon, AdjustmentsHorizontalIcon, CheckCircleIcon, ShieldCheckIcon, CreditCardIcon, UserGroupIcon, FireIcon, CheckIcon, CalendarIcon, SparklesIcon, ArrowRightIcon, BoltIcon, TruckIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Link from 'next/link';

const ExperiencesPage = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    guestCount: '',
    experienceType: '',
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
      experienceType: '',
      occasion: '',
    });
  };

  const isFiltersActive = Object.values(filters).some(val => val !== '');

  const experiences = [
    {
      id: 1,
      title: "Romantic Rooftop Candlelight Dinner",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=300&fit=crop",
      rating: 4.9,
      reviews: 342,
      pricePerPerson: "₹15,999",
      guestCount: "2-10",
      tags: ["Romantic", "Dinner", "Premium"],
      isFeatured: true,
      description: "Celebrate under the stars with candlelight, gourmet cuisine, and stunning city views",
      duration: "3 hours",
      included: ["5-course menu", "Premium beverages", "Live music", "Photography"],
    },
    {
      id: 2,
      title: "Private Wine Tasting Experience",
      location: "Napa Valley, CA",
      image: "https://images.unsplash.com/photo-1510578474443-d4c4c9a0a4e5?w=500&h=300&fit=crop",
      rating: 4.8,
      reviews: 215,
      pricePerPerson: "₹8,999",
      guestCount: "4-12",
      tags: ["Wine", "Tasting", "Gourmet"],
      isFeatured: false,
      description: "Exclusive wine tasting with vineyard tour and chef-paired cuisine",
      duration: "4 hours",
      included: ["8 wine selections", "Gourmet pairings", "Expert sommelier", "Vineyard tour"],
    },
    {
      id: 3,
      title: "Beachside Sunset Celebration",
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop",
      rating: 4.9,
      reviews: 412,
      pricePerPerson: "₹12,999",
      guestCount: "10-50",
      tags: ["Beach", "Outdoor", "Sunset"],
      isFeatured: true,
      description: "Unforgettable beach celebration with tropical cocktails and live entertainment",
      duration: "2.5 hours",
      included: ["Tropical menu", "Signature cocktails", "Live band", "Beach setup"],
    },
    {
      id: 4,
      title: "Luxury Spa & Wellness Retreat",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1519167758481-83f19106c9f3?w=500&h=300&fit=crop",
      rating: 4.7,
      reviews: 189,
      pricePerPerson: "₹18,999",
      guestCount: "2-8",
      tags: ["Spa", "Wellness", "Relaxation"],
      isFeatured: false,
      description: "Rejuvenating spa day with massages, yoga, and healthy gourmet lunch",
      duration: "5 hours",
      included: ["Spa treatments", "Yoga session", "Healthy lunch", "Wellness consultation"],
    },
    {
      id: 5,
      title: "Private Chef Cooking Class",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1519914213002-6f6a0b0e0e5c?w=500&h=300&fit=crop",
      rating: 4.8,
      reviews: 267,
      pricePerPerson: "₹13,999",
      guestCount: "2-12",
      tags: ["Cooking", "Culinary", "Interactive"],
      isFeatured: true,
      description: "Learn from a Michelin-trained chef and create a 3-course meal together",
      duration: "3.5 hours",
      included: ["Chef instruction", "All ingredients", "Wine pairings", "Meal to take home"],
    },
    {
      id: 6,
      title: "Enchanted Garden Tea Party",
      location: "Boston, MA",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop",
      rating: 4.6,
      reviews: 156,
      pricePerPerson: "₹7,999",
      guestCount: "4-20",
      tags: ["Tea", "Garden", "Elegant"],
      isFeatured: false,
      description: "Elegant afternoon tea in a stunning garden setting with live entertainment",
      duration: "2 hours",
      included: ["Premium tea selection", "Gourmet pastries", "Garden access", "Live music"],
    },
  ];

  const ExperienceCard = ({ experience }: { experience: typeof experiences[0] }) => (
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
          src={experience.image}
          alt={experience.title}
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
        {experience.isFeatured && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#ec4899",
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
          onClick={() => toggleFavorite(experience.id)}
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
              color: favorites.includes(experience.id) ? "#ec4899" : "#94a3b8",
              fill: favorites.includes(experience.id) ? "#ec4899" : "none",
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
          {experience.pricePerPerson}/person
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
              {experience.title}
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
                {experience.rating}
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                ({experience.reviews})
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
          <span>{experience.location}</span>
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
          <CalendarIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
          <span>{experience.duration}</span>
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
          {experience.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "11px",
                padding: "5px 10px",
                backgroundColor: "#fce7f3",
                color: "#ec4899",
                borderRadius: "6px",
                fontWeight: "600",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ec4899";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fce7f3";
                e.currentTarget.style.color = "#ec4899";
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
            Guest Count
          </p>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#ec4899" }}>
            {experience.guestCount}
          </span>
        </div>

        {/* CTA Button */}
        <Link href={`/experiences/${experience.id}`} style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              backgroundColor: "#ec4899",
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
              e.currentTarget.style.backgroundColor = "#be185d";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(236, 72, 153, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ec4899";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Book Now
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
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
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
          ✨ Unforgettable Experiences
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            margin: 0,
            fontWeight: "500",
          }}
        >
          Curated premium experiences designed to create lasting memories
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
        {/* FEATURED EXPERIENCE SECTION */}
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
              <SparklesIcon style={{ width: "32px", height: "32px", color: "#ec4899" }} />
              Premium Featured Experience
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Our most beloved and enchanting experience
            </p>
          </div>

          {/* Romantic Rooftop Featured Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(236, 72, 153, 0.15)",
              border: "2px solid #fce7f3",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 24px 64px rgba(236, 72, 153, 0.2)";
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 48px rgba(236, 72, 153, 0.15)";
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
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=800&fit=crop"
                  alt="Romantic Rooftop Candlelight Dinner"
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
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    zIndex: 10,
                    boxShadow: "0 8px 24px rgba(236, 72, 153, 0.4)",
                  }}
                >
                  <HeartIcon style={{ width: "18px", height: "18px" }} />
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
                  backgroundColor: "#fafbff",
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
                        color: "#ec4899",
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                      }}
                    >
                      💎 Premium Experience
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
                    Romantic Rooftop Candlelight Dinner
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
                      4.9/5 (342 reviews)
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
                    Celebrate your most special moments under the stars. Picture yourself and your loved one surrounded by soft candlelight, with breathtaking city views as your backdrop. Our romantic rooftop experience combines exquisite gourmet cuisine, premium beverages, and personalized service to create an evening you'll treasure forever. This is more than a dinner—it's a memory waiting to be made.
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
                        "🍽️ 5-Course Gourmet Menu",
                        "🥂 Premium Wine Pairings",
                        "🕯️ Candlelit Ambiance Setup",
                        "🎵 Live Soft Music",
                        "📸 Professional Photography",
                        "🌃 Stunning Rooftop Access",
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
                              color: "#ec4899",
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
                      💑 Perfect For
                    </h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {["Marriage Proposals 💍", "Anniversaries 🎂", "Date Nights 💕", "Engagements 👰"].map(
                        (occasion, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "13px",
                              padding: "8px 14px",
                              backgroundColor: "#fce7f3",
                              color: "#be185d",
                              borderRadius: "8px",
                              fontWeight: "700",
                              border: "1px solid #fbbf24",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#ec4899";
                              e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#fce7f3";
                              e.currentTarget.style.color = "#be185d";
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
                        { icon: "🌃", text: "Panoramic city skyline views" },
                        { icon: "🕯️", text: "Intimate candlelit ambiance" },
                        { icon: "👨‍🍳", text: "Chef-curated menu" },
                        { icon: "📸", text: "Professional photos included" },
                        { icon: "🎵", text: "Soothing live entertainment" },
                        { icon: "💼", text: "Dedicated coordinator" },
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
                  {/* Location - ENHANCED */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                      borderBottom: "2px solid #e2e8f0",
                      backgroundColor: "#f3f4f6",
                      padding: "14px",
                      borderRadius: "10px",
                      marginLeft: "-14px",
                      marginRight: "-14px",
                      paddingLeft: "14px",
                    }}
                  >
                    <MapPinIcon
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "#ec4899",
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
                        📍 Available Locations
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
                        Premium rooftop venues in major cities, or we can come to your preferred location for a truly personalized experience
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
                          color: "#ec4899",
                          lineHeight: "1",
                        }}
                      >
                        ₹15,999
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          margin: "6px 0 0 0",
                          fontWeight: "600",
                        }}
                      >
                        per couple
                      </p>
                    </div>

                    <button
                      style={{
                        backgroundColor: "#ec4899",
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
                        boxShadow: "0 8px 20px rgba(236, 72, 153, 0.25)",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#be185d";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 28px rgba(236, 72, 153, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ec4899";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(236, 72, 153, 0.25)";
                      }}
                    >
                      Book Your Experience Now
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
              <AdjustmentsHorizontalIcon style={{ width: "20px", height: "20px", color: "#ec4899" }} />
              Find Your Perfect Experience
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
                  color: viewMode === "grid" ? "#ec4899" : "#94a3b8",
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
                  color: viewMode === "map" ? "#ec4899" : "#94a3b8",
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
                  backgroundColor: filters.location ? "#fce7f3" : "white",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
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
                  backgroundColor: filters.priceRange ? "#fce7f3" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Any Budget</option>
                <option value="under-5000">Under ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
                <option value="20000-50000">₹20,000 - ₹50,000</option>
                <option value="over-50000">₹50,000+</option>
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
                  backgroundColor: filters.guestCount ? "#fce7f3" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Any Size</option>
                <option value="2-4">2 - 4 guests</option>
                <option value="4-8">4 - 8 guests</option>
                <option value="8-12">8 - 12 guests</option>
                <option value="12-20">12 - 20 guests</option>
                <option value="20+">20+ guests</option>
              </select>
            </div>

            {/* Experience Type Filter */}
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
                🎭 Experience Type
              </label>
              <select
                value={filters.experienceType}
                onChange={(e) => handleFilterChange('experienceType', e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  backgroundColor: filters.experienceType ? "#fce7f3" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Types</option>
                <option value="dinner">Fine Dining</option>
                <option value="wine">Wine Tasting</option>
                <option value="spa">Spa & Wellness</option>
                <option value="culinary">Culinary Classes</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
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
                  backgroundColor: filters.occasion ? "#fce7f3" : "white",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Occasions</option>
                <option value="romantic">Romantic</option>
                <option value="proposal">Proposal</option>
                <option value="anniversary">Anniversary</option>
                <option value="celebration">Celebration</option>
                <option value="corporate">Corporate</option>
                <option value="birthday">Birthday</option>
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
                backgroundColor: "#ec4899",
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
                e.currentTarget.style.backgroundColor = "#be185d";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(236, 72, 153, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ec4899";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🔍 Search Experiences
            </button>

            {isFiltersActive && (
              <button
                onClick={resetFilters}
                style={{
                  backgroundColor: "white",
                  color: "#ec4899",
                  border: "1.5px solid #ec4899",
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
                  e.currentTarget.style.backgroundColor = "#fce7f3";
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
                      backgroundColor: "#fce7f3",
                      color: "#ec4899",
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
                      backgroundColor: "#fce7f3",
                      color: "#ec4899",
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
                      backgroundColor: "#fce7f3",
                      color: "#ec4899",
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
                {filters.experienceType && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#fce7f3",
                      color: "#ec4899",
                      borderRadius: "8px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🎭 {filters.experienceType}
                    <span
                      onClick={() => handleFilterChange('experienceType', '')}
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
                      backgroundColor: "#fce7f3",
                      color: "#ec4899",
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

        {/* ALL EXPERIENCES SECTION */}
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
              <FireIcon style={{ width: "32px", height: "32px", color: "#ec4899" }} />
              All Experiences
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Discover {experiences.length} amazing experiences waiting for you
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
              {experiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
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
                  backgroundColor: "#fce7f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <MapIcon style={{ width: "48px", height: "48px", color: "#ec4899" }} />
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
                    Interactive map with experience locations will be available soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ENHANCED TRUST & BENEFITS SECTION */}
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
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(236, 72, 153, 0.12)";
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
                color: "#ec4899",
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
              100% Secure Booking
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Your privacy and payment are fully protected
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
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(236, 72, 153, 0.12)";
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
                color: "#ec4899",
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
              Instant Confirmation
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Get immediate booking confirmation via email
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
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(236, 72, 153, 0.12)";
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
                color: "#ec4899",
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
              Flexible Locations
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Host at your venue or choose from our premium locations
            </p>
          </div>
        </div>

        {/* ENHANCED CTA SECTION */}
        <div
          style={{
            background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
            borderRadius: "20px",
            padding: "64px 40px",
            textAlign: "center",
            border: "2px solid #ec4899",
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
              backgroundColor: "#ec4899",
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
              Ready to Create Your Unforgettable Moment?
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
              Don't wait! Book your premium experience today and celebrate life's most special moments with the people you love. Limited slots available for premium venues.
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
                  backgroundColor: "#ec4899",
                  color: "white",
                  border: "none",
                  padding: "16px 40px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.5px",
                  boxShadow: "0 8px 20px rgba(236, 72, 153, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#be185d";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(236, 72, 153, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ec4899";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(236, 72, 153, 0.3)";
                }}
              >
                Book Your Experience Now
                <ArrowRightIcon style={{ width: "18px", height: "18px" }} />
              </button>

              <button
                style={{
                  backgroundColor: "white",
                  color: "#ec4899",
                  border: "2px solid #ec4899",
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
                  e.currentTarget.style.backgroundColor = "#fce7f3";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(236, 72, 153, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Learn More
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
                Easy Booking Process
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
                Money-Back Guarantee
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
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesPage;