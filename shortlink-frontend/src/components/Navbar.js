'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();

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
    logoIcon: { width: '32px', height: '32px', background: '#0372ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
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
    dashBtn: { padding: '9px 20px', background: '#0372ff', color: 'white', borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' },
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill={dark ? 'none' : 'none'} stroke={dark ? '#94a3b8' : '#475569'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

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
          <Link href={`/${locale}`} style={c.logo}>
            <div style={c.logoIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', letterSpacing: '-0.5px' }}>
              <span style={{ fontWeight: 900, color: '#0372ff' }}>SHORTLINK</span>
              <span style={{ fontWeight: 900, color: dark ? '#475569' : '#94a3b8' }}>.NET</span>
            </span>
          </Link>
        </div>

        {/* Menu Desktop */}
        <div style={c.menuDesktop} className="desktop-only">
          {[
            { label: 'HOME', href: `/${locale}` },
            { label: 'FAQ', href: `/${locale}/#faq` },
            { label: 'TERMS OF USE', href: `/${locale}/terms` },
            { label: 'SUPPORT', href: 'mailto:support@shortlink.net' },
          ].map((m) => (
            <Link key={m.label} href={m.href} style={c.menuLink} onMouseEnter={(e) => (e.target.style.color = '#0372ff')} onMouseLeave={(e) => (e.target.style.color = dark ? '#94a3b8' : '#475569')}>
              {m.label}
            </Link>
          ))}
        </div>

        {/* Right: Toggle + Dashboard */}
        <div style={c.right}>
          <button onClick={toggle} style={c.toggleBtn} title={dark ? 'Switch to Light' : 'Switch to Dark'}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href={`/${locale}/dashboard`} style={c.dashBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={c.mobileMenu}>
          {[
            { label: 'HOME', href: `/${locale}`, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
            { label: 'FAQ', href: `/${locale}/#faq`, icon: 'M9 9h.01M15 9h.01M12 17v.01M12 3C6.477 3 2 7.477 2 13s4.477 10 10 10 10-4.477 10-10S17.523 3 12 3z' },
            { label: 'TERMS OF USE', href: `/${locale}/terms`, icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
            { label: 'SUPPORT', href: 'mailto:support@shortlink.net', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
          ].map((m) => (
            <Link key={m.label} href={m.href} style={c.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0372ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={m.icon} />
              </svg>
              {m.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) { .desktop-only { display: none !important; } }
        @media (min-width: 1024px) { .lg-hide { display: none !important; } }
      `}</style>
    </header>
  );
}
