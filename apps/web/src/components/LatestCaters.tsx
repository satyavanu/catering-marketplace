'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Clock, Users, ArrowRight, TrendingUp, Award } from 'lucide-react';

interface Cater {
  id: number;
  name: string;
  cuisine: string;
  image: string;
  coverImage: string;
  rating: number;
  reviews: number;
  eventsBooked: number;
  pricePerPerson: number;
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
    cuisine: 'French & International',
    image: '👨‍🍳',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500&h=300&fit=crop',
    rating: 4.8,
    reviews: 128,
    eventsBooked: 1200,
    pricePerPerson: 550,
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
    cuisine: 'Indian & Asian Fusion',
    image: '🍜',
    coverImage: 'https://images.unsplash.com/photo-1504674900436-24658a62558b?w=500&h=300&fit=crop',
    rating: 4.6,
    reviews: 95,
    eventsBooked: 856,
    pricePerPerson: 450,
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
    cuisine: 'Mediterranean & Greek',
    image: '🥗',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
    rating: 4.7,
    reviews: 110,
    eventsBooked: 945,
    pricePerPerson: 500,
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
    cuisine: 'American BBQ',
    image: '🔥',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500&h=300&fit=crop',
    rating: 4.5,
    reviews: 87,
    eventsBooked: 634,
    pricePerPerson: 400,
    specialties: ['Parties', 'Outdoor Events', 'Birthdays'],
    availability: 'Seasonal',
    location: 'Delhi',
    yearsInBusiness: 6,
    verified: true,
    description: 'Smoke-grilled perfection every time',
  },
];

const LatestCaters = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [savedCaters, setSavedCaters] = useState<number[]>([]);

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
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
        backgroundColor: '#f9fafb',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TrendingUp color="#f97316" />
              Featured Caterers
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
              Top-rated catering services trusted by thousands of customers
            </p>
          </div>
          <Link
            href="/caterers"
            style={{
              color: '#f97316',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              padding: '0.5rem 1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ea580c';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#f97316';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            View All Caterers
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Caterers Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  setHoveredCard(cater.id);
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  setHoveredCard(null);
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Cover Image Section */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
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
                      transition: 'transform 0.4s ease',
                      transform: hoveredCard === cater.id ? 'scale(1.1)' : 'scale(1)',
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
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#f97316',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <ArrowRight size={18} />
                        View Gallery
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
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
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
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#10b981',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Award size={14} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Chef Icon & Name */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', lineHeight: '1' }}>
                      {cater.image}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0,
                          marginBottom: '0.25rem',
                          lineHeight: '1.3',
                        }}
                      >
                        {cater.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#6b7280',
                          margin: 0,
                          fontStyle: 'italic',
                        }}
                      >
                        {cater.cuisine}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Reviews */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#fbbf24', fontWeight: '700' }}>⭐ {cater.rating}</span>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {cater.reviews} reviews
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#10b981',
                          fontWeight: '600',
                          margin: '0.25rem 0 0 0',
                        }}
                      >
                        🎉 {cater.eventsBooked} events booked
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#4b5563',
                      margin: '0 0 1rem 0',
                      lineHeight: '1.5',
                      fontWeight: '500',
                      fontStyle: 'italic',
                    }}
                  >
                    "{cater.description}"
                  </p>

                  {/* Meta Information */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <MapPin size={16} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>Location</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {cater.location}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Clock size={16} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>Since</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {cater.yearsInBusiness} years
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.5rem 0', fontWeight: '600', textTransform: 'uppercase' }}>
                      Specialties
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cater.specialties.slice(0, 2).map((spec, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            color: '#667eea',
                            padding: '0.35rem 0.7rem',
                            backgroundColor: '#ede9fe',
                            borderRadius: '0.35rem',
                            fontWeight: '500',
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                      {cater.specialties.length > 2 && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#667eea',
                            padding: '0.35rem 0.7rem',
                            backgroundColor: '#ede9fe',
                            borderRadius: '0.35rem',
                            fontWeight: '500',
                          }}
                        >
                          +{cater.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    style={{
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>
                      Starting Price
                    </p>
                    <p
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#f97316',
                        margin: '0.25rem 0 0 0',
                      }}
                    >
                      ₹{cater.pricePerPerson}
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>/plate</span>
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/caterers/${cater.id}`;
                    }}
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      backgroundColor: '#f97316',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.6rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ea580c';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f97316';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    View Profile
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div
          style={{
            marginTop: '4rem',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            Can't Find What You're Looking For? 🤔
          </h3>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.95 }}>
            Browse through 1200+ verified caterers and find the perfect match for your event
          </p>
          <button
            style={{
              padding: '0.875rem 2.5rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.6rem',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Explore All Caterers →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default LatestCaters;