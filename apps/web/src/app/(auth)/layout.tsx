'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const LOGO_URL =
  'https://ckklrguidafoseanzmdk.supabase.co/storage/v1/object/public/assets/logo/logo.png';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname.startsWith('/onboarding');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 32rem), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily:
          '"Google Sans", roboto, "Noto Sans Myanmar UI", "Noto Sans Khmer", arial, sans-serif',
      }}
    >
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '18px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: isOnboarding ? 760 : 440,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: isOnboarding ? 12 : 14,
          }}
        >
          <Link
            href="/"
            aria-label="Droooly home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              alignSelf: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src={LOGO_URL}
              alt="Droooly"
              style={{
                width: 124,
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </Link>

          {children}

          <footer
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              background: 'transparent',
              color: '#64748b',
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            <Link
              href="/help-center"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Help
            </Link>
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Terms
            </Link>
            <Link
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Contact
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footerLink: {
    background: 'transparent',
    color: '#64748b',
    textDecoration: 'none',
  },
};
