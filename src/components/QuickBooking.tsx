'use client';

import React from 'react';
import Image from 'next/image';

const  QuickBooking = () => {
  return (
    <section
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: '#ffffff'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}
      >
        {/* TEXT + IMAGE COLUMN FOR MOBILE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <TextBlock />
          <HeroImage />
        </div>

        {/* QUICK BOOKING (mobile only) */}

        {/* TABLET+ DESKTOP LAYOUT */}
        <div className="tablet-desktop">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              alignItems: 'center',
              gap: '3rem',
            }}
          >
            <div>
              <TextBlock />
              <SocialProof />
            </div>
          </div>
        </div>

        <style>
          {`
          @media (min-width: 768px) {
            .mobile-only { display: none; }
            .tablet-desktop { display: block; }
          }

          @media (max-width: 767px) {
            .mobile-only { display: block; }
            .tablet-desktop { display: none; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ---------------------- ATOMIC COMPONENTS ---------------------- */

function TextBlock() {
  return (
    <div style={{ maxWidth: '520px' }}>
      <h1
        style={{
          fontSize: '2.4rem',
          lineHeight: '1.2',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '1rem',
        }}
      >
        Book a Chef
        <br /> or Meal in
        <br /> <span style={{ color: '#ff6a2e' }}>30 seconds</span>
      </h1>

      <p
        style={{
          fontSize: '1.05rem',
          color: '#475569',
          lineHeight: '1.5',
          maxWidth: '400px',
        }}
      >
        Instant pricing. Verified chefs. Hassle‑free booking.
      </p>

      <SocialProof isMobile />
    </div>
  );
}

function SocialProof({ isMobile = false }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: isMobile ? '1rem' : '2rem',
      }}
    >
      <Image
        alt="customer group"
        src="/images/customers.png"
        width={90}
        height={40}
      />

      <p style={{ margin: 0, color: '#475569', fontWeight: 500 }}>
        <span style={{ fontWeight: 700 }}>10K+</span> happy customers
      </p>

      {!isMobile && (
        <p
          style={{
            margin: 0,
            marginLeft: '0.75rem',
            color: '#475569',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          ⭐ <span style={{ fontWeight: 700 }}>4.8</span> average rating
        </p>
      )}
    </div>
  );
}

function HeroImage() {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '1rem',
      }}
    >
      <Image
        src="/images/food-hero-main.png"
        alt="Droooly meals"
        width={800}
        height={600}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '1rem',
        }}
      />
    </div>
  );
}

export default QuickBooking;
