// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - PWA Install Prompt
// Smart install prompt for Progressive Web App
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap, Bell, Wifi } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    // Check for iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay (let user interact first)
      setTimeout(() => setShowPrompt(true), 30000); // 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS prompt after delay
    if (isIOSDevice && !isInstalled) {
      setTimeout(() => setShowPrompt(true), 60000); // 1 minute for iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if installed, dismissed, or no prompt available (and not iOS)
  if (isInstalled || dismissed || (!showPrompt)) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 
                  animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="glass-card p-4 shadow-2xl border border-ascend-500/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                          flex items-center justify-center shadow-glow-sm">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-themed">Install Ascendify</h3>
              <p className="text-sm text-themed-muted">Get the full app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-[var(--card-hover)] text-themed-muted transition-colors"
            title="Dismiss"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[var(--card-hover)]">
            <Zap className="w-4 h-4 text-ascend-400" />
            <span className="text-xs text-themed-muted text-center">Faster</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[var(--card-hover)]">
            <Wifi className="w-4 h-4 text-ascend-400" />
            <span className="text-xs text-themed-muted text-center">Offline</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[var(--card-hover)]">
            <Bell className="w-4 h-4 text-ascend-400" />
            <span className="text-xs text-themed-muted text-center">Reminders</span>
          </div>
        </div>

        {/* Action */}
        {isIOS ? (
          <div className="p-3 bg-[var(--card-hover)] rounded-lg">
            <p className="text-sm text-themed-secondary">
              Tap <span className="inline-flex items-center px-1 py-0.5 bg-[var(--card)] rounded mx-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </span> then <strong>&quot;Add to Home Screen&quot;</strong>
            </p>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full py-3 bg-gradient-to-r from-ascend-500 to-ascend-600 text-white rounded-xl 
                     font-semibold flex items-center justify-center gap-2 shadow-glow-md hover:shadow-glow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Install App
          </button>
        )}
      </div>
    </div>
  );
}
