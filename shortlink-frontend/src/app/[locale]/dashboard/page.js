'use client';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ShortenForm from '@/components/ShortenForm';
import { useTheme } from '@/context/ThemeContext';

// ─── Colour palette (dynamic) ────────────────────────────────────────────────
function getColors(dark) {
  return dark
    ? {
        bg: '#090e17',
        sidebar: '#0f1523',
        card: '#131b2b',
        border: '#1e293b',
        text: '#f8fafc',
        muted: '#94a3b8',
        primary: '#6366f1',
        primaryBg: 'rgba(99,102,241,0.12)',
        green: '#10b981',
        greenBg: 'rgba(16,185,129,0.10)',
        purple: '#a855f7',
        purpleBg: 'rgba(168,85,247,0.10)',
        gold: '#f59e0b',
        goldBg: 'rgba(245,158,11,0.10)',
        blue: '#3b82f6',
        blueBg: 'rgba(59,130,246,0.10)',
        headerBg: 'rgba(15,21,35,0.85)',
      }
    : {
        bg: '#f4f6fb',
        sidebar: '#ffffff',
        card: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',
        muted: '#64748b',
        primary: '#6366f1',
        primaryBg: 'rgba(99,102,241,0.08)',
        green: '#10b981',
        greenBg: 'rgba(16,185,129,0.08)',
        purple: '#a855f7',
        purpleBg: 'rgba(168,85,247,0.08)',
        gold: '#f59e0b',
        goldBg: 'rgba(245,158,11,0.08)',
        blue: '#3b82f6',
        blueBg: 'rgba(59,130,246,0.08)',
        headerBg: 'rgba(255,255,255,0.85)',
      };
}

const RANK = {
  1: { ring: 'linear-gradient(135deg,#FDE047,#F59E0B)', badge: '#f59e0b', label: 'Top Contributor' },
  2: { ring: 'linear-gradient(135deg,#E2E8F0,#94A3B8)', badge: '#94a3b8', label: 'Elite Member' },
  3: { ring: 'linear-gradient(135deg,#FDBA74,#EA580C)', badge: '#ea580c', label: 'Elite Member' },
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'logs', label: 'Logs Today', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'links', label: 'My Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { id: 'create', label: 'Create Link', icon: 'M12 4v16m8-8H4' },
  {
    id: 'stats',
    label: 'Statistics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

function StatCard({ label, value, iconSvg, color, bg, C }) {
  return (
    <div
      className="stat-card"
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: `0 4px 20px ${C.bg}`, transition: 'transform 0.3s ease' }}
    >
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: `radial-gradient(circle, ${bg} 0%, transparent 70%)`, opacity: 0.8 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${bg}` }}>{iconSvg}</div>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 900, color: C.text, letterSpacing: '-1px' }}>{value}</div>
    </div>
  );
}

export default function UserDashboard() {
  const { dark, toggle } = useTheme();
  const C = getColors(dark);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [data, setData] = useState(null);
  const [leaderboard, setLB] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setTab] = useState('overview');
  const [sidebarOpen, setSidebar] = useState(false);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(null);
  const [openOgMap, setOpenOgMap] = useState({});
  const ROWS = 10;

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const tok = localStorage.getItem('token');
    if (stored && tok) {
      setUser(JSON.parse(stored));
      setToken(tok);
    } else window.location.href = '/';
  }, []);

  // ── Fetch Dashboard + Leaderboard ─────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    Promise.all([fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()), fetch('/api/leaderboard').then((r) => r.json())])
      .then(([dash, lb]) => {
        setData(dash);
        setLB(lb);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Gagal memuat dashboard');
        setLoading(false);
      });
  }, [token]);

  // ── Fetch Logs Today ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'logs' || !token || !data) return;
    const linkCodes = (data.recentLinks || []).map((l) => l.code);
    if (!linkCodes.length) return;

    const todayISO = new Date().toISOString().slice(0, 10);
    const todayLogs = (data.recentLinks || []).filter((l) => {
      const d = new Date(l.createdAt).toISOString().slice(0, 10);
      return d === todayISO;
    });
    setLogs(todayLogs);
  }, [activeTab, token, data]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const copyLink = (url, idx) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(idx);
    toast.success('Link disalin!');
    setTimeout(() => setCopied(null), 2000);
  };

  const fmt = (d) => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  // ── Pagination helpers ────────────────────────────────────────────────────
  const allLinks = data?.recentLinks || [];
  const totalPages = Math.ceil(allLinks.length / ROWS) || 1;
  const pagedLinks = allLinks.slice((page - 1) * ROWS, page * ROWS);
  const clicksToday = data?.clicksToday ?? 0;
  const totalClicks = data?.totalClicks ?? 0;
  const totalLinks = data?.totalLinks ?? 0;
  const recentCount = allLinks.slice(0, 5).length;
  const clickHistory = data?.clickHistory || [];

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, flexDirection: 'column', gap: '20px' }}>
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
          <div style={{ position: 'absolute', inset: 0, border: `4px solid ${C.border}`, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: `4px solid ${C.primary}`, borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        </div>
        <p style={{ color: C.muted, fontWeight: 600, letterSpacing: '0.5px' }}>Loading workspace...</p>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: `linear-gradient(135deg, ${C.primary}, ${C.purple})`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 15px ${C.primaryBg}`,
            }}
          >
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 900, color: C.text, letterSpacing: '-0.5px' }}>
            SHORT<span style={{ color: C.primary }}>LY</span>
          </span>
        </div>
        <button onClick={() => setSidebar(false)} className="sb-close" style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '20px', display: 'none' }}>
          ✕
        </button>
      </div>

      {/* User pill */}
      <div style={{ margin: '0 16px 20px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '14px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: `0 4px 20px ${C.bg}` }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.primary}, ${C.purple})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '16px',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user?.role === 'ADMIN' ? C.gold : C.green }} />
            {user?.role === 'ADMIN' ? 'Administrator' : 'Active Member'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setTab(tab.id);
              setSidebar(false);
              setPage(1);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '6px',
              textAlign: 'left',
              transition: 'all 0.2s',
              background: activeTab === tab.id ? C.primary : 'transparent',
              color: activeTab === tab.id ? '#fff' : C.muted,
              boxShadow: activeTab === tab.id ? `0 4px 15px ${C.primaryBg}` : 'none',
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '20px 16px', borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: C.card,
            color: C.text,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            transition: 'all 0.2s',
            border: `1px solid ${C.border}`,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = C.redBg;
            e.currentTarget.style.color = C.red;
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = C.card;
            e.currentTarget.style.color = C.text;
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  // ── Tab: Leaderboard ──────────────────────────────────────────────────────
  const TabLeaderboard = () => (
    <div style={{ background: C.card, borderRadius: '24px', border: `1px solid ${C.border}`, padding: '32px', boxShadow: `0 10px 40px -10px ${C.bg}` }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 15l-3-3m0 0l3-3m-3 3h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: C.text }}>Leaderboard</h3>
          <p style={{ margin: 0, fontSize: '13px', color: C.muted, fontWeight: 600 }}>Top performers this month</p>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: C.muted }}>
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" style={{ margin: '0 auto 16px' }} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontWeight: 600, fontSize: '13px' }}>No data available yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leaderboard.map((u, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            const rs = RANK[rank] || { ring: C.border, badge: C.muted, label: 'Active Member' };
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.user || 'U')}&background=0f172a&color=fff&bold=true`;
            const isMe = u.user === user?.name;

            return (
              <div
                key={u.user || idx}
                style={{
                  background: isMe ? C.primaryBg : C.bg,
                  border: `1px solid ${isMe ? C.primary : C.border}`,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    style={{
                      width: isTop3 ? '48px' : '40px',
                      height: isTop3 ? '48px' : '40px',
                      borderRadius: '50%',
                      background: isTop3 ? rs.ring : C.border,
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isTop3 ? `0 4px 15px ${rs.badge}44` : 'none',
                    }}
                  >
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${isMe ? C.primaryBg : C.bg}` }}>
                      <img src={avatarUrl} alt={u.user} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isTop3 ? rs.badge : C.muted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 900,
                      color: rank <= 2 ? '#000' : '#fff',
                      border: `2px solid ${isMe ? C.primaryBg : C.bg}`,
                    }}
                  >
                    {rank}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.user}
                    {isMe && <span style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '100px', background: C.primary, color: '#fff', letterSpacing: '1px' }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: isTop3 ? rs.badge : C.muted, marginTop: '4px', letterSpacing: '0.5px' }}>{rs.label}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: C.text }}>{u.clicks.toLocaleString()}</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: C.muted, letterSpacing: '1px', marginTop: '2px' }}>CLICKS</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Links Table ───────────────────────────────────────────────────────────
  const LinksTable = ({ links, showPagination = false }) => (
    <div style={{ background: C.card, borderRadius: '24px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: `0 10px 40px -10px ${C.bg}` }}>
      {links.length === 0 ? (
        <div style={{ padding: '80px', textAlign: 'center', color: C.muted }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: C.text }}>No links yet</h4>
          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>Create your first short link to see it here.</p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  <th style={{ width: '40px' }}></th>
                  {['SHORT URL', 'DESTINATION', 'CLICKS', 'CREATED', 'ACTION'].map((h) => (
                    <th key={h} style={{ padding: '18px 24px', fontSize: '11px', fontWeight: 800, color: C.muted, letterSpacing: '1px', textAlign: h === 'CLICKS' ? 'center' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <React.Fragment key={link.code}>
                    <tr style={{ borderTop: `1px solid ${C.border}`, background: openOgMap[link.code] ? C.primaryBg : 'transparent', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 8px 16px 24px', textAlign: 'center' }}>
                        <button
                          onClick={() => setOpenOgMap((p) => ({ ...p, [link.code]: !p[link.code] }))}
                          style={{
                            background: openOgMap[link.code] ? C.primary : C.bg,
                            border: `1px solid ${openOgMap[link.code] ? C.primary : C.border}`,
                            borderRadius: '6px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: openOgMap[link.code] ? '#fff' : C.muted,
                            transition: 'all 0.2s',
                          }}
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openOgMap[link.code] ? 'rotate(90deg)' : 'rotate(0)' }}>
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </td>
                      <td style={{ padding: '16px 24px', maxWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: C.primary, fontWeight: 700, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {link.shortUrl}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', maxWidth: '250px', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }} title={link.originalUrl}>
                        {link.originalUrl}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{ background: C.bg, padding: '6px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontWeight: 800, fontSize: '13px', color: C.text }}>{(link.clicks ?? 0).toLocaleString()}</span>
                      </td>
                      <td style={{ padding: '16px 24px', color: C.muted, whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 600 }}>{fmt(link.createdAt)}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => copyLink(link.shortUrl, i)}
                          title="Copy"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: `1px solid ${copied === i ? C.green : C.border}`,
                            background: copied === i ? C.greenBg : C.bg,
                            color: copied === i ? C.green : C.text,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            boxShadow: copied === i ? `0 4px 12px ${C.greenBg}` : 'none',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {copied === i ? (
                              <polyline points="20 6 9 17 4 12" />
                            ) : (
                              <>
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </>
                            )}
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {openOgMap[link.code] && (
                      <tr style={{ background: C.primaryBg }}>
                        <td colSpan={6} style={{ padding: '20px 24px 32px 64px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <svg width="16" height="16" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: C.primary }}>OpenGraph Metadata</div>
                          </div>
                          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', background: C.card, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 800, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>OG Title</div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: link.ogTitle ? C.text : C.muted, fontStyle: link.ogTitle ? 'normal' : 'italic' }}>{link.ogTitle || 'No title set'}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 800, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>OG Image</div>
                              {link.ogImageUrl ? (
                                <a
                                  href={link.ogImageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: C.primary, fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', background: C.primaryBg, padding: '4px 12px', borderRadius: '6px' }}
                                >
                                  View Image{' '}
                                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </a>
                              ) : (
                                <span style={{ fontSize: '14px', fontWeight: 600, color: C.muted, fontStyle: 'italic' }}>No image set</span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && allLinks.length > ROWS && (
            <div style={{ padding: '20px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: C.muted }}>
                Showing{' '}
                <strong style={{ color: C.text }}>
                  {(page - 1) * ROWS + 1}–{Math.min(page * ROWS, allLinks.length)}
                </strong>{' '}
                of {allLinks.length}
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { d: 'M15 18l-6-6 6-6', cond: page > 1, action: () => setPage((p) => p - 1) },
                  { d: 'M9 18l6-6-6-6', cond: page < totalPages, action: () => setPage((p) => p + 1) },
                ].map((btn, bi) => (
                  <button
                    key={bi}
                    onClick={btn.action}
                    disabled={!btn.cond}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      border: `1px solid ${C.border}`,
                      background: C.card,
                      color: C.text,
                      cursor: btn.cond ? 'pointer' : 'not-allowed',
                      opacity: btn.cond ? 1 : 0.4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: btn.cond ? `0 4px 10px ${C.bg}` : 'none',
                    }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={btn.d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ── Tab: Overview ─────────────────────────────────────────────────────────
  const TabOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '32px', alignItems: 'start' }} className="overview-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Hero Banner */}
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(37,99,235,0.4)' }}>
          <div style={{ position: 'absolute', right: '-40px', bottom: '-60px', opacity: 0.15 }}>
            <svg width="280" height="280" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" />
              <ellipse cx="60" cy="60" rx="50" ry="20" />
              <ellipse cx="60" cy="60" rx="50" ry="20" transform="rotate(90 60 60)" />
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px' }}>YOUR CLICKS TODAY</p>
            <p style={{ fontSize: '72px', fontWeight: 900, margin: '0 0 36px', lineHeight: 1, letterSpacing: '-2px' }}>{clicksToday.toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 800, color: '#fde047', margin: '0 0 6px', letterSpacing: '1px' }}>TOTAL CLICKS (ALL TIME)</p>
                <p style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>{totalClicks.toLocaleString()}</p>
              </div>
              <div style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '48px' }}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', margin: '0 0 6px', letterSpacing: '1px' }}>LINKS MANAGED</p>
                <p style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>{totalLinks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <StatCard
            label="Clicks Today"
            value={clicksToday.toLocaleString()}
            iconSvg={
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M23 6l-9.5 9.5-5-5L1 18" />
                <path d="M17 6h6v6" />
              </svg>
            }
            color={C.blue}
            bg={C.blueBg}
            C={C}
          />
          <StatCard
            label="Total Clicks"
            value={totalClicks.toLocaleString()}
            iconSvg={
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 12V7H5a2 2 0 012 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            }
            color={C.green}
            bg={C.greenBg}
            C={C}
          />
          <StatCard
            label="Total Links"
            value={totalLinks}
            iconSvg={
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            }
            color={C.purple}
            bg={C.purpleBg}
            C={C}
          />
          <StatCard
            label="New Links"
            value={recentCount}
            iconSvg={
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            }
            color={C.gold}
            bg={C.goldBg}
            C={C}
          />
        </div>

        {/* Recent Links */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: C.text }}>Recent Activity</h3>
                <p style={{ margin: 0, fontSize: '12px', color: C.muted, fontWeight: 600 }}>Your latest created links</p>
              </div>
            </div>
            <button
              onClick={() => setTab('links')}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: C.card,
                border: `1px solid ${C.border}`,
                fontSize: '13px',
                fontWeight: 700,
                color: C.text,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: `0 4px 10px ${C.bg}`,
              }}
            >
              View All →
            </button>
          </div>
          <LinksTable links={allLinks.slice(0, 5)} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div>
        <TabLeaderboard />
      </div>
    </div>
  );

  // ── Tab: Logs Today ───────────────────────────────────────────────────────
  const TabLogs = () => {
    const today = new Date().toISOString().slice(0, 10);
    const todayLinks = allLinks.filter((l) => new Date(l.createdAt).toISOString().slice(0, 10) === today);
    return (
      <div style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: C.text, letterSpacing: '-0.5px' }}>Logs Today</h3>
            <p style={{ margin: 0, fontSize: '14px', color: C.muted, fontWeight: 500 }}>Your link activities for today ({new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })})</p>
          </div>
        </div>

        {todayLinks.length === 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '24px', padding: '80px 20px', textAlign: 'center', color: C.muted, boxShadow: `0 10px 30px -10px ${C.bg}` }}>
            <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" style={{ margin: '0 auto 20px' }} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p style={{ fontWeight: 600, fontSize: '16px', color: C.text }}>Belum ada aktivitas hari ini</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Buat link baru untuk melihat log di sini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {todayLinks.map((link, i) => (
              <div
                key={link.code}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  flexWrap: 'wrap',
                  boxShadow: `0 4px 20px ${C.bg}`,
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ overflow: 'hidden', flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: C.primary, fontWeight: 800, fontSize: '16px', textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {link.shortUrl}
                    </a>
                  </div>
                  <div style={{ fontSize: '13px', color: C.muted, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.originalUrl}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center', background: C.bg, padding: '10px 20px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontWeight: 900, fontSize: '20px', color: C.text }}>{link.clicks}</div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: C.muted, letterSpacing: '1px' }}>CLICKS</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: C.text, fontWeight: 700, marginBottom: '4px' }}>{fmt(link.createdAt).split(' ')[1]}</div>
                    <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>TIME</div>
                  </div>
                  <button
                    onClick={() => copyLink(link.shortUrl, i)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${copied === i ? C.green : C.border}`,
                      background: copied === i ? C.greenBg : C.bg,
                      color: copied === i ? C.green : C.text,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: copied === i ? `0 4px 12px ${C.greenBg}` : 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {copied === i ? (
                        <polyline points="20 6 9 17 4 12" />
                      ) : (
                        <>
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </>
                      )}
                    </svg>
                    {copied === i ? 'Disalin' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Tab: My Links ─────────────────────────────────────────────────────────
  const TabLinks = () => (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: C.text, letterSpacing: '-0.5px' }}>My Links</h3>
          <p style={{ margin: 0, fontSize: '14px', color: C.muted, fontWeight: 500 }}>Manage all the links you've ever created ({allLinks.length} total)</p>
        </div>
      </div>
      <LinksTable links={pagedLinks} showPagination />
    </div>
  );

  // ── Tab: Create Link ──────────────────────────────────────────────────────
  const TabCreate = () => (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: C.text, letterSpacing: '-0.5px' }}>Create Your Link</h3>
            <p style={{ margin: 0, fontSize: '14px', color: C.muted, fontWeight: 500 }}>Shorten long URLs into elegant and memorable links.</p>
          </div>
        </div>
        <div style={{ background: C.card, padding: '40px', borderRadius: '24px', border: `1px solid ${C.border}`, boxShadow: `0 20px 40px -10px ${C.bg}` }}>
          <ShortenForm />
        </div>
      </div>
    </div>
  );

  // ── Tab: Statistics ───────────────────────────────────────────────────────
  const TabStats = () => {
    const topLinks = [...allLinks].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    const totalC = allLinks.reduce((s, l) => s + (l.clicks || 0), 0);
    const chartData = [...clickHistory].reverse();
    const maxChartClicks = Math.max(...chartData.map((d) => d.clicks), 1);
    const points = chartData
      .map((d, i) => {
        const x = (i / 6) * 500;
        const y = 150 - (d.clicks / maxChartClicks) * 120 - 15;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: C.text, letterSpacing: '-0.5px' }}>Statistics</h3>
            <p style={{ margin: 0, fontSize: '14px', color: C.muted, fontWeight: 500 }}>Summary of your link performance and growth metrics.</p>
          </div>
        </div>

        {/* ── Line Chart for 7 Days Clicks ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '24px', padding: '32px', overflow: 'hidden', boxShadow: `0 10px 40px -10px ${C.bg}` }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: C.blueBg, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: C.text }}>Traffic Overview (7 Days)</h4>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '260px' }}>
            <div style={{ position: 'absolute', left: 0, top: '15px', color: C.muted, fontSize: '11px', fontWeight: 700 }}>{maxChartClicks}</div>
            <div style={{ position: 'absolute', left: 0, bottom: '40px', color: C.muted, fontSize: '11px', fontWeight: 700 }}>0</div>

            <div style={{ marginLeft: '40px', height: '220px', width: 'calc(100% - 40px)' }}>
              <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                <line x1="0" y1="135" x2="500" y2="135" stroke={C.border} strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke={C.border} strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="15" x2="500" y2="15" stroke={C.border} strokeWidth="1.5" strokeDasharray="4 4" />

                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.primary} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={`0,150 ${points} 500,150`} fill="url(#chartGradient)" />
                <polyline points={points} fill="none" stroke={C.primary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                {chartData.map((d, i) => {
                  const x = (i / 6) * 500;
                  const y = 150 - (d.clicks / maxChartClicks) * 120 - 15;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill={C.card} stroke={C.primary} strokeWidth="3" />
                      <circle cx={x} cy={y} r="2" fill={C.primary} />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ marginLeft: '40px', display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ fontSize: '11px', color: C.muted, fontWeight: 700, letterSpacing: '0.5px' }}>
                  {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Small Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <StatCard
            label="Total Clicks"
            value={totalClicks.toLocaleString()}
            iconSvg={
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 12V7H5a2 2 0 012 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            }
            color={C.green}
            bg={C.greenBg}
            C={C}
          />
          <StatCard
            label="Clicks Today"
            value={clicksToday.toLocaleString()}
            iconSvg={
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            color={C.blue}
            bg={C.blueBg}
            C={C}
          />
          <StatCard
            label="Avg / Link"
            value={totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0}
            iconSvg={
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            }
            color={C.purple}
            bg={C.purpleBg}
            C={C}
          />
          <StatCard
            label="Active Links"
            value={allLinks.filter((l) => l.isActive).length}
            iconSvg={
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            color={C.gold}
            bg={C.goldBg}
            C={C}
          />
        </div>

        {/* Top 5 Links Table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: `0 10px 40px -10px ${C.bg}` }}>
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: C.goldBg, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: C.text }}>Top Performing Links</h4>
          </div>

          {topLinks.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: C.muted, fontWeight: 500 }}>Belum ada data analitik.</div>
          ) : (
            <div style={{ padding: '12px 0' }}>
              {topLinks.map((link, i) => {
                const pct = totalC > 0 ? Math.round((link.clicks / totalC) * 100) : 0;
                const isRank1 = i === 0;
                return (
                  <div
                    key={link.code}
                    style={{ padding: '16px 32px', borderBottom: i < topLinks.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', gap: '24px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = C.bg)}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        background: isRank1 ? C.goldBg : C.primaryBg,
                        color: isRank1 ? C.gold : C.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '15px',
                        flexShrink: 0,
                        boxShadow: isRank1 ? `0 0 15px ${C.goldBg}` : 'none',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}>{link.shortUrl}</div>
                      <div style={{ height: '6px', background: C.border, borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: isRank1 ? `linear-gradient(90deg, #f59e0b, #fde047)` : `linear-gradient(90deg, ${C.primary}, ${C.purple})`,
                            borderRadius: '4px',
                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 900, fontSize: '20px', color: C.text }}>{link.clicks.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: isRank1 ? C.gold : C.muted, fontWeight: 800 }}>{pct}% OF TOTAL</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabContent = { overview: <TabOverview />, logs: <TabLogs />, links: <TabLinks />, create: <TabCreate />, stats: <TabStats /> };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter',sans-serif", overflow: 'hidden' }}>
      <Toaster position="top-center" toastOptions={{ style: { background: C.card, color: C.text, border: `1px solid ${C.border}`, fontWeight: 600, fontSize: '14px' } }} />

      {sidebarOpen && <div onClick={() => setSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 40 }} />}

      {/* Sidebar Desktop */}
      <aside style={{ width: '280px', flexShrink: 0, background: C.sidebar, borderRight: `1px solid ${C.border}`, zIndex: 50 }} className="main-sb">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile */}
      <aside
        style={{
          width: '280px',
          background: C.sidebar,
          borderRight: `1px solid ${C.border}`,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'none',
        }}
        className="mob-sb"
      >
        <Sidebar />
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }} className="custom-scrollbar">
        {/* Background ambient glow untuk main area */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '400px',
            background: `radial-gradient(ellipse at top, ${C.primaryBg} 0%, transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Header */}
        <header
          style={{
            padding: '20px 36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${C.border}`,
            background: C.headerBg,
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebar(true)}
              className="ham-btn"
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, cursor: 'pointer', padding: '10px', display: 'none', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div style={{ fontSize: '18px', fontWeight: 800, color: C.text }}>{TABS.find((t) => t.id === activeTab)?.label}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Dark/Light Toggle */}
            <button
              onClick={toggle}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                color: C.text,
                cursor: 'pointer',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: `0 4px 10px ${C.bg}`,
              }}
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setTab('create')}
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '12px',
                background: C.primary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: `0 4px 15px ${C.primaryBg}`,
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Link
            </button>
          </div>
        </header>

        <div style={{ padding: '36px', flex: 1, position: 'relative', zIndex: 1 }}>{tabContent[activeTab]}</div>

        <footer style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: C.muted, borderTop: `1px solid ${C.border}`, fontWeight: 500, position: 'relative', zIndex: 1 }}>
          © 2026 <span style={{ color: C.primary, fontWeight: 800 }}>SHORTTEN.NET</span> · All rights reserved.
        </footer>
      </main>

      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        .custom-scrollbar::-webkit-scrollbar { width:6px }
        .custom-scrollbar::-webkit-scrollbar-track { background:transparent }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:#1e293b; border-radius:10px }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background:#334155 }
        
        .stat-card:hover { transform: translateY(-4px) !important; }

        @media(max-width:1100px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
        @media(max-width:850px) {
          .main-sb { display:none !important }
          .mob-sb { display:flex !important }
          .ham-btn { display:flex !important }
          .sb-close { display:flex !important }
        }
      `}</style>
    </div>
  );
}
