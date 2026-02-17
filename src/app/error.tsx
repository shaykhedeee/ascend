// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Error Page
// Handles runtime errors gracefully with error tracking
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react';
import { captureError } from '@/lib/sentry';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [errorId, setErrorId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Capture and log the error
    const id = captureError(error, {
      digest: error.digest,
      component: 'ErrorBoundary',
    });
    setErrorId(id);
    console.error('Application error:', error);
  }, [error]);

  const handleCopyErrorId = async () => {
    if (errorId) {
      await navigator.clipboard.writeText(errorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearAndReload = () => {
    // Clear localStorage and reload
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ascend-storage');
      localStorage.removeItem('ascend-user');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-white/60 mb-8">
          We encountered an unexpected error. Don&apos;t worry, your data is safe.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#14B899] to-[#FBBF24] 
                     text-white font-semibold flex items-center justify-center gap-2
                     hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <button
            onClick={handleClearAndReload}
            className="w-full py-3 px-6 rounded-xl bg-white/10 text-white font-medium
                     flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5" />
            Clear Data & Start Fresh
          </button>
        </div>
        
        <p className="text-white/40 text-sm mt-8">
          If this error persists, try clearing your browser cache or contact support.
        </p>

        {errorId && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-white/30 text-xs">Error ID: {errorId}</span>
            <button
              onClick={handleCopyErrorId}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Copy error ID"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/40" />
              )}
            </button>
          </div>
        )}
        
        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
            <p className="text-red-400 text-sm font-mono break-all">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
