'use client';

import { useState } from 'react';
import { ArrowRight, TrendingUp, Settings, CreditCard, Zap } from 'lucide-react';

export default function BecomeCatererPage() {
  const handleStartSelling = () => {
    window.location.href = '/onboarding';
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          color: white;
          padding: clamp(60px, 12vw, 120px) 32px;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: white;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: white;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .hero-container {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .hero-container h1 {
          font-size: clamp(32px, 8vw, 56px);
          font-weight: 800;
          margin-bottom: 24px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .hero-container p {
          font-size: clamp(16px, 3vw, 20px);
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 32px;
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 12px 20px;
          border-radius: 9999px;
          margin-bottom: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 14px;
          font-weight: 600;
        }

        .hero-badge span {
          font-size: 18px;
        }

        .btn-primary {
          background: white;
          color: #667eea;
          padding: clamp(12px, 2vw, 16px) clamp(24px, 4vw, 40px);
          border-radius: 8px;
          font-weight: 700;
          font-size: clamp(14px, 2vw, 18px);
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'system-ui', '-apple-system', 'sans-serif';
        }

        .btn-primary:hover {
          background: #f3f4f6;
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
        }

        .btn-primary:active {
          transform: translateY(-2px);
        }

        /* Social Proof Section */
        .social-proof {
          width: 100%;
          background: linear-gradient(to right, #f9fafb, #f3f0ff);
          padding: 60px 32px;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .proof-container {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: clamp(32px, 5vw, 48px);
        }

        .proof-item {
          text-align: center;
        }

        .proof-icon {
          font-size: clamp(32px, 6vw, 48px);
          margin-bottom: 12px;
        }

        .proof-value {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 700;
          color: #667eea;
          margin-bottom: 8px;
        }

        .proof-label {
          color: #4b5563;
          font-weight: 500;
          font-size: clamp(12px, 2vw, 14px);
        }

        /* Why Join Section */
        .why-section {
          width: 100%;
          padding: clamp(60px, 10vw, 100px) 32px;
          background: white;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: clamp(28px, 6vw, 44px);
          font-weight: 800;
          color: #111827;
          text-align: center;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .section-subtitle {
          font-size: clamp(14px, 2vw, 16px);
          color: #4b5563;
          text-align: center;
          max-width: 600px;
          margin: 0 auto 60px;
          line-height: 1.6;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: clamp(24px, 4vw, 32px);
        }

        .benefit-card {
          background: white;
          border-radius: 16px;
          padding: clamp(24px, 4vw, 32px);
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          text-align: center;
        }

        .benefit-card:hover {
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
          transform: translateY(-8px);
          border-color: #667eea;
        }

        .benefit-icon-wrapper {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: white;
          font-size: 28px;
        }

        .benefit-title {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }

        .benefit-description {
          color: #4b5563;
          line-height: 1.6;
          font-size: clamp(13px, 2vw, 14px);
        }

        /* How It Works Section */
        .how-section {
          width: 100%;
          background: linear-gradient(to bottom, #f9fafb, white);
          padding: clamp(60px, 10vw, 100px) 32px;
          border-top: 1px solid #e5e7eb;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: clamp(32px, 5vw, 48px);
          max-width: 1000px;
          margin: 0 auto;
        }

        .step-card {
          text-align: center;
          position: relative;
        }

        .step-number {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 24px;
          margin: 0 auto 20px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .step-title {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }

        .step-description {
          color: #4b5563;
          line-height: 1.6;
          font-size: clamp(13px, 2vw, 14px);
        }

        @media (min-width: 768px) {
          .step-card:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 28px;
            right: -24px;
            width: 48px;
            height: 2px;
            background: linear-gradient(to right, #667eea, transparent);
          }
        }

        /* Final CTA Section */
        .final-cta {
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          color: white;
          padding: clamp(60px, 12vw, 100px) 32px;
          overflow: hidden;
        }

        .final-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: white;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .cta-content {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .cta-content h2 {
          font-size: clamp(28px, 7vw, 48px);
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .cta-content p {
          font-size: clamp(14px, 2vw, 18px);
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 20px;
          }

          .benefit-card {
            text-align: center;
          }

          .step-card::after {
            display: none !important;
          }
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section animate-fadeInUp">
        <div className="hero-container">
          <div className="hero-badge">
            <span>✨</span>
            <span>Join 5000+ Successful Caterers</span>
          </div>

          <h1>Grow Your Catering Business with Droooly</h1>

          <p>
            Get discovered by customers, manage your orders, and grow your catering business — all in one place.
          </p>

          <div style={{ marginBottom: '24px', fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
            ✅ Free to join. No upfront cost.
          </div>

          <button className="btn-primary" onClick={handleStartSelling}>
            Start Selling
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="proof-container">
          <div className="proof-item">
            <div className="proof-icon">🎉</div>
            <div className="proof-value">5000+</div>
            <div className="proof-label">Events Served</div>
          </div>
          <div className="proof-item">
            <div className="proof-icon">📦</div>
            <div className="proof-value">1000+</div>
            <div className="proof-label">Monthly Bookings</div>
          </div>
          <div className="proof-item">
            <div className="proof-icon">⭐</div>
            <div className="proof-value">4.8/5</div>
            <div className="proof-label">Trusted by Caterers</div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="why-section">
        <div className="section-container">
          <h2 className="section-title">Why Join Droooly?</h2>
          <p className="section-subtitle">
            Everything you need to grow your catering business
          </p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <TrendingUp size={28} />
              </div>
              <h3 className="benefit-title">📈 Get More Orders</h3>
              <p className="benefit-description">
                Reach new customers in your area and grow your business exponentially.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <Settings size={28} />
              </div>
              <h3 className="benefit-title">⚙️ Manage Everything Easily</h3>
              <p className="benefit-description">
                Create menus, packages, and handle bookings in one intuitive place.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <CreditCard size={28} />
              </div>
              <h3 className="benefit-title">💸 Receive Direct Payments</h3>
              <p className="benefit-description">
                Secure and seamless payment handling with fast settlements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started in just 3 simple steps
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Your Profile</h3>
              <p className="step-description">
                Sign up and set up your catering profile in minutes. No forms, just what you need.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Add Menu & Packages</h3>
              <p className="step-description">
                Showcase your offerings with menus and custom packages for different events.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Start Receiving Orders</h3>
              <p className="step-description">
                Get booking requests and grow your business. Manage everything from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Start Getting Orders?</h2>
          <p>
            Join Droooly today and take your catering business to the next level.
          </p>

          <button className="btn-primary" onClick={handleStartSelling}>
            Start Selling
            <ArrowRight size={20} />
          </button>

          <div style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
            ✓ No credit card required • ✓ Free forever • ✓ Get started in minutes
          </div>
        </div>
      </section>
    </div>
  );
}