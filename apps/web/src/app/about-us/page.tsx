'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AboutUsPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);
        }
      `}</style>

      {/* 1. Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          paddingTop: '4rem',
          paddingBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <div className="fade-in-up" style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 16px',
                borderRadius: '50px',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              <SparklesIcon style={{ width: '16px', height: '16px' }} />
              About Droooly
            </div>

            <h1
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '1rem',
                lineHeight: '1.2',
                letterSpacing: '-0.5px',
              }}
            >
              From Event Catering<br />to Daily Meal Plans
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                opacity: 0.95,
                lineHeight: '1.6',
                maxWidth: '650px',
                margin: '0 auto',
                fontWeight: '300',
                letterSpacing: '0.3px',
              }}
            >
              Connecting event organizers with exceptional catering services while helping caterers grow their business digitally.
            </p>
          </div>
        </div>
      </div>

      {/* 2. What is Droooly? */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            What is Droooly?
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6' }}>
            A unified platform connecting people with reliable food services—from event catering to daily meal subscriptions.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {[
            {
              title: 'For Customers',
              items: ['Find trusted caterers', 'Explore curated packages', 'Subscribe to daily meals'],
            },
            {
              title: 'For Caterers',
              items: ['Build digital presence', 'Manage menus & orders', 'Scale your business'],
            },
          ].map((section, idx) => (
            <div
              key={idx}
              className="value-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.25rem', margin: '0 0 1.25rem 0' }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: itemIdx !== section.items.length - 1 ? '10px' : 0,
                      color: '#6b7280',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    <CheckCircleIcon style={{ width: '18px', height: '18px', color: '#667eea', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The Problem We're Solving */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            The Problem We're Solving
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6' }}>
            The catering industry remains largely disorganized, creating friction for customers and small caterers.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { title: 'Limited Online Presence', desc: 'Most caterers lack professional digital platforms' },
            { title: 'No Standard Pricing', desc: 'Difficult to compare packages and services' },
            { title: 'Slow Discovery', desc: 'Time-consuming research required' },
            { title: 'Growth Challenges', desc: 'Small caterers struggle to scale' },
          ].map((problem, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '1.75rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                {problem.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{problem.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 & 5. Mission & Vision */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {[
            {
              title: 'Our Mission',
              desc: 'To simplify how people discover food services while enabling caterers to grow digitally.',
            },
            {
              title: 'Our Vision',
              desc: 'To become the go-to platform for catering and meal services across cities.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="value-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2.5rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
                {item.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. What We Offer */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            What We Offer
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6' }}>
            Comprehensive solutions for both customers and catering professionals.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { title: 'Catering Discovery', desc: 'Browse verified caterers with detailed profiles' },
            { title: 'Customizable Packages', desc: 'Tailored menu options for any event size' },
            { title: 'Meal Subscriptions', desc: 'Regular meal plans with flexible scheduling' },
            { title: 'Order Management', desc: 'Streamlined booking and order tracking' },
            { title: 'Growth Tools', desc: 'Analytics and business management features' },
            { title: 'Dedicated Support', desc: '24/7 customer service and resolution' },
          ].map((offer, idx) => (
            <div
              key={idx}
              className="value-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '1.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                {offer.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{offer.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Why Droooly? */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            Why Choose Droooly?
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { title: 'Curated Caterers', desc: 'Verified partners with proven records' },
            { title: 'Transparent Pricing', desc: 'No hidden fees, clear costs' },
            { title: 'Easy Comparison', desc: 'Side-by-side menu & price review' },
            { title: 'Flexible Packages', desc: 'Options for every budget' },
            { title: 'Reliable Service', desc: 'Quality and professional execution' },
            { title: 'Secure Payments', desc: 'Safe transactions with protection' },
          ].map((reason, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '1.5rem',
                border: '1.5px solid #e5e7eb',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#667eea', marginBottom: '0.4rem', margin: '0 0 0.4rem 0' }}>
                {reason.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Digitalizing an Unorganized Sector */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            Digitalizing the Industry
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6' }}>
            Bringing structure, transparency, and scalability to a traditionally offline industry.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { title: 'Standardized Menus', desc: 'Professional menu templates' },
            { title: 'Package-Based Offerings', desc: 'Structured service tiers' },
            { title: 'Better Visibility', desc: 'Equal exposure for all caterers' },
            { title: 'Enhanced UX', desc: 'Seamless booking experience' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '1.75rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                {item.title}
              </h4>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Expansion Vision */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            Our Expansion Vision
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6' }}>
            Expanding across regions with diverse cuisines and service formats.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { title: 'More Cities', desc: 'Growing presence across regions' },
            { title: 'Diverse Cuisines', desc: 'Supporting all culinary traditions' },
            { title: 'More Service Formats', desc: 'Events, subscriptions, corporate catering' },
          ].map((vision, idx) => (
            <div
              key={idx}
              className="value-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                {vision.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.5', fontSize: '13px', margin: 0 }}>{vision.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Trust & Credibility */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            Trust & Credibility
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { title: 'Verified Partners', desc: 'All caterers undergo thorough verification' },
            { title: 'Customer-First', desc: 'Buyer protection and dispute resolution' },
            { title: 'Reliable Support', desc: '24/7 customer service' },
          ].map((trust, idx) => (
            <div
              key={idx}
              className="value-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                {trust.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{trust.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Founder Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            About the Founder
          </h2>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '3rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem',
                fontWeight: '800',
                border: '4px solid white',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
              }}
            >
              SV
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
              Satyanarayana Vanukuru
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#667eea', fontWeight: '600', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
              Founder
            </p>
          </div>

          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '14.5px', marginBottom: '1.25rem', margin: '0 0 1.25rem 0' }}>
            I started Droooly after seeing how difficult it is to find reliable catering services and how many great caterers struggle to grow without digital tools.
          </p>

          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '14.5px', marginBottom: '1.25rem', margin: '0 0 1.25rem 0' }}>
            With a background in tech and product building, I wanted to create a platform that brings structure to this space—making it easier for customers to discover options and for caterers to scale their business.
          </p>

          <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '14.5px', margin: 0 }}>
            Droooly is my attempt to simplify the entire catering experience, removing friction for both sides and enabling meaningful growth.
          </p>
        </div>
      </div>

      {/* 12. Final CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3.5rem 20px',
          marginTop: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.95, marginBottom: '2rem', maxWidth: '550px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            Join thousands discovering amazing caterers or help your business reach new heights.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/caterers"
              style={{
                padding: '12px 28px',
                backgroundColor: 'white',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.12)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.12)';
              }}
            >
              Explore Caterers
            </Link>

            <Link
              href="/become-caterer"
              style={{
                padding: '12px 28px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div style={{ height: '2rem' }} />
    </main>
  );
}