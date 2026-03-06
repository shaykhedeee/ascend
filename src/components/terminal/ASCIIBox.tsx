"use client";

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  ASCIIBox — Box-Drawing Character Bordered Sections
 *  Inspired by: ranger panels, tig view borders, bpytop layout
 *
 *  Styles:
 *    single  — ┌─┐ │ │ └─┘
 *    double  — ╔═╗ ║ ║ ╚═╝
 *    rounded — ╭─╮ │ │ ╰─╯
 *    thick   — ┏━┓ ┃ ┃ ┗━┛
 *    none    — no border (passthrough wrapper)
 * ═══════════════════════════════════════════════════════════════════════ */

const BOX = {
  single:  { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
  double:  { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
  rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
  thick:   { tl: "┏", tr: "┓", bl: "┗", br: "┛", h: "━", v: "┃" },
} as const;

export type BoxStyle = keyof typeof BOX | "none";

export interface ASCIIBoxProps {
  /** Box drawing style */
  style?: BoxStyle;
  /** Title embedded in the top border */
  title?: string;
  /** Accent color for the border characters */
  color?: "default" | "orange" | "cyan" | "green" | "yellow" | "red";
  /** Width in monospace character columns (default: auto/fill) */
  width?: number;
  /** Children to render inside the box */
  children: React.ReactNode;
  /** Extra className */
  className?: string;
  /** Extra body className */
  bodyClassName?: string;
  /** Padding inside the box (default: true) */
  padded?: boolean;
}

// ── Color mapping ───────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  default: "text-[var(--term-fg-dim)]",
  orange:  "text-[var(--term-orange)]",
  cyan:    "text-[var(--term-cyan)]",
  green:   "text-[var(--term-green)]",
  yellow:  "text-[var(--term-yellow)]",
  red:     "text-[var(--term-red)]",
};

// ── Helper: generate a repeated line ────────────────────────────────────
function hLine(char: string, count: number): string {
  return char.repeat(Math.max(0, count));
}

export default function ASCIIBox({
  style = "rounded",
  title,
  color = "default",
  width,
  children,
  className = "",
  bodyClassName = "",
  padded = true,
}: ASCIIBoxProps) {
  if (style === "none") {
    return <div className={className}>{children}</div>;
  }

  const b = BOX[style];
  const borderColor = COLOR_MAP[color];
  const titleColor =
    color === "default" ? "text-[var(--term-fg)]" : COLOR_MAP[color];
  const innerWidth = width ? width - 2 : undefined;

  // Top border with optional title
  const topBorder = (() => {
    if (!title) {
      return innerWidth != null
        ? `${b.tl}${hLine(b.h, innerWidth)}${b.tr}`
        : null; // dynamic width handled via CSS
    }
    const titleText = ` ${title} `;
    const remaining = innerWidth != null ? innerWidth - titleText.length : 0;
    if (innerWidth != null) {
      const left = 2;
      const right = Math.max(0, remaining - left);
      return `${b.tl}${hLine(b.h, left)}`;
    }
    return null; // dynamic
  })();

  // For dynamic width, we use CSS grid technique
  const isFixed = width != null && width > 0;

  return (
    <div
      className={`font-mono ${className}`}
      style={isFixed ? { width: `${width}ch` } : undefined}
    >
      {/* Top border */}
      <div className={`${borderColor} whitespace-pre select-none flex items-center leading-none`}>
        <span>{b.tl}</span>
        {title ? (
          <>
            <span>{hLine(b.h, 2)}</span>
            <span className={`${titleColor} font-semibold`}> {title} </span>
            <span className="flex-1 overflow-hidden">
              {isFixed
                ? hLine(b.h, Math.max(0, (innerWidth ?? 0) - title.length - 4))
                : b.h.repeat(60)}
            </span>
          </>
        ) : (
          <span className="flex-1 overflow-hidden">
            {isFixed ? hLine(b.h, innerWidth ?? 0) : b.h.repeat(60)}
          </span>
        )}
        <span>{b.tr}</span>
      </div>

      {/* Body */}
      <div className="relative flex">
        <span className={`${borderColor} select-none shrink-0`}>{b.v}</span>
        <div className={`flex-1 min-w-0 ${padded ? "px-2 py-1" : ""} ${bodyClassName}`}>
          {children}
        </div>
        <span className={`${borderColor} select-none shrink-0`}>{b.v}</span>
      </div>

      {/* Bottom border */}
      <div className={`${borderColor} whitespace-pre select-none flex items-center leading-none`}>
        <span>{b.bl}</span>
        <span className="flex-1 overflow-hidden">
          {isFixed ? hLine(b.h, innerWidth ?? 0) : b.h.repeat(60)}
        </span>
        <span>{b.br}</span>
      </div>
    </div>
  );
}
