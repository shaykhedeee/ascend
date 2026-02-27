// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Loading Screen Component
// Modern, minimalist loading screen with brand identity
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';

const BOOT_MESSAGES = [
  'INITIALIZING_RESURGO_RUNTIME...',
  'LOADING_CONVEX_LAYER...',
  'MOUNTING_HABIT_NODES...',
  'SYNCING_TELEMETRY_ENGINE...',
  'CALIBRATING_OBJECTIVES...',
  'SYSTEM_READY',
];

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        const increment = prev < 50 ? 8 : prev < 80 ? 12 : 20;
        return Math.min(prev + increment, 100);
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) setTimeout(() => setFadeOut(true), 300);
    const idx = Math.min(Math.floor(progress / (100 / BOOT_MESSAGES.length)), BOOT_MESSAGES.length - 1);
    setMsgIndex(idx);
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading application"
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(255,255,255,0.5) 1px,rgba(255,255,255,0.5) 2px)', backgroundSize: '100% 2px' }}
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-xs flex-col items-center gap-8 px-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mb-2 font-mono text-[9px] tracking-widest text-orange-600">
            <span className="animate-pulse">&#9679;</span> RESURGO_OS v2.1.0
          </div>
          <h1 className="font-mono text-5xl font-black tracking-[0.2em] text-zinc-100">RESURGO</h1>
          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-zinc-700">LIFE_OPERATING_SYSTEM</p>
        </div>

        {/* Boot log */}
        <div className="w-full border border-zinc-900 bg-zinc-950 p-4">
          <div className="space-y-1" aria-live="polite">
            {BOOT_MESSAGES.slice(0, msgIndex + 1).map((msg, i) => (
              <div key={msg} className={`flex items-center gap-2 font-mono text-[10px] tracking-wider ${
                i === msgIndex ? 'text-orange-500' : 'text-zinc-700'
              }`}>
                {i < msgIndex
                  ? <span className="text-green-600">[OK]</span>
                  : <span className="animate-pulse text-orange-600">[..]</span>}
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-1">
          <div className="h-px overflow-hidden bg-zinc-900">
            <div
              className="h-full bg-orange-600 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-zinc-700">
            <span>BOOT_SEQUENCE</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

    </div>
  );
}
