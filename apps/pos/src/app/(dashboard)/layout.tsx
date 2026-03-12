'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, TopNavbar, Footer, Card, Button } from '@catering/ui';
import { useAuth, getAuthToken, clearAuthToken } from '@catering/shared';
import type { Metadata } from 'next';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>🍽️</span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                CaterHub
              </h1>
            </Link>
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Home
              </Link>
              <Link href="/caterers" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Browse Caterers
              </Link>
              <Link href="/how-it-works" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                How It Works
              </Link>
              <Link href="/about" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                About
              </Link>
              <Link href="/faq" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                FAQ
              </Link>
              <Link href="/contact" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                Contact
              </Link>
              <Link href="/login" style={{ color: '#f97316', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Login
              </Link>
            </nav>
          </div>
        </header>
        
        {children}

        <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  CaterHub
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                  Connecting caterers with customers worldwide.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Company
                </h3>
                <ul style={{ list: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/company" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      About Us
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/careers" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Careers
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/how-it-works" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Support
                </h3>
                <ul style={{ list: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Contact Us
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/faq" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Legal
                </h3>
                <ul style={{ list: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/terms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                © 2026 CaterHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🍽️</span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316', margin: 0 }}>
              CaterPOS
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

export function TermsPage() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#f97316', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block', fontSize: '0.875rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0.5rem 0 0 0' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Last updated: March 12, 2026
          </p>
        </div>

        <Card>
          <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '0.95rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using CaterHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              2. Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on CaterHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on CaterHub</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              3. Disclaimer
            </h2>
            <p>
              The materials on CaterHub are provided on an 'as is' basis. CaterHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              4. Limitations
            </h2>
            <p>
              In no event shall CaterHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CaterHub.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              5. Accuracy of Materials
            </h2>
            <p>
              The materials appearing on CaterHub could include technical, typographical, or photographic errors. CaterHub does not warrant that any of the materials on the site are accurate, complete, or current. CaterHub may make changes to the materials contained on the site at any time without notice.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              6. Links
            </h2>
            <p>
              CaterHub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CaterHub of the site. Use of any such linked website is at the user's own risk.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              7. Modifications
            </h2>
            <p>
              CaterHub may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              8. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#f97316', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block', fontSize: '0.875rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0.5rem 0 0 0' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Last updated: March 12, 2026
          </p>
        </div>

        <Card>
          <div style={{ lineHeight: '1.8', color: '#374151', fontSize: '0.95rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Introduction
            </h2>
            <p>
              CaterHub ("we" or "us" or "our") operates the caterhub.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Information Collection and Use
            </h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                <ul>
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </li>
              <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</li>
            </ul>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Use of Data
            </h2>
            <p>CaterHub uses the collected data for various purposes:</p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Security of Data
            </h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@caterhub.com.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function HowItWorksPage() {
  const customerSteps = [
    {
      number: '1',
      title: 'Browse Caterers',
      description: 'Explore our directory of professional caterers in your area with detailed menus and reviews.',
      icon: '🔍',
    },
    {
      number: '2',
      title: 'Request Quotes',
      description: 'Submit your event details and get personalized quotes from caterers matching your needs.',
      icon: '📋',
    },
    {
      number: '3',
      title: 'Compare & Choose',
      description: 'Compare options, read reviews, and select the perfect caterer for your event.',
      icon: '⚖️',
    },
    {
      number: '4',
      title: 'Book & Pay',
      description: 'Secure your booking with our integrated payment system and receive confirmation.',
      icon: '✓',
    },
    {
      number: '5',
      title: 'Enjoy Your Event',
      description: 'Relax and enjoy your event knowing you have professional catering handled.',
      icon: '🎉',
    },
    {
      number: '6',
      title: 'Leave a Review',
      description: 'Share your experience and help others find great caterers.',
      icon: '⭐',
    },
  ];

  const catererSteps = [
    {
      number: '1',
      title: 'Register Your Business',
      description: 'Create your business profile with menus, pricing, and service areas.',
      icon: '📝',
    },
    {
      number: '2',
      title: 'Setup Your Menu',
      description: 'Add your signature dishes with descriptions, pricing, and photos.',
      icon: '🍽️',
    },
    {
      number: '3',
      title: 'Get Discovered',
      description: 'Appear in search results and receive booking inquiries from customers.',
      icon: '🔔',
    },
    {
      number: '4',
      title: 'Manage Orders',
      description: 'Use our POS system to manage orders, track bookings, and invoice customers.',
      icon: '📊',
    },
    {
      number: '5',
      title: 'Grow Your Business',
      description: 'Expand your reach and increase revenue through our marketplace.',
      icon: '📈',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            How CaterHub Works
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '0' }}>
            Whether you're looking for a caterer or growing your catering business, we make it simple
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', textAlign: 'center' }}>
            For Customers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {customerSteps.map((step) => (
              <Card key={step.number}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316', backgroundColor: '#fef3c7', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.number}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/caterers">
              <Button variant="primary" size="lg">
                Start Browsing Caterers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Caterers */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', textAlign: 'center' }}>
            For Caterers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {catererSteps.map((step) => (
              <Card key={step.number}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316', backgroundColor: '#fef3c7', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.number}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Register Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', textAlign: 'center' }}>
            Why Choose CaterHub?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                🔒 Secure & Verified
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                All caterers are verified professionals. Secure payment processing protects both parties.
              </p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                💬 Easy Communication
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Built-in messaging system makes it easy to discuss details and ask questions.
              </p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                ⭐ Verified Reviews
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Read authentic reviews from real customers to make informed decisions.
              </p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📊 Business Tools
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Caterers get access to our POS system and business analytics tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#f97316', padding: '4rem 2rem', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join CaterHub today and experience the easiest way to find or manage catering services.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/caterers">
              <Button variant="secondary" size="lg">
                Find a Caterer
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Register as Caterer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Removed duplicate export default declaration
function CompanyPage() {
  const values = [
    { icon: '🎯', title: 'Our Mission', description: 'To connect people with exceptional catering services and help caterers thrive in a competitive marketplace.' },
    { icon: '👥', title: 'Our Vision', description: 'To be the leading global platform for catering services, trusted by millions.' },
    { icon: '💡', title: 'Our Culture', description: 'We believe in innovation, transparency, and putting our community first.' },
  ];

  const timeline = [
    { year: '2019', event: 'CaterHub Founded' },
    { year: '2020', event: 'Reached 500+ Caterers' },
    { year: '2021', event: 'Launched POS System' },
    { year: '2022', event: 'Expanded to 50 Cities' },
    { year: '2023', event: 'Hit 1 Million Orders' },
    { year: '2024', event: 'International Expansion' },
    { year: '2025', event: 'AI-Powered Recommendations' },
    { year: '2026', event: 'Global Leader in Catering Tech' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            About CaterHub
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Building the future of catering through technology and community
          </p>
        </div>
      </section>

      {/* Mission, Vision, Culture */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {values.map((value, index) => (
              <Card key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{value.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                    {value.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            Our Story
          </h2>
          <Card>
            <div style={{ lineHeight: '1.8', color: '#374151' }}>
              <p>
                CaterHub was born from a simple observation: the catering industry was fragmented and inefficient. Finding the right caterer was time-consuming, comparing options was difficult, and caterers had no centralized way to reach customers.
              </p>
              <p>
                Our founders, a group of tech entrepreneurs and food enthusiasts, decided to solve this problem. In 2019, they launched CaterHub with a vision to democratize access to quality catering services while empowering caterers to grow their businesses.
              </p>
              <p>
                Today, CaterHub is the leading catering marketplace, serving thousands of caterers and hundreds of thousands of customers worldwide. We continue to innovate, introducing new features like our AI-powered recommendations and advanced POS system.
              </p>
              <p>
                Our commitment remains unchanged: to be the most trusted platform connecting people with exceptional catering services.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', textAlign: 'center' }}>
            Our Journey
          </h2>
          <div>
            {timeline.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', position: 'relative' }}>
                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316' }}>
                    {item.year}
                  </div>
                </div>
                <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '3px solid #f97316', paddingTop: '0.25rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#f97316', borderRadius: '50%', position: 'absolute', left: 'calc(100px + 0.5rem)', top: '0.5rem' }} />
                  <p style={{ color: '#1f2937', fontWeight: '600', margin: 0 }}>
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316', margin: 0, marginBottom: '0.5rem' }}>
                5,000+
              </p>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Professional Caterers
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316', margin: 0, marginBottom: '0.5rem' }}>
                500K+
              </p>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Happy Customers
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316', margin: 0, marginBottom: '0.5rem' }}>
                1M+
              </p>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Events Catered
              </p>
            </div>
            <div>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316', margin: 0, marginBottom: '0.5rem' }}>
                50+
              </p>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Cities Served
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#f97316', padding: '4rem 2rem', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Join Us Today
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
            Whether you're looking for a caterer or want to grow your catering business, we'd love to have you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/caterers">
              <Button variant="secondary" size="lg">
                Browse Caterers
              </Button>
            </Link>
            <Link href="/careers">
              <Button variant="secondary" size="lg">
                Join Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function CareersPage() {
  const jobs = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'New York, NY',
      description: 'Join our engineering team to build the next generation of catering marketplace technology.',
    },
    {
      title: 'Product Manager',
      department: 'Product',
      type: 'Full-time',
      location: 'Remote',
      description: 'Lead product strategy for our customer and caterer platforms.',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      type: 'Full-time',
      location: 'New York, NY',
      description: 'Drive growth and brand awareness for CaterHub across multiple channels.',
    },
    {
      title: 'Customer Success Lead',
      department: 'Customer Success',
      type: 'Full-time',
      location: 'Remote',
      description: 'Support our caterers and help them succeed on the CaterHub platform.',
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      type: 'Full-time',
      location: 'New York, NY',
      description: 'Design beautiful and intuitive interfaces for our marketplace.',
    },
    {
      title: 'Data Analyst',
      department: 'Analytics',
      type: 'Full-time',
      location: 'Remote',
      description: 'Analyze data to drive insights and improve our platform performance.',
    },
  ];

  const perks = [
    { icon: '💰', title: 'Competitive Salary', description: 'Industry-leading compensation packages' },
    { icon: '🏥', title: 'Health Benefits', description: 'Comprehensive health, dental, and vision coverage' },
    { icon: '🏡', title: 'Remote Work', description: 'Flexible work arrangements' },
    { icon: '🎓', title: 'Learning Budget', description: '$2,000/year for professional development' },
    { icon: '🎉', title: 'Team Events', description: 'Regular team outings and celebrations' },
    { icon: '📈', title: 'Stock Options', description: 'Participate in our company growth' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#f97316', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Join the CaterHub Team
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Help us revolutionize the catering industry
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            Why Join Us?
          </h2>
          <Card>
            <div style={{ lineHeight: '1.8', color: '#374151' }}>
              <p>
                At CaterHub, we're passionate about using technology to solve real problems in the catering industry. Our team is composed of talented individuals from diverse backgrounds who are committed to excellence and innovation.
              </p>
              <p>
                We offer a collaborative work environment where your contributions matter. We believe in learning, growth, and creating products that our users love. If you're passionate about technology, food, or both, we'd love to hear from you.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', textAlign: 'center' }}>
            What We Offer
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {perks.map((perk, index) => (
              <Card key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{perk.icon}</div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                    {perk.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    {perk.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', textAlign: 'center' }}>
            Open Positions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {jobs.map((job, index) => (
              <Card key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '2rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
                      {job.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#e5e7eb', color: '#1f2937', padding: '0.35rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
                        {job.department}
                      </span>
                      <span style={{ backgroundColor: '#e5e7eb', color: '#1f2937', padding: '0.35rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
                        {job.type}
                      </span>
                      <span style={{ backgroundColor: '#e5e7eb', color: '#1f2937', padding: '0.35rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
                        📍 {job.location}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      {job.description}
                    </p>
                  </div>
                  <Button variant="primary">
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            Our Culture
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                🚀 Innovation First
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                We encourage experimentation and embrace new ideas to solve problems in creative ways.
              </p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                🤝 Collaboration
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                We work together across teams and value diverse perspectives to achieve our goals.
              </p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                📚 Growth Mindset
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                We invest in continuous learning and development for all team members.
              </p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                ❤️ Customer Focus
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Everything we do is centered on creating value for our users and community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#f97316', padding: '4rem 2rem', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Join Us?
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
            Submit your application to careers@caterhub.com with your resume and cover letter.
          </p>
          <Link href="mailto:careers@caterhub.com">
            <Button variant="secondary" size="lg">
              Send Your Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}