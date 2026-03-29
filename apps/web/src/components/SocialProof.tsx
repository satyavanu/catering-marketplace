'use client';

import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Users, MapPin } from 'lucide-react';

const SocialProof = () => {
  const [stats, setStats] = useState([
    {
      id: 1,
      icon: '🔥',
      label: 'Events Booked Today',
      value: 32,
      location: 'in Hyderabad',
      trend: 'up',
      color: '#f97316',
      bgColor: '#ffedd5',
    },
    {
      id: 2,
      icon: '👨‍🍳',
      label: 'Caterers Onboarded',
      value: 1200,
      location: 'Verified & Active',
      trend: 'up',
      color: '#667eea',
      bgColor: '#ede9fe',
    },
    {
      id: 3,
      icon: '⚡',
      label: 'Bookings in Last',
      value: 15,
      location: '10 Minutes',
      trend: 'up',
      color: '#10b981',
      bgColor: '#dcfce7',
    },
  ]);

  const [animatedValues, setAnimatedValues] = useState(
    stats.map((stat) => ({
      ...stat,
      displayValue: 0,
    }))
  );

  // Animate counter on mount
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    animatedValues.forEach((stat, index) => {
      const target = stats[index].value;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = target / steps;

      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }

        setAnimatedValues((prev) => {
          const updated = [...prev];
          updated[index].displayValue = Math.floor(current);
          return updated;
        });
      }, stepDuration);

      intervals.push(interval);
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          if (stat.id === 1) {
            // Events booked today - increment by 1-3
            return { ...stat, value: stat.value + Math.floor(Math.random() * 3) + 1 };
          }
          if (stat.id === 2) {
            // Caterers - increment by 0-1
            return { ...stat, value: stat.value + Math.floor(Math.random() * 2) };
          }
          if (stat.id === 3) {
            // Recent bookings - cycle between 12-20
            const newValue = Math.floor(Math.random() * 9) + 12;
            return { ...stat, value: newValue };
          }
          return stat;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Wedding Planner',
      image: '👩‍💼',
      text: 'Found the perfect caterer in minutes. This platform saved us weeks of research!',
      rating: 5,
      location: 'Bangalore',
    },
    {
      id: 2,
      name: 'Rajesh Patel',
      role: 'Corporate Event Manager',
      image: '👨‍💼',
      text: 'Best service ever! The caterers are vetted and professional. Highly recommend.',
      rating: 5,
      location: 'Mumbai',
    },
    {
      id: 3,
      name: 'Anjali Gupta',
      role: 'Event Organizer',
      image: '👩‍🎓',
      text: 'Transparent pricing and no hidden charges. Exactly what I was looking for!',
      rating: 5,
      location: 'Delhi',
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'Birthday Party Host',
      image: '👨‍🎉',
      text: 'Quick booking process and excellent customer support throughout the event.',
      rating: 5,
      location: 'Pune',
    },
  ];

  return (
    <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: 'white' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Live Stats Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            Trusted by Thousands ✨
          </h2>

          {/* Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {animatedValues.map((stat) => (
              <div
                key={stat.id}
                style={{
                  backgroundColor: stat.bgColor,
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: `2px solid ${stat.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 12px 24px ${stat.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Background Decoration */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '80px',
                    opacity: 0.1,
                  }}
                >
                  {stat.icon}
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: stat.color,
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      <TrendingUp size={12} />
                      LIVE
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      margin: '0 0 0.75rem 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stat.label}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                        fontWeight: 'bold',
                        color: stat.color,
                        lineHeight: '1',
                      }}
                    >
                      {stat.displayValue.toLocaleString()}
                    </span>
                    {stat.id === 1 && (
                      <span style={{ fontSize: '0.875rem', color: '#666', fontWeight: '500' }}>
                        +{Math.floor(Math.random() * 5) + 1} today
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <MapPin size={14} />
                    {stat.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Activity Feed */}
          <div
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#374151',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              🔥 Recent Activity
            </h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {[
                { name: 'Rahul K.', action: 'booked a wedding', caterer: 'Chef Prakash Catering', time: '2 min ago' },
                { name: 'Sonia M.', action: 'booked corporate event', caterer: 'Spice & Flavor', time: '5 min ago' },
                { name: 'Amit P.', action: 'booked birthday party', caterer: 'Royal Feast Catering', time: '8 min ago' },
                { name: 'Divya S.', action: 'booked wedding reception', caterer: 'Maharaja Catering Co.', time: '12 min ago' },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: index !== 3 ? '1px solid #e5e7eb' : 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>
                      <strong>{activity.name}</strong> {activity.action}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
                      {activity.caterer} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            What Our Customers Say 💬
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Stars */}
                <div style={{ marginBottom: '1rem', fontSize: '1.125rem', letterSpacing: '2px' }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>

                {/* Quote */}
                <p
                  style={{
                    color: '#4b5563',
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6',
                    margin: '0 0 1.5rem 0',
                  }}
                >
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '2.5rem',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ede9fe',
                      borderRadius: '50%',
                    }}
                  >
                    {testimonial.image}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: '600',
                        color: '#111827',
                        fontSize: '0.95rem',
                      }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      style={{
                        margin: '0.25rem 0 0 0',
                        color: '#6b7280',
                        fontSize: '0.825rem',
                      }}
                    >
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          style={{
            marginTop: '4rem',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '1rem',
            padding: '2.5rem',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Why Trust Us? 🛡️
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem',
            }}
          >
            <div>
              <p style={{ fontSize: '1.875rem', margin: 0, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                10K+
              </p>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Happy Customers</p>
            </div>
            <div>
              <p style={{ fontSize: '1.875rem', margin: 0, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                1200+
              </p>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Verified Caterers</p>
            </div>
            <div>
              <p style={{ fontSize: '1.875rem', margin: 0, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                100%
              </p>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Background Checked</p>
            </div>
            <div>
              <p style={{ fontSize: '1.875rem', margin: 0, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                4.9/5
              </p>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default SocialProof;