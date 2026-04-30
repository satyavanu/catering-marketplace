'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  ChevronDown,
  Trash2,
  Edit,
  MessageSquare,
  ThumbsUp,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    rating: 0,
    comment: '',
  });

  const [allReviews, setAllReviews] = useState([
    {
      id: 'REV-001',
      orderId: 'ORD-001',
      serviceName: 'Bella Italia',
      category: 'catering',
      rating: 4.5,
      comment: 'Excellent food quality and punctual delivery. The pasta was freshly made and delicious. Highly recommended!',
      date: '2026-03-16',
      helpful: 12,
      replies: 2,
      images: [],
    },
    {
      id: 'REV-002',
      orderId: 'ORD-004',
      serviceName: 'Grand Ballroom',
      category: 'venues',
      rating: 5,
      comment: 'The venue was absolutely stunning! Perfect for our event. The staff was professional and helpful throughout.',
      date: '2026-03-12',
      helpful: 28,
      replies: 5,
      images: [],
    },
    {
      id: 'REV-003',
      orderId: 'ORD-007',
      serviceName: 'Pro Photography',
      category: 'photography',
      rating: 5,
      comment: 'Incredible photographer! Captured all the important moments beautifully. The edited photos exceeded our expectations.',
      date: '2026-03-08',
      helpful: 45,
      replies: 8,
      images: [],
    },
    {
      id: 'REV-004',
      orderId: 'ORD-006',
      serviceName: 'Creative Florals',
      category: 'decorations',
      rating: 4,
      comment: 'Beautiful floral arrangements. The colors were vibrant and fresh. Minor delay in delivery but overall satisfied.',
      date: '2026-03-02',
      helpful: 18,
      replies: 3,
      images: [],
    },
    {
      id: 'REV-005',
      orderId: 'ORD-008',
      serviceName: 'Skyview Venue',
      category: 'venues',
      rating: 4.5,
      comment: 'Great location with amazing views. The venue setup was seamless. Would definitely book again for future events.',
      date: '2026-02-20',
      helpful: 22,
      replies: 4,
      images: [],
    },
    {
      id: 'REV-006',
      orderId: 'ORD-003',
      serviceName: 'Burger Bliss',
      category: 'catering',
      rating: 3,
      comment: 'Good burgers but the delivery took longer than expected. Food was still warm when it arrived.',
      date: '2026-02-15',
      helpful: 8,
      replies: 1,
      images: [],
    },
  ]);

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = allReviews.filter((review) => {
      const matchesSearch =
        review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating =
        filterRating === 'all' ||
        (filterRating === '5' && review.rating === 5) ||
        (filterRating === '4' && review.rating >= 4 && review.rating < 5) ||
        (filterRating === '3' && review.rating >= 3 && review.rating < 4) ||
        (filterRating === 'low' && review.rating < 3);

      return matchesSearch && matchesRating;
    });

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    }

    return filtered;
  }, [searchTerm, sortBy, filterRating, allReviews]);

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((review) => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  }, [allReviews]);

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            style={{
              ...styles.star,
              cursor: interactive ? 'pointer' : 'default',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
            }}
          >
            <Star
              size={interactive ? 28 : 16}
              fill={star <= rating ? '#fbbf24' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleEditReview = () => {
    if (selectedReview && editData.rating > 0) {
      setAllReviews(
        allReviews.map((review) =>
          review.id === selectedReview.id
            ? {
                ...review,
                rating: editData.rating,
                comment: editData.comment,
                date: new Date().toISOString().split('T')[0],
              }
            : review
        )
      );
      setSelectedReview(null);
      setShowEditModal(false);
      setEditData({ rating: 0, comment: '' });
    }
  };

  const handleDeleteReview = () => {
    if (selectedReview) {
      setAllReviews(allReviews.filter((review) => review.id !== selectedReview.id));
      setSelectedReview(null);
      setShowDeleteModal(false);
    }
  };

  if (selectedReview) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <button
            onClick={() => setSelectedReview(null)}
            style={styles.backButton}
          >
            <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
            Back to Reviews
          </button>

          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <div>
                <h1 style={styles.detailTitle}>{selectedReview.serviceName}</h1>
                <p style={styles.detailMeta}>{selectedReview.category}</p>
                <div style={styles.starsRow}>
                  {renderStars(selectedReview.rating)}
                  <span style={styles.ratingText}>{selectedReview.rating} out of 5</span>
                </div>
                <p style={styles.reviewDate}>
                  <Calendar size={14} style={{ marginRight: '6px' }} />
                  {new Date(selectedReview.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div style={styles.detailBadges}>
                <div style={styles.badge}>
                  <ThumbsUp size={16} />
                  <span>{selectedReview.helpful} Helpful</span>
                </div>
                <div style={styles.badge}>
                  <MessageSquare size={16} />
                  <span>{selectedReview.replies} Replies</span>
                </div>
              </div>
            </div>

            <div style={styles.reviewContent}>
              <p style={styles.reviewComment}>{selectedReview.comment}</p>
            </div>

            <div style={styles.detailActions}>
              <button
                onClick={() => {
                  setEditData({
                    rating: selectedReview.rating,
                    comment: selectedReview.comment,
                  });
                  setShowEditModal(true);
                }}
                style={styles.buttonEdit}
              >
                <Edit size={18} />
                Edit Review
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={styles.buttonDelete}
              >
                <Trash2 size={18} />
                Delete Review
              </button>
            </div>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Edit Review</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditData({ rating: 0, comment: '' });
                    }}
                    style={styles.closeButton}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Rating</label>
                  {renderStars(editData.rating, true, (rating) =>
                    setEditData({ ...editData, rating })
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Your Review</label>
                  <textarea
                    value={editData.comment}
                    onChange={(e) =>
                      setEditData({ ...editData, comment: e.target.value })
                    }
                    placeholder="Share your experience..."
                    style={styles.textarea}
                  />
                  <p style={styles.charCount}>
                    {editData.comment.length}/500 characters
                  </p>
                </div>

                <div style={styles.modalButtons}>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditData({ rating: 0, comment: '' });
                    }}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditReview}
                    disabled={editData.rating === 0 || !editData.comment.trim()}
                    style={{
                      ...styles.buttonPrimary,
                      opacity:
                        editData.rating === 0 || !editData.comment.trim()
                          ? 0.5
                          : 1,
                      cursor:
                        editData.rating === 0 || !editData.comment.trim()
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Delete Review</h2>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={styles.closeButton}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p style={styles.modalDescription}>
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>

                <div style={styles.modalButtons}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={styles.buttonSecondary}
                  >
                    Keep Review
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    style={{ ...styles.buttonPrimary, ...styles.buttonDanger }}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>My Reviews</h1>
          <p style={styles.pageSubtitle}>
            {allReviews.length} review{allReviews.length !== 1 ? 's' : ''} posted
          </p>
        </div>

        {/* Rating Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryLeft}>
            <div style={styles.averageRating}>
              <div style={styles.averageNumber}>{averageRating}</div>
              <div style={styles.averageStars}>
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
              <p style={styles.averageText}>Based on {allReviews.length} reviews</p>
            </div>
          </div>

          <div style={styles.summaryRight}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} style={styles.ratingDistributionRow}>
                <span style={styles.ratingLabel}>{rating} ⭐</span>
                <div style={styles.ratingBar}>
                  <div
                    style={{
                      ...styles.ratingBarFill,
                      width: `${
                        (ratingDistribution[rating] / allReviews.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <span style={styles.ratingCount}>{ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div style={styles.filterCard}>
          <div style={styles.filterContainer}>
            <div style={styles.searchWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search reviews by service or order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.selectWrapper}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.selectInput}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
              <ChevronDown size={18} style={styles.selectIcon} />
            </div>

            <div style={styles.selectWrapper}>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={styles.selectInput}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="low">Below 3 Stars</option>
              </select>
              <Star size={18} style={styles.selectIcon} />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredAndSortedReviews.length > 0 ? (
          <div style={styles.reviewsList}>
            {filteredAndSortedReviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewTitleSection}>
                    <h3 style={styles.reviewTitle}>{review.serviceName}</h3>
                    <p style={styles.reviewCategory}>{review.category}</p>
                  </div>
                  <div style={styles.reviewMeta}>
                    <div style={styles.reviewRating}>
                      {renderStars(review.rating)}
                      <span style={styles.ratingValue}>{review.rating}</span>
                    </div>
                  </div>
                </div>

                <p style={styles.reviewText}>{review.comment}</p>

                <div style={styles.reviewFooter}>
                  <div style={styles.reviewStats}>
                    <span style={styles.stat}>
                      <Calendar size={14} />
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </span>
                    <span style={styles.stat}>
                      <ThumbsUp size={14} />
                      {review.helpful} Helpful
                    </span>
                    <span style={styles.stat}>
                      <MessageSquare size={14} />
                      {review.replies} Replies
                    </span>
                  </div>

                  <div style={styles.reviewActions}>
                    <button
                      onClick={() => setSelectedReview(review)}
                      style={styles.actionButton}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setEditData({
                          rating: review.rating,
                          comment: review.comment,
                        });
                        setShowEditModal(true);
                      }}
                      style={styles.actionButtonEdit}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setShowDeleteModal(true);
                      }}
                      style={styles.actionButtonDelete}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <AlertCircle size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No reviews found</h3>
            <p style={styles.emptyText}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#4b5563',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '32px',
    transition: 'color 0.2s',
  },
  pageHeader: {
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#111827',
  },
  pageSubtitle: {
    color: '#4b5563',
    marginTop: '8px',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px',
    marginBottom: '24px',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '48px',
  },
  summaryLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRating: {
    textAlign: 'center',
  },
  averageNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#111827',
  },
  averageStars: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
  averageText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  summaryRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  ratingDistributionRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 40px',
    alignItems: 'center',
    gap: '12px',
  },
  ratingLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4b5563',
  },
  ratingBar: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
  ratingCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'right',
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    marginBottom: '24px',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    minWidth: '250px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '8px',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  selectWrapper: {
    position: 'relative',
  },
  selectInput: {
    paddingLeft: '16px',
    paddingRight: '32px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    transition: 'all 0.2s',
  },
  selectIcon: {
    position: 'absolute',
    right: '12px',
    top: '8px',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  reviewTitleSection: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  reviewCategory: {
    fontSize: '13px',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  reviewMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  reviewRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ratingValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  starsContainer: {
    display: 'flex',
    gap: '4px',
  },
  star: {
    backgroundColor: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  starsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  ratingText: {
    fontSize: '14px',
    color: '#4b5563',
    fontWeight: '500',
  },
  reviewText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#374151',
    marginBottom: '16px',
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  reviewStats: {
    display: 'flex',
    gap: '16px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6b7280',
  },
  reviewActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',
    paddingBottom: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  actionButtonEdit: {
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '6px',
    paddingBottom: '6px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  actionButtonDelete: {
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '6px',
    paddingBottom: '6px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px',
    marginBottom: '24px',
  },
  detailHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  detailTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  detailMeta: {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  reviewDate: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '12px',
  },
  detailBadges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  reviewContent: {
    marginBottom: '32px',
  },
  reviewComment: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#374151',
    whiteSpace: 'pre-wrap',
  },
  detailActions: {
    display: 'flex',
    gap: '12px',
  },
  buttonEdit: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: '600',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDelete: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontWeight: '600',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '512px',
    width: '100%',
    padding: '32px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  modalDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  closeButton: {
    backgroundColor: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '24px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  textarea: {
    width: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none',
    transition: 'all 0.2s',
  },
  charCount: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '6px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
  buttonPrimary: {
    flex: 1,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    flex: 1,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
};