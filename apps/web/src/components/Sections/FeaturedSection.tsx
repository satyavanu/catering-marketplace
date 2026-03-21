'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, FireIcon, CheckIcon, TruckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export interface FeaturedItem {
  id: number | string;
  title: string;
  image: string;
  rating?: number;
  reviews?: number;
  description?: string;
  pricePerPerson?: string;
  guestCount?: string;
  tags?: string[];
  included?: string[];
  whyLoveIt?: { icon: string; text: string }[];
  occasions?: string[];
  [key: string]: any;
}

interface FeaturedSectionProps<T extends FeaturedItem> {
  title: string;
  subtitle?: string;
  description?: string;
  items: T[];
  cardComponent: React.ComponentType<{ item: T }>;
  itemsPerView?: number;
  accentColor?: string;
  backgroundColor?: string;
  displayMode?: 'carousel' | 'featured'; // carousel for multiple items, featured for single showcase
}

const FeaturedSection = React.forwardRef<HTMLDivElement, FeaturedSectionProps<any>>(
  ({
    title,
    subtitle,
    description,
    items,
    cardComponent: CardComponent,
    itemsPerView = 3,
    accentColor = '#f59e0b',
    backgroundColor = 'white',
    displayMode = 'carousel',
  }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const maxIndex = Math.max(0, items.length - itemsPerView);

    const handlePrevious = () => {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    const visibleItems = items.slice(currentIndex, currentIndex + itemsPerView);
    const featuredItem = items[0]; // For featured mode, use first item

    // Featured Display Mode
    if (displayMode === 'featured' && featuredItem) {
      return (
        <div ref={ref} style={{ marginBottom: '80px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1e293b',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                letterSpacing: '-0.5px',
              }}
            >
              <SparklesIcon style={{ width: '36px', height: '36px', color: accentColor }} />
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Premium Featured Card */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: `0 12px 48px ${accentColor}26`,
              border: `2px solid ${accentColor}20`,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 24px 64px ${accentColor}33`;
              e.currentTarget.style.transform = 'translateY(-6px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 48px ${accentColor}26`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0,
                minHeight: '550px',
              }}
            >
              {/* Left Side - Image */}
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#e2e8f0',
                }}
              >
                <img
                  src={featuredItem.image}
                  alt={featuredItem.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.transform = 'scale(1.06)';
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.transform = 'scale(1)';
                  }}
                />

                {/* Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    backgroundColor: accentColor,
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 10,
                    boxShadow: `0 8px 24px ${accentColor}64`,
                  }}
                >
                  <FireIcon style={{ width: '18px', height: '18px' }} />
                  Most Popular
                </div>
              </div>

              {/* Right Side - Content */}
              <div
                style={{
                  padding: '56px 48px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: `${accentColor}08`,
                }}
              >
                {/* Header Section */}
                <div>
                  {/* Label */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '800',
                        color: accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '1.2px',
                      }}
                    >
                      {subtitle || '👨‍🍳 Premium Service'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '36px',
                      fontWeight: '900',
                      color: '#1e293b',
                      margin: '0 0 12px 0',
                      lineHeight: '1.2',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {featuredItem.title}
                  </h3>

                  {/* Rating */}
                  {featuredItem.rating && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '28px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '18px',
                              opacity: i < Math.floor(featuredItem.rating) ? 1 : 0.3,
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#64748b',
                          fontWeight: '700',
                        }}
                      >
                        {featuredItem.rating}/5 ({featuredItem.reviews || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Main Description */}
                  {featuredItem.description && (
                    <p
                      style={{
                        fontSize: '16px',
                        color: '#475569',
                        lineHeight: '1.8',
                        margin: '0 0 28px 0',
                        fontWeight: '500',
                      }}
                    >
                      {featuredItem.description}
                    </p>
                  )}

                  {/* What's Included */}
                  {featuredItem.included && featuredItem.included.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: '#1e293b',
                          margin: '0 0 14px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}
                      >
                        ✓ What's Included
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {featuredItem.included.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '14px',
                              color: '#475569',
                              fontWeight: '500',
                            }}
                          >
                            <CheckIcon
                              style={{
                                width: '18px',
                                height: '18px',
                                color: accentColor,
                                flexShrink: 0,
                              }}
                            />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Perfect For */}
                  {featuredItem.occasions && featuredItem.occasions.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: '#1e293b',
                          margin: '0 0 12px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}
                      >
                        🎉 Perfect For
                      </h4>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {featuredItem.occasions.map((occasion, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '13px',
                              padding: '8px 14px',
                              backgroundColor: `${accentColor}15`,
                              color: accentColor,
                              borderRadius: '8px',
                              fontWeight: '700',
                              border: `1px solid ${accentColor}30`,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = accentColor;
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = `${accentColor}15`;
                              e.currentTarget.style.color = accentColor;
                            }}
                          >
                            {occasion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Why You'll Love It */}
                  {featuredItem.whyLoveIt && featuredItem.whyLoveIt.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: '#1e293b',
                          margin: '0 0 14px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}
                      >
                        💫 Why You'll Love It
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {featuredItem.whyLoveIt.map((benefit, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: '13px',
                              color: '#475569',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>{benefit.icon}</span>
                            {benefit.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Section - Location & Pricing */}
                <div>
                  {/* Service Area */}
                  {featuredItem.guestCount && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: `2px solid ${accentColor}20`,
                        backgroundColor: `${accentColor}08`,
                        padding: '14px',
                        borderRadius: '10px',
                        marginLeft: '-14px',
                        marginRight: '-14px',
                        paddingLeft: '14px',
                      }}
                    >
                      <TruckIcon
                        style={{
                          width: '20px',
                          height: '20px',
                          color: accentColor,
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#94a3b8',
                            margin: '0 0 6px 0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          📍 Service Area & Delivery
                        </p>
                        <p
                          style={{
                            fontSize: '15px',
                            color: '#475569',
                            fontWeight: '600',
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Serving {featuredItem.guestCount} guests at your venue. Full delivery, setup, and on-site coordination included
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pricing & CTA */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.2fr',
                      gap: '20px',
                      alignItems: 'center',
                    }}
                  >
                    {featuredItem.pricePerPerson && (
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            margin: '0 0 8px 0',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                          }}
                        >
                          Starting From
                        </p>
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            color: accentColor,
                            lineHeight: '1',
                          }}
                        >
                          {featuredItem.pricePerPerson}
                        </div>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#64748b',
                            margin: '6px 0 0 0',
                            fontWeight: '600',
                          }}
                        >
                          per person
                        </p>
                      </div>
                    )}

                    <button
                      style={{
                        backgroundColor: accentColor,
                        color: 'white',
                        border: 'none',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        letterSpacing: '0.5px',
                        boxShadow: `0 8px 20px ${accentColor}40`,
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 12px 28px ${accentColor}56`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}40`;
                      }}
                    >
                      Get Custom Quote
                      <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Carousel Display Mode (original)
    return (
      <div ref={ref} style={{ marginBottom: '80px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1e293b',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                letterSpacing: '-0.5px',
              }}
            >
              <SparklesIcon style={{ width: '36px', height: '36px', color: accentColor }} />
              {title}
            </h2>
            {description && (
              <p
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Navigation Arrows */}
          {items.length > itemsPerView && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: `2px solid ${accentColor}`,
                  backgroundColor: currentIndex === 0 ? '#f0f0f0' : backgroundColor,
                  color: currentIndex === 0 ? '#cbd5e1' : accentColor,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  opacity: currentIndex === 0 ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentIndex !== 0) {
                    e.currentTarget.style.backgroundColor = `${accentColor}10`;
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = backgroundColor;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: `2px solid ${accentColor}`,
                  backgroundColor: currentIndex >= maxIndex ? '#f0f0f0' : backgroundColor,
                  color: currentIndex >= maxIndex ? '#cbd5e1' : accentColor,
                  cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  opacity: currentIndex >= maxIndex ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentIndex < maxIndex) {
                    e.currentTarget.style.backgroundColor = `${accentColor}10`;
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = backgroundColor;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`,
            gap: '28px',
            overflow: 'hidden',
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                animation: 'fadeIn 0.5s ease-in-out',
                opacity: 1,
              }}
            >
              <CardComponent item={item} />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {items.length > itemsPerView && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '40px',
            }}
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: currentIndex === index ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: currentIndex === index ? accentColor : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (currentIndex !== index) {
                    e.currentTarget.style.backgroundColor = `${accentColor}80`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentIndex !== index) {
                    e.currentTarget.style.backgroundColor = '#cbd5e1';
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* CSS Animation */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
);

FeaturedSection.displayName = 'FeaturedSection';

export default FeaturedSection;