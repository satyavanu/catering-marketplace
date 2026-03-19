'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header style={{
      backgroundColor: "white",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 32px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
          gap: "32px",
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}>
              🍽️
            </div>
            <span style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              whiteSpace: "nowrap",
            }}>
              CaterHub
            </span>
            
          </Link>

          {/* Navigation Menu */}
          <nav style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flex: 1,
          }}>
            <Link href="/" style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#64748b",
              textDecoration: "none",
              transition: "all 0.2s ease",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              Explore
            </Link>

            <Link href="/catering" style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#64748b",
              textDecoration: "none",
              transition: "all 0.2s ease",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              Catering
            </Link>

            <Link href="/venues" style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#64748b",
              textDecoration: "none",
              transition: "all 0.2s ease",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              Venues
            </Link>

            <Link href="/decorations" style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#64748b",
              textDecoration: "none",
              transition: "all 0.2s ease",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              Decorations
            </Link>

            <Link href="/experiences" style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#64748b",
              textDecoration: "none",
              transition: "all 0.2s ease",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              Experiences
            </Link>
          </nav>

          {/* Search Bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            paddingLeft: "14px",
            paddingRight: "14px",
            height: "40px",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease",
            flexShrink: 0,
            minWidth: "200px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#667eea";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            <MagnifyingGlassIcon style={{
              width: "18px",
              height: "18px",
              color: "#94a3b8",
              flexShrink: 0,
            }} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: "13px",
                color: "#1e293b",
              }}
            />
          </div>

          {/* Right Actions */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}>
            <Link href="/become-caterer" style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#667eea",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #667eea",
              backgroundColor: "transparent",
              transition: "all 0.2s ease",
              display: "inline-block",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              Become a Partner
            </Link>

            <Link href="/login" style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "white",
              textDecoration: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              backgroundColor: "#667eea",
              transition: "all 0.2s ease",
              display: "inline-block",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#764ba2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#667eea";
            }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;