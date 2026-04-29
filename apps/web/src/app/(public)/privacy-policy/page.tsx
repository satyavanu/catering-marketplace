'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f97316', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <div className="max-w-7xl px-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Privacy Policy</h1>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>Last updated: March 11, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem', maxWidth: '800px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            1. Introduction
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            CaterHub ("we", "us", "our") operates the CaterHub website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            2. Information Collection and Use
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '1rem' }}>
            We collect several different types of information for various purposes to provide and improve our Service to you:
          </p>
          <ul style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem', marginLeft: '1.5rem' }}>
            <li><strong>Personal Data:</strong> Email address, name, phone number, address</li>
            <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent</li>
            <li><strong>Booking Information:</strong> Event details, preferences, payment information</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            3. Security of Data
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            4. Changes to This Privacy Policy
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            5. Contact Us
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
            If you have any questions about this Privacy Policy, please contact us at privacy@caterhub.com
          </p>
        </div>
      </div>
    </main>
  );
}