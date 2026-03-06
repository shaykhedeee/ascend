"use client";

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  TerminalOutput — Styled output line component
 *
 *  Renders text with optional prompt, prefix icon, and colour coding.
 *  Can be used standalone or composed inside TerminalWindow.
 * ═══════════════════════════════════════════════════════════════════════ */

export type OutputType =
  | "command"
  | "output"
  | "error"
  | "success"
  | "info"
  | "system"
  | "warning";

export interface TerminalOutputProps {
  /** The text content */
  children: React.ReactNode;
  /** Output type — determines colour */
  type?: OutputType;
  /** Prompt character (shown for command type) */
  prompt?: string;
  /** Optional prefix icon / emoji */
  icon?: React.ReactNode;
  /** Dim the output slightly */
  dim?: boolean;
  /** Extra className */
  className?: string;
  /** Timestamp label (shown right-aligned) */
  timestamp?: string;
}

const TYPE_COLORS: Record<OutputType, string> = {
  command: "text-[var(--term-fg)]",
  output:  "text-[var(--term-fg-dim)]",
  error:   "text-[var(--term-red)]",
  success: "text-[var(--term-green)]",
  info:    "text-[var(--term-cyan)]",
  system:  "text-[var(--term-fg-dimmer)]",
  warning: "text-[var(--term-yellow)]",
};

const PROMPT_COLORS: Record<OutputType, string> = {
  command: "text-[var(--term-orange)]",
  output:  "text-[var(--term-fg-dimmer)]",
  error:   "text-[var(--term-red)]",
  success: "text-[var(--term-green)]",
  info:    "text-[var(--term-cyan)]",
  system:  "text-[var(--term-fg-dimmer)]",
  warning: "text-[var(--term-yellow)]",
};

export default function TerminalOutput({
  children,
  type = "output",
  prompt,
  icon,
  dim = false,
  className = "",
  timestamp,
}: TerminalOutputProps) {
  const showPrompt = prompt ?? (type === "command" ? "$" : undefined);

  return (
    <div
      className={`flex items-start gap-2 py-0.5 font-mono text-sm leading-relaxed ${
        dim ? "opacity-60" : ""
      } ${className}`}
    >
      {showPrompt && (
        <span className={`${PROMPT_COLORS[type]} select-none shrink-0`}>
          {showPrompt}
        </span>
      )}
      {icon && (
        <span className="shrink-0 text-[var(--term-fg-dimmer)]">{icon}</span>
      )}
      <span className={`${TYPE_COLORS[type]} flex-1 min-w-0`}>{children}</span>
      {timestamp && (
        <span className="text-[var(--term-fg-dimmer)] text-[10px] shrink-0 tabular-nums select-none">
          {timestamp}
        </span>
      )}
    </div>
  );
}
