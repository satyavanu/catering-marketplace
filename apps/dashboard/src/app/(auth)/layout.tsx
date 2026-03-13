'use client';

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
      {/* Animated Background Elements - Accent Colors */}
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
          position: 'absolute',
          width: '250px',
          height: '250px',
          background: 'rgba(16, 185, 129, 0.07)',
          borderRadius: '50%',
          top: '50%',
          left: '10%',
          animation: 'float 12s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(30, 41, 59, 0.03) 25%, rgba(30, 41, 59, 0.03) 26%, transparent 27%, transparent 74%, rgba(30, 41, 59, 0.03) 75%, rgba(30, 41, 59, 0.03) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(30, 41, 59, 0.03) 25%, rgba(30, 41, 59, 0.03) 26%, transparent 27%, transparent 74%, rgba(30, 41, 59, 0.03) 75%, rgba(30, 41, 59, 0.03) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '60px 60px',
          animation: 'slideGrid 30s linear infinite',
        }}
      />

      {/* Subtle Radial Gradients for Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(240, 147, 251, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Soft Vignette Effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(100, 116, 139, 0.08) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: '2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {children}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-30px) translateX(15px);
          }
          50% {
            transform: translateY(-60px) translateX(-15px);
          }
          75% {
            transform: translateY(-30px) translateX(15px);
          }
        }

        @keyframes slideGrid {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        /* Ensure text is readable */
        * {
          color-scheme: light;
        }
      `}</style>
    </div>
  );
}