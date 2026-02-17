// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Loading Screen Component
// Modern, minimalist loading screen with brand identity
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating progress
        const increment = prev < 50 ? 8 : prev < 80 ? 12 : 20;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Start fade out after progress complete
      setTimeout(() => setFadeOut(true), 200);
    }
  }, [progress]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0B] transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading application"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ascend-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Logo and loading content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Mountain Logo */}
        <div className="relative" aria-hidden="true">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-ascend-500 to-ascend-600 blur-xl opacity-50 animate-pulse" />
          
          {/* Logo container */}
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-ascend-500 to-ascend-600 flex items-center justify-center shadow-2xl">
            {/* Mountain SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Mountain peaks - animated draw */}
              <path 
                d="M10 80 L35 35 L50 55 L65 30 L90 80" 
                className="animate-draw"
                style={{ 
                  strokeDasharray: 200, 
                  strokeDashoffset: 200,
                  animation: 'draw 1.5s ease-out forwards'
                }}
              />
              {/* Sun/goal at peak */}
              <circle 
                cx="65" 
                cy="20" 
                r="8" 
                fill="currentColor"
                className="opacity-0 animate-fade-in"
                style={{ animation: 'fadeIn 0.5s ease-out 0.8s forwards' }}
              />
              {/* Base line */}
              <line 
                x1="5" y1="80" x2="95" y2="80" 
                className="opacity-0"
                style={{ animation: 'fadeIn 0.3s ease-out 1s forwards' }}
              />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-gold-400 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-1 -left-3 w-2 h-2 bg-ascend-400 rounded-full animate-float" style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-1/2 -right-4 w-2 h-2 bg-gold-300 rounded-full animate-float" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Brand text */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-wider mb-1">ASCENDIFY</h1>
          <p className="text-sm text-white/50 tracking-widest uppercase">Rise to Your Potential</p>
        </div>

        {/* Progress bar - Mountain path style */}
        <div className="w-48 relative">
          {/* Track */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            {/* Progress fill with gradient */}
            <div 
              className="h-full bg-gradient-to-r from-ascend-500 via-ascend-400 to-gold-400 rounded-full transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          
          {/* Progress indicator dot */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-ascend-500/50 transition-all duration-200"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Loading text */}
        <p className="text-white/40 text-sm" aria-live="polite" role="status">
          {progress < 30 ? 'Preparing your journey...' : 
           progress < 60 ? 'Loading your goals...' : 
           progress < 90 ? 'Almost there...' : 
           'Ready to ascend!'}
        </p>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) scale(1.1);
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
