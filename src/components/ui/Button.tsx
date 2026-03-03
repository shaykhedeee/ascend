// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Design System Button Components — PIXEL EDITION
// Hard-edge pixel buttons with stepped press animations
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// Button Variants & Sizes — Pixel Theme
// ─────────────────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gold';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-ascend-600 hover:bg-ascend-500 
    text-white font-bold uppercase tracking-wider
    border-2 border-ascend-700
    shadow-[3px_3px_0px_rgba(0,0,0,0.8)]
    hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)]
    active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)] active:translate-x-[2px] active:translate-y-[2px]
    focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-1
  `,
  secondary: `
    bg-[var(--surface)] hover:bg-[var(--surface-hover)] 
    text-[var(--text-primary)] uppercase tracking-wider
    border-2 border-[var(--border)]
    shadow-[2px_2px_0px_rgba(0,0,0,0.6)]
    hover:shadow-[3px_3px_0px_rgba(0,0,0,0.6)] hover:border-[var(--text-muted)]
    active:shadow-[1px_1px_0px_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px]
    focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-1
  `,
  outline: `
    bg-transparent hover:bg-[var(--surface)] 
    text-[var(--text-primary)] uppercase tracking-wider
    border-2 border-[var(--border)]
    shadow-[2px_2px_0px_rgba(0,0,0,0.5)]
    hover:border-ascend-500/50
    active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)] active:translate-x-[1px] active:translate-y-[1px]
    focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-1
  `,
  ghost: `
    bg-transparent hover:bg-[var(--surface)] 
    text-[var(--text-secondary)] uppercase tracking-wider
    border-2 border-transparent
    hover:text-[var(--text-primary)] hover:border-[var(--border)]
    active:translate-x-[1px] active:translate-y-[1px]
    focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-1
  `,
  danger: `
    bg-red-900/30 hover:bg-red-800/40 
    text-red-400 uppercase tracking-wider
    border-2 border-red-500/50
    shadow-[2px_2px_0px_rgba(220,38,38,0.3)]
    hover:border-red-500/70
    active:shadow-[1px_1px_0px_rgba(220,38,38,0.3)] active:translate-x-[1px] active:translate-y-[1px]
    focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1
  `,
  success: `
    bg-green-900/30 hover:bg-green-800/40 
    text-green-400 uppercase tracking-wider
    border-2 border-green-500/50
    shadow-[2px_2px_0px_rgba(34,197,94,0.3)]
    hover:border-green-500/70
    active:shadow-[1px_1px_0px_rgba(34,197,94,0.3)] active:translate-x-[1px] active:translate-y-[1px]
    focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1
  `,
  gold: `
    bg-amber-500 hover:bg-amber-400 
    text-black font-bold uppercase tracking-wider
    border-2 border-amber-600
    shadow-[3px_3px_0px_rgba(0,0,0,0.7)]
    hover:shadow-[4px_4px_0px_rgba(0,0,0,0.7)]
    active:shadow-[1px_1px_0px_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px]
    focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-[0.6rem] min-h-[28px] gap-1',
  sm: 'px-3 py-1.5 text-[0.65rem] min-h-[36px] gap-1.5',
  md: 'px-4 py-2 text-[0.7rem] min-h-[44px] gap-2',
  lg: 'px-6 py-3 text-xs min-h-[52px] gap-2',
  xl: 'px-8 py-4 text-sm min-h-[60px] gap-3',
};

const iconOnlySizes: Record<ButtonSize, string> = {
  xs: 'p-1 min-h-[28px] min-w-[28px]',
  sm: 'p-1.5 min-h-[36px] min-w-[36px]',
  md: 'p-2 min-h-[44px] min-w-[44px]',
  lg: 'p-3 min-h-[52px] min-w-[52px]',
  xl: 'p-4 min-h-[60px] min-w-[60px]',
};

// ─────────────────────────────────────────────────────────────────────────────────
// Button Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base pixel styles
          'inline-flex items-center justify-center',
          'font-pixel transition-all duration-100',
          'focus-visible:outline-none focus-visible:ring-offset-[var(--background)]',
          'rounded-pixel',
          
          // Variant & Size
          variantStyles[variant],
          iconOnly ? iconOnlySizes[size] : sizeStyles[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn(
            'animate-spin',
            size === 'xs' && 'w-3 h-3',
            size === 'sm' && 'w-4 h-4',
            size === 'md' && 'w-5 h-5',
            size === 'lg' && 'w-5 h-5',
            size === 'xl' && 'w-6 h-6',
          )} />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ─────────────────────────────────────────────────────────────────────────────────
// Icon Button Component
// ─────────────────────────────────────────────────────────────────────────────────

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  'aria-label': string; // Required for accessibility
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', loading, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        loading={loading}
        iconOnly
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ─────────────────────────────────────────────────────────────────────────────────
// Button Group Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ children, className, orientation = 'horizontal' }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        // Pixel grouped buttons: no rounding, border collapse
        '[&>button]:rounded-none',
        orientation === 'horizontal' && [
          '[&>button:first-child]:rounded-l-pixel',
          '[&>button:last-child]:rounded-r-pixel',
          '[&>button:not(:first-child)]:-ml-[2px]',
        ],
        orientation === 'vertical' && [
          '[&>button:first-child]:rounded-t-pixel',
          '[&>button:last-child]:rounded-b-pixel',
          '[&>button:not(:first-child)]:-mt-[2px]',
        ],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Floating Action Button
// ─────────────────────────────────────────────────────────────────────────────────

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  children: ReactNode;
}

const fabPositions = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
};

export const FAB = forwardRef<HTMLButtonElement, FABProps>(
  ({ position = 'bottom-right', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          fabPositions[position],
          'w-14 h-14 rounded-pixel',
          'bg-ascend-600 hover:bg-ascend-500',
          'border-2 border-ascend-700',
          'text-white',
          'shadow-[4px_4px_0px_rgba(0,0,0,0.8)]',
          'hover:shadow-[5px_5px_0px_rgba(0,0,0,0.8)]',
          'active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)] active:translate-x-[2px] active:translate-y-[2px]',
          'flex items-center justify-center',
          'transition-all duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-1',
          'z-40',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FAB.displayName = 'FAB';

// ─────────────────────────────────────────────────────────────────────────────────
// Link Button (looks like a button but is an anchor)
// ─────────────────────────────────────────────────────────────────────────────────

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth,
  external,
  className,
  children,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center justify-center',
        'font-pixel transition-all duration-100',
        'focus-visible:outline-none focus-visible:ring-offset-[var(--background)]',
        'rounded-pixel no-underline',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </a>
  );
}
