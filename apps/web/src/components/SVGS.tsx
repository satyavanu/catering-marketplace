import React from 'react';

// Rating Star
export const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFB800">
    <path d="M12 2l3.1 6.3L22 9.3l-5 4.9L18.2 21 12 17.8 5.8 21 7 14.2 2 9.3l6.9-1L12 2z" />
  </svg>
);

// Heart (Like)
export const HeartIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.3 4.3a5 5 0 0 1 7.1 0L12 4.9l.6-.6a5 5 0 1 1 7.1 7.1L12 19l-7.7-7.7a5 5 0 0 1 0-7.1z" />
  </svg>
);

// Rupee
export const RupeeIcon = () => (
  <svg width="22" height="22" stroke="#FF8A39" fill="none" strokeWidth="1.8">
    <path
      d="M12 3H6m6 0a4 4 0 0 1 0 8H6m6-8H6m0 8l8 10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chef Hat
export const ChefHatIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#FF8A39" strokeWidth="1.8">
    <path d="M4 10a4 4 0 1 1 4.7-6A5 5 0 0 1 17 6a4 4 0 1 1 3 7H4z" />
    <path d="M6 10v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
  </svg>
);

// Bag
export const BagIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#FF8A39" strokeWidth="1.8">
    <path d="M6 8h12l1 12H5L6 8z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
);

export const VerifiedIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4CAF50"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const TagIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF9800"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 12l-8 8-8-8V4h8l8 8z" />
    <circle cx="9" cy="9" r="1.5" />
  </svg>
);

export const RefreshIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7C4DFF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 1 9 9" />
    <polyline points="3 8 3 12 7 12" />
  </svg>
);

export const FeatureIcons = () => (
  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
    <VerifiedIcon />
    <TagIcon />
    <RefreshIcon />
  </div>
);

export const PhoneWithShield = () => (
  <svg
    width="256"
    height="256"
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="120" fill="url(#bgGradient)" />
    <rect
      x="70"
      y="50"
      width="100"
      height="150"
      rx="22"
      stroke="url(#mainGradient)"
      stroke-width="8"
      fill="none"
    />

    <rect
      x="98"
      y="60"
      width="60"
      height="10"
      rx="5"
      fill="url(#mainGradient)"
    />
    <rect
      x="110"
      y="180"
      width="36"
      height="8"
      rx="4"
      fill="url(#mainGradient)"
    />
    <path
      d="M150 120 
           C150 100 180 95 190 110 
           L190 150 
           C190 170 170 185 160 190 
           C150 185 130 170 130 150 
           L130 120 
           C140 105 150 100 150 120 Z"
      fill="url(#mainGradient)"
    />
    <path
      d="M145 150 L155 160 L175 140"
      stroke="white"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <radialGradient
        id="bgGradient"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(128 128) scale(120)"
      >
        <stop offset="0%" stop-color="#F5F3FF" />
        <stop offset="100%" stop-color="#EDE9FE" />
      </radialGradient>

      <linearGradient
        id="mainGradient"
        x1="70"
        y1="50"
        x2="190"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#6D28D9" />
        <stop offset="50%" stop-color="#9333EA" />
        <stop offset="100%" stop-color="#C084FC" />
      </linearGradient>
    </defs>
  </svg>
);

export default FeatureIcons;
