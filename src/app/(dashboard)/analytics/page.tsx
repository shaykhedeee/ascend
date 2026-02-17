'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Analytics Page
// Gamification profile, habit stats, focus stats, progress charts
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Clock,
  Star,
  BarChart3,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function AnalyticsPage() {
  const profile = useQuery(api.gamification.getProfile);
  const focusStats = useQuery(api.focusSessions.getStats, {});

  if (!profile || !focusStats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ascend-500 border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { icon: Star, label: 'Level', value: `${profile.level}`, sub: profile.levelName, color: 'text-yellow-400' },
    { icon: Zap, label: 'Total XP', value: profile.totalXP.toLocaleString(), sub: `${profile.xpToNextLevel} to next`, color: 'text-ascend-400' },
    { icon: Flame, label: 'Current Streak', value: `${profile.currentStreak}d`, sub: `Best: ${profile.longestStreak}d`, color: 'text-red-400' },
    { icon: Trophy, label: 'Achievements', value: `${profile.achievements.length}`, sub: '', color: 'text-purple-400' },
    { icon: Target, label: 'Goals Completed', value: `${profile.totalGoalsCompleted}`, sub: '', color: 'text-green-400' },
    { icon: BarChart3, label: 'Tasks Done', value: `${profile.totalTasksCompleted}`, sub: '', color: 'text-blue-400' },
    { icon: Clock, label: 'Focus Hours', value: `${focusStats.totalHours}h`, sub: `${focusStats.totalSessions} sessions`, color: 'text-cyan-400' },
    { icon: TrendingUp, label: 'Habits Done', value: `${profile.totalHabitsCompleted}`, sub: '', color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-orange-400" /> Analytics
      </h1>

      {/* XP Progress Bar */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              Level {profile.level} — {profile.levelName}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">{profile.tier} Tier</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-ascend-400">{profile.totalXP.toLocaleString()} XP</p>
            <p className="text-xs text-[var(--text-secondary)]">{profile.xpToNextLevel} to Level {profile.level + 1}</p>
          </div>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--background)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-ascend-400 transition-all"
            style={{ width: `${Math.min(profile.xpProgress * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs text-[var(--text-secondary)]">{label}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            {sub && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Focus Breakdown */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1">
            <Clock className="h-4 w-4 text-cyan-400" /> Focus Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Total Sessions</span>
              <span className="font-medium text-[var(--text-primary)]">{focusStats.totalSessions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Total Minutes</span>
              <span className="font-medium text-[var(--text-primary)]">{focusStats.totalMinutes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Avg Session</span>
              <span className="font-medium text-[var(--text-primary)]">{focusStats.avgMinutes} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Avg Focus Score</span>
              <span className="font-bold text-ascend-400">{focusStats.avgFocusScore || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Total Distractions</span>
              <span className="font-medium text-red-400">{focusStats.totalDistractions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Best Day Streak</span>
              <span className="font-medium text-[var(--text-primary)]">{focusStats.bestStreak} days</span>
            </div>

            {/* By type */}
            <div className="pt-3 border-t border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">By Method</p>
              {Object.entries(focusStats.byType).map(([key, count]) =>
                count > 0 ? (
                  <div key={key} className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)] capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-[var(--text-primary)]">{count}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Habit & Goal Stats */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Habit &amp; Goal Insights
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Habits Completed</span>
              <span className="font-medium text-[var(--text-primary)]">{profile.totalHabitsCompleted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Current Streak</span>
              <span className="font-medium text-ascend-400">{profile.currentStreak} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Longest Streak</span>
              <span className="font-medium text-[var(--text-primary)]">{profile.longestStreak} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Goals Completed</span>
              <span className="font-bold text-green-400">{profile.totalGoalsCompleted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Focus Minutes</span>
              <span className="font-medium text-[var(--text-primary)]">{profile.totalFocusMinutes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Coins</span>
              <span className="font-medium text-yellow-400">{profile.coins} 🪙</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1">
            <Award className="h-4 w-4 text-purple-400" /> Achievements ({profile.achievements.length})
          </h2>
          {profile.achievements.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No achievements unlocked yet. Keep going!</p>
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {profile.achievements.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg bg-[var(--background)] p-3">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{a.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{a.description}</p>
                    {a.rarity && (
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        a.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                        a.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                        a.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {a.rarity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
