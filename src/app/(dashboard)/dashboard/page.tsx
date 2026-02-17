'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Dashboard Home (Today View)
// Main authenticated view: habits, tasks, goals overview, quick actions
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Target,
  Crown,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useStoreUser();
  const habits = useQuery(api.habits.listActive);
  const goals = useQuery(api.goals.listActive);
  const tasks = useQuery(api.tasks.list, { status: 'todo' });
  const toggleHabit = useMutation(api.habits.toggleComplete);
  const toggleTask = useMutation(api.tasks.toggleComplete);

  const [togglingHabit, setTogglingHabit] = useState<string | null>(null);
  const [togglingTask, setTogglingTask] = useState<string | null>(null);

  if (!user) return null;

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const totalHabits = habits?.length ?? 0;

  const handleToggleHabit = async (habitId: string) => {
    setTogglingHabit(habitId);
    try {
      await toggleHabit({ habitId: habitId as never, date: today.toISOString().split('T')[0] });
    } catch (e) {
      console.error('Failed to toggle habit:', e);
    }
    setTogglingHabit(null);
  };

  const handleToggleTask = async (taskId: string) => {
    setTogglingTask(taskId);
    try {
      await toggleTask({ taskId: taskId as never });
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
    setTogglingTask(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {greeting}, {user.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Active Habits" value={totalHabits} icon={<Sparkles className="h-4 w-4 text-purple-400" />} />
        <StatCard label="Active Goals" value={goals?.length ?? 0} icon={<Target className="h-4 w-4 text-yellow-400" />} />
        <StatCard label="Pending Tasks" value={tasks?.length ?? 0} icon={<CheckCircle2 className="h-4 w-4 text-blue-400" />} />
        <StatCard label="Plan" value={user.plan === 'free' ? 'Free' : 'Pro'} icon={<Crown className="h-4 w-4 text-ascend-500" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Habits Card */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Today&apos;s Habits
            </h2>
            <Link href="/habits" className="text-xs text-ascend-500 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {!habits || habits.length === 0 ? (
            <EmptyState
              message="No habits yet"
              sub="Create your first habit to start building consistency."
              href="/habits"
              action="Add Habit"
            />
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 5).map((habit) => (
                <button
                  key={habit._id}
                  onClick={() => handleToggleHabit(habit._id)}
                  disabled={togglingHabit === habit._id}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <Circle className="h-5 w-5 text-[var(--text-secondary)]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">{habit.title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {habit.category} • {habit.streakCurrent} day streak
                    </p>
                  </div>
                  <Flame className={`h-4 w-4 ${habit.streakCurrent > 0 ? 'text-ascend-500' : 'text-[var(--text-muted)]'}`} />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Today's Tasks Card */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              Tasks
            </h2>
            <Link href="/tasks" className="text-xs text-ascend-500 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {!tasks || tasks.length === 0 ? (
            <EmptyState
              message="No pending tasks"
              sub="Add tasks to stay productive and earn XP."
              href="/tasks"
              action="Add Task"
            />
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <button
                  key={task._id}
                  onClick={() => handleToggleTask(task._id)}
                  disabled={togglingTask === task._id}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <Circle className="h-5 w-5 text-[var(--text-secondary)]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <PriorityBadge priority={task.priority} />
                      {task.dueDate && <span>Due {task.dueDate}</span>}
                    </div>
                  </div>
                  {task.xpValue && (
                    <span className="text-xs font-medium text-ascend-500 flex items-center gap-0.5">
                      <Zap className="h-3 w-3" /> {task.xpValue}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Active Goals Card */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-400" />
              Active Goals
            </h2>
            <Link href="/goals" className="text-xs text-ascend-500 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {!goals || goals.length === 0 ? (
            <EmptyState
              message="No goals set"
              sub="Set a goal and let AI break it down into actionable steps."
              href="/goals"
              action="Create Goal"
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {goals.map((goal) => (
                <Link
                  key={goal._id}
                  href={`/goals/${goal._id}`}
                  className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">{goal.title}</p>
                    <span className="text-xs font-semibold text-ascend-500">{goal.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${goal.progress ?? 0}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="capitalize">{goal.category}</span>
                    {goal.targetDate && <span>Target: {goal.targetDate}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 md:hidden">
        <Link
          href="/tasks"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ascend-500 text-white shadow-lg hover:bg-ascend-600 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="mb-1 text-xs text-[var(--text-secondary)]">{label}</p>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
  };
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  );
}

function EmptyState({ message, sub, href, action }: { message: string; sub: string; href: string; action: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
      <p className="mb-1 text-sm text-[var(--text-secondary)]">{message}</p>
      <p className="mb-3 text-xs text-[var(--text-muted)]">{sub}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1 rounded-lg bg-ascend-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-ascend-600 transition-colors"
      >
        <Plus className="h-3 w-3" /> {action}
      </Link>
    </div>
  );
}
