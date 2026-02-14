// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Habit Stacks (Convex)
// "After I [cue habit], I will [new habit]" — Atomic Habits stacking
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
// CREATE STACK
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    name: v.string(),
    habitIds: v.array(v.id('habits')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('habitStacks', {
      userId: user._id,
      name: args.name,
      habitIds: args.habitIds,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST STACKS
// ─────────────────────────────────────────────────────────────────────────────
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('habitStacks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE STACK
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    stackId: v.id('habitStacks'),
    name: v.optional(v.string()),
    habitIds: v.optional(v.array(v.id('habits'))),
  },
  handler: async (ctx, { stackId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const stack = await ctx.db.get(stackId);
    if (!stack || stack.userId !== user._id) throw new Error('Stack not found');

    await ctx.db.patch(stackId, updates);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE STACK
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { stackId: v.id('habitStacks') },
  handler: async (ctx, { stackId }) => {
    const user = await getAuthUser(ctx);
    const stack = await ctx.db.get(stackId);
    if (!stack || stack.userId !== user._id) throw new Error('Stack not found');

    await ctx.db.delete(stackId);
  },
});
