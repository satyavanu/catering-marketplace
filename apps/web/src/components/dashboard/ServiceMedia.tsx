'use client';

import React from 'react';

type Props = {
  images?: string[];
  type: 'chef' | 'meal_plan' | 'catering';
  size?: number;
};

export default function ServiceMedia({
  images = [],
  type,
  size = 44,
}: Props) {
  const fallback = getFallback(type);

  const src = images[0] || fallback;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#f8f5ff',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt="service"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

function getFallback(type: string) {
  if (type === 'chef') return '/images/chef-placeholder.png';
  if (type === 'meal_plan') return '/images/meal-placeholder.png';
  return '/images/catering-placeholder.png';
}