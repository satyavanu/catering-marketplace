'use client';

import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Users, Calendar } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
  popular: boolean;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Wedding Catering',
    description: 'Premium catering services for your special day. From intimate ceremonies to grand receptions.',
    count: 245,
    icon: '💍',
    color: '#ec4899',
    bgColor: '#fce7f3',
    popular: true,
  },
  {
    id: 2,
    name: 'Corporate Catering',
    description: 'Professional catering for business events, conferences, and corporate meetings.',
    count: 189,
    icon: '🏢',
    color: '#667eea',
    bgColor: '#ede9fe',
    popular: false,
  },
  {
    id: 3,
    name: 'Birthday Catering',
    description: 'Fun and festive catering for birthday celebrations of all sizes.',
    count: 167,
    icon: '🎂',
    color: '#f97316',
    bgColor: '#ffedd5',
    popular: true,
  },
  {
    id: 4,
    name: 'Private Chef',
    description: 'Exclusive private chef services for intimate dinners and special occasions.',
    count: 124,
    icon: '👨‍🍳',
    color: '#10b981',
    bgColor: '#dcfce7',
    popular: false,
  },
];

const popularEvents = [
  {
    id: 1,
    name: 'Wedding',
    icon: '💍',
    count: 1200,
    trend: '+15%',
    color: '#ec4899',
    bgColor: '#fce7f3',
    avgBudget: '₹2,50,000+',
    caterers: '245+',
  },
  {
    id: 2,
    name: 'Birthday',
    icon: '🎂',
    count: 856,
    trend: '+22%',
    color: '#f97316',
    bgColor: '#ffedd5',
    avgBudget: '₹50,000 - ₹1,50,000',
    caterers: '167+',
  },
  {
    id: 3,
    name: 'Corporate',
    icon: '🏢',
    count: 634,
    trend: '+18%',
    color: '#667eea',
    bgColor: '#ede9fe',
    avgBudget: '₹1,00,000 - ₹5,00,000',
    caterers: '189+',
  },
  {
    id: 4,
    name: 'House Party',
    icon: '🏠',
    count: 512,
    trend: '+25%',
    color: '#10b981',
    bgColor: '#dcfce7',
    avgBudget: '₹30,000 - ₹80,000',
    caterers: '156+',
  },
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activePopular, setActivePopular] = useState(0);

  const activeCategory = categories[activeTab];
  const activePopularEvent = popularEvents[activePopular];

  return (
    <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >
            Explore by Category
          </h2>
          <p
            style={{
              color: '#6b7280',
              fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Find the perfect catering service for your event type
          </p>
        </div>

        {/* Popular Events Strip */}
        <div
          style={{
            marginBottom: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <TrendingUp size={16} color="#f97316" />
            Popular Events
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {popularEvents.map((event, index) => (
              <button
                key={event.id}
                onClick={() => setActivePopular(index)}
                style={{
                  padding: '1.25rem',
                  backgroundColor: activePopular === index ? event.bgColor : 'white',
                  border: activePopular === index ? `2px solid ${event.color}` : '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = event.color;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${event.color}20`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (activePopular !== index) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '1.75rem' }}>{event.icon}</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: event.color,
                      backgroundColor: event.bgColor,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                    }}
                  >
                    {event.trend}
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  {event.name}
                </h4>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    margin: '0 0 0.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Calendar size={12} />
                  {event.count} Events
                </p>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    margin: '0 0 0.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Users size={12} />
                  {event.caterers} Caterers
                </p>

                <p
                  style={{
                    fontSize: '0.75rem',
                    color: event.color,
                    margin: 0,
                    fontWeight: '600',
                  }}
                >
                  Avg. Budget: {event.avgBudget}
                </p>
              </button>
            ))}
          </div>

          {/* Selected Popular Event Details */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Now Showing: <strong>{activePopularEvent.name} Events</strong>
              </p>
              <p
                style={{
                  color: '#999',
                  fontSize: '0.8rem',
                  margin: '0.25rem 0 0 0',
                }}
              >
                {activePopularEvent.count} events booked this month
              </p>
            </div>
            <button
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: activePopularEvent.color,
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              Browse Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(index)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: activeTab === index ? 'none' : `2px solid ${category.color}20`,
                  backgroundColor:
                    activeTab === index ? category.color : category.bgColor + '40',
                  color: activeTab === index ? 'white' : category.color,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow:
                    activeTab === index ? `0 4px 12px ${category.color}25` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.borderColor = category.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.borderColor = category.color + '20';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                <span>{category.name}</span>
                {category.popular && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor: '#fbbf24',
                      color: '#78350f',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontWeight: '700',
                      marginLeft: '0.25rem',
                    }}
                  >
                    HOT
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            border: `2px solid ${activeCategory.bgColor}`,
            boxShadow: `0 8px 24px ${activeCategory.color}15`,
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                lineHeight: '1',
                backgroundColor: activeCategory.bgColor,
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'fit-content',
              }}
            >
              {activeCategory.icon}
            </div>

            {/* Content */}
            <div>
              <h3
                style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  lineHeight: '1.3',
                }}
              >
                {activeCategory.name}
              </h3>

              <p
                style={{
                  color: '#6b7280',
                  marginBottom: '1rem',
                  lineHeight: '1.6',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                }}
              >
                {activeCategory.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  marginTop: '1.25rem',
                }}
              >
                <div>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      margin: 0,
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Available Caterers
                  </p>
                  <p
                    style={{
                      color: activeCategory.color,
                      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                      fontWeight: 'bold',
                      margin: '0.25rem 0 0 0',
                    }}
                  >
                    {activeCategory.count}+
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      margin: 0,
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Average Rating
                  </p>
                  <p
                    style={{
                      color: activeCategory.color,
                      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                      fontWeight: 'bold',
                      margin: '0.25rem 0 0 0',
                    }}
                  >
                    4.8 ⭐
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              style={{
                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                backgroundColor: activeCategory.color,
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                height: 'fit-content',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 16px ${activeCategory.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Browse
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            marginTop: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { label: 'Total Caterers', value: '1200+', icon: '👨‍🍳' },
            { label: 'Cuisines Available', value: '50+', icon: '🍽️' },
            { label: 'Cities Covered', value: '15+', icon: '🌆' },
            { label: 'Happy Customers', value: '10000+', icon: '😊' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '2rem', margin: 0, marginBottom: '0.5rem' }}>
                {stat.icon}
              </p>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  color: '#667eea',
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  margin: '0.5rem 0 0 0',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
};

export default CategoryTabs;