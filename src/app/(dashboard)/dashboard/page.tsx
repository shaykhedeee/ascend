'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Dashboard Home
// Main authenticated view — today's habits, quick actions, stats
// This is a thin shell; the real UI lives in components.
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useStoreUser } from '@/hooks/useStoreUser';
import { usePlanGating } from '@/hooks/usePlanGating';
import { Flame, Target, Crown, Calendar, Activity } from 'lucide-react';
import type { ComponentType } from 'react';

export default function DashboardPage() {
  const { user } = useStoreUser();
  const { plan, isPro } = usePlanGating();
  const habits = useQuery(api.habits.listActive);
  const goals = useQuery(api.goals.listActive);

  const today = new Date().toISOString().split('T')[0];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back, {user.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
          {!isPro() && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs">
              Free Plan
            </span>
          )}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Active Habits"
          value={habits?.length ?? 0}
          Icon={Flame}
        />
        <StatCard
          label="Active Goals"
          value={goals?.length ?? 0}
          Icon={Target}
        />
        <StatCard
          label="Plan"
          value={plan.charAt(0).toUpperCase() + plan.slice(1)}
          Icon={Crown}
        />
        <StatCard
          label="Today"
          value={today}
          Icon={Calendar}
        />
      </div>

      {/* Habits Today */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
          Today&apos;s Habits
        </h2>

        {!habits || habits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
            <p className="mb-2 text-[var(--text-secondary)]">No habits yet</p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Create your first habit to start building consistency.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
              >
                <span className="text-2xl text-ascend-400"><Activity className="w-6 h-6" /></span>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">
                    {habit.title}
                  </p>
                  {habit.identityLabel && (
                    <p className="text-xs text-ascend-500">
                      &quot;I am {habit.identityLabel}&quot;
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ascend-500">
                    {habit.streakCurrent}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">streak</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Goals */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
          Active Goals
        </h2>

        {!goals || goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
            <p className="mb-2 text-[var(--text-secondary)]">No goals yet</p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Set a goal and let AI break it down into actionable steps.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {goals.map((goal) => (
              <div
                key={goal._id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-[var(--text-primary)]">
                    {goal.title}
                  </p>
                  <span className="text-sm font-semibold text-ascend-500">
                    {goal.progress ?? 0}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 transition-all duration-500"
                    style={{ width: `${goal.progress ?? 0}%` }}
                  />
                </div>
                {goal.targetDate && (
                  <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                    Target: {goal.targetDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | number;
  Icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="mb-1 text-xs text-[var(--text-tertiary)]">{label}</p>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-ascend-400" />
        <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}
