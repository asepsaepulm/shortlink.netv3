'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';
import { useAuthModal } from '@/context/AuthModalContext';

export default function Navbar() {
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { openModal } = useAuthModal();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleFaqClick = (e) => {
    if (window.location.pathname === `/${locale}` || window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e) => {
    if (window.location.pathname === `/${locale}` || window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const c = {
    header: {
      background: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}`,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1030,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    },
    nav: { maxWidth: '1140px', margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' },
    logoIcon: { width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    menuDesktop: { display: 'flex', alignItems: 'center', gap: '36px' },
    menuLink: { fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: dark ? '#94a3b8' : '#475569', textDecoration: 'none' },
    right: { display: 'flex', alignItems: 'center', gap: '12px' },
    toggleBtn: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: dark ? '#1e293b' : '#f1f5f9',
      border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    mobileMenu: {
      background: dark ? '#0f172a' : 'white',
      borderTop: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}`,
      padding: '12px 16px',
    },
    mobileMenuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: 700,
      color: dark ? '#94a3b8' : '#475569',
      textDecoration: 'none',
      borderBottom: `1px solid ${dark ? '#1e293b' : '#f8fafc'}`,
      gap: '12px',
    },
  };

  const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dark ? '#f59e0b' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={dark ? '#94a3b8' : '#475569'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  const desktopMenuItems = [
    { label: 'HOME', href: `/${locale}/#home`, onClick: handleHomeClick },
    { label: 'FAQ', href: `/${locale}/#faq`, onClick: handleFaqClick },
    { label: 'TERMS OF USE', href: `/${locale}/terms` },
    { label: 'SUPPORT', href: 'mailto:support@shortlink.net' },
  ];

  const mobileMenuItems = [
    { label: 'HOME', href: `/${locale}/#home`, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', onClick: handleHomeClick },
    { label: 'FAQ', href: `/${locale}/#faq`, icon: 'M9 9h.01M15 9h.01M12 17v.01M12 3C6.477 3 2 7.477 2 13s4.477 10 10 10 10-4.477 10-10S17.523 3 12 3z', onClick: handleFaqClick },
    { label: 'TERMS OF USE', href: `/${locale}/terms`, icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
    { label: 'SUPPORT', href: 'mailto:support@shortlink.net', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
  ];

  return (
    <header style={c.header}>
      <nav style={c.nav}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', color: dark ? '#94a3b8' : '#475569' }} className="lg-hide" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link href={`/${locale}`} style={c.logo} onClick={handleHomeClick}>
            <div style={c.logoIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', letterSpacing: '-0.5px' }}>
              <span style={{ fontWeight: 900, color: '#6366f1' }}>SHORTLINK</span>
              <span style={{ fontWeight: 900, color: dark ? '#475569' : '#94a3b8' }}>.NET</span>
            </span>
          </Link>
        </div>

        {/* Menu Desktop */}
        <div style={c.menuDesktop} className="desktop-only">
          {desktopMenuItems.map((m) => (
            <Link key={m.label} href={m.href} style={c.menuLink} onClick={m.onClick} onMouseEnter={(e) => (e.target.style.color = '#0372ff')} onMouseLeave={(e) => (e.target.style.color = dark ? '#94a3b8' : '#475569')}>
              {m.label}
            </Link>
          ))}
        </div>

        {/* Right: Toggle + Login/Dashboard */}
        <div style={c.right}>
          <button onClick={toggle} style={c.toggleBtn} className="desktop-only" title={dark ? 'Switch to Light' : 'Switch to Dark'}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {isLoggedIn ? (
            <Link href={`/${locale}/dashboard`} className="premium-login-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Dashboard
            </Link>
          ) : (
            // ✅ Ganti Link → button, panggil openModal
            <button onClick={openModal} className="premium-login-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={c.mobileMenu}>
          {mobileMenuItems.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              style={c.mobileMenuItem}
              onClick={(e) => {
                m.onClick?.(e);
                setMenuOpen(false);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={m.icon} />
              </svg>
              {m.label}
            </Link>
          ))}

          {/* ✅ Login item di mobile menu
          {!isLoggedIn && (
            <button
              onClick={() => {
                openModal();
                setMenuOpen(false);
              }}
              style={{
                ...c.mobileMenuItem,
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: `1px solid ${dark ? '#1e293b' : '#f8fafc'}`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              LOGIN
            </button>
          )} */}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              toggle();
            }}
            style={{
              ...c.mobileMenuItem,
              width: '100%',
              background: 'none',
              border: 'none',
              borderBottom: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span style={{ color: dark ? '#f59e0b' : '#475569' }}>{dark ? 'Light Mode' : 'Dark Mode'}</span>

            {/* Pill toggle visual */}
            <span
              style={{
                marginLeft: 'auto',
                width: '36px',
                height: '20px',
                borderRadius: '100px',
                background: dark ? '#6366f1' : '#e2e8f0',
                position: 'relative',
                transition: '0.3s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: dark ? '18px' : '3px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'white',
                  transition: '0.3s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}
              />
            </span>
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) { .desktop-only { display: none !important; } }
        @media (min-width: 1024px) { .lg-hide { display: none !important; } }

        /* ======= PREMIUM LOGIN BUTTON ======= */
        .premium-login-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white !important;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          font-family: inherit;
        }

        .premium-login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .premium-login-btn:active {
          transform: translateY(1px);
        }

        /* Efek Shimmer */
        .premium-login-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg);
          animation: shimmer-login 3.5s infinite;
        }

        @keyframes shimmer-login {
          0% { left: -100%; }
          15% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>
    </header>
  );
}
