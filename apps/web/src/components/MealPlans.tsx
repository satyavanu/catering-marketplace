'use client';

import React from 'react';
import { ArrowRight, Utensils, Calendar, Home } from 'lucide-react';
import Link from 'next/link';

const MealPlans = () => {
  const features = [
    {
      icon: <Calendar size={28} />,
      title: 'Weekly Plans',
      description: 'Customized meals delivered every week',
    },
    {
      icon: <Utensils size={28} />,
      title: 'Healthy Options',
      description: 'Nutritious meals tailored to your diet',
    },
    {
      icon: <Home size={28} />,
      title: 'Local Chefs',
      description: 'Fresh meals from home chefs near you',
    },
  ];

  return (
    <section
      style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            borderRadius: '1.5rem',
            padding: 'clamp(2rem, 8vw, 4rem)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            marginBottom: '4rem',
          }}
        >
          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '300px',
              height: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '250px',
              height: '250px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '50%',
              zIndex: 1,
            }}
          />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
                fontWeight: '800',
                marginBottom: '1rem',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              🍱 Looking for Daily Meals?
            </h2>
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto 2rem',
                fontWeight: '500',
                opacity: 0.95,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Explore weekly & monthly meal plans from home chefs.
            </p>
            <Link
              href="/meals"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: 'clamp(0.875rem, 2vw, 1.125rem) clamp(2rem, 5vw, 3rem)',
                backgroundColor: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                transition: 'all 0.3s ease',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                textDecoration: 'none',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.25)';
              }}
            >
              View Meal Plans
              <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#f9fafb',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#ede9fe',
                  borderRadius: '0.75rem',
                  color: '#667eea',
                  marginBottom: '1.5rem',
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.75rem',
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                {feature.description}
              </p>
            </div>
          ))}
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

        section {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default MealPlans;