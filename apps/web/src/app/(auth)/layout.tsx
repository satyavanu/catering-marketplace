'use client';

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(102, 126, 234, 0.08)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          animation: 'float 8s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(240, 147, 251, 0.06)',
          borderRadius: '50%',
          bottom: '-50px',
          left: '-50px',
          animation: 'float 10s ease-in-out infinite reverse',
          filter: 'blur(40px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '100%',
          padding: '2rem',
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(15px);
          }
        }
      `}</style>
    </div>
  );
}