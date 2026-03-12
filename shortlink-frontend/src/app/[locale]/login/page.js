'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function AuthPage() {
  const { dark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  const clr = {
    pageBg: dark ? '#0a0b10' : '#f8fafc',
    cardBg: dark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    inputBg: dark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
    inputBorder: dark ? '#334155' : '#e2e8f0',
    inputText: dark ? '#f1f5f9' : '#1e293b',
    textMuted: dark ? '#94a3b8' : '#64748b',
    accent: '#6366f1',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: clr.pageBg,
        padding: '24px',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Container Utama dengan Glassmorphism */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: clr.cardBg,
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: `1px solid ${clr.cardBorder}`,
          boxShadow: dark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.1)',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dekorasi Cahaya di Background (Hanya muncul di Dark Mode) */}
        {dark && (
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: dark ? '#ffffff' : '#1e293b',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: clr.textMuted, fontSize: '14px' }}>{isLogin ? 'Please enter your details to sign in.' : 'Join us to start shortening your links.'}</p>
        </div>

        {/* Form Section */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isLogin && (
            <div>
              <label className="auth-label">Full Name</label>
              <input type="text" placeholder="John Doe" className="auth-input" style={inputStyle(clr)} />
            </div>
          )}

          <div>
            <label className="auth-label">Email Address</label>
            <input type="email" placeholder="name@company.com" className="auth-input" style={inputStyle(clr)} />
          </div>

          <div>
            <label className="auth-label">Password</label>
            <input type="password" placeholder="••••••••" className="auth-input" style={inputStyle(clr)} />
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <a href="#" style={{ fontSize: '12px', color: clr.accent, fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
          )}

          <button type="submit" className="premium-submit-btn" style={{ marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Switcher Section */}
        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: clr.textMuted }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: clr.accent,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            {isLogin ? 'Create for free' : 'Sign in here'}
          </button>
        </div>
      </div>

      <style>{`
        .auth-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: ${dark ? '#cbd5e1' : '#475569'};
          margin-bottom: 8px;
          margin-left: 4px;
        }
        .auth-input {
          width: 100%;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
          background: ${dark ? 'rgba(15, 23, 42, 0.9)' : '#fff'} !important;
        }
      `}</style>
    </div>
  );
}

// Helper untuk style input agar bersih
const inputStyle = (clr) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  border: `1px solid ${clr.inputBorder}`,
  background: clr.inputBg,
  color: clr.inputText,
  fontSize: '15px',
  fontFamily: 'inherit',
});
