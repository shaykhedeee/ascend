'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Mobile Dashboard (Full Native-Like Experience)
// 5-tab mobile-first UI: TODAY | AI | HEALTH | GOALS | WEALTH
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useStoreUser } from '@/hooks/useStoreUser';
import FocusTimerWidget from '@/components/widgets/FocusTimerWidget';
import HabitStreakWidget from '@/components/widgets/HabitStreakWidget';
import GoalProgressWidget from '@/components/widgets/GoalProgressWidget';
import AICoachWidget from '@/components/widgets/AICoachWidget';
import CalorieTrackerWidget from '@/components/widgets/CalorieTrackerWidget';
import SleepWidget from '@/components/widgets/SleepWidget';
import { cn } from '@/lib/utils';
import {
  Brain, Target, Activity, Flame, Heart,
  ChevronRight, Plus, DollarSign, BookOpen,
  Zap, BarChart3, Moon, Dumbbell, Trophy, Star,
  MessageSquare, Droplets,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Tab config
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'today',   label: 'TODAY',   icon: Activity   },
  { id: 'ai',      label: 'AI',      icon: Brain      },
  { id: 'health',  label: 'HEALTH',  icon: Heart      },
  { id: 'goals',   label: 'GOALS',   icon: Target     },
  { id: 'wealth',  label: 'WEALTH',  icon: DollarSign },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({
  label, linkHref, linkLabel,
}: { label: string; linkHref?: string; linkLabel?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between px-0.5">
      <p className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">{label}</p>
      {linkHref && (
        <Link href={linkHref} className="flex items-center gap-0.5 font-terminal text-xs text-orange-500">
          {linkLabel ?? 'ALL'} <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function QuickLink({
  href, icon: Icon, label, accent,
}: { href: string; icon: React.ElementType; label: string; accent: string }) {
  return (
    <Link href={href}
      className={cn(
        'flex min-h-[68px] flex-col items-center justify-center gap-1.5 border p-3 transition active:scale-95',
        accent,
      )}>
      <Icon className="h-5 w-5" />
      <span className="font-pixel text-[0.38rem] tracking-widest">{label}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: TODAY
// ─────────────────────────────────────────────────────────────────────────────
function TodayTab() {
  const { user } = useStoreUser();
  const gamificationProfile = useQuery(api.gamification.getProfile);
  const habits = useQuery(api.habits.listActive);
  const tasks = useQuery(api.tasks.list, { status: 'todo' });
  const todayDate = new Date().toISOString().split('T')[0];
  const todayNutrition = useQuery(api.nutrition.getNutritionLog, { date: todayDate });
  const updateWater = useMutation(api.nutrition.updateWaterAndSteps);
  const toggleTask = useMutation(api.tasks.toggleComplete);

  const currentWater = (todayNutrition as { waterMl?: number } | null | undefined)?.waterMl ?? 0;
  const waterGoal = 2500;
  const waterPct = Math.min(100, Math.round((currentWater / waterGoal) * 100));

  const [waterLoading, setWaterLoading] = useState(false);
  const [togglingTask, setTogglingTask] = useState<string | null>(null);

  const addWater = useCallback(
    async (ml: number) => {
      setWaterLoading(true);
      try { await updateWater({ date: todayDate, waterMl: currentWater + ml }); }
      catch { /* silent */ }
      setWaterLoading(false);
    },
    [updateWater, currentWater, todayDate],
  );

  const handleToggleTask = async (taskId: string) => {
    setTogglingTask(taskId);
    try { await toggleTask({ taskId: taskId as Id<'tasks'> }); } catch { /* silent */ }
    setTogglingTask(null);
  };

  const todayTasks = ((tasks ?? []) as { _id: string; title: string; priority: string }[]).slice(0, 5);
  const todayHabits = ((habits ?? []) as { _id: string; title: string; streakCurrent: number }[]).slice(0, 4);
  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-4 pb-24">
      {/* — Greeting card — */}
      <div className="border border-zinc-900 bg-zinc-950 px-4 py-4">
        <p className="font-terminal text-xs text-zinc-500">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="mt-0.5 font-terminal text-xl font-bold text-zinc-100">
          {salutation}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} ✦
        </h1>
        {/* Quick stat strip */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {([
            { v: gamificationProfile?.level ?? 1,           label: 'LVL', c: 'text-orange-400' },
            { v: gamificationProfile?.totalXP ?? 0,          label: 'XP',  c: 'text-yellow-400' },
            { v: `${gamificationProfile?.currentStreak ?? 0}d`, label: 'STK', c: 'text-green-400'  },
            { v: (habits ?? []).length,                       label: 'HAB', c: 'text-purple-400' },
            { v: `${waterPct}%`,                              label: 'H₂O', c: 'text-cyan-400'   },
          ] as { v: string | number; label: string; c: string }[]).map(({ v, label, c }) => (
            <div key={label}
              className={cn('flex shrink-0 flex-col items-center border border-zinc-800 bg-zinc-900 px-3 py-1.5', c)}>
              <span className="font-terminal text-lg font-bold leading-none">{v}</span>
              <span className="font-pixel text-[0.32rem] tracking-widest text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* — Quick action grid — */}
      <div className="grid grid-cols-4 gap-1.5">
        <QuickLink href="/coach"        icon={MessageSquare} label="COACH"   accent="border-orange-900/50 bg-orange-950/20 text-orange-400" />
        <QuickLink href="/focus"        icon={Target}        label="FOCUS"   accent="border-emerald-900/50 bg-emerald-950/20 text-emerald-400" />
        <QuickLink href="/habits"       icon={Flame}         label="HABITS"  accent="border-red-900/50 bg-red-950/20 text-red-400" />
        <QuickLink href="/plan-builder" icon={BookOpen}      label="PLANNER" accent="border-blue-900/50 bg-blue-950/20 text-blue-400" />
      </div>

      {/* — Hydration tracker — */}
      <div className="border border-zinc-900 bg-zinc-950 p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-pixel text-[0.5rem] tracking-widest text-cyan-400">
            <Droplets className="h-3.5 w-3.5" /> HYDRATION
          </span>
          <span className="font-terminal text-sm font-bold text-cyan-400">
            {currentWater}<span className="text-xs text-zinc-500">ml / {waterGoal}ml</span>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden bg-zinc-800">
          <div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 transition-all duration-700"
            style={{ width: `${waterPct}%` }} />
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {[150, 250, 500, 750].map((ml) => (
            <button key={ml} disabled={waterLoading} onClick={() => void addWater(ml)}
              className="border border-cyan-900/50 bg-cyan-950/10 py-2 font-terminal text-xs text-cyan-400 disabled:opacity-50 active:bg-cyan-950/40">
              +{ml}
            </button>
          ))}
        </div>
      </div>

      {/* — Task queue — */}
      <div>
        <SectionHeader label="TASK_QUEUE" linkHref="/tasks" />
        <div className="space-y-1">
          {todayTasks.length === 0 ? (
            <Link href="/tasks"
              className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 py-5 font-terminal text-xs text-zinc-500">
              <Plus className="h-3.5 w-3.5" /> Add your first task
            </Link>
          ) : todayTasks.map((t) => (
            <button key={t._id} onClick={() => void handleToggleTask(t._id)}
              disabled={togglingTask === t._id}
              className="flex w-full items-center gap-2.5 border border-zinc-900 bg-zinc-950 px-3 py-2.5 text-left transition active:bg-zinc-900 disabled:opacity-50">
              <div className={cn('h-2 w-2 shrink-0 rounded-full',
                t.priority === 'urgent' || t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-orange-500' : 'bg-zinc-600')} />
              <p className="flex-1 truncate font-terminal text-sm text-zinc-200">{t.title}</p>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-700" />
            </button>
          ))}
        </div>
      </div>

      {/* — Habit tracker — */}
      <div>
        <SectionHeader label="HABIT_TRACKER" linkHref="/habits" />
        <div className="grid grid-cols-2 gap-1.5">
          {todayHabits.length === 0 ? (
            <Link href="/habits"
              className="col-span-2 flex items-center justify-center gap-2 border border-dashed border-zinc-800 py-5 font-terminal text-xs text-zinc-500">
              <Plus className="h-3.5 w-3.5" /> Start a habit
            </Link>
          ) : todayHabits.map((h) => (
            <div key={h._id} className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-3 py-2.5">
              <Flame className="h-3.5 w-3.5 shrink-0 text-orange-500" />
              <div className="min-w-0">
                <p className="truncate font-terminal text-xs text-zinc-200">{h.title}</p>
                <p className="font-pixel text-[0.32rem] tracking-widest text-orange-400">{h.streakCurrent}d streak</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* — Focus timer — */}
      <div>
        <SectionHeader label="FOCUS_TIMER" linkHref="/focus" />
        <FocusTimerWidget />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: AI
// ─────────────────────────────────────────────────────────────────────────────
function AITab() {
  return (
    <div className="space-y-4 pb-24">
      <div className="border border-zinc-900 bg-zinc-950 px-4 py-4 text-center">
        <p className="font-pixel text-[0.45rem] tracking-widest text-orange-500">★_AI_COMMAND_CENTER</p>
        <h2 className="mt-1 font-terminal text-xl font-bold text-zinc-100">Your AI Coaches</h2>
        <p className="mt-0.5 font-terminal text-xs text-zinc-500">6 specialist coaches — available 24/7</p>
      </div>

      <AICoachWidget />

      <div>
        <SectionHeader label="AI_TOOLS" />
        <div className="grid grid-cols-2 gap-2">
          <QuickLink href="/coach"        icon={Brain}    label="AI_COACH"     accent="border-orange-900/40 bg-orange-950/15 text-orange-400" />
          <QuickLink href="/plan-builder" icon={BookOpen}  label="PLAN_BUILDER" accent="border-blue-900/40 bg-blue-950/15 text-blue-400" />
          <QuickLink href="/orchestrator" icon={Zap}       label="ORCHESTRATOR" accent="border-yellow-900/40 bg-yellow-950/15 text-yellow-400" />
          <QuickLink href="/analytics"    icon={BarChart3}  label="ANALYTICS"    accent="border-green-900/40 bg-green-950/15 text-green-400" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: HEALTH
// ─────────────────────────────────────────────────────────────────────────────
function HealthTab() {
  return (
    <div className="space-y-4 pb-24">
      <div className="border border-zinc-900 bg-zinc-950 px-4 py-3.5 text-center">
        <p className="font-pixel text-[0.45rem] tracking-widest text-green-500">HEALTH_CENTER</p>
        <h2 className="mt-0.5 font-terminal text-xl font-bold text-zinc-100">Health & Fitness</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <QuickLink href="/wellness" icon={Heart}    label="WELLNESS" accent="border-pink-900/40 bg-pink-950/15 text-pink-400" />
        <QuickLink href="/focus"    icon={Moon}     label="SLEEP"    accent="border-indigo-900/40 bg-indigo-950/15 text-indigo-400" />
        <QuickLink href="/wellness" icon={Dumbbell} label="FITNESS"  accent="border-red-900/40 bg-red-950/15 text-red-400" />
      </div>

      <div>
        <SectionHeader label="SLEEP_LOG" linkHref="/focus" />
        <SleepWidget />
      </div>

      <div>
        <SectionHeader label="CALORIE_TRACKER" linkHref="/wellness" />
        <CalorieTrackerWidget />
      </div>

      <div>
        <SectionHeader label="HABIT_STREAKS" linkHref="/habits" />
        <HabitStreakWidget />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: GOALS
// ─────────────────────────────────────────────────────────────────────────────
function GoalsTab() {
  const goals = useQuery(api.goals.listActive);
  const activeGoals = ((goals ?? []) as { _id: string; title: string; progress?: number; category: string }[]).slice(0, 8);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between border border-zinc-900 bg-zinc-950 px-4 py-3.5">
        <div>
          <p className="font-pixel text-[0.45rem] tracking-widest text-yellow-500">GOAL_TRACKER</p>
          <h2 className="mt-0.5 font-terminal text-xl font-bold text-zinc-100">Active Goals</h2>
        </div>
        <Link href="/goals"
          className="flex items-center gap-1 border border-orange-800 bg-orange-950/20 px-3 py-2 font-terminal text-xs text-orange-400">
          <Plus className="h-3 w-3" /> ADD
        </Link>
      </div>

      <GoalProgressWidget />

      {activeGoals.length > 0 ? (
        <div className="space-y-1.5">
          {activeGoals.map((g) => (
            <Link key={g._id} href="/goals"
              className="flex items-center gap-3 border border-zinc-900 bg-zinc-950 px-3 py-3 transition active:bg-zinc-900">
              <div className="flex-1 min-w-0">
                <p className="truncate font-terminal text-sm text-zinc-200">{g.title}</p>
                <div className="mt-1.5 h-px w-full bg-zinc-800">
                  <div className="h-px bg-orange-600" style={{ width: `${g.progress ?? 0}%` }} />
                </div>
                <p className="mt-0.5 font-terminal text-xs text-zinc-500">{g.progress ?? 0}% · {g.category}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-700" />
            </Link>
          ))}
        </div>
      ) : (
        <Link href="/goals"
          className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 py-8 font-terminal text-sm text-zinc-500">
          <Plus className="h-4 w-4" /> Set your first goal
        </Link>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: WEALTH
// ─────────────────────────────────────────────────────────────────────────────
function WealthTab() {
  return (
    <div className="space-y-4 pb-24">
      <div className="border border-zinc-900 bg-zinc-950 px-4 py-3.5 text-center">
        <p className="font-pixel text-[0.45rem] tracking-widest text-green-500">WEALTH_CENTER</p>
        <h2 className="mt-0.5 font-terminal text-xl font-bold text-zinc-100">Budget & Business</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <QuickLink href="/budget"       icon={DollarSign} label="BUDGET"       accent="border-green-900/40 bg-green-950/15 text-green-400" />
        <QuickLink href="/business"     icon={BarChart3}  label="BUSINESS"     accent="border-blue-900/40 bg-blue-950/15 text-blue-400" />
        <QuickLink href="/wishlist"     icon={Trophy}     label="WISHLIST"     accent="border-yellow-900/40 bg-yellow-950/15 text-yellow-400" />
        <QuickLink href="/vision-board" icon={Star}       label="VISION_BOARD" accent="border-purple-900/40 bg-purple-950/15 text-purple-400" />
      </div>

      <div className="border border-zinc-900 bg-zinc-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-pixel text-[0.5rem] tracking-widest text-green-500">BUDGET_OVERVIEW</p>
          <Link href="/budget" className="font-terminal text-xs text-orange-500">Full view →</Link>
        </div>
        <p className="font-terminal text-xs leading-relaxed text-zinc-500">
          Track income, expenses and savings goals in the full budget dashboard.
        </p>
        <Link href="/budget"
          className="mt-3 flex items-center justify-center gap-2 border border-green-800 bg-green-950/20 py-2.5 font-terminal text-sm text-green-400 active:bg-green-950/40">
          <DollarSign className="h-4 w-4" /> Open Budget Dashboard
        </Link>
      </div>

      <div className="border border-zinc-900 bg-zinc-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-pixel text-[0.5rem] tracking-widest text-blue-500">BUSINESS_TRACKER</p>
          <Link href="/business" className="font-terminal text-xs text-orange-500">Full view →</Link>
        </div>
        <p className="font-terminal text-xs leading-relaxed text-zinc-500">
          Business goals, KPIs and milestones — manage your enterprise objectives.
        </p>
        <Link href="/business"
          className="mt-3 flex items-center justify-center gap-2 border border-blue-800 bg-blue-950/20 py-2.5 font-terminal text-sm text-blue-400 active:bg-blue-950/40">
          <BarChart3 className="h-4 w-4" /> Open Business Dashboard
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('today');

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Tab bar */}
      <div className="sticky top-0 z-20 flex border-b-2 border-zinc-900 bg-black">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 px-0.5 py-2.5 transition-colors',
              activeTab === id
                ? 'border-b-2 border-orange-500 text-orange-400'
                : 'border-b-2 border-transparent text-zinc-600 active:text-zinc-400',
            )}>
            <Icon className="h-4 w-4" />
            <span className="font-pixel text-[0.33rem] tracking-widest">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pt-3">
        {activeTab === 'today'  && <TodayTab />}
        {activeTab === 'ai'     && <AITab />}
        {activeTab === 'health' && <HealthTab />}
        {activeTab === 'goals'  && <GoalsTab />}
        {activeTab === 'wealth' && <WealthTab />}
      </div>
    </div>
  );
}
