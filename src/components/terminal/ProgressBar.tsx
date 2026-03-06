"use client";

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  ProgressBar — Research-Driven Terminal Progress Indicator
 *  Inspired by: btop CPU bars, cava visualizer, gum progress
 *
 *  Variants:
 *    default   — solid fill with shine
 *    gradient  — orange → cyan gradient
 *    blocks    — ▓ filled + ░ empty (retro TUI look)
 *    ascii     — █ filled + ░ empty
 *    braille   — ⣿ filled + ⠀ empty
 * ═══════════════════════════════════════════════════════════════════════ */

export interface ProgressBarProps {
  /** 0-100 */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Variant style */
  variant?: "default" | "gradient" | "blocks" | "ascii" | "braille";
  /** Accent color */
  color?: "orange" | "cyan" | "green" | "yellow" | "red" | "magenta";
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: "right" | "inside";
  /** Width of the bar (default: "100%") */
  width?: string;
  /** Extra className */
  className?: string;
  /** Optional label text (overrides percentage display) */
  label?: string;
}

// ── Color mapping ───────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; text: string; gradient?: string }> = {
  orange:  { bg: "bg-[var(--term-orange)]", text: "text-[var(--term-orange)]", gradient: "from-[var(--term-orange)] to-[var(--term-orange-bright)]" },
  cyan:    { bg: "bg-[var(--term-cyan)]",   text: "text-[var(--term-cyan)]",   gradient: "from-[var(--term-orange)] to-[var(--term-cyan)]" },
  green:   { bg: "bg-[var(--term-green)]",  text: "text-[var(--term-green)]" },
  yellow:  { bg: "bg-[var(--term-yellow)]", text: "text-[var(--term-yellow)]" },
  red:     { bg: "bg-[var(--term-red)]",    text: "text-[var(--term-red)]" },
  magenta: { bg: "bg-[var(--term-magenta)]", text: "text-[var(--term-magenta)]" },
};

const SIZE_MAP: Record<string, { height: string; text: string; charWidth: number }> = {
  sm: { height: "h-2",  text: "text-[10px]", charWidth: 20 },
  md: { height: "h-3",  text: "text-xs",     charWidth: 30 },
  lg: { height: "h-4",  text: "text-sm",     charWidth: 40 },
};

// ── Text-based (blocks / ascii / braille) renderer ──────────────────────
function TextProgress({
  value,
  max,
  variant,
  color,
  size,
  showLabel,
  label,
  className,
}: ProgressBarProps & { variant: "blocks" | "ascii" | "braille" }) {
  const pct = Math.min(100, Math.max(0, (value / (max ?? 100)) * 100));
  const { charWidth, text: textSize } = SIZE_MAP[size ?? "md"];
  const filled = Math.round((pct / 100) * charWidth);
  const empty = charWidth - filled;
  const c = COLOR_MAP[color ?? "orange"];

  const charSets = {
    blocks:  { fill: "▓", empty: "░" },
    ascii:   { fill: "█", empty: "░" },
    braille: { fill: "⣿", empty: "⠀" },
  };

  const chars = charSets[variant];

  return (
    <div className={`flex items-center gap-2 font-mono ${textSize} ${className ?? ""}`}>
      <span className="select-none whitespace-pre">
        <span className={c.text}>{chars.fill.repeat(filled)}</span>
        <span className="text-[var(--term-fg-dimmer)]">{chars.empty.repeat(empty)}</span>
      </span>
      {showLabel && (
        <span className={`${c.text} font-semibold tabular-nums min-w-[3ch] text-right`}>
          {label ?? `${Math.round(pct)}%`}
        </span>
      )}
    </div>
  );
}

// ── Bar-based (default / gradient) renderer ─────────────────────────────
function BarProgress({
  value,
  max,
  variant,
  color,
  size,
  showLabel,
  labelPosition,
  width,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / (max ?? 100)) * 100));
  const { height, text: textSize } = SIZE_MAP[size ?? "md"];
  const c = COLOR_MAP[color ?? "orange"];

  const isGradient = variant === "gradient";
  const fillClass = isGradient
    ? `bg-gradient-to-r ${c.gradient ?? "from-[var(--term-orange)] to-[var(--term-cyan)]"}`
    : c.bg;

  return (
    <div
      className={`flex items-center gap-2 ${className ?? ""}`}
      style={{ width: width ?? "100%" }}
    >
      <div
        className={`relative flex-1 ${height} rounded-sm overflow-hidden bg-[var(--term-bg-lighter)]`}
      >
        <div
          className={`absolute inset-y-0 left-0 ${fillClass} rounded-sm transition-all duration-500 ease-out progress-bar-shine`}
          style={{ width: `${pct}%` }}
        >
          {showLabel && labelPosition === "inside" && pct > 15 && (
            <span
              className={`absolute inset-0 flex items-center justify-center ${textSize} font-mono font-bold text-[var(--term-bg)] select-none`}
            >
              {label ?? `${Math.round(pct)}%`}
            </span>
          )}
        </div>
      </div>
      {showLabel && labelPosition !== "inside" && (
        <span
          className={`${c.text} ${textSize} font-mono font-semibold tabular-nums min-w-[3ch] text-right`}
        >
          {label ?? `${Math.round(pct)}%`}
        </span>
      )}
    </div>
  );
}

// ── Exported Component ──────────────────────────────────────────────────
export default function ProgressBar(props: ProgressBarProps) {
  const variant = props.variant ?? "default";

  if (variant === "blocks" || variant === "ascii" || variant === "braille") {
    return <TextProgress {...props} variant={variant} />;
  }

  return <BarProgress {...props} />;
}
