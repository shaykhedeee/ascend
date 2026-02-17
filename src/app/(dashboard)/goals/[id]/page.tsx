'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Goal Detail Page
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Clock,
  CheckCircle2,
  Edit3,
  Trash2,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;
  const goal = useQuery(api.goals.getById, { goalId: goalId as never });
  const tasks = useQuery(api.tasks.listByGoal, { goalId: goalId as never });
  const updateGoal = useMutation(api.goals.update);
  const removeGoal = useMutation(api.goals.remove);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (goal === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ascend-500 border-t-transparent" />
      </div>
    );
  }

  if (goal === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--text-secondary)]">Goal not found</p>
        <Link href="/goals" className="mt-2 text-sm text-ascend-500 hover:underline">Back to Goals</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Delete this goal? This cannot be undone.')) return;
    await removeGoal({ goalId: goalId as never });
    router.push('/goals');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGoal({
      goalId: goalId as never,
      title: editTitle || undefined,
      description: editDescription || undefined,
    });
    setEditing(false);
  };

  const handleStatusChange = async (status: string) => {
    await updateGoal({
      goalId: goalId as never,
      status: status as never,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/goals" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-ascend-500">
        <ArrowLeft className="h-4 w-4" /> Back to Goals
      </Link>

      {/* Goal Header */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-lg font-bold text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-ascend-500 px-3 py-1 text-xs text-white">Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Target className="h-6 w-6 text-yellow-400" />
                  {goal.title}
                </h1>
                {goal.description && (
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{goal.description}</p>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditTitle(goal.title); setEditDescription(goal.description || ''); setEditing(true); }}
              className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button onClick={handleDelete} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Progress</span>
            <span className="text-lg font-bold text-ascend-500">{goal.progress ?? 0}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${goal.progress ?? 0}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1 capitalize">
            <TrendingUp className="h-3 w-3" /> {goal.status?.replace('_', ' ')}
          </span>
          {goal.lifeDomain && (
            <span className="capitalize rounded-full bg-ascend-500/10 px-2 py-0.5 text-ascend-400">
              {goal.lifeDomain.replace('_', ' ')}
            </span>
          )}
          {goal.targetDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Target: {goal.targetDate}
            </span>
          )}
        </div>

        {/* Why Important */}
        {goal.whyImportant && (
          <div className="mt-4 rounded-lg bg-ascend-500/5 border border-ascend-500/20 p-3">
            <p className="text-xs font-medium text-ascend-400 mb-1">Why this matters</p>
            <p className="text-sm text-[var(--text-primary)]">{goal.whyImportant}</p>
          </div>
        )}

        {/* Status Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {goal.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20"
            >
              <CheckCircle2 className="h-3 w-3" /> Mark Complete
            </button>
          )}
          {goal.status === 'in_progress' && (
            <button
              onClick={() => handleStatusChange('paused')}
              className="rounded-lg bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20"
            >
              Pause
            </button>
          )}
          {goal.status === 'paused' && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
            >
              Resume
            </button>
          )}
        </div>
      </div>

      {/* Related Tasks */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-400" /> Related Tasks
          </h2>
          <Link
            href="/tasks"
            className="text-xs text-ascend-500 hover:underline"
          >
            Add Task
          </Link>
        </div>

        {!tasks || tasks.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No tasks linked to this goal yet.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--surface-hover)]"
              >
                <div className={`h-4 w-4 rounded-full border-2 ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-[var(--border)]'}`} />
                <p className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                  {task.title}
                </p>
                {task.dueDate && <span className="text-xs text-[var(--text-secondary)]">{task.dueDate}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
