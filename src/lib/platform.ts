// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Platform Detection Utility
// Detects whether the app is running inside a Capacitor WebView or a browser
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Returns true when the app is running inside the Capacitor native shell.
 * Works on both Android and iOS — checks the injected Capacitor bridge object.
 */
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;

  // Capacitor injects window.Capacitor on native platforms
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return !!(win.Capacitor?.isNativePlatform?.() ?? win.Capacitor?.isNative);
}

/**
 * Returns the current platform: 'android' | 'ios' | 'web'
 */
export function getPlatform(): 'android' | 'ios' | 'web' {
  if (typeof window === 'undefined') return 'web';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  const platform = win.Capacitor?.getPlatform?.();
  if (platform === 'android') return 'android';
  if (platform === 'ios') return 'ios';
  return 'web';
}

/**
 * Returns true on Android specifically (useful for Android‑only features like
 * the status bar theming or download APK logic).
 */
export function isAndroid(): boolean {
  return getPlatform() === 'android';
}

/**
 * Returns user-agent hint for analytics / conditional UI.
 */
export function getAppSource(): 'native-android' | 'native-ios' | 'pwa' | 'browser' {
  const platform = getPlatform();
  if (platform === 'android') return 'native-android';
  if (platform === 'ios') return 'native-ios';

  // Check if running in standalone (installed PWA)
  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone)
  ) {
    return 'pwa';
  }

  return 'browser';
}
