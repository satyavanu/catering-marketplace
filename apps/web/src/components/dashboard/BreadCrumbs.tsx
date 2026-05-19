'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routeMap: Record<string, string> = {
  dashboard: 'Dashboard',
  partner: 'Home',
  customer: 'Home',
  admin: 'Home',
  services: 'Services',
  chef: 'Chef Services',
  'meal-plans': 'Meal Plans',
  catering: 'Catering',
  bookings: 'Bookings',
  calendar: 'Calendar',
  settings: 'Settings',
  profile: 'Profile',
  analytics: 'Analytics',
  earnings: 'Earnings',
  offers: 'Offers',
  workers: 'Workers',
  messages: 'Messages',
  reviews: 'Reviews',
  orders: 'Orders',
  approvals: 'Approvals',
  'service-approvals': 'Service Approvals',
  'restaurant-events': 'Restaurant Events',
  new: 'New',
  edit: 'Edit',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const homeSegment = parts[0] || '';
  const homeHref =
    homeSegment === 'customer'
      ? '/customer'
      : homeSegment === 'admin'
        ? '/admin'
        : '/partner';
  const crumbs = [
    { label: 'Home', href: homeHref },
    ...parts.slice(1).map((part, index) => ({
      label: labelFor(part),
      href: `/${[homeSegment, ...parts.slice(1, index + 2)].join('/')}`,
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" style={styles.wrapper}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${crumb.href}-${index}`} style={styles.item}>
            {index !== 0 && <span style={styles.separator}>/</span>}
            {isLast ? (
              <span style={styles.current}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} style={styles.link}>
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function labelFor(part: string) {
  if (routeMap[part]) return routeMap[part];

  return part
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontWeight: 750,
  },
  current: {
    color: '#111827',
    fontWeight: 800,
  },
  separator: {
    margin: '0 6px',
    color: '#cbd5f5',
  },
};
