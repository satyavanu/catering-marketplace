'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Cater {
  id: number;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerPerson: number;
  specialties: string[];
  availability: string;
  country: string;
  eventTypes: string[];
}

const allCaters: Cater[] = [
  // United States
  {
    id: 1,
    name: 'Elegant Events Catering',
    cuisine: 'French & International',
    image: '👨‍🍳',
    rating: 4.8,
    reviews: 128,
    pricePerPerson: 45,
    specialties: ['Weddings', 'Corporate Events'],
    availability: 'Year-round',
    country: 'United States',
    eventTypes: ['Wedding', 'Corporate', 'Private Dinner'],
  },
  {
    id: 2,
    name: 'Grill Master BBQ',
    cuisine: 'American BBQ',
    image: '🔥',
    rating: 4.5,
    reviews: 87,
    pricePerPerson: 30,
    specialties: ['Parties', 'Outdoor Events'],
    availability: 'Seasonal',
    country: 'United States',
    eventTypes: ['Birthday', 'Party', 'Corporate'],
  },
  {
    id: 3,
    name: 'New York Gastro',
    cuisine: 'Contemporary American',
    image: '🍽️',
    rating: 4.7,
    reviews: 156,
    pricePerPerson: 55,
    specialties: ['Fine Dining', 'Corporate Events'],
    availability: 'Year-round',
    country: 'United States',
    eventTypes: ['Corporate', 'Private Dinner', 'Wedding'],
  },
  // Canada
  {
    id: 4,
    name: 'Toronto Fine Dining',
    cuisine: 'Canadian & French',
    image: '🍴',
    rating: 4.6,
    reviews: 102,
    pricePerPerson: 50,
    specialties: ['Weddings', 'Gala Events'],
    availability: 'Year-round',
    country: 'Canada',
    eventTypes: ['Wedding', 'Corporate', 'Gala'],
  },
  {
    id: 5,
    name: 'Vancouver Fusion Kitchen',
    cuisine: 'Asian Fusion',
    image: '🥢',
    rating: 4.7,
    reviews: 118,
    pricePerPerson: 42,
    specialties: ['Fusion', 'Private Events'],
    availability: 'Year-round',
    country: 'Canada',
    eventTypes: ['Private Dinner', 'Corporate', 'Birthday'],
  },
  // United Kingdom
  {
    id: 6,
    name: 'Spice Route Kitchen',
    cuisine: 'Indian & Asian Fusion',
    image: '🍜',
    rating: 4.6,
    reviews: 95,
    pricePerPerson: 35,
    specialties: ['Weddings', 'Parties'],
    availability: 'Weekdays & Weekends',
    country: 'United Kingdom',
    eventTypes: ['Wedding', 'Birthday', 'Party'],
  },
  {
    id: 7,
    name: 'London Luxe Catering',
    cuisine: 'British & European',
    image: '🎩',
    rating: 4.8,
    reviews: 134,
    pricePerPerson: 60,
    specialties: ['Royal Events', 'Corporate'],
    availability: 'Year-round',
    country: 'United Kingdom',
    eventTypes: ['Wedding', 'Corporate', 'Gala'],
  },
  // France
  {
    id: 8,
    name: 'Maison Nouvelle Paris',
    cuisine: 'French Cuisine',
    image: '🥐',
    rating: 4.9,
    reviews: 187,
    pricePerPerson: 65,
    specialties: ['Fine Dining', 'Michelin Style'],
    availability: 'Year-round',
    country: 'France',
    eventTypes: ['Wedding', 'Corporate', 'Private Dinner'],
  },
  {
    id: 9,
    name: 'Provence Kitchen',
    cuisine: 'Mediterranean French',
    image: '🍷',
    rating: 4.7,
    reviews: 141,
    pricePerPerson: 48,
    specialties: ['Regional French', 'Wine Pairing'],
    availability: 'Year-round',
    country: 'France',
    eventTypes: ['Private Dinner', 'Wedding', 'Corporate'],
  },
  // Germany
  {
    id: 10,
    name: 'Berlin Fest Catering',
    cuisine: 'German & European',
    image: '🍖',
    rating: 4.5,
    reviews: 76,
    pricePerPerson: 38,
    specialties: ['Traditional', 'Large Events'],
    availability: 'Year-round',
    country: 'Germany',
    eventTypes: ['Corporate', 'Party', 'Birthday'],
  },
  // Italy
  {
    id: 11,
    name: 'Milano Bella Italia',
    cuisine: 'Italian',
    image: '🍝',
    rating: 4.8,
    reviews: 165,
    pricePerPerson: 52,
    specialties: ['Pasta, Risotto', 'Wine Dinners'],
    availability: 'Year-round',
    country: 'Italy',
    eventTypes: ['Wedding', 'Private Dinner', 'Corporate'],
  },
  // Spain
  {
    id: 12,
    name: 'Barcelona Tapas House',
    cuisine: 'Spanish Tapas',
    image: '🥘',
    rating: 4.6,
    reviews: 112,
    pricePerPerson: 40,
    specialties: ['Tapas', 'Paella', 'Spanish Events'],
    availability: 'Year-round',
    country: 'Spain',
    eventTypes: ['Party', 'Corporate', 'Private Dinner'],
  },
  // Australia
  {
    id: 13,
    name: 'Mediterranean Bites',
    cuisine: 'Mediterranean & Greek',
    image: '🥗',
    rating: 4.7,
    reviews: 110,
    pricePerPerson: 40,
    specialties: ['Corporate', 'Private Events'],
    availability: 'Year-round',
    country: 'Australia',
    eventTypes: ['Corporate', 'Private Dinner', 'Wedding'],
  },
  {
    id: 14,
    name: 'Sydney Modern Kitchen',
    cuisine: 'Modern Australian',
    image: '🍤',
    rating: 4.7,
    reviews: 128,
    pricePerPerson: 45,
    specialties: ['Seafood', 'Modern Cuisine'],
    availability: 'Year-round',
    country: 'Australia',
    eventTypes: ['Wedding', 'Corporate', 'Private Dinner'],
  },
  // Japan
  {
    id: 15,
    name: 'Tokyo Street Kitchen',
    cuisine: 'Japanese',
    image: '🍱',
    rating: 4.9,
    reviews: 142,
    pricePerPerson: 50,
    specialties: ['Sushi', 'Kaiseki', 'Private Dinners'],
    availability: 'Year-round',
    country: 'Japan',
    eventTypes: ['Private Dinner', 'Corporate'],
  },
  // India
  {
    id: 16,
    name: 'Mumbai Royal Catering',
    cuisine: 'North Indian',
    image: '🌶️',
    rating: 4.7,
    reviews: 134,
    pricePerPerson: 28,
    specialties: ['Weddings', 'Traditional Indian'],
    availability: 'Year-round',
    country: 'India',
    eventTypes: ['Wedding', 'Corporate', 'Party'],
  },
  {
    id: 17,
    name: 'Bangalore South Indian Kitchen',
    cuisine: 'South Indian',
    image: '🥘',
    rating: 4.6,
    reviews: 108,
    pricePerPerson: 22,
    specialties: ['Vegetarian', 'Dosa', 'Catering'],
    availability: 'Year-round',
    country: 'India',
    eventTypes: ['Corporate', 'Birthday', 'Party'],
  },
  {
    id: 18,
    name: 'Delhi Spice Masters',
    cuisine: 'Multi-Cuisine Indian',
    image: '🍛',
    rating: 4.8,
    reviews: 156,
    pricePerPerson: 32,
    specialties: ['All Indian', 'Large Events'],
    availability: 'Year-round',
    country: 'India',
    eventTypes: ['Wedding', 'Corporate', 'Private Dinner'],
  },
  // Sri Lanka
  {
    id: 19,
    name: 'Colombo Spice Kitchen',
    cuisine: 'Sri Lankan',
    image: '🥛',
    rating: 4.6,
    reviews: 89,
    pricePerPerson: 25,
    specialties: ['Traditional', 'Curry Houses'],
    availability: 'Year-round',
    country: 'Sri Lanka',
    eventTypes: ['Wedding', 'Corporate', 'Party'],
  },
  {
    id: 20,
    name: 'Kandy Heritage Catering',
    cuisine: 'Traditional Sri Lankan',
    image: '🍲',
    rating: 4.5,
    reviews: 76,
    pricePerPerson: 23,
    specialties: ['Authentic', 'Large Groups'],
    availability: 'Year-round',
    country: 'Sri Lanka',
    eventTypes: ['Corporate', 'Party', 'Birthday'],
  },
  // UAE (GCC)
  {
    id: 21,
    name: 'Dubai Premium Catering',
    cuisine: 'Arabic & International',
    image: '🏆',
    rating: 4.8,
    reviews: 178,
    pricePerPerson: 55,
    specialties: ['Luxury Events', 'Arabic Cuisine'],
    availability: 'Year-round',
    country: 'United Arab Emirates',
    eventTypes: ['Wedding', 'Corporate', 'Gala'],
  },
  {
    id: 22,
    name: 'Abu Dhabi Feast',
    cuisine: 'Middle Eastern',
    image: '🍗',
    rating: 4.6,
    reviews: 112,
    pricePerPerson: 45,
    specialties: ['Traditional', 'Mezze'],
    availability: 'Year-round',
    country: 'United Arab Emirates',
    eventTypes: ['Corporate', 'Private Dinner', 'Wedding'],
  },
  // Saudi Arabia (GCC)
  {
    id: 23,
    name: 'Riyadh Royal Kitchen',
    cuisine: 'Saudi Arabian',
    image: '👑',
    rating: 4.7,
    reviews: 145,
    pricePerPerson: 48,
    specialties: ['Traditional', 'Large Gatherings'],
    availability: 'Year-round',
    country: 'Saudi Arabia',
    eventTypes: ['Wedding', 'Corporate', 'Private Dinner'],
  },
  // Qatar (GCC)
  {
    id: 24,
    name: 'Doha Gourmet Catering',
    cuisine: 'Middle Eastern & International',
    image: '✨',
    rating: 4.8,
    reviews: 134,
    pricePerPerson: 52,
    specialties: ['Luxury', 'Corporate Events'],
    availability: 'Year-round',
    country: 'Qatar',
    eventTypes: ['Corporate', 'Wedding', 'Gala'],
  },
  // Singapore
  {
    id: 25,
    name: 'Singapore Culinary Hub',
    cuisine: 'Asian Fusion',
    image: '🍜',
    rating: 4.7,
    reviews: 129,
    pricePerPerson: 48,
    specialties: ['Fusion', 'Multicultural'],
    availability: 'Year-round',
    country: 'Singapore',
    eventTypes: ['Corporate', 'Private Dinner', 'Party'],
  },
  // Thailand
  {
    id: 26,
    name: 'Bangkok Street Feast',
    cuisine: 'Thai',
    image: '🌶️',
    rating: 4.6,
    reviews: 98,
    pricePerPerson: 30,
    specialties: ['Thai Cuisine', 'Street Food'],
    availability: 'Year-round',
    country: 'Thailand',
    eventTypes: ['Party', 'Corporate', 'Private Dinner'],
  },
  // Netherlands
  {
    id: 27,
    name: 'Amsterdam Modern Kitchen',
    cuisine: 'Dutch & European',
    image: '🧅',
    rating: 4.5,
    reviews: 85,
    pricePerPerson: 42,
    specialties: ['Modern', 'Cheese & Wine'],
    availability: 'Year-round',
    country: 'Netherlands',
    eventTypes: ['Corporate', 'Private Dinner', 'Party'],
  },
];

const countries = [
  'All Countries',
  'United States',
  'Canada',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Netherlands',
  'Australia',
  'Japan',
  'Singapore',
  'Thailand',
  'India',
  'Sri Lanka',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
];

const cuisines = [
  'All Cuisines',
  'French & International',
  'American BBQ',
  'Contemporary American',
  'Canadian & French',
  'Asian Fusion',
  'Indian & Asian Fusion',
  'British & European',
  'French Cuisine',
  'Mediterranean French',
  'German & European',
  'Italian',
  'Spanish Tapas',
  'Mediterranean & Greek',
  'Modern Australian',
  'Japanese',
  'North Indian',
  'South Indian',
  'Multi-Cuisine Indian',
  'Sri Lankan',
  'Traditional Sri Lankan',
  'Arabic & International',
  'Middle Eastern',
  'Saudi Arabian',
  'Thai',
  'Dutch & European',
];

const eventTypes = ['All Events', 'Wedding', 'Corporate', 'Birthday', 'Private Dinner', 'Party', 'Gala'];

const AllCaterersPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('All Countries');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilterOptions = () => {
    if (filterType === 'country') return countries;
    if (filterType === 'cuisine') return cuisines;
    return eventTypes;
  };

  const getFilteredCaters = () => {
    let filtered = allCaters;

    if (filterType === 'country' && selectedFilter !== 'All Countries') {
      filtered = filtered.filter((c) => c.country === selectedFilter);
    } else if (filterType === 'cuisine' && selectedFilter !== 'All Cuisines') {
      filtered = filtered.filter((c) => c.cuisine === selectedFilter);
    } else if (filterType === 'event' && selectedFilter !== 'All Events') {
      filtered = filtered.filter((c) => c.eventTypes.includes(selectedFilter));
    }

    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredCaters = getFilteredCaters();
  const filterOptions = getFilterOptions();

  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#f97316',
          color: 'white',
          paddingTop: '4rem',
          paddingBottom: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div className="max-w-7xl px-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Find Your Perfect Caterer
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>
            Browse {allCaters.length}+ catering services across 19 countries
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search caterers by name or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              color: '#111827',
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedFilter('All Countries');
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: filterType === 'all' ? '#f97316' : 'white',
              color: filterType === 'all' ? 'white' : '#111827',
              border: filterType === 'all' ? 'none' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.875rem',
            }}
          >
            All Caterers
          </button>
          <button
            onClick={() => {
              setFilterType('country');
              setSelectedFilter('All Countries');
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: filterType === 'country' ? '#f97316' : 'white',
              color: filterType === 'country' ? 'white' : '#111827',
              border: filterType === 'country' ? 'none' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.875rem',
            }}
          >
            By Country
          </button>
          <button
            onClick={() => {
              setFilterType('cuisine');
              setSelectedFilter('All Cuisines');
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: filterType === 'cuisine' ? '#f97316' : 'white',
              color: filterType === 'cuisine' ? 'white' : '#111827',
              border: filterType === 'cuisine' ? 'none' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.875rem',
            }}
          >
            By Cuisine
          </button>
          <button
            onClick={() => {
              setFilterType('event');
              setSelectedFilter('All Events');
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: filterType === 'event' ? '#f97316' : 'white',
              color: filterType === 'event' ? 'white' : '#111827',
              border: filterType === 'event' ? 'none' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.875rem',
            }}
          >
            By Event Type
          </button>
        </div>

        {/* Filter Options */}
        {filterType !== 'all' && (
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedFilter(option)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedFilter === option ? '#fbbf24' : '#f3f4f6',
                  color: selectedFilter === option ? '#92400e' : '#6b7280',
                  border: selectedFilter === option ? 'none' : '1px solid #e5e7eb',
                  borderRadius: '9999px',
                  fontWeight: selectedFilter === option ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredCaters.length} of {allCaters.length} caterers
          {selectedFilter !== 'All Countries' && selectedFilter !== 'All Cuisines' && selectedFilter !== 'All Events' && (
            <span style={{ fontWeight: '600', color: '#f97316' }}>
              {' '}· Filtered by: <strong>{selectedFilter}</strong>
            </span>
          )}
        </div>

        {/* Caterers Grid */}
        {filteredCaters.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredCaters.map((cater) => (
              <Link key={cater.id} href={`/caters/${cater.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    border: '1px solid #e5e7eb',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: '100%',
                      height: '180px',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3.5rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {cater.image}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                      {cater.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      {cater.cuisine}
                    </p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                        {'★'.repeat(Math.floor(cater.rating))} {cater.rating}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>({cater.reviews})</span>
                    </div>

                    {/* Price & Location */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>From</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#f97316' }}>
                          ${cater.pricePerPerson}
                        </p>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>
                        📍 {cater.country}
                      </p>
                    </div>

                    {/* Event Types */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cater.eventTypes.slice(0, 2).map((type, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontWeight: '500',
                          }}
                        >
                          {type}
                        </span>
                      ))}
                      {cater.eventTypes.length > 2 && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                          }}
                        >
                          +{cater.eventTypes.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
              No caterers found matching your criteria.
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setSelectedFilter('All Countries');
                setSearchQuery('');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              View All Caterers
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AllCaterersPage;