'use client';
import { useState, useEffect } from 'react';
import ShortenForm from './ShortenForm';
import { useTheme } from '@/context/ThemeContext';

const brands = [
  {
    label: 'Google',
    svg: (
      <svg height="30" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 32.4 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.6-11.3-8.4l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
      </svg>
    ),
  },
  { label: 'Meta', icon: 'fa-brands fa-meta', color: '#0668E1' },
  { label: 'Amazon', icon: 'fa-brands fa-amazon', color: '#FF9900' },
  { label: 'Microsoft', icon: 'fa-brands fa-microsoft', color: '#00A4EF' },
  { label: 'Apple', icon: 'fa-brands fa-apple', color: '#888888' },
];

const faqData = [
  {
    q: 'What is a URL Shortener and how does it work?',
    a: 'URL shortener is a web tool that converts long URLs into shorter links that redirects users to the original destination. When someone clicks a short link, the browser will follow the 301 redirect to the full address. Most URL shorteners also provide analytics to track clicks, traffic sources, engagement, and overall link performance. Short links are easier to share on social media, via email, SMS, QR code, and printed materials.',
  },
  {
    q: 'Why should I use a URL shortener?',
    a: 'Long URLs look messy, easily interrupted in chat or email and can reduce trust. URL shortener makes your link shorter, easier to read, and professional. Short links increase CTR, easier to remember, and more effective on SMS, social media, QR code, printed materials, podcasts and advertisements. With shortlink.net you also get detailed analytics and branded links, making every short link a measurable marketing asset.',
  },
  {
    q: 'What is a branded short link?',
    a: 'A branded short link uses your own domain (for example yourbrnd.link/promo) instead of a generic one. This makes your links instantly recognizable, increases trust and typically improves click-through rates. With shortlink.net you can connect custom domains, create branded slugs, generate QR codes and track analytics for every branded link you share.',
  },
  {
    q: 'Will using a URL shortener hurt my SEO?',
    a: 'No. Modern search engines handle short URLs correctly. shortlink.net uses standard 301 redirects, which preserve SEO value and signal that the short URL is a permanent redirect to the original page. You can safely shorten long URLs, landing pages, blog posts and product links without harming rankings. For campaign tracking, you can combine shortlink.net with UTM parameters and Google Analytics.',
  },
];

const leaderboardData = [
  { id: 1, url: 'Madun', clicks: '1,204,592', trend: '+14%', active: true },
  { id: 2, url: 'Martin', clicks: '842,401', trend: '+8%', active: true },
  { id: 3, url: 'Alice', clicks: '545,110', trend: '+5%', active: false },
  { id: 4, url: 'Jokowi', clicks: '132,894', trend: '+2%', active: true },
  { id: 5, url: 'Prabowo', clicks: '98,231', trend: '+3%', active: true },
  { id: 6, url: 'Gibran', clicks: '74,500', trend: '+1%', active: false },
  { id: 7, url: 'Itil', clicks: '61,080', trend: '+6%', active: true },
  { id: 8, url: 'Memek', clicks: '43,220', trend: '+2%', active: true },
];

const RotatingText = () => {
  const words = ['custom slug', 'branded links', 'analytics', 'higher CTR'];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % words.length), 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span style={{ display: 'inline-block', color: '#6366f1', minWidth: '240px', fontWeight: 900 }}>
      <span key={index} className="word-animation">
        {words[index]}
      </span>
    </span>
  );
};

export default function HeroSection({ isDark }) {
  const { dark } = useTheme();
  const [openFaq, setOpenFaq] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Real-time Stats & Leaderboard states
  const [stats, setStats] = useState({ linksCreated: 0, clicksRecorded: 0, activeUsers: 1 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/hero');
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({
            ...prev,
            linksCreated: data.linksCreated || prev.linksCreated,
            activeUsers: data.activeUsers || prev.activeUsers,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsStatsLoading(false);
      }
    };
    
    // Fetch cached real-time leaderboard
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setLeaderboardData(data);
          
          // Calculate the sum of all leaderboard clicks
          const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
          
          // Update the Hero Stat `clicksRecorded` using the leaderboard sum
          setStats(prev => ({
            ...prev,
            clicksRecorded: totalClicks
          }));
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setIsLeaderboardLoading(false);
      }
    };

    fetchStats();
    fetchLeaderboard();
    
    // Poll stats every 5 seconds, poll leaderboard every 30 seconds
    const statsInterval = setInterval(fetchStats, 5000);
    const leaderboardInterval = setInterval(fetchLeaderboard, 5000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(leaderboardInterval);
    };
  }, []);

  const bg = dark ? '#0a0b10' : '#ffffff';
  const textPrimary = dark ? '#ededed' : '#111827';
  const textMuted = dark ? '#94a3b8' : '#64748b';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const cardBg = dark ? '#11141b' : '#ffffff';
  const drawerBg = dark ? '#0f172a' : '#ffffff';

  return (
    <main style={{ background: bg, minHeight: '100vh', transition: '0.3s', color: textPrimary }}>
      {/* ===================== SECTION 1: HERO ===================== */}
      <section className="hero-section" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="hero-grid" style={{ gap: '80px', alignItems: 'flex-start' }}>
          {/* LEFT — STICKY */}
          <div style={{ position: 'sticky', top: '100px', alignself: 'start' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '100px',
                background: dark ? 'rgba(99,102,241,0.1)' : '#f3f4f6',
                color: '#6366f1',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '32px',
              }}
            >
              <span className="pulse-dot"></span> The smarter way to shorten URLs
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '24px' }}>
              Shorten links with <br />
              <RotatingText />
            </h1>

            <p style={{ color: textMuted, fontSize: '20px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '540px' }}>
              Shortlink is the world's fastest URL shortener and link management platform. Create custom short links, track real-time analytics, and optimize your marketing campaigns for better CTR.
            </p>

            {/* ✅ Stats — tambah className="stats-bar" */}
            <div
              className="stats-bar"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                border: `1px solid ${border}`,
                borderRadius: '24px',
                padding: '24px 32px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              }}
            >
              <div>
                <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>{Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(stats.linksCreated)}</div>
                <div style={{ fontSize: '12px', color: textMuted, fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Links Created</div>
              </div>
              {/* ✅ Divider — tambah className="stats-divider" */}
              <div className="stats-divider" style={{ width: '1px', height: '40px', background: border }}></div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>{Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(stats.clicksRecorded)}</div>
                <div style={{ fontSize: '12px', color: textMuted, fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Clicks Recorded</div>
              </div>
              {/* ✅ Divider — tambah className="stats-divider" */}
              <div className="stats-divider" style={{ width: '1px', height: '40px', background: border }}></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>{stats.activeUsers}</span>
                  <div style={{ padding: '3px 8px', background: 'rgba(34,197,94,0.1)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="pulse-dot" style={{ width: '5px', height: '5px' }}></span>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#22c55e', letterSpacing: '0.5px' }}>LIVE</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: textMuted, fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Users</div>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div style={{ background: cardBg, padding: '0px', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: `1px solid ${border}` }}>
            <ShortenForm />
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: BRANDS (INFINITE MARQUEE) ===================== */}
      <section
        style={{
          padding: '80px 0 40px',
          textAlign: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: textMuted,
            marginBottom: '40px',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          TRUSTED BY WORLD-CLASS TEAMS
        </p>

        {/* Container Marquee */}
        <div style={{ display: 'flex', width: 'fit-content' }}>
          <div className="marquee-content" style={{ display: 'flex' }}>
            {/* Duplikasi array 2 kali agar looping mulus tanpa putus */}
            {[...brands, ...brands].map((b, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className="brand-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 40px', // Jarak ruang kiri kanan teks
                    cursor: 'default',
                  }}
                >
                  {/* Ikon */}
                  <div
                    className="brand-icon"
                    style={{
                      fontSize: '28px', // Untuk font-awesome
                      color: b.color || 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {b.svg ? b.svg : <i className={b.icon}></i>}
                  </div>
                  {/* Teks */}
                  <span
                    className="brand-text"
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {b.label}
                  </span>
                </div>

                {/* Garis Pemisah Vertikal */}
                <div
                  style={{
                    width: '1px',
                    height: '32px',
                    background: border,
                    opacity: 0.6,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Overlay Gradient Kiri Kanan (Fading Effect) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '100%', background: `linear-gradient(90deg, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '100%', background: `linear-gradient(-90deg, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      </section>

      {/* ===================== SECTION 3: FAQ ===================== */}
      <section id="faq" style={{ padding: '100px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`, marginBottom: '20px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>?</div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: textPrimary }}>FAQ</span>
          </div>
          <h2 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1.5px' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqData.map((faq, idx) => (
            <div key={idx} style={{ background: cardBg, border: `1px solid ${openFaq === idx ? '#6366f1' : border}`, borderRadius: '12px', overflow: 'hidden', transition: '0.4s' }}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '22px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: openFaq === idx ? '#6366f1' : textPrimary,
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {faq.q}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: '0.4s', transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: openFaq === idx ? '1fr' : '0fr', transition: '0.4s' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ padding: '0 24px 24px', color: textMuted, lineHeight: 1.6 }}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===================== CONTACT SUPPORT ===================== */}
        <div
          style={{
            marginTop: '64px',
            padding: '48px',
            background: dark ? 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' : 'linear-gradient(145deg, #f8fafc, #ffffff)',
            border: `1px solid ${border}`,
            borderRadius: '24px',
            textAlign: 'center',
            boxShadow: dark ? 'none' : '0 10px 30px -10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>Still have questions?</h4>
          <p style={{ margin: 0, color: textMuted, fontSize: '16px', maxWidth: '400px' }}>Our support team is ready to help you with any issues or questions you might have.</p>
          <button
            className="contact-btn"
            style={{
              marginTop: '16px',
              padding: '14px 32px',
              background: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <a href="mailto:support@shortlink.net" style={{ color: 'inherit', textDecoration: 'none' }}>
              Contact Support
            </a>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer
        style={{
          background: dark ? 'linear-gradient(180deg, #0b1120 0%, #030712 100%)' : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '80px 24px 40px',
          borderTop: `1px solid ${dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`,
          color: textMuted,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Efek Cahaya (Glow) di atas tengah footer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '200px',
            background: `radial-gradient(ellipse at top, ${dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.06)'} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        ></div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Logo & Deskripsi Singkat */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px -5px rgba(99,102,241,0.5)',
                marginBottom: '24px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <span style={{ fontSize: '32px', fontWeight: 900, color: textPrimary, letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Short<span style={{ color: '#6366f1' }}>Link</span>
              <span style={{ fontWeight: 500, color: textMuted, fontSize: '20px' }}>.net</span>
            </span>
            <p style={{ margin: 0, fontSize: '16px', color: textMuted, maxWidth: '400px', lineHeight: 1.6 }}>The intelligent link management platform to build your brand and drive better results.</p>
          </div>

          {/* Links Navigasi */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '56px', flexWrap: 'wrap' }}>
            {['Product', 'Pricing', 'API Docs', 'Privacy Policy', 'Terms of Service'].map((item) => (
              <span key={item} className="footer-link-premium" style={{ color: textMuted }}>
                {item}
              </span>
            ))}
          </div>

          {/* Garis Pembatas Halus memudar di ujungnya */}
          <div style={{ width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${border}, transparent)`, marginBottom: '32px' }}></div>

          {/* Copyright & Social Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px', opacity: 0.8 }}>© {new Date().getFullYear()} Shortlink.net. All rights reserved.</p>

            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Twitter / X */}
              <div className="social-icon-premium" style={{ color: textMuted }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </div>
              {/* Instagram */}
              <div className="social-icon-premium" style={{ color: textMuted }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              {/* GitHub */}
              <div className="social-icon-premium" style={{ color: textMuted }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== FLOATING LEADERBOARD BUTTON ===================== */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="leaderboard-fab"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 900,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)', // Warna Emas/Trophy
          color: '#fff',
          border: 'none',
          borderRadius: '100px',
          padding: '14px 22px',
          fontWeight: 800,
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      </button>

      {/* ===================== LEADERBOARD DRAWER ===================== */}
      {/* Overlay */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', opacity: isDrawerOpen ? 1 : 0, visibility: isDrawerOpen ? 'visible' : 'hidden', transition: '0.3s' }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isDrawerOpen ? 0 : '-480px',
          width: 'min(460px, 92vw)',
          height: '100vh',
          zIndex: 100000,
          background: drawerBg,
          boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
          borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`,
          borderLeft: `1px solid ${border}`,
          borderRight: 'none',
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '28px 32px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textPrimary }}>Top Users</h3>
            <p style={{ margin: 0, fontSize: '13px', color: textMuted }}>User dengan total klik terbanyak.</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              color: textMuted,
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }} className="drawer-scroll">
          {/* Column Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr 110px',
              padding: '12px 32px',
              fontSize: '11px',
              fontWeight: 700,
              color: textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              borderBottom: `1px solid ${border}`,
            }}
          >
            <div>#</div>
            <div>User</div>
            <div style={{ textAlign: 'right' }}>Total Clicks</div>
          </div>

          {leaderboardData.map((item, i) => (
            <div key={item.user || i} className="drawer-row" style={{ display: 'grid', gridTemplateColumns: '48px 1fr 110px', padding: '18px 32px', borderBottom: `1px solid ${border}`, alignItems: 'center', transition: '0.15s' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  background: i === 0 ? 'rgba(250,204,21,0.15)' : i === 1 ? 'rgba(148,163,184,0.15)' : i === 2 ? 'rgba(205,127,50,0.15)' : dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                  color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : textMuted,
                }}
              >
                {i + 1}
              </div>
              <div style={{ minWidth: 0, paddingRight: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '15px', color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.user}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '100px', background: i === 0 ? 'rgba(250,204,21,0.1)' : i <= 2 ? 'rgba(148,163,184,0.1)' : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: i === 0 ? '#f59e0b' : i <= 2 ? '#94a3b8' : textMuted }}>
                  {i === 0 ? '🏆 Top Contributor' : i <= 2 ? '⭐ Elite Member' : '👤 Active Member'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: textPrimary }}>{item.clicks}</div>
                <div style={{ fontSize: '10px', color: textMuted, fontWeight: 600, marginTop: '2px' }}>CLICKS</div>
              </div>
            </div>
          ))}

          <div style={{ height: '24px' }} />
        </div>

        <div style={{ padding: '16px 32px', borderTop: `1px solid ${border}`, flexShrink: 0, background: dark ? 'rgba(255,255,255,0.01)' : '#f8fafc', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', color: textMuted, fontWeight: 600 }}>Showing {leaderboardData.length} Top Users · Updated every 5s</p>
        </div>
      </div>

      <style>{`
        .word-animation { display: inline-block; animation: slideUp 0.5s ease forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); } 70% { box-shadow: 0 0 0 10px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }

        .leaderboard-fab:hover { transform: translateY(-2px) !important; box-shadow: 0 12px 32px rgba(99,102,241,0.5) !important; }
        .drawer-row:hover { background: ${dark ? 'rgba(255,255,255,0.03)' : '#f8fafc'} !important; }

        .drawer-scroll::-webkit-scrollbar { width: 4px; }
        .drawer-scroll::-webkit-scrollbar-track { background: transparent; }
        .drawer-scroll::-webkit-scrollbar-thumb { background: ${border}; border-radius: 10px; }
        .drawer-scroll::-webkit-scrollbar-thumb:hover { background: ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}; }

        /* ======= HERO RESPONSIVE ======= */
        .hero-section { padding: 120px 24px 100px; }
        .hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); }

        @media (max-width: 860px) {
          .hero-section { padding: 100px 16px 60px; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-grid > div:first-child { position: static !important; }
        }

       /* ======= STATS BAR RESPONSIVE ======= */
@media (max-width: 600px) {
  .stats-bar {
    padding: 16px !important;
    border-radius: 16px !important;
    gap: 0 !important;
  }
  .stats-bar > div:not(.stats-divider) div:first-child {
    font-size: 18px !important;
  }
  .stats-bar > div:not(.stats-divider) div:last-child {
    font-size: 9px !important;
  }
  .stats-divider {
    height: '32px' !important;
  }
}

.contact-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(99,102,241,0.4) !important; }
        // .footer-link:hover { color: #6366f1; }

        @media (max-width: 600px) {
          .fab-text { display: none; }
          .leaderboard-fab { 
            padding: 18px !important; 
            border-radius: 50% !important; 
            bottom: 24px !important; 
            right: 24px !important; 
          }
          .leaderboard-fab svg { width: 24px; height: 24px; }
        }

      /* ======= ANIMASI INFINITE MARQUEE BRANDS ======= */
        .marquee-content {
          animation: scroll 20s linear infinite; /* Kecepatan jalan (kecilkan angka untuk lebih cepat) */
        }
        .marquee-content:hover {
          animation-play-state: paused; /* Berhenti saat disorot kursor */
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* Bergeser sejauh 1 kloter array penuh */
        }


        /* ======= EFEK ELEGAN GRAYSCALE PADA IKON ======= */
        .brand-item {
          transition: all 0.3s ease;
        }
        .brand-item .brand-icon {
          filter: grayscale(100%);
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .brand-item .brand-text {
          color: ${textMuted};
          transition: all 0.3s ease;
        }

        /* Saat baris ikon di Hover, kembali berwarna asli */
        .brand-item:hover {
          transform: scale(1.05); /* Sedikit membesar */
        }
        .brand-item:hover .brand-icon {
          filter: grayscale(0%);
          opacity: 1;
        }
        .brand-item:hover .brand-text {
          color: ${textPrimary};
        }
        
      `}</style>
    </main>
  );
}
