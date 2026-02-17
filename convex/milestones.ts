// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Milestones Engine (Convex)
// Goal decomposition intermediate steps — CLIMB Framework Module 2
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

const milestoneDoc = v.object({
  _id: v.id('milestones'),
  _creationTime: v.number(),
  userId: v.id('users'),
  goalId: v.id('goals'),
  title: v.string(),
  description: v.optional(v.string()),
  sequenceOrder: v.number(),
  targetDate: v.optional(v.string()),
  completedDate: v.optional(v.number()),
  status: v.union(
    v.literal('not_started'),
    v.literal('in_progress'),
    v.literal('completed'),
    v.literal('skipped')
  ),
  progressPercentage: v.number(),
  completionCriteria: v.optional(v.array(v.string())),
  tags: v.optional(v.array(v.string())),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE MILESTONE
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    goalId: v.id('goals'),
    title: v.string(),
    description: v.optional(v.string()),
    sequenceOrder: v.number(),
    targetDate: v.optional(v.string()),
    completionCriteria: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('milestones'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Verify goal belongs to user
    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    return await ctx.db.insert('milestones', {
      userId: user._id,
      goalId: args.goalId,
      title: args.title,
      description: args.description,
      sequenceOrder: args.sequenceOrder,
      targetDate: args.targetDate,
      status: 'not_started',
      progressPercentage: 0,
      completionCriteria: args.completionCriteria,
      tags: args.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// BULK CREATE (from AI decomposition)
// ─────────────────────────────────────────────────────────────────────────────
export const bulkCreate = mutation({
  args: {
    goalId: v.id('goals'),
    milestones: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        sequenceOrder: v.number(),
        targetDate: v.optional(v.string()),
        completionCriteria: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
      })
    ),
  },
  returns: v.array(v.id('milestones')),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    const ids = [];
    for (const ms of args.milestones) {
      const id = await ctx.db.insert('milestones', {
        userId: user._id,
        goalId: args.goalId,
        title: ms.title,
        description: ms.description,
        sequenceOrder: ms.sequenceOrder,
        targetDate: ms.targetDate,
        status: 'not_started',
        progressPercentage: 0,
        completionCriteria: ms.completionCriteria,
        tags: ms.tags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      ids.push(id);
    }

    // Mark goal decomposition as completed
    await ctx.db.patch(args.goalId, {
      decompositionStatus: 'completed',
      progressType: 'milestones',
      updatedAt: Date.now(),
    });

    return ids;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST MILESTONES BY GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const listByGoal = query({
  args: { goalId: v.id('goals') },
  returns: v.array(milestoneDoc),
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);

    const milestones = await ctx.db
      .query('milestones')
      .withIndex('by_goalId', (q: any) => q.eq('goalId', goalId))
      .collect();

    // Verify they belong to the user
    return milestones.filter((ms) => ms.userId === user._id);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE MILESTONE
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    milestoneId: v.id('milestones'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('not_started'),
        v.literal('in_progress'),
        v.literal('completed'),
        v.literal('skipped')
      )
    ),
    progressPercentage: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    completionCriteria: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, { milestoneId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const milestone = await ctx.db.get(milestoneId);
    if (!milestone || milestone.userId !== user._id) throw new Error('Milestone not found');

    const patchData: any = {
      ...updates,
      updatedAt: Date.now(),
    };

    if (updates.status === 'completed') {
      patchData.completedDate = Date.now();
      patchData.progressPercentage = 100;
    }

    await ctx.db.patch(milestoneId, patchData);

    // If completing, recalculate goal progress based on milestones
    if (updates.status === 'completed') {
      const allMilestones = await ctx.db
        .query('milestones')
        .withIndex('by_goalId', (q: any) => q.eq('goalId', milestone.goalId))
        .collect();

      const completedCount = allMilestones.filter(
        (ms) => ms.status === 'completed' || ms._id === milestoneId
      ).length;

      const progress = Math.round((completedCount / allMilestones.length) * 100);

      await ctx.db.patch(milestone.goalId, {
        progress,
        status: progress >= 100 ? 'completed' : 'in_progress',
        completionDate: progress >= 100 ? Date.now() : undefined,
        updatedAt: Date.now(),
      });

      // Award XP for milestone completion
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        const xpGain = 50; // 50 XP per milestone
        await ctx.db.patch(gamification._id, {
          totalXP: gamification.totalXP + xpGain,
          updatedAt: Date.now(),
        });

        // Log XP event
        await ctx.db.insert('xpHistory', {
          userId: user._id,
          amount: xpGain,
          source: 'milestone_complete',
          description: `Completed milestone: ${milestone.title}`,
          createdAt: Date.now(),
        });
      }
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE MILESTONE
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { milestoneId: v.id('milestones') },
  returns: v.null(),
  handler: async (ctx, { milestoneId }) => {
    const user = await getAuthUser(ctx);
    const milestone = await ctx.db.get(milestoneId);
    if (!milestone || milestone.userId !== user._id) throw new Error('Milestone not found');

    await ctx.db.delete(milestoneId);
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET NEXT MILESTONE (for dashboard)
// ─────────────────────────────────────────────────────────────────────────────
export const getNextForGoal = query({
  args: { goalId: v.id('goals') },
  returns: v.union(milestoneDoc, v.null()),
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);

    const milestones = await ctx.db
      .query('milestones')
      .withIndex('by_goalId', (q: any) => q.eq('goalId', goalId))
      .collect();

    const userMilestones = milestones.filter((ms) => ms.userId === user._id);
    const next = userMilestones
      .filter((ms) => ms.status !== 'completed' && ms.status !== 'skipped')
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    return next[0] ?? null;
  },
});
