// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Premium Custom Cursor Component
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

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
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
          transform: `translate(${position.x - 5}px, ${position.y - 5}px)`,
        }}
      >
        <div 
          className={cn(
            "w-2.5 h-2.5 rounded-full bg-ascend-500",
            "transition-transform duration-150 ease-out",
            isClicking && "scale-75",
            isPointer && "scale-0"
          )}
          style={{
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)',
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
          transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          transition: 'transform 0.15s ease-out, opacity 0.2s',
        }}
      >
        <div 
          className={cn(
            "w-10 h-10 rounded-full border-2 border-ascend-500/40",
            "transition-all duration-200 ease-out",
            isPointer && "scale-150 border-ascend-500/60 bg-ascend-500/10",
            isClicking && "scale-90 border-ascend-500"
          )}
        />
      </div>

      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @media (pointer: coarse), (hover: none) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
