'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  StarIcon,
  HeartIcon,
  CheckIcon,
  ArrowRightIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  FireIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapIcon,
  XMarkIcon,
  CreditCardIcon,
  BoltIcon,
  CheckCircleIcon,
  PrinterIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Generic Review Component with Sorting and Replies
interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  verified?: boolean;
  helpful?: number;
  replies?: Reply[];
}

interface Reply {
  id: string;
  name: string;
  text: string;
  date: string;
  avatar?: string;
  isOwner?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface SimilarExperience {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  pricePerPerson: number;
  tag: string;
}

interface SafetyInfo {
  icon: string;
  title: string;
  description: string;
}

type SortOption = 'recent' | 'rating-high' | 'rating-low' | 'helpful';

const FAQSection = ({ faqs }: { faqs: FAQ[] }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<Set<string>>(new Set());

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQ);
    newExpanded.has(faqId) ? newExpanded.delete(faqId) : newExpanded.add(faqId);
    setExpandedFAQ(newExpanded);
  };

  return (
    <div style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ❓ Frequently Asked Questions
      </h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              style={{
                width: '100%',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0, textAlign: 'left' }}>
                {faq.question}
              </h3>
              <span
                style={{
                  fontSize: '20px',
                  color: '#ec4899',
                  transition: 'transform 0.3s ease',
                  transform: expandedFAQ.has(faq.id) ? 'rotate(180deg)' : 'rotate(0)',
                }}
              >
                ▼
              </span>
            </button>

            {expandedFAQ.has(faq.id) && (
              <div
                style={{
                  padding: '0 20px 20px 20px',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SimilarExperiencesSection = ({ experiences }: { experiences: SimilarExperience[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(experiences.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(experiences.length / 3) - 1 : prev - 1));
  };

  return (
    <div style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ✨ Similar Experiences
      </h2>

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {experiences.slice(currentSlide * 3, (currentSlide + 1) * 3).map((exp) => (
            <div
              key={exp.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden',
                  backgroundColor: '#e2e8f0',
                }}
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#ec4899',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {exp.tag}
                </span>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}
                >
                  ⭐ {exp.rating}
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                  {exp.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '12px' }}>
                  📍 {exp.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#ec4899' }}>
                    ₹{exp.pricePerPerson.toLocaleString()}
                  </span>
                  <button
                    style={{
                      backgroundColor: '#fce7f3',
                      color: '#ec4899',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ec4899';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fce7f3';
                      e.currentTarget.style.color = '#ec4899';
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {experiences.length > 3 && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={prevSlide}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fce7f3';
                e.currentTarget.style.borderColor = '#ec4899';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              ←
            </button>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              {currentSlide + 1} of {Math.ceil(experiences.length / 3)}
            </span>
            <button
              onClick={nextSlide}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fce7f3';
                e.currentTarget.style.borderColor = '#ec4899';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PoliciesSection = ({ safetyInfo, cancellationPolicy }: { safetyInfo: SafetyInfo[]; cancellationPolicy: string }) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'cancellation'>('safety');

  return (
    <div style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0' }}>
        🛡️ Safety & Policies
      </h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('safety')}
          style={{
            padding: '12px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'safety' ? '#ec4899' : '#64748b',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            borderBottom: activeTab === 'safety' ? '2px solid #ec4899' : 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'safety') {
              e.currentTarget.style.color = '#ec4899';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'safety') {
              e.currentTarget.style.color = '#64748b';
            }
          }}
        >
          Safety Information
        </button>
        <button
          onClick={() => setActiveTab('cancellation')}
          style={{
            padding: '12px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'cancellation' ? '#ec4899' : '#64748b',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            borderBottom: activeTab === 'cancellation' ? '2px solid #ec4899' : 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'cancellation') {
              e.currentTarget.style.color = '#ec4899';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'cancellation') {
              e.currentTarget.style.color = '#64748b';
            }
          }}
        >
          Cancellation Policy
        </button>
      </div>
      {activeTab === 'safety' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {safetyInfo.map((info, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#fce7f3',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #fbbbf2',
                display: 'flex',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '28px' }}>{info.icon}</span>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                  {info.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                  {info.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'cancellation' && (
        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-line' }}>
            {cancellationPolicy}
          </p>
        </div>
      )}
    </div>
  );
};

const HostInfoSection = ({ hostInfo }: { hostInfo: { name: string; avatar: string; verified: boolean; yearsHosting: number; reviews: number; responseTime: string; bio: string } }) => {
  return (
    <div style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0' }}>
        👤 Meet Your Host
      </h2>
      <div
        style={{
          backgroundColor: 'white',
          padding: '28px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <img
            src={hostInfo.avatar}
            alt={hostInfo.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #ec4899',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              {hostInfo.name}
            </h3>
            {hostInfo.verified && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#10b981',
                  backgroundColor: '#d1fae5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginTop: '6px',
                }}
              >
                ✓ Verified
              </span>
            )}
          </div>
        </div>
        <div>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            {hostInfo.bio}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#fce7f3',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #fbbbf2',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>
                Years Hosting
              </p>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#ec4899', margin: '4px 0 0 0' }}>
                {hostInfo.yearsHosting}+
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#fce7f3',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #fbbbf2',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>
                Reviews
              </p>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#ec4899', margin: '4px 0 0 0' }}>
                {hostInfo.reviews}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#fce7f3',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #fbbbf2',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>
                Response Time
              </p>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>
                {hostInfo.responseTime}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#e0f2fe',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #bae6fd',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#0369a1', margin: 0, textTransform: 'uppercase' }}>
                Status
              </p>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#0369a1', margin: '4px 0 0 0' }}>
                🟢 Active
              </p>
            </div>
          </div>
        </div>
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: '#ec4899',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            height: 'fit-content',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#be185d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ec4899';
          }}
        >
          💬 Message Host
        </button>
      </div>
    </div>
  );
};

const ReviewSection = ({ reviews: initialReviews }: { reviews: Review[] }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState<Set<string>>(new Set());

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0);
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    newExpanded.has(reviewId) ? newExpanded.delete(reviewId) : newExpanded.add(reviewId);
    setExpandedReviews(newExpanded);
  };

  const toggleReplyForm = (reviewId: string) => {
    const newShowReplyForm = new Set(showReplyForm);
    newShowReplyForm.has(reviewId) ? newShowReplyForm.delete(reviewId) : newShowReplyForm.add(reviewId);
    setShowReplyForm(newShowReplyForm);
  };

  const handleAddReply = (reviewId: string) => {
    const replyText = replyInputs[reviewId];
    if (!replyText?.trim()) return;

    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              replies: [
                ...(review.replies || []),
                {
                  id: `reply-${Date.now()}`,
                  name: 'You',
                  text: replyText,
                  date: new Date().toISOString(),
                  isOwner: true,
                },
              ],
            }
          : review
      )
    );

    setReplyInputs({ ...replyInputs, [reviewId]: '' });
    toggleReplyForm(reviewId);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, helpful: (review.helpful || 0) + 1 } : review
      )
    );
  };

  return (
    <div style={{ marginTop: '48px' }}>
      {/* Header with Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 20px 0' }}>
          ⭐ Guest Reviews ({reviews.length})
        </h2>

        {/* Rating Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#ec4899', marginBottom: '8px' }}>
              {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
            </div>
            <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '8px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ fontSize: '16px' }}>
                  ⭐
                </span>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', margin: 0 }}>
              Based on {reviews.length} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div style={{ display: 'grid', gap: '8px' }}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', minWidth: '30px' }}>
                    {stars} ⭐
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#ec4899',
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', minWidth: '30px' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sort Options */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', alignSelf: 'center' }}>
            Sort by:
          </span>
          {(
            [
              { value: 'recent' as SortOption, label: '🕐 Most Recent' },
              { value: 'rating-high' as SortOption, label: '⭐ Highest Rated' },
              { value: 'rating-low' as SortOption, label: '⭐ Lowest Rated' },
              { value: 'helpful' as SortOption, label: '👍 Most Helpful' },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                border: sortBy === option.value ? '2px solid #ec4899' : '1px solid #e2e8f0',
                backgroundColor: sortBy === option.value ? '#fce7f3' : 'white',
                color: sortBy === option.value ? '#ec4899' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (sortBy !== option.value) {
                  e.currentTarget.style.borderColor = '#ec4899';
                  e.currentTarget.style.backgroundColor = '#fce7f3';
                }
              }}
              onMouseLeave={(e) => {
                if (sortBy !== option.value) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #ec4899',
            }}
          >
            {/* Review Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}
              >
                {review.avatar || review.name.charAt(0).toUpperCase()}
              </div>

              {/* Review Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {review.name}
                  </h3>
                  {review.verified && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#10b981',
                        backgroundColor: '#d1fae5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Rating & Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ fontSize: '14px' }}>
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: '16px' }}>
              <p
                style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                {expandedReviews.has(review.id)
                  ? review.text
                  : review.text.length > 200
                    ? `${review.text.substring(0, 200)}...`
                    : review.text}
              </p>
              {review.text.length > 200 && (
                <button
                  onClick={() => toggleExpanded(review.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ec4899',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {expandedReviews.has(review.id) ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {/* Helpful & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <button
                onClick={() => handleHelpful(review.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ec4899';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                👍 Helpful ({review.helpful || 0})
              </button>

              <button
                onClick={() => toggleReplyForm(review.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ec4899';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                💬 Reply
              </button>
            </div>

            {/* Replies Section */}
            {review.replies && review.replies.length > 0 && (
              <div style={{ marginTop: '16px', paddingLeft: '0', display: 'grid', gap: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {review.replies.length} {review.replies.length === 1 ? 'Reply' : 'Replies'}
                </div>

                {review.replies.map((reply) => (
                  <div
                    key={reply.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      marginLeft: '0',
                    }}
                  >
                    {/* Reply Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: reply.isOwner ? '#10b981' : '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '700',
                          flexShrink: 0,
                        }}
                      >
                        {reply.avatar || reply.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                            {reply.name}
                          </span>
                          {reply.isOwner && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#10b981',
                                backgroundColor: '#d1fae5',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                textTransform: 'uppercase',
                              }}
                            >
                              Owner
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                          {new Date(reply.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Reply Text */}
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm.has(review.id) && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <textarea
                    placeholder="Write your reply..."
                    value={replyInputs[review.id] || ''}
                    onChange={(e) => setReplyInputs({ ...replyInputs, [review.id]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      minHeight: '80px',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => toggleReplyForm(review.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white',
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleAddReply(review.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#ec4899',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#be185d';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ec4899';
                      }}
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ExperienceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Experience Data
  const experiences: Record<string, any> = {
    '1': {
      id: 1,
      title: 'Romantic Rooftop Candlelight Dinner',
      location: 'New York, NY',
      rating: 4.9,
      reviews: 342,
      pricePerPerson: 15999,
      guestRange: '2-10',
      duration: '3 hours',
      tags: ['Romantic', 'Dinner', 'Premium'],
      description:
        'Celebrate under the stars with candlelight, gourmet cuisine, and stunning city views. This unforgettable evening combines exquisite dining, premium beverages, and personalized service to create memories that last a lifetime.',
      images: [
        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=800&h=600&fit=crop',
      ],
      included: ['5-course menu', 'Premium beverages', 'Live music', 'Photography', 'Table setup', 'Private venue access'],
      highlights: [
        { icon: '🌃', text: 'Panoramic city skyline views' },
        { icon: '🕯️', text: 'Intimate candlelit ambiance' },
        { icon: '👨‍🍳', text: 'Chef-curated menu' },
        { icon: '📸', text: 'Professional photos included' },
        { icon: '🎵', text: 'Live entertainment' },
        { icon: '💼', text: 'Dedicated coordinator' },
      ],
      minGuests: 2,
      maxGuests: 10,
      contact: {
        phone: '+1 (555) 999-1111',
        email: 'rooftop@experiences.com',
        address: '123 Manhattan Heights, New York, NY 10001',
      },
      reviews_data: [
        {
          name: 'Jennifer & Michael',
          rating: 5,
          text: 'The most magical proposal ever! Every detail was perfect.',
        },
        {
          name: 'Sarah & David',
          rating: 5,
          text: 'Our anniversary dinner was absolutely unforgettable. Highly recommend!',
        },
      ],
    },
    '2': {
      id: 2,
      title: 'Private Wine Tasting Experience',
      location: 'Napa Valley, CA',
      rating: 4.8,
      reviews: 215,
      pricePerPerson: 8999,
      guestRange: '4-12',
      duration: '4 hours',
      tags: ['Wine', 'Tasting', 'Gourmet'],
      description:
        'Exclusive wine tasting with vineyard tour and chef-paired cuisine. Learn from expert sommeliers as you explore premium wines.',
      images: [
        'https://images.unsplash.com/photo-1510578474443-d4c4c9a0a4e5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&h=600&fit=crop',
      ],
      included: ['8 wine selections', 'Gourmet pairings', 'Expert sommelier', 'Vineyard tour'],
      highlights: [
        { icon: '🍷', text: '8 premium wine selections' },
        { icon: '👨‍🍳', text: 'Chef-paired cuisine' },
        { icon: '🌿', text: 'Vineyard tour included' },
        { icon: '📚', text: 'Wine education session' },
      ],
      minGuests: 4,
      maxGuests: 12,
      contact: {
        phone: '+1 (707) 555-2222',
        email: 'wine@experiences.com',
        address: '456 Vineyard Lane, Napa Valley, CA 94558',
      },
      reviews_data: [
        {
          name: 'Thomas & Lisa',
          rating: 5,
          text: 'Outstanding wine selection and expert guidance. Perfect experience!',
        },
      ],
    },
  };

  const experience = experiences[String(id)] || experiences['1'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % experience.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? experience.images.length - 1 : prev - 1));
  };

  const calculateTotal = () => {
    return experience.pricePerPerson * guestCount;
  };

  const handleConfirmBooking = () => {
    const newBookingId = 'EXP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingId(newBookingId);
    setBookingConfirmed(true);
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedDate('');
    setGuestCount(2);
    setBookingData({
      fullName: '',
      email: '',
      phone: '',
      specialRequests: '',
    });
    setBookingConfirmed(false);
    setShowBookingModal(false);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link href="/experiences" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: '600' }}>
              Experiences
            </Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: '600' }}>{experience.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px', marginBottom: '48px' }}>
          {/* Left Section */}
          <div>
            {/* Image Gallery */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#e2e8f0',
                marginBottom: '24px',
                height: '500px',
              }}
            >
              <img
                src={experience.images[currentImageIndex]}
                alt={experience.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Navigation */}
              {experience.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                  >
                    <ChevronLeftIcon style={{ width: '20px', height: '20px', color: '#ec4899' }} />
                  </button>

                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                  >
                    <ChevronRightIcon style={{ width: '20px', height: '20px', color: '#ec4899' }} />
                  </button>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {currentImageIndex + 1} / {experience.images.length}
                  </div>
                </>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'white',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                }}
              >
                <HeartIcon
                  style={{
                    width: '24px',
                    height: '24px',
                    color: isFavorite ? '#ec4899' : '#94a3b8',
                    fill: isFavorite ? '#ec4899' : 'none',
                  }}
                />
              </button>
            </div>

            {/* Title & Rating */}
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1e293b', margin: '0 0 12px 0' }}>
              {experience.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: '18px' }}>
                    ⭐
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                {experience.rating}/5
              </span>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                ({experience.reviews} reviews)
              </span>
            </div>

            {/* Location & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: '#fce7f3', borderRadius: '12px', border: '1px solid #fbbbf2' }}>
                <MapPinIcon style={{ width: '20px', height: '20px', color: '#ec4899', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Location
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {experience.location}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: '#fce7f3', borderRadius: '12px', border: '1px solid #fbbbf2' }}>
                <ClockIcon style={{ width: '20px', height: '20px', color: '#ec4899', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Duration
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    {experience.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '32px', fontWeight: '500' }}>
              {experience.description}
            </p>

            {/* Highlights */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SparklesIcon style={{ width: '24px', height: '24px', color: '#ec4899' }} />
                Why You'll Love It
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {experience.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      backgroundColor: '#fce7f3',
                      borderRadius: '10px',
                      border: '1px solid #fbbbf2',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{highlight.icon}</span>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0' }}>
                ✓ What's Included
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {experience.included.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      backgroundColor: '#fce7f3',
                      borderRadius: '10px',
                      border: '1px solid #fbbbf2',
                    }}
                  >
                    <CheckIcon style={{ width: '20px', height: '20px', color: '#ec4899', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection
              reviews={[
                {
                  id: '1',
                  name: 'Jennifer & Michael',
                  rating: 5,
                  text: 'The most magical proposal ever! Every detail was perfect. From the moment we arrived, the team made us feel special. The candlelight dinner was absolutely romantic, and the photography was stunning. We could not have asked for a better experience!',
                  date: '2024-01-15T10:30:00Z',
                  verified: true,
                  helpful: 24,
                  replies: [
                    {
                      id: 'r1',
                      name: 'Rooftop Experiences',
                      text: 'Thank you so much for choosing us for your proposal! We are thrilled that we could make your special moment unforgettable. We would love to host you again!',
                      date: '2024-01-16T09:00:00Z',
                      isOwner: true,
                    },
                  ],
                },
                {
                  id: '2',
                  name: 'Sarah & David',
                  rating: 5,
                  text: 'Our anniversary dinner was absolutely unforgettable. Highly recommend! The service was impeccable, the food was exquisite, and the ambiance was perfect.',
                  date: '2023-12-20T15:45:00Z',
                  verified: true,
                  helpful: 18,
                  replies: [],
                },
                {
                  id: '3',
                  name: 'John Smith',
                  rating: 4,
                  text: 'Great experience overall. The food was excellent and the view was spectacular. The only minor issue was that the reservation was slightly delayed, but the team handled it professionally.',
                  date: '2023-11-10T18:20:00Z',
                  verified: true,
                  helpful: 12,
                  replies: [
                    {
                      id: 'r2',
                      name: 'Rooftop Experiences',
                      text: 'Thank you for your feedback! We apologize for the delay and appreciate your understanding. We have taken steps to improve our reservation process.',
                      date: '2023-11-11T10:15:00Z',
                      isOwner: true,
                    },
                  ],
                },
              ]}
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={[
                {
                  id: '1',
                  question: 'What time does the experience start and end?',
                  answer: 'The rooftop candlelight dinner experience begins at 7:00 PM and concludes around 10:00 PM. Check-in starts 15 minutes early. We recommend arriving at least 20 minutes before the start time.',
                },
                {
                  id: '2',
                  question: 'Can I accommodate dietary restrictions or allergies?',
                  answer: 'Absolutely! Please inform us of any dietary restrictions or allergies during booking. Our chef will prepare a customized menu to ensure everyone enjoys the experience. We can accommodate vegetarian, vegan, gluten-free, and other dietary requirements.',
                },
                {
                  id: '3',
                  question: 'Is the experience suitable for children?',
                  answer: 'This experience is primarily designed for adults. However, children aged 12 and above may attend with special arrangements. Please contact us directly to discuss options for younger guests.',
                },
                {
                  id: '4',
                  question: 'What is your cancellation policy?',
                  answer: 'Cancellations made 14 days or more before the experience date are fully refundable. Cancellations made 7-14 days before receive a 50% refund. Cancellations within 7 days are non-refundable.',
                },
                {
                  id: '5',
                  question: 'What happens in case of bad weather?',
                  answer: 'If severe weather is forecasted, we will contact you at least 48 hours in advance to reschedule or discuss alternative arrangements. We have a covered area available in case of light rain.',
                },
                {
                  id: '6',
                  question: 'Is photography allowed during the experience?',
                  answer: 'Yes! We encourage you to capture memories. Professional photography is included in your booking. Personal photography is welcome, but we ask to keep it tasteful to maintain the ambiance for all guests.',
                },
              ]}
            />

            {/* Similar Experiences */}
            <SimilarExperiencesSection
              experiences={[
                {
                  id: 'exp-2',
                  title: 'Private Wine Tasting Experience',
                  location: 'Napa Valley, CA',
                  image: 'https://images.unsplash.com/photo-1510578474443-d4c4c9a0a4e5?w=400&h=300&fit=crop',
                  rating: 4.8,
                  pricePerPerson: 8999,
                  tag: 'Wine',
                },
                {
                  id: 'exp-3',
                  title: 'Sunset Beach Picnic Dinner',
                  location: 'Malibu, CA',
                  image: 'https://images.unsplash.com/photo-1504674900669-ab5bdf0c4734?w=400&h=300&fit=crop',
                  rating: 4.9,
                  pricePerPerson: 12999,
                  tag: 'Beach',
                },
                {
                  id: 'exp-4',
                  title: 'Mountain Cabin Gourmet Retreat',
                  location: 'Aspen, CO',
                  image: 'https://images.unsplash.com/photo-1546457732-56cbb54ec5f6?w=400&h=300&fit=crop',
                  rating: 4.7,
                  pricePerPerson: 18999,
                  tag: 'Adventure',
                },
                {
                  id: 'exp-5',
                  title: 'Garden Party & Afternoon Tea',
                  location: 'London, UK',
                  image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
                  rating: 4.6,
                  pricePerPerson: 5999,
                  tag: 'Elegant',
                },
                {
                  id: 'exp-6',
                  title: 'Michelin Chef Home Cooking Class',
                  location: 'Paris, France',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                  rating: 4.9,
                  pricePerPerson: 24999,
                  tag: 'Cooking',
                },
              ]}
            />

            {/* Policies & Safety */}
            <PoliciesSection
              safetyInfo={[
                {
                  icon: '✓',
                  title: 'Health & Safety Protocols',
                  description: 'All staff are fully vaccinated and trained in COVID-19 safety protocols. Hand sanitizers are available throughout the venue. We follow all local health guidelines.',
                },
                {
                  icon: '🔒',
                  title: 'Secure Venue',
                  description: 'Our rooftop venue is a secure, private space with 24/7 security. All guests are required to check in at our main desk. Emergency exits are clearly marked.',
                },
                {
                  icon: '💉',
                  title: 'Medical Support',
                  description: 'We have trained first aid staff on-site. An AED device is available. In case of emergencies, we are located near a major hospital.',
                },
                {
                  icon: '🌡️',
                  title: 'Food Safety',
                  description: 'All food is prepared in our certified kitchen following strict hygiene standards. We maintain proper food storage and preparation temperatures at all times.',
                },
              ]}
              cancellationPolicy={`FREE CANCELLATION: Cancel up to 14 days before for a full refund.

PARTIAL REFUND: Cancel 7-14 days before for 50% refund.

NO REFUND: Cancel within 7 days of the experience date.

RESCHEDULE: You can reschedule to any available date within 12 months without penalty if cancelled 14 days in advance.

WEATHER POLICY: In case of severe weather, we will offer to reschedule at no additional cost or provide a full refund.

GROUP CANCELLATIONS: For groups of 10 or more, please refer to the custom quote agreement.`}
            />

            {/* Host Information */}
            <HostInfoSection
              hostInfo={{
                name: 'Marco Rossi',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                verified: true,
                yearsHosting: 8,
                reviews: 342,
                responseTime: '< 1 hour',
                bio: 'Passionate chef and event organizer with 8 years of experience creating unforgettable dining experiences. Specialized in romantic dinners, corporate events, and private celebrations. My mission is to make every moment special.',
              }}
            />
          </div>

          {/* Right Section - Sticky Booking */}
          <div>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: '100px',
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #f0f0f0' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Price Per Person
                </p>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#ec4899', margin: 0 }}>
                  ₹{experience.pricePerPerson.toLocaleString()}
                </div>
              </div>

              {/* Guest Info */}
              <div
                style={{
                  backgroundColor: '#fce7f3',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid #fbbbf2',
                }}
              >
                <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  👥 Guest Range
                </p>
                <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '700', margin: 0 }}>
                  {experience.guestRange} guests
                </p>
              </div>

              {/* CTA Buttons */}
              <button
                onClick={() => setShowBookingModal(true)}
                style={{
                  width: '100%',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '12px',
                  boxShadow: '0 8px 20px rgba(236, 72, 153, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#be185d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ec4899';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Book Experience 🎉
                <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => setShowQuoteModal(true)}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: '#ec4899',
                  border: '2px solid #ec4899',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '24px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fce7f3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Request Custom Quote
              </button>

              {/* Features */}
              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {[
                  { icon: '✓', text: '100% Secure Booking' },
                  { icon: '⚡', text: 'Instant Confirmation' },
                  { icon: '💰', text: 'Best Price Guarantee' },
                  { icon: '📞', text: '24/7 Support' },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '13px',
                      color: '#475569',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ fontSize: '16px', color: '#ec4899' }}>{feature.icon}</span>
                    {feature.text}
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div style={{ paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  Need Help?
                </p>

                <a
                  href={`tel:${experience.contact.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: '#ec4899',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  <PhoneIcon style={{ width: '16px', height: '16px' }} />
                  {experience.contact.phone}
                </a>

                <a
                  href={`mailto:${experience.contact.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: '#ec4899',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
                  {experience.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailPage;