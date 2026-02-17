// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Premium Logo Component
// Summit Arrow Design - Represents climbing to the peak of your potential
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
};

export function Logo({ 
  size = 'md', 
  showText = false, 
  className,
  animated = false 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Icon - Summit Arrow */}
      <div className="relative">
        <div className={cn(
          sizeClasses[size],
          "rounded-xl bg-gradient-to-br from-ascend-400 via-ascend-500 to-ascend-600",
          "flex items-center justify-center shadow-lg",
          "relative overflow-hidden",
          animated && "animate-pulse-glow"
        )}
        style={{
          boxShadow: '0 4px 20px rgba(249, 115, 22, 0.35)',
        }}>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
          
          {/* Summit Arrow SVG */}
          <svg 
            viewBox="0 0 24 24" 
            className={cn(
              "relative z-10 text-white",
              size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-7 h-7' : 'w-10 h-10'
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Main upward arrow/mountain peak */}
            <path d="M12 4L4 14h5v6h6v-6h5L12 4z" fill="currentColor" />
            {/* Secondary peak line for depth */}
            <path d="M12 4L8 10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            {/* Accent line */}
            <path d="M12 4L16 10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          </svg>
          
          {/* Shine effect */}
          <div 
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent"
            style={{ borderRadius: '12px 12px 0 0' }}
          />
        </div>
        
        {/* Glow effect behind logo */}
        <div 
          className={cn(
            "absolute inset-0 -z-10 rounded-xl blur-xl bg-ascend-500/40",
            animated && "animate-pulse"
          )}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            textSizeClasses[size],
            "font-bold tracking-tight text-white leading-none"
          )}>
            ASCENDIFY
          </h1>
          <span className="text-[9px] text-white/60 tracking-[0.2em] uppercase font-medium mt-0.5">
            by WEBNESS
          </span>
        </div>
      )}
    </div>
  );
}

// Compact version for favicon/small contexts
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      className={cn("text-ascend-500", className)}
      fill="currentColor"
    >
      <defs>
        <linearGradient id="ascend-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#ascend-gradient)" />
      <path 
        d="M16 6L6 18h6v8h8v-8h6L16 6z" 
        fill="white"
      />
    </svg>
  );
}

// Alternative minimal logo for loading states
export function LogoSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ascend-400 to-ascend-600 flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-white animate-bounce"
          fill="currentColor"
        >
          <path d="M12 4L4 14h5v6h6v-6h5L12 4z" />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-xl border-2 border-ascend-400/50 animate-ping" />
    </div>
  );
}
