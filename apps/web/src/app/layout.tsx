import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import './globals.css';
import Script from 'next/script';
import { Inter, Manrope, Plus_Jakarta_Sans, Sora } from 'next/font/google';
import { OnboardingMasterDataProvider } from './context/OnboardingMasterDataContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
});

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Droooly - Find & Book Catering Services',
  description: 'Discover and book trusted catering services for your events',
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      {
        url: '/favicon/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${sora.variable} ${manrope.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <body>
        <Providers>
          <OnboardingMasterDataProvider>
            {children}
            <CookieConsentBanner />
          </OnboardingMasterDataProvider>
        </Providers>
      </body>
    </html>
  );
}
