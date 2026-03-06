"use client";

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  KeyboardHints — Keyboard Shortcut Display
 *  Inspired by: tig bottom bar, gum keybinding footer, ranger help
 *
 *  Renders a row of < key → label > pairs with terminal styling.
 * ═══════════════════════════════════════════════════════════════════════ */

export interface KeyHint {
  /** Unique identifier */
  id: string;
  /** Key to press (e.g. "Enter", "↑↓", "Ctrl+C") */
  key: string;
  /** What the key does */
  label: string;
}

export interface KeyboardHintsProps {
  /** Array of key hints to display */
  hints: KeyHint[];
  /** Layout direction */
  direction?: "row" | "column";
  /** Compact mode — less spacing */
  compact?: boolean;
  /** Style variant */
  variant?: "default" | "minimal";
  /** Extra className */
  className?: string;
}

export default function KeyboardHints({
  hints,
  direction = "row",
  compact = false,
  variant = "default",
  className = "",
}: KeyboardHintsProps) {
  const isRow = direction === "row";
  const gap = compact ? "gap-2" : "gap-3";
  const wrapClass = isRow
    ? `flex flex-wrap items-center ${gap}`
    : `flex flex-col ${gap}`;

  return (
    <div className={`${wrapClass} ${className}`}>
      {hints.map((hint, i) => (
        <React.Fragment key={hint.id}>
          {variant === "default" ? (
            <span className="inline-flex items-center gap-1.5">
              <kbd className="kbd-key">{hint.key}</kbd>
              <span className="text-[var(--term-fg-dim)] font-mono text-xs select-none">
                {hint.label}
              </span>
            </span>
          ) : (
            /* Minimal: no kbd box, just colored key */
            <span className="inline-flex items-center gap-1 font-mono text-xs">
              <span className="text-[var(--term-orange)] font-bold">{hint.key}</span>
              <span className="text-[var(--term-fg-dimmer)] select-none">{hint.label}</span>
            </span>
          )}
          {/* Separator between items in row mode */}
          {isRow && i < hints.length - 1 && !compact && (
            <span className="text-[var(--term-border)] select-none font-mono text-xs">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
