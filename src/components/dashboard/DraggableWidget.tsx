'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// DraggableWidget — sortable wrapper for dashboard widgets (edit-mode only)
// ═══════════════════════════════════════════════════════════════════════════════

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, EyeOff } from 'lucide-react';
import { WIDGET_MAP } from '@/lib/dashboard/widgetRegistry';
import type { ReactNode } from 'react';

interface DraggableWidgetProps {
  id: string;
  editMode: boolean;
  onHide: (id: string) => void;
  children: ReactNode;
}

export default function DraggableWidget({ id, editMode, onHide, children }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !editMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as const,
  };

  const def = WIDGET_MAP.get(id);

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Edit-mode overlay controls */}
      {editMode && (
        <div className="absolute -top-0.5 left-0 right-0 z-20 flex items-center justify-between px-2 py-1">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="flex items-center gap-1 cursor-grab active:cursor-grabbing rounded bg-zinc-800/90 px-1.5 py-0.5 text-zinc-400 hover:text-orange-400 transition"
            title="Drag to reorder"
          >
            <GripVertical className="h-3.5 w-3.5" />
            <span className="font-pixel text-[0.45rem] tracking-widest">{def?.label?.toUpperCase() ?? id.toUpperCase()}</span>
          </button>

          {/* Hide button */}
          <button
            onClick={() => onHide(id)}
            className="flex items-center gap-1 rounded bg-zinc-800/90 px-1.5 py-0.5 text-zinc-400 hover:text-red-400 transition"
            title="Hide widget"
          >
            <EyeOff className="h-3 w-3" />
            <span className="font-pixel text-[0.35rem] tracking-widest">HIDE</span>
          </button>
        </div>
      )}

      {/* Subtle edit-mode border */}
      <div className={editMode ? 'ring-1 ring-zinc-700 ring-dashed rounded-sm' : ''}>
        {children}
      </div>
    </div>
  );
}
