'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Settings Page
// Profile, schedule, notifications, theme preferences
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Clock,
  Bell,
  Palette,
  Save,
  Check,
} from 'lucide-react';

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
      <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <Icon className="h-4 w-4 text-ascend-400" /> {title}
      </h2>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const currentUser = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateSchedule = useMutation(api.users.updateSchedule);
  const updateNotifPrefs = useMutation(api.users.updateNotificationPrefs);

  // Profile fields
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [profileSaved, setProfileSaved] = useState(false);

  // Schedule fields
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [peakTime, setPeakTime] = useState('morning');
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Notification fields
  const [morningMotivation, setMorningMotivation] = useState(true);
  const [middayCheckin, setMiddayCheckin] = useState(true);
  const [eveningWinddown, setEveningWinddown] = useState(true);
  const [reminderStyle, setReminderStyle] = useState<'gentle' | 'supportive' | 'persistent' | 'minimal'>('supportive');
  const [coachingFrequency, setCoachingFrequency] = useState<'daily' | 'weekly' | 'struggling_only' | 'manual'>('daily');
  const [notifSaved, setNotifSaved] = useState(false);

  // Initialize from current user
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name ?? clerkUser?.fullName ?? '');
      setTimezone(currentUser.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
      setTheme((currentUser as any).theme ?? 'dark');
      setWakeTime((currentUser as any).wakeTime ?? '07:00');
      setSleepTime((currentUser as any).sleepTime ?? '23:00');
      setPeakTime((currentUser as any).peakProductivityTime ?? 'morning');

      const prefs = (currentUser as any).notificationPrefs;
      if (prefs) {
        setMorningMotivation(prefs.morningMotivation ?? true);
        setMiddayCheckin(prefs.middayCheckin ?? true);
        setEveningWinddown(prefs.eveningWinddown ?? true);
        setReminderStyle(prefs.reminderStyle ?? 'supportive');
        setCoachingFrequency(prefs.coachingFrequency ?? 'daily');
      }
    }
  }, [currentUser, clerkUser]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, timezone, theme });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      await updateSchedule({
        wakeTime,
        sleepTime,
        peakProductivityTime: peakTime,
      });
      setScheduleSaved(true);
      setTimeout(() => setScheduleSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save schedule:', e);
    }
  };

  const handleSaveNotifs = async () => {
    try {
      await updateNotifPrefs({
        prefs: {
          morningMotivation,
          middayCheckin,
          eveningWinddown,
          reminderStyle,
          coachingFrequency,
        },
      });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save notification prefs:', e);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ascend-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-orange-400" /> Settings
      </h1>

      {/* Profile */}
      <SettingsSection icon={User} title="Profile">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Email</label>
            <p className="text-sm text-[var(--text-secondary)]">{clerkUser?.primaryEmailAddress?.emailAddress ?? '-'}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
            >
              {Intl.supportedValuesOf('timeZone').map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Plan</label>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              currentUser.plan === 'lifetime' ? 'bg-purple-500/20 text-purple-400' :
              currentUser.plan === 'pro' ? 'bg-ascend-500/20 text-ascend-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {currentUser.plan?.toUpperCase() ?? 'FREE'}
            </span>
          </div>
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600"
          >
            {profileSaved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Profile</>}
          </button>
        </div>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection icon={Palette} title="Appearance">
        <div className="flex gap-3">
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                theme === t
                  ? 'bg-ascend-500 text-white'
                  : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Schedule */}
      <SettingsSection icon={Clock} title="Schedule">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Sleep Time</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Peak Productivity</label>
            <select
              value={peakTime}
              onChange={(e) => setPeakTime(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="late_night">Late Night</option>
            </select>
          </div>
          <button
            onClick={handleSaveSchedule}
            className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600"
          >
            {scheduleSaved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Schedule</>}
          </button>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications">
        <div className="space-y-4">
          {[
            { label: 'Morning Motivation', value: morningMotivation, setter: setMorningMotivation },
            { label: 'Midday Check-in', value: middayCheckin, setter: setMiddayCheckin },
            { label: 'Evening Wind-down', value: eveningWinddown, setter: setEveningWinddown },
          ].map(({ label, value, setter }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-primary)]">{label}</span>
              <button
                onClick={() => setter(!value)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  value ? 'bg-ascend-500' : 'bg-[var(--border)]'
                }`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  value ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Reminder Style</label>
            <select
              value={reminderStyle}
              onChange={(e) => setReminderStyle(e.target.value as typeof reminderStyle)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
            >
              <option value="gentle">Gentle</option>
              <option value="supportive">Supportive</option>
              <option value="persistent">Persistent</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Coaching Frequency</label>
            <select
              value={coachingFrequency}
              onChange={(e) => setCoachingFrequency(e.target.value as typeof coachingFrequency)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="struggling_only">When Struggling</option>
              <option value="manual">Manual Only</option>
            </select>
          </div>

          <button
            onClick={handleSaveNotifs}
            className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600"
          >
            {notifSaved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Notifications</>}
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
