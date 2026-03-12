import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CaterPOS - Catering Marketplace',
  description: 'Point of Sale system for catering marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}