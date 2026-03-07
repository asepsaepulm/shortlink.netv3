'use client';
import { useState } from 'react';
import ShortenForm from './ShortenForm';
import { useTheme } from '@/context/ThemeContext';

const leaderboard = [
  { rank: 1, name: 'anakingusan', clicks: '44,986', label: 'Top Contributor', badgeBg: '#f59e0b' },
  { rank: 2, name: 'edenhutchins', clicks: '17,302', label: 'Elite Member', badgeBg: '#94a3b8' },
  { rank: 3, name: 'videyy', clicks: '9,079', label: 'Elite Member', badgeBg: '#c2410c' },
  { rank: 4, name: 'hanifalexander', clicks: '2,708', label: 'Active Member', badgeBg: '#cbd5e1' },
  { rank: 5, name: 'zid', clicks: '2,377', label: 'Active Member', badgeBg: '#cbd5e1' },
];

const features = [
  { icon: '🖥️', title: 'Multi-Domain Link Shortener', desc: 'Use multiple premium domains to create branded short links that suit your marketing campaigns.' },
  { icon: '⚡', title: 'Fast URL Redirection', desc: 'Experience lightning-fast direct link redirection for a seamless user experience across all devices.' },
  { icon: '📈', title: 'Real-time Click Statistics', desc: 'Detailed link analytics: monitor total clicks, referral sources, and track link performance daily.' },
  { icon: '🛡️', title: 'Secure Short Links', desc: 'Our secure URL shortener features HTTPS encryption and link validation to prevent spam and phishing.' },
];

const faqs = [
  { q: 'Why should I use a URL Shortener?', a: "A URL shortener like ShortLink makes links more manageable for social media, increases trust, and provides link tracking capabilities that standard long URLs don't offer." },
  { q: 'Is ShortLink a Free URL Shortener?', a: 'Yes! ShortLink is a free link shortener that allows anyone to create short URLs and track clicks instantly without any hidden costs for basic features.' },
  { q: 'Do shortened links affect SEO?', a: 'Our platform uses fast HTTP redirects to deliver users instantly to your destination URL while preserving SEO visibility and providing accurate link analytics.' },
  { q: 'Can I create custom short links?', a: 'Yes, our platform supports branded links and custom URL aliases, helping you improve brand recognition and click-through rates.' },
];

const brands = [
  {
    label: 'Google',
    color: null,
    svg: (hovered) => (
      <svg height="36" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ opacity: hovered ? 1 : 0.3, filter: hovered ? 'none' : 'grayscale(1)', transition: 'all 0.3s', cursor: 'default' }}>
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 32.4 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.6-11.3-8.4l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
      </svg>
    ),
  },
  { label: 'Meta', icon: 'fa-brands fa-meta', color: '#0082FB' },
  { label: 'Amazon', icon: 'fa-brands fa-amazon', color: '#FF9900' },
  { label: 'Microsoft', icon: 'fa-brands fa-microsoft', color: '#00A4EF' },
  { label: 'Apple', icon: 'fa-brands fa-apple', color: '#555555' },
];

function BrandIcon({ brand, textPrimary }) {
  const [hovered, setHovered] = useState(false);

  if (brand.svg) {
    return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
        {brand.svg(hovered)}
      </div>
    );
  }

  return (
    <i
      className={brand.icon}
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '36px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? brand.color : textPrimary,
        opacity: hovered ? 1 : 0.3,
        filter: hovered ? 'none' : 'grayscale(1)',
        transition: 'color 0.3s, opacity 0.3s, filter 0.3s',
        cursor: 'default',
      }}
    />
  );
}

export default function HeroSection() {
  const { dark } = useTheme();

  const bg = dark ? '#0f172a' : '#f8faff';
  const bgCard = dark ? '#1e293b' : 'white';
  const textPrimary = dark ? '#f1f5f9' : '#0f172a';
  const textMuted = dark ? '#94a3b8' : '#64748b';
  const border = dark ? '#1e293b' : '#e2e8f0';

  return (
    <>
      <div style={{ paddingTop: '72px' }}></div>

      <main style={{ background: bg, minHeight: '100vh', transition: 'background 0.3s' }}>
        <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '64px' }}>
          {/* Blobs */}
          <div
            style={{
              position: 'absolute',
              top: '-96px',
              left: '-96px',
              width: '384px',
              height: '384px',
              background: dark ? 'rgba(79,70,229,0.08)' : '#e0e7ff',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-96px',
              width: '320px',
              height: '320px',
              background: dark ? 'rgba(59,130,246,0.08)' : '#dbeafe',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          ></div>

          <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '64px 24px 0' }}>
            {/* ── Hero Text ── */}
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 18px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: bgCard,
                  color: '#4f46e5',
                  border: `1.5px solid ${dark ? '#312e81' : '#c7d2fe'}`,
                  marginBottom: '28px',
                  letterSpacing: '1px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  textTransform: 'uppercase',
                }}
              >
                Best Free URL Shortener &amp; Link Management
              </span>

              <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, color: textPrimary, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
                The Most Powerful{' '}
                <span style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  URL
                  <br />
                  Shortener
                </span>
                <br />
                to Shorten &amp; Track Links
              </h1>

              <p style={{ color: textMuted, fontSize: '18px', maxWidth: '580px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                ShortLink is the world's fastest <strong style={{ color: textPrimary }}>URL shortener</strong> and <strong style={{ color: textPrimary }}>link management platform</strong>. Create custom short links, track real-time
                analytics, and optimize your marketing campaigns for better CTR.
              </p>

              {/* Stats pill */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  background: bgCard,
                  border: `1px solid ${border}`,
                  width: 'fit-content',
                  margin: '0 auto 12px',
                  boxShadow: dark ? 'none' : '4px 4px 8px #d1d9e6,-4px -4px 8px #ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: textMuted,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>
                  <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '16px' }}>644</span>&nbsp;Links Created
                </span>
                <span style={{ width: '1px', height: '16px', background: border, display: 'inline-block' }}></span>
                <span>
                  <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '16px' }}>273,477</span>&nbsp;Clicks Recorded
                </span>
              </div>

              {/* Live Traffic */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    background: bgCard,
                    border: `1px solid ${border}`,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: textMuted,
                    boxShadow: dark ? 'none' : '4px 4px 8px #d1d9e6,-4px -4px 8px #ffffff',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                  <span style={{ letterSpacing: '0.5px' }}>LIVE TRAFFIC</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px' }}>62</span>
                </div>
              </div>
            </div>

            {/* ── Form + Leaderboard ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px', alignItems: 'start' }}>
              <ShortenForm />

              {/* Leaderboard */}
              <div style={{ background: bgCard, borderRadius: '16px', border: `2px solid ${border}`, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: `2px solid ${border}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: dark ? '#4f46e5' : '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, color: textPrimary, fontSize: '15px', margin: 0 }}>Performance Leaderboard</h3>
                    <p style={{ fontSize: '10px', color: textMuted, margin: '3px 0 0', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                      Period: <span style={{ color: textPrimary }}>March 2026</span>
                    </p>
                  </div>
                </div>

                {leaderboard.map((u) => (
                  <div key={u.rank} style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: dark ? '#334155' : '#e0e7ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '16px',
                            color: '#4f46e5',
                            border: u.rank <= 3 ? `2px solid ${u.badgeBg}` : `2px solid ${border}`,
                          }}
                        >
                          {u.name[0].toUpperCase()}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-3px',
                            right: '-3px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: u.badgeBg,
                            color: 'white',
                            fontSize: '9px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${bgCard}`,
                          }}
                        >
                          {u.rank}
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: textPrimary }}>{u.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '10px', color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{u.label}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '15px', color: textPrimary }}>{u.clicks}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '9px', color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Clicks</p>
                    </div>
                  </div>
                ))}

                <div style={{ padding: '10px', textAlign: 'center', background: dark ? '#0f172a' : '#f8fafc' }}>
                  <p style={{ fontSize: '9px', color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Calculated in real-time · Last Sync: Just now</p>
                </div>
              </div>
            </div>

            {/* ── Trusted By ── */}
            <div style={{ textAlign: 'center', padding: '64px 24px 32px' }}>
              <p style={{ color: textMuted, fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '40px' }}>Trusted for SEO &amp; Digital Marketing</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '48px', minHeight: '40px' }}>
                {brands.map((brand) => (
                  <BrandIcon key={brand.label} brand={brand} textPrimary={textPrimary} />
                ))}
              </div>
            </div>

            {/* ── Features ── */}
            <section style={{ padding: '32px 0 64px' }}>
              <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 800, color: textPrimary, marginBottom: '40px' }}>Why Choose SHORTLINK.NET for Link Management?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {features.map((f) => (
                  <div
                    key={f.title}
                    style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '16px', padding: '28px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <div
                      style={{ width: '48px', height: '48px', borderRadius: '12px', background: dark ? 'rgba(79,70,229,0.15)' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '15px', color: textPrimary, margin: '0 0 6px' }}>{f.title}</h3>
                      <p style={{ color: textMuted, fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <div id="faq" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: dark ? '#1e293b' : '#f1f5f9',
                    color: dark ? '#94a3b8' : '#64748b',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }}></span>
                  Resources
                </div>
                <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, color: textPrimary, lineHeight: 1.1, margin: 0 }}>
                  Frequently Asked <span style={{ color: dark ? '#475569' : '#94a3b8' }}>Questions</span>
                </h2>
              </div>

              <div style={{ borderTop: `1px solid ${border}` }}>
                {faqs.map((faq) => (
                  <details key={faq.q} style={{ borderBottom: `1px solid ${border}` }}>
                    <summary style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', cursor: 'pointer', fontSize: '17px', fontWeight: 700, color: textPrimary, gap: '16px' }}>
                      {faq.q}
                      <span style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: textMuted, fontSize: '18px' }}>
                        +
                      </span>
                    </summary>
                    <p style={{ color: textMuted, fontSize: '15px', lineHeight: 1.7, paddingBottom: '20px', margin: 0 }}>{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px', fontStyle: 'italic', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                SHORT<span style={{ color: '#0372ff' }}>LINK.NET</span>
              </span>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, maxWidth: '320px', margin: 0 }}>
                The most powerful <strong style={{ color: '#94a3b8' }}>free link management platform</strong> for business and creators.
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #0372ff',
                  display: 'inline-block',
                  paddingBottom: '4px',
                  marginTop: 0,
                  marginRight: 0,
                  marginBottom: '20px',
                  marginLeft: 0,
                }}
              >
                Company
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['About Us', 'Contact Support', 'Official Blog'].map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3
                style={{
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #0372ff',
                  display: 'inline-block',
                  paddingBottom: '4px',
                  marginTop: 0,
                  marginRight: 0,
                  marginBottom: '20px',
                  marginLeft: 0,
                }}
              >
                Legal Policy
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Cookie Policy'].map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#334155', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
              © 2026 <span style={{ color: '#94a3b8' }}>SHORTLINK.NET</span>. All Rights Reserved.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['F', 'T', 'Y'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </>
  );
}
