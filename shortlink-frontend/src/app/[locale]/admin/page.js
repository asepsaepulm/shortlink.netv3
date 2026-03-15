'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [logs, setLogs] = useState([]);
  const [usersInfo, setUsersInfo] = useState({ users: [], summary: { active: 0, banned: 0 } });
  const [linksInfo, setLinksInfo] = useState({ links: [], summary: { active: 0, banned: 0 } });
  const [loading, setLoading] = useState(false);

  // Pagination & Filtering state
  const [userSearch, setUserSearch] = useState('');
  const [linkSearch, setLinkSearch] = useState('');

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

  useEffect(() => {
    fetchData();
  }, [activeMenu]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeMenu === 'Logs Today') {
        const res = await fetch('/api/admin/logs');
        const data = await res.json();
        setLogs(data);
      } else if (activeMenu === 'Users List') {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsersInfo(data);
      } else if (activeMenu === 'All Links') {
        const res = await fetch('/api/admin/links');
        const data = await res.json();
        setLinksInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const menuStyle = (menuName) => ({
    width: '100%',
    textAlign: 'left',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: activeMenu === menuName ? c.primary : 'transparent',
    color: activeMenu === menuName ? '#fff' : c.textMuted,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
      {/* LEFT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Blue Hero Card */}
        <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>CLICKS TODAY (GLOBAL)</div>
          <div style={{ fontSize: '48px', fontWeight: 800, margin: '12px 0 32px 0' }}>12.940</div>
          {/* Globe Icon */}
          <div style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.2 }}>
            <svg width="120" height="120" fill="none" stroke="white" strokeWidth="1">
              <circle cx="60" cy="60" r="50" />
              <ellipse cx="60" cy="60" rx="50" ry="20" />
              <ellipse cx="60" cy="60" rx="50" ry="20" transform="rotate(90 60 60)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogsToday = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', color: c.textMuted, letterSpacing: '1px', fontWeight: 700 }}>● LIVE STREAM // LAST 100 LOGS</div>
          <h2 style={{ fontSize: '28px', margin: '4px 0 0 0', fontWeight: 900 }}>RECENT <span style={{ color: c.primary }}>CLICKS</span></h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: c.textMuted, fontWeight: 700 }}>ONLINE</div>
          <div style={{ fontSize: '24px', color: c.green, fontWeight: 800 }}>● 228</div>
        </div>
      </div>

      <div style={{ background: c.card, borderRadius: '12px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ color: c.textMuted, textAlign: 'left', borderBottom: `1px solid ${c.border}` }}>
            <tr>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>TIME</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>URL</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>TARGET</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>COUNTRY</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>DEVICE</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr> : logs.map((log, i) => (
              <tr key={log.id} style={{ borderBottom: `1px solid ${c.border}`, background: i % 2 === 0 ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>
                <td style={{ padding: '16px 20px', color: c.textMuted }}>{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>{log.url}</td>
                <td style={{ padding: '16px 20px', color: c.textMuted }}>{log.target}</td>
                <td style={{ padding: '16px 20px' }}>{log.country === 'Unknown' ? '🌐' : log.country}</td>
                <td style={{ padding: '16px 20px', color: c.primary }}>{log.device === 'Mobile' ? '📱' : log.device === 'Tablet' ? '💊' : '💻'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersList = () => {
    const filteredUsers = usersInfo.users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: c.card, borderRadius: '16px', padding: '24px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: c.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.green }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: c.textMuted, letterSpacing: '1px' }}>ACTIVE</div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>{usersInfo.summary.active}</div>
            </div>
          </div>
          <div style={{ background: c.card, borderRadius: '16px', padding: '24px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.red }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" /></svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: c.textMuted, letterSpacing: '1px' }}>BANNED</div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>{usersInfo.summary.banned}</div>
            </div>
          </div>
        </div>

        <div style={{ background: c.card, padding: '16px', borderRadius: '12px', border: `1px solid ${c.border}`, display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg style={{ position: 'absolute', left: '16px', top: '14px', color: c.textMuted }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input 
              type="text" 
              placeholder="Cari Username, ID, atau Email..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, color: '#fff', fontSize: '14px', outline: 'none' }} 
            />
          </div>
          <select style={{ padding: '14px 20px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, color: '#fff', fontSize: '14px', outline: 'none', minWidth: '200px' }}>
            <option>Newest Registered</option>
          </select>
        </div>

        <div style={{ background: c.card, borderRadius: '12px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ color: c.textMuted, textAlign: 'left', borderBottom: `1px solid ${c.border}`, fontSize: '11px', letterSpacing: '1px' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>USER PROFILE</th>
                <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>SUMMARY</th>
                <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>REGISTERED ON</th>
                <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr> : filteredUsers.map((user, idx) => (
                <tr key={user.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '42px', height: '42px', background: idx % 3 === 0 ? '#f59e0b' : idx % 3 === 1 ? '#8b5cf6' : '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: '#fff' }}>
                        {user.initial}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: c.textMuted, marginTop: '4px' }}>ID: {user.id} • {user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: c.primary }}>{user.totalLinks}</div>
                        <div style={{ fontSize: '9px', color: c.textMuted, fontWeight: 700, marginTop: '2px' }}>LINKS</div>
                      </div>
                      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{user.totalClicks}</div>
                        <div style={{ fontSize: '9px', color: c.textMuted, fontWeight: 700, marginTop: '2px' }}>CLICKS</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                    {user.isActive ? 
                      <span style={{ color: c.green, background: 'transparent', padding: '6px 0', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>ACTIVE</span> : 
                      <span style={{ color: c.red, background: 'transparent', padding: '6px 0', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>BANNED</span>
                    }
                  </td>
                  <td style={{ padding: '20px 24px', color: c.textMuted, fontSize: '12px', fontWeight: 600 }}>{new Date(user.registeredOn).toLocaleString()}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ width: '32px', height: '32px', background: 'rgba(37,99,235,0.15)', border: `1px solid rgba(37,99,235,0.2)`, borderRadius: '6px', color: c.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👁</button>
                      <button style={{ width: '32px', height: '32px', background: 'rgba(245,158,11,0.15)', border: `1px solid rgba(245,158,11,0.2)`, borderRadius: '6px', color: c.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔨</button>
                      <button style={{ width: '32px', height: '32px', background: 'rgba(239,68,68,0.15)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: '6px', color: c.red, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAllLinks = () => {
    const filteredLinks = linksInfo.links.filter(l => l.shortUrl.toLowerCase().includes(linkSearch.toLowerCase()) || l.originalUrl.toLowerCase().includes(linkSearch.toLowerCase()) || l.owner.toLowerCase().includes(linkSearch.toLowerCase()));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: c.card, borderRadius: '16px', padding: '24px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: c.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.green }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: c.textMuted, letterSpacing: '1px' }}>ACTIVE LINKS</div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>{linksInfo.summary.active}</div>
            </div>
          </div>
          <div style={{ background: c.card, borderRadius: '16px', padding: '24px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.red }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: c.textMuted, letterSpacing: '1px' }}>BANNED LINKS</div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>{linksInfo.summary.banned}</div>
            </div>
          </div>
        </div>

        <div style={{ background: c.card, padding: '16px', borderRadius: '12px', border: `1px solid ${c.border}`, display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: '11px', color: c.textMuted, fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>SEARCH</div>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '16px', top: '12px', color: c.textMuted }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input 
                type="text" 
                placeholder="URL, Original, or Owner..." 
                value={linkSearch}
                onChange={(e) => setLinkSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, color: '#fff', fontSize: '14px', outline: 'none' }} 
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: c.textMuted, fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>OWNER</div>
            <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, color: '#fff', fontSize: '14px', outline: 'none' }}>
              <option>All Owners</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: c.textMuted, fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>SORT BY</div>
            <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, color: '#fff', fontSize: '14px', outline: 'none' }}>
              <option>Latest Created</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
            <button style={{ padding: '12px 24px', background: c.primary, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Apply</button>
            <button style={{ padding: '12px 24px', background: c.bg, border: `1px solid ${c.border}`, color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Reset</button>
          </div>
        </div>

        <div style={{ background: c.card, borderRadius: '12px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ color: c.textMuted, textAlign: 'left', borderBottom: `1px solid ${c.border}`, fontSize: '11px', letterSpacing: '1px' }}>
              <tr>
                <th style={{ padding: '16px 24px', width: '40px' }}>#</th>
                <th style={{ padding: '16px 20px', fontWeight: 700 }}>URL</th>
                <th style={{ padding: '16px 20px', fontWeight: 700 }}>TARGET/ORIGINAL</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'center' }}>TOTAL CLICKS</th>
                <th style={{ padding: '16px 20px', fontWeight: 700 }}>OWNER</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '16px 20px', fontWeight: 700 }}>CREATED ON</th>
                <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="8" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr> : filteredLinks.map((link) => (
                <tr key={link.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                  <td style={{ padding: '20px 24px', color: c.primary, cursor: 'pointer' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </td>
                  <td style={{ padding: '20px 20px', fontWeight: 700, color: c.primary }}>{link.shortUrl}</td>
                  <td style={{ padding: '20px 20px', color: c.textMuted, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.originalUrl}</td>
                  <td style={{ padding: '20px 20px', textAlign: 'center' }}>
                    <span style={{ background: c.bg, border: `1px solid ${c.border}`, padding: '4px 12px', borderRadius: '6px', fontWeight: 700, color: '#fff' }}>{link.clicks}</span>
                  </td>
                  <td style={{ padding: '20px 20px', fontWeight: 700, color: c.green }}>{link.owner}</td>
                  <td style={{ padding: '20px 20px', textAlign: 'center' }}>
                    {link.isActive ? 
                      <span style={{ color: c.green, background: c.greenBg, padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' }}>ACTIVE</span> : 
                      <span style={{ color: c.red, background: 'rgba(239, 68, 68, 0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' }}>BANNED</span>
                    }
                  </td>
                  <td style={{ padding: '20px 20px', color: c.textMuted, fontSize: '12px', fontWeight: 600 }}>{new Date(link.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ width: '32px', height: '32px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: '6px', color: c.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                      <button style={{ width: '32px', height: '32px', background: c.bg, border: `1px solid rgba(245,158,11,0.3)`, borderRadius: '6px', color: c.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚫</button>
                      <button style={{ width: '32px', height: '32px', background: c.bg, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '6px', color: c.red, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
          <div style={{ fontSize: '11px', color: c.textMuted, fontWeight: 700, marginBottom: '12px', marginTop: '8px' }}>MAIN CONTROL</div>
          <button onClick={() => setActiveMenu('Overview')} style={menuStyle('Overview')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Overview
          </button>
          <button onClick={() => setActiveMenu('Logs Today')} style={menuStyle('Logs Today')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            Logs Today
          </button>

          <div style={{ fontSize: '11px', color: c.textMuted, fontWeight: 700, marginBottom: '12px', marginTop: '24px' }}>DATA MANAGEMENT</div>
          <button onClick={() => setActiveMenu('Users List')} style={menuStyle('Users List')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            Users List
          </button>
          <button onClick={() => setActiveMenu('All Links')} style={menuStyle('All Links')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            All Links
          </button>
        </nav>

        {/* Server Status Widget */}
        <div style={{ padding: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: c.primary, fontWeight: 700, marginBottom: '8px' }}>
              <div style={{ width: '6px', height: '6px', background: c.primary, borderRadius: '50%' }} /> SERVER STATUS
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>{new Date().toLocaleString()}</div>
            <div style={{ fontSize: '10px', color: c.textMuted, marginTop: '2px' }}>System Operational</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${c.border}` }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeMenu}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '45px', height: '24px', backgroundColor: c.primary, borderRadius: '12px', position: 'relative' }}>
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '3px', top: '3px' }} />
            </div>
            <div style={{ width: '32px', height: '32px', background: c.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>admin ▼</span>
          </div>
        </header>

        <div style={{ padding: '32px' }}>
          {activeMenu === 'Overview' && renderOverview()}
          {activeMenu === 'Logs Today' && renderLogsToday()}
          {activeMenu === 'Users List' && renderUsersList()}
          {activeMenu === 'All Links' && renderAllLinks()}
        </div>
      </main>
    </div>
  );
}
