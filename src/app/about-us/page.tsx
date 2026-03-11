'use client';

import React from 'react';

export default function AboutUsPage() {
  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f97316', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <div className="max-w-7xl px-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>About CaterHub</h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Connecting event organizers with exceptional catering services worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem' }}>
        {/* Mission Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            border: '1px solid #e5e7eb',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            Our Mission
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.5rem' }}>
            At CaterHub, we believe that every event deserves exceptional catering. Our mission is to simplify the process of finding and booking the perfect catering service, making it easier for event organizers to create memorable culinary experiences for their guests.
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '1rem' }}>
            We connect talented caterers with customers who appreciate quality food and professional service. By providing a transparent platform for discovery, comparison, and booking, we've made catering more accessible than ever.
          </p>
        </div>

        {/* Story Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            border: '1px solid #e5e7eb',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            Our Story
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.5rem' }}>
            CaterHub was founded in 2020 by a group of event planning enthusiasts who recognized a gap in the market. They saw how difficult it was for event organizers to discover, compare, and book catering services. Traditional methods involved countless phone calls, emails, and uncertainty about quality.
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '1rem' }}>
            Today, CaterHub serves thousands of customers worldwide and partners with hundreds of professional caterers. We're proud to have facilitated over 50,000 successful events since our launch.
          </p>
        </div>

        {/* Values Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
            Our Values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Excellence', description: 'We maintain the highest standards in service and support' },
              { title: 'Transparency', description: 'Open communication and honest pricing without hidden fees' },
              { title: 'Innovation', description: 'Continuously improving our platform with new features' },
              { title: 'Community', description: 'Building a supportive ecosystem for caterers and customers' },
            ].map((value, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                  {value.title}
                </h3>
                <p style={{ color: '#6b7280' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            Our Team
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '1rem' }}>
            Our dedicated team of event specialists, developers, and customer service professionals work tirelessly to ensure every user has an exceptional experience on CaterHub. We're passionate about food, events, and making your life easier.
          </p>
        </div>
      </div>
    </main>
  );
}