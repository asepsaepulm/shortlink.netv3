'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuthModal } from '@/context/AuthModalContext';

export default function AuthModal() {
  const { dark } = useTheme();
  const { isOpen, closeModal } = useAuthModal();
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => setMounted(false), 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const clr = {
    inputBg: dark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
    inputBorder: dark ? '#334155' : '#e2e8f0',
    inputText: dark ? '#f1f5f9' : '#1e293b',
    textMuted: dark ? '#94a3b8' : '#64748b',
    accent: '#6366f1',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${clr.inputBorder}`,
    background: clr.inputBg,
    color: clr.inputText,
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
          zIndex: 9999,
          width: '100%',
          maxWidth: '440px',
          padding: '0 16px',
          opacity: isOpen ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          style={{
            background: dark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: dark ? '0 30px 60px -12px rgba(0,0,0,0.7)' : '0 25px 50px -12px rgba(0,0,0,0.15)',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow dekorasi */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Close button */}
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              background: dark ? '#1e293b' : '#f8fafc',
              color: clr.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.15s',
            }}
          >
            ✕
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: dark ? '#ffffff' : '#1e293b', marginBottom: '8px', letterSpacing: '-0.5px' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p style={{ color: clr.textMuted, fontSize: '14px', margin: 0 }}>{isLogin ? 'Sign in to manage your short links.' : 'Join us to start shortening your links.'}</p>
          </div>

          {/* Form */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: dark ? '#cbd5e1' : '#475569', marginBottom: '8px' }}>Full Name</label>
                <input type="text" placeholder="John Doe" style={inputStyle} className="auth-modal-input" />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: dark ? '#cbd5e1' : '#475569', marginBottom: '8px' }}>Email Address</label>
              <input type="email" placeholder="name@company.com" style={inputStyle} className="auth-modal-input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: dark ? '#cbd5e1' : '#475569', marginBottom: '8px' }}>Password</label>
              <input type="password" placeholder="••••••••" style={inputStyle} className="auth-modal-input" />
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                <a href="#" style={{ fontSize: '12px', color: clr.accent, fontWeight: 600, textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundImage: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switcher */}
          <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: clr.textMuted }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: clr.accent, fontWeight: 700, cursor: 'pointer', padding: '0 4px', fontSize: '14px' }}>
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .auth-modal-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
        }
      `}</style>
    </>
  );
}
