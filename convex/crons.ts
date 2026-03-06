// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex Cron Jobs
// Morning digest & reminder delivery via Telegram + FCM push
// ═══════════════════════════════════════════════════════════════════════════════

import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// ── Morning digest (Telegram): every day at 07:00 UTC ─────────────────────────
crons.daily(
  'telegram-morning-digest',
  { hourUTC: 7, minuteUTC: 0 },
  internal.telegramActions.sendMorningDigests
);

// ── Morning digest (FCM Push): every day at 07:00 UTC ─────────────────────────
crons.daily(
  'push-morning-digest',
  { hourUTC: 7, minuteUTC: 0 },
  internal.pushNotifications.sendMorningDigestsPush
);

// ── Reminder delivery (Telegram): check every 5 minutes ──────────────────────
crons.interval(
  'deliver-reminders-telegram',
  { minutes: 5 },
  internal.telegramActions.deliverDueReminders
);

// ── Reminder delivery (FCM Push): check every 5 minutes ──────────────────────
crons.interval(
  'deliver-reminders-push',
  { minutes: 5 },
  internal.pushNotifications.deliverDueRemindersPush
);

// ── Lifecycle email automation: every day at 09:00 UTC ────────────────────────
crons.daily(
  'lifecycle-email-automation',
  { hourUTC: 9, minuteUTC: 0 },
  internal.emailAutomation.processLifecycleEmails
);

export default crons;
