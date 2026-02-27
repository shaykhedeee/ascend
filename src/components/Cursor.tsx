// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY - Premium Custom Cursor Component
// Elegant, smooth cursor with subtle animations
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device has a mouse
    const checkDevice = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Scroll by dragging with cursor
  useEffect(() => {
    if (isMobile) return;
    let isDragging = false;
    let lastY = 0;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || e.button === 0) {
        isDragging = true;
        lastY = e.clientY;
      }
    };
    const handleMouseUp = () => {
      isDragging = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaY = e.clientY - lastY;
        window.scrollBy({ top: -deltaY, behavior: 'smooth' });
        lastY = e.clientY;
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  const updatePosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    const target = e.target as HTMLElement;
    const computedStyle = window.getComputedStyle(target);
    
    // Check if hovering over clickable element
    setIsPointer(
      computedStyle.cursor === 'pointer' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.closest('button') !== null ||
      target.closest('a') !== null ||
      target.closest('[role="button"]') !== null ||
      target.getAttribute('onclick') !== null
    );
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Only hide native cursor AFTER hydration succeeds and listeners are attached
    document.body.classList.add('custom-cursor-active');

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, updatePosition]);

  // Don't render on mobile/touch devices
  if (isMobile) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999]",
          "transition-opacity duration-200",
          !isVisible && "opacity-0"
        )}
        style={{
          transform: `translate(${position.x - 8}px, ${position.y - 8}px)`,
        }}
      >
        <div 
          className={cn(
            "w-4 h-4 rounded-full bg-gradient-to-r from-ascend-500 via-yellow-400 to-purple-400",
            "transition-transform duration-150 ease-out",
            isClicking && "scale-75",
            isPointer && "scale-0"
          )}
          style={{
            boxShadow: '0 0 16px 4px rgba(249, 115, 22, 0.5)',
          }}
        />
      </div>
      {/* Cursor ring */}
      <div
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9998]",
          "transition-opacity duration-200",
          !isVisible && "opacity-0"
        )}
        style={{
          transform: `translate(${position.x - 24}px, ${position.y - 24}px)`,
          transition: 'transform 0.15s ease-out, opacity 0.2s',
        }}
      >
        <div 
          className={cn(
            "w-12 h-12 rounded-full border-2 border-ascend-500/40",
            "transition-all duration-200 ease-out",
            isPointer && "scale-150 border-ascend-500/60 bg-ascend-500/10",
            isClicking && "scale-90 border-ascend-500"
          )}
        />
      </div>

      {/* Hide default cursor only on body when custom cursor is active.
          Uses a class so the cursor stays visible until hydration succeeds. */}
      <style jsx global>{`
        body.custom-cursor-active,
        body.custom-cursor-active * {
          cursor: none !important;
        }
        
        @media (pointer: coarse), (hover: none) {
          body.custom-cursor-active,
          body.custom-cursor-active * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
