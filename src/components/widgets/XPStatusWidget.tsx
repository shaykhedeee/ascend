'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — XP & Gamification Status Widget (Dashboard)
// Level, XP progress, coins, achievement badges, recent activity feed
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Trophy, Award } from 'lucide-react';

export default function XPStatusWidget() {
  const profile = useQuery(api.gamification.getProfile);
  const xpHistory = useQuery(api.gamification.getXPHistory, { limit: 5 });

  const level = profile?.level ?? 1;
  const totalXP = profile?.totalXP ?? 0;
  const xpProgress = profile?.xpProgress ?? 0;
  const xpToNext = profile?.xpToNextLevel ?? 100;
  const levelName = profile?.levelName ?? 'Seedling';
  const coins = profile?.coins ?? 0;
  const tasksCompleted = profile?.totalTasksCompleted ?? 0;
  const habitsCompleted = profile?.totalHabitsCompleted ?? 0;
  const focusMins = profile?.totalFocusMinutes ?? 0;
  const achievements = profile?.achievements ?? [];

  return (
    <div className="border border-zinc-900 bg-zinc-950 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Trophy className="h-3.5 w-3.5 text-yellow-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-yellow-500">XP_STATUS</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">
          {coins} <span className="text-yellow-600">coins</span>
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Main XP + Level */}
        <div className="flex items-end justify-between">
          <div>
            <p className="font-terminal text-3xl font-bold text-zinc-100">{totalXP}</p>
            <p className="font-terminal text-xs text-zinc-500">total XP earned</p>
          </div>
          <div className="text-right">
            <p className="font-pixel text-[0.55rem] tracking-widest text-orange-400">LVL {level}</p>
            <p className="font-terminal text-sm text-zinc-300">{levelName}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-terminal text-xs text-zinc-500">Progress to next level</span>
            <span className="font-terminal text-xs text-orange-400">{xpProgress}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-orange-700 to-orange-500 transition-all duration-700"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="mt-1 font-terminal text-xs text-zinc-600">
            Next: Lvl {level + 1} at {xpToNext} XP
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-900">
          <div className="text-center">
            <p className="font-terminal text-lg font-bold text-zinc-100">{tasksCompleted}</p>
            <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">TASKS</p>
          </div>
          <div className="text-center">
            <p className="font-terminal text-lg font-bold text-zinc-100">{habitsCompleted}</p>
            <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">HABITS</p>
          </div>
          <div className="text-center">
            <p className="font-terminal text-lg font-bold text-zinc-100">{focusMins}m</p>
            <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">FOCUS</p>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="flex items-center gap-1 pt-2 border-t border-zinc-900">
            <Award className="h-3 w-3 text-zinc-500" />
            <span className="font-terminal text-xs text-zinc-400">
              {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
            </span>
            <div className="ml-auto flex -space-x-1">
              {achievements.slice(0, 5).map((a: any) => (
                <span key={a.id} title={a.name} className="text-sm">
                  {a.icon}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent XP feed (compact) */}
        {xpHistory && xpHistory.length > 0 && (
          <div className="pt-2 border-t border-zinc-900 space-y-1">
            <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">RECENT XP</p>
            {xpHistory.slice(0, 3).map((event: any) => (
              <div key={event._id} className="flex items-center gap-2">
                <span
                  className={`shrink-0 font-terminal text-xs font-bold ${
                    event.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {event.amount > 0 ? '+' : ''}
                  {event.amount}
                </span>
                <span className="truncate font-terminal text-xs text-zinc-400">{event.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
