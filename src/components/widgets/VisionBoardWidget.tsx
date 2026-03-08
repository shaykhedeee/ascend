'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Widget (Dashboard)
// Thumbnail preview of active vision board items; link to full studio
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';

interface VisionBoardImage {
  id: string;
  url?: string;
  src?: string;
  label?: string;
  text?: string;
  type?: string;
}

interface VisionBoardConfig {
  title?: string;
  images?: VisionBoardImage[];
  items?: VisionBoardImage[];
}

const PLACEHOLDER_COLORS = [
  'bg-zinc-800',
  'bg-zinc-900',
  'bg-zinc-800',
];

function ImageTile({ item, index }: { item: VisionBoardImage; index: number }) {
  const src = item.url || item.src;
  const label = item.label || item.text || '';

  if (src) {
    return (
      <div className="relative aspect-square overflow-hidden border border-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
        />
        {label && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
            <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-400 truncate">{label}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`aspect-square border border-zinc-900 flex items-center justify-center ${PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]}`}
    >
      {label ? (
        <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-600 text-center px-1">{label}</p>
      ) : (
        <span className="font-pixel text-[0.5rem] text-zinc-700">▓</span>
      )}
    </div>
  );
}

export default function VisionBoardWidget() {
  const boards = useQuery(api.visionBoards.list);

  const active = boards?.[0];
  let items: VisionBoardImage[] = [];
  let boardTitle = '';
  if (active?.config) {
    try {
      const cfg = JSON.parse(active.config) as VisionBoardConfig;
      boardTitle = cfg.title ?? '';
      items = (cfg.images || cfg.items || []).slice(0, 3);
    } catch {
      items = [];
      boardTitle = '';
    }
  }

  const hasItems = items.length > 0;

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center justify-between">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">VISION_BOARD</span>
        <Link
          href="/vision-board"
          className="font-pixel text-[0.4rem] tracking-widest text-zinc-700 hover:text-orange-500 transition-colors"
        >
          OPEN_STUDIO →
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col gap-3">
        {boards === undefined ? (
          <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700">LOADING_</p>
        ) : !active ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600 text-center">[ NO_VISION_BOARD ]</p>
            <Link
              href="/vision-board"
              className="font-pixel text-[0.4rem] tracking-widest px-3 py-1.5 border border-zinc-800 text-zinc-500 hover:border-orange-800 hover:text-orange-500 transition-colors"
            >
              CREATE_BOARD
            </Link>
          </div>
        ) : (
          <>
            {boardTitle && (
              <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-500 truncate">{boardTitle}</p>
            )}

            {hasItems ? (
              <div className="grid grid-cols-3 gap-1">
                {items.map((item, i) => (
                  <ImageTile key={item.id ?? i} item={item} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 text-center">[ BOARD_EMPTY ]</p>
              </div>
            )}

            <Link
              href="/vision-board"
              className="mt-auto w-full text-center font-pixel text-[0.4rem] tracking-widest py-1.5 border border-zinc-800 text-zinc-600 hover:border-orange-800 hover:text-orange-500 transition-colors block"
            >
              [ OPEN_STUDIO ]
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
