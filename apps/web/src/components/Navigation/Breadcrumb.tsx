'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  accentColor?: string;
  separator?: React.ReactNode;
  maxItems?: number;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  accentColor = '#f59e0b',
  separator,
  maxItems = 5,
}) => {
  // Show ellipsis if too many items
  const displayItems = items.length > maxItems
    ? [items[0], { label: '...', href: undefined }, ...items.slice(-(maxItems - 2))]
    : items;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 0',
        overflow: 'auto',
      }}
      aria-label="Breadcrumb"
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0,
          padding: 0,
          listStyle: 'none',
          flexWrap: 'wrap',
        }}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <React.Fragment key={index}>
              {index > 0 && !isEllipsis && (
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#cbd5e1',
                    margin: '0 4px',
                  }}
                >
                  {separator || <ChevronRightIcon style={{ width: '16px', height: '16px' }} />}
                </li>
              )}

              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isEllipsis ? (
                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '4px 8px',
                    }}
                  >
                    {item.label}
                  </span>
                ) : isLast ? (
                  <span
                    style={{
                      color: '#1e293b',
                      fontSize: '14px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: `${accentColor}10`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {item.icon && (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '#'}
                    style={{
                      color: accentColor,
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: item.href ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e) => {
                      if (item.href) {
                        e.currentTarget.style.backgroundColor = `${accentColor}10`;
                        e.currentTarget.style.textDecoration = 'underline';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {item.icon && (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;