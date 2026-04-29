'use client';

import React from 'react';

export default function CookiePolicyPage() {
  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f97316', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <div className="max-w-7xl px-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Cookie Policy</h1>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>Last updated: March 11, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl px-4" style={{ marginBottom: '4rem', maxWidth: '800px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            1. What Are Cookies?
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            Cookies are small pieces of data stored on your device when you visit our website. They help us remember your preferences, track usage patterns, and improve your experience.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            2. Types of Cookies We Use
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '1rem' }}>
            <strong>Essential Cookies:</strong> Required for basic website functionality such as user authentication and security.
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '1rem' }}>
            <strong>Performance Cookies:</strong> Help us understand how users interact with our website to improve its performance.
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            <strong>Preference Cookies:</strong> Remember your preferences and settings for a personalized experience.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            3. Managing Cookies
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            Most web browsers allow you to control cookies through your browser settings. You can choose to reject cookies, but this may affect your ability to use certain features of our website.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            4. Third-Party Cookies
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
            Our website may use third-party cookies from analytics and advertising partners. These third parties may use cookies to collect information about your browsing activities.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            5. Changes to This Cookie Policy
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
            We may update this Cookie Policy from time to time. Changes will be reflected on this page with an updated "Last updated" date.
          </p>
        </div>
      </div>
    </main>
  );
}