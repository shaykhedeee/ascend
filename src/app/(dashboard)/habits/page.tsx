'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Habits Tracker Page
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import {
  Sparkles,
  Plus,
  Flame,
  Check,
  X,
  SkipForward,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const FREQUENCIES = ['daily', 'weekdays', 'weekends', '3x_week', 'weekly', 'custom'] as const;
const TIMES_OF_DAY = ['morning', 'afternoon', 'evening', 'anytime'] as const;
const CATEGORIES = ['health', 'fitness', 'learning', 'mindfulness', 'productivity', 'social', 'creativity', 'other'] as const;
const HABIT_TYPES = ['yes_no', 'quantity', 'duration', 'negative', 'range', 'checklist'] as const;

export default function HabitsPage() {
  const habits = useQuery(api.habits.listActive);
  const allHabits = useQuery(api.habits.listAll);
  const toggleComplete = useMutation(api.habits.toggleComplete);
  const skipHabit = useMutation(api.habits.skip);
  const createHabit = useMutation(api.habits.create);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [tab, setTab] = useState<'active' | 'all'>('active');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('health');
  const [frequency, setFrequency] = useState<typeof FREQUENCIES[number]>('daily');
  const [timeOfDay, setTimeOfDay] = useState<typeof TIMES_OF_DAY[number]>('morning');
  const [habitType, setHabitType] = useState<typeof HABIT_TYPES[number]>('yes_no');
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('');
  const [identityLabel, setIdentityLabel] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const displayHabits = tab === 'active' ? habits : allHabits;

  const handleToggle = async (habitId: string) => {
    setToggling(habitId);
    try {
      await toggleComplete({ habitId: habitId as never, date: today });
    } catch (e) {
      console.error('Failed to toggle:', e);
    }
    setToggling(null);
  };

  const handleSkip = async (habitId: string) => {
    try {
      await skipHabit({ habitId: habitId as never, date: today });
    } catch (e) {
      console.error('Failed to skip:', e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await createHabit({
        title: title.trim(),
        description: description || undefined,
        category,
        frequency,
        timeOfDay,
        habitType,
        targetValue: targetValue ? parseInt(targetValue) : undefined,
        targetUnit: targetUnit || undefined,
        identityLabel: identityLabel || undefined,
      });
      setTitle('');
      setDescription('');
      setIdentityLabel('');
      setTargetValue('');
      setTargetUnit('');
      setShowCreate(false);
    } catch (e) {
      console.error('Failed to create habit:', e);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" /> Habits
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {habits?.length ?? 0} active habits
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Habit
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {(['active', 'all'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              tab === t ? 'bg-ascend-500 text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Habits List */}
      {!displayHabits || displayHabits.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <Sparkles className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">No habits yet</h3>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Start building powerful habits that shape your identity.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> Create Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayHabits.map((habit) => (
            <div
              key={habit._id}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-ascend-500/20"
            >
              <div className="flex items-center gap-4">
                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(habit._id)}
                  disabled={toggling === habit._id}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] transition-all hover:border-ascend-500 hover:bg-ascend-500/10"
                >
                  {toggling === habit._id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-ascend-500 border-t-transparent" />
                  ) : (
                    <Check className="h-4 w-4 text-[var(--text-muted)]" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--text-primary)] truncate">{habit.title}</p>
                    {habit.habitType && habit.habitType !== 'yes_no' && (
                      <span className="rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-400 capitalize">
                        {habit.habitType.replace('_', '/')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="capitalize">{habit.category}</span>
                    <span>•</span>
                    <span className="capitalize">{habit.frequency.replace('_', ' ')}</span>
                    {habit.identityLabel && (
                      <>
                        <span>•</span>
                        <span className="text-ascend-400">&quot;I am {habit.identityLabel}&quot;</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-ascend-500 flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      {habit.streakCurrent}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Best: {habit.streakLongest}
                    </p>
                  </div>

                  {/* Skip button */}
                  <button
                    onClick={() => handleSkip(habit._id)}
                    className="rounded-lg p-2 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:bg-yellow-500/10 hover:text-yellow-400 transition-all"
                    title="Skip today"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar for quantity/duration habits */}
              {habit.targetValue && habit.targetValue > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-ascend-500"
                      style={{ width: `${Math.min(100, ((habit.totalCompletions || 0) / habit.targetValue) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {habit.totalCompletions || 0}/{habit.targetValue} {habit.targetUnit || ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Habit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Create New Habit</h2>
              <button onClick={() => setShowCreate(false)} className="text-[var(--text-secondary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Habit Name *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Meditate, Read, Exercise..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Identity Label</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">I am</span>
                  <input
                    value={identityLabel}
                    onChange={(e) => setIdentityLabel(e.target.value)}
                    placeholder="a reader, a healthy person..."
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none capitalize"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as typeof FREQUENCIES[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f}>{f.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Time of Day</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as typeof TIMES_OF_DAY[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none capitalize"
                  >
                    {TIMES_OF_DAY.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Habit Type</label>
                  <select
                    value={habitType}
                    onChange={(e) => setHabitType(e.target.value as typeof HABIT_TYPES[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  >
                    {HABIT_TYPES.map((h) => (
                      <option key={h} value={h}>{h.replace('_', '/')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {habitType !== 'yes_no' && habitType !== 'negative' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Target</label>
                    <input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g., 30"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Unit</label>
                    <input
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value)}
                      placeholder="minutes, pages, reps..."
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this habit important?"
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !title.trim()}
                  className="flex-1 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
