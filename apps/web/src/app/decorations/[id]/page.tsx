'use client';

import React, { useState } from 'react';
import { useDecorationById } from '@catering-marketplace/query-client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StarIcon, HeartIcon, CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function DecorationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: decoration, isLoading, error } = useDecorationById(id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', date: '', message: '' });
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading decoration details...</div>;
  if (error || !decoration) return <div style={{ padding: '2rem', textAlign: 'center' }}>Decoration not found</div>;

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      author: 'Sarah Johnson',
      rating: 5,
      date: 'March 15, 2024',
      text: 'Absolutely stunning decorations! The team was professional and the setup was flawless. Highly recommend!',
      verified: true,
    },
    {
      id: 2,
      author: 'Michael Chen',
      rating: 4.5,
      date: 'March 10, 2024',
      text: 'Great quality and attention to detail. The customization options were amazing. Would use again!',
      verified: true,
    },
    {
      id: 3,
      author: 'Emily Rodriguez',
      rating: 5,
      date: 'March 5, 2024',
      text: 'Perfect for our wedding! The decorations exceeded our expectations. Thank you so much!',
      verified: true,
    },
  ];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quote submitted:', quoteForm);
    setShowQuoteModal(false);
    setQuoteForm({ name: '', email: '', date: '', message: '' });
    alert('Quote request sent! We will contact you soon.');
  };

  const handleBook = () => {
    alert(`Booking ${decoration.name} - Redirecting to checkout...`);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 32px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <Link href="/decorations" style={{ color: '#667eea', textDecoration: 'none' }}>
            Decorations
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <Link href={`/decorations/by-type/${encodeURIComponent(decoration.type)}`} style={{ color: '#667eea', textDecoration: 'none' }}>
            {decoration.type}
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#64748b', fontWeight: '600' }}>{decoration.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Image Section */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#e2e8f0',
              }}
            >
              <img
                src={decoration.image}
                alt={decoration.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'white',
                  border: 'none',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <HeartIcon
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isFavorite ? '#ef4444' : '#94a3b8',
                    fill: isFavorite ? '#ef4444' : 'none',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {decoration.theme}
                </span>
                <span
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#667eea',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <MapPinIcon style={{ width: '14px', height: '14px' }} />
                  {decoration.country}
                </span>
              </div>

              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 8px 0',
                }}
              >
                {decoration.name}
              </h1>

              <p
                style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: '0 0 16px 0',
                }}
              >
                By {decoration.company}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarIcon style={{ width: '20px', height: '20px', color: '#f59e0b', fill: '#f59e0b' }} />
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                    {decoration.rating}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>
                    ({decoration.reviews} reviews)
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '16px',
                  color: '#475569',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                }}
              >
                {decoration.details}
              </p>
            </div>

            {/* Price Section */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                }}
              >
                Starting Price
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#667eea',
                  margin: 0,
                }}
              >
                {decoration.price}
              </p>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '16px',
                }}
              >
                What's Included
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['Professional Setup', 'Installation', 'Customization', 'Support'].map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#10b981',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setShowQuoteModal(true)}
                style={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
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
                Request Quote
              </button>

              <button
                onClick={handleBook}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#764ba2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                backgroundColor: activeTab === 'overview' ? '#f8fafc' : 'white',
                color: activeTab === 'overview' ? '#667eea' : '#64748b',
                border: 'none',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: activeTab === 'overview' ? '2px solid #667eea' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                backgroundColor: activeTab === 'reviews' ? '#f8fafc' : 'white',
                color: activeTab === 'reviews' ? '#667eea' : '#64748b',
                border: 'none',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: activeTab === 'reviews' ? '2px solid #667eea' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Reviews ({decoration.reviews})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'overview' && (
              <div>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '16px',
                  }}
                >
                  About This Service
                </h2>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8', marginBottom: '24px' }}>
                  {decoration.details}
                </p>

                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '16px',
                  }}
                >
                  Perfect For
                </h3>
                <ul
                  style={{
                    fontSize: '14px',
                    color: '#475569',
                    lineHeight: '1.8',
                    paddingLeft: '20px',
                  }}
                >
                  <li>Weddings & Engagements</li>
                  <li>Corporate Events</li>
                  <li>Birthday Parties</li>
                  <li>Anniversaries</li>
                  <li>Custom Events</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginBottom: '32px' }}>
                    {/* Rating Summary */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                        {decoration.rating}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            style={{
                              width: '16px',
                              height: '16px',
                              color: i < Math.floor(decoration.rating) ? '#f59e0b' : '#cbd5e1',
                              fill: i < Math.floor(decoration.rating) ? '#f59e0b' : 'none',
                            }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>Based on {decoration.reviews} reviews</p>
                    </div>

                    {/* Rating Breakdown */}
                    <div>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '13px', color: '#64748b', width: '20px' }}>{rating}</span>
                          <StarIcon style={{ width: '14px', height: '14px', color: '#f59e0b', fill: '#f59e0b' }} />
                          <div
                            style={{
                              flex: 1,
                              height: '6px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                backgroundColor: '#f59e0b',
                                width: `${rating === 5 ? 85 : rating === 4 ? 10 : rating === 3 ? 3 : rating === 2 ? 1.5 : 0.5}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '16px',
                    }}
                  >
                    Customer Reviews
                  </h3>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        paddingBottom: '20px',
                        marginBottom: '20px',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            {review.author}
                            {review.verified && (
                              <span style={{ marginLeft: '8px', color: '#10b981' }}>✓ Verified</span>
                            )}
                          </p>
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{review.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            style={{
                              width: '14px',
                              height: '14px',
                              color: i < review.rating ? '#f59e0b' : '#cbd5e1',
                              fill: i < review.rating ? '#f59e0b' : 'none',
                            }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '24px',
              }}
            >
              Request a Quote
            </h2>

            <form onSubmit={handleQuoteSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '6px',
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '6px',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '6px',
                  }}
                >
                  Event Date
                </label>
                <input
                  type="date"
                  required
                  value={quoteForm.date}
                  onChange={(e) => setQuoteForm({ ...quoteForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '6px',
                  }}
                >
                  Message
                </label>
                <textarea
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Tell us about your event..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Send Quote Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}