// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Daily Plans Engine (Convex)
// Morning intentions, time blocking, evening reflections — Module 5
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

const dailyPlanDoc = v.object({
  _id: v.id('dailyPlans'),
  _creationTime: v.number(),
  userId: v.id('users'),
  date: v.string(),
  intention: v.optional(v.string()),
  topPriorities: v.optional(v.array(v.string())),
  timeBlocks: v.optional(v.array(v.object({
    id: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    title: v.string(),
    type: v.union(
      v.literal('deep_work'),
      v.literal('shallow_work'),
      v.literal('meeting'),
      v.literal('break'),
      v.literal('personal'),
      v.literal('exercise'),
      v.literal('routine')
    ),
    taskId: v.optional(v.id('tasks')),
    completed: v.optional(v.boolean()),
  }))),
  dailyScore: v.optional(v.number()),
  tasksCompletedCount: v.optional(v.number()),
  tasksTotalCount: v.optional(v.number()),
  habitsCompletedCount: v.optional(v.number()),
  habitsTotalCount: v.optional(v.number()),
  focusMinutes: v.optional(v.number()),
  reflection: v.optional(v.string()),
  gratitude: v.optional(v.array(v.string())),
  tomorrowPlan: v.optional(v.string()),
  dayRating: v.optional(v.number()),
  morningCompletedAt: v.optional(v.number()),
  eveningCompletedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// GET OR CREATE TODAY'S PLAN
// ─────────────────────────────────────────────────────────────────────────────
export const getOrCreateToday = mutation({
  args: { date: v.string() },
  returns: dailyPlanDoc,
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);

    const existing = await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique();

    if (existing) return existing;

    const id = await ctx.db.insert('dailyPlans', {
      userId: user._id,
      date,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const created = await ctx.db.get(id);
    return created!;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET PLAN BY DATE
// ─────────────────────────────────────────────────────────────────────────────
export const getByDate = query({
  args: { date: v.string() },
  returns: v.union(dailyPlanDoc, v.null()),
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SET MORNING INTENTION
// ─────────────────────────────────────────────────────────────────────────────
export const setMorningIntention = mutation({
  args: {
    planId: v.id('dailyPlans'),
    intention: v.string(),
    topPriorities: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, { planId, intention, topPriorities }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      intention,
      topPriorities,
      morningCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE TIME BLOCKS
// ─────────────────────────────────────────────────────────────────────────────
export const updateTimeBlocks = mutation({
  args: {
    planId: v.id('dailyPlans'),
    timeBlocks: v.array(v.object({
      id: v.string(),
      startTime: v.string(),
      endTime: v.string(),
      title: v.string(),
      type: v.union(
        v.literal('deep_work'),
        v.literal('shallow_work'),
        v.literal('meeting'),
        v.literal('break'),
        v.literal('personal'),
        v.literal('exercise'),
        v.literal('routine')
      ),
      taskId: v.optional(v.id('tasks')),
      completed: v.optional(v.boolean()),
    })),
  },
  returns: v.null(),
  handler: async (ctx, { planId, timeBlocks }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      timeBlocks,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SET EVENING REFLECTION
// ─────────────────────────────────────────────────────────────────────────────
export const setEveningReflection = mutation({
  args: {
    planId: v.id('dailyPlans'),
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowPlan: v.optional(v.string()),
    dayRating: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { planId, ...fields }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      ...fields,
      eveningCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Award XP for completing evening reflection
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const xpGain = 15;
      await ctx.db.patch(gamification._id, {
        totalXP: gamification.totalXP + xpGain,
        updatedAt: Date.now(),
      });

      await ctx.db.insert('xpHistory', {
        userId: user._id,
        amount: xpGain,
        source: 'daily_login',
        description: 'Completed evening reflection',
        createdAt: Date.now(),
      });
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE DAILY SCORE
// ─────────────────────────────────────────────────────────────────────────────
export const updateDailyScore = mutation({
  args: {
    planId: v.id('dailyPlans'),
    dailyScore: v.number(),
    tasksCompletedCount: v.optional(v.number()),
    tasksTotalCount: v.optional(v.number()),
    habitsCompletedCount: v.optional(v.number()),
    habitsTotalCount: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { planId, ...scores }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      ...scores,
      updatedAt: Date.now(),
    });

    // Check for Perfect Day achievement
    if (scores.dailyScore && scores.dailyScore >= 95) {
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        await ctx.db.patch(gamification._id, {
          totalXP: gamification.totalXP + 25,
          updatedAt: Date.now(),
        });

        await ctx.db.insert('xpHistory', {
          userId: user._id,
          amount: 25,
          source: 'perfect_day',
          description: 'Perfect Day! Score 95%+',
          createdAt: Date.now(),
        });
      }
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST RECENT PLANS
// ─────────────────────────────────────────────────────────────────────────────
export const listRecent = query({
  args: { days: v.optional(v.number()) },
  returns: v.array(dailyPlanDoc),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);

    const plans = await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return days ? plans.slice(0, days) : plans;
  },
});
