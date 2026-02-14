// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Haptic Feedback Utilities
// Vibration API wrapper for mobile haptic feedback
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export interface HapticConfig {
  enabled?: boolean;
  fallbackToAudio?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// VIBRATION PATTERNS (in milliseconds)
// ─────────────────────────────────────────────────────────────────────────────────

const VIBRATION_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20], // Short-pause-medium
  warning: [30, 30, 30], // Three short pulses
  error: [50, 100, 50, 100, 50], // Long error pattern
  selection: 5, // Very light tap
};

// ─────────────────────────────────────────────────────────────────────────────────
// HAPTIC FEEDBACK CLASS
// ─────────────────────────────────────────────────────────────────────────────────

class HapticFeedback {
  private enabled: boolean = true;
  private isSupported: boolean = false;
  
  constructor() {
    // Check if Vibration API is supported
    this.isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;
  }
  
  /**
   * Enable or disable haptic feedback
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Check if haptic feedback is enabled and supported
   */
  canVibrate(): boolean {
    return this.enabled && this.isSupported;
  }
  
  /**
   * Trigger a haptic feedback pattern
   */
  vibrate(pattern: HapticPattern | number | number[]): boolean {
    if (!this.canVibrate()) {
      return false;
    }
    
    try {
      const vibrationPattern = typeof pattern === 'string'
        ? VIBRATION_PATTERNS[pattern]
        : pattern;
      
      return navigator.vibrate(vibrationPattern);
    } catch {
      return false;
    }
  }
  
  /**
   * Stop any ongoing vibration
   */
  stop(): void {
    if (this.isSupported) {
      navigator.vibrate(0);
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CONVENIENCE METHODS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Light tap feedback (for selections, toggles)
   */
  light(): boolean {
    return this.vibrate('light');
  }
  
  /**
   * Medium tap feedback (for confirmations)
   */
  medium(): boolean {
    return this.vibrate('medium');
  }
  
  /**
   * Heavy tap feedback (for important actions)
   */
  heavy(): boolean {
    return this.vibrate('heavy');
  }
  
  /**
   * Success feedback (for completed actions)
   */
  success(): boolean {
    return this.vibrate('success');
  }
  
  /**
   * Warning feedback (for alerts)
   */
  warning(): boolean {
    return this.vibrate('warning');
  }
  
  /**
   * Error feedback (for errors)
   */
  error(): boolean {
    return this.vibrate('error');
  }
  
  /**
   * Selection feedback (very light, for UI selections)
   */
  selection(): boolean {
    return this.vibrate('selection');
  }
  
  /**
   * Custom vibration pattern
   */
  custom(pattern: number[]): boolean {
    return this.vibrate(pattern);
  }
  
  /**
   * Impact feedback with intensity
   */
  impact(intensity: 'light' | 'medium' | 'heavy' = 'medium'): boolean {
    return this.vibrate(intensity);
  }
  
  /**
   * Notification feedback
   */
  notification(type: 'success' | 'warning' | 'error' = 'success'): boolean {
    return this.vibrate(type);
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────────────────────────────────────────

export const haptics = new HapticFeedback();

// ─────────────────────────────────────────────────────────────────────────────────
// REACT HOOK
// ─────────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from 'react';

export function useHaptics(config: HapticConfig = {}): {
  vibrate: (pattern: HapticPattern | number | number[]) => boolean;
  light: () => boolean;
  medium: () => boolean;
  heavy: () => boolean;
  success: () => boolean;
  warning: () => boolean;
  error: () => boolean;
  selection: () => boolean;
  isSupported: boolean;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
} {
  const [isEnabled, setIsEnabledState] = useState(config.enabled ?? true);
  const [isSupported] = useState(() => 
    typeof window !== 'undefined' && 'vibrate' in navigator
  );
  
  useEffect(() => {
    haptics.setEnabled(isEnabled);
  }, [isEnabled]);
  
  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabledState(enabled);
    haptics.setEnabled(enabled);
  }, []);
  
  const vibrate = useCallback((pattern: HapticPattern | number | number[]) => {
    return haptics.vibrate(pattern);
  }, []);
  
  return {
    vibrate,
    light: useCallback(() => haptics.light(), []),
    medium: useCallback(() => haptics.medium(), []),
    heavy: useCallback(() => haptics.heavy(), []),
    success: useCallback(() => haptics.success(), []),
    warning: useCallback(() => haptics.warning(), []),
    error: useCallback(() => haptics.error(), []),
    selection: useCallback(() => haptics.selection(), []),
    isSupported,
    isEnabled,
    setEnabled,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Trigger haptic on element click/tap
 */
export function withHaptic<T extends HTMLElement>(
  callback: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void,
  pattern: HapticPattern = 'light'
): (e: React.MouseEvent<T> | React.TouchEvent<T>) => void {
  return (e) => {
    haptics.vibrate(pattern);
    callback(e);
  };
}

/**
 * Create a haptic-enabled onClick handler
 */
export function hapticClick(
  callback: () => void,
  pattern: HapticPattern = 'light'
): () => void {
  return () => {
    haptics.vibrate(pattern);
    callback();
  };
}

export default haptics;
