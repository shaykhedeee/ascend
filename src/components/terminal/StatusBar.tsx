"use client";

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════ *
 *  StatusBar — btop / ranger / tig-inspired status display
 *
 *  Features:
 *  - Left / centre / right sections
 *  - Pipe `│` separators between items
 *  - Per-item custom colors
 *  - Online/warning/error indicator dots
 *  - Compact & expanded variants
 * ═══════════════════════════════════════════════════════════════════════ */

export interface StatusItem {
  /** Unique key */
  id: string;
  /** Emoji or component to render before the label */
  icon?: React.ReactNode;
  /** Label text */
  label: string;
  /** Value — rendered in the accent color */
  value?: string;
  /** Override color (Tailwind text class or CSS var) */
  color?: string;
  /** Show a status dot (online/warning/error) */
  dot?: "online" | "warning" | "error";
}

export interface StatusBarProps {
  /** Items displayed on the left (or only) side */
  items: StatusItem[];
  /** Items displayed on the right side */
  rightItems?: StatusItem[];
  /** Position within a parent TerminalWindow */
  position?: "top" | "bottom";
  /** Compact mode — smaller type, less padding */
  compact?: boolean;
  /** Extra wrapper class */
  className?: string;
}

function renderItem(item: StatusItem, compact: boolean) {
  const textSize = compact ? "text-[10px]" : "text-xs";
  const valueColor = item.color ?? "text-[var(--term-orange)]";
  return (
    <span key={item.id} className={`flex items-center gap-1.5 ${textSize} font-mono`}>
      {item.dot && <span className={`status-dot ${item.dot}`} />}
      {item.icon && <span className="text-[var(--term-fg-dimmer)]">{item.icon}</span>}
      <span className="text-[var(--term-fg-dim)] select-none">{item.label}</span>
      {item.value && <span className={`${valueColor} font-semibold`}>{item.value}</span>}
    </span>
  );
}

function Separator({ compact }: { compact: boolean }) {
  return (
    <span
      className={`text-[var(--term-border)] select-none ${compact ? "mx-1" : "mx-2"} font-mono`}
    >
      │
    </span>
  );
}

export default function StatusBar({
  items,
  rightItems,
  position = "bottom",
  compact = false,
  className = "",
}: StatusBarProps) {
  const py = compact ? "py-1 px-3" : "py-1.5 px-4";
  const borderDir =
    position === "top" ? "border-b" : "border-t";

  return (
    <div
      className={`flex items-center justify-between ${py} ${borderDir} border-[var(--term-border)] bg-[var(--term-bg)] ${className}`}
    >
      {/* Left items */}
      <div className="flex items-center">
        {items.map((item, i) => (
          <React.Fragment key={item.id}>
            {i > 0 && <Separator compact={compact} />}
            {renderItem(item, compact)}
          </React.Fragment>
        ))}
      </div>

      {/* Right items */}
      {rightItems && rightItems.length > 0 && (
        <div className="flex items-center">
          {rightItems.map((item, i) => (
            <React.Fragment key={item.id}>
              {i > 0 && <Separator compact={compact} />}
              {renderItem(item, compact)}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
