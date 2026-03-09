'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Activity Feed Widget (Dashboard)
// Recent XP history events in a scrollable feed
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { TrendingUp } from 'lucide-react';

const SOURCE_ICONS: Record<string, { icon: string; color: string }> = {
  task_complete: { icon: '✓', color: 'text-emerald-500' },
  habit_complete: { icon: '⚡', color: 'text-orange-500' },
  goal_complete: { icon: '🎯', color: 'text-cyan-500' },
  milestone_complete: { icon: '🏁', color: 'text-violet-500' },
  focus_session: { icon: '🧠', color: 'text-amber-500' },
  streak_bonus: { icon: '🔥', color: 'text-red-500' },
  achievement: { icon: '🏆', color: 'text-yellow-500' },
  daily_login: { icon: '📅', color: 'text-blue-500' },
  weekly_review: { icon: '📊', color: 'text-pink-500' },
  perfect_day: { icon: '⭐', color: 'text-yellow-400' },
  comeback: { icon: '💪', color: 'text-green-500' },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function ActivityFeedWidget() {
  const xpHistory = useQuery(api.gamification.getXPHistory, { limit: 10 });

  return (
    <div className="border border-zinc-900 bg-zinc-950 h-full">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-emerald-500">ACTIVITY_FEED</span>
      </div>
      <div className="p-2 max-h-[300px] overflow-y-auto">
        {!xpHistory || xpHistory.length === 0 ? (
          <div className="p-4 text-center">
            <p className="font-terminal text-sm text-zinc-400">No activity yet</p>
            <p className="font-terminal text-xs text-zinc-600 mt-1">
              Complete tasks and habits to see your XP feed
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {xpHistory.map((event: any) => {
              const info = SOURCE_ICONS[event.source] ?? { icon: '•', color: 'text-zinc-500' };
              return (
                <div
                  key={event._id}
                  className="flex items-center gap-2 px-3 py-2 border border-transparent hover:border-zinc-800 hover:bg-zinc-900 transition"
                >
                  <span
                    className={`shrink-0 font-terminal text-sm font-bold ${
                      event.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {event.amount > 0 ? '+' : ''}
                    {event.amount}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-terminal text-xs text-zinc-300">{event.description}</p>
                    <p className="font-terminal text-xs text-zinc-600">{timeAgo(event.createdAt)}</p>
                  </div>
                  <span className={`text-sm ${info.color}`} title={event.source}>
                    {info.icon}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
