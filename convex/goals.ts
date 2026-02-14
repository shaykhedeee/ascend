// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Goals Engine (Convex)
// Hierarchical goals with AI decomposition support
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const PLAN_LIMITS = {
  free: { maxGoals: 1 },
  pro: { maxGoals: Infinity },
  lifetime: { maxGoals: Infinity },
} as const;

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
// CREATE GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    targetDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Enforce plan limits
    const activeGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'in_progress')
      )
      .collect();

    const userPlan = (user.plan as keyof typeof PLAN_LIMITS) ?? 'free';
    const limit = PLAN_LIMITS[userPlan].maxGoals;
    if (activeGoals.length >= limit) {
      throw new Error(
        `Plan limit reached: ${user.plan} plan allows ${limit} active goals. Upgrade to Pro for unlimited.`
      );
    }

    return await ctx.db.insert('goals', {
      userId: user._id,
      title: args.title,
      description: args.description,
      category: args.category,
      status: 'in_progress',
      progress: 0,
      targetDate: args.targetDate,
      identityLabel: args.identityLabel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ACTIVE GOALS
// ─────────────────────────────────────────────────────────────────────────────
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'in_progress')
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL GOALS
// ─────────────────────────────────────────────────────────────────────────────
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('goals')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    goalId: v.id('goals'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('in_progress'),
        v.literal('completed'),
        v.literal('paused'),
        v.literal('abandoned')
      )
    ),
    progress: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    aiPlan: v.optional(v.any()),
  },
  handler: async (ctx, { goalId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.patch(goalId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { goalId: v.id('goals') },
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.delete(goalId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// STORE AI DECOMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export const storeAIPlan = mutation({
  args: {
    goalId: v.id('goals'),
    aiPlan: v.any(),
  },
  handler: async (ctx, { goalId, aiPlan }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.patch(goalId, {
      aiPlan,
      updatedAt: Date.now(),
    });
  },
});
