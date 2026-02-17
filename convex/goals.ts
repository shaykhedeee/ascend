// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Goals Engine (Convex)
// Hierarchical goals with AI decomposition support
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const PLAN_LIMITS = {
  free: { maxGoals: 3 },
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
// CREATE GOAL (enhanced with decomposition fields)
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    targetDate: v.optional(v.string()),
    startDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    goalType: v.optional(v.union(
      v.literal('achievement'), v.literal('transformation'), v.literal('skill'),
      v.literal('project'), v.literal('quantitative'), v.literal('maintenance'),
      v.literal('elimination'), v.literal('relationship')
    )),
    lifeDomain: v.optional(v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    )),
    deadlineType: v.optional(v.union(v.literal('fixed'), v.literal('flexible'), v.literal('ongoing'))),
    whyImportant: v.optional(v.string()),
    successCriteria: v.optional(v.array(v.string())),
    difficultyLevel: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    targetValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    parentGoalId: v.optional(v.id('goals')),
    visionConnection: v.optional(v.string()),
  },
  returns: v.id('goals'),
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
      startDate: args.startDate,
      identityLabel: args.identityLabel,
      goalType: args.goalType,
      lifeDomain: args.lifeDomain,
      deadlineType: args.deadlineType,
      whyImportant: args.whyImportant,
      successCriteria: args.successCriteria,
      difficultyLevel: args.difficultyLevel,
      estimatedHours: args.estimatedHours,
      targetValue: args.targetValue,
      currentValue: args.targetValue ? 0 : undefined,
      unit: args.unit,
      color: args.color,
      icon: args.icon,
      tags: args.tags,
      parentGoalId: args.parentGoalId,
      visionConnection: args.visionConnection,
      decompositionStatus: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Shared goal document return validator
const goalDocValidator = v.object({
  _id: v.id('goals'),
  _creationTime: v.number(),
  userId: v.id('users'),
  title: v.string(),
  description: v.optional(v.string()),
  category: v.string(),
  status: v.union(
    v.literal('in_progress'),
    v.literal('completed'),
    v.literal('paused'),
    v.literal('abandoned'),
    v.literal('draft')
  ),
  progress: v.number(),
  targetDate: v.optional(v.string()),
  startDate: v.optional(v.string()),
  completionDate: v.optional(v.number()),
  identityLabel: v.optional(v.string()),
  aiPlan: v.optional(v.any()),
  goalType: v.optional(v.union(
    v.literal('achievement'), v.literal('transformation'), v.literal('skill'),
    v.literal('project'), v.literal('quantitative'), v.literal('maintenance'),
    v.literal('elimination'), v.literal('relationship')
  )),
  lifeDomain: v.optional(v.union(
    v.literal('health'), v.literal('career'), v.literal('finance'),
    v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
    v.literal('mindfulness'), v.literal('personal_growth')
  )),
  deadlineType: v.optional(v.union(v.literal('fixed'), v.literal('flexible'), v.literal('ongoing'))),
  progressType: v.optional(v.union(v.literal('percentage'), v.literal('milestones'), v.literal('numeric_target'))),
  targetValue: v.optional(v.number()),
  currentValue: v.optional(v.number()),
  unit: v.optional(v.string()),
  decompositionStatus: v.optional(v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'))),
  aiConfidenceScore: v.optional(v.number()),
  whyImportant: v.optional(v.string()),
  successCriteria: v.optional(v.array(v.string())),
  rewards: v.optional(v.array(v.string())),
  difficultyLevel: v.optional(v.number()),
  estimatedHours: v.optional(v.number()),
  parentGoalId: v.optional(v.id('goals')),
  tags: v.optional(v.array(v.string())),
  color: v.optional(v.string()),
  icon: v.optional(v.string()),
  visionConnection: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ACTIVE GOALS
// ─────────────────────────────────────────────────────────────────────────────
export const listActive = query({
  args: {},
  returns: v.array(goalDocValidator),
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
  returns: v.array(goalDocValidator),
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
        v.literal('abandoned'),
        v.literal('draft')
      )
    ),
    progress: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    startDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    aiPlan: v.optional(v.any()),
    goalType: v.optional(v.union(
      v.literal('achievement'), v.literal('transformation'), v.literal('skill'),
      v.literal('project'), v.literal('quantitative'), v.literal('maintenance'),
      v.literal('elimination'), v.literal('relationship')
    )),
    lifeDomain: v.optional(v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    )),
    deadlineType: v.optional(v.union(v.literal('fixed'), v.literal('flexible'), v.literal('ongoing'))),
    progressType: v.optional(v.union(v.literal('percentage'), v.literal('milestones'), v.literal('numeric_target'))),
    targetValue: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    whyImportant: v.optional(v.string()),
    successCriteria: v.optional(v.array(v.string())),
    rewards: v.optional(v.array(v.string())),
    difficultyLevel: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    visionConnection: v.optional(v.string()),
    decompositionStatus: v.optional(v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'))),
    aiConfidenceScore: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    const patchData: any = { ...updates, updatedAt: Date.now() };

    // Auto-set completionDate when goal is completed
    if (updates.status === 'completed' && goal.status !== 'completed') {
      patchData.completionDate = Date.now();
    }

    await ctx.db.patch(goalId, patchData);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { goalId: v.id('goals') },
  returns: v.null(),
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
    aiConfidenceScore: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, aiPlan, aiConfidenceScore }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.patch(goalId, {
      aiPlan,
      aiConfidenceScore,
      decompositionStatus: 'completed',
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE GOAL (with full details)
// ─────────────────────────────────────────────────────────────────────────────
export const getById = query({
  args: { goalId: v.id('goals') },
  returns: v.union(goalDocValidator, v.null()),
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) return null;
    return goal;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST GOALS BY DOMAIN
// ─────────────────────────────────────────────────────────────────────────────
export const listByDomain = query({
  args: {
    lifeDomain: v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    ),
  },
  returns: v.array(goalDocValidator),
  handler: async (ctx, { lifeDomain }) => {
    const user = await getAuthUser(ctx);
    const allGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
    return allGoals.filter((g: any) => g.lifeDomain === lifeDomain);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE GOAL PROGRESS (numeric/quantitative goals)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProgress = mutation({
  args: {
    goalId: v.id('goals'),
    currentValue: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, currentValue }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    const patchData: any = { currentValue, updatedAt: Date.now() };

    // Auto-calculate percentage progress for numeric goals
    if (goal.targetValue && goal.targetValue > 0) {
      patchData.progress = Math.min(100, Math.round((currentValue / goal.targetValue) * 100));
    }

    // Auto-complete when target reached
    if (goal.targetValue && currentValue >= goal.targetValue && goal.status === 'in_progress') {
      patchData.status = 'completed';
      patchData.completionDate = Date.now();
    }

    await ctx.db.patch(goalId, patchData);
  },
});
