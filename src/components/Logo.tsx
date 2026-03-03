// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Pixel Art Logo Component
// 8-bit ascending arrow on pixel grid — consistent across all contexts
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
  sm: 'text-[0.55rem]',
  md: 'text-[0.65rem]',
  lg: 'text-[0.8rem]',
  xl: 'text-[1rem]',
};

// Pixel grid for the ascending arrow — 16x16 grid
// Each rect is a "pixel" in the logo
function PixelArrowSVG({ className, animated }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("pixel-render", className)}
      style={{ imageRendering: 'pixelated' }}
      fill="none"
    >
      {/* Arrow body — ascending pixel arrow */}
      {/* Top pixel (tip) */}
      <rect x="7" y="1" width="2" height="2" fill="#FB923C" />
      {/* Second row */}
      <rect x="6" y="3" width="1" height="2" fill="#FB923C" />
      <rect x="7" y="3" width="2" height="2" fill="#EA580C" />
      <rect x="9" y="3" width="1" height="2" fill="#FB923C" />
      {/* Third row (shoulders) */}
      <rect x="4" y="5" width="2" height="2" fill="#FB923C" />
      <rect x="6" y="5" width="1" height="2" fill="#EA580C" />
      <rect x="7" y="5" width="2" height="2" fill="#C2410C" />
      <rect x="9" y="5" width="1" height="2" fill="#EA580C" />
      <rect x="10" y="5" width="2" height="2" fill="#FB923C" />
      {/* Fourth row (wide base of arrow head) */}
      <rect x="3" y="7" width="2" height="2" fill="#FDBA74" />
      <rect x="5" y="7" width="1" height="2" fill="#FB923C" />
      <rect x="6" y="7" width="4" height="2" fill="#EA580C" />
      <rect x="10" y="7" width="1" height="2" fill="#FB923C" />
      <rect x="11" y="7" width="2" height="2" fill="#FDBA74" />
      {/* Shaft top */}
      <rect x="6" y="9" width="4" height="2" fill="#EA580C" />
      {/* Shaft middle */}
      <rect x="6" y="11" width="4" height="2" fill="#C2410C" />
      {/* Shaft bottom */}
      <rect x="6" y="13" width="4" height="2" fill="#9A3412" />
      {/* Shine pixels (top-left highlight) */}
      <rect x="7" y="1" width="1" height="1" fill="#FED7AA" opacity="0.7" />
      <rect x="6" y="3" width="1" height="1" fill="#FED7AA" opacity="0.5" />
      <rect x="4" y="5" width="1" height="1" fill="#FED7AA" opacity="0.4" />
      {/* Animated scanline shimmer */}
      {animated && (
        <rect x="0" y="0" width="16" height="2" fill="white" opacity="0.08">
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 -2"
            to="0 18"
            dur="3s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
}

export function Logo({ 
  size = 'md', 
  showText = false, 
  className,
  animated = false 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Logo Icon — Pixel Arrow */}
      <div className="relative">
        <div className={cn(
          sizeClasses[size],
          "bg-black border-2 border-ascend-600",
          "flex items-center justify-center",
          "relative overflow-hidden",
          animated && "animate-glow"
        )}
        style={{
          boxShadow: '3px 3px 0px rgba(154, 52, 18, 0.8)',
          borderRadius: '0px',
          imageRendering: 'pixelated',
        }}>
          <PixelArrowSVG 
            className={cn(
              "relative z-10",
              size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-9 h-9' : 'w-14 h-14'
            )}
            animated={animated}
          />
        </div>
      </div>

      {/* Text — Pixel font */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            textSizeClasses[size],
            "font-pixel tracking-wider text-white leading-none uppercase"
          )}
          style={{ fontFamily: 'var(--font-pixel, "Press Start 2P"), monospace' }}
          >
            RESURGO
          </h1>
          <span 
            className="text-xs text-zinc-500 tracking-[0.15em] uppercase mt-1"
            style={{ fontFamily: 'var(--font-pixel, "Press Start 2P"), monospace' }}
          >
            by WEBNESS
          </span>
        </div>
      )}
    </div>
  );
}

// Compact pixel version for favicon/small contexts
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      className={cn("pixel-render", className)}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Background square — no rounded corners */}
      <rect width="32" height="32" fill="#0A0A0A" />
      <rect x="1" y="1" width="30" height="30" fill="#000000" stroke="#EA580C" strokeWidth="2" />
      {/* Pixel arrow scaled to 32x32 */}
      <rect x="14" y="4" width="4" height="4" fill="#FB923C" />
      <rect x="12" y="8" width="2" height="4" fill="#FB923C" />
      <rect x="14" y="8" width="4" height="4" fill="#EA580C" />
      <rect x="18" y="8" width="2" height="4" fill="#FB923C" />
      <rect x="8" y="12" width="4" height="4" fill="#FDBA74" />
      <rect x="12" y="12" width="8" height="4" fill="#EA580C" />
      <rect x="20" y="12" width="4" height="4" fill="#FDBA74" />
      <rect x="12" y="16" width="8" height="4" fill="#EA580C" />
      <rect x="12" y="20" width="8" height="4" fill="#C2410C" />
      <rect x="12" y="24" width="8" height="4" fill="#9A3412" />
      {/* Highlight pixel */}
      <rect x="14" y="4" width="2" height="2" fill="#FED7AA" opacity="0.6" />
    </svg>
  );
}

// Pixel loading spinner
export function LogoSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div 
        className="w-12 h-12 bg-black border-2 border-ascend-600 flex items-center justify-center"
        style={{ boxShadow: '3px 3px 0px rgba(154, 52, 18, 0.8)', borderRadius: '0px' }}
      >
        <PixelArrowSVG className="w-8 h-8 animate-pixel-bounce" animated />
      </div>
      {/* Pixel pulsing border */}
      <div 
        className="absolute inset-0 border-2 border-ascend-400/50 animate-pixel-pulse"
        style={{ borderRadius: '0px' }}
      />
    </div>
  );
}
