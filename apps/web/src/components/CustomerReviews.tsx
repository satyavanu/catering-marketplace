'use client';

import React, { useState } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  service: string;
  image?: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: 'Sarah Johnson',
    rating: 5,
    text: 'Absolutely fantastic! The food was delicious and the service was impeccable. Highly recommended!',
    service: 'Elegant Events Catering',
  },
  {
    id: 2,
    author: 'Michael Chen',
    rating: 5,
    text: 'Best corporate catering we have used. Professional, on-time, and the food was amazing.',
    service: 'Mediterranean Bites',
  },
  {
    id: 3,
    author: 'Emily Rodriguez',
    rating: 4,
    text: 'Great selection of vegetarian options. Would definitely book again for our next event.',
    service: 'Farm to Table Delights',
  },
  {
    id: 4,
    author: 'David Thompson',
    rating: 5,
    text: 'Outstanding quality and attention to detail. Made our wedding reception unforgettable!',
    service: 'Elegant Events Catering',
  },
  {
    id: 5,
    author: 'Jessica Lee',
    rating: 4,
    text: 'Excellent variety and fresh ingredients. The team was very accommodating with our dietary restrictions.',
    service: 'Spice Route Kitchen',
  },
  {
    id: 6,
    author: 'Robert Martinez',
    rating: 5,
    text: 'Premium service at reasonable prices. Would definitely recommend to anyone planning an event.',
    service: 'Grill Master BBQ',
  },
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayCount] = useState(2); // Show 2 reviews by default

  const totalSlides = Math.ceil(mockReviews.length / displayCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const getVisibleReviews = () => {
    const startIndex = currentIndex * displayCount;
    return mockReviews.slice(startIndex, startIndex + displayCount);
  };

  return (
    <section id="reviews" style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' }}>
      <div className="max-w-7xl px-4">
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Customer Reviews
          </h2>
          <p style={{ color: '#6b7280' }}>
            See what our customers are saying
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          {/* Reviews Grid */}
          <div className="grid grid-2">
            {getVisibleReviews().map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb',
                }}
              >
                {/* Author and Rating */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: '#f97316',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                      }}
                    >
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                        {review.author}
                      </h3>
                      <div style={{ color: '#fbbf24', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        {'★'.repeat(review.rating)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>

                {/* Service Name */}
                <p style={{ color: '#f97316', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {review.service}
                </p>
              </div>
            ))}
          </div>

          {/* Carousel Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
              title="Previous reviews"
            >
              ←
            </button>

            {/* Indicators */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '50%',
                    backgroundColor: index === currentIndex ? '#f97316' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
              title="Next reviews"
            >
              →
            </button>
          </div>

          {/* Slide Counter */}
          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Slide {currentIndex + 1} of {totalSlides}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;