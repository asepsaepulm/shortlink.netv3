'use client';
import { useState, useEffect } from 'react';

export default function UserDashboard() {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = '/';
    }
  }, []);


  // Palet Warna Premium
  const c = {
    bg: '#0f172a',
    sidebar: '#151b2b',
    card: '#1b2234',
    border: '#2a3447',
    textMain: '#f1f5f9',
    textMuted: '#8b98a9',
    primary: '#2563eb',
    green: '#10b981',
    greenBg: 'rgba(16, 185, 129, 0.15)',
    purple: '#8b5cf6',
    purpleBg: 'rgba(139, 92, 246, 0.15)',
    gold: '#f59e0b',
    red: '#ef4444',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.bg, color: c.textMain, fontFamily: "'Inter', sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: c.sidebar, borderRight: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: c.primary, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800 }}>
            SHORTTEN<span style={{ color: c.textMuted }}>.NET</span>
          </span>
        </div>

        <nav style={{ padding: '16px', flex: 1 }}>
          <div style={{ fontSize: '11px', color: c.textMuted, fontWeight: 700, marginBottom: '12px' }}>MAIN CONTROL</div>
          <button
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: c.primary,
              color: '#fff',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px',
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </button>
          <button style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: c.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Logs Today
          </button>
        </nav>

        {/* Server Status Widget */}
        <div style={{ padding: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: c.primary, fontWeight: 700, marginBottom: '8px' }}>
              <div style={{ width: '6px', height: '6px', background: c.primary, borderRadius: '50%' }} /> SERVER STATUS
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>Mar 14 2026 at 02:28:09 PM</div>
            <div style={{ fontSize: '10px', color: c.textMuted, marginTop: '2px' }}>Reset: 00:00 UTC</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ padding: '16px 32px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '45px', height: '24px', backgroundColor: c.primary, borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '3px', top: '3px' }} />
            </div>
            <div style={{ width: '32px', height: '32px', background: c.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <span style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}>{user?.name || 'User'} (Logout)</span>
          </div>
        </header>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Blue Hero Card */}
              <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>YOUR CLICKS TODAY</div>
                <div style={{ fontSize: '48px', fontWeight: 800, margin: '12px 0 32px 0' }}>12.940</div>
                <div style={{ display: 'flex', gap: '48px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: c.gold, fontWeight: 700 }}>ADS CLICKS</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>2.559</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>19.8% Conv.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: c.green, fontWeight: 700 }}>REV. TODAY</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>$1.79</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>ESTIMATED</div>
                  </div>
                </div>
                {/* Globe Icon */}
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.2 }}>
                  <svg width="120" height="120" fill="none" stroke="white" strokeWidth="1">
                    <circle cx="60" cy="60" r="50" />
                    <ellipse cx="60" cy="60" rx="50" ry="20" />
                    <ellipse cx="60" cy="60" rx="50" ry="20" transform="rotate(90 60 60)" />
                  </svg>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ background: c.card, padding: '20px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted }}>TOTAL CLICKS</span>
                    <span style={{ fontSize: '10px', color: c.green, background: c.greenBg, padding: '2px 8px', borderRadius: '10px' }}>+223,426 (7D)</span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>550.189</div>
                </div>
                <div style={{ background: c.card, padding: '20px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted }}>TOTAL LINKS</span>
                    <span style={{ fontSize: '10px', color: '#ec4899', background: 'rgba(236,72,153,0.1)', padding: '2px 8px', borderRadius: '10px' }}>+99 (7D)</span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>761</div>
                </div>
                <div style={{ background: c.card, padding: '20px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted }}>TOTAL USERS</span>
                    <span style={{ fontSize: '10px', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '10px' }}>+5 New (7D)</span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>106</div>
                </div>
              </div>

              {/* RECENT GLOBAL LINKS TABLE */}
              <div style={{ background: c.card, borderRadius: '12px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: `1px solid ${c.border}` }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Your Recent Links (7 Days)</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ color: c.textMuted, textAlign: 'left', borderBottom: `1px solid ${c.border}` }}>
                    <tr>
                      <th style={{ padding: '12px 20px' }}>TARGET/ORIGINAL</th>
                      <th style={{ padding: '12px 20px' }}>CLICKS</th>
                      <th style={{ padding: '12px 20px' }}>CREATED BY</th>
                      <th style={{ padding: '12px 20px' }}>CREATED ON</th>
                      <th style={{ padding: '12px 20px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((item) => (
                      <tr key={item} style={{ borderBottom: `1px solid ${c.border}` }}>
                        <td style={{ padding: '16px 20px', color: c.textMuted }}>https://probationthimbl...</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: c.bg, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${c.border}` }}>{item === 1 ? '2' : '1'}</span>
                        </td>
                        <td style={{ padding: '16px 20px', color: c.green, fontWeight: 700 }}>velove12</td>
                        <td style={{ padding: '16px 20px', color: c.textMuted }}>MAR 14, 2026 AT 02:15 PM UTC</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ width: '28px', height: '28px', background: 'rgba(37,99,235,0.2)', border: 'none', borderRadius: '4px', color: c.primary, cursor: 'pointer' }}>👁</button>
                            <button style={{ width: '28px', height: '28px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '4px', color: c.red, cursor: 'pointer' }}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* NEW USERS (REMOVED FOR REGULAR USER) */}
            </div>

            {/* RIGHT COLUMN (Leaderboard) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Live Traffic */}
              <div style={{ background: c.card, padding: '16px 20px', borderRadius: '12px', border: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: c.textMuted }}>
                  <div style={{ width: '8px', height: '8px', background: c.green, borderRadius: '50%' }} /> LIVE TRAFFIC
                </div>
                <div style={{ color: c.green, fontWeight: 800, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M23 6l-9.5 9.5-5-5L1 18" />
                    <path d="M17 6h6v6" />
                  </svg>{' '}
                  61
                </div>
              </div>

              {/* Performance Leaderboard */}
              <div style={{ background: c.card, borderRadius: '12px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'center', borderBottom: `1px solid ${c.border}` }}>
                  <div style={{ width: '32px', height: '32px', background: c.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏆</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>Performance Leaderboard</div>
                    <div style={{ fontSize: '10px', color: c.green }}>PERIOD: MARCH 2026</div>
                  </div>
                </div>

                <div style={{ padding: '8px 0' }}>
                  {[
                    { name: 'anakingusan', clicks: '135,726', rank: 1, color: c.gold },
                    { name: 'wanspoke', clicks: '69,448', rank: 2, color: '#94a3b8' },
                    { name: 'tanelizabet', clicks: '68,206', rank: 3, color: '#b45309' },
                    { name: 'edenhutchins', clicks: '35,238', rank: 4, color: c.border },
                    { name: 'videyy', clicks: '17,675', rank: 5, color: c.border },
                    { name: 'zid', clicks: '15,612', rank: 6, color: c.border },
                    { name: 'hanifalexander', clicks: '6,563', rank: 7, color: c.border },
                  ].map((user, idx) => (
                    <div key={idx} style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx === 6 ? 'none' : `1px solid ${c.border}` }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${user.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                            {user.name[0].toUpperCase()}
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-4px',
                              right: '-4px',
                              background: user.color,
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000',
                              fontWeight: 'bold',
                            }}
                          >
                            {user.rank}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: '10px', color: c.textMuted }}>{user.rank <= 3 ? 'ELITE MEMBER' : 'ACTIVE MEMBER'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800 }}>{user.clicks}</div>
                        <div style={{ fontSize: '9px', color: c.textMuted }}>CLICKS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer style={{ textAlign: 'center', padding: '32px', color: c.textMuted, fontSize: '12px' }}>
          © 2026 <span style={{ color: c.primary, fontWeight: 700 }}>SHORTTEN.NET</span> · All rights reserved.
        </footer>
      </main>
    </div>
  );
}
