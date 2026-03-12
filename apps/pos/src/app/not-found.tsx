'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 1rem 0' }}>
        404
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem' }}>
        Page not found
      </p>
      <Link href="/" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}