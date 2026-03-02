// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — App Update Checker
// Checks /api/app/version on launch to see if a new APK is available.
// Shows a non-intrusive toast that links to the download page.
// Only runs inside the native Capacitor shell.
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState, useCallback } from 'react';
import { isNativeApp } from '@/lib/platform';

/** Must match the shape returned by /api/app/version */
interface VersionInfo {
  version: string;
  versionCode: number;
  downloadUrl: string;
  releaseNotes: string[];
  size: string;
}

/** Hardcoded version baked into the APK at build time */
const CURRENT_VERSION_CODE = 1;

/** How often to check (4 hours) */
const CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000;

/** localStorage key to throttle checks */
const LAST_CHECK_KEY = 'resurgo_update_check';
const DISMISSED_VERSION_KEY = 'resurgo_dismissed_version';

export function AppUpdateChecker() {
  const [update, setUpdate] = useState<VersionInfo | null>(null);
  const [visible, setVisible] = useState(false);

  const checkForUpdate = useCallback(async () => {
    if (!isNativeApp()) return;

    // Throttle: don't check more than once per interval
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    if (lastCheck && Date.now() - parseInt(lastCheck, 10) < CHECK_INTERVAL_MS) {
      return;
    }

    try {
      const res = await fetch('/api/app/version', { cache: 'no-store' });
      if (!res.ok) return;

      const data: VersionInfo = await res.json();
      localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());

      // Check if this version was already dismissed
      const dismissed = localStorage.getItem(DISMISSED_VERSION_KEY);
      if (dismissed === data.version) return;

      // Compare version codes
      if (data.versionCode > CURRENT_VERSION_CODE) {
        setUpdate(data);
        setVisible(true);
      }
    } catch {
      // Silent fail — no connectivity is fine
    }
  }, []);

  useEffect(() => {
    // Check after a brief delay so the app loads first
    const timer = setTimeout(checkForUpdate, 3000);
    return () => clearTimeout(timer);
  }, [checkForUpdate]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (update) {
      localStorage.setItem(DISMISSED_VERSION_KEY, update.version);
    }
  }, [update]);

  const handleUpdate = useCallback(() => {
    if (!update) return;
    // Open APK download URL — triggers system download manager
    window.open(update.downloadUrl, '_system');
    setVisible(false);
  }, [update]);

  if (!visible || !update) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] animate-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-gray-900 to-gray-800 p-4 shadow-2xl shadow-emerald-500/10">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Update Available</p>
              <p className="text-xs text-gray-400">v{update.version} · {update.size}</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
            aria-label="Dismiss update"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Release notes */}
        {update.releaseNotes.length > 0 && (
          <ul className="mb-3 space-y-0.5 pl-4 text-xs text-gray-300">
            {update.releaseNotes.slice(0, 3).map((note, i) => (
              <li key={i} className="list-disc">{note}</li>
            ))}
          </ul>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={dismiss}
            className="flex-1 rounded-xl border border-gray-600 px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-400 active:scale-95"
          >
            Download Update
          </button>
        </div>
      </div>
    </div>
  );
}
