'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'resurgo-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)['ga-disable-G-F1VLMSS8FB'] = true;
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-16 left-4 right-4 z-[9999] mx-auto max-w-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
    >
      <div className="h-px bg-gradient-to-r from-orange-600 via-zinc-700 to-transparent" />
      <div className="border border-zinc-800 bg-zinc-950 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-zinc-700" />
            <span className="inline-block h-2 w-2 rounded-full bg-zinc-700" />
            <span className="inline-block h-2 w-2 rounded-full bg-zinc-700" />
          </div>
          <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-600">PRIVACY_NOTICE.sh</span>
          <span className="w-12" />
        </div>
        <div className="px-4 py-4">
          <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-2">&gt; COOKIES_DETECTED</p>
          <p className="font-terminal text-sm leading-relaxed text-zinc-300">
            We use essential cookies for auth and optional analytics to improve Resurgo. No data is sold.{' '}
            <Link href="/privacy" className="text-orange-400 underline underline-offset-2 hover:text-orange-300">Privacy Policy</Link>
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={accept}
              className="flex-1 border-2 border-orange-600 bg-orange-600 px-4 py-2 font-terminal text-sm font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500 active:translate-x-px active:translate-y-px active:shadow-none"
            >
              [ ACCEPT_ALL ]
            </button>
            <button
              onClick={decline}
              className="flex-1 border border-zinc-700 bg-transparent px-4 py-2 font-terminal text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
            >
              [ ESSENTIAL_ONLY ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

