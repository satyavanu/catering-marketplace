'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TermsOfUsePage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['1']));

  const toggleSection = (id: string) => {
    const newSet = new Set(expandedSections);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedSections(newSet);
  };

  const sections = [
    {
      id: '1',
      title: 'Introduction & Acceptance of Terms',
      content: `Welcome to CaterHub ("we," "us," "our," or "Company"). These Terms of Use ("Terms") govern your access to and use of our website, mobile application, and all associated services (collectively, the "Service"). By accessing or using CaterHub, you agree to be bound by these Terms. If you do not agree to abide by the above, please do not use this service.

We reserve the right to modify these Terms at any time. Your continued use of CaterHub following the posting of revised Terms means that you accept and agree to the changes.`,
    },
    {
      id: '2',
      title: 'User Eligibility & Account Registration',
      content: `To use CaterHub, you must be at least 18 years of age and possess the legal authority to enter into these Terms. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and current.

You are responsible for maintaining the confidentiality of your password and account information. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.`,
    },
    {
      id: '3',
      title: 'Services Provided',
      content: `CaterHub operates as a marketplace connecting users ("Customers") with catering service providers, venues, and decoration experts ("Service Providers"). Our role is to facilitate connections and provide a platform for booking services. We are not a direct provider of catering, venue, or decoration services.

CaterHub does not guarantee the quality, safety, legality, or accuracy of any Service Provider's offerings. Service Providers are independent contractors, and we are not responsible for their conduct, performance, or any harm they may cause.`,
    },
    {
      id: '4',
      title: 'User Conduct & Prohibited Activities',
      content: `You agree not to use CaterHub for any unlawful or prohibited purpose. Specifically, you agree not to:

• Post, upload, or transmit any content that is defamatory, obscene, abusive, or violates any laws
• Impersonate any person or entity or falsify your identity
• Engage in harassment, bullying, or discrimination
• Attempt to gain unauthorized access to our systems or other users' accounts
• Transmit viruses, malware, or any code of a destructive nature
• Engage in unauthorized data scraping or collection
• Violate intellectual property rights of CaterHub or any third party
• Use the Service to promote illegal activities or services
• Spam, phish, or engage in other deceptive practices

Violation of these rules may result in immediate suspension or termination of your account.`,
    },
    {
      id: '5',
      title: 'Intellectual Property Rights',
      content: `All content on CaterHub, including text, graphics, logos, images, videos, and software (the "Content"), is the property of CaterHub or its licensors and is protected by copyright, trademark, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to view and use the Content solely for your personal use in connection with using CaterHub. You may not reproduce, distribute, modify, or transmit any Content without our prior written consent.

User-generated content (reviews, photos, descriptions) remains your property, but by posting it, you grant CaterHub a worldwide, royalty-free, perpetual license to use, reproduce, distribute, and display such content.`,
    },
    {
      id: '6',
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by law, CaterHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, loss of data, or business interruption, arising from or related to your use of the Service, even if CaterHub has been advised of the possibility of such damages.

In no event shall CaterHub's total liability exceed the amount you have paid to CaterHub in the past 12 months, or $100, whichever is greater.

Some jurisdictions do not allow the exclusion or limitation of certain damages, so this limitation may not apply to you.`,
    },
    {
      id: '7',
      title: 'Disclaimers',
      content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. CATERHUB MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE SERVICE, INCLUDING BUT NOT LIMITED TO:

• Any warranty of merchantability or fitness for a particular purpose
• That the Service will be uninterrupted, error-free, or secure
• That any defects will be corrected
• The accuracy, completeness, or reliability of any content

You use the Service entirely at your own risk. CaterHub does not warrant the quality, safety, legality, or accuracy of any Service Provider's offerings.`,
    },
    {
      id: '8',
      title: 'Indemnification',
      content: `You agree to indemnify, defend, and hold harmless CaterHub, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorney fees) arising from or related to:

• Your use of the Service
• Your violation of these Terms
• Your violation of any applicable laws
• Your content or any content you post
• Your interactions with Service Providers or other users
• Any breach of your representations or warranties`,
    },
    {
      id: '9',
      title: 'Dispute Resolution & Arbitration',
      content: `Any dispute arising from or related to these Terms or your use of CaterHub shall be governed by the laws of the jurisdiction where CaterHub is incorporated, without regard to its conflict of law principles.

You and CaterHub agree to submit to binding arbitration for resolution of any disputes, except for claims involving intellectual property infringement, which may be brought in court. Arbitration shall be conducted under the rules of [Arbitration Authority], and each party shall bear its own costs.

By using CaterHub, you waive your right to a jury trial and the right to bring class action suits.`,
    },
    {
      id: '10',
      title: 'Termination of Service',
      content: `CaterHub reserves the right to suspend or terminate your account and access to the Service at any time, with or without cause, and with or without notice. Grounds for termination include, but are not limited to:

• Violation of these Terms
• Unlawful activity
• Fraud or misrepresentation
• Harassment or abuse of other users
• Posting of prohibited content

Upon termination, your right to use the Service immediately ceases, and all provisions of these Terms that by their nature should survive termination shall survive.`,
    },
    {
      id: '11',
      title: 'Payment & Billing',
      content: `All payments through CaterHub are processed securely. You authorize CaterHub to charge your payment method for services rendered. You agree to provide accurate billing information and to promptly update it if changes occur.

All prices are in the currency displayed and include applicable taxes unless otherwise stated. Refund policies are determined by individual Service Providers and are displayed at checkout.

CaterHub reserves the right to change prices, though we will notify users of significant changes in advance.`,
    },
    {
      id: '12',
      title: 'Third-Party Links & Services',
      content: `CaterHub may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party sites is governed by their terms of service and privacy policies.

Links do not imply endorsement by CaterHub of any third-party site or its content. You acknowledge that we are not liable for any damages or losses arising from your use of any third-party services.`,
    },
    {
      id: '13',
      title: 'Changes to Terms',
      content: `CaterHub may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.

It is your responsibility to review these Terms regularly to ensure you are aware of any changes.`,
    },
    {
      id: '14',
      title: 'Contact Us',
      content: `If you have any questions or concerns regarding these Terms of Use, please contact us at:

📧 Email: legal@caterhub.com
📱 Phone: +1 (234) 567-890
🏢 Address: CaterHub Legal Department, 123 Business Street, New York, NY 10001
💬 Live Chat: Available 24/7 on our website`,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>⚖️</span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
            Terms of Use
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
          Last Updated: March 20, 2026 | Effective Date: March 20, 2026
        </p>
      </div>

      {/* Table of Contents */}
      <div
        style={{
          backgroundColor: '#fce7f3',
          border: '1px solid #fbbbf2',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginTop: 0 }}>
          📋 Table of Contents
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid #fbbbf2',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#ec4899',
                fontWeight: '700',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#f97316';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#ec4899';
                e.currentTarget.style.borderColor = '#fbbbf2';
              }}
            >
              {section.id}. {section.title.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {sections.map((section) => (
          <div
            key={section.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              style={{
                width: '100%',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: 'none',
                backgroundColor: expandedSections.has(section.id) ? '#fce7f3' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!expandedSections.has(section.id)) {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!expandedSections.has(section.id)) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span style={{ color: '#f97316', fontWeight: '800' }}>
                  {section.id}.
                </span>
                {section.title}
              </h3>
              <span
                style={{
                  fontSize: '1.25rem',
                  color: '#ec4899',
                  transition: 'transform 0.3s ease',
                  transform: expandedSections.has(section.id) ? 'rotate(180deg)' : 'rotate(0)',
                }}
              >
                ▼
              </span>
            </button>

            {/* Section Content */}
            {expandedSections.has(section.id) && (
              <div
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  lineHeight: '1.8',
                }}
              >
                <p
                  style={{
                    color: '#475569',
                    fontSize: '0.95rem',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div
        style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 1rem 0' }}>
          Have Questions About Our Terms?
        </h3>
        <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
          Our legal team is here to help clarify any part of our Terms of Use.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="mailto:legal@caterhub.com"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f97316',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            📧 Email Us
          </a>
          <Link
            href="/privacy-policy"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#334155',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
          >
            📋 Privacy Policy
          </Link>
          <Link
            href="/cookie-policy"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#334155',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
          >
            🍪 Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}