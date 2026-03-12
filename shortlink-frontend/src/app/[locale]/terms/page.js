'use client';
import { useTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
  const { dark } = useTheme();

  // Palet warna premium menyesuaikan dengan komponen lain
  const bg = dark ? '#030712' : '#fafafa';
  const textPrimary = dark ? '#f8fafc' : '#0f172a';
  const textMuted = dark ? '#94a3b8' : '#64748b';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const accent = '#6366f1';
  const documentBg = dark ? '#0a0f1c' : '#ffffff';

  const c = {
    page: {
      minHeight: '100vh',
      background: bg,
      color: textPrimary,
      fontFamily: 'Inter, sans-serif',
      transition: 'background 0.3s ease',
    },
    container: {
      maxWidth: '860px',
      margin: '0 auto',
      padding: '140px 24px 100px',
    },
    headerArea: {
      textAlign: 'center',
      marginBottom: '56px',
      position: 'relative',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: dark ? 'rgba(99,102,241,0.1)' : '#eef2ff',
      color: accent,
      fontSize: '12px',
      fontWeight: 800,
      letterSpacing: '1.5px',
      padding: '8px 20px',
      borderRadius: '100px',
      marginBottom: '24px',
      textTransform: 'uppercase',
      border: `1px solid ${dark ? 'rgba(99,102,241,0.2)' : '#e0e7ff'}`,
    },
    title: {
      fontSize: 'clamp(36px, 5vw, 52px)',
      fontWeight: 900,
      marginBottom: '16px',
      letterSpacing: '-1.5px',
      lineHeight: 1.1,
    },
    updated: {
      fontSize: '14px',
      color: textMuted,
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
    documentCard: {
      background: documentBg,
      border: `1px solid ${border}`,
      borderRadius: '24px',
      padding: 'clamp(32px, 5vw, 64px)',
      boxShadow: dark ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.03)',
    },
    section: {
      marginBottom: '48px',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
    },
    numberBadge: {
      fontSize: '13px',
      fontWeight: 800,
      color: accent,
      background: dark ? 'rgba(99,102,241,0.1)' : '#eef2ff',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      flexShrink: 0,
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 800,
      letterSpacing: '-0.5px',
      margin: 0,
    },
    sectionText: {
      fontSize: '16px',
      lineHeight: 1.8,
      color: textMuted,
      margin: 0,
      paddingLeft: '52px', // Sejajar dengan teks judul, bukan kotak angka
    },
    highlight: {
      background: dark ? 'rgba(99,102,241,0.05)' : '#f8f9fe',
      borderLeft: `3px solid ${accent}`,
      borderRadius: '0 12px 12px 0',
      padding: '16px 24px',
      marginTop: '20px',
      marginLeft: '52px',
      fontSize: '14px',
      color: dark ? '#c7d2fe' : '#4338ca',
      fontWeight: 600,
      lineHeight: 1.6,
    },
    divider: {
      height: '1px',
      background: border,
      margin: '48px 0',
    },
    footer: {
      textAlign: 'center',
      marginTop: '64px',
      fontSize: '14px',
      color: textMuted,
      fontWeight: 500,
    },
  };

  const sections = [
    {
      id: '01',
      title: 'Acceptance of Terms',
      content: 'By accessing or using SHORTLINK.NET, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.',
    },
    {
      id: '02',
      title: 'Sponsored Redirects',
      content:
        'To keep our service free, we use a sponsored redirect rotation system. For approximately every four (4) visits to your shortened links, one (1) visitor may be redirected to a sponsor page instead of the destination URL. By creating and sharing links on SHORTLINK.NET, you acknowledge and accept this monetization mechanism.',
      highlight: '⚠️ Every ~4 clicks, 1 visitor may see a sponsor page before reaching the destination.',
    },
    {
      id: '03',
      title: 'Analytics & Tracking',
      content:
        'We collect anonymous analytics such as click counts, referrers, device types, and geographic regions to improve platform performance and provide link statistics. No personally identifiable information is collected without your consent.',
    },
    {
      id: '04',
      title: 'Acceptable Use',
      content:
        'Users may not use SHORTLINK.NET for malicious activities including spam, phishing, malware distribution, illegal content distribution, copyright infringement, or any activity that violates applicable local, national, or international laws. We reserve the right to suspend or permanently delete links and accounts that violate these rules without prior notice.',
    },
    {
      id: '05',
      title: 'Privacy & Data',
      content:
        'We respect your privacy. We do not sell your personal data to third parties. Data collected is used solely for service improvement and analytics. You may request deletion of your account and associated data at any time by contacting our support team.',
    },
    {
      id: '06',
      title: 'User Accounts',
      content:
        'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. SHORTLINK.NET is not liable for any loss or damage arising from your failure to protect your account information.',
    },
    {
      id: '07',
      title: 'Service Availability',
      content:
        'We provide this service on an "as is" basis without warranties of any kind, either express or implied. Availability, features, and pricing may change at any time without prior notice. We do not guarantee uninterrupted or error-free operation of the service.',
    },
    {
      id: '08',
      title: 'Limitation of Liability',
      content:
        'SHORTLINK.NET shall not be held liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use the service, including but not limited to loss of revenue, data, or business opportunities.',
    },
    {
      id: '09',
      title: 'Changes to Terms',
      content:
        'These terms may be updated periodically without prior notice. Continued use of the service after any modifications constitutes your acceptance of the revised terms. We recommend reviewing this page periodically to stay informed of any updates.',
    },
  ];

  return (
    <div style={c.page}>
      <Navbar />

      {/* Background Glow Effect untuk kesan premium */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1000px',
          height: '400px',
          background: `radial-gradient(circle at center, ${dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={c.container}>
        <div style={c.headerArea}>
          <div style={c.badge}>
            <span className="pulse-dot" style={{ width: '6px', height: '6px', background: accent, borderRadius: '50%', display: 'inline-block' }}></span>
            Legal Document
          </div>
          <h1 style={c.title}>Terms of Service</h1>
          <p style={c.updated}>Effective Date: March 8, 2026</p>
        </div>

        <div style={c.documentCard}>
          {sections.map((s, index) => (
            <div key={s.id} style={{ ...c.section, marginBottom: index === sections.length - 1 ? 0 : '48px' }}>
              <div style={c.sectionHeader}>
                <div style={c.numberBadge}>{s.id}</div>
                <h2 style={c.sectionTitle}>{s.title}</h2>
              </div>
              <p style={c.sectionText}>{s.content}</p>
              {s.highlight && <div style={c.highlight}>{s.highlight}</div>}

              {/* Divider subtle di antara section, kecuali yang terakhir */}
              {index !== sections.length - 1 && <div style={c.divider} />}
            </div>
          ))}
        </div>

        <div style={c.footer}>
          <p>© {new Date().getFullYear()} SHORTLINK.NET · All rights reserved.</p>
          <p style={{ marginTop: '6px', opacity: 0.7 }}>By using our service, you agree to these terms.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .mobile-adjust-text {
            padding-left: 0 !important;
            margin-top: 16px !important;
          }
          .mobile-adjust-highlight {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
