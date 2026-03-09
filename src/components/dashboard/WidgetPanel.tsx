'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// WidgetPanel — slide-in side panel to toggle widget visibility
// ═══════════════════════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { WIDGET_REGISTRY, type LayoutEntry } from '@/lib/dashboard/widgetRegistry';

interface WidgetPanelProps {
  open: boolean;
  layout: LayoutEntry[];
  onToggle: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function WidgetPanel({ open, layout, onToggle, onReset, onClose }: WidgetPanelProps) {
  const layoutMap = new Map(layout.map((e) => [e.id, e]));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-zinc-800 bg-zinc-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <h2 className="font-terminal text-base font-bold text-zinc-100">Customise Widgets</h2>
                <p className="font-terminal text-xs text-zinc-500 mt-0.5">Toggle visibility &amp; drag to reorder</p>
              </div>
              <button onClick={onClose} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Widget list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {WIDGET_REGISTRY.map((def) => {
                const entry = layoutMap.get(def.id);
                const visible = entry?.visible ?? def.defaultVisible;

                return (
                  <button
                    key={def.id}
                    onClick={() => onToggle(def.id)}
                    className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition ${
                      visible
                        ? 'border border-zinc-800 bg-zinc-900 hover:border-orange-800'
                        : 'border border-zinc-900 bg-zinc-950 opacity-60 hover:opacity-80'
                    }`}
                  >
                    {visible ? (
                      <Eye className="h-4 w-4 shrink-0 text-orange-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 shrink-0 text-zinc-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-terminal text-sm text-zinc-200 truncate">{def.label}</p>
                      <p className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 uppercase">{def.section}</p>
                    </div>
                    <span className={`font-pixel text-[0.4rem] tracking-widest ${visible ? 'text-emerald-500' : 'text-zinc-600'}`}>
                      {visible ? 'VISIBLE' : 'HIDDEN'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="border-t border-zinc-800 px-5 py-4 flex items-center justify-between">
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 font-terminal text-xs text-zinc-400 hover:text-orange-400 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to defaults
              </button>
              <button
                onClick={onClose}
                className="rounded border border-orange-600 bg-orange-600 px-4 py-1.5 font-terminal text-xs font-bold text-black hover:bg-orange-500 transition"
              >
                Done
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
