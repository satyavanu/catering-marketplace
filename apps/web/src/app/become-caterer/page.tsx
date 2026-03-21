'use client';

import { useState } from 'react';

export default function BecomeCatererPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const stats = [
    { label: 'Active Caterers', value: '5,000+', icon: '👨‍🍳' },
    { label: 'Monthly Bookings', value: '50,000+', icon: '📅' },
    { label: 'Revenue Generated', value: '$25M+', icon: '💰' },
    { label: 'Avg Satisfaction', value: '4.8/5', icon: '⭐' },
  ];

  const benefits = [
    {
      icon: '📈',
      title: 'Grow Your Orders',
      description: 'Reach thousands of customers actively looking for catering services in your area',
    },
    {
      icon: '🎯',
      title: 'Easy Management',
      description: 'Manage menus, pricing, bookings and payments from one simple dashboard',
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Get paid on time with our reliable and secure payment system',
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Track your performance with detailed analytics and customer insights',
    },
    {
      icon: '🤝',
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you succeed',
    },
    {
      icon: '⭐',
      title: 'Build Your Reputation',
      description: 'Showcase your work with reviews, ratings and portfolio showcase',
    },
  ];

  const allFeatures = [
    'Basic listing',
    'Profile management',
    'Order management',
    'Email support',
    'Analytics',
    'Commission rate',
    'Featured listing',
    'Unlimited orders',
    'Priority support',
    'Marketing tools',
    'Custom branding',
    'Dedicated manager',
    'API access',
    'Advanced analytics',
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      period: '/month',
      description: 'Perfect for new caterers',
      features: [
        { name: 'Basic listing', included: true },
        { name: 'Profile management', included: true },
        { name: 'Order management', included: true },
        { name: 'Email support', included: true },
        { name: 'Analytics', included: true },
        { name: 'Commission rate', value: '12%', included: true },
        { name: 'Featured listing', included: false },
        { name: 'Unlimited orders', included: false },
        { name: 'Priority support', included: false },
        { name: 'Marketing tools', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Dedicated manager', included: false },
        { name: 'API access', included: false },
        { name: 'Advanced analytics', included: false },
      ],
      cta: 'Get Started Free',
      badge: 'Free Forever',
    },
    {
      id: 'pro',
      name: 'Professional',
      monthlyPrice: 999,
      annualPrice: 9990,
      period: '/month',
      description: 'For growing catering businesses',
      features: [
        { name: 'Basic listing', included: true },
        { name: 'Profile management', included: true },
        { name: 'Order management', included: true },
        { name: 'Email support', included: true },
        { name: 'Analytics', included: true },
        { name: 'Commission rate', value: '7%', included: true },
        { name: 'Featured listing', included: true },
        { name: 'Unlimited orders', included: true },
        { name: 'Priority support', included: true },
        { name: 'Marketing tools', included: true },
        { name: 'Custom branding', included: false },
        { name: 'Dedicated manager', included: false },
        { name: 'API access', included: false },
        { name: 'Advanced analytics', included: true },
      ],
      cta: 'Start Free Trial',
      badge: 'Most Popular',
      savings: '17%',
      highlighted: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 1999,
      annualPrice: 19990,
      period: '/month',
      description: 'For high-volume operations',
      features: [
        { name: 'Basic listing', included: true },
        { name: 'Profile management', included: true },
        { name: 'Order management', included: true },
        { name: 'Email support', included: true },
        { name: 'Analytics', included: true },
        { name: 'Commission rate', value: '3%', included: true },
        { name: 'Featured listing', included: true },
        { name: 'Unlimited orders', included: true },
        { name: 'Priority support', included: true },
        { name: 'Marketing tools', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Dedicated manager', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced analytics', included: true },
      ],
      cta: 'Start Free Trial',
      badge: 'For Scale',
    },
  ];

  const faqs = [
    {
      q: 'How do I become a caterer on the platform?',
      a: 'Simply sign up with your business details, complete your profile with photos and menu items, verify your business license, and you\'re ready to start receiving orders!',
    },
    {
      q: 'How do payments work?',
      a: 'Payments are processed securely after each order. We use encrypted payment gateways and transfer earnings to your bank account within 24-48 hours. You can withdraw anytime.',
    },
    {
      q: 'Can I upgrade my plan later?',
      a: 'Yes! You can upgrade, downgrade or cancel your plan anytime. Changes take effect immediately with pro-rata adjustments.',
    },
    {
      q: 'What commission does CaterHub charge?',
      a: 'Commission varies by plan: Starter (12%), Professional (7%), Premium (3%). This covers payment processing, platform maintenance, and customer support.',
    },
    {
      q: 'How long is the verification process?',
      a: 'Usually 2-3 business days. We verify your business license, food safety certifications, and background information to ensure quality and trust.',
    },
    {
      q: 'Can I have multiple locations?',
      a: 'Yes! Professional and Premium plans support multiple locations. Contact our sales team for enterprise solutions.',
    },
  ];

  const getDisplayPrice = (plan: any) => {
    if (plan.monthlyPrice === 0) return 'Free';
    return billingCycle === 'monthly' ? `₹${plan.monthlyPrice}` : `₹${Math.round(plan.annualPrice / 12)}`;
  };

  const handleSignup = (planId: string) => {
    // Open signup in a new tab/window
    window.open(`http://localhost:3002/signup?plan=${planId}`, '_blank');
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #a855f7 50%, #ec4899 100%);
          color: white;
          padding: 96px 32px;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 384px;
          height: 384px;
          background: white;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 384px;
          height: 384px;
          background: white;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 32px;
          line-height: 1.2;
        }

        @media (min-width: 1024px) {
          .hero-content h1 {
            font-size: 56px;
          }
        }

        .gradient-text {
          background: linear-gradient(to right, #fef08a, #fbcfe8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-content p {
          font-size: 18px;
          color: #c7d2fe;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }

        .btn-primary {
          background: white;
          color: #4f46e5;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 18px;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-primary:hover {
          background: #f3f4f6;
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }

        .btn-secondary {
          border: 2px solid white;
          color: white;
          background: transparent;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-secondary:hover {
          background: white;
          color: #4f46e5;
          transform: scale(1.05);
        }

        /* Stats Section */
        .stats-section {
          width: 100%;
          background: linear-gradient(to right, #f9fafb, #e0e7ff);
          padding: 64px 32px;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .stats-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        @media (min-width: 768px) {
          .stats-container {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-item {
          text-align: center;
        }

        .stat-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #4f46e5;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #4b5563;
          font-weight: 500;
          font-size: 12px;
        }

        /* Benefits Section */
        .benefits-section {
          width: 100%;
          padding: 80px 32px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          text-align: center;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 44px;
          }
        }

        .section-subtitle {
          font-size: 18px;
          color: #4b5563;
          text-align: center;
          max-width: 672px;
          margin: 0 auto 64px;
        }

        .benefits-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .benefits-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .benefit-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 4px 6px rgba(0,0,0,0.07);
          transition: all 0.3s ease;
        }

        .benefit-card:hover {
          box-shadow: 0 20px 25px rgba(0,0,0,0.1);
          transform: translateY(-8px);
        }

        .benefit-icon {
          font-size: 44px;
          margin-bottom: 24px;
          display: inline-block;
        }

        .benefit-card:hover .benefit-icon {
          transform: scale(1.25);
          transition: transform 0.3s ease;
        }

        .benefit-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        .benefit-description {
          color: #4b5563;
          line-height: 1.6;
          font-size: 14px;
        }

        /* Pricing Section */
        .pricing-section {
          width: 100%;
          background: linear-gradient(to bottom, #f9fafb, white);
          padding: 80px 32px;
        }

        .billing-toggle {
          display: inline-flex;
          align-items: center;
          background: #f3f4f6;
          border-radius: 9999px;
          padding: 4px;
          margin-bottom: 48px;
        }

        .toggle-btn {
          padding: 12px 24px;
          border-radius: 9999px;
          border: none;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          color: #4b5563;
        }

        .toggle-btn.active {
          background: white;
          color: #4f46e5;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .toggle-badge {
          background: #dcfce7;
          color: #15803d;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 9999px;
          margin-left: 8px;
        }

        /* Pricing Table */
        .table-wrapper {
          overflow-x: auto;
          box-shadow: 0 20px 25px rgba(0,0,0,0.1);
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }

        .pricing-table {
          width: 100%;
          border-collapse: collapse;
        }

        .pricing-table thead {
          background: linear-gradient(to right, #f3f4f6, #e8ddf0);
          border-bottom: 2px solid #e5e7eb;
        }

        .pricing-table th {
          padding: 24px;
          text-align: center;
          font-weight: 700;
          color: #111827;
          border-left: 1px solid #e5e7eb;
        }

        .pricing-table th:first-child {
          border-left: none;
          text-align: left;
        }

        .pricing-table th.highlighted {
          background: linear-gradient(to bottom, #e0e7ff, #f3e8ff);
        }

        .plan-header {
          text-align: center;
        }

        .plan-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 9999px;
          margin-bottom: 12px;
          display: inline-block;
        }

        .plan-badge-popular {
          background: linear-gradient(to right, #fbbf24, #f97316);
          color: #111827;
        }

        .plan-badge-standard {
          background: #e5e7eb;
          color: #374151;
        }

        .plan-name {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .plan-description {
          font-size: 12px;
          color: #4b5563;
          margin-top: 8px;
        }

        .pricing-table tbody tr {
          border-bottom: 1px solid #e5e7eb;
          background: white;
          transition: background 0.2s ease;
        }

        .pricing-table tbody tr:nth-child(odd) {
          background: white;
        }

        .pricing-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }

        .pricing-table tbody tr:hover {
          background: #f0f4ff;
        }

        .pricing-table td {
          padding: 16px 24px;
          text-align: center;
          border-left: 1px solid #e5e7eb;
          color: #111827;
        }

        .pricing-table td:first-child {
          text-align: left;
          border-left: none;
          font-weight: 500;
          color: #111827;
        }

        .price-value {
          font-size: 32px;
          font-weight: 700;
          color: #4f46e5;
        }

        .price-period {
          font-size: 14px;
          color: #4b5563;
          margin-top: 4px;
        }

        .price-annual {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 8px;
        }

        .btn-signup {
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
        }

        .btn-signup-primary {
          background: linear-gradient(to right, #4f46e5, #a855f7);
          color: white;
          box-shadow: 0 10px 15px rgba(79, 70, 229, 0.3);
        }

        .btn-signup-primary:hover {
          box-shadow: 0 15px 25px rgba(79, 70, 229, 0.4);
          transform: scale(1.05);
        }

        .btn-signup-secondary {
          background: #f3f4f6;
          color: #111827;
        }

        .btn-signup-secondary:hover {
          background: #e5e7eb;
        }

        .check-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #dcfce7;
          color: #16a34a;
          font-weight: 700;
          font-size: 14px;
        }

        .cross-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #9ca3af;
          font-weight: 700;
        }

        .feature-value {
          margin-left: 8px;
          font-weight: 600;
          color: #111827;
        }

        /* FAQ Section */
        .faq-section {
          width: 100%;
          background: white;
          padding: 80px 32px;
        }

        .faq-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .faq-intro {
          max-width: 768px;
          margin-bottom: 64px;
        }

        .faq-intro h2 {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        .faq-intro p {
          font-size: 18px;
          color: #4b5563;
          line-height: 1.6;
        }

        .faq-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }

        .faq-link:hover {
          color: #4338ca;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .faq-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .faq-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .faq-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
          transition: all 0.2s ease;
        }

        .faq-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          border-color: #4f46e5;
        }

        .faq-question {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .faq-answer {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
        }

        /* CTA Section */
        .cta-section {
          position: relative;
          width: 100%;
          background: linear-gradient(to right, #4f46e5, #a855f7, #ec4899);
          color: white;
          padding: 80px 32px;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 384px;
          height: 384px;
          background: white;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
        }

        .cta-content {
          max-width: 896px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 1.2;
        }

        @media (min-width: 1024px) {
          .cta-content h2 {
            font-size: 48px;
          }
        }

        .cta-content p {
          font-size: 18px;
          color: #c7d2fe;
          margin-bottom: 48px;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 24px;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }

        .cta-footer {
          color: #c7d2fe;
          margin-top: 32px;
          font-size: 14px;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: '9999px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.3)' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>✨ Join 5000+ Successful Caterers</span>
            </div>
            <h1>Grow Your Catering <span className="gradient-text">Business</span></h1>
            <p>Join the fastest-growing catering marketplace. Scale your business, reach unlimited customers, and increase revenue by up to 300%.</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => handleSignup('starter')}
              >
                Get Started Free
              </button>
              <button className="btn-secondary">Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2 className="section-title">Why Join CaterHub?</h2>
        <p className="section-subtitle">Everything you need to scale your catering business and reach unlimited customers</p>
        <div className="benefits-grid">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the perfect plan for your business. Scale as you grow.</p>

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="billing-toggle">
              <button
                className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual
                <span className="toggle-badge">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="table-wrapper">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className={plan.highlighted ? 'highlighted' : ''}>
                      <div className="plan-header">
                        {plan.badge && (
                          <div className={`plan-badge ${plan.highlighted ? 'plan-badge-popular' : 'plan-badge-standard'}`}>
                            {plan.badge}
                          </div>
                        )}
                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-description">{plan.description}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr>
                  <td style={{ fontWeight: '600' }}>Price</td>
                  {plans.map((plan) => (
                    <td key={plan.id}>
                      <div className="price-value">{getDisplayPrice(plan)}</div>
                      <div className="price-period">{plan.period}</div>
                      {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                        <div className="price-annual">Billed ₹{plan.annualPrice} annually</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* CTA Row */}
                <tr>
                  <td></td>
                  {plans.map((plan) => (
                    <td key={plan.id}>
                      <button
                        className={`btn-signup ${plan.highlighted ? 'btn-signup-primary' : 'btn-signup-secondary'}`}
                        onClick={() => handleSignup(plan.id)}
                      >
                        {plan.cta}
                      </button>
                    </td>
                  ))}
                </tr>

                {/* Feature Rows */}
                {allFeatures.map((featureName, featureIdx) => {
                  const featureData = plans.map(plan =>
                    plan.features.find(f => f.name === featureName)
                  );

                  return (
                    <tr key={featureIdx}>
                      <td>{featureName}</td>
                      {featureData.map((feature, planIdx) => (
                        <td key={planIdx}>
                          {feature ? (
                            feature.included ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span className="check-mark">✓</span>
                                {feature.value && <span className="feature-value">{feature.value}</span>}
                              </div>
                            ) : (
                              <span className="cross-mark">✗</span>
                            )
                          ) : (
                            <span className="cross-mark">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ color: '#4b5563', fontWeight: '600', marginBottom: '16px' }}>
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-intro">
            <h2>Frequently asked questions</h2>
            <p>
              Have a different question and can't find the answer you're looking for? Reach out to our support team by <a href="mailto:support@caterhub.com" className="faq-link">sending us an email</a> and we'll get back to you as soon as we can.
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-card">
                <h3 className="faq-question">{faq.q}</h3>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Business?</h2>
          <p>Join thousands of successful caterers earning more with CaterHub. Start your free trial today.</p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => handleSignup('pro')}
            >
              Start Free Trial
            </button>
            <button className="btn-secondary">Schedule Demo</button>
          </div>
          <div className="cta-footer">
            ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
          </div>
        </div>
      </section>
    </div>
  );
}
