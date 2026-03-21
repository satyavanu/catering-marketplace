'use client';

import React, { useState, useMemo } from 'react';
import {
  Heart,
  Search,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  Trash2,
  UtensilsCrossed,
  Home,
  Palette,
  Camera,
  Sparkles,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';

export default function SavedCaterersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProvider, setSelectedProvider] = useState<{
    id: string;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    specialties: string[];
    priceRange: string;
    image: string;
    savedDate: string;
    notes?: string;
    isPremium: boolean;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const categories = [
    { id: 'all', label: 'All Services', icon: Sparkles },
    { id: 'catering', label: 'Catering', icon: UtensilsCrossed },
    { id: 'venues', label: 'Venues', icon: Home },
    { id: 'decorations', label: 'Decorations', icon: Palette },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'experiences', label: 'Experiences', icon: Sparkles },
  ];

  const [savedProviders, setSavedProviders] = useState([
    {
      id: 'PROV-001',
      name: 'Bella Italia',
      category: 'catering',
      rating: 4.5,
      reviews: 128,
      location: '123 Main St, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'info@bellaitalia.com',
      website: 'www.bellaitalia.com',
      description: 'Premium Italian catering with authentic recipes and fresh ingredients.',
      specialties: ['Italian Cuisine', 'Wedding Catering', 'Corporate Events'],
      priceRange: '$$$',
      image: '🍝',
      savedDate: '2026-03-15',
      notes: 'Great for formal events',
      isPremium: true,
    },
    {
      id: 'PROV-002',
      name: 'Grand Ballroom',
      category: 'venues',
      rating: 5,
      reviews: 89,
      location: '321 Pine Rd, New York, NY 10004',
      phone: '+1 (555) 234-5678',
      email: 'bookings@grandballroom.com',
      website: 'www.grandballroom.com',
      description: 'Elegant ballroom venue with stunning architecture and modern amenities.',
      specialties: ['Weddings', 'Gala Events', 'Corporate Conferences'],
      priceRange: '$$$$',
      image: '🏛️',
      savedDate: '2026-03-10',
      notes: 'Perfect for large gatherings',
      isPremium: true,
    },
    {
      id: 'PROV-003',
      name: 'Creative Florals',
      category: 'decorations',
      rating: 4.8,
      reviews: 156,
      location: '222 Wedding Ave, New York, NY 10006',
      phone: '+1 (555) 345-6789',
      email: 'design@creativeflorals.com',
      website: 'www.creativeflorals.com',
      description: 'Bespoke floral arrangements and event decorations.',
      specialties: ['Floral Arrangements', 'Table Decorations', 'Venue Design'],
      priceRange: '$$$',
      image: '🌸',
      savedDate: '2026-03-05',
      notes: 'Excellent creativity',
      isPremium: false,
    },
    {
      id: 'PROV-004',
      name: 'Pro Photography',
      category: 'photography',
      rating: 5,
      reviews: 234,
      location: '456 Oak Ave, New York, NY 10002',
      phone: '+1 (555) 456-7890',
      email: 'bookings@prophotography.com',
      website: 'www.prophotography.com',
      description: 'Professional photography services for weddings and events.',
      specialties: ['Wedding Photography', 'Portrait Sessions', 'Event Coverage'],
      priceRange: '$$$$',
      image: '📷',
      savedDate: '2026-02-28',
      notes: 'Highly recommended',
      isPremium: true,
    },
    {
      id: 'PROV-005',
      name: 'Dragon Palace',
      category: 'catering',
      rating: 4.2,
      reviews: 95,
      location: '789 Dragon Lane, New York, NY 10003',
      phone: '+1 (555) 567-8901',
      email: 'catering@dragonpalace.com',
      website: 'www.dragonpalace.com',
      description: 'Authentic Asian cuisine with fusion options.',
      specialties: ['Chinese', 'Japanese', 'Fusion Cuisine'],
      priceRange: '$$',
      image: '🥢',
      savedDate: '2026-02-20',
      notes: 'Good value for money',
      isPremium: false,
    },
    {
      id: 'PROV-006',
      name: 'Skyview Venue',
      category: 'venues',
      rating: 4.6,
      reviews: 67,
      location: '789 Sky Tower, New York, NY 10008',
      phone: '+1 (555) 678-9012',
      email: 'info@skyviewvenue.com',
      website: 'www.skyviewvenue.com',
      description: 'Rooftop venue with panoramic city views.',
      specialties: ['Intimate Gatherings', 'Corporate Events', 'Cocktail Parties'],
      priceRange: '$$$',
      image: '🌆',
      savedDate: '2026-02-15',
      notes: 'Amazing views',
      isPremium: true,
    },
    {
      id: 'PROV-007',
      name: 'Event Experience Co',
      category: 'experiences',
      rating: 4.7,
      reviews: 112,
      location: '555 Adventure St, New York, NY 10009',
      phone: '+1 (555) 789-0123',
      email: 'events@experienceco.com',
      website: 'www.experienceco.com',
      description: 'Curated experiences and interactive entertainment.',
      specialties: ['Team Building', 'Entertainment', 'Workshops'],
      priceRange: '$$$',
      image: '🎉',
      savedDate: '2026-02-10',
      notes: 'Creative and fun',
      isPremium: false,
    },
  ]);

  const filteredProviders = useMemo(() => {
    let filtered = savedProviders.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || provider.category === categoryFilter;
      const matchesRating =
        ratingFilter === 'all' ||
        (ratingFilter === '5' && provider.rating === 5) ||
        (ratingFilter === '4' && provider.rating >= 4 && provider.rating < 5) ||
        (ratingFilter === '3' && provider.rating >= 3 && provider.rating < 4) ||
        (ratingFilter === 'premium' && provider.isPremium);

      return matchesSearch && matchesCategory && matchesRating;
    });

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.savedDate) - new Date(b.savedDate));
    } else if (sortBy === 'highest-rated') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'most-reviewed') {
      filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [searchTerm, categoryFilter, ratingFilter, sortBy, savedProviders]);

  const getCategoryIcon = (category) => {
    const cat = categories.find((c) => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon size={20} />;
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.label : category;
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= rating ? '#fbbf24' : '#e5e7eb'}
            color={star <= rating ? '#fbbf24' : '#e5e7eb'}
          />
        ))}
      </div>
    );
  };

  const handleRemoveSaved = () => {
    if (selectedProvider) {
      setSavedProviders(
        savedProviders.filter((p) => p.id !== selectedProvider.id)
      );
      setSelectedProvider(null);
      setShowDeleteModal(false);
    }
  };

  const handleContactProvider = () => {
    if (contactMessage.trim()) {
      // Here you would typically send the message
      setShowContactModal(false);
      setContactMessage('');
      setSelectedProvider(null);
    }
  };

  const categoryStats = useMemo(() => {
    const stats = {};
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        stats[cat.id] = savedProviders.filter(
          (p) => p.category === cat.id
        ).length;
      }
    });
    return stats;
  }, [savedProviders]);

  if (selectedProvider) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <button
            onClick={() => setSelectedProvider(null)}
            style={styles.backButton}
          >
            <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
            Back to Saved
          </button>

          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <div style={styles.headerLeft}>
                <div style={styles.providerImage}>{selectedProvider.image}</div>
                <div>
                  <div style={styles.premiumBadge}>
                    {selectedProvider.isPremium && (
                      <>
                        <Sparkles size={14} />
                        Premium Provider
                      </>
                    )}
                  </div>
                  <h1 style={styles.detailTitle}>{selectedProvider.name}</h1>
                  <p style={styles.categoryBadge}>
                    {getCategoryLabel(selectedProvider.category)}
                  </p>
                  <div style={styles.ratingRow}>
                    {renderStars(selectedProvider.rating)}
                    <span style={styles.ratingText}>
                      {selectedProvider.rating} ({selectedProvider.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div style={styles.headerRight}>
                <span style={styles.priceRange}>{selectedProvider.priceRange}</span>
              </div>
            </div>

            <div style={styles.detailContent}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>About</h3>
                <p style={styles.description}>{selectedProvider.description}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Specialties</h3>
                <div style={styles.specialtiesList}>
                  {selectedProvider.specialties.map((specialty, idx) => (
                    <div key={idx} style={styles.specialtyBadge}>
                      <Check size={14} />
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Contact Information</h3>
                <div style={styles.contactGrid}>
                  <div style={styles.contactItem}>
                    <MapPin size={18} />
                    <div>
                      <p style={styles.contactLabel}>Location</p>
                      <p style={styles.contactValue}>{selectedProvider.location}</p>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <Phone size={18} />
                    <div>
                      <p style={styles.contactLabel}>Phone</p>
                      <a href={`tel:${selectedProvider.phone}`} style={styles.contactLink}>
                        {selectedProvider.phone}
                      </a>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <Mail size={18} />
                    <div>
                      <p style={styles.contactLabel}>Email</p>
                      <a href={`mailto:${selectedProvider.email}`} style={styles.contactLink}>
                        {selectedProvider.email}
                      </a>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <Globe size={18} />
                    <div>
                      <p style={styles.contactLabel}>Website</p>
                      <a
                        href={`https://${selectedProvider.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.contactLink}
                      >
                        {selectedProvider.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProvider.notes && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Your Notes</h3>
                  <div style={styles.notesBox}>
                    <p style={styles.notesText}>{selectedProvider.notes}</p>
                  </div>
                </div>
              )}

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Saved On</h3>
                <p style={styles.savedDate}>
                  {new Date(selectedProvider.savedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div style={styles.detailActions}>
              <button
                onClick={() => setShowContactModal(true)}
                style={styles.buttonPrimary}
              >
                <Mail size={18} />
                Contact Provider
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={styles.buttonDelete}
              >
                <Trash2 size={18} />
                Remove from Saved
              </button>
            </div>
          </div>

          {/* Contact Modal */}
          {showContactModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Contact {selectedProvider.name}</h2>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setContactMessage('');
                    }}
                    style={styles.closeButton}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Enter your message..."
                    style={styles.textarea}
                  />
                  <p style={styles.charCount}>
                    {contactMessage.length}/500 characters
                  </p>
                </div>

                <div style={styles.modalButtons}>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setContactMessage('');
                    }}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContactProvider}
                    disabled={!contactMessage.trim()}
                    style={{
                      ...styles.buttonPrimary,
                      opacity: !contactMessage.trim() ? 0.5 : 1,
                      cursor: !contactMessage.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Send Message
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
                  <h2 style={styles.modalTitle}>Remove from Saved</h2>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={styles.closeButton}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p style={styles.modalDescription}>
                  Are you sure you want to remove {selectedProvider.name} from your saved
                  providers? You can add it back anytime.
                </p>

                <div style={styles.modalButtons}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={styles.buttonSecondary}
                  >
                    Keep Saved
                  </button>
                  <button
                    onClick={handleRemoveSaved}
                    style={{ ...styles.buttonPrimary, ...styles.buttonDelete }}
                  >
                    Remove
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
          <h1 style={styles.pageTitle}>Saved Providers</h1>
          <p style={styles.pageSubtitle}>
            {savedProviders.length} provider{savedProviders.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Category Overview */}
        <div style={styles.categoryOverview}>
          {categories.map((cat) => {
            if (cat.id === 'all') return null;
            const Icon = cat.icon;
            const count = categoryStats[cat.id] || 0;
            return (
              <div
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  ...styles.categoryCard,
                  ...(categoryFilter === cat.id
                    ? styles.categoryCardActive
                    : styles.categoryCardInactive),
                }}
              >
                <Icon size={24} />
                <p style={styles.categoryCardLabel}>{cat.label}</p>
                <span style={styles.categoryCardCount}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div style={styles.filterCard}>
          <div style={styles.filterContainer}>
            <div style={styles.searchWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search providers by name or location..."
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
                <option value="newest">Recently Saved</option>
                <option value="oldest">Oldest Saved</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="most-reviewed">Most Reviewed</option>
              </select>
              <ChevronDown size={18} style={styles.selectIcon} />
            </div>

            <div style={styles.selectWrapper}>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                style={styles.selectInput}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="premium">Premium Only</option>
              </select>
              <Star size={18} style={styles.selectIcon} />
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        {filteredProviders.length > 0 ? (
          <div style={styles.providersGrid}>
            {filteredProviders.map((provider) => (
              <div key={provider.id} style={styles.providerCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardImage}>{provider.image}</div>
                  <button
                    onClick={() => {
                      setSavedProviders(
                        savedProviders.filter((p) => p.id !== provider.id)
                      );
                    }}
                    style={styles.favButton}
                  >
                    <Heart size={20} fill="#ef4444" color="#ef4444" />
                  </button>
                </div>

                <div style={styles.cardContent}>
                  {provider.isPremium && (
                    <div style={styles.premiumLabel}>
                      <Sparkles size={12} />
                      Premium
                    </div>
                  )}

                  <h3 style={styles.cardTitle}>{provider.name}</h3>

                  <div style={styles.cardCategory}>
                    {getCategoryIcon(provider.category)}
                    <span>{getCategoryLabel(provider.category)}</span>
                  </div>

                  <div style={styles.cardRating}>
                    {renderStars(provider.rating)}
                    <span style={styles.ratingValue}>
                      {provider.rating} ({provider.reviews})
                    </span>
                  </div>

                  <p style={styles.cardLocation}>
                    <MapPin size={14} />
                    {provider.location}
                  </p>

                  <p style={styles.cardPrice}>{provider.priceRange}</p>

                  <button
                    onClick={() => setSelectedProvider(provider)}
                    style={styles.viewButton}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <Heart size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No saved providers</h3>
            <p style={styles.emptyText}>
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start saving your favorite providers'}
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
    maxWidth: '1400px',
    margin: '0 auto',
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
  categoryOverview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  categoryCard: {
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  categoryCardActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: '2px solid #1d4ed8',
  },
  categoryCardInactive: {
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '2px solid #e5e7eb',
  },
  categoryCardLabel: {
    fontSize: '14px',
    fontWeight: '600',
  },
  categoryCardCount: {
    fontSize: '12px',
    opacity: 0.7,
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
  providersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  providerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  cardHeader: {
    position: 'relative',
    height: '200px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    fontSize: '80px',
  },
  favButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
  },
  cardContent: {
    padding: '20px',
  },
  premiumLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  premiumBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  cardCategory: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '8px',
  },
  cardRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  starsContainer: {
    display: 'flex',
    gap: '2px',
  },
  ratingValue: {
    fontSize: '13px',
    color: '#6b7280',
  },
  cardLocation: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  cardPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  viewButton: {
    width: '100%',
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
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
    gridTemplateColumns: '1fr 200px',
    gap: '32px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  headerLeft: {
    display: 'flex',
    gap: '24px',
  },
  providerImage: {
    fontSize: '80px',
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  },
  detailTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
  },
  categoryBadge: {
    display: 'inline-block',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    marginTop: '8px',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  ratingText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  headerRight: {
    textAlign: 'right',
  },
  priceRange: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  detailContent: {
    marginBottom: '32px',
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
  },
  specialtiesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  specialtyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  contactItem: {
    display: 'flex',
    gap: '12px',
  },
  contactLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4b5563',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  contactValue: {
    fontSize: '14px',
    color: '#111827',
  },
  contactLink: {
    fontSize: '14px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
  notesBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '16px',
  },
  notesText: {
    fontSize: '14px',
    color: '#0c4a6e',
    margin: 0,
  },
  savedDate: {
    fontSize: '14px',
    color: '#374151',
  },
  detailActions: {
    display: 'flex',
    gap: '12px',
  },
  buttonPrimary: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
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
    backgroundColor: '#ef4444',
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
};