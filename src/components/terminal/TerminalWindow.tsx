"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  TerminalWindow — Research-Driven Terminal Container
 *  Inspired by: macOS Terminal chrome, btop panels, tig interface
 *
 *  Features:
 *  - Traffic-light window dots (close / minimize / maximize)
 *  - Scanline overlay & CRT vignette glow
 *  - Optional typing-output simulation
 *  - Variants: default | bordered | minimal
 * ═══════════════════════════════════════════════════════════════════════ */

// ── Box-drawing presets ─────────────────────────────────────────────────
const BOX_CHARS = {
  single:  { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
  double:  { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
  rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
  thick:   { tl: "┏", tr: "┓", bl: "┗", br: "┛", h: "━", v: "┃" },
} as const;

// ── Types ───────────────────────────────────────────────────────────────
export interface TerminalLine {
  id: string;
  type: "command" | "output" | "error" | "success" | "info" | "system";
  text: string;
  prompt?: string;
  delay?: number;
}

export interface TerminalWindowProps {
  /** Window title displayed in the title bar */
  title?: string;
  /** Visual variant */
  variant?: "default" | "bordered" | "minimal";
  /** Whether to show the scanline overlay */
  scanlines?: boolean;
  /** Whether to show the CRT vignette glow */
  crtGlow?: boolean;
  /** Whether to show the traffic-light dots */
  showDots?: boolean;
  /** Lines to render (auto-type or instant) */
  lines?: TerminalLine[];
  /** Auto-type lines one by one */
  autoType?: boolean;
  /** Typing speed in ms per character (default: 30) */
  typeSpeed?: number;
  /** Delay between consecutive lines in ms (default: 400) */
  lineDelay?: number;
  /** CSS class for the outer wrapper */
  className?: string;
  /** CSS class for the body area */
  bodyClassName?: string;
  /** Pass children to render custom body content */
  children?: React.ReactNode;
  /** Footer/status bar rendered below the body */
  footer?: React.ReactNode;
  /** Additional header-right content (e.g. buttons) */
  headerRight?: React.ReactNode;
  /** Box-drawing border style around the body */
  boxBorder?: keyof typeof BOX_CHARS;
  /** Max height of the body (scrollable) */
  maxBodyHeight?: string;
  /** Prompt character (default: "$") */
  prompt?: string;
}

// ── Color map for line types ────────────────────────────────────────────
const LINE_COLORS: Record<TerminalLine["type"], string> = {
  command: "text-[var(--term-fg)]",
  output:  "text-[var(--term-fg-dim)]",
  error:   "text-[var(--term-red)]",
  success: "text-[var(--term-green)]",
  info:    "text-[var(--term-cyan)]",
  system:  "text-[var(--term-fg-dimmer)]",
};

const PROMPT_COLORS: Record<TerminalLine["type"], string> = {
  command: "text-[var(--term-orange)]",
  output:  "text-[var(--term-fg-dimmer)]",
  error:   "text-[var(--term-red)]",
  success: "text-[var(--term-green)]",
  info:    "text-[var(--term-cyan)]",
  system:  "text-[var(--term-fg-dimmer)]",
};

// ── Typing hook ─────────────────────────────────────────────────────────
function useTypingLines(
  lines: TerminalLine[],
  enabled: boolean,
  typeSpeed = 30,
  lineDelay = 400
) {
  const [visibleLines, setVisibleLines] = useState<
    { line: TerminalLine; displayText: string }[]
  >([]);
  const [cursorLineIdx, setCursorLineIdx] = useState<number | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!enabled || lines.length === 0) {
      setVisibleLines(lines.map((l) => ({ line: l, displayText: l.text })));
      return;
    }

    cancelled.current = false;
    setVisibleLines([]);
    setCursorLineIdx(null);

    const run = async () => {
      for (let i = 0; i < lines.length; i++) {
        if (cancelled.current) return;
        const line = lines[i];
        const delay = line.delay ?? lineDelay;

        // pause between lines
        await new Promise((r) => setTimeout(r, delay));

        if (line.type === "command") {
          // type out character by character
          setCursorLineIdx(i);
          for (let c = 0; c <= line.text.length; c++) {
            if (cancelled.current) return;
            const partial = line.text.slice(0, c);
            setVisibleLines((prev) => {
              const next = [...prev];
              const existing = next.findIndex((v) => v.line.id === line.id);
              if (existing >= 0) {
                next[existing] = { line, displayText: partial };
              } else {
                next.push({ line, displayText: partial });
              }
              return next;
            });
            await new Promise((r) => setTimeout(r, typeSpeed));
          }
          setCursorLineIdx(null);
        } else {
          // instant for output lines
          setVisibleLines((prev) => [...prev, { line, displayText: line.text }]);
        }
      }
    };

    run();
    return () => {
      cancelled.current = true;
    };
  }, [lines, enabled, typeSpeed, lineDelay]);

  return { visibleLines, cursorLineIdx };
}

// ── Component ───────────────────────────────────────────────────────────
export default function TerminalWindow({
  title = "resurgo.terminal",
  variant = "default",
  scanlines = true,
  crtGlow = true,
  showDots = true,
  lines = [],
  autoType = false,
  typeSpeed = 30,
  lineDelay = 400,
  className = "",
  bodyClassName = "",
  children,
  footer,
  headerRight,
  boxBorder,
  maxBodyHeight = "340px",
  prompt = "$",
}: TerminalWindowProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { visibleLines, cursorLineIdx } = useTypingLines(
    lines,
    autoType,
    typeSpeed,
    lineDelay
  );

  // auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const displayLines = autoType
    ? visibleLines
    : lines.map((l) => ({ line: l, displayText: l.text }));

  const variantClasses =
    variant === "bordered"
      ? "terminal-chrome terminal-bordered"
      : variant === "minimal"
        ? "terminal-chrome border-transparent shadow-none"
        : "terminal-chrome";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-lg overflow-hidden ${variantClasses} ${className}`}
    >
      {/* ── Scanlines ── */}
      {scanlines && <div className="terminal-scanlines" />}
      {/* ── CRT Glow ── */}
      {crtGlow && <div className="terminal-crt-glow" />}

      {/* ── Title Bar ── */}
      <div className="terminal-title-bar relative z-10">
        <div className="flex items-center gap-3">
          {showDots && (
            <div className="window-dots">
              <span className="dot-close" />
              <span className="dot-minimize" />
              <span className="dot-maximize" />
            </div>
          )}
          <span className="font-mono text-xs text-[var(--term-fg-dimmer)] tracking-wide uppercase select-none">
            {title}
          </span>
        </div>
        {headerRight && (
          <div className="flex items-center gap-2">{headerRight}</div>
        )}
      </div>

      {/* ── Body ── */}
      <div
        ref={bodyRef}
        className={`relative z-10 overflow-y-auto font-mono text-sm leading-relaxed px-4 py-3 ${bodyClassName}`}
        style={{ maxHeight: maxBodyHeight }}
      >
        {children ??
          displayLines.map(({ line, displayText }, idx) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: autoType ? 0 : idx * 0.06 }}
              className="flex items-start gap-2 py-0.5"
            >
              {line.type === "command" && (
                <span className={`${PROMPT_COLORS[line.type]} select-none shrink-0`}>
                  {line.prompt ?? prompt}
                </span>
              )}
              <span className={LINE_COLORS[line.type]}>
                {displayText}
                {cursorLineIdx === idx && (
                  <span className="cursor-blink inline-block w-[8px] h-[14px] bg-[var(--term-orange)] ml-0.5 align-middle" />
                )}
              </span>
            </motion.div>
          ))}
      </div>

      {/* ── Footer / Status Bar ── */}
      {footer && (
        <div className="relative z-10 border-t border-[var(--term-border)]">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
