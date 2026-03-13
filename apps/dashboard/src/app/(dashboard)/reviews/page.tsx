'use client';

import React, { useState } from 'react';

interface Review {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  eventName: string;
  eventDate: string;
  guests: number;
  menu: string;
  response?: {
    text: string;
    date: string;
  };
  helpful: number;
  unhelpful: number;
  status: 'pending' | 'approved' | 'flagged';
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  responseRate: number;
  trustScore: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      customerId: 1,
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      rating: 5,
      comment: 'Excellent service and delicious food. Highly recommended! The staff was professional and punctual.',
      date: '2026-03-10',
      eventName: 'Birthday Party',
      eventDate: '2026-03-09',
      guests: 30,
      menu: 'Birthday Package',
      response: {
        text: 'Thank you so much, John! We loved catering your birthday party. We look forward to serving you again!',
        date: '2026-03-11',
      },
      helpful: 12,
      unhelpful: 0,
      status: 'approved',
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      rating: 5,
      comment: 'Our wedding was perfect! Great attention to detail, amazing food quality, and wonderful presentation.',
      date: '2026-03-08',
      eventName: 'Wedding Reception',
      eventDate: '2026-03-08',
      guests: 120,
      menu: 'Wedding Package',
      response: {
        text: 'Congratulations on your wedding, Jane! It was an honor to be part of your special day. Thank you for choosing us!',
        date: '2026-03-09',
      },
      helpful: 18,
      unhelpful: 0,
      status: 'approved',
    },
    {
      id: 3,
      customerId: 4,
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      rating: 4,
      comment: 'Very good food and professional staff. Minor timing issue with appetizer service, but overall excellent.',
      date: '2026-03-05',
      eventName: 'Gala Event',
      eventDate: '2026-03-05',
      guests: 200,
      menu: 'Premium Package',
      helpful: 8,
      unhelpful: 1,
      status: 'approved',
    },
    {
      id: 4,
      customerId: 1,
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      rating: 5,
      comment: 'Always delivers on quality. Best caterer in town!',
      date: '2026-02-20',
      eventName: 'Corporate Event',
      eventDate: '2026-02-20',
      guests: 75,
      menu: 'Corporate Lunch',
      response: {
        text: 'Thank you for your continued trust and support, John! We appreciate your loyalty.',
        date: '2026-02-21',
      },
      helpful: 15,
      unhelpful: 0,
      status: 'approved',
    },
    {
      id: 5,
      customerId: 3,
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      rating: 3,
      comment: 'Good food, but delivery was 20 minutes late. Service could have been better coordinated.',
      date: '2026-02-10',
      eventName: 'Team Lunch',
      eventDate: '2026-02-10',
      guests: 50,
      menu: 'Casual Catering',
      helpful: 5,
      unhelpful: 2,
      status: 'approved',
    },
    {
      id: 6,
      customerId: 5,
      customerName: 'Emma Davis',
      customerEmail: 'emma@example.com',
      rating: 2,
      comment: 'Food was cold when it arrived. Not what we expected for the price paid.',
      date: '2026-02-05',
      eventName: 'Office Party',
      eventDate: '2026-02-05',
      guests: 40,
      menu: 'Premium Package',
      helpful: 6,
      unhelpful: 1,
      status: 'pending',
    },
    {
      id: 7,
      customerId: 6,
      customerName: 'Frank Miller',
      customerEmail: 'frank@example.com',
      rating: 1,
      comment: 'Terrible experience. Wrong menu delivered. Completely unprofessional.',
      date: '2026-01-30',
      eventName: 'Anniversary Dinner',
      eventDate: '2026-01-30',
      guests: 25,
      menu: 'Gourmet Package',
      helpful: 3,
      unhelpful: 8,
      status: 'flagged',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'flagged' | 'insights'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const calculateStats = (): ReviewStats => {
    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : '0';

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    const responseCount = reviews.filter((r) => r.response).length;
    const responseRate = totalReviews > 0 ? Math.round((responseCount / totalReviews) * 100) : 0;

    // Trust Score Calculation (0-100)
    const ratingScore = (parseFloat(averageRating as string) / 5) * 40;
    const responseScore = (responseRate / 100) * 30;
    const helpfulScore = Math.min((reviews.reduce((sum, r) => sum + r.helpful, 0) / (totalReviews * 10)) * 20, 20);
    const approvedScore = ((reviews.filter((r) => r.status === 'approved').length / totalReviews) * 10) || 10;

    const trustScore = Math.round(ratingScore + responseScore + helpfulScore + approvedScore);

    return {
      totalReviews,
      averageRating: parseFloat(averageRating as string),
      ratingDistribution,
      responseRate,
      trustScore,
    };
  };

  const stats = calculateStats();

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      if (activeTab === 'pending') return review.status === 'pending';
      if (activeTab === 'flagged') return review.status === 'flagged';
      if (filterRating) return review.rating === filterRating;
      return searchTerm === '' ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleReply = () => {
    if (selectedReview && replyText.trim()) {
      const updatedReviews = reviews.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              response: {
                text: replyText,
                date: new Date().toISOString().split('T')[0],
              },
              status: 'approved' as const,
            }
          : r
      );
      setReviews(updatedReviews);
      setReplyText('');
      setShowReplyModal(false);
      setSelectedReview(updatedReviews.find((r) => r.id === selectedReview.id) || null);
    }
  };

  const handleApproveReview = (id: number) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r)));
  };

  const handleFlagReview = (id: number) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'flagged' as const } : r)));
  };

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id));
    setSelectedReview(null);
  };

  const getRatingColor = (rating: number) => {
    if (rating === 5) return '#10b981';
    if (rating === 4) return '#3b82f6';
    if (rating === 3) return '#f59e0b';
    if (rating === 2) return '#f97316';
    return '#ef4444';
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Good';
    if (rating === 3) return 'Average';
    if (rating === 2) return 'Poor';
    return 'Terrible';
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            ⭐ Reviews & Trust System
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Manage customer reviews, respond to feedback, and build marketplace trust
          </p>
        </div>
      </div>

      {/* Trust Score Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Trust Score */}
        <div style={{ ...cardStyle, padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>TRUST SCORE</p>
          <div style={{ margin: '1rem 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{stats.trustScore}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>out of 100</div>
          </div>
          <div
            style={{
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: 'white',
                width: `${stats.trustScore}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Average Rating */}
        <div style={{ ...cardStyle, padding: '1.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', marginBottom: '1rem' }}>
            AVERAGE RATING
          </p>
          <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              {stats.averageRating.toFixed(1)}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ fontSize: '1.25rem', opacity: i < Math.round(stats.averageRating) ? 1 : 0.2 }}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
            from {stats.totalReviews} reviews
          </p>
        </div>

        {/* Response Rate */}
        <div style={{ ...cardStyle, padding: '1.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', marginBottom: '1rem' }}>
            RESPONSE RATE
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
            {stats.responseRate}%
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            {reviews.filter((r) => r.response).length} of {stats.totalReviews} reviews replied
          </p>
        </div>

        {/* Total Reviews */}
        <div style={{ ...cardStyle, padding: '1.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', marginBottom: '1rem' }}>
            TOTAL REVIEWS
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
            {stats.totalReviews}
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            {reviews.filter((r) => r.status === 'approved').length} approved
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div style={{ ...cardStyle, padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
          Rating Distribution
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: '60px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ fontSize: '0.875rem', opacity: i < rating ? 1 : 0.2 }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                    {count} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: '24px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: getRatingColor(rating),
                      width: `${percentage}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
        {(['all', 'pending', 'flagged', 'insights'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              color: activeTab === tab ? '#667eea' : '#6b7280',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = '#1f2937';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            {tab === 'all' && `All Reviews (${reviews.filter((r) => r.status === 'approved').length})`}
            {tab === 'pending' && `⏳ Pending (${reviews.filter((r) => r.status === 'pending').length})`}
            {tab === 'flagged' && `🚩 Flagged (${reviews.filter((r) => r.status === 'flagged').length})`}
            {tab === 'insights' && '📊 Insights'}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      {activeTab !== 'insights' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#1f2937',
              boxSizing: 'border-box',
            }}
          />
          <select
            value={filterRating || ''}
            onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#1f2937',
              backgroundColor: 'white',
              boxSizing: 'border-box',
            }}
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 stars)</option>
            <option value="3">⭐⭐⭐ (3 stars)</option>
            <option value="2">⭐⭐ (2 stars)</option>
            <option value="1">⭐ (1 star)</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#1f2937',
              backgroundColor: 'white',
              boxSizing: 'border-box',
            }}
          >
            <option value="recent">Sort by Recent</option>
            <option value="highest">Sort by Highest Rating</option>
            <option value="lowest">Sort by Lowest Rating</option>
            <option value="helpful">Sort by Helpful</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {activeTab !== 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} style={{ ...cardStyle, padding: '2rem' }}>
                {/* Review Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>
                        {review.customerName}
                      </p>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          backgroundColor:
                            review.status === 'approved'
                              ? '#d1fae5'
                              : review.status === 'pending'
                                ? '#fef3c7'
                                : '#fee2e2',
                          color:
                            review.status === 'approved'
                              ? '#065f46'
                              : review.status === 'pending'
                                ? '#92400e'
                                : '#991b1b',
                          textTransform: 'capitalize',
                        }}
                      >
                        {review.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      <span>📅 {new Date(review.date).toLocaleDateString()}</span>
                      <span>📧 {review.customerEmail}</span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', justifyContent: 'flex-end' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ fontSize: '1.25rem', opacity: i < review.rating ? 1 : 0.2 }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: `${getRatingColor(review.rating)}20`,
                        color: getRatingColor(review.rating),
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {getRatingLabel(review.rating)}
                    </span>
                  </div>
                </div>

                {/* Event Info */}
                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {review.eventName}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>📅 Event: {new Date(review.eventDate).toLocaleDateString()}</span>
                    <span>👥 Guests: {review.guests}</span>
                    <span>🍽️ Menu: {review.menu}</span>
                  </div>
                </div>

                {/* Comment */}
                <p style={{ margin: '1rem 0', color: '#1f2937', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  "{review.comment}"
                </p>

                {/* Response */}
                {review.response && (
                  <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#0c4a6e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Your Response
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      {review.response.text}
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(review.response.date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>👍 {review.helpful} helpful</span>
                    <span>👎 {review.unhelpful} unhelpful</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!review.response && (
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowReplyModal(true);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dbeafe',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#0c4a6e',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                      >
                        💬 Reply
                      </button>
                    )}

                    {review.status === 'pending' && (
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#d1fae5',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#065f46',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a7f3d0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#d1fae5')}
                      >
                        ✓ Approve
                      </button>
                    )}

                    {review.status !== 'flagged' && (
                      <button
                        onClick={() => handleFlagReview(review.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fef3c7',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#92400e',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fde68a')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fef3c7')}
                      >
                        🚩 Flag
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#fee2e2',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#991b1b',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                No reviews found matching your filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Trust Factors */}
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
              Trust Score Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Rating Quality</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    {Math.round((stats.averageRating / 5) * 40)}/40
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#667eea',
                      width: `${(stats.averageRating / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Response Rate</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    {Math.round((stats.responseRate / 100) * 30)}/30
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#10b981',
                      width: `${stats.responseRate}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Approval Rate</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    {Math.round((reviews.filter((r) => r.status === 'approved').length / stats.totalReviews) * 100)}%
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#f59e0b',
                      width: `${(reviews.filter((r) => r.status === 'approved').length / stats.totalReviews) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
              Review Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Recent Reviews
                </p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {reviews.filter((r) => {
                    const reviewDate = new Date(r.date);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return reviewDate > sevenDaysAgo;
                  }).length}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                  in the last 7 days
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Average Response Time
                </p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  1-2 days
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                  Excellent engagement
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Most Helpful Review
                </p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {Math.max(...reviews.map((r) => r.helpful))} helpful votes
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                  Great social proof
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="responsive-card" style={{ ...cardStyle, padding: '2rem', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
              Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.responseRate < 80 && (
                <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fcd34d' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                    💡 Improve Response Rate
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78350f', lineHeight: '1.5' }}>
                    Try to respond to more reviews to increase trust and engagement with customers.
                  </p>
                </div>
              )}

              {stats.averageRating < 4 && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                    ⚠️ Address Low Ratings
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#7f1d1d', lineHeight: '1.5' }}>
                    Focus on improving service quality to boost your average rating.
                  </p>
                </div>
              )}

              {reviews.filter((r) => r.status === 'flagged').length > 0 && (
                <div style={{ padding: '1rem', backgroundColor: '#fecaca', borderRadius: '0.5rem', border: '1px solid #fca5a5' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#7f1d1d', marginBottom: '0.5rem' }}>
                    🚩 Review Flagged Content
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#450a0a', lineHeight: '1.5' }}>
                    You have {reviews.filter((r) => r.status === 'flagged').length} flagged review(s) that need attention.
                  </p>
                </div>
              )}

              <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.5rem', border: '1px solid #a7f3d0' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                  ✨ Great Trust Score!
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#047857', lineHeight: '1.5' }}>
                  Your marketplace trust score is strong. Keep up the excellent service!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowReplyModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
              Reply to Review
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
              from {selectedReview.customerName} on {new Date(selectedReview.date).toLocaleDateString()}
            </p>

            {/* Original Review */}
            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #667eea' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ fontSize: '0.875rem', opacity: i < selectedReview.rating ? 1 : 0.2 }}>
                    ⭐
                  </span>
                ))}
              </div>
              <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '0.875rem', lineHeight: '1.5' }}>
                "{selectedReview.comment}"
              </p>
            </div>

            {/* Reply Form */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                Your Response
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  minHeight: '120px',
                  resize: 'vertical',
                }}
                placeholder="Write a professional and friendly response..."
              />
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                {replyText.length} / 500 characters
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReply}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#667eea',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                Send Response
              </button>
              <button
                onClick={() => setShowReplyModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}