'use client';

import React, { useState } from 'react';
import { CheckCircle, Users, Heart, Shield, Clock, Zap } from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      number: '1️⃣',
      title: 'Tell Us Your Event',
      description: 'Share your event details - type, guest count, location, and budget in just 30 seconds.',
      details: [
        'Select event type (Wedding, Corporate, Birthday, etc.)',
        'Enter number of guests',
        'Choose your location',
        'Set your budget range',
      ],
      icon: '📋',
      color: '#667eea',
      bgColor: '#ede9fe',
    },
    {
      id: 2,
      number: '2️⃣',
      title: 'Compare Caterers',
      description: 'Browse verified caterers, check menus, read reviews, and compare prices instantly.',
      details: [
        'View detailed profiles & portfolios',
        'Check real customer reviews & ratings',
        'Compare pricing & menu options',
        'See availability in real-time',
      ],
      icon: '🔍',
      color: '#ec4899',
      bgColor: '#fce7f3',
    },
    {
      id: 3,
      number: '3️⃣',
      title: 'Book & Enjoy 🎉',
      description: 'Confirm your booking, get instant confirmation, and relax while we handle the rest.',
      details: [
        'Secure booking confirmation',
        'Direct communication with caterer',
        'Payment options (pay now or later)',
        '24/7 customer support',
      ],
      icon: '✨',
      color: '#10b981',
      bgColor: '#dcfce7',
    },
  ];

  const features = [
    { icon: <Shield size={24} />, title: '100% Verified', description: 'All caterers are background checked' },
    { icon: <Clock size={24} />, title: 'Fast Booking', description: 'Get confirmed in minutes' },
    { icon: <Heart size={24} />, title: 'Best Value', description: 'Transparent pricing, no hidden costs' },
    { icon: <Zap size={24} />, title: '24/7 Support', description: 'Always here to help' },
  ];

  return (
    <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Three simple steps to find your perfect caterer and plan an amazing event
          </p>
        </div>

        {/* Steps Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => setActiveStep(index)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Connector Line (Desktop Only) */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100px',
                    left: 'calc(100% + 1rem)',
                    width: 'calc(100% + 2rem)',
                    height: '3px',
                    backgroundColor: '#e5e7eb',
                    zIndex: 0,
                    display: window.innerWidth > 768 ? 'block' : 'none',
                  }}
                />
              )}

              {/* Card */}
              <div
                style={{
                  backgroundColor: activeStep === index ? 'white' : '#f3f4f6',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: activeStep === index ? `2px solid ${step.color}` : '2px solid #e5e7eb',
                  boxShadow:
                    activeStep === index
                      ? `0 10px 30px ${step.color}20`
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Step Number with Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      lineHeight: '1',
                    }}
                  >
                    {step.number}
                  </div>
                  <div
                    style={{
                      fontSize: '2.5rem',
                      backgroundColor: step.bgColor,
                      borderRadius: '0.75rem',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '60px',
                      height: '60px',
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.75rem',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6',
                  }}
                >
                  {step.description}
                </p>

                {/* Details List */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: activeStep === index ? 'block' : 'none',
                    animation: activeStep === index ? 'slideDown 0.3s ease-out' : 'none',
                  }}
                >
                  {step.details.map((detail, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        marginBottom: idx !== step.details.length - 1 ? '0.75rem' : 0,
                        fontSize: '0.875rem',
                        color: '#4b5563',
                      }}
                    >
                      <CheckCircle
                        size={18}
                        style={{
                          color: step.color,
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Call to Action Button */}
                <button
                  style={{
                    marginTop: activeStep === index ? '1.5rem' : '0',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: step.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: activeStep === index ? 1 : 0,
                    display: activeStep === index ? 'block' : 'none',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${step.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Step Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}
        >
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              style={{
                width: index === activeStep ? '32px' : '12px',
                height: '12px',
                backgroundColor: index === activeStep ? '#667eea' : '#d1d5db',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Features Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            Why Choose Us?
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ede9fe',
                    borderRadius: '0.75rem',
                    color: '#667eea',
                    marginBottom: '1rem',
                  }}
                >
                  {feature.icon}
                </div>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem',
                  }}
                >
                  {feature.title}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '1rem',
            padding: '2.5rem',
            color: 'white',
          }}
        >
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
            }}
          >
            Ready to Plan Your Event? 🎉
          </h3>
          <p style={{ marginBottom: '1.5rem', opacity: 0.95 }}>
            Start getting catering quotes in less than a minute
          </p>
          <button
            style={{
              padding: '0.875rem 2.5rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
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
            Get Started Now →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .connector-line {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;