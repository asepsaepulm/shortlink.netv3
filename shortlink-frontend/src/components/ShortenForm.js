'use client';
import { useState, useRef } from 'react';
import ShortlinkResult from './ShortlinkResult';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { IconGlobe, IconLink, IconSearch, IconWand, IconChart, IconSettings, IconEye, IconChevronDown } from './Icons';

const DOMAINS = ['shortl.site', 'lnk.id', 'go.io', 'vidz.site'];
const PREVIEW_CODE = 'xxxxxxx';

export default function ShortenForm() {
  const { dark } = useTheme();
  const fileInputRef = useRef(null);

  const [mainTab, setMainTab] = useState('generate');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [slug, setSlug] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSlug, setShowSlug] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const sanitizeSlug = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

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
    input: dark ? 'rgba(15, 23, 42, 0.4)' : '#fcfcfd',
    inputBorder: dark ? '#334155' : '#d1d5db',
    inputColor: dark ? '#f1f5f9' : '#111827',
    iconStroke: dark ? '#64748b' : '#9ca3af',
    accordion: dark ? '#0f172a' : '#f9fafb',
    accordionBorder: dark ? '#334155' : '#e5e7eb',
    accordionBtnClr: dark ? '#cbd5e1' : '#374151',
    accordionBody: dark ? '#1e293b' : 'white',
    footer: dark ? '#0f172a' : '#f9fafb',
    footerBorder: dark ? '#1e293b' : '#e5e7eb',
    footerClr: dark ? '#475569' : '#9ca3af',
    footerStrong: dark ? '#e2e8f0' : '#374151',
    outlineBtn: dark ? '#1e293b' : 'white',
    outlineBtnBorder: dark ? '#334155' : '#d1d5db',
    outlineBtnClr: dark ? '#e2e8f0' : '#374151',
    muted: dark ? '#64748b' : '#6b7280',
    uploadBtn: dark ? '#1e3a5f' : '#eff6ff',
    uploadBtnBorder: dark ? '#3b82f6' : '#bfdbfe',
    uploadBtnClr: dark ? '#93c5fd' : '#3b82f6',
    slugPrefixBg: dark ? '#0f172a' : '#f3f4f6',
    previewBg: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
    previewBorder: dark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
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
    body: { padding: '24px', background: clr.body },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: clr.label, marginBottom: '8px' },
    fieldGroup: { marginBottom: '16px' },
    inputWrap: { position: 'relative' },
    iconLeft: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' },
    iconRight: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' },
    input: {
      width: '100%',
      border: `1px solid ${clr.inputBorder}`,
      borderRadius: '10px',
      padding: '11px 14px 11px 42px',
      fontSize: '14px',
      outline: 'none',
      color: clr.inputColor,
      background: clr.input,
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'all 0.2s',
    },
    inputPlain: {
      width: '100%',
      border: `1px solid ${clr.inputBorder}`,
      borderRadius: '10px',
      padding: '11px 14px',
      fontSize: '14px',
      outline: 'none',
      color: clr.inputColor,
      background: clr.input,
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'all 0.2s',
    },
    select: {
      width: '100%',
      border: `1px solid ${clr.inputBorder}`,
      borderRadius: '10px',
      padding: '11px 36px 11px 42px',
      fontSize: '14px',
      outline: 'none',
      color: clr.inputColor,
      background: clr.input,
      boxSizing: 'border-box',
      appearance: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
    },
    accordion: { border: `1px solid ${clr.accordionBorder}`, borderRadius: '10px', background: clr.accordion, marginBottom: '10px', overflow: 'hidden' },
    accordionBtn: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
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
      marginTop: '10px',
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
      padding: '12px',
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
    footer: { padding: '14px 24px', background: clr.footer, borderTop: `1px solid ${clr.footerBorder}`, textAlign: 'center', fontSize: '12px', color: clr.footerClr },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!url.trim()) {
        toast.error('URL tidak boleh kosong!');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('originalUrl', url.trim());
      formData.append('domain', domain);
      if (slug.trim()) formData.append('slug', slug.trim());
      if (ogTitle.trim()) formData.append('ogTitle', ogTitle.trim());
      if (ogImageUrl.trim()) formData.append('ogImageUrl', ogImageUrl.trim());
      if (uploadedFile) formData.append('ogImageFile', uploadedFile);
      const res = await fetch('/api/shorten', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat shortlink');
      setResults([{ original: url, short: data.shortUrl, code: data.code }]);
      toast.success('Shortlink berhasil dibuat!');
      setUrl('');
      setSlug('');
      setOgTitle('');
      setOgImageUrl('');
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error(err.message || 'Terjadi kesalahan');
    }
    setLoading(false);
  };

  const handleCheckStats = async (e) => {
    e.preventDefault();
    const input = e.target.elements.shortcode.value.trim();
    if (!input) {
      toast.error('Masukkan shortlink terlebih dahulu');
      return;
    }
    try {
      const code = input.split('/').pop();
      const res = await fetch(`/api/stats/${code}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Shortlink tidak ditemukan');
      setResults([{ original: data.originalUrl, short: input, clicks: data.clicks }]);
      toast.success('Statistik ditemukan!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const previewUrl = slug.trim() ? `${domain}/${PREVIEW_CODE}/${slug}` : `${domain}/${PREVIEW_CODE}`;

  return (
    <div>
      <Toaster position="top-center" />
      <div style={s.card}>
        <div style={s.tabBar}>
          <button type="button" style={mainTab === 'generate' ? s.tabActive : s.tabInactive} onClick={() => setMainTab('generate')}>
            {/* Icon Generate Link yang Elegan (Link + Sparkles) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                color: mainTab === 'generate' ? clr.tabActiveClr : clr.tabInactiveClr,
                filter: mainTab === 'generate' ? 'drop-shadow(0px 2px 4px rgba(99,102,241,0.4))' : 'none',
                transition: '0.3s',
              }}
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              <path d="M5 5l2 2"></path>
              <path d="M19 5l-2 2"></path>
            </svg>
            Generate Link
          </button>

          <button type="button" style={mainTab === 'stats' ? s.tabActive : s.tabInactive} onClick={() => setMainTab('stats')}>
            {/* Icon Statistics yang Elegan (Dashboard/Chart) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                color: mainTab === 'stats' ? clr.tabActiveClr : clr.tabInactiveClr,
                filter: mainTab === 'stats' ? 'drop-shadow(0px 2px 4px rgba(99,102,241,0.4))' : 'none',
                transition: '0.3s',
              }}
            >
              <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
              <path d="M3 9h18"></path>
              <path d="M9 21V9"></path>
              <path d="M13 14l2-2 2 2"></path>
            </svg>
            Statistics
          </button>
        </div>

        <div style={s.body}>
          <div key={mainTab} className="tab-content-enter">
            {mainTab === 'generate' ? (
              <form onSubmit={handleSubmit}>
                {/* ✅ Domain + URL dalam 1 baris */}
                <div style={{ ...s.fieldGroup, display: 'flex', gap: '10px' }}>
                  {/* Domain — lebar tetap */}
                  <div style={{ position: 'relative', flexShrink: 0, width: '140px' }}>
                    <span style={s.iconLeft}>
                      <IconGlobe stroke={clr.iconStroke} />
                    </span>
                    <select className="elegant-input" style={s.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
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

                  {/* URL — mengisi sisa lebar */}
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={s.iconLeft}>
                      <IconLink stroke={clr.iconStroke} />
                    </span>
                    <input className="elegant-input" type="url" style={s.input} placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
                  </div>
                </div>

                {/* ✅ Preview URL — compact, inline di bawah input */}
                <div style={{ marginBottom: '14px', marginTop: '-8px', display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '2px' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewUrl}</span>
                  {slug.trim() && <span style={{ flexShrink: 0, fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '100px', background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>custom slug</span>}
                </div>

                {/* Accordion: Custom Slug */}
                <div style={s.accordion}>
                  <button type="button" style={s.accordionBtn} onClick={() => setShowSlug(!showSlug)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconLink stroke={clr.iconStroke} /> Custom Slug (Optional)
                    </span>
                    <span style={{ display: 'flex', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', transform: showSlug ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <IconChevronDown stroke={clr.iconStroke} />
                    </span>
                  </button>
                  <div style={{ display: 'grid', gridTemplateRows: showSlug ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={s.accordionBody}>
                        <p style={{ margin: 0, fontSize: '12px', color: clr.muted, lineHeight: 1.6 }}>
                          Format: <span style={{ color: '#6366f1', fontWeight: 600 }}>{domain}/[auto-code]/your-slug</span>
                        </p>
                        <input className="elegant-input" type="text" value={slug} onChange={(e) => setSlug(sanitizeSlug(e.target.value))} placeholder="custom-slug" style={s.inputPlain} />
                        {slug.trim() && (
                          <p style={{ margin: 0, fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                            ✓ Slug: <strong>/{slug}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion: Advanced Options */}
                <div style={s.accordion}>
                  <button type="button" style={s.accordionBtn} onClick={() => setShowOptions(!showOptions)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconSettings stroke={clr.iconStroke} /> Advanced Options
                    </span>
                    <span style={{ display: 'flex', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', transform: showOptions ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <IconChevronDown stroke={clr.iconStroke} />
                    </span>
                  </button>
                  <div style={{ display: 'grid', gridTemplateRows: showOptions ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={s.accordionBody}>
                        <div>
                          <label style={s.label}>OG Title</label>
                          <input className="elegant-input" type="text" style={s.inputPlain} placeholder="Link preview title" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} />
                        </div>
                        <div>
                          <label style={s.label}>OG Image URL</label>
                          <input className="elegant-input" type="url" style={s.inputPlain} placeholder="https://..." value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} />
                        </div>
                        <div>
                          <label style={s.label}>Or Upload Image</label>
                          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setUploadedFile(e.target.files[0] || null)} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${clr.uploadBtnBorder}`,
                                background: clr.uploadBtn,
                                color: clr.uploadBtnClr,
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              Choose File
                            </button>
                            <span style={{ fontSize: '13px', color: clr.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedFile ? uploadedFile.name : 'No file chosen'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="premium-submit-btn" disabled={loading}>
                  {loading ? (
                    <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                  <span>{loading ? 'Creating...' : 'Shorten Link'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleCheckStats}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Enter Shortlink</label>
                  <div style={s.inputWrap}>
                    <span style={s.iconLeft}>
                      <IconSearch stroke={clr.iconStroke} />
                    </span>
                    <input name="shortcode" type="text" style={s.input} placeholder="https://shortl.site/TZbAgZo" />
                  </div>
                </div>
                <button type="submit" style={s.outlineBtn}>
                  <IconEye stroke={clr.outlineBtnClr} /> View Detailed Analytics
                </button>
              </form>
            )}
          </div>

          {results.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <ShortlinkResult results={results} />
            </div>
          )}
        </div>

        <div style={s.footer}>
          Agree to <strong style={{ color: clr.footerStrong }}>Link Management Policy</strong> and{' '}
          <a href="/terms" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
            Terms Of Use
          </a>
          .
        </div>
      </div>

      <style>{`
        .elegant-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; }
        .elegant-focus:focus-within { border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; }
        @keyframes tabFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content-enter { animation: tabFadeIn 0.3s ease forwards; }

        /* ======= PREMIUM SUBMIT BUTTON ======= */
        .premium-submit-btn {
          width: 100%;
          margin-top: 10px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
          color: white;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px -10px rgba(99,102,241,0.6);
        }

        .premium-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px rgba(99,102,241,0.8);
        }

        .premium-submit-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .premium-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        /* Animasi Shimmer (Cahaya Lewat) */
        .premium-submit-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        /* Animasi Loading Spinner */
        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
