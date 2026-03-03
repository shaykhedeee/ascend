// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Skeleton Loader Components — PIXEL EDITION
// Pixel-style loading states with stepped shimmer
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: CSSProperties;
}

// Base Skeleton Element — pixel style
export function Skeleton({ className, animate = true, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-[var(--surface)] border border-zinc-800/50',
        animate && 'pixel-shimmer',
        className
      )}
      style={{ borderRadius: '2px', ...style }}
    />
  );
}

// Skeleton for text lines
export function SkeletonText({ 
  lines = 1, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )} 
        />
      ))}
    </div>
  );
}

// Skeleton for avatar — pixel square instead of circle
export function SkeletonAvatar({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton className={cn(sizes[size], className)} />
  );
}

// Skeleton for cards — pixel panel
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-4 bg-[var(--surface)] border-2 border-[var(--border)]',
      className
    )} style={{ borderRadius: '2px' }}>
      <div className="flex items-start gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for habit item
export function SkeletonHabit({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-4 bg-[var(--surface)] border-2 border-[var(--border)]',
      className
    )} style={{ borderRadius: '2px' }}>
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
  );
}

// Skeleton for habit grid
export function SkeletonHabitGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonHabit key={i} />
      ))}
    </div>
  );
}

// Skeleton for goal card
export function SkeletonGoalCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-6 bg-[var(--surface)] border-2 border-[var(--border)]',
      className
    )} style={{ borderRadius: '2px' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-14 h-14" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="w-8 h-8" />
      </div>
      <Skeleton className="h-3 w-full mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

// Skeleton for stats card
export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-4 bg-[var(--surface)] border-2 border-[var(--border)]',
      className
    )} style={{ borderRadius: '2px' }}>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

// Skeleton for stats grid
export function SkeletonStatsGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStats key={i} />
      ))}
    </div>
  );
}

// Skeleton for calendar
export function SkeletonCalendar({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-4 bg-[var(--surface)] border-2 border-[var(--border)]',
      className
    )} style={{ borderRadius: '2px' }}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={`day-${i}`} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}

// Skeleton for chart
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-6 bg-[var(--surface)] border-2 border-[var(--border)]',
      className
    )} style={{ borderRadius: '2px' }}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-16 h-8" />
        </div>
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-6" />
        ))}
      </div>
    </div>
  );
}

// Skeleton for list items
export function SkeletonList({ 
  count = 5,
  showAvatar = false,
  className 
}: { 
  count?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface)]" style={{ borderRadius: '2px' }}>
          {showAvatar && <SkeletonAvatar size="sm" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-6 h-6 rounded" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for the entire dashboard
export function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SkeletonAvatar size="xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="w-32 h-10" />
      </div>

      {/* Stats */}
      <SkeletonStatsGrid count={4} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32" />
          <SkeletonHabitGrid count={4} />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <SkeletonGoalCard />
        </div>
      </div>
    </div>
  );
}

// Loading overlay for sections
export function SkeletonOverlay({ 
  show = true,
  className 
}: { 
  show?: boolean;
  className?: string;
}) {
  if (!show) return null;

  return (
    <div className={cn(
      'absolute inset-0 bg-[var(--background)]/80',
      'flex items-center justify-center z-10',
      'animate-fade-in',
      className
    )}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 animate-spin" style={{ borderRadius: '2px' }} />
        <span className="font-pixel text-[0.5rem] uppercase tracking-wider text-[var(--text-muted)]">Loading...</span>
      </div>
    </div>
  );
}
