// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Haptic Feedback System
// Native Capacitor Haptics on Android, Web Vibration API fallback on browsers.
// ═══════════════════════════════════════════════════════════════════════════════

import { isNativeApp } from './platform';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export interface HapticConfig {
  enabled?: boolean;
  fallbackToAudio?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// VIBRATION PATTERNS (in milliseconds) — Web fallback
// ─────────────────────────────────────────────────────────────────────────────────

const VIBRATION_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  warning: [30, 30, 30],
  error: [50, 100, 50, 100, 50],
  selection: 5,
};

// ─────────────────────────────────────────────────────────────────────────────────
// LAZY-LOADED CAPACITOR HAPTICS
// ─────────────────────────────────────────────────────────────────────────────────

let _hapticsPlugin: typeof import('@capacitor/haptics').Haptics | null = null;
let _hapticsEnum: typeof import('@capacitor/haptics') | null = null;
let _hapticsLoaded = false;

async function loadCapacitorHaptics() {
  if (_hapticsLoaded) return;
  _hapticsLoaded = true;
  if (!isNativeApp()) return;
  try {
    const mod = await import('@capacitor/haptics');
    _hapticsPlugin = mod.Haptics;
    _hapticsEnum = mod;
  } catch {
    // Capacitor Haptics not available
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// HAPTIC FEEDBACK CLASS
// ─────────────────────────────────────────────────────────────────────────────────

class HapticFeedback {
  private enabled: boolean = true;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;
    // Pre-load Capacitor haptics on native
    if (typeof window !== 'undefined') {
      loadCapacitorHaptics();
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  canVibrate(): boolean {
    return this.enabled && (this.isSupported || !!_hapticsPlugin);
  }

  /**
   * Trigger haptic feedback — uses native Capacitor Haptics when available,
   * falls back to Web Vibration API.
   */
  vibrate(pattern: HapticPattern | number | number[]): boolean {
    if (!this.enabled) return false;

    // Resolve pattern to vibration array
    const vibrationPattern = typeof pattern === 'string'
      ? VIBRATION_PATTERNS[pattern]
      : pattern;

    // Try native Capacitor haptics first
    if (_hapticsPlugin && _hapticsEnum && typeof pattern === 'string') {
      this._nativeHaptic(pattern);
      return true;
    }

    // Web Vibration fallback
    if (this.isSupported) {
      try {
        return navigator.vibrate(vibrationPattern);
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Native Capacitor haptic feedback (fire-and-forget).
   */
  private _nativeHaptic(pattern: HapticPattern): void {
    if (!_hapticsPlugin || !_hapticsEnum) return;
    const { ImpactStyle, NotificationType } = _hapticsEnum;

    switch (pattern) {
      case 'light':
        _hapticsPlugin.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        _hapticsPlugin.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        _hapticsPlugin.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        _hapticsPlugin.notification({ type: NotificationType.Success });
        break;
      case 'warning':
        _hapticsPlugin.notification({ type: NotificationType.Warning });
        break;
      case 'error':
        _hapticsPlugin.notification({ type: NotificationType.Error });
        break;
      case 'selection':
        _hapticsPlugin.selectionStart();
        _hapticsPlugin.selectionChanged();
        _hapticsPlugin.selectionEnd();
        break;
    }
  }

  stop(): void {
    if (this.isSupported) {
      navigator.vibrate(0);
    }
  }

  // ─── Convenience methods ───────────────────────────────────────────────────

  light(): boolean { return this.vibrate('light'); }
  medium(): boolean { return this.vibrate('medium'); }
  heavy(): boolean { return this.vibrate('heavy'); }
  success(): boolean { return this.vibrate('success'); }
  warning(): boolean { return this.vibrate('warning'); }
  error(): boolean { return this.vibrate('error'); }
  selection(): boolean { return this.vibrate('selection'); }

  custom(pattern: number[]): boolean { return this.vibrate(pattern); }

  impact(intensity: 'light' | 'medium' | 'heavy' = 'medium'): boolean {
    return this.vibrate(intensity);
  }

  notification(type: 'success' | 'warning' | 'error' = 'success'): boolean {
    return this.vibrate(type);
  }

  /**
   * Celebration pattern — level up, milestone reached, streak milestone.
   * Fires a rapid burst of escalating haptics.
   */
  async celebration(): Promise<void> {
    if (!this.enabled) return;

    if (_hapticsPlugin && _hapticsEnum) {
      const { ImpactStyle } = _hapticsEnum;
      await _hapticsPlugin.impact({ style: ImpactStyle.Light });
      await _delay(60);
      await _hapticsPlugin.impact({ style: ImpactStyle.Medium });
      await _delay(60);
      await _hapticsPlugin.impact({ style: ImpactStyle.Heavy });
      await _delay(100);
      await _hapticsPlugin.impact({ style: ImpactStyle.Heavy });
    } else if (this.isSupported) {
      navigator.vibrate([10, 60, 20, 60, 30, 100, 30]);
    }
  }
}

function _delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
