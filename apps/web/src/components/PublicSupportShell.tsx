'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

export const DROOOLY_LOGO_URL =
  'https://ckklrguidafoseanzmdk.supabase.co/storage/v1/object/public/assets/logo/logo.png';

type PublicSupportShellProps = {
  children: ReactNode;
  contentMaxWidth?: number;
  showFooter?: boolean;
};

const navItems = [
  { label: 'Become a Partner', href: '/onboarding', match: '/onboarding' },
  { label: 'FAQ', href: '/faq', match: '/faq' },
  { label: 'Privacy', href: '/privacy-policy', match: '/privacy-policy' },
  { label: 'Terms', href: '/terms-of-use', match: '/terms-of-use' },
  { label: 'Contact', href: '/contact-us', match: '/contact-us' },
];

export default function PublicSupportShell({
  children,
  contentMaxWidth = 920,
  showFooter = true,
}: PublicSupportShellProps) {
  const pathname = usePathname();

  return (
    <div style={styles.page}>
      <div style={{ ...styles.wrap, maxWidth: contentMaxWidth }}>
        <header style={styles.header}>
          <Link href="/" aria-label="Droooly home" style={styles.logoLink}>
            <img src={DROOOLY_LOGO_URL} alt="Droooly" style={styles.logo} />
          </Link>

          <nav aria-label="Support pages" style={styles.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.match;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : null),
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {children}

        {showFooter ? (
          <footer style={styles.footer}>
            <span style={styles.copyright}>
              © 2026 Droooly. All rights reserved.
            </span>
            <div style={styles.footerLinks}>
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.footerLink,
                    ...(pathname === item.match ? styles.footerLinkActive : null),
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: '100%',
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 32rem), linear-gradient(180deg, #fbfbff 0%, #eef2f7 100%)',
    fontFamily:
      '"Google Sans", roboto, "Noto Sans Myanmar UI", "Noto Sans Khmer", arial, sans-serif',
    color: '#151126',
    padding: 'clamp(16px, 3vw, 32px)',
  },
  wrap: {
    width: '100%',
    margin: '0 auto',
  },
  header: {
    width: '100%',
    minHeight: 68,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 20,
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    textDecoration: 'none',
  },
  logo: {
    width: 122,
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    flexWrap: 'wrap',
  },
  navLink: {
    minHeight: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    borderRadius: 8,
    color: '#64748b',
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1,
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
  },
  navLinkActive: {
    color: '#7c3aed',
    background: '#f3e8ff',
    borderBottomColor: '#8b5cf6',
  },
  footer: {
    marginTop: 24,
    padding: '18px 6px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
  },
  copyright: {
    color: '#64748b',
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
  },
  footerLinkActive: {
    color: '#7c3aed',
  },
};
