// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY — 404 Not Found Page
// App Router not-found handler (also resolves /_error build issue in Next.js 14)
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D0D0F',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#E4E4E7',
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '420px' }}>
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #F97316, #FB923C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
          Page Not Found
        </h1>
        <p style={{ color: '#A1A1AA', marginTop: '0.5rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: '#F97316',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Back to Ascendify
        </Link>
      </div>
    </div>
  );
}
