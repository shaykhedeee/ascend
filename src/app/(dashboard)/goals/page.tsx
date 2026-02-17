'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Goals List Page
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Plus,
  Filter,
  ChevronRight,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

const LIFE_DOMAINS = [
  'health', 'career', 'finance', 'learning',
  'relationships', 'creativity', 'mindfulness', 'personal_growth',
] as const;

const GOAL_TYPES = [
  'achievement', 'transformation', 'skill', 'project',
  'quantitative', 'maintenance', 'elimination', 'relationship',
] as const;

const DOMAIN_COLORS: Record<string, string> = {
  health: 'bg-green-500/20 text-green-400',
  career: 'bg-blue-500/20 text-blue-400',
  finance: 'bg-yellow-500/20 text-yellow-400',
  learning: 'bg-purple-500/20 text-purple-400',
  relationships: 'bg-pink-500/20 text-pink-400',
  creativity: 'bg-orange-500/20 text-orange-400',
  mindfulness: 'bg-teal-500/20 text-teal-400',
  personal_growth: 'bg-ascend-500/20 text-ascend-400',
};

export default function GoalsPage() {
  const goals = useQuery(api.goals.listAll);
  const createGoal = useMutation(api.goals.create);
  const [showCreate, setShowCreate] = useState(false);
  const [filterDomain, setFilterDomain] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal_growth');
  const [goalType, setGoalType] = useState<typeof GOAL_TYPES[number]>('achievement');
  const [targetDate, setTargetDate] = useState('');
  const [whyImportant, setWhyImportant] = useState('');

  const filteredGoals = goals?.filter(g =>
    !filterDomain || g.lifeDomain === filterDomain || g.category === filterDomain
  );

  const activeGoals = filteredGoals?.filter(g => g.status === 'in_progress') ?? [];
  const completedGoals = filteredGoals?.filter(g => g.status === 'completed') ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await createGoal({
        title: title.trim(),
        description: description || undefined,
        category,
        goalType,
        lifeDomain: category as typeof LIFE_DOMAINS[number],
        targetDate: targetDate || undefined,
        whyImportant: whyImportant || undefined,
      });
      setTitle('');
      setDescription('');
      setTargetDate('');
      setWhyImportant('');
      setShowCreate(false);
    } catch (e) {
      console.error('Failed to create goal:', e);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Target className="h-6 w-6 text-yellow-400" /> Goals
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {activeGoals.length} active • {completedGoals.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Goal
        </button>
      </div>

      {/* Domain filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterDomain(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !filterDomain ? 'bg-ascend-500 text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
          }`}
        >
          All
        </button>
        {LIFE_DOMAINS.map(domain => (
          <button
            key={domain}
            onClick={() => setFilterDomain(filterDomain === domain ? null : domain)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filterDomain === domain ? 'bg-ascend-500 text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {domain.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Active Goals
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {activeGoals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Completed
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {completedGoals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!goals || goals.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">No goals yet</h3>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">Set your first goal and let AI help decompose it into actionable steps.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Your First Goal
          </button>
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Create New Goal</h2>
              <button onClick={() => setShowCreate(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Goal Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Run a marathon, Learn Spanish..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does success look like?"
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Life Domain</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  >
                    {LIFE_DOMAINS.map((d) => (
                      <option key={d} value={d}>{d.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Goal Type</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as typeof GOAL_TYPES[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  >
                    {GOAL_TYPES.map((t) => (
                      <option key={t} value={t}>{t.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Why is this important to you?</label>
                <textarea
                  value={whyImportant}
                  onChange={(e) => setWhyImportant(e.target.value)}
                  placeholder="Your motivation will help during tough times..."
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !title.trim()}
                  className="flex-1 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal }: { goal: any }) {
  const domainColor = DOMAIN_COLORS[goal.lifeDomain || goal.category] || DOMAIN_COLORS.personal_growth;
  return (
    <Link
      href={`/goals/${goal._id}`}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-ascend-500/30 hover:bg-[var(--surface-hover)]"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-2">
          <p className="font-semibold text-[var(--text-primary)] truncate">{goal.title}</p>
          {goal.description && (
            <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">{goal.description}</p>
          )}
        </div>
        <span className="text-lg font-bold text-ascend-500">{goal.progress ?? 0}%</span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-yellow-400 transition-all duration-500"
          style={{ width: `${goal.progress ?? 0}%` }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${domainColor}`}>
          {(goal.lifeDomain || goal.category || '').replace('_', ' ')}
        </span>
        {goal.goalType && (
          <span className="rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] capitalize">
            {goal.goalType.replace('_', ' ')}
          </span>
        )}
        {goal.targetDate && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
            <Clock className="h-3 w-3" /> {goal.targetDate}
          </span>
        )}
      </div>
    </Link>
  );
}
