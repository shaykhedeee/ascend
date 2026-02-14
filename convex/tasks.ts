// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Tasks Engine (Convex)
// TickTick-style task management with subtasks and lists
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found');
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE TASK
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('urgent')
    ),
    dueDate: v.optional(v.string()),
    dueTime: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    listId: v.optional(v.id('taskLists')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('tasks', {
      userId: user._id,
      listId: args.listId,
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: 'todo',
      dueDate: args.dueDate,
      dueTime: args.dueTime,
      estimatedMinutes: args.estimatedMinutes,
      tags: args.tags,
      subtasks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST TASKS
// ─────────────────────────────────────────────────────────────────────────────
export const list = query({
  args: {
    status: v.optional(v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done'))),
  },
  handler: async (ctx, { status }) => {
    const user = await getAuthUser(ctx);

    if (status) {
      return await ctx.db
        .query('tasks')
        .withIndex('by_userId_status', (q: any) =>
          q.eq('userId', user._id).eq('status', status)
        )
        .collect();
    }

    return await ctx.db
      .query('tasks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE TASK COMPLETE
// ─────────────────────────────────────────────────────────────────────────────
export const toggleComplete = mutation({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    const task = await ctx.db.get(taskId);
    if (!task || task.userId !== user._id) throw new Error('Task not found');

    const newStatus = task.status === 'done' ? 'todo' : 'done';

    await ctx.db.patch(taskId, {
      status: newStatus,
      completedAt: newStatus === 'done' ? Date.now() : undefined,
      updatedAt: Date.now(),
    });

    // Award XP for completion
    if (newStatus === 'done') {
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        const xpGain = task.priority === 'urgent' ? 20 : task.priority === 'high' ? 15 : 10;
        await ctx.db.patch(gamification._id, {
          totalXP: gamification.totalXP + xpGain,
          level: Math.floor((gamification.totalXP + xpGain) / 100) + 1,
          updatedAt: Date.now(),
        });
      }
    }

    return { status: newStatus };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE TASK
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    taskId: v.id('tasks'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent'))
    ),
    status: v.optional(v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done'))),
    dueDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    subtasks: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          completed: v.boolean(),
        })
      )
    ),
  },
  handler: async (ctx, { taskId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const task = await ctx.db.get(taskId);
    if (!task || task.userId !== user._id) throw new Error('Task not found');

    await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    const task = await ctx.db.get(taskId);
    if (!task || task.userId !== user._id) throw new Error('Task not found');

    await ctx.db.delete(taskId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TASK LISTS (CRUD)
// ─────────────────────────────────────────────────────────────────────────────
export const createList = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('taskLists', {
      userId: user._id,
      name: args.name,
      color: args.color,
      icon: args.icon,
      createdAt: Date.now(),
    });
  },
});

export const getLists = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('taskLists')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});
