'use client';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RESURGO â€” Dashboard Home (Today View)
// Main authenticated view: habits, tasks, goals overview, quick actions
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Zap,
  Brain,
} from 'lucide-react';

type HabitView = {
  _id: string;
  title: string;
  category: string;
  streakCurrent: number;
};

type TaskView = {
  _id: string;
  title: string;
  priority: string;
  dueDate?: string;
  xpValue?: number;
};

type GoalView = {
  _id: string;
  title: string;
  progress?: number;
  category: string;
  targetDate?: string;
};

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

  const totalHabits = habits?.length ?? 0;
  const activeHabits: HabitView[] = (habits ?? []) as HabitView[];
  const openTasks: TaskView[] = (tasks ?? []) as TaskView[];
  const activeGoals: GoalView[] = (goals ?? []) as GoalView[];
  const avgGoalProgress =
    activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, goal) => sum + (goal.progress ?? 0), 0) / activeGoals.length)
      : 0;

  const handleToggleHabit = async (habitId: string) => {
    setTogglingHabit(habitId);
    try {
      await toggleHabit({ habitId: habitId as Id<"habits">, date: today.toISOString().split('T')[0] });
    } catch (e) {
      console.error('Failed to toggle habit:', e);
    }
    setTogglingHabit(null);
  };

  const handleToggleTask = async (taskId: string) => {
    setTogglingTask(taskId);
    try {
      await toggleTask({ taskId: taskId as Id<"tasks"> });
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
    setTogglingTask(null);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-6">

      {/* ── COMMAND CENTER HEADER ── */}
      <div className="mb-6 border border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
          <span className="font-mono text-[9px] tracking-widest text-orange-600">COMMAND_CTR :: AUTHENTICATED</span>
          <span className="ml-auto font-mono text-[9px] tracking-widest text-zinc-600">
            {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
              OPERATOR: {(user.name?.split(' ')[0] ?? 'USER').toUpperCase()}
            </h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-600">
              CYCLE_ACTIVE :: {totalHabits} NODES TRACKED :: INTEGRITY_SCAN_COMPLETE
            </p>
          </div>
          <div className="flex flex-wrap gap-px">
            {[['OBJECTIVES', '/goals'], ['NODES', '/habits'], ['TASK_QUEUE', '/tasks']].map(([label, href]) => (
              <Link key={label} href={href} className="border border-zinc-900 bg-black px-3 py-2 font-mono text-[10px] tracking-widest text-zinc-600 transition hover:border-zinc-700 hover:text-zinc-300">
                [{label}]
              </Link>
            ))}
          </div>
        </div>

        {!user.onboardingComplete && (
          <div className="mx-5 mb-4 flex items-center gap-2 border border-orange-900 bg-orange-950/30 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-mono text-xs text-orange-500">
              SETUP_INCOMPLETE &mdash;{' '}
              <a href="/onboarding" className="underline hover:text-orange-400">RUN_ONBOARDING_SEQUENCE</a>
            </span>
          </div>
        )}
      </div>

      {/* ── STAT PANELS ── */}
      <div className="mb-6 grid grid-cols-2 gap-px border border-zinc-900 md:grid-cols-5">
        <TermStatCard label="ACTIVE_NODES" value={totalHabits} />
        <TermStatCard label="OBJECTIVES" value={activeGoals.length} />
        <TermStatCard label="TASK_QUEUE" value={openTasks.length} />
        <TermStatCard label="INTEGRITY" value={`${avgGoalProgress}%`} />
        <TermStatCard label="ACCESS_TIER" value={user.plan === 'free' ? 'FREE' : 'PRO'} highlight />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── NODE UPTIME PANEL ── */}
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">NODES :: TODAY</span>
            </div>
            <Link href="/habits" className="font-mono text-[10px] tracking-widest text-zinc-600 transition hover:text-orange-500">
              [VIEW_ALL]
            </Link>
          </div>

          {!activeHabits.length ? (
            <TermEmptyState label="NODE_OFFLINE" sub="No nodes tracked. Initialize first node to begin." href="/habits" action="INIT_NODE" />
          ) : (
            <div className="space-y-px p-1">
              {activeHabits.slice(0, 5).map((habit) => (
                <button
                  key={habit._id}
                  onClick={() => handleToggleHabit(habit._id)}
                  disabled={togglingHabit === habit._id}
                  className="flex w-full items-center gap-3 border border-transparent px-3 py-2.5 text-left transition hover:border-zinc-800 hover:bg-zinc-900 disabled:opacity-50"
                >
                  <Circle className="h-4 w-4 shrink-0 text-zinc-700" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-zinc-300">{habit.title.toUpperCase()}</p>
                    <p className="font-mono text-[10px] text-zinc-600">
                      {habit.category.toUpperCase()} :: UPTIME_{habit.streakCurrent}D
                    </p>
                  </div>
                  <span className={`border px-2 py-0.5 font-mono text-[9px] tracking-widest ${habit.streakCurrent > 0 ? 'border-orange-900 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-600'}`}>
                    {habit.streakCurrent > 0 ? 'ACTIVE' : 'IDLE'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── TASK QUEUE PANEL ── */}
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">TASK_QUEUE</span>
            </div>
            <Link href="/tasks" className="font-mono text-[10px] tracking-widest text-zinc-600 transition hover:text-orange-500">
              [VIEW_ALL]
            </Link>
          </div>

          {!openTasks.length ? (
            <TermEmptyState label="QUEUE_EMPTY" sub="No pending tasks. Queue is clear." href="/tasks" action="ADD_TASK" />
          ) : (
            <div className="space-y-px p-1">
              {openTasks.slice(0, 5).map((task) => (
                <button
                  key={task._id}
                  onClick={() => handleToggleTask(task._id)}
                  disabled={togglingTask === task._id}
                  className="flex w-full items-center gap-3 border border-transparent px-3 py-2.5 text-left transition hover:border-zinc-800 hover:bg-zinc-900 disabled:opacity-50"
                >
                  <Circle className="h-4 w-4 shrink-0 text-zinc-700" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-zinc-300">{task.title.toUpperCase()}</p>
                    <div className="flex items-center gap-2">
                      <TermPriorityChip priority={task.priority} />
                      {task.dueDate && <span className="font-mono text-[10px] text-zinc-600">DUE_{task.dueDate.replace(/-/g, '')}</span>}
                    </div>
                  </div>
                  {task.xpValue && (
                    <span className="font-mono text-[10px] text-orange-600">
                      <Zap className="inline h-3 w-3" /> {task.xpValue}XP
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── CORE OBJECTIVES PANEL ── */}
        <section className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">CORE_OBJECTIVES</span>
            </div>
            <Link href="/goals" className="font-mono text-[10px] tracking-widest text-zinc-600 transition hover:text-orange-500">
              [VIEW_ALL]
            </Link>
          </div>

          {!activeGoals.length ? (
            <TermEmptyState label="NO_OBJECTIVES_SET" sub="Define a core objective to drive node behavior." href="/goals" action="DEFINE_OBJECTIVE" />
          ) : (
            <div className="grid gap-px p-1 md:grid-cols-2">
              {activeGoals.map((goal) => (
                <Link
                  key={goal._id}
                  href={`/goals/${goal._id}`}
                  className="border border-transparent p-3 transition hover:border-zinc-800 hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-mono text-xs text-zinc-300">{goal.title.toUpperCase()}</p>
                    <span className="shrink-0 font-mono text-xs font-bold text-orange-500">{goal.progress ?? 0}%</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-zinc-900">
                    <div
                      className="h-px bg-orange-600 transition-all duration-500"
                      style={{ width: `${goal.progress ?? 0}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-zinc-600">
                    <span>{goal.category.toUpperCase()}</span>
                    {goal.targetDate && <span>TARGET_{goal.targetDate.replace(/-/g, '')}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── AI COMMS BRIEF ── */}
        <section className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
            <Brain className="h-3.5 w-3.5 text-zinc-500" />
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">AI_COMMS_BRIEF</span>
            <span className="ml-auto border border-green-900 bg-green-950/30 px-2 py-0.5 font-mono text-[9px] tracking-widest text-green-600">LIVE</span>
          </div>
          <div className="p-4">
            <p className="font-mono text-xs leading-relaxed text-zinc-500">
              You are operating{' '}
              <span className="text-zinc-300">{activeHabits.length} NODES</span> and targeting{' '}
              <span className="text-zinc-300">{activeGoals.length} OBJECTIVES</span>. Prioritize task completion before noon to maximize streak stability and elevate weekly goal integrity.
            </p>
            <div className="mt-3 flex flex-wrap gap-px">
              <span className="border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[9px] tracking-widest text-zinc-500">
                REC: 2_DEEP_BLOCKS
              </span>
              <span className="border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[9px] tracking-widest text-zinc-500">
                OPTIMAL_WINDOW: MORNING
              </span>
              <span className="border border-orange-900 bg-orange-950/20 px-2 py-1 font-mono text-[9px] tracking-widest text-orange-700">
                RISK: CARRYOVER_TASKS
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link
          href="/tasks"
          className="flex h-12 w-12 items-center justify-center border border-orange-600 bg-orange-600 text-black transition hover:bg-orange-500"
          aria-label="Add task"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

function TermStatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
      <p className="font-mono text-[9px] tracking-widest text-zinc-600">{label}</p>
      <p className={`mt-1 font-mono text-lg font-bold ${highlight ? 'text-orange-500' : 'text-zinc-100'}`}>{value}</p>
    </div>
  );
}

function TermPriorityChip({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    urgent: 'border-red-900 bg-red-950/30 text-red-500',
    high: 'border-orange-900 bg-orange-950/30 text-orange-500',
    medium: 'border-yellow-900 bg-yellow-950/30 text-yellow-600',
    low: 'border-zinc-800 text-zinc-600',
  };
  return (
    <span className={`border px-1.5 py-0.5 font-mono text-[9px] tracking-widest ${map[priority] ?? map.low}`}>
      {priority.toUpperCase()}
    </span>
  );
}

function TermEmptyState({ label, sub, href, action }: { label: string; sub: string; href: string; action: string }) {
  return (
    <div className="border border-dashed border-zinc-800 m-3 p-6 text-center">
      <p className="font-mono text-xs tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 font-mono text-[10px] text-zinc-700">{sub}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:border-orange-900 hover:text-orange-500"
      >
        <Plus className="h-3 w-3" /> {action}
      </Link>
    </div>
  );
}
