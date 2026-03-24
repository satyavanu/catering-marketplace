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
          width: 'clamp(200px, 50vw, 400px)',
          height: 'clamp(200px, 50vw, 400px)',
          background: 'rgba(102, 126, 234, 0.08)',
          borderRadius: '50%',
          top: 'clamp(-50px, -15vw, -100px)',
          right: 'clamp(-50px, -15vw, -100px)',
          animation: 'float 8s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 'clamp(150px, 40vw, 300px)',
          height: 'clamp(150px, 40vw, 300px)',
          background: 'rgba(240, 147, 251, 0.06)',
          borderRadius: '50%',
          bottom: 'clamp(-50px, -10vw, -50px)',
          left: 'clamp(-50px, -10vw, -50px)',
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
          padding: 'clamp(1rem, 5vw, 2rem)',
          boxSizing: 'border-box',
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

        @media (max-width: 640px) {
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-15px) translateX(8px);
            }
          }
        }
      `}</style>
    </div>
  );
}