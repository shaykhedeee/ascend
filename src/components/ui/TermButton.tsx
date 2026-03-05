// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — TermButton: Universal terminal-aesthetic button component
// Replaces all CTA and action buttons across the app for consistency
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface TermButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  as?: 'button' | 'span';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-2 border-orange-600 bg-orange-600 text-black font-semibold ' +
    'shadow-[3px_3px_0px_rgba(0,0,0,0.8)] ' +
    'hover:bg-orange-500 hover:border-orange-500 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] ' +
    'active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)] ' +
    'disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed',

  secondary:
    'border-2 border-zinc-700 bg-transparent text-zinc-300 ' +
    'hover:border-orange-600 hover:text-orange-400 ' +
    'active:translate-x-px active:translate-y-px ' +
    'disabled:border-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed',

  ghost:
    'border border-zinc-800 bg-zinc-900 text-zinc-400 ' +
    'hover:border-zinc-600 hover:text-zinc-200 ' +
    'active:translate-x-px active:translate-y-px ' +
    'disabled:border-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed',

  danger:
    'border-2 border-red-800 bg-red-950/30 text-red-400 ' +
    'hover:bg-red-950/60 hover:border-red-700 hover:text-red-300 ' +
    'active:translate-x-px active:translate-y-px ' +
    'disabled:border-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[36px]',
  md: 'px-5 py-2.5 text-sm min-h-[44px]',
  lg: 'px-8 py-3.5 text-base min-h-[52px]',
};

export function TermButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className,
  children,
  disabled,
  as: Tag = 'button',
  ...props
}: TermButtonProps) {
  return (
    <Tag
      className={cn(
        // Base
        'inline-flex items-center justify-center gap-2',
        'font-mono tracking-wide uppercase',
        'transition-all duration-100',
        'cursor-pointer select-none',
        // Variant
        variantClasses[variant],
        // Size
        sizeClasses[size],
        // Full width
        fullWidth && 'w-full',
        // Loading state
        (loading || disabled) && 'cursor-not-allowed',
        className,
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <>
          <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          <span>PROCESSING_</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </Tag>
  );
}

// ─── Link variant (renders as anchor while styled as button) ─────────────────
interface TermLinkButtonProps extends Omit<TermButtonProps, 'as'> {
  href: string;
  target?: string;
  rel?: string;
}

export function TermLinkButton({ href, target, rel, className, children, variant = 'primary', size = 'md', icon, fullWidth = false, ...props }: TermLinkButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-mono tracking-wide uppercase',
        'transition-all duration-100',
        'cursor-pointer select-none no-underline',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...(props as any)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </a>
  );
}

export default TermButton;
