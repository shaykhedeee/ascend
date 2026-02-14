// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Notification Settings Component
// Configure push notifications and reminders
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  BellOff, 
  Flame, 
  Sun, 
  Moon,
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  scheduleDailyReminders,
  registerServiceWorker,
  startNotificationChecker,
} from '@/lib/notifications';

interface NotificationSettingsProps {
  morningTime: string;
  eveningTime: string;
  streakWarning: boolean;
  onMorningTimeChange: (time: string) => void;
  onEveningTimeChange: (time: string) => void;
  onStreakWarningChange: (enabled: boolean) => void;
}

export function NotificationSettings({
  morningTime,
  eveningTime,
  streakWarning,
  onMorningTimeChange,
  onEveningTimeChange,
  onStreakWarningChange,
}: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isPushSupported());
    setPermission(getNotificationPermission());

    // Register service worker and start notification checker
    if (isPushSupported()) {
      registerServiceWorker();
      if (getNotificationPermission() === 'granted') {
        startNotificationChecker();
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    const result = await requestNotificationPermission();
    setPermission(result);
    setIsRequesting(false);

    if (result === 'granted') {
      // Schedule initial reminders
      scheduleDailyReminders(morningTime, eveningTime, streakWarning);
      startNotificationChecker();
    }
  };

  const handleSaveSettings = () => {
    if (permission === 'granted') {
      scheduleDailyReminders(morningTime, eveningTime, streakWarning);
    }
  };

  if (!isSupported) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 text-themed-muted">
          <BellOff className="w-5 h-5" />
          <div>
            <p className="font-medium">Notifications Not Supported</p>
            <p className="text-sm">Your browser doesn&apos;t support push notifications.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className={cn(
        "p-4 rounded-xl border flex items-center gap-4",
        permission === 'granted' 
          ? "bg-green-500/10 border-green-500/30" 
          : permission === 'denied'
          ? "bg-red-500/10 border-red-500/30"
          : "bg-[var(--surface)] border-[var(--border)]"
      )}>
        {permission === 'granted' ? (
          <>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-themed">Notifications Enabled</p>
              <p className="text-sm text-themed-muted">You&apos;ll receive reminders and motivation.</p>
            </div>
            <Check className="w-5 h-5 text-green-400" />
          </>
        ) : permission === 'denied' ? (
          <>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <BellOff className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-themed">Notifications Blocked</p>
              <p className="text-sm text-themed-muted">Enable in browser settings to receive reminders.</p>
            </div>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-ascend-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-ascend-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-themed">Enable Notifications</p>
              <p className="text-sm text-themed-muted">Get daily reminders & streak alerts.</p>
            </div>
            <button
              onClick={handleEnableNotifications}
              disabled={isRequesting}
              className="btn-primary text-sm px-4 py-2"
            >
              {isRequesting ? 'Enabling...' : 'Enable'}
            </button>
          </>
        )}
      </div>

      {/* Notification Settings - Only show if granted */}
      {permission === 'granted' && (
        <div className="glass-card divide-y divide-[var(--border)]">
          {/* Morning Reminder */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Sun className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-themed">Morning Reminder</p>
                <p className="text-sm text-themed-muted">Start your day with intention</p>
              </div>
            </div>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => {
                onMorningTimeChange(e.target.value);
                handleSaveSettings();
              }}
              className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] 
                       text-themed text-sm focus:outline-none focus:border-ascend-500"
            />
          </div>

          {/* Evening Reminder */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-themed">Evening Check-in</p>
                <p className="text-sm text-themed-muted">Review your day&apos;s progress</p>
              </div>
            </div>
            <input
              type="time"
              value={eveningTime}
              onChange={(e) => {
                onEveningTimeChange(e.target.value);
                handleSaveSettings();
              }}
              className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] 
                       text-themed text-sm focus:outline-none focus:border-ascend-500"
            />
          </div>

          {/* Streak Warning */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-themed">Streak Warning</p>
                <p className="text-sm text-themed-muted">Alert at 10 PM if streak at risk</p>
              </div>
            </div>
            <button
              onClick={() => {
                onStreakWarningChange(!streakWarning);
                handleSaveSettings();
              }}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                streakWarning ? "bg-ascend-500" : "bg-[var(--border)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                streakWarning ? "translate-x-7" : "translate-x-1"
              )} />
            </button>
          </div>
        </div>
      )}

      {/* Info note */}
      <p className="text-xs text-themed-muted text-center">
        Notifications help you stay consistent. You can change these settings anytime.
      </p>
    </div>
  );
}

export default NotificationSettings;
