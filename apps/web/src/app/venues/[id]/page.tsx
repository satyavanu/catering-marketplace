'use client';

import React, { useState } from 'react';
import { MapPinIcon, StarIcon, UsersIcon, HeartIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Link from 'next/link';

const VenueDetailPage = ({ params }: { params: { id: string } }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    eventDate: '',
    guestCount: '',
    eventType: '',
    name: '',
    email: '',
    phone: '',
  });

  const venue = {
    id: parseInt(params.id),
    name: "Grand Ballroom Palace",
    location: "New York, NY",
    capacity: "500-1000",
    price: "$5,000 - $15,000",
    pricePerPerson: "$10 - $30",
    rating: 4.9,
    reviews: 287,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f19106c9f3?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519914213002-6f6a0b0e0e5c?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510578474443-d4c4c9a0a4e5?w=1200&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Parking", "Catering", "Sound System", "Stage", "Dance Floor", "Bar", "Lounge"],
    description: "Experience luxury and elegance at the Grand Ballroom Palace. Located in the heart of New York City, our stunning venue features state-of-the-art facilities and impeccable service for your unforgettable event.",
    details: {
      spaceSize: "15,000 sq ft",
      indoorOutdoor: "Both available",
      setup: "Flexible layouts",
      parking: "Complimentary valet parking",
      catering: "In-house & outside catering allowed",
      alcohol: "Full liquor license",
    },
    reviews_list: [
      {
        id: 1,
        author: "Sarah Johnson",
        rating: 5,
        date: "2024-03-15",
        text: "Absolutely stunning venue! The staff was incredibly helpful and professional. Highly recommend!",
      },
      {
        id: 2,
        author: "Michael Chen",
        rating: 4.5,
        date: "2024-03-10",
        text: "Great space and excellent service. A bit pricey but worth every penny.",
      },
      {
        id: 3,
        author: "Emily Williams",
        rating: 5,
        date: "2024-03-05",
        text: "Perfect for our wedding! The natural lighting and elegant decor were amazing.",
      },
    ],
  };

  const handleBooking = () => {
    if (bookingData.eventDate && bookingData.guestCount && bookingData.name && bookingData.email && bookingData.phone) {
      alert(`Booking request submitted! Check your email at ${bookingData.email} for confirmation.`);
      setShowBookingModal(false);
      setBookingData({
        eventDate: '',
        guestCount: '',
        eventType: '',
        name: '',
        email: '',
        phone: '',
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Image Gallery */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "500px",
        backgroundColor: "#e2e8f0",
        overflow: "hidden",
      }}>
        <img
          src={venue.images[currentImageIndex]}
          alt={venue.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Navigation Buttons */}
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? venue.images.length - 1 : prev - 1))}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "white"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"}
        >
          <ChevronLeftIcon style={{ width: "20px", height: "20px", color: "#667eea" }} />
        </button>

        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === venue.images.length - 1 ? 0 : prev + 1))}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "white"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"}
        >
          <ChevronRightIcon style={{ width: "20px", height: "20px", color: "#667eea" }} />
        </button>

        {/* Image Counter */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "600",
        }}>
          {currentImageIndex + 1} / {venue.images.length}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "32px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "32px",
        }}>
          {/* Left Column */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 12px 0",
              }}>
                {venue.name}
              </h1>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPinIcon style={{ width: "18px", height: "18px", color: "#667eea" }} />
                  <span style={{ fontSize: "15px", color: "#64748b" }}>{venue.location}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <StarIcon style={{ width: "18px", height: "18px", color: "#f59e0b", fill: "#f59e0b" }} />
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                    {venue.rating}
                  </span>
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                    ({venue.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 12px 0",
              }}>
                About this venue
              </h2>
              <p style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#475569",
              }}>
                {venue.description}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 16px 0",
              }}>
                Amenities
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}>
                {venue.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <CheckIcon style={{ width: "16px", height: "16px", color: "#667eea" }} />
                    <span style={{ fontSize: "13px", color: "#475569" }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 16px 0",
              }}>
                Venue Details
              </h2>
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}>
                  {Object.entries(venue.details).map(([key, value]) => (
                    <div key={key}>
                      <label style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#94a3b8",
                        display: "block",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                      }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1e293b",
                        margin: 0,
                      }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 16px 0",
              }}>
                Guest Reviews
              </h2>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
                {venue.reviews_list.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "12px",
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#1e293b",
                          margin: 0,
                        }}>
                          {review.author}
                        </h4>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginTop: "4px",
                        }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              style={{
                                width: "14px",
                                height: "14px",
                                color: i < Math.floor(review.rating) ? "#f59e0b" : "#e2e8f0",
                                fill: i < Math.floor(review.rating) ? "#f59e0b" : "none",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <span style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}>
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{
                      fontSize: "13px",
                      color: "#475569",
                      margin: 0,
                      lineHeight: "1.5",
                    }}>
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{
            position: "sticky",
            top: "100px",
            height: "fit-content",
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{ marginBottom: "24px" }}>
                <p style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  margin: "0 0 4px 0",
                  textTransform: "uppercase",
                }}>
                  Price per person
                </p>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#667eea",
                  margin: "0 0 12px 0",
                }}>
                  {venue.pricePerPerson}
                </p>
                <p style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  margin: "0 0 4px 0",
                  textTransform: "uppercase",
                }}>
                  Total capacity
                </p>
                <p style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}>
                  {venue.capacity} guests
                </p>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                style={{
                  width: "100%",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "12px",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#764ba2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
              >
                Book Now
              </button>

              <button style={{
                width: "100%",
                backgroundColor: "white",
                color: "#667eea",
                border: "2px solid #667eea",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}>
                  <HeartIcon style={{ width: "18px", height: "18px" }} />
                  Save to favorites
                </div>
              </button>

              <div style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #e2e8f0",
              }}>
                <p style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  margin: "0 0 8px 0",
                  textTransform: "uppercase",
                }}>
                  Contact Information
                </p>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#475569",
                }}>
                  <div>📞 +1 (555) 123-4567</div>
                  <div>📧 info@grandballroom.com</div>
                  <div>🌐 www.grandballroom.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "32px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#1e293b",
              margin: "0 0 24px 0",
            }}>
              Book {venue.name}
            </h2>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "24px",
            }}>
              <div>
                <label style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                }}>
                  Event Date *
                </label>
                <input
                  type="date"
                  value={bookingData.eventDate}
                  onChange={(e) => setBookingData({ ...bookingData, eventDate: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                }}>
                  Number of Guests *
                </label>
                <input
                  type="number"
                  placeholder="Enter guest count"
                  value={bookingData.guestCount}
                  onChange={(e) => setBookingData({ ...bookingData, guestCount: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                }}>
                  Event Type
                </label>
                <select
                  value={bookingData.eventType}
                  onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                >
                  <option>Select event type</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "8px",
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "12px",
            }}>
              <button
                onClick={() => setShowBookingModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
              >
                Cancel
              </button>

              <button
                onClick={handleBooking}
                style={{
                  flex: 1,
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#764ba2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetailPage;