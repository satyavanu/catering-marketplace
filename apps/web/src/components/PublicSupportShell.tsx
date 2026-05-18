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
    <div className="support-page" style={styles.page}>
      <style>{`
        .support-shell {
          border-radius: 14px;
        }

        .support-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .support-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 22px;
        }

        .support-nav-link {
          position: relative;
        }

        .support-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 3px;
          border-radius: 999px;
          background: transparent;
        }

        .support-nav-link-active::after {
          background: #8b5cf6;
        }

        @media (max-width: 760px) {
          .support-page {
            padding: 12px;
          }

          .support-shell {
            border-radius: 12px;
          }

          .support-header {
            align-items: flex-start;
            gap: 14px;
          }

          .support-nav {
            width: 100%;
            justify-content: flex-start;
            gap: 14px;
            overflow-x: auto;
            padding: 2px 0 12px;
            scrollbar-width: none;
          }

          .support-body {
            padding: 20px 18px 28px !important;
          }

          .support-nav::-webkit-scrollbar {
            display: none;
          }

          .support-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className="support-shell"
        style={{ ...styles.shell, maxWidth: contentMaxWidth }}
      >
        <header className="support-header" style={styles.header}>
          <Link href="/" aria-label="Droooly home" style={styles.logoLink}>
            <img src={DROOOLY_LOGO_URL} alt="Droooly" style={styles.logo} />
          </Link>

          <nav aria-label="Support pages" className="support-nav">
            {navItems.map((item) => {
              const isActive = pathname === item.match;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`support-nav-link${
                    isActive ? ' support-nav-link-active' : ''
                  }`}
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

        <div className="support-body" style={styles.body}>
          {children}
        </div>

        {showFooter ? (
          <footer className="support-footer" style={styles.footer}>
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
      'radial-gradient(circle at top, rgba(139, 92, 246, 0.12), transparent 42rem), linear-gradient(180deg, #fbfbff 0%, #eef2f7 100%)',
    fontFamily:
      '"Google Sans", roboto, "Noto Sans Myanmar UI", "Noto Sans Khmer", arial, sans-serif',
    color: '#151126',
    padding: 'clamp(18px, 4vw, 48px)',
  },
  shell: {
    width: '100%',
    minHeight: 'calc(100vh - 96px)',
    margin: '0 auto',
    background: '#ffffff',
    border: '1px solid #e8eaf0',
    boxShadow: '0 22px 60px rgba(15, 23, 42, 0.09)',
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    minHeight: 76,
    gap: 24,
    padding: '22px clamp(24px, 5vw, 48px) 16px',
    borderBottom: '1px solid transparent',
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    textDecoration: 'none',
  },
  logo: {
    width: 108,
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
  },
  body: {
    padding: '24px clamp(24px, 5vw, 48px) 32px',
  },
  navLink: {
    minHeight: 28,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: 0,
    color: '#64748b',
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    color: '#7c3aed',
  },
  footer: {
    padding: '18px clamp(24px, 5vw, 48px) 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    borderTop: '1px solid #eef2f7',
    background: '#ffffff',
    color: '#64748b',
    fontSize: 12,
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
