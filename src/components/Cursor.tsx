'use client';

// CSS-only pixelated cursor — pure native behaviour (text-select, drag,
// right-click, resize all work exactly as the OS cursor would).
// The SVG file lives at /public/icons/cursor.svg (12×20px, NW-pointing).
import { useEffect } from 'react';

export function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) return;
    document.body.classList.add('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, []);
  return null;
}
