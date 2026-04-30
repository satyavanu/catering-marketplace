'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const routeMap: Record<string, string> = {
  dashboard: 'Dashboard',
  services: 'Services',
  chef: 'Chef Services',
  'meal-plans': 'Meal Plans',
  catering: 'Catering',
  new: 'New',
  edit: 'Edit',
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  const parts = pathname.split('/').filter(Boolean);

  return (
    <div style={styles.wrapper}>
      {parts.map((part, index) => {
        const label = routeMap[part] || part;

        return (
          <span key={index} style={styles.item}>
            {index !== 0 && <span style={styles.separator}>/</span>}
            {label}
          </span>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  separator: {
    margin: '0 6px',
    color: '#cbd5f5',
  },
};