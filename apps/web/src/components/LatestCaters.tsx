'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Clock, Users, ArrowRight, TrendingUp, Award, Utensils } from 'lucide-react';

interface Cater {
  id: number;
  name: string;
  cuisine: string[];
  image: string;
  coverImage: string;
  rating: number;
  reviews: number;
  eventsBooked: number;
  pricePerPerson: number;
  priceRange: string;
  specialties: string[];
  availability: string;
  location: string;
  yearsInBusiness: number;
  verified: boolean;
  description: string;
}

const mockCaters: Cater[] = [
  {
    id: 1,
    name: 'Elegant Events Catering',
    cuisine: ['French', 'International', 'European'],
    image: '👨‍🍳',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500&h=300&fit=crop',
    rating: 4.8,
    reviews: 128,
    eventsBooked: 1200,
    pricePerPerson: 550,
    priceRange: '₹500 - ₹700/plate',
    specialties: ['Weddings', 'Corporate Events', 'Anniversaries'],
    availability: 'Year-round',
    location: 'Bangalore',
    yearsInBusiness: 12,
    verified: true,
    description: 'Premium wedding specialists since 2012',
  },
  {
    id: 2,
    name: 'Spice Route Kitchen',
    cuisine: ['Indian', 'Asian Fusion', 'North Indian'],
    image: '🍜',
    coverImage: 'https://images.unsplash.com/photo-1504674900436-24658a62558b?w=500&h=300&fit=crop',
    rating: 4.6,
    reviews: 95,
    eventsBooked: 856,
    pricePerPerson: 450,
    priceRange: '₹400 - ₹600/plate',
    specialties: ['Weddings', 'Parties', 'Corporate'],
    availability: 'Weekdays & Weekends',
    location: 'Hyderabad',
    yearsInBusiness: 8,
    verified: true,
    description: 'Authentic flavors, modern presentation',
  },
  {
    id: 3,
    name: 'Mediterranean Bites',
    cuisine: ['Mediterranean', 'Greek', 'Italian'],
    image: '🥗',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
    rating: 4.7,
    reviews: 110,
    eventsBooked: 945,
    pricePerPerson: 500,
    priceRange: '₹450 - ₹650/plate',
    specialties: ['Corporate', 'Private Events', 'Wellness'],
    availability: 'Year-round',
    location: 'Mumbai',
    yearsInBusiness: 10,
    verified: true,
    description: 'Fresh, healthy, and delicious',
  },
  {
    id: 4,
    name: 'Grill Master BBQ',
    cuisine: ['American BBQ', 'Grilled', 'Street Food'],
    image: '🔥',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500&h=300&fit=crop',
    rating: 4.5,
    reviews: 87,
    eventsBooked: 634,
    pricePerPerson: 400,
    priceRange: '₹350 - ₹500/plate',
    specialties: ['Parties', 'Outdoor Events', 'Birthdays'],
    availability: 'Seasonal',
    location: 'Delhi',
    yearsInBusiness: 6,
    verified: true,
    description: 'Smoke-grilled perfection every time',
  },
  {
    id: 5,
    name: 'Royal Feast Catering',
    cuisine: ['Mughlai', 'Biryani', 'Indian'],
    image: '👑',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
    rating: 4.9,
    reviews: 156,
    eventsBooked: 1450,
    pricePerPerson: 520,
    priceRange: '₹480 - ₹700/plate',
    specialties: ['Weddings', 'Grand Events', 'Royal Celebrations'],
    availability: 'Year-round',
    location: 'Pune',
    yearsInBusiness: 15,
    verified: true,
    description: 'Authentic Mughlai cuisine with royal flavors',
  },
  {
    id: 6,
    name: 'Vegan Paradise Kitchen',
    cuisine: ['Vegan', 'Plant-based', 'Health Food'],
    image: '🌱',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
    rating: 4.7,
    reviews: 73,
    eventsBooked: 512,
    pricePerPerson: 380,
    priceRange: '₹350 - ₹550/plate',
    specialties: ['Health-conscious', 'Corporate', 'Wellness Events'],
    availability: 'Year-round',
    location: 'Bangalore',
    yearsInBusiness: 5,
    verified: true,
    description: 'Delicious vegan & plant-based cuisine',
  },
  {
    id: 7,
    name: 'Chinese Wok Master',
    cuisine: ['Chinese', 'Asian', 'Indo-Chinese'],
    image: '🥡',
    coverImage: 'https://images.unsplash.com/photo-1585521199219-351aab2a55dd?w=500&h=300&fit=crop',
    rating: 4.6,
    reviews: 102,
    eventsBooked: 789,
    pricePerPerson: 420,
    priceRange: '₹400 - ₹600/plate',
    specialties: ['Parties', 'Corporate', 'Casual Events'],
    availability: 'Weekdays & Weekends',
    location: 'Kolkata',
    yearsInBusiness: 7,
    verified: true,
    description: 'Authentic Chinese flavors with modern twist',
  },
  {
    id: 8,
    name: 'South Indian Delights',
    cuisine: ['South Indian', 'Tamil', 'Telugu'],
    image: '🍲',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
    rating: 4.8,
    reviews: 94,
    eventsBooked: 823,
    pricePerPerson: 380,
    priceRange: '₹350 - ₹500/plate',
    specialties: ['Weddings', 'Family Events', 'Festivals'],
    availability: 'Year-round',
    location: 'Chennai',
    yearsInBusiness: 9,
    verified: true,
    description: 'Traditional South Indian cuisine perfected',
  },
];

const LatestCaters = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [savedCaters, setSavedCaters] = useState<number[]>([]);

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedCaters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="latest-caters"
      style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.875rem, 5vw, 2.75rem)',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              <TrendingUp size={32} color="#667eea" strokeWidth={2.5} />
              Featured Caterers
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
              Top-rated catering services trusted by thousands of customers
            </p>
          </div>
          <Link
            href="/caterers"
            style={{
              color: 'white',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            View All Caterers
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Caterers Grid - Minimum 6 cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {mockCaters.map((cater) => (
            <Link
              key={cater.id}
              href={`/caterers/${cater.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #e5e7eb',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  setHoveredCard(cater.id);
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  setHoveredCard(null);
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Cover Image Section */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '220px',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  <img
                    src={cater.coverImage}
                    alt={cater.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      transform: hoveredCard === cater.id ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />

                  {/* Overlay on Hover */}
                  {hoveredCard === cater.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/caterers/${cater.id}`;
                        }}
                        style={{
                          padding: '0.875rem 2rem',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#5a67d8';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#667eea';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <ArrowRight size={20} />
                        View Profile
                      </button>
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={(e) => toggleSave(cater.id, e)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {savedCaters.includes(cater.id) ? '❤️' : '🤍'}
                  </button>

                  {/* Verified Badge */}
                  {cater.verified && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        backgroundColor: 'white',
                        padding: '0.625rem 0.95rem',
                        borderRadius: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#10b981',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                        zIndex: 5,
                      }}
                    >
                      <Award size={16} strokeWidth={2.5} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Chef Icon & Name */}
                  <div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2.25rem', lineHeight: '1' }}>
                        {cater.image}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '800',
                            color: '#111827',
                            margin: 0,
                            marginBottom: '0.35rem',
                            lineHeight: '1.3',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {cater.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Rating - Prominent Display */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fbbf24' }}>
                      ⭐ {cater.rating}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
                      ({cater.reviews} reviews)
                    </span>
                  </div>

                  {/* Price Range - Prominent Display */}
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      💰 Price Range
                    </p>
                    <p
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        color: '#667eea',
                        margin: 0,
                      }}
                    >
                      {cater.priceRange}
                    </p>
                  </div>

                  {/* Cuisine Types - Prominent Display */}
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Utensils size={14} />
                      Cuisine Types
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cater.cuisine.slice(0, 2).map((c, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.8rem',
                            color: '#667eea',
                            padding: '0.4rem 0.85rem',
                            backgroundColor: '#ede9fe',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: '1px solid #ddd6fe',
                          }}
                        >
                          🍛 {c}
                        </span>
                      ))}
                      {cater.cuisine.length > 2 && (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#667eea',
                            padding: '0.4rem 0.85rem',
                            backgroundColor: '#ede9fe',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: '1px solid #ddd6fe',
                          }}
                        >
                          +{cater.cuisine.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location - Prominent Display */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb',
                      marginTop: 'auto',
                    }}
                  >
                    <MapPin size={20} color="#667eea" strokeWidth={2.5} />
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
                      {cater.location}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/caterers/${cater.id}`;
                    }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.625rem',
                      marginTop: '1rem',
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
                    View Full Profile
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div
          style={{
            marginTop: '4.5rem',
            backgroundColor: 'white',
            backgroundImage: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '2px solid #ede9fe',
            borderRadius: '1.5rem',
            padding: '3rem',
            textAlign: 'center',
            color: '#111827',
          }}
        >
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Explore All 1200+ Caterers 🔍
          </h3>
          <p style={{ fontSize: '1.05rem', marginBottom: '2rem', color: '#6b7280', lineHeight: '1.6', margin: '1rem auto 2rem' }}>
            Find the perfect caterer for your event with our extensive directory of verified professionals
          </p>
          <Link
            href="/caterers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
          >
            Browse All Caterers
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 2rem 0;
          }
        }
      `}</style>
    </section>
  );
};

export default LatestCaters;