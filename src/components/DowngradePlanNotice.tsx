'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — Downgrade Plan Notice
// Shows a dismissible banner when a user has items archived due to plan downgrade
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';
import Link from 'next/link';
import { X, Archive, ArrowRight, Sparkles } from 'lucide-react';

export function DowngradePlanNotice() {
  const [dismissed, setDismissed] = useState(false);
  const archivedHabitCount = useQuery(api.habits.getArchivedDowngradeCount);
  const archivedGoalCount = useQuery(api.goals.getArchivedDowngradeCount);

  const restoreHabits = useMutation(api.habits.restoreArchivedOnUpgrade);
  const restoreGoals = useMutation(api.goals.restoreArchivedOnUpgrade);
  const [restoring, setRestoring] = useState(false);
  const [restoredCount, setRestoredCount] = useState<number | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Don't render until data loads
  if (archivedHabitCount === undefined || archivedGoalCount === undefined) return null;

  const totalArchived = (archivedHabitCount ?? 0) + (archivedGoalCount ?? 0);

  // Nothing archived by downgrade — don't show banner
  if (totalArchived === 0 || dismissed) return null;

  const parts: string[] = [];
  if (archivedHabitCount > 0)
    parts.push(`${archivedHabitCount} habit${archivedHabitCount !== 1 ? 's' : ''}`);
  if (archivedGoalCount > 0)
    parts.push(`${archivedGoalCount} goal${archivedGoalCount !== 1 ? 's' : ''}`);
  const summary = parts.join(' and ');

  return (
    <div className="relative flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      {/* Icon */}
      <Archive className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

      {/* Message */}
      <div className="flex-1">
        <p className="font-medium text-amber-300">
          {summary} archived after plan downgrade
        </p>
        <p className="mt-0.5 text-amber-400/80">
          Upgrade to Pro to instantly restore all your data and continue where you left off.
        </p>
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            Open billing
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={async () => {
              setRestoreError(null);
              setRestoredCount(null);
              setRestoring(true);
              try {
                const [h, g] = await Promise.all([
                  restoreHabits({ newPlan: 'pro' }),
                  restoreGoals({ newPlan: 'pro' }),
                ]);
                const sum = (h ?? 0) + (g ?? 0);
                setRestoredCount(sum);
              } catch (err) {
                setRestoreError(err instanceof Error ? err.message : String(err));
              } finally {
                setRestoring(false);
              }
            }}
            disabled={restoring}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/5 transition-colors"
          >
            {restoring ? 'Restoring…' : 'Attempt restore now'}
          </button>

          <Link
            href="/settings"
            className="text-xs text-amber-400/70 hover:text-amber-300 transition-colors underline underline-offset-2"
          >
            View archived items
          </Link>
        </div>
        {restoredCount !== null && (
          <p className="mt-2 text-xs text-emerald-400">Restored {restoredCount} item{restoredCount !== 1 ? 's' : ''}.</p>
        )}
        {restoreError && (
          <p className="mt-2 text-xs text-rose-400">Failed to restore: {restoreError}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="mt-0.5 rounded-md p-0.5 text-amber-400/60 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
