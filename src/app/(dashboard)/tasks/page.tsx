'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Tasks Page
// Full task management with filters, Eisenhower matrix view, quick add
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Circle,
  CheckCircle2,
  Trash2,
  X,
  Filter,
  Grid3X3,
  List,
  Clock,
  Zap,
  ChevronDown,
} from 'lucide-react';

type ViewMode = 'list' | 'eisenhower';
type StatusFilter = 'todo' | 'in_progress' | 'done' | undefined;

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'] as const;
const QUADRANT_OPTIONS = ['urgent_important', 'important', 'urgent', 'neither'] as const;
const QUADRANT_LABELS: Record<string, string> = {
  urgent_important: 'Do First',
  important: 'Schedule',
  urgent: 'Delegate',
  neither: 'Eliminate',
};
const QUADRANT_COLORS: Record<string, string> = {
  urgent_important: 'border-red-500/30 bg-red-500/5',
  important: 'border-blue-500/30 bg-blue-500/5',
  urgent: 'border-yellow-500/30 bg-yellow-500/5',
  neither: 'border-gray-500/30 bg-gray-500/5',
};

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todo');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const tasks = useQuery(api.tasks.list, statusFilter ? { status: statusFilter } : {});
  const allTasks = useQuery(api.tasks.list, {});
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggleComplete);
  const removeTask = useMutation(api.tasks.remove);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<typeof PRIORITY_OPTIONS[number]>('medium');
  const [dueDate, setDueDate] = useState('');
  const [eisenhower, setEisenhower] = useState<typeof QUADRANT_OPTIONS[number] | ''>('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await createTask({
        title: title.trim(),
        description: description || undefined,
        priority,
        dueDate: dueDate || undefined,
        eisenhowerQuadrant: eisenhower || undefined,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
        source: 'manual',
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setEisenhower('');
      setEstimatedMinutes('');
      setShowCreate(false);
    } catch (e) {
      console.error('Failed to create task:', e);
    }
    setCreating(false);
  };

  const handleToggle = async (taskId: string) => {
    try {
      await toggleTask({ taskId: taskId as never });
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await removeTask({ taskId: taskId as never });
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  const displayTasks = viewMode === 'list' ? tasks : allTasks;

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-400" /> Tasks
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {tasks?.length ?? 0} tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-ascend-500 text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('eisenhower')}
              className={`p-2 ${viewMode === 'eisenhower' ? 'bg-ascend-500 text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white hover:bg-ascend-600 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Status filters (list view only) */}
      {viewMode === 'list' && (
        <div className="mb-6 flex gap-2">
          {[
            { key: 'todo' as const, label: 'To Do' },
            { key: 'in_progress' as const, label: 'In Progress' },
            { key: 'done' as const, label: 'Done' },
            { key: undefined, label: 'All' },
          ].map(({ key, label }) => (
            <button
              key={label}
              onClick={() => setStatusFilter(key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === key
                  ? 'bg-ascend-500 text-white'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {(!tasks || tasks.length === 0) ? (
            <div className="flex flex-col items-center py-16 text-center">
              <CheckSquare className="mb-3 h-10 w-10 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-secondary)]">No tasks found</p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-3 flex items-center gap-1 rounded-lg bg-ascend-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                <Plus className="h-3 w-3" /> Add Task
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {/* Eisenhower Matrix View */}
      {viewMode === 'eisenhower' && (
        <div className="grid grid-cols-2 gap-3">
          {QUADRANT_OPTIONS.map((quad) => {
            const quadTasks = (allTasks ?? []).filter(t => t.eisenhowerQuadrant === quad);
            return (
              <div key={quad} className={`rounded-xl border p-4 min-h-[200px] ${QUADRANT_COLORS[quad]}`}>
                <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                  {QUADRANT_LABELS[quad]}
                </h3>
                <div className="space-y-2">
                  {quadTasks.map((task) => (
                    <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} compact />
                  ))}
                  {quadTasks.length === 0 && (
                    <p className="text-xs text-[var(--text-muted)]">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Add New Task</h2>
              <button onClick={() => setShowCreate(false)} className="text-[var(--text-secondary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Task Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details..."
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof PRIORITY_OPTIONS[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Eisenhower</label>
                  <select
                    value={eisenhower}
                    onChange={(e) => setEisenhower(e.target.value as typeof QUADRANT_OPTIONS[number])}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-ascend-500 focus:outline-none"
                  >
                    <option value="">None</option>
                    {QUADRANT_OPTIONS.map((q) => (
                      <option key={q} value={q}>{QUADRANT_LABELS[q]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Est. Minutes</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                    placeholder="30"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
                  />
                </div>
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
                  {creating ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, compact }: {
  task: any;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}) {
  const isDone = task.status === 'done';

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className={`group flex items-center gap-3 rounded-xl ${compact ? 'p-2' : 'p-3 border border-[var(--border)] bg-[var(--surface)]'} transition-colors hover:bg-[var(--surface-hover)]`}>
      <button onClick={() => onToggle(task._id)} className="shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-[var(--text-secondary)] hover:text-ascend-500" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
          {task.title}
        </p>
        {!compact && (
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${priorityColors[task.priority] || priorityColors.low}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-secondary)]">
                <Clock className="h-2.5 w-2.5" /> {task.dueDate}
              </span>
            )}
            {task.xpValue && (
              <span className="flex items-center gap-0.5 text-[10px] text-ascend-500">
                <Zap className="h-2.5 w-2.5" /> {task.xpValue} XP
              </span>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-400 transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
