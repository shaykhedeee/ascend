"use client";

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function RestoreArchivedCTA() {
  const restoreHabits = useMutation(api.habits.restoreArchivedOnUpgrade);
  const restoreGoals = useMutation(api.goals.restoreArchivedOnUpgrade);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={async () => {
          setResultMsg(null);
          setLoading(true);
          try {
            const [h, g] = await Promise.all([
              restoreHabits({ newPlan: 'pro' }),
              restoreGoals({ newPlan: 'pro' }),
            ]);
            const sum = (h ?? 0) + (g ?? 0);
            if (sum === 0) setResultMsg('No archived items to restore.');
            else setResultMsg(`Restored ${sum} item${sum !== 1 ? 's' : ''}.`);
          } catch (err) {
            setResultMsg(err instanceof Error ? err.message : String(err));
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-ascend-500/10 border border-ascend-500/20 text-ascend-400 hover:bg-ascend-500/20 transition-colors"
      >
        {loading ? 'Restoring…' : 'Restore archived items'}
      </button>
      {resultMsg && <span className="text-sm text-[var(--text-secondary)]">{resultMsg}</span>}
    </div>
  );
}
