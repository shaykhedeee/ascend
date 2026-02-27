// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex Cron Jobs
// Morning digest (Telegram), reminder delivery
// ═══════════════════════════════════════════════════════════════════════════════

import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// ── Morning digest: every day at 07:00 UTC ────────────────────────────────────
// The webhook handler fetches each user's summary and sends it via Telegram
// Users who haven't linked Telegram are silently skipped
crons.daily(
  'telegram-morning-digest',
  { hourUTC: 7, minuteUTC: 0 },
  internal.telegramActions.sendMorningDigests
);

// ── Reminder delivery: check every 5 minutes for due reminders ───────────────
crons.interval(
  'deliver-reminders',
  { minutes: 5 },
  internal.telegramActions.deliverDueReminders
);

export default crons;
