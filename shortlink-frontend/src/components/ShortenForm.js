'use client';
import { useState } from 'react';
import ResultTable from './ResultTable';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { IconGlobe, IconLink, IconSearch, IconWand, IconChart, IconSettings, IconEye, IconChevronDown } from './Icons';

const DOMAINS = ['short.ly', 'lnk.id', 'go.io', 'vidz.site'];

export default function ShortenForm() {
  const { dark } = useTheme();

  const [mainTab, setMainTab] = useState('generate');
  const [mode, setMode] = useState('single');
  const [url, setUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [ogTitle, setOgTitle] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const bulkCount = bulkUrls.split('\n').filter((l) => l.trim()).length;

  // ── Dynamic colors ──────────────────────────────────────────────
  const clr = {
    card: dark ? '#1e293b' : 'white',
    cardBorder: dark ? '#334155' : '#e5e7eb',
    tabBar: dark ? '#0f172a' : '#f3f4f6',
    tabActiveBg: dark ? '#1e293b' : 'white',
    tabActiveClr: dark ? '#818cf8' : '#4338ca',
    tabInactiveClr: dark ? '#475569' : '#6b7280',
    tabActiveShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.1)',
    body: dark ? '#1e293b' : 'white',
    label: dark ? '#cbd5e1' : '#374151',
    input: dark ? '#0f172a' : 'white',
    inputBorder: dark ? '#334155' : '#d1d5db',
    inputColor: dark ? '#f1f5f9' : '#111827',
    placeholder: dark ? '#475569' : '#9ca3af',
    iconStroke: dark ? '#475569' : '#9ca3af',
    accordion: dark ? '#0f172a' : '#f9fafb',
    accordionBorder: dark ? '#334155' : '#e5e7eb',
    accordionBtnClr: dark ? '#cbd5e1' : '#374151',
    accordionBody: dark ? '#1e293b' : 'white',
    modeBtnOff: dark ? '#1e293b' : '#f1f5f9',
    modeBtnOffClr: dark ? '#94a3b8' : '#64748b',
    modeBtnOffBorder: dark ? '#334155' : 'transparent',
    footer: dark ? '#0f172a' : '#f9fafb',
    footerBorder: dark ? '#1e293b' : '#e5e7eb',
    footerClr: dark ? '#475569' : '#9ca3af',
    footerStrong: dark ? '#e2e8f0' : '#374151',
    outlineBtn: dark ? '#1e293b' : 'white',
    outlineBtnBorder: dark ? '#334155' : '#d1d5db',
    outlineBtnClr: dark ? '#e2e8f0' : '#374151',
    muted: dark ? '#64748b' : '#6b7280',
  };

  const s = {
    card: { background: clr.card, borderRadius: '16px', boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${clr.cardBorder}`, overflow: 'hidden' },
    tabBar: { display: 'flex', padding: '6px', background: clr.tabBar, gap: '4px' },
    tabActive: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '10px',
      background: clr.tabActiveBg,
      color: clr.tabActiveClr,
      fontWeight: 700,
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: clr.tabActiveShadow,
      transition: 'all 0.15s',
    },
    tabInactive: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '10px',
      background: 'transparent',
      color: clr.tabInactiveClr,
      fontWeight: 500,
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.15s',
    },
    body: { padding: '32px', background: clr.body },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: clr.label, marginBottom: '6px' },
    fieldGroup: { marginBottom: '18px' },
    inputWrap: { position: 'relative' },
    iconLeft: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' },
    iconRight: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' },
    input: {
      width: '100%',
      border: `1px solid ${clr.inputBorder}`,
      borderRadius: '8px',
      padding: '10px 12px 10px 38px',
      fontSize: '14px',
      outline: 'none',
      color: clr.inputColor,
      background: clr.input,
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'border-color 0.15s',
    },
    textarea: {
      width: '100%',
      border: `1px solid ${clr.inputBorder}`,
      borderRadius: '8px',
      padding: '10px 12px 10px 38px',
      fontSize: '14px',
      outline: 'none',
      color: clr.inputColor,
      background: clr.input,
      boxSizing: 'border-box',
      resize: 'vertical',
      minHeight: '130px',
      fontFamily: 'inherit',
    },
    select: {
      width: '100%',
      border: `1px solid ${clr.inputBorder}`,
      borderRadius: '8px',
      padding: '10px 38px 10px 38px',
      fontSize: '14px',
      outline: 'none',
      color: clr.inputColor,
      background: clr.input,
      boxSizing: 'border-box',
      appearance: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
    },
    accordion: { border: `1px solid ${clr.accordionBorder}`, borderRadius: '8px', background: clr.accordion, marginBottom: '20px', overflow: 'hidden' },
    accordionBtn: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '11px 16px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      color: clr.accordionBtnClr,
      gap: '8px',
    },
    accordionBody: { padding: '16px', borderTop: `1px solid ${clr.accordionBorder}`, background: clr.accordionBody, display: 'flex', flexDirection: 'column', gap: '14px' },
    submitBtn: {
      width: '100%',
      padding: '13px',
      borderRadius: '10px',
      border: 'none',
      backgroundImage: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
      color: 'white',
      fontWeight: 700,
      fontSize: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'opacity 0.15s',
    },
    outlineBtn: {
      width: '100%',
      padding: '11px',
      borderRadius: '10px',
      border: `1px solid ${clr.outlineBtnBorder}`,
      background: clr.outlineBtn,
      color: clr.outlineBtnClr,
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    modeSwitch: { display: 'flex', gap: '6px', marginBottom: '20px' },
    modeBtnOn: { padding: '6px 18px', borderRadius: '8px', background: '#4f46e5', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' },
    modeBtnOff: { padding: '6px 18px', borderRadius: '8px', background: clr.modeBtnOff, color: clr.modeBtnOffClr, fontWeight: 600, fontSize: '13px', border: `1px solid ${clr.modeBtnOffBorder}`, cursor: 'pointer' },
    footer: { padding: '13px 24px', background: clr.footer, borderTop: `1px solid ${clr.footerBorder}`, textAlign: 'center', fontSize: '12px', color: clr.footerClr },
  };

  // Icon dengan warna dinamis
  const iconProps = { stroke: clr.iconStroke };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (mode === 'single') {
      if (!url) {
        toast.error('URL tidak boleh kosong!');
        setLoading(false);
        return;
      }
      const code = Math.random().toString(36).substring(2, 8);
      setResults([{ original: url, short: `https://${domain}/${code}` }]);
    } else {
      const lines = bulkUrls
        .split('\n')
        .filter((l) => l.trim())
        .slice(0, 100);
      if (!lines.length) {
        toast.error('Masukkan minimal 1 URL!');
        setLoading(false);
        return;
      }
      setResults(lines.map((line) => ({ original: line.trim(), short: `https://${domain}/${Math.random().toString(36).substring(2, 8)}` })));
    }
    toast.success('Shortlink berhasil dibuat!');
    setLoading(false);
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div style={s.card}>
        {/* Tabs */}
        <div style={s.tabBar}>
          <button style={mainTab === 'generate' ? s.tabActive : s.tabInactive} onClick={() => setMainTab('generate')}>
            <IconWand /> Generate Link
          </button>
          <button style={mainTab === 'stats' ? s.tabActive : s.tabInactive} onClick={() => setMainTab('stats')}>
            <IconChart /> Check Statistics
          </button>
        </div>

        <div style={s.body}>
          {mainTab === 'generate' ? (
            <form onSubmit={handleSubmit}>
              {/* Single / Bulk */}
              <div style={s.modeSwitch}>
                <button type="button" style={mode === 'single' ? s.modeBtnOn : s.modeBtnOff} onClick={() => setMode('single')}>
                  Single URL
                </button>
                <button type="button" style={mode === 'bulk' ? s.modeBtnOn : s.modeBtnOff} onClick={() => setMode('bulk')}>
                  Bulk URL
                </button>
              </div>

              {/* Domain */}
              <div style={s.fieldGroup}>
                <label style={s.label}>Select Domain</label>
                <div style={s.inputWrap}>
                  <span style={s.iconLeft}>
                    <IconGlobe stroke={clr.iconStroke} />
                  </span>
                  <select style={s.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <span style={s.iconRight}>
                    <IconChevronDown stroke={clr.iconStroke} />
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div style={s.fieldGroup}>
                {mode === 'single' ? (
                  <>
                    <label style={s.label}>Paste Your Long URL</label>
                    <div style={s.inputWrap}>
                      <span style={s.iconLeft}>
                        <IconLink stroke={clr.iconStroke} />
                      </span>
                      <input type="url" style={s.input} placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div>
                  </>
                ) : (
                  <>
                    <label style={s.label}>Paste URLs (1 per baris, maks 100)</label>
                    <div style={s.inputWrap}>
                      <span style={{ ...s.iconLeft, top: '14px', transform: 'none' }}>
                        <IconLink stroke={clr.iconStroke} />
                      </span>
                      <textarea style={s.textarea} placeholder={'https://example1.com\nhttps://example2.com\nhttps://example3.com'} value={bulkUrls} onChange={(e) => setBulkUrls(e.target.value)} />
                    </div>
                    {bulkCount > 0 && <p style={{ fontSize: '12px', color: clr.muted, marginTop: '6px' }}>{bulkCount} URL terdeteksi</p>}
                  </>
                )}
              </div>

              {/* Additional Options */}
              {mode === 'single' && (
                <div style={s.accordion}>
                  <button type="button" style={s.accordionBtn} onClick={() => setShowOptions(!showOptions)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconSettings stroke={clr.iconStroke} /> Additional Options (OpenGraph)
                    </span>
                    <span style={{ display: 'flex', transition: 'transform 0.2s', transform: showOptions ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <IconChevronDown stroke={clr.iconStroke} />
                    </span>
                  </button>
                  {showOptions && (
                    <div style={s.accordionBody}>
                      <div>
                        <label style={s.label}>OpenGraph Title</label>
                        <input type="text" style={{ ...s.input, paddingLeft: '12px' }} placeholder="Custom link preview title" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} />
                      </div>
                      <div>
                        <label style={s.label}>OpenGraph Image URL</label>
                        <input type="url" style={{ ...s.input, paddingLeft: '12px' }} placeholder="https://..." value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} />
                      </div>
                      <div>
                        <label style={s.label}>Or Upload Image</label>
                        <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" style={{ fontSize: '13px', color: clr.muted, cursor: 'pointer' }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
                <IconWand stroke="white" />
                {loading ? 'Creating...' : mode === 'bulk' ? `Create ${bulkCount || ''} Shortlink${bulkCount !== 1 ? 's' : ''} Now` : 'Create Shortlink Now'}
              </button>
            </form>
          ) : (
            <form>
              <div style={s.fieldGroup}>
                <label style={s.label}>Enter Shortlink or Code</label>
                <div style={s.inputWrap}>
                  <span style={s.iconLeft}>
                    <IconSearch stroke={clr.iconStroke} />
                  </span>
                  <input type="text" style={s.input} placeholder="https://short.ly/xxxxxxx" />
                </div>
              </div>
              <button type="submit" style={s.outlineBtn}>
                <IconEye stroke={clr.outlineBtnClr} /> View Statistics
              </button>
            </form>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <ResultTable results={results} />
            </div>
          )}
        </div>

        <div style={s.footer}>
          By continuing, you agree to our <strong style={{ color: clr.footerStrong }}>Link Management Policy</strong> and{' '}
          <a href="/terms" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
            Terms Of Use
          </a>
          .
        </div>
      </div>
    </div>
  );
}
