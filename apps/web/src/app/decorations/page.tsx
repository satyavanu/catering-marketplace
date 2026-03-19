'use client';

import React, { useState } from 'react';
import { SparklesIcon, StarIcon, CheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';

const DecorationsPage = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const decorations = [
    {
      id: 1,
      name: "Luxury Floral Arrangements",
      company: "Bloom & Blossom",
      price: "$800 - $2,500",
      rating: 4.9,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&h=300&fit=crop",
      theme: "Floral",
      details: "Premium fresh flower arrangements and installations",
    },
    {
      id: 2,
      name: "Modern Lighting Design",
      company: "Illuminate Events",
      price: "$1,200 - $3,500",
      rating: 4.8,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop",
      theme: "Lighting",
      details: "Professional LED lighting and special effects",
    },
    {
      id: 3,
      name: "Elegant Table Settings",
      company: "Luxe Table Design",
      price: "$500 - $1,500",
      rating: 4.7,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop",
      theme: "Table Decor",
      details: "Custom tablecloths, runners, and centerpieces",
    },
    {
      id: 4,
      name: "Backdrop & Arch Rentals",
      company: "Photo Perfect Backdrops",
      price: "$400 - $1,200",
      rating: 4.8,
      reviews: 412,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
      theme: "Backdrops",
      details: "Custom designed backdrops and wedding arches",
    },
    {
      id: 5,
      name: "Balloon Installations",
      company: "Airborne Celebrations",
      price: "$600 - $1,800",
      rating: 4.6,
      reviews: 289,
      image: "https://images.unsplash.com/photo-1514626585111-9f3f3ba7cb97?w=500&h=300&fit=crop",
      theme: "Balloons",
      details: "Creative balloon arches, garlands, and installations",
    },
    {
      id: 6,
      name: "Draping & Fabric Design",
      company: "Elegante Fabrics",
      price: "$700 - $2,000",
      rating: 4.9,
      reviews: 356,
      image: "https://images.unsplash.com/photo-1508003535872-a647146629cd?w=500&h=300&fit=crop",
      theme: "Draping",
      details: "Premium fabric draping and ceiling installations",
    },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "60px 32px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "800",
          margin: "0 0 12px 0",
        }}>
          Transform Your Event with Beautiful Decorations
        </h1>
        <p style={{
          fontSize: "18px",
          opacity: 0.9,
          margin: 0,
        }}>
          Stunning decor options for every celebration
        </p>
      </div>

      {/* Filters Section */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "32px",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
          marginBottom: "32px",
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 16px 0",
          }}>
            Filter Decorations
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}>
            <div>
              <label style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                display: "block",
                marginBottom: "8px",
              }}>
                Theme
              </label>
              <select style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}>
                <option>All Themes</option>
                <option>Floral</option>
                <option>Lighting</option>
                <option>Table Decor</option>
                <option>Backdrops</option>
                <option>Balloons</option>
                <option>Draping</option>
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
                Price Range
              </label>
              <select style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}>
                <option>Any Price</option>
                <option>$0 - $500</option>
                <option>$500 - $1,000</option>
                <option>$1,000 - $2,000</option>
                <option>$2,000+</option>
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
                Event Type
              </label>
              <select style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}>
                <option>Any Event</option>
                <option>Wedding</option>
                <option>Corporate</option>
                <option>Birthday</option>
                <option>Anniversary</option>
              </select>
            </div>

            <div style={{
              display: "flex",
              alignItems: "flex-end",
            }}>
              <button style={{
                width: "100%",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#764ba2"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Decorations Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}>
          {decorations.map((decor) => (
            <div
              key={decor.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div style={{
                position: "relative",
                width: "100%",
                height: "200px",
                overflow: "hidden",
                backgroundColor: "#e2e8f0",
              }}>
                <img
                  src={decor.image}
                  alt={decor.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  backgroundColor: "#667eea",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                }}>
                  {decor.theme}
                </div>
                <button
                  onClick={() => toggleFavorite(decor.id)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "white",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <HeartIcon
                    style={{
                      width: "18px",
                      height: "18px",
                      color: favorites.includes(decor.id) ? "#ef4444" : "#94a3b8",
                      fill: favorites.includes(decor.id) ? "#ef4444" : "none",
                    }}
                  />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "16px" }}>
                <h3 style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 6px 0",
                }}>
                  {decor.name}
                </h3>

                <p style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 8px 0",
                }}>
                  {decor.company}
                </p>

                <p style={{
                  fontSize: "12px",
                  color: "#475569",
                  margin: "0 0 12px 0",
                  lineHeight: "1.4",
                }}>
                  {decor.details}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <StarIcon style={{ width: "16px", height: "16px", color: "#f59e0b", fill: "#f59e0b" }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                      {decor.rating}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      ({decor.reviews})
                    </span>
                  </div>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#667eea",
                  }}>
                    {decor.price}
                  </span>
                </div>

                <button style={{
                  width: "100%",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#764ba2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecorationsPage;