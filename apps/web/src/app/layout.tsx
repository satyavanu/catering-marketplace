import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CaterHub - Find & Book Catering Services',
  description: 'Discover and book trusted catering services for your events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
