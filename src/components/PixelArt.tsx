'use client';

import { cn } from '@/lib/utils';

type PixelRect = [number, number, number, number, string?];

type PixelArtVariant = 'terminal' | 'goals' | 'habits' | 'calendar' | 'coach';

const PALETTES: Record<PixelArtVariant, { base: string; accent: string; glow: string; frame: string }> = {
  terminal: { base: '#18181b', accent: '#f97316', glow: '#fb923c', frame: '#3f3f46' },
  goals: { base: '#18181b', accent: '#f59e0b', glow: '#facc15', frame: '#3f3f46' },
  habits: { base: '#18181b', accent: '#22c55e', glow: '#4ade80', frame: '#3f3f46' },
  calendar: { base: '#18181b', accent: '#06b6d4', glow: '#67e8f9', frame: '#3f3f46' },
  coach: { base: '#18181b', accent: '#a855f7', glow: '#c084fc', frame: '#3f3f46' },
};

const ART: Record<PixelArtVariant, PixelRect[]> = {
  terminal: [
    [6, 8, 52, 40, 'frame'],
    [10, 14, 44, 28, 'base'],
    [12, 10, 6, 2, 'accent'],
    [20, 10, 6, 2, 'glow'],
    [16, 20, 8, 2, 'glow'],
    [28, 20, 18, 2, 'frame'],
    [16, 26, 20, 2, 'accent'],
    [16, 32, 12, 2, 'frame'],
    [30, 32, 10, 2, 'glow'],
    [16, 38, 8, 2, 'accent'],
    [28, 38, 18, 2, 'frame'],
    [44, 48, 8, 4, 'frame'],
    [12, 48, 18, 4, 'frame'],
  ],
  goals: [
    [30, 6, 4, 4, 'glow'],
    [24, 12, 16, 4, 'accent'],
    [20, 16, 24, 4, 'frame'],
    [16, 20, 32, 4, 'frame'],
    [12, 24, 40, 4, 'frame'],
    [18, 28, 28, 4, 'accent'],
    [24, 32, 16, 4, 'glow'],
    [28, 36, 8, 8, 'accent'],
    [10, 44, 16, 4, 'frame'],
    [38, 44, 16, 4, 'frame'],
    [8, 48, 20, 4, 'glow'],
    [36, 48, 20, 4, 'glow'],
  ],
  habits: [
    [10, 12, 12, 12, 'frame'],
    [14, 16, 4, 4, 'accent'],
    [24, 20, 12, 12, 'frame'],
    [28, 24, 4, 4, 'glow'],
    [38, 28, 12, 12, 'frame'],
    [42, 32, 4, 4, 'accent'],
    [14, 40, 12, 12, 'frame'],
    [18, 44, 4, 4, 'glow'],
    [28, 44, 12, 12, 'frame'],
    [32, 48, 4, 4, 'accent'],
    [44, 12, 8, 4, 'glow'],
    [8, 28, 8, 4, 'glow'],
  ],
  calendar: [
    [8, 8, 48, 44, 'frame'],
    [12, 12, 40, 10, 'accent'],
    [14, 14, 6, 6, 'glow'],
    [44, 14, 6, 6, 'glow'],
    [12, 26, 10, 8, 'base'],
    [26, 26, 10, 8, 'base'],
    [40, 26, 10, 8, 'glow'],
    [12, 38, 10, 8, 'glow'],
    [26, 38, 10, 8, 'base'],
    [40, 38, 10, 8, 'base'],
  ],
  coach: [
    [10, 10, 44, 28, 'frame'],
    [14, 14, 36, 20, 'base'],
    [18, 18, 8, 8, 'glow'],
    [38, 18, 8, 8, 'glow'],
    [26, 28, 12, 4, 'accent'],
    [22, 38, 20, 4, 'frame'],
    [26, 42, 12, 4, 'frame'],
    [18, 46, 8, 8, 'accent'],
    [38, 46, 8, 8, 'accent'],
  ],
};

export function PixelArt({
  variant,
  className,
  title,
}: {
  variant: PixelArtVariant;
  className?: string;
  title?: string;
}) {
  const palette = PALETTES[variant];
  const rects = ART[variant];

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('h-24 w-24 shrink-0', className)}
      role="img"
      aria-label={title ?? `${variant} pixel art`}
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="0" y="0" width="64" height="64" fill="transparent" />
      {rects.map(([x, y, width, height, tone], index) => (
        <rect
          key={`${variant}-${index}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={palette[tone as keyof typeof palette] ?? palette.frame}
        />
      ))}
    </svg>
  );
}
