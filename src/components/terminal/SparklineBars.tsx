"use client";

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  SparklineBars — cava-Inspired Micro Visualizer
 *
 *  Renders vertical bars from a data array—like an audio-frequency
 *  visualizer. Alternating orange/cyan colors by default.
 * ═══════════════════════════════════════════════════════════════════════ */

export interface SparklineBarsProps {
  /** Array of values (0-100) representing bar heights */
  data: number[];
  /** Max height in px (default: 32) */
  height?: number;
  /** Bar width in px (default: 4) */
  barWidth?: number;
  /** Gap between bars in px (default: 2) */
  gap?: number;
  /** Primary color */
  color?: "orange" | "cyan" | "green";
  /** Whether to alternate colors on even bars */
  alternateColor?: boolean;
  /** Extra className */
  className?: string;
}

const PRIMARY_COLORS: Record<string, string> = {
  orange: "var(--term-orange, #FF6B35)",
  cyan:   "var(--term-cyan, #00D9FF)",
  green:  "var(--term-green, #00FF88)",
};

const ALT_COLORS: Record<string, string> = {
  orange: "var(--term-cyan, #00D9FF)",
  cyan:   "var(--term-orange, #FF6B35)",
  green:  "var(--term-cyan, #00D9FF)",
};

export default function SparklineBars({
  data,
  height = 32,
  barWidth = 4,
  gap = 2,
  color = "orange",
  alternateColor = true,
  className = "",
}: SparklineBarsProps) {
  const maxVal = Math.max(...data, 1);

  return (
    <div
      className={`flex items-end ${className}`}
      style={{ height, gap: `${gap}px` }}
      role="img"
      aria-label="Sparkline bar chart"
    >
      {data.map((v, i) => {
        const barHeight = Math.max(1, (v / maxVal) * height);
        const isAlt = alternateColor && i % 2 === 1;
        const bg = isAlt ? ALT_COLORS[color] : PRIMARY_COLORS[color];

        return (
          <div
            key={i}
            className="transition-all duration-300 ease-out rounded-t-[1px]"
            style={{
              width: `${barWidth}px`,
              height: `${barHeight}px`,
              backgroundColor: bg,
              opacity: isAlt ? 0.5 : 0.7,
            }}
          />
        );
      })}
    </div>
  );
}
