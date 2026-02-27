'use client';

import { AlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body style={{
        backgroundColor: '#000000',
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>

          {/* Terminal panel */}
          <div style={{ border: '1px solid #18181B', backgroundColor: '#09090B', marginBottom: '1.5rem' }}>
            <div style={{ borderBottom: '1px solid #18181B', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#DC2626' }}>RESURGO_OS :: CRITICAL_FAULT</span>
            </div>
            <div style={{ padding: '1.25rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <AlertTriangle style={{ width: '36px', height: '36px', color: '#DC2626' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#F4F4F5', letterSpacing: '0.05em', marginBottom: '0.5rem', textAlign: 'center' }}>
                CRITICAL_APPLICATION_FAULT
              </div>
              <div style={{ fontSize: '11px', color: '#52525B', letterSpacing: '0.05em', textAlign: 'center' }}>
                ROOT_LAYOUT_EXCEPTION :: REBOOT_REQUIRED
              </div>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={reset}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              border: '1px solid #9A3412',
              backgroundColor: 'rgba(124, 45, 18, 0.3)',
              color: '#EA580C',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '11px',
              letterSpacing: '0.15em',
              marginBottom: '0.5rem',
            }}
          >
            [REBOOT_APPLICATION]
          </button>

          {/* Dev stack trace */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: '1rem', border: '1px solid #7F1D1D', backgroundColor: 'rgba(127, 29, 29, 0.1)', padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.1em', color: '#B91C1C', marginBottom: '0.5rem' }}>DEV_STACK_TRACE</div>
              <pre style={{
                color: '#EF4444',
                fontSize: '10px',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {error?.message || 'Unknown error'}
              </pre>
            </div>
          )}

        </div>
      </body>
    </html>
  );
}
