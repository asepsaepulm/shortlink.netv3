'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ShortlinkResult({ results }) {
  const { dark } = useTheme();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const c = {
    wrap: {
      borderRadius: '14px',
      overflow: 'hidden',
      border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
      background: dark ? '#0f172a' : '#fafafa',
    },
    header: {
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderBottom: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}`,
    },
    dot: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: '#22c55e',
      boxShadow: '0 0 0 3px rgba(34,197,94,0.15)',
    },
    label: {
      fontSize: '12px',
      fontWeight: 700,
      color: dark ? '#4ade80' : '#16a34a',
      letterSpacing: '0.3px',
    },
    body: { padding: '16px' },
    shortRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 14px',
      borderRadius: '10px',
      background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
      border: `1px solid ${dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
      marginBottom: '10px',
    },
    shortUrl: {
      flex: 1,
      fontSize: '14px',
      fontWeight: 700,
      color: '#6366f1',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    iconBtn: (color = '#6366f1', bg = dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)') => ({
      width: '30px',
      height: '30px',
      borderRadius: '8px',
      background: bg,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      flexShrink: 0,
      textDecoration: 'none',
      transition: 'opacity 0.15s',
    }),
    actions: {
      display: 'flex',
      gap: '8px',
      marginBottom: '12px',
    },
    copyBtn: (copied) => ({
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      background: copied ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #4f46e5, #3b82f6)',
      color: 'white',
      fontWeight: 700,
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7px',
      transition: 'all 0.2s',
    }),
    waBtn: {
      padding: '10px 14px',
      borderRadius: '8px',
      background: dark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
      border: `1px solid ${dark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)'}`,
      color: '#22c55e',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    originalWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
      border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
    },
    originalText: {
      fontSize: '12px',
      color: dark ? '#475569' : '#94a3b8',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 1,
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {results.map((r, i) => (
        <div key={i} style={c.wrap}>
          {/* Header */}
          <div style={c.header}>
            <span style={c.dot} />
            <span style={c.label}>Link created</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: dark ? '#334155' : '#cbd5e1', fontWeight: 600 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Body */}
          <div style={c.body}>
            {/* Short URL row */}
            <div style={c.shortRow}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span style={c.shortUrl}>{r.short}</span>

              {/* Open */}
              <a href={r.code ? (typeof window !== 'undefined' ? `${window.location.origin}/${r.code}` : `/${r.code}`) : r.short} target="_blank" rel="noopener noreferrer" style={c.iconBtn()} title="Open">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Actions */}
            <div style={c.actions}>
              {/* Copy */}
              <button onClick={() => handleCopy(r.short, i)} style={c.copyBtn(copiedIndex === i)}>
                {copiedIndex === i ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>

              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${encodeURIComponent(r.short)}`} target="_blank" rel="noopener noreferrer" style={c.waBtn} title="Share via WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>

            {/* Original URL */}
            <div style={c.originalWrap}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={dark ? '#334155' : '#cbd5e1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span style={c.originalText}>{r.original}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
