'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

interface CaterDetails {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  pricePerPerson: number;
  description: string;
  image: string;
  banner: string;
  location: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
  availability: string;
  minGuests: number;
  maxGuests: number;
  specialties: string[];
}

interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  courses: string[];
  servingSize: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

// Mock data
const mockCaterDetails: CaterDetails = {
  id: 1,
  name: 'Elegant Events Catering',
  cuisine: 'French & International',
  rating: 4.8,
  reviews: 128,
  pricePerPerson: 45,
  description: 'Premium catering services specializing in sophisticated events. With over 15 years of experience, we deliver exceptional culinary experiences for weddings, corporate events, and private celebrations.',
  image: '👨‍🍳',
  banner: 'https://images.unsplash.com/photo-1504674900936-f4d4867f7f04?w=1200&h=400&fit=crop',
  location: '123 Gourmet Street, New York, NY 10001',
  coordinates: { lat: 40.7128, lng: -74.006 },
  phone: '+1 (555) 123-4567',
  email: 'info@elegantevents.com',
  availability: 'Year-round',
  minGuests: 20,
  maxGuests: 500,
  specialties: ['Weddings', 'Corporate Events', 'Private Dinners', 'Celebrations'],
};

const mockMenus: Menu[] = [
  {
    id: 1,
    name: 'Classic French Menu',
    description: 'Traditional French cuisine with elegant presentation',
    price: 55,
    courses: ['Amuse-bouche', 'Appetizer', 'Main Course', 'Dessert', 'Coffee & Petit Fours'],
    servingSize: '4 courses',
  },
  {
    id: 2,
    name: 'International Buffet',
    description: 'Diverse selection of international cuisines',
    price: 40,
    courses: ['Salads', 'Hot Mains', 'Sides', 'Desserts', 'Beverages'],
    servingSize: 'All-inclusive',
  },
  {
    id: 3,
    name: 'Contemporary Tasting',
    description: 'Modern fusion with creative presentations',
    price: 65,
    courses: ['Small Plates', 'Main Selection', 'Palate Cleanser', 'Dessert Course', 'Extras'],
    servingSize: '5 courses',
  },
];

const mockReviews: Review[] = [
  {
    id: 1,
    author: 'Sarah Johnson',
    rating: 5,
    text: 'Absolutely fantastic! The food was delicious and the service was impeccable. Highly recommended!',
    date: '2 weeks ago',
    avatar: 'S',
  },
  {
    id: 2,
    author: 'Michael Chen',
    rating: 5,
    text: 'Best corporate catering we have used. Professional, on-time, and the food was amazing.',
    date: '1 month ago',
    avatar: 'M',
  },
  {
    id: 3,
    author: 'Emily Rodriguez',
    rating: 4,
    text: 'Great food quality and excellent team. Would definitely book again for our next event.',
    date: '2 months ago',
    avatar: 'E',
  },
];

export default function CaterPage() {
  const params = useParams();
  const caterId = params.id;

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [guestCount, setGuestCount] = useState(50);
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [showPreorderForm, setShowPreorderForm] = useState(false);

  const handlePreorder = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      caterId,
      selectedMenu: selectedMenu?.id,
      guestCount,
      eventDate,
      eventType,
      specialRequests,
    });
    alert('Preorder submitted successfully!');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'menus', label: 'Menus' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'location', label: 'Location' },
  ];

  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Banner Section */}
      <div
        style={{
          backgroundImage: `url('${mockCaterDetails.banner}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      </div>

      {/* Header Section */}
      <div className="max-w-7xl px-4" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
          }}
        >
          {/* Left Section */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '3rem',
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mockCaterDetails.image}
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                  {mockCaterDetails.name}
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  {mockCaterDetails.cuisine}
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                    ★★★★★ {mockCaterDetails.rating}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    ({mockCaterDetails.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              {mockCaterDetails.description}
            </p>

            {/* Quick Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Price Range
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#f97316' }}>
                  From ${mockCaterDetails.pricePerPerson}/person
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Guest Capacity
                </p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {mockCaterDetails.minGuests} - {mockCaterDetails.maxGuests} guests
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Availability
                </p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {mockCaterDetails.availability}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Contact
                </p>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>
                  {mockCaterDetails.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Preorder Button */}
          <div style={{ minWidth: '300px' }}>
            <button
              onClick={() => setShowPreorderForm(!showPreorderForm)}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontSize: '1rem',
                marginBottom: '1rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
            >
              📋 Book Now
            </button>

            {/* Specialties */}
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                Specialties
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {mockCaterDetails.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '9999px',
                      fontWeight: '500',
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl px-4" style={{ marginTop: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#f97316' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  borderBottom: activeTab === tab.id ? '2px solid #f97316' : 'none',
                  transition: 'all 0.3s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                  About {mockCaterDetails.name}
                </h2>
                <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
                  {mockCaterDetails.description}
                </p>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Phone</p>
                    <a href={`tel:${mockCaterDetails.phone}`} style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>
                      {mockCaterDetails.phone}
                    </a>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Email</p>
                    <a href={`mailto:${mockCaterDetails.email}`} style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>
                      {mockCaterDetails.email}
                    </a>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Location</p>
                    <p style={{ fontWeight: '600', color: '#111827' }}>{mockCaterDetails.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menus Tab */}
            {activeTab === 'menus' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
                  Available Menus
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {mockMenus.map((menu) => (
                    <div
                      key={menu.id}
                      style={{
                        backgroundColor: selectedMenu?.id === menu.id ? '#fef3c7' : '#f9fafb',
                        border: selectedMenu?.id === menu.id ? '2px solid #f97316' : '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onClick={() => setSelectedMenu(menu)}
                      onMouseEnter={(e) => {
                        if (selectedMenu?.id !== menu.id) {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                            {menu.name}
                          </h3>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {menu.description}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>
                            ${menu.price}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>per person</p>
                        </div>
                      </div>

                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                          Courses
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {menu.courses.map((course, idx) => (
                            <li key={idx} style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                              ✓ {course}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedMenu?.id === menu.id && (
                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', textAlign: 'center' }}>
                          <p style={{ color: '#059669', fontWeight: '600', fontSize: '0.875rem' }}>✓ Selected</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
                  Customer Reviews ({mockReviews.length})
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {mockReviews.map((review) => (
                    <div key={review.id} style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
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
                          {review.avatar}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#111827' }}>{review.author}</p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{review.date}</p>
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ color: '#fbbf24' }}>{'★'.repeat(review.rating)}</span>
                      </div>
                      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                  Location
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
                  {mockCaterDetails.location}
                </p>
                <div
                  style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                >
                  📍 Map View - Coordinates: {mockCaterDetails.coordinates.lat}, {mockCaterDetails.coordinates.lng}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preorder Form Modal */}
      {showPreorderForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                Book {mockCaterDetails.name}
              </h2>
              <button
                onClick={() => setShowPreorderForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePreorder}>
              {/* Event Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Event Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="private">Private Dinner</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Date */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Event Date *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                  }}
                />
              </div>

              {/* Guest Count */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Number of Guests: <span style={{ color: '#f97316', fontWeight: 'bold' }}>{guestCount}</span>
                </label>
                <input
                  type="range"
                  min={mockCaterDetails.minGuests}
                  max={mockCaterDetails.maxGuests}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  <span>{mockCaterDetails.minGuests}</span>
                  <span>{mockCaterDetails.maxGuests}</span>
                </div>
              </div>

              {/* Menu Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Select Menu *
                </label>
                <select
                  value={selectedMenu?.id || ''}
                  onChange={(e) => {
                    const menu = mockMenus.find((m) => m.id === parseInt(e.target.value));
                    setSelectedMenu(menu || null);
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Choose a menu</option>
                  {mockMenus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name} - ${menu.price}/person
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any dietary restrictions, allergies, or special requests..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    minHeight: '100px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Total Estimation */}
              {selectedMenu && (
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>Menu ({guestCount} guests)</span>
                    <span style={{ fontWeight: '600', color: '#111827' }}>${selectedMenu.price * guestCount}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#111827' }}>Estimated Total</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316' }}>
                      ${selectedMenu.price * guestCount}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPreorderForm(false)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
                >
                  Complete Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}