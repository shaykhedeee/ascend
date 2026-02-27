// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RESURGOIFY â€” 404 Not Found Page
// App Router not-found handler (also resolves /_error build issue in Next.js 14)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        color: '#E4E4E7',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>

        {/* Terminal header panel */}
        <div style={{ border: '1px solid #18181B', backgroundColor: '#09090B', marginBottom: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid #18181B', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA580C', display: 'inline-block' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#EA580C' }}>RESURGO_OS :: ROUTE_NOT_FOUND</span>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#3F3F46', marginBottom: '0.5rem' }}>HTTP_404 :: NAVIGATION_ERROR</div>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: '#EA580C', lineHeight: 1, letterSpacing: '-0.05em' }}>404</div>
            <div style={{ marginTop: '0.5rem', fontSize: '14px', fontWeight: 700, color: '#F4F4F5', letterSpacing: '0.05em' }}>RESOURCE_NOT_FOUND</div>
            <div style={{ marginTop: '0.25rem', fontSize: '11px', color: '#52525B', letterSpacing: '0.05em' }}>
              REQUESTED_ROUTE_DOES_NOT_EXIST :: CHECK_URL_AND_RETRY
            </div>
          </div>
        </div>

        {/* Boot log */}
        <div style={{ border: '1px solid #18181B', backgroundColor: '#09090B', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
          {[
            { text: 'SCANNING_ROUTE_TABLE...', status: 'ok' },
            { text: 'ROUTE_MATCH_NOT_FOUND', status: 'err' },
            { text: 'FALLBACK_HANDLER_ACTIVE', status: 'ok' },
          ].map((line) => (
            <div key={line.text} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '9px', color: line.status === 'err' ? '#EF4444' : '#22C55E', fontWeight: 700 }}>
                {line.status === 'err' ? '[ERR]' : '[OK]'}
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.08em', color: line.status === 'err' ? '#EF4444' : '#3F3F46' }}>{line.text}</span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <Link
          href="/"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.75rem 1.5rem',
            border: '1px solid #9A3412',
            backgroundColor: 'rgba(124, 45, 18, 0.3)',
            color: '#EA580C',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '11px',
            letterSpacing: '0.15em',
          }}
        >
          [RETURN_TO_HOME]
        </Link>

      </div>
    </div>
  );
}
