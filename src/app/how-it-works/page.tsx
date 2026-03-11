'use client';

import React from 'react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Search & Discover',
      description: 'Browse through our extensive collection of caterers filtered by cuisine, location, event type, and budget.',
      icon: '🔍',
    },
    {
      number: '2',
      title: 'View Profiles & Menus',
      description: 'Explore detailed caterer profiles, check their menus, ratings, reviews, and special offerings.',
      icon: '👁️',
    },
    {
      number: '3',
      title: 'Check Availability',
      description: 'Verify availability for your event date and check minimum guest requirements.',
      icon: '📅',
    },
    {
      number: '4',
      title: 'Book & Preorder',
      description: 'Select your preferred menu, specify guest count, and submit your booking request.',
      icon: '📋',
    },
    {
      number: '5',
      title: 'Confirm Details',
      description: 'Review and confirm all details with the caterer. Discuss any customizations or special requests.',
      icon: '✅',
    },
    {
      number: '6',
      title: 'Enjoy Your Event',
      description: 'Sit back and enjoy your perfectly catered event. Leave a review to help other customers.',
      icon: '🎉',
    },
  ];

  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f97316', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <div className="max-w-7xl px-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>How It Works</h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Simple steps to find and book the perfect catering service for your event
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem' }}>
        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 1rem',
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f97316',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  margin: '-1.5rem auto 1rem',
                  fontSize: '1.125rem',
                }}
              >
                {step.number}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                {step.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            border: '1px solid #e5e7eb',
            marginBottom: '4rem',
          }}
        >
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>
            Why Choose CaterHub?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '⭐', title: 'Verified Caterers', description: 'All caterers are verified and reviewed by real customers' },
              { icon: '💰', title: 'Best Prices', description: 'Compare prices and get the best deal for your budget' },
              { icon: '🔒', title: 'Secure Booking', description: 'Safe and secure payment processing for your peace of mind' },
              { icon: '📞', title: '24/7 Support', description: 'Our customer support team is always here to help' },
              { icon: '🎯', title: 'Wide Selection', description: 'Choose from hundreds of caterers across multiple cuisines' },
              { icon: '⚡', title: 'Quick Booking', description: 'Book your caterer in just a few minutes' },
            ].map((benefit, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                  {benefit.title}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}