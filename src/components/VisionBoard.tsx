'use client';

import { useState, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CheckCircle, RefreshCw, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types (mirrors VisionBoardConfig)
// ─────────────────────────────────────────────────────────────────────────────

interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imageData: string | null;
  imagePrompt: string;
  affirmation: string;
  category: string;
  progress: number;
  position: number;
}

interface VisionBoardTheme {
  colorPalette: string[];
  mood: string;
  fontStyle: string;
  layoutStyle: 'grid' | 'collage' | 'minimal' | 'mosaic';
}

interface VisionBoardConfig {
  title: string;
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string;
  generatedAt: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  HEALTH: '💪',
  CAREER: '🚀',
  PERSONAL: '🌱',
  FINANCE: '💰',
  LEARNING: '📚',
  RELATIONSHIP: '❤️',
};

// ─────────────────────────────────────────────────────────────────────────────
// VisionBoard Component
// ─────────────────────────────────────────────────────────────────────────────

interface VisionBoardProps {
  canRegenerate?: boolean; // Pro users can regenerate indefinitely
}

export function VisionBoard({ canRegenerate = false }: VisionBoardProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePanelIndex, setActivePanelIndex] = useState<number | null>(null);

  const boardDoc = useQuery((api as any).visionBoards.getActive, {});
  const board: VisionBoardConfig | null = boardDoc ? JSON.parse((boardDoc as any).config) : null;

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/vision-board/generate', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error ?? `HTTP ${res.status}`);
      }
      // Board appears in real-time via Convex subscription (boardDoc will update)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }, []);

  const activePanel = activePanelIndex !== null ? board?.panels[activePanelIndex] : null;
  const primaryColor = board?.theme.colorPalette[0] ?? '#6366f1';
  const secondaryColor = board?.theme.colorPalette[1] ?? '#8b5cf6';

  const layoutClass: Record<string, string> = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    collage: 'flex flex-wrap gap-3',
    minimal: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    mosaic: 'grid grid-cols-3 gap-2',
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] 
                      border border-dashed border-zinc-700 rounded-xl p-8 bg-zinc-900/40">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Your Vision Board</h2>
        <p className="text-zinc-400 text-center mb-6 max-w-sm text-sm leading-relaxed">
          AI generates a personalized vision board from your goals, psychology
          profile, and personality type. Custom images. Personal affirmations.
          Real-time progress tracking.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-black
                     transition-all disabled:opacity-60 disabled:cursor-wait"
          style={{ backgroundColor: primaryColor }}
        >
          {generating ? (
            <><RefreshCw size={16} className="animate-spin" /> Generating your board…</>
          ) : (
            <><Sparkles size={16} /> Generate My Vision Board</>
          )}
        </button>
        {generating && (
          <p className="text-zinc-500 text-xs mt-3 text-center">
            Creating personalised images… this takes 30–60 seconds.
          </p>
        )}
        {error && (
          <p className="text-red-400 text-xs mt-3 text-center">{error}</p>
        )}
      </div>
    );
  }

  // ── Full board ──────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}18, ${secondaryColor}10)`,
        border: `1px solid ${primaryColor}30`,
      }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: primaryColor }}
        >
          {board.title}
        </h2>
        <p className="text-zinc-300 text-base italic">"{board.centerAffirmation}"</p>
        <p className="text-zinc-600 text-xs">
          Generated {new Date(board.generatedAt).toLocaleDateString()} · {board.theme.mood}
        </p>
      </div>

      {/* Panels */}
      <div className={layoutClass[board.theme.layoutStyle] ?? layoutClass.grid}>
        {board.panels
          .sort((a, b) => a.position - b.position)
          .map((panel, idx) => (
            <PanelCard
              key={panel.id}
              panel={panel}
              accentColor={board.theme.colorPalette[idx % board.theme.colorPalette.length]}
              onClick={() => setActivePanelIndex(idx)}
            />
          ))}
      </div>

      {/* Regenerate (Pro only) */}
      {canRegenerate && (
        <div className="text-center pt-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 mx-auto text-sm text-zinc-500 
                       hover:text-zinc-300 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Regenerating…' : 'Regenerate board'}
          </button>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      )}

      {/* Panel detail modal */}
      {activePanel && (
        <PanelModal
          panel={activePanel}
          panels={board.panels}
          currentIndex={activePanelIndex!}
          colorPalette={board.theme.colorPalette}
          onClose={() => setActivePanelIndex(null)}
          onPrev={() => setActivePanelIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setActivePanelIndex((i) => Math.min(board.panels.length - 1, (i ?? 0) + 1))}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel Card
// ─────────────────────────────────────────────────────────────────────────────

function PanelCard({
  panel,
  accentColor,
  onClick,
}: {
  panel: VisionBoardPanel;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-lg overflow-hidden group cursor-pointer 
                 border border-zinc-800 hover:border-zinc-600 transition-all
                 hover:scale-[1.02] hover:shadow-lg aspect-square"
    >
      {/* Image */}
      {panel.imageData ? (
        <img
          src={panel.imageData}
          alt={panel.goalTitle}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-2"
          style={{ background: `${accentColor}20` }}
        >
          <span className="text-3xl">{CATEGORY_ICONS[panel.category] ?? '🎯'}</span>
          <p className="text-zinc-400 text-xs text-center px-3 leading-tight">
            {panel.goalTitle}
          </p>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                   flex flex-col justify-end p-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}
      >
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: accentColor }}>
            {CATEGORY_ICONS[panel.category]} {panel.category}
          </span>
        </div>
        <h3 className="text-white font-bold text-xs leading-tight mb-1 line-clamp-2">
          {panel.goalTitle}
        </h3>
        <p className="text-zinc-300 text-[10px] italic line-clamp-2">
          "{panel.affirmation}"
        </p>
        {/* Progress bar */}
        <div className="mt-2">
          <div className="h-0.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${panel.progress}%`, backgroundColor: accentColor }}
            />
          </div>
          <span className="text-[10px] text-zinc-600 mt-0.5 block">{panel.progress}% complete</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel Detail Modal
// ─────────────────────────────────────────────────────────────────────────────

function PanelModal({
  panel,
  panels,
  currentIndex,
  colorPalette,
  onClose,
  onPrev,
  onNext,
}: {
  panel: VisionBoardPanel;
  panels: VisionBoardPanel[];
  currentIndex: number;
  colorPalette: string[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const accentColor = colorPalette[currentIndex % colorPalette.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 rounded-2xl max-w-lg w-full mx-4 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="aspect-square w-full">
          {panel.imageData ? (
            <img src={panel.imageData} alt={panel.goalTitle} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${accentColor}20` }}
            >
              <span className="text-6xl">{CATEGORY_ICONS[panel.category] ?? '🎯'}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>
              {CATEGORY_ICONS[panel.category]} {panel.category}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg">{panel.goalTitle}</h3>
          <p className="text-zinc-300 italic text-sm">"{panel.affirmation}"</p>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Progress</span>
              <span className="flex items-center gap-1">
                {panel.progress === 100 && <CheckCircle size={12} className="text-green-400" />}
                {panel.progress}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${panel.progress}%`, backgroundColor: accentColor }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 pb-4">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 transition"
          >
            <ChevronLeft size={16} className="text-zinc-300" />
          </button>
          <span className="text-zinc-600 text-xs">{currentIndex + 1} / {panels.length}</span>
          <button
            onClick={onNext}
            disabled={currentIndex === panels.length - 1}
            className="p-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 transition"
          >
            <ChevronRight size={16} className="text-zinc-300" />
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 transition"
        >
          <span className="text-white text-xs leading-none">✕</span>
        </button>
      </div>
    </div>
  );
}

export default VisionBoard;
