'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

export default function ShortlinkStats({ data }) {
  const { dark } = useTheme();
  const [showOg, setShowOg] = useState(false);

  const clr = {
    card: dark ? '#1e293b' : 'white',
    cardBorder: dark ? '#334155' : '#e2e8f0',
    label: dark ? '#64748b' : '#94a3b8',
    text: dark ? '#f1f5f9' : '#1e293b',
    muted: dark ? '#475569' : '#6b7280',
    link: '#4f46e5',
    clicksBg: dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
    clicksClr: '#10b981',
    iconBtn: dark ? '#1e293b' : '#f8fafc',
    iconBtnBorder: dark ? '#334155' : '#e2e8f0',
    ogPanel: dark ? '#0f172a' : '#f8faff',
    ogPanelBorder: dark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span style={{ fontSize: '16px', fontWeight: 700, color: clr.text }}>Statistical Results</span>
      </div>

      {/* Card */}
      <div style={{ background: clr.card, border: `1px solid ${clr.cardBorder}`, borderRadius: '14px', padding: '24px', position: 'relative' }}>
        {/* Clicks Badge */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', background: clr.clicksBg, borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: clr.clicksClr }}>{(data.clicks ?? 0).toLocaleString()}</div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: clr.clicksClr, letterSpacing: '1px' }}>CLICKS</div>
        </div>

        {/* URL */}
        <div style={{ marginBottom: '16px', paddingRight: '100px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: clr.label, letterSpacing: '1px', marginBottom: '6px' }}>URL :</div>
          <a href={data.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', fontWeight: 600, color: clr.link, textDecoration: 'none', wordBreak: 'break-all' }}>
            {data.shortUrl}
          </a>
        </div>

        {/* Original Destination */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: clr.label, letterSpacing: '1px', marginBottom: '6px' }}>ORIGINAL DESTINATION :</div>
          <div style={{ fontSize: '14px', color: clr.muted, wordBreak: 'break-all' }}>{data.originalUrl}</div>
        </div>

        {/* ✅ OG Panel — tampil saat info button diklik */}
        {showOg && (
          <div
            style={{
              marginBottom: '16px',
              padding: '14px 16px',
              background: clr.ogPanel,
              border: `1px solid ${clr.ogPanelBorder}`,
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* OG Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: clr.label, letterSpacing: '1px', whiteSpace: 'nowrap', paddingTop: '1px' }}>OG TITLE:</span>
              <span style={{ fontSize: '13px', color: data.ogTitle ? clr.text : clr.muted, fontStyle: data.ogTitle ? 'normal' : 'italic' }}>{data.ogTitle || 'No title set'}</span>
            </div>

            {/* OG Image */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: clr.label, letterSpacing: '1px', whiteSpace: 'nowrap', paddingTop: '1px' }}>OG IMAGE:</span>
              {data.ogImageUrl ? (
                <img
                  src={data.ogImageUrl}
                  alt="OG"
                  style={{ maxWidth: '120px', maxHeight: '70px', borderRadius: '6px', objectFit: 'cover', border: `1px solid ${clr.cardBorder}` }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span style={{ fontSize: '13px', color: clr.muted, fontStyle: 'italic' }}>No image set</span>
              )}
            </div>
          </div>
        )}

        {/* Footer Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${clr.cardBorder}` }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: clr.label, letterSpacing: '1px', marginBottom: '4px' }}>ADDED ON</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: clr.text }}>{formatDate(data.createdAt)}</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* ✅ Info Button — toggle OG panel */}
            <button
              onClick={() => setShowOg(!showOg)}
              title="OG Info"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: `1px solid ${showOg ? '#4f46e5' : clr.iconBtnBorder}`,
                background: showOg ? '#4f46e5' : clr.iconBtn,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={showOg ? '#fff' : '#4f46e5'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </button>

            {/* ✅ Copy Button — copy shortUrl */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.shortUrl);
                toast.success('Link disalin!');
              }}
              title="Copy link"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: `1px solid ${clr.iconBtnBorder}`,
                background: clr.iconBtn,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
