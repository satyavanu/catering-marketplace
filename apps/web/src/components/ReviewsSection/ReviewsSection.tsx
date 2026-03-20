'use client';

import React, { useState } from 'react';
import { Review } from '@catering-marketplace/query-client';

interface ReviewsSectionProps {
  reviews: Review[];
  onReplySubmit: (reviewId: string, replyText: string) => Promise<void>;
  onHelpful: (reviewId: string) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

type SortOption = 'recent' | 'rating-high' | 'rating-low' | 'helpful';

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onReplySubmit,
  onHelpful,
  isLoading,
  error,
}) => {
  const [expandedReview, setExpandedReview] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showReplyForm, setShowReplyForm] = useState<Set<string>>(new Set());
  const [submittingReply, setSubmittingReply] = useState<Set<string>>(new Set());

  const toggleReview = (reviewId: string) => {
    const newExpanded = new Set(expandedReview);
    newExpanded.has(reviewId) ? newExpanded.delete(reviewId) : newExpanded.add(reviewId);
    setExpandedReview(newExpanded);
  };

  const toggleReplyForm = (reviewId: string) => {
    const newShowReplyForm = new Set(showReplyForm);
    newShowReplyForm.has(reviewId) ? newShowReplyForm.delete(reviewId) : newShowReplyForm.add(reviewId);
    setShowReplyForm(newShowReplyForm);
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText[reviewId]?.trim()) return;

    setSubmittingReply((prev) => new Set(prev).add(reviewId));
    try {
      await onReplySubmit(reviewId, replyText[reviewId]);
      setReplyText({ ...replyText, [reviewId]: '' });
      toggleReplyForm(reviewId);
    } finally {
      setSubmittingReply((prev) => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await onHelpful(reviewId);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', marginTop: '48px' }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '48px',
        }}
      >
        <p style={{ color: '#991b1b', fontSize: '14px', margin: 0 }}>
          Error loading reviews. Please try again later.
        </p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center', padding: '48px 0' }}>
        <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '600' }}>
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 32px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>⭐</span>
        Guest Reviews ({reviews.length})
      </h2>

      {/* Rating Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', marginBottom: '40px', alignItems: 'start', backgroundColor: '#fce7f3', padding: '32px', borderRadius: '16px', border: '1px solid #fbbbf2' }}>
        {/* Average Rating */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '56px', fontWeight: '900', color: '#ec4899', marginBottom: '12px' }}>
            {averageRating}
          </div>
          <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginBottom: '12px' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ fontSize: '20px' }}>
                ⭐
              </span>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', margin: 0, textTransform: 'uppercase' }}>
            Based on {reviews.length} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars as keyof typeof ratingDistribution];
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', minWidth: '40px' }}>
                  {stars} ⭐
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '5px',
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
                <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '700', minWidth: '30px', textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sort Options */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
          📊 Sort by:
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
              padding: '8px 16px',
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

      {/* Reviews List */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #ec4899',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Review Header */}
            <div
              style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                <img
                  src={review.authorAvatar}
                  alt={review.authorName}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '2px solid #ec4899',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {review.authorName}
                    </h3>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', backgroundColor: '#d1fae5', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      ✓ Verified
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: '14px' }}>
                          {i < review.rating ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                      {review.rating}.0/5.0
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                      📅 {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleReview(review.id)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ec4899',
                  transition: 'transform 0.3s ease',
                  transform: expandedReview.has(review.id) ? 'rotate(180deg)' : 'rotate(0)',
                  padding: '4px 8px',
                  flexShrink: 0,
                }}
              >
                ▼
              </button>
            </div>

            {/* Review Content */}
            {expandedReview.has(review.id) && (
              <>
                <div style={{ padding: '0 24px', borderTop: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: '20px 0 12px 0' }}>
                    💭 {review.title}
                  </h4>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #ec4899', marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {review.content}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ padding: '0 24px 16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '20px' }}>
                  <button
                    onClick={() => handleHelpful(review.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 0',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ec4899';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    👍 Helpful ({review.helpful})
                  </button>

                  <button
                    onClick={() => toggleReplyForm(review.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 0',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ec4899';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    💬 Reply ({review.replies.length})
                  </button>
                </div>

                {/* Replies */}
                {review.replies.length > 0 && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'grid', gap: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📧 {review.replies.length} {review.replies.length === 1 ? 'Response' : 'Responses'}
                    </div>

                    {review.replies.map((reply) => (
                      <div key={reply.id} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #f97316',
                            }}
                          />
                          {reply.isHost && (
                            <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', fontSize: '18px' }}>🏠</span>
                          )}
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: '3px solid #f97316', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                              {reply.authorName}
                            </span>
                            {reply.isHost && (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: 'white', backgroundColor: '#f97316', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                Host Response
                              </span>
                            )}
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                              📅 {new Date(reply.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {showReplyForm.has(review.id) && (
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fce7f3' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>
                        ✍️ Write Your Response
                      </span>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <textarea
                        placeholder="Share your thoughts or response to this review..."
                        value={replyText[review.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '10px',
                          border: '1px solid #fbbbf2',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          minHeight: '100px',
                          resize: 'vertical',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: 'white',
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#ec4899';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#fbbbf2';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                      <button
                        onClick={() => toggleReplyForm(review.id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: '1px solid #fbbbf2',
                          backgroundColor: 'white',
                          color: '#ec4899',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fbbbf2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        ✕ Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitReply(review.id)}
                        disabled={submittingReply.has(review.id) || !replyText[review.id]?.trim()}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#ec4899',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: submittingReply.has(review.id) || !replyText[review.id]?.trim() ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          opacity: submittingReply.has(review.id) || !replyText[review.id]?.trim() ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!submittingReply.has(review.id) && replyText[review.id]?.trim()) {
                            e.currentTarget.style.backgroundColor = '#be185d';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!submittingReply.has(review.id) && replyText[review.id]?.trim()) {
                            e.currentTarget.style.backgroundColor = '#ec4899';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {submittingReply.has(review.id) ? '⏳ Posting...' : '✓ Post Response'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;