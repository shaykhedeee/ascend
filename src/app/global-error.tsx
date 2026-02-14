// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Global Error Handler
// Catches errors in root layout including head/metadata
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundColor: '#0D0D0F', 
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '400px', textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <AlertTriangle style={{ width: '40px', height: '40px', color: '#F87171' }} />
          </div>
          
          <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Application Error
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          
          <button
            onClick={reset}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #14B899, #FBBF24)',
              color: '#FFFFFF',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '16px'
            }}
          >
            <RefreshCw style={{ width: '20px', height: '20px' }} />
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              color: '#F87171',
              fontSize: '12px',
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {error?.message || 'Unknown error'}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
