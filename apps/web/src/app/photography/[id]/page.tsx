'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  StarIcon,
  HeartIcon,
  CheckCircleIcon,
  CalendarIcon,
  CameraIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PhotographerDetailPage({ params }: { params: { id: string } }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'portfolio' | 'reviews' | 'pricing'>('portfolio');

  // Mock data - replace with actual API call
  const photographer = {
    id: params.id,
    name: 'Timeless Moments Photography',
    location: 'New York, NY',
    country: 'USA',
    description:
      'Professional wedding and engagement photography with 12+ years experience capturing precious moments.',
    rating: 4.9,
    reviews: 287,
    yearsExperience: 12,
    image: 'https://images.unsplash.com/photo-1502764613149-7f3d7dc5d43b?w=800&h=600&fit=crop',
    pricePerHour: '$150 - $250',
    pricePerDay: '$1,500 - $3,000',
    pricePackage: '$3,500 - $8,000',
    serviceTypes: ['Wedding', 'Engagement', 'Pre-Wedding'],
    styles: ['Traditional', 'Candid', 'Cinematic'],
    occasions: ['Wedding', 'Engagement'],
    email: 'contact@timelessmoments.com',
    phone: '+1 (555) 123-4567',
    portfolio: [
      'https://images.unsplash.com/photo-1502764613149-7f3d7dc5d43b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f19106c9f3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1510578474443-d4c4c9a0a4e5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    testimonials: [
      {
        id: 1,
        name: 'Sarah & John',
        rating: 5,
        text: 'Absolutely incredible! Captured every moment perfectly. Highly recommended!',
        event: 'Wedding',
      },
      {
        id: 2,
        name: 'Emma Miller',
        rating: 5,
        text: 'Professional, creative, and so easy to work with. Best decision ever!',
        event: 'Engagement',
      },
      {
        id: 3,
        name: 'Michael Chen',
        rating: 4.8,
        text: 'Amazing work! Loved the candid shots and editing. Will book again!',
        event: 'Pre-Wedding',
      },
    ],
    gallery: {
      weddings: 45,
      engagements: 32,
      events: 28,
    },
    about:
      'With over a decade of experience, I specialize in capturing authentic moments that tell your story. My approach combines traditional techniques with modern creativity to deliver timeless photographs.',
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '500px',
          overflow: 'hidden',
          backgroundColor: '#e2e8f0',
        }}
      >
        <img
          src={photographer.image}
          alt={photographer.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />

        {/* Action Buttons */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            display: 'flex',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <HeartIcon
              style={{
                width: '24px',
                height: '24px',
                color: isFavorite ? '#ef4444' : '#64748b',
                fill: isFavorite ? '#ef4444' : 'none',
              }}
            />
          </button>

          <button
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ShareIcon style={{ width: '24px', height: '24px', color: '#64748b' }} />
          </button>
        </div>

        {/* Back Link */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
          }}
        >
          <Link href="/photography">
            <button
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#1e293b',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              ← Back
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', marginBottom: '64px' }}>
          {/* Left Column */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                }}
              >
                {photographer.name}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarIcon style={{ width: '20px', height: '20px', color: '#f59e0b', fill: '#f59e0b' }} />
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                    {photographer.rating}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>
                    ({photographer.reviews} reviews)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CameraIcon style={{ width: '20px', height: '20px', color: '#667eea' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {photographer.yearsExperience} years experience
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPinIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  <span style={{ fontSize: '14px', color: '#64748b' }}>
                    {photographer.location}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                {photographer.description}
              </p>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0',
                  borderBottom: '1px solid #e2e8f0',
                  marginBottom: '32px',
                }}
              >
                {(['portfolio', 'reviews', 'pricing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    style={{
                      padding: '16px 24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: selectedTab === tab ? '#667eea' : '#94a3b8',
                      borderBottom: selectedTab === tab ? '2px solid #667eea' : 'none',
                      transition: 'all 0.2s ease',
                      marginBottom: '-1px',
                      textTransform: 'capitalize',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTab !== tab) {
                        e.currentTarget.style.color = '#64748b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTab !== tab) {
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Portfolio Tab */}
              {selectedTab === 'portfolio' && (
                <div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 24px 0',
                    }}
                  >
                    Photo Gallery
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {photographer.portfolio.map((image, idx) => (
                      <div
                        key={idx}
                        style={{
                          height: '250px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                          if (img) img.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                          if (img) img.style.transform = 'scale(1)';
                        }}
                      >
                        <img
                          src={image}
                          alt={`Gallery ${idx}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Gallery Stats */}
                  <div
                    style={{
                      marginTop: '32px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                    }}
                  >
                    {Object.entries(photographer.gallery).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          backgroundColor: '#f0f4ff',
                          padding: '24px',
                          borderRadius: '12px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: '#667eea',
                            marginBottom: '8px',
                          }}
                        >
                          {value}+
                        </div>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#64748b',
                            margin: 0,
                            textTransform: 'capitalize',
                            fontWeight: '600',
                          }}
                        >
                          {key}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {selectedTab === 'reviews' && (
                <div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 24px 0',
                    }}
                  >
                    Client Testimonials
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {photographer.testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        style={{
                          backgroundColor: 'white',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                          }}
                        >
                          <h4
                            style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#1e293b',
                              margin: 0,
                            }}
                          >
                            {testimonial.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  color: '#f59e0b',
                                  fill: i < Math.floor(testimonial.rating) ? '#f59e0b' : 'none',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#94a3b8',
                            margin: '0 0 12px 0',
                          }}
                        >
                          {testimonial.event}
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#64748b',
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          "{testimonial.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {selectedTab === 'pricing' && (
                <div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 24px 0',
                    }}
                  >
                    Pricing & Packages
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '28px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#1e293b',
                          margin: '0 0 8px 0',
                        }}
                      >
                        Hourly Rate
                      </h4>
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748b',
                          margin: '0 0 16px 0',
                        }}
                      >
                        Perfect for events under 4 hours
                      </p>
                      <p
                        style={{
                          fontSize: '24px',
                          fontWeight: '800',
                          color: '#667eea',
                          margin: 0,
                        }}
                      >
                        {photographer.pricePerHour}
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '28px',
                        borderRadius: '12px',
                        border: '2px solid #667eea',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          right: '24px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        POPULAR
                      </div>
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#1e293b',
                          margin: '0 0 8px 0',
                        }}
                      >
                        Full Day
                      </h4>
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748b',
                          margin: '0 0 16px 0',
                        }}
                      >
                        8 hours of coverage
                      </p>
                      <p
                        style={{
                          fontSize: '24px',
                          fontWeight: '800',
                          color: '#667eea',
                          margin: 0,
                        }}
                      >
                        {photographer.pricePerDay}
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '28px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#1e293b',
                          margin: '0 0 8px 0',
                        }}
                      >
                        Custom Package
                      </h4>
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748b',
                          margin: '0 0 16px 0',
                        }}
                      >
                        Multi-day or special events
                      </p>
                      <p
                        style={{
                          fontSize: '24px',
                          fontWeight: '800',
                          color: '#667eea',
                          margin: 0,
                        }}
                      >
                        {photographer.pricePackage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '28px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 16px 0',
                }}
              >
                About {photographer.name}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  lineHeight: '1.8',
                  margin: 0,
                }}
              >
                {photographer.about}
              </p>

              {/* Service Types */}
              <div style={{ marginTop: '20px' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Services
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {photographer.serviceTypes.map((service) => (
                    <span
                      key={service}
                      style={{
                        fontSize: '13px',
                        padding: '6px 12px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: '600',
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photography Styles */}
              <div style={{ marginTop: '16px' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Photography Styles
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {photographer.styles.map((style) => (
                    <span
                      key={style}
                      style={{
                        fontSize: '13px',
                        padding: '6px 12px',
                        backgroundColor: '#f0f4ff',
                        color: '#667eea',
                        borderRadius: '6px',
                        fontWeight: '600',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                      }}
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Booking Card */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: '24px',
              }}
            >
              <div style={{ marginBottom: '28px' }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    margin: '0 0 8px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Starting Price
                </p>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#667eea',
                    margin: 0,
                  }}
                >
                  {photographer.pricePerHour}
                </h2>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '4px 0 0 0',
                  }}
                >
                  Per hour / Full day available
                </p>
              </div>

              <button
                style={{
                  width: '100%',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#764ba2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📅 Check Availability
              </button>

              <button
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: '1.5px solid #667eea',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f4ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                💬 Message Photographer
              </button>

              {/* Contact Info */}
              <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid #e2e8f0' }}>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 16px 0',
                  }}
                >
                  Contact Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a
                    href={`tel:${photographer.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f4ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <PhoneIcon style={{ width: '18px', height: '18px', color: '#667eea' }} />
                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
                      {photographer.phone}
                    </span>
                  </a>

                  <a
                    href={`mailto:${photographer.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f4ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <EnvelopeIcon style={{ width: '18px', height: '18px', color: '#667eea' }} />
                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
                      {photographer.email}
                    </span>
                  </a>
                </div>
              </div>

              {/* Verification Badges */}
              <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid #e2e8f0' }}>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 16px 0',
                  }}
                >
                  Verified
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon style={{ width: '18px', height: '18px', color: '#16a34a' }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Identity Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon style={{ width: '18px', height: '18px', color: '#16a34a' }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Portfolio Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon style={{ width: '18px', height: '18px', color: '#16a34a' }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Ratings Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}